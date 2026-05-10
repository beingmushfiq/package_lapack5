<?php

namespace App\Filament\Resources\TrackingScripts;

use App\Filament\Resources\TrackingScripts\Pages\ManageTrackingScripts;
use App\Models\TrackingScript;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TrackingScriptResource extends Resource
{
    protected static ?string $model = TrackingScript::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)->schema([
                    TextInput::make('name')
                        ->required()
                        ->placeholder('e.g., Facebook Pixel'),
                    Select::make('type')
                        ->options([
                            'facebook_pixel' => 'Facebook Pixel',
                            'google_analytics' => 'Google Analytics / GTM',
                            'tiktok_pixel' => 'TikTok Pixel',
                            'custom' => 'Custom / Other',
                        ])
                        ->default('custom')
                        ->required(),
                ]),
                Textarea::make('script') // Fixed from script_code
                    ->label('Script Content')
                    ->placeholder('<script>...</script>')
                    ->required()
                    ->rows(10)
                    ->columnSpanFull(),
                Grid::make(2)->schema([
                    Select::make('position')
                        ->options([
                            'head' => 'Head',
                            'body_start' => 'Body Start',
                            'body_end' => 'Body End',
                        ])
                        ->required()
                        ->default('head'),
                    Toggle::make('is_active')
                        ->label('Enabled')
                        ->default(true),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('position')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->boolean(),
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
            'index' => ManageTrackingScripts::route('/'),
        ];
    }
}
