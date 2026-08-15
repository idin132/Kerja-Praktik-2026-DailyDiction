<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    protected $casts = [
        'content' => 'array', // atau 'json'
    ];

    // Menyertakan 'image_full_url' secara otomatis saat dipanggil sebagai JSON/API
    protected $appends = ['image_full_url'];

    /**
     * Accessor untuk URL lengkap gambar (khusus dipanggil API Next.js).
     * Membiarkan $this->image_url tetap murni berisi path 'articles/filename.jpg' untuk Filament.
     */
    // protected function imageFullUrl(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn() => $this->image_url ? asset('storage/' . $this->image_url) : null,
    //     );
    // }

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
}
