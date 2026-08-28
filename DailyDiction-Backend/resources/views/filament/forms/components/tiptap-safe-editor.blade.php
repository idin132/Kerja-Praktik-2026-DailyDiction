<div 
    wire:ignore 
    x-ignore 
    class="tiptap-safe-container" 
    style="position: relative; z-index: 1;"
    @keydown.enter.stop
>
    {{ $getChildComponentContainer() }}
</div>