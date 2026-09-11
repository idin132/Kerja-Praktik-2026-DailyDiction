<script>
    document.addEventListener('DOMContentLoaded', function() {

        function patchTiptapScroll() {
            document.querySelectorAll('.tiptap.ProseMirror').forEach(function(el) {
                // Pendekatan 1: via el.editor (Tiptap expose ini ke DOM)
                if (el._tipTapEditor) {
                    var view = el._tipTapEditor.view;
                    if (view && !view.__scrollPatched) {
                        view.props.handleScrollToSelection = function() {
                            return true;
                        };
                        view.__scrollPatched = true;
                    }
                }

                // Pendekatan 2: via Alpine component yang wrap editor
                if (el.__x) {
                    try {
                        var view = el.__x.$data?.editor?.view;
                        if (view && !view.__scrollPatched) {
                            view.props.handleScrollToSelection = function() {
                                return true;
                            };
                            view.__scrollPatched = true;
                        }
                    } catch (e) {}
                }
            });

            // Pendekatan 3: cari via Alpine pada parent element
            document.querySelectorAll('[x-data]').forEach(function(el) {
                try {
                    var alpineData = Alpine.$data(el);
                    if (alpineData?.editor?.view && !alpineData.editor.view.__scrollPatched) {
                        alpineData.editor.view.props.handleScrollToSelection = function() {
                            return true;
                        };
                        alpineData.editor.view.__scrollPatched = true;
                    }
                } catch (e) {}
            });
        }

        // Tunggu Alpine selesai init
        document.addEventListener('alpine:initialized', function() {
            setTimeout(patchTiptapScroll, 500);
        });

        document.addEventListener('livewire:morph', function() {
            setTimeout(patchTiptapScroll, 300);
        });

        document.addEventListener('livewire:navigated', function() {
            setTimeout(patchTiptapScroll, 300);
        });
    });
</script>
