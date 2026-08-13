<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    // Menentukan kolom mana saja yang boleh diisi
    protected $fillable = [
        'title',
        'banner_image',
        'url_link',
    ];
}