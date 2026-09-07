<script>
    (function() {
        // Tunggu sampai Livewire + Alpine siap
        document.addEventListener('livewire:navigated', init);
        document.addEventListener('DOMContentLoaded', init);

        function init() {
            // Hanya jalan di halaman create/edit article
            const path = window.location.pathname;
            const isArticlePage =
                path.includes('/admin/articles/create') ||
                path.match(/\/admin\/articles\/\d+\/edit/);

            if (!isArticlePage) return;

            // Tentukan key unik
            const editMatch = path.match(/\/admin\/articles\/(\d+)\/edit/);
            const DRAFT_KEY = editMatch ?
                `article_draft_edit_${editMatch[1]}` :
                'article_draft_create';

            let debounceTimer = null;
            const DEBOUNCE_MS = 4000; // save setelah 4 detik berhenti ngetik

            // ─── FUNGSI BACA SEMUA FIELD ───────────────────────────────────────
            function getLivewireComponent() {
                // Handle create & edit page
                const names = [
                    'app.filament.resources.article-resource.pages.create-article',
                    'app.filament.resources.article-resource.pages.edit-article',
                ];
                for (const name of names) {
                    const found = window.Livewire.getByName(name);
                    if (found && found[0]) return found[0];
                }
                return null;
            }

            function collectFormData() {
                const component = getLivewireComponent();
                if (!component) return {};

                const state = component.get('data');

                // Tiptap content tetap ambil dari DOM karena tidak sync ke Livewire state
                const proseMirror = document.querySelector('.tiptap.ProseMirror');
                const content = proseMirror ? proseMirror.innerHTML : null;

                return {
                    type: state.type ?? null,
                    title: state.title ?? null,
                    slug: state.slug ?? null,
                    author: state.author ?? null,
                    summary: state.summary ?? null,
                    image_url: state.image_url ?? null,
                    thumbnail_mode: state.thumbnail_mode ?? null,
                    is_published: state.is_published ?? null,
                    category_input: state.category_input ?? [],
                    platform: state.platform ?? [],
                    content,
                    _savedAt: new Date().toISOString(),
                };
            }

            // ─── FUNGSI SAVE ───────────────────────────────────────────────────

            function saveDraft() {
                const data = collectFormData();
                // Jangan save kalau title kosong (form belum diisi sama sekali)
                if (!data.title && !data.content) return;
                localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
                showToast('Draft tersimpan otomatis');
            }

            function clearDraft() {
                localStorage.removeItem(DRAFT_KEY);
            }

            // ─── FUNGSI RESTORE ────────────────────────────────────────────────

            function restoreDraft(draft) {
                const component = getLivewireComponent();
                if (!component) return;

                const fields = ['type', 'title', 'slug', 'author', 'summary',
                    'image_url', 'thumbnail_mode', 'is_published',
                    'category_input', 'platform'
                ];

                fields.forEach(field => {
                    if (draft[field] !== null && draft[field] !== undefined) {
                        component.set(`data.${field}`, draft[field]);
                    }
                });

                // Tiptap inject via editor instance
                if (draft.content) {
                    waitForTiptap(function(editor) {
                        editor.commands.setContent(draft.content);
                    });
                }
            }

            function dispatchSet(field, value) {
                window.Livewire.dispatch('$set', {
                    name: field,
                    value: value
                });
            }

            function waitForTiptap(callback, attempts) {
                attempts = attempts || 0;
                if (attempts > 20) return; // timeout setelah ~2 detik
                const el = document.querySelector('.tiptap.ProseMirror');
                if (el && el.editor) {
                    callback(el.editor);
                } else {
                    setTimeout(() => waitForTiptap(callback, attempts + 1), 100);
                }
            }

            // ─── BANNER NOTIFIKASI ─────────────────────────────────────────────

            function showRestoreBanner(draft) {
                const savedAt = draft._savedAt ?
                    new Date(draft._savedAt).toLocaleString('id-ID') :
                    'sebelumnya';

                // Pakai native <dialog> — selalu di atas semua elemen termasuk Filament overlay
                const dialog = document.createElement('dialog');
                dialog.id = 'draft-restore-banner';
                dialog.style.cssText = `
                    border: 1px solid #38bdf8;
                    border-radius: 12px;
                    padding: 14px 20px;
                    background: #1e293b;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    color: #e2e8f0;
                    font-family: sans-serif;
                    font-size: 13px;
                    min-width: 320px;
                    max-width: 480px;
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    translate: -50% 0;
                    margin: 0;
                `;
                dialog.innerHTML = `
                    <div style="display:flex; align-items:center; gap:14px;">
                        <span style="font-size:20px">📝</span>
                        <div style="flex:1">
                            <div style="font-weight:600; color:#38bdf8; margin-bottom:2px">Draft ditemukan</div>
                            <div style="color:#94a3b8; font-size:11px">Disimpan: ${savedAt}</div>
                        </div>
                        <button id="draft-restore-btn" style="
                            background:#38bdf8; color:#0f172a; border:none;
                            border-radius:7px; padding:6px 14px; font-weight:700;
                            cursor:pointer; font-size:12px;
                        ">Pulihkan</button>
                        <button id="draft-discard-btn" style="
                            background:transparent; color:#94a3b8; border:1px solid #334155;
                            border-radius:7px; padding:6px 14px; font-weight:600;
                            cursor:pointer; font-size:12px;
                        ">Buang</button>
                    </div>
                `;

                document.body.appendChild(dialog);
                dialog.show(); // pakai show() bukan showModal() — supaya tidak ada backdrop

                dialog.querySelector('#draft-restore-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (dialog._handled) return; // guard double click
                    dialog._handled = true;

                    restoreDraft(draft);
                    dialog.remove();
                    showToast('Draft berhasil dipulihkan ✓');
                });

                dialog.querySelector('#draft-discard-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (dialog._handled) return;
                    dialog._handled = true;

                    clearDraft();
                    dialog.remove();
                });
            }

            function showToast(message) {
                const existing = document.getElementById('draft-toast');
                if (existing) existing.remove();

                const toast = document.createElement('div');
                toast.id = 'draft-toast';
                toast.textContent = message;
                toast.style.cssText = `
                position: fixed; bottom: 24px; right: 24px;
                background: #1e293b; border: 1px solid #334155;
                color: #94a3b8; font-size: 11px; font-family: monospace;
                padding: 8px 14px; border-radius: 8px;
                z-index: 9999; opacity: 1;
                transition: opacity 0.5s;
            `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = '0';
                }, 2000);
                setTimeout(() => {
                    toast.remove();
                }, 2600);
            }

            // ─── DETEKSI PERUBAHAN ─────────────────────────────────────────────

            function setupListeners() {
                // Listen perubahan input apapun di dalam form Filament
                const formRoot = document.querySelector('form');
                if (!formRoot) return;

                formRoot.addEventListener('input', triggerDebounce);
                formRoot.addEventListener('change', triggerDebounce);

                // Tiptap tidak trigger input event standar, listen dari ProseMirror
                const observer = new MutationObserver(triggerDebounce);
                const proseMirror = document.querySelector('.tiptap.ProseMirror');
                if (proseMirror) {
                    observer.observe(proseMirror, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }

                // Clear draft saat form berhasil di-submit (Livewire success)
                document.addEventListener('livewire:navigated', clearDraft);
                window.addEventListener('beforeunload', function() {
                    // Save sekali lagi sebelum page ditutup
                    saveDraft();
                });
            }

            function triggerDebounce() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(saveDraft, DEBOUNCE_MS);
            }

            // ─── ENTRY POINT ───────────────────────────────────────────────────

            // Cek existing draft
            const existingDraft = localStorage.getItem(DRAFT_KEY);
            if (existingDraft) {
                try {
                    const draft = JSON.parse(existingDraft);
                    // Hanya tampilkan banner kalau ada konten bermakna
                    if (draft.title || draft.content) {
                        // Delay supaya Filament form sudah render
                        setTimeout(() => showRestoreBanner(draft), 1500);
                    }
                } catch (e) {
                    clearDraft();
                }
            }

            // Setup listener setelah DOM siap
            setTimeout(setupListeners, 1000);

            // ─── CLEAR SAAT SUKSES SAVE ────────────────────────────────────────
            // Filament dispatch event 'saved' setelah berhasil simpan
            document.addEventListener('filament::saved', clearDraft);
        }
    })();
</script>
