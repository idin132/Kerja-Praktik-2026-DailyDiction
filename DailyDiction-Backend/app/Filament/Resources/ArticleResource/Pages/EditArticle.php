<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Models\Category;
use App\Filament\Resources\ArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Str;

class EditArticle extends EditRecord
{
    protected static string $resource = ArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-o-eye')
                ->modalHeading(fn() => 'Preview: ' . $this->record->title)
                ->modalWidth('7xl')
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Tutup')
                ->modalContent(function () {
                    $record = $this->record;

                    $imageUrl = $record->image_url ?? ($record->image_path ? asset('storage/' . $record->image_path) : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600');

                    $platforms = [];
                    if ($record->platform) {
                        $decoded = is_string($record->platform) ? json_decode($record->platform, true) : $record->platform;
                        $platforms = is_array($decoded) ? $decoded : [$record->platform];
                    }

                    $platformBadges = collect($platforms)->map(fn($p) => "
                    <span style='background:rgba(255,215,0,0.15); color:#FFD700; border:1px solid rgba(255,215,0,0.3); padding:4px 10px; border-radius:4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;'>
                        {$p}
                    </span>
                ")->implode('');

                    $authorName = is_string($record->author) ? $record->author : ($record->author['name'] ?? 'Redaksi');
                    $createdAt = $record->created_at ? \Carbon\Carbon::parse($record->created_at)->translatedFormat('d F Y') : '-';
                    $summary = e($record->summary ?? '');
                    $title = e($record->title ?? '');
                    $readTime = e($record->read_time ?? '1 MIN READ');
                    $content = $record->content ?? '';

                    $isUnpublished = !$record->is_published;
                    $previewBanner = $isUnpublished ? "
                    <div style='background:#FFD700; color:black; text-align:center; padding:8px; font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase;'>
                        ⚠ PREVIEW MODE — Konten ini belum dipublish
                    </div>
                " : "";

                    return new \Illuminate\Support\HtmlString("
                    <div style='background:#0f1117; color:#e5e7eb; font-family:sans-serif; border-radius:12px; overflow:hidden;'>
                        {$previewBanner}
                        <div style='padding:32px;'>
                            <div style='display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;'>
                                {$platformBadges}
                            </div>
                            <h1 style='font-size:28px; font-weight:900; color:white; line-height:1.3; margin-bottom:16px;'>
                                {$title}
                            </h1>
                            <div style='display:flex; gap:20px; font-size:12px; color:#9ca3af; border-top:1px solid #1f2937; border-bottom:1px solid #1f2937; padding:12px 0; margin-bottom:20px;'>
                                <span>✍ <strong style='color:white'>{$authorName}</strong></span>
                                <span>📅 {$createdAt}</span>
                                <span>⏱ {$readTime}</span>
                            </div>
                            <p style='font-size:15px; color:#9ca3af; border-left:4px solid #FFD700; padding:12px 16px; background:rgba(255,255,255,0.03); border-radius:0 8px 8px 0; margin-bottom:24px;'>
                                {$summary}
                            </p>
                            <div style='width:100%; aspect-ratio:16/9; overflow:hidden; border-radius:12px; margin-bottom:28px;'>
                                <img src='{$imageUrl}' alt='{$title}' style='width:100%; height:100%; object-fit:cover;'/>
                            </div>
                            <div style='line-height:1.8; font-size:15px; color:#d1d5db;'>
                                {$content}
                            </div>
                        </div>
                    </div>
                ");
                }),

            Actions\Action::make('save')
                ->label('Save')
                ->action('save')
                ->color('primary'),

            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['category_input'] = $this->record->categories->pluck('name')->toArray();

        // Cukup set mode saja, JANGAN wrap image_path ke array di sini
        $data['thumbnail_mode'] = !empty($data['image_path']) ? 'file' : 'url';

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Hitung Read Time
        if (!empty($data['content'])) {
            $rawText = is_array($data['content']) ? json_encode($data['content']) : (string) $data['content'];
            $cleanText = strip_tags($rawText);
            $wordCount = str_word_count($cleanText);
            $minutes = max(1, ceil($wordCount / 200));
            $data['read_time'] = "{$minutes} MIN READ";
        } else {
            $data['read_time'] = '1 MIN READ';
        }

        // Normalisasi image_path: FileUpload return array, DB butuh string
        if (isset($data['image_path'])) {
            if (is_array($data['image_path'])) {
                $data['image_path'] = reset($data['image_path']) ?: null;
            }
            // Mode file aktif — hapus file lama jika diganti, kosongkan image_url
            if (!empty($this->record->image_path) && $this->record->image_path !== $data['image_path']) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($this->record->image_path);
            }
            $data['image_url'] = null;
        } else {
            // Mode url aktif — hapus file lama jika sebelumnya pakai upload
            if (!empty($this->record->image_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($this->record->image_path);
            }
            $data['image_path'] = null;
        }

        unset($data['category_input']);

        // Jika published_at tidak diisi, set ke sekarang
        if (empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }

    protected function afterSave(): void
    {
        $categoryInput = $this->form->getState()['category_input'] ?? [];

        $categoryIds = collect($categoryInput)
            ->filter()
            ->map(function (string $name) {
                $category = Category::firstOrCreate(
                    ['name' => trim($name)],
                    ['slug' => Str::slug($name)]
                );
                return $category->id;
            })
            ->toArray();

        $this->record->categories()->sync($categoryIds);
    }
}
