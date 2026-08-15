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
                ->placeholder('https://images.unsplash.com/...')
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
            // Ikuti logika source asli library
            if (config('filament-tiptap-editor.use_relative_paths')) {
                $source = Str::of($data['src'])
                    ->replace(config('app.url'), '')
                    ->ltrim('/')
                    ->prepend('/');
            } else {
                $source = str_starts_with($data['src'], 'http')
                    ? $data['src']
                    : Storage::disk(config('filament-tiptap-editor.disk'))->url($data['src']);
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
}
