<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Article extends Model
{
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'author',
        'slug',
        'category',
        'category_color',
        'summary',
        'content',
        'image_url',
        'read_time',
        'is_featured',
        'is_published',
    ];

    // Menyertakan 'image_full_url' secara otomatis saat dipanggil sebagai JSON/API
    protected $appends = ['image_full_url'];

    /**
     * Accessor untuk URL lengkap gambar (khusus dipanggil API Next.js).
     * Membiarkan $this->image_url tetap murni berisi path 'articles/filename.jpg' untuk Filament.
     */
    protected function imageFullUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image_url ? asset('storage/' . $this->image_url) : null,
        );
    }
}
