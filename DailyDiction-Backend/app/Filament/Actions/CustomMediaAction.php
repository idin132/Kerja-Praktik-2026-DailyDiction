<?php

namespace App\Filament\Actions;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
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
            TextInput::make('src')
                ->label('Image URL')
                ->placeholder('https://images.unsplash.com/... atau https://drive.google.com/file/d/.../view')
                ->helperText('Mendukung URL gambar biasa dan link Google Drive')
                ->required(),
            TextInput::make('alt')
                ->label('Alt Text'),
            TextInput::make('title')
                ->label('Title'),
            Checkbox::make('lazy')
                ->label('Lazy Load')
                ->default(false),
        ]);

        $this->action(function (TiptapEditor $component, array $data): void {
            // Konversi Google Drive URL ke direct image URL
            $src = $this->convertDriveUrl($data['src']);

            if (config('filament-tiptap-editor.use_relative_paths')) {
                $source = Str::of($src)
                    ->replace(config('app.url'), '')
                    ->ltrim('/')
                    ->prepend('/');
            } else {
                $source = str_starts_with($src, 'http')
                    ? $src
                    : Storage::disk(config('filament-tiptap-editor.disk'))->url($src);
            }

            $component->getLivewire()->dispatch(
                event: 'insertFromAction',
                type: 'media',
                statePath: $component->getStatePath(),
                media: [
                    'src'       => $source,
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

    /**
     * Konversi berbagai format URL Google Drive ke direct image URL
     */
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
