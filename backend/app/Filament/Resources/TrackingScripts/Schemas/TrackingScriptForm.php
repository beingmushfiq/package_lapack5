<?php

namespace App\Filament\Resources\TrackingScripts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TrackingScriptForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->placeholder('e.g. Google Tag Manager, Facebook Pixel'),
                Textarea::make('script_code')
                    ->required()
                    ->rows(10)
                    ->fontFamily('mono'),
                Select::make('position')
                    ->options([
                        'head' => 'Header',
                        'body' => 'Body (Top)',
                    ])
                    ->required()
                    ->default('head'),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
