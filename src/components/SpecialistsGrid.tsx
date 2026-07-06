import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Award, Shield, Mail, Calendar, Sparkles, X, ChevronRight, Phone } from 'lucide-react';
import { Doctor } from '../types';

interface SpecialistsGridProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
  initialSearch?: string;
}

export default function SpecialistsGrid({ doctors, onBook, initialSearch = '' }: SpecialistsGridProps) {
  const [searchName, setSearchName] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeProfileDoctor, setActiveProfileDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    setSearchName(initialSearch);
  }, [initialSearch]);

  // Extract all unique specialties for filters
  const specialties = ['All', ...Array.from(new Set(doctors.map((d) => d.specialty)))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesName = doc.name.toLowerCase().includes(searchName.toLowerCase()) ||
                        doc.title.toLowerCase().includes(searchName.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesName && matchesSpecialty;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto w-full">
        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-display font-bold text-3xl text-slate-900 tracking-tight">Available Specialists</h1>
          <p className="text-slate-500 text-sm mt-1">{filteredDoctors.length} doctors found</p>
        </div>

        {/* Filters and Search Bar Section */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Custom Horizontal Specialty Scroll */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none max-w-full">
            {specialties.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedSpecialty === spec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or title..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full text-xs text-slate-700 pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Specialists Grid Layout (3-Column Grid) */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-slate-300 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex gap-4 items-start mb-4">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-inner shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h2 className="font-display font-semibold text-slate-900 text-base truncate">{doc.name}</h2>
                        {/* Rating Tag */}
                        <div className="flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                          <Star className="w-3 h-3 fill-teal-600 stroke-teal-600" />
                          <span>{doc.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold truncate mt-0.5">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {doc.experience}+ Years Exp • {doc.reviews} Reviews
                      </p>
                    </div>
                  </div>

                  {/* Doctor Bio */}
                  <p className="text-slate-600 text-xs leading-relaxed min-h-[36px] line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onBook(doc)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs shadow-xs hover:shadow-sm transition cursor-pointer text-center"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setActiveProfileDoctor(doc)}
                    className="w-full bg-white hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl text-xs border border-slate-200 transition cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">No specialists match your search criteria.</p>
            <button
              onClick={() => {
                setSearchName('');
                setSelectedSpecialty('All');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline mt-1 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Profile Detail Slide-Over Modal */}
      <AnimatePresence>
        {activeProfileDoctor && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            {/* Backdrop Closer */}
            <div className="absolute inset-0" onClick={() => setActiveProfileDoctor(null)}></div>
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Profile Slider Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinician Profile</span>
                <button
                  onClick={() => setActiveProfileDoctor(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Details Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={activeProfileDoctor.imageUrl}
                    alt={activeProfileDoctor.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md mb-3"
                  />
                  <h2 className="font-display font-bold text-xl text-slate-900">{activeProfileDoctor.name}</h2>
                  <p className="text-xs font-semibold text-blue-600">{activeProfileDoctor.title}</p>
                  <span className="text-[11px] text-slate-400 font-medium mt-1">Department: {activeProfileDoctor.department}</span>

                  <div className="flex gap-4 mt-4">
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                      <p className="text-sm font-bold text-slate-800">{activeProfileDoctor.rating}</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase">Rating</p>
                    </div>
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                      <p className="text-sm font-bold text-slate-800">{activeProfileDoctor.experience}+ Yrs</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase">Experience</p>
                    </div>
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                      <p className="text-sm font-bold text-slate-800">{activeProfileDoctor.reviews}</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase">Reviews</p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* About Section */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    Professional Background
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeProfileDoctor.description} Dr. {activeProfileDoctor.name.split(' ').pop()} has a history of high clinical success and is recognized internationally for contributions to patient healthcare diagnostics.
                  </p>
                </div>

                {/* Clinical Credentials */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" />
                    Hospital Affiliation & Security
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Licensed to practice at Central Medical Center. Fully HIPAA-certified for secure patient consultations and Electronic Health Records (EHR) management.
                  </p>
                </div>

                {/* Consultation Timing info */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                  <h4 className="font-semibold text-blue-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Available Consultation Hours
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfileDoctor.availableSlots.slice(0, 4).map((slot) => (
                      <span key={slot} className="bg-white px-2 py-1 rounded-md text-[10px] font-semibold text-slate-700 shadow-2xs border border-slate-100">
                        {slot}
                      </span>
                    ))}
                    <span className="text-[10px] text-blue-600 font-semibold self-center ml-1">+{activeProfileDoctor.availableSlots.length - 4} more slots</span>
                  </div>
                </div>
              </div>

              {/* Profile Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const doc = activeProfileDoctor;
                    setActiveProfileDoctor(null);
                    onBook(doc);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
                <a
                  href="tel:18005550199"
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  Call Clinic
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
