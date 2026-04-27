<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookCAPIService
{
    protected string $apiVersion = 'v21.0';
    protected string $baseUrl = 'https://graph.facebook.com';

    /**
     * Send an event to Facebook Conversions API.
     *
     * @param string $eventName  Standard event name (e.g. Purchase, AddToCart, ViewContent)
     * @param array  $eventData  Custom data (value, currency, content_ids, etc.)
     * @param array  $userData   User data for matching (email, phone, ip, user_agent, fbc, fbp)
     * @param string|null $eventId  Unique event ID for deduplication with browser Pixel
     */
    public function sendEvent(
        string $eventName,
        array $eventData = [],
        array $userData = [],
        ?string $eventId = null
    ): void {
        $pixelId = SiteSetting::getValue('fb_pixel_id');
        $accessToken = SiteSetting::getValue('fb_capi_access_token');
        $capiEnabled = SiteSetting::getValue('fb_capi_enabled');
        $testEventCode = SiteSetting::getValue('fb_test_event_code');

        if ($capiEnabled !== 'true' && $capiEnabled !== true) {
            return;
        }

        if (!$pixelId || !$accessToken) {
            Log::warning('Facebook CAPI: Missing pixel_id or access_token.');
            return;
        }

        // Hash user data for privacy (Facebook requires SHA-256)
        $hashedUserData = $this->hashUserData($userData);

        $event = [
            'event_name' => $eventName,
            'event_time' => time(),
            'action_source' => 'website',
            'user_data' => $hashedUserData,
            'custom_data' => $eventData,
        ];

        if ($eventId) {
            $event['event_id'] = $eventId;
        }

        if (!empty($userData['event_source_url'])) {
            $event['event_source_url'] = $userData['event_source_url'];
        }

        $payload = [
            'data' => [json_encode([$event])],
            'access_token' => $accessToken,
        ];

        // Include test event code if set (for debugging in Events Manager)
        if ($testEventCode) {
            $payload['test_event_code'] = $testEventCode;
        }

        $url = "{$this->baseUrl}/{$this->apiVersion}/{$pixelId}/events";

        try {
            $response = Http::post($url, $payload);

            if (!$response->successful()) {
                Log::error('Facebook CAPI Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'event' => $eventName,
                ]);
            } else {
                Log::info('Facebook CAPI: Event sent', [
                    'event' => $eventName,
                    'events_received' => $response->json('events_received'),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Facebook CAPI Exception: ' . $e->getMessage(), [
                'event' => $eventName,
            ]);
        }
    }

    /**
     * Hash user data fields per Facebook requirements (SHA-256, lowercase, trimmed).
     */
    protected function hashUserData(array $userData): array
    {
        $hashed = [];

        // Fields that need hashing
        $hashFields = ['em', 'ph', 'fn', 'ln', 'ct', 'st', 'zp', 'country', 'db', 'ge'];

        foreach ($userData as $key => $value) {
            if (empty($value)) {
                continue;
            }

            if (in_array($key, $hashFields)) {
                $hashed[$key] = hash('sha256', strtolower(trim($value)));
            } else {
                // Fields like client_ip_address, client_user_agent, fbc, fbp are sent as-is
                $hashed[$key] = $value;
            }
        }

        return $hashed;
    }

    /**
     * Send a Purchase event via CAPI.
     */
    public function trackPurchase(
        float $value,
        string $currency,
        array $contentIds,
        array $userData = [],
        ?string $eventId = null,
        ?string $orderNumber = null
    ): void {
        $this->sendEvent('Purchase', [
            'value' => $value,
            'currency' => $currency,
            'content_ids' => $contentIds,
            'content_type' => 'product',
            'num_items' => count($contentIds),
            'order_id' => $orderNumber,
        ], $userData, $eventId);
    }

    /**
     * Send an AddToCart event via CAPI.
     */
    public function trackAddToCart(
        float $value,
        string $currency,
        array $contentIds,
        array $userData = [],
        ?string $eventId = null
    ): void {
        $this->sendEvent('AddToCart', [
            'value' => $value,
            'currency' => $currency,
            'content_ids' => $contentIds,
            'content_type' => 'product',
        ], $userData, $eventId);
    }

    /**
     * Send an InitiateCheckout event via CAPI.
     */
    public function trackInitiateCheckout(
        float $value,
        string $currency,
        int $numItems,
        array $userData = [],
        ?string $eventId = null
    ): void {
        $this->sendEvent('InitiateCheckout', [
            'value' => $value,
            'currency' => $currency,
            'num_items' => $numItems,
        ], $userData, $eventId);
    }
}
