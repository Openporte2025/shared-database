// ============================================================================
// ODOO-INTEGRATION.js
// Integrazione Odoo ↔ Dashboard Rilievi
// Versione: 2.0.0
// 
// Funzionalità:
// - Legge parametri URL da link Odoo (?odoo_id=123&nuovo=1)
// - Cerca progetti esistenti con stesso odoo_id
// - Mostra dialog se progetto già esiste
// - Pre-compila form "Nuovo Progetto"
// ============================================================================

(function() {
    'use strict';

    console.log('🔌 Odoo Integration v2.0.0 caricato');

    // ========================================================================
    // CONFIGURAZIONE
    // ========================================================================
    
    const CONFIG = {
        // URL del server O.P.E.R.A. (ngrok)
        serverUrl: 'https://jody-gowaned-hypsometrically.ngrok-free.dev',
        
        // Timeout per le chiamate API (ms)
        timeout: 10000,
        
        // Ritardo prima di processare (ms) - aumentato per aspettare caricamento progetti
        initDelay: 3500
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
    // PROGETTI - Ricerca esistenti
    // ========================================================================

    /**
     * Aspetta che i progetti siano caricati da GitHub
     */
    async function waitForProjects(maxWait = 10000) {
        const start = Date.now();
        while (Date.now() - start < maxWait) {
            if (window.githubProjects && window.githubProjects.length > 0) {
                console.log(`✅ Progetti caricati: ${window.githubProjects.length}`);
                return true;
            }
            await new Promise(r => setTimeout(r, 500));
        }
        console.warn('⚠️ Timeout: progetti non caricati');
        return false;
    }

    function findProjectByOdooId(odooId) {
        try {
            console.log('🔍 Cercando progetto con odoo_id:', odooId);
            
            // METODO PRINCIPALE: window.githubProjects (Dashboard Rilievi)
            if (window.githubProjects && Array.isArray(window.githubProjects)) {
                console.log('🔍 Cerco in window.githubProjects (' + window.githubProjects.length + ' progetti)');
                
                // Cerca in p.odoo_id oppure p.rawData?.odoo_id
                const found = window.githubProjects.find(p => 
                    p.odoo_id == odooId || p.rawData?.odoo_id == odooId
                );
                
                if (found) {
                    console.log('✅ Progetto trovato:', found.id, found.nome || found.name);
                    return found;
                }
            }
            
            // Fallback: DATA_MANAGER
            if (typeof DATA_MANAGER !== 'undefined' && DATA_MANAGER.getAllProjects) {
                const projects = DATA_MANAGER.getAllProjects();
                const found = projects.find(p => p.odoo_id == odooId || p.rawData?.odoo_id == odooId);
                if (found) {
                    console.log('✅ Progetto trovato via DATA_MANAGER:', found.id);
                    return found;
                }
            }
            
            // Fallback: window.projects
            if (window.projects && Array.isArray(window.projects)) {
                const found = window.projects.find(p => p.odoo_id == odooId || p.rawData?.odoo_id == odooId);
                if (found) {
                    console.log('✅ Progetto trovato via window.projects:', found.id);
                    return found;
                }
            }
            
            // Fallback: GITHUB_SYNC
            if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.projects) {
                const projects = Object.values(GITHUB_SYNC.projects);
                const found = projects.find(p => p.odoo_id == odooId || p.rawData?.odoo_id == odooId);
                if (found) {
                    console.log('✅ Progetto trovato via GITHUB_SYNC:', found.id);
                    return found;
                }
            }
            
            console.log('❌ Nessun progetto trovato con odoo_id:', odooId);
            return null;
            
        } catch (error) {
            console.error('❌ Errore ricerca progetto:', error);
            return null;
        }
    }

    /**
     * Trova TUTTI i progetti con lo stesso odoo_id
     */
    function findAllProjectsByOdooId(odooId) {
        try {
            console.log('🔍 Cercando TUTTI i progetti con odoo_id:', odooId);
            let allFound = [];
            
            // METODO PRINCIPALE: window.githubProjects (Dashboard Rilievi)
            if (window.githubProjects && Array.isArray(window.githubProjects)) {
                const found = window.githubProjects.filter(p => 
                    p.odoo_id == odooId || p.rawData?.odoo_id == odooId
                );
                allFound = allFound.concat(found);
            }
            
            console.log(`✅ Trovati ${allFound.length} progetti con odoo_id ${odooId}`);
            return allFound;
            
        } catch (error) {
            console.error('❌ Errore ricerca progetti:', error);
            return [];
        }
    }

    function openExistingProject(projectId) {
        console.log('📂 Apertura progetto esistente:', projectId);
        
        // Metodo 1: Funzione globale loadGitHubProject (Dashboard Rilievi)
        if (typeof window.loadGitHubProject === 'function') {
            window.loadGitHubProject(projectId);
            console.log('   ✅ Chiamata loadGitHubProject(' + projectId + ')');
            return true;
        }
        
        // Metodo 2: Click su elemento sidebar
        const projectLinks = document.querySelectorAll('[onclick*="loadGitHubProject"]');
        for (const link of projectLinks) {
            if (link.onclick && link.onclick.toString().includes(projectId)) {
                link.click();
                console.log('   ✅ Click su link sidebar');
                return true;
            }
        }
        
        // Metodo 3: DATA_MANAGER
        if (typeof DATA_MANAGER !== 'undefined' && DATA_MANAGER.loadProject) {
            DATA_MANAGER.loadProject(projectId);
            console.log('   ✅ Chiamata DATA_MANAGER.loadProject');
            return true;
        }
        
        console.warn('⚠️ Impossibile aprire progetto:', projectId);
        return false;
    }

    // ========================================================================
    // DIALOG - Progetto esistente
    // ========================================================================

    function showExistingProjectDialog(existingProjects, customer) {
        return new Promise((resolve) => {
            // Se è un singolo progetto, convertilo in array
            const projects = Array.isArray(existingProjects) ? existingProjects : [existingProjects];
            
            // Rimuovi dialog esistente
            const oldDialog = document.getElementById('odoo-existing-dialog');
            if (oldDialog) oldDialog.remove();
            
            const dialog = document.createElement('div');
            dialog.id = 'odoo-existing-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            `;
            
            // Genera HTML per lista progetti
            const projectsListHtml = projects.map((proj, index) => {
                const name = proj.nome || proj.name || proj.id;
                const updated = proj.dataModifica || (proj.rawData?.updated ? new Date(proj.rawData.updated).toLocaleDateString('it-IT') : '');
                return `
                    <div class="odoo-project-item" data-index="${index}" style="
                        padding: 12px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        margin-bottom: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        <div style="font-weight: 600; color: #1f2937;">${name}</div>
                        <div style="font-size: 0.85em; color: #6b7280; margin-top: 4px;">
                            ID: ${proj.id}${updated ? ' • ' + updated : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            dialog.innerHTML = `
                <div style="
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                ">
                    <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">
                        📋 ${projects.length > 1 ? 'Progetti Esistenti' : 'Progetto Esistente'}
                    </h3>
                    <p style="margin: 0 0 12px 0; color: #4b5563;">
                        Il cliente <strong>${customer.name}</strong> ha ${projects.length > 1 ? projects.length + ' progetti' : 'già un progetto'}:
                    </p>
                    
                    <div id="odoo-projects-list" style="margin: 16px 0; max-height: 250px; overflow-y: auto;">
                        ${projectsListHtml}
                    </div>
                    
                    <p style="margin: 12px 0; color: #4b5563; font-size: 0.9em;">
                        ${projects.length > 1 ? 'Clicca su un progetto per aprirlo, oppure crea un nuovo progetto.' : 'Cosa vuoi fare?'}
                    </p>
                    
                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        ${projects.length === 1 ? `
                            <button id="odoo-dialog-open" style="
                                flex: 1;
                                padding: 12px 16px;
                                background: #10b981;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                font-size: 14px;
                                font-weight: 600;
                                cursor: pointer;
                            ">
                                📂 Apri Esistente
                            </button>
                        ` : ''}
                        <button id="odoo-dialog-new" style="
                            flex: 1;
                            padding: 12px 16px;
                            background: #3b82f6;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                        ">
                            ➕ Nuovo Progetto
                        </button>
                    </div>
                    <button id="odoo-dialog-cancel" style="
                        width: 100%;
                        margin-top: 12px;
                        padding: 10px;
                        background: transparent;
                        color: #6b7280;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 13px;
                        cursor: pointer;
                    ">
                        Annulla
                    </button>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            // Stili hover per items
            const style = document.createElement('style');
            style.textContent = `
                .odoo-project-item:hover {
                    border-color: #10b981 !important;
                    background: #f0fdf4 !important;
                }
                .odoo-project-item.selected {
                    border-color: #10b981 !important;
                    background: #d1fae5 !important;
                }
            `;
            dialog.appendChild(style);
            
            // Event listeners per click su progetti
            const projectItems = dialog.querySelectorAll('.odoo-project-item');
            projectItems.forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    const selectedProject = projects[index];
                    dialog.remove();
                    resolve({ action: 'open', project: selectedProject });
                });
            });
            
            // Event listener per bottone Apri (solo se singolo progetto)
            const openBtn = document.getElementById('odoo-dialog-open');
            if (openBtn) {
                openBtn.addEventListener('click', () => {
                    dialog.remove();
                    resolve({ action: 'open', project: projects[0] });
                });
            }
            
            document.getElementById('odoo-dialog-new').addEventListener('click', () => {
                dialog.remove();
                resolve({ action: 'new', project: null });
            });
            
            document.getElementById('odoo-dialog-cancel').addEventListener('click', () => {
                dialog.remove();
                resolve({ action: 'cancel', project: null });
            });
            
            // Click fuori chiude
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    dialog.remove();
                    resolve({ action: 'cancel', project: null });
                }
            });
        });
    }

    // ========================================================================
    // FORM - Pre-compilazione
    // ========================================================================

    function fillFormFields(customer) {
        console.log('📝 Pre-compilazione form con:', customer);
        
        // Attendi che il modal sia renderizzato
        setTimeout(() => {
            let filledCount = 0;
            
            // Nome Progetto = Nome Cliente
            const nameField = document.getElementById('pmProjectName');
            if (nameField && customer.name) {
                nameField.value = customer.name;
                nameField.dispatchEvent(new Event('input', { bubbles: true }));
                filledCount++;
                console.log('   ✅ pmProjectName =', customer.name);
            }
            
            // Cliente
            const clientField = document.getElementById('pmProjectClient');
            if (clientField && customer.name) {
                clientField.value = customer.name;
                clientField.dispatchEvent(new Event('input', { bubbles: true }));
                filledCount++;
                console.log('   ✅ pmProjectClient =', customer.name);
            }
            
            // Telefono
            const phoneField = document.getElementById('pmProjectPhone');
            if (phoneField && customer.phone) {
                phoneField.value = customer.phone;
                phoneField.dispatchEvent(new Event('input', { bubbles: true }));
                filledCount++;
                console.log('   ✅ pmProjectPhone =', customer.phone);
            }
            
            // Email
            const emailField = document.getElementById('pmProjectEmail');
            if (emailField && customer.email) {
                emailField.value = customer.email;
                emailField.dispatchEvent(new Event('input', { bubbles: true }));
                filledCount++;
                console.log('   ✅ pmProjectEmail =', customer.email);
            }
            
            // Indirizzo (componi da street + city + zip)
            const addressField = document.getElementById('pmProjectAddress');
            if (addressField) {
                const address = buildAddress(customer);
                if (address) {
                    addressField.value = address;
                    addressField.dispatchEvent(new Event('input', { bubbles: true }));
                    filledCount++;
                    console.log('   ✅ pmProjectAddress =', address);
                }
            }
            
            console.log(`📝 Compilati ${filledCount} campi`);
            
            if (filledCount > 0) {
                showNotification(`✅ Cliente "${customer.name}" caricato da Odoo`, 'success');
            }
            
            // Salva odoo_id per quando si crea il progetto
            window._pendingOdooId = customer.id;
            window._pendingOdooCustomer = customer;
            
        }, 300);
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
        
        // Metodo 1: Funzione globale (PREFERITO)
        if (typeof window.openPMProjectModal === 'function') {
            window.openPMProjectModal();
            console.log('   ✅ Chiamata openPMProjectModal()');
            return true;
        }
        
        // Metodo 2: Click su bottone sidebar
        const btn = document.querySelector('.pm-sidebar-new-btn');
        if (btn) {
            btn.click();
            console.log('   ✅ Click su .pm-sidebar-new-btn');
            return true;
        }
        
        // Metodo 3: Cerca altri bottoni
        const buttons = [
            'a.pm-sidebar-new-btn',
            '[onclick*="openPMProjectModal"]'
        ];
        
        for (const selector of buttons) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    el.click();
                    console.log('   ✅ Click su:', selector);
                    return true;
                }
            } catch (e) {}
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
            animation: odooSlideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        // Aggiungi animazione
        if (!document.getElementById('odoo-toast-style')) {
            const style = document.createElement('style');
            style.id = 'odoo-toast-style';
            style.textContent = `
                @keyframes odooSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'odooSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ========================================================================
    // INIZIALIZZAZIONE PRINCIPALE
    // ========================================================================

    async function init() {
        console.log('🚀 Odoo Integration - Inizializzazione...');
        
        const params = getUrlParams();
        console.log('📨 Parametri URL:', params);
        
        // Se non ci sono parametri Odoo, esci
        if (!params.odoo_id && !params.token) {
            console.log('ℹ️ Nessun parametro Odoo in URL');
            return;
        }
        
        // Pulisci URL subito
        cleanUrl();
        
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
            return;
        }
        
        // Salva per uso futuro
        window._odooCustomer = customer;
        
        // IMPORTANTE: Aspetta che i progetti siano caricati da GitHub
        console.log('⏳ Attendo caricamento progetti da GitHub...');
        await waitForProjects(10000);
        
        // Cerca TUTTI i progetti esistenti con stesso odoo_id
        const existingProjects = findAllProjectsByOdooId(customer.id);
        
        if (existingProjects.length > 0) {
            // Progetto/i esistente/i! Mostra dialog
            const result = await showExistingProjectDialog(existingProjects, customer);
            
            if (result.action === 'open' && result.project) {
                // Apri progetto selezionato
                openExistingProject(result.project.id);
                showNotification(`📂 Aperto progetto "${result.project.nome || result.project.name || result.project.id}"`, 'success');
            } else if (result.action === 'new') {
                // Crea nuovo progetto
                openNewProjectModalAndFill(customer);
            }
            // action === 'cancel' -> non fare nulla
            
        } else {
            // Nessun progetto esistente
            if (params.nuovo) {
                openNewProjectModalAndFill(customer);
            } else {
                showNotification(`✅ Cliente "${customer.name}" pronto`, 'success');
            }
        }
    }

    function openNewProjectModalAndFill(customer) {
        if (openNewProjectModal()) {
            // Aspetta che il modal sia renderizzato
            setTimeout(() => {
                fillFormFields(customer);
            }, 500);
        } else {
            // Prova comunque a compilare
            fillFormFields(customer);
        }
    }

    // ========================================================================
    // HOOK per salvare odoo_id nel progetto
    // ========================================================================

    function setupProjectCreationHook() {
        // Intercetta la creazione del progetto per aggiungere odoo_id
        const originalCreateProject = window.createPMProject;
        
        if (typeof originalCreateProject === 'function') {
            window.createPMProject = function(...args) {
                // Aggiungi odoo_id se presente
                if (window._pendingOdooId && args[0]) {
                    args[0].odoo_id = window._pendingOdooId;
                    args[0].odoo_customer = window._pendingOdooCustomer;
                    console.log('🔗 Aggiunto odoo_id al progetto:', window._pendingOdooId);
                }
                
                const result = originalCreateProject.apply(this, args);
                
                // Pulisci
                window._pendingOdooId = null;
                window._pendingOdooCustomer = null;
                
                return result;
            };
            console.log('🔗 Hook createPMProject installato');
        }
    }

    // ========================================================================
    // ESPOSIZIONE GLOBALE
    // ========================================================================

    window.ODOO_INTEGRATION = {
        fetchCustomer,
        searchCustomers,
        findProjectByOdooId,
        findAllProjectsByOdooId,
        openExistingProject,
        fillFormFields,
        openNewProjectModal,
        showNotification,
        waitForProjects,
        init,
        CONFIG
    };

    // ========================================================================
    // AVVIO
    // ========================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initDelay);
            setTimeout(setupProjectCreationHook, 2000);
        });
    } else {
        setTimeout(init, CONFIG.initDelay);
        setTimeout(setupProjectCreationHook, 2000);
    }

})();
