// ============================================================================
// ODOO-INTEGRATION.js v3.1.0
// Integrazione Odoo ↔ Dashboard/App Rilievo
// 
// NOVITÀ v3.1.0:
// - Usa ODOO_PROJECT_FORM per form unificato
// - Fix errore sintassi console.log
// - Precompila dati cliente da Odoo
// ============================================================================

(function() {
    'use strict';
    
    const VERSION = '3.1.0';
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
            const serverUrl = 'https://jody-gowaned-hypsometrically.ngrok-free.dev';
            const response = await fetch(`${serverUrl}/api/customer/${odooId}`, {
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
        
        // Cerca su GitHub
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
        }
        
        // Cerca su Odoo
        try {
            if (typeof ODOO_CORE !== 'undefined' && ODOO_CORE.progetti) {
                const odooProjects = await ODOO_CORE.progetti.findByCustomer(odooCustomerId);
                if (odooProjects && odooProjects.length > 0) {
                    odooProjects.forEach(p => {
                        projects.push({
                            source: 'odoo',
                            id: p.id,
                            name: p.name,
                            data: p
                        });
                    });
                }
            }
        } catch (error) {
            console.warn('⚠️ Ricerca progetti Odoo fallita:', error);
        }
        
        return projects;
    }

    // ========================================================================
    // MOSTRA DIALOG SELEZIONE PROGETTI
    // ========================================================================
    
    function showProjectSelectionDialog(customer, projects, onSelect, onNew) {
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
                const project = projects.find(p => p.id == id && p.source === source);
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
                    // Salva su GitHub
                    if (typeof window.saveProjectToGitHub === 'function') {
                        await window.saveProjectToGitHub(projectData);
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
            animation: slideIn 0.3s ease;
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
        showNotification
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
