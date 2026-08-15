<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameReview extends Model
{
    use HasFactory;

    // rating dihapus dari fillable
    protected $fillable = [
        'title',
        'slug',
        'platform',
        'summary',
        'content',
        'image_url',
        'is_published',
    ];

    // WAJIB ditambahin biar form multiple select bisa disimpen
    protected $casts = [
        'platform' => 'array',
        'is_published' => 'boolean',
    ];
}