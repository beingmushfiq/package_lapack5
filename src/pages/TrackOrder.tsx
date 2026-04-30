import { useState, useEffect } from "react";
import { Truck, Search, MapPin, Package, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('order_number') || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [isTracking, setIsTracking] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId) return;
    
    setIsTracking(true);
    setOrder(null);
    
    try {
      const { data } = await api.get(`/track-order?order_number=${orderId}`);
      setOrder(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Order not found. Please check your Order ID.");
    } finally {
      setIsTracking(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      handleTrack();
    }
  }, []);

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const idx = steps.indexOf(status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
              <Truck className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">
              Track Your <span className="text-emerald-600">Order</span>
            </h1>
            <p className="text-sm font-bold text-gray-500">
              Enter your order ID below to check the current status of your shipment.
            </p>
          </div>

          {/* Tracking Form */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 mb-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (e.g., ORD-12345)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm outline-none text-gray-900 placeholder:text-gray-400 focus:border-[#0056b3] focus:ring-4 focus:ring-[#0056b3]/10 transition-all font-bold"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isTracking}
                className="bg-[#0056b3] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#004494] transition-colors shadow-lg shadow-[#0056b3]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isTracking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track Now"}
              </button>
            </form>
          </div>

          {/* Tracking Result */}
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                    <p className="text-lg font-black text-gray-900">{order.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-black text-emerald-600 uppercase tracking-tight">{order.status}</p>
                  </div>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-100" />
                  
                  {/* Status Steps */}
                  <div className="space-y-8 relative">
                    {[
                      { icon: CheckCircle2, title: 'Order Placed', desc: 'We have received your order.', status: 'pending' },
                      { icon: CheckCircle2, title: 'Confirmed', desc: 'Your order has been verified.', status: 'confirmed' },
                      { icon: Package, title: 'Processing', desc: 'Your order is being packed.', status: 'processing' },
                      { icon: Truck, title: 'Shipped', desc: 'Your order is on the way.', status: 'shipped' },
                      { icon: MapPin, title: 'Delivered', desc: 'Package has been delivered.', status: 'delivered' }
                    ].map((step, idx) => {
                      const isActive = getStatusStep(order.status) >= idx;
                      return (
                        <div key={idx} className={cn("flex gap-6 transition-opacity duration-500", !isActive && "opacity-30")}>
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                            isActive ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400"
                          )}>
                            <step.icon className={cn("w-6 h-6", isActive && idx === getStatusStep(order.status) && "animate-pulse")} />
                          </div>
                          <div className="pt-2">
                            <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">{step.title}</h3>
                            <p className="text-xs font-bold text-gray-500 mt-1">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
