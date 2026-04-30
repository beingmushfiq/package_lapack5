<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class LogisticsSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-truck';
    protected static ?string $title = 'Logistics & Courier';
    protected static \UnitEnum|string|null $navigationGroup = 'Settings';
    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.logistics-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->data = [
            'default_courier' => SiteSetting::getValue('default_courier', 'steadfast'),
            'steadfast_api_key' => SiteSetting::getValue('steadfast_api_key'),
            'steadfast_secret_key' => SiteSetting::getValue('steadfast_secret_key'),
            'pathao_client_id' => SiteSetting::getValue('pathao_client_id'),
            'pathao_client_secret' => SiteSetting::getValue('pathao_client_secret'),
            'pathao_username' => SiteSetting::getValue('pathao_username'),
            'pathao_password' => SiteSetting::getValue('pathao_password'),
            'pathao_store_id' => SiteSetting::getValue('pathao_store_id'),
            'redx_api_token' => SiteSetting::getValue('redx_api_token'),
            'auto_send_to_courier' => (bool) SiteSetting::getValue('auto_send_to_courier', false),
            'webhook_secret' => SiteSetting::getValue('webhook_secret'),
        ];

        $this->form->fill($this->data);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('General Logistics')
                    ->schema([
                        Select::make('default_courier')
                            ->options([
                                'steadfast' => 'Steadfast Courier',
                                'pathao' => 'Pathao Courier',
                                'redx' => 'RedX',
                            ])
                            ->required(),
                        Toggle::make('auto_send_to_courier')
                            ->label('Auto-send to Courier')
                            ->helperText('Automatically create a courier order when an order is "Confirmed".'),
                    ]),

                Section::make('Steadfast Courier API')
                    ->description('Get your API keys from Steadfast Panel.')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('steadfast_api_key')
                                    ->label('API Key'),
                                TextInput::make('steadfast_secret_key')
                                    ->label('Secret Key'),
                            ]),
                    ]),

                Section::make('Pathao Courier API')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('pathao_client_id'),
                                TextInput::make('pathao_client_secret'),
                                TextInput::make('pathao_username'),
                                TextInput::make('pathao_password')
                                    ->password(),
                                TextInput::make('pathao_store_id'),
                            ]),
                    ]),

                Section::make('RedX API')
                    ->schema([
                        TextInput::make('redx_api_token')
                            ->label('API Token'),
                    ]),

                Section::make('Webhook Settings')
                    ->description('Use this secret to verify incoming webhooks from couriers.')
                    ->schema([
                        TextInput::make('webhook_secret')
                            ->label('Webhook Secret Key')
                            ->password()
                            ->hintAction(
                            \Filament\Actions\Action::make('generateSecret')
                                ->icon('heroicon-m-arrow-path')
                                ->action(fn (TextInput $component) => $component->state(bin2hex(random_bytes(16))))
                        ),
                        Placeholder::make('webhook_url')
                            ->label('Your Webhook URL')
                            ->content(url('/api/v1/webhooks/courier')),
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
            ->title('Logistics settings saved!')
            ->success()
            ->send();
    }
}
