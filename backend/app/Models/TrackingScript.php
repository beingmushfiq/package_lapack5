<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingScript extends Model
{
    protected $fillable = [
        'name',
        'type', // e.g., 'facebook_pixel', 'google_analytics', 'custom'
        'script', // The raw script code
        'position', // 'head', 'body_start', 'body_end'
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
