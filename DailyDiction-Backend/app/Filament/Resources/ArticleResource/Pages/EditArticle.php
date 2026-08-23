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
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['category_input']);
        unset($data['image_source']); // ← tambah ini

        if (!empty($data['image_url'])) {
            $data['image_path'] = null;
        } else {
            $data['image_url'] = null;
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
