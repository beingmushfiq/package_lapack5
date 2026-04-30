<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    ];

    protected $casts = [
        'components' => 'array',
        'styles' => 'array',
        'visibility_rules' => 'array',
        'api_source' => 'array',
        'is_active' => 'boolean',
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
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
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
            'order' => $this->order,
        ];
    }
}
