import { X, Trash2, Plus, Minus, CreditCard, Truck, CheckCircle2, Wallet, Smartphone, Globe, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { formatPrice } from "../lib/utils";
import { useAuth } from "../lib/AuthContext";
import { usePaymentMethods, useShippingZones } from "../lib/queries";
import api from "../lib/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variation?: string;
}

interface PurchasePopupProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const PAYMENT_METHOD_ICONS: Record<string, any> = {
  'cod': Wallet,
  'bkash': Smartphone,
  'nagad': Smartphone,
  'rocket': Smartphone,
  'ssl': Globe,
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  'bkash': 'bg-pink-500',
  'nagad': 'bg-orange-500',
  'rocket': 'bg-purple-600',
  'ssl': 'bg-blue-600',
};

export default function PurchasePopup({ isOpen, onClose, cartItems: initialItems }: PurchasePopupProps) {
  const { user } = useAuth();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const { data: shippingZones = [] } = useShippingZones();

  const [items, setItems] = useState(initialItems);
  const [shippingZoneId, setShippingZoneId] = useState<number | string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | string | null>(null);
  const [payOnlyShipping, setPayOnlyShipping] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    number: '', 
    address: '',
    email: '',
    city: '',
    state: '',
    zip: '',
    country: 'BD'
  });
  const [isItemsCollapsed, setIsItemsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update internal items when the popup opens or initialItems changes
  useEffect(() => {
    if (isOpen) {
      setItems(initialItems);
      setError('');
    }
  }, [isOpen, initialItems]);

  useEffect(() => {
    if (shippingZones.length > 0 && !shippingZoneId) {
      setShippingZoneId(shippingZones[0].id);
    }
    if (paymentMethods.length > 0 && !paymentMethodId) {
      setPaymentMethodId(paymentMethods[0].id);
    }
  }, [shippingZones, paymentMethods, shippingZoneId, paymentMethodId]);

  const selectedShippingZone = shippingZones.find((z: any) => z.id === shippingZoneId);
  const shippingCost = selectedShippingZone?.cost || 0;

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const updateVariation = (id: string, variation: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, variation } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  const finalAmount = payOnlyShipping ? shippingCost : total;

  const handleConfirmPurchase = async () => {
    if (!user) {
      setError('Please login to place an order.');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.number || !formData.address || !shippingZoneId || !paymentMethodId) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          // If the backend expects product_variation_id, we need to map it here
          // For now, we'll send null or a default if available
          product_variation_id: null 
        })),
        shipping_first_name: formData.firstName,
        shipping_last_name: formData.lastName,
        shipping_address: formData.address,
        shipping_city: formData.city || selectedShippingZone?.name || '',
        shipping_phone: formData.number,
        shipping_email: formData.email || user.email,
        shipping_state: formData.state,
        shipping_zip: formData.zip,
        shipping_country: formData.country,
        payment_method_id: paymentMethodId,
        shipping_fee: shippingCost,
        pay_only_shipping: payOnlyShipping
      };

      const { data } = await api.post('/orders', orderData);
      
      toast.success('Order placed successfully!', {
        duration: 5000,
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        },
      });

      // Clear cart or navigate to track order
      onClose();
      // Optional: window.location.href = `/track-order?order_number=${data.order_number}`;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message, {
        style: {
          borderRadius: '16px',
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] md:max-h-[85vh] bg-white z-[210] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Complete Purchase</h2>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              {/* Product List */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button 
                  onClick={() => setIsItemsCollapsed(!isItemsCollapsed)}
                  className="w-full bg-gray-50/50 px-3 py-2 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Items in Cart</p>
                    <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full uppercase">{items.length} Product(s)</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isItemsCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {!isItemsCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gray-100 max-h-[240px] overflow-y-auto custom-sidebar-scrollbar">
                        {items.map((item) => (
                          <div key={item.id} className="p-3 flex gap-3 group hover:bg-gray-50/50 transition-colors">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <img 
                                src={item.image} 
                                className="w-full h-full rounded-xl object-cover border border-gray-100 shadow-sm" 
                                referrerPolicy="no-referrer" 
                              />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md transition-all hover:scale-110 z-10"
                                title="Remove item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="text-[11px] font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{item.name}</h3>
                                <span className="text-[11px] font-black text-emerald-600 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <select 
                                      className="appearance-none text-[9px] font-black bg-white border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all cursor-pointer uppercase tracking-tighter shadow-sm"
                                      value={item.variation || 'Black / M'}
                                      onChange={(e) => updateVariation(item.id, e.target.value)}
                                    >
                                      <option value="Black / M">Black / M</option>
                                      <option value="Blue / L">Blue / L</option>
                                      <option value="White / S">White / S</option>
                                    </select>
                                    <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400 rotate-90 pointer-events-none" />
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 bg-gray-100/50 rounded-xl border border-gray-200 p-1">
                                  <button 
                                    onClick={() => updateQuantity(item.id, -1)} 
                                    className="w-6 h-6 flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 border border-gray-100 rounded-lg shadow-sm transition-all active:scale-90"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-[11px] font-black text-gray-900">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, 1)} 
                                    className="w-6 h-6 flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 border border-gray-100 rounded-lg shadow-sm transition-all active:scale-90"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Breakdown */}
              <div className="bg-emerald-50/30 rounded-xl p-3 border border-emerald-100/50 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>Shipping ({selectedShippingZone?.name || 'Loading...'})</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="h-px bg-emerald-100/50 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-900 uppercase">Total</span>
                  <span className="text-sm font-black text-emerald-600">{formatPrice(total)}</span>
                </div>
                {payOnlyShipping && (
                  <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-emerald-200">
                    <span className="text-[9px] font-black text-blue-600 uppercase">Pay Now (Shipping)</span>
                    <span className="text-xs font-black text-blue-600">{formatPrice(shippingCost)}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-lg text-center">
                  {error}
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Delivery Info</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                    value={formData.number}
                    onChange={e => setFormData({...formData, number: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email (Optional)" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <input 
                  placeholder="Full Delivery Address" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  {shippingZones.map((zone: any) => (
                    <button
                      key={zone.id}
                      onClick={() => setShippingZoneId(zone.id)}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight border-2 transition-all ${shippingZoneId === zone.id ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                    >
                      {zone.name} (+{zone.cost})
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Payment</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {paymentMethods.map((method: any) => {
                    const Icon = PAYMENT_METHOD_ICONS[method.code] || Wallet;
                    const color = PAYMENT_METHOD_COLORS[method.code] || 'bg-gray-200';
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethodId(method.id)}
                        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all ${paymentMethodId === method.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-50 bg-gray-50'}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color} text-white`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className={`text-[7px] font-black uppercase tracking-tighter text-center leading-none ${paymentMethodId === method.id ? 'text-emerald-600' : 'text-gray-500'}`}>{method.name}</span>
                      </button>
                    );
                  })}
                </div>
                
                <label className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl cursor-pointer group border border-blue-100">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={payOnlyShipping}
                      onChange={e => setPayOnlyShipping(e.target.checked)}
                    />
                    <div className="w-4 h-4 border-2 border-blue-200 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-blue-900 uppercase leading-none">Pay Shipping Only</p>
                    <p className="text-[7px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Pay ৳{shippingCost} now, rest on delivery</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-gray-100">
              <button 
                onClick={handleConfirmPurchase}
                disabled={isSubmitting || items.length === 0}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>{isSubmitting ? 'Processing...' : 'Confirm Purchase'}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{formatPrice(finalAmount)}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
