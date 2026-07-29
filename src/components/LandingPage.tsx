import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Search, ShieldCheck, Heart, Clock, ArrowRight, Video, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';

interface LandingPageProps {
  onNavigate: (view: 'home' | 'specialists' | 'help' | 'staff-login') => void;
  topDoctors: Doctor[];
  onBookDoctor: (doctor: Doctor) => void;
  onSearch: (query: string) => void;
}

export default function LandingPage({ onNavigate, topDoctors, onBookDoctor, onSearch }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 lg:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-section">
        {/* Left Column Content */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-100">
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></span>
            NABH Accredited • Premier Clinic in India
          </span>
          
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight tracking-tight">
            Advanced Healthcare, <br />
            <span className="text-blue-600">Simplified for You.</span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
            Experience world-class healthcare in India with our leading clinical experts. Book your in-person diagnosis at our Chennai center or request a secure virtual consultation instantly.
          </p>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto mt-2">
            <button
              onClick={() => onNavigate('specialists')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-sm"
            >
              <Search className="w-4 h-4" />
              Find a Doctor / Specialist
            </button>
          </div>

          {/* Quick Search Bar as seen in Image 4 */}
          <div className="w-full max-w-md mt-4 relative bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center shadow-xs">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search clinics, medical specialties, or diagnostic tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-600 px-3 py-2 bg-transparent focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch(searchQuery);
                  onNavigate('specialists');
                }
              }}
            />
            <button
              onClick={() => {
                onSearch(searchQuery);
                onNavigate('specialists');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Column Illustration / Image Mockup */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-100 to-teal-50 rounded-2xl blur-lg opacity-60"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&h=533"
                alt="Modern Medical Center and Diagnostic Lab in India"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-xl object-cover font-sans"
              />
              <div className="absolute top-8 left-8 bg-blue-600/95 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 border border-blue-500/30">
                <ShieldCheck className="w-4 h-4 text-teal-300 animate-pulse" />
                NABH India Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leading Specialists Section */}
      <section className="bg-slate-50 py-16 px-6 border-y border-slate-100" id="specialists-section">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Our Leading Specialists
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Expert care across disciplines, dedicated to your long-term health and wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topDoctors.slice(0, 3).map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 items-center mb-4">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border border-slate-100 shadow-inner"
                    />
                    <div>
                      <h3 className="font-display font-semibold text-slate-950 text-base">{doc.name}</h3>
                      <p className="text-xs text-blue-600 font-medium">{doc.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-slate-700 text-xs font-semibold">{doc.rating}</span>
                        <span className="text-slate-400 text-[10px]">({doc.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex gap-2 items-center justify-between">
                  <span className="text-slate-400 text-[11px] font-medium">{doc.experience}+ Years Exp.</span>
                  <button
                    onClick={() => onBookDoctor(doc)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    Book Consultation
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('specialists')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition underline decoration-2 underline-offset-4 flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              Browse all 15 medical specialists
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Schedule Your Visit Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full" id="visit-scheduling">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Schedule Your Visit
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Choose the consultation method that best fits your schedule and healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: In-Person */}
          <div 
            onClick={() => onNavigate('specialists')}
            className="bg-white rounded-2xl border border-slate-150 p-8 shadow-2xs flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-blue-200 transition duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition">In-Person Consultation</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mb-4">
              Meet with our specialists at our state-of-the-art clinic for comprehensive physical exams and diagnostics.
            </p>
            <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
              Select In-Person Specialist
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>

          {/* Card 2: Virtual */}
          <div 
            onClick={() => onNavigate('specialists')}
            className="bg-white rounded-2xl border border-slate-150 p-8 shadow-2xs flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-teal-200 transition duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition">
              <Video className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-2 group-hover:text-teal-600 transition">Virtual Wellness Check</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mb-4">
              Access expert care from home through our secure, HIPAA-compliant telehealth video conferencing platform.
            </p>
            <span className="text-xs font-bold text-teal-600 group-hover:underline flex items-center gap-1">
              Start Virtual Visit
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </section>

      {/* Care from Comfort of Home Banner */}
      <section className="px-6 mb-16 max-w-7xl mx-auto w-full">
        <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-start gap-4">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Care from the Comfort of Home
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our secure, HIPAA-compliant telehealth platform ensures you get the expert advice you need without the commute. Seamless video consultations seamlessly integrated with your health records.
            </p>

            <div className="flex flex-col gap-3 mt-2 w-full">
              <div className="flex items-center gap-3 text-slate-700 text-xs font-semibold">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                Flexible scheduling, minimal wait times
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                End-to-end encrypted medical sessions
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-xs font-semibold">
                <Heart className="w-4 h-4 text-blue-600 shrink-0" />
                Instant e-prescriptions sent to pharmacy
              </div>
            </div>

            <button
              onClick={() => onNavigate('specialists')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl mt-4 text-xs shadow-sm transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              Start Virtual Visit
            </button>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            {/* Telehealth Mockup Interface as in Image 4 */}
            <div className="relative w-full max-w-md bg-white border border-slate-200/60 rounded-2xl shadow-lg p-3">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=250"
                  alt="Doctor on secure telemedicine screen"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* Visual indicator bar with mic muted and red call button */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md">
                  <button className="p-1 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition" disabled>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
                  <button className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-500 transition" disabled>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v2a10 10 0 0010 10h2a2 2 0 002-2v-2a2 2 0 00-2-2H9.83a2 2 0 00-1.42.59l-1.41 1.41a1 1 0 01-1.41 0a1 1 0 010-1.41l1.41-1.41A2 2 0 007.5 9V5a2 2 0 00-2-2H5z" /></svg>
                  </button>
                </div>

                <span className="absolute bottom-3 right-3 text-[10px] text-white/80 bg-slate-950/40 px-2 py-0.5 rounded-md font-mono">
                  12:45
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">Dr. A. Patel</h4>
                  <p className="text-[10px] text-slate-500">General Practice</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  • Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
