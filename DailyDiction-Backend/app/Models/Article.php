<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'author',
        'slug',
        'category_color',
        'summary',
        'content',
        'image_url',
        'image_path',
        'image_source',
        'read_time',
        'is_featured',
        'is_published',
        'likes_count',
        'type',
        'platform',
        'category_input',
        'views',
        'last_viewed_at',
        'published_at',
    ];

    protected static function booted()
    {
        static::saving(function ($article) {
            // Hitung read_time otomatis saat akan disave (insert atau update)
            if (!empty($article->content)) {
                $rawText = is_array($article->content) ? json_encode($article->content) : (string) $article->content;
                $cleanText = strip_tags($rawText);
                $wordCount = str_word_count($cleanText);
                $minutes = max(1, ceil($wordCount / 200));

                $article->read_time = "{$minutes} MIN READ";
            }
        });

        static::saving(function ($article) {
            if ($article->is_published && empty($article->published_at)) {
                $article->published_at = now();
            }
        });
    }

    protected $casts = [
        'content' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'platform' => 'array',
        'category_input' => 'array',
        'last_viewed_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    // Menyertakan accessor otomatis ke response JSON API
    protected $appends = ['image_full_url', 'thumbnail_url'];

    /**
     * Accessor untuk mendapatkan URL Gambar Lengkap (Handling File Upload & External URL)
     */
    public function getImageFullUrlAttribute(): ?string
    {
        // 1. Prioritas Utama: Hasil Upload File Lokal Filament
        if (!empty($this->image_path)) {
            if (Str::startsWith($this->image_path, ['http://', 'https://'])) {
                return $this->image_path;
            }
            return asset('storage/' . ltrim($this->image_path, '/'));
        }

        // 2. Prioritas Kedua: URL Gambar External
        if (!empty($this->image_url)) {
            if (Str::startsWith($this->image_url, ['http://', 'https://'])) {
                return $this->image_url;
            }
            return asset('storage/' . ltrim($this->image_url, '/'));
        }

        return null;
    }

    /**
     * Accessor untuk Thumbnail URL
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->getImageFullUrlAttribute();
    }

    /**
     * Accessor Legacy untuk getThumbnailAttribute
     */
    public function getThumbnailAttribute(): ?string
    {
        return $this->getImageFullUrlAttribute();
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'article_category');
    }

    public function comments()
    {
        return $this->hasMany(\App\Models\Comment::class)->with('user')->latest();
    }
}