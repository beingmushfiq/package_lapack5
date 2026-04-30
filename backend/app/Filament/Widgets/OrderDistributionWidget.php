<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class OrderDistributionWidget extends ChartWidget
{
    protected ?string $heading = 'Order Status Distribution';
    protected static ?int $sort = 3;
    protected ?string $maxHeight = '250px';

    protected function getData(): array
    {
        $data = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $labels = array_keys($data);
        $values = array_values($data);

        // Map labels to be more readable
        $labels = array_map(fn($label) => ucfirst($label), $labels);

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $values,
                    'backgroundColor' => [
                        '#fbbf24', // pending - yellow
                        '#60a5fa', // confirmed - blue
                        '#a78bfa', // processing - purple
                        '#818cf8', // shipped - indigo
                        '#34d399', // delivered - emerald
                        '#f87171', // cancelled - red
                    ],
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
