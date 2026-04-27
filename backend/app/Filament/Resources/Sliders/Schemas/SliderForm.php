<?php

namespace App\Filament\Resources\Sliders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SliderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                TextInput::make('subtitle'),
                FileUpload::make('image')
                    ->image()
                    ->required(),
                TextInput::make('button_text'),
                TextInput::make('color'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
