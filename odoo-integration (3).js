// ============================================================================
// ODOO-INTEGRATION.js
// Integrazione Odoo ↔ Dashboard Rilievi
// Versione: 1.0.0
// 
// Funzionalità:
// - Legge parametri URL da link Odoo (?odoo_id=123&nuovo=1)
// - Chiama server O.P.E.R.A. per ottenere dati cliente
// - Pre-compila form "Nuovo Progetto"
// - Autocomplete clienti da Odoo
// ============================================================================

(function() {
    'use strict';

    console.log('🔌 Odoo Integration v1.0.0 caricato');

    // ========================================================================
    // CONFIGURAZIONE - MODIFICA QUESTO URL SE CAMBIA!
    // ========================================================================
    
    const CONFIG = {
        // URL del server O.P.E.R.A. (ngrok)
        serverUrl: 'https://jody-gowaned-hypsometrically.ngrok-free.dev',
        
        // Timeout per le chiamate API (ms)
        timeout: 10000,
        
        // Ritardo prima di processare (ms)
        initDelay: 1000
    };

    // ========================================================================
    // UTILITY - Lettura parametri URL
    // ========================================================================

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            odoo_id: params.get('odoo_id'),
            nuovo: params.get('nuovo') === '1',
            token: params.get('token')
        };
    }

    function cleanUrl() {
        if (window.history && window.history.replaceState) {
            const cleanURL = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
        }
    }

    // ========================================================================
    // API - Chiamate al server O.P.E.R.A.
    // ========================================================================

    async function fetchCustomer(odooId) {
        try {
            console.log(`📡 Richiesta dati cliente ID: ${odooId}`);
            
            const response = await fetch(`${CONFIG.serverUrl}/api/customer/${odooId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success' && data.customer) {
                console.log('✅ Dati cliente ricevuti:', data.customer);
                return data.customer;
            } else {
                throw new Error(data.error || 'Dati non validi');
            }
            
        } catch (error) {
            console.error('❌ Errore recupero cliente:', error);
            return null;
        }
    }

    async function searchCustomers(query) {
        try {
            const response = await fetch(
                `${CONFIG.serverUrl}/api/customers?search=${encodeURIComponent(query)}&limit=10`,
                {
                    method: 'GET',
                    headers: { 
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );
            
            if (!response.ok) return [];
            
            const data = await response.json();
            return data.customers || [];
            
        } catch (error) {
            console.error('❌ Errore ricerca clienti:', error);
            return [];
        }
    }

    // ========================================================================
    // FORM - Pre-compilazione
    // ========================================================================

    function fillFormFields(customer) {
        console.log('📝 Pre-compilazione form con:', customer);
        
        // Mappa campi Odoo → campi Dashboard
        const fieldMappings = [
            // Nome progetto / Cliente
            { 
                selectors: ['#pm-nome-progetto', '#nomeProgetto', 'input[name="nomeProgetto"]'],
                value: customer.name
            },
            { 
                selectors: ['#pm-cliente', '#cliente', 'input[name="cliente"]'],
                value: customer.name
            },
            // Telefono
            { 
                selectors: ['#pm-telefono', '#telefono', 'input[name="telefono"]'],
                value: customer.phone || ''
            },
            // Email
            { 
                selectors: ['#pm-email', '#email', 'input[name="email"]'],
                value: customer.email || ''
            },
            // Indirizzo
            { 
                selectors: ['#pm-indirizzo', '#indirizzo', 'input[name="indirizzo"]'],
                value: buildAddress(customer)
            }
        ];
        
        let filledCount = 0;
        
        fieldMappings.forEach(mapping => {
            if (!mapping.value) return;
            
            for (const selector of mapping.selectors) {
                const field = document.querySelector(selector);
                if (field) {
                    field.value = mapping.value;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    filledCount++;
                    console.log(`   ✅ ${selector} = "${mapping.value}"`);
                    break;
                }
            }
        });
        
        console.log(`📝 Compilati ${filledCount} campi`);
        return filledCount;
    }

    function buildAddress(customer) {
        const parts = [];
        if (customer.street) parts.push(customer.street);
        if (customer.city) {
            if (customer.zip) {
                parts.push(`${customer.zip} ${customer.city}`);
            } else {
                parts.push(customer.city);
            }
        }
        return parts.join(', ');
    }

    // ========================================================================
    // MODAL - Apertura form Nuovo Progetto
    // ========================================================================

    function openNewProjectModal() {
        console.log('🔓 Apertura form Nuovo Progetto...');
        
        // Metodo 1: Click su bottone esistente
        const buttons = [
            '.btn-nuovo-progetto',
            '#btnNuovoProgetto',
            '[onclick*="nuovoProgetto"]',
            '[onclick*="openNewProject"]',
            '.pm-new-project-btn',
            '#pm-btn-nuovo'
        ];
        
        for (const selector of buttons) {
            try {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.click();
                    console.log('   ✅ Click su bottone:', selector);
                    return true;
                }
            } catch (e) {
                // Selettore non valido, continua
            }
        }
        
        // Metodo 2: Cerca bottoni con testo "Nuovo"
        const allButtons = document.querySelectorAll('button, .btn, [role="button"]');
        for (const btn of allButtons) {
            if (btn.textContent && btn.textContent.toLowerCase().includes('nuovo')) {
                btn.click();
                console.log('   ✅ Click su bottone con testo "Nuovo"');
                return true;
            }
        }
        
        // Metodo 3: Funzione globale
        if (typeof window.apriNuovoProgetto === 'function') {
            window.apriNuovoProgetto();
            return true;
        }
        
        if (typeof window.PM_openNewProject === 'function') {
            window.PM_openNewProject();
            return true;
        }
        
        // Metodo 4: Mostra modal direttamente
        const modals = ['#pm-modal', '#projectModal', '.project-modal', '#modalNuovoProgetto'];
        for (const selector of modals) {
            try {
                const modal = document.querySelector(selector);
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.add('active', 'show');
                    console.log('   ✅ Modal aperto:', selector);
                    return true;
                }
            } catch (e) {
                // Selettore non valido, continua
            }
        }
        
        console.warn('⚠️ Impossibile aprire form Nuovo Progetto');
        return false;
    }

    // ========================================================================
    // NOTIFICHE
    // ========================================================================

    function showNotification(message, type = 'info') {
        // Prova toast esistente
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // Crea notifica custom
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        // Aggiungi animazione
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ========================================================================
    // INIZIALIZZAZIONE PRINCIPALE
    // ========================================================================

    async function init() {
        console.log('🚀 Odoo Integration - Inizializzazione...');
        
        const params = getUrlParams();
        
        // Se non ci sono parametri Odoo, esci
        if (!params.odoo_id && !params.token) {
            console.log('ℹ️ Nessun parametro Odoo in URL');
            return;
        }
        
        console.log('📨 Parametri URL:', params);
        
        // Mostra notifica caricamento
        showNotification('⏳ Caricamento dati cliente da Odoo...', 'info');
        
        let customer = null;
        
        // Se c'è token, verifica prima (più sicuro)
        if (params.token) {
            try {
                const response = await fetch(`${CONFIG.serverUrl}/api/verify/${params.token}`, {
                    headers: {
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    customer = data.customer;
                }
            } catch (e) {
                console.error('Errore verifica token:', e);
            }
        }
        
        // Se c'è odoo_id diretto
        if (!customer && params.odoo_id) {
            customer = await fetchCustomer(params.odoo_id);
        }
        
        if (!customer) {
            showNotification('❌ Impossibile caricare dati cliente', 'error');
            cleanUrl();
            return;
        }
        
        // Pulisci URL
        cleanUrl();
        
        // Salva cliente per uso futuro
        window._odooCustomer = customer;
        
        // Se richiesto, apri form nuovo progetto
        if (params.nuovo) {
            // Aspetta che la pagina sia pronta
            setTimeout(() => {
                if (openNewProjectModal()) {
                    // Aspetta che il modal sia renderizzato
                    setTimeout(() => {
                        const filled = fillFormFields(customer);
                        if (filled > 0) {
                            showNotification(`✅ Cliente "${customer.name}" caricato da Odoo`, 'success');
                        }
                    }, 500);
                } else {
                    // Prova a compilare comunque (magari i campi sono già visibili)
                    fillFormFields(customer);
                    showNotification(`✅ Cliente "${customer.name}" pronto`, 'success');
                }
            }, CONFIG.initDelay);
        } else {
            showNotification(`✅ Cliente "${customer.name}" caricato`, 'success');
        }
    }

    // ========================================================================
    // AUTOCOMPLETE (opzionale, per ricerca clienti)
    // ========================================================================

    function initAutocomplete() {
        // Trova campi cliente
        const clienteFields = document.querySelectorAll(
            '#pm-cliente, #cliente, input[name="cliente"]'
        );
        
        clienteFields.forEach(field => {
            if (field.dataset.odooAutocomplete) return;
            field.dataset.odooAutocomplete = 'true';
            
            let debounceTimer;
            
            field.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    hideAutocomplete(field);
                    return;
                }
                
                debounceTimer = setTimeout(async () => {
                    const results = await searchCustomers(query);
                    showAutocomplete(field, results);
                }, 300);
            });
        });
    }

    function showAutocomplete(field, results) {
        hideAutocomplete(field);
        
        if (!results || results.length === 0) return;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'odoo-autocomplete';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        results.forEach(customer => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 10px 12px;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
            `;
            item.innerHTML = `
                <div style="font-weight: 600;">${customer.name}</div>
                <div style="font-size: 0.85em; color: #6b7280;">
                    ${customer.phone || ''} ${customer.email ? '• ' + customer.email : ''}
                </div>
            `;
            
            item.addEventListener('click', () => {
                fillFormFields(customer);
                hideAutocomplete(field);
                showNotification(`✅ Cliente "${customer.name}" selezionato`, 'success');
            });
            
            item.addEventListener('mouseenter', () => item.style.background = '#f3f4f6');
            item.addEventListener('mouseleave', () => item.style.background = 'white');
            
            dropdown.appendChild(item);
        });
        
        // Posiziona dropdown
        const wrapper = field.parentElement;
        wrapper.style.position = 'relative';
        wrapper.appendChild(dropdown);
        
        // Chiudi al click fuori
        document.addEventListener('click', function closeHandler(e) {
            if (!wrapper.contains(e.target)) {
                hideAutocomplete(field);
                document.removeEventListener('click', closeHandler);
            }
        });
    }

    function hideAutocomplete(field) {
        const wrapper = field.parentElement;
        const existing = wrapper.querySelector('.odoo-autocomplete');
        if (existing) existing.remove();
    }

    // ========================================================================
    // ESPOSIZIONE GLOBALE
    // ========================================================================

    window.ODOO_INTEGRATION = {
        fetchCustomer,
        searchCustomers,
        fillFormFields,
        openNewProjectModal,
        showNotification,
        init,
        CONFIG
    };

    // ========================================================================
    // AVVIO
    // ========================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 500);
            setTimeout(initAutocomplete, 1500);
        });
    } else {
        setTimeout(init, 500);
        setTimeout(initAutocomplete, 1500);
    }

})();
