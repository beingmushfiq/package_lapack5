<?php

namespace App\Filament\Resources\ActivityLogs;

use App\Filament\Resources\ActivityLogs\Pages\ManageActivityLogs;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Spatie\Activitylog\Models\Activity;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Flex;
use Filament\Support\Icons\Heroicon;

class ActivityLogResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedFingerPrint;
    protected static string|\UnitEnum|null $navigationGroup = 'Internal';

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Activity Details')
                    ->schema([
                        Grid::make(2)->schema([
                            Group::make([
                                Text::make('Description')->weight('bold'),
                                Text::make(fn ($record) => $record->description),
                            ]),
                            Group::make([
                                Text::make('Log Name')->weight('bold'),
                                Text::make(fn ($record) => $record->log_name)->badge(),
                            ]),
                            Group::make([
                                Text::make('Entity Type')->weight('bold'),
                                Text::make(fn ($record) => class_basename($record->subject_type)),
                            ]),
                            Group::make([
                                Text::make('Entity ID')->weight('bold'),
                                Text::make(fn ($record) => $record->subject_id),
                            ]),
                            Group::make([
                                Text::make('Triggered By')->weight('bold'),
                                Text::make(fn ($record) => $record->causer?->name ?? 'System'),
                            ]),
                            Group::make([
                                Text::make('Date & Time')->weight('bold'),
                                Text::make(fn ($record) => $record->created_at->toDateTimeString()),
                            ]),
                        ]),
                    ]),

                Section::make('Changes')
                    ->schema([
                        Flex::make([
                             Text::make('View detailed properties in the raw log if needed. (Data rendering in progress for v5 compatibility)')->color('gray'),
                        ])
                    ])
                    ->visible(fn ($record) => !empty($record->properties))
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('log_name')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Entity')
                    ->formatStateUsing(fn ($state) => class_basename($state))
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject_id')
                    ->label('ID'),
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('User'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('log_name')
                    ->options([
                        'default' => 'Default',
                        'order' => 'Order',
                        'product' => 'Product',
                    ]),
            ])
            ->actions([
                \Filament\Actions\ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageActivityLogs::route('/'),
        ];
    }
}
