import { Doctor, Appointment, PatientRecord, FAQItem } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'dr-1',
    name: 'Dr. Rajesh Malhotra',
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

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Scheduled Calendar Items for June 2026
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

  // Today's List Appointments (June 30, 2026)
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

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
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
  }
];

export const FAQ_ITEMS: FAQItem[] = [
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
    answer: 'Our main diagnostic clinic is located in T. Nagar, Chennai, India. While we accommodate emergency cases immediately, we highly recommend booking an appointment online to ensure minimal waiting time.',
    category: 'Prescription Refills'
  }
];
