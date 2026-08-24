<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    // Menentukan kolom mana saja yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'title',
        'type',          // <-- Tambahan buat nentuin banner / script
        'position',
        'banner_image',
        'url_link',
        'script_code',   // <-- Tambahan buat nyimpen kode adsense
    ];
}