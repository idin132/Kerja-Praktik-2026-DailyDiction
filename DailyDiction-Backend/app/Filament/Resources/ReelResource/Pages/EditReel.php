<?php

namespace App\Filament\Resources\ReelResource\Pages;

use App\Filament\Resources\ReelResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditReel extends EditRecord
{
    protected static string $resource = ReelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
