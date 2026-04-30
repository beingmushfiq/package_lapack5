<?php

namespace App\Filament\Resources\ShippingZones\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ShippingZoneForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->placeholder('e.g. Dhaka City, Outside Dhaka'),
                TextInput::make('cost')
                    ->numeric()
                    ->required()
                    ->prefix('৳'),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
