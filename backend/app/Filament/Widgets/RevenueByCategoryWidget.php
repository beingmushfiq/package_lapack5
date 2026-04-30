<?php

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueByCategoryWidget extends ChartWidget
{
    protected ?string $heading = 'Revenue by Category';
    protected static ?int $sort = 4;
    protected ?string $maxHeight = '250px';

    protected function getData(): array
    {
        $data = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(order_items.total) as total_revenue'))
            ->groupBy('categories.name')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (৳)',
                    'data' => $data->pluck('total_revenue')->toArray(),
                    'backgroundColor' => '#10b981',
                ],
            ],
            'labels' => $data->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
