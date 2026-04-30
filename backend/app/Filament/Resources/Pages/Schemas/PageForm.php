<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use App\Models\Layout;
use App\Models\PageSection;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Page Builder')
                    ->columnSpanFull()
                    ->tabs([
                        // ─── Page Settings Tab ───────────────────────────
                        Tab::make('Page Settings')
                            ->icon('heroicon-o-cog-6-tooth')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('title')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                                    TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(ignoreRecord: true),
                                ]),
                                Grid::make(3)->schema([
                                    Select::make('status')
                                        ->options([
                                            'draft' => 'Draft',
                                            'published' => 'Published',
                                            'scheduled' => 'Scheduled',
                                        ])
                                        ->default('draft')
                                        ->required(),
                                    DateTimePicker::make('published_at')
                                        ->label('Publish Date')
                                        ->visible(fn ($get) => $get('status') === 'scheduled'),
                                    Select::make('layout_id')
                                        ->label('Layout')
                                        ->options(Layout::all()->pluck('name', 'id'))
                                        ->searchable()
                                        ->placeholder('Default Layout'),
                                ]),
                                Grid::make(2)->schema([
                                    Toggle::make('is_published')
                                        ->label('Published')
                                        ->default(false),
                                    Toggle::make('is_homepage')
                                        ->label('Set as Homepage')
                                        ->default(false),
                                ]),
                            ]),

                        // ─── Sections (Page Builder) Tab ─────────────────
                        Tab::make('Sections')
                            ->icon('heroicon-o-rectangle-stack')
                            ->schema([
                                Repeater::make('sections')
                                    ->relationship()
                                    ->label('Page Sections')
                                    ->reorderable()
                                    ->reorderableWithDragAndDrop()
                                    ->collapsible()
                                    ->cloneable()
                                    ->itemLabel(fn (array $state): ?string => ($state['title'] ?? '') . ' (' . ($state['type'] ?? 'unknown') . ')')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('title')
                                                ->label('Section Title')
                                                ->maxLength(255),
                                            Select::make('type')
                                                ->label('Section Type')
                                                ->options(PageSection::SECTION_TYPES)
                                                ->required()
                                                ->default('rich_text')
                                                ->live(),
                                            TextInput::make('order')
                                                ->label('Order')
                                                ->numeric()
                                                ->default(0),
                                        ]),
                                        Toggle::make('is_active')
                                            ->label('Active')
                                            ->default(true),

                                        // Content field (for rich_text, custom_html)
                                        RichEditor::make('content')
                                            ->label('Content')
                                            ->columnSpanFull()
                                            ->visible(fn ($get) => in_array($get('type'), ['rich_text', 'custom_html'])),

                                        // Component Properties (JSON key-value)
                                        Section::make('Component Properties')
                                            ->description('Configure the properties for this section type')
                                            ->collapsed()
                                            ->schema([
                                                KeyValue::make('components')
                                                    ->label('Properties')
                                                    ->columnSpanFull()
                                                    ->addActionLabel('Add Property')
                                                    ->keyLabel('Property Name')
                                                    ->valueLabel('Value'),
                                            ]),

                                        // Styles (JSON key-value)
                                        Section::make('Styles')
                                            ->description('Override default styles for this section')
                                            ->collapsed()
                                            ->schema([
                                                KeyValue::make('styles')
                                                    ->label('CSS Styles')
                                                    ->columnSpanFull()
                                                    ->addActionLabel('Add Style')
                                                    ->keyLabel('Property (e.g. backgroundColor)')
                                                    ->valueLabel('Value (e.g. #f0f0f0)'),
                                            ]),

                                        // Visibility Rules (JSON key-value)
                                        Section::make('Visibility Rules')
                                            ->description('Control when this section is visible')
                                            ->collapsed()
                                            ->schema([
                                                Repeater::make('visibility_rules')
                                                    ->label('Rules')
                                                    ->columnSpanFull()
                                                    ->schema([
                                                        Select::make('type')
                                                            ->options([
                                                                'auth' => 'Authentication',
                                                                'role' => 'User Role',
                                                                'device' => 'Device Type',
                                                                'custom' => 'Custom',
                                                            ])
                                                            ->required(),
                                                        Select::make('condition')
                                                            ->options([
                                                                'is_logged_in' => 'Is Logged In',
                                                                'is_guest' => 'Is Guest',
                                                                'has_role' => 'Has Role',
                                                                'is_mobile' => 'Is Mobile',
                                                                'is_desktop' => 'Is Desktop',
                                                            ])
                                                            ->required(),
                                                        TextInput::make('value')
                                                            ->label('Value (optional)')
                                                            ->placeholder('e.g. admin'),
                                                    ])
                                                    ->columns(3)
                                                    ->defaultItems(0),
                                            ]),

                                        // API Source (JSON)
                                        Section::make('API Data Source')
                                            ->description('Bind this section to an external API')
                                            ->collapsed()
                                            ->schema([
                                                KeyValue::make('api_source')
                                                    ->label('API Configuration')
                                                    ->columnSpanFull()
                                                    ->addActionLabel('Add Config')
                                                    ->keyLabel('Key (endpoint, method, etc.)')
                                                    ->valueLabel('Value'),
                                            ]),
                                    ])
                                    ->defaultItems(0)
                                    ->columnSpanFull(),
                            ]),

                        // ─── SEO Tab ─────────────────────────────────────
                        Tab::make('SEO & Meta')
                            ->icon('heroicon-o-magnifying-glass')
                            ->schema([
                                TextInput::make('meta_title')
                                    ->label('Meta Title')
                                    ->maxLength(60)
                                    ->helperText('Max 60 characters for optimal SEO'),
                                Textarea::make('meta_description')
                                    ->label('Meta Description')
                                    ->maxLength(160)
                                    ->helperText('Max 160 characters for optimal SEO'),
                                FileUpload::make('og_image')
                                    ->label('OG Image')
                                    ->image()
                                    ->directory('og-images'),
                                Textarea::make('json_ld')
                                    ->label('JSON-LD Structured Data')
                                    ->helperText('Paste valid JSON-LD for rich snippets')
                                    ->columnSpanFull()
                                    ->rows(6),
                            ]),
                    ]),
            ]);
    }
}
