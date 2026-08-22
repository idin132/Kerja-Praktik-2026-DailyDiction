<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser; // 1. IMPORT INI
use Filament\Panel; // 2. IMPORT INI
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\HasName; // <--- 1. TAMBAHAN: Import HasName

class User extends Authenticatable implements HasName, FilamentUser // <--- 2. TAMBAHAN: implements HasName
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */

    public function canAccessPanel(Panel $panel): bool
    {
        // Izinkan role 'superadmin' atau 'admin' masuk panel
        return $this->role === 'superadmin' || $this->role === 'admin';

        // Atau jika semua user di tabel boleh akses admin:
        // return true;
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // <--- 3. TAMBAHAN: Fungsi buat ngubah nama di Filament
    public function getFilamentName(): string
    {
        // Ngecek kalau role-nya ada, huruf depannya dikapitalin. Kalau kosong, tulis 'User'
        $roleName = $this->role ? ucfirst($this->role) : 'User';

        // Gabungin Nama Asli + Role
        return "{$this->name} ({$roleName})";
    }
}
