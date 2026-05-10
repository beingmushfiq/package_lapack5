<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionalBanner extends Model
{
    protected $fillable = ['title', 'image', 'link', 'is_active', 'order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
