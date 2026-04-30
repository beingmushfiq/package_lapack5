<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layout extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'show_header',
        'show_footer',
        'show_sub_navbar',
        'container_width',
        'breakpoints',
        'global_styles',
        'is_default',
    ];

    protected $casts = [
        'show_header' => 'boolean',
        'show_footer' => 'boolean',
        'show_sub_navbar' => 'boolean',
        'is_default' => 'boolean',
        'breakpoints' => 'array',
        'global_styles' => 'array',
    ];

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }
}
