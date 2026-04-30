<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->uppercase(),
                Select::make('type')
                    ->options([
                        'fixed' => 'Fixed Amount',
                        'percentage' => 'Percentage',
                    ])
                    ->required(),
                TextInput::make('value')
                    ->numeric()
                    ->required(),
                TextInput::make('min_order_amount')
                    ->numeric()
                    ->prefix('৳'),
                TextInput::make('usage_limit')
                    ->numeric(),
                DateTimePicker::make('expires_at'),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
