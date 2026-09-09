<?php

namespace App\Filament\Widgets;

use App\Models\Article;
// GameReview udah dihapus dari sini karena kita pakai sistem hybrid
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ArticleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            // Card 1: Artikel Dipublish (Ditambahin ->where('type', 'article'))
            Stat::make('Artikel Dipublish', Article::where('type', 'article')->where('is_published', true)->count())
                ->description('Total artikel yang tayang')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('success'),

            // Card 2: Game Reviews Dipublish
            Stat::make('Game Reviews Dipublish', Article::where('type', 'review')->where('is_published', true)->count())
                ->description('Total ulasan game yang tayang')
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),

            // Card 3: Technology Dipublish
            Stat::make('Technology Dipublish', Article::where('type', 'technology')->where('is_published', true)->count())
                ->description('Total artikel teknologi yang tayang')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->color('success'),

            // Card 4: entertainment Dipublish
            Stat::make('entertainment Dipublish', Article::where('type', 'entertainment')->where('is_published', true)->count())
                ->description('Total artikel hiburan yang tayang')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->color('success'),

            // Card 5: Total Draft (Ngambil semua tipe yang is_published-nya false)
            Stat::make('Draft Artikel', Article::where('is_published', false)->count())
                ->description('Artikel masih dalam kustomisasi')
                ->descriptionIcon('heroicon-m-pencil-square')
                ->color('warning'),
        ];
    }
}