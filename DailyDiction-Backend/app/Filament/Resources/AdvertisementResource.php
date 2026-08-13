<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdvertisementResource\Pages;
use App\Models\Advertisement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

// 1. TAMBAHIN IMPORT INI DI SINI
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;

class AdvertisementResource extends Resource
{
    protected static ?string $model = Advertisement::class;

    // Aku ganti icon-nya jadi TOA (megaphone) biar beda sama Sponsor di sidebar
    protected static ?string $navigationIcon = 'heroicon-o-megaphone'; 

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->label('Judul / Nama Iklan')
                    ->required()
                    ->maxLength(255),
                
                FileUpload::make('banner_image')
                    ->label('Gambar Banner Iklan')
                    ->image()
                    ->directory('advertisements') // File masuk ke folder advertisements
                    ->required(),

                TextInput::make('url_link')
                    ->label('Link Tujuan (URL)')
                    ->url() // Validasi otomatis: Admin harus masukin format link (https://...)
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('banner_image')
                    ->label('Banner'),
                
                TextColumn::make('title')
                    ->label('Judul Iklan')
                    ->searchable(),
                
                TextColumn::make('url_link')
                    ->label('Link Tujuan')
                    ->limit(30), // Biar link-nya ga kepanjangan di tabel dan ngerusak layout
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(), // Tombol hapus
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
            'index' => Pages\ListAdvertisements::route('/'),
            'create' => Pages\CreateAdvertisement::route('/create'),
            'edit' => Pages\EditAdvertisement::route('/{record}/edit'),
        ];
    }
}