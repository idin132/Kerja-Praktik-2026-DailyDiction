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
                Forms\Components\TextInput::make('platform')->placeholder('PC / PS5 / SWITCH')->required(),
                Forms\Components\TextInput::make('rating')->numeric()->step(0.1)->required(),
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
                Tables\Columns\TextColumn::make('platform')->badge(),
                Tables\Columns\TextColumn::make('rating')->sortable(),
                Tables\Columns\IconColumn::make('is_published')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
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
            'index' => Pages\ListGameReviews::route('/'),
            'create' => Pages\CreateGameReview::route('/create'),
            'edit' => Pages\EditGameReview::route('/{record}/edit'),
        ];
    }
}