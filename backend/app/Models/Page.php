<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'meta_title',
        'meta_description',
        'og_image',
        'status',
        'published_at',
        'is_homepage',
        'is_published',
        'is_active',
        'layout_id',
        'json_ld',
    ];

    protected $casts = [
        'is_homepage' => 'boolean',
        'is_published' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'json_ld' => 'array',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('order');
    }

    public function activeSections(): HasMany
    {
        return $this->hasMany(PageSection::class)
            ->where('is_active', true)
            ->orderBy('order');
    }

    public function layout(): BelongsTo
    {
        return $this->belongsTo(Layout::class);
    }

    /**
     * Scope: published pages only
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where(function ($q) {
                $q->where('status', 'published')
                  ->orWhere(function ($q2) {
                      $q2->where('status', 'scheduled')
                         ->where('published_at', '<=', now());
                  });
            });
    }

    /**
     * Scope: find homepage
     */
    public function scopeHomepage($query)
    {
        return $query->where('is_homepage', true);
    }
}
