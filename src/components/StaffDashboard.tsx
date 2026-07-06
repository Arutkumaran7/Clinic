import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Database, 
  HardDrive, 
  Check, 
  X, 
  UserPlus, 
  UserCheck, 
  Activity, 
  FolderHeart,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Doctor, Appointment, PatientRecord } from '../types';

interface StaffDashboardProps {
  doctors: Doctor[];
  appointments: Appointment[];
  patientRecords: PatientRecord[];
  onSignOut: () => void;
  onAddPatient: (patient: PatientRecord) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onUpdatePatientNote: (patientId: string, notes: string) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: 'CONFIRMED' | 'PENDING' | 'URGENT') => void;
  loggedInDoctor?: { id: string; name: string; title: string; specialty: string; imageUrl: string } | null;
}

export default function StaffDashboard({
  doctors,
  appointments,
  patientRecords,
  onSignOut,
  onAddPatient,
  onAddAppointment,
  onUpdatePatientNote,
  onUpdateAppointmentStatus,
  loggedInDoctor
}: StaffDashboardProps) {
  // Filter appointments and patient records by logged-in doctor
  const doctorAppointments = loggedInDoctor
    ? appointments.filter(a => a.doctorId === loggedInDoctor.id)
    : appointments;

  const doctorPatients = loggedInDoctor
    ? patientRecords.filter(p => appointments.some(a => a.doctorId === loggedInDoctor.id && a.patientName === p.name))
    : patientRecords;

  // Dashboard Notifications States
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Appointment Scheduled',
      message: 'Pooja Patel booked a new slot on June 30 at 11:00 AM.',
      time: '15 mins ago',
      unread: true,
      type: 'appointment'
    },
    {
      id: 'notif-2',
      title: 'Urgent Check-in',
      message: 'Amit Kumar is waiting in Room 101.',
      time: '1 hour ago',
      unread: true,
      type: 'urgent'
    },
    {
      id: 'notif-3',
      title: 'System Synced',
      message: 'Local database shifted to MySQL successfully.',
      time: '2 hours ago',
      unread: false,
      type: 'system'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'records'>('dashboard');
  const [patientSearch, setPatientSearch] = useState('');
  const [universalSearch, setUniversalSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  
  // Custom states for creating new patients or appointments
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewAptModalOpen, setIsNewAptModalOpen] = useState(false);

  // New Patient Form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('Female');
  const [newPatientAge, setNewPatientAge] = useState<number>(30);
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientBloodType, setNewPatientBloodType] = useState('O+');
  const [newPatientConditions, setNewPatientConditions] = useState('');

  // New Appointment Form state
  const [newAptPatientName, setNewAptPatientName] = useState('');
  const [newAptDoctorId, setNewAptDoctorId] = useState(doctors[0]?.id || '');
  const [newAptTime, setNewAptTime] = useState('09:00 AM');
  const [newAptDate, setNewAptDate] = useState('2026-06-30');
  const [newAptType, setNewAptType] = useState<'In-Person' | 'Virtual'>('In-Person');
  const [newAptReason, setNewAptReason] = useState('');

  // Editing Note State
  const [editingNoteText, setEditingNoteText] = useState('');

  // Calendar View & Navigation States (Defaulting to June 2026 for mock baseline compatibility)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // 0-indexed: 5 = June
  const [calendarView, setCalendarView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-30');

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setNewAptDate(dateStr);
  };

  const getWeeklyDays = () => {
    const baseDate = new Date(selectedDate);
    const dayOfWeek = baseDate.getDay(); // 0 = Sun, 6 = Sat
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + distanceToMonday + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  // Sidebar navigation options
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: CalendarIcon },
    { id: 'records', label: 'Patient Records', icon: Users },
  ];

  // Dynamic Grid details
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return doctorAppointments.filter((apt) => apt.date === dateString);
  };

  // Handle adding patient
  const handleCreatePatientSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const idNum = Math.floor(10000 + Math.random() * 90000);
    const newRecord: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: newPatientName,
      patientId: `MC-${idNum}`,
      lastVisit: 'Jun 30, 2026',
      status: 'ACTIVE',
      avatarColor: 'bg-emerald-100 text-emerald-700',
      gender: newPatientGender,
      age: Number(newPatientAge),
      email: newPatientEmail || `${newPatientName.toLowerCase().replace(/ /g, '.')}@gmail.com`,
      phone: newPatientPhone || '(555) 000-0000',
      bloodType: newPatientBloodType,
      conditions: newPatientConditions ? newPatientConditions.split(',').map(c => c.trim()) : ['Routine Checkup'],
      notes: ''
    };

    onAddPatient(newRecord);
    setIsNewPatientModalOpen(false);
    // Reset fields
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewPatientConditions('');
  };

  // Handle adding appointment manually from Staff calendar
  const handleCreateAptSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAptPatientName.trim()) return;

    const selectedDoc = doctors.find(d => d.id === newAptDoctorId);
    const idNum = Math.floor(10000 + Math.random() * 90000);

    const newApt: Appointment = {
      id: `apt-manual-${Date.now()}`,
      doctorId: newAptDoctorId,
      doctorName: selectedDoc ? selectedDoc.name : 'Unknown Specialist',
      patientName: newAptPatientName,
      patientId: `MC-${idNum}`,
      date: newAptDate,
      time: newAptTime,
      type: newAptType,
      reason: newAptReason || 'Routine exam',
      status: 'CONFIRMED',
      room: newAptType === 'In-Person' ? 'Exam Room 3' : 'Virtual Link'
    };

    onAddAppointment(newApt);
    setIsNewAptModalOpen(false);
    setNewAptPatientName('');
    setNewAptReason('');
  };

  const handleOpenPatientDetail = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setEditingNoteText(patient.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedPatient) {
      onUpdatePatientNote(selectedPatient.patientId, editingNoteText);
      setSelectedPatient({
        ...selectedPatient,
        notes: editingNoteText
      });
      alert('Clinical notes updated successfully.');
    }
  };

  // Filter Patient records by search
  const filteredPatients = doctorPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Today's list filtered dynamically by selectedDate
  const todaysAppointments = doctorAppointments.filter(apt => apt.date === selectedDate);

  // Filter Today's Appointments by universalSearch
  const filteredTodaysAppointments = todaysAppointments.filter((apt) => {
    if (!universalSearch.trim()) return true;
    const query = universalSearch.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(query) ||
      apt.doctorName.toLowerCase().includes(query) ||
      apt.reason.toLowerCase().includes(query) ||
      apt.time.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800" id="staff-dashboard-container">
      {/* 1. Left Persistent Sidebar */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Clinic Brand logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                <span>+</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg text-slate-900 block">MedCore</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Staff Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as 'dashboard' | 'records');
                    setSelectedPatient(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Quick action triggers within sidebar */}
            <button
              onClick={() => setIsNewAptModalOpen(true)}
              className="mt-4 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300/80 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar - Sign Out */}
        <div className="space-y-4">
          <div className="p-3 bg-slate-200/50 rounded-xl border border-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">HIPAA Secured</span>
          </div>

          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shadow-2xs shrink-0">
          {/* Quick Universal Search */}
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients, doctors, or slots..."
              value={universalSearch}
              onChange={(e) => {
                setUniversalSearch(e.target.value);
                setPatientSearch(e.target.value);
              }}
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quick indicators & Staff metadata */}
          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setHasUnreadNotifications(false);
                  // Mark all notifications as read when opening
                  setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                }}
                className="relative p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition cursor-pointer" 
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    {/* Invisible Backdrop to close dropdown on click outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Alerts</span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                          {notifications.length} Total
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto scrollbar-thin">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3.5 flex gap-3 text-left transition hover:bg-slate-50/40 ${notif.unread ? 'bg-blue-50/10' : ''}`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {notif.type === 'appointment' && (
                                <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                  <CalendarIcon className="w-4 h-4" />
                                </div>
                              )}
                              {notif.type === 'urgent' && (
                                <div className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                                  <ShieldAlert className="w-4 h-4" />
                                </div>
                              )}
                              {notif.type === 'system' && (
                                <div className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-800 truncate">{notif.title}</p>
                              <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{notif.message}</p>
                              <span className="text-[9px] text-slate-400 font-medium block mt-1.5">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Dismiss Panel
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile badge of logged-in doctor */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <span className="font-semibold text-slate-900 text-xs sm:text-sm block">
                  {loggedInDoctor ? loggedInDoctor.name : 'Dr. Sarah Miller'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {loggedInDoctor ? `${loggedInDoctor.title} • ${loggedInDoctor.specialty}` : 'Head of Cardiology'}
                </span>
              </div>
              <img
                src={loggedInDoctor ? loggedInDoctor.imageUrl : "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150"}
                alt="Doctor Avatar"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-inner"
              />
            </div>
          </div>
        </header>

        {/* Main Workspace Body Content */}
        <main className="flex-1 overflow-y-auto p-8 flex gap-8">
          
          {/* ==================== TAB 1: CALENDAR DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex gap-8 min-w-0">
              
              {/* Left Side: Dynamic Calendar Grid */}
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  {/* Calendar Top Controls Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-950">
                        {calendarView === 'monthly' ? `${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : calendarView === 'weekly' ? 'Weekly Timeline' : 'Daily Timeline'}
                      </h2>
                      <p className="text-slate-400 text-xs font-semibold mt-0.5">Central Medical Scheduling System</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Navigate weeks/months */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center gap-1">
                        <button 
                          onClick={handlePrevMonth} 
                          className="p-1.5 text-slate-650 hover:text-slate-900 cursor-pointer"
                          title="Previous Month"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleGoToToday} 
                          className="px-3 py-1 bg-white border border-slate-150 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          Today
                        </button>
                        <button 
                          onClick={handleNextMonth} 
                          className="p-1.5 text-slate-650 hover:text-slate-900 cursor-pointer"
                          title="Next Month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* View Modes */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 flex gap-1">
                        <button 
                          onClick={() => setCalendarView('monthly')} 
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            calendarView === 'monthly' ? 'bg-white border border-slate-150 text-slate-750 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Monthly
                        </button>
                        <button 
                          onClick={() => setCalendarView('weekly')} 
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            calendarView === 'weekly' ? 'bg-white border border-slate-150 text-slate-750 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Weekly
                        </button>
                        <button 
                          onClick={() => setCalendarView('daily')} 
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            calendarView === 'daily' ? 'bg-white border border-slate-150 text-slate-750 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Daily
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MONTHLY VIEW */}
                  {calendarView === 'monthly' && (
                    <>
                      {/* Days of week titles */}
                      <div className="grid grid-cols-7 gap-px text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>

                      {/* Monthly Grid */}
                      <div className="grid grid-cols-7 gap-1 border-t border-slate-100 pt-2 min-h-[460px]">
                        {/* Render empty cells for startOffset */}
                        {Array.from({ length: startOffset }).map((_, i) => (
                          <div 
                            key={`empty-${i}`} 
                            className="rounded-xl border border-slate-100 bg-slate-50/20 min-h-[85px]"
                          />
                        ))}

                        {calendarDays.map((day) => {
                          const dayApts = getAppointmentsForDay(day);
                          const today = new Date();
                          const isToday = today.getFullYear() === currentYear &&
                                          today.getMonth() === currentMonth &&
                                          today.getDate() === day;
                          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                          const isSelected = selectedDate === dateStr;

                          return (
                            <div
                              key={day}
                              onClick={() => {
                                setSelectedDate(dateStr);
                                setNewAptDate(dateStr);
                              }}
                              className={`rounded-xl p-2 border min-h-[85px] transition group relative flex flex-col justify-between cursor-pointer ${
                                isToday
                                  ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-100'
                                  : isSelected
                                  ? 'bg-blue-50/20 border-blue-300 ring-1 ring-blue-50'
                                  : 'bg-white border-slate-200/85 hover:border-slate-300 hover:bg-slate-50/40'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-[11px] font-bold ${isToday ? 'text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded-full' : isSelected ? 'text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full' : 'text-slate-700'}`}>
                                  {day}
                                </span>
                                <div className="flex items-center gap-1">
                                  {dayApts.length > 0 && (
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDate(dateStr);
                                      setNewAptDate(dateStr);
                                      setIsNewAptModalOpen(true);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-250 rounded-md transition text-slate-500 hover:text-slate-800"
                                    title="Add Appointment"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Render appointments on the cell */}
                              <div className="space-y-1 mt-2 flex-1 flex flex-col justify-end">
                                {dayApts.slice(0, 2).map((apt) => (
                                  <div
                                    key={apt.id}
                                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md truncate border ${
                                      apt.status === 'URGENT'
                                        ? 'bg-rose-50 border-rose-100 text-rose-700'
                                        : apt.status === 'PENDING'
                                        ? 'bg-amber-50 border-amber-100 text-amber-700'
                                        : 'bg-teal-50 border-teal-100 text-teal-700'
                                    }`}
                                    title={`${apt.time} - ${apt.patientName}`}
                                  >
                                    {apt.reason}
                                  </div>
                                ))}
                                {dayApts.length > 2 && (
                                  <span className="text-[7px] text-slate-400 font-bold block text-right">
                                    +{dayApts.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* WEEKLY VIEW */}
                  {calendarView === 'weekly' && (
                    <div className="grid grid-cols-7 gap-2 border-t border-slate-100 pt-4 min-h-[460px]">
                      {getWeeklyDays().map((dateObj) => {
                        const dateStr = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
                        const dayApts = doctorAppointments.filter(apt => apt.date === dateStr);
                        const isSelected = selectedDate === dateStr;
                        const today = new Date();
                        const isTodayStr = today.getFullYear() === dateObj.getFullYear() &&
                                           today.getMonth() === dateObj.getMonth() &&
                                           today.getDate() === dateObj.getDate();
                        
                        return (
                          <div
                            key={dateStr}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setNewAptDate(dateStr);
                            }}
                            className={`rounded-xl p-3 border min-h-[420px] flex flex-col transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/30 border-blue-300 ring-1 ring-blue-100'
                                : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/20'
                            }`}
                          >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                                  {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className={`text-sm font-bold ${isTodayStr ? 'text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded-full' : 'text-slate-800'}`}>
                                  {dateObj.getDate()}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDate(dateStr);
                                  setNewAptDate(dateStr);
                                  setIsNewAptModalOpen(true);
                                }}
                                className="p-1 hover:bg-slate-100 rounded-md transition text-slate-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="space-y-2 flex-1 overflow-y-auto max-h-[320px] scrollbar-thin">
                              {dayApts.map(apt => (
                                <div
                                  key={apt.id}
                                  className={`p-2 rounded-lg border text-[10px] font-semibold space-y-1 ${
                                    apt.status === 'URGENT'
                                      ? 'bg-rose-50 border-rose-100 text-rose-700'
                                      : apt.status === 'PENDING'
                                      ? 'bg-amber-50 border-amber-100 text-amber-700'
                                      : 'bg-teal-50 border-teal-100 text-teal-700'
                                  }`}
                                >
                                  <div className="font-bold">{apt.time}</div>
                                  <div className="truncate">{apt.patientName}</div>
                                  <div className="text-[9px] text-slate-500 truncate">{apt.reason}</div>
                                </div>
                              ))}
                              {dayApts.length === 0 && (
                                <div className="text-center py-12 text-[10px] text-slate-400 italic font-medium">
                                  No sessions
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* DAILY VIEW */}
                  {calendarView === 'daily' && (
                    <div className="border-t border-slate-100 pt-4 min-h-[460px] overflow-y-auto max-h-[460px] scrollbar-thin">
                      <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">
                          Selected Day: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => setIsNewAptModalOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule Session</span>
                        </button>
                      </div>
                      
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {Array.from({ length: 11 }).map((_, hourIndex) => {
                          const hourVal = 8 + hourIndex;
                          const displayHour = hourVal > 12 ? hourVal - 12 : hourVal;
                          const ampm = hourVal >= 12 ? 'PM' : 'AM';
                          const timeSlotLabel = `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
                          
                          // Find appointments that fall in this hour
                          const hourApts = doctorAppointments.filter(apt => {
                            if (apt.date !== selectedDate) return false;
                            const aptHour = parseInt(apt.time.split(':')[0]);
                            const aptAmpm = apt.time.split(' ')[1];
                            let adjustedAptHour = aptHour;
                            if (aptAmpm === 'PM' && aptHour < 12) adjustedAptHour += 12;
                            if (aptAmpm === 'AM' && aptHour === 12) adjustedAptHour = 0;
                            return adjustedAptHour === hourVal;
                          });
                          
                          return (
                            <div key={hourVal} className="flex min-h-[65px] hover:bg-slate-50/20 transition">
                              <div className="w-20 p-3 border-r border-slate-100 text-[10px] font-bold text-slate-400 text-right shrink-0">
                                {timeSlotLabel}
                              </div>
                              <div className="flex-1 p-2 flex gap-2 overflow-x-auto">
                                {hourApts.map(apt => (
                                  <div
                                    key={apt.id}
                                    className={`p-2.5 rounded-xl border text-xs font-semibold flex-1 min-w-[200px] max-w-[300px] flex flex-col justify-between shadow-2xs ${
                                      apt.status === 'URGENT'
                                        ? 'bg-rose-50/60 border-rose-200 text-rose-700'
                                        : apt.status === 'PENDING'
                                        ? 'bg-amber-50/60 border-amber-200 text-amber-700'
                                        : 'bg-teal-50/60 border-teal-200 text-teal-700'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center text-[9px]">
                                      <span className="font-bold text-slate-800">{apt.time} • {apt.doctorName}</span>
                                      <span className="uppercase tracking-wider text-[8px] font-extrabold">{apt.status}</span>
                                    </div>
                                    <div className="font-bold text-slate-950 mt-1">{apt.patientName}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{apt.reason}</div>
                                  </div>
                                ))}
                                {hourApts.length === 0 && (
                                  <div className="text-slate-350 text-[10px] italic flex items-center pl-4 font-medium">
                                    No sessions scheduled
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Last synced: 2 mins ago</span>
                  <span>Session Active: HIPAA Authenticated</span>
                </div>
              </div>

              {/* Right Side: Dynamic Day Schedule List */}
              <div className="w-80 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 shadow-2xs">
                
                {/* Metric Summary Counters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-600 text-white rounded-xl p-4 shadow-sm flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-100">Scheduled</span>
                    <span className="text-3xl font-bold mt-1">{todaysAppointments.length.toString().padStart(2, '0')}</span>
                  </div>
                  <div className="bg-teal-500 text-white rounded-xl p-4 shadow-sm flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-100">Confirmed</span>
                    <span className="text-3xl font-bold mt-1">{todaysAppointments.filter(a => a.status === 'CONFIRMED').length.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Day's appointments title */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">Schedule List</h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Vertical scrollable schedule items */}
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin">
                  {filteredTodaysAppointments.length > 0 ? (
                    filteredTodaysAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                          apt.status === 'URGENT'
                            ? 'bg-rose-50/50 border-rose-200/80 ring-1 ring-rose-100/30'
                            : apt.status === 'PENDING'
                            ? 'bg-amber-50/50 border-amber-200/80'
                            : 'bg-white border-slate-250 hover:bg-slate-50/30'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500">{apt.time}</span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            apt.status === 'URGENT'
                              ? 'bg-rose-100 text-rose-700'
                              : apt.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-teal-50 text-teal-700 border border-teal-100'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs">{apt.patientName}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{apt.reason}</p>

                        <div className="mt-2 pt-2 border-t border-slate-100/60 flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                          <span>{apt.room || 'Tele-Room B'}</span>
                          
                          {/* Interactive status toggler for clinic personnel! */}
                          {apt.status === 'PENDING' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'CONFIRMED')}
                              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2 py-0.5 rounded-md cursor-pointer transition"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                      No matching appointments
                    </div>
                  )}
                </div>

                {/* Bottom link */}
                <button
                  onClick={() => setActiveTab('records')}
                  className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 transition py-1 cursor-pointer"
                >
                  View Full Day Schedule
                </button>
              </div>

            </div>
          )}


          {/* ==================== TAB 2: PATIENT RECORDS ==================== */}
          {activeTab === 'records' && (
            <div className="flex-1 flex gap-8 min-w-0">
              
              {/* Left Side: Records Table list (Image 5) */}
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-950">Patient Records</h2>
                      <p className="text-slate-400 text-xs font-semibold mt-0.5">Clinical database & patient notes</p>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative w-48 sm:w-56">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search patient, ID..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 pl-8.5 pr-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => setIsNewPatientModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm transition cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add Patient</span>
                      </button>
                    </div>
                  </div>

                  {/* Patients Table Grid (Image 5 Layout) */}
                  <div className="border border-slate-150 rounded-xl overflow-hidden bg-white">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Patient ID</th>
                          <th className="px-6 py-4">Last Visit</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {filteredPatients.map((pat) => (
                          <tr
                            key={pat.id}
                            onClick={() => handleOpenPatientDetail(pat)}
                            className="hover:bg-slate-50/50 transition cursor-pointer"
                          >
                            {/* Patient avatar and name info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${pat.avatarColor} flex items-center justify-center font-bold text-xs shadow-inner`}>
                                  {pat.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="font-bold text-slate-900">{pat.name}</span>
                              </div>
                            </td>
                            {/* Patient ID */}
                            <td className="px-6 py-4 text-slate-500 font-semibold">{pat.patientId}</td>
                            {/* Last Visit date */}
                            <td className="px-6 py-4 text-slate-500 font-semibold">{pat.lastVisit}</td>
                            {/* Badge */}
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                pat.status === 'ACTIVE'
                                  ? 'bg-blue-100 text-blue-700'
                                  : pat.status === 'FOLLOW-UP'
                                  ? 'bg-rose-150 text-rose-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {pat.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-400">
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-150 flex items-center justify-between text-xs text-slate-400">
                  <span>View All {patientRecords.length} Records</span>
                  <span>HIPAA Compliance Level: PHI Encrypted</span>
                </div>
              </div>



            </div>
          )}

        </main>
      </div>

      {/* ==================== MODAL 1: CLINICAL DETAIL DRAWER / OVERLAY ==================== */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-2xs">
            <div className="absolute inset-0" onClick={() => setSelectedPatient(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedPatient.avatarColor} flex items-center justify-center font-bold text-sm shadow-inner`}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{selectedPatient.patientId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Clinical Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Medical Parameters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Age / Gender</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">{selectedPatient.age} / {selectedPatient.gender[0]}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Blood Type</p>
                    <p className="text-sm font-bold text-rose-600 mt-1">{selectedPatient.bloodType}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Status</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Email</span>
                      <p className="font-semibold text-slate-800 truncate mt-0.5">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Phone</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.phone}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Diagnosed Clinical Conditions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Diagnosed Conditions</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.conditions.map((cond, index) => (
                      <span key={index} className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Clinical Physician Notes (Fully Interactive state!) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Physician Consultation Notes</h4>
                    <span className="text-[10px] text-slate-400 font-medium">HIPAA Encrypted Entry</span>
                  </div>
                  <textarea
                    rows={6}
                    value={editingNoteText}
                    onChange={(e) => setEditingNoteText(e.target.value)}
                    placeholder="Enter confidential notes, diagnosis results, next appointment advice..."
                    className="w-full text-xs sm:text-sm border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/20"
                  />
                  <p className="text-[9px] text-slate-400">Press Save below to write updates directly to Electronic Health Records (EHR) database.</p>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-150 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Save Patient Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 2: ADD NEW PATIENT QUICK-FORM ==================== */}
      <AnimatePresence>
        {isNewPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  Add Patient Electronic Record
                </h3>
                <button onClick={() => setIsNewPatientModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePatientSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3 py-2"
                    placeholder="E.g., Jeremy Gilbert"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Gender</label>
                    <select
                      value={newPatientGender}
                      onChange={(e) => setNewPatientGender(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={newPatientAge}
                      onChange={(e) => setNewPatientAge(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                      min={1}
                      max={120}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Blood Type</label>
                    <select
                      value={newPatientBloodType}
                      onChange={(e) => setNewPatientBloodType(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    >
                      <option value="O-Negative">O-</option>
                      <option value="O-Positive">O+</option>
                      <option value="A-Negative">A-</option>
                      <option value="A-Positive">A+</option>
                      <option value="B-Negative">B-</option>
                      <option value="B-Positive">B+</option>
                      <option value="AB-Negative">AB-</option>
                      <option value="AB-Positive">AB+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Conditions (Comma Separated)</label>
                  <input
                    type="text"
                    value={newPatientConditions}
                    onChange={(e) => setNewPatientConditions(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    placeholder="E.g., Asthma, Allergy"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewPatientModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs transition font-semibold"
                  >
                    Create Patient Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 3: SCHEDULE MANUAL SESSION ==================== */}
      <AnimatePresence>
        {isNewAptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  Schedule Clinical Session
                </h3>
                <button onClick={() => setIsNewAptModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAptSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={newAptPatientName}
                    onChange={(e) => setNewAptPatientName(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3 py-2"
                    placeholder="Enter Patient Full Name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Assign Clinician Specialist</label>
                  <select
                    value={newAptDoctorId}
                    onChange={(e) => setNewAptDoctorId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.title})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newAptDate}
                      onChange={(e) => setNewAptDate(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Time Slot</label>
                    <select
                      value={newAptTime}
                      onChange={(e) => setNewAptTime(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewAptType('In-Person')}
                      className={`py-2 text-xs font-semibold rounded-lg border transition ${
                        newAptType === 'In-Person'
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      In-Person
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAptType('Virtual')}
                      className={`py-2 text-xs font-semibold rounded-lg border transition ${
                        newAptType === 'Virtual'
                          ? 'bg-teal-50 border-teal-600 text-teal-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Virtual Telehealth
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Reason / Notes</label>
                  <input
                    type="text"
                    value={newAptReason}
                    onChange={(e) => setNewAptReason(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    placeholder="E.g., Heart Check, Post-Op evaluation"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewAptModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs transition font-semibold"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
