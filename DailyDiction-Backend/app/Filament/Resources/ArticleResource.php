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

                // ================= 3. FORM HYBRID KATEGORI =================
                Forms\Components\TagsInput::make('category_input')
                    ->label('Category')
                    ->placeholder('Ketik kategori, tekan Enter...')
                    ->suggestions(fn() => Category::pluck('name')->toArray())
                    ->visible(fn(Get $get) => $get('type') === 'article')
                    ->required(fn(Get $get) => $get('type') === 'article'),

                Forms\Components\TagsInput::make('category_input')
                    ->label('Kategori Tech / Perangkat')
                    ->placeholder('Contoh: Keyboard, Mouse, GPU, Monitor...')
                    ->suggestions([
                        'Keyboard', 'Mouse', 'Headset', 'Monitor', 
                        'VGA / GPU', 'Processor', 'Laptop Gaming', 
                        'Console / Handheld', 'Accessories',
                    ])
                    ->visible(fn(Get $get) => $get('type') === 'technology')
                    ->required(fn(Get $get) => $get('type') === 'technology'),

                Forms\Components\Select::make('platform')
                    ->label('Platform Game')
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

                // ================= 4. THUMBNAIL HYBRID (UPLOAD & URL) =================
                Forms\Components\Section::make('Media & Thumbnail')
                    ->description('Pilih salah satu: Upload gambar dari perangkat Anda ATAU gunakan Link URL.')
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->label('Upload Gambar (Internal)')
                            ->image()
                            ->directory('articles/thumbnails')
                            ->maxSize(5120) // Maks 5MB
                            ->live(onBlur: true)
                            ->columnSpan(1),

                        Forms\Components\TextInput::make('image_url')
                            ->label('Atau URL Gambar (Eksternal)')
                            ->placeholder('https://example.com/image.jpg')
                            ->url()
                            ->maxLength(2000)
                            ->live(onBlur: true)
                            ->columnSpan(1),

                        Forms\Components\Placeholder::make('image_preview')
                            ->label('Preview Thumbnail')
                            ->content(function (Get $get) {
                                // Cek upload internal dulu, kalau kosong baru cek URL eksternal
                                $internalImage = $get('image'); 
                                $externalUrl = $get('image_url');
                                
                                $displayUrl = null;
                                if ($internalImage) {
                                    $displayUrl = '/storage/' . $internalImage;
                                } elseif ($externalUrl) {
                                    $displayUrl = $externalUrl;
                                }

                                if (!$displayUrl) {
                                    return new HtmlString('<span class="text-xs text-gray-400 font-mono">Belum ada thumbnail. Silakan upload file atau masukkan link URL.</span>');
                                }
                                
                                return new HtmlString('
                                    <div class="mt-2 flex justify-center bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                        <img src="' . e($displayUrl) . '" alt="Preview" class="max-h-64 rounded-lg object-contain shadow-lg" onerror="this.src=\'https://placehold.co/800x450?text=Gambar+Tidak+Valid\'"/>
                                    </div>
                                ');
                            })
                            ->columnSpanFull(),
                    ])->columns(2),

                // ================= 5. KONTEN & SETTINGS =================
                Forms\Components\Textarea::make('summary')
                    ->required()
                    ->columnSpanFull(),

                TiptapEditor::make('content')
                    ->label('Konten Artikel')
                    ->tools([
                        'heading', 'blockquote', 'bold', 'italic', 'strike',
                        'link', 'media', 'oembed', 'bullet-list', 'ordered-list',
                        'code-block', 'undo', 'redo',
                    ])
                    ->bubbleMenuTools([
                        'heading', 'blockquote', 'bold', 'italic', 'strike',
                        'link', 'media', 'oembed', 'bullet-list', 'ordered-list',
                        'code-block', 'undo', 'redo',
                    ])
                    ->floatingMenuTools([
                        'heading', 'blockquote', 'bold', 'italic', 'strike',
                        'link', 'media', 'oembed', 'bullet-list', 'ordered-list',
                        'code-block', 'undo', 'redo',
                    ])
                    ->mediaAction(CustomMediaAction::class)
                    ->columnSpanFull()
                    ->required(),

                Forms\Components\Hidden::make('read_time')
                    ->default('1 MIN READ'),

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
                // Nampilin Hybrid Thumbnail di Tabel
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Thumbnail')
                    ->state(function (Article $record) {
                        return $record->image ? url('storage/' . $record->image) : $record->image_url;
                    })
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

                Tables\Columns\TextColumn::make('read_time')
                    ->searchable(),

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