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

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
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
                    ->required()
                    ->readonly()
                    ->default(auth()->user()->name)
                    ->maxLength(255),

                Forms\Components\TextInput::make('slug')
                    ->label('Slug: Alamat URL')
                    ->readOnly()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                Forms\Components\TagsInput::make('category_input')
                    ->label('Category')
                    ->placeholder('Ketik kategori, tekan Enter...')
                    ->suggestions(fn() => Category::pluck('name')->toArray())
                    ->required(),

                Forms\Components\TextInput::make('category_color')
                    ->required()
                    ->hidden()
                    ->maxLength(255)
                    ->default('crimson'),

                Forms\Components\Textarea::make('summary')
                    ->required()
                    ->columnSpanFull(),

                TiptapEditor::make('content')
                    ->label('Konten Artikel')
                    ->tools([
                        'heading',
                        'blockquote',
                        'bold',
                        'italic',
                        'strike',
                        'link',
                        'media',
                        'oembed',
                        'bullet-list',
                        'ordered-list',
                        'code-block',
                        'undo',
                        'redo',
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

                // Thumbnail via Embed URL + Preview
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

                // // Video via Embed URL + Preview Persegi (1:1)
                // Forms\Components\TextInput::make('video_url')
                //     ->label('Link Embed Video / YouTube')
                //     ->url()
                //     ->placeholder('https://www.youtube.com/watch?v=... atau https://www.youtube.com/embed/...')
                //     ->live(onBlur: true)
                //     ->columnSpanFull(),

                // Forms\Components\Placeholder::make('video_preview')
                //     ->label('Preview Video')
                //     ->content(function (Get $get) {
                //         $url = $get('video_url');
                //         if (! $url) {
                //             return new HtmlString('<span class="text-xs text-gray-400">Belum ada preview (masukkan URL video di atas)</span>');
                //         }

                //         $embedUrl = $url;
                //         if (str_contains($url, 'youtube.com/watch?v=')) {
                //             parse_str(parse_url($url, PHP_URL_QUERY), $params);
                //             $videoId = $params['v'] ?? '';
                //             $embedUrl = "https://www.youtube.com/embed/{$videoId}";
                //         } elseif (str_contains($url, 'youtu.be/')) {
                //             $videoId = trim(parse_url($url, PHP_URL_PATH), '/');
                //             $embedUrl = "https://www.youtube.com/embed/{$videoId}";
                //         }

                //         return new HtmlString('
                //             <div class="mt-1 aspect-square max-w-sm rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                //                 <iframe class="w-full h-full" src="' . e($embedUrl) . '" frameborder="0" allowfullscreen></iframe>
                //             </div>
                //         ');
                //     })
                //     ->columnSpanFull(),

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
                    ->square(), // Tanpa ->disk('public') agar membaca format URL eksternal
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Category')
                    ->badge()
                    ->separator(','),
                Tables\Columns\TextColumn::make('category_color')
                    ->searchable(),
                Tables\Columns\TextColumn::make('read_time')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->hidden(),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
