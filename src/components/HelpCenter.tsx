import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Calendar, FileText, Smartphone, Clipboard, Phone, Mail, BookOpen, ThumbsUp, Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { FAQItem } from '../types';
import { sendSupportEnquiry } from '../services/email';

interface HelpCenterProps {
  faqItems: FAQItem[];
  onNavigate: (view: 'home' | 'specialists' | 'help' | 'staff-login') => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'art-booking',
    title: 'How to Book & Manage Your Appointment',
    category: 'Appointments & Booking',
    summary: 'A complete step-by-step walk-through of choosing specialists and choosing slot preferences.',
    content: [
      '1. Open the "Home" page or navigate directly to the "Find Doctor" section in the primary menu bar.',
      '2. Use our dynamic search box to look for clinical specialties, doctor names, or diagnostic fields.',
      '3. Review the available doctors, clinical experiences, and patient feedback ratings on the specialist grid.',
      '4. Click the "Book Appointment" button on your preferred specialist\'s profile card.',
      '5. Choose your mode of consultation: "In-Person Consultation" at our Chennai center or "Virtual Telehealth" on-screen.',
      '6. Select a preferred day in July 2026 and choose an open hourly time slot.',
      '7. Enter the patient\'s full name, clinical reason or notes, and click "Book Consultation" to lock in the appointment.',
      '8. Note: For any reschedules or cancellations, you can contact our central front-desk desk anytime.'
    ]
  },
  {
    id: 'art-billing',
    title: 'Billing Policies & Insurance Partners',
    category: 'Billing & Insurance',
    summary: 'Understand claims process, accepted cashless insurers, and available payment modes.',
    content: [
      '• Cashless Insurance Network: We are proudly paneled with India\'s premier healthcare insurers including Star Health, HDFC ERGO, ICICI Lombard, Max Bupa, Tata AIG, and Ayushman Bharat PM-JAY.',
      '• Cashless Claims Processing: Please carry your physical or e-insurance card along with a government-approved ID to our reception desk 15 minutes before your slot.',
      '• Flexible Billing: For self-paying patients, we accept all leading UPI networks (GPAY, PhonePe, Paytm), credit cards, debit cards, and secure netbanking transfers.',
      '• Digital Receipts: Invoice summaries and payment receipts are instantly shared with you over WhatsApp and verified email for your records.'
    ]
  },
  {
    id: 'art-diagnostics',
    title: 'Accessing Lab Reports & Diagnostic Panels',
    category: 'Other Help & Diagnostics',
    summary: 'Guidelines on routine diagnostic turnarounds, security checks, and report deliveries.',
    content: [
      '• General Turnaround: Routine hematology and biochemical reports are finalized within 12 to 24 hours. Advanced diagnostic scans or pathology screenings take up to 48 hours.',
      '• WhatsApp & Email Delivery: To safeguard your privacy, a high-security PDF containing your verified medical outcomes is dispatched straight to your WhatsApp and registered email.',
      '• Clinician Approval: All outcomes are directly countersigned by our specialist clinicians. If a result requires urgent attention, our team will call you immediately to schedule a follow-up.'
    ]
  },
  {
    id: 'art-refills',
    title: 'Prescription Refills & Pharmacy Pick-up',
    category: 'Prescription Refills',
    summary: 'Instructions on medication renewals and direct local home deliveries.',
    content: [
      '• Follow-up Directives: For patient safety, refills for chronic medication plans require a brief physical or virtual medical review if your previous consultation was more than 3 months ago.',
      '• Pharmacy Delivery: We offer direct pharmacy home delivery services across Chennai, or you can opt for quick curbside pick-up at our physical pharmacy counter in T. Nagar, Chennai.',
      '• Requesting Renewals: To request a quick renewal, simply contact our diagnostic center helpline with your medical case reference ID.'
    ]
  },
  {
    id: 'art-telehealth',
    title: 'Virtual Telehealth Setup & Best Practices',
    category: 'Technical Support',
    content: [
      '• Technical Requirements: No external software or mobile apps are needed. Virtual consults are fully supported on standard mobile and desktop browsers (Chrome, Safari, Edge).',
      '• Internet & Camera: Ensure a stable internet connection, allow browser camera and microphone permissions, and position yourself in a quiet, well-lit room.',
      '• Access Link: A secure link is automatically sent to you via SMS and Email exactly 10 minutes prior to your scheduled consultation slot. Click it to enter the clinician\'s private waiting room.'
    ],
    summary: 'Step-by-step instructions for troubleshooting browser camera access and streaming consults.'
  }
];

export default function HelpCenter({ faqItems, onNavigate }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article>(ARTICLES[0]);
  
  // Feedback Desk Form state (the "Other Help Feature")
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('General Inquiry');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const libraryRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectArticle = (articleId: string) => {
    const art = ARTICLES.find(a => a.id === articleId);
    if (art) {
      setSelectedArticle(art);
      libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFeedbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMessage) return;

    setIsLoading(true);
    setError(null);
    try {
      await sendSupportEnquiry({
        name: feedbackName,
        email: feedbackEmail,
        subject: feedbackType,
        priority: 'Normal',
        message: feedbackMessage
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackMessage('');
        setIsSubmitted(false);
        setError(null);
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans" id="help-center-root">
      {/* Help Hero Banner */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
            NABH Accredited Helpdesk
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            How can we assist you today?
          </h1>
          <p className="text-slate-500 text-sm max-w-lg">
            Find immediate answers on clinic procedures, explore full offline feature guides, or connect with our support desk.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl relative mt-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs (e.g., 'insurance', 'telehealth', 'location'...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </section>

      {/* Top Categories Grid (Updated to replace Patient Portal Access) */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <h2 className="font-display font-bold text-xl text-slate-900 mb-8" id="top-categories-heading">
          Help Categories & Feature Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Appointments & Booking</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Step-by-step instructions on selecting expert specialists, dates, and times.
              </p>
            </div>
            <button 
              onClick={() => handleSelectArticle('art-booking')} 
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
            >
              Read guide <span className="text-base">→</span>
            </button>
          </div>

          {/* Card 2: Other Help & Diagnostics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Other Help & Diagnostics</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Details on lab panels, radiology timelines, and secure WhatsApp result deliveries.
              </p>
            </div>
            <button 
              onClick={() => handleSelectArticle('art-diagnostics')} 
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition flex items-center gap-1 cursor-pointer"
            >
              Read guide <span className="text-base">→</span>
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Billing & Insurance</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Cashless insurance networks, claims coordinating, and accepted digital UPI payments.
              </p>
            </div>
            <button 
              onClick={() => handleSelectArticle('art-billing')} 
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
            >
              Read guide <span className="text-base">→</span>
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Technical Support</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Best practices for virtual telehealth video consulting, microphones, and camera setups.
              </p>
            </div>
            <button 
              onClick={() => handleSelectArticle('art-telehealth')} 
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
            >
              Read guide <span className="text-base">→</span>
            </button>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                <Clipboard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Prescription Refills</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Medication renewal policies, home delivery guidelines, and curbside local pick-up.
              </p>
            </div>
            <button 
              onClick={() => handleSelectArticle('art-refills')} 
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition flex items-center gap-1 cursor-pointer"
            >
              Read guide <span className="text-base">→</span>
            </button>
          </div>

          {/* Card 6: Direct Call Desk */}
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white text-base mb-2">Direct Support Helpline</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-6">
                Our support desk is operational 24/7. Call our certified Indian clinical facility immediately for emergency advice.
              </p>
            </div>
            <a
              href="tel:04521241244444"
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold text-xs py-2.5 rounded-xl text-center transition block"
            >
              Call 0452 124 124 4444
            </a>
          </div>
        </div>
      </section>

      {/* Offline Feature Guides Article Viewer Section */}
      <section ref={libraryRef} className="bg-slate-50/50 py-16 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Self-Serve Center</span>
            <h2 className="font-display font-bold text-2xl text-slate-950">
              Interactive Feature Guides & Articles
            </h2>
            <p className="text-slate-500 text-xs">
              Complete, offline instructions for every feature on our clinic platform. No outbound links.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Selector Panel */}
            <div className="lg:col-span-4 space-y-3">
              {ARTICLES.map((art) => {
                const isActive = selectedArticle.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm leading-snug">{art.title}</h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {art.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Article Reading View */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl mt-3 mb-4 pb-3 border-b border-slate-100">
                {selectedArticle.title}
              </h3>
              
              <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                {selectedArticle.content.map((paragraph, i) => (
                  <p key={i} className={paragraph.startsWith('•') || paragraph.match(/^\d+\./) ? 'pl-2' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50 p-4 rounded-xl">
                <span className="text-[11px] text-slate-500 font-semibold">Was this static article helpful?</span>
                <button 
                  onClick={() => alert('Thank you for your valuable feedback!')} 
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs px-3 py-1.5 rounded-lg shadow-2xs font-semibold cursor-pointer transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                  Mark as Helpful
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-slate-50/50 py-16 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Quick answers to common patient inquiries.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-slate-200/80 rounded-xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between font-medium text-slate-800 hover:text-slate-950 transition text-sm cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-slate-50/40 border-t border-slate-100"
                        >
                          <p className="px-6 py-4 text-slate-600 text-xs leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-400 py-8 text-sm">No FAQs match your search query.</p>
            )}
          </div>
        </div>
      </section>

      {/* Still need help? Support box & OTHER HELP FEATURE (Form Desk) */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start gap-12 bg-white shadow-xs">
          {/* Support Info */}
          <div className="flex flex-col gap-5 max-w-md w-full">
            <h3 className="font-display font-bold text-2xl text-slate-950 tracking-tight">
              Still need assistance?
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Our patient-support team is fully active Monday through Friday, 8:00 AM to 6:00 PM to resolve clinical, scheduling, or technical requests.
            </p>

            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HELPLINE NUMBER</p>
                  <p className="text-sm font-bold text-slate-800">0452 124 124 4444</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMAIL ASSISTANCE</p>
                  <p className="text-sm font-bold text-slate-800">arutkumaran19@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Help Feature: Feedback & Custom Support Ticket Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 w-full max-w-xl">
            <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Clinic Support & Feedback Desk
            </h4>
            <p className="text-slate-500 text-xs mb-6">
              Submit your specific question, feedback, or request directly to our clinical operations team.
            </p>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">Inquiry Received Successfully</h5>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                  Thank you for submitting. Our patient care officers will review your inquiry and follow up within 24 operational hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email ID</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inquiry Category</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                  >
                    <option value="General Inquiry">General Clinic Inquiry</option>
                    <option value="Diagnostics Assist">Diagnostics & Lab Support</option>
                    <option value="Patient Experience">Feedback & Complaint</option>
                    <option value="Billing Dispute">Billing / Invoice Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inquiry / Feedback Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details of your inquiry or feedback so our clinical support specialists can resolve it promptly..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                {error && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
