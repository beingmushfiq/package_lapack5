import { HelpCircle, Mail, Phone, MessageSquare } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
              <HelpCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">
              How Can We <span className="text-emerald-600">Help You?</span>
            </h1>
            <form onSubmit={(e) => { e.preventDefault(); alert('Search coming soon!'); }} className="relative max-w-xl mx-auto mt-8">
              <input 
                type="text" 
                required
                placeholder="Search for answers..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm outline-none text-gray-900 placeholder:text-gray-400 focus:border-[#0056b3] focus:ring-4 focus:ring-[#0056b3]/10 transition-all font-bold shadow-sm"
              />
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div onClick={() => window.location.href = 'tel:+8801234567890'} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group">
              <Phone className="w-8 h-8 text-[#0056b3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-gray-900 uppercase tracking-widest mb-2">Call Us</h3>
              <p className="text-sm font-bold text-gray-500">+880 1234 567890</p>
            </div>
            <div onClick={() => window.location.href = 'mailto:info@kartly.com'} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group">
              <Mail className="w-8 h-8 text-[#0056b3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-gray-900 uppercase tracking-widest mb-2">Email Us</h3>
              <p className="text-sm font-bold text-gray-500">info@kartly.com</p>
            </div>
            <div onClick={() => alert('Live Chat initiated')} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group">
              <MessageSquare className="w-8 h-8 text-[#0056b3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-gray-900 uppercase tracking-widest mb-2">Live Chat</h3>
              <p className="text-sm font-bold text-gray-500">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
