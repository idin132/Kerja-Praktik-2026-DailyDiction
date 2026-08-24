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
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['category_input'] = $this->record->categories->pluck('name')->toArray();
        $data['image_source'] = !empty($data['image_path']) ? 'file' : 'url';

        // Isi field 'image' dari image_path supaya FileUpload bisa tampil saat edit
        if (!empty($data['image_path'])) {
            $data['image'] = $data['image_path'];
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['category_input']);
        unset($data['image_source']);

        // Fix: FileUpload kadang return array, ambil nilai pertama
        if (isset($data['image']) && is_array($data['image'])) {
            $data['image'] = $data['image'][0] ?? null;
        }

        // Prioritas: file upload > URL
        if (!empty($data['image'])) {
            $data['image_path'] = $data['image'];
            $data['image_url'] = null;
        } else {
            $data['image_path'] = null;
            $data['image'] = null;
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
