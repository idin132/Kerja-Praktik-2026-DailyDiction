<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use FilamentTiptapEditor\TiptapEditor;
use App\Filament\Actions\CustomMediaAction;
use Filament\Forms\Set;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
use App\Models\Category;
use Illuminate\Support\Str;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;

    // Ganti nama menu di sidebar biar lebih general
    protected static ?string $navigationLabel = 'Posts (News & Review)';
    protected static ?string $pluralModelLabel = 'Posts';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // ================= 1. PILIH TIPE KONTEN =================
                Forms\Components\Select::make('type')
                    ->label('Tipe Konten')
                    ->options([
                        'article' => 'Berita / Artikel',
                        'review'  => 'Game Review',
                    ])
                    ->default('article')
                    ->required()
                    ->live(), // Wajib live biar form di bawahnya bisa ngerespon

                // ================= 2. INFO UMUM =================
                Forms\Components\TextInput::make('title')
                    ->label('Title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (string $operation, ?string $state, Set $set) {
                        if ($operation === 'create') {
                            $set('slug', Str::slug($state));
                        }
                    }),

                Forms\Components\TextInput::make('author')
                    ->label('Author')
                    ->required()
                    ->maxLength(255)
                    ->default(fn () => auth()->user()->name) // Ambil nama admin yang lagi login
                    ->readOnly(), // Kunci field-nya biar nggak bisa diedit manual

                Forms\Components\TextInput::make('slug')
                    ->label('Slug: Alamat URL')
                    ->readOnly()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                // ================= 3. FORM HYBRID (MUNCUL GANTIAN) =================

                // KHUSUS ARTIKEL: Kategori
                Forms\Components\TagsInput::make('category_input')
                    ->label('Category')
                    ->placeholder('Ketik kategori, tekan Enter...')
                    ->suggestions(fn() => Category::pluck('name')->toArray())
                    ->visible(fn (Get $get) => $get('type') === 'article')
                    ->required(fn (Get $get) => $get('type') === 'article'),

                // KHUSUS REVIEW: Platform (Bisa pilih lebih dari 1)
                Forms\Components\Select::make('platform')
                    ->label('Platform')
                    ->multiple()
                    ->options([
                        'PC' => 'PC',
                        'PS4' => 'PS4',
                        'PS5' => 'PS5',
                        'Xbox One' => 'Xbox One',
                        'Xbox Series X/S' => 'Xbox Series X/S',
                        'Switch' => 'Nintendo Switch',
                        'Mobile' => 'Mobile',
                    ])
                    ->visible(fn (Get $get) => $get('type') === 'review')
                    ->required(fn (Get $get) => $get('type') === 'review'),

                Forms\Components\TextInput::make('category_color')
                    ->required()
                    ->hidden()
                    ->maxLength(255)
                    ->default('crimson'),

                // ================= 4. KONTEN ARTIKEL (TETAP SAMA 100%) =================
                Forms\Components\Textarea::make('summary')
                    ->required()
                    ->columnSpanFull(),

                TiptapEditor::make('content')
                    ->label('Konten Artikel')
                    ->tools([
                        'heading', 'blockquote', 'bold', 'italic', 'strike', 'link', 'media',
                        'oembed', 'bullet-list', 'ordered-list', 'code-block', 'undo', 'redo',
                    ])
                    ->mediaAction(CustomMediaAction::class)
                    ->columnSpanFull()
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (mixed $state, Set $set) {
                        if (!$state) {
                            $set('read_time', '1 MIN READ');
                            return;
                        }

                        $rawText = is_array($state) ? json_encode($state) : (string) $state;
                        $cleanText = strip_tags($rawText);
                        $wordCount = str_word_count($cleanText);
                        $minutes = max(1, ceil($wordCount / 200));

                        $set('read_time', "{$minutes} MIN READ");
                    }),

                // ================= 5. MEDIA & SETTINGS =================
                Forms\Components\TextInput::make('image_url')
                    ->label('Thumbnail Artikel (URL Gambar)')
                    ->url()
                    ->placeholder('https://example.com/image.jpg')
                    ->live(onBlur: true)
                    ->columnSpanFull(),

                Forms\Components\Placeholder::make('image_preview')
                    ->label('Preview Thumbnail')
                    ->content(function (Get $get) {
                        $url = $get('image_url');
                        if (!$url) {
                            return new HtmlString('<span class="text-xs text-gray-400">Belum ada preview (masukkan URL gambar di atas)</span>');
                        }
                        return new HtmlString('
                            <div class="mt-1">
                                <img src="' . e($url) . '" alt="Thumbnail Preview" class="max-h-48 rounded-lg object-cover border border-gray-200 shadow-sm" onerror="this.src=\'https://placehold.co/600x400?text=Gambar+Tidak+Valid\'"/>
                            </div>
                        ');
                    })
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('read_time')
                    ->required()
                    ->maxLength(255)
                    ->default('1 MIN READ')
                    ->readOnly(),

                Forms\Components\Toggle::make('is_featured')
                    ->required()
                    ->hidden(),

                Forms\Components\Toggle::make('is_published')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Thumbnail')
                    ->square(),

                // Tambahan Badge biar di tabel kelihatan ini Berita atau Review
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'article' => 'info',
                        'review' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Category')
                    ->badge()
                    ->separator(','),

                // Tambahan kolom Platform buat di tabel
                Tables\Columns\TextColumn::make('platform')
                    ->label('Platform')
                    ->badge()
                    ->separator(','),

                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Filter berdasarkan Tipe Konten
                Tables\Filters\SelectFilter::make('type')
                    ->label('Filter Tipe Konten')
                    ->options([
                        'article' => 'Berita / Artikel',
                        'review' => 'Game Review',
                    ]),
            ])
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
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
