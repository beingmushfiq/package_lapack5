<?php

namespace App\Filament\Resources\SmsLogs\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Schema;

class SmsLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('phone')
                    ->disabled(),
                TextInput::make('status')
                    ->disabled(),
                TextInput::make('provider')
                    ->disabled(),
                Textarea::make('message')
                    ->disabled()
                    ->rows(3)
                    ->columnSpanFull(),
                Textarea::make('response')
                    ->disabled()
                    ->rows(5)
                    ->columnSpanFull(),
            ]);
    }
}
