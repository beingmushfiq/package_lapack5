<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Layout;
use App\Models\Page;
use App\Models\PageSection;

class CMSHomepageSeeder extends Seeder
{
    /**
     * Seed a default homepage with all standard sections.
     * This creates the CMS structure that matches the original static Home.tsx.
     */
    public function run(): void
    {
        // ─── Create Default Layout ──────────────────────────────
        $layout = Layout::firstOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default Layout',
                'show_header' => true,
                'show_footer' => true,
                'show_sub_navbar' => true,
                'container_width' => '1440px',
                'is_default' => true,
            ]
        );

        // ─── Create Homepage ────────────────────────────────────
        $page = Page::firstOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home',
                'meta_title' => 'AmarShop — Your Trusted Online Shop in Bangladesh',
                'meta_description' => 'Discover the latest products with amazing deals. Shop electronics, fashion, home essentials, and more at AmarShop.',
                'status' => 'published',
                'is_published' => true,
                'is_homepage' => true,
                'layout_id' => $layout->id,
            ]
        );

        // ─── Delete existing sections if re-seeding ─────────────
        $page->sections()->delete();

        // ─── Create Sections (matching original Home.tsx) ───────
        $sections = [
            [
                'title' => 'Hero Slider',
                'type' => 'hero_slider',
                'order' => 1,
                'components' => ['autoplay' => true, 'interval' => '5000'],
            ],
            [
                'title' => 'Shop by Category',
                'type' => 'category_grid',
                'order' => 2,
                'components' => ['columns' => '6', 'showImages' => 'true'],
            ],
            [
                'title' => 'Promotional Banners',
                'type' => 'dual_banner',
                'order' => 3,
                'components' => [],
            ],
            [
                'title' => 'Trending Now',
                'type' => 'product_grid',
                'order' => 4,
                'components' => ['collection' => 'trending', 'title' => 'Trending', 'highlightWord' => 'Now'],
            ],
            [
                'title' => 'Daily Offer',
                'type' => 'product_grid',
                'order' => 5,
                'components' => ['collection' => 'daily_offer', 'title' => 'Daily', 'highlightWord' => 'Offer'],
            ],
            [
                'title' => 'Best Deals',
                'type' => 'product_grid',
                'order' => 6,
                'components' => ['collection' => 'best_deals', 'title' => 'Best', 'highlightWord' => 'Deals'],
            ],
            [
                'title' => 'Top Sale',
                'type' => 'product_grid',
                'order' => 7,
                'components' => ['collection' => 'top_sale', 'title' => 'Top', 'highlightWord' => 'Sale'],
            ],
            [
                'title' => 'New Arrivals',
                'type' => 'product_grid',
                'order' => 8,
                'components' => ['collection' => 'new_arrivals', 'title' => 'New', 'highlightWord' => 'Arrivals'],
            ],
            [
                'title' => 'Latest Blog Posts',
                'type' => 'blog_grid',
                'order' => 9,
                'components' => ['limit' => '6'],
            ],
            [
                'title' => 'Our Brands',
                'type' => 'brands_carousel',
                'order' => 10,
                'components' => [],
            ],
            [
                'title' => 'Client Reviews',
                'type' => 'reviews',
                'order' => 11,
                'components' => ['limit' => '10'],
            ],
            [
                'title' => 'FAQ',
                'type' => 'faq_accordion',
                'order' => 12,
                'components' => [],
            ],
            [
                'title' => 'Newsletter',
                'type' => 'newsletter',
                'order' => 13,
                'components' => [],
            ],
        ];

        foreach ($sections as $sectionData) {
            $page->sections()->create([
                'title' => $sectionData['title'],
                'type' => $sectionData['type'],
                'order' => $sectionData['order'],
                'components' => $sectionData['components'],
                'styles' => [],
                'visibility_rules' => [],
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ CMS Homepage seeded with ' . count($sections) . ' sections.');

        // ─── Create a sample "About" page ───────────────────────
        $aboutPage = Page::firstOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About Us',
                'meta_title' => 'About AmarShop — Our Story',
                'meta_description' => 'Learn about AmarShop, your trusted online shopping destination in Bangladesh.',
                'status' => 'published',
                'is_published' => true,
                'is_homepage' => false,
                'layout_id' => $layout->id,
            ]
        );

        $aboutPage->sections()->delete();
        $aboutPage->sections()->create([
            'title' => 'About Us',
            'type' => 'rich_text',
            'order' => 1,
            'content' => '<h2>Welcome to AmarShop</h2><p>We are your trusted online shopping destination in Bangladesh. Our mission is to provide high-quality products at competitive prices with exceptional customer service.</p><h3>Our Mission</h3><p>To make online shopping accessible, affordable, and enjoyable for everyone in Bangladesh.</p><h3>Our Values</h3><ul><li><strong>Quality:</strong> We carefully curate every product in our catalog.</li><li><strong>Trust:</strong> Secure payments and reliable delivery.</li><li><strong>Service:</strong> 24/7 customer support for all your needs.</li></ul>',
            'components' => ['alignment' => 'left'],
            'styles' => ['paddingTop' => '2rem', 'paddingBottom' => '2rem'],
            'is_active' => true,
        ]);
        $aboutPage->sections()->create([
            'title' => null,
            'type' => 'newsletter',
            'order' => 2,
            'components' => [],
            'styles' => [],
            'is_active' => true,
        ]);

        $this->command->info('✅ About page seeded.');
    }
}
