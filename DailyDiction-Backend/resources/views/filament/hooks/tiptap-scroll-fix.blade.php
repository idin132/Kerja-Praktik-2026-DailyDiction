<script>
    document.addEventListener('DOMContentLoaded', function () {
        function patchProseMirrorScroll() {
            // Cari semua instance EditorView yang sudah di-mount
            document.querySelectorAll('.tiptap.ProseMirror').forEach(function (el) {
                // Akses instance EditorView via __vue__ atau property internal ProseMirror
                // ProseMirror menyimpan view di property pmViewDesc -> view
                if (el.pmViewDesc && el.pmViewDesc.view) {
                    var view = el.pmViewDesc.view;
                    if (!view.__scrollPatched) {
                        var originalDispatch = view.dispatch.bind(view);
                        view.dispatch = function (tr) {
                            // Hapus scrollIntoView dari setiap transaksi
                            tr.scrolledIntoView = true; // trick: tandai seolah sudah discroll
                            originalDispatch(tr);
                        };
                        view.__scrollPatched = true;
                    }
                }
            });
        }

        // Jalankan saat awal dan setiap kali Livewire selesai morph
        patchProseMirrorScroll();
        document.addEventListener('livewire:morph', patchProseMirrorScroll);
        document.addEventListener('livewire:navigated', patchProseMirrorScroll);
    });
</script>

