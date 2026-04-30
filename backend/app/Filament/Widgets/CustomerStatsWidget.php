<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class CustomerStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalCustomers = User::count();
        $newCustomersThisMonth = User::whereMonth('created_at', now()->month)->count();
        
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('payable_amount');
        $totalOrders = Order::where('status', '!=', 'cancelled')->count();
        $aov = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return [
            Stat::make('Total Customers', $totalCustomers)
                ->description($newCustomersThisMonth . ' new this month')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success'),
            Stat::make('Average Order Value (AOV)', '৳' . number_format($aov, 2))
                ->description('Revenue per transaction')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('info'),
            Stat::make('Customer Conversion', $this->getConversionRate() . '%')
                ->description('Orders vs Total Users')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('primary'),
        ];
    }

    protected function getConversionRate(): float
    {
        $usersWithOrders = Order::distinct('user_id')->count('user_id');
        $totalUsers = User::count();
        
        if ($totalUsers === 0) return 0;
        
        return round(($usersWithOrders / $totalUsers) * 100, 1);
    }
}
