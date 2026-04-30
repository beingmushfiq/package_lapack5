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
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'shipping_address' => 'required|string',
            'district' => 'required|string',
            'area' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        $totalAmount = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });

        $shippingCost = $request->shipping_cost ?? 0;
        $discountAmount = $request->discount_amount ?? 0;
        $payableAmount = $totalAmount + $shippingCost - $discountAmount;

        $order = Order::create([
            'user_id' => $request->user()?->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discountAmount,
            'payable_amount' => $payableAmount,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email ?? $request->user()?->email,
            'shipping_address' => $request->shipping_address,
            'district' => $request->district,
            'area' => $request->area,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'customer_note' => $request->notes,
        ]);

        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'product_name' => \App\Models\Product::find($item['product_id'])->name,
                'quantity' => $item['quantity'],
                'price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
                'variation' => $item['variation'] ?? null,
            ]);
        }

        // Send confirmation email
        try {
            $email = $order->customer_email;
            if ($email) {
                Mail::to($email)->send(new OrderConfirmation($order->load('items.product')));
            }
        } catch (\Throwable $e) {
            \Log::warning('Order confirmation email failed: ' . $e->getMessage());
        }

        // Facebook Conversions API
        try {
            $capi = new \App\Services\FacebookCAPIService();
            $capi->trackPurchase(
                value: (float) $order->payable_amount,
                currency: 'BDT',
                contentIds: collect($request->items)->pluck('product_id')->toArray(),
                userData: [
                    'em' => $order->customer_email,
                    'ph' => $order->customer_phone,
                    'fn' => $order->customer_name,
                    'ct' => $order->district,
                    'country' => 'BD',
                    'client_ip_address' => $request->ip(),
                    'client_user_agent' => $request->userAgent(),
                ],
                eventId: 'purchase_' . $order->order_number,
                orderNumber: $order->order_number
            );
        } catch (\Throwable $e) {
            \Log::warning('Facebook CAPI Purchase event failed: ' . $e->getMessage());
        }

        return response()->json($order->load('items'), 201);
    }

    /**
     * Download PDF invoice.
     */
    public function downloadInvoice(Order $order)
    {
        // Ensure user has access (either admin or the customer)
        $user = auth()->user();
        if ($user && ($user->hasRole('Super Admin') || $user->id === $order->user_id)) {
            $order->load(['items', 'items.product']);
            
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.invoice', compact('order'));
            
            return $pdf->download("invoice-{$order->order_number}.pdf");
        }

        abort(403);
    }
}
