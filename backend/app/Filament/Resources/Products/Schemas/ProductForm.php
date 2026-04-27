<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('original_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('discount')
                    ->numeric(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('category_id')
                    ->numeric(),
                TextInput::make('rating')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('reviews')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_new')
                    ->required(),
                TextInput::make('sold_count')
                    ->required()
                    ->default('0'),
                Toggle::make('in_stock')
                    ->required(),
            ]);
    }
}
