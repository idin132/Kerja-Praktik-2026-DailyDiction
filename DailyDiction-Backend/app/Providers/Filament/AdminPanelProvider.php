<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\ArticleStatsOverview;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use App\Filament\Pages\Auth\Login;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(Login::class)
            ->colors([
                'primary' => Color::Hex('#FF3E3E'),
                'secondary' => Color::Hex('#00E5FF'),
                'gray' => Color::Slate,
            ])
            ->brandName('Daily Diction Admin Panel')
            ->favicon(asset('favicon.ico'))
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->renderHook(
                PanelsRenderHook::USER_MENU_BEFORE,
                fn(): string => Blade::render('
                    @if(auth()->check())
                        <div style="margin-right: 1rem; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid {{ auth()->user()->role === \'superadmin\' ? \'#e11d48\' : \'#06b6d4\' }}; color: {{ auth()->user()->role === \'superadmin\' ? \'#e11d48\' : \'#06b6d4\' }}; background-color: {{ auth()->user()->role === \'superadmin\' ? \'rgba(225,29,72,0.1)\' : \'rgba(6,182,212,0.1)\' }};">
                            {{ auth()->user()->role ?? \'Admin\' }}
                        </div>
                    @endif
                ')
            )
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn(): string => Blade::render('
                    <style>
                        /* CEGAH TIPTAP & BUBBLE MENU SCROLL JUMPING */
                        .tiptap-wrapper .ProseMirror {
                            scroll-margin-top: 0 !important;
                            scroll-margin-bottom: 0 !important;
                        }
                        
                        /* Fix posisi Tippy / Bubble Menu agar tidak melempar scrollbar window */
                        [data-tippy-root] {
                            position: absolute !important;
                            z-index: 99999 !important;
                        }

                        .tiptap-bubble-menu {
                            max-height: 42px !important;
                        }
                    </style>
                    <script>
                        // Override scrollIntoView sebelum Tiptap/ProseMirror load
                        (function () {
                            var _orig = Element.prototype.scrollIntoView;
                            Element.prototype.scrollIntoView = function (arg) {
                                // Cek apakah element ini ada di dalam ProseMirror atau Bubble Menu
                                if (this.closest && this.closest(".ProseMirror, .tiptap-prosemirror-wrapper, [data-tippy-root]")) {
                                    // Diam saja — jangan scroll window
                                    return;
                                }
                                return _orig.apply(this, arguments);
                            };
                        })();
                    </script>
                ')
            )
            ->renderHook(
                PanelsRenderHook::BODY_END,
                fn(): string => Blade::render('
                    <script>
                        (function () {
                            function applyTiptapFixes() {
                                // 1. Prevent keydown / selection change di ProseMirror merebut window focus
                                document.addEventListener("keydown", function (e) {
                                    if (!e.target.closest(".ProseMirror")) return;
                                    e.stopPropagation();
                                }, true);

                                // 2. Kunci scroll position saat memilih teks di dalam list
                                let lastScrollPos = 0;
                                document.addEventListener("selectionchange", function () {
                                    const activeEl = document.activeElement;
                                    if (activeEl && activeEl.closest(".ProseMirror")) {
                                        lastScrollPos = window.scrollY;
                                    }
                                });

                                document.addEventListener("mouseup", function (e) {
                                    if (e.target.closest(".ProseMirror")) {
                                        // Jaga posisi scroll tetap tenang saat bubble menu aktif
                                        setTimeout(function() {
                                            if (Math.abs(window.scrollY - lastScrollPos) > 50 && lastScrollPos > 0) {
                                                window.scrollTo({ top: lastScrollPos, behavior: "instant" });
                                            }
                                        }, 10);
                                    }
                                });
                            }

                            document.addEventListener("livewire:init", applyTiptapFixes);

                            if (document.readyState === "complete" || document.readyState === "interactive") {
                                applyTiptapFixes();
                            } else {
                                document.addEventListener("DOMContentLoaded", applyTiptapFixes);
                            }
                        })();
                    </script>
                ')
            )

            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                Widgets\FilamentInfoWidget::class,
                ArticleStatsOverview::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}