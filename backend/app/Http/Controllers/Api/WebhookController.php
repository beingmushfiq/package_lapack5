<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function courier(Request $request)
    {
        // Simple verification (could be improved based on courier spec)
        $secret = SiteSetting::getValue('webhook_secret');
        if ($secret && $request->header('X-Webhook-Secret') !== $secret) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();
        Log::info('Courier Webhook Received', $data);

        // Logic for Steadfast (example)
        if (isset($data['tracking_code'])) {
            $order = Order::where('courier_tracking_id', $data['tracking_code'])->first();
            
            if ($order) {
                $status = $this->mapSteadfastStatus($data['status']);
                $order->update([
                    'courier_status' => $data['status'],
                    'status' => $status,
                ]);
            }
        }

        return response()->json(['message' => 'Webhook processed']);
    }

    protected function mapSteadfastStatus($status)
    {
        return match ($status) {
            'delivered' => 'delivered',
            'cancelled' => 'cancelled',
            'returned' => 'returned',
            default => 'shipped',
        };
    }
}
