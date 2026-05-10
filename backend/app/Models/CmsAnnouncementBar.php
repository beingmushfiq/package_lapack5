<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsAnnouncementBar extends Model
{
    protected $table = 'cms_announcement_bars';

    protected $fillable = [
        'name', 'content',
        'background_color', 'text_color',
        'link_url', 'link_text',
        'is_dismissible', 'position',
        'visibility_rules',
        'schedule_start', 'schedule_end',
        'is_active', 'order',
    ];

    protected $casts = [
        'visibility_rules' => 'array',
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
