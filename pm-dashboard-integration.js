/**
 * PROJECT MANAGER - DASHBOARD INTEGRATION
 * ═══════════════════════════════════════════════════════════════
 * Integra PROJECT_MANAGER nella Dashboard Rilievi
 * 
 * - Bottone "Nuovo Progetto" nella sidebar
 * - Bottone "Nuova Posizione" nella lista posizioni
 * - Modal per creazione progetto/posizione
 * 
 * @version 1.1.0
 * @requires project-manager.js
 * @repository shared-database
 */

const PM_INTEGRATION_VERSION = '1.1.0';

// ═══════════════════════════════════════════════════════════════
// INIZIALIZZAZIONE AL CARICAMENTO
// ═══════════════════════════════════════════════════════════════

(function initPMIntegration() {
    
    // Aspetta che il DOM sia pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
    
    function setup() {
        console.log(`🔧 PM Integration v${PM_INTEGRATION_VERSION} - Inizializzazione...`);
        
        // 1. Inietta CSS
        injectStyles();
        
        // 2. Inietta HTML modals
        injectModals();
        
        // 3. Override funzioni dashboard
        overrideDashboardFunctions();
        
        console.log('✅ PM Integration inizializzato');
    }
})();

// ═══════════════════════════════════════════════════════════════
// CSS STYLES
// ═══════════════════════════════════════════════════════════════

function injectStyles() {
    if (document.getElementById('pm-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'pm-styles';
    style.textContent = `
        /* Modal Overlay */
        .pm-modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }
        .pm-modal-overlay.active { display: flex; }
        
        /* Modal */
        .pm-modal {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: pmModalEnter 0.3s ease-out;
        }
        @keyframes pmModalEnter {
            from { opacity: 0; transform: scale(0.95) translateY(-20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        /* Modal Header */
        .pm-modal-header {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-radius: 16px 16px 0 0;
        }
        .pm-modal-header.green {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .pm-modal-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .pm-modal-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 36px; height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .pm-modal-close:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
        }
        
        /* Modal Body */
        .pm-modal-body { padding: 1.5rem; }
        
        /* Form */
        .pm-form-group { margin-bottom: 1.25rem; }
        .pm-form-label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        .pm-form-input, .pm-form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
            background: white;
            box-sizing: border-box;
        }
        .pm-form-input:focus, .pm-form-select:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .pm-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        /* Modal Footer */
        .pm-modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            background: #f9fafb;
            border-radius: 0 0 16px 16px;
        }
        
        /* Buttons */
        .pm-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        .pm-btn-secondary { background: #e5e7eb; color: #374151; }
        .pm-btn-secondary:hover { background: #d1d5db; }
        .pm-btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        .pm-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        /* Products Grid */
        .pm-products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }
        .pm-product-checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #f3f4f6;
            border-radius: 6px;
            cursor: pointer;
        }
        .pm-product-checkbox:hover { background: #e5e7eb; }
        
        /* Sidebar New Project Button */
        .pm-sidebar-new-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            color: white !important;
            font-weight: 700 !important;
            padding: 0.75rem !important;
            text-align: center;
        }
        .pm-sidebar-new-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
        }
        
        /* Position List New Button */
        .pm-add-position-btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: 2px dashed rgba(255,255,255,0.5);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .pm-add-position-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            border-style: solid;
        }
    `;
    document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// HTML MODALS
// ═══════════════════════════════════════════════════════════════

function injectModals() {
    if (document.getElementById('pm-modals')) return;
    
    const container = document.createElement('div');
    container.id = 'pm-modals';
    container.innerHTML = `
        <!-- Modal Nuovo Progetto -->
        <div id="pmNewProjectModal" class="pm-modal-overlay" onclick="if(event.target===this)closePMProjectModal()">
            <div class="pm-modal">
                <div class="pm-modal-header">
                    <div class="pm-modal-title"><span>📁</span><span>Nuovo Progetto</span></div>
                    <button class="pm-modal-close" onclick="closePMProjectModal()">×</button>
                </div>
                <div class="pm-modal-body">
                    <div class="pm-form-group">
                        <label class="pm-form-label">Nome Progetto *</label>
                        <input type="text" id="pmProjectName" class="pm-form-input" placeholder="Es. Ristrutturazione Rossi">
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Cliente *</label>
                        <input type="text" id="pmProjectClient" class="pm-form-input" placeholder="Es. Mario Rossi">
                    </div>
                    <div class="pm-form-row">
                        <div class="pm-form-group">
                            <label class="pm-form-label">Telefono</label>
                            <input type="tel" id="pmProjectPhone" class="pm-form-input" placeholder="333 1234567">
                        </div>
                        <div class="pm-form-group">
                            <label class="pm-form-label">Email</label>
                            <input type="email" id="pmProjectEmail" class="pm-form-input" placeholder="mario@email.it">
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Indirizzo</label>
                        <input type="text" id="pmProjectAddress" class="pm-form-input" placeholder="Via Roma 1, Bergamo">
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Prodotti</label>
                        <div class="pm-products-grid">
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdInfissi" checked><span>🪟 Infissi</span></label>
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdPersiane"><span>🚪 Persiane</span></label>
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdTapparelle"><span>🔽 Tapparelle</span></label>
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdZanzariere"><span>🦟 Zanzariere</span></label>
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdCassonetti"><span>📦 Cassonetti</span></label>
                            <label class="pm-product-checkbox"><input type="checkbox" id="pmProdBlindate"><span>🔐 Blindate</span></label>
                        </div>
                    </div>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-btn-secondary" onclick="closePMProjectModal()">Annulla</button>
                    <button class="pm-btn pm-btn-primary" onclick="createPMProject()">✅ Crea Progetto</button>
                </div>
            </div>
        </div>
        
        <!-- Modal Nuova Posizione -->
        <div id="pmNewPositionModal" class="pm-modal-overlay" onclick="if(event.target===this)closePMPositionModal()">
            <div class="pm-modal">
                <div class="pm-modal-header green">
                    <div class="pm-modal-title"><span>📍</span><span>Nuova Posizione</span></div>
                    <button class="pm-modal-close" onclick="closePMPositionModal()">×</button>
                </div>
                <div class="pm-modal-body">
                    <div class="pm-form-row">
                        <div class="pm-form-group">
                            <label class="pm-form-label">Ambiente *</label>
                            <select id="pmPosAmbiente" class="pm-form-select">
                                <option value="">-- Seleziona --</option>
                                <option>Soggiorno</option>
                                <option>Cucina</option>
                                <option>Camera</option>
                                <option>Camera Matrimoniale</option>
                                <option>Cameretta</option>
                                <option>Bagno</option>
                                <option>Studio</option>
                                <option>Ingresso</option>
                                <option>Corridoio</option>
                                <option>Balcone</option>
                                <option>Terrazzo</option>
                                <option>Cantina</option>
                                <option>Garage</option>
                            </select>
                        </div>
                        <div class="pm-form-group">
                            <label class="pm-form-label">Piano</label>
                            <select id="pmPosPiano" class="pm-form-select">
                                <option value="">-- Seleziona --</option>
                                <option>Interrato</option>
                                <option>Piano Terra</option>
                                <option>Piano Rialzato</option>
                                <option>Primo Piano</option>
                                <option>Secondo Piano</option>
                                <option>Terzo Piano</option>
                                <option>Mansarda</option>
                            </select>
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Note</label>
                        <input type="text" id="pmPosNote" class="pm-form-input" placeholder="Note aggiuntive...">
                    </div>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-btn-secondary" onclick="closePMPositionModal()">Annulla</button>
                    <button class="pm-btn pm-btn-primary" onclick="createPMPosition()">✅ Aggiungi</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);
}

// ═══════════════════════════════════════════════════════════════
// OVERRIDE DASHBOARD FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function overrideDashboardFunctions() {
    
    // 1. Override updateSidebarMenu per aggiungere bottone Nuovo Progetto
    if (typeof window.updateSidebarMenu === 'function') {
        const originalUpdateSidebar = window.updateSidebarMenu;
        
        window.updateSidebarMenu = function(projects) {
            const submenu = document.getElementById('githubProjectsList');
            if (!submenu) return;
            
            // Bottone Nuovo Progetto in cima
            let html = `
                <a href="#" class="pm-sidebar-new-btn" onclick="openPMProjectModal(); return false;">
                    ➕ Nuovo Progetto
                </a>
            `;
            
            if (projects.length === 0) {
                html += '<div style="padding:1rem;text-align:center;color:#9ca3af;font-size:0.875rem;">Nessun progetto</div>';
                submenu.innerHTML = html;
                return;
            }
            
            const MAX_VISIBLE = 8;
            const showAll = submenu.dataset.showAll === 'true';
            const visibleProjects = showAll ? projects : projects.slice(0, MAX_VISIBLE);
            
            html += visibleProjects.map(proj => `
                <a href="#" onclick="loadGitHubProject('${proj.id}'); closeSidebar(); return false;">
                    👤 ${proj.cliente || proj.nome}
                </a>
            `).join('');
            
            if (projects.length > MAX_VISIBLE) {
                if (showAll) {
                    html += `<a href="#" onclick="toggleProjectsList(false); return false;" style="background:#f3f4f6;color:#6b7280;font-weight:600;text-align:center;">▲ Mostra meno</a>`;
                } else {
                    html += `<a href="#" onclick="toggleProjectsList(true); return false;" style="background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;font-weight:600;text-align:center;">▼ Mostra tutti (${projects.length})</a>`;
                }
            }
            
            submenu.innerHTML = html;
            console.log(`✅ PM: Sidebar aggiornata con ${projects.length} progetti + bottone Nuovo`);
        };
        
        console.log('✅ PM: updateSidebarMenu overridden');
    }
    
    // 2. Override renderPositionsList per aggiungere bottone Nuova Posizione
    if (typeof window.renderPositionsList === 'function') {
        const originalRenderPositions = window.renderPositionsList;
        
        window.renderPositionsList = function() {
            const container = document.getElementById('positionsList');
            const countSpan = document.getElementById('positionsCount');
            
            if (!container || typeof filteredPositions === 'undefined') {
                return originalRenderPositions.call(this);
            }
            
            countSpan.textContent = `(${filteredPositions.length})`;
            
            let html = filteredPositions.map((pos, index) => `
                <div class="position-list-item ${index === currentPositionIndex ? 'active' : ''}" 
                     onclick="selectPosition(${index})">
                    <div class="position-item-details" style="padding: 0.75rem;">
                        <strong>${pos.ambiente || pos.nome || pos.stanza || 'Posizione ' + (index + 1)}</strong>
                    </div>
                </div>
            `).join('');
            
            // Bottone Nuova Posizione
            html += `
                <button class="pm-add-position-btn" onclick="openPMPositionModal()">
                    ➕ Nuova Posizione
                </button>
            `;
            
            container.innerHTML = html;
        };
        
        console.log('✅ PM: renderPositionsList overridden');
    }
}

// ═══════════════════════════════════════════════════════════════
// MODAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

window.openPMProjectModal = function() {
    document.getElementById('pmNewProjectModal').classList.add('active');
    setTimeout(() => document.getElementById('pmProjectName').focus(), 100);
    if (typeof closeSidebar === 'function') closeSidebar();
};

window.closePMProjectModal = function() {
    document.getElementById('pmNewProjectModal').classList.remove('active');
};

window.openPMPositionModal = function() {
    if (!window.currentData && !window.projectData) {
        if (typeof showAlert === 'function') {
            showAlert('warning', '⚠️ Prima carica un progetto');
        } else {
            alert('Prima carica un progetto');
        }
        return;
    }
    document.getElementById('pmNewPositionModal').classList.add('active');
    setTimeout(() => document.getElementById('pmPosAmbiente').focus(), 100);
};

window.closePMPositionModal = function() {
    document.getElementById('pmNewPositionModal').classList.remove('active');
};

// ═══════════════════════════════════════════════════════════════
// CREATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Salva SOLO il nuovo progetto su GitHub (senza toccare altri progetti)
 */
async function saveNewProjectToGitHub(project) {
    // Cerca configurazione GitHub in TUTTI i posti possibili
    let token = null;
    let owner = 'Openporte2025';
    let repo = 'dati-cantieri';
    
    // 1. Prova window.GITHUB_DASHBOARD_CONFIG
    if (typeof window.GITHUB_DASHBOARD_CONFIG !== 'undefined' && window.GITHUB_DASHBOARD_CONFIG.token) {
        token = window.GITHUB_DASHBOARD_CONFIG.token;
        owner = window.GITHUB_DASHBOARD_CONFIG.owner || owner;
        repo = window.GITHUB_DASHBOARD_CONFIG.repo || repo;
        console.log('🔑 Token trovato in window.GITHUB_DASHBOARD_CONFIG');
    }
    
    // 2. Prova GITHUB_DASHBOARD_CONFIG locale (se esiste nel contesto)
    if (!token && typeof GITHUB_DASHBOARD_CONFIG !== 'undefined' && GITHUB_DASHBOARD_CONFIG.token) {
        token = GITHUB_DASHBOARD_CONFIG.token;
        owner = GITHUB_DASHBOARD_CONFIG.owner || owner;
        repo = GITHUB_DASHBOARD_CONFIG.repo || repo;
        console.log('🔑 Token trovato in GITHUB_DASHBOARD_CONFIG locale');
    }
    
    // 3. Prova localStorage direttamente
    if (!token) {
        try {
            const savedToken = localStorage.getItem('github_dashboard_token');
            if (savedToken) {
                token = savedToken;
                console.log('🔑 Token trovato in localStorage (github_dashboard_token)');
            }
        } catch(e) {}
    }
    
    // 4. Prova openPorteData (App Rilievo)
    if (!token) {
        try {
            const appData = JSON.parse(localStorage.getItem('openPorteData') || '{}');
            if (appData.github?.token) {
                token = appData.github.token;
                owner = appData.github.owner || owner;
                repo = appData.github.repo || repo;
                console.log('🔑 Token trovato in openPorteData');
            }
        } catch(e) {}
    }
    
    // 5. Prova window.GITHUB_CONFIG
    if (!token && typeof window.GITHUB_CONFIG !== 'undefined' && window.GITHUB_CONFIG.token) {
        token = window.GITHUB_CONFIG.token;
        owner = window.GITHUB_CONFIG.owner || owner;
        repo = window.GITHUB_CONFIG.repo || repo;
        console.log('🔑 Token trovato in window.GITHUB_CONFIG');
    }
    
    if (!token) {
        console.error('❌ Token non trovato in nessuna posizione!');
        console.log('Cercato in: window.GITHUB_DASHBOARD_CONFIG, GITHUB_DASHBOARD_CONFIG, localStorage, openPorteData, window.GITHUB_CONFIG');
        throw new Error('Token GitHub non configurato. Vai in Menu → Impostazioni → Token GitHub');
    }
    
    const filename = `progetti/progetto-${project.id}.json`;
    
    console.log(`📤 Salvando nuovo progetto: ${owner}/${repo}/${filename}`);
    
    // Prepara contenuto
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(project, null, 2))));
    
    // Crea file su GitHub
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Nuovo progetto ${project.id} creato da Dashboard`,
            content: content
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore GitHub');
    }
    
    console.log(`✅ Progetto ${project.id} salvato su GitHub`);
    return true;
}

window.createPMProject = async function() {
    const name = document.getElementById('pmProjectName').value.trim();
    const client = document.getElementById('pmProjectClient').value.trim();
    
    if (!name) {
        alert('❌ Nome progetto obbligatorio');
        document.getElementById('pmProjectName').focus();
        return;
    }
    if (!client) {
        alert('❌ Cliente obbligatorio');
        document.getElementById('pmProjectClient').focus();
        return;
    }
    
    // Genera ID corretto per l'anno corrente
    const currentYear = new Date().getFullYear();
    const existingProjects = window.githubProjects || [];
    
    // Filtra solo progetti dell'anno corrente
    const currentYearProjects = existingProjects.filter(p => 
        p.id && p.id.startsWith(currentYear + 'P')
    );
    
    // Trova il numero più alto
    let maxNum = 0;
    currentYearProjects.forEach(p => {
        const match = p.id.match(/^(\d{4})P(\d{3})$/);
        if (match) {
            const num = parseInt(match[2]);
            if (num > maxNum) maxNum = num;
        }
    });
    
    const nextNum = maxNum + 1;
    const projectId = `${currentYear}P${String(nextNum).padStart(3, '0')}`;
    
    console.log(`🆔 Generato ID: ${projectId} (anno ${currentYear}, esistenti: ${currentYearProjects.length}, max: ${maxNum})`);
    
    // Crea progetto
    const now = new Date().toISOString();
    const project = {
        id: projectId,
        name: name,
        client: client,
        customerName: client,
        clientData: {
            nome: client,
            telefono: document.getElementById('pmProjectPhone').value.trim(),
            email: document.getElementById('pmProjectEmail').value.trim(),
            indirizzo: document.getElementById('pmProjectAddress').value.trim()
        },
        prodotti: {
            infissi: document.getElementById('pmProdInfissi').checked,
            persiane: document.getElementById('pmProdPersiane').checked,
            tapparelle: document.getElementById('pmProdTapparelle').checked,
            zanzariere: document.getElementById('pmProdZanzariere').checked,
            cassonetti: document.getElementById('pmProdCassonetti').checked,
            blindate: document.getElementById('pmProdBlindate').checked
        },
        configInfissi: {},
        configPersiane: {},
        configTapparelle: {},
        configZanzariere: {},
        configCassonetti: {},
        positions: [],
        posizioni: [],
        createdAt: now,
        metadata: {
            version: 1,
            created: now,
            updated: now,
            device: 'Dashboard',
            syncStatus: 'synced'
        },
        changeLog: [{
            timestamp: now,
            device: 'Dashboard',
            action: 'Creato nuovo progetto'
        }]
    };
    
    console.log('📦 Nuovo progetto:', project);
    closePMProjectModal();
    
    // Salva su GitHub con funzione dedicata
    try {
        await saveNewProjectToGitHub(project);
        alert(`✅ Progetto "${name}" creato! (ID: ${projectId})`);
        
        // Ricarica lista progetti
        if (typeof loadProjectsFromGitHub === 'function') {
            console.log('🔄 Ricaricando lista progetti...');
            await loadProjectsFromGitHub();
        }
        
        // Carica il progetto appena creato
        if (typeof loadGitHubProject === 'function') {
            console.log('📂 Caricando progetto:', projectId);
            setTimeout(() => loadGitHubProject(projectId), 500);
        }
        
    } catch (err) {
        console.error('❌ Errore salvataggio:', err);
        alert('❌ Errore: ' + err.message);
    }
    
    // Reset form
    document.getElementById('pmProjectName').value = '';
    document.getElementById('pmProjectClient').value = '';
    document.getElementById('pmProjectPhone').value = '';
    document.getElementById('pmProjectEmail').value = '';
    document.getElementById('pmProjectAddress').value = '';
};

window.createPMPosition = async function() {
    const project = window.currentData || window.projectData;
    if (!project) {
        if (typeof showAlert === 'function') showAlert('error', '❌ Nessun progetto');
        return;
    }
    
    const ambiente = document.getElementById('pmPosAmbiente').value;
    const piano = document.getElementById('pmPosPiano').value;
    const note = document.getElementById('pmPosNote').value.trim();
    
    if (!ambiente) {
        if (typeof showAlert === 'function') showAlert('error', '❌ Seleziona ambiente');
        return;
    }
    
    // Crea posizione
    let newPos;
    if (typeof PROJECT_MANAGER !== 'undefined') {
        newPos = PROJECT_MANAGER.createPosition(project, ambiente, piano, note);
    } else {
        // Fallback
        if (!project.positions) project.positions = [];
        if (!project.posizioni) project.posizioni = [];
        const num = project.positions.length + 1;
        newPos = {
            id: `${project.id}_${String(num).padStart(2,'0')}`,
            name: `Pos. ${num}`,
            ambiente, piano, note,
            quantita: '1', misure: {},
            infisso: null, persiana: null, tapparella: null, zanzariera: null, cassonetto: null
        };
        project.positions.push(newPos);
        project.posizioni.push(newPos);
    }
    
    console.log('📍 Nuova posizione:', newPos);
    closePMPositionModal();
    
    // Aggiorna UI
    if (typeof allPositionsData !== 'undefined') allPositionsData.push(newPos);
    if (typeof filteredPositions !== 'undefined') filteredPositions.push(newPos);
    if (typeof renderPositionsList === 'function') renderPositionsList();
    
    const idx = (filteredPositions?.length || 1) - 1;
    if (typeof selectPosition === 'function') selectPosition(idx);
    
    // Salva
    if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.hasToken()) {
        try {
            await GITHUB_SYNC.salvaProgetto(project);
        } catch (err) {
            console.error(err);
        }
    }
    
    if (typeof showAlert === 'function') showAlert('success', `✅ "${ambiente}" aggiunta!`);
    
    // Reset
    document.getElementById('pmPosAmbiente').value = '';
    document.getElementById('pmPosPiano').value = '';
    document.getElementById('pmPosNote').value = '';
};

console.log(`📦 PM Dashboard Integration v${PM_INTEGRATION_VERSION} caricato`);
