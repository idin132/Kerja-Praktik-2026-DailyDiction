<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GameReviewResource\Pages;
use App\Models\GameReview;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GameReviewResource extends Resource
{
    protected static ?string $model = GameReview::class;

    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?string $navigationGroup = 'Manajemen Konten';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')->required(),
                Forms\Components\TextInput::make('slug')->required(),
                
                // 👇 Platform diubah jadi dropdown multiple select 👇
                Forms\Components\Select::make('platform')
                    ->label('Platform')
                    ->multiple() // Biar bisa pilih lebih dari 1
                    ->options([
                        'Playstation 5' => 'Playstation 5',
                        'Xbox Series X/S' => 'Xbox Series X/S',
                        'Nintendo Switch' => 'Nintendo Switch',
                        'Mobile' => 'Mobile',
                        'PC' => 'PC',
                    ])
                    ->required(),
                
                // ❌ TextInput untuk rating sudah dibuang ❌

                Forms\Components\FileUpload::make('image_url')
                    ->label('Cover Game')
                    ->image()
                    ->disk('public')
                    ->directory('reviews')
                    ->visibility('public')
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('summary')->required()->columnSpanFull(),
                Forms\Components\RichEditor::make('content')->required()->columnSpanFull(),
                Forms\Components\Toggle::make('is_published')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Cover')
                    ->disk('public')
                    ->square(),
                Tables\Columns\TextColumn::make('title')->searchable(),
                
                // Filament pinter kok, array multiple platform bakal otomatis dijadiin deretan badge sama dia
                Tables\Columns\TextColumn::make('platform')->badge(), 
                
                // ❌ TextColumn rating di tabel juga sudah dibuang ❌
                
                Tables\Columns\IconColumn::make('is_published')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(), // Urang tambahin sekalian biar gampang kalau mau ngehapus dari tabel
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
            'index' => Pages\ListGameReviews::route('/'),
            'create' => Pages\CreateGameReview::route('/create'),
            'edit' => Pages\EditGameReview::route('/{record}/edit'),
        ];
    }
}