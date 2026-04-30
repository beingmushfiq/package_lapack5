<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Product Details')
                    ->tabs([
                        Tabs\Tab::make('General')
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),
                                Textarea::make('short_description')
                                    ->rows(2)
                                    ->columnSpanFull(),
                                RichEditor::make('description')
                                    ->columnSpanFull(),
                            ])->columns(2),
                        
                        Tabs\Tab::make('Pricing & Inventory')
                            ->schema([
                                TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('৳'),
                                TextInput::make('discount_price')
                                    ->numeric()
                                    ->prefix('৳'),
                                Toggle::make('in_stock')
                                    ->label('Show as In Stock')
                                    ->default(true),
                                Toggle::make('track_stock')
                                    ->label('Track Inventory')
                                    ->live(),
                                TextInput::make('stock_quantity')
                                    ->label('Available Quantity')
                                    ->numeric()
                                    ->visible(fn ($get) => $get('track_stock')),
                                Toggle::make('is_new')
                                    ->label('New Arrival'),
                                Toggle::make('is_featured')
                                    ->label('Featured (Trending)'),
                                TextInput::make('sold_count')
                                    ->numeric()
                                    ->default(0),
                            ])->columns(2),

                        Tabs\Tab::make('Associations')
                            ->schema([
                                Select::make('category_id')
                                    ->relationship('category', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Select::make('brand_id')
                                    ->relationship('brand', 'name')
                                    ->searchable()
                                    ->preload(),
                                TextInput::make('youtube_url')
                                    ->url()
                                    ->placeholder('https://www.youtube.com/watch?v=...'),
                            ])->columns(2),

                        Tabs\Tab::make('Media')
                            ->schema([
                                FileUpload::make('image')
                                    ->image()
                                    ->label('Main Image')
                                    ->directory('products'),
                                Repeater::make('images')
                                    ->relationship('images')
                                    ->schema([
                                        FileUpload::make('image_path')
                                            ->image()
                                            ->required()
                                            ->directory('products/gallery'),
                                    ])
                                    ->columns(1)
                                    ->grid(2)
                                    ->label('Gallery Images'),
                            ]),

                        Tabs\Tab::make('Variations & Specs')
                            ->schema([
                                Repeater::make('variations')
                                    ->relationship('variations')
                                    ->schema([
                                        TextInput::make('name')->placeholder('e.g. Color'),
                                        TextInput::make('value')->placeholder('e.g. Red'),
                                        TextInput::make('price_modifier')
                                            ->numeric()
                                            ->prefix('+/- ৳')
                                            ->helperText('Additional cost for this variation'),
                                    ])
                                    ->columns(3)
                                    ->label('Product Variations'),
                                
                                Repeater::make('specifications')
                                    ->relationship('specifications')
                                    ->schema([
                                        TextInput::make('key')->placeholder('e.g. Material'),
                                        TextInput::make('value')->placeholder('e.g. Cotton'),
                                    ])
                                    ->columns(2)
                                    ->label('Technical Specifications'),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
