// ============================================================================
// ODOO-SEARCH-BUTTON.js v1.0.0
// Componente UNIFICATO per ricerca progetti Odoo
// ============================================================================
// 
// Usato da: Dashboard Ufficio + App Rilievo iPad + App Posa
// 
// Funzionalità:
//   - Bottone "🔍 Cerca in Odoo" che si inserisce nella sidebar
//   - Popup con ricerca clienti + lista recenti
//   - Selezione progetto → carica con ODOO_CORE.loadAndDisplay()
//
// Dipendenze:
//   - ODOO_CORE (obbligatorio)
//
// ============================================================================

const ODOO_SEARCH = (function() {
    'use strict';

    const VERSION = '1.0.0';

    // =========================================================================
    // CONFIGURAZIONE
    // =========================================================================

    const CONFIG = {
        // Selettori sidebar per le varie app
        sidebarSelectors: [
            '#sidebar',
            '.sidebar',
            '#projectsSidebar',
            '.projects-sidebar',
            '[data-sidebar]',
            'aside',
            'nav.sidebar'
        ],
        
        // Posizione bottone: 'top' | 'bottom' | 'after-new'
        buttonPosition: 'top',
        
        // Delay prima di tentare inserimento (ms)
        insertDelay: 1500,
        
        // Limite risultati ricerca
        searchLimit: 15,
        
        // Mostra ultimi N progetti recenti
        recentLimit: 10
    };

    // =========================================================================
    // STATO
    // =========================================================================

    let _isInitialized = false;
    let _modalElement = null;
    let _searchTimeout = null;

    // =========================================================================
    // STILI (inline per non dipendere da CSS esterni)
    // =========================================================================

    const STYLES = `
        .odoo-search-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 12px 16px;
            margin: 8px 0;
            background: linear-gradient(135deg, #714B67 0%, #8B5A7C 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            font-family: system-ui, -apple-system, sans-serif;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(113, 75, 103, 0.3);
        }
        .odoo-search-btn:hover {
            background: linear-gradient(135deg, #8B5A7C 0%, #9B6A8C 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(113, 75, 103, 0.4);
        }
        .odoo-search-btn:active {
            transform: translateY(0);
        }
        .odoo-search-btn svg {
            width: 18px;
            height: 18px;
        }

        .odoo-search-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            backdrop-filter: blur(2px);
        }

        .odoo-search-modal {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            font-family: system-ui, -apple-system, sans-serif;
        }

        .odoo-search-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #714B67 0%, #8B5A7C 100%);
            border-radius: 12px 12px 0 0;
            color: white;
        }

        .odoo-search-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .odoo-search-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .odoo-search-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .odoo-search-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .odoo-search-input-wrap {
            position: relative;
            margin-bottom: 16px;
        }

        .odoo-search-input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 15px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }
        .odoo-search-input:focus {
            outline: none;
            border-color: #714B67;
        }

        .odoo-search-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
        }

        .odoo-search-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        .odoo-search-tab {
            flex: 1;
            padding: 10px;
            border: none;
            background: #f3f4f6;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            color: #6b7280;
            transition: all 0.2s;
        }
        .odoo-search-tab.active {
            background: #714B67;
            color: white;
        }
        .odoo-search-tab:hover:not(.active) {
            background: #e5e7eb;
        }

        .odoo-search-results {
            max-height: 350px;
            overflow-y: auto;
        }

        .odoo-search-section {
            margin-bottom: 20px;
        }

        .odoo-search-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .odoo-search-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s;
            border: 1px solid transparent;
        }
        .odoo-search-item:hover {
            background: #f9fafb;
            border-color: #e5e7eb;
        }

        .odoo-search-item-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        .odoo-search-item-icon.customer {
            background: #dbeafe;
        }
        .odoo-search-item-icon.project {
            background: #dcfce7;
        }

        .odoo-search-item-info {
            flex: 1;
            min-width: 0;
        }

        .odoo-search-item-name {
            font-weight: 500;
            color: #111827;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .odoo-search-item-detail {
            font-size: 13px;
            color: #6b7280;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .odoo-search-item-badge {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
            background: #f3f4f6;
            color: #6b7280;
            flex-shrink: 0;
        }
        .odoo-search-item-badge.odoo {
            background: #714B67;
            color: white;
        }
        .odoo-search-item-badge.github {
            background: #24292e;
            color: white;
        }

        .odoo-search-loading {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }

        .odoo-search-empty {
            text-align: center;
            padding: 40px;
            color: #9ca3af;
        }

        .odoo-search-back {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            margin-bottom: 16px;
            background: #f3f4f6;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            color: #6b7280;
            transition: background 0.2s;
        }
        .odoo-search-back:hover {
            background: #e5e7eb;
        }

        @media (max-width: 600px) {
            .odoo-search-modal {
                width: 95%;
                max-height: 90vh;
            }
        }
    `;

    // =========================================================================
    // UTILITY
    // =========================================================================

    function injectStyles() {
        if (document.getElementById('odoo-search-styles')) return;
        const style = document.createElement('style');
        style.id = 'odoo-search-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function debounce(fn, delay) {
        return function(...args) {
            clearTimeout(_searchTimeout);
            _searchTimeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // =========================================================================
    // TROVA SIDEBAR
    // =========================================================================

    function findSidebar() {
        for (const selector of CONFIG.sidebarSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                console.log('✅ Sidebar trovata:', selector);
                return el;
            }
        }
        console.warn('⚠️ Sidebar non trovata');
        return null;
    }

    // =========================================================================
    // CREA BOTTONE
    // =========================================================================

    function createButton() {
        const btn = document.createElement('button');
        btn.className = 'odoo-search-btn';
        btn.id = 'odoo-search-trigger';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Cerca in Odoo</span>
        `;
        btn.addEventListener('click', openModal);
        return btn;
    }

    // =========================================================================
    // INSERISCI BOTTONE
    // =========================================================================

    function insertButton() {
        // Evita duplicati
        if (document.getElementById('odoo-search-trigger')) {
            console.log('ℹ️ Bottone già presente');
            return true;
        }

        const sidebar = findSidebar();
        if (!sidebar) return false;

        const btn = createButton();

        // Trova posizione ottimale
        const newProjectBtn = sidebar.querySelector('#btn-new-project, [data-new-project], .btn-new-project');
        
        if (newProjectBtn && CONFIG.buttonPosition === 'after-new') {
            newProjectBtn.parentNode.insertBefore(btn, newProjectBtn.nextSibling);
        } else if (CONFIG.buttonPosition === 'top') {
            sidebar.insertBefore(btn, sidebar.firstChild);
        } else {
            sidebar.appendChild(btn);
        }

        console.log('✅ Bottone Cerca Odoo inserito');
        return true;
    }

    // =========================================================================
    // MODAL
    // =========================================================================

    function openModal() {
        if (_modalElement) {
            _modalElement.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'odoo-search-modal-overlay';
        overlay.innerHTML = `
            <div class="odoo-search-modal">
                <div class="odoo-search-header">
                    <h3>🔍 Cerca in Odoo</h3>
                    <button class="odoo-search-close">×</button>
                </div>
                <div class="odoo-search-body">
                    <div class="odoo-search-input-wrap">
                        <span class="odoo-search-input-icon">🔎</span>
                        <input type="text" class="odoo-search-input" 
                               placeholder="Nome cliente o progetto..." 
                               autofocus>
                    </div>
                    <div class="odoo-search-tabs">
                        <button class="odoo-search-tab active" data-tab="all">Tutti</button>
                        <button class="odoo-search-tab" data-tab="customers">Clienti</button>
                        <button class="odoo-search-tab" data-tab="projects">Progetti</button>
                    </div>
                    <div class="odoo-search-results">
                        <div class="odoo-search-loading">Caricamento recenti...</div>
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        overlay.querySelector('.odoo-search-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        const input = overlay.querySelector('.odoo-search-input');
        input.addEventListener('input', debounce((e) => {
            performSearch(e.target.value);
        }, 300));

        // Tab switch
        overlay.querySelectorAll('.odoo-search-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                overlay.querySelectorAll('.odoo-search-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                performSearch(input.value, tab.dataset.tab);
            });
        });

        // ESC per chiudere
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(overlay);
        _modalElement = overlay;

        // Focus input
        setTimeout(() => input.focus(), 100);

        // Carica recenti
        loadRecent();
    }

    function closeModal() {
        if (_modalElement) {
            _modalElement.remove();
            _modalElement = null;
        }
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') closeModal();
    }

    // =========================================================================
    // RICERCA
    // =========================================================================

    async function performSearch(query, filter = 'all') {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        if (!query || query.length < 2) {
            loadRecent();
            return;
        }

        resultsContainer.innerHTML = '<div class="odoo-search-loading">🔍 Ricerca...</div>';

        try {
            const results = { customers: [], projects: [] };

            // Cerca clienti
            if (filter === 'all' || filter === 'customers') {
                results.customers = await ODOO_CORE.clienti.search(query, CONFIG.searchLimit);
            }

            // Cerca progetti (se hai funzione)
            // Per ora cerca solo clienti, poi mostra progetti del cliente selezionato

            renderResults(results, query);
        } catch (error) {
            console.error('❌ Errore ricerca:', error);
            resultsContainer.innerHTML = `<div class="odoo-search-empty">❌ Errore: ${error.message}</div>`;
        }
    }

    async function loadRecent() {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        // Mostra cache progetti locale
        const cached = ODOO_CORE.cache.listProjects();
        
        if (cached.length > 0) {
            renderRecentProjects(cached.slice(0, CONFIG.recentLimit));
        } else {
            resultsContainer.innerHTML = `
                <div class="odoo-search-empty">
                    <p>Cerca un cliente per nome</p>
                    <p style="font-size: 12px; margin-top: 8px;">Es: "Rossi", "Mario", "Via Roma"</p>
                </div>
            `;
        }
    }

    // =========================================================================
    // RENDER RISULTATI
    // =========================================================================

    function renderResults(results, query) {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        if (results.customers.length === 0) {
            resultsContainer.innerHTML = `
                <div class="odoo-search-empty">
                    Nessun risultato per "${query}"
                </div>
            `;
            return;
        }

        let html = '<div class="odoo-search-section">';
        html += '<div class="odoo-search-section-title">👤 Clienti</div>';

        results.customers.forEach(customer => {
            const detail = [customer.phone, customer.city].filter(Boolean).join(' • ');
            html += `
                <div class="odoo-search-item" data-type="customer" data-id="${customer.id}">
                    <div class="odoo-search-item-icon customer">👤</div>
                    <div class="odoo-search-item-info">
                        <div class="odoo-search-item-name">${escapeHtml(customer.name)}</div>
                        <div class="odoo-search-item-detail">${escapeHtml(detail || 'Nessun dettaglio')}</div>
                    </div>
                    <span class="odoo-search-item-badge">→</span>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;

        // Click handler
        resultsContainer.querySelectorAll('.odoo-search-item[data-type="customer"]').forEach(item => {
            item.addEventListener('click', () => {
                const customerId = item.dataset.id;
                const customerName = item.querySelector('.odoo-search-item-name').textContent;
                showCustomerProjects(customerId, customerName);
            });
        });
    }

    function renderRecentProjects(cached) {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        let html = '<div class="odoo-search-section">';
        html += '<div class="odoo-search-section-title">🕐 Recenti (cache locale)</div>';

        cached.forEach(item => {
            const project = item.data;
            const name = project?.name || project?.id || 'Progetto';
            html += `
                <div class="odoo-search-item" data-type="cached-project" data-key="${item.key}">
                    <div class="odoo-search-item-icon project">📁</div>
                    <div class="odoo-search-item-info">
                        <div class="odoo-search-item-name">${escapeHtml(name)}</div>
                        <div class="odoo-search-item-detail">Cache ${item.pendingSync ? '⏳ da sincronizzare' : ''}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;

        // Click handler
        resultsContainer.querySelectorAll('.odoo-search-item[data-type="cached-project"]').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.dataset.key;
                loadCachedProject(key);
            });
        });
    }

    // =========================================================================
    // PROGETTI CLIENTE
    // =========================================================================

    async function showCustomerProjects(customerId, customerName) {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `<div class="odoo-search-loading">📂 Caricamento progetti ${customerName}...</div>`;

        try {
            // Cerca progetti su Odoo
            const odooProjects = await ODOO_CORE.progetti.findByCustomer(customerId);

            // Cerca anche su GitHub se disponibile
            let githubProjects = [];
            if (window.githubProjects) {
                githubProjects = window.githubProjects.filter(p =>
                    p.odoo_id == customerId ||
                    p.odoo_customer_id == customerId ||
                    p.rawData?.odoo_id == customerId
                );
            }

            renderCustomerProjects(customerId, customerName, odooProjects, githubProjects);
        } catch (error) {
            console.error('❌ Errore caricamento progetti:', error);
            resultsContainer.innerHTML = `<div class="odoo-search-empty">❌ Errore: ${error.message}</div>`;
        }
    }

    function renderCustomerProjects(customerId, customerName, odooProjects, githubProjects) {
        const resultsContainer = _modalElement?.querySelector('.odoo-search-results');
        if (!resultsContainer) return;

        let html = `
            <button class="odoo-search-back">← Torna ai risultati</button>
            <div class="odoo-search-section-title">📂 Progetti di ${escapeHtml(customerName)}</div>
        `;

        if (odooProjects.length === 0 && githubProjects.length === 0) {
            html += `
                <div class="odoo-search-empty">
                    Nessun progetto trovato per questo cliente
                </div>
            `;
        } else {
            // Progetti Odoo
            odooProjects.forEach(project => {
                const hasRilievo = project.hasRilievo ? '✓ Rilievo' : '';
                html += `
                    <div class="odoo-search-item" data-type="odoo-project" data-id="${project.id}">
                        <div class="odoo-search-item-icon project">📁</div>
                        <div class="odoo-search-item-info">
                            <div class="odoo-search-item-name">${escapeHtml(project.name)}</div>
                            <div class="odoo-search-item-detail">${hasRilievo}</div>
                        </div>
                        <span class="odoo-search-item-badge odoo">Odoo</span>
                    </div>
                `;
            });

            // Progetti GitHub (che non sono già su Odoo)
            githubProjects.forEach(project => {
                const alreadyInOdoo = odooProjects.some(op => op.name === project.id || op.name === project.name);
                if (!alreadyInOdoo) {
                    html += `
                        <div class="odoo-search-item" data-type="github-project" data-id="${project.id}">
                            <div class="odoo-search-item-icon project">📁</div>
                            <div class="odoo-search-item-info">
                                <div class="odoo-search-item-name">${escapeHtml(project.name || project.id)}</div>
                                <div class="odoo-search-item-detail">Solo locale</div>
                            </div>
                            <span class="odoo-search-item-badge github">GitHub</span>
                        </div>
                    `;
                }
            });
        }

        resultsContainer.innerHTML = html;

        // Back button
        resultsContainer.querySelector('.odoo-search-back')?.addEventListener('click', () => {
            const input = _modalElement?.querySelector('.odoo-search-input');
            performSearch(input?.value || '');
        });

        // Project click handlers
        resultsContainer.querySelectorAll('.odoo-search-item[data-type="odoo-project"]').forEach(item => {
            item.addEventListener('click', () => {
                const projectId = parseInt(item.dataset.id);
                loadOdooProject(projectId);
            });
        });

        resultsContainer.querySelectorAll('.odoo-search-item[data-type="github-project"]').forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.id;
                loadGitHubProjectAndClose(projectId);
            });
        });
    }

    // =========================================================================
    // CARICAMENTO PROGETTI
    // =========================================================================

    async function loadOdooProject(projectId) {
        closeModal();
        
        try {
            ODOO_CORE.showNotification('⏳ Caricamento progetto...', 'info');
            await ODOO_CORE.loadAndDisplay(projectId);
        } catch (error) {
            console.error('❌ Errore caricamento progetto:', error);
            ODOO_CORE.showNotification('❌ Errore: ' + error.message, 'error');
        }
    }

    function loadGitHubProjectAndClose(projectId) {
        closeModal();
        
        // Dashboard Ufficio
        if (typeof window.loadGitHubProject === 'function') {
            window.loadGitHubProject(projectId);
            return;
        }
        
        // App Rilievo
        if (typeof window.openProject === 'function') {
            window.openProject(projectId);
            return;
        }
        
        console.warn('⚠️ Nessuna funzione per caricare progetto GitHub');
    }

    function loadCachedProject(key) {
        closeModal();
        
        const cached = ODOO_CORE.cache.get('project_' + key);
        if (cached?.data) {
            // Carica da cache
            const projectId = cached.data.id;
            if (projectId) {
                loadOdooProject(projectId);
            }
        }
    }

    // =========================================================================
    // UTILITY
    // =========================================================================

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // INIT
    // =========================================================================

    function init() {
        if (_isInitialized) {
            console.log('ℹ️ ODOO_SEARCH già inizializzato');
            return;
        }

        // Verifica ODOO_CORE
        if (typeof ODOO_CORE === 'undefined') {
            console.error('❌ ODOO_CORE non trovato! Carica odoo-core.js prima di odoo-search-button.js');
            return;
        }

        injectStyles();

        // Tenta inserimento con retry
        const tryInsert = (attempts = 5) => {
            if (insertButton()) {
                _isInitialized = true;
                console.log(`✅ ODOO_SEARCH v${VERSION} inizializzato`);
            } else if (attempts > 0) {
                setTimeout(() => tryInsert(attempts - 1), 1000);
            } else {
                console.warn('⚠️ Impossibile inserire bottone dopo 5 tentativi');
            }
        };

        setTimeout(tryInsert, CONFIG.insertDelay);
    }

    // =========================================================================
    // EXPORT
    // =========================================================================

    return {
        VERSION,
        CONFIG,
        init,
        openModal,
        closeModal,
        insertButton
    };

})();

// =========================================================================
// AUTO-INIT
// =========================================================================

if (typeof window !== 'undefined') {
    window.ODOO_SEARCH = ODOO_SEARCH;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ODOO_SEARCH.init());
    } else {
        ODOO_SEARCH.init();
    }
    
    console.log('🔍 ODOO_SEARCH disponibile globalmente');
}
