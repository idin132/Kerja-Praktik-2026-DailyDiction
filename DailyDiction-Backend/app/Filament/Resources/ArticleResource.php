<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use App\Models\User;
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

    protected static ?string $navigationLabel = 'Posts (News, Tech & Review)';
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
                        'article'    => 'Berita / Artikel',
                        'technology' => 'Teknologi & Hardware',
                        'review'     => 'Game Review',
                    ])
                    ->default('article')
                    ->required()
                    ->live(),

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

                (auth()->user()?->role === 'superadmin' || (auth()->user() && method_exists(auth()->user(), 'isSuperAdmin') && auth()->user()->isSuperAdmin()))
                    ? Forms\Components\Select::make('author')
                    ->label('Author (Penulis)')
                    ->options(fn() => User::pluck('name', 'name')->toArray())
                    ->searchable()
                    ->preload()
                    ->default(fn() => auth()->user()?->name)
                    ->required()
                    : Forms\Components\TextInput::make('author')
                    ->label('Author (Penulis)')
                    ->required()
                    ->readOnly()
                    ->default(fn() => auth()->user()?->name)
                    ->maxLength(255),

                Forms\Components\TextInput::make('slug')
                    ->label('Slug: Alamat URL')
                    ->readOnly()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                // ================= 3. FORM HYBRID (KONDISIONAL SESUAI TIPE) =================

                // A. KHUSUS ARTIKEL BIASA
                Forms\Components\TagsInput::make('category_input')
                    ->label('Category')
                    ->placeholder('Ketik kategori, tekan Enter...')
                    ->suggestions(fn() => Category::pluck('name')->toArray())
                    ->visible(fn(Get $get) => $get('type') === 'article')
                    ->required(fn(Get $get) => $get('type') === 'article'),

                // B. KHUSUS TEKNOLOGI & HARDWARE
                Forms\Components\TagsInput::make('category_input')
                    ->label('Kategori Tech / Perangkat')
                    ->placeholder('Contoh: Keyboard, Mouse, GPU, Monitor...')
                    ->suggestions([
                        'Keyboard',
                        'Mouse',
                        'Headset',
                        'Monitor',
                        'VGA / GPU',
                        'Processor',
                        'Laptop Gaming',
                        'Console / Handheld',
                        'Accessories',
                    ])
                    ->visible(fn(Get $get) => $get('type') === 'technology')
                    ->required(fn(Get $get) => $get('type') === 'technology'),

                // C. KHUSUS REVIEW: Platform Game
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
                    ->visible(fn(Get $get) => $get('type') === 'review')
                    ->required(fn(Get $get) => $get('type') === 'review'),

                Forms\Components\TextInput::make('category_color')
                    ->required()
                    ->hidden()
                    ->maxLength(255)
                    ->default('crimson'),

                // ================= 4. KONTEN ARTIKEL =================
                Forms\Components\Radio::make('image_source')
                    ->label('Sumber Thumbnail')
                    ->options([
                        'url'  => 'URL Gambar (eksternal)',
                        'file' => 'Upload File',
                    ])
                    ->default('url')
                    ->live()
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('image_url')
                    ->label('Thumbnail Artikel (URL Gambar)')
                    ->url()
                    ->placeholder('https://example.com/image.jpg')
                    ->live(onBlur: true)
                    ->columnSpanFull()
                    ->maxLength(2000)
                    ->visible(fn(Get $get) => $get('image_source') === 'url')
                    ->required(fn(Get $get) => $get('image_source') === 'url'),

                Forms\Components\FileUpload::make('image_path')
                    ->label('Upload Thumbnail')
                    ->image()
                    ->disk('public')
                    ->directory('thumbnails')
                    ->imageResizeMode('cover')
                    ->imageCropAspectRatio('16:9')
                    ->imageResizeTargetWidth('1280')
                    ->imageResizeTargetHeight('720')
                    ->maxSize(2048) // 2MB
                    ->columnSpanFull()
                    ->visible(fn(Get $get) => $get('image_source') === 'file')
                    ->required(fn(Get $get) => $get('image_source') === 'file'),

                // ================= 5. MEDIA & SETTINGS =================
                Forms\Components\Placeholder::make('image_preview')
                    ->label('Preview Thumbnail')
                    ->visible(fn(Get $get) => $get('image_source') === 'url') // ← tambah ini
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
                    ->bubbleMenuTools([
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
                    ->floatingMenuTools([
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

                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'article'    => 'info',
                        'technology' => 'success',
                        'review'     => 'warning',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Category')
                    ->badge()
                    ->separator(','),

                Tables\Columns\TextColumn::make('platform')
                    ->label('Platform')
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
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Filter Tipe Konten')
                    ->options([
                        'article'    => 'Berita / Artikel',
                        'technology' => 'Teknologi & Hardware',
                        'review'     => 'Game Review',
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
            'index'  => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit'   => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
