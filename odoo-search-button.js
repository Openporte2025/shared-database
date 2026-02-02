// ============================================================================
// ODOO-SEARCH-BUTTON.js v3.0.0
// 
// DUE funzionalità:
//   1. SOVRASCRIVE showNewProjectModal() → dialog moderno con ricerca Odoo
//   2. Aggiunge bottone "Cerca in Odoo" nel menu sidebar
//
// Funziona su: Dashboard Ufficio, App Rilievo iPad, App Posa
// ============================================================================

(function() {
    'use strict';
    
    const VERSION = '3.0.0';
    const BUTTON_ID = 'odoo-search-sidebar-btn';
    
    function getServerUrl() {
        if (window.ODOO_INTEGRATION && window.ODOO_INTEGRATION._serverUrl) {
            return window.ODOO_INTEGRATION._serverUrl;
        }
        return 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    }

    // ========================================================================
    // 1. OVERRIDE showNewProjectModal → Dialog moderno + Odoo
    // ========================================================================

    function overrideNewProjectModal() {
        window.showNewProjectModal = function() {
            // Chiudi menu senza render (preserva DOM)
            if (typeof closeMainMenuNoRender === 'function') {
                closeMainMenuNoRender();
            } else {
                try { state.mainMenuOpen = false; state.projectMenuOpen = false; } catch(e) {}
            }
            showNewProjectDialog();
        };
        console.log('✅ [OdooSearch v' + VERSION + '] showNewProjectModal sovrascritta');
    }

    function showNewProjectDialog() {
        const old = document.getElementById('odoo-newproject-dialog');
        if (old) old.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'odoo-newproject-dialog';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 99999;
            display: flex; align-items: flex-start; justify-content: center;
            padding-top: 60px;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: white; border-radius: 16px; width: 94%; max-width: 520px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
                max-height: 85vh; overflow-y: auto;
            ">
                <div style="
                    background: linear-gradient(135deg, #714B67 0%, #9B6B8E 100%);
                    color: white; padding: 18px 20px;
                ">
                    <h2 style="margin: 0; font-size: 1.2rem;">➕ Nuovo Progetto</h2>
                    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.85rem;">
                        Cerca cliente da Odoo oppure inserisci manualmente
                    </p>
                </div>
                
                <div style="display: flex; border-bottom: 2px solid #e5e7eb;">
                    <button id="odoo-np-tab-search" onclick="window._odooNpSwitchTab('search')" style="
                        flex: 1; padding: 12px; border: none; background: #f0e6f0;
                        font-weight: 600; font-size: 14px; cursor: pointer;
                        color: #714B67; border-bottom: 3px solid #714B67;
                    ">🔍 Cerca in Odoo</button>
                    <button id="odoo-np-tab-manual" onclick="window._odooNpSwitchTab('manual')" style="
                        flex: 1; padding: 12px; border: none; background: white;
                        font-weight: 500; font-size: 14px; cursor: pointer;
                        color: #6b7280; border-bottom: 3px solid transparent;
                    ">✏️ Manuale</button>
                </div>
                
                <div id="odoo-np-search-panel" style="padding: 16px;">
                    <div style="display: flex; gap: 8px;">
                        <input id="odoo-np-search-input" type="text" placeholder="Cerca nome, telefono, email..." 
                            style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                            font-size: 16px; outline: none; -webkit-appearance: none;" />
                        <button id="odoo-np-search-go" style="
                            padding: 12px 18px; background: #714B67; color: white;
                            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                        ">Cerca</button>
                    </div>
                    <div id="odoo-np-search-results" style="margin-top: 12px; max-height: 300px; overflow-y: auto;">
                        <p style="color: #9ca3af; text-align: center; padding: 20px; font-size: 14px;">
                            Digita almeno 2 caratteri e premi Cerca
                        </p>
                    </div>
                </div>
                
                <div id="odoo-np-manual-panel" style="padding: 16px; display: none;">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-weight: 600; font-size: 13px; color: #374151; margin-bottom: 4px;">
                            Nome Cliente *
                        </label>
                        <input id="odoo-np-client-name" type="text" placeholder="Es: Rossi Mario"
                            style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                            font-size: 16px; outline: none; box-sizing: border-box;" />
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; font-size: 13px; color: #374151; margin-bottom: 4px;">
                            Nome Progetto <span style="color: #9ca3af; font-weight: 400;">(opzionale)</span>
                        </label>
                        <input id="odoo-np-project-name" type="text" placeholder="Lascia vuoto per usare nome cliente"
                            style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                            font-size: 16px; outline: none; box-sizing: border-box;" />
                    </div>
                    <button id="odoo-np-create-manual" style="
                        width: 100%; padding: 14px; background: linear-gradient(135deg, #714B67, #9B6B8E);
                        color: white; border: none; border-radius: 10px; font-size: 16px;
                        font-weight: 600; cursor: pointer;
                    ">➕ Crea Progetto</button>
                </div>
                
                <div style="padding: 12px 16px; border-top: 1px solid #e5e7eb; text-align: right;">
                    <button id="odoo-np-close" style="
                        padding: 10px 24px; background: #f3f4f6; color: #374151;
                        border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 14px;
                    ">Chiudi</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => document.getElementById('odoo-np-search-input')?.focus(), 150);
        
        document.getElementById('odoo-np-search-go').addEventListener('click', doNpSearch);
        document.getElementById('odoo-np-search-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doNpSearch();
        });
        document.getElementById('odoo-np-create-manual').addEventListener('click', doNpCreateManual);
        document.getElementById('odoo-np-client-name').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doNpCreateManual();
        });
        document.getElementById('odoo-np-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // Tab switching
    window._odooNpSwitchTab = function(tab) {
        const searchPanel = document.getElementById('odoo-np-search-panel');
        const manualPanel = document.getElementById('odoo-np-manual-panel');
        const searchTab = document.getElementById('odoo-np-tab-search');
        const manualTab = document.getElementById('odoo-np-tab-manual');
        if (!searchPanel) return;
        
        if (tab === 'search') {
            searchPanel.style.display = 'block';
            manualPanel.style.display = 'none';
            searchTab.style.cssText = 'flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;';
            manualTab.style.cssText = 'flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;';
            setTimeout(() => document.getElementById('odoo-np-search-input')?.focus(), 100);
        } else {
            searchPanel.style.display = 'none';
            manualPanel.style.display = 'block';
            manualTab.style.cssText = 'flex:1;padding:12px;border:none;background:#f0e6f0;font-weight:600;font-size:14px;cursor:pointer;color:#714B67;border-bottom:3px solid #714B67;';
            searchTab.style.cssText = 'flex:1;padding:12px;border:none;background:white;font-weight:500;font-size:14px;cursor:pointer;color:#6b7280;border-bottom:3px solid transparent;';
            setTimeout(() => document.getElementById('odoo-np-client-name')?.focus(), 100);
        }
    };

    // ========================================================================
    // SEARCH Odoo
    // ========================================================================

    async function doNpSearch() {
        const input = document.getElementById('odoo-np-search-input');
        const resultsDiv = document.getElementById('odoo-np-search-results');
        const query = input.value.trim();
        
        if (query.length < 2) {
            resultsDiv.innerHTML = '<p style="color:#ef4444;text-align:center;padding:12px;">Digita almeno 2 caratteri</p>';
            return;
        }
        
        resultsDiv.innerHTML = '<p style="color:#6b7280;text-align:center;padding:20px;">⏳ Ricerca...</p>';
        
        try {
            const response = await fetch(`${getServerUrl()}/api/customers?search=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            const customers = data.customers || data.results || (Array.isArray(data) ? data : []);
            
            if (!customers || customers.length === 0) {
                resultsDiv.innerHTML = `
                    <div style="text-align:center;padding:20px;">
                        <p style="color:#9ca3af;">Nessun risultato per "${query}"</p>
                        <button onclick="window._odooNpSwitchTab('manual')" style="
                            margin-top:10px;padding:8px 16px;background:#714B67;color:white;
                            border:none;border-radius:6px;cursor:pointer;font-size:13px;
                        ">✏️ Inserisci manualmente</button>
                    </div>`;
                return;
            }
            
            resultsDiv.innerHTML = customers.slice(0, 20).map(c => `
                <div class="odoo-np-result" data-id="${c.id}" 
                     data-name="${(c.name||'').replace(/"/g,'&quot;')}"
                     style="padding:14px 16px;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.15s;"
                     onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='white'">
                    <div style="font-weight:600;color:#111827;font-size:15px;">${c.name||'Senza nome'}</div>
                    <div style="font-size:13px;color:#6b7280;margin-top:3px;">
                        ${[c.phone, c.email, c.city].filter(Boolean).join(' • ')||'Nessun dettaglio'}
                    </div>
                </div>
            `).join('');
            
            resultsDiv.querySelectorAll('.odoo-np-result').forEach(item => {
                item.addEventListener('click', () => {
                    const dialog = document.getElementById('odoo-newproject-dialog');
                    if (dialog) dialog.remove();
                    window.location.href = window.location.pathname + '?odoo_id=' + item.dataset.id;
                });
            });
            
        } catch (error) {
            console.error('❌ [OdooSearch]', error);
            resultsDiv.innerHTML = `
                <div style="text-align:center;padding:20px;">
                    <p style="color:#ef4444;font-weight:600;">❌ Server non raggiungibile</p>
                    <p style="color:#9ca3af;font-size:13px;margin-top:8px;">Verifica AVVIA-OPERA.bat</p>
                    <button onclick="window._odooNpSwitchTab('manual')" style="
                        margin-top:12px;padding:8px 16px;background:#714B67;color:white;
                        border:none;border-radius:6px;cursor:pointer;font-size:13px;
                    ">✏️ Inserisci manualmente</button>
                </div>`;
        }
    }

    // ========================================================================
    // MANUAL CREATE
    // ========================================================================

    function doNpCreateManual() {
        const clientInput = document.getElementById('odoo-np-client-name');
        const projectInput = document.getElementById('odoo-np-project-name');
        const clientName = clientInput.value.trim();
        
        if (!clientName) {
            clientInput.style.borderColor = '#ef4444';
            clientInput.focus();
            return;
        }
        
        const projectName = projectInput.value.trim() || clientName;
        
        const dialog = document.getElementById('odoo-newproject-dialog');
        if (dialog) dialog.remove();
        
        if (typeof createProject === 'function') {
            createProject(projectName, clientName);
            if (typeof state !== 'undefined') state.screen = 'project';
            if (typeof render === 'function') render();
        } else {
            alert('Errore: createProject() non trovata');
        }
    }

    // ========================================================================
    // 2. BOTTONE SIDEBAR "Cerca in Odoo"
    // ========================================================================

    function injectButton() {
        if (document.getElementById(BUTTON_ID)) return false;
        
        // APP RILIEVO
        const progettiSubmenu = document.getElementById('main-submenu-progetti');
        if (progettiSubmenu) {
            const item = document.createElement('div');
            item.id = BUTTON_ID;
            item.className = 'main-submenu-item';
            item.style.cssText = 'background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;margin:4px 8px;font-weight:600;';
            item.innerHTML = '<span>🔍 Cerca in Odoo</span>';
            item.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (typeof closeMainMenuNoRender === 'function') closeMainMenuNoRender();
                setTimeout(showNewProjectDialog, 100);
            };
            progettiSubmenu.appendChild(item);
            return true;
        }
        
        // DASHBOARD UFFICIO
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent) {
            let insertAfter = null;
            for (const item of sidebarContent.querySelectorAll('.sidebar-item, div[class*="sidebar"]')) {
                if ((item.textContent||'').toLowerCase().includes('nuovo progetto')) { insertAfter = item; break; }
            }
            if (!insertAfter && sidebarContent.children.length > 0) insertAfter = sidebarContent.children[0];
            if (insertAfter) {
                const btn = document.createElement('div');
                btn.id = BUTTON_ID;
                btn.className = 'sidebar-item';
                btn.style.cssText = 'cursor:pointer;background:linear-gradient(135deg,#714B67,#9B6B8E);border-radius:8px;margin:4px 0;';
                btn.innerHTML = '<div class="sidebar-item-header" style="color:white;font-weight:600;"><span>🔍</span> Cerca in Odoo</div>';
                btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showNewProjectDialog(); };
                insertAfter.parentNode.insertBefore(btn, insertAfter.nextSibling);
                return true;
            }
        }
        
        // PM-SIDEBAR
        const pmNewBtn = document.querySelector('.pm-sidebar-new-btn, [onclick*="openPMProjectModal"]');
        if (pmNewBtn) {
            const btn = document.createElement('a');
            btn.id = BUTTON_ID; btn.href = '#'; btn.className = 'pm-sidebar-new-btn';
            btn.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 16px;margin:4px 12px;background:linear-gradient(135deg,#714B67,#9B6B8E);color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;';
            btn.innerHTML = '🔍 Cerca in Odoo';
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showNewProjectDialog(); };
            pmNewBtn.parentNode.insertBefore(btn, pmNewBtn.nextSibling);
            return true;
        }
        
        return false;
    }

    // ========================================================================
    // MUTATION OBSERVER
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
        VERSION,
        showSearchDialog: showNewProjectDialog,
        injectButton: injectButton
    };
    
    function init() {
        overrideNewProjectModal();
        injectButton();
        startObserver();
        console.log('🔍 [OdooSearch v' + VERSION + '] Inizializzato');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 2000));
    } else {
        setTimeout(init, 2000);
    }

})();
