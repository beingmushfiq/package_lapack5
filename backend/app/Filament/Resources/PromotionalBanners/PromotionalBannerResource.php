<?php

namespace App\Filament\Resources\PromotionalBanners;

use App\Filament\Resources\PromotionalBanners\Pages\CreatePromotionalBanner;
use App\Filament\Resources\PromotionalBanners\Pages\EditPromotionalBanner;
use App\Filament\Resources\PromotionalBanners\Pages\ListPromotionalBanners;
use App\Filament\Resources\PromotionalBanners\Schemas\PromotionalBannerForm;
use App\Filament\Resources\PromotionalBanners\Tables\PromotionalBannersTable;
use App\Models\PromotionalBanner;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PromotionalBannerResource extends Resource
{
    protected static ?string $model = PromotionalBanner::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PromotionalBannerForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PromotionalBannersTable::configure($table);
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
            'index' => ListPromotionalBanners::route('/'),
            'create' => CreatePromotionalBanner::route('/create'),
            'edit' => EditPromotionalBanner::route('/{record}/edit'),
        ];
    }
}
