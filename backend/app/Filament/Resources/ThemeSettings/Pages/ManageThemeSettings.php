<?php

namespace App\Filament\Resources\ThemeSettings\Pages;

use App\Filament\Resources\ThemeSettings\ThemeSettingResource;
use App\Models\ThemeSetting;
use App\Services\CmsApiService;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;

class ManageThemeSettings extends Page
{
    protected static string $resource = ThemeSettingResource::class;
    protected string $view = 'filament.resources.theme-settings.pages.manage-theme-settings';
    protected static ?string $title = 'Theme Settings';

    // Live form properties bound to the Livewire component
    public string $color_primary = '#10b981';
    public string $color_primary_dark = '#059669';
    public string $color_secondary = '#3b82f6';
    public string $color_accent = '#f59e0b';
    public string $color_danger = '#ef4444';
    public string $color_success = '#10b981';
    public string $color_background = '#ffffff';
    public string $color_surface = '#f9fafb';
    public string $color_text = '#111827';
    public string $color_text_muted = '#6b7280';
    public string $font_primary = 'Inter';
    public string $font_heading = 'Inter';
    public string $font_size_base = '16px';
    public string $line_height_base = '1.5';
    public string $border_radius_sm = '6px';
    public string $border_radius_md = '12px';
    public string $border_radius_lg = '20px';
    public string $border_radius_full = '9999px';
    public string $container_max_width = '1440px';
    public string $shadow_sm = '0 1px 2px 0 rgba(0,0,0,0.05)';
    public string $shadow_md = '0 4px 6px -1px rgba(0,0,0,0.1)';
    public string $shadow_lg = '0 10px 15px -3px rgba(0,0,0,0.1)';
    public string $animation_duration = '300ms';
    public string $animation_easing = 'ease-in-out';
    public bool   $enable_animations = true;

    public function mount(): void
    {
        $settings = ThemeSetting::all()->pluck('value', 'key');
        foreach ($settings as $key => $value) {
            if (property_exists($this, $key)) {
                if ($key === 'enable_animations') {
                    $this->$key = $value === 'true' || $value === '1';
                } else {
                    $this->$key = (string) $value;
                }
            }
        }
    }

    public function save(): void
    {
        $keys = [
            'color_primary', 'color_primary_dark', 'color_secondary', 'color_accent',
            'color_danger', 'color_success', 'color_background', 'color_surface',
            'color_text', 'color_text_muted',
            'font_primary', 'font_heading', 'font_size_base', 'line_height_base',
            'border_radius_sm', 'border_radius_md', 'border_radius_lg', 'border_radius_full',
            'container_max_width',
            'shadow_sm', 'shadow_md', 'shadow_lg',
            'animation_duration', 'animation_easing', 'enable_animations',
        ];

        $defaults = collect(ThemeSetting::defaults())->keyBy('key');

        foreach ($keys as $key) {
            $value = $key === 'enable_animations'
                ? ($this->$key ? 'true' : 'false')
                : (string) $this->$key;

            $def = $defaults->get($key, []);
            ThemeSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => $def['type'] ?? 'text',
                    'group' => $def['group'] ?? 'general',
                    'label' => $def['label'] ?? $key,
                ]
            );
        }

        app(CmsApiService::class)->clearCache('theme');

        Notification::make()
            ->title('Theme settings saved!')
            ->body('Frontend will reflect changes immediately.')
            ->success()
            ->send();
    }

    public function resetDefaults(): void
    {
        ThemeSetting::truncate();
        foreach (ThemeSetting::defaults() as $d) {
            ThemeSetting::create($d);
        }
        app(CmsApiService::class)->clearCache('theme');
        $this->mount();
        Notification::make()->title('Reset to defaults!')->success()->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Theme')
                ->icon('heroicon-o-check-circle')
                ->color('primary')
                ->action('save'),

            Action::make('resetDefaults')
                ->label('Reset to Defaults')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->requiresConfirmation()
                ->action('resetDefaults'),

            Action::make('clearCache')
                ->label('Clear All CMS Cache')
                ->icon('heroicon-o-trash')
                ->color('gray')
                ->action(function () {
                    app(CmsApiService::class)->clearCache();
                    Notification::make()->title('All CMS caches cleared!')->success()->send();
                }),
        ];
    }
}
