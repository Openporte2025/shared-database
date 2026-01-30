// ============================================================================
// ODOO-PROJECT-CREATOR.js v1.0.0
// Componente UNIFICATO per creazione progetti
// ============================================================================
// 
// Usato da: Dashboard Ufficio + App Rilievo iPad
// 
// Funzionalità:
//   - Form unico per creare progetti
//   - Autocomplete cliente da Odoo
//   - Precompila dati se cliente trovato
//   - Salvataggio: GitHub sempre, Odoo se collegato
//
// Dipendenze:
//   - ODOO_CORE (obbligatorio)
//
// ============================================================================

const ODOO_PROJECT_CREATOR = (function() {
    'use strict';

    const VERSION = '1.0.0';

    // =========================================================================
    // CONFIGURAZIONE
    // =========================================================================

    const CONFIG = {
        // Ritardo autocomplete (ms)
        autocompleteDelay: 300,
        
        // Minimo caratteri per cercare
        minSearchChars: 2,
        
        // Max risultati autocomplete
        maxResults: 10,
        
        // Prefisso ID progetto
        projectPrefix: new Date().getFullYear().toString(),
        
        // GitHub config (fallback)
        github: {
            repo: 'Openporte2025/dati-cantieri',
            branch: 'main'
        }
    };

    // =========================================================================
    // STATO
    // =========================================================================

    let _modalElement = null;
    let _searchTimeout = null;
    let _selectedCustomer = null;
    let _onCreateCallback = null;

    // =========================================================================
    // STILI
    // =========================================================================

    const STYLES = `
        .opc-modal-overlay {
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

        .opc-modal {
            background: white;
            border-radius: 16px;
            width: 95%;
            max-width: 500px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
        }

        .opc-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .opc-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .opc-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .opc-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .opc-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
        }

        .opc-field {
            margin-bottom: 20px;
        }

        .opc-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 6px;
        }

        .opc-label .required {
            color: #ef4444;
        }

        .opc-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 15px;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
        }
        .opc-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .opc-input-wrap {
            position: relative;
        }

        .opc-autocomplete {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 10px 10px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .opc-autocomplete-item {
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.15s;
        }
        .opc-autocomplete-item:hover {
            background: #f0fdf4;
        }
        .opc-autocomplete-item:last-child {
            border-bottom: none;
        }

        .opc-autocomplete-name {
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .opc-autocomplete-badge {
            font-size: 10px;
            padding: 2px 6px;
            background: #714B67;
            color: white;
            border-radius: 4px;
        }

        .opc-autocomplete-detail {
            font-size: 13px;
            color: #6b7280;
            margin-top: 2px;
        }

        .opc-autocomplete-new {
            background: #f0fdf4;
            border-top: 2px dashed #10b981;
        }
        .opc-autocomplete-new .opc-autocomplete-name {
            color: #059669;
        }

        .opc-selected-customer {
            background: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 12px 16px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .opc-selected-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .opc-selected-icon {
            width: 40px;
            height: 40px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .opc-selected-name {
            font-weight: 600;
            color: #065f46;
        }

        .opc-selected-detail {
            font-size: 13px;
            color: #6b7280;
        }

        .opc-selected-remove {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        .opc-selected-remove:hover {
            color: #ef4444;
        }

        .opc-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .opc-footer {
            padding: 16px 24px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .opc-btn {
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .opc-btn-cancel {
            background: white;
            border: 2px solid #e5e7eb;
            color: #6b7280;
        }
        .opc-btn-cancel:hover {
            background: #f3f4f6;
        }

        .opc-btn-create {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            color: white;
        }
        .opc-btn-create:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .opc-btn-create:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .opc-loading {
            text-align: center;
            padding: 12px;
            color: #6b7280;
        }

        .opc-hint {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
        }

        @media (max-width: 600px) {
            .opc-modal {
                width: 100%;
                height: 100%;
                max-height: 100%;
                border-radius: 0;
            }
            .opc-row {
                grid-template-columns: 1fr;
            }
        }
    `;

    // =========================================================================
    // UTILITY
    // =========================================================================

    function injectStyles() {
        if (document.getElementById('opc-styles')) return;
        const style = document.createElement('style');
        style.id = 'opc-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function debounce(fn, delay) {
        return function(...args) {
            clearTimeout(_searchTimeout);
            _searchTimeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function generateProjectId() {
        const year = new Date().getFullYear();
        const existing = getExistingProjectIds();
        let num = 1;
        
        while (existing.includes(`${year}P${String(num).padStart(3, '0')}`)) {
            num++;
        }
        
        return `${year}P${String(num).padStart(3, '0')}`;
    }

    function getExistingProjectIds() {
        // Cerca in window.githubProjects (Dashboard)
        if (window.githubProjects && Array.isArray(window.githubProjects)) {
            return window.githubProjects.map(p => p.id || p.name);
        }
        // Cerca in _appState.projects (App Rilievo)
        if (window._appState?.projects && Array.isArray(window._appState.projects)) {
            return window._appState.projects.map(p => p.id || p.name);
        }
        return [];
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // AUTOCOMPLETE
    // =========================================================================

    async function searchCustomers(query) {
        if (!query || query.length < CONFIG.minSearchChars) {
            return [];
        }

        try {
            const results = await ODOO_CORE.clienti.search(query, CONFIG.maxResults);
            return results || [];
        } catch (error) {
            console.error('❌ Errore ricerca clienti:', error);
            return [];
        }
    }

    function renderAutocomplete(customers, container, inputValue) {
        if (!container) return;

        let html = '';

        if (customers.length > 0) {
            customers.forEach((c, idx) => {
                const detail = [c.phone, c.city].filter(Boolean).join(' • ');
                html += `
                    <div class="opc-autocomplete-item" data-index="${idx}">
                        <div class="opc-autocomplete-name">
                            ${escapeHtml(c.name)}
                            <span class="opc-autocomplete-badge">Odoo</span>
                        </div>
                        <div class="opc-autocomplete-detail">${escapeHtml(detail || 'Nessun dettaglio')}</div>
                    </div>
                `;
            });
        }

        // Opzione "Nuovo cliente"
        html += `
            <div class="opc-autocomplete-item opc-autocomplete-new" data-new="true">
                <div class="opc-autocomplete-name">
                    ➕ Crea come nuovo cliente: "${escapeHtml(inputValue)}"
                </div>
                <div class="opc-autocomplete-detail">Non collegato a Odoo</div>
            </div>
        `;

        container.innerHTML = html;
        container.style.display = 'block';

        // Event listeners
        container.querySelectorAll('.opc-autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.dataset.new === 'true') {
                    selectNewCustomer(inputValue);
                } else {
                    const idx = parseInt(item.dataset.index);
                    selectOdooCustomer(customers[idx]);
                }
                container.style.display = 'none';
            });
        });
    }

    function selectOdooCustomer(customer) {
        _selectedCustomer = {
            id: customer.id,
            name: customer.name,
            phone: customer.phone || '',
            email: customer.email || '',
            street: customer.street || '',
            city: customer.city || '',
            zip: customer.zip || '',
            isOdoo: true
        };

        updateFormWithCustomer(_selectedCustomer);
        showSelectedCustomer(_selectedCustomer);
    }

    function selectNewCustomer(name) {
        _selectedCustomer = {
            id: null,
            name: name,
            phone: '',
            email: '',
            street: '',
            city: '',
            zip: '',
            isOdoo: false
        };

        updateFormWithCustomer(_selectedCustomer);
        hideSelectedCustomer();
    }

    function updateFormWithCustomer(customer) {
        const modal = _modalElement;
        if (!modal) return;

        // Nome cliente (già inserito)
        const nameInput = modal.querySelector('#opc-cliente-nome');
        if (nameInput) nameInput.value = customer.name;

        // Telefono
        const phoneInput = modal.querySelector('#opc-telefono');
        if (phoneInput) phoneInput.value = customer.phone;

        // Email
        const emailInput = modal.querySelector('#opc-email');
        if (emailInput) emailInput.value = customer.email;

        // Indirizzo
        const streetInput = modal.querySelector('#opc-indirizzo');
        if (streetInput) {
            const fullAddress = [customer.street, customer.zip, customer.city]
                .filter(Boolean).join(', ');
            streetInput.value = fullAddress;
        }
    }

    function showSelectedCustomer(customer) {
        const container = _modalElement?.querySelector('#opc-selected-customer');
        if (!container) return;

        container.innerHTML = `
            <div class="opc-selected-info">
                <div class="opc-selected-icon">👤</div>
                <div>
                    <div class="opc-selected-name">${escapeHtml(customer.name)}</div>
                    <div class="opc-selected-detail">✓ Collegato a Odoo #${customer.id}</div>
                </div>
            </div>
            <button class="opc-selected-remove" title="Rimuovi collegamento">×</button>
        `;
        container.style.display = 'flex';

        container.querySelector('.opc-selected-remove')?.addEventListener('click', () => {
            _selectedCustomer = { ...customer, id: null, isOdoo: false };
            hideSelectedCustomer();
        });
    }

    function hideSelectedCustomer() {
        const container = _modalElement?.querySelector('#opc-selected-customer');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    // =========================================================================
    // MODAL
    // =========================================================================

    function openModal(options = {}) {
        injectStyles();

        if (_modalElement) {
            _modalElement.remove();
        }

        _selectedCustomer = null;
        _onCreateCallback = options.onCreated || null;

        const projectId = generateProjectId();

        const overlay = document.createElement('div');
        overlay.className = 'opc-modal-overlay';
        overlay.innerHTML = `
            <div class="opc-modal">
                <div class="opc-header">
                    <h2>📁 Nuovo Progetto</h2>
                    <button class="opc-close">×</button>
                </div>
                <div class="opc-body">
                    <!-- ID Progetto -->
                    <div class="opc-field">
                        <label class="opc-label">ID Progetto</label>
                        <input type="text" class="opc-input" id="opc-project-id" value="${projectId}">
                        <div class="opc-hint">Generato automaticamente, puoi modificarlo</div>
                    </div>

                    <!-- Cliente (con autocomplete) -->
                    <div class="opc-field">
                        <label class="opc-label">Cliente <span class="required">*</span></label>
                        <div class="opc-input-wrap">
                            <input type="text" class="opc-input" id="opc-cliente-nome" 
                                   placeholder="Cerca cliente in Odoo..." autocomplete="off">
                            <div class="opc-autocomplete" id="opc-autocomplete" style="display:none;"></div>
                        </div>
                        <div class="opc-hint">Digita per cercare in Odoo o crea nuovo</div>
                        <div class="opc-selected-customer" id="opc-selected-customer" style="display:none;"></div>
                    </div>

                    <!-- Telefono + Email -->
                    <div class="opc-row">
                        <div class="opc-field">
                            <label class="opc-label">Telefono</label>
                            <input type="tel" class="opc-input" id="opc-telefono" placeholder="+39...">
                        </div>
                        <div class="opc-field">
                            <label class="opc-label">Email</label>
                            <input type="email" class="opc-input" id="opc-email" placeholder="email@...">
                        </div>
                    </div>

                    <!-- Indirizzo -->
                    <div class="opc-field">
                        <label class="opc-label">Indirizzo Cantiere</label>
                        <input type="text" class="opc-input" id="opc-indirizzo" 
                               placeholder="Via, CAP, Città">
                    </div>

                    <!-- Note -->
                    <div class="opc-field">
                        <label class="opc-label">Note</label>
                        <input type="text" class="opc-input" id="opc-note" 
                               placeholder="Note aggiuntive (opzionale)">
                    </div>
                </div>
                <div class="opc-footer">
                    <button class="opc-btn opc-btn-cancel">Annulla</button>
                    <button class="opc-btn opc-btn-create" id="opc-btn-create">Crea Progetto</button>
                </div>
            </div>
        `;

        // Event listeners
        overlay.querySelector('.opc-close').addEventListener('click', closeModal);
        overlay.querySelector('.opc-btn-cancel').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Autocomplete cliente
        const clienteInput = overlay.querySelector('#opc-cliente-nome');
        const autocompleteContainer = overlay.querySelector('#opc-autocomplete');
        
        clienteInput.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim();
            if (query.length < CONFIG.minSearchChars) {
                autocompleteContainer.style.display = 'none';
                return;
            }

            autocompleteContainer.innerHTML = '<div class="opc-loading">🔍 Ricerca...</div>';
            autocompleteContainer.style.display = 'block';

            const customers = await searchCustomers(query);
            renderAutocomplete(customers, autocompleteContainer, query);
        }, CONFIG.autocompleteDelay));

        // Chiudi autocomplete se click fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.opc-input-wrap')) {
                autocompleteContainer.style.display = 'none';
            }
        });

        // Crea progetto
        overlay.querySelector('#opc-btn-create').addEventListener('click', createProject);

        // ESC per chiudere
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(overlay);
        _modalElement = overlay;

        // Focus sul nome cliente
        setTimeout(() => clienteInput.focus(), 100);
    }

    function closeModal() {
        if (_modalElement) {
            _modalElement.remove();
            _modalElement = null;
        }
        _selectedCustomer = null;
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') closeModal();
    }

    // =========================================================================
    // CREAZIONE PROGETTO
    // =========================================================================

    async function createProject() {
        const modal = _modalElement;
        if (!modal) return;

        // Raccogli dati
        const projectId = modal.querySelector('#opc-project-id')?.value.trim();
        const clienteNome = modal.querySelector('#opc-cliente-nome')?.value.trim();
        const telefono = modal.querySelector('#opc-telefono')?.value.trim();
        const email = modal.querySelector('#opc-email')?.value.trim();
        const indirizzo = modal.querySelector('#opc-indirizzo')?.value.trim();
        const note = modal.querySelector('#opc-note')?.value.trim();

        // Validazione
        if (!clienteNome) {
            alert('Inserisci il nome del cliente');
            return;
        }

        if (!projectId) {
            alert('ID progetto mancante');
            return;
        }

        // Disabilita bottone
        const btn = modal.querySelector('#opc-btn-create');
        btn.disabled = true;
        btn.textContent = 'Creazione...';

        try {
            // Costruisci oggetto progetto
            const project = {
                id: projectId,
                name: clienteNome,
                cliente: clienteNome,
                clientData: {
                    nome: clienteNome,
                    telefono: telefono,
                    email: email,
                    indirizzo: indirizzo
                },
                note: note,
                posizioni: [],
                positions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0.0'
            };

            // Se cliente Odoo selezionato, aggiungi riferimenti
            if (_selectedCustomer?.isOdoo && _selectedCustomer.id) {
                project.odoo_customer_id = _selectedCustomer.id;
                project.odoo_customer = {
                    id: _selectedCustomer.id,
                    name: _selectedCustomer.name,
                    phone: _selectedCustomer.phone,
                    email: _selectedCustomer.email,
                    street: _selectedCustomer.street,
                    city: _selectedCustomer.city
                };
            }

            // Salva progetto
            const result = await saveProject(project);

            if (result.success) {
                // Notifica successo
                showNotification(
                    _selectedCustomer?.isOdoo 
                        ? `✅ Progetto creato e collegato a Odoo` 
                        : `✅ Progetto creato`,
                    'success'
                );

                // Callback
                if (typeof _onCreateCallback === 'function') {
                    _onCreateCallback(project);
                }

                // Aggiorna lista progetti nelle app
                updateAppProjectList(project);

                // Chiudi modal
                closeModal();

                // Apri progetto
                openCreatedProject(project);
            } else {
                throw new Error(result.error || 'Errore salvataggio');
            }
        } catch (error) {
            console.error('❌ Errore creazione progetto:', error);
            alert('Errore: ' + error.message);
            btn.disabled = false;
            btn.textContent = 'Crea Progetto';
        }
    }

    // =========================================================================
    // SALVATAGGIO
    // =========================================================================

    async function saveProject(project) {
        // Per ora salva sempre su GitHub (dati-cantieri)
        // In futuro: se odoo_project_id → salva su Odoo
        
        try {
            // Prova salvataggio GitHub
            if (typeof window.saveProjectToGitHub === 'function') {
                await window.saveProjectToGitHub(project);
                return { success: true, destination: 'github' };
            }
            
            // Fallback: salva in localStorage
            const key = `project_${project.id}`;
            localStorage.setItem(key, JSON.stringify(project));
            return { success: true, destination: 'local' };
            
        } catch (error) {
            console.error('❌ Errore salvataggio:', error);
            return { success: false, error: error.message };
        }
    }

    // =========================================================================
    // AGGIORNAMENTO APP
    // =========================================================================

    function updateAppProjectList(project) {
        // Dashboard Ufficio
        if (window.githubProjects && Array.isArray(window.githubProjects)) {
            window.githubProjects.unshift({
                id: project.id,
                nome: project.name,
                cliente: project.cliente,
                dataModifica: new Date().toLocaleDateString('it-IT'),
                rawData: project
            });
            
            if (typeof window.renderProjectsList === 'function') {
                window.renderProjectsList();
            }
        }

        // App Rilievo
        if (window._appState?.projects && Array.isArray(window._appState.projects)) {
            window._appState.projects.unshift(project);
            
            if (typeof window.renderProjects === 'function') {
                window.renderProjects();
            }
        }
    }

    function openCreatedProject(project) {
        // Dashboard Ufficio
        if (typeof window.loadGitHubProject === 'function') {
            setTimeout(() => window.loadGitHubProject(project.id), 300);
            return;
        }

        // App Rilievo
        if (typeof window.openProject === 'function') {
            setTimeout(() => window.openProject(project.id), 300);
            return;
        }
    }

    // =========================================================================
    // NOTIFICA
    // =========================================================================

    function showNotification(message, type = 'info') {
        // Usa ODOO_CORE se disponibile
        if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.showNotification) {
            ODOO_CORE.showNotification(message, type);
            return;
        }

        // Fallback
        const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${colors[type] || colors.info}; color: white;
            padding: 12px 24px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100000; font-family: system-ui;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    // =========================================================================
    // INIT
    // =========================================================================

    function init() {
        // Verifica ODOO_CORE
        if (typeof ODOO_CORE === 'undefined') {
            console.warn('⚠️ ODOO_CORE non trovato. Autocomplete Odoo disabilitato.');
        }

        console.log(`✅ ODOO_PROJECT_CREATOR v${VERSION} inizializzato`);
    }

    // =========================================================================
    // HOOK - Intercetta creazione progetti esistente
    // =========================================================================

    function installHooks() {
        // Hook per Dashboard: intercetta click su "Nuovo Progetto"
        const dashboardNewBtn = document.querySelector('#btn-new-project, [data-new-project]');
        if (dashboardNewBtn) {
            dashboardNewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            }, true);
            console.log('🔗 Hook Dashboard installato');
        }

        // Hook per App Rilievo: intercetta showNewProjectModal
        if (typeof window.showNewProjectModal === 'function') {
            const original = window.showNewProjectModal;
            window.showNewProjectModal = function() {
                openModal();
            };
            console.log('🔗 Hook App Rilievo installato');
        }
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
        installHooks,
        generateProjectId
    };

})();

// =========================================================================
// AUTO-INIT
// =========================================================================

if (typeof window !== 'undefined') {
    window.ODOO_PROJECT_CREATOR = ODOO_PROJECT_CREATOR;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ODOO_PROJECT_CREATOR.init();
            setTimeout(() => ODOO_PROJECT_CREATOR.installHooks(), 2000);
        });
    } else {
        ODOO_PROJECT_CREATOR.init();
        setTimeout(() => ODOO_PROJECT_CREATOR.installHooks(), 2000);
    }
    
    console.log('📁 ODOO_PROJECT_CREATOR disponibile globalmente');
}
