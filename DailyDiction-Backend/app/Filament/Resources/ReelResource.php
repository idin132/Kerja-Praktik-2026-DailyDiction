<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReelResource\Pages;
use App\Models\Reel;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReelResource extends Resource
{
    protected static ?string $model = Reel::class;

    protected static ?string $navigationIcon = 'heroicon-o-film';

    protected static bool $shouldRegisterNavigation = false; // untuk menyembunyikan menu Reels dari sidebar, jika ingin menampilkan ubah menjadi true

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->label('Judul Reels')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('type')
                    ->label('Tipe Konten')
                    ->options([
                        'NEWS_FLASH' => 'News Flash',
                        'GAME_REVIEW' => 'Game Review',
                        'TIPS_GUIDE' => 'Tips & Guide',
                        'COMMUNITY' => 'Komunitas / Meme',
                    ])
                    ->required(),

                Forms\Components\TextInput::make('video_url')
                    ->label('URL Video (MP4 / Direct Link)')
                    ->nullable()
                    ->maxLength(255),

                Forms\Components\FileUpload::make('thumbnail_url')
                    ->label('Poster / Thumbnail Overlay')
                    ->image()
                    ->disk('public')
                    ->directory('reels'),

                Forms\Components\TextInput::make('target_slug')
                    ->label('Target Slug Artikel (Opsional)')
                    ->maxLength(255),

                Forms\Components\Textarea::make('caption')
                    ->label('Caption')
                    ->required()
                    ->columnSpanFull(),

                Forms\Components\Toggle::make('is_published')
                    ->label('Publikasikan')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge(),

                Tables\Columns\IconColumn::make('is_published')
                    ->label('Status')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReels::route('/'),
            'create' => Pages\CreateReel::route('/create'),
            'edit' => Pages\EditReel::route('/{record}/edit'),
        ];
    }
}