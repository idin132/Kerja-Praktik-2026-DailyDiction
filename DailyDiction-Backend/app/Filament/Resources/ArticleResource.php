<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Kahusoftware\FilamentCkeditorField\CKEditor;
use Filament\Forms\Set;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
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
                        'article' => 'Berita / Artikel',
                        'technology' => 'Teknologi & Hardware',
                        'review' => 'Game Review',
                        'entertainment' => 'Entertainment',
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
                    ->extraInputAttributes(['autocomplete' => 'off'])
                    ->afterStateUpdated(function (string $operation, ?string $state, Set $set) {
                        if ($operation === 'create' && !empty($state)) {
                            $set('slug', Str::slug($state));
                        }
                    }),

                (auth()->user()?->role === 'superadmin' || (auth()->user() && method_exists(auth()->user(), 'isSuperAdmin') && auth()->user()->isSuperAdmin()))
                    ? Forms\Components\Select::make('author')
                    ->label('Author (Penulis)')
                    ->searchable()
                    ->getSearchResultsUsing(fn(string $search): array => User::where('name', 'like', "%{$search}%")->limit(20)->pluck('name', 'name')->toArray())
                    ->getOptionLabelUsing(fn($value): ?string => $value)
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
                Forms\Components\Grid::make(2)
                    ->schema([
                        Forms\Components\TagsInput::make('category_input')
                            ->label(fn(Get $get) => $get('type') === 'technology' ? 'Kategori Tech / Perangkat' : 'Category')
                            ->placeholder(fn(Get $get) => $get('type') === 'technology' ? 'Contoh: Keyboard, Mouse, GPU, Monitor...' : 'Ketik kategori, tekan Enter...')
                            ->suggestions(fn(Get $get) => $get('type') === 'technology' ? [
                                'Keyboard',
                                'Mouse',
                                'Headset',
                                'Monitor',
                                'VGA / GPU',
                                'Processor',
                                'Laptop Gaming',
                                'Console / Handheld',
                                'Accessories',
                            ] : Category::pluck('name')->toArray())
                            ->visible(fn(Get $get) => in_array($get('type'), ['article', 'technology', 'entertainment']))
                            ->required(fn(Get $get) => in_array($get('type'), ['article', 'technology', 'entertainment'])),

                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Jadwal Tayang')
                            ->helperText('Kosongkan untuk publish sekarang. Isi tanggal & jam jika ingin dijadwalkan.')
                            ->nullable()
                            ->default(now())
                            ->displayFormat('d M Y, H:i')
                            ->timezone('Asia/Jakarta')
                            ->native(false),
                    ]),

                // KHUSUS REVIEW: Platform Game (Disederhanakan)
                Forms\Components\Select::make('platform')
                    ->label('Platform')
                    ->multiple()
                    ->options([
                        'PC'          => 'PC',
                        'PlayStation' => 'PlayStation',
                        'Xbox'        => 'Xbox',
                        'Nintendo'    => 'Nintendo',
                        'Mobile'      => 'Mobile',
                    ])
                    ->visible(fn(Get $get) => $get('type') === 'review')
                    ->required(fn(Get $get) => $get('type') === 'review'),

                Forms\Components\TextInput::make('category_color')
                    ->required()
                    ->hidden()
                    ->maxLength(255)
                    ->default('crimson'),

                // ================= 4. THUMBNAIL / GAMBAR =================
                Forms\Components\Radio::make('thumbnail_mode')
                    ->label('Sumber Thumbnail')
                    ->options([
                        'url' => 'URL Gambar (External)',
                        'file' => 'Upload File Lokal',
                    ])
                    ->default(fn($record) => ($record && $record->image_path) ? 'file' : 'url')
                    ->live()
                    ->dehydrated(false)
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('image_url')
                    ->label('Thumbnail Artikel (URL Gambar)')
                    ->url()
                    ->placeholder('https://example.com/image.jpg')
                    ->maxLength(2000)
                    ->visible(fn(Get $get) => $get('thumbnail_mode') !== 'file')
                    ->required(fn(Get $get) => $get('thumbnail_mode') !== 'file')
                    ->dehydrated(fn(Get $get) => $get('thumbnail_mode') !== 'file'),

                Forms\Components\FileUpload::make('image_path')
                    ->label('Upload Thumbnail File Lokal')
                    ->image()
                    ->disk('public')
                    ->directory('thumbnails')
                    ->visibility('public')
                    ->maxSize(2048)
                    ->imagePreviewHeight('192')
                    ->columnSpanFull()
                    ->visible(fn(Get $get) => $get('thumbnail_mode') === 'file')
                    ->required(fn(Get $get) => $get('thumbnail_mode') === 'file')
                    ->dehydrated(fn(Get $get) => $get('thumbnail_mode') === 'file'),

                Forms\Components\Placeholder::make('image_preview')
                    ->label('Preview Thumbnail Active')
                    ->content(function ($record, Get $get) {
                        $mode = $get('thumbnail_mode');

                        if ($mode === 'file') {
                            if ($record && $record->image_path) {
                                $fullPath = asset('storage/' . $record->image_path);
                                return new HtmlString('
                                    <div class="mt-1">
                                        <img src="' . e($fullPath) . '" alt="Thumbnail Preview" class="max-h-48 rounded-lg object-cover border border-gray-200 shadow-sm"/>
                                    </div>
                                ');
                            }
                            return new HtmlString('<span class="text-xs text-gray-400">Preview file baru akan tampil pada komponen upload di atas saat dipilih.</span>');
                        }

                        $url = $get('image_url') ?? ($record ? $record->image_url : null);

                        if (!$url) {
                            return new HtmlString('<span class="text-xs text-gray-400">Belum ada preview (masukkan URL gambar di atas)</span>');
                        }

                        return new HtmlString('
                            <div class="mt-1">
                                <img src="' . e($url) . '" alt="Thumbnail Preview"
                                    class="max-h-48 rounded-lg object-cover border border-gray-200 shadow-sm"
                                    onerror="this.src=\'https://placehold.co/600x400?text=Gambar+Tidak+Valid\'"/>
                            </div>
                        ');
                    })
                    ->columnSpanFull(),

                Forms\Components\Textarea::make('summary')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),

                CKEditor::make('content')
                    ->label('Konten Artikel')
                    ->uploadUrl(route('ckeditor.upload'))
                    ->columnSpanFull()
                    ->dehydrated(true)
                    ->required(),

                Forms\Components\TextInput::make('read_time')
                    ->required()
                    ->maxLength(255)
                    ->default('1 MIN READ')
                    ->readOnly(),

                Forms\Components\Toggle::make('is_featured')
                    ->required()
                    ->hidden()
                    ->default(false),

                Forms\Components\Toggle::make('is_published')
                    ->required()
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail_display')
                    ->label('Thumbnail')
                    ->square()
                    ->getStateUsing(fn($record) => $record->image_path ? asset('storage/' . $record->image_path) : $record->image_url)
                    ->defaultImageUrl('https://placehold.co/100x100?text=No+Image'),

                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'article' => 'info',
                        'technology' => 'success',
                        'review' => 'warning',
                        'entertainment' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Category')
                    ->badge()
                    ->separator(','),

                Tables\Columns\TextColumn::make('platform')
                    ->label('Platform')
                    ->badge()
                    ->separator(','),

                Tables\Columns\IconColumn::make('is_published')
                    ->label('Tayang')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Jadwal Tayang')
                    ->dateTime('d M Y, H:i')
                    ->timezone('Asia/Jakarta')
                    ->sortable()
                    ->color(fn($state) => $state && $state->isFuture() ? 'warning' : 'success')
                    ->description(
                        fn($record) =>
                        $record->published_at?->isFuture()
                            ? '⏳ Terjadwal — belum tayang'
                            : null
                    ),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Buat')
                    ->dateTime('d M Y, H:i')
                    ->timezone('Asia/Jakarta')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Filter Tipe Konten')
                    ->options([
                        'article' => 'Berita / Artikel',
                        'technology' => 'Teknologi & Hardware',
                        'review' => 'Game Review',
                        'entertainment' => 'Entertainment',
                    ]),

                Tables\Filters\SelectFilter::make('is_published')
                    ->label('Status Publikasi')
                    ->options([
                        '1' => 'Publik (Tayang)',
                        '0' => 'Draft (Pribadi)',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->modalHeading(fn($record) => 'Preview: ' . $record->title)
                    ->modalWidth('7xl')
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Tutup')
                    ->modalContent(function ($record) {
                        $imageUrl = $record->image_url ?? ($record->image_path ? asset('storage/' . $record->image_path) : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600');

                        $platforms = [];
                        if ($record->platform) {
                            $decoded = is_string($record->platform) ? json_decode($record->platform, true) : $record->platform;
                            $platforms = is_array($decoded) ? $decoded : [$record->platform];
                        }

                        $platformBadges = collect($platforms)->map(fn($p) => "
                            <span style='background:rgba(255,215,0,0.15); color:#FFD700; border:1px solid rgba(255,215,0,0.3); padding:4px 10px; border-radius:4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;'>
                                {$p}
                            </span>
                        ")->implode('');

                                        $authorName = is_string($record->author) ? $record->author : ($record->author['name'] ?? 'Redaksi');
                                        $createdAt = $record->created_at ? \Carbon\Carbon::parse($record->created_at)->translatedFormat('d F Y') : '-';
                                        $summary = e($record->summary ?? '');
                                        $title = e($record->title ?? '');
                                        $readTime = e($record->read_time ?? '1 MIN READ');
                                        $content = $record->content ?? '';

                                        $isUnpublished = !$record->is_published;
                                        $previewBanner = $isUnpublished ? "
                            <div style='background:#FFD700; color:black; text-align:center; padding:8px; font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase;'>
                                ⚠ PREVIEW MODE — Konten ini belum dipublish
                            </div>
                        " : "";
                        return new \Illuminate\Support\HtmlString("
                            <div style='background:#0f1117; color:#e5e7eb; font-family:sans-serif; border-radius:12px; overflow:hidden;'>
                                {$previewBanner}
                                <div style='padding:32px;'>

                                    <!-- Platform badges -->
                                    <div style='display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;'>
                                        {$platformBadges}
                                    </div>

                                    <!-- Judul -->
                                    <h1 style='font-size:28px; font-weight:900; color:white; line-height:1.3; margin-bottom:16px;'>
                                        {$title}
                                    </h1>

                                    <!-- Meta -->
                                    <div style='display:flex; gap:20px; font-size:12px; color:#9ca3af; border-top:1px solid #1f2937; border-bottom:1px solid #1f2937; padding:12px 0; margin-bottom:20px;'>
                                        <span>✍ <strong style='color:white'>{$authorName}</strong></span>
                                        <span>📅 {$createdAt}</span>
                                        <span>⏱ {$readTime}</span>
                                    </div>

                                    <!-- Summary -->
                                    <p style='font-size:15px; color:#9ca3af; border-left:4px solid #FFD700; padding:12px 16px; background:rgba(255,255,255,0.03); border-radius:0 8px 8px 0; margin-bottom:24px;'>
                                        {$summary}
                                    </p>

                                    <!-- Thumbnail -->
                                    <div style='width:100%; aspect-ratio:16/9; overflow:hidden; border-radius:12px; margin-bottom:28px;'>
                                        <img src='{$imageUrl}' alt='{$title}' style='width:100%; height:100%; object-fit:cover;'/>
                                    </div>

                                    <!-- Konten -->
                                    <div style='line-height:1.8; font-size:15px; color:#d1d5db;'>
                                        {$content}
                                    </div>

                                </div>
                            </div>
                        ");
                    }),
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
