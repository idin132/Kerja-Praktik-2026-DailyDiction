<?php

namespace App\Filament\Resources\MemberUserResource\Pages;

use App\Filament\Resources\MemberUserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMemberUsers extends ListRecords
{
    protected static string $resource = MemberUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
