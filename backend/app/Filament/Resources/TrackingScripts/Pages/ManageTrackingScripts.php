<?php

namespace App\Filament\Resources\TrackingScripts\Pages;

use App\Filament\Resources\TrackingScripts\TrackingScriptResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageTrackingScripts extends ManageRecords
{
    protected static string $resource = TrackingScriptResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
