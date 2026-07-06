export interface Doctor {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: number;
  reviews: number;
  description: string;
  imageUrl: string;
  specialty: string;
  department: string;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  type: 'In-Person' | 'Virtual';
  reason: string;
  status: 'CONFIRMED' | 'PENDING' | 'URGENT';
  room?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  patientId: string;
  lastVisit: string;
  status: 'ACTIVE' | 'FOLLOW-UP' | 'DISCHARGED';
  avatarColor: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
  bloodType: string;
  conditions: string[];
  notes?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
