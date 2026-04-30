<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class SmsSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $title = 'SMS Settings';
    protected static \UnitEnum|string|null $navigationGroup = 'Settings';
    protected static ?int $navigationSort = 3;

    protected string $view = 'filament.pages.sms-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->data = [
            'sms_enabled' => (bool) SiteSetting::getValue('sms_enabled', false),
            'sms_api_key' => SiteSetting::getValue('sms_api_key'),
            'sms_sender_id' => SiteSetting::getValue('sms_sender_id'),
            'order_placed_sms' => SiteSetting::getValue('order_placed_sms', 'Dear Customer, your order #{order_number} for {amount} has been placed successfully.'),
            'order_confirmed_sms' => SiteSetting::getValue('order_confirmed_sms', 'Your order #{order_number} has been confirmed and is being processed.'),
            'order_shipped_sms' => SiteSetting::getValue('order_shipped_sms', 'Great news! Your order #{order_number} has been shipped via {courier}. Tracking ID: {tracking_id}'),
        ];

        $this->form->fill($this->data);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Gateway Configuration')
                    ->schema([
                        Toggle::make('sms_enabled')
                            ->label('Enable SMS Notifications'),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('sms_api_key')
                                    ->label('API Key/Token'),
                                TextInput::make('sms_sender_id')
                                    ->label('Sender ID (Non-Masking/Masking)'),
                            ]),
                    ]),

                Section::make('SMS Templates')
                    ->description('Use placeholders like {order_number}, {amount}, {courier}, {tracking_id}')
                    ->schema([
                        Textarea::make('order_placed_sms')
                            ->label('Order Placed Template')
                            ->rows(2),
                        Textarea::make('order_confirmed_sms')
                            ->label('Order Confirmed Template')
                            ->rows(2),
                        Textarea::make('order_shipped_sms')
                            ->label('Order Shipped Template')
                            ->rows(2),
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
                ['value' => is_bool($value) ? ($value ? 'true' : 'false') : $value]
            );
        }

        Notification::make()
            ->title('SMS settings saved!')
            ->success()
            ->send();
    }
}
