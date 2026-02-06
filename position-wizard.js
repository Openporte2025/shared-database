// ============================================================================
// POSITION-WIZARD.js - Wizard Aggiunta Posizioni
// ============================================================================
// Modulo condiviso per Dashboard Ufficio e App Rilievo
// Versione semplificata per Dashboard, stesse selezioni dell'App Rilievo
//
// USO:
//   POSITION_WIZARD.open(project)           - Apre il wizard
//   POSITION_WIZARD.close()                 - Chiude il wizard
//   POSITION_WIZARD.create(project, data)   - Crea posizione da dati
//
// @version 1.0.0
// @repository shared-database
// ============================================================================

const POSITION_WIZARD_VERSION = '1.1.0';

(function() {
    'use strict';
    
    console.log(`📍 Position Wizard v${POSITION_WIZARD_VERSION} - Caricamento...`);
    
    // ========================================================================
    // COSTANTI - leggono da opzioni-comuni.js (UNICA FONTE)
    // ========================================================================
    
    // ⚠️ MAI hardcodare liste qui. Usare SEMPRE window.OPZIONI da opzioni-comuni.js
    const AMBIENTI = (window.OPZIONI && window.OPZIONI.AMBIENTI) || [
        'Sala', 'Soggiorno', 'Cucina', 'Camera', 'Bagno', 'Studio', 'Cantina', 'Garage'
    ];
    
    const PIANI = (window.OPZIONI && window.OPZIONI.PIANI) || [
        'Interrato', 'Piano Terra', 'Primo Piano', 'Secondo Piano', 'Mansarda'
    ];
    
    const TIPI_POSIZIONE = [
        { id: 'finestra', label: 'Finestra', icon: '🪟', desc: 'Infissi, persiane, tapparelle...' },
        { id: 'ingresso', label: 'Ingresso', icon: '🚪', desc: 'Portoncino o Blindata' },
        { id: 'porta_interna', label: 'Porta Interna', icon: '🚪', desc: 'FerreroLegno, Flessya' },
        { id: 'tenda_bracci', label: 'Tenda a Bracci', icon: '☀️', desc: 'Tende da sole Gibus' }
    ];
    
    const PRODOTTI_MAP = {
        infissi:      { singolare: 'infisso',      label: 'Infisso',       icon: '🪟' },
        persiane:     { singolare: 'persiana',     label: 'Persiana',      icon: '🚪' },
        tapparelle:   { singolare: 'tapparella',   label: 'Tapparella',    icon: '🎚️' },
        zanzariere:   { singolare: 'zanzariera',   label: 'Zanzariera',    icon: '🦟' },
        cassonetti:   { singolare: 'cassonetto',   label: 'Cassonetto',    icon: '📦' },
        blindate:     { singolare: 'blindata',     label: 'Blindata',      icon: '🔐' },
        portoncini:   { singolare: 'portoncino',   label: 'Portoncino',    icon: '🚪' },
        porteInterne: { singolare: 'portaInterna', label: 'Porta Interna', icon: '🚪' },
        clickZip:     { singolare: 'clickZip',     label: 'Click Zip',     icon: '🪟' },
        tendeBracci:  { singolare: 'tendaBracci',  label: 'Tenda Bracci',  icon: '☀️' }
    };
    
    // ========================================================================
    // STATO WIZARD
    // ========================================================================
    
    let wizardState = {
        isOpen: false,
        project: null,
        step: 1,
        data: {
            name: '',
            piano: '',
            ambiente: '',
            ambienteCustom: '',
            tipoposizione: 'finestra',
            quantita: 1,
            prodottiSelezionati: []
        },
        callbacks: {
            onSave: null,
            onCancel: null
        }
    };
    
    // ========================================================================
    // HELPERS
    // ========================================================================
    
    /**
     * Genera ID univoco per la posizione
     */
    function generatePositionId(projectId, existingPositions) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 4);
        return `pos-${timestamp}-${random}`;
    }
    
    /**
     * Trova il prossimo numero posizione libero
     */
    function getNextPositionNumber(positions) {
        if (!positions || positions.length === 0) return 1;
        
        const usedNumbers = new Set();
        positions.forEach(p => {
            const match = (p.name || '').match(/Pos\.\s*(\d+)/);
            if (match) {
                usedNumbers.add(parseInt(match[1]));
            }
        });
        
        let num = 1;
        while (usedNumbers.has(num)) {
            num++;
        }
        return num;
    }
    
    /**
     * Ottiene i prodotti attivi nel progetto
     */
    function getActiveProdotti(project) {
        const prodotti = [];
        if (!project?.prodotti) return prodotti;
        
        Object.keys(project.prodotti).forEach(tipo => {
            if (project.prodotti[tipo] === true && PRODOTTI_MAP[tipo]) {
                prodotti.push({
                    tipo: tipo,
                    ...PRODOTTI_MAP[tipo]
                });
            }
        });
        
        return prodotti;
    }
    
    // ========================================================================
    // RENDER WIZARD
    // ========================================================================
    
    /**
     * Crea e mostra il modal del wizard
     */
    function renderWizard() {
        // Rimuovi wizard esistente
        const existing = document.getElementById('position-wizard-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'position-wizard-overlay';
        overlay.className = 'position-wizard-overlay';
        overlay.innerHTML = `
            <div class="position-wizard-modal">
                <div class="position-wizard-header">
                    <h2>📍 Nuova Posizione</h2>
                    <button class="position-wizard-close" onclick="POSITION_WIZARD.close()">✕</button>
                </div>
                
                <div class="position-wizard-steps">
                    <div class="wizard-step ${wizardState.step === 1 ? 'active' : wizardState.step > 1 ? 'completed' : ''}">
                        <span class="step-number">1</span>
                        <span class="step-label">Dati Base</span>
                    </div>
                    <div class="wizard-step-connector ${wizardState.step > 1 ? 'active' : ''}"></div>
                    <div class="wizard-step ${wizardState.step === 2 ? 'active' : wizardState.step > 2 ? 'completed' : ''}">
                        <span class="step-number">2</span>
                        <span class="step-label">Prodotti</span>
                    </div>
                </div>
                
                <div class="position-wizard-body">
                    ${wizardState.step === 1 ? renderStep1() : renderStep2()}
                </div>
                
                <div class="position-wizard-footer">
                    ${wizardState.step > 1 ? `
                        <button class="wizard-btn wizard-btn-secondary" onclick="POSITION_WIZARD.prevStep()">
                            ← Indietro
                        </button>
                    ` : `
                        <button class="wizard-btn wizard-btn-secondary" onclick="POSITION_WIZARD.close()">
                            Annulla
                        </button>
                    `}
                    
                    ${wizardState.step < 2 ? `
                        <button class="wizard-btn wizard-btn-primary" onclick="POSITION_WIZARD.nextStep()">
                            Avanti →
                        </button>
                    ` : `
                        <button class="wizard-btn wizard-btn-success" onclick="POSITION_WIZARD.save()">
                            ✓ Crea Posizione
                        </button>
                    `}
                </div>
            </div>
        `;
        
        // Aggiungi stili se non esistono
        if (!document.getElementById('position-wizard-styles')) {
            const styles = document.createElement('style');
            styles.id = 'position-wizard-styles';
            styles.textContent = getWizardStyles();
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(overlay);
        
        // Focus sul primo input
        setTimeout(() => {
            const firstInput = overlay.querySelector('input:not([type="checkbox"]):not([type="radio"]), select');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    /**
     * Step 1: Dati base (nome, piano, ambiente, tipo)
     */
    function renderStep1() {
        const project = wizardState.project;
        const data = wizardState.data;
        
        // Default piano dal progetto
        const defaultPiano = project?.clientData?.piano || project?.piano || '';
        if (!data.piano && defaultPiano) {
            data.piano = defaultPiano;
        }
        
        // Default nome
        if (!data.name) {
            const nextNum = getNextPositionNumber(project?.positions || project?.posizioni || []);
            data.name = `Pos. ${nextNum}`;
        }
        
        return `
            <div class="wizard-form">
                <!-- Nome Posizione -->
                <div class="wizard-field">
                    <label>Nome Posizione</label>
                    <input type="text" 
                           id="wizard-name"
                           value="${data.name}"
                           onchange="POSITION_WIZARD.updateData('name', this.value)"
                           placeholder="Es: Pos. 1">
                </div>
                
                <!-- Piano -->
                <div class="wizard-field">
                    <label>Piano</label>
                    <select id="wizard-piano"
                            onchange="POSITION_WIZARD.updateData('piano', this.value)">
                        <option value="">-- Seleziona --</option>
                        ${PIANI.map(p => `
                            <option value="${p}" ${data.piano === p ? 'selected' : ''}>${p}</option>
                        `).join('')}
                    </select>
                    <input type="text"
                           id="wizard-piano-custom"
                           value="${!PIANI.includes(data.piano) ? data.piano : ''}"
                           onchange="POSITION_WIZARD.updateData('piano', this.value)"
                           placeholder="Oppure scrivi..."
                           style="margin-top: 0.5rem;">
                </div>
                
                <!-- Ambiente -->
                <div class="wizard-field">
                    <label>Ambiente <span class="required">*</span></label>
                    <select id="wizard-ambiente"
                            onchange="POSITION_WIZARD.updateData('ambiente', this.value)">
                        <option value="">⚠️ Seleziona ambiente...</option>
                        ${AMBIENTI.map(a => `
                            <option value="${a}" ${data.ambiente === a ? 'selected' : ''}>${a}</option>
                        `).join('')}
                        <option value="__custom__" ${data.ambiente === '__custom__' ? 'selected' : ''}>✏️ Altro...</option>
                    </select>
                    ${data.ambiente === '__custom__' || (!AMBIENTI.includes(data.ambiente) && data.ambiente) ? `
                        <input type="text"
                               id="wizard-ambiente-custom"
                               value="${data.ambienteCustom || data.ambiente}"
                               onchange="POSITION_WIZARD.updateData('ambienteCustom', this.value)"
                               placeholder="Scrivi ambiente..."
                               style="margin-top: 0.5rem;">
                    ` : ''}
                </div>
                
                <!-- Quantità -->
                <div class="wizard-field">
                    <label>Quantità (posizioni uguali)</label>
                    <input type="number" 
                           id="wizard-quantita"
                           min="1" max="20"
                           value="${data.quantita || 1}"
                           onchange="POSITION_WIZARD.updateData('quantita', parseInt(this.value) || 1)">
                </div>
                
                <!-- Tipo Posizione -->
                <div class="wizard-field">
                    <label>Tipo Posizione</label>
                    <div class="wizard-tipo-grid">
                        ${TIPI_POSIZIONE.map(tipo => `
                            <label class="wizard-tipo-option ${data.tipoposizione === tipo.id ? 'selected' : ''}">
                                <input type="radio" 
                                       name="wizard-tipo"
                                       value="${tipo.id}"
                                       ${data.tipoposizione === tipo.id ? 'checked' : ''}
                                       onchange="POSITION_WIZARD.updateData('tipoposizione', '${tipo.id}')">
                                <span class="tipo-icon">${tipo.icon}</span>
                                <span class="tipo-label">${tipo.label}</span>
                                <span class="tipo-desc">${tipo.desc}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Step 2: Selezione prodotti
     */
    function renderStep2() {
        const project = wizardState.project;
        const data = wizardState.data;
        const prodottiAttivi = getActiveProdotti(project);
        
        // Se nessun prodotto configurato nel progetto, mostra tutti
        const prodottiDaMostrare = prodottiAttivi.length > 0 
            ? prodottiAttivi 
            : Object.keys(PRODOTTI_MAP).map(k => ({ tipo: k, ...PRODOTTI_MAP[k] }));
        
        // Filtra in base al tipo posizione
        const tipo = data.tipoposizione;
        let prodottiFiltrati = prodottiDaMostrare;
        
        if (tipo === 'ingresso') {
            prodottiFiltrati = prodottiDaMostrare.filter(p => 
                ['blindate', 'portoncini'].includes(p.tipo)
            );
        } else if (tipo === 'porta_interna') {
            prodottiFiltrati = prodottiDaMostrare.filter(p => 
                ['porteInterne'].includes(p.tipo)
            );
        } else if (tipo === 'tenda_bracci') {
            prodottiFiltrati = prodottiDaMostrare.filter(p => 
                ['tendeBracci'].includes(p.tipo)
            );
        } else {
            // Finestra: escludi porte
            prodottiFiltrati = prodottiDaMostrare.filter(p => 
                !['blindate', 'portoncini', 'porteInterne', 'tendeBracci'].includes(p.tipo)
            );
        }
        
        return `
            <div class="wizard-form">
                <div class="wizard-info">
                    <strong>📍 ${data.name}</strong> - ${data.piano || 'Piano'} / ${data.ambienteCustom || data.ambiente || 'Ambiente'}
                </div>
                
                <div class="wizard-field">
                    <label>Seleziona i prodotti presenti in questa posizione:</label>
                    
                    ${prodottiFiltrati.length === 0 ? `
                        <div class="wizard-alert">
                            ⚠️ Nessun prodotto configurato per questo tipo di posizione.
                            Configura prima i prodotti nel progetto.
                        </div>
                    ` : `
                        <div class="wizard-prodotti-grid">
                            ${prodottiFiltrati.map(prod => {
                                const isSelected = data.prodottiSelezionati.includes(prod.singolare);
                                return `
                                    <label class="wizard-prodotto-option ${isSelected ? 'selected' : ''}">
                                        <input type="checkbox"
                                               value="${prod.singolare}"
                                               ${isSelected ? 'checked' : ''}
                                               onchange="POSITION_WIZARD.toggleProdotto('${prod.singolare}')">
                                        <span class="prodotto-icon">${prod.icon}</span>
                                        <span class="prodotto-label">${prod.label}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
                
                <div class="wizard-hint">
                    💡 I prodotti selezionati verranno inizializzati con la configurazione globale del progetto.
                    Potrai modificare i dettagli dopo aver creato la posizione.
                </div>
            </div>
        `;
    }
    
    // ========================================================================
    // STILI CSS
    // ========================================================================
    
    function getWizardStyles() {
        return `
            .position-wizard-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
            }
            
            .position-wizard-modal {
                background: white;
                border-radius: 16px;
                width: 95%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            }
            
            .position-wizard-header {
                padding: 1.25rem 1.5rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .position-wizard-header h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
            }
            
            .position-wizard-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 1.25rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .position-wizard-close:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }
            
            .position-wizard-steps {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                background: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
                gap: 0.5rem;
            }
            
            .wizard-step {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                background: #e5e7eb;
                color: #6b7280;
                font-size: 0.9rem;
                transition: all 0.3s;
            }
            
            .wizard-step.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .wizard-step.completed {
                background: #10b981;
                color: white;
            }
            
            .step-number {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.8rem;
            }
            
            .wizard-step-connector {
                width: 40px;
                height: 3px;
                background: #e5e7eb;
                border-radius: 2px;
            }
            
            .wizard-step-connector.active {
                background: #10b981;
            }
            
            .position-wizard-body {
                flex: 1;
                overflow-y: auto;
                padding: 1.5rem;
            }
            
            .wizard-form {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }
            
            .wizard-field {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .wizard-field label {
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
            }
            
            .wizard-field .required {
                color: #ef4444;
            }
            
            .wizard-field input[type="text"],
            .wizard-field input[type="number"],
            .wizard-field select {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.2s;
            }
            
            .wizard-field input:focus,
            .wizard-field select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .wizard-tipo-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.75rem;
            }
            
            .wizard-tipo-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }
            
            .wizard-tipo-option:hover {
                border-color: #667eea;
                background: #f5f3ff;
            }
            
            .wizard-tipo-option.selected {
                border-color: #667eea;
                background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
            }
            
            .wizard-tipo-option input {
                display: none;
            }
            
            .tipo-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .tipo-label {
                font-weight: 600;
                color: #374151;
            }
            
            .tipo-desc {
                font-size: 0.75rem;
                color: #6b7280;
                margin-top: 0.25rem;
            }
            
            .wizard-prodotti-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 0.75rem;
            }
            
            .wizard-prodotto-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .wizard-prodotto-option:hover {
                border-color: #10b981;
                background: #ecfdf5;
            }
            
            .wizard-prodotto-option.selected {
                border-color: #10b981;
                background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            }
            
            .wizard-prodotto-option input {
                display: none;
            }
            
            .prodotto-icon {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
            }
            
            .prodotto-label {
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
            }
            
            .wizard-info {
                padding: 0.75rem 1rem;
                background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                border-radius: 8px;
                color: #1e40af;
                font-size: 0.9rem;
            }
            
            .wizard-hint {
                padding: 0.75rem 1rem;
                background: #fef3c7;
                border: 1px solid #fbbf24;
                border-radius: 8px;
                color: #92400e;
                font-size: 0.85rem;
            }
            
            .wizard-alert {
                padding: 1rem;
                background: #fee2e2;
                border: 1px solid #ef4444;
                border-radius: 8px;
                color: #991b1b;
            }
            
            .position-wizard-footer {
                padding: 1rem 1.5rem;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .wizard-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            
            .wizard-btn-secondary {
                background: #e5e7eb;
                color: #374151;
            }
            
            .wizard-btn-secondary:hover {
                background: #d1d5db;
            }
            
            .wizard-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .wizard-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .wizard-btn-success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .wizard-btn-success:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            }
            
            @media (max-width: 640px) {
                .wizard-tipo-grid {
                    grid-template-columns: 1fr;
                }
                
                .wizard-prodotti-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .position-wizard-footer {
                    flex-direction: column;
                }
                
                .wizard-btn {
                    width: 100%;
                }
            }
        `;
    }
    
    // ========================================================================
    // API PUBBLICA
    // ========================================================================
    
    window.POSITION_WIZARD = {
        
        /**
         * Apre il wizard per aggiungere una posizione
         * @param {Object} project - Progetto corrente
         * @param {Object} callbacks - { onSave, onCancel }
         */
        open: function(project, callbacks = {}) {
            if (!project) {
                console.error('❌ POSITION_WIZARD: Progetto richiesto');
                return;
            }
            
            // Reset stato
            wizardState = {
                isOpen: true,
                project: project,
                step: 1,
                data: {
                    name: '',
                    piano: project?.clientData?.piano || project?.piano || '',
                    ambiente: '',
                    ambienteCustom: '',
                    tipoposizione: 'finestra',
                    quantita: 1,
                    prodottiSelezionati: []
                },
                callbacks: callbacks
            };
            
            // Preseleziona prodotti comuni per finestra
            if (project?.prodotti) {
                const defaultProdotti = ['infisso', 'persiana', 'tapparella', 'zanzariera'];
                defaultProdotti.forEach(p => {
                    const plurale = p === 'infisso' ? 'infissi' : 
                                    p === 'persiana' ? 'persiane' :
                                    p === 'tapparella' ? 'tapparelle' :
                                    p === 'zanzariera' ? 'zanzariere' : p;
                    if (project.prodotti[plurale]) {
                        wizardState.data.prodottiSelezionati.push(p);
                    }
                });
            }
            
            renderWizard();
            console.log('📍 POSITION_WIZARD aperto per progetto:', project.name || project.id);
        },
        
        /**
         * Chiude il wizard
         */
        close: function() {
            const overlay = document.getElementById('position-wizard-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            if (wizardState.callbacks.onCancel) {
                wizardState.callbacks.onCancel();
            }
            
            wizardState.isOpen = false;
            console.log('📍 POSITION_WIZARD chiuso');
        },
        
        /**
         * Vai allo step successivo
         */
        nextStep: function() {
            // Valida step corrente
            if (wizardState.step === 1) {
                const data = wizardState.data;
                const ambiente = data.ambienteCustom || data.ambiente;
                
                if (!ambiente || ambiente === '__custom__') {
                    alert('⚠️ Seleziona o scrivi un ambiente');
                    return;
                }
            }
            
            wizardState.step++;
            renderWizard();
        },
        
        /**
         * Torna allo step precedente
         */
        prevStep: function() {
            if (wizardState.step > 1) {
                wizardState.step--;
                renderWizard();
            }
        },
        
        /**
         * Aggiorna un campo dati
         */
        updateData: function(field, value) {
            wizardState.data[field] = value;
            
            // Se cambia tipo posizione, aggiorna prodotti selezionati
            if (field === 'tipoposizione') {
                wizardState.data.prodottiSelezionati = [];
            }
            
            // Se seleziona "Altro" per ambiente, mostra input custom
            if (field === 'ambiente' && value === '__custom__') {
                renderWizard();
            }
        },
        
        /**
         * Toggle selezione prodotto
         */
        toggleProdotto: function(prodotto) {
            const idx = wizardState.data.prodottiSelezionati.indexOf(prodotto);
            if (idx >= 0) {
                wizardState.data.prodottiSelezionati.splice(idx, 1);
            } else {
                wizardState.data.prodottiSelezionati.push(prodotto);
            }
            renderWizard();
        },
        
        /**
         * Crea e salva la posizione
         */
        save: function() {
            const project = wizardState.project;
            const data = wizardState.data;
            
            // Ambiente finale
            const ambiente = data.ambienteCustom || data.ambiente;
            if (ambiente === '__custom__' || !ambiente) {
                alert('⚠️ Ambiente non valido');
                return;
            }
            
            // Crea posizione/i
            const positions = [];
            const quantita = data.quantita || 1;
            
            for (let i = 0; i < quantita; i++) {
                const posName = quantita > 1 
                    ? `${data.name} (${i + 1}/${quantita})`
                    : data.name;
                
                const newPosition = {
                    id: generatePositionId(project.id, project.positions || project.posizioni),
                    name: posName,
                    piano: data.piano,
                    ambiente: ambiente,
                    quantita: 1,
                    tipoposizione: data.tipoposizione,
                    misure: {},
                    rilievo: {},
                    foto: [],
                    note: '',
                    prodottiAssenti: []
                };
                
                // Inizializza prodotti selezionati con config globale
                data.prodottiSelezionati.forEach(prodotto => {
                    newPosition[prodotto] = initProductFromConfig(project, prodotto);
                });
                
                positions.push(newPosition);
            }
            
            console.log(`📍 POSITION_WIZARD: Create ${positions.length} posizioni`, positions);
            
            // Chiudi wizard
            this.close();
            
            // Callback
            if (wizardState.callbacks.onSave) {
                wizardState.callbacks.onSave(positions);
            }
            
            return positions;
        },
        
        /**
         * Crea posizione da dati (API diretta senza wizard)
         */
        create: function(project, data) {
            const newPosition = {
                id: generatePositionId(project.id, project.positions || project.posizioni),
                name: data.name || `Pos. ${getNextPositionNumber(project.positions || project.posizioni)}`,
                piano: data.piano || '',
                ambiente: data.ambiente || '',
                quantita: data.quantita || 1,
                tipoposizione: data.tipoposizione || 'finestra',
                misure: data.misure || {},
                rilievo: data.rilievo || {},
                foto: data.foto || [],
                note: data.note || '',
                prodottiAssenti: data.prodottiAssenti || []
            };
            
            // Copia prodotti se presenti
            if (data.infisso) newPosition.infisso = data.infisso;
            if (data.persiana) newPosition.persiana = data.persiana;
            if (data.tapparella) newPosition.tapparella = data.tapparella;
            if (data.zanzariera) newPosition.zanzariera = data.zanzariera;
            if (data.cassonetto) newPosition.cassonetto = data.cassonetto;
            
            return newPosition;
        },
        
        // Esporta costanti per uso esterno
        AMBIENTI: AMBIENTI,
        PIANI: PIANI,
        TIPI_POSIZIONE: TIPI_POSIZIONE,
        PRODOTTI_MAP: PRODOTTI_MAP,
        
        // Versione
        VERSION: POSITION_WIZARD_VERSION
    };
    
    /**
     * Inizializza prodotto con config globale progetto
     */
    function initProductFromConfig(project, productType) {
        const configMap = {
            'infisso': 'configInfissi',
            'persiana': 'configPersiane',
            'tapparella': 'configTapparelle',
            'zanzariera': 'configZanzariere',
            'cassonetto': 'configCassonetti',
            'blindata': 'configBlindate',
            'portoncino': 'configPortoncini',
            'portaInterna': 'configPorteInterne',
            'clickZip': 'configClickZip',
            'tendaBracci': 'configTendeBracci'
        };
        
        const configKey = configMap[productType];
        const config = project[configKey] || {};
        
        // Struttura base prodotto
        const product = {
            id: `${productType}-${Date.now()}`,
            qta: 1,
            ...config
        };
        
        return product;
    }
    
    console.log(`✅ Position Wizard v${POSITION_WIZARD_VERSION} caricato!`);
    
})();
