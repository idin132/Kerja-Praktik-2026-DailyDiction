<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Models\Category;
use App\Filament\Resources\ArticleResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateArticle extends CreateRecord
{
    protected static string $resource = ArticleResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
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
            // Mode file aktif, pastikan image_url null
            $data['image_url'] = null;
        } else {
            // Mode url aktif, pastikan image_path null
            $data['image_path'] = null;
        }

        unset($data['category_input']);
        return $data;
    }

    protected function afterCreate(): void
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
