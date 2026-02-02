// ============================================================================
// ODOO-SEARCH-BUTTON.js v2.0.0
// Bottone "Cerca in Odoo" per sidebar - CENTRALIZZATO per tutte le app
// 
// Funziona su:
//   - Dashboard Ufficio (sidebar statica con .sidebar-item)
//   - App Rilievo iPad  (sidebar dinamica con .main-nav-item, render() la ricrea)
//   - App Posa          (da testare)
//
// STRATEGIA: MutationObserver rileva quando sidebar viene (ri)creata
// e inietta il bottone automaticamente. Sopravvive a render().
// ============================================================================

(function() {
    'use strict';
    
    const VERSION = '2.0.0';
    const BUTTON_ID = 'odoo-search-sidebar-btn';
    
    function getServerUrl() {
        if (window.ODOO_INTEGRATION && window.ODOO_INTEGRATION._serverUrl) {
            return window.ODOO_INTEGRATION._serverUrl;
        }
        return 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    }

    // ========================================================================
    // DETECT APP TYPE & INSERT BUTTON
    // ========================================================================
    
    function injectButton() {
        // Già presente? Skip
        if (document.getElementById(BUTTON_ID)) return false;
        
        // === APP RILIEVO: sidebar dinamica (.main-nav-section) ===
        const mainNavSection = document.querySelector('.main-nav-section');
        if (mainNavSection) {
            // Cerca il submenu "Progetti" per inserire dopo
            const progettiSubmenu = document.getElementById('main-submenu-progetti');
            
            if (progettiSubmenu) {
                // Aggiungi come ultimo item nel submenu Progetti
                const item = document.createElement('div');
                item.id = BUTTON_ID;
                item.className = 'main-submenu-item';
                item.style.cssText = `
                    background: linear-gradient(135deg, #714B67, #9B6B8E);
                    color: white; border-radius: 8px; margin: 4px 8px;
                    font-weight: 600;
                `;
                item.innerHTML = '<span>🔍 Cerca in Odoo</span>';
                item.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Chiudi menu senza render (preserva il dialog)
                    if (typeof closeMainMenuNoRender === 'function') {
                        closeMainMenuNoRender();
                    } else if (typeof closeMainMenu === 'function') {
                        closeMainMenu();
                    }
                    setTimeout(showOdooSearchDialog, 100);
                };
                progettiSubmenu.appendChild(item);
                console.log('✅ [OdooSearch v' + VERSION + '] Bottone aggiunto in App Rilievo');
                return true;
            }
            
            // Fallback: aggiungi come nav-item nella sezione
            const btn = document.createElement('div');
            btn.id = BUTTON_ID;
            btn.className = 'main-nav-item';
            btn.style.cssText = `
                background: linear-gradient(135deg, #714B67, #9B6B8E);
                border-radius: 8px; margin: 8px 0; cursor: pointer;
            `;
            btn.innerHTML = `
                <div class="main-nav-label" style="color: white;">
                    <span class="main-nav-icon">🔍</span>
                    <span>Cerca in Odoo</span>
                </div>
            `;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof closeMainMenuNoRender === 'function') closeMainMenuNoRender();
                setTimeout(showOdooSearchDialog, 100);
            };
            // Inserisci dopo il primo gruppo (Progetti)
            const firstSubmenu = mainNavSection.querySelector('.main-submenu');
            if (firstSubmenu) {
                firstSubmenu.parentNode.insertBefore(btn, firstSubmenu.nextSibling);
            } else {
                mainNavSection.prepend(btn);
            }
            console.log('✅ [OdooSearch v' + VERSION + '] Bottone aggiunto (fallback nav-item)');
            return true;
        }
        
        // === DASHBOARD UFFICIO: sidebar statica (.sidebar-content) ===
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent) {
            // Cerca "Nuovo Progetto" item
            let insertAfter = null;
            const items = sidebarContent.querySelectorAll('.sidebar-item, div[class*="sidebar"]');
            for (const item of items) {
                const text = (item.textContent || '').toLowerCase();
                if (text.includes('nuovo progetto') && !text.includes('odoo') && !text.includes('cerca')) {
                    insertAfter = item;
                    break;
                }
            }
            
            if (!insertAfter && sidebarContent.children.length > 0) {
                insertAfter = sidebarContent.children[0];
            }
            
            if (insertAfter) {
                const btn = document.createElement('div');
                btn.id = BUTTON_ID;
                btn.className = 'sidebar-item';
                btn.style.cssText = `
                    cursor: pointer;
                    background: linear-gradient(135deg, #714B67, #9B6B8E);
                    border-radius: 8px; margin: 4px 0;
                    transition: opacity 0.2s;
                `;
                btn.innerHTML = `
                    <div class="sidebar-item-header" style="color: white; font-weight: 600;">
                        <span>🔍</span> Cerca in Odoo
                    </div>
                `;
                btn.onmouseover = () => btn.style.opacity = '0.85';
                btn.onmouseout = () => btn.style.opacity = '1';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof closeSidebar === 'function') closeSidebar();
                    showOdooSearchDialog();
                };
                insertAfter.parentNode.insertBefore(btn, insertAfter.nextSibling);
                console.log('✅ [OdooSearch v' + VERSION + '] Bottone aggiunto in Dashboard Ufficio');
                return true;
            }
        }
        
        // === PM-SIDEBAR (project-manager.js) ===
        const pmNewBtn = document.querySelector('.pm-sidebar-new-btn, [onclick*="openPMProjectModal"]');
        if (pmNewBtn) {
            const btn = document.createElement('a');
            btn.id = BUTTON_ID;
            btn.href = '#';
            btn.className = 'pm-sidebar-new-btn';
            btn.style.cssText = `
                display: flex; align-items: center; gap: 8px;
                padding: 10px 16px; margin: 4px 12px;
                background: linear-gradient(135deg, #714B67, #9B6B8E);
                color: white; border-radius: 8px; text-decoration: none;
                font-size: 14px; font-weight: 600;
                transition: opacity 0.2s;
            `;
            btn.innerHTML = '🔍 Cerca in Odoo';
            btn.onmouseover = () => btn.style.opacity = '0.85';
            btn.onmouseout = () => btn.style.opacity = '1';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof closeSidebar === 'function') closeSidebar();
                showOdooSearchDialog();
            };
            pmNewBtn.parentNode.insertBefore(btn, pmNewBtn.nextSibling);
            console.log('✅ [OdooSearch v' + VERSION + '] Bottone aggiunto in PM-Sidebar');
            return true;
        }
        
        return false; // Non trovata nessuna sidebar
    }

    // ========================================================================
    // MUTATION OBSERVER - Rileva quando sidebar viene (ri)creata
    // ========================================================================
    
    let observer = null;
    
    function startObserver() {
        if (observer) return;
        
        const target = document.getElementById('app') || document.body;
        
        observer = new MutationObserver((mutations) => {
            // Evita loop: se il bottone è stato appena aggiunto da noi, skip
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.id === BUTTON_ID) return;
                }
            }
            
            // Se non c'è il bottone, prova a iniettarlo
            if (!document.getElementById(BUTTON_ID)) {
                injectButton();
            }
        });
        
        observer.observe(target, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ [OdooSearch] MutationObserver attivo');
    }

    // ========================================================================
    // DIALOG RICERCA CLIENTI
    // ========================================================================
    
    function showOdooSearchDialog() {
        const old = document.getElementById('odoo-search-dialog');
        if (old) old.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'odoo-search-dialog';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 99999;
            display: flex; align-items: flex-start; justify-content: center;
            padding-top: 80px;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: white; border-radius: 16px; width: 92%; max-width: 500px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <div style="
                    background: linear-gradient(135deg, #714B67 0%, #9B6B8E 100%);
                    color: white; padding: 20px;
                ">
                    <h2 style="margin: 0; font-size: 1.25rem;">🔍 Cerca Cliente Odoo</h2>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 0.9rem;">
                        Cerca per nome, telefono o email
                    </p>
                </div>
                <div style="padding: 16px;">
                    <div style="display: flex; gap: 8px;">
                        <input id="odoo-search-input" type="text" placeholder="Es: Rossi, 333..." 
                            style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                            font-size: 16px; outline: none; -webkit-appearance: none;" />
                        <button id="odoo-search-go" style="
                            padding: 12px 20px; background: #714B67; color: white;
                            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                            font-size: 15px; white-space: nowrap;
                        ">Cerca</button>
                    </div>
                    <div id="odoo-search-results" style="margin-top: 12px; max-height: 350px; overflow-y: auto;">
                        <p style="color: #9ca3af; text-align: center; padding: 20px;">
                            Digita almeno 2 caratteri e premi Cerca
                        </p>
                    </div>
                </div>
                <div style="padding: 12px 16px; border-top: 1px solid #e5e7eb; text-align: right;">
                    <button id="odoo-search-close" style="
                        padding: 10px 24px; background: #f3f4f6; color: #374151;
                        border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer;
                        font-size: 14px;
                    ">Chiudi</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const input = document.getElementById('odoo-search-input');
        setTimeout(() => input.focus(), 150);
        
        document.getElementById('odoo-search-go').addEventListener('click', doOdooSearch);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doOdooSearch(); });
        document.getElementById('odoo-search-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    
    async function doOdooSearch() {
        const input = document.getElementById('odoo-search-input');
        const resultsDiv = document.getElementById('odoo-search-results');
        const query = input.value.trim();
        
        if (query.length < 2) {
            resultsDiv.innerHTML = '<p style="color:#ef4444; text-align:center; padding:12px;">Digita almeno 2 caratteri</p>';
            return;
        }
        
        resultsDiv.innerHTML = '<p style="color:#6b7280; text-align:center; padding:20px;">⏳ Ricerca in corso...</p>';
        
        try {
            const response = await fetch(`${getServerUrl()}/api/customers?search=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            const customers = data.customers || data.results || (Array.isArray(data) ? data : []);
            
            if (!customers || customers.length === 0) {
                resultsDiv.innerHTML = `<p style="color:#9ca3af; text-align:center; padding:20px;">Nessun risultato per "${query}"</p>`;
                return;
            }
            
            resultsDiv.innerHTML = customers.slice(0, 20).map(c => `
                <div class="odoo-search-result" data-id="${c.id}" data-name="${(c.name || '').replace(/"/g, '&quot;')}" style="
                    padding: 14px 16px; border-bottom: 1px solid #f3f4f6;
                    cursor: pointer; transition: background 0.15s;
                " onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='white'">
                    <div style="font-weight: 600; color: #111827; font-size: 15px;">${c.name || 'Senza nome'}</div>
                    <div style="font-size: 13px; color: #6b7280; margin-top: 3px;">
                        ${[c.phone, c.email, c.city].filter(Boolean).join(' • ') || 'Nessun dettaglio'}
                    </div>
                </div>
            `).join('');
            
            resultsDiv.querySelectorAll('.odoo-search-result').forEach(item => {
                item.addEventListener('click', () => onCustomerSelected(item.dataset.id, item.dataset.name));
            });
            
        } catch (error) {
            console.error('❌ [OdooSearch] Errore:', error);
            resultsDiv.innerHTML = `
                <div style="text-align:center; padding:20px;">
                    <p style="color:#ef4444; font-weight:600;">❌ Server non raggiungibile</p>
                    <p style="color:#9ca3af; font-size:13px; margin-top:8px;">
                        Verifica che O.P.E.R.A. sia avviato<br>(AVVIA-OPERA.bat)
                    </p>
                </div>
            `;
        }
    }

    // ========================================================================
    // CLIENTE SELEZIONATO → REDIRECT CON ?odoo_id=
    // ========================================================================
    
    function onCustomerSelected(customerId, customerName) {
        const dialog = document.getElementById('odoo-search-dialog');
        if (dialog) dialog.remove();
        
        // Redirect con parametro → odoo-integration.js gestisce il resto
        window.location.href = window.location.pathname + '?odoo_id=' + customerId;
    }

    // ========================================================================
    // EXPORT & INIT
    // ========================================================================
    
    window.ODOO_SEARCH_BUTTON = {
        VERSION,
        showSearchDialog: showOdooSearchDialog,
        injectButton: injectButton
    };
    
    function init() {
        // Prima injection
        injectButton();
        // Observer per re-injection dopo render()
        startObserver();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 2000));
    } else {
        setTimeout(init, 2000);
    }

})();
