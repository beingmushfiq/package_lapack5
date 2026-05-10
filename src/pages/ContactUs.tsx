import { MapPin, Phone, Mail, Loader2, Send, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import api from "../lib/api";
import { useSiteSettings } from "../lib/queries";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";

export default function ContactUs() {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const siteEmail = settings?.site_email || "hello@amarshop.com.bd";
  const sitePhone = settings?.site_phone || "+880 1234 567890";
  const siteAddress = settings?.site_address || "Dhanmondi, Dhaka-1205, BD";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again later.' });
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <MessageCircle className="w-3 h-3" />
            Get in Touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-gray-900 uppercase tracking-tight mb-6"
          >
            We're here to <span className="text-emerald-600">Help</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 font-bold text-sm sm:text-base uppercase tracking-wider leading-relaxed"
          >
            Have a question, feedback, or need assistance? Reach out to our dedicated support team.
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Our Office</h3>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{siteAddress}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Phone</h3>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{sitePhone}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Available 9am - 8pm</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Email</h3>
              <p className="text-sm font-bold text-gray-500 leading-relaxed break-all">{siteEmail}</p>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Response Time</h4>
                  <p className="text-xs font-bold">Within 24 Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Send a <span className="text-emerald-600">Message</span></h2>
              
              {status && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-8 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest ${
                    status.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {status.message}
                </motion.div>
              )}

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm outline-none text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold placeholder:text-gray-300"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm outline-none text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold placeholder:text-gray-300"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm outline-none text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold appearance-none cursor-pointer"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Product Support</option>
                    <option>Returns & Refunds</option>
                    <option>Business Inquiry</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Your Message</label>
                  <textarea 
                    rows={6} 
                    required 
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm outline-none text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold placeholder:text-gray-300 resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <div className="sm:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
