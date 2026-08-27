<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdvertisementResource\Pages;
use App\Models\Advertisement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

// IMPORT TAMBAHAN
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

                // 1. SELECT POSISI IKLAN
                Select::make('position')
                    ->label('Posisi Penempatan Iklan')
                    ->options([
                        'sidebar'    => 'Sidebar Kanan (300 x 250 px)',
                        'horizontal' => 'Banner Horizontal Tengah (1200 x 250 px)',
                    ])
                    ->default('sidebar')
                    ->required()
                    ->columnSpanFull(),

                // 2. SELECT TIPE IKLAN (DIBIKIN LIVE REAKTIF)
                Select::make('type')
                    ->label('Tipe Iklan')
                    ->options([
                        'banner' => 'Gambar Banner Manual',
                        'script' => 'Script / Google Ads',
                    ])
                    ->default('banner')
                    ->live() // 👈 Trigger ubah form bawahnya realtime
                    ->required()
                    ->columnSpanFull(),

                // 3. FIELD KHUSUS BANNER MANUAL
                FileUpload::make('banner_image')
                    ->label('Gambar Banner Iklan')
                    ->image()
                    ->directory('advertisements')
                    ->visible(fn (Get $get) => in_array($get('type'), ['banner', 'Gambar Banner Manual']))
                    ->required(fn (Get $get) => in_array($get('type'), ['banner', 'Gambar Banner Manual']))
                    ->columnSpanFull(),

                TextInput::make('url_link')
                    ->label('Link Tujuan (URL)')
                    ->placeholder('https://...')
                    ->url()
                    ->visible(fn (Get $get) => in_array($get('type'), ['banner', 'Gambar Banner Manual']))
                    ->required(fn (Get $get) => in_array($get('type'), ['banner', 'Gambar Banner Manual']))
                    ->maxLength(255)
                    ->columnSpanFull(),

                // 4. FIELD KHUSUS SCRIPT / GOOGLE ADS
                Textarea::make('script_code')
                    ->label('Script Google Ads / HTML')
                    ->rows(6)
                    ->visible(fn (Get $get) => in_array($get('type'), ['script', 'Script / Google Ads']))
                    ->required(fn (Get $get) => in_array($get('type'), ['script', 'Script / Google Ads']))
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

                // BADGE POSISI IKLAN
                TextColumn::make('position')
                    ->label('Posisi')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'sidebar'    => 'info',
                        'horizontal' => 'warning',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'sidebar'    => 'Sidebar (300x250)',
                        'horizontal' => 'Horizontal (1200x250)',
                        default      => $state,
                    }),

                // BADGE TIPE IKLAN
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'banner', 'Gambar Banner Manual' => 'success',
                        'script', 'Script / Google Ads'  => 'warning',
                        default                          => 'gray',
                    }),
                
                TextColumn::make('url_link')
                    ->label('Link Tujuan')
                    ->limit(30),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('position')
                    ->label('Filter Posisi')
                    ->options([
                        'sidebar'    => 'Sidebar (300x250)',
                        'horizontal' => 'Horizontal (1200x250)',
                    ]),
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
            'index'  => Pages\ListAdvertisements::route('/'),
            'create' => Pages\CreateAdvertisement::route('/create'),
            'edit'   => Pages\EditAdvertisement::route('/{record}/edit'),
        ];
    }
}