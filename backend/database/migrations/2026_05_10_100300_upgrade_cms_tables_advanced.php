<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Upgrade page_sections with animation, tracking, scheduling, A/B, and locale
        Schema::table('page_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('page_sections', 'animation_config')) {
                $table->json('animation_config')->nullable()->after('api_source');
            }
            if (!Schema::hasColumn('page_sections', 'tracking_config')) {
                $table->json('tracking_config')->nullable()->after('animation_config');
            }
            if (!Schema::hasColumn('page_sections', 'schedule_start')) {
                $table->timestamp('schedule_start')->nullable()->after('tracking_config');
            }
            if (!Schema::hasColumn('page_sections', 'schedule_end')) {
                $table->timestamp('schedule_end')->nullable()->after('schedule_start');
            }
            if (!Schema::hasColumn('page_sections', 'ab_variant')) {
                $table->string('ab_variant')->nullable()->after('schedule_end'); // 'a', 'b', or null (always show)
            }
            if (!Schema::hasColumn('page_sections', 'locale')) {
                $table->string('locale')->nullable()->after('ab_variant'); // null = all locales
            }
            if (!Schema::hasColumn('page_sections', 'reusable_section_id')) {
                $table->foreignId('reusable_section_id')->nullable()->constrained('reusable_sections')->nullOnDelete();
            }
            if (!Schema::hasColumn('page_sections', 'css_id')) {
                $table->string('css_id')->nullable(); // custom HTML id for anchor links
            }
            if (!Schema::hasColumn('page_sections', 'css_classes')) {
                $table->string('css_classes')->nullable(); // extra Tailwind or custom classes
            }
        });

        // Upgrade pages with template, locale, canonical_url, twitter_card, robots
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'template')) {
                $table->string('template')->default('default')->after('slug'); // default, full-width, sidebar, landing
            }
            if (!Schema::hasColumn('pages', 'locale')) {
                $table->string('locale')->nullable()->after('template'); // null = default locale
            }
            if (!Schema::hasColumn('pages', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('og_image');
            }
            if (!Schema::hasColumn('pages', 'robots')) {
                $table->string('robots')->default('index,follow')->after('canonical_url');
            }
            if (!Schema::hasColumn('pages', 'twitter_card')) {
                $table->string('twitter_card')->default('summary_large_image')->after('robots');
            }
            if (!Schema::hasColumn('pages', 'password')) {
                $table->string('password')->nullable(); // password-protected pages
            }
        });

        // Upgrade menu_items with mega menu, icons, badges, promo card support
        Schema::table('menu_items', function (Blueprint $table) {
            if (!Schema::hasColumn('menu_items', 'icon')) {
                $table->string('icon')->nullable()->after('url');
            }
            if (!Schema::hasColumn('menu_items', 'badge_text')) {
                $table->string('badge_text')->nullable()->after('icon'); // 'New', 'Hot', 'Sale'
            }
            if (!Schema::hasColumn('menu_items', 'badge_color')) {
                $table->string('badge_color')->nullable()->after('badge_text'); // e.g. 'red', 'green'
            }
            if (!Schema::hasColumn('menu_items', 'is_mega_menu')) {
                $table->boolean('is_mega_menu')->default(false)->after('badge_color');
            }
            if (!Schema::hasColumn('menu_items', 'mega_menu_config')) {
                $table->json('mega_menu_config')->nullable()->after('is_mega_menu'); // promo cards, featured products
            }
            if (!Schema::hasColumn('menu_items', 'open_in_new_tab')) {
                $table->boolean('open_in_new_tab')->default(false)->after('mega_menu_config');
            }
            if (!Schema::hasColumn('menu_items', 'css_classes')) {
                $table->string('css_classes')->nullable()->after('open_in_new_tab');
            }
            if (!Schema::hasColumn('menu_items', 'description')) {
                $table->text('description')->nullable(); // sub-description for mega menu items
            }
            if (!Schema::hasColumn('menu_items', 'image')) {
                $table->string('image')->nullable(); // image for mega menu promo cards
            }
        });
    }

    public function down(): void
    {
        Schema::table('page_sections', function (Blueprint $table) {
            $table->dropColumn([
                'animation_config', 'tracking_config', 'schedule_start', 'schedule_end',
                'ab_variant', 'locale', 'reusable_section_id', 'css_id', 'css_classes',
            ]);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['template', 'locale', 'canonical_url', 'robots', 'twitter_card', 'password']);
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn([
                'icon', 'badge_text', 'badge_color', 'is_mega_menu',
                'mega_menu_config', 'open_in_new_tab', 'css_classes', 'description', 'image',
            ]);
        });
    }
};
