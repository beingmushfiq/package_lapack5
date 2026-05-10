<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsPopup extends Model
{
    protected $table = 'cms_popups';

    protected $fillable = [
        'name', 'title', 'content', 'image',
        'button_text', 'button_url',
        'trigger', 'trigger_delay', 'trigger_scroll',
        'show_on_pages', 'visibility_rules',
        'show_after_visits', 'is_dismissible',
        'position', 'size', 'styles',
        'schedule_start', 'schedule_end',
        'is_active', 'order',
    ];

    protected $casts = [
        'show_on_pages' => 'array',
        'visibility_rules' => 'array',
        'styles' => 'array',
        'is_dismissible' => 'boolean',
        'is_active' => 'boolean',
        'schedule_start' => 'datetime',
        'schedule_end' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('schedule_start')
                  ->orWhere('schedule_start', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('schedule_end')
                  ->orWhere('schedule_end', '>=', now());
            });
    }
}
