// ============================================================================
// POSITION-UTILS v1.0.0 - Funzioni Posizione Centralizzate
// ============================================================================
// 
// Modulo condiviso per: App Rilievo + Dashboard + App Posa
// 
// Contiene:
//   - Update posizione (tipoApertura, installazione)
//   - Validazione posizione
//   - Calcolo completamento
//   - Defaults posizione
//
// ============================================================================

const POSITION_UTILS = {

    version: '1.0.0',

    // =========================================================================
    // DEFAULTS
    // =========================================================================
    
    /**
     * Restituisce i valori default per una nuova posizione
     */
    getDefaults() {
        return {
            id: null,
            nome: '',
            ambiente: '',
            piano: '0',
            quantita: '1',
            tipoApertura: null,        // F o PF - OBBLIGATORIO
            installazione: null,       // filo_muro o mazzetta - OBBLIGATORIO
            posizioneTelaio: null,     // Alias di installazione (retrocompatibilità)
            misure: {
                LVT: '', HVT: '',
                LF: '', HF: '',
                TMV: '', HMT: '',
                L4: '', H4: '',
                DeltaINT: '', DeltaEST: '',
                HSoffitto: '',
                HParapettoSoffitto: '',
                HPavimentoParapetto: ''
            },
            misureNonServe: {},
            esistente: null,
            infisso: null,
            persiana: null,
            tapparella: null,
            zanzariera: null,
            cassonetto: null,
            ingresso: null,
            portaInterna: null,
            prodottiAssenti: [],
            note: '',
            foto: [],
            drawings: []
        };
    },

    // =========================================================================
    // UPDATE FUNCTIONS
    // =========================================================================
    
    /**
     * Aggiorna tipo apertura (F/PF) e propaga ai prodotti
     * @param {Object} position - Oggetto posizione
     * @param {string} tipoApertura - 'F' o 'PF'
     * @returns {Object} Posizione aggiornata
     */
    updateTipoApertura(position, tipoApertura) {
        if (!position) return position;
        
        // Valida valore
        if (!this.isValidTipoApertura(tipoApertura)) {
            console.warn(`⚠️ Tipo apertura non valido: ${tipoApertura}`);
            return position;
        }
        
        // Aggiorna posizione
        position.tipoApertura = tipoApertura;
        
        // Propaga ai prodotti esistenti
        const prodotti = ['infisso', 'persiana', 'zanzariera', 'tapparella', 'cassonetto'];
        prodotti.forEach(prod => {
            if (position[prod]) {
                position[prod].tipoInfissoAssociato = tipoApertura;
            }
        });
        
        console.log(`🪟 Tipo apertura aggiornato: ${tipoApertura}`);
        return position;
    },
    
    /**
     * Aggiorna installazione (filo_muro/mazzetta)
     * @param {Object} position - Oggetto posizione
     * @param {string} installazione - 'filo_muro' o 'mazzetta'
     * @returns {Object} Posizione aggiornata
     */
    updateInstallazione(position, installazione) {
        if (!position) return position;
        
        // Valida valore
        if (!this.isValidInstallazione(installazione)) {
            console.warn(`⚠️ Installazione non valida: ${installazione}`);
            return position;
        }
        
        // Aggiorna entrambi i campi (nuovo + legacy)
        position.installazione = installazione;
        position.posizioneTelaio = installazione;  // Retrocompatibilità
        
        console.log(`🧱 Installazione aggiornata: ${installazione}`);
        return position;
    },
    
    /**
     * Alias per retrocompatibilità
     */
    updatePosizioneTelaio(position, posizioneTelaio) {
        return this.updateInstallazione(position, posizioneTelaio);
    },

    // =========================================================================
    // VALIDAZIONE
    // =========================================================================
    
    /**
     * Valida tipo apertura
     */
    isValidTipoApertura(value) {
        return ['F', 'PF'].includes(value);
    },
    
    /**
     * Valida installazione
     */
    isValidInstallazione(value) {
        return ['filo_muro', 'mazzetta'].includes(value);
    },
    
    /**
     * Valida una posizione completa
     * @param {Object} position - Posizione da validare
     * @param {Object} options - { requireMisure: true, requireProdotti: false }
     * @returns {Object} { valid: boolean, errors: [], warnings: [] }
     */
    validate(position, options = {}) {
        const errors = [];
        const warnings = [];
        
        if (!position) {
            return { valid: false, errors: ['Posizione non valida'], warnings };
        }
        
        // ID obbligatorio
        if (!position.id) {
            errors.push('ID posizione mancante');
        }
        
        // Tipo apertura OBBLIGATORIO
        if (!position.tipoApertura) {
            errors.push('Tipo apertura (F/PF) obbligatorio');
        } else if (!this.isValidTipoApertura(position.tipoApertura)) {
            errors.push(`Tipo apertura non valido: ${position.tipoApertura}`);
        }
        
        // Installazione OBBLIGATORIA
        const installazione = position.installazione || position.posizioneTelaio;
        if (!installazione) {
            errors.push('Installazione (filo_muro/mazzetta) obbligatoria');
        } else if (!this.isValidInstallazione(installazione)) {
            errors.push(`Installazione non valida: ${installazione}`);
        }
        
        // Ambiente (warning se mancante)
        if (!position.ambiente) {
            warnings.push('Ambiente non specificato');
        }
        
        // Misure (se richieste)
        if (options.requireMisure) {
            const misure = position.misure || {};
            if (!misure.LVT && !misure.LF) {
                errors.push('Almeno una misura larghezza richiesta (LVT o LF)');
            }
            if (!misure.HVT && !misure.HF) {
                errors.push('Almeno una misura altezza richiesta (HVT o HF)');
            }
        }
        
        // Prodotti (se richiesti)
        if (options.requireProdotti) {
            const hasProdotto = position.infisso || position.persiana || 
                               position.tapparella || position.zanzariera || 
                               position.cassonetto || position.ingresso || 
                               position.portaInterna;
            if (!hasProdotto) {
                warnings.push('Nessun prodotto configurato');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    },

    // =========================================================================
    // CALCOLO COMPLETAMENTO
    // =========================================================================
    
    /**
     * Calcola percentuale completamento posizione
     * @param {Object} position - Posizione
     * @param {Object} prodottiAbilitati - { infissi: true, persiane: false, ... }
     * @returns {Object} { percentage: number, details: {} }
     */
    calculateCompletion(position, prodottiAbilitati = {}) {
        if (!position) return { percentage: 0, details: {} };
        
        const checks = {};
        let totalPoints = 0;
        let earnedPoints = 0;
        
        // === DATI BASE (30 punti) ===
        
        // Tipo apertura (10pt) - OBBLIGATORIO
        checks.tipoApertura = {
            label: 'Tipo Apertura',
            points: 10,
            completed: this.isValidTipoApertura(position.tipoApertura)
        };
        totalPoints += 10;
        if (checks.tipoApertura.completed) earnedPoints += 10;
        
        // Installazione (10pt) - OBBLIGATORIO
        const installazione = position.installazione || position.posizioneTelaio;
        checks.installazione = {
            label: 'Installazione',
            points: 10,
            completed: this.isValidInstallazione(installazione)
        };
        totalPoints += 10;
        if (checks.installazione.completed) earnedPoints += 10;
        
        // Ambiente (5pt)
        checks.ambiente = {
            label: 'Ambiente',
            points: 5,
            completed: !!position.ambiente
        };
        totalPoints += 5;
        if (checks.ambiente.completed) earnedPoints += 5;
        
        // Piano (5pt)
        checks.piano = {
            label: 'Piano',
            points: 5,
            completed: position.piano !== undefined && position.piano !== ''
        };
        totalPoints += 5;
        if (checks.piano.completed) earnedPoints += 5;
        
        // === MISURE (40 punti) ===
        const misure = position.misure || {};
        const nonServe = position.misureNonServe || {};
        
        // LVT o LF (10pt)
        checks.larghezza = {
            label: 'Larghezza',
            points: 10,
            completed: !!(misure.LVT || misure.LF || nonServe.LVT || nonServe.LF)
        };
        totalPoints += 10;
        if (checks.larghezza.completed) earnedPoints += 10;
        
        // HVT o HF (10pt)
        checks.altezza = {
            label: 'Altezza',
            points: 10,
            completed: !!(misure.HVT || misure.HF || nonServe.HVT || nonServe.HF)
        };
        totalPoints += 10;
        if (checks.altezza.completed) earnedPoints += 10;
        
        // TMV (5pt)
        checks.TMV = {
            label: 'Traverso Muro',
            points: 5,
            completed: !!(misure.TMV || nonServe.TMV)
        };
        totalPoints += 5;
        if (checks.TMV.completed) earnedPoints += 5;
        
        // Altre misure (15pt totali)
        const altreMisure = ['HMT', 'DeltaINT', 'DeltaEST'];
        const altreMisureCompletate = altreMisure.filter(m => misure[m] || nonServe[m]).length;
        checks.altreMisure = {
            label: 'Altre misure',
            points: 15,
            completed: altreMisureCompletate >= 2,
            partial: altreMisureCompletate
        };
        totalPoints += 15;
        earnedPoints += Math.min(15, altreMisureCompletate * 5);
        
        // === PRODOTTI (30 punti) ===
        let prodottiPoints = 0;
        let prodottiMax = 0;
        
        if (prodottiAbilitati.infissi) {
            prodottiMax += 10;
            if (position.infisso) prodottiPoints += 10;
        }
        if (prodottiAbilitati.persiane) {
            prodottiMax += 5;
            if (position.persiana) prodottiPoints += 5;
        }
        if (prodottiAbilitati.tapparelle) {
            prodottiMax += 5;
            if (position.tapparella) prodottiPoints += 5;
        }
        if (prodottiAbilitati.zanzariere) {
            prodottiMax += 5;
            if (position.zanzariera) prodottiPoints += 5;
        }
        if (prodottiAbilitati.cassonetti) {
            prodottiMax += 5;
            if (position.cassonetto) prodottiPoints += 5;
        }
        
        if (prodottiMax > 0) {
            checks.prodotti = {
                label: 'Prodotti',
                points: prodottiMax,
                completed: prodottiPoints === prodottiMax,
                partial: prodottiPoints
            };
            totalPoints += prodottiMax;
            earnedPoints += prodottiPoints;
        }
        
        // Calcola percentuale
        const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        
        return {
            percentage,
            earnedPoints,
            totalPoints,
            details: checks
        };
    },

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    
    /**
     * Genera ID univoco per posizione
     */
    generateId(prefix = 'pos') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    },
    
    /**
     * Crea nuova posizione con defaults
     * @param {Object} overrides - Valori da sovrascrivere
     */
    create(overrides = {}) {
        const defaults = this.getDefaults();
        const position = {
            ...defaults,
            ...overrides,
            id: overrides.id || this.generateId(),
            misure: { ...defaults.misure, ...(overrides.misure || {}) }
        };
        return position;
    },
    
    /**
     * Clona posizione (deep copy)
     */
    clone(position) {
        return JSON.parse(JSON.stringify(position));
    },
    
    /**
     * Ottiene etichetta leggibile per tipo apertura
     */
    getTipoAperturaLabel(value) {
        const labels = {
            'F': '🪟 Finestra',
            'PF': '🚪 Porta-finestra'
        };
        return labels[value] || value || 'Non specificato';
    },
    
    /**
     * Ottiene etichetta leggibile per installazione
     */
    getInstallazioneLabel(value) {
        const labels = {
            'filo_muro': '🧱 Filo Muro Interno',
            'mazzetta': '📐 In Mazzetta'
        };
        return labels[value] || value || 'Non specificato';
    },
    
    /**
     * Normalizza posizione (aggiunge campi mancanti, sistema alias)
     */
    normalize(position) {
        if (!position) return this.getDefaults();
        
        const normalized = { ...this.getDefaults(), ...position };
        
        // Sincronizza installazione/posizioneTelaio
        if (normalized.posizioneTelaio && !normalized.installazione) {
            normalized.installazione = normalized.posizioneTelaio;
        } else if (normalized.installazione && !normalized.posizioneTelaio) {
            normalized.posizioneTelaio = normalized.installazione;
        }
        
        // Sincronizza nome/name
        if (position.name && !position.nome) {
            normalized.nome = position.name;
        }
        
        // Assicura misure esistano
        normalized.misure = { ...this.getDefaults().misure, ...(position.misure || {}) };
        
        return normalized;
    },
    
    /**
     * Restituisce sommario posizione per display
     */
    getSummary(position) {
        if (!position) return 'Posizione non valida';
        
        const parts = [];
        
        if (position.ambiente) parts.push(position.ambiente);
        if (position.tipoApertura) parts.push(this.getTipoAperturaLabel(position.tipoApertura));
        
        const misure = position.misure || {};
        const l = misure.LVT || misure.LF;
        const h = misure.HVT || misure.HF;
        if (l && h) parts.push(`${l}×${h}mm`);
        
        return parts.join(' - ') || position.nome || position.id || 'Posizione';
    }
};


// =========================================================================
// EXPORT
// =========================================================================

if (typeof window !== 'undefined') {
    window.POSITION_UTILS = POSITION_UTILS;
    console.log('📍 POSITION_UTILS v' + POSITION_UTILS.version + ' caricato');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POSITION_UTILS };
}
