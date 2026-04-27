<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->orders()->with('items.product')->latest()->get()
        );
    }

    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        $order = Order::with('items.product')
            ->where('order_number', $request->order_number)
            ->firstOrFail();

        return response()->json($order);
    }

    public function show(Request $request, $orderId)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($orderId);
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'shipping_first_name' => 'required|string',
            'shipping_last_name' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_phone' => 'required|string',
            'payment_method_id' => 'required|exists:payment_methods,id',
        ]);

        $totalAmount = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'shipping_fee' => $request->shipping_fee ?? 0,
            'discount_amount' => $request->discount_amount ?? 0,
            'net_amount' => $totalAmount + ($request->shipping_fee ?? 0) - ($request->discount_amount ?? 0),
            'shipping_first_name' => $request->shipping_first_name,
            'shipping_last_name' => $request->shipping_last_name,
            'shipping_email' => $request->shipping_email ?? $request->user()->email,
            'shipping_phone' => $request->shipping_phone,
            'shipping_address' => $request->shipping_address,
            'shipping_city' => $request->shipping_city,
            'shipping_state' => $request->shipping_state,
            'shipping_zip' => $request->shipping_zip,
            'shipping_country' => $request->shipping_country ?? 'BD',
            'payment_method_id' => $request->payment_method_id,
            'payment_status' => 'pending',
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'product_variation_id' => $item['product_variation_id'] ?? null,
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        // Send confirmation email
        try {
            $email = $order->shipping_email ?? $request->user()->email;
            if ($email) {
                Mail::to($email)->send(new OrderConfirmation($order->load('items.product')));
            }
        } catch (\Throwable $e) {
            \Log::warning('Order confirmation email failed: ' . $e->getMessage());
        }

        return response()->json($order->load('items'), 201);
    }
}
