/**
 * PROJECT MANAGER - DASHBOARD INTEGRATION
 * ═══════════════════════════════════════════════════════════════
 * Integra PROJECT_MANAGER nella Dashboard Rilievi
 * 
 * Funzionalità:
 * - Modal "Nuovo Progetto"
 * - Bottone "+ Nuova Posizione" nella lista posizioni
 * - Modal "Nuova Posizione" con form completo
 * - Eliminazione e duplicazione posizioni
 * 
 * @requires project-manager.js
 * @requires github-sync.js
 * @version 1.0.0
 * @date 2026-01-21
 */

const PM_INTEGRATION_VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════
// INIZIALIZZAZIONE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    console.log(`🔧 PM Integration v${PM_INTEGRATION_VERSION} - Inizializzazione...`);
    
    // Inietta CSS per i modal
    injectPMStyles();
    
    // Inietta HTML modal nel DOM
    injectPMModals();
    
    // Override renderPositionsList per aggiungere bottone + Posizione
    overrideRenderPositionsList();
    
    // Override renderProjectsList per aggiungere bottone Nuovo Progetto
    overrideRenderProjectsList();
    
    console.log('✅ PM Integration inizializzato');
});

// ═══════════════════════════════════════════════════════════════
// CSS STYLES
// ═══════════════════════════════════════════════════════════════

function injectPMStyles() {
    const style = document.createElement('style');
    style.id = 'pm-integration-styles';
    style.textContent = `
        /* Modal Overlay */
        .pm-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }
        
        .pm-modal-overlay.active {
            display: flex;
        }
        
        /* Modal Container */
        .pm-modal {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: pm-modal-enter 0.3s ease-out;
        }
        
        @keyframes pm-modal-enter {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        /* Modal Header */
        .pm-modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-radius: 16px 16px 0 0;
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
            width: 36px;
            height: 36px;
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
        .pm-modal-body {
            padding: 1.5rem;
        }
        
        /* Form Group */
        .pm-form-group {
            margin-bottom: 1.25rem;
        }
        
        .pm-form-label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .pm-form-input,
        .pm-form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
            background: white;
        }
        
        .pm-form-input:focus,
        .pm-form-select:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .pm-form-input::placeholder {
            color: #9ca3af;
        }
        
        /* Form Row (2 colonne) */
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
        
        .pm-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        
        .pm-btn-secondary {
            background: #e5e7eb;
            color: #374151;
        }
        
        .pm-btn-secondary:hover {
            background: #d1d5db;
        }
        
        .pm-btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .pm-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        .pm-btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }
        
        .pm-btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        /* Bottone Nuovo Progetto */
        .pm-new-project-btn {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .pm-new-project-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }
        
        /* Bottone Nuova Posizione */
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
            transition: all 0.2s;
            margin-top: 0.5rem;
        }
        
        .pm-add-position-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            border-style: solid;
        }
        
        /* Actions posizione */
        .pm-position-actions {
            display: flex;
            gap: 0.25rem;
            margin-left: auto;
        }
        
        .pm-position-action-btn {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            opacity: 0.5;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        
        .pm-position-action-btn:hover {
            opacity: 1;
            transform: scale(1.2);
        }
        
        /* Helper text */
        .pm-form-helper {
            font-size: 0.8rem;
            color: #6b7280;
            margin-top: 0.25rem;
        }
        
        /* Checkbox custom */
        .pm-checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pm-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        /* Prodotti checkboxes */
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
            transition: all 0.2s;
        }
        
        .pm-product-checkbox:hover {
            background: #e5e7eb;
        }
        
        .pm-product-checkbox input:checked + span {
            color: #10b981;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// HTML MODALS
// ═══════════════════════════════════════════════════════════════

function injectPMModals() {
    const modalsHTML = `
        <!-- Modal Nuovo Progetto -->
        <div id="pmNewProjectModal" class="pm-modal-overlay" onclick="if(event.target === this) closePMModal('pmNewProjectModal')">
            <div class="pm-modal">
                <div class="pm-modal-header">
                    <div class="pm-modal-title">
                        <span>📁</span>
                        <span>Nuovo Progetto</span>
                    </div>
                    <button class="pm-modal-close" onclick="closePMModal('pmNewProjectModal')">×</button>
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
                            <input type="tel" id="pmProjectPhone" class="pm-form-input" placeholder="Es. 333 1234567">
                        </div>
                        <div class="pm-form-group">
                            <label class="pm-form-label">Email</label>
                            <input type="email" id="pmProjectEmail" class="pm-form-input" placeholder="Es. mario@email.it">
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Indirizzo</label>
                        <input type="text" id="pmProjectAddress" class="pm-form-input" placeholder="Es. Via Roma 1, Bergamo">
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Prodotti da rilevare</label>
                        <div class="pm-products-grid">
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdInfissi" checked>
                                <span>🪟 Infissi</span>
                            </label>
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdPersiane">
                                <span>🚪 Persiane</span>
                            </label>
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdTapparelle">
                                <span>🔽 Tapparelle</span>
                            </label>
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdZanzariere">
                                <span>🦟 Zanzariere</span>
                            </label>
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdCassonetti">
                                <span>📦 Cassonetti</span>
                            </label>
                            <label class="pm-product-checkbox">
                                <input type="checkbox" id="pmProdBlindate">
                                <span>🔐 Blindate</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-btn-secondary" onclick="closePMModal('pmNewProjectModal')">Annulla</button>
                    <button class="pm-btn pm-btn-primary" onclick="createNewProject()">✅ Crea Progetto</button>
                </div>
            </div>
        </div>
        
        <!-- Modal Nuova Posizione -->
        <div id="pmNewPositionModal" class="pm-modal-overlay" onclick="if(event.target === this) closePMModal('pmNewPositionModal')">
            <div class="pm-modal">
                <div class="pm-modal-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <div class="pm-modal-title">
                        <span>📍</span>
                        <span>Nuova Posizione</span>
                    </div>
                    <button class="pm-modal-close" onclick="closePMModal('pmNewPositionModal')">×</button>
                </div>
                <div class="pm-modal-body">
                    <div class="pm-form-row">
                        <div class="pm-form-group">
                            <label class="pm-form-label">Ambiente *</label>
                            <select id="pmPosAmbiente" class="pm-form-select">
                                <option value="">-- Seleziona --</option>
                                <option value="Soggiorno">Soggiorno</option>
                                <option value="Cucina">Cucina</option>
                                <option value="Camera">Camera</option>
                                <option value="Camera Matrimoniale">Camera Matrimoniale</option>
                                <option value="Cameretta">Cameretta</option>
                                <option value="Bagno">Bagno</option>
                                <option value="Bagno Padronale">Bagno Padronale</option>
                                <option value="Studio">Studio</option>
                                <option value="Ingresso">Ingresso</option>
                                <option value="Corridoio">Corridoio</option>
                                <option value="Balcone">Balcone</option>
                                <option value="Terrazzo">Terrazzo</option>
                                <option value="Cantina">Cantina</option>
                                <option value="Garage">Garage</option>
                                <option value="Altro">Altro...</option>
                            </select>
                        </div>
                        <div class="pm-form-group">
                            <label class="pm-form-label">Piano</label>
                            <select id="pmPosPiano" class="pm-form-select">
                                <option value="">-- Seleziona --</option>
                                <option value="Interrato">Interrato</option>
                                <option value="Piano Terra">Piano Terra</option>
                                <option value="Piano Rialzato">Piano Rialzato</option>
                                <option value="Primo Piano">Primo Piano</option>
                                <option value="Secondo Piano">Secondo Piano</option>
                                <option value="Terzo Piano">Terzo Piano</option>
                                <option value="Mansarda">Mansarda</option>
                            </select>
                        </div>
                    </div>
                    <div class="pm-form-row">
                        <div class="pm-form-group">
                            <label class="pm-form-label">Tipo Posizione</label>
                            <select id="pmPosTipo" class="pm-form-select">
                                <option value="">-- Seleziona --</option>
                                <option value="finestra">Finestra</option>
                                <option value="porta-finestra">Porta-Finestra</option>
                                <option value="portoncino">Portoncino</option>
                                <option value="blindata">Blindata</option>
                                <option value="porta-interna">Porta Interna</option>
                            </select>
                        </div>
                        <div class="pm-form-group">
                            <label class="pm-form-label">Quantità</label>
                            <input type="number" id="pmPosQuantita" class="pm-form-input" value="1" min="1" max="10">
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label class="pm-form-label">Note</label>
                        <input type="text" id="pmPosNote" class="pm-form-input" placeholder="Note aggiuntive...">
                    </div>
                    <div class="pm-form-group">
                        <div class="pm-checkbox-group">
                            <input type="checkbox" id="pmPosApplyConfig" class="pm-checkbox" checked>
                            <label for="pmPosApplyConfig">Applica configurazione globale prodotti</label>
                        </div>
                        <p class="pm-form-helper">Se attivo, i prodotti erediteranno le impostazioni globali del progetto</p>
                    </div>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-btn-secondary" onclick="closePMModal('pmNewPositionModal')">Annulla</button>
                    <button class="pm-btn pm-btn-primary" onclick="createNewPosition()">✅ Aggiungi Posizione</button>
                </div>
            </div>
        </div>
        
        <!-- Modal Conferma Eliminazione -->
        <div id="pmDeleteConfirmModal" class="pm-modal-overlay" onclick="if(event.target === this) closePMModal('pmDeleteConfirmModal')">
            <div class="pm-modal" style="max-width: 400px;">
                <div class="pm-modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <div class="pm-modal-title">
                        <span>⚠️</span>
                        <span>Conferma Eliminazione</span>
                    </div>
                    <button class="pm-modal-close" onclick="closePMModal('pmDeleteConfirmModal')">×</button>
                </div>
                <div class="pm-modal-body">
                    <p id="pmDeleteMessage" style="text-align: center; font-size: 1.1rem; color: #374151;"></p>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-btn-secondary" onclick="closePMModal('pmDeleteConfirmModal')">Annulla</button>
                    <button class="pm-btn pm-btn-danger" id="pmDeleteConfirmBtn">🗑️ Elimina</button>
                </div>
            </div>
        </div>
    `;
    
    const container = document.createElement('div');
    container.id = 'pm-modals-container';
    container.innerHTML = modalsHTML;
    document.body.appendChild(container);
}

// ═══════════════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════════════

function openPMModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Focus sul primo input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closePMModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ═══════════════════════════════════════════════════════════════
// OVERRIDE RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function overrideRenderProjectsList() {
    // Salva funzione originale
    const originalRenderProjectsList = window.renderProjectsList;
    
    // Override
    window.renderProjectsList = function(projects) {
        // Chiama originale
        if (originalRenderProjectsList) {
            originalRenderProjectsList(projects);
        }
        
        // Aggiungi bottone "Nuovo Progetto" all'inizio
        const container = document.getElementById('progetti-list-container');
        if (container) {
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = 'margin-bottom: 1.5rem; display: flex; justify-content: center;';
            btnContainer.innerHTML = `
                <button class="pm-new-project-btn" onclick="openPMModal('pmNewProjectModal')">
                    <span style="font-size: 1.25rem;">➕</span>
                    <span>Nuovo Progetto</span>
                </button>
            `;
            container.insertBefore(btnContainer, container.firstChild);
        }
    };
    
    console.log('✅ renderProjectsList overridden');
}

function overrideRenderPositionsList() {
    // Salva funzione originale
    const originalRenderPositionsList = window.renderPositionsList;
    
    // Override
    window.renderPositionsList = function() {
        const container = document.getElementById('positionsList');
        const countSpan = document.getElementById('positionsCount');
        
        if (!container || !filteredPositions) return;
        
        countSpan.textContent = `(${filteredPositions.length})`;
        
        // Genera lista con azioni
        let html = filteredPositions.map((pos, index) => `
            <div class="position-list-item ${index === currentPositionIndex ? 'active' : ''}" 
                 style="display: flex; align-items: center;">
                <div class="position-item-details" style="padding: 0.75rem; flex: 1; cursor: pointer;" onclick="selectPosition(${index})">
                    <strong>${pos.ambiente || pos.nome || pos.stanza || 'Posizione ' + (index + 1)}</strong>
                </div>
                <div class="pm-position-actions">
                    <button class="pm-position-action-btn" onclick="event.stopPropagation(); duplicatePositionPM(${index})" title="Duplica">📋</button>
                    <button class="pm-position-action-btn" onclick="event.stopPropagation(); deletePositionPM(${index})" title="Elimina">🗑️</button>
                </div>
                <div style="padding: 0.5rem; cursor: pointer;" onclick="openPositionEditor(${index})">
                    ✏️
                </div>
            </div>
        `).join('');
        
        // Aggiungi bottone + Nuova Posizione
        html += `
            <button class="pm-add-position-btn" onclick="openPMModal('pmNewPositionModal')">
                <span>➕</span>
                <span>Nuova Posizione</span>
            </button>
        `;
        
        container.innerHTML = html;
    };
    
    console.log('✅ renderPositionsList overridden');
}

// ═══════════════════════════════════════════════════════════════
// PROJECT OPERATIONS
// ═══════════════════════════════════════════════════════════════

async function createNewProject() {
    // Verifica PROJECT_MANAGER
    if (typeof PROJECT_MANAGER === 'undefined') {
        showAlert('error', '❌ PROJECT_MANAGER non caricato');
        return;
    }
    
    // Raccogli dati
    const name = document.getElementById('pmProjectName').value.trim();
    const client = document.getElementById('pmProjectClient').value.trim();
    const phone = document.getElementById('pmProjectPhone').value.trim();
    const email = document.getElementById('pmProjectEmail').value.trim();
    const address = document.getElementById('pmProjectAddress').value.trim();
    
    // Validazione
    if (!name) {
        showAlert('error', '❌ Nome progetto obbligatorio');
        document.getElementById('pmProjectName').focus();
        return;
    }
    if (!client) {
        showAlert('error', '❌ Cliente obbligatorio');
        document.getElementById('pmProjectClient').focus();
        return;
    }
    
    // Prodotti
    const prodotti = {
        infissi: document.getElementById('pmProdInfissi').checked,
        persiane: document.getElementById('pmProdPersiane').checked,
        tapparelle: document.getElementById('pmProdTapparelle').checked,
        zanzariere: document.getElementById('pmProdZanzariere').checked,
        cassonetti: document.getElementById('pmProdCassonetti').checked,
        blindate: document.getElementById('pmProdBlindate').checked
    };
    
    // Crea progetto
    const existingProjects = window.githubProjects || [];
    const project = PROJECT_MANAGER.createProject(name, client, existingProjects);
    
    // Aggiungi dati cliente
    project.clientData = {
        nome: client,
        telefono: phone,
        email: email,
        indirizzo: address
    };
    project.customerName = client;
    project.customerPhone = phone;
    project.customerEmail = email;
    project.customerAddress = address;
    
    // Aggiungi prodotti
    project.prodotti = prodotti;
    
    console.log('📦 Nuovo progetto creato:', project);
    
    // Chiudi modal
    closePMModal('pmNewProjectModal');
    
    // Salva su GitHub
    if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.hasToken()) {
        showAlert('info', '💾 Salvataggio su GitHub...');
        
        try {
            const success = await GITHUB_SYNC.salvaProgetto(project, { source: 'dashboard-new' });
            if (success) {
                showAlert('success', `✅ Progetto "${name}" creato e salvato!`);
                
                // Ricarica lista progetti
                if (typeof loadProjectsFromGitHub === 'function') {
                    await loadProjectsFromGitHub();
                }
            } else {
                showAlert('warning', '⚠️ Progetto creato ma non salvato su GitHub');
            }
        } catch (err) {
            console.error('Errore salvataggio:', err);
            showAlert('error', '❌ Errore salvataggio: ' + err.message);
        }
    } else {
        showAlert('warning', '⚠️ GitHub non configurato - progetto solo locale');
    }
    
    // Reset form
    document.getElementById('pmProjectName').value = '';
    document.getElementById('pmProjectClient').value = '';
    document.getElementById('pmProjectPhone').value = '';
    document.getElementById('pmProjectEmail').value = '';
    document.getElementById('pmProjectAddress').value = '';
}

// ═══════════════════════════════════════════════════════════════
// POSITION OPERATIONS
// ═══════════════════════════════════════════════════════════════

async function createNewPosition() {
    // Verifica che ci sia un progetto caricato
    if (!window.currentData && !window.projectData) {
        showAlert('error', '❌ Nessun progetto caricato');
        return;
    }
    
    const project = window.currentData || window.projectData;
    
    // Raccogli dati
    const ambiente = document.getElementById('pmPosAmbiente').value;
    const piano = document.getElementById('pmPosPiano').value;
    const tipo = document.getElementById('pmPosTipo').value;
    const quantita = document.getElementById('pmPosQuantita').value || '1';
    const note = document.getElementById('pmPosNote').value.trim();
    const applyConfig = document.getElementById('pmPosApplyConfig').checked;
    
    // Validazione
    if (!ambiente) {
        showAlert('error', '❌ Seleziona un ambiente');
        document.getElementById('pmPosAmbiente').focus();
        return;
    }
    
    // Crea posizione
    let newPos;
    
    if (typeof PROJECT_MANAGER !== 'undefined') {
        newPos = PROJECT_MANAGER.addPosition(project, {
            ambiente: ambiente,
            piano: piano,
            copyGlobalConfig: applyConfig
        });
    } else {
        // Fallback manuale
        const posId = `${project.id || 'proj'}_${Date.now()}`;
        const posNum = (project.positions?.length || project.posizioni?.length || 0) + 1;
        
        newPos = {
            id: posId,
            name: `Pos. ${posNum}`,
            ambiente: ambiente,
            piano: piano,
            tipoposizione: tipo,
            quantita: quantita,
            note: note,
            misure: {},
            infisso: null,
            persiana: null,
            tapparella: null,
            zanzariera: null,
            cassonetto: null
        };
        
        if (!project.positions) project.positions = [];
        if (!project.posizioni) project.posizioni = [];
        
        project.positions.push(newPos);
        project.posizioni.push(newPos);
    }
    
    if (!newPos) {
        showAlert('error', '❌ Errore creazione posizione');
        return;
    }
    
    // Aggiungi campi extra
    newPos.tipoposizione = tipo;
    newPos.quantita = quantita;
    newPos.note = note;
    
    console.log('📍 Nuova posizione creata:', newPos);
    
    // Chiudi modal
    closePMModal('pmNewPositionModal');
    
    // Aggiorna UI
    if (typeof allPositionsData !== 'undefined') {
        allPositionsData.push(newPos);
    }
    if (typeof filteredPositions !== 'undefined') {
        filteredPositions.push(newPos);
    }
    
    // Re-render lista
    if (typeof renderPositionsList === 'function') {
        renderPositionsList();
    }
    
    // Seleziona nuova posizione
    const newIndex = (filteredPositions?.length || 1) - 1;
    if (typeof selectPosition === 'function') {
        selectPosition(newIndex);
    }
    
    // Salva su GitHub
    await saveProjectToGitHub('Aggiunta posizione: ' + newPos.ambiente);
    
    showAlert('success', `✅ Posizione "${ambiente}" aggiunta!`);
    
    // Reset form
    document.getElementById('pmPosAmbiente').value = '';
    document.getElementById('pmPosPiano').value = '';
    document.getElementById('pmPosTipo').value = '';
    document.getElementById('pmPosQuantita').value = '1';
    document.getElementById('pmPosNote').value = '';
}

function duplicatePositionPM(index) {
    const project = window.currentData || window.projectData;
    if (!project || !filteredPositions || !filteredPositions[index]) {
        showAlert('error', '❌ Posizione non trovata');
        return;
    }
    
    const sourcePos = filteredPositions[index];
    
    // Deep clone
    const newPos = JSON.parse(JSON.stringify(sourcePos));
    
    // Nuovo ID e nome
    newPos.id = `${project.id || 'proj'}_${Date.now()}`;
    newPos.name = (sourcePos.name || sourcePos.ambiente || 'Posizione') + ' (copia)';
    newPos.ambiente = (sourcePos.ambiente || '') + ' (copia)';
    
    // Aggiungi
    if (project.positions) project.positions.push(newPos);
    if (project.posizioni) project.posizioni.push(newPos);
    if (typeof allPositionsData !== 'undefined') allPositionsData.push(newPos);
    if (typeof filteredPositions !== 'undefined') filteredPositions.push(newPos);
    
    // Re-render
    if (typeof renderPositionsList === 'function') {
        renderPositionsList();
    }
    
    // Salva
    saveProjectToGitHub('Duplicata posizione: ' + sourcePos.ambiente);
    
    showAlert('success', `✅ Posizione duplicata!`);
}

function deletePositionPM(index) {
    if (!filteredPositions || !filteredPositions[index]) {
        showAlert('error', '❌ Posizione non trovata');
        return;
    }
    
    const pos = filteredPositions[index];
    const posName = pos.ambiente || pos.name || `Posizione ${index + 1}`;
    
    // Mostra modal conferma
    document.getElementById('pmDeleteMessage').innerHTML = `
        Sei sicuro di voler eliminare<br>
        <strong>"${posName}"</strong>?<br>
        <span style="color: #ef4444; font-size: 0.9rem;">Questa azione è irreversibile.</span>
    `;
    
    document.getElementById('pmDeleteConfirmBtn').onclick = async function() {
        const project = window.currentData || window.projectData;
        
        // Rimuovi da tutti gli array
        if (project.positions) {
            const idx = project.positions.findIndex(p => p.id === pos.id);
            if (idx >= 0) project.positions.splice(idx, 1);
        }
        if (project.posizioni) {
            const idx = project.posizioni.findIndex(p => p.id === pos.id);
            if (idx >= 0) project.posizioni.splice(idx, 1);
        }
        if (typeof allPositionsData !== 'undefined') {
            const idx = allPositionsData.findIndex(p => p.id === pos.id);
            if (idx >= 0) allPositionsData.splice(idx, 1);
        }
        if (typeof filteredPositions !== 'undefined') {
            filteredPositions.splice(index, 1);
        }
        
        // Aggiorna indice corrente
        if (typeof currentPositionIndex !== 'undefined') {
            if (currentPositionIndex >= filteredPositions.length) {
                currentPositionIndex = Math.max(0, filteredPositions.length - 1);
            }
        }
        
        // Re-render
        if (typeof renderPositionsList === 'function') {
            renderPositionsList();
        }
        if (typeof renderPositionDetail === 'function' && filteredPositions.length > 0) {
            renderPositionDetail(currentPositionIndex);
        }
        
        closePMModal('pmDeleteConfirmModal');
        
        // Salva
        await saveProjectToGitHub('Eliminata posizione: ' + posName);
        
        showAlert('success', `🗑️ Posizione "${posName}" eliminata`);
    };
    
    openPMModal('pmDeleteConfirmModal');
}

// ═══════════════════════════════════════════════════════════════
// SAVE HELPER
// ═══════════════════════════════════════════════════════════════

async function saveProjectToGitHub(changeDescription) {
    const project = window.currentData || window.projectData;
    if (!project) return;
    
    // Aggiorna timestamp
    project.updated = new Date().toISOString();
    if (project.metadata) {
        project.metadata.updated = project.updated;
        project.metadata.version = (project.metadata.version || 0) + 1;
    }
    
    // Salva
    if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.hasToken()) {
        try {
            await GITHUB_SYNC.salvaProgetto(project, { source: 'dashboard-pm' });
            console.log('💾 Progetto salvato:', changeDescription);
        } catch (err) {
            console.error('Errore salvataggio:', err);
        }
    } else if (typeof salvaProgettoSuGitHub === 'function') {
        try {
            await salvaProgettoSuGitHub();
            console.log('💾 Progetto salvato:', changeDescription);
        } catch (err) {
            console.error('Errore salvataggio:', err);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

window.openPMModal = openPMModal;
window.closePMModal = closePMModal;
window.createNewProject = createNewProject;
window.createNewPosition = createNewPosition;
window.duplicatePositionPM = duplicatePositionPM;
window.deletePositionPM = deletePositionPM;

console.log(`📦 PM Dashboard Integration v${PM_INTEGRATION_VERSION} caricato`);
