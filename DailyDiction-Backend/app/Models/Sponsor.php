<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    use HasFactory;

    // Menentukan kolom mana saja yang boleh diisi
    protected $fillable = [
        'name',
        'logo_image',
    ];
}