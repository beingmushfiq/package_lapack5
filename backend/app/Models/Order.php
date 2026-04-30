<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Order extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    protected $fillable = [
        'user_id', 'order_number', 'total_amount', 'shipping_cost', 'discount_amount', 'payable_amount',
        'status', 'payment_method', 'payment_status', 'coupon_code',
        'customer_name', 'customer_phone', 'customer_email', 'shipping_address', 'billing_address', 'district', 'area',
        'courier_name', 'courier_tracking_id', 'courier_status', 'courier_response',
        'admin_note', 'customer_note'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'payable_amount' => 'decimal:2',
        'courier_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
