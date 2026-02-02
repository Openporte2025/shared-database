// ============================================================================
// ODOO-INTEGRATION.js v3.3.0
// Integrazione Odoo ↔ Dashboard/App Rilievo
// 
// CHANGELOG v3.3.0:
// - Nuovo: bottone "Cerca in Odoo" nella sidebar
// - Nuovo: dialog ricerca clienti Odoo con risultati cliccabili
// - Click su cliente → mostra progetti o apre form nuovo
//
// CHANGELOG v3.2.0:
// - Fix: fallback API diretto per cercare progetti Odoo
// - Fix: saveNewProjectToGitHub (nome corretto)
// - Fix: loadProjectsFromGitHub (nome corretto)
// ============================================================================

(function() {
    'use strict';
    
    const VERSION = '3.3.0';
    const SERVER_URL = 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
    
    console.log(`🔌 Odoo Integration v${VERSION} caricato`);

    // ========================================================================
    // CONFIGURAZIONE
    // ========================================================================
    
    const CONFIG = {
        initDelay: 2000,
        projectsTimeout: 10000
    };

    // ========================================================================
    // UTILITY - Lettura parametri URL
    // ========================================================================
    
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            odoo_id: params.get('odoo_id'),
            nuovo: params.get('nuovo') === '1'
        };
    }

    function cleanUrl() {
        const url = new URL(window.location);
        url.searchParams.delete('odoo_id');
        url.searchParams.delete('nuovo');
        window.history.replaceState({}, '', url.pathname);
    }

    // ========================================================================
    // FETCH CLIENTE DA ODOO
    // ========================================================================
    
    async function fetchCustomer(odooId) {
        console.log(`📡 Fetching cliente Odoo ID: ${odooId}`);
        
        try {
            if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.clienti) {
                const customer = await ODOO_CORE.clienti.get(odooId);
                if (customer) {
                    console.log('✅ Cliente trovato via ODOO_CORE:', customer);
                    return customer;
                }
            }
        } catch (error) {
            console.warn('⚠️ ODOO_CORE.clienti.get fallito:', error);
        }
        
        // Fallback: chiamata diretta al server
        try {
            const response = await fetch(`${SERVER_URL}/api/customer/${odooId}`, {
                headers: {
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Cliente trovato via API:', data);
                return data.customer || data;
            }
        } catch (error) {
            console.error('❌ Errore fetch cliente:', error);
        }
        
        return null;
    }

    // ========================================================================
    // CERCA PROGETTI ESISTENTI
    // ========================================================================
    
    async function findExistingProjects(odooCustomerId) {
        const projects = [];
        console.log(`🔍 Cercando progetti per cliente Odoo ID: ${odooCustomerId}`);
        
        // 1. Cerca su GitHub
        if (window.githubProjects && Array.isArray(window.githubProjects)) {
            window.githubProjects.forEach(p => {
                const custId = p.odoo_customer_id || p.rawData?.odoo_customer_id;
                if (custId == odooCustomerId) {
                    projects.push({
                        source: 'github',
                        id: p.id,
                        name: p.name || p.nome,
                        data: p
                    });
                }
            });
            console.log(`📁 GitHub: trovati ${projects.length} progetti`);
        }
        
        // 2. Cerca su Odoo via ODOO_CORE
        try {
            if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.progetti) {
                const odooProjects = await ODOO_CORE.progetti.findByCustomer(odooCustomerId);
                if (odooProjects && odooProjects.length > 0) {
                    odooProjects.forEach(p => {
                        // Evita duplicati
                        if (!projects.find(x => x.source === 'odoo' && x.id === p.id)) {
                            projects.push({
                                source: 'odoo',
                                id: p.id,
                                name: p.name,
                                data: p
                            });
                        }
                    });
                    console.log(`🔗 ODOO_CORE: trovati ${odooProjects.length} progetti`);
                }
            }
        } catch (error) {
            console.warn('⚠️ ODOO_CORE.progetti.findByCustomer fallito:', error);
        }
        
        // 3. FALLBACK: chiamata diretta API se non abbiamo trovato nulla via ODOO_CORE
        if (!projects.find(p => p.source === 'odoo')) {
            try {
                console.log('🔄 Fallback: chiamata diretta API progetti...');
                const response = await fetch(`${SERVER_URL}/api/projects/customer/${odooCustomerId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.projects && data.projects.length > 0) {
                        data.projects.forEach(p => {
                            // Evita duplicati
                            if (!projects.find(x => x.source === 'odoo' && x.id === p.id)) {
                                projects.push({
                                    source: 'odoo',
                                    id: p.id,
                                    name: p.name,
                                    data: p
                                });
                            }
                        });
                        console.log(`🔗 API diretta: trovati ${data.projects.length} progetti Odoo`);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Fallback API progetti fallito:', error);
            }
        }
        
        console.log(`📊 Totale progetti trovati: ${projects.length}`);
        return projects;
    }

    // ========================================================================
    // MOSTRA DIALOG SELEZIONE PROGETTI
    // ========================================================================
    
    function showProjectSelectionDialog(customer, projects, onSelect, onNew) {
        console.log('📂 Mostrando dialog selezione progetti:', projects);
        
        const overlay = document.createElement('div');
        overlay.id = 'odoo-project-dialog';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
        `;
        
        const projectsList = projects.map(p => `
            <div class="odoo-project-item" data-id="${p.id}" data-source="${p.source}" style="
                padding: 12px 16px; border-bottom: 1px solid #e5e7eb;
                cursor: pointer; transition: background 0.2s;
            " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
                <div style="font-weight: 600; color: #111827;">${p.name}</div>
                <div style="font-size: 13px; color: #6b7280;">
                    ${p.source === 'odoo' ? '🔗 Progetto Odoo' : '📁 GitHub'} • ID: ${p.id}
                </div>
            </div>
        `).join('');
        
        overlay.innerHTML = `
            <div style="
                background: white; border-radius: 16px; width: 90%; max-width: 450px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <div style="background: linear-gradient(135deg, #714B67 0%, #9B6B8E 100%); color: white; padding: 20px;">
                    <h2 style="margin: 0; font-size: 1.25rem;">📂 Progetti per ${customer.name}</h2>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 0.9rem;">
                        Trovati ${projects.length} progetti esistenti
                    </p>
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${projectsList}
                </div>
                <div style="padding: 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 12px;">
                    <button id="odoo-new-project" style="
                        flex: 1; padding: 12px; background: #10b981; color: white;
                        border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                    ">➕ Nuovo Progetto</button>
                    <button id="odoo-cancel" style="
                        padding: 12px 24px; background: #f3f4f6; color: #374151;
                        border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer;
                    ">Annulla</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Event listeners
        overlay.querySelectorAll('.odoo-project-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const source = item.dataset.source;
                const project = projects.find(p => String(p.id) === String(id) && p.source === source);
                overlay.remove();
                if (onSelect) onSelect(project);
            });
        });
        
        document.getElementById('odoo-new-project').addEventListener('click', () => {
            overlay.remove();
            if (onNew) onNew();
        });
        
        document.getElementById('odoo-cancel').addEventListener('click', () => {
            overlay.remove();
        });
    }

    // ========================================================================
    // APRI FORM NUOVO PROGETTO CON DATI PRECOMPILATI
    // ========================================================================
    
    function openNewProjectForm(customer) {
        console.log('📝 Apertura form nuovo progetto per:', customer);
        
        // Splitta nome e cognome
        const nameParts = (customer.name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Prepara dati precompilati
        const preloadData = {
            name: customer.name,
            clientData: {
                nome: firstName,
                cognome: lastName,
                telefono: customer.phone || '',
                email: customer.email || '',
                via: customer.street || '',
                comune: customer.city || '',
                cap: customer.zip || ''
            },
            odoo_customer_id: customer.id,
            odoo_customer: customer
        };
        
        // Usa form unificato se disponibile
        if (typeof ODOO_PROJECT_FORM !== 'undefined') {
            console.log('✅ Usando ODOO_PROJECT_FORM');
            ODOO_PROJECT_FORM.open({
                preload: preloadData,
                onSave: async (projectData) => {
                    console.log('💾 Salvataggio progetto:', projectData);
                    // FIX: nome corretto funzione!
                    if (typeof window.saveNewProjectToGitHub === 'function') {
                        await window.saveNewProjectToGitHub(projectData);
                        // Ricarica progetti
                        if (typeof window.loadProjectsFromGitHub === 'function') {
                            setTimeout(() => window.loadProjectsFromGitHub(), 500);
                        }
                    } else {
                        console.error('❌ saveNewProjectToGitHub non disponibile');
                    }
                }
            });
        } 
        // Fallback: form vecchio
        else if (typeof window.openPMProjectModal === 'function') {
            console.log('⚠️ ODOO_PROJECT_FORM non disponibile, uso form vecchio');
            window._pendingOdooCustomer = customer;
            window._pendingOdooId = customer.id;
            window.openPMProjectModal();
            
            // Prova a compilare i campi dopo un delay
            setTimeout(() => {
                fillOldFormFields(customer);
            }, 500);
        } else {
            console.error('❌ Nessun form disponibile!');
            alert('Errore: form creazione progetto non disponibile');
        }
    }

    // ========================================================================
    // COMPILA CAMPI FORM VECCHIO (fallback)
    // ========================================================================
    
    function fillOldFormFields(customer) {
        const fields = {
            'pmProjectName': customer.name,
            'pmProjectClient': customer.name,
            'pmProjectPhone': customer.phone,
            'pmProjectEmail': customer.email,
            'pmProjectAddress': [customer.street, customer.zip, customer.city].filter(Boolean).join(', ')
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    // ========================================================================
    // APRI PROGETTO ESISTENTE
    // ========================================================================
    
    function openExistingProject(project) {
        console.log('📂 Apertura progetto:', project);
        
        if (project.source === 'github') {
            // Carica da GitHub
            if (typeof window.loadGitHubProject === 'function') {
                window.loadGitHubProject(project.id);
            } else if (typeof window.openProject === 'function') {
                window.openProject(project.id);
            }
        } else if (project.source === 'odoo') {
            // Carica da Odoo
            if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.loadAndDisplay) {
                ODOO_CORE.loadAndDisplay(project.id);
            } else {
                // Fallback: mostra info
                alert(`Progetto Odoo: ${project.name}\nID: ${project.id}\n\nCaricamento da Odoo non disponibile.`);
            }
        }
    }

    // ========================================================================
    // NOTIFICHE
    // ========================================================================
    
    function showNotification(message, type = 'info') {
        const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${colors[type] || colors.info}; color: white;
            padding: 12px 24px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100000; font-family: system-ui;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    // ========================================================================
    // INIT - PROCESSO PRINCIPALE
    // ========================================================================
    
    async function init() {
        const params = getUrlParams();
        
        if (!params.odoo_id) {
            console.log('ℹ️ Nessun odoo_id in URL, skip init');
            return;
        }
        
        console.log(`🚀 Odoo Integration init - odoo_id: ${params.odoo_id}, nuovo: ${params.nuovo}`);
        
        // Pulisci URL
        cleanUrl();
        
        // Mostra loading
        showNotification('⏳ Caricamento dati cliente...', 'info');
        
        // Fetch cliente
        const customer = await fetchCustomer(params.odoo_id);
        
        if (!customer) {
            showNotification('❌ Cliente non trovato in Odoo', 'error');
            return;
        }
        
        console.log('✅ Cliente:', customer);
        
        // Se nuovo=1, apri direttamente form nuovo
        if (params.nuovo) {
            openNewProjectForm(customer);
            return;
        }
        
        // Cerca progetti esistenti
        showNotification(`🔍 Ricerca progetti per ${customer.name}...`, 'info');
        const projects = await findExistingProjects(customer.id);
        
        console.log(`📊 Progetti trovati: ${projects.length}`, projects);
        
        if (projects.length > 0) {
            // Mostra dialog selezione
            showProjectSelectionDialog(
                customer,
                projects,
                (project) => openExistingProject(project),
                () => openNewProjectForm(customer)
            );
        } else {
            // Nessun progetto, apri form nuovo
            showNotification(`📝 Nuovo progetto per ${customer.name}`, 'success');
            openNewProjectForm(customer);
        }
    }

    // ========================================================================
    // BOTTONE "CERCA PROGETTI ODOO" IN SIDEBAR
    // ========================================================================
    
    function addSidebarButton() {
        // Trova il bottone "Nuovo Progetto" nella sidebar
        const newBtn = document.querySelector('.pm-sidebar-new-btn');
        if (!newBtn) {
            console.log('ℹ️ Sidebar non trovata, riprovo tra 2s...');
            setTimeout(addSidebarButton, 2000);
            return;
        }
        
        // Non aggiungere se già esiste
        if (document.getElementById('odoo-search-btn')) return;
        
        // Crea bottone
        const btn = document.createElement('a');
        btn.id = 'odoo-search-btn';
        btn.href = '#';
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
        btn.onclick = (e) => { e.preventDefault(); showSearchDialog(); };
        
        // Inserisci dopo il bottone "Nuovo Progetto"
        newBtn.parentNode.insertBefore(btn, newBtn.nextSibling);
        console.log('✅ Bottone "Cerca in Odoo" aggiunto alla sidebar');
    }
    
    // ========================================================================
    // DIALOG RICERCA CLIENTI ODOO
    // ========================================================================
    
    function showSearchDialog() {
        // Rimuovi dialog precedente se esiste
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
                <div style="background: linear-gradient(135deg, #714B67 0%, #9B6B8E 100%); color: white; padding: 20px;">
                    <h2 style="margin: 0; font-size: 1.25rem;">🔍 Cerca Cliente Odoo</h2>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 0.9rem;">
                        Cerca per nome, telefono o email
                    </p>
                </div>
                <div style="padding: 16px;">
                    <div style="display: flex; gap: 8px;">
                        <input id="odoo-search-input" type="text" placeholder="Es: Rossi, 333..." style="
                            flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                            font-size: 15px; outline: none;
                        " />
                        <button id="odoo-search-go" style="
                            padding: 12px 20px; background: #714B67; color: white;
                            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                        ">Cerca</button>
                    </div>
                    <div id="odoo-search-results" style="
                        margin-top: 12px; max-height: 350px; overflow-y: auto;
                    ">
                        <p style="color: #9ca3af; text-align: center; padding: 20px;">
                            Digita almeno 2 caratteri e premi Cerca
                        </p>
                    </div>
                </div>
                <div style="padding: 12px 16px; border-top: 1px solid #e5e7eb; text-align: right;">
                    <button id="odoo-search-close" style="
                        padding: 10px 24px; background: #f3f4f6; color: #374151;
                        border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer;
                    ">Chiudi</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Focus sull'input
        const input = document.getElementById('odoo-search-input');
        setTimeout(() => input.focus(), 100);
        
        // Event listeners
        document.getElementById('odoo-search-go').addEventListener('click', () => doSearch());
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
        document.getElementById('odoo-search-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    
    async function doSearch() {
        const input = document.getElementById('odoo-search-input');
        const resultsDiv = document.getElementById('odoo-search-results');
        const query = input.value.trim();
        
        if (query.length < 2) {
            resultsDiv.innerHTML = '<p style="color:#ef4444; text-align:center; padding:12px;">Digita almeno 2 caratteri</p>';
            return;
        }
        
        resultsDiv.innerHTML = '<p style="color:#6b7280; text-align:center; padding:20px;">⏳ Ricerca in corso...</p>';
        
        try {
            const response = await fetch(`${SERVER_URL}/api/customers?search=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            });
            
            if (!response.ok) throw new Error('Errore API');
            
            const data = await response.json();
            const customers = data.customers || data.results || data;
            
            if (!customers || customers.length === 0) {
                resultsDiv.innerHTML = '<p style="color:#9ca3af; text-align:center; padding:20px;">Nessun risultato</p>';
                return;
            }
            
            resultsDiv.innerHTML = customers.map(c => `
                <div class="odoo-customer-result" data-id="${c.id}" style="
                    padding: 12px 16px; border-bottom: 1px solid #e5e7eb;
                    cursor: pointer; transition: background 0.2s;
                " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
                    <div style="font-weight: 600; color: #111827;">${c.name}</div>
                    <div style="font-size: 13px; color: #6b7280;">
                        ${c.phone || ''} ${c.email ? '• ' + c.email : ''} ${c.city ? '• ' + c.city : ''}
                    </div>
                </div>
            `).join('');
            
            // Click su risultato → cerca progetti
            resultsDiv.querySelectorAll('.odoo-customer-result').forEach(item => {
                item.addEventListener('click', async () => {
                    const customerId = item.dataset.id;
                    const customerName = item.querySelector('div').textContent;
                    
                    // Chiudi dialog ricerca
                    document.getElementById('odoo-search-dialog').remove();
                    
                    // Fetch cliente completo
                    showNotification(`⏳ Caricamento ${customerName}...`, 'info');
                    const customer = await fetchCustomer(customerId);
                    
                    if (!customer) {
                        showNotification('❌ Errore caricamento cliente', 'error');
                        return;
                    }
                    
                    // Cerca progetti
                    const projects = await findExistingProjects(customer.id);
                    
                    if (projects.length > 0) {
                        showProjectSelectionDialog(
                            customer,
                            projects,
                            (project) => openExistingProject(project),
                            () => openNewProjectForm(customer)
                        );
                    } else {
                        showNotification(`📝 Nessun progetto per ${customer.name}`, 'info');
                        openNewProjectForm(customer);
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Errore ricerca:', error);
            resultsDiv.innerHTML = `
                <p style="color:#ef4444; text-align:center; padding:20px;">
                    ❌ Server non raggiungibile<br>
                    <small style="color:#9ca3af;">Verifica che O.P.E.R.A. sia avviato</small>
                </p>
            `;
        }
    }

    // ========================================================================
    // EXPORT
    // ========================================================================
    
    window.ODOO_INTEGRATION = {
        VERSION,
        init,
        fetchCustomer,
        findExistingProjects,
        openNewProjectForm,
        openExistingProject,
        showNotification,
        showSearchDialog
    };

    // ========================================================================
    // AUTO-INIT
    // ========================================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initDelay);
            setTimeout(addSidebarButton, CONFIG.initDelay + 500);
        });
    } else {
        setTimeout(init, CONFIG.initDelay);
        setTimeout(addSidebarButton, CONFIG.initDelay + 500);
    }

})();
