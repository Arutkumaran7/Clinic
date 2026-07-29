import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Search, 
  HelpCircle, 
  Lock, 
  Menu, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Clock,
  User,
  Activity
} from 'lucide-react';

import { Doctor, Appointment, PatientRecord, FAQItem } from './types';
import { api } from './services/api';

import LandingPage from './components/LandingPage';
import SpecialistsGrid from './components/SpecialistsGrid';
import HelpCenter from './components/HelpCenter';
import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';
import BookingModal from './components/BookingModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactSupport from './components/ContactSupport';
export default function App() {
  // Navigation & View control
  const [currentView, setCurrentView] = useState<'home' | 'specialists' | 'help' | 'staff-login' | 'staff-dashboard' | 'privacy' | 'terms' | 'support'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Doctor Auth states
  const [doctorToken, setDoctorToken] = useState<string | null>(() => localStorage.getItem('doctorToken'));
  const [loggedInDoctor, setLoggedInDoctor] = useState<any | null>(() => {
    const doc = localStorage.getItem('loggedInDoctor');
    return doc ? JSON.parse(doc) : null;
  });

  // App core database state for real-time reactivity
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');

  // Fetch initial data from Express backend
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedDoctors, loadedAppointments, loadedPatients, loadedFaqs] = await Promise.all([
          api.getDoctors(),
          api.getAppointments(),
          api.getPatients(),
          api.getFAQs()
        ]);
        setDoctors(loadedDoctors);
        setAppointments(loadedAppointments);
        setPatientRecords(loadedPatients);
        setFaqs(loadedFaqs);
      } catch (error) {
        console.error('Failed to load clinic data from backend:', error);
      }
    }
    loadData();
  }, []);

  // Scroll to top smoothly when the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Booking Modal States
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [successBookingMessage, setSuccessBookingMessage] = useState<{
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
  } | null>(null);

  // Handlers for Patients
  const handleAddPatient = async (newPatient: PatientRecord) => {
    try {
      const created = await api.createPatient({
        name: newPatient.name,
        gender: newPatient.gender,
        age: newPatient.age,
        email: newPatient.email,
        phone: newPatient.phone,
        bloodType: newPatient.bloodType,
        conditions: newPatient.conditions,
        notes: newPatient.notes
      });
      setPatientRecords((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Failed to create patient:', e);
    }
  };

  const handleUpdatePatientNote = async (patientId: string, notes: string) => {
    try {
      const targetPatient = patientRecords.find(p => p.patientId === patientId);
      if (!targetPatient) return;
      const updated = await api.updatePatientNotes(targetPatient.id, notes);
      setPatientRecords((prev) =>
        prev.map((pat) => (pat.id === updated.id ? updated : pat))
      );
    } catch (e) {
      console.error('Failed to update patient notes:', e);
    }
  };

  // Handlers for Appointments
  const handleAddAppointment = async (newApt: Appointment) => {
    try {
      const { appointment, patient } = await api.createAppointment({
        doctorId: newApt.doctorId,
        doctorName: newApt.doctorName,
        patientName: newApt.patientName,
        date: newApt.date,
        time: newApt.time,
        type: newApt.type,
        reason: newApt.reason
      });
      setAppointments((prev) => [...prev, appointment]);
      setPatientRecords((prev) => {
        const exists = prev.some(p => p.id === patient.id);
        if (exists) {
          return prev.map(p => p.id === patient.id ? patient : p);
        } else {
          return [patient, ...prev];
        }
      });
    } catch (e) {
      console.error('Failed to book appointment:', e);
      alert(e instanceof Error ? e.message : 'Failed to book appointment');
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: 'CONFIRMED' | 'PENDING' | 'URGENT') => {
    try {
      const updated = await api.updateAppointmentStatus(appointmentId, status);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === updated.id ? updated : apt))
      );
    } catch (e) {
      console.error('Failed to update appointment status:', e);
    }
  };

  // Public Booking Modal Confirmation
  const handleConfirmPublicBooking = async (bookingPayload: Omit<Appointment, 'id' | 'patientId'>) => {
    try {
      const { appointment, patient } = await api.createAppointment({
        doctorId: bookingPayload.doctorId,
        doctorName: bookingPayload.doctorName,
        patientName: bookingPayload.patientName,
        date: bookingPayload.date,
        time: bookingPayload.time,
        type: bookingPayload.type,
        reason: bookingPayload.reason
      });

      setAppointments((prev) => [...prev, appointment]);
      setPatientRecords((prev) => {
        const exists = prev.some(p => p.id === patient.id);
        if (exists) {
          return prev.map(p => p.id === patient.id ? patient : p);
        } else {
          return [patient, ...prev];
        }
      });

      // Trigger Success feedback
      setSuccessBookingMessage({
        patientName: bookingPayload.patientName,
        doctorName: bookingPayload.doctorName,
        date: bookingPayload.date,
        time: bookingPayload.time,
        type: bookingPayload.type
      });

      // Close booking modal
      setSelectedDoctorForBooking(null);
    } catch (e) {
      console.error('Failed to confirm public booking:', e);
      alert(e instanceof Error ? e.message : 'Failed to book appointment');
    }
  };

  // Determine if we are in a dashboard/console environment (which hides the public header & footer)
  const isDashboardView = currentView === 'staff-dashboard' || currentView === 'staff-login';

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-100 font-sans antialiased text-slate-800">
      
      {/* 1. Public Navigation Header (Hidden when inside dashboards) */}
      {!isDashboardView && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100" id="public-header">
          <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => setCurrentView('home')} 
              className="flex items-center gap-2.5 group hover:opacity-90 transition cursor-pointer"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <span>+</span>
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                MedCore <span className="text-blue-600">Clinic</span>
              </span>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`text-sm font-semibold transition cursor-pointer ${
                  currentView === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setCurrentView('specialists');
                }}
                className={`text-sm font-semibold transition cursor-pointer ${
                  currentView === 'specialists' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Find Doctor
              </button>
              <button
                onClick={() => setCurrentView('help')}
                className={`text-sm font-semibold transition cursor-pointer ${
                  currentView === 'help' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Help Center
              </button>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setCurrentView('staff-login')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer ${
                  currentView === 'staff-login' ? 'bg-slate-100 text-blue-600' : 'text-slate-700'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Staff Portal
              </button>



              <button
                onClick={() => setSelectedDoctorForBooking(doctors[0])}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition cursor-pointer"
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile dropdown drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-slate-150 px-6 py-4 space-y-3"
              >
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setCurrentView('specialists');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Find Doctor
                </button>
                <button
                  onClick={() => {
                    setCurrentView('help');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Help Center
                </button>
                <hr className="border-slate-100" />
                <button
                  onClick={() => {
                    setCurrentView('staff-login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  Staff Portal login
                </button>

                <button
                  onClick={() => {
                    setSelectedDoctorForBooking(doctors[0]);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2.5 rounded-xl text-sm block"
                >
                  Book Appointment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* 2. Main Work Area Panels */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage 
                onNavigate={(v) => setCurrentView(v)} 
                topDoctors={doctors} 
                onBookDoctor={(doc) => setSelectedDoctorForBooking(doc)}
                onSearch={(q) => setGlobalSearch(q)}
              />
            </motion.div>
          )}

          {currentView === 'specialists' && (
            <motion.div
              key="specialists"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SpecialistsGrid 
                doctors={doctors} 
                onBook={(doc) => setSelectedDoctorForBooking(doc)} 
                initialSearch={globalSearch}
              />
            </motion.div>
          )}

          {currentView === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HelpCenter 
                faqItems={faqs} 
                onNavigate={(v) => setCurrentView(v)} 
              />
            </motion.div>
          )}

          {currentView === 'staff-login' && (
            <motion.div
              key="staff-login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaffLogin 
                onBack={() => setCurrentView('home')}
                onLoginSuccess={(token, doctorInfo) => {
                  setDoctorToken(token);
                  setLoggedInDoctor(doctorInfo);
                  localStorage.setItem('doctorToken', token);
                  localStorage.setItem('loggedInDoctor', JSON.stringify(doctorInfo));
                  setCurrentView('staff-dashboard');
                }}
              />
            </motion.div>
          )}

          {currentView === 'staff-dashboard' && (
            <motion.div
              key="staff-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-screen overflow-hidden flex flex-col justify-between"
            >
              <StaffDashboard 
                doctors={doctors}
                appointments={appointments}
                patientRecords={patientRecords}
                onSignOut={() => {
                  setDoctorToken(null);
                  setLoggedInDoctor(null);
                  localStorage.removeItem('doctorToken');
                  localStorage.removeItem('loggedInDoctor');
                  setCurrentView('home');
                }}
                onAddPatient={handleAddPatient}
                onAddAppointment={handleAddAppointment}
                onUpdatePatientNote={handleUpdatePatientNote}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                loggedInDoctor={loggedInDoctor}
              />
            </motion.div>
          )}

          {currentView === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PrivacyPolicy onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TermsOfService onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactSupport onBack={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Booking Modal dialog */}
      <AnimatePresence>
        {selectedDoctorForBooking && (
          <BookingModal
            doctor={selectedDoctorForBooking}
            onClose={() => setSelectedDoctorForBooking(null)}
            onConfirm={handleConfirmPublicBooking}
            doctors={doctors}
          />
        )}
      </AnimatePresence>

      {/* 4. Booking Success Notification Dialog Popup */}
      <AnimatePresence>
        {successBookingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-sm w-full shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h3 className="font-display font-bold text-xl text-slate-900 mb-1">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-500 mb-6">A verification code has been sent to your phone.</p>

              <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 mb-6 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Patient</span>
                  <span className="font-bold text-slate-800">{successBookingMessage.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Physician</span>
                  <span className="font-bold text-slate-800">{successBookingMessage.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Date & Time</span>
                  <span className="font-bold text-blue-600">{successBookingMessage.date} at {successBookingMessage.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Consultation</span>
                  <span className="font-bold text-slate-800 uppercase tracking-wide">{successBookingMessage.type}</span>
                </div>
              </div>

              <button
                onClick={() => setSuccessBookingMessage(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Close Summary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Public Footer (Hidden inside dashboards) */}
      {!isDashboardView && (
        <footer className="bg-slate-50 border-t border-slate-100 py-12 px-6" id="public-footer">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
                  <span>+</span>
                </div>
                <span className="font-display font-bold text-base text-slate-900 tracking-tight">
                  MedCore <span className="text-blue-600">Clinic</span>
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                Comprehensive medical portal featuring public appointment booking, specialists directories, a patient help center, and secure HIPAA-compliant staff dashboard with interactive scheduling.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Patient Support</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setCurrentView('specialists')} className="text-slate-600 hover:text-slate-900 transition cursor-pointer">
                    Book an Appointment
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('help')} className="text-slate-600 hover:text-slate-900 transition cursor-pointer">
                    Help & FAQs
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">HIPAA Accreditation</h4>
              <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Certified compliant with federal HIPAA security rules. Patient privacy and encrypted EHR storage are verified.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>© 2026 MedCore Health Systems. All rights reserved.</span>
            <div className="flex gap-4">
              <button onClick={() => setCurrentView('privacy')} className="hover:text-slate-650 cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setCurrentView('terms')} className="hover:text-slate-650 cursor-pointer">Terms of Service</button>
              <span>•</span>
              <button onClick={() => setCurrentView('support')} className="hover:text-slate-650 cursor-pointer">Contact Support</button>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
