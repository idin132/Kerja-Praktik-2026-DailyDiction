<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ArticleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            // Card 1: Artikel Dipublish
            Stat::make('Artikel Dipublish', Article::where('type', 'article')->where('is_published', true)->count())
                ->description('Total artikel yang tayang')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('success'),

            // Card 2: Game Reviews Dipublish
            Stat::make('Game Reviews Dipublish', Article::where('type', 'review')->where('is_published', true)->count())
                ->description('Total ulasan game yang tayang')
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),

            // Card 3: Teknologi Hardware (Filter berdasarkan slug/nama kategori)
            Stat::make('Teknologi & Hardware', Article::whereHas('category', function ($query) {
                $query->where('slug', 'technology'); // Sesuaikan slug kategori di DB
            })->where('is_published', true)->count())
                ->description('Total artikel teknologi tayang')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->color('info'),

            // Card 4: Entertainment (Filter berdasarkan slug/nama kategori)
            Stat::make('Entertainment', Article::whereHas('category', function ($query) {
                $query->where('slug', 'entertainment'); // Sesuaikan slug kategori di DB
            })->where('is_published', true)->count())
                ->description('Total artikel hiburan tayang')
                ->descriptionIcon('heroicon-m-[#FFD700]') // Atau 'heroicon-m-tv' / 'heroicon-m-[#FFD700]'
                ->descriptionIcon('heroicon-m-tv')
                ->color('gray'),

            // Card 5: Total Draft
            Stat::make('Draft Artikel', Article::where('is_published', false)->count())
                ->description('Artikel masih belum dipublish')
                ->descriptionIcon('heroicon-m-pencil-square')
                ->color('warning'),
        ];
    }
}