<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\SiteSetting;
use App\Services\CourierService;
use App\Services\SmsService;

class OrderObserver
{
    protected $smsService;
    protected $courierService;

    public function __construct(SmsService $smsService, CourierService $courierService)
    {
        $this->smsService = $smsService;
        $this->courierService = $courierService;
    }

    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        // Decrement stock
        foreach ($order->items as $item) {
            $product = $item->product;
            if ($product && $product->track_stock) {
                $product->decrement('stock_quantity', $item->quantity);
            }
        }

        // Send initial "Order Placed" SMS
        $this->smsService->sendOrderSms($order, 'order_placed');
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        // Check if status has changed
        if ($order->isDirty('status')) {
            $newStatus = $order->status;

            // Automation for "confirmed"
            if ($newStatus === 'confirmed') {
                $this->smsService->sendOrderSms($order, 'order_confirmed');
                
                // Auto-send to courier if enabled
                if (SiteSetting::getValue('auto_send_to_courier', false)) {
                    $this->courierService->sendToCourier($order);
                }
            }

            // Automation for "shipped"
            if ($newStatus === 'shipped') {
                $this->smsService->sendOrderSms($order, 'order_shipped');
            }

            // Restore stock for cancelled/returned
            if (in_array($newStatus, ['cancelled', 'returned'])) {
                foreach ($order->items as $item) {
                    $product = $item->product;
                    if ($product && $product->track_stock) {
                        $product->increment('stock_quantity', $item->quantity);
                    }
                }
            }
        }
    }
}
