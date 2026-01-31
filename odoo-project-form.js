// ============================================================================
// ODOO-PROJECT-FORM.js v1.2.0
// Form unificato creazione/modifica progetti con autocomplete Odoo
// ============================================================================
// 
// CHANGELOG v1.2.0:
// - Fix: ID "undefined" → genera ID correttamente
// - Fix: JSON completo con tutti i campi standard
// - Aggiunto: dataCreazione, dataModifica, status, source, indirizzo
//
// CHANGELOG v1.1.0:
// - Fix: usa saveNewProjectToGitHub (nome corretto)
// - Fix: usa loadProjectsFromGitHub (nome corretto)
//
// Usato da: Dashboard Ufficio, App Rilievo iPad, App Posa
// 
// API:
//   ODOO_PROJECT_FORM.open()           - Apre form nuovo progetto
//   ODOO_PROJECT_FORM.edit(projectId)  - Apre form modifica progetto
//   ODOO_PROJECT_FORM.close()          - Chiude form
//
// Dipendenze:
//   - ODOO_CORE (per ricerca clienti)
//
// ============================================================================

const ODOO_PROJECT_FORM = (function() {
    'use strict';

    const VERSION = '1.2.0';

    // =========================================================================
    // CONFIGURAZIONE
    // =========================================================================

    const CONFIG = {
        // Campi form
        fields: [
            { id: 'nomeProgetto', label: 'Nome Progetto', type: 'text', required: true, placeholder: 'Es. Ristrutturazione Rossi' },
            { id: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Mario', section: 'cliente', autocomplete: true },
            { id: 'cognome', label: 'Cognome', type: 'text', required: true, placeholder: 'Rossi', section: 'cliente' },
            { id: 'codiceFiscale', label: 'Codice Fiscale', type: 'text', required: false, placeholder: 'RSSMRA80A01H501X', section: 'cliente', maxlength: 16, uppercase: true },
            { id: 'telefono', label: 'Telefono', type: 'tel', required: false, placeholder: '333 1234567', section: 'cliente' },
            { id: 'email', label: 'Email', type: 'email', required: false, placeholder: 'mario.rossi@email.it', section: 'cliente' },
            { id: 'via', label: 'Via / Indirizzo', type: 'text', required: false, placeholder: 'Via Roma 1', section: 'indirizzo' },
            { id: 'comune', label: 'Comune', type: 'text', required: false, placeholder: 'Bergamo', section: 'indirizzo' },
            { id: 'provincia', label: 'Prov', type: 'text', required: false, placeholder: 'BG', section: 'indirizzo', maxlength: 2, uppercase: true },
            { id: 'cap', label: 'CAP', type: 'text', required: false, placeholder: '24100', section: 'indirizzo', maxlength: 5 },
            { id: 'zonaClimatica', label: 'Zona Climatica', type: 'select', required: false, section: 'fiscale', options: [
                { value: '', label: 'Seleziona...' },
                { value: 'A', label: 'A - Molto caldo' },
                { value: 'B', label: 'B - Caldo' },
                { value: 'C', label: 'C - Temperato' },
                { value: 'D', label: 'D - Temperato freddo' },
                { value: 'E', label: 'E - Freddo' },
                { value: 'F', label: 'F - Molto freddo' }
            ]},
            { id: 'detrazione', label: 'Detrazione', type: 'select', required: false, section: 'fiscale', options: [
                { value: '', label: 'Seleziona...' },
                { value: '50', label: '50% - Ristrutturazione' },
                { value: '65', label: '65% - Ecobonus' },
                { value: '0', label: 'Nessuna detrazione' }
            ]}
        ],

        // Autocomplete
        autocompleteDelay: 300,
        autocompleteMinChars: 2,
        autocompleteMaxResults: 8
    };

    // =========================================================================
    // STATO
    // =========================================================================

    let _modal = null;
    let _currentProjectId = null;
    let _selectedOdooCustomer = null;
    let _searchTimeout = null;
    let _dropdown = null;
    let _onSaveCallback = null;

    // =========================================================================
    // STILI
    // =========================================================================

    const STYLES = `
        .opf-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .opf-modal {
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            font-family: system-ui, -apple-system, sans-serif;
        }

        .opf-header {
            background: linear-gradient(135deg, #714B67 0%, #9B6B8E 100%);
            color: white;
            padding: 20px 24px;
            border-radius: 16px 16px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .opf-header h2 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .opf-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .opf-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .opf-body {
            padding: 24px;
        }

        .opf-section {
            margin-bottom: 24px;
        }

        .opf-section-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #714B67;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .opf-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .opf-row.single {
            grid-template-columns: 1fr;
        }

        .opf-row.triple {
            grid-template-columns: 2fr 1fr 1fr;
        }

        .opf-field {
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .opf-label {
            font-size: 0.85rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 6px;
        }

        .opf-label .required {
            color: #ef4444;
            margin-left: 2px;
        }

        .opf-input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .opf-input:focus {
            outline: none;
            border-color: #714B67;
            box-shadow: 0 0 0 3px rgba(113, 75, 103, 0.1);
        }
        .opf-input.uppercase {
            text-transform: uppercase;
        }
        .opf-input.odoo-linked {
            border-color: #714B67;
            background: linear-gradient(to right, #fdf4ff, white);
        }

        .opf-footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .opf-btn {
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .opf-btn-cancel {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #374151;
        }
        .opf-btn-cancel:hover {
            background: #e5e7eb;
        }

        .opf-btn-save {
            background: #10b981;
            border: none;
            color: white;
        }
        .opf-btn-save:hover {
            background: #059669;
        }

        /* Autocomplete dropdown */
        .opf-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #714B67;
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 99999;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .opf-dropdown-item {
            padding: 12px 14px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.15s;
        }
        .opf-dropdown-item:hover {
            background: #fdf4ff;
        }
        .opf-dropdown-item:last-child {
            border-bottom: none;
        }

        .opf-dropdown-name {
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .opf-dropdown-badge {
            font-size: 10px;
            padding: 2px 6px;
            background: #714B67;
            color: white;
            border-radius: 4px;
        }

        .opf-dropdown-detail {
            font-size: 13px;
            color: #6b7280;
            margin-top: 2px;
        }

        .opf-dropdown-new {
            background: #f0fdf4;
            border-top: 2px dashed #10b981;
        }
        .opf-dropdown-new .opf-dropdown-name {
            color: #059669;
        }

        .opf-dropdown-loading {
            padding: 16px;
            text-align: center;
            color: #6b7280;
        }

        .opf-odoo-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            padding: 3px 8px;
            background: #714B67;
            color: white;
            border-radius: 4px;
            margin-left: 8px;
        }
    `;

    // =========================================================================
    // UTILITY
    // =========================================================================

    function injectStyles() {
        if (document.getElementById('opf-styles')) return;
        const style = document.createElement('style');
        style.id = 'opf-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function generateProjectId() {
        const year = new Date().getFullYear();
        const existing = window.githubProjects || [];
        let maxNum = 0;
        existing.forEach(p => {
            const match = p.id?.match(/(\d{4})P(\d+)/);
            if (match && parseInt(match[1]) === year) {
                maxNum = Math.max(maxNum, parseInt(match[2]));
            }
        });
        return `${year}P${String(maxNum + 1).padStart(3, '0')}`;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // RENDER FORM
    // =========================================================================

    function renderForm(projectData = null) {
        const isEdit = !!projectData;
        const title = isEdit ? 'Modifica Progetto' : 'Nuovo Progetto';
        const projectId = isEdit ? projectData.id : generateProjectId();

        const html = `
            <div class="opf-overlay" id="opf-overlay">
                <div class="opf-modal">
                    <div class="opf-header">
                        <h2>📁 ${title}</h2>
                        <button class="opf-close" id="opf-close">&times;</button>
                    </div>
                    <div class="opf-body">
                        <!-- Nome Progetto -->
                        <div class="opf-section">
                            <div class="opf-row single">
                                <div class="opf-field">
                                    <label class="opf-label">Nome Progetto <span class="required">*</span></label>
                                    <input type="text" class="opf-input" id="opf-nomeProgetto" 
                                           placeholder="Es. Ristrutturazione Rossi"
                                           value="${escapeHtml(projectData?.name || '')}">
                                </div>
                            </div>
                        </div>

                        <!-- Dati Cliente -->
                        <div class="opf-section">
                            <div class="opf-section-title">👤 Dati Cliente</div>
                            <div class="opf-row">
                                <div class="opf-field">
                                    <label class="opf-label">Nome <span class="required">*</span></label>
                                    <input type="text" class="opf-input" id="opf-nome" 
                                           placeholder="Mario" autocomplete="off"
                                           value="${escapeHtml(projectData?.clientData?.nome || '')}">
                                </div>
                                <div class="opf-field">
                                    <label class="opf-label">Cognome <span class="required">*</span></label>
                                    <input type="text" class="opf-input" id="opf-cognome" 
                                           placeholder="Rossi"
                                           value="${escapeHtml(projectData?.clientData?.cognome || '')}">
                                </div>
                            </div>
                            <div class="opf-row single">
                                <div class="opf-field">
                                    <label class="opf-label">Codice Fiscale</label>
                                    <input type="text" class="opf-input uppercase" id="opf-codiceFiscale" 
                                           placeholder="RSSMRA80A01H501X" maxlength="16"
                                           value="${escapeHtml(projectData?.clientData?.codiceFiscale || '')}">
                                </div>
                            </div>
                            <div class="opf-row">
                                <div class="opf-field">
                                    <label class="opf-label">Telefono</label>
                                    <input type="tel" class="opf-input" id="opf-telefono" 
                                           placeholder="333 1234567"
                                           value="${escapeHtml(projectData?.clientData?.telefono || '')}">
                                </div>
                                <div class="opf-field">
                                    <label class="opf-label">Email</label>
                                    <input type="email" class="opf-input" id="opf-email" 
                                           placeholder="mario.rossi@email.it"
                                           value="${escapeHtml(projectData?.clientData?.email || '')}">
                                </div>
                            </div>
                        </div>

                        <!-- Indirizzo Lavori -->
                        <div class="opf-section">
                            <div class="opf-section-title">📍 Indirizzo Lavori</div>
                            <div class="opf-row single">
                                <div class="opf-field">
                                    <label class="opf-label">Via / Indirizzo</label>
                                    <input type="text" class="opf-input" id="opf-via" 
                                           placeholder="Via Roma 1"
                                           value="${escapeHtml(projectData?.clientData?.via || '')}">
                                </div>
                            </div>
                            <div class="opf-row triple">
                                <div class="opf-field">
                                    <label class="opf-label">Comune</label>
                                    <input type="text" class="opf-input" id="opf-comune" 
                                           placeholder="Bergamo"
                                           value="${escapeHtml(projectData?.clientData?.comune || '')}">
                                </div>
                                <div class="opf-field">
                                    <label class="opf-label">Prov</label>
                                    <input type="text" class="opf-input uppercase" id="opf-provincia" 
                                           placeholder="BG" maxlength="2"
                                           value="${escapeHtml(projectData?.clientData?.provincia || '')}">
                                </div>
                                <div class="opf-field">
                                    <label class="opf-label">CAP</label>
                                    <input type="text" class="opf-input" id="opf-cap" 
                                           placeholder="24100" maxlength="5"
                                           value="${escapeHtml(projectData?.clientData?.cap || '')}">
                                </div>
                            </div>
                        </div>

                        <!-- Dati Fiscali -->
                        <div class="opf-section">
                            <div class="opf-section-title">📋 Dati Fiscali</div>
                            <div class="opf-row">
                                <div class="opf-field">
                                    <label class="opf-label">Zona Climatica</label>
                                    <select class="opf-input" id="opf-zonaClimatica">
                                        <option value="">Seleziona...</option>
                                        <option value="A" ${projectData?.clientData?.zonaClimatica === 'A' ? 'selected' : ''}>A - Molto caldo</option>
                                        <option value="B" ${projectData?.clientData?.zonaClimatica === 'B' ? 'selected' : ''}>B - Caldo</option>
                                        <option value="C" ${projectData?.clientData?.zonaClimatica === 'C' ? 'selected' : ''}>C - Temperato</option>
                                        <option value="D" ${projectData?.clientData?.zonaClimatica === 'D' ? 'selected' : ''}>D - Temperato freddo</option>
                                        <option value="E" ${projectData?.clientData?.zonaClimatica === 'E' ? 'selected' : ''}>E - Freddo</option>
                                        <option value="F" ${projectData?.clientData?.zonaClimatica === 'F' ? 'selected' : ''}>F - Molto freddo</option>
                                    </select>
                                </div>
                                <div class="opf-field">
                                    <label class="opf-label">Detrazione</label>
                                    <select class="opf-input" id="opf-detrazione">
                                        <option value="">Seleziona...</option>
                                        <option value="50" ${projectData?.clientData?.detrazione === '50' ? 'selected' : ''}>50% - Ristrutturazione</option>
                                        <option value="65" ${projectData?.clientData?.detrazione === '65' ? 'selected' : ''}>65% - Ecobonus</option>
                                        <option value="0" ${projectData?.clientData?.detrazione === '0' ? 'selected' : ''}>Nessuna detrazione</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <input type="hidden" id="opf-projectId" value="${projectId}">
                        <input type="hidden" id="opf-odooCustomerId" value="${projectData?.odoo_customer_id || ''}">
                    </div>
                    <div class="opf-footer">
                        <button class="opf-btn opf-btn-cancel" id="opf-cancel">Annulla</button>
                        <button class="opf-btn opf-btn-save" id="opf-save">✅ ${isEdit ? 'Salva Modifiche' : 'Crea Progetto'}</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // =========================================================================
    // AUTOCOMPLETE
    // =========================================================================

    async function searchCustomers(query) {
        if (!query || query.length < CONFIG.autocompleteMinChars) return [];
        
        try {
            if (typeof ODOO_CORE === 'undefined') {
                console.warn('⚠️ ODOO_CORE non disponibile');
                return [];
            }
            return await ODOO_CORE.clienti.search(query, CONFIG.autocompleteMaxResults) || [];
        } catch (error) {
            console.error('❌ Errore ricerca:', error);
            return [];
        }
    }

    function showDropdown(input, customers, query) {
        hideDropdown();

        const dropdown = document.createElement('div');
        dropdown.className = 'opf-dropdown';
        dropdown.id = 'opf-dropdown';

        let html = '';

        if (customers.length > 0) {
            customers.forEach((c, idx) => {
                const detail = [c.phone, c.city].filter(Boolean).join(' • ');
                html += `
                    <div class="opf-dropdown-item" data-index="${idx}">
                        <div class="opf-dropdown-name">
                            ${escapeHtml(c.name)}
                            <span class="opf-dropdown-badge">Odoo</span>
                        </div>
                        <div class="opf-dropdown-detail">${escapeHtml(detail || c.email || 'Cliente Odoo')}</div>
                    </div>
                `;
            });
        }

        // Opzione nuovo
        html += `
            <div class="opf-dropdown-item opf-dropdown-new" data-new="true">
                <div class="opf-dropdown-name">➕ Continua con "${escapeHtml(query)}"</div>
                <div class="opf-dropdown-detail">Senza collegamento Odoo</div>
            </div>
        `;

        dropdown.innerHTML = html;
        
        // Inserisci dopo l'input
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);
        _dropdown = dropdown;

        // Click handlers
        dropdown.querySelectorAll('.opf-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.dataset.new === 'true') {
                    hideDropdown();
                } else {
                    const idx = parseInt(item.dataset.index);
                    selectOdooCustomer(customers[idx]);
                }
            });
        });
    }

    function hideDropdown() {
        if (_dropdown) {
            _dropdown.remove();
            _dropdown = null;
        }
    }

    function selectOdooCustomer(customer) {
        console.log('✅ Cliente Odoo selezionato:', customer);
        _selectedOdooCustomer = customer;

        // Splitta nome
        const nameParts = (customer.name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Compila campi
        const setValue = (id, value) => {
            const el = document.getElementById(id);
            if (el && value) el.value = value;
        };

        setValue('opf-nome', firstName);
        setValue('opf-cognome', lastName);
        setValue('opf-telefono', customer.phone);
        setValue('opf-email', customer.email);
        setValue('opf-via', customer.street);
        setValue('opf-comune', customer.city);
        setValue('opf-cap', customer.zip);
        setValue('opf-odooCustomerId', customer.id);

        // Anche nome progetto se vuoto
        const nomeProgetto = document.getElementById('opf-nomeProgetto');
        if (nomeProgetto && !nomeProgetto.value) {
            nomeProgetto.value = customer.name;
        }

        // Marca come collegato
        document.getElementById('opf-nome').classList.add('odoo-linked');

        hideDropdown();
        showNotification(`✅ Cliente "${customer.name}" collegato da Odoo`, 'success');
    }

    function setupAutocomplete() {
        const input = document.getElementById('opf-nome');
        if (!input) return;

        let timeout = null;

        input.addEventListener('input', async (e) => {
            clearTimeout(timeout);
            const query = e.target.value.trim();

            if (query.length < CONFIG.autocompleteMinChars) {
                hideDropdown();
                return;
            }

            timeout = setTimeout(async () => {
                // Loading
                const dropdown = document.createElement('div');
                dropdown.className = 'opf-dropdown';
                dropdown.id = 'opf-dropdown';
                dropdown.innerHTML = '<div class="opf-dropdown-loading">🔍 Ricerca in Odoo...</div>';
                hideDropdown();
                input.parentElement.style.position = 'relative';
                input.parentElement.appendChild(dropdown);
                _dropdown = dropdown;

                const customers = await searchCustomers(query);
                showDropdown(input, customers, query);
            }, CONFIG.autocompleteDelay);
        });

        input.addEventListener('blur', () => {
            setTimeout(hideDropdown, 200);
        });
    }

    // =========================================================================
    // SALVATAGGIO
    // =========================================================================

    function collectFormData() {
        const getValue = (id) => document.getElementById(id)?.value?.trim() || '';

        // Genera ID se mancante o "undefined"
        let projectId = getValue('opf-projectId');
        if (!projectId || projectId === 'undefined' || projectId === 'null') {
            projectId = generateProjectId();
            console.log('🆔 ID generato:', projectId);
        }

        const now = new Date().toISOString();
        const today = new Date().toLocaleDateString('it-IT');

        const data = {
            // Identificazione
            id: projectId,
            name: getValue('opf-nomeProgetto') || (getValue('opf-nome') + ' ' + getValue('opf-cognome')).trim(),
            client: (getValue('opf-nome') + ' ' + getValue('opf-cognome')).trim(),
            
            // Dati cliente completi
            clientData: {
                nome: getValue('opf-nome'),
                cognome: getValue('opf-cognome'),
                codiceFiscale: getValue('opf-codiceFiscale'),
                telefono: getValue('opf-telefono'),
                email: getValue('opf-email'),
                via: getValue('opf-via'),
                comune: getValue('opf-comune'),
                provincia: getValue('opf-provincia'),
                cap: getValue('opf-cap'),
                zonaClimatica: getValue('opf-zonaClimatica'),
                detrazione: getValue('opf-detrazione'),
                indirizzo: [getValue('opf-via'), getValue('opf-cap'), getValue('opf-comune')].filter(Boolean).join(', ')
            },
            
            // Posizioni/Rilievi (vuoto inizialmente)
            posizioni: [],
            
            // Metadati
            createdAt: now,
            updatedAt: now,
            dataCreazione: today,
            dataModifica: today,
            status: 'nuovo',
            version: VERSION,
            source: 'dashboard'
        };

        // Collegamento Odoo
        const odooId = getValue('opf-odooCustomerId');
        if (odooId && odooId !== 'undefined' && odooId !== '') {
            data.odoo_customer_id = parseInt(odooId);
            if (_selectedOdooCustomer) {
                data.odoo_customer = _selectedOdooCustomer;
            }
        }

        console.log('📋 Dati progetto raccolti:', data);
        return data;
    }

    function validateForm() {
        const errors = [];
        
        if (!document.getElementById('opf-nomeProgetto')?.value?.trim()) {
            errors.push('Nome Progetto è obbligatorio');
        }
        if (!document.getElementById('opf-nome')?.value?.trim()) {
            errors.push('Nome è obbligatorio');
        }
        if (!document.getElementById('opf-cognome')?.value?.trim()) {
            errors.push('Cognome è obbligatorio');
        }

        return errors;
    }

    async function saveProject() {
        const errors = validateForm();
        if (errors.length > 0) {
            showNotification('⚠️ ' + errors.join(', '), 'error');
            return false;
        }

        const data = collectFormData();
        console.log('💾 Salvataggio progetto:', data);

        try {
            // Chiama callback se definito (per salvataggio personalizzato)
            if (_onSaveCallback) {
                await _onSaveCallback(data);
            } else {
                // Salvataggio default su GitHub - FIX: nome corretto!
                if (typeof window.saveNewProjectToGitHub === 'function') {
                    console.log('📤 Chiamando saveNewProjectToGitHub...');
                    await window.saveNewProjectToGitHub(data);
                } else {
                    throw new Error('saveNewProjectToGitHub non disponibile');
                }
            }

            showNotification('✅ Progetto salvato!', 'success');
            close();

            // Ricarica lista progetti - FIX: nome corretto!
            if (typeof window.loadProjectsFromGitHub === 'function') {
                setTimeout(() => window.loadProjectsFromGitHub(), 500);
            }

            return true;
        } catch (error) {
            console.error('❌ Errore salvataggio:', error);
            showNotification('❌ Errore salvataggio: ' + error.message, 'error');
            return false;
        }
    }

    // =========================================================================
    // NOTIFICHE
    // =========================================================================

    function showNotification(message, type = 'info') {
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
        setTimeout(() => toast.remove(), 3000);
    }

    // =========================================================================
    // API PUBBLICA
    // =========================================================================

    function open(options = {}) {
        injectStyles();
        
        _currentProjectId = null;
        _selectedOdooCustomer = null;
        _onSaveCallback = options.onSave || null;

        // Precompila da opzioni
        const preData = options.preload || null;

        const html = renderForm(preData);
        
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container.firstElementChild);

        _modal = document.getElementById('opf-overlay');

        // Event listeners
        document.getElementById('opf-close').onclick = close;
        document.getElementById('opf-cancel').onclick = close;
        document.getElementById('opf-save').onclick = saveProject;
        _modal.onclick = (e) => { if (e.target === _modal) close(); };

        // Setup autocomplete
        setupAutocomplete();

        // Focus primo campo
        setTimeout(() => document.getElementById('opf-nomeProgetto')?.focus(), 100);
    }

    function edit(projectData, options = {}) {
        injectStyles();

        _currentProjectId = projectData.id;
        _selectedOdooCustomer = projectData.odoo_customer || null;
        _onSaveCallback = options.onSave || null;

        const html = renderForm(projectData);

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container.firstElementChild);

        _modal = document.getElementById('opf-overlay');

        // Event listeners
        document.getElementById('opf-close').onclick = close;
        document.getElementById('opf-cancel').onclick = close;
        document.getElementById('opf-save').onclick = saveProject;
        _modal.onclick = (e) => { if (e.target === _modal) close(); };

        // Setup autocomplete
        setupAutocomplete();
    }

    function close() {
        hideDropdown();
        if (_modal) {
            _modal.remove();
            _modal = null;
        }
        _currentProjectId = null;
        _selectedOdooCustomer = null;
    }

    // =========================================================================
    // INIT
    // =========================================================================

    function init() {
        injectStyles();
        console.log(`✅ ODOO_PROJECT_FORM v${VERSION} inizializzato`);
    }

    // =========================================================================
    // EXPORT
    // =========================================================================

    return {
        VERSION,
        open,
        edit,
        close,
        init
    };

})();

// =========================================================================
// AUTO-INIT
// =========================================================================

if (typeof window !== 'undefined') {
    window.ODOO_PROJECT_FORM = ODOO_PROJECT_FORM;
    console.log('📋 ODOO_PROJECT_FORM v1.2.0 disponibile');
}
