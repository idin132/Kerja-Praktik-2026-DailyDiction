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
        // Isi TagsInput dengan nama kategori yang sudah ada
        $data['category_input'] = $this->record->categories->pluck('name')->toArray();
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Hitung Read Time otomatis sebelum update ke database
        if (!empty($data['content'])) {
            $rawText = is_array($data['content']) ? json_encode($data['content']) : (string) $data['content'];
            $cleanText = strip_tags($rawText);
            $wordCount = str_word_count($cleanText);
            $minutes = max(1, ceil($wordCount / 200));
            $data['read_time'] = "{$minutes} MIN READ";
        } else {
            $data['read_time'] = '1 MIN READ';
        }

        unset($data['category_input']);
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