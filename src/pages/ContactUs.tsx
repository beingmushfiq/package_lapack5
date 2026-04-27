import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../lib/api";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-6">Contact Us</h1>
            <p className="text-gray-500 font-bold mb-8">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest">Office Address</h3>
                  <p className="text-gray-500 font-bold text-sm">123 Commerce St, Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest">Phone</h3>
                  <p className="text-gray-500 font-bold text-sm">+880 1234 567890</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest">Email</h3>
                  <p className="text-gray-500 font-bold text-sm">info@kartly.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            {status && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {status.message}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none text-gray-900 focus:border-[#0056b3] focus:ring-4 focus:ring-[#0056b3]/10 transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none text-gray-900 focus:border-[#0056b3] focus:ring-4 focus:ring-[#0056b3]/10 transition-all font-bold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  rows={4} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none text-gray-900 focus:border-[#0056b3] focus:ring-4 focus:ring-[#0056b3]/10 transition-all font-bold"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#0056b3] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#004494] transition-colors shadow-lg shadow-[#0056b3]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
