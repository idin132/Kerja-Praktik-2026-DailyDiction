<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\GameReview;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ArticleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            // Card 1: Artikel Dipublish
            Stat::make('Artikel Dipublish', Article::where('is_published', true)->count())
                ->description('Total artikel yang tayang')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('success'),

            // Card 2: Game Reviews Dipublish
            Stat::make('Game Reviews Dipublish', GameReview::where('is_published', true)->count())
                ->description('Total ulasan game yang tayang')
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),

            // Card 3: Opsional (Contoh Total Draft / Belum Publish)
            Stat::make('Draft Artikel', Article::where('is_published', false)->count())
                ->description('Artikel masih dalam kustomisasi')
                ->descriptionIcon('heroicon-m-pencil-square')
                ->color('warning'),
        ];
    }
}
