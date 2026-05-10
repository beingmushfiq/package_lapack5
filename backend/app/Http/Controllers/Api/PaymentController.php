<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Initiate payment for an order.
     */
    public function initiate(Request $request, Order $order)
    {
        $method = $request->payment_method ?? $order->payment_method;

        if ($method === 'cod') {
            return response()->json([
                'success' => true,
                'message' => 'Cash on delivery selected.',
                'redirect_url' => null
            ]);
        }

        // Mock SSLCommerz Sandbox Simulation
        if ($method === 'ssl' || $method === 'bkash' || $method === 'nagad') {
            $paymentUrl = route('payment.sandbox', [
                'order_id' => $order->id,
                'amount' => $order->payable_amount,
                'method' => $method
            ]);

            return response()->json([
                'success' => true,
                'redirect_url' => $paymentUrl
            ]);
        }

        return response()->json(['error' => 'Invalid payment method'], 400);
    }

    /**
     * Sandbox Payment Page (Simulation)
     */
    public function sandboxPage(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $method = $request->method;
        $amount = $request->amount;

        return view('payment.sandbox', compact('order', 'method', 'amount'));
    }

    /**
     * Payment Callback (Simulation)
     */
    public function callback(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $status = $request->status; // 'success' or 'fail'

        if ($status === 'success') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing'
            ]);
            
            return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . '/order-success?order=' . $order->order_number);
        }

        return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . '/order-failed?order=' . $order->order_number);
    }
}
