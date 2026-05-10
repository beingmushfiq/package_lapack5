<?php

namespace App\Filament\Resources\Pages\RelationManagers;

use Filament\Actions\AssociateAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DissociateAction;
use Filament\Actions\DissociateBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SectionsRelationManager extends RelationManager
{
    protected static string $relationship = 'sections';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Grid::make(2)->schema([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    \Filament\Forms\Components\Select::make('type')
                        ->options(\App\Models\PageSection::SECTION_TYPES)
                        ->required()
                        ->reactive()
                        ->native(false),
                ]),

                \Filament\Schemas\Components\Section::make('Configuration')
                    ->schema([
                        // Hero Slider
                        \Filament\Forms\Components\Repeater::make('components.slides')
                            ->label('Slides')
                            ->schema([
                                \Filament\Forms\Components\FileUpload::make('image')
                                    ->image()
                                    ->directory('cms/hero')
                                    ->required(),
                                TextInput::make('title'),
                                TextInput::make('subtitle'),
                                TextInput::make('button_text'),
                                TextInput::make('button_link'),
                            ])
                            ->visible(fn ($get) => $get('type') === 'hero_slider')
                            ->columnSpanFull(),

                        // Category Sidebar
                        \Filament\Forms\Components\Group::make([
                            \Filament\Forms\Components\Toggle::make('components.show_icons')->label('Show Icons')->default(true),
                            \Filament\Forms\Components\Toggle::make('components.show_count')->label('Show Product Count')->default(true),
                            \Filament\Forms\Components\TextInput::make('components.limit')->label('Category Limit')->numeric()->default(10),
                        ])
                        ->visible(fn ($get) => $get('type') === 'category_sidebar')
                        ->columns(3),

                        // Accordion Section
                        \Filament\Forms\Components\Repeater::make('components.items')
                            ->label('Accordion Items')
                            ->schema([
                                TextInput::make('title')->required(),
                                \Filament\Forms\Components\RichEditor::make('content')->required(),
                                \Filament\Forms\Components\Toggle::make('is_open')->label('Open by default'),
                            ])
                            ->visible(fn ($get) => $get('type') === 'accordion_section')
                            ->columnSpanFull(),

                        // Tabs Section
                        \Filament\Forms\Components\Repeater::make('components.tabs')
                            ->label('Tabs')
                            ->schema([
                                TextInput::make('label')->required(),
                                \Filament\Forms\Components\Select::make('content_type')
                                    ->options([
                                        'rich_text' => 'Rich Text',
                                        'product_grid' => 'Product Grid',
                                    ])
                                    ->required(),
                                \Filament\Forms\Components\RichEditor::make('content')
                                    ->visible(fn ($get) => $get('content_type') === 'rich_text'),
                                \Filament\Forms\Components\Select::make('category_id')
                                    ->label('Category for Products')
                                    ->options(\App\Models\Category::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->visible(fn ($get) => $get('content_type') === 'product_grid'),
                            ])
                            ->visible(fn ($get) => $get('type') === 'tabs_section')
                            ->columnSpanFull(),

                        // Product Grid / Carousel Settings
                        \Filament\Forms\Components\Group::make([
                            \Filament\Forms\Components\Select::make('components.category_id')
                                ->label('Category')
                                ->options(\App\Models\Category::all()->pluck('name', 'id'))
                                ->searchable(),
                            \Filament\Forms\Components\TextInput::make('components.limit')->label('Limit')->numeric()->default(8),
                            \Filament\Forms\Components\Toggle::make('components.show_pagination')->label('Show Pagination'),
                        ])
                        ->visible(fn ($get) => in_array($get('type'), ['product_grid', 'product_carousel']))
                        ->columns(3),
                    ]),

                \Filament\Schemas\Components\Section::make('Display & Visibility')
                    ->collapsed()
                    ->schema([
                        \Filament\Forms\Components\Grid::make(3)->schema([
                            \Filament\Forms\Components\TextInput::make('order')->numeric()->default(0),
                            \Filament\Forms\Components\Toggle::make('is_active')->label('Active')->default(true),
                            \Filament\Forms\Components\TextInput::make('css_classes')->placeholder('p-4 bg-gray-50'),
                        ]),
                    ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
                AssociateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DissociateAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DissociateBulkAction::make(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
