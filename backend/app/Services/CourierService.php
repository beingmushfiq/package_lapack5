<?php

namespace App\Services;

use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CourierService
{
    public function sendToCourier(Order $order)
    {
        $courier = SiteSetting::getValue('default_courier', 'steadfast');
        
        return match ($courier) {
            'steadfast' => $this->sendToSteadfast($order),
            'pathao' => $this->sendToPathao($order),
            'redx' => $this->sendToRedX($order),
            default => ['success' => false, 'message' => 'Invalid courier selected'],
        };
    }

    protected function sendToSteadfast(Order $order)
    {
        $apiKey = SiteSetting::getValue('steadfast_api_key');
        $secretKey = SiteSetting::getValue('steadfast_secret_key');

        if (!$apiKey || !$secretKey) {
            return ['success' => false, 'message' => 'Steadfast API keys missing'];
        }

        $response = Http::withHeaders([
            'Api-Key' => $apiKey,
            'Secret-Key' => $secretKey,
            'Content-Type' => 'application/json',
        ])->post('https://portal.steadfast.com.bd/api/v1/create_order', [
            'invoice' => $order->order_number,
            'recipient_name' => $order->customer_name,
            'recipient_phone' => $order->customer_phone,
            'recipient_address' => $order->shipping_address,
            'cod_amount' => $order->payable_amount,
            'note' => $order->customer_note,
        ]);

        $data = $response->json();

        if ($response->successful() && isset($data['status']) && $data['status'] === 200) {
            $order->update([
                'courier_name' => 'steadfast',
                'courier_tracking_id' => $data['order']['tracking_code'],
                'courier_status' => $data['order']['status'],
                'courier_response' => $data,
            ]);
            return ['success' => true, 'tracking_id' => $data['order']['tracking_code']];
        }

        Log::error('Steadfast API Error', ['response' => $data, 'order' => $order->order_number]);
        return ['success' => false, 'message' => $data['message'] ?? 'Steadfast API Error'];
    }

    protected function sendToPathao(Order $order)
    {
        // Pathao implementation requires OAuth flow, simplified here
        return ['success' => false, 'message' => 'Pathao integration in progress'];
    }

    protected function sendToRedX(Order $order)
    {
        // RedX implementation
        return ['success' => false, 'message' => 'RedX integration in progress'];
    }
}
