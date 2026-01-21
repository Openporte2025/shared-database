// ============================================================================
// EDITOR POSIZIONE - Dashboard Rilievi v8.496
// ============================================================================
// Permette modifica completa di una posizione dalla Dashboard
// Usa OPZIONI da shared-database per le liste condivise
// v1.2.0: GitHub Sync automatico al salvataggio
// ============================================================================

const EDITOR_VERSION = '1.2.0';

console.log(`✏️ Editor Posizione v${EDITOR_VERSION} - Caricato`);

// ============================================================================
// HELPER: Ottiene opzioni da OPZIONI condiviso (con fallback)
// ============================================================================

function getOpt(key, fallback = []) {
    return (typeof OPZIONI !== 'undefined' && OPZIONI[key]) ? OPZIONI[key] : fallback;
}

// Estrae solo i codici da FERRAMENTA_CODICI
function getFerramentaCodici() {
    if (typeof OPZIONI !== 'undefined' && OPZIONI.FERRAMENTA_CODICI) {
        return ['', ...OPZIONI.FERRAMENTA_CODICI.map(f => f.codice)];
    }
    return ['', '99', '209', '211', '411', '409', '430', '431', '490', '491', '000'];
}

// Estrae codici lato DIN
function getLatiDinCodici() {
    if (typeof OPZIONI !== 'undefined' && OPZIONI.LATI_DIN) {
        return ['', ...OPZIONI.LATI_DIN.map(l => l.codice)];
    }
    return ['', '-1', '1'];
}

// Estrae codici esecuzione DIN
function getEsecuzioniDinCodici() {
    if (typeof OPZIONI !== 'undefined' && OPZIONI.ESECUZIONI_DIN) {
        return ['', ...OPZIONI.ESECUZIONI_DIN.map(e => e.codice)];
    }
    return ['', '0', 'M', 'B'];
}

// ============================================================================
// CONFIGURAZIONE CAMPI PER OGNI TAB (usa OPZIONI condiviso)
// ============================================================================

const EDITOR_FIELDS = {
    
    // TAB 1: Dati Posizione
    posizione: [
        { key: 'name', label: 'Nome Posizione', type: 'text', placeholder: 'Pos. 1' },
        { key: 'ambiente', label: 'Ambiente', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AMBIENTI', ['Soggiorno', 'Cucina', 'Camera', 'Bagno'])] },
        { key: 'piano', label: 'Piano', type: 'select', 
          optionsGetter: () => ['', ...getOpt('PIANI', ['Piano Terra', 'Primo Piano'])] },
        { key: 'quantita', label: 'Quantità', type: 'number', placeholder: '1' },
        { key: 'tipoposizione', label: 'Tipo Posizione', type: 'select', 
          options: ['finestra', 'porta-finestra', 'portoncino', 'blindata', 'porta-interna'] },
        { key: 'note', label: 'Note Posizione', type: 'textarea', placeholder: 'Note generali...' }
    ],
    
    // TAB 2: Misure
    misure: [
        { key: 'LI', label: 'LI - Luce Interna', type: 'number', unit: 'mm' },
        { key: 'HI', label: 'HI - Altezza Interna', type: 'number', unit: 'mm' },
        { key: 'LF', label: 'LF - Luce Foro', type: 'number', unit: 'mm' },
        { key: 'HF', label: 'HF - Altezza Foro', type: 'number', unit: 'mm' },
        { key: 'LVT', label: 'LVT - Luce Vano Tapparella', type: 'number', unit: 'mm' },
        { key: 'HVT', label: 'HVT - Altezza Vano Tapparella', type: 'number', unit: 'mm' },
        { key: 'LS', label: 'LS - Luce Strutturale', type: 'number', unit: 'mm' },
        { key: 'HS', label: 'HS - Altezza Strutturale', type: 'number', unit: 'mm' },
        { key: 'TMV', label: 'TMV - Traverso Medio Verticale', type: 'number', unit: 'mm' },
        { key: 'HMT', label: 'HMT - Altezza Montante', type: 'number', unit: 'mm' },
        { key: 'L4', label: 'L4', type: 'number', unit: 'mm' },
        { key: 'H4', label: 'H4', type: 'number', unit: 'mm' },
        { key: 'DeltaINT', label: 'Delta INT', type: 'number', unit: 'mm' },
        { key: 'DeltaEST', label: 'Delta EST', type: 'number', unit: 'mm' }
    ],
    
    // TAB 3: Infisso
    infisso: [
        { key: 'qta', label: 'Quantità', type: 'number' },
        { key: 'tipo', label: 'Tipo', type: 'select', 
          optionsGetter: () => getOpt('TIPI_INFISSO', ['F1', 'F2', 'F3', 'PF1', 'PF2', 'PF3', 'FISSO']) },
        { key: 'tipoInfissoAssociato', label: 'Categoria', type: 'select', 
          options: ['F', 'PF'] },
        { key: 'codiceModello', label: 'Codice Modello', type: 'text', placeholder: '101, 401, 420...' },
        { key: 'azienda', label: 'Azienda', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AZIENDE_INFISSI', ['Finstral'])] },
        { key: 'telaio', label: 'Telaio', type: 'select', 
          optionsGetter: () => ['', ...getOpt('FINWINDOW_TELAI_OPTIONS', [])] },
        { key: 'finituraInt', label: 'Finitura Interna', type: 'select', 
          optionsGetter: () => ['', ...getOpt('FINITURE_INFISSO', ['pvc', 'alluminio', 'legno'])] },
        { key: 'finituraEst', label: 'Finitura Esterna', type: 'select', 
          optionsGetter: () => ['', ...getOpt('FINITURE_INFISSO', ['pvc', 'alluminio', 'legno'])] },
        { key: 'coloreInt', label: 'Colore Interno', type: 'select',
          optionsGetter: () => ['', ...getOpt('COLORI_PVC', []), ...getOpt('COLORI_ALLUMINIO', []), ...getOpt('COLORI_LEGNO', [])] },
        { key: 'coloreEst', label: 'Colore Esterno', type: 'select',
          optionsGetter: () => ['', ...getOpt('COLORI_PVC', []), ...getOpt('COLORI_ALLUMINIO', []), ...getOpt('COLORI_LEGNO', [])] },
        { key: 'tipoAnta', label: 'Tipo Anta', type: 'select', 
          optionsGetter: () => ['', ...getOpt('TIPI_ANTA', ['Nova-line', 'Slim-line', 'Classic-line', 'Step-line'])] },
        { key: 'vetro', label: 'Vetro', type: 'select', 
          optionsGetter: () => ['', ...getOpt('TIPI_VETRO', ['Standard', 'Doppio', 'Triplo'])] },
        { key: 'allarme', label: 'Allarme', type: 'select', 
          optionsGetter: () => getOpt('OPZIONI_ALLARME', ['', 'Predisposizione', 'Completo']) },
        { key: 'cerniere', label: 'Cerniere', type: 'select', 
          options: ['', 'a-vista', 'nascoste', 'a-scomparsa'] },
        { key: 'maniglia', label: 'Maniglia', type: 'select', 
          optionsGetter: () => ['', ...getOpt('MANIGLIE_FINSTRAL', [])] },
        { key: 'coloreManiglia', label: 'Colore Maniglia', type: 'select', 
          optionsGetter: () => ['', ...getOpt('COLORI_MANIGLIA', [])] },
        { key: 'tagliTelaio', label: 'Tagli Telaio', type: 'text' },
        // Ferramenta (usa codici estratti)
        { key: 'ferramenta1', label: 'Ferramenta 1', type: 'select', 
          optionsGetter: () => getFerramentaCodici() },
        { key: 'lato1', label: 'Lato 1', type: 'select', 
          optionsGetter: () => getLatiDinCodici() },
        { key: 'esecuzione1', label: 'Esecuzione 1', type: 'select', 
          optionsGetter: () => getEsecuzioniDinCodici() },
        { key: 'ferramenta2', label: 'Ferramenta 2', type: 'select', 
          optionsGetter: () => getFerramentaCodici() },
        { key: 'lato2', label: 'Lato 2', type: 'select', 
          optionsGetter: () => getLatiDinCodici() },
        { key: 'esecuzione2', label: 'Esecuzione 2', type: 'select', 
          optionsGetter: () => getEsecuzioniDinCodici() },
        { key: 'ferramenta3', label: 'Ferramenta 3', type: 'select', 
          optionsGetter: () => getFerramentaCodici() },
        { key: 'lato3', label: 'Lato 3', type: 'select', 
          optionsGetter: () => getLatiDinCodici() },
        { key: 'esecuzione3', label: 'Esecuzione 3', type: 'select', 
          optionsGetter: () => getEsecuzioniDinCodici() },
        // Bancale
        { key: 'bancaleTipo', label: 'Bancale Tipo', type: 'select', 
          options: ['', 'PVC', 'LEGNO_95000', 'LEGNO_96000'] },
        { key: 'bancaleBordo', label: 'Bancale Bordo', type: 'text' },
        { key: 'bancaleProfondita', label: 'Bancale Profondità', type: 'number', unit: 'mm' },
        // Anta Twin
        { key: 'antaTwinTipo', label: 'Anta Twin Tipo', type: 'select', 
          options: ['', 'veneziana', 'plissettata'] },
        { key: 'antaTwinModello', label: 'Anta Twin Modello', type: 'select', 
          options: ['', 'SLIM_TWIN', 'SLIM_TWIN_90', 'SLIM_CRISTAL_TWIN', 'SLIM_CRISTAL_TWIN_90', 'NOVA_TWIN', 'NOVA_TWIN_90'] },
        { key: 'antaTwinColore', label: 'Anta Twin Colore', type: 'text' },
        { key: 'antaTwinComando', label: 'Anta Twin Comando', type: 'select', 
          options: ['27', '30', '30-1'] },
        // BRM calcolati
        { key: 'BRM_L', label: 'BRM Larghezza', type: 'number', unit: 'mm', readonly: false },
        { key: 'BRM_H', label: 'BRM Altezza', type: 'number', unit: 'mm', readonly: false },
        { key: 'note', label: 'Note Infisso', type: 'textarea' }
    ],
    
    // TAB 4: Persiana
    persiana: [
        { key: 'qta', label: 'Quantità', type: 'number' },
        { key: 'azienda', label: 'Azienda', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AZIENDE_PERSIANE', ['P. Persiane'])] },
        { key: 'modello', label: 'Modello', type: 'select', 
          optionsGetter: () => ['', ...getOpt('MODELLI_PERSIANA', [])] },
        { key: 'tipo', label: 'Tipo', type: 'select', 
          optionsGetter: () => ['', ...getOpt('TIPI_PERSIANA', ['F1', 'F2', 'PF1', 'PF2'])] },
        { key: 'apertura', label: 'Apertura', type: 'select', 
          optionsGetter: () => ['', ...getOpt('APERTURE_PERSIANA', [])] },
        { key: 'fissaggio', label: 'Fissaggio', type: 'select', 
          optionsGetter: () => ['', ...getOpt('FISSAGGI_PERSIANA', ['Muro', 'Telaio'])] },
        { key: 'colorePersiana', label: 'Colore Persiana', type: 'select', 
          optionsGetter: () => ['', ...getOpt('COLORI_PERSIANA', [])] },
        { key: 'coloreTelaio', label: 'Colore Telaio', type: 'select', 
          optionsGetter: () => ['', ...getOpt('COLORI_PERSIANA', [])] },
        { key: 'battuta', label: 'Battuta', type: 'select', 
          options: ['', '3 LATI', '4 LATI'] },
        { key: 'tipoStecca', label: 'Tipo Stecca', type: 'text' },
        { key: 'asolato', label: 'Asolato', type: 'text' },
        { key: 'BRM_L', label: 'BRM Larghezza', type: 'number', unit: 'mm' },
        { key: 'BRM_H', label: 'BRM Altezza', type: 'number', unit: 'mm' },
        { key: 'note', label: 'Note Persiana', type: 'textarea' }
    ],
    
    // TAB 5: Tapparella
    tapparella: [
        { key: 'serveTapparella', label: 'Serve Tapparella', type: 'checkbox' },
        { key: 'serveMotore', label: 'Serve Motore', type: 'checkbox' },
        { key: 'serveAccessori', label: 'Serve Accessori', type: 'checkbox' },
        { key: 'qta', label: 'Quantità', type: 'number' },
        { key: 'azienda', label: 'Azienda', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AZIENDE_TAPPARELLE', ['Plasticino'])] },
        { key: 'modello', label: 'Modello', type: 'select', 
          optionsGetter: () => {
              const modelli = getOpt('MODELLI_TAPPARELLE', {})['Plasticino'] || [];
              return ['', ...modelli.map(m => `${m.cod} - ${m.nome}`)];
          }},
        { key: 'tipo', label: 'Tipo', type: 'text' },
        { key: 'colore', label: 'Colore', type: 'select', 
          optionsGetter: () => {
              const colori = getOpt('COLORI_TAPPARELLE_PLASTICINO', {});
              let all = [''];
              Object.values(colori).forEach(arr => all = all.concat(arr));
              return all;
          }},
        { key: 'guida', label: 'Guida', type: 'select', 
          optionsGetter: () => ['', ...getOpt('GUIDE_PLASTICINO', [])] },
        { key: 'coloreGuida', label: 'Colore Guida', type: 'select', 
          optionsGetter: () => {
              if (typeof OPZIONI !== 'undefined' && OPZIONI.getColoriGuide) {
                  return ['', ...OPZIONI.getColoriGuide()];
              }
              return ['', 'Argento', 'Bronzo', 'Bianco'];
          }},
        { key: 'manualeMot', label: 'Manuale/Motorizzata', type: 'select', 
          options: ['', 'Manuale', 'Motorizzata'] },
        { key: 'motoreAzienda', label: 'Motore Azienda', type: 'text', placeholder: 'Somfy' },
        { key: 'motoreModello', label: 'Motore Modello', type: 'select', 
          optionsGetter: () => {
              const motori = getOpt('MOTORI_SOMFY', []);
              return ['', ...motori.map(m => m.modello)];
          }},
        { key: 'BRM_L', label: 'BRM Larghezza', type: 'number', unit: 'mm' },
        { key: 'BRM_H', label: 'BRM Altezza', type: 'number', unit: 'mm' },
        { key: 'note', label: 'Note Tapparella', type: 'textarea' }
    ],
    
    // TAB 6: Zanzariera
    zanzariera: [
        { key: 'qta', label: 'Quantità', type: 'number' },
        { key: 'azienda', label: 'Azienda', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AZIENDE_ZANZARIERE', ['Palagina'])] },
        { key: 'linea', label: 'Linea', type: 'text' },
        { key: 'modello', label: 'Modello', type: 'text' },
        { key: 'fasciaColore', label: 'Fascia Colore', type: 'select', 
          optionsGetter: () => ['', ...getOpt('FASCE_COLORE_PALAGINA', [])] },
        { key: 'coloreTelaio', label: 'Colore Telaio', type: 'select', 
          optionsGetter: () => ['', ...getOpt('COLORI_TELAIO_PALAGINA', [])] },
        { key: 'tipoRete', label: 'Tipo Rete', type: 'select', 
          optionsGetter: () => ['', ...getOpt('TIPI_RETE_PALAGINA', [])] },
        { key: 'colorePlastica', label: 'Colore Plastica', type: 'select', 
          optionsGetter: () => ['', ...getOpt('COLORI_PLASTICA_PALAGINA', [])] },
        { key: 'BRM_L', label: 'BRM Larghezza', type: 'number', unit: 'mm' },
        { key: 'BRM_H', label: 'BRM Altezza', type: 'number', unit: 'mm' },
        { key: 'note', label: 'Note Zanzariera', type: 'textarea' }
    ],
    
    // TAB 7: Cassonetto
    cassonetto: [
        { key: 'qta', label: 'Quantità', type: 'number' },
        { key: 'azienda', label: 'Azienda', type: 'select', 
          optionsGetter: () => ['', ...getOpt('AZIENDE_CASSONETTI', ['Finstral'])] },
        { key: 'tipo', label: 'Tipo', type: 'select', 
          optionsGetter: () => ['', ...getOpt('TIPI_CASSONETTO', [])] },
        { key: 'codiceCass', label: 'Codice Cassonetto', type: 'select', 
          optionsGetter: () => {
              const pvc = getOpt('CODICI_CASSONETTO_PVC', []);
              const legno = getOpt('CODICI_CASSONETTO_LEGNO', []);
              return ['', ...pvc.map(c => c.nome), ...legno.map(c => c.nome)];
          }},
        { key: 'materialeCass', label: 'Materiale', type: 'select', 
          optionsGetter: () => ['', ...getOpt('MATERIALI_CASSONETTO', ['PVC', 'Legno'])] },
        { key: 'gruppoColoreCass', label: 'Gruppo Colore', type: 'text' },
        { key: 'coloreCass', label: 'Colore Cassonetto', type: 'text' },
        { key: 'codiceIsolamento', label: 'Codice Isolamento', type: 'text' },
        { key: 'LS', label: 'LS', type: 'number', unit: 'mm' },
        { key: 'SRSX', label: 'SRSX', type: 'number', unit: 'mm' },
        { key: 'SRDX', label: 'SRDX', type: 'number', unit: 'mm' },
        { key: 'ZSX', label: 'ZSX', type: 'number', unit: 'mm' },
        { key: 'ZDX', label: 'ZDX', type: 'number', unit: 'mm' },
        { key: 'HCASS', label: 'HCASS', type: 'number', unit: 'mm' },
        { key: 'B', label: 'B', type: 'number', unit: 'mm' },
        { key: 'C', label: 'C', type: 'number', unit: 'mm' },
        { key: 'BSuperiore', label: 'B Superiore', type: 'number', unit: 'mm' },
        { key: 'BRM_L', label: 'BRM Larghezza', type: 'number', unit: 'mm' },
        { key: 'BRM_H', label: 'BRM Altezza', type: 'number', unit: 'mm' },
        { key: 'note', label: 'Note Cassonetto', type: 'textarea' }
    ]
};

// ============================================================================
// STATO EDITOR
// ============================================================================

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
    if (typeof currentData === 'undefined' || !currentData || !currentData.positions) {
        alert('❌ Nessun progetto caricato. Importa prima un JSON.');
        return;
    }
    
    if (positionIndex < 0 || positionIndex >= currentData.positions.length) {
        alert('❌ Posizione non valida');
        return;
    }
    
    // Salva stato
    editorState.currentPositionIndex = positionIndex;
    editorState.currentPosition = JSON.parse(JSON.stringify(currentData.positions[positionIndex])); // Deep clone
    editorState.hasChanges = false;
    editorState.isOpen = true;
    
    // Aggiorna titolo
    const pos = editorState.currentPosition;
    document.getElementById('editorTitle').textContent = 
        `Modifica: ${pos.name || 'Posizione'} - ${pos.ambiente || ''} (${pos.piano || ''})`;
    
    // Aggiorna indicatori tab
    updateTabIndicators();
    
    // Mostra primo tab
    editorSwitchTab('posizione');
    
    // Mostra modal
    document.getElementById('editorPosizioneModal').style.display = 'flex';
    
    // Reset indicatore modifiche
    updateChangeIndicator();
    
    console.log(`✏️ Editor aperto per posizione ${positionIndex}:`, pos.name);
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
        container.innerHTML = `
            <div class="editor-null-notice">
                <h4>🚫 ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} non presente</h4>
                <p>Questa posizione non ha un ${tabName} associato.</p>
                <button onclick="editorCreateProduct('${tabName}')">
                    ➕ Aggiungi ${tabName}
                </button>
            </div>
        `;
        return;
    }
    
    // Renderizza campi
    const fields = EDITOR_FIELDS[tabName] || [];
    let html = '';
    
    fields.forEach(field => {
        const value = dataSource[field.key] !== undefined ? dataSource[field.key] : '';
        const fieldClass = field.type === 'textarea' ? 'editor-field full-width' : 
                          field.type === 'checkbox' ? 'editor-field editor-field-checkbox' : 'editor-field';
        
        html += `<div class="${fieldClass}">`;
        
        if (field.type === 'checkbox') {
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
                
                html += `<select id="field_${tabName}_${field.key}" 
                                data-tab="${tabName}" 
                                data-key="${field.key}"
                                onchange="editorFieldChanged(this)">`;
                options.forEach(opt => {
                    const selected = String(value) === String(opt) ? 'selected' : '';
                    const label = opt === '' ? '-- Seleziona --' : opt;
                    html += `<option value="${opt}" ${selected}>${label}</option>`;
                });
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
    
    container.innerHTML = html;
}

function editorFieldChanged(element) {
    const tab = element.dataset.tab;
    const key = element.dataset.key;
    let value;
    
    if (element.type === 'checkbox') {
        value = element.checked;
    } else if (element.type === 'number') {
        value = element.value === '' ? '' : element.value;
    } else {
        value = element.value;
    }
    
    // Aggiorna stato
    if (tab === 'posizione') {
        editorState.currentPosition[key] = value;
    } else if (tab === 'misure') {
        if (!editorState.currentPosition.misure) {
            editorState.currentPosition.misure = {};
        }
        editorState.currentPosition.misure[key] = value;
    } else {
        if (!editorState.currentPosition[tab]) {
            editorState.currentPosition[tab] = {};
        }
        editorState.currentPosition[tab][key] = value;
    }
    
    // Marca come modificato
    element.classList.add('changed');
    editorState.hasChanges = true;
    updateChangeIndicator();
    
    console.log(`✏️ Campo modificato: ${tab}.${key} = ${value}`);
}

function editorCreateProduct(productType) {
    // Template vuoti per ogni prodotto
    const templates = {
        infisso: {
            id: `inf-${Date.now()}`,
            qta: '1',
            tipo: '',
            tipoInfissoAssociato: '',
            codiceModello: '',
            azienda: 'finstral',
            telaio: '',
            finituraInt: 'pvc',
            finituraEst: 'pvc',
            coloreInt: '',
            coloreEst: '',
            tipoAnta: '',
            vetro: '',
            allarme: '',
            cerniere: '',
            maniglia: '',
            coloreManiglia: '',
            tagliTelaio: '',
            codTagliValues: [],
            ferramenta1: '',
            lato1: '',
            esecuzione1: '',
            ferramenta2: '',
            lato2: '',
            esecuzione2: '',
            ferramenta3: '',
            lato3: '',
            esecuzione3: '',
            bancaleTipo: '',
            bancaleBordo: '0',
            bancaleProfondita: '',
            antaTwinTipo: '',
            antaTwinModello: '',
            antaTwinColore: '',
            antaTwinComando: '27',
            BRM_L: 0,
            BRM_H: 0,
            note: ''
        },
        persiana: {
            id: `pers-${Date.now()}`,
            qta: '1',
            azienda: 'P. Persiane',
            modello: '',
            tipo: '',
            apertura: '',
            fissaggio: '',
            colorePersiana: '',
            coloreTelaio: '',
            battuta: '',
            tipoStecca: '',
            asolato: '',
            BRM_L: 0,
            BRM_H: 0,
            note: ''
        },
        tapparella: {
            id: `tapp-${Date.now()}`,
            serveTapparella: true,
            serveMotore: false,
            serveAccessori: false,
            qta: '1',
            azienda: 'Plasticino',
            modello: '',
            tipo: '',
            colore: '',
            guida: '',
            coloreGuida: '',
            manualeMot: '',
            motoreAzienda: 'Somfy',
            motoreModello: '',
            BRM_L: 0,
            BRM_H: 0,
            note: ''
        },
        zanzariera: {
            id: `zanz-${Date.now()}`,
            qta: '1',
            azienda: 'Palagina',
            linea: '',
            modello: '',
            fasciaColore: '',
            coloreTelaio: '',
            tipoRete: '',
            colorePlastica: '',
            BRM_L: 0,
            BRM_H: 0,
            note: ''
        },
        cassonetto: {
            id: `cass-${Date.now()}`,
            qta: '1',
            azienda: 'Finstral',
            tipo: '',
            codiceCass: '',
            materialeCass: '',
            gruppoColoreCass: '',
            coloreCass: '',
            codiceIsolamento: '',
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
        editorState.currentPosition[productType] = templates[productType];
        editorState.hasChanges = true;
        updateChangeIndicator();
        updateTabIndicators();
        editorSwitchTab(productType);
        console.log(`✏️ Creato nuovo ${productType}`);
    }
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
// SALVATAGGIO - v1.2.0 con GitHub Sync automatico
// ============================================================================

async function editorSave() {
    if (!editorState.hasChanges) {
        showEditorToast('ℹ️ Nessuna modifica da salvare');
        return;
    }
    
    const posIndex = editorState.currentPositionIndex;
    const posName = editorState.currentPosition.name || `Pos. ${posIndex + 1}`;
    
    console.log(`💾 Salvataggio posizione ${posIndex}: ${posName}`);
    
    // 1. Aggiorna la posizione in currentData
    currentData.positions[posIndex] = JSON.parse(JSON.stringify(editorState.currentPosition));
    
    // 2. Marca come modificato manualmente (protezione auto-sync)
    if (currentData.positions[posIndex].infisso) {
        currentData.positions[posIndex].infisso.manuallyEdited = true;
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
            device: { id: 'dashboard-editor', name: 'Dashboard Editor Posizione' }
        });
    }
    
    // 4. Reset stato editor
    editorState.hasChanges = false;
    updateChangeIndicator();
    
    // 5. Aggiorna TUTTA la UI
    try {
        // Lista posizioni laterale
        if (typeof renderPositionsList === 'function') {
            renderPositionsList();
        }
        // Dettaglio posizione selezionata
        if (typeof selectPosition === 'function') {
            selectPosition(posIndex);
        }
        // Tabella posizioni principale
        if (typeof renderPositionsTable === 'function') {
            renderPositionsTable();
        }
        // Statistiche dashboard
        if (typeof updateStatistiche === 'function') {
            updateStatistiche();
        }
        // Ricalcola preventivo
        if (typeof calcolaPreventivo === 'function') {
            calcolaPreventivo();
        }
        // Aggiorna configurazione globale vista
        if (typeof renderConfigFields === 'function' && typeof projectData !== 'undefined') {
            // Refresh config se visibile
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
        // Opzione 3: Usa uploadToGitHub dell'App Rilievo
        else if (typeof uploadToGitHub === 'function') {
            console.log('🔄 Sync via uploadToGitHub...');
            await uploadToGitHub();
            syncSuccess = true;
        }
        
        if (syncSuccess) {
            showEditorToast('✅ Salvato e sincronizzato su GitHub!');
            console.log(`✅ Posizione ${posIndex} sincronizzata su GitHub`);
        } else {
            showEditorToast('✅ Salvato localmente (GitHub non configurato)');
            console.warn('⚠️ Nessuna funzione GitHub disponibile');
        }
        
    } catch (err) {
        console.error('❌ Errore sync GitHub:', err);
        showEditorToast('⚠️ Salvato localmente - Errore GitHub: ' + (err.message || err));
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

// ============================================================================
// ESPORTA FUNZIONI GLOBALI
// ============================================================================

window.editorOpen = editorOpen;
window.editorClose = editorClose;
window.editorSave = editorSave;
window.editorSwitchTab = editorSwitchTab;
window.editorFieldChanged = editorFieldChanged;
window.editorCreateProduct = editorCreateProduct;

console.log('✏️ Editor Posizione - Funzioni globali registrate');
