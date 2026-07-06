import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Video, MapPin, User, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Doctor, Appointment } from '../types';
import { api } from '../services/api';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onConfirm: (appointment: Omit<Appointment, 'id' | 'patientId'>) => void;
  doctors?: Doctor[];
}

export default function BookingModal({ doctor, onClose, onConfirm, doctors }: BookingModalProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctor?.id || (doctors && doctors.length > 0 ? doctors[0].id : ''));

  const activeDoctor = doctors?.find((d) => d.id === selectedDoctorId) || doctor;

  if (!activeDoctor) return null;

  const [consultationType, setConsultationType] = useState<'In-Person' | 'Virtual'>('In-Person');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [reason, setReason] = useState('');

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const dateStr = `2026-07-${selectedDay.toString().padStart(2, '0')}`;
        const slots = await api.getDoctorSlots(selectedDoctorId, dateStr);
        if (active) {
          setAvailableSlots(slots);
        }
      } catch (err) {
        console.error('Error fetching doctor slots:', err);
        if (active) {
          setAvailableSlots([]);
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }
    fetchSlots();
    return () => {
      active = false;
    };
  }, [selectedDoctorId, selectedDay]);

  // Calendar parameters for July 2026
  // July 2026 starts on a Wednesday (index 3 in standard 0-6 Sun-Sat).
  // Days: 31
  const daysInMonth = 31;
  const startDayOffset = 2; // Mon starts at 1st column, Tue is 2nd. Let's build a standard calendar grid for July 2026:
  // Mon Tue Wed Thu Fri Sat Sun
  //      29  30   1   2   3   4   5
  // ...
  const monthName = 'July 2026';

  const handleConfirm = () => {
    if (!selectedSlot) return;
    
    onConfirm({
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      patientName: patientName.trim() || 'Guest Patient',
      date: `2026-07-${selectedDay.toString().padStart(2, '0')}`,
      time: selectedSlot,
      type: consultationType,
      reason: reason.trim() || `${activeDoctor.title} consultation`,
      status: 'CONFIRMED'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col my-8"
        id="booking-modal-container"
      >
        {/* Header (Doctor Info) */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex gap-4 items-center">
            <img
              src={activeDoctor.imageUrl}
              alt={activeDoctor.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg text-slate-900">{activeDoctor.name}</h3>
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  EXPERT
                </span>
              </div>
              <p className="text-slate-500 text-sm">{activeDoctor.title} • {activeDoctor.experience}+ Years Experience</p>
              
              {/* Change Doctor Option */}
              {doctors && doctors.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Doctor:</span>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => {
                      setSelectedDoctorId(e.target.value);
                      setSelectedSlot(null); // Reset slot when changing doctor
                    }}
                    className="text-[11px] font-semibold bg-transparent text-slate-700 focus:outline-none cursor-pointer pr-1"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-400 text-sm">★</span>
                <span className="text-slate-700 text-sm font-medium">{activeDoctor.rating}</span>
                <span className="text-slate-400 text-xs">({activeDoctor.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          {/* Left Column: Booking Details & Calendar */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Consultation Type */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Consultation Type</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('In-Person')}
                  className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition ${
                    consultationType === 'In-Person'
                      ? 'border-blue-600 bg-blue-50/30 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <MapPin className={`w-5 h-5 mb-2 ${consultationType === 'In-Person' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">In-Person</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('Virtual')}
                  className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition ${
                    consultationType === 'Virtual'
                      ? 'border-blue-600 bg-blue-50/30 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Video className={`w-5 h-5 mb-2 ${consultationType === 'Virtual' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Virtual</span>
                </button>
              </div>
            </div>

            {/* Select Date */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Date</h4>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <span>{monthName}</span>
                  <div className="flex ml-2">
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mini Calendar Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Previous month greyed cells */}
                  <span className="text-[11px] text-slate-300 py-2">29</span>
                  <span className="text-[11px] text-slate-300 py-2">30</span>

                  {/* Days of July 2026 */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const isSelected = selectedDay === day;
                    // Disable weekends just for clinical realism (Saturdays & Sundays)
                    // July 1st is Wednesday.
                    // Map days to weekdays to check if Saturday/Sunday
                    const dayOfWeekIndex = (day + startDayOffset) % 7; // 0 = Sun, 6 = Sat
                    const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (!isWeekend) {
                            setSelectedDay(day);
                            setSelectedSlot(null);
                          }
                        }}
                        disabled={isWeekend}
                        className={`text-xs font-medium py-1.5 rounded-lg transition-all ${
                          isWeekend
                            ? 'text-slate-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Time Slots & Patient Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Available Time Slots</h4>
              {loadingSlots ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  Loading slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-6 text-xs text-rose-500 font-medium bg-rose-50/50 rounded-xl border border-rose-100/50">
                  No slots available on this date
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 p-3 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-2 text-teal-800 text-[11px] leading-relaxed">
                <span className="text-teal-600 text-sm">ℹ</span>
                <span>Appointments are 45 minutes long. Please arrive 10 minutes early for check-in.</span>
              </div>
            </div>

            {/* Quick Patient Details Form */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Information</h4>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter patient full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Reason for Visit</label>
                <textarea
                  placeholder="E.g., Routine general exam, follow-up, lab review"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Summary & CTA) */}
        <div className="p-6 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Booking Summary</span>
            <span className="text-sm font-semibold text-slate-700">
              {consultationType} • Jul {selectedDay} • <span className={selectedSlot ? 'text-blue-600' : 'text-slate-400'}>{selectedSlot || 'Select Slot'}</span>
            </span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedSlot || !patientName.trim()}
              onClick={handleConfirm}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Confirm Booking
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
