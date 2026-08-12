<?php

namespace App\Filament\Resources\GameReviewResource\Pages;

use App\Filament\Resources\GameReviewResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditGameReview extends EditRecord
{
    protected static string $resource = GameReviewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
