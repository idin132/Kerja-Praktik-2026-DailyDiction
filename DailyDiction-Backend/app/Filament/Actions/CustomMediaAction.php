<?php

namespace App\Filament\Actions;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use FilamentTiptapEditor\Actions\MediaAction;
use FilamentTiptapEditor\TiptapEditor;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomMediaAction extends MediaAction
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->form([
            Radio::make('source_type')
                ->label('Pilih Sumber Gambar')
                ->options([
                    'url'  => 'Embed Link (URL / Google Drive)',
                    'file' => 'Upload File Gambar (Maks 2MB)',
                ])
                ->default('url')
                ->inline()
                ->live(),

            TextInput::make('src')
                ->label('Image URL')
                ->placeholder('https://images.unsplash.com/... atau https://drive.google.com/file/d/.../view')
                ->helperText('Mendukung link gambar langsung dan link Google Drive')
                ->required(fn(Get $get): bool => $get('source_type') === 'url')
                ->visible(fn(Get $get): bool => $get('source_type') === 'url'),

            FileUpload::make('uploaded_file')
                ->label('Pilih File Gambar')
                ->image()
                ->disk('public')
                ->directory('articles/content-images')
                ->visibility('public')
                ->maxSize(2048) // Maksimal 2MB
                ->required(fn(Get $get): bool => $get('source_type') === 'file')
                ->visible(fn(Get $get): bool => $get('source_type') === 'file'),

            TextInput::make('alt')
                ->label('Alt Text'),

            TextInput::make('title')
                ->label('Title'),

            Checkbox::make('lazy')
                ->label('Lazy Load')
                ->default(false),
        ]);

        $this->action(function (TiptapEditor $component, array $data): void {
            // 1. Tentukan Source URL Gambar yang valid dan bisa diakses browser
            if (($data['source_type'] ?? 'url') === 'file' && ! empty($data['uploaded_file'])) {
                // Konversi path storage lokal ke URL penuh publik
                $source = asset('storage/' . $data['uploaded_file']);
            } else {
                $src = $this->convertDriveUrl($data['src'] ?? '');

                if (config('filament-tiptap-editor.use_relative_paths')) {
                    $source = (string) Str::of($src)
                        ->replace(config('app.url'), '')
                        ->ltrim('/')
                        ->prepend('/');
                } else {
                    $source = str_starts_with($src, 'http')
                        ? $src
                        : Storage::disk(config('filament-tiptap-editor.disk', 'public'))->url($src);
                }
            }

            // 2. Dispatch event insertFromAction ke Livewire Tiptap Editor
            $component->getLivewire()->dispatch(
                event: 'insertFromAction',
                type: 'media',
                statePath: $component->getStatePath(),
                media: [
                    'src'       => (string) $source,
                    'alt'       => $data['alt'] ?? null,
                    'title'     => $data['title'] ?? null,
                    'width'     => null,
                    'height'    => null,
                    'lazy'      => (bool) ($data['lazy'] ?? false),
                    'link_text' => null,
                ],
            );
        });
    }

    private function convertDriveUrl(string $url): string
    {
        if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
            $driveUrl = 'https://drive.google.com/uc?export=view&id=' . $matches[1];
            return url('/api/proxy-image?url=' . urlencode($driveUrl));
        }

        if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            $driveUrl = 'https://drive.google.com/uc?export=view&id=' . $matches[1];
            return url('/api/proxy-image?url=' . urlencode($driveUrl));
        }

        if (preg_match('/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            $driveUrl = 'https://drive.google.com/uc?export=view&id=' . $matches[1];
            return url('/api/proxy-image?url=' . urlencode($driveUrl));
        }

        return $url;
    }
}
