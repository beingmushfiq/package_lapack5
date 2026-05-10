<?php

namespace App\Filament\Widgets;

use App\Models\Page;
use App\Models\CmsPopup;
use App\Models\CmsAnnouncementBar;
use App\Models\TrackingScript;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CmsQuickStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('CMS Pages', Page::count())
                ->description('Total active pages')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info'),
            Stat::make('Active Popups', CmsPopup::where('is_active', true)->count())
                ->description('Marketing popups live')
                ->descriptionIcon('heroicon-m-megaphone')
                ->color('warning'),
            Stat::make('Tracking Scripts', TrackingScript::where('is_active', true)->count())
                ->description('Third-party pixels active')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('success'),
        ];
    }
}
