// ============================================================================
// ODOO-SEARCH-BUTTON.js v3.0.0
// FILE CENTRALIZZATO - shared-database/odoo-search-button.js
//
// Sovrascrive "Nuovo Progetto" su TUTTE le app con dialog moderno:
//   Tab 1: 🔍 Cerca cliente in Odoo → redirect ?odoo_id=
//   Tab 2: ✏️ Inserimento manuale → crea progetto nativo
//
// App supportate:
//   - App Rilievo iPad  → sovrascrive showNewProjectModal()
//   - Dashboard Ufficio → sovrascrive openPMProjectModal()
//   - App Posa          → sovrascrive showNewProjectModal()
//
// Aggiunge anche bottone "🔍 Cerca in Odoo" nel menu sidebar
// con MutationObserver per sopravvivere a render() dinamici.
// ============================================================================

(function() {
    'use strict';

    const VERSION = '3.0.0';
    const BUTTON_ID = 'odoo-search-sidebar-btn';
    const DIALOG_ID = 'odoo-newproject-dialog';

    function getServerUrl() {
        if (window.ODOO_INTEGRATION && window.ODOO_INTEGRATION._serverUrl) {
            return window.ODOO_INTEGRATION._serverUrl;
        }
        return 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    }

    // ========================================================================
    // DETECT APP & SAVE ORIGINALS
    // ========================================================================

    let _origShowNewProjectModal = null;
    let _origOpenPMProjectModal = null;

    function detectAndOverride() {
        // App Rilievo / App Posa: showNewProjectModal
        if (typeof window.showNewProjectModal === 'function') {
            _origShowNewProjectModal = window.showNewProjectModal;
            window.showNewProjectModal = () => {
                closeMenusSafe();
                showUnifiedDialog('rilievo');
            };
            console.log('✅ [OdooSearch v' + VERSION + '] Override: showNewProjectModal (App Rilievo)');
        }

        // Dashboard Ufficio: openPMProjectModal
        if (typeof window.openPMProjectModal === 'function') {
            _origOpenPMProjectModal = window.openPMProjectModal;
            window.openPMProjectModal = () => {
                closeMenusSafe();
                showUnifiedDialog('dashboard');
            };
            console.log('✅ [OdooSearch v' + VERSION + '] Override: openPMProjectModal (Dashboard)');
        }
    }

    function closeMenusSafe() {
        // App Rilievo: chiudi senza render (preserva DOM)
        if (typeof window.closeMainMenuNoRender === 'function') {
            window.closeMainMenuNoRender();
        }
        try {
            if (typeof state !== 'undefined') {
                state.mainMenuOpen = false;
                state.projectMenuOpen = false;
            }
        } catch(e) {}
        // Dashboard: chiudi sidebar
        if (typeof window.closeSidebar === 'function') {
            window.closeSidebar();
        }
    }

    // ========================================================================
    // DIALOG UNIFICATO: Odoo Search + Manuale
    // ========================================================================

    function showUnifiedDialog(appType) {
        const old = document.getElementById(DIALOG_ID);
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = DIALOG_ID;
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:60px;';

        overlay.innerHTML = `
            <div style="background:white;border-radius:16px;width:94%;max-width:520px;box-shadow:0 25px 50px rgba(0,0,0,0.25);overflow:hidden;font-family:system-ui,-apple-system,sans-serif;max-height:85vh;overflow-y:auto;">
                <div style="background:linear-gradient(135deg,#714B67 0%,#9B6B8E 100%);color:white;padding:18px 20px;">
                    <h2 style="margin:0;font-size:1.2rem;">➕ Nuovo Progetto</h2>
                    <p style="margin:6px 0 0;opacity:0.9;font-size:0.85rem;">Cerca cliente da Odoo oppure inserisci manualmente</p>
                </div>
                <div id="odoo-np-tabs" style="display:flex;border-bottom:2px solid #e5e7eb;">
                    <button id="odoo-np-tab-search" style="flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;">🔍 Cerca in Odoo</button>
                    <button id="odoo-np-tab-manual" style="flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;">✏️ Manuale</button>
                </div>
                <div id="odoo-np-search-panel" style="padding:16px;">
                    <div style="display:flex;gap:8px;">
                        <input id="odoo-np-search-input" type="text" placeholder="Cerca nome, telefono, email..."
                            style="flex:1;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;-webkit-appearance:none;" />
                        <button id="odoo-np-search-go" style="padding:12px 18px;background:#714B67;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Cerca</button>
                    </div>
                    <div id="odoo-np-search-results" style="margin-top:12px;max-height:300px;overflow-y:auto;">
                        <p style="color:#9ca3af;text-align:center;padding:20px;font-size:14px;">Digita almeno 2 caratteri e premi Cerca</p>
                    </div>
                </div>
                <div id="odoo-np-manual-panel" style="padding:16px;display:none;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block;font-weight:600;font-size:13px;color:#374151;margin-bottom:4px;">Nome Cliente *</label>
                        <input id="odoo-np-client-name" type="text" placeholder="Es: Rossi Mario"
                            style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;box-sizing:border-box;" />
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-weight:600;font-size:13px;color:#374151;margin-bottom:4px;">Nome Progetto <span style="color:#9ca3af;font-weight:400;">(opzionale)</span></label>
                        <input id="odoo-np-project-name" type="text" placeholder="Lascia vuoto per usare nome cliente"
                            style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;box-sizing:border-box;" />
                    </div>
                    <button id="odoo-np-create-manual" style="width:100%;padding:14px;background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">➕ Crea Progetto</button>
                </div>
                <div style="padding:12px 16px;border-top:1px solid #e5e7eb;text-align:right;">
                    <button id="odoo-np-close" style="padding:10px 24px;background:#f3f4f6;color:#374151;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:14px;">Chiudi</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        setTimeout(() => document.getElementById('odoo-np-search-input')?.focus(), 150);

        // --- TAB SWITCHING ---
        const activeCSS = 'flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;';
        const inactiveCSS = 'flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;';

        function switchTab(tab) {
            const sp = document.getElementById('odoo-np-search-panel');
            const mp = document.getElementById('odoo-np-manual-panel');
            const st = document.getElementById('odoo-np-tab-search');
            const mt = document.getElementById('odoo-np-tab-manual');
            if (!sp) return;
            if (tab === 'search') {
                sp.style.display = 'block'; mp.style.display = 'none';
                st.style.cssText = activeCSS; mt.style.cssText = inactiveCSS;
                setTimeout(() => document.getElementById('odoo-np-search-input')?.focus(), 100);
            } else {
                sp.style.display = 'none'; mp.style.display = 'block';
                mt.style.cssText = activeCSS; st.style.cssText = inactiveCSS;
                setTimeout(() => document.getElementById('odoo-np-client-name')?.focus(), 100);
            }
        }

        // --- SEARCH ODOO ---
        async function doSearch() {
            const input = document.getElementById('odoo-np-search-input');
            const resultsDiv = document.getElementById('odoo-np-search-results');
            const query = input.value.trim();
            if (query.length < 2) {
                resultsDiv.innerHTML = '<p style="color:#ef4444;text-align:center;padding:12px;">Digita almeno 2 caratteri</p>';
                return;
            }
            resultsDiv.innerHTML = '<p style="color:#6b7280;text-align:center;padding:20px;">⏳ Ricerca...</p>';
            try {
                const resp = await fetch(getServerUrl() + '/api/customers?search=' + encodeURIComponent(query), {
                    headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
                });
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const data = await resp.json();
                const customers = data.customers || data.results || (Array.isArray(data) ? data : []);
                if (!customers || customers.length === 0) {
                    resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;"><p style="color:#9ca3af;">Nessun risultato per "' + query + '"</p><button id="odoo-np-goto-manual" style="margin-top:10px;padding:8px 16px;background:#714B67;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">✏️ Inserisci manualmente</button></div>';
                    document.getElementById('odoo-np-goto-manual')?.addEventListener('click', () => switchTab('manual'));
                    return;
                }
                resultsDiv.innerHTML = customers.slice(0, 20).map(c =>
                    '<div class="odoo-np-result" data-id="' + c.id + '" style="padding:14px 16px;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background=\'#f0f4ff\'" onmouseout="this.style.background=\'white\'">' +
                    '<div style="font-weight:600;color:#111827;font-size:15px;">' + (c.name || 'Senza nome') + '</div>' +
                    '<div style="font-size:13px;color:#6b7280;margin-top:3px;">' + [c.phone, c.email, c.city].filter(Boolean).join(' &bull; ') + '</div></div>'
                ).join('');
                resultsDiv.querySelectorAll('.odoo-np-result').forEach(item => {
                    item.addEventListener('click', () => {
                        overlay.remove();
                        // Redirect → odoo-integration.js gestisce tutto
                        window.location.href = window.location.pathname + '?odoo_id=' + item.dataset.id;
                    });
                });
            } catch (err) {
                console.error('❌ [OdooSearch] Errore:', err);
                resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;"><p style="color:#ef4444;font-weight:600;">❌ Server non raggiungibile</p><p style="color:#9ca3af;font-size:13px;margin-top:8px;">Verifica AVVIA-OPERA.bat</p><button id="odoo-np-goto-manual2" style="margin-top:12px;padding:8px 16px;background:#714B67;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">✏️ Inserisci manualmente</button></div>';
                document.getElementById('odoo-np-goto-manual2')?.addEventListener('click', () => switchTab('manual'));
            }
        }

        // --- MANUAL CREATE ---
        function doCreateManual() {
            const clientInput = document.getElementById('odoo-np-client-name');
            const projectInput = document.getElementById('odoo-np-project-name');
            const clientName = clientInput.value.trim();
            if (!clientName) { clientInput.style.borderColor = '#ef4444'; clientInput.focus(); return; }
            const projectName = projectInput.value.trim() || clientName;
            overlay.remove();

            // App Rilievo / Posa: createProject()
            if (typeof window.createProject === 'function') {
                window.createProject(projectName, clientName);
                try { state.screen = 'project'; render(); } catch(e) {}
                return;
            }
            // Dashboard: createPMProject() con form values
            if (typeof window.createPMProject === 'function') {
                // Pre-compila i campi del form se esistono
                const nameField = document.getElementById('pm-project-name') || document.getElementById('project-name');
                const clientField = document.getElementById('pm-project-client') || document.getElementById('client-name');
                if (nameField) nameField.value = projectName;
                if (clientField) clientField.value = clientName;
                window.createPMProject();
                return;
            }
            // Fallback: chiama originale se salvata
            if (_origShowNewProjectModal) { _origShowNewProjectModal(); return; }
            if (_origOpenPMProjectModal) { _origOpenPMProjectModal(); return; }
            alert('Errore: nessuna funzione di creazione progetto trovata');
        }

        // --- EVENT LISTENERS ---
        document.getElementById('odoo-np-tab-search').addEventListener('click', () => switchTab('search'));
        document.getElementById('odoo-np-tab-manual').addEventListener('click', () => switchTab('manual'));
        document.getElementById('odoo-np-search-go').addEventListener('click', doSearch);
        document.getElementById('odoo-np-search-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
        document.getElementById('odoo-np-create-manual').addEventListener('click', doCreateManual);
        document.getElementById('odoo-np-client-name').addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreateManual(); });
        document.getElementById('odoo-np-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // ========================================================================
    // BOTTONE SIDEBAR "Cerca in Odoo"
    // ========================================================================

    function injectButton() {
        if (document.getElementById(BUTTON_ID)) return false;

        // --- APP RILIEVO: dentro submenu Progetti ---
        const progettiSubmenu = document.getElementById('main-submenu-progetti');
        if (progettiSubmenu) {
            const item = document.createElement('div');
            item.id = BUTTON_ID;
            item.className = 'main-submenu-item';
            item.style.cssText = 'background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;margin:4px 8px;font-weight:600;cursor:pointer;';
            item.innerHTML = '<span>🔍 Cerca in Odoo</span>';
            item.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (typeof window.closeMainMenuNoRender === 'function') window.closeMainMenuNoRender();
                setTimeout(() => showUnifiedDialog('rilievo'), 100);
            };
            progettiSubmenu.appendChild(item);
            return true;
        }

        // --- DASHBOARD: dopo bottone Nuovo Progetto nella sidebar ---
        const pmNewBtn = document.querySelector('.pm-sidebar-new-btn, [onclick*="openPMProjectModal"]');
        if (pmNewBtn) {
            const btn = document.createElement('a');
            btn.id = BUTTON_ID;
            btn.href = '#';
            btn.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 16px;margin:4px 12px;background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;cursor:pointer;transition:opacity 0.2s;';
            btn.innerHTML = '🔍 Cerca in Odoo';
            btn.onmouseover = () => btn.style.opacity = '0.85';
            btn.onmouseout = () => btn.style.opacity = '1';
            btn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (typeof window.closeSidebar === 'function') window.closeSidebar();
                showUnifiedDialog('dashboard');
            };
            pmNewBtn.parentNode.insertBefore(btn, pmNewBtn.nextSibling);
            return true;
        }

        // --- DASHBOARD: sidebar-content generico ---
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent) {
            let insertAfter = null;
            for (const el of sidebarContent.querySelectorAll('.sidebar-item, div[class*="sidebar"]')) {
                if ((el.textContent || '').toLowerCase().includes('nuovo progetto')) { insertAfter = el; break; }
            }
            if (!insertAfter && sidebarContent.children.length > 0) insertAfter = sidebarContent.children[0];
            if (insertAfter) {
                const btn = document.createElement('div');
                btn.id = BUTTON_ID;
                btn.className = 'sidebar-item';
                btn.style.cssText = 'cursor:pointer;background:linear-gradient(135deg,#714B67,#9B6B8E);border-radius:8px;margin:4px 0;transition:opacity 0.2s;';
                btn.innerHTML = '<div class="sidebar-item-header" style="color:white;font-weight:600;padding:10px 16px;"><span>🔍</span> Cerca in Odoo</div>';
                btn.onmouseover = () => btn.style.opacity = '0.85';
                btn.onmouseout = () => btn.style.opacity = '1';
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (typeof window.closeSidebar === 'function') window.closeSidebar();
                    showUnifiedDialog('dashboard');
                };
                insertAfter.parentNode.insertBefore(btn, insertAfter.nextSibling);
                return true;
            }
        }

        return false;
    }

    // ========================================================================
    // MUTATION OBSERVER - re-inject dopo render() dinamici
    // ========================================================================

    let observer = null;
    function startObserver() {
        if (observer) return;
        const target = document.getElementById('app') || document.body;
        observer = new MutationObserver(() => {
            if (!document.getElementById(BUTTON_ID)) injectButton();
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    // ========================================================================
    // EXPORTS & INIT
    // ========================================================================

    window.ODOO_SEARCH_BUTTON = {
        VERSION: VERSION,
        showDialog: showUnifiedDialog,
        injectButton: injectButton
    };

    function init() {
        detectAndOverride();
        injectButton();
        startObserver();
        console.log('🔍 [OdooSearch v' + VERSION + '] Inizializzato - centralizzato per tutte le app');
    }

    // Delay per assicurare che le app abbiano definito le loro funzioni
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 2500));
    } else {
        setTimeout(init, 2500);
    }

})();
