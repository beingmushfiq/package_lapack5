<?php

namespace App\Filament\Resources\CmsAnnouncementBars\Pages;

use App\Filament\Resources\CmsAnnouncementBars\CmsAnnouncementBarResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageCmsAnnouncementBars extends ManageRecords
{
    protected static string $resource = CmsAnnouncementBarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
