<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Layout;

class PageBuilderController extends Controller
{
    /**
     * GET /api/v1/cms/pages/{slug}
     * Returns full CMS page data with layout, sections, and SEO meta.
     */
    public function show(string $slug)
    {
        $page = Page::with(['layout', 'activeSections'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'meta' => [
                    'title' => $page->meta_title ?? $page->title,
                    'description' => $page->meta_description,
                    'og_image' => $page->og_image,
                    'json_ld' => $page->json_ld,
                ],
                'layout' => $page->layout ? [
                    'id' => $page->layout->id,
                    'slug' => $page->layout->slug,
                    'show_header' => $page->layout->show_header,
                    'show_footer' => $page->layout->show_footer,
                    'show_sub_navbar' => $page->layout->show_sub_navbar,
                    'container_width' => $page->layout->container_width,
                    'global_styles' => $page->layout->global_styles,
                ] : null,
                'sections' => $page->activeSections->map(fn($s) => $s->config),
            ],
        ]);
    }

    /**
     * GET /api/v1/cms/homepage
     * Returns the designated homepage data.
     */
    public function homepage()
    {
        $page = Page::with(['layout', 'activeSections'])
            ->published()
            ->homepage()
            ->first();

        if (!$page) {
            // Fallback: return default section config for the home page
            return response()->json([
                'page' => $this->defaultHomepageConfig(),
            ]);
        }

        return response()->json([
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'meta' => [
                    'title' => $page->meta_title ?? $page->title,
                    'description' => $page->meta_description,
                    'og_image' => $page->og_image,
                    'json_ld' => $page->json_ld,
                ],
                'layout' => $page->layout ? [
                    'id' => $page->layout->id,
                    'slug' => $page->layout->slug,
                    'show_header' => $page->layout->show_header,
                    'show_footer' => $page->layout->show_footer,
                    'show_sub_navbar' => $page->layout->show_sub_navbar,
                    'container_width' => $page->layout->container_width,
                    'global_styles' => $page->layout->global_styles,
                ] : null,
                'sections' => $page->activeSections->map(fn($s) => $s->config),
            ],
        ]);
    }

    /**
     * GET /api/v1/cms/layouts
     * Returns all available layouts.
     */
    public function layouts()
    {
        return response()->json(Layout::all());
    }

    /**
     * GET /api/v1/cms/section-types
     * Returns available section types for the page builder.
     */
    public function sectionTypes()
    {
        return response()->json(\App\Models\PageSection::SECTION_TYPES);
    }

    /**
     * Default homepage configuration (fallback when no CMS page exists).
     * This maps exactly to the current static Home.tsx structure.
     */
    private function defaultHomepageConfig(): array
    {
        return [
            'id' => null,
            'title' => 'Home',
            'slug' => 'home',
            'meta' => [
                'title' => 'AmarShop — Your Trusted Online Shop',
                'description' => 'Shop the latest products at AmarShop.',
                'og_image' => null,
                'json_ld' => null,
            ],
            'layout' => null,
            'sections' => [
                [
                    'id' => 'default-hero',
                    'type' => 'hero_slider',
                    'title' => 'Hero Slider',
                    'content' => null,
                    'components' => ['autoplay' => true, 'interval' => 5000],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 1,
                ],
                [
                    'id' => 'default-categories',
                    'type' => 'category_grid',
                    'title' => 'Shop by Category',
                    'content' => null,
                    'components' => ['columns' => 6, 'showImages' => true],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 2,
                ],
                [
                    'id' => 'default-promo',
                    'type' => 'dual_banner',
                    'title' => 'Promotional Banners',
                    'content' => null,
                    'components' => [],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 3,
                ],
                [
                    'id' => 'default-trending',
                    'type' => 'product_grid',
                    'title' => 'Trending Now',
                    'content' => null,
                    'components' => ['collection' => 'trending', 'title' => 'Trending', 'highlightWord' => 'Now', 'limit' => 12],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 4,
                ],
                [
                    'id' => 'default-daily',
                    'type' => 'product_grid',
                    'title' => 'Daily Offer',
                    'content' => null,
                    'components' => ['collection' => 'daily_offer', 'title' => 'Daily', 'highlightWord' => 'Offer', 'limit' => 12],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 5,
                ],
                [
                    'id' => 'default-best',
                    'type' => 'product_grid',
                    'title' => 'Best Deals',
                    'content' => null,
                    'components' => ['collection' => 'best_deals', 'title' => 'Best', 'highlightWord' => 'Deals', 'limit' => 12],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 6,
                ],
                [
                    'id' => 'default-topsale',
                    'type' => 'product_grid',
                    'title' => 'Top Sale',
                    'content' => null,
                    'components' => ['collection' => 'top_sale', 'title' => 'Top', 'highlightWord' => 'Sale', 'limit' => 12],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 7,
                ],
                [
                    'id' => 'default-new',
                    'type' => 'product_grid',
                    'title' => 'New Arrivals',
                    'content' => null,
                    'components' => ['collection' => 'new_arrivals', 'title' => 'New', 'highlightWord' => 'Arrivals', 'limit' => 12],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 8,
                ],
                [
                    'id' => 'default-blog',
                    'type' => 'blog_grid',
                    'title' => 'Latest Blog Posts',
                    'content' => null,
                    'components' => ['limit' => 6],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 9,
                ],
                [
                    'id' => 'default-brands',
                    'type' => 'brands_carousel',
                    'title' => 'Our Brands',
                    'content' => null,
                    'components' => [],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 10,
                ],
                [
                    'id' => 'default-reviews',
                    'type' => 'reviews',
                    'title' => 'Client Reviews',
                    'content' => null,
                    'components' => ['limit' => 10],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 11,
                ],
                [
                    'id' => 'default-faq',
                    'type' => 'faq_accordion',
                    'title' => 'FAQ',
                    'content' => null,
                    'components' => [],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 12,
                ],
                [
                    'id' => 'default-newsletter',
                    'type' => 'newsletter',
                    'title' => 'Newsletter',
                    'content' => null,
                    'components' => [],
                    'styles' => [],
                    'visibility_rules' => [],
                    'api_source' => null,
                    'order' => 13,
                ],
            ],
        ];
    }
}
