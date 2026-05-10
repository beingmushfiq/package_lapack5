<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox Payment Gateway</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 flex items-center justify-center min-h-screen p-4">
    <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div class="p-8 text-center border-b border-slate-50">
            <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>
            <h1 class="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Sandbox Payment</h1>
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Simulating {{ strtoupper($method) }} Gateway</p>
        </div>

        <div class="p-8 space-y-6">
            <div class="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                    <span class="text-xs font-black text-slate-900">{{ $order->order_number }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                    <span class="text-xl font-black text-emerald-600">৳{{ number_format($amount, 2) }}</span>
                </div>
            </div>

            <div class="space-y-3">
                <form action="{{ route('payment.callback') }}" method="POST">
                    @csrf
                    <input type="hidden" name="order_id" value="{{ $order->id }}">
                    <input type="hidden" name="status" value="success">
                    <button type="submit" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                        Simulate Success
                    </button>
                </form>

                <form action="{{ route('payment.callback') }}" method="POST">
                    @csrf
                    <input type="hidden" name="order_id" value="{{ $order->id }}">
                    <input type="hidden" name="status" value="fail">
                    <button type="submit" class="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98]">
                        Simulate Failure
                    </button>
                </form>
            </div>
        </div>

        <div class="p-6 bg-slate-50 text-center">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">This is a secure sandbox environment</p>
        </div>
    </div>
</body>
</html>
