import { motion } from 'motion/react';
import { Shield, Eye, Lock, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      desc: 'We collect personal information (name, email, phone) and Protected Health Information (PHI) when you book appointments or update EHR records.'
    },
    {
      icon: Shield,
      title: 'How We Protect Your Data',
      desc: 'Our servers use advanced TLS encryption in transit and AES-256 encryption at rest. All data operations strictly adhere to HIPAA security standards.'
    },
    {
      icon: Lock,
      title: 'Sharing Restrictions',
      desc: 'We never sell, rent, or trade your health data. Information is only shared with authorized medical specialists and pharmacy providers involved in your direct care.'
    },
    {
      icon: FileText,
      title: 'Patient Rights (HIPAA)',
      desc: 'Under the Health Insurance Portability and Accountability Act, you have the right to request access to, copy, or request corrections to your medical files.'
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
            HIPAA COMPLIANT POLICY
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mt-4 mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: July 1, 2026</p>
          <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl">
            At MedCore Clinic, we prioritize patient confidentiality. This document outlines our rigorous policies regarding the collection, transmission, encryption, and protection of patient medical records (PHI).
          </p>
        </div>

        {/* Main Grid Sections */}
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

        {/* Detailed Guidelines Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs space-y-6">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Detailed Security Statement</h2>
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed font-medium">
            <p>
              <strong>1. HIPAA & PHI Data Rules:</strong> We operate under strict compliance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) Rules. Patient records, diagnostics, consult notes, and schedules are protected using multiple firewalls and database access restriction policies.
            </p>
            <p>
              <strong>2. Access Log Auditing:</strong> Every staff member access log is recorded. Any unauthorized access to Patient Protected Health Information (PHI) is investigated, flagged, and triggers immediate system access lockdowns.
            </p>
            <p>
              <strong>3. Third-party APIs:</strong> Diagnostic API calls (including AI summary generations) are anonymized before being transmitted. No personal Identifiers (name, email, SSN) are coupled with clinical queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
