<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Actions\Action;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LowStockWidget extends BaseWidget
{
    protected static ?int $sort = 8;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where('track_stock', true)
                    ->where('stock_quantity', '<=', 10)
                    ->orderBy('stock_quantity', 'asc')
            )
            ->columns([
                Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('stock_quantity')
                    ->label('Stock Quantity')
                    ->badge()
                    ->color('danger'),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category'),
            ])
            ->actions([
                Action::make('restock')
                    ->url(fn (Product $record): string => "/admin/products/{$record->id}/edit")
                    ->icon('heroicon-m-plus-circle')
                    ->color('primary'),
            ]);
    }
}
