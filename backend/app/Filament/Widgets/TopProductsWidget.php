<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;

class TopProductsWidget extends BaseWidget
{
    protected static ?int $sort = 7;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
                    ->join('order_items', 'products.id', '=', 'order_items.product_id')
                    ->groupBy('products.id')
                    ->orderByDesc('total_sold')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_sold')
                    ->label('Total Sold')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('stock_quantity')
                    ->label('Stock Left')
                    ->numeric()
                    ->color(fn ($state) => $state <= 10 ? 'danger' : 'gray'),
                Tables\Columns\TextColumn::make('price')
                    ->money('BDT'),
            ]);
    }
}
