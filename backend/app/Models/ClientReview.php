<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientReview extends Model
{
    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
    ];
}
