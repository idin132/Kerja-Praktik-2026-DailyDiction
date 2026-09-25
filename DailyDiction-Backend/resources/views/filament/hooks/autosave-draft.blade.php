<script>
    (function() {
        if (window.HasDraftScriptLoaded) return;
        window.HasDraftScriptLoaded = true;

        let draftInterval = null;
        let debounceTimer = null;
        const MAX_HISTORY = 3; // MAKSIMAL 3 DRAFT (Draft lama otomatis terhapus)

        document.addEventListener('livewire:navigated', init);
        document.addEventListener('DOMContentLoaded', init);

        function init() {
            const path = window.location.pathname;
            const isArticlePage =
                path.includes('/admin/articles/create') ||
                path.match(/\/admin\/articles\/\d+\/edit/);

            if (!isArticlePage) {
                if (draftInterval) clearInterval(draftInterval);
                return;
            }

            const editMatch = path.match(/\/admin\/articles\/(\d+)\/edit/);
            const DRAFT_KEY = editMatch ?
                `article_draft_history_edit_${editMatch[1]}` :
                'article_draft_history_create';

            function getLivewireComponent() {
                const names = [
                    'app.filament.resources.article-resource.pages.create-article',
                    'app.filament.resources.article-resource.pages.edit-article',
                ];
                for (const name of names) {
                    const found = window.Livewire?.getByName(name);
                    if (found && found[0]) return found[0];
                }
                return null;
            }

            function collectFormData() {
                const component = getLivewireComponent();
                const proseMirror = document.querySelector('.tiptap.ProseMirror');
                const content = proseMirror ? proseMirror.innerHTML : null;

                if (!proseMirror || content === null) return null;

                const state = component ? (component.get('data') || {}) : {};

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
                    content: content,
                    _savedAt: new Date().toISOString(),
                };
            }

            function getDraftHistory() {
                const raw = localStorage.getItem(DRAFT_KEY);
                if (!raw) return [];
                try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    return [];
                }
            }

            function saveDraft() {
                const data = collectFormData();
                if (!data) return;

                const plainText = data.content ? data.content.replace(/<[^>]*>/g, '').trim() : '';
                if (!data.title && plainText.length === 0) return;

                let history = getDraftHistory();

                if (history.length > 0) {
                    const last = history[0];
                    if (last.title === data.title && last.content === data.content) return;

                    // Safety Guard: Cegah simpan jika form mendadak reset/expired
                    const lastText = last.content ? last.content.replace(/<[^>]*>/g, '').trim() : '';
                    if (lastText.length > 50 && plainText.length < 10) return;
                }

                history.unshift(data);

                // Hapus draft lama jika sudah lebih dari 3
                if (history.length > MAX_HISTORY) {
                    history = history.slice(0, MAX_HISTORY);
                }

                localStorage.setItem(DRAFT_KEY, JSON.stringify(history));
                showToast('Draft tersimpan otomatis ✓');
            }

            function clearDraft() {
                localStorage.removeItem(DRAFT_KEY);
            }

            function restoreDraft(draft) {
                const component = getLivewireComponent();

                const fields = ['type', 'title', 'slug', 'author', 'summary',
                    'image_url', 'thumbnail_mode', 'is_published',
                    'category_input', 'platform'
                ];

                if (component) {
                    fields.forEach(field => {
                        if (draft[field] !== null && draft[field] !== undefined) {
                            component.set(`data.${field}`, draft[field]);
                        }
                    });
                }

                if (draft.content) {
                    waitForTiptap(function(editor) {
                        editor.commands.setContent(draft.content);
                    });
                }
            }

            function waitForTiptap(callback, attempts) {
                attempts = attempts || 0;
                if (attempts > 20) return;
                const el = document.querySelector('.tiptap.ProseMirror');
                if (el && el.editor) {
                    callback(el.editor);
                } else {
                    setTimeout(() => waitForTiptap(callback, attempts + 1), 100);
                }
            }

            function showRestoreBanner(history) {
                if (document.getElementById('draft-restore-banner')) return;
                if (!history || history.length === 0) return;

                const dialog = document.createElement('div');
                dialog.id = 'draft-restore-banner';
                dialog.style.cssText = `
                    border: 1px solid #38bdf8;
                    border-radius: 12px;
                    padding: 14px 18px;
                    background: #0f172a;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                    color: #e2e8f0;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    font-size: 13px;
                    width: 90%;
                    max-width: 460px;
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    translate: -50% 0;
                    margin: 0;
                    z-index: 99999;
                    transition: all 0.3s ease;
                `;

                let listItemsHtml = '';
                history.forEach((draft, index) => {
                    const savedAt = draft._savedAt ?
                        new Date(draft._savedAt).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        }) :
                        `Draft #${index + 1}`;

                    const titlePreview = draft.title ? draft.title : '(Tanpa Judul)';

                    listItemsHtml += `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:#1e293b; border:1px solid #334155; border-radius:8px; margin-bottom:8px;">
                            <div style="flex:1; overflow:hidden; padding-right:12px;">
                                <div style="font-weight:700; color:#f8fafc; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${titlePreview}</div>
                                <div style="color:#38bdf8; font-size:11px; margin-top:2px;">🕒 ${savedAt}</div>
                            </div>
                            <button class="draft-restore-item-btn" data-index="${index}" style="
                                background:#38bdf8; color:#0f172a; border:none;
                                border-radius:6px; padding:6px 12px; font-weight:700;
                                cursor:pointer; font-size:11px; shrink:0;
                            ">Pulihkan</button>
                        </div>
                    `;
                });

                dialog.innerHTML = `
                    <div id="draft-dialog-header" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:18px">📝</span>
                            <span style="font-weight:700; color:#38bdf8; font-size:14px;">Riwayat Draft Lokal (${history.length}/3)</span>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button id="draft-minimize-btn" title="Minggirkan / Minimize" style="background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:5px; width:26px; height:26px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">🗕</button>
                            <button id="draft-close-btn" title="Tutup" style="background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:5px; width:26px; height:26px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">✕</button>
                        </div>
                    </div>
                    <div id="draft-dialog-body">
                        <div style="max-height:240px; overflow-y:auto; margin-bottom:12px;">
                            ${listItemsHtml}
                        </div>
                        <div style="display:flex; justify-content:flex-end;">
                            <button id="draft-discard-btn" style="
                                background:transparent; color:#ef4444; border:1px solid #7f1d1d;
                                border-radius:6px; padding:5px 10px; font-weight:600;
                                cursor:pointer; font-size:11px;
                            ">Hapus Riwayat</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(dialog);

                let isMinimized = false;

                function toggleMinimize() {
                    const body = dialog.querySelector('#draft-dialog-body');
                    const minBtn = dialog.querySelector('#draft-minimize-btn');

                    if (!isMinimized) {
                        body.style.display = 'none';
                        dialog.style.top = 'auto';
                        dialog.style.bottom = '20px';
                        dialog.style.left = 'auto';
                        dialog.style.right = '20px';
                        dialog.style.translate = '0 0';
                        dialog.style.width = 'auto';
                        minBtn.textContent = '🗖';
                        isMinimized = true;
                    } else {
                        body.style.display = 'block';
                        dialog.style.top = '80px';
                        dialog.style.bottom = 'auto';
                        dialog.style.left = '50%';
                        dialog.style.right = 'auto';
                        dialog.style.translate = '-50% 0';
                        dialog.style.width = '90%';
                        minBtn.textContent = '🗕';
                        isMinimized = false;
                    }
                }

                // Event Listener Pulihkan (TIDAK KELUAR MODAL, BISA MINGGIR SEMENTARA)
                dialog.querySelectorAll('.draft-restore-item-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        const idx = parseInt(this.getAttribute('data-index'));
                        const selectedDraft = history[idx];
                        if (selectedDraft) {
                            restoreDraft(selectedDraft);
                            showToast(`Draft versi #${idx + 1} dipulihkan ✓`);
                            // Otomatis disusutkan ke pojok kanan bawah agar pengguna bisa cek teks dulu
                            if (!isMinimized) toggleMinimize();
                        }
                    });
                });

                dialog.querySelector('#draft-minimize-btn').addEventListener('click', toggleMinimize);

                dialog.querySelector('#draft-close-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    dialog.remove();
                });

                dialog.querySelector('#draft-discard-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    clearDraft();
                    dialog.remove();
                    showToast('Semua riwayat draft dibuang');
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
                    background: #0f172a; border: 1px solid #38bdf8;
                    color: #38bdf8; font-size: 11px; font-family: monospace;
                    padding: 8px 14px; border-radius: 8px; z-index: 99999;
                    opacity: 1; transition: opacity 0.5s;
                `;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; }, 2000);
                setTimeout(() => { toast.remove(); }, 2600);
            }

            function setupListeners() {
                if (draftInterval) clearInterval(draftInterval);

                draftInterval = setInterval(saveDraft, 30000);

                document.addEventListener('input', function(e) {
                    if (e.target.closest('.tiptap.ProseMirror') || e.target.closest('input') || e.target.closest('textarea')) {
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(saveDraft, 1500);
                    }
                });

                if (!window.DraftEventListenersAdded) {
                    window.addEventListener('beforeunload', saveDraft);
                    document.addEventListener('livewire:navigate', saveDraft);
                    document.addEventListener('filament::saved', clearDraft);

                    document.addEventListener('click', function(e) {
                        if (e.target.closest('button[type="submit"]') || e.target.closest('.fi-btn-label')) {
                            saveDraft();
                        }
                    });

                    window.DraftEventListenersAdded = true;
                }
            }

            // Entry Point
            const history = getDraftHistory();
            if (history.length > 0) {
                setTimeout(() => showRestoreBanner(history), 1000);
            }

            setTimeout(setupListeners, 800);
        }
    })();
</script>