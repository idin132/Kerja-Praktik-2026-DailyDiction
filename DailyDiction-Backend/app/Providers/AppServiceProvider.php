<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Livewire\Livewire;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // FIX: Route otomatis aset Livewire untuk mencegah error 404 di cPanel/Production
        Livewire::setScriptRoute(function ($handle) {
            return Route::get('/livewire/livewire.js', $handle);
        });

        ResetPassword::createUrlUsing(function ($user, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'https://dailydiction.id');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($user->email);
        });

        // TipTap scroll fix pada ordered list
        FilamentView::registerRenderHook(
            PanelsRenderHook::BODY_END,
            fn(): string => Blade::render('@include("filament.hooks.tiptap-scroll-fix")'),
        );

        // Autosave draft ke localStorage
        FilamentView::registerRenderHook(
            PanelsRenderHook::BODY_END,
            fn(): string => Blade::render('@include("filament.hooks.autosave-draft")'),
        );
    }
}