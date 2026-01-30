// ============================================================================
// ODOO-AUTOCOMPLETE.js v1.1.0
// Aggiunge autocomplete Odoo ai form esistenti
// ============================================================================
// 
// NON sostituisce i form, li MIGLIORA con ricerca Odoo
// 
// Funziona su:
//   - Dashboard Ufficio (form nuovo progetto)
//   - App Rilievo iPad (wizard nuovo progetto)
//
// Dipendenze:
//   - ODOO_CORE (obbligatorio)
//
// ============================================================================

const ODOO_AUTOCOMPLETE = (function() {
    'use strict';

    const VERSION = '1.1.0';

    // =========================================================================
    // CONFIGURAZIONE
    // =========================================================================

    const CONFIG = {
        // Ritardo autocomplete (ms)
        delay: 300,
        
        // Minimo caratteri
        minChars: 2,
        
        // Max risultati
        maxResults: 8,

        // Selettori campi per App Rilievo
        rilievoFields: {
            nomeProgetto: '#project-name, [name="projectName"], input[placeholder*="progetto" i]',
            nome: '#client-name, [name="clientName"], input[placeholder*="Nome" i]:not([placeholder*="Cognome"])',
            cognome: '#client-surname, [name="clientSurname"], input[placeholder*="Cognome" i]',
            telefono: '#client-phone, [name="clientPhone"], input[placeholder*="Telefono" i], input[type="tel"]',
            email: '#client-email, [name="clientEmail"], input[placeholder*="Email" i], input[type="email"]',
            codiceFiscale: '#client-cf, [name="clientCF"], input[placeholder*="Fiscale" i]',
            via: '#client-street, [name="clientStreet"], input[placeholder*="Via" i], input[placeholder*="Indirizzo" i]',
            comune: '#client-city, [name="clientCity"], input[placeholder*="Comune" i]',
            provincia: '#client-province, [name="clientProvince"], input[placeholder*="Prov" i]',
            cap: '#client-zip, [name="clientZip"], input[placeholder*="CAP" i]'
        },

        // Selettori campi per Dashboard Ufficio
        dashboardFields: {
            cliente: '#pm-nome, #clienteNome, input[placeholder*="cliente" i]',
            telefono: '#pm-telefono, #clienteTelefono',
            email: '#pm-email, #clienteEmail',
            indirizzo: '#pm-indirizzo, #clienteIndirizzo'
        }
    };

    // =========================================================================
    // STATO
    // =========================================================================

    let _searchTimeout = null;
    let _activeDropdown = null;
    let _selectedCustomer = null;

    // =========================================================================
    // STILI DROPDOWN
    // =========================================================================

    const STYLES = `
        .odoo-ac-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #714B67;
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 280px;
            overflow-y: auto;
            z-index: 99999;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            font-family: system-ui, -apple-system, sans-serif;
        }

        .odoo-ac-item {
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.15s;
        }
        .odoo-ac-item:hover {
            background: #fdf4ff;
        }
        .odoo-ac-item:last-child {
            border-bottom: none;
        }

        .odoo-ac-name {
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .odoo-ac-badge {
            font-size: 10px;
            padding: 2px 6px;
            background: #714B67;
            color: white;
            border-radius: 4px;
        }

        .odoo-ac-detail {
            font-size: 13px;
            color: #6b7280;
            margin-top: 2px;
        }

        .odoo-ac-new {
            background: #f0fdf4;
            border-top: 2px dashed #10b981;
        }
        .odoo-ac-new .odoo-ac-name {
            color: #059669;
        }

        .odoo-ac-loading {
            padding: 16px;
            text-align: center;
            color: #6b7280;
        }

        .odoo-ac-empty {
            padding: 16px;
            text-align: center;
            color: #9ca3af;
            font-size: 13px;
        }

        .odoo-ac-input-wrap {
            position: relative !important;
        }

        .odoo-ac-linked {
            border-color: #714B67 !important;
            background: linear-gradient(to right, #fdf4ff, white) !important;
        }

        .odoo-ac-indicator {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            color: #714B67;
            pointer-events: none;
        }
    `;

    // =========================================================================
    // UTILITY
    // =========================================================================

    function injectStyles() {
        if (document.getElementById('odoo-ac-styles')) return;
        const style = document.createElement('style');
        style.id = 'odoo-ac-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function debounce(fn, delay) {
        return function(...args) {
            clearTimeout(_searchTimeout);
            _searchTimeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // TROVA CAMPI
    // =========================================================================

    function findField(selectors) {
        if (typeof selectors === 'string') {
            return document.querySelector(selectors);
        }
        return null;
    }

    function findAllFields(fieldConfig) {
        const fields = {};
        for (const [key, selector] of Object.entries(fieldConfig)) {
            fields[key] = document.querySelector(selector);
        }
        return fields;
    }

    function detectApp() {
        // App Rilievo ha wizard con step
        if (document.querySelector('.wizard-step, [data-step], .step-indicator')) {
            return 'rilievo';
        }
        // Dashboard ha pm- prefix
        if (document.querySelector('#pm-nome, .pm-form')) {
            return 'dashboard';
        }
        // Prova a indovinare
        if (document.querySelector('.main-menu, #mainSideMenu')) {
            return 'rilievo';
        }
        return 'dashboard';
    }

    // =========================================================================
    // RICERCA ODOO
    // =========================================================================

    async function searchCustomers(query) {
        if (!query || query.length < CONFIG.minChars) {
            return [];
        }

        try {
            if (typeof ODOO_CORE === 'undefined') {
                console.warn('⚠️ ODOO_CORE non disponibile');
                return [];
            }
            const results = await ODOO_CORE.clienti.search(query, CONFIG.maxResults);
            return results || [];
        } catch (error) {
            console.error('❌ Errore ricerca:', error);
            return [];
        }
    }

    // =========================================================================
    // DROPDOWN
    // =========================================================================

    function showDropdown(input, customers, query) {
        hideDropdown();

        const dropdown = document.createElement('div');
        dropdown.className = 'odoo-ac-dropdown';
        dropdown.id = 'odoo-ac-dropdown';

        let html = '';

        if (customers.length > 0) {
            customers.forEach((c, idx) => {
                const detail = [c.phone, c.city].filter(Boolean).join(' • ');
                html += `
                    <div class="odoo-ac-item" data-index="${idx}">
                        <div class="odoo-ac-name">
                            ${escapeHtml(c.name)}
                            <span class="odoo-ac-badge">Odoo</span>
                        </div>
                        <div class="odoo-ac-detail">${escapeHtml(detail || c.email || 'Cliente Odoo')}</div>
                    </div>
                `;
            });
        } else {
            html = `<div class="odoo-ac-empty">Nessun cliente trovato in Odoo</div>`;
        }

        // Opzione nuovo
        html += `
            <div class="odoo-ac-item odoo-ac-new" data-new="true">
                <div class="odoo-ac-name">➕ Continua con "${escapeHtml(query)}"</div>
                <div class="odoo-ac-detail">Senza collegamento Odoo</div>
            </div>
        `;

        dropdown.innerHTML = html;
        
        // Calcola posizione usando offset chain
        function getOffset(el) {
            let top = 0, left = 0;
            let width = el.offsetWidth;
            let height = el.offsetHeight;
            while (el) {
                top += el.offsetTop;
                left += el.offsetLeft;
                el = el.offsetParent;
            }
            return { top, left, width, height };
        }
        
        const pos = getOffset(input);
        
        dropdown.style.cssText = `
            position: fixed;
            top: ${pos.top + pos.height + 4}px;
            left: ${pos.left}px;
            width: ${pos.width}px;
            background: white;
            border: 2px solid #714B67;
            border-radius: 0 0 8px 8px;
            max-height: 280px;
            overflow-y: auto;
            z-index: 999999;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(dropdown);
        _activeDropdown = dropdown;

        // Click handlers
        dropdown.querySelectorAll('.odoo-ac-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.dataset.new === 'true') {
                    selectNewCustomer(query, input);
                } else {
                    const idx = parseInt(item.dataset.index);
                    selectOdooCustomer(customers[idx], input);
                }
                hideDropdown();
            });
        });
    }

    function hideDropdown() {
        if (_activeDropdown) {
            _activeDropdown.remove();
            _activeDropdown = null;
        }
        const existing = document.getElementById('odoo-ac-dropdown');
        if (existing) existing.remove();
    }

    // =========================================================================
    // SELEZIONE CLIENTE
    // =========================================================================

    function selectOdooCustomer(customer, triggerInput) {
        console.log('✅ Cliente Odoo selezionato:', customer);
        _selectedCustomer = customer;

        const app = detectApp();
        
        if (app === 'rilievo') {
            fillRilievoFields(customer, triggerInput);
        } else {
            fillDashboardFields(customer, triggerInput);
        }

        // Marca input come collegato
        triggerInput.classList.add('odoo-ac-linked');
        
        // Salva riferimento per uso futuro
        window._odooSelectedCustomer = customer;
        window._pendingOdooId = customer.id;
        window._pendingOdooCustomer = customer;

        showNotification(`✅ Cliente "${customer.name}" collegato da Odoo`, 'success');
    }

    function selectNewCustomer(name, triggerInput) {
        console.log('ℹ️ Nuovo cliente (non Odoo):', name);
        _selectedCustomer = null;
        window._odooSelectedCustomer = null;
        window._pendingOdooId = null;
        
        triggerInput.classList.remove('odoo-ac-linked');
    }

    // =========================================================================
    // RIEMPI CAMPI - APP RILIEVO
    // =========================================================================

    function fillRilievoFields(customer, triggerInput) {
        // Splitta nome in nome + cognome
        const nameParts = (customer.name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Trova campi nel DOM attuale (potrebbero essere in modal/wizard)
        const container = triggerInput.closest('form, .modal, .wizard, [class*="step"], .opc-modal, div') || document;

        // Nome progetto (se è il trigger)
        if (triggerInput.placeholder?.toLowerCase().includes('progetto') || 
            triggerInput.id?.includes('project')) {
            triggerInput.value = customer.name;
        }

        // Cerca e riempi campi
        const fillField = (selectors, value) => {
            if (!value) return;
            const selectorsArray = selectors.split(',').map(s => s.trim());
            for (const sel of selectorsArray) {
                const field = container.querySelector(sel) || document.querySelector(sel);
                if (field && field !== triggerInput) {
                    field.value = value;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    return;
                }
            }
        };

        // Mappa campi
        fillField('input[placeholder*="Nome" i]:not([placeholder*="Cognome"]):not([placeholder*="Progetto"]), #clientName', firstName);
        fillField('input[placeholder*="Cognome" i], #clientSurname', lastName);
        fillField('input[type="tel"], input[placeholder*="Telefono" i], #clientPhone', customer.phone);
        fillField('input[type="email"], input[placeholder*="Email" i], #clientEmail', customer.email);
        fillField('input[placeholder*="Via" i], input[placeholder*="Indirizzo" i], #clientStreet', customer.street);
        fillField('input[placeholder*="Comune" i], input[placeholder*="Città" i], #clientCity', customer.city);
        fillField('input[placeholder*="Prov" i], #clientProvince', customer.state_id ? customer.state_id[1] : '');
        fillField('input[placeholder*="CAP" i], #clientZip', customer.zip);
    }

    // =========================================================================
    // RIEMPI CAMPI - DASHBOARD
    // =========================================================================

    function fillDashboardFields(customer, triggerInput) {
        const container = triggerInput.closest('form, .modal, div') || document;

        // Cliente/Nome
        triggerInput.value = customer.name;

        const fillField = (selector, value) => {
            if (!value) return;
            const field = container.querySelector(selector) || document.querySelector(selector);
            if (field && field !== triggerInput) {
                field.value = value;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };

        fillField('#pmProjectPhone, #pm-telefono, #opc-telefono, input[placeholder*="telefono" i]', customer.phone);
        fillField('#pmProjectEmail, #pm-email, #opc-email, input[placeholder*="email" i]', customer.email);
        
        const fullAddress = [customer.street, customer.zip, customer.city].filter(Boolean).join(', ');
        fillField('#pmProjectAddress, #pm-indirizzo, #opc-indirizzo, input[placeholder*="indirizzo" i]', fullAddress);
    }

    // =========================================================================
    // NOTIFICA
    // =========================================================================

    function showNotification(message, type = 'info') {
        if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.showNotification) {
            ODOO_CORE.showNotification(message, type);
            return;
        }
        
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
    // ATTACH AUTOCOMPLETE
    // =========================================================================

    function attachToInput(input) {
        if (!input || input.dataset.odooAc === 'true') return;
        
        input.dataset.odooAc = 'true';
        
        // Indicazione visiva che autocomplete è attivo
        input.style.borderColor = '#714B67';
        input.setAttribute('placeholder', input.placeholder + ' (cerca in Odoo)');

        // Input handler
        const handleInput = debounce(async (e) => {
            const query = e.target.value.trim();
            
            if (query.length < CONFIG.minChars) {
                hideDropdown();
                return;
            }

            // Mostra loading
            showDropdown(input, [], query);
            const dropdown = document.getElementById('odoo-ac-dropdown');
            if (dropdown) {
                dropdown.innerHTML = '<div class="odoo-ac-loading">🔍 Ricerca in Odoo...</div>';
            }

            const customers = await searchCustomers(query);
            showDropdown(input, customers, query);
        }, CONFIG.delay);

        input.addEventListener('input', handleInput);
        
        // Focus: riattiva se c'è già testo
        input.addEventListener('focus', () => {
            if (input.value.length >= CONFIG.minChars) {
                handleInput({ target: input });
            }
        });

        // Blur: nascondi dropdown con ritardo
        input.addEventListener('blur', () => {
            setTimeout(hideDropdown, 200);
        });

        console.log('🔗 Autocomplete attaccato a:', input);
    }

    // =========================================================================
    // OBSERVER - Rileva nuovi campi (modal, wizard)
    // =========================================================================

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    
                    // Cerca campi in nuovi elementi
                    const inputs = node.querySelectorAll ? 
                        node.querySelectorAll('input[type="text"], input:not([type])') : [];
                    
                    inputs.forEach(input => {
                        if (shouldAttach(input)) {
                            setTimeout(() => attachToInput(input), 300);
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('👁️ Observer attivo per nuovi campi');
    }

    function shouldAttach(input) {
        if (!input || input.dataset.odooAc === 'true') return false;
        
        const placeholder = (input.placeholder || '').toLowerCase();
        const id = (input.id || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        
        // ID specifici da attaccare
        const targetIds = ['pmprojectclient', 'clientenome', 'pm-nome', 'pm-cliente', 'opc-cliente-nome'];
        if (targetIds.includes(id)) return true;
        
        // Campi da attaccare per keyword
        const keywords = ['cliente', 'progetto', 'nome progetto', 'project', 'customer', 'cerca', 'clientenome'];
        
        return keywords.some(kw => 
            placeholder.includes(kw) || id.includes(kw) || name.includes(kw)
        );
    }

    // =========================================================================
    // INIT
    // =========================================================================

    function init() {
        injectStyles();

        // Verifica ODOO_CORE
        if (typeof ODOO_CORE === 'undefined') {
            console.warn('⚠️ ODOO_CORE non trovato. Autocomplete limitato.');
        }

        // Attacca a campi esistenti
        const selectors = [
            '#pmProjectClient',
            '#pm-nome',
            '#clienteNome',
            '#opc-cliente-nome', 
            'input[placeholder*="cliente" i]',
            'input[placeholder*="Cerca cliente" i]',
            'input[placeholder*="Nome Progetto" i]',
            'input[placeholder*="progetto" i]'
        ];

        selectors.forEach(sel => {
            const input = document.querySelector(sel);
            if (input) attachToInput(input);
        });

        // Observer per campi futuri
        setupObserver();

        // Click fuori chiude dropdown
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.odoo-ac-dropdown, .odoo-ac-input-wrap')) {
                hideDropdown();
            }
        });

        console.log(`✅ ODOO_AUTOCOMPLETE v${VERSION} inizializzato`);
    }

    // =========================================================================
    // EXPORT
    // =========================================================================

    return {
        VERSION,
        CONFIG,
        init,
        attachToInput,
        searchCustomers,
        getSelectedCustomer: () => _selectedCustomer
    };

})();

// =========================================================================
// AUTO-INIT
// =========================================================================

if (typeof window !== 'undefined') {
    window.ODOO_AUTOCOMPLETE = ODOO_AUTOCOMPLETE;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ODOO_AUTOCOMPLETE.init(), 1000);
        });
    } else {
        setTimeout(() => ODOO_AUTOCOMPLETE.init(), 1000);
    }
    
    console.log('🔍 ODOO_AUTOCOMPLETE disponibile globalmente');
}
