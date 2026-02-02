// ============================================================================
// ODOO-SEARCH-BUTTON.js v3.3.0
// FILE CENTRALIZZATO - shared-database/odoo-search-button.js
//
// v3.3.0: Click usa funzione globale _odooSelectResult()
//         Dopo creazione apre scheda Dati Cliente (step 1)
// ============================================================================

(function() {
    'use strict';

    var VERSION = '3.3.0';
    var BUTTON_ID = 'odoo-search-sidebar-btn';
    var DIALOG_ID = 'odoo-newproject-dialog';
    var MARKER = '__odooOverride';

    console.log('📦 [OdooSearch v' + VERSION + '] Script caricato');

    function getServerUrl() {
        if (window.ODOO_INTEGRATION && window.ODOO_INTEGRATION._serverUrl) {
            return window.ODOO_INTEGRATION._serverUrl;
        }
        return 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    }

    // ========================================================================
    // OVERRIDE con POLLING
    // ========================================================================

    function makeOverrideFn() {
        var fn = function() {
            closeMenusSafe();
            showNewProjectDialog();
        };
        fn[MARKER] = true;
        return fn;
    }

    function doOverride() {
        if (typeof window.showNewProjectModal === 'function' && !window.showNewProjectModal[MARKER]) {
            window.showNewProjectModal = makeOverrideFn();
            console.log('✅ [OdooSearch] Override showNewProjectModal');
        }
        if (typeof window.openPMProjectModal === 'function' && !window.openPMProjectModal[MARKER]) {
            window.openPMProjectModal = makeOverrideFn();
            console.log('✅ [OdooSearch] Override openPMProjectModal');
        }
    }

    function closeMenusSafe() {
        if (typeof window.closeMainMenuNoRender === 'function') window.closeMainMenuNoRender();
        try { if (typeof state !== 'undefined') { state.mainMenuOpen = false; state.projectMenuOpen = false; } } catch(e) {}
        if (typeof window.closeSidebar === 'function') window.closeSidebar();
    }

    // Polling
    var pollCount = 0;
    var fastPoll = setInterval(function() {
        pollCount++;
        doOverride();
        if (!document.getElementById(BUTTON_ID)) injectButton();
        if (pollCount >= 60) {
            clearInterval(fastPoll);
            setInterval(function() {
                doOverride();
                if (!document.getElementById(BUTTON_ID)) injectButton();
            }, 3000);
        }
    }, 500);

    // ========================================================================
    // VARIABILE GLOBALE per risultati ricerca
    // ========================================================================

    window._odooSearchCache = [];

    // ========================================================================
    // FUNZIONE GLOBALE: selezione risultato
    // Chiamata da onclick="window._odooSelectResult(index)"
    // ========================================================================

    window._odooSelectResult = function(index) {
        try {
            console.log('🎯 [OdooSearch] Click su risultato index=' + index);

            var c = window._odooSearchCache[index];
            if (!c) {
                alert('Errore: cliente non trovato in cache (index=' + index + ')');
                return;
            }

            var customerName = c.name || 'Cliente Odoo';
            var odooId = c.id;

            console.log('🎯 [OdooSearch] Creo progetto per: ' + customerName + ' (Odoo ID: ' + odooId + ')');

            // Chiudi dialog
            var dialog = document.getElementById(DIALOG_ID);
            if (dialog) dialog.remove();

            // Salva dati Odoo
            window._pendingOdooId = odooId;
            window._pendingOdooCustomer = {
                id: odooId,
                name: c.name || '',
                phone: c.phone || '',
                email: c.email || '',
                street: c.street || '',
                city: c.city || '',
                zip: c.zip || c.zip_code || ''
            };

            // === APP RILIEVO / POSA ===
            if (typeof window.createProject === 'function') {
                console.log('📝 [OdooSearch] Chiamo createProject...');
                window.createProject(customerName, customerName);

                // Associa odoo_id al progetto appena creato
                if (typeof state !== 'undefined' && state.projects && state.projects.length > 0) {
                    var lastProject = state.projects[state.projects.length - 1];
                    if (lastProject) {
                        lastProject.odoo_id = odooId;
                        lastProject.odoo_customer = window._pendingOdooCustomer;
                        // Compila dati cliente
                        if (lastProject.clientData) {
                            lastProject.clientData.nome = c.name || '';
                            lastProject.clientData.telefono = c.phone || '';
                            lastProject.clientData.email = c.email || '';
                            lastProject.clientData.indirizzo = [c.street, c.zip || c.zip_code, c.city].filter(Boolean).join(', ');
                        }
                    }
                }

                // Naviga al progetto - scheda Dati Cliente (step 1)
                state.screen = 'project';
                state.setupStep = 1;
                render();

                showToast('✅ Cliente "' + customerName + '" collegato da Odoo');
                console.log('✅ [OdooSearch] Progetto creato e aperto!');
                return;
            }

            // === DASHBOARD ===
            if (typeof window.createPMProject === 'function') {
                console.log('📝 [OdooSearch] Dashboard - chiamo createPMProject...');
                var nf = document.getElementById('pm-project-name') || document.getElementById('project-name');
                var cf = document.getElementById('pm-project-client') || document.getElementById('client-name');
                if (nf) nf.value = customerName;
                if (cf) cf.value = customerName;
                window.createPMProject();
                showToast('✅ Cliente "' + customerName + '" collegato da Odoo');
                return;
            }

            // === FALLBACK ===
            alert('Errore: funzione createProject non trovata.\nVerifica che app.js sia caricato.');

        } catch(err) {
            console.error('❌ [OdooSearch] Errore in _odooSelectResult:', err);
            alert('Errore creazione progetto:\n' + err.message);
        }
    };

    // ========================================================================
    // DIALOG
    // ========================================================================

    function showNewProjectDialog() {
        var old = document.getElementById(DIALOG_ID);
        if (old) old.remove();

        var overlay = document.createElement('div');
        overlay.id = DIALOG_ID;
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:60px;';

        overlay.innerHTML = '<div style="background:white;border-radius:16px;width:94%;max-width:520px;box-shadow:0 25px 50px rgba(0,0,0,0.25);overflow:hidden;font-family:system-ui,-apple-system,sans-serif;max-height:85vh;overflow-y:auto;">'
            + '<div style="background:linear-gradient(135deg,#714B67 0%,#9B6B8E 100%);color:white;padding:18px 20px;">'
            + '<h2 style="margin:0;font-size:1.2rem;">➕ Nuovo Progetto</h2>'
            + '<p style="margin:6px 0 0;opacity:0.9;font-size:0.85rem;">Cerca cliente da Odoo oppure inserisci manualmente</p>'
            + '</div>'
            + '<div style="display:flex;border-bottom:2px solid #e5e7eb;">'
            + '<button id="odoo-np-tab-search" style="flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;">🔍 Cerca in Odoo</button>'
            + '<button id="odoo-np-tab-manual" style="flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;">✏️ Manuale</button>'
            + '</div>'
            + '<div id="odoo-np-search-panel" style="padding:16px;">'
            + '<div style="display:flex;gap:8px;">'
            + '<input id="odoo-np-search-input" type="text" placeholder="Cerca nome, telefono, email..." style="flex:1;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;-webkit-appearance:none;" />'
            + '<button id="odoo-np-search-go" style="padding:12px 18px;background:#714B67;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:15px;">Cerca</button>'
            + '</div>'
            + '<div id="odoo-np-search-results" style="margin-top:12px;max-height:300px;overflow-y:auto;">'
            + '<p style="color:#9ca3af;text-align:center;padding:20px;font-size:14px;">Digita almeno 2 caratteri e premi Cerca</p>'
            + '</div></div>'
            + '<div id="odoo-np-manual-panel" style="padding:16px;display:none;">'
            + '<div style="margin-bottom:12px;">'
            + '<label style="display:block;font-weight:600;font-size:13px;color:#374151;margin-bottom:4px;">Nome Cliente *</label>'
            + '<input id="odoo-np-client-name" type="text" placeholder="Es: Rossi Mario" style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;box-sizing:border-box;" />'
            + '</div>'
            + '<div style="margin-bottom:16px;">'
            + '<label style="display:block;font-weight:600;font-size:13px;color:#374151;margin-bottom:4px;">Nome Progetto <span style="color:#9ca3af;font-weight:400;">(opzionale)</span></label>'
            + '<input id="odoo-np-project-name" type="text" placeholder="Lascia vuoto per usare nome cliente" style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none;box-sizing:border-box;" />'
            + '</div>'
            + '<button id="odoo-np-create-manual" style="width:100%;padding:14px;background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">➕ Crea Progetto</button>'
            + '</div>'
            + '<div style="padding:12px 16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">'
            + '<span style="font-size:11px;color:#d1d5db;">v' + VERSION + '</span>'
            + '<button id="odoo-np-close" style="padding:10px 24px;background:#f3f4f6;color:#374151;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:14px;">Chiudi</button>'
            + '</div></div>';

        document.body.appendChild(overlay);
        setTimeout(function() { var i = document.getElementById('odoo-np-search-input'); if(i) i.focus(); }, 150);

        // TAB SWITCH
        var ACTIVE = 'flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;';
        var INACTIVE = 'flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;';

        function switchTab(tab) {
            var sp = document.getElementById('odoo-np-search-panel');
            var mp = document.getElementById('odoo-np-manual-panel');
            var st = document.getElementById('odoo-np-tab-search');
            var mt = document.getElementById('odoo-np-tab-manual');
            if (!sp) return;
            if (tab === 'search') {
                sp.style.display = 'block'; mp.style.display = 'none';
                st.style.cssText = ACTIVE; mt.style.cssText = INACTIVE;
                setTimeout(function(){ var i=document.getElementById('odoo-np-search-input'); if(i) i.focus(); }, 100);
            } else {
                sp.style.display = 'none'; mp.style.display = 'block';
                mt.style.cssText = ACTIVE; st.style.cssText = INACTIVE;
                setTimeout(function(){ var i=document.getElementById('odoo-np-client-name'); if(i) i.focus(); }, 100);
            }
        }
        window._odooNpSwitchTab = switchTab;

        // ====================================================================
        // SEARCH
        // ====================================================================
        function doSearch() {
            var input = document.getElementById('odoo-np-search-input');
            var resultsDiv = document.getElementById('odoo-np-search-results');
            var query = input.value.trim();
            if (query.length < 2) {
                resultsDiv.innerHTML = '<p style="color:#ef4444;text-align:center;padding:12px;">Digita almeno 2 caratteri</p>';
                return;
            }
            resultsDiv.innerHTML = '<p style="color:#6b7280;text-align:center;padding:20px;">⏳ Ricerca...</p>';

            fetch(getServerUrl() + '/api/customers?search=' + encodeURIComponent(query), {
                headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            }).then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            }).then(function(data) {
                var customers = data.customers || data.results || (Array.isArray(data) ? data : []);
                if (!customers || customers.length === 0) {
                    resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;">'
                        + '<p style="color:#9ca3af;">Nessun risultato per "' + query + '"</p>'
                        + '<button onclick="window._odooNpSwitchTab(\'manual\')" style="margin-top:10px;padding:8px 16px;background:#714B67;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">✏️ Inserisci manualmente</button>'
                        + '</div>';
                    return;
                }

                // Salva in cache globale per accesso da onclick
                window._odooSearchCache = customers.slice(0, 20);

                var html = '';
                for (var i = 0; i < window._odooSearchCache.length; i++) {
                    var c = window._odooSearchCache[i];
                    var details = [c.phone, c.email, c.city].filter(Boolean).join(' • ');
                    html += '<div onclick="window._odooSelectResult(' + i + ')" style="padding:14px 16px;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background=\'#f0f4ff\'" onmouseout="this.style.background=\'white\'">'
                        + '<div style="font-weight:600;color:#111827;font-size:15px;">' + (c.name || 'Senza nome') + '</div>'
                        + '<div style="font-size:13px;color:#6b7280;margin-top:3px;">' + (details || 'Nessun dettaglio') + '</div>'
                        + '</div>';
                }
                resultsDiv.innerHTML = html;

            }).catch(function(err) {
                console.error('❌ [OdooSearch]', err);
                resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;">'
                    + '<p style="color:#ef4444;font-weight:600;">❌ Server non raggiungibile</p>'
                    + '<p style="color:#9ca3af;font-size:13px;margin-top:8px;">Verifica AVVIA-OPERA.bat</p>'
                    + '<button onclick="window._odooNpSwitchTab(\'manual\')" style="margin-top:12px;padding:8px 16px;background:#714B67;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">✏️ Inserisci manualmente</button>'
                    + '</div>';
            });
        }

        // ====================================================================
        // MANUAL CREATE
        // ====================================================================
        function doCreateManual() {
            var clientInput = document.getElementById('odoo-np-client-name');
            var projectInput = document.getElementById('odoo-np-project-name');
            var clientName = clientInput.value.trim();
            if (!clientName) { clientInput.style.borderColor = '#ef4444'; clientInput.focus(); return; }
            var projectName = projectInput.value.trim() || clientName;
            overlay.remove();

            try {
                if (typeof window.createProject === 'function') {
                    window.createProject(projectName, clientName);
                    state.screen = 'project';
                    state.setupStep = 1;
                    render();
                    showToast('✅ Progetto "' + projectName + '" creato');
                    return;
                }
                if (typeof window.createPMProject === 'function') {
                    var nf = document.getElementById('pm-project-name') || document.getElementById('project-name');
                    var cf = document.getElementById('pm-project-client') || document.getElementById('client-name');
                    if (nf) nf.value = projectName;
                    if (cf) cf.value = clientName;
                    window.createPMProject();
                    showToast('✅ Progetto "' + projectName + '" creato');
                    return;
                }
                alert('Errore: funzione creazione progetto non trovata');
            } catch(err) {
                console.error('❌ [OdooSearch] Errore creazione manuale:', err);
                alert('Errore: ' + err.message);
            }
        }

        // EVENTS
        document.getElementById('odoo-np-tab-search').addEventListener('click', function() { switchTab('search'); });
        document.getElementById('odoo-np-tab-manual').addEventListener('click', function() { switchTab('manual'); });
        document.getElementById('odoo-np-search-go').addEventListener('click', doSearch);
        document.getElementById('odoo-np-search-input').addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(); });
        document.getElementById('odoo-np-create-manual').addEventListener('click', doCreateManual);
        document.getElementById('odoo-np-client-name').addEventListener('keydown', function(e) { if (e.key === 'Enter') doCreateManual(); });
        document.getElementById('odoo-np-close').addEventListener('click', function() { overlay.remove(); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    }

    // ========================================================================
    // TOAST
    // ========================================================================

    function showToast(message) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#065f46;color:white;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:600;z-index:999999;box-shadow:0 8px 25px rgba(0,0,0,0.3);';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 3000);
    }

    // ========================================================================
    // BOTTONE SIDEBAR
    // ========================================================================

    function injectButton() {
        if (document.getElementById(BUTTON_ID)) return false;
        var sub = document.getElementById('main-submenu-progetti');
        if (sub) {
            var item = document.createElement('div');
            item.id = BUTTON_ID;
            item.className = 'main-submenu-item';
            item.style.cssText = 'background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;margin:4px 8px;font-weight:600;cursor:pointer;';
            item.innerHTML = '<span>🔍 Cerca in Odoo</span>';
            item.onclick = function(e) {
                e.preventDefault(); e.stopPropagation();
                if (typeof window.closeMainMenuNoRender === 'function') window.closeMainMenuNoRender();
                setTimeout(showNewProjectDialog, 100);
            };
            sub.appendChild(item);
            return true;
        }
        var sc = document.querySelector('.sidebar-content');
        if (sc) {
            var after = null;
            var items = sc.querySelectorAll('.sidebar-item, div[class*="sidebar"]');
            for (var i = 0; i < items.length; i++) {
                if ((items[i].textContent || '').toLowerCase().indexOf('nuovo progetto') >= 0) { after = items[i]; break; }
            }
            if (!after && sc.children.length > 0) after = sc.children[0];
            if (after) {
                var btn = document.createElement('div');
                btn.id = BUTTON_ID;
                btn.className = 'sidebar-item';
                btn.style.cssText = 'cursor:pointer;background:linear-gradient(135deg,#714B67,#9B6B8E);border-radius:8px;margin:4px 0;';
                btn.innerHTML = '<div class="sidebar-item-header" style="color:white;font-weight:600;padding:10px 16px;">🔍 Cerca in Odoo</div>';
                btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); showNewProjectDialog(); };
                after.parentNode.insertBefore(btn, after.nextSibling);
                return true;
            }
        }
        var pmBtn = document.querySelector('.pm-sidebar-new-btn, [onclick*="openPMProjectModal"]');
        if (pmBtn) {
            var a = document.createElement('a');
            a.id = BUTTON_ID;
            a.href = '#';
            a.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 16px;margin:4px 12px;background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;cursor:pointer;';
            a.innerHTML = '🔍 Cerca in Odoo';
            a.onclick = function(e) { e.preventDefault(); e.stopPropagation(); showNewProjectDialog(); };
            pmBtn.parentNode.insertBefore(a, pmBtn.nextSibling);
            return true;
        }
        return false;
    }

    // EXPORTS
    window.ODOO_SEARCH_BUTTON = { VERSION: VERSION, showDialog: showNewProjectDialog, forceOverride: doOverride };

})();
