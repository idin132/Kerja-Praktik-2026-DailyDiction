<?php

namespace App\Filament\Resources\MemberUserResource\Pages;

use App\Filament\Resources\MemberUserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMemberUser extends EditRecord
{
    protected static string $resource = MemberUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
