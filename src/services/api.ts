import { Doctor, Appointment, PatientRecord, FAQItem } from '../types';

/**
 * Frontend API client to query the backend Express endpoints.
 */
export const api = {
  // 1. Doctors
  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  async getDoctorSlots(doctorId: string, date: string): Promise<string[]> {
    const res = await fetch(`/api/doctors/${doctorId}/slots?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch doctor availability slots');
    return res.json();
  },

  // 2. Appointments
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async createAppointment(payload: {
    doctorId: string;
    doctorName: string;
    patientName: string;
    date: string;
    time: string;
    type: string;
    reason: string;
  }): Promise<{ appointment: Appointment; patient: PatientRecord }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to book appointment');
    }
    return res.json();
  },

  async updateAppointmentStatus(id: string, status: 'CONFIRMED' | 'PENDING' | 'URGENT'): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update appointment status');
    return res.json();
  },

  // 3. Patients
  async getPatients(): Promise<PatientRecord[]> {
    const res = await fetch('/api/patients');
    if (!res.ok) throw new Error('Failed to fetch patient records');
    return res.json();
  },

  async createPatient(payload: Omit<PatientRecord, 'id' | 'patientId' | 'lastVisit' | 'status' | 'avatarColor'>): Promise<PatientRecord> {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create patient record');
    return res.json();
  },

  async updatePatientNotes(id: string, notes: string): Promise<PatientRecord> {
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw new Error('Failed to update patient notes');
    return res.json();
  },

  // 4. FAQs
  async getFAQs(): Promise<FAQItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    return res.json();
  },
};
