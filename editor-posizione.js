// ============================================================================
// EDITOR POSIZIONE v3.3.0
// ============================================================================
// Editor modale per posizioni — usato dalla Dashboard
// 🆕 v3.3.0: UNIFICAZIONE COMPLETA
//   - Tab prodotto: render-config-campi.js (stesso dell'App Rilievo)
//   - Tab posizione/misure: CAMPI_PRODOTTI.posizione/.misure (shared)
//   - Eliminato EDITOR_FIELDS legacy, _OPT_MAP, helper getOpt/getFinstral*
// ============================================================================

const EDITOR_VERSION = '3.3.0';

console.log(`✏️ Editor Posizione v${EDITOR_VERSION} - Caricato`);

// Verifica dipendenze
if (typeof DATA_MANAGER === 'undefined') {
    console.warn('⚠️ Editor: DATA_MANAGER non trovato!');
}
if (typeof CAMPI_PRODOTTI === 'undefined') {
    console.warn('⚠️ Editor: CAMPI_PRODOTTI non trovato!');
}

// ============================================================================
// CAMPI POSIZIONE/MISURE — legge da CAMPI_PRODOTTI.posizione/.misure (shared)
// ============================================================================

function getFieldsForTab(tabName) {
    // 🆕 v3.3.0: Usa CAMPI_PRODOTTI.posizione/.misure se disponibile
    if (typeof CAMPI_PRODOTTI !== 'undefined' && CAMPI_PRODOTTI[tabName] && Array.isArray(CAMPI_PRODOTTI[tabName])) {
        return CAMPI_PRODOTTI[tabName].map(campo => {
            const field = { ...campo };
            // Converti options function → optionsGetter per il renderer dell'editor
            if (field.options && typeof field.options === 'function') {
                field.optionsGetter = () => ['', ...field.options()];
                field.type = 'select';
            }
            // Label estesa per misure nell'editor
            if (field.labelLong) field.label = `${field.key} - ${field.labelLong}`;
            return field;
        });
    }
    
    console.warn(`⚠️ CAMPI_PRODOTTI.${tabName} non disponibile`);
    return [];
}

let editorState = {
    isOpen: false,
    currentPositionIndex: null,
    currentPosition: null,
    hasChanges: false
};

// ============================================================================
// INIZIALIZZAZIONE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✏️ Editor Posizione - Inizializzazione...');
    
    // Inietta il modal HTML nel DOM
    injectEditorModal();
    
    // Osserva la lista posizioni per aggiungere pulsanti edit
    observePositionsList();
    
    console.log('✏️ Editor Posizione - Pronto!');
});

// ============================================================================
// INIEZIONE MODAL HTML
// ============================================================================

function injectEditorModal() {
    const modalHTML = `
    <div id="editorPosizioneModal" class="editor-modal-overlay" style="display: none;">
        <div class="editor-modal">
            <!-- Header -->
            <div class="editor-header">
                <div class="editor-title">
                    <span class="editor-icon">✏️</span>
                    <span id="editorTitle">Modifica Posizione</span>
                </div>
                <div class="editor-actions">
                    <button id="editorSaveBtn" class="editor-btn editor-btn-primary" onclick="editorSave()">
                        💾 Salva
                    </button>
                    <button class="editor-btn editor-btn-secondary" onclick="editorClose()">
                        ✕ Chiudi
                    </button>
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="editor-tabs">
                <button class="editor-tab active" data-tab="posizione" onclick="editorSwitchTab('posizione')">
                    📍 Posizione
                </button>
                <button class="editor-tab" data-tab="misure" onclick="editorSwitchTab('misure')">
                    📏 Misure
                </button>
                <button class="editor-tab" data-tab="infisso" onclick="editorSwitchTab('infisso')">
                    🪟 Infisso
                </button>
                <button class="editor-tab" data-tab="persiana" onclick="editorSwitchTab('persiana')">
                    🚪 Persiana
                </button>
                <button class="editor-tab" data-tab="tapparella" onclick="editorSwitchTab('tapparella')">
                    🎚️ Tapparella
                </button>
                <button class="editor-tab" data-tab="zanzariera" onclick="editorSwitchTab('zanzariera')">
                    🦟 Zanzariera
                </button>
                <button class="editor-tab" data-tab="cassonetto" onclick="editorSwitchTab('cassonetto')">
                    📦 Cassonetto
                </button>
            </div>
            
            <!-- Content -->
            <div class="editor-content">
                <div id="editorTabContent">
                    <!-- Popolato dinamicamente -->
                </div>
            </div>
            
            <!-- Footer con info -->
            <div class="editor-footer">
                <span id="editorChangeIndicator" class="editor-changes-none">Nessuna modifica</span>
                <span class="editor-version">Editor v${EDITOR_VERSION}</span>
            </div>
        </div>
    </div>
    
    <style>
    /* ========== EDITOR MODAL STYLES ========== */
    .editor-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    }
    
    .editor-modal {
        background: white;
        border-radius: 16px;
        width: 95%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }
    
    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
    }
    
    .editor-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .editor-icon {
        font-size: 1.5rem;
    }
    
    .editor-actions {
        display: flex;
        gap: 0.75rem;
    }
    
    .editor-btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-size: 0.9rem;
    }
    
    .editor-btn-primary {
        background: white;
        color: #1e40af;
    }
    
    .editor-btn-primary:hover {
        background: #f0f9ff;
        transform: translateY(-1px);
    }
    
    .editor-btn-secondary {
        background: rgba(255,255,255,0.2);
        color: white;
    }
    
    .editor-btn-secondary:hover {
        background: rgba(255,255,255,0.3);
    }
    
    .editor-tabs {
        display: flex;
        gap: 0.25rem;
        padding: 0.75rem 1rem;
        background: #f1f5f9;
        border-bottom: 1px solid #e2e8f0;
        overflow-x: auto;
        flex-wrap: nowrap;
    }
    
    .editor-tab {
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        color: #64748b;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s;
        white-space: nowrap;
        font-size: 0.85rem;
    }
    
    .editor-tab:hover {
        background: white;
        color: #1e40af;
    }
    
    .editor-tab.active {
        background: white;
        color: #1e40af;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .editor-tab.has-data {
        position: relative;
    }
    
    .editor-tab.has-data::after {
        content: '';
        position: absolute;
        top: 6px;
        right: 6px;
        width: 6px;
        height: 6px;
        background: #22c55e;
        border-radius: 50%;
    }
    
    .editor-tab.no-data {
        opacity: 0.5;
    }
    
    .editor-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background: #fafafa;
    }
    
    #editorTabContent {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    
    /* 🆕 v3.3.0: Adatta campi render-config-campi.js al grid dell'editor */
    #editorTabContent .editor-fields-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem 1rem;
        grid-column: 1 / -1;
    }
    
    #editorTabContent .editor-fields-grid .mb-2,
    #editorTabContent .editor-fields-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }
    
    #editorTabContent .editor-fields-grid label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
    }
    
    #editorTabContent .editor-fields-grid select,
    #editorTabContent .editor-fields-grid input[type="text"],
    #editorTabContent .editor-fields-grid input[type="number"] {
        padding: 0.6rem 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: all 0.2s;
        background: white;
        width: 100%;
        box-sizing: border-box;
    }
    
    #editorTabContent .editor-fields-grid select:focus,
    #editorTabContent .editor-fields-grid input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Note su riga intera */
    #editorTabContent .editor-fields-grid + .editor-field.full-width,
    #editorTabContent > .editor-field.full-width {
        grid-column: 1 / -1;
    }
    
    .editor-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }
    
    .editor-field.full-width {
        grid-column: 1 / -1;
    }
    
    .editor-field label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .editor-field label .unit {
        font-weight: 400;
        color: #94a3b8;
        font-size: 0.75rem;
    }
    
    .editor-field input,
    .editor-field select,
    .editor-field textarea {
        padding: 0.6rem 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: all 0.2s;
        background: white;
    }
    
    .editor-field input:focus,
    .editor-field select:focus,
    .editor-field textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .editor-field input:read-only {
        background: #f1f5f9;
        color: #64748b;
    }
    
    .editor-field input.changed,
    .editor-field select.changed,
    .editor-field textarea.changed {
        border-color: #f59e0b;
        background: #fffbeb;
    }
    
    .editor-field textarea {
        min-height: 80px;
        resize: vertical;
    }
    
    .editor-field-checkbox {
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
    }
    
    .editor-field-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
    
    .editor-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1.5rem;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        font-size: 0.8rem;
        color: #64748b;
    }
    
    .editor-changes-none {
        color: #94a3b8;
    }
    
    .editor-changes-pending {
        color: #f59e0b;
        font-weight: 600;
    }
    
    .editor-null-notice {
        grid-column: 1 / -1;
        padding: 2rem;
        text-align: center;
        background: #fff7ed;
        border: 2px dashed #fdba74;
        border-radius: 12px;
        color: #9a3412;
    }
    
    .editor-null-notice h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .editor-null-notice p {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
    }
    
    .editor-null-notice button {
        background: #ea580c;
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
    }
    
    .editor-null-notice button:hover {
        background: #c2410c;
    }
    
    /* 🆕 v3.1.0: Banner prodotto disattivato (qta=0) */
    .editor-disabled-banner {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 1rem;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 2px solid #f59e0b;
        border-radius: 12px;
        padding: 1.25rem;
        margin-top: 0.5rem;
    }
    .editor-disabled-icon {
        font-size: 2rem;
        color: #dc2626;
        background: white;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid #dc2626;
        flex-shrink: 0;
    }
    .editor-disabled-text strong {
        font-size: 1.1rem;
        color: #92400e;
    }
    .editor-disabled-text p {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: #78350f;
    }
    
    /* 🆕 v3.1.0: Tab badges */
    .tab-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.25rem;
        height: 1.25rem;
        font-size: 0.65rem;
        font-weight: 700;
        border-radius: 50%;
        margin-left: 0.25rem;
        vertical-align: middle;
    }
    .tab-badge-none {
        background: #e5e7eb;
        color: #9ca3af;
    }
    .tab-badge-off {
        background: #fee2e2;
        color: #dc2626;
        border: 1px solid #fca5a5;
    }
    .tab-badge-qty {
        background: #dbeafe;
        color: #2563eb;
        border: 1px solid #93c5fd;
        border-radius: 9px;
        padding: 0 0.35rem;
    }
    .tab-no-product {
        opacity: 0.5;
    }
    .tab-disabled-product {
        opacity: 0.7;
        text-decoration: line-through;
    }
    
    /* 🆕 v3.1.0: qta select special styling */
    select[data-key="qta"] {
        font-size: 1.1rem;
        font-weight: 700;
        padding: 0.6rem;
    }
    select[data-key="qta"][data-qta-zero="true"] {
        background: #fee2e2;
        border-color: #dc2626;
        color: #dc2626;
    }
    
    /* Edit button in position list */
    .position-edit-btn {
        padding: 0.25rem 0.5rem;
        background: #e0e7ff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s;
        margin-left: auto;
    }
    
    .position-edit-btn:hover {
        background: #c7d2fe;
        transform: scale(1.1);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .editor-modal {
            width: 100%;
            max-width: 100%;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
        }
        
        .editor-tabs {
            padding: 0.5rem;
        }
        
        .editor-tab {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
        }
        
        #editorTabContent {
            grid-template-columns: 1fr;
        }
    }
    
    /* 🆕 v1.6.0: Stili Radio Buttons */
    .editor-radio-label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .editor-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .editor-radio-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
        min-width: 100px;
        text-align: center;
    }
    
    .editor-radio-option:hover {
        border-color: #3b82f6;
        background: #eff6ff;
    }
    
    .editor-radio-option.selected {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    }
    
    .editor-radio-option input[type="radio"] {
        display: none;
    }
    
    .radio-label {
        font-weight: 600;
        color: #1e40af;
        font-size: 0.9rem;
    }
    
    .radio-desc {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 0.25rem;
    }
    
    .editor-radio-option.selected .radio-label {
        color: #1e40af;
    }
    </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ============================================================================
// OBSERVER PER AGGIUNGERE PULSANTI EDIT
// ============================================================================

function observePositionsList() {
    const targetNode = document.getElementById('positionsList');
    
    if (!targetNode) {
        // Riprova dopo 500ms se l'elemento non esiste ancora
        setTimeout(observePositionsList, 500);
        return;
    }
    
    // Observer per rilevare quando vengono aggiunti nuovi elementi
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                addEditButtonsToPositions();
            }
        });
    });
    
    observer.observe(targetNode, { childList: true, subtree: true });
    
    // Aggiungi pulsanti anche subito se ci sono già elementi
    addEditButtonsToPositions();
}

function addEditButtonsToPositions() {
    const positionItems = document.querySelectorAll('#positionsList > div');
    
    positionItems.forEach((item, index) => {
        // Salta se già ha il pulsante edit
        if (item.querySelector('.position-edit-btn')) return;
        
        // Crea pulsante edit
        const editBtn = document.createElement('button');
        editBtn.className = 'position-edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Modifica posizione';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editorOpen(index);
        };
        
        // Aggiungi all'item (alla fine)
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.appendChild(editBtn);
        
        // Aggiungi doppio click per edit
        item.addEventListener('dblclick', () => {
            editorOpen(index);
        });
    });
}

// ============================================================================
// FUNZIONI EDITOR
// ============================================================================

function editorOpen(positionIndex) {
    // Verifica che currentData esista
    if (typeof currentData === 'undefined' || !currentData) {
        alert('❌ Nessun progetto caricato. Importa prima un JSON.');
        return;
    }
    
    // 🔧 v1.3.0: Supporta sia "positions" che "posizioni"
    const positions = currentData.positions || currentData.posizioni;
    
    if (!positions || !Array.isArray(positions) || positions.length === 0) {
        alert('❌ Nessuna posizione trovata nel progetto.');
        return;
    }
    
    if (positionIndex < 0 || positionIndex >= positions.length) {
        alert('❌ Posizione non valida');
        return;
    }
    
    // Salva stato - DEEP CLONE per evitare riferimenti
    editorState.currentPositionIndex = positionIndex;
    editorState.currentPosition = JSON.parse(JSON.stringify(positions[positionIndex]));
    editorState.hasChanges = false;
    editorState.isOpen = true;
    
    // Aggiorna titolo
    const pos = editorState.currentPosition;
    document.getElementById('editorTitle').textContent = 
        `Modifica: ${pos.name || 'Posizione'} - ${pos.ambiente || ''} (${pos.piano || ''})`;
    
    // Aggiorna indicatori tab
    updateTabIndicators();
    
    // 🆕 v3.1.0: Aggiorna badge tab (qta, disattivati, assenti)
    editorUpdateTabBadges();
    
    // Mostra primo tab
    editorSwitchTab('posizione');
    
    // Mostra modal
    document.getElementById('editorPosizioneModal').style.display = 'flex';
    
    // Reset indicatore modifiche
    updateChangeIndicator();
    
    console.log(`✏️ Editor aperto per posizione ${positionIndex}:`, pos.name, `(id: ${pos.id})`);
}

function editorClose() {
    if (editorState.hasChanges) {
        if (!confirm('Hai modifiche non salvate. Vuoi chiudere comunque?')) {
            return;
        }
    }
    
    document.getElementById('editorPosizioneModal').style.display = 'none';
    editorState.isOpen = false;
    editorState.currentPositionIndex = null;
    editorState.currentPosition = null;
    editorState.hasChanges = false;
    
    console.log('✏️ Editor chiuso');
}

function editorSwitchTab(tabName) {
    // Aggiorna stile tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Renderizza contenuto tab
    renderTabContent(tabName);
}

function updateTabIndicators() {
    const pos = editorState.currentPosition;
    
    document.querySelectorAll('.editor-tab').forEach(tab => {
        const tabName = tab.dataset.tab;
        tab.classList.remove('has-data', 'no-data');
        
        if (tabName === 'posizione' || tabName === 'misure') {
            tab.classList.add('has-data');
        } else if (pos[tabName] !== null && pos[tabName] !== undefined) {
            tab.classList.add('has-data');
        } else {
            tab.classList.add('no-data');
        }
    });
}

function renderTabContent(tabName) {
    const container = document.getElementById('editorTabContent');
    const pos = editorState.currentPosition;
    
    // Determina la sorgente dati
    let dataSource;
    if (tabName === 'posizione') {
        dataSource = pos;
    } else if (tabName === 'misure') {
        dataSource = pos.misure || {};
    } else {
        dataSource = pos[tabName];
    }
    
    // Se prodotto è null, mostra opzione per crearlo
    if (dataSource === null || dataSource === undefined) {
        // 🆕 v3.1.0: Mostra info config globale disponibile
        const configMap = {
            infisso: 'configInfissi', persiana: 'configPersiane',
            tapparella: 'configTapparelle', zanzariera: 'configZanzariere',
            cassonetto: 'configCassonetti'
        };
        const configKey = configMap[tabName];
        const hasConfig = configKey && typeof currentData !== 'undefined' && currentData?.[configKey] && 
                          Object.values(currentData[configKey]).some(v => v !== '' && v !== null && v !== undefined);
        
        container.innerHTML = `
            <div class="editor-null-notice">
                <h4>🚫 ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} non presente</h4>
                <p>Questa posizione non ha un ${tabName} associato.</p>
                ${hasConfig ? `<p style="color: #059669; font-size: 0.85rem; margin-top: 0.5rem;">✅ Config globale trovata — i valori default verranno applicati automaticamente</p>` : 
                  `<p style="color: #d97706; font-size: 0.85rem; margin-top: 0.5rem;">⚠️ Nessuna config globale — verrà creato con valori predefiniti</p>`}
                <button onclick="editorCreateProduct('${tabName}')">
                    ➕ Aggiungi ${tabName}
                </button>
            </div>
        `;
        return;
    }
    
    // 🆕 v3.1.0: Check qta=0 → prodotto disattivato
    const isProduct = !['posizione', 'misure'].includes(tabName);
    const qtaValue = isProduct ? parseInt(dataSource.qta) : -1;
    const isDisabled = isProduct && qtaValue === 0;
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🆕 v3.3.0: TAB PRODOTTO → usa renderPositionProductFromCampi (UNIFICATO)
    // Stessa funzione usata dall'App Rilievo → stessi campi, stesse opzioni
    // ═══════════════════════════════════════════════════════════════════════
    if (isProduct && typeof renderPositionProductFromCampi === 'function' && typeof CAMPI_PRODOTTI !== 'undefined' && CAMPI_PRODOTTI[tabName]) {
        
        // Registra callback UI_SELECT_CUSTOM per intercettare le modifiche
        if (typeof UI_SELECT_CUSTOM !== 'undefined') {
            // Callback per campi posizione (posId presente)
            UI_SELECT_CUSTOM.onPositionChange = (projectId, posId, productType, fieldName, value) => {
                const pos = editorState.currentPosition;
                if (!pos) return;
                
                // Usa DATA_MANAGER per logica business (sync colori PVC, tipoInfisso, etc.)
                if (typeof DATA_MANAGER !== 'undefined') {
                    DATA_MANAGER.applyProductUpdate(pos, productType, fieldName, value);
                } else {
                    if (!pos[productType]) pos[productType] = {};
                    pos[productType][fieldName] = value;
                }
                
                editorState.hasChanges = true;
                updateChangeIndicator();
                console.log(`✏️ Campo modificato (unified): ${productType}.${fieldName} = ${value}`);
                
                // Re-render per visibleIf triggers
                const VISIBILITY_TRIGGERS = [
                    'qta', 'azienda', 'tipoAnta', 'bancaleTipo', 'antaTwinTipo',
                    'codiceModello', 'fasciaColore', 'fissaggio', 'lineaF', 'lineaPF',
                    'serveMotore', 'serveTapparella', 'finituraInt', 'finituraEst'
                ];
                if (VISIBILITY_TRIGGERS.includes(fieldName)) {
                    renderTabContent(tabName);
                }
            };
            
            // Callback per config globale (posId vuoto) → salva comunque in posizione nell'editor
            UI_SELECT_CUSTOM.onConfigChange = (projectId, productType, fieldName, value) => {
                // Nell'editor, anche i campi "config globale" salvano nella posizione
                const pos = editorState.currentPosition;
                if (!pos) return;
                
                if (typeof DATA_MANAGER !== 'undefined') {
                    DATA_MANAGER.applyProductUpdate(pos, productType, fieldName, value);
                } else {
                    if (!pos[productType]) pos[productType] = {};
                    pos[productType][fieldName] = value;
                }
                
                editorState.hasChanges = true;
                updateChangeIndicator();
                console.log(`✏️ Campo config modificato (unified): ${productType}.${fieldName} = ${value}`);
                
                const VISIBILITY_TRIGGERS = [
                    'qta', 'azienda', 'tipoAnta', 'bancaleTipo', 'antaTwinTipo',
                    'codiceModello', 'fasciaColore', 'fissaggio', 'lineaF', 'lineaPF',
                    'serveMotore', 'serveTapparella', 'finituraInt', 'finituraEst'
                ];
                if (VISIBILITY_TRIGGERS.includes(fieldName)) {
                    renderTabContent(tabName);
                }
            };
            
            // Callback post-cambio (aggiornamento colori, etc.)
            UI_SELECT_CUSTOM.onAfterChange = (fieldName, value, projectId, posId, productType) => {
                // Nulla di specifico per l'editor
            };
        }
        
        // Genera HTML usando render-config-campi.js (STESSO dell'App Rilievo)
        const project = typeof currentData !== 'undefined' ? currentData : 
                       (typeof projectData !== 'undefined' ? projectData : { id: 'editor' });
        const pos = editorState.currentPosition;
        
        const result = renderPositionProductFromCampi(project, pos, tabName, dataSource, {
            excludeKeys: ['note'],  // Note renderizzate separatamente
            excludeGroups: []
        });
        
        if (result) {
            let html = '<div class="editor-fields-grid">';
            
            // Quantità
            if (result.qtaHtml) {
                html += result.qtaHtml;
            }
            
            // Campi config globale (azienda, tipo anta, finitura, etc.)
            if (result.configFieldsHtml) {
                html += result.configFieldsHtml;
            }
            
            // Campi posizione specifici (codice modello, ferramenta, etc.)
            if (result.posFieldsHtml) {
                html += result.posFieldsHtml;
            }
            
            html += '</div>';
            
            // Note prodotto
            const noteValue = dataSource.note || '';
            html += `
                <div class="editor-field full-width" style="margin-top: 1rem;">
                    <label>Note ${tabName.charAt(0).toUpperCase() + tabName.slice(1)}</label>
                    <textarea data-tab="${tabName}" data-key="note" 
                              oninput="editorFieldChanged(this)"
                              style="width:100%; min-height: 60px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;"
                    >${noteValue}</textarea>
                </div>
            `;
            
            container.innerHTML = html;
            console.log(`✅ v3.3.0: Tab ${tabName} renderizzato con render-config-campi.js (unificato)`);
            return;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FALLBACK: Renderer legacy per posizione/misure e quando render-config-campi non disponibile
    // ═══════════════════════════════════════════════════════════════════════
    
    // Renderizza campi posizione/misure
    const fields = getFieldsForTab(tabName);
    let html = '';
    
    fields.forEach(field => {
        const value = dataSource[field.key] !== undefined ? dataSource[field.key] : '';
        const fieldClass = field.type === 'textarea' ? 'editor-field full-width' : 
                          field.type === 'checkbox' ? 'editor-field editor-field-checkbox' : 
                          field.type === 'radio' ? 'editor-field full-width' : 'editor-field';
        
        html += `<div class="${fieldClass}">`;
        
        // 🆕 v1.6.0: Supporto Radio Buttons
        if (field.type === 'radio') {
            html += `<label class="editor-radio-label">${field.label}</label>`;
            html += `<div class="editor-radio-group">`;
            
            const radioOptions = field.options || [];
            radioOptions.forEach((opt, idx) => {
                const optValue = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                const optDesc = typeof opt === 'object' ? opt.desc : '';
                const isChecked = String(value) === String(optValue) || (!value && idx === 0);
                const radioId = `field_${tabName}_${field.key}_${optValue}`;
                
                html += `
                    <label class="editor-radio-option ${isChecked ? 'selected' : ''}" for="${radioId}">
                        <input type="radio" 
                               id="${radioId}"
                               name="field_${tabName}_${field.key}"
                               data-tab="${tabName}" 
                               data-key="${field.key}"
                               value="${optValue}"
                               ${isChecked ? 'checked' : ''}
                               onchange="editorFieldChanged(this)">
                        <span class="radio-label">${optLabel}</span>
                        ${optDesc ? `<span class="radio-desc">${optDesc}</span>` : ''}
                    </label>
                `;
            });
            
            html += `</div>`;
        } else if (field.type === 'checkbox') {
            html += `
                <input type="checkbox" 
                       id="field_${tabName}_${field.key}" 
                       data-tab="${tabName}" 
                       data-key="${field.key}"
                       ${value ? 'checked' : ''}
                       onchange="editorFieldChanged(this)">
                <label for="field_${tabName}_${field.key}">${field.label}</label>
            `;
        } else {
            html += `<label for="field_${tabName}_${field.key}">
                ${field.label}
                ${field.unit ? `<span class="unit">(${field.unit})</span>` : ''}
            </label>`;
            
            if (field.type === 'select') {
                // Supporta sia options statiche che optionsGetter dinamico
                const options = field.optionsGetter ? field.optionsGetter() : (field.options || []);
                
                // 🆕 v3.1.0: Attributo speciale per qta=0
                const qtaZeroAttr = (field.key === 'qta' && String(value) === '0') ? ' data-qta-zero="true"' : '';
                
                html += `<select id="field_${tabName}_${field.key}" 
                                data-tab="${tabName}" 
                                data-key="${field.key}"${qtaZeroAttr}
                                onchange="editorFieldChanged(this)">`;
                
                // v1.2.0: Matching case-insensitive e parziale per valori
                const valueLower = String(value).toLowerCase().trim();
                // 🆕 v1.5.4: Per codiceModello, estrai solo il codice numerico per il matching
                const isCodiceModello = field.key === 'codiceModello';
                const valueCode = isCodiceModello ? String(value).split(' ')[0].trim() : '';
                let foundMatch = false;
                
                options.forEach(opt => {
                    // 🆕 v3.0.0: Supporto formato value|label da CAMPI_PRODOTTI
                    let optValue, optLabel;
                    if (typeof opt === 'string' && opt.includes('|')) {
                        const parts = opt.split('|');
                        optValue = parts[0];
                        optLabel = parts[1];
                    } else {
                        optValue = opt;
                        optLabel = opt;
                    }
                    
                    // 🆕 v1.5.4: Supporto header/separatori (iniziano con emoji 📦 o 🚪)
                    const isHeader = /^[📦🚪🏠🔧⚙️🎨]/.test(String(optLabel));
                    if (isHeader) {
                        html += `<option disabled style="font-weight:bold; background:#e5e7eb;">── ${optLabel} ──</option>`;
                        return;
                    }
                    
                    const optLower = String(optValue).toLowerCase().trim();
                    // 🆕 v1.5.4: Per codiceModello, estrai codice dall'opzione
                    const optCode = isCodiceModello ? String(optValue).split(' ')[0].trim() : '';
                    
                    // Match esatto case-insensitive O match per codice O match parziale
                    const isMatch = valueLower === optLower || 
                                   (isCodiceModello && valueCode && optCode && valueCode === optCode) ||
                                   (valueLower && optLower && valueLower.length > 2 && 
                                    (optLower.includes(valueLower) || valueLower.includes(optLower)));
                    if (isMatch) foundMatch = true;
                    const selected = isMatch ? 'selected' : '';
                    const displayLabel = optValue === '' ? '-- Seleziona --' : optLabel;
                    // 🆕 v1.5.4: Per codiceModello, salva solo il codice numerico
                    const saveValue = (isCodiceModello && optCode) ? optCode : optValue;
                    html += `<option value="${saveValue}" ${selected}>${displayLabel}</option>`;
                });
                
                // v1.2.0: Se valore esiste ma non è nelle opzioni, aggiungilo come opzione custom
                if (value && !foundMatch) {
                    html += `<option value="${value}" selected>📌 ${value}</option>`;
                    console.log(`⚠️ Valore "${value}" non in opzioni per ${tabName}.${field.key}, aggiunto come custom`);
                }
                
                html += `</select>`;
            } else if (field.type === 'textarea') {
                html += `<textarea id="field_${tabName}_${field.key}" 
                                  data-tab="${tabName}" 
                                  data-key="${field.key}"
                                  placeholder="${field.placeholder || ''}"
                                  oninput="editorFieldChanged(this)">${value}</textarea>`;
            } else {
                html += `<input type="${field.type}" 
                               id="field_${tabName}_${field.key}" 
                               data-tab="${tabName}" 
                               data-key="${field.key}"
                               value="${value}"
                               placeholder="${field.placeholder || ''}"
                               ${field.readonly ? 'readonly' : ''}
                               oninput="editorFieldChanged(this)">`;
            }
        }
        
        html += `</div>`;
    });
    
    // 🆕 v3.1.0: Aggiungi banner disattivazione se qta=0
    if (isDisabled) {
        html += `
            <div class="editor-disabled-banner">
                <div class="editor-disabled-icon">✗</div>
                <div class="editor-disabled-text">
                    <strong>Prodotto disattivato</strong>
                    <p>Quantità impostata a 0. Cambia la quantità per riattivare.</p>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // 🆕 v3.1.0: Aggiorna badge tab dopo rendering
    editorUpdateTabBadges();
}

// 🆕 v3.1.0: Aggiorna badge sulle tab per mostrare stato prodotti
function editorUpdateTabBadges() {
    const pos = editorState.currentPosition;
    if (!pos) return;
    
    const productTabs = ['infisso', 'persiana', 'tapparella', 'zanzariera', 'cassonetto'];
    
    productTabs.forEach(tab => {
        const btn = document.querySelector(`.editor-tab[data-tab="${tab}"]`);
        if (!btn) return;
        
        const prod = pos[tab];
        
        // Rimuovi badge esistenti
        const oldBadge = btn.querySelector('.tab-badge');
        if (oldBadge) oldBadge.remove();
        
        if (prod === null || prod === undefined) {
            // Prodotto non presente
            btn.insertAdjacentHTML('beforeend', '<span class="tab-badge tab-badge-none">—</span>');
            btn.classList.add('tab-no-product');
            btn.classList.remove('tab-disabled-product');
        } else {
            const qta = parseInt(prod.qta);
            btn.classList.remove('tab-no-product');
            
            if (qta === 0) {
                // Prodotto disattivato
                btn.insertAdjacentHTML('beforeend', '<span class="tab-badge tab-badge-off">✗</span>');
                btn.classList.add('tab-disabled-product');
            } else {
                // Prodotto attivo
                btn.classList.remove('tab-disabled-product');
                if (qta > 1) {
                    btn.insertAdjacentHTML('beforeend', `<span class="tab-badge tab-badge-qty">×${qta}</span>`);
                }
            }
        }
    });
}

function editorFieldChanged(element) {
    const tab = element.dataset.tab;
    const key = element.dataset.key;
    let value;
    
    if (element.type === 'checkbox') {
        value = element.checked;
    } else if (element.type === 'number') {
        value = element.value === '' ? '' : element.value;
    } else if (element.type === 'radio') {
        value = element.value;
        // 🆕 v1.6.0: Aggiorna stile visuale radio buttons
        const radioGroup = element.closest('.editor-radio-group');
        if (radioGroup) {
            radioGroup.querySelectorAll('.editor-radio-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const parentLabel = element.closest('.editor-radio-option');
            if (parentLabel) {
                parentLabel.classList.add('selected');
            }
        }
    } else {
        value = element.value;
    }
    
    // 🆕 v1.5.0: Usa DATA_MANAGER per aggiornamenti con logica business unificata
    const pos = editorState.currentPosition;
    
    if (tab === 'posizione') {
        // Usa DATA_MANAGER.applyPositionUpdate (include sync quantità → prodotti)
        if (typeof DATA_MANAGER !== 'undefined') {
            DATA_MANAGER.applyPositionUpdate(pos, key, value);
        } else {
            // Fallback se DATA_MANAGER non disponibile
            pos[key] = value;
        }
    } else if (tab === 'misure') {
        // Usa DATA_MANAGER.applyMisuraUpdate
        if (typeof DATA_MANAGER !== 'undefined') {
            DATA_MANAGER.applyMisuraUpdate(pos, key, value);
        } else {
            if (!pos.misure) pos.misure = {};
            pos.misure[key] = value;
        }
    } else {
        // Prodotto: usa DATA_MANAGER.applyProductUpdate (include auto-sync colori, tipoInfissoAssociato, cerniere)
        if (typeof DATA_MANAGER !== 'undefined') {
            DATA_MANAGER.applyProductUpdate(pos, tab, key, value);
        } else {
            // Fallback manuale
            if (!pos[tab]) pos[tab] = {};
            pos[tab][key] = value;
        }
    }
    
    // Marca come modificato
    element.classList.add('changed');
    editorState.hasChanges = true;
    updateChangeIndicator();
    
    console.log(`✏️ Campo modificato: ${tab}.${key} = ${value}`);
    
    // 🆕 v3.3.0: Re-render tab quando cambiano campi trigger di visibleIf
    // Questi campi controllano la visibilità di altri campi nel form
    const isProductTab = !['posizione', 'misure'].includes(tab);
    if (isProductTab) {
        const VISIBILITY_TRIGGERS = [
            'qta', 'azienda', 'tipoAnta', 'bancaleTipo', 'antaTwinTipo',
            'codiceModello', 'fasciaColore', 'fissaggio', 'lineaF', 'lineaPF',
            'serveMotore', 'serveTapparella', 'finituraInt', 'finituraEst'
        ];
        if (VISIBILITY_TRIGGERS.includes(key)) {
            console.log(`🔄 v3.3.0: Re-render tab ${tab} (trigger: ${key})`);
            renderTabContent(tab);
        }
    }
}

function editorCreateProduct(productType) {
    // 🆕 v3.1.0: Legge default dalla config globale del progetto
    const pos = editorState.currentPosition;
    let configDefaults = {};
    
    // Cerca il progetto corrente per leggere la config globale
    if (typeof currentData !== 'undefined' && currentData) {
        const configMap = {
            infisso: 'configInfissi',
            persiana: 'configPersiane',
            tapparella: 'configTapparelle',
            zanzariera: 'configZanzariere',
            cassonetto: 'configCassonetti'
        };
        const configKey = configMap[productType];
        if (configKey && currentData[configKey]) {
            configDefaults = { ...currentData[configKey] };
        }
    }
    
    // 🆕 v1.5.0: Usa DATA_MANAGER.applyCreateProduct con template unificati
    if (typeof DATA_MANAGER !== 'undefined') {
        DATA_MANAGER.applyCreateProduct(pos, productType);
        // Sovrascrivi con config globale se disponibile
        if (Object.keys(configDefaults).length > 0 && pos[productType]) {
            for (const [key, val] of Object.entries(configDefaults)) {
                if (val !== '' && val !== null && val !== undefined && !pos[productType][key]) {
                    pos[productType][key] = val;
                }
            }
        }
    } else {
        // Fallback: template locali + config globale
        const baseQta = pos.quantita || '1';
        const templates = {
            infisso: {
                id: `inf-${Date.now()}`,
                qta: baseQta,
                tipo: '',
                tipoInfissoAssociato: 'F',
                codiceModello: '',
                azienda: configDefaults.azienda || 'finstral',
                telaio: configDefaults.telaio || '',
                finituraInt: configDefaults.finituraInt || 'pvc',
                finituraEst: configDefaults.finituraEst || 'pvc',
                coloreInt: configDefaults.coloreInt || '',
                coloreEst: configDefaults.coloreEst || '',
                tipoAnta: configDefaults.tipoAnta || '',
                vetro: configDefaults.vetro || '',
                allarme: configDefaults.allarme || '',
                cerniere: '',
                maniglia: configDefaults.maniglia || '',
                coloreManiglia: configDefaults.coloreManiglia || '',
                tagliTelaio: configDefaults.tagliTelaio || '',
                codTagliValues: [],
                ferramenta1: '',
                lato1: '',
                esecuzione1: '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            persiana: {
                id: `pers-${Date.now()}`,
                qta: baseQta,
                azienda: configDefaults.azienda || 'P. Persiane',
                modello: configDefaults.modello || '',
                tipo: '',
                apertura: '',
                fissaggio: configDefaults.fissaggio || '',
                colorePersiana: configDefaults.colorePersiana || '',
                coloreTelaio: configDefaults.coloreTelaio || '',
                battuta: configDefaults.battuta || '',
                tipoStecca: '',
                asolato: '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            tapparella: {
                id: `tapp-${Date.now()}`,
                serveTapparella: configDefaults.serveTapparella !== false,
                serveMotore: configDefaults.serveMotore || false,
                serveAccessori: configDefaults.serveAccessori || false,
                qta: baseQta,
                azienda: configDefaults.azienda || 'Plasticino',
                modello: configDefaults.modello || '',
                tipo: '',
                colore: configDefaults.colore || '',
                guida: configDefaults.guida || '',
                coloreGuida: configDefaults.coloreGuida || '',
                motoreAzienda: 'Somfy',
                motoreModello: configDefaults.motoreModelloDefault || '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            zanzariera: {
                id: `zanz-${Date.now()}`,
                qta: baseQta,
                azienda: configDefaults.azienda || 'Palagina',
                linea: '',
                modello: '',
                fasciaColore: configDefaults.fasciaColore || '',
                coloreTelaio: configDefaults.coloreTelaio || '',
                tipoRete: configDefaults.tipoRete || '',
                colorePlastica: configDefaults.colorePlastica || '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            cassonetto: {
                id: `cass-${Date.now()}`,
                qta: baseQta,
                azienda: configDefaults.azienda || 'Finstral',
                tipo: configDefaults.tipo || '',
                codiceCass: configDefaults.codiceCass || '',
                materialeCass: configDefaults.materialeCass || '',
                gruppoColoreCass: configDefaults.gruppoColoreCass || '',
                coloreCass: configDefaults.coloreCass || '',
                codiceIsolamento: configDefaults.codiceIsolamento || '',
                LS: 0,
                SRSX: 0,
                SRDX: 0,
                ZSX: 0,
                ZDX: 0,
                HCASS: 0,
                B: 0,
                C: 0,
                BSuperiore: 0,
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            }
        };
        
        if (templates[productType]) {
            pos[productType] = templates[productType];
        }
    }
    
    editorState.hasChanges = true;
    updateChangeIndicator();
    updateTabIndicators();
    editorUpdateTabBadges();
    editorSwitchTab(productType);
    console.log(`✏️ Creato nuovo ${productType} con config globale (via DATA_MANAGER: ${typeof DATA_MANAGER !== 'undefined'})`);
}

function updateChangeIndicator() {
    const indicator = document.getElementById('editorChangeIndicator');
    if (editorState.hasChanges) {
        indicator.textContent = '⚠️ Modifiche non salvate';
        indicator.className = 'editor-changes-pending';
    } else {
        indicator.textContent = 'Nessuna modifica';
        indicator.className = 'editor-changes-none';
    }
}

// ============================================================================
// SALVATAGGIO - v1.5.0 con DATA_MANAGER unificato
// ============================================================================

async function editorSave() {
    if (!editorState.hasChanges) {
        showEditorToast('ℹ️ Nessuna modifica da salvare');
        return;
    }
    
    const posIndex = editorState.currentPositionIndex;
    const posId = editorState.currentPosition.id;
    const posName = editorState.currentPosition.name || `Pos. ${posIndex + 1}`;
    
    console.log(`💾 Salvataggio posizione index=${posIndex}, id=${posId}: ${posName}`);
    
    // 🔧 v1.5.3: Crea UNA sola copia profonda da usare ovunque
    const savedPosition = JSON.parse(JSON.stringify(editorState.currentPosition));
    
    // 🔧 v1.5.3 FIX CRITICO: Usa INDICE invece di ID per aggiornare currentData
    // Gli ID possono non corrispondere tra filteredPositions e currentData.positions
    
    // Aggiorna currentData.positions usando INDICE
    if (currentData.positions && Array.isArray(currentData.positions) && currentData.positions[posIndex]) {
        currentData.positions[posIndex] = JSON.parse(JSON.stringify(savedPosition));
        console.log(`✅ currentData.positions[${posIndex}] aggiornato (via indice)`);
    }
    
    // Aggiorna currentData.posizioni usando INDICE
    if (currentData.posizioni && Array.isArray(currentData.posizioni) && currentData.posizioni[posIndex]) {
        currentData.posizioni[posIndex] = JSON.parse(JSON.stringify(savedPosition));
        console.log(`✅ currentData.posizioni[${posIndex}] aggiornato (via indice)`);
    }
    
    // 2. Marca come modificato manualmente
    if (currentData.positions?.[posIndex]?.infisso) {
        currentData.positions[posIndex].infisso.manuallyEdited = true;
    }
    if (currentData.posizioni?.[posIndex]?.infisso) {
        currentData.posizioni[posIndex].infisso.manuallyEdited = true;
    }
    
    // 3. Aggiorna metadata
    currentData.updated = new Date().toISOString();
    if (currentData.metadata) {
        currentData.metadata.updated = currentData.updated;
        currentData.metadata.version = (currentData.metadata.version || 0) + 1;
        
        if (!currentData.metadata.changes) {
            currentData.metadata.changes = [];
        }
        currentData.metadata.changes.push({
            version: currentData.metadata.version,
            timestamp: currentData.updated,
            action: 'position_edited_dashboard',
            details: `Posizione "${posName}" modificata da Dashboard Editor`,
            device: { id: 'dashboard-editor', name: 'Dashboard Editor v' + EDITOR_VERSION }
        });
    }
    
    // 4. Reset stato editor
    editorState.hasChanges = false;
    updateChangeIndicator();
    
    // 5. 🔧 v1.5.3 FIX: Aggiorna TUTTE le variabili della Dashboard usando INDICE
    try {
        // Aggiorna allPositionsData usando INDICE
        if (typeof allPositionsData !== 'undefined' && Array.isArray(allPositionsData) && allPositionsData[posIndex]) {
            allPositionsData[posIndex] = JSON.parse(JSON.stringify(savedPosition));
            console.log(`✅ allPositionsData[${posIndex}] aggiornato (via indice)`);
        }
        
        // Aggiorna filteredPositions usando INDICE
        if (typeof filteredPositions !== 'undefined' && Array.isArray(filteredPositions) && filteredPositions[posIndex]) {
            filteredPositions[posIndex] = JSON.parse(JSON.stringify(savedPosition));
            console.log(`✅ filteredPositions[${posIndex}] aggiornato (via indice)`);
        }
        
        // Aggiorna projectData usando INDICE
        if (typeof projectData !== 'undefined' && projectData) {
            if (projectData.posizioni && Array.isArray(projectData.posizioni) && projectData.posizioni[posIndex]) {
                projectData.posizioni[posIndex] = JSON.parse(JSON.stringify(savedPosition));
                console.log(`✅ projectData.posizioni[${posIndex}] aggiornato (via indice)`);
            }
            if (projectData.positions && Array.isArray(projectData.positions) && projectData.positions[posIndex]) {
                projectData.positions[posIndex] = JSON.parse(JSON.stringify(savedPosition));
                console.log(`✅ projectData.positions[${posIndex}] aggiornato (via indice)`);
            }
        }
        
        // Re-render UI
        if (typeof renderPositionsList === 'function') {
            renderPositionsList();
            console.log('✅ renderPositionsList chiamato');
        }
        
        if (typeof renderPositionDetail === 'function') {
            renderPositionDetail(posIndex);
            console.log(`✅ renderPositionDetail(${posIndex}) chiamato`);
        }
        
    } catch (uiErr) {
        console.warn('⚠️ Errore aggiornamento UI:', uiErr);
    }
    
    // 6. SYNC AUTOMATICO SU GITHUB
    showEditorToast('💾 Salvataggio in corso...');
    
    try {
        let syncSuccess = false;
        
        // Opzione 1: Usa GITHUB_SYNC (modulo condiviso)
        if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.hasToken()) {
            console.log('🔄 Sync via GITHUB_SYNC...');
            syncSuccess = await GITHUB_SYNC.salvaProgetto(currentData, { source: 'editor' });
        }
        // Opzione 2: Usa salvaProgettoSuGitHub della Dashboard
        else if (typeof salvaProgettoSuGitHub === 'function') {
            console.log('🔄 Sync via salvaProgettoSuGitHub...');
            await salvaProgettoSuGitHub();
            syncSuccess = true;
        }
        
        if (syncSuccess) {
            showEditorToast('✅ Salvato su GitHub!');
            console.log(`✅ Posizione ${posId} sincronizzata su GitHub`);
            
            // 🔧 v1.5.2: Chiudi editor e RICARICA progetto dalla cache aggiornata
            editorState.hasChanges = false;
            editorState.isOpen = false;
            document.getElementById('editorPosizioneModal').style.display = 'none';
            
            // Aggiorna githubProjects con i dati appena salvati
            if (window.githubProjects && window._githubProjectRef) {
                const projectId = window._githubProjectRef.id;
                const projectInCache = window.githubProjects.find(p => p.id === projectId);
                if (projectInCache) {
                    // Aggiorna rawData con i dati salvati
                    projectInCache.rawData = JSON.parse(JSON.stringify(currentData));
                    console.log(`✅ Cache githubProjects aggiornata per progetto ${projectId}`);
                    
                    // Ricarica il progetto (usa la funzione della dashboard)
                    if (typeof loadGitHubProject === 'function') {
                        setTimeout(() => {
                            loadGitHubProject(projectId);
                            console.log(`✅ Progetto ${projectId} ricaricato`);
                        }, 300);
                    }
                }
            } else {
                // Fallback: aggiorna solo UI se disponibile
                if (typeof renderPositionsList === 'function') {
                    setTimeout(() => renderPositionsList(), 100);
                }
                if (typeof ricalcolaTotali === 'function') {
                    setTimeout(() => ricalcolaTotali(), 200);
                }
            }
            
        } else {
            showEditorToast('✅ Salvato localmente');
            console.warn('⚠️ Nessuna funzione GitHub disponibile');
            
            // Chiudi editor
            editorState.hasChanges = false;
            editorState.isOpen = false;
            document.getElementById('editorPosizioneModal').style.display = 'none';
        }
        
    } catch (err) {
        console.error('❌ Errore sync GitHub:', err);
        showEditorToast('⚠️ Salvato localmente - Errore: ' + (err.message || err));
    }
}

function showEditorToast(message) {
    // Crea toast se non esiste
    let toast = document.getElementById('editorToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'editorToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

//  ============================================================================
// ESPORTA FUNZIONI GLOBALI
// ============================================================================

window.editorOpen = editorOpen;
window.editorClose = editorClose;
window.editorSave = editorSave;
window.editorSwitchTab = editorSwitchTab;
window.editorFieldChanged = editorFieldChanged;
window.editorCreateProduct = editorCreateProduct;

console.log('✏️ Editor Posizione - Funzioni globali registrate');
