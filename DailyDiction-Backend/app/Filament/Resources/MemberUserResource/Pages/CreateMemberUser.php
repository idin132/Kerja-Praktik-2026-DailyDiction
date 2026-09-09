<?php

namespace App\Filament\Resources\MemberUserResource\Pages;

use App\Filament\Resources\MemberUserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateMemberUser extends CreateRecord
{
    protected static string $resource = MemberUserResource::class;
}
