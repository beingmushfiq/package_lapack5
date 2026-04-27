<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $casts = [
        'is_active' => 'boolean',
    ];
}

class Product extends Model
{
    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'discount' => 'float',
        'rating' => 'float',
        'is_new' => 'boolean',
        'in_stock' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function specifications()
    {
        return $this->hasMany(ProductSpecification::class);
    }
}
