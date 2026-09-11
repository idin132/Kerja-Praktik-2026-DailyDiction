<script>
    document.addEventListener('DOMContentLoaded', function() {

        function patchTiptapScroll() {
            console.log('=== PATCH ATTEMPT ===');

            document.querySelectorAll('.tiptap.ProseMirror').forEach(function(el) {
                console.log('Found editor el:', el);
                console.log('_tipTapEditor:', el._tipTapEditor);
                console.log('__x:', el.__x);

                if (el._tipTapEditor) {
                    console.log('✅ Pendekatan 1 berhasil nangkep');
                }

                if (el.__x) {
                    try {
                        var view = el.__x.$data?.editor?.view;
                        console.log('Pendekatan 2 view:', view);
                    } catch (e) {
                        console.log('Pendekatan 2 error:', e);
                    }
                }
            });

            document.querySelectorAll('[x-data]').forEach(function(el) {
                try {
                    var alpineData = Alpine.$data(el);
                    if (alpineData?.editor) {
                        console.log('✅ Pendekatan 3 nemu editor di:', el, alpineData.editor);
                    }
                } catch (e) {}
            });
        }

        document.addEventListener('alpine:initialized', function() {
            setTimeout(patchTiptapScroll, 500);
        });

        document.addEventListener('livewire:morph', function() {
            setTimeout(patchTiptapScroll, 300);
        });
    });
</script>
