import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, ChevronRight, FileText, MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import api from "../lib/api";
import { useAuth } from "../lib/AuthContext";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  total: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  payable_amount: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">My Orders</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">No orders yet</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">When you make a purchase, it will appear here.</p>
            <button 
              onClick={() => window.location.href = '/all-products'}
              className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 tracking-tight uppercase">Order #{order.order_number}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border", getStatusColor(order.status))}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/orders/${order.id}/invoice`, '_blank')}
                      className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all group"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <a 
                      href={`/track-order?order=${order.order_number}&phone=${user?.phone}`}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      Track Order
                    </a>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="p-4 sm:p-6 bg-gray-50/30">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                            {item.quantity}x
                          </div>
                          <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight line-clamp-1">
                            {item.product_name}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-gray-900 tracking-tight">
                          ৳{item.total}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Amount</span>
                    <span className="text-sm font-black text-emerald-600">৳{order.payable_amount}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
