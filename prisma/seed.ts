import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10;
const HASHED_PASSWORD = bcrypt.hashSync('doctor123', saltRounds);

const INITIAL_DOCTORS = [
  {
    id: 'dr-1',
    name: 'Dr. Rajesh Malhotra',
    email: 'rajesh@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Senior Cardiologist',
    rating: 4.9,
    experience: 15,
    reviews: 124,
    description: 'Specializing in advanced cardiovascular diagnostics, interventional cardiology, and minimally invasive heart procedures.',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Cardiology',
    department: 'Cardiology Clinic',
    availableSlots: ['09:00 AM', '09:45 AM', '11:15 AM', '12:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:45 PM']
  },
  {
    id: 'dr-2',
    name: 'Dr. Anjali Mehta',
    email: 'anjali@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Pediatric Surgeon',
    rating: 4.8,
    experience: 12,
    reviews: 89,
    description: 'Dedicated to providing compassionate, child-friendly surgical care for infants, kids, and young adults.',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Pediatrics',
    department: 'Pediatric Surgery',
    availableSlots: ['09:30 AM', '10:15 AM', '11:00 AM', '01:30 PM', '02:15 PM', '03:00 PM']
  },
  {
    id: 'dr-3',
    name: 'Dr. Vikram Seth',
    email: 'vikram@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Neurological Specialist',
    rating: 5.0,
    experience: 20,
    reviews: 210,
    description: 'Expert in neurodegenerative disorders, stroke management, and complex spinal wellness plans.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Neurology',
    department: 'Neuroscience Center',
    availableSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'dr-4',
    name: 'Dr. Priya Sharma',
    email: 'priya@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Consultant Dermatologist',
    rating: 4.7,
    experience: 8,
    reviews: 156,
    description: 'Specializing in clinical and cosmetic dermatology, acne treatment, skin cancer screening, and laser therapies.',
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Dermatology',
    department: 'Dermatology Wing',
    availableSlots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:45 PM']
  },
  {
    id: 'dr-5',
    name: 'Dr. Kabir Ramachandran',
    email: 'kabir@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Orthopedic Surgeon',
    rating: 4.9,
    experience: 18,
    reviews: 342,
    description: 'Expert in joint replacements, sports injury medicine, and complex fracture care with a focus on quick recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Orthopedics',
    department: 'Orthopedic & Joint Center',
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM']
  },
  {
    id: 'dr-6',
    name: 'Dr. Sunita Sen',
    email: 'sunita@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Endocrinologist',
    rating: 4.6,
    experience: 10,
    reviews: 75,
    description: 'Specializing in advanced diabetes management, thyroid disorders, and lifestyle-related endocrine care.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Endocrinology',
    department: 'Metabolic Health',
    availableSlots: ['09:00 AM', '10:30 AM', '11:15 AM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'dr-7',
    name: 'Dr. Amitav Ghosh',
    email: 'amitav@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Oncologist',
    rating: 4.9,
    experience: 22,
    reviews: 412,
    description: 'Leading expert in immunotherapy, systemic oncology therapies, and personalized cancer treatments.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Oncology',
    department: 'Cancer Research Center',
    availableSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '03:30 PM']
  },
  {
    id: 'dr-8',
    name: 'Dr. Meera Nair',
    email: 'meera@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Gastroenterologist',
    rating: 4.8,
    experience: 14,
    reviews: 118,
    description: 'Specializing in digestive tract health, liver diseases, and therapeutic endoscopic procedures.',
    imageUrl: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Gastroenterology',
    department: 'Digestive Health',
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'dr-9',
    name: 'Dr. Devendra Shastri',
    email: 'devendra@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Consultant Psychiatrist',
    rating: 4.7,
    experience: 11,
    reviews: 94,
    description: 'Focused on stress management, cognitive wellness, anxiety disorders, and therapy integrations.',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-64c382817dea?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Psychiatry',
    department: 'Behavioral Health',
    availableSlots: ['09:15 AM', '10:15 AM', '11:15 AM', '01:15 PM', '02:15 PM', '03:15 PM']
  },
  {
    id: 'dr-10',
    name: 'Dr. Kavitha Krishnan',
    email: 'kavitha@medcore.in',
    passwordHash: HASHED_PASSWORD,
    title: 'Ophthalmologist',
    rating: 4.9,
    experience: 16,
    reviews: 182,
    description: 'Expert in refractive vision correction, advanced cataract microsurgeries, and comprehensive eye health.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Ophthalmology',
    department: 'Eye Institute',
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-c1',
    doctorId: 'dr-1',
    doctorName: 'Dr. Rajesh Malhotra',
    patientName: 'Amit Kumar',
    patientId: 'MC-88392',
    date: '2026-06-25',
    time: '09:00 AM',
    type: 'In-Person',
    reason: 'Routine ECG Follow-up',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-c2',
    doctorId: 'dr-4',
    doctorName: 'Dr. Priya Sharma',
    patientName: 'Pooja Patel',
    patientId: 'MC-44510',
    date: '2026-06-26',
    time: '02:30 PM',
    type: 'Virtual',
    reason: 'Skin Allergies Telehealth',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-c3',
    doctorId: 'dr-5',
    doctorName: 'Dr. Kabir Ramachandran',
    patientName: 'Rahul Sharma',
    patientId: 'MC-11029',
    date: '2026-06-28',
    time: '10:00 AM',
    type: 'In-Person',
    reason: 'Knee Post-Op Check',
    status: 'URGENT'
  },
  {
    id: 'apt-c4',
    doctorId: 'dr-1',
    doctorName: 'Dr. Rajesh Malhotra',
    patientName: 'Amit Kumar',
    patientId: 'MC-88392',
    date: '2026-06-30',
    time: '08:30 AM',
    type: 'In-Person',
    reason: 'Hypertension Follow-up',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-c5',
    doctorId: 'dr-2',
    doctorName: 'Dr. Anjali Mehta',
    patientName: 'Pooja Patel',
    patientId: 'MC-44510',
    date: '2026-06-30',
    time: '11:00 AM',
    type: 'In-Person',
    reason: 'Childhood Vaccination',
    status: 'URGENT'
  },
  {
    id: 'apt-c6',
    doctorId: 'dr-3',
    doctorName: 'Dr. Vikram Seth',
    patientName: 'Rahul Sharma',
    patientId: 'MC-11029',
    date: '2026-07-02',
    time: '03:00 PM',
    type: 'In-Person',
    reason: 'Migraine Assessment',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-today-1',
    doctorId: 'dr-1',
    doctorName: 'Dr. Rajesh Malhotra',
    patientName: 'Amit Kumar',
    patientId: 'MC-88392',
    date: '2026-06-30',
    time: '08:30 AM',
    type: 'In-Person',
    reason: 'Hypertension Follow-up',
    status: 'CONFIRMED',
    room: 'Room 101'
  },
  {
    id: 'apt-today-2',
    doctorId: 'dr-2',
    doctorName: 'Dr. Anjali Mehta',
    patientName: 'Pooja Patel',
    patientId: 'MC-44510',
    date: '2026-06-30',
    time: '11:00 AM',
    type: 'In-Person',
    reason: 'Childhood Vaccination',
    status: 'URGENT',
    room: 'Room 402'
  },
  {
    id: 'apt-today-3',
    doctorId: 'dr-5',
    doctorName: 'Dr. Kabir Ramachandran',
    patientName: 'Sanjay Dutt',
    patientId: 'MC-11822',
    date: '2026-06-30',
    time: '01:45 PM',
    type: 'In-Person',
    reason: 'Joint Stiffness Evaluation',
    status: 'PENDING',
    room: 'Desk 2'
  },
  {
    id: 'apt-today-4',
    doctorId: 'dr-4',
    doctorName: 'Dr. Priya Sharma',
    patientName: 'Neha Deshmukh',
    patientId: 'MC-99201',
    date: '2026-06-30',
    time: '03:00 PM',
    type: 'Virtual',
    reason: 'Acne Scars Telehealth Review',
    status: 'CONFIRMED',
    room: 'Tele-Room B'
  }
];

const INITIAL_PATIENT_RECORDS = [
  {
    id: 'pat-1',
    name: 'Amit Kumar',
    patientId: 'MC-88392',
    lastVisit: 'Jun 30, 2026',
    status: 'ACTIVE',
    avatarColor: 'bg-blue-100 text-blue-700',
    gender: 'Male',
    age: 42,
    email: 'amit.kumar@gmail.com',
    phone: '+91 98765 12029',
    bloodType: 'O-Positive',
    conditions: ['Hypertension', 'High Cholesterol'],
    notes: 'Patient vitals are stable under current medication. Regular walking suggested.'
  },
  {
    id: 'pat-2',
    name: 'Pooja Patel',
    patientId: 'MC-44510',
    lastVisit: 'Jun 30, 2026',
    status: 'FOLLOW-UP',
    avatarColor: 'bg-indigo-100 text-indigo-700',
    gender: 'Female',
    age: 26,
    email: 'pooja.patel@yahoo.in',
    phone: '+91 87654 92011',
    bloodType: 'A-Positive',
    conditions: ['Chronic Migraine', 'Mild Anemia'],
    notes: 'Scheduled for child wellness checks as well as follow-up blood work.'
  },
  {
    id: 'pat-3',
    name: 'Rahul Sharma',
    patientId: 'MC-11029',
    lastVisit: 'Jun 28, 2026',
    status: 'DISCHARGED',
    avatarColor: 'bg-slate-100 text-slate-700',
    gender: 'Male',
    age: 32,
    email: 'rahul.sharma@outlook.in',
    phone: '+91 76543 29381',
    bloodType: 'B-Positive',
    conditions: ['Knee Fracture Recovery', 'Insomnia'],
    notes: 'Post-op knee healing exceptionally well. No further clinical restrictions recommended.'
  },
  {
    id: 'pat-4',
    name: 'Sanjay Dutt',
    patientId: 'MC-11822',
    lastVisit: 'Jun 30, 2026',
    status: 'ACTIVE',
    avatarColor: 'bg-blue-100 text-blue-700',
    gender: 'Male',
    age: 62,
    email: 'sanjay.dutt@example.com',
    phone: '+91 99999 88888',
    bloodType: 'AB-Positive',
    conditions: ['Joint Stiffness'],
    notes: 'Complains of mild osteoarthritis signs. Referred to orthopedics.'
  },
  {
    id: 'pat-5',
    name: 'Neha Deshmukh',
    patientId: 'MC-99201',
    lastVisit: 'Jun 30, 2026',
    status: 'ACTIVE',
    avatarColor: 'bg-indigo-100 text-indigo-700',
    gender: 'Female',
    age: 29,
    email: 'neha.deshmukh@example.com',
    phone: '+91 77777 66666',
    bloodType: 'O-Negative',
    conditions: ['Acne Scars'],
    notes: 'Wants guidance on laser scar revision. Prescribed topical gels.'
  }
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'How do I book a telehealth/virtual appointment?',
    answer: 'To book a virtual appointment, head over to our Available Specialists page, select your preferred expert doctor, click "Book Appointment", and select "Virtual" as your consultation format. Confirm your details to secure your video consultation slot!',
    category: 'Appointments & Booking'
  },
  {
    id: 'faq-2',
    question: 'Are online prescription downloads secure?',
    answer: 'Absolutely. All diagnostic prescriptions, medical advice summaries, and test orders are uploaded securely and sent straight to your verified WhatsApp or email.',
    category: 'General Support'
  },
  {
    id: 'faq-3',
    question: 'Which health insurance policies are accepted?',
    answer: 'MedCore Clinic accepts a major range of Indian corporate and individual healthcare plans including Star Health, HDFC ERGO, ICICI Lombard, Max Bupa, and Tata AIG, alongside Ayushman Bharat PM-JAY support. Our reception handles billing directly.',
    category: 'Billing & Insurance'
  },
  {
    id: 'faq-4',
    question: 'Where is the clinic located, and can I walk in?',
    answer: 'Our main diagnostic clinic is located in Connaught Place, New Delhi, India. While we accommodate emergency cases immediately, we highly recommend booking an appointment online to ensure minimal waiting time.',
    category: 'Prescription Refills'
  }
];

async function main() {
  console.log('Clearing database...');
  await prisma.fAQItem.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientRecord.deleteMany();
  await prisma.doctorLeave.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();

  console.log('Seeding FAQ items...');
  for (const faq of FAQ_ITEMS) {
    await prisma.fAQItem.create({ data: faq });
  }

  console.log('Seeding Patient records...');
  for (const patient of INITIAL_PATIENT_RECORDS) {
    await prisma.patientRecord.create({
      data: {
        id: patient.id,
        name: patient.name,
        patientId: patient.patientId,
        lastVisit: patient.lastVisit,
        status: patient.status,
        avatarColor: patient.avatarColor,
        gender: patient.gender,
        age: patient.age,
        email: patient.email,
        phone: patient.phone,
        bloodType: patient.bloodType,
        conditionsRaw: JSON.stringify(patient.conditions),
        notes: patient.notes
      }
    });
  }

  console.log('Seeding Doctors and weekly schedules...');
  for (const doc of INITIAL_DOCTORS) {
    await prisma.doctor.create({
      data: {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        passwordHash: doc.passwordHash,
        title: doc.title,
        rating: doc.rating,
        experience: doc.experience,
        reviews: doc.reviews,
        description: doc.description,
        imageUrl: doc.imageUrl,
        specialty: doc.specialty,
        department: doc.department,
        availableSlotsRaw: JSON.stringify(doc.availableSlots)
      }
    });

    // Create a default schedule: working Monday (1) through Friday (5)
    // 09:00 AM (09:00) to 05:00 PM (17:00), 45-minute slots
    const slotDuration = doc.id === 'dr-3' || doc.id === 'dr-5' || doc.id === 'dr-7' || doc.id === 'dr-8' || doc.id === 'dr-9' || doc.id === 'dr-10' ? 60 : 45;
    const startHour = doc.id === 'dr-3' ? '08:00' : doc.id === 'dr-7' ? '08:30' : '09:00';
    const endHour = doc.id === 'dr-2' || doc.id === 'dr-5' || doc.id === 'dr-9' ? '16:00' : doc.id === 'dr-7' ? '16:30' : '17:00';

    for (let day = 1; day <= 5; day++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doc.id,
          dayOfWeek: day,
          shiftStart: startHour,
          shiftEnd: endHour,
          slotDurationMinutes: slotDuration
        }
      });
    }
  }

  console.log('Seeding Appointments...');
  for (const apt of INITIAL_APPOINTMENTS) {
    // Determine start and end times in 24h format for database mapping
    // e.g. "09:00 AM" -> start: "09:00", end: "09:45"
    let hour = parseInt(apt.time.split(':')[0]);
    const mins = apt.time.split(':')[1].split(' ')[0];
    const ampm = apt.time.split(' ')[1];
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const start24 = `${pad(hour)}:${mins}`;

    // Add slot duration for end time calculation
    const docId = apt.doctorId;
    const duration = docId === 'dr-3' || docId === 'dr-5' || docId === 'dr-7' || docId === 'dr-8' || docId === 'dr-9' || docId === 'dr-10' ? 60 : 45;
    let endHour = hour;
    let endMins = parseInt(mins) + duration;
    if (endMins >= 60) {
      endHour += Math.floor(endMins / 60);
      endMins = endMins % 60;
    }
    const end24 = `${pad(endHour)}:${pad(endMins)}`;

    await prisma.appointment.create({
      data: {
        id: apt.id,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName,
        patientName: apt.patientName,
        patientId: apt.patientId,
        date: apt.date,
        time: apt.time, // Store the human-readable format as well
        type: apt.type,
        reason: apt.reason,
        status: apt.status,
        room: apt.room || null
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
