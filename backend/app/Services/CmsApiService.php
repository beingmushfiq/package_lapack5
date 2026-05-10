<?php

namespace App\Services;

use App\Models\ThemeSetting;
use App\Models\CmsPopup;
use App\Models\CmsAnnouncementBar;
use App\Models\TrackingScript;
use App\Models\Menu;
use Illuminate\Support\Facades\Cache;

class CmsApiService
{
    /**
     * Cache TTL constants (seconds).
     */
    const TTL_THEME     = 300;   // 5 minutes
    const TTL_NAVIGATION = 60;   // 1 minute
    const TTL_FOOTER    = 300;   // 5 minutes
    const TTL_POPUPS    = 60;    // 1 minute
    const TTL_TRACKING  = 600;   // 10 minutes
    const TTL_PAGES     = 30;    // 30 seconds

    /**
     * Get compiled theme tokens.
     */
    public function getTheme(): array
    {
        return Cache::remember('cms:theme', self::TTL_THEME, function () {
            $settings = ThemeSetting::all();

            if ($settings->isEmpty()) {
                // Return defaults if no settings in DB
                return $this->buildThemeFromDefaults();
            }

            return $this->compileThemeTokens($settings->pluck('value', 'key')->toArray());
        });
    }

    /**
     * Get navigation structure (primary menu with mega menu support).
     */
    public function getNavigation(string $location = 'primary'): array
    {
        return Cache::remember("cms:navigation:{$location}", self::TTL_NAVIGATION, function () use ($location) {
            $menu = Menu::with(['items' => function ($q) {
                $q->orderBy('order')->with('children.children');
            }])
            ->where('location', $location)
            ->where('is_active', true)
            ->first();

            if (!$menu) return [];

            return $this->buildMenuTree($menu->items->whereNull('parent_id')->values());
        });
    }

    /**
     * Get all active menus keyed by location.
     */
    public function getAllMenus(): array
    {
        return Cache::remember('cms:all_menus', self::TTL_NAVIGATION, function () {
            $menus = Menu::with(['items' => function ($q) {
                $q->orderBy('order');
            }])->where('is_active', true)->get();

            $result = [];
            foreach ($menus as $menu) {
                $result[$menu->location ?? $menu->slug] = [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'location' => $menu->location,
                    'items' => $this->buildMenuTree($menu->items->whereNull('parent_id')->values()),
                ];
            }
            return $result;
        });
    }

    /**
     * Get footer config.
     */
    public function getFooter(): array
    {
        return Cache::remember('cms:footer', self::TTL_FOOTER, function () {
            $footerMenu = Menu::with(['items' => function ($q) {
                $q->orderBy('order');
            }])->where('location', 'footer')->where('is_active', true)->get();

            return [
                'menus' => $footerMenu->map(fn($m) => [
                    'name' => $m->name,
                    'items' => $m->items->map(fn($i) => [
                        'id' => $i->id,
                        'label' => $i->label,
                        'url' => $i->url,
                        'icon' => $i->icon ?? null,
                        'open_in_new_tab' => $i->open_in_new_tab ?? false,
                    ]),
                ]),
            ];
        });
    }

    /**
     * Get active popups.
     */
    public function getPopups(): array
    {
        return Cache::remember('cms:popups', self::TTL_POPUPS, function () {
            return CmsPopup::active()->orderBy('order')->get()->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'title' => $p->title,
                'content' => $p->content,
                'image' => $p->image,
                'button_text' => $p->button_text,
                'button_url' => $p->button_url,
                'trigger' => $p->trigger,
                'trigger_delay' => $p->trigger_delay,
                'trigger_scroll' => $p->trigger_scroll,
                'show_on_pages' => $p->show_on_pages,
                'visibility_rules' => $p->visibility_rules ?? [],
                'show_after_visits' => $p->show_after_visits,
                'is_dismissible' => $p->is_dismissible,
                'position' => $p->position,
                'size' => $p->size,
                'styles' => $p->styles ?? [],
            ])->toArray();
        });
    }

    /**
     * Get active announcement bars.
     */
    public function getAnnouncementBars(): array
    {
        return Cache::remember('cms:announcement_bars', self::TTL_POPUPS, function () {
            return CmsAnnouncementBar::active()->orderBy('order')->get()->map(fn($b) => [
                'id' => $b->id,
                'content' => $b->content,
                'background_color' => $b->background_color,
                'text_color' => $b->text_color,
                'link_url' => $b->link_url,
                'link_text' => $b->link_text,
                'is_dismissible' => $b->is_dismissible,
                'position' => $b->position,
                'visibility_rules' => $b->visibility_rules ?? [],
            ])->toArray();
        });
    }

    /**
     * Get active tracking scripts.
     */
    public function getTrackingScripts(): array
    {
        return Cache::remember('cms:tracking', self::TTL_TRACKING, function () {
            return TrackingScript::where('is_active', true)->get()->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'type' => $s->type ?? 'custom',
                'position' => $s->position ?? 'head',
                'script' => $s->script_code,
            ])->toArray();
        });
    }

    /**
     * Invalidate all CMS caches.
     */
    public function clearCache(?string $key = null): void
    {
        if ($key) {
            Cache::forget("cms:{$key}");
            return;
        }

        $keys = ['theme', 'navigation:primary', 'navigation:secondary', 'all_menus', 'footer', 'popups', 'announcement_bars', 'tracking'];
        foreach ($keys as $k) {
            Cache::forget("cms:{$k}");
        }
    }

    // ─────────────────────────────────────────────────────────────

    private function buildMenuTree($items): array
    {
        return $items->map(fn($item) => [
            'id' => $item->id,
            'label' => $item->label,
            'url' => $item->url,
            'icon' => $item->icon ?? null,
            'badge_text' => $item->badge_text ?? null,
            'badge_color' => $item->badge_color ?? null,
            'is_mega_menu' => $item->is_mega_menu ?? false,
            'mega_menu_config' => $item->mega_menu_config ?? null,
            'open_in_new_tab' => $item->open_in_new_tab ?? false,
            'description' => $item->description ?? null,
            'image' => $item->image ?? null,
            'css_classes' => $item->css_classes ?? null,
            'children' => $item->children ? $this->buildMenuTree($item->children->sortBy('order')->values()) : [],
        ])->toArray();
    }

    private function compileThemeTokens(array $settings): array
    {
        return [
            'colors' => [
                'primary' => $settings['color_primary'] ?? '#10b981',
                'primaryDark' => $settings['color_primary_dark'] ?? '#059669',
                'secondary' => $settings['color_secondary'] ?? '#3b82f6',
                'accent' => $settings['color_accent'] ?? '#f59e0b',
                'danger' => $settings['color_danger'] ?? '#ef4444',
                'success' => $settings['color_success'] ?? '#10b981',
                'background' => $settings['color_background'] ?? '#ffffff',
                'surface' => $settings['color_surface'] ?? '#f9fafb',
                'text' => $settings['color_text'] ?? '#111827',
                'textMuted' => $settings['color_text_muted'] ?? '#6b7280',
            ],
            'typography' => [
                'fontPrimary' => $settings['font_primary'] ?? 'Inter',
                'fontHeading' => $settings['font_heading'] ?? 'Inter',
                'fontSizeBase' => $settings['font_size_base'] ?? '16px',
                'lineHeightBase' => $settings['line_height_base'] ?? '1.5',
            ],
            'spacing' => [
                'borderRadiusSm' => $settings['border_radius_sm'] ?? '6px',
                'borderRadiusMd' => $settings['border_radius_md'] ?? '12px',
                'borderRadiusLg' => $settings['border_radius_lg'] ?? '20px',
                'borderRadiusFull' => $settings['border_radius_full'] ?? '9999px',
                'containerMaxWidth' => $settings['container_max_width'] ?? '1440px',
            ],
            'shadows' => [
                'sm' => $settings['shadow_sm'] ?? '0 1px 2px 0 rgba(0,0,0,0.05)',
                'md' => $settings['shadow_md'] ?? '0 4px 6px -1px rgba(0,0,0,0.1)',
                'lg' => $settings['shadow_lg'] ?? '0 10px 15px -3px rgba(0,0,0,0.1)',
            ],
            'animations' => [
                'duration' => $settings['animation_duration'] ?? '300ms',
                'easing' => $settings['animation_easing'] ?? 'ease-in-out',
                'enabled' => ($settings['enable_animations'] ?? 'true') === 'true',
            ],
        ];
    }

    private function buildThemeFromDefaults(): array
    {
        $defaults = [];
        foreach (ThemeSetting::defaults() as $d) {
            $defaults[$d['key']] = $d['value'];
        }
        return $this->compileThemeTokens($defaults);
    }
}
