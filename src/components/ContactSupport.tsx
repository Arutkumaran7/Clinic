import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { sendSupportEnquiry } from '../services/email';

interface ContactSupportProps {
  onBack: () => void;
}

export default function ContactSupport({ onBack }: ContactSupportProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Appointment Query');
  const [priority, setPriority] = useState('Normal');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await sendSupportEnquiry({ name, email, subject, priority, message });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('Appointment Query');
    setPriority('Normal');
    setMessage('');
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Hero Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xs mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-150/40">
            GET IN TOUCH
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mt-4 mb-2">Contact Support</h1>
          <p className="text-slate-500 text-sm leading-relaxed mt-2 max-w-xl">
            Have questions about booking consultations, EHR database sync, or clinical hours? Send our support team a message or reach us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Support Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h3 className="font-display font-bold text-slate-950 text-lg mb-4">Send a Secure Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Topic</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                      >
                        <option>Appointment Query</option>
                        <option>EHR Database Access</option>
                        <option>Billing & Insurance</option>
                        <option>General Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Urgency Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                      >
                        <option>Normal</option>
                        <option>Urgent (PHI Sync)</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Detailed Message</label>
                    <textarea
                      required
                      placeholder="Please describe your query in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-8 font-medium">
                    Thank you, {name}. Our support team has logged your inquiry regarding <strong>{subject}</strong>. We will reply to {email} within 2 hours.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-750 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Details Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Cards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="font-display font-bold text-slate-950 text-base">MedCore Contact Card</h3>
              
              <div className="flex gap-4 items-start text-xs font-semibold">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Emergency Helpline</span>
                  <span className="text-slate-800 font-bold text-sm">0452 124 124 4444</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs font-semibold">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">E-Mail Address</span>
                  <span className="text-slate-800 text-sm">arutkumaran19@gmail.com</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs font-semibold">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Clinic Location</span>
                  <span className="text-slate-800 leading-relaxed block text-sm">15, Khader Nawaz Khan Road, Nungambakkam, Chennai, 600006, Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            {/* Clinic hours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col gap-4">
              <h3 className="font-display font-bold text-slate-950 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Working Hours
              </h3>
              
              <div className="text-xs space-y-2 text-slate-500 font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Monday - Friday</span>
                  <span className="text-slate-800">08:00 AM - 05:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Saturday</span>
                  <span className="text-slate-800">09:00 AM - 02:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-rose-600">Closed (Helpline Available)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
