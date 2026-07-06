import { prisma } from '../db';
import { AvailabilityService } from './availability.service';

export class AppointmentService {
  private availabilityService = new AvailabilityService();

  public async getAppointments() {
    return prisma.appointment.findMany({
      orderBy: { date: 'asc' }
    });
  }

  public async createAppointment(data: {
    doctorId: string;
    doctorName: string;
    patientName: string;
    date: string;
    time: string;
    type: string;
    reason: string;
  }) {
    // 1. Verify doctor availability for the selected slot
    const slots = await this.availabilityService.getAvailableSlots(data.doctorId, data.date);
    const isSlotAvailable = slots.includes(data.time);

    if (!isSlotAvailable) {
      throw new Error(`The slot ${data.time} is no longer available on ${data.date}.`);
    }

    // 2. Find or create patient
    let patient = await prisma.patientRecord.findFirst({
      where: {
        name: {
          equals: data.patientName,
          // Case insensitive comparison
        }
      }
    });

    let patientId = patient?.patientId;

    if (!patient) {
      // Auto-generate patient record
      const idNum = Math.floor(10000 + Math.random() * 90000);
      patientId = `MC-${idNum}`;

      patient = await prisma.patientRecord.create({
        data: {
          id: `pat-pub-${Date.now()}-${idNum}`,
          name: data.patientName,
          patientId,
          lastVisit: data.date,
          status: 'ACTIVE',
          avatarColor: 'bg-blue-100 text-blue-700',
          gender: 'Undisclosed',
          age: 35,
          email: `${data.patientName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
          phone: '(555) 019-2831',
          bloodType: 'Unknown',
          conditionsRaw: JSON.stringify([data.reason]),
          notes: `Automatically created via public appointment booking with ${data.doctorName}.`
        }
      });
    } else {
      // Update existing patient's last visit
      await prisma.patientRecord.update({
        where: { id: patient.id },
        data: { lastVisit: data.date }
      });
    }

    // 3. Create appointment
    const newApt = await prisma.appointment.create({
      data: {
        id: `apt-pub-${Date.now()}`,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        patientName: data.patientName,
        patientId: patientId!,
        date: data.date,
        time: data.time,
        type: data.type,
        reason: data.reason,
        status: 'CONFIRMED'
      }
    });

    return {
      appointment: newApt,
      patient
    };
  }

  public async updateAppointmentStatus(id: string, status: string) {
    return prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }
}
