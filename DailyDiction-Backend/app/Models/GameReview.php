<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class GameReview extends Model
{
    protected $table = 'game_reviews';
    protected $guarded = [];

    protected $appends = ['image_full_url'];

    protected $fillable = [
        'title',
        'slug',
        'platform',
        'rating',
        'summary',
        'content',
        'image_url',
        'is_published',
    ];

    protected function imageFullUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image_url ? asset('storage/' . $this->image_url) : null,
        );
    }
}
