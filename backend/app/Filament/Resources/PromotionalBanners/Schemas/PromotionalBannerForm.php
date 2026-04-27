<?php

namespace App\Filament\Resources\PromotionalBanners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PromotionalBannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                FileUpload::make('image')
                    ->image()
                    ->required(),
                TextInput::make('link'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
