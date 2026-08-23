<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Models\Category;
use App\Filament\Resources\ArticleResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateArticle extends CreateRecord
{
    protected static string $resource = ArticleResource::class;

    // 👇 REDIRECT KE LIST ARTIKEL SETELAH KLIK CREATE 👇
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        unset($data['category_input']);
        unset($data['image_source']); // ← tambah ini

        // Kalau pakai URL, kosongkan image_path (dan sebaliknya)
        if (!empty($data['image_url'])) {
            $data['image_path'] = null;
        } else {
            $data['image_url'] = null;
        }

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
