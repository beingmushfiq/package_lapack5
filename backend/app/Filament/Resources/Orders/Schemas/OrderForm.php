<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->numeric(),
                TextInput::make('order_number')
                    ->required(),
                TextInput::make('total_amount')
                    ->required()
                    ->numeric(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('payment_method'),
                TextInput::make('payment_status')
                    ->required()
                    ->default('pending'),
                Textarea::make('shipping_address')
                    ->columnSpanFull(),
                Textarea::make('billing_address')
                    ->columnSpanFull(),
            ]);
    }
}
