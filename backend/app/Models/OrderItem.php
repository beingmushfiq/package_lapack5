<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'product_name', 'quantity', 'price', 'total', 'variation'
    ];

    protected static function booted()
    {
        static::saving(function ($item) {
            if (!$item->product_name && $item->product_id) {
                $item->product_name = $item->product?->name;
            }
            $item->total = $item->quantity * $item->price;
        });
    }

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'variation' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
