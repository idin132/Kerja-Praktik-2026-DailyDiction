<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdvertisementResource\Pages;
use App\Models\Advertisement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

// IMPORT TAMBAHAN BUAT HYBRID FORM
use Filament\Forms\Get;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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
                    ->maxLength(255)
                    ->columnSpanFull(),

                // Select Tipe Iklan
                Select::make('type')
                    ->label('Tipe Iklan')
                    ->options([
                        'banner' => 'Gambar Banner Manual',
                        'script' => 'Script / Google Ads',
                    ])
                    ->default('banner')
                    ->live() // Bikin form di bawahnya reaktif berubah
                    ->required()
                    ->columnSpanFull(),

                // MUNCUL KALAU PILIH BANNER
                FileUpload::make('banner_image')
                    ->label('Gambar Banner Iklan')
                    ->image()
                    ->directory('advertisements')
                    ->visible(fn (Get $get) => $get('type') === 'banner')
                    ->required(fn (Get $get) => $get('type') === 'banner'),

                TextInput::make('url_link')
                    ->label('Link Tujuan (URL)')
                    ->url()
                    ->visible(fn (Get $get) => $get('type') === 'banner')
                    ->required(fn (Get $get) => $get('type') === 'banner')
                    ->maxLength(255),

                // MUNCUL KALAU PILIH SCRIPT
                Textarea::make('script_code')
                    ->label('Script Google Ads / HTML')
                    ->rows(6)
                    ->visible(fn (Get $get) => $get('type') === 'script')
                    ->required(fn (Get $get) => $get('type') === 'script')
                    ->columnSpanFull()
                    ->helperText('Paste kode script Google Adsense atau HTML iframe di sini.'),
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

                // Tambahan badge penanda tipe iklan di tabel
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'banner' => 'success',
                        'script' => 'warning',
                        default => 'gray',
                    }),
                
                TextColumn::make('url_link')
                    ->label('Link Tujuan')
                    ->limit(30),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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