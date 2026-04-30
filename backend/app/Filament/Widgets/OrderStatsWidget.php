<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class OrderStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        return [
            Stat::make('Total Sales (Today)', '৳' . number_format(Order::whereDate('created_at', $today)->sum('payable_amount'), 0))
                ->description('Orders: ' . Order::whereDate('created_at', $today)->count())
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Pending Orders', Order::where('status', 'pending')->count())
                ->description('Need processing')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Monthly Revenue', '৳' . number_format(Order::where('created_at', '>=', $startOfMonth)->sum('payable_amount'), 0))
                ->description('Since ' . $startOfMonth->format('M 1st'))
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info'),
        ];
    }
}
