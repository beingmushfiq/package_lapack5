<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageSection extends Model
{
    protected $fillable = [
        'page_id',
        'title',
        'type',
        'content',
        'components',
        'styles',
        'visibility_rules',
        'api_source',
        'order',
        'is_active',
        'animation_config',
        'tracking_config',
        'schedule_start',
        'schedule_end',
        'ab_variant',
        'locale',
        'reusable_section_id',
        'css_id',
        'css_classes',
    ];

    protected $casts = [
        'components' => 'array',
        'styles' => 'array',
        'visibility_rules' => 'array',
        'api_source' => 'array',
        'animation_config' => 'array',
        'tracking_config' => 'array',
        'is_active' => 'boolean',
        'schedule_start' => 'datetime',
        'schedule_end' => 'datetime',
    ];

    /**
     * Available section types for the CMS
     */
    public const SECTION_TYPES = [
        'hero_slider' => 'Hero Slider',
        'category_grid' => 'Category Grid',
        'category_sidebar' => 'Category Sidebar',
        'product_grid' => 'Product Grid',
        'product_carousel' => 'Product Carousel',
        'blog_grid' => 'Blog Grid',
        'brands_carousel' => 'Brands Carousel',
        'reviews' => 'Client Reviews',
        'faq_accordion' => 'FAQ Accordion',
        'newsletter' => 'Newsletter Signup',
        'promotional_banner' => 'Promotional Banner',
        'dual_banner' => 'Dual Banner',
        'rich_text' => 'Rich Text Block',
        'image_banner' => 'Image Banner',
        'video_embed' => 'Video Embed',
        'spacer' => 'Spacer / Divider',
        'custom_html' => 'Custom HTML/CSS',
        'contact_form' => 'Contact Form',
        // New section types
        'countdown_timer' => 'Countdown Timer',
        'cta_section' => 'Call to Action (CTA)',
        'testimonial_slider' => 'Testimonial Slider',
        'flash_deal_banner' => 'Flash Deal Banner',
        'accordion_section' => 'Accordion / Collapsible',
        'html_embed' => 'HTML Embed (iframe/script)',
        'image_gallery' => 'Image Gallery Grid',
        'product_recommendation' => 'Product Recommendations',
        'tabs_section' => 'Tabs Section',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(SectionVersion::class)->orderByDesc('version_number');
    }

    public function reusableSection(): BelongsTo
    {
        return $this->belongsTo(ReusableSection::class);
    }

    /**
     * Scope: only sections currently scheduled to be visible.
     */
    public function scopeScheduledVisible($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('schedule_start')
              ->orWhere('schedule_start', '<=', now());
        })->where(function ($q) {
            $q->whereNull('schedule_end')
              ->orWhere('schedule_end', '>=', now());
        });
    }

    /**
     * Save current state as a version snapshot.
     */
    public function saveVersion(string $savedBy = 'system', string $note = ''): void
    {
        $lastVersion = $this->versions()->max('version_number') ?? 0;
        $this->versions()->create([
            'version_number' => $lastVersion + 1,
            'snapshot' => $this->getConfigAttribute(),
            'saved_by' => $savedBy,
            'change_note' => $note,
        ]);
    }

    /**
     * Get merged configuration (components + styles + api)
     */
    public function getConfigAttribute(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'content' => $this->content,
            'components' => $this->components ?? [],
            'styles' => $this->styles ?? [],
            'visibility_rules' => $this->visibility_rules ?? [],
            'api_source' => $this->api_source,
            'animation_config' => $this->animation_config ?? [],
            'tracking_config' => $this->tracking_config ?? [],
            'order' => $this->order,
            'css_id' => $this->css_id,
            'css_classes' => $this->css_classes,
            'ab_variant' => $this->ab_variant,
            'locale' => $this->locale,
        ];
    }
}
