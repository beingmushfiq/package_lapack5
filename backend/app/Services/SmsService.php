<?php

namespace App\Services;

use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    public function sendOrderSms(Order $order, string $type)
    {
        if (!SiteSetting::getValue('sms_enabled', false)) {
            return;
        }

        $template = SiteSetting::getValue("{$type}_sms");
        if (!$template) {
            return;
        }

        $message = $this->parseTemplate($template, $order);
        $this->sendSms($order->customer_phone, $message);
    }

    protected function parseTemplate(string $template, Order $order)
    {
        $placeholders = [
            '{order_number}' => $order->order_number,
            '{amount}' => '৳' . number_format($order->payable_amount, 2),
            '{courier}' => ucfirst($order->courier_name ?? ''),
            '{tracking_id}' => $order->courier_tracking_id ?? '',
            '{customer_name}' => $order->customer_name,
        ];

        return str_replace(array_keys($placeholders), array_values($placeholders), $template);
    }

    public function sendSms(string $phone, string $message)
    {
        $apiKey = SiteSetting::getValue('sms_api_key');
        $senderId = SiteSetting::getValue('sms_sender_id');

        if (!$apiKey) {
            Log::warning('SMS API key missing, cannot send SMS.');
            return;
        }

        // Example for a common BD provider (e.g. BulkSMSBD)
        try {
            $response = Http::get('https://bulksmsbd.net/api/smsapi', [
                'api_key' => $apiKey,
                'type' => 'text',
                'number' => $phone,
                'senderid' => $senderId,
                'message' => $message,
            ]);

            \App\Models\SmsLog::create([
                'phone' => $phone,
                'message' => $message,
                'status' => $response->successful() ? 'sent' : 'failed',
                'provider' => 'bulksmsbd',
                'response' => $response->body(),
            ]);

            if (!$response->successful()) {
                Log::error('SMS Gateway Error', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('SMS Sending Exception: ' . $e->getMessage());
        }
    }
}
