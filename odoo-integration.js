// ============================================================================
// ODOO-INTEGRATION.js v3.4.0
// Integrazione Odoo ↔ Dashboard/App Rilievo (SHARED)
// 
// CHANGELOG v3.4.0:
// - FIX CRITICO: openNewProjectForm rileva App Rilievo vs Dashboard
//   App Rilievo: createProject() + popola clientData + odoo fields + render
//   Dashboard: ODOO_PROJECT_FORM + saveNewProjectToGitHub (come prima)
// - FIX: openExistingProject rileva App Rilievo (loadProject/state)
// - Helper isAppRilievo() per rilevamento automatico
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
    
    const VERSION = '3.4.0';
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
    // HELPER: RILEVA APP
    // ========================================================================
    
    function isAppRilievo() {
        return typeof window.createProject === 'function' && typeof window.saveState === 'function';
    }

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
        
        // ================================================================
        // v3.4.0: APP RILIEVO → usa createProject() nativo
        // ================================================================
        if (isAppRilievo()) {
            console.log('📱 Rilevata App Rilievo - uso createProject()');
            
            const projectName = customer.name || (firstName + ' ' + lastName).trim();
            
            try {
                // 1. Crea progetto nativo
                window.createProject(projectName, customer.name);
                
                // 2. Trova progetto appena creato (è currentProject)
                const proj = state.projects.find(p => p.id === state.currentProject);
                if (proj) {
                    // 3. Popola clientData da Odoo
                    if (!proj.clientData) proj.clientData = {};
                    proj.clientData.nome = firstName;
                    proj.clientData.cognome = lastName;
                    proj.clientData.telefono = customer.phone || '';
                    proj.clientData.email = customer.email || '';
                    proj.clientData.via = customer.street || '';
                    proj.clientData.indirizzo = customer.street || '';
                    proj.clientData.citta = customer.city || '';
                    proj.clientData.comune = customer.city || '';
                    proj.clientData.cap = customer.zip || '';
                    
                    // 4. Collegamento Odoo
                    proj.odoo_customer_id = customer.id;
                    proj.odoo_customer = customer;
                    
                    console.log('✅ ClientData popolato da Odoo:', proj.clientData);
                }
                
                // 5. Salva, naviga, renderizza
                state.screen = 'project';
                window.saveState();
                if (typeof window.render === 'function') window.render();
                
                showNotification(`✅ Progetto "${projectName}" creato da Odoo!`, 'success');
            } catch (error) {
                console.error('❌ Errore creazione progetto App Rilievo:', error);
                showNotification('❌ Errore: ' + error.message, 'error');
            }
            return;
        }
        
        // ================================================================
        // DASHBOARD → usa ODOO_PROJECT_FORM + saveNewProjectToGitHub
        // ================================================================
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
            console.log('🖥️ Dashboard - Usando ODOO_PROJECT_FORM');
            ODOO_PROJECT_FORM.open({
                preload: preloadData,
                onSave: async (projectData) => {
                    console.log('💾 Salvataggio progetto:', projectData);
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
        // Fallback: form vecchio Dashboard
        else if (typeof window.openPMProjectModal === 'function') {
            console.log('⚠️ ODOO_PROJECT_FORM non disponibile, uso form vecchio');
            window._pendingOdooCustomer = customer;
            window._pendingOdooId = customer.id;
            window.openPMProjectModal();
            setTimeout(() => fillOldFormFields(customer), 500);
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
            // v3.4.0: App Rilievo → usa state.currentProject + render
            if (isAppRilievo()) {
                console.log('📱 App Rilievo - apertura progetto:', project.id);
                const found = state.projects.find(p => p.id === project.id);
                if (found) {
                    state.currentProject = project.id;
                    state.screen = 'project';
                    window.saveState();
                    if (typeof window.render === 'function') window.render();
                } else {
                    showNotification('❌ Progetto non trovato in locale', 'error');
                }
                return;
            }
            
            // Dashboard: funzioni esistenti
            if (typeof window.loadGitHubProject === 'function') {
                window.loadGitHubProject(project.id);
            } else if (typeof window.openProject === 'function') {
                window.openProject(project.id);
            }
        } else if (project.source === 'odoo') {
            if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.loadAndDisplay) {
                ODOO_CORE.loadAndDisplay(project.id);
            } else {
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
        showProjectSelectionDialog,
        _serverUrl: SERVER_URL
    };

    // ========================================================================
    // AUTO-INIT
    // ========================================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initDelay);
        });
    } else {
        setTimeout(init, CONFIG.initDelay);
    }

})();
