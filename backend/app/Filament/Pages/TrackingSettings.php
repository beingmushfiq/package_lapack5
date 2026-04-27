<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class TrackingSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-presentation-chart-line';
    protected static ?string $title = 'Tracking & Analytics';
    protected static ?string $navigationLabel = 'Tracking Settings';
    protected static \UnitEnum|string|null $navigationGroup = 'Settings';

    protected string $view = 'filament.pages.tracking-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->data = [
            'fb_pixel_id' => SiteSetting::getValue('fb_pixel_id'),
            'fb_pixel_enabled' => (bool) SiteSetting::getValue('fb_pixel_enabled'),
            'fb_test_event_code' => SiteSetting::getValue('fb_test_event_code'),
            'fb_capi_access_token' => SiteSetting::getValue('fb_capi_access_token'),
            'fb_capi_enabled' => (bool) SiteSetting::getValue('fb_capi_enabled'),
            'gtm_id' => SiteSetting::getValue('gtm_id'),
            'gtm_enabled' => (bool) SiteSetting::getValue('gtm_enabled'),
        ];

        $this->form->fill($this->data);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Facebook Meta Pixel')
                    ->description('Browser-side Pixel tracking for ad optimization and conversion measurement.')
                    ->schema([
                        TextInput::make('fb_pixel_id')
                            ->label('Facebook Pixel ID')
                            ->placeholder('e.g. 1234567890'),
                        Toggle::make('fb_pixel_enabled')
                            ->label('Enable Facebook Pixel')
                            ->helperText('Turn on/off browser-side Pixel tracking.'),
                        TextInput::make('fb_test_event_code')
                            ->label('Test Event Code')
                            ->placeholder('e.g. TEST12345')
                            ->helperText('From Facebook Events Manager → Test Events. Leave blank for production.'),
                    ])->columns(2),

                Section::make('Facebook Conversions API (CAPI)')
                    ->description('Server-side event tracking for reliable data even with ad blockers. Requires a System User Access Token from Facebook Business Settings.')
                    ->schema([
                        TextInput::make('fb_capi_access_token')
                            ->label('CAPI Access Token')
                            ->password()
                            ->placeholder('EAAxxxxxxx...')
                            ->helperText('System User Token with ads_management permission.'),
                        Toggle::make('fb_capi_enabled')
                            ->label('Enable CAPI')
                            ->helperText('Send events server-side to Facebook. Pixel ID above is shared.'),
                    ])->columns(2),

                Section::make('Google Tag Manager')
                    ->description('Integrate GTM for advanced tracking and tag management.')
                    ->schema([
                        TextInput::make('gtm_id')
                            ->label('GTM ID')
                            ->placeholder('e.g. GTM-XXXXXXX'),
                        Toggle::make('gtm_enabled')
                            ->label('Enable GTM')
                            ->helperText('Turn on/off GTM tracking globally.'),
                    ])->columns(2),
            ])
            ->statePath('data');
    }

    public function submit(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? 'true' : 'false') : $value]
            );
        }

        Notification::make()
            ->title('Settings saved successfully!')
            ->success()
            ->send();
    }
}
