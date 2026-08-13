<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SponsorResource\Pages;
use App\Filament\Resources\SponsorResource\RelationManagers;
use App\Models\Sponsor;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

// 1. TAMBAHIN IMPORT INI DI SINI BIAR KOMPONENNYA KEBACA
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;

class SponsorResource extends Resource
{
    protected static ?string $model = Sponsor::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            // 2. TARUH KODINGAN FORM-NYA DI DALAM SCHEMA SINI
            ->schema([
                TextInput::make('name')
                    ->label('Nama Sponsor')
                    ->required()
                    ->maxLength(255),
                
                FileUpload::make('logo_image')
                    ->label('Upload Logo Sponsor')
                    ->image()
                    ->imageEditor() // Biar admin bisa nge-crop atau edit gambar langsung
                    ->directory('sponsors') // File akan masuk ke storage/app/public/sponsors
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // 3. TARUH KODINGAN TABELNYA DI DALAM COLUMNS SINI
            ->columns([
                ImageColumn::make('logo_image')
                    ->label('Logo')
                    ->circular(), // Biar tampilannya bulet di tabel admin (opsional)
                
                TextColumn::make('name')
                    ->label('Nama Sponsor')
                    ->searchable() // Biar bisa dicari di kolom pencarian
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(), // Tambahin ini biar bisa langsung hapus
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSponsors::route('/'),
            'create' => Pages\CreateSponsor::route('/create'),
            'edit' => Pages\EditSponsor::route('/{record}/edit'),
        ];
    }
}