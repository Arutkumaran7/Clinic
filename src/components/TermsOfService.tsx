import { motion } from 'motion/react';
import { AlertCircle, Calendar, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  const sections = [
    {
      icon: AlertCircle,
      title: 'Medical Disclaimers',
      desc: 'MedCore Clinic applets facilitate scheduling and information logging. Online scheduling does not substitute for real-time emergency healthcare. Dial emergency numbers immediately in life-threatening scenarios.'
    },
    {
      icon: Calendar,
      title: 'Appointment Bookings',
      desc: 'Users agree to provide accurate, up-to-date patient names, contact emails, and consult reasons. Double booking or booking with false credentials will result in instant cancellation.'
    },
    {
      icon: ShieldCheck,
      title: 'HIPAA Security Safeguards',
      desc: 'Medical specialists and administrative personnel accessing the portal agree to securely handle credentials and log out of shared computers to prevent clinical privacy leaks.'
    },
    {
      icon: Scale,
      title: 'Liability Boundaries',
      desc: 'We are committed to system uptime, but under no circumstances is MedCore Clinic liable for indirect service dropouts, hosting glitches, or schedule adjustments made by physicians.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Hero Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xs mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-150/40">
            CLINIC TERMS OF USE
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mt-4 mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: July 1, 2026</p>
          <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl">
            By utilizing the MedCore scheduling applet and portal, you consent to the terms outlined below. Please review these rules regarding medical disclaimers, cancellations, and credentials handling.
          </p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-slate-350 transition flex flex-col gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base mb-1.5">{section.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{section.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cancellation and No-show Guidelines */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs space-y-6">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Booking Cancellation Policy</h2>
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed font-medium">
            <p>
              We strive to respect the schedules of our specialists. Patients are requested to cancel or reschedule appointments at least <strong>24 hours</strong> in advance.
            </p>
            <p>
              Frequent no-shows (defined as missing three consecutive appointments without notification) will result in temporary suspension of online booking privileges. Re-activation will require contacting the clinic's reception desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
