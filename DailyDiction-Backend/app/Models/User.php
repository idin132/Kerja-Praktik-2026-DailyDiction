<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Models\Contracts\FilamentUser; // <--- 1. TAMBAHKAN IMPORT INI
use Filament\Models\Contracts\HasName;
use Filament\Panel; // <--- 2. TAMBAHKAN IMPORT INI
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser, HasName // <--- 3. TAMBAHKAN FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
    ];

    // Helper untuk mengecek Superadmin
    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function canAccessPanel(Panel $panel): bool
    {
        // Memberikan izin akses untuk role admin dan superadmin
        return in_array($this->role, ['admin', 'superadmin']);
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Fungsi buat ngubah nama di Filament
    public function getFilamentName(): string
    {
        $roleName = $this->role ? ucfirst($this->role) : 'User';

        return "{$this->name} ({$roleName})";
    }
}
