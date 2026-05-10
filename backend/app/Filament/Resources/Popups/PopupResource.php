<?php

namespace App\Filament\Resources\Popups;

use App\Models\CmsPopup;
use BackedEnum;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\TernaryFilter;

class PopupResource extends Resource
{
    protected static ?string $model = CmsPopup::class;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|\UnitEnum|null $navigationGroup = 'CMS';
    protected static ?string $navigationLabel = 'Popups';
    protected static ?int $navigationSort = 7;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Popup Content')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('name')->required()->label('Internal Name'),
                        TextInput::make('title')->label('Popup Title'),
                    ]),
                    RichEditor::make('content')->label('Content')->columnSpanFull(),
                    Grid::make(2)->schema([
                        FileUpload::make('image')->label('Popup Image')->image()->directory('popups'),
                        Grid::make(1)->schema([
                            TextInput::make('button_text')->label('Button Text')->placeholder('Shop Now'),
                            TextInput::make('button_url')->label('Button URL')->placeholder('/products'),
                        ]),
                    ]),
                ]),

            Section::make('Trigger Settings')
                ->schema([
                    Grid::make(3)->schema([
                        Select::make('trigger')
                            ->options([
                                'delay' => 'Time Delay',
                                'exit_intent' => 'Exit Intent',
                                'scroll' => 'Scroll Depth',
                                'page_load' => 'Page Load',
                            ])
                            ->default('delay')
                            ->live()
                            ->required(),
                        TextInput::make('trigger_delay')
                            ->label('Delay (seconds)')
                            ->numeric()
                            ->default(3)
                            ->visible(fn ($get) => $get('trigger') === 'delay'),
                        TextInput::make('trigger_scroll')
                            ->label('Scroll Depth (%)')
                            ->numeric()
                            ->default(50)
                            ->visible(fn ($get) => $get('trigger') === 'scroll'),
                    ]),
                    Grid::make(3)->schema([
                        Select::make('position')
                            ->options(['center' => 'Center', 'bottom-left' => 'Bottom Left', 'bottom-right' => 'Bottom Right', 'top' => 'Top'])
                            ->default('center'),
                        Select::make('size')
                            ->options(['sm' => 'Small', 'md' => 'Medium', 'lg' => 'Large', 'xl' => 'Extra Large', 'full' => 'Full Screen'])
                            ->default('md'),
                        TextInput::make('show_after_visits')->label('Show After N Visits')->numeric()->default(0)
                            ->helperText('0 = always show'),
                    ]),
                    Toggle::make('is_dismissible')->label('Allow Dismiss')->default(true),
                ]),

            Section::make('Scheduling & Visibility')
                ->schema([
                    Grid::make(2)->schema([
                        DateTimePicker::make('schedule_start')->label('Start Date'),
                        DateTimePicker::make('schedule_end')->label('End Date'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('order')->numeric()->default(0),
                        Toggle::make('is_active')->label('Active')->default(true),
                    ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('trigger')->badge(),
                TextColumn::make('position')->badge()->color('gray'),
                ToggleColumn::make('is_active')->label('Active'),
                TextColumn::make('schedule_start')->dateTime()->label('Start'),
                TextColumn::make('schedule_end')->dateTime()->label('End'),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Active'),
            ])
            ->defaultSort('order');
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\Popups\Pages\ListPopups::route('/'),
            'create' => \App\Filament\Resources\Popups\Pages\CreatePopup::route('/create'),
            'edit' => \App\Filament\Resources\Popups\Pages\EditPopup::route('/{record}/edit'),
        ];
    }
}
