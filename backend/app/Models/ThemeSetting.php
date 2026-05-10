<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'description',
    ];

    /**
     * Get all theme settings as a key-value map.
     */
    public static function getAll(): array
    {
        return static::all()->pluck('value', 'key')->toArray();
    }

    /**
     * Get a specific theme setting value.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    /**
     * Set a theme setting value (upsert).
     */
    public static function set(string $key, mixed $value, array $extra = []): void
    {
        static::updateOrCreate(
            ['key' => $key],
            array_merge(['value' => $value], $extra)
        );
    }

    /**
     * Get all settings grouped by group.
     */
    public static function grouped(): array
    {
        return static::all()
            ->groupBy('group')
            ->map(fn($items) => $items->pluck('value', 'key'))
            ->toArray();
    }

    /**
     * Default theme token definitions.
     */
    public static function defaults(): array
    {
        return [
            // Colors
            ['key' => 'color_primary', 'value' => '#10b981', 'type' => 'color', 'group' => 'colors', 'label' => 'Primary Color'],
            ['key' => 'color_primary_dark', 'value' => '#059669', 'type' => 'color', 'group' => 'colors', 'label' => 'Primary Dark'],
            ['key' => 'color_secondary', 'value' => '#3b82f6', 'type' => 'color', 'group' => 'colors', 'label' => 'Secondary Color'],
            ['key' => 'color_accent', 'value' => '#f59e0b', 'type' => 'color', 'group' => 'colors', 'label' => 'Accent Color'],
            ['key' => 'color_danger', 'value' => '#ef4444', 'type' => 'color', 'group' => 'colors', 'label' => 'Danger Color'],
            ['key' => 'color_success', 'value' => '#10b981', 'type' => 'color', 'group' => 'colors', 'label' => 'Success Color'],
            ['key' => 'color_background', 'value' => '#ffffff', 'type' => 'color', 'group' => 'colors', 'label' => 'Background Color'],
            ['key' => 'color_surface', 'value' => '#f9fafb', 'type' => 'color', 'group' => 'colors', 'label' => 'Surface Color'],
            ['key' => 'color_text', 'value' => '#111827', 'type' => 'color', 'group' => 'colors', 'label' => 'Text Color'],
            ['key' => 'color_text_muted', 'value' => '#6b7280', 'type' => 'color', 'group' => 'colors', 'label' => 'Muted Text Color'],
            // Typography
            ['key' => 'font_primary', 'value' => 'Inter', 'type' => 'font', 'group' => 'typography', 'label' => 'Primary Font'],
            ['key' => 'font_heading', 'value' => 'Inter', 'type' => 'font', 'group' => 'typography', 'label' => 'Heading Font'],
            ['key' => 'font_size_base', 'value' => '16px', 'type' => 'text', 'group' => 'typography', 'label' => 'Base Font Size'],
            ['key' => 'line_height_base', 'value' => '1.5', 'type' => 'text', 'group' => 'typography', 'label' => 'Base Line Height'],
            // Spacing & Radius
            ['key' => 'border_radius_sm', 'value' => '6px', 'type' => 'text', 'group' => 'spacing', 'label' => 'Border Radius SM'],
            ['key' => 'border_radius_md', 'value' => '12px', 'type' => 'text', 'group' => 'spacing', 'label' => 'Border Radius MD'],
            ['key' => 'border_radius_lg', 'value' => '20px', 'type' => 'text', 'group' => 'spacing', 'label' => 'Border Radius LG'],
            ['key' => 'border_radius_full', 'value' => '9999px', 'type' => 'text', 'group' => 'spacing', 'label' => 'Border Radius Full'],
            ['key' => 'container_max_width', 'value' => '1440px', 'type' => 'text', 'group' => 'spacing', 'label' => 'Max Container Width'],
            // Shadows
            ['key' => 'shadow_sm', 'value' => '0 1px 2px 0 rgba(0,0,0,0.05)', 'type' => 'text', 'group' => 'shadows', 'label' => 'Shadow SM'],
            ['key' => 'shadow_md', 'value' => '0 4px 6px -1px rgba(0,0,0,0.1)', 'type' => 'text', 'group' => 'shadows', 'label' => 'Shadow MD'],
            ['key' => 'shadow_lg', 'value' => '0 10px 15px -3px rgba(0,0,0,0.1)', 'type' => 'text', 'group' => 'shadows', 'label' => 'Shadow LG'],
            // Animations
            ['key' => 'animation_duration', 'value' => '300ms', 'type' => 'text', 'group' => 'animations', 'label' => 'Animation Duration'],
            ['key' => 'animation_easing', 'value' => 'ease-in-out', 'type' => 'text', 'group' => 'animations', 'label' => 'Animation Easing'],
            ['key' => 'enable_animations', 'value' => 'true', 'type' => 'boolean', 'group' => 'animations', 'label' => 'Enable Animations'],
        ];
    }
}
