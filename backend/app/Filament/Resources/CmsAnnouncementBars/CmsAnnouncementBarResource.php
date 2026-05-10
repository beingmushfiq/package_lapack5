<?php

namespace App\Filament\Resources\CmsAnnouncementBars;

use App\Filament\Resources\CmsAnnouncementBars\Pages\ManageCmsAnnouncementBars;
use App\Models\CmsAnnouncementBar;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\RichEditor;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CmsAnnouncementBarResource extends Resource
{
    protected static ?string $model = CmsAnnouncementBar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'content';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->placeholder('Internal Name (e.g., Ramadan Promo)'),
                RichEditor::make('content')
                    ->required()
                    ->columnSpanFull(),
                Grid::make(2)->schema([
                    ColorPicker::make('background_color')
                        ->required()
                        ->default('#10b981'),
                    ColorPicker::make('text_color')
                        ->required()
                        ->default('#ffffff'),
                ]),
                Grid::make(2)->schema([
                    TextInput::make('link_url')
                        ->url()
                        ->placeholder('https://...'),
                    TextInput::make('link_text')
                        ->placeholder('e.g., Shop Now'),
                ]),
                Grid::make(3)->schema([
                    Select::make('position')
                        ->options([
                            'top' => 'Top Header',
                            'bottom' => 'Bottom Sticky',
                        ])
                        ->required()
                        ->default('top'),
                    Toggle::make('is_dismissible')
                        ->label('User can close')
                        ->default(true),
                    Toggle::make('is_active')
                        ->label('Enabled')
                        ->default(true),
                ]),
                Section::make('Scheduling & Visibility')
                    ->collapsed()
                    ->schema([
                        Grid::make(2)->schema([
                            DateTimePicker::make('schedule_start'),
                            DateTimePicker::make('schedule_end'),
                        ]),
                        TextInput::make('order')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('content')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('background_color')
                    ->searchable(),
                TextColumn::make('text_color')
                    ->searchable(),
                TextColumn::make('link_url')
                    ->searchable(),
                TextColumn::make('link_text')
                    ->searchable(),
                IconColumn::make('is_dismissible')
                    ->boolean(),
                TextColumn::make('position')
                    ->searchable(),
                TextColumn::make('schedule_start')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('schedule_end')
                    ->dateTime()
                    ->sortable(),
                IconColumn::make('is_active')
                    ->boolean(),
                TextColumn::make('order')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCmsAnnouncementBars::route('/'),
        ];
    }
}
