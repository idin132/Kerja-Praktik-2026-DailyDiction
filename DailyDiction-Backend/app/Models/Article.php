<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'read_time',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'content' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    // Menyertakan 'image_full_url' secara otomatis saat dipanggil sebagai JSON/API
    protected $appends = ['image_full_url'];

    public function getImageFullUrlAttribute()
    {
        if (! $this->image_url) {
            return null;
        }

        // Jika sudah link lengkap (http:// atau https://), kembalikan langsung
        if (Str::startsWith($this->image_url, ['http://', 'https://'])) {
            return $this->image_url;
        }

        // Jika file lokal dari storage
        return asset('storage/' . $this->image_url);
    }

    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'article_category');
    }
}
