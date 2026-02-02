// ============================================================================
// ODOO-SEARCH-BUTTON.js v1.0.0
// Bottone "Cerca in Odoo" per sidebar - CENTRALIZZATO per tutte le app
// 
// Funziona su: Dashboard Ufficio, App Rilievo, App Posa
// Dipendenze: odoo-integration.js (per fetchCustomer e findExistingProjects)
// 
// Cosa fa:
// 1. Trova la sidebar (statica o dinamica da project-manager.js)
// 2. Aggiunge bottone "🔍 Cerca in Odoo" 
// 3. Dialog ricerca clienti con risultati cliccabili
// 4. Click su cliente → cerca progetti → dialog selezione o form nuovo
// ============================================================================

(function() {
    'use strict';
    
    const VERSION = '1.0.0';
    const BUTTON_ID = 'odoo-search-sidebar-btn';
    const MAX_RETRIES = 20;
    const RETRY_INTERVAL = 1000;
    
    function getServerUrl() {
        if (window.ODOO_INTEGRATION && window.ODOO_INTEGRATION._serverUrl) {
            return window.ODOO_INTEGRATION._serverUrl;
        }
        return 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    }

    // ========================================================================
    // INSERIMENTO BOTTONE NELLA SIDEBAR
    // ========================================================================
    
    let retryCount = 0;
    
    function tryInsertButton() {
        if (document.getElementById(BUTTON_ID)) return;
        
        retryCount++;
        if (retryCount > MAX_RETRIES) {
            console.log('ℹ️ [OdooSearch] Sidebar non trovata dopo ' + MAX_RETRIES + ' tentativi');
            return;
        }
        
        // Strategia 1: Cerca item con testo "Nuovo Progetto" nella sidebar
        let insertAfter = null;
        const allItems = document.querySelectorAll('.sidebar-item, .pm-sidebar-item, [class*="sidebar"] a, [class*="sidebar"] div');
        
        for (const item of allItems) {
            const text = (item.textContent || '').trim().toLowerCase();
            if (text.includes('nuovo progetto') && !text.includes('cerca') && !text.includes('odoo')) {
                insertAfter = item;
                break;
            }
        }
        
        // Strategia 2: Bottone .pm-sidebar-new-btn (Dashboard Ufficio)
        if (!insertAfter) {
            insertAfter = document.querySelector('.pm-sidebar-new-btn, [onclick*="openPMProjectModal"]');
        }
        
        // Strategia 3: Primo item in sidebar-content
        if (!insertAfter) {
            const content = document.querySelector('.sidebar-content, .pm-sidebar-content');
            if (content && content.children.length > 1) {
                insertAfter = content.children[1];
            }
        }
        
        if (!insertAfter) {
            setTimeout(tryInsertButton, RETRY_INTERVAL);
            return;
        }
        
        // Crea il bottone
        const btn = document.createElement('div');
        btn.id = BUTTON_ID;
        btn.className = 'sidebar-item';
        btn.style.cssText = `
            cursor: pointer;
            background: linear-gradient(135deg, #714B67, #9B6B8E);
            border-radius: 8px;
            margin: 4px 0;
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
        console.log('✅ [OdooSearch] Bottone aggiunto alla sidebar v' + VERSION);
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
                background: white; border-radius: 16px; width: 90%; max-width: 500px;
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
    // CLIENTE SELEZIONATO → APRI CON odoo_id
    // ========================================================================
    
    function onCustomerSelected(customerId, customerName) {
        const dialog = document.getElementById('odoo-search-dialog');
        if (dialog) dialog.remove();
        
        // Metodo semplice e affidabile: ricarica pagina con ?odoo_id=
        // Questo attiva odoo-integration.js che gestisce tutto il flusso
        const currentUrl = window.location.pathname;
        window.location.href = currentUrl + '?odoo_id=' + customerId;
    }

    // ========================================================================
    // EXPORT & INIT
    // ========================================================================
    
    window.ODOO_SEARCH_BUTTON = {
        VERSION,
        showSearchDialog: showOdooSearchDialog,
        insertButton: tryInsertButton
    };
    
    function startInit() {
        tryInsertButton();
        const interval = setInterval(() => {
            if (document.getElementById(BUTTON_ID) || retryCount >= MAX_RETRIES) {
                clearInterval(interval);
                return;
            }
            tryInsertButton();
        }, RETRY_INTERVAL);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(startInit, 1500));
    } else {
        setTimeout(startInit, 1500);
    }

})();
