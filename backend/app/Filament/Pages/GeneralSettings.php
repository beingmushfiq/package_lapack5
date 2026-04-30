<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class GeneralSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $title = 'General Settings';
    protected static \UnitEnum|string|null $navigationGroup = 'Settings';
    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.general-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->data = [
            'site_name' => SiteSetting::getValue('site_name', 'AmarShop'),
            'site_description' => SiteSetting::getValue('site_description'),
            'site_logo' => SiteSetting::getValue('site_logo'),
            'site_email' => SiteSetting::getValue('site_email'),
            'site_phone' => SiteSetting::getValue('site_phone'),
            'site_address' => SiteSetting::getValue('site_address'),
            'facebook_url' => SiteSetting::getValue('facebook_url'),
            'instagram_url' => SiteSetting::getValue('instagram_url'),
            'twitter_url' => SiteSetting::getValue('twitter_url'),
            'youtube_url' => SiteSetting::getValue('youtube_url'),
            'announcement_text' => SiteSetting::getValue('announcement_text'),
        ];

        $this->form->fill($this->data);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Site Branding')
                    ->schema([
                        TextInput::make('site_name')
                            ->required(),
                        Textarea::make('site_description')
                            ->rows(3),
                        FileUpload::make('site_logo')
                            ->image()
                            ->directory('settings'),
                    ]),

                Section::make('Contact Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('site_email')
                                    ->email(),
                                TextInput::make('site_phone'),
                            ]),
                        TextInput::make('site_address'),
                    ]),

                Section::make('Social Media Links')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('facebook_url')
                                    ->url(),
                                TextInput::make('instagram_url')
                                    ->url(),
                                TextInput::make('twitter_url')
                                    ->url(),
                                TextInput::make('youtube_url')
                                    ->url(),
                            ]),
                    ]),

                Section::make('Header/Footer Announcements')
                    ->schema([
                        TextInput::make('announcement_text')
                            ->placeholder('e.g. Free Shipping over ৳1000'),
                    ]),
            ])
            ->statePath('data');
    }

    public function submit(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Notification::make()
            ->title('General settings saved!')
            ->success()
            ->send();
    }
}
