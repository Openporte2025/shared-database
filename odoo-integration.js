// ============================================================================
// ODOO-INTEGRATION.js v3.0.0
// Integrazione Odoo ↔ Dashboard Rilievi
// 
// NOVITÀ v3.0.0:
// - Usa ODOO_CORE per tutte le chiamate API
// - Cerca progetti sia su GitHub che su Odoo
// - Salvataggio intelligente: Odoo se progetto esiste, altrimenti GitHub
// - Supporto offline con sync automatico
//
// LOGICA SALVATAGGIO (Opzione B):
// - Progetto Odoo esiste? → Salva su Odoo (con cache offline)
// - Progetto Odoo NON esiste? → Salva su GitHub (dati-cantieri)
// ============================================================================

(function() {
    'use strict';

    const VERSION = '3.0.0';
    console.log(`🔌 Odoo Integration v${VERSION} caricato`);

    // ========================================================================
    // CONFIGURAZIONE
    // ========================================================================
    
    const CONFIG = {
        // Ritardo prima di processare (ms)
        initDelay: 3500,
        
        // Timeout attesa progetti (ms)
        projectsTimeout: 10000
    };

    // ========================================================================
    // VERIFICA DIPENDENZE
    // ========================================================================

    function checkDependencies() {
        if (typeof ODOO_CORE === 'undefined') {
            console.error('❌ ODOO_CORE non trovato! Assicurati di caricare odoo-core.js prima di odoo-integration.js');
            return false;
        }
        console.log('✅ ODOO_CORE disponibile:', ODOO_CORE.version);
        return true;
    }

    // ========================================================================
    // UTILITY - Lettura parametri URL
    // ========================================================================

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            odoo_id: params.get('odoo_id'),
            odoo_project_id: params.get('odoo_project_id'),
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
    // API - Usa ODOO_CORE
    // ========================================================================

    async function fetchCustomer(odooId) {
        try {
            console.log(`📡 Richiesta dati cliente ID: ${odooId}`);
            const result = await ODOO_CORE.clienti.get(odooId);
            
            if (result && result.customer) {
                console.log('✅ Dati cliente ricevuti:', result.customer);
                return result.customer;
            }
            return result;
        } catch (error) {
            console.error('❌ Errore recupero cliente:', error);
            return null;
        }
    }

    async function searchCustomers(query) {
        try {
            return await ODOO_CORE.clienti.search(query);
        } catch (error) {
            console.error('❌ Errore ricerca clienti:', error);
            return [];
        }
    }

    // ========================================================================
    // PROGETTI - Ricerca su GitHub + Odoo
    // ========================================================================

    /**
     * Aspetta che i progetti GitHub siano caricati
     */
    async function waitForProjects(maxWait = 10000) {
        const start = Date.now();
        while (Date.now() - start < maxWait) {
            if (window.githubProjects && window.githubProjects.length > 0) {
                console.log(`✅ Progetti GitHub caricati: ${window.githubProjects.length}`);
                return true;
            }
            await new Promise(r => setTimeout(r, 500));
        }
        console.warn('⚠️ Timeout: progetti GitHub non caricati');
        return false;
    }

    /**
     * Cerca progetti su GitHub per odoo_customer_id
     */
    function findGitHubProjectsByOdooId(odooCustomerId) {
        if (!window.githubProjects || !Array.isArray(window.githubProjects)) {
            return [];
        }
        
        return window.githubProjects.filter(p => 
            p.odoo_id == odooCustomerId || 
            p.odoo_customer_id == odooCustomerId ||
            p.rawData?.odoo_id == odooCustomerId ||
            p.rawData?.odoo_customer_id == odooCustomerId
        );
    }

    /**
     * Cerca progetti su Odoo per cliente
     */
    async function findOdooProjectsByCustomer(odooCustomerId) {
        try {
            return await ODOO_CORE.progetti.findByCustomer(odooCustomerId);
        } catch (error) {
            console.error('❌ Errore ricerca progetti Odoo:', error);
            return [];
        }
    }

    /**
     * Cerca progetti OVUNQUE (GitHub + Odoo)
     * @returns {Object} { github: [], odoo: [], merged: [] }
     */
    async function findAllProjects(odooCustomerId) {
        console.log('🔍 Cercando progetti per cliente:', odooCustomerId);
        
        // Cerca in parallelo
        const [githubProjects, odooProjects] = await Promise.all([
            Promise.resolve(findGitHubProjectsByOdooId(odooCustomerId)),
            findOdooProjectsByCustomer(odooCustomerId)
        ]);
        
        console.log(`📂 Trovati: ${githubProjects.length} su GitHub, ${odooProjects.length} su Odoo`);
        
        // Merge evitando duplicati
        const merged = [...odooProjects];
        
        // Aggiungi progetti GitHub che non sono su Odoo
        githubProjects.forEach(gp => {
            const alreadyInOdoo = odooProjects.some(op => 
                op.id === gp.odoo_project_id || 
                op.name === gp.name
            );
            if (!alreadyInOdoo) {
                merged.push({
                    ...gp,
                    _source: 'github',
                    hasRilievo: true // su GitHub c'è sempre il rilievo
                });
            }
        });
        
        return { github: githubProjects, odoo: odooProjects, merged };
    }

    // ========================================================================
    // SALVATAGGIO INTELLIGENTE (Logica B)
    // ========================================================================

    /**
     * Salva progetto con logica intelligente:
     * - Se ha odoo_project_id → salva su Odoo
     * - Altrimenti → salva su GitHub
     * 
     * @param {Object} project - Progetto da salvare
     * @returns {Object} { success, destination: 'odoo'|'github', message }
     */
    async function saveProject(project) {
        if (!project) {
            return { success: false, error: 'Progetto non valido' };
        }
        
        const odooProjectId = project.odoo_project_id;
        
        // HA progetto Odoo → salva su Odoo
        if (odooProjectId) {
            console.log('💾 Salvataggio su Odoo, progetto:', odooProjectId);
            
            const result = await ODOO_CORE.progetti.saveRilievo(
                odooProjectId,
                project,
                { source: 'dashboard' }
            );
            
            if (result.success) {
                showNotification(
                    result.offline 
                        ? '📦 Salvato offline - sincronizzerà automaticamente' 
                        : '✅ Salvato su Odoo',
                    result.offline ? 'warning' : 'success'
                );
            } else if (result.conflict) {
                // Gestisci conflitto
                const choice = await ODOO_CORE.conflicts.showConflictDialog(
                    result.serverData,
                    result.localData
                );
                
                if (choice !== 'cancel') {
                    await ODOO_CORE.conflicts.resolve(
                        odooProjectId,
                        choice,
                        result.localData,
                        result.serverData
                    );
                }
            }
            
            return { 
                ...result, 
                destination: 'odoo' 
            };
        }
        
        // NON ha progetto Odoo → salva su GitHub
        console.log('💾 Salvataggio su GitHub (no progetto Odoo)');
        
        try {
            // Usa il sistema esistente GitHub
            if (typeof window.saveProjectToGitHub === 'function') {
                await window.saveProjectToGitHub(project);
                showNotification('✅ Salvato su GitHub', 'success');
                return { success: true, destination: 'github' };
            } else if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.saveProject) {
                await GITHUB_SYNC.saveProject(project);
                showNotification('✅ Salvato su GitHub', 'success');
                return { success: true, destination: 'github' };
            } else {
                throw new Error('Nessun metodo di salvataggio GitHub disponibile');
            }
        } catch (error) {
            console.error('❌ Errore salvataggio GitHub:', error);
            showNotification('❌ Errore salvataggio: ' + error.message, 'error');
            return { success: false, error: error.message, destination: 'github' };
        }
    }

    /**
     * Carica progetto da Odoo o GitHub
     * @param {string|number} projectId - ID progetto (GitHub) o odoo_project_id
     * @param {string} source - 'odoo' | 'github' | 'auto'
     */
    async function loadProject(projectId, source = 'auto') {
        console.log('📂 Caricamento progetto:', projectId, 'da:', source);
        
        // Se source è 'odoo' o 'auto' con ID numerico → prova Odoo
        if (source === 'odoo' || (source === 'auto' && typeof projectId === 'number')) {
            try {
                const result = await ODOO_CORE.progetti.get(projectId);
                
                if (result.conflict) {
                    const choice = await ODOO_CORE.conflicts.showConflictDialog(
                        result.data,
                        result.localData
                    );
                    
                    if (choice === 'cancel') {
                        return null;
                    }
                    
                    await ODOO_CORE.conflicts.resolve(
                        projectId,
                        choice,
                        result.localData,
                        result.data
                    );
                    
                    return loadProject(projectId, source);
                }
                
                if (result.data) {
                    const project = result.data.rilievo || {
                        id: result.data.name,
                        name: result.data.name,
                        positions: []
                    };
                    
                    // Aggiungi riferimenti Odoo
                    project.odoo_project_id = result.data.id;
                    project.odoo_customer_id = result.data.partner_id;
                    project._source = 'odoo';
                    project._loadedAt = new Date().toISOString();
                    
                    if (result.source === 'cache') {
                        showNotification('📦 Dati da cache locale', 'info');
                    }
                    
                    return project;
                }
            } catch (error) {
                console.error('❌ Errore caricamento da Odoo:', error);
                if (source === 'odoo') {
                    throw error;
                }
                // Se auto, prova GitHub
            }
        }
        
        // Prova GitHub
        if (source === 'github' || source === 'auto') {
            if (typeof window.loadGitHubProject === 'function') {
                window.loadGitHubProject(projectId);
                return { _redirected: true };
            }
        }
        
        return null;
    }

    // ========================================================================
    // COLLEGAMENTO PROGETTO GITHUB → ODOO
    // ========================================================================

    /**
     * Collega un progetto GitHub esistente a un progetto Odoo
     * (copia il rilievo da GitHub a Odoo)
     */
    async function linkGitHubToOdoo(githubProject, odooProjectId) {
        console.log('🔗 Collegamento GitHub → Odoo:', githubProject.id, '→', odooProjectId);
        
        // Aggiungi riferimento Odoo al progetto
        const projectToSave = {
            ...githubProject,
            odoo_project_id: odooProjectId
        };
        
        // Salva su Odoo
        const result = await ODOO_CORE.progetti.saveRilievo(
            odooProjectId,
            projectToSave,
            { source: 'link-github-odoo' }
        );
        
        if (result.success) {
            // Aggiorna anche su GitHub con il riferimento
            if (typeof window.saveProjectToGitHub === 'function') {
                await window.saveProjectToGitHub(projectToSave);
            }
            
            showNotification('✅ Progetto collegato a Odoo', 'success');
        }
        
        return result;
    }

    // ========================================================================
    // UI - Dialog e Notifiche
    // ========================================================================

    function showNotification(message, type = 'info') {
        // Prova ODOO_CORE notification
        if (typeof ODOO_CORE !== 'undefined') {
            // Usa notifica semplice
        }
        
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

    /**
     * Dialog per scegliere quale progetto aprire
     */
    async function showProjectSelectionDialog(projects, customer) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'odoo-project-dialog';
            overlay.innerHTML = `
                <style>
                    #odoo-project-dialog {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 99999;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    }
                    .project-dialog-box {
                        background: white;
                        border-radius: 16px;
                        padding: 24px;
                        max-width: 500px;
                        width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .project-dialog-title {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #1e3a5f;
                    }
                    .project-dialog-subtitle {
                        color: #666;
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    .project-list {
                        margin-bottom: 20px;
                    }
                    .project-item {
                        padding: 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 12px;
                        margin-bottom: 12px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .project-item:hover {
                        border-color: #3b82f6;
                        background: #f0f9ff;
                    }
                    .project-item-name {
                        font-weight: 600;
                        color: #1e3a5f;
                        margin-bottom: 4px;
                    }
                    .project-item-info {
                        font-size: 12px;
                        color: #666;
                    }
                    .project-item-badge {
                        display: inline-block;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        font-weight: 600;
                        margin-left: 8px;
                    }
                    .badge-odoo {
                        background: #dbeafe;
                        color: #1d4ed8;
                    }
                    .badge-github {
                        background: #f3e8ff;
                        color: #7c3aed;
                    }
                    .badge-rilievo {
                        background: #d1fae5;
                        color: #059669;
                    }
                    .project-dialog-buttons {
                        display: flex;
                        gap: 12px;
                    }
                    .dialog-btn {
                        flex: 1;
                        padding: 12px;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .btn-new {
                        background: #10b981;
                        color: white;
                    }
                    .btn-cancel {
                        background: #e5e7eb;
                        color: #374151;
                    }
                </style>
                <div class="project-dialog-box">
                    <div class="project-dialog-title">
                        📂 Progetti per ${customer.name}
                    </div>
                    <div class="project-dialog-subtitle">
                        Seleziona un progetto esistente o creane uno nuovo
                    </div>
                    <div class="project-list">
                        ${projects.merged.map(p => `
                            <div class="project-item" data-id="${p.id}" data-source="${p._source || 'odoo'}">
                                <div class="project-item-name">
                                    ${p.name || p.nome || p.id}
                                    ${p._source === 'github' 
                                        ? '<span class="project-item-badge badge-github">GitHub</span>'
                                        : '<span class="project-item-badge badge-odoo">Odoo</span>'
                                    }
                                    ${p.hasRilievo 
                                        ? '<span class="project-item-badge badge-rilievo">✓ Rilievo</span>'
                                        : ''
                                    }
                                </div>
                                <div class="project-item-info">
                                    ${p.write_date 
                                        ? 'Modificato: ' + new Date(p.write_date).toLocaleDateString('it-IT')
                                        : ''
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="project-dialog-buttons">
                        <button class="dialog-btn btn-new" data-action="new">
                            ➕ Nuovo Progetto
                        </button>
                        <button class="dialog-btn btn-cancel" data-action="cancel">
                            Annulla
                        </button>
                    </div>
                </div>
            `;
            
            // Click su progetto
            overlay.querySelectorAll('.project-item').forEach(item => {
                item.addEventListener('click', () => {
                    const projectId = item.dataset.id;
                    const source = item.dataset.source;
                    const project = projects.merged.find(p => String(p.id) === projectId);
                    overlay.remove();
                    resolve({ action: 'open', project, source });
                });
            });
            
            // Click su bottoni
            overlay.querySelectorAll('.dialog-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    overlay.remove();
                    resolve({ action });
                });
            });
            
            document.body.appendChild(overlay);
        });
    }

    // ========================================================================
    // FORM - Precompilazione
    // ========================================================================

    function fillFormFields(customer) {
        if (!customer) return;
        
        console.log('📝 Precompilazione form con:', customer);
        
        // Salva per uso successivo
        window._pendingOdooId = customer.id;
        window._pendingOdooCustomer = customer;
        
        // Nome
        const nome = customer.name || '';
        const nomeField = document.getElementById('pm-nome') || 
                         document.getElementById('clienteNome') ||
                         document.querySelector('input[name="nome"]');
        if (nomeField) nomeField.value = nome;
        
        // Telefono
        const telefono = customer.phone || customer.mobile || '';
        const telField = document.getElementById('pm-telefono') ||
                        document.getElementById('clienteTelefono') ||
                        document.querySelector('input[name="telefono"]');
        if (telField) telField.value = telefono;
        
        // Email
        const email = customer.email || '';
        const emailField = document.getElementById('pm-email') ||
                          document.getElementById('clienteEmail') ||
                          document.querySelector('input[name="email"]');
        if (emailField && email) emailField.value = email;
        
        // Indirizzo
        const indirizzo = [customer.street, customer.zip, customer.city]
            .filter(Boolean).join(', ');
        const indField = document.getElementById('pm-indirizzo') ||
                        document.getElementById('clienteIndirizzo') ||
                        document.querySelector('input[name="indirizzo"]');
        if (indField) indField.value = indirizzo;
        
        showNotification(`✅ Dati cliente "${nome}" caricati`, 'success');
    }

    function openNewProjectModal() {
        // Metodo 1: PM Dashboard
        if (typeof window.openPMProjectModal === 'function') {
            window.openPMProjectModal();
            return true;
        }
        
        // Metodo 2: Click su bottone
        const btn = document.querySelector('[onclick*="openPMProjectModal"]') ||
                   document.querySelector('.btn-nuovo-progetto') ||
                   document.getElementById('btn-new-project');
        if (btn) {
            btn.click();
            return true;
        }
        
        console.warn('⚠️ Nessun metodo per aprire modal nuovo progetto');
        return false;
    }

    // ========================================================================
    // INIZIALIZZAZIONE PRINCIPALE
    // ========================================================================

    async function init() {
        console.log('🚀 Odoo Integration v3 - Inizializzazione...');
        
        // Verifica dipendenze
        if (!checkDependencies()) {
            return;
        }
        
        const params = getUrlParams();
        console.log('📨 Parametri URL:', params);
        
        // Se non ci sono parametri Odoo, esci
        if (!params.odoo_id && !params.odoo_project_id && !params.token) {
            console.log('ℹ️ Nessun parametro Odoo in URL');
            return;
        }
        
        // Pulisci URL subito
        cleanUrl();
        
        // Mostra notifica caricamento
        showNotification('⏳ Caricamento dati da Odoo...', 'info');
        
        // Se c'è odoo_project_id → carica direttamente il progetto
        if (params.odoo_project_id) {
            try {
                const project = await loadProject(parseInt(params.odoo_project_id), 'odoo');
                if (project && !project._redirected) {
                    // Imposta come progetto corrente
                    if (typeof window.setCurrentProject === 'function') {
                        window.setCurrentProject(project);
                    }
                    showNotification(`✅ Progetto caricato da Odoo`, 'success');
                }
            } catch (error) {
                showNotification('❌ Errore caricamento progetto: ' + error.message, 'error');
            }
            return;
        }
        
        // Altrimenti usa odoo_id (cliente)
        let customer = null;
        
        if (params.odoo_id) {
            customer = await fetchCustomer(params.odoo_id);
        }
        
        if (!customer) {
            showNotification('❌ Impossibile caricare dati cliente', 'error');
            return;
        }
        
        // Salva per uso futuro
        window._odooCustomer = customer;
        
        // Aspetta progetti GitHub
        await waitForProjects(CONFIG.projectsTimeout);
        
        // Cerca progetti OVUNQUE
        const projects = await findAllProjects(customer.id);
        
        if (projects.merged.length > 0) {
            // Mostra dialog selezione
            const result = await showProjectSelectionDialog(projects, customer);
            
            if (result.action === 'open' && result.project) {
                if (result.source === 'odoo') {
                    const project = await loadProject(result.project.id, 'odoo');
                    if (project && !project._redirected && typeof window.setCurrentProject === 'function') {
                        window.setCurrentProject(project);
                    }
                } else {
                    // GitHub
                    if (typeof window.loadGitHubProject === 'function') {
                        window.loadGitHubProject(result.project.id);
                    }
                }
                showNotification(`📂 Aperto progetto "${result.project.name || result.project.id}"`, 'success');
            } else if (result.action === 'new') {
                openNewProjectModalAndFill(customer);
            }
        } else {
            // Nessun progetto esistente
            if (params.nuovo) {
                openNewProjectModalAndFill(customer);
            } else {
                showNotification(`✅ Cliente "${customer.name}" pronto - nessun progetto esistente`, 'info');
            }
        }
    }

    function openNewProjectModalAndFill(customer) {
        if (openNewProjectModal()) {
            setTimeout(() => fillFormFields(customer), 500);
        } else {
            fillFormFields(customer);
        }
    }

    // ========================================================================
    // HOOK - Intercetta salvataggio progetti
    // ========================================================================

    function setupSaveHook() {
        // Hook per intercettare salvataggi e usare logica intelligente
        const originalSave = window.saveProjectToGitHub;
        
        if (typeof originalSave === 'function') {
            window.saveProjectToGitHub = async function(project) {
                // Se ha odoo_project_id, salva su Odoo
                if (project && project.odoo_project_id) {
                    console.log('🔄 Redirect salvataggio a Odoo');
                    return await saveProject(project);
                }
                // Altrimenti salva su GitHub come prima
                return await originalSave.apply(this, arguments);
            };
            console.log('🔗 Hook saveProjectToGitHub installato');
        }
    }

    function setupProjectCreationHook() {
        const originalCreateProject = window.createPMProject;
        
        if (typeof originalCreateProject === 'function') {
            window.createPMProject = function(...args) {
                if (window._pendingOdooId && args[0]) {
                    args[0].odoo_customer_id = window._pendingOdooId;
                    args[0].odoo_customer = window._pendingOdooCustomer;
                    console.log('🔗 Aggiunto odoo_customer_id al progetto:', window._pendingOdooId);
                }
                
                const result = originalCreateProject.apply(this, args);
                
                window._pendingOdooId = null;
                window._pendingOdooCustomer = null;
                
                return result;
            };
            console.log('🔗 Hook createPMProject installato');
        }
    }

    // ========================================================================
    // SYNC - Registra callback per sync automatico
    // ========================================================================

    function setupSyncCallbacks() {
        if (typeof ODOO_CORE !== 'undefined') {
            ODOO_CORE.sync.onSync((results) => {
                console.log('🔄 Sync completato:', results);
                
                const successi = results.filter(r => r.success).length;
                const conflitti = results.filter(r => r.conflict).length;
                const errori = results.filter(r => !r.success && !r.conflict).length;
                
                if (conflitti > 0) {
                    showNotification(`⚠️ Sync: ${successi} OK, ${conflitti} conflitti`, 'warning');
                } else if (errori > 0) {
                    showNotification(`❌ Sync: ${successi} OK, ${errori} errori`, 'error');
                } else if (successi > 0) {
                    showNotification(`✅ Sync completato: ${successi} progetti`, 'success');
                }
            });
            console.log('🔗 Callback sync registrato');
        }
    }

    // ========================================================================
    // ESPOSIZIONE GLOBALE
    // ========================================================================

    window.ODOO_INTEGRATION = {
        // API
        fetchCustomer,
        searchCustomers,
        
        // Progetti
        findAllProjects,
        findGitHubProjectsByOdooId,
        findOdooProjectsByCustomer,
        loadProject,
        saveProject,
        linkGitHubToOdoo,
        
        // UI
        showNotification,
        showProjectSelectionDialog,
        fillFormFields,
        openNewProjectModal,
        waitForProjects,
        
        // Init
        init,
        
        // Config
        CONFIG,
        VERSION
    };

    // ========================================================================
    // AVVIO
    // ========================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initDelay);
            setTimeout(setupProjectCreationHook, 2000);
            setTimeout(setupSaveHook, 2000);
            setTimeout(setupSyncCallbacks, 1000);
        });
    } else {
        setTimeout(init, CONFIG.initDelay);
        setTimeout(setupProjectCreationHook, 2000);
        setTimeout(setupSaveHook, 2000);
        setTimeout(setupSyncCallbacks, 1000);
    }

})();
