<?php

namespace App\Filament\Resources\TrackingScripts;

use App\Filament\Resources\TrackingScripts\Pages\CreateTrackingScript;
use App\Filament\Resources\TrackingScripts\Pages\EditTrackingScript;
use App\Filament\Resources\TrackingScripts\Pages\ListTrackingScripts;
use App\Filament\Resources\TrackingScripts\Schemas\TrackingScriptForm;
use App\Filament\Resources\TrackingScripts\Tables\TrackingScriptsTable;
use App\Models\TrackingScript;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TrackingScriptResource extends Resource
{
    protected static ?string $model = TrackingScript::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCodeBracket;

    protected static string|\UnitEnum|null $navigationGroup = 'Settings';

    public static function form(Schema $schema): Schema
    {
        return TrackingScriptForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TrackingScriptsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTrackingScripts::route('/'),
            'create' => CreateTrackingScript::route('/create'),
            'edit' => EditTrackingScript::route('/{record}/edit'),
        ];
    }
}
