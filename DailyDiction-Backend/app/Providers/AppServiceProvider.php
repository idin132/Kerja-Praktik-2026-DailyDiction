<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'https://dailydiction.id');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($user->email);
        });

        // Fix: TipTap scroll hijack pada ordered list
        FilamentView::registerRenderHook(
            PanelsRenderHook::BODY_END,
            fn(): string => Blade::render('@include("filament.hooks.tiptap-scroll-fix")'),
        );
    }
}
