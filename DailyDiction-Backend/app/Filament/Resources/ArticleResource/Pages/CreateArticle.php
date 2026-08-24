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
        unset($data['image_source']);

        // Fix: FileUpload kadang return array, ambil nilai pertama
        if (isset($data['image']) && is_array($data['image'])) {
            $data['image'] = $data['image'][0] ?? null;
        }

        // Prioritas: file upload > URL
        if (!empty($data['image'])) {
            $data['image_path'] = $data['image']; // simpan ke kolom image_path
            $data['image_url'] = null;
        } else {
            $data['image_path'] = null;
            $data['image'] = null;
            // image_url dibiarkan apa adanya
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
