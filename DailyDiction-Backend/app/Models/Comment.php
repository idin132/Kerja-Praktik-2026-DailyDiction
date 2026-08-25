<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['article_id', 'user_id', 'comment'];

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id', 'name', 'email']);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}