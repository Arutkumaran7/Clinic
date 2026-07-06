import { Router } from 'express';
import { prisma } from '../db';
import { AvailabilityService } from '../services/availability.service';
import { AppointmentService } from '../services/appointment.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateDoctorToken, JWT_SECRET, AuthenticatedRequest } from '../middleware/auth.middleware';
import nodemailer from 'nodemailer';

export const apiRouter = Router();

const availabilityService = new AvailabilityService();
const appointmentService = new AppointmentService();

// 1. Doctors Routes
apiRouter.get('/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    // Map availableSlotsRaw JSON string to availableSlots array with robust fallback
    const mappedDoctors = doctors.map(doc => {
      let availableSlots: string[] = [];
      try {
        availableSlots = doc.availableSlotsRaw ? JSON.parse(doc.availableSlotsRaw) : [];
      } catch (e) {
        console.error(`Failed to parse availableSlotsRaw for doctor ${doc.id}:`, e);
        availableSlots = doc.availableSlotsRaw
          ? doc.availableSlotsRaw.split(',').map(s => s.trim()).filter(Boolean)
          : [];
      }
      return {
        ...doc,
        availableSlots
      };
    });
    res.json(mappedDoctors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/doctors/:id/slots', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });
    }

    const slots = await availabilityService.getAvailableSlots(doctorId, date);
    res.json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Appointments Routes
apiRouter.get('/appointments', async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointments();
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/appointments', async (req, res) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.patch('/appointments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await appointmentService.updateAppointmentStatus(id, status);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Patients Routes
apiRouter.get('/patients', async (req, res) => {
  try {
    const patients = await prisma.patientRecord.findMany({
      orderBy: { name: 'asc' }
    });
    // Map conditionsRaw JSON string to conditions array with robust fallback
    const mappedPatients = patients.map(p => {
      let conditions: string[] = [];
      try {
        conditions = p.conditionsRaw ? JSON.parse(p.conditionsRaw) : [];
      } catch (e) {
        console.error(`Failed to parse conditionsRaw for patient ${p.id}:`, e);
        conditions = p.conditionsRaw
          ? p.conditionsRaw.split(',').map(c => c.trim()).filter(Boolean)
          : [];
      }
      return {
        ...p,
        conditions
      };
    });
    res.json(mappedPatients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/patients', async (req, res) => {
  try {
    const { name, gender, age, email, phone, bloodType, conditions, notes } = req.body;
    const idNum = Math.floor(10000 + Math.random() * 90000);
    const patientId = `MC-${idNum}`;

    const newPatient = await prisma.patientRecord.create({
      data: {
        id: `pat-staff-${Date.now()}-${idNum}`,
        name,
        patientId,
        lastVisit: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ACTIVE',
        avatarColor: 'bg-blue-100 text-blue-700',
        gender: gender || 'Undisclosed',
        age: parseInt(age) || 35,
        email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        phone: phone || '',
        bloodType: bloodType || 'Unknown',
        conditionsRaw: JSON.stringify(conditions || []),
        notes: notes || ''
      }
    });

    res.status(201).json({
      ...newPatient,
      conditions: JSON.parse(newPatient.conditionsRaw)
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.patch('/patients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { notes, status } = req.body;
    
    const updated = await prisma.patientRecord.update({
      where: { id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(status !== undefined && { status })
      }
    });

    res.json({
      ...updated,
      conditions: JSON.parse(updated.conditionsRaw)
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 4. FAQs Route
apiRouter.get('/faqs', async (req, res) => {
  try {
    const faqs = await prisma.fAQItem.findMany();
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 5. DOCTOR AUTHENTICATION & SEGREGATED ROUTING ====================

// Doctor Login
apiRouter.post('/auth/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!doctor) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, doctor.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, name: doctor.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        title: doctor.title,
        specialty: doctor.specialty,
        imageUrl: doctor.imageUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Authenticated Doctor Profile
apiRouter.get('/doctor/profile', authenticateDoctorToken as any, async (req: any, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.doctor.id }
    });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    const { passwordHash, ...safeDoctor } = doctor;
    res.json(safeDoctor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Authenticated Segregated Doctor Appointments
apiRouter.get('/doctor/appointments', authenticateDoctorToken as any, async (req: any, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: req.doctor.id }
    });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Doctor Appointment Status / Room / Notes
apiRouter.patch('/doctor/appointments/:id', authenticateDoctorToken as any, async (req: any, res) => {
  try {
    const id = req.params.id;
    const { status, room } = req.body;

    // Verify ownership
    const apt = await prisma.appointment.findFirst({
      where: { id, doctorId: req.doctor.id }
    });

    if (!apt) {
      return res.status(403).json({ error: 'Access denied or appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(room !== undefined && { room })
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Send Support / Enquiry Email
apiRouter.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, priority, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const recipient = 'arutkumaran19@gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

    console.log(`[Contact Submission Recieved]`);
    console.log(`- From: ${name} (${email})`);
    console.log(`- Subject: ${subject} [Priority: ${priority}]`);
    console.log(`- Message: ${message}`);

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: recipient,
        subject: `[MedCore Support] ${subject} (${priority})`,
        text: `Name: ${name}\nEmail: ${email}\nPriority: ${priority}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h3>MedCore Support Enquiry</h3>
          <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; color: #555;">
            ${message.replace(/\n/g, '<br/>')}
          </blockquote>
        `
      });

      console.log(`- Status: Real email sent to ${recipient} successfully.`);
      res.json({ success: true, message: 'Email sent successfully!' });
    } else {
      console.log(`- Status: Simulated. Set SMTP_USER and SMTP_PASS in .env to send real emails.`);
      res.json({ 
        success: true, 
        simulated: true, 
        message: 'Message registered successfully. To receive real emails in your inbox, configure SMTP_USER and SMTP_PASS in your .env file.' 
      });
    }
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ error: `Inquiry registered, but email delivery failed: ${error.message}` });
  }
});

