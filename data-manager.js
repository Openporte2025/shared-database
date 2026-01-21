// ============================================================================
// DATA MANAGER - Modulo Condiviso per Gestione Dati
// ============================================================================
// Repository: shared-database
// Versione: 1.0.0
// Descrizione: Funzioni core per lettura/scrittura dati posizioni
//              Estratte da app.js rilievo per uso condiviso
// ============================================================================

const DATA_MANAGER_VERSION = '1.0.0';

(function() {
    'use strict';

    console.log(`📦 Data Manager v${DATA_MANAGER_VERSION} - Caricamento...`);

    // ========================================================================
    // FUNZIONI HELPER
    // ========================================================================

    /**
     * Trova un progetto per ID in un array di progetti
     */
    function findProject(projects, projectId) {
        if (!projects || !Array.isArray(projects)) return null;
        return projects.find(p => p.id === projectId);
    }

    /**
     * Trova una posizione per ID in un progetto
     */
    function findPosition(project, posId) {
        if (!project || !project.positions || !Array.isArray(project.positions)) return null;
        return project.positions.find(p => p.id === posId);
    }

    /**
     * Trova indice posizione per ID
     */
    function findPositionIndex(project, posId) {
        if (!project || !project.positions || !Array.isArray(project.positions)) return -1;
        return project.positions.findIndex(p => p.id === posId);
    }

    /**
     * Deep clone di un oggetto
     */
    function deepClone(obj) {
        if (obj === null || obj === undefined) return obj;
        return JSON.parse(JSON.stringify(obj));
    }

    // ========================================================================
    // UPDATE POSITION - Aggiorna campi base della posizione
    // ========================================================================

    /**
     * Aggiorna un campo della posizione
     * @param {Object} project - Progetto contenente la posizione
     * @param {string} posId - ID della posizione
     * @param {string} field - Nome del campo da aggiornare
     * @param {*} value - Nuovo valore
     * @returns {boolean} true se aggiornato con successo
     */
    function updatePosition(project, posId, field, value) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ Posizione ${posId} non trovata`);
            return false;
        }

        // Salva valore precedente per log
        const oldValue = pos[field];
        
        // Aggiorna il campo
        pos[field] = value;

        // Sincronizza quantità prodotti quando cambia quantità posizione
        if (field === 'quantita') {
            const qta = value || '1';
            if (pos.infisso) pos.infisso.qta = qta;
            if (pos.tapparella) {
                pos.tapparella.qta = qta;
                if (pos.tapparella.motore) pos.tapparella.motore.qta = qta;
            }
            if (pos.cassonetto) pos.cassonetto.qta = qta;
            if (pos.persiana) pos.persiana.qta = qta;
            if (pos.zanzariera) pos.zanzariera.qta = qta;
            console.log(`🔄 Quantità sincronizzata a tutti i prodotti: ${qta}`);
        }

        console.log(`✏️ updatePosition: ${field} = "${value}" (era "${oldValue}")`);
        return true;
    }

    // ========================================================================
    // UPDATE MISURA - Aggiorna misure della posizione
    // ========================================================================

    /**
     * Aggiorna una misura della posizione
     * @param {Object} project - Progetto contenente la posizione
     * @param {string} posId - ID della posizione
     * @param {string} field - Nome della misura (LI, HI, LF, HF, etc.)
     * @param {*} value - Nuovo valore
     * @returns {boolean} true se aggiornato con successo
     */
    function updateMisura(project, posId, field, value) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ Posizione ${posId} non trovata`);
            return false;
        }

        if (!pos.misure) {
            pos.misure = {};
        }

        pos.misure[field] = value;
        console.log(`📐 updateMisura: ${field} = ${value}`);
        return true;
    }

    // ========================================================================
    // UPDATE PRODUCT - Aggiorna prodotto della posizione (FUNZIONE CORE)
    // ========================================================================

    /**
     * Aggiorna un campo di un prodotto nella posizione
     * Estratta da app.js rilievo - include tutta la logica business
     * @param {Object} project - Progetto contenente la posizione
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto (infisso, persiana, tapparella, etc.)
     * @param {string} field - Nome del campo da aggiornare
     * @param {*} value - Nuovo valore
     * @returns {boolean} true se aggiornato con successo
     */
    function updateProduct(project, posId, productType, field, value) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ Posizione ${posId} non trovata`);
            return false;
        }

        // Se il prodotto non esiste, non fare nulla
        if (!pos[productType]) {
            console.warn(`⚠️ Prodotto ${productType} non presente nella posizione ${posId}`);
            return false;
        }

        // Aggiorna il campo
        pos[productType][field] = value;
        console.log(`📦 updateProduct: ${productType}.${field} = "${value}"`);

        // =====================================================================
        // LOGICA BUSINESS SPECIFICA PER INFISSO
        // =====================================================================
        if (productType === 'infisso') {
            const inf = pos.infisso;

            // Sincronizzazione colori PVC/PVC
            const isPvcPvc = inf.finituraInt === 'pvc' && inf.finituraEst === 'pvc';
            if (isPvcPvc) {
                if (field === 'coloreInt') {
                    inf.coloreEst = value;
                    console.log('🎨 PVC/PVC: coloreEst sincronizzato');
                } else if (field === 'coloreEst') {
                    inf.coloreInt = value;
                    console.log('🎨 PVC/PVC: coloreInt sincronizzato');
                }
            }

            // Reset esecuzione quando cambia finitura interna a ALU/LEGNO
            if (field === 'finituraInt') {
                const nuovaFinitura = (value || '').toLowerCase();
                if ((nuovaFinitura === 'alluminio' || nuovaFinitura === 'legno' || nuovaFinitura === 'alu') && inf.esecuzione1 === '0') {
                    inf.esecuzione1 = '3';
                    console.log(`🔧 Esecuzione reset a .3 (${nuovaFinitura} non supporta .0)`);
                }
            }

            // Auto-selezione tipoInfissoAssociato quando cambia tipo
            if (field === 'tipo') {
                if (value && value.includes('PF')) {
                    inf.tipoInfissoAssociato = 'PF';
                    console.log(`✅ Auto: tipoInfissoAssociato = PF`);
                } else if (value && (value.match(/F\d/) || value === 'FISSO' || value === 'HST')) {
                    inf.tipoInfissoAssociato = 'F';
                    console.log(`✅ Auto: tipoInfissoAssociato = F`);
                }
            }

            // Auto-calcolo cerniere da ferramenta
            if (field === 'ferramenta1') {
                const ferr = value || '';
                if (['411', '409', '430', '453', '425', '475', '473', '471', 'B411'].includes(ferr)) {
                    inf.cerniere = 'a-vista';
                    console.log(`🔩 Cerniere auto: ${ferr} → a-vista`);
                } else if (['211', '209', '230', '232', '225', '275', 'B211'].includes(ferr)) {
                    inf.cerniere = 'a-scomparsa';
                    console.log(`🔩 Cerniere auto: ${ferr} → a-scomparsa`);
                }
            }
        }

        // =====================================================================
        // LOGICA BUSINESS SPECIFICA PER PERSIANA
        // =====================================================================
        if (productType === 'persiana' && field === 'tipo') {
            const per = pos.persiana;
            if (value && value.includes('PF')) {
                per.tipoInfissoAssociato = 'PF';
                console.log(`✅ Auto: persiana tipoInfissoAssociato = PF`);
            } else if (value && value.match(/F[A\d]/)) {
                per.tipoInfissoAssociato = 'F';
                console.log(`✅ Auto: persiana tipoInfissoAssociato = F`);
            }
        }

        return true;
    }

    // ========================================================================
    // CREATE PRODUCT - Crea un nuovo prodotto nella posizione
    // ========================================================================

    /**
     * Template vuoti per ogni tipo di prodotto
     */
    const PRODUCT_TEMPLATES = {
        infisso: {
            id: '',
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
            bancaleTipo: '',
            bancaleBordo: '0',
            bancaleProfondita: '',
            antaTwinTipo: '',
            antaTwinModello: '',
            antaTwinColore: '',
            antaTwinComando: '27',
            BRM_L: 0,
            BRM_H: 0,
            note: '',
            foto: []
        },
        persiana: {
            id: '',
            qta: '1',
            azienda: 'P. Persiane',
            modello: '',
            tipo: '',
            tipoInfissoAssociato: '',
            apertura: '',
            fissaggio: '',
            colorePersiana: '',
            coloreTelaio: '',
            battuta: '',
            BRM_L: 0,
            BRM_H: 0,
            note: '',
            foto: [],
            accessoriPersiana: {}
        },
        tapparella: {
            id: '',
            qta: '1',
            serveTapparella: true,
            serveMotore: false,
            serveAccessori: false,
            tapparellaEsistente: '',
            azienda: 'Plasticino',
            modello: '',
            tipo: '',
            colore: '',
            guida: '',
            coloreGuida: '',
            motoreAzienda: 'Somfy',
            motoreModello: '',
            BRM_L: 0,
            BRM_H: 0,
            note: '',
            foto: [],
            accessoriDaSostituire: {}
        },
        zanzariera: {
            id: '',
            qta: '1',
            tipoInfissoAssociato: '',
            azienda: 'Palagina',
            linea: '',
            modello: '',
            fasciaColore: '',
            coloreTelaio: '',
            tipoRete: '',
            colorePlastica: '',
            BRM_L: 0,
            BRM_H: 0,
            note: '',
            foto: []
        },
        cassonetto: {
            id: '',
            qta: '1',
            azienda: 'Finstral',
            tipo: '',
            materialeCass: '',
            codiceCass: '',
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

    /**
     * Crea un nuovo prodotto nella posizione
     * @param {Object} project - Progetto contenente la posizione
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto da creare
     * @returns {Object|null} Il prodotto creato o null se errore
     */
    function createProduct(project, posId, productType) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ Posizione ${posId} non trovata`);
            return null;
        }

        const template = PRODUCT_TEMPLATES[productType];
        if (!template) {
            console.warn(`⚠️ Template non trovato per ${productType}`);
            return null;
        }

        // Crea prodotto da template con ID univoco
        const newProduct = deepClone(template);
        newProduct.id = `${productType}-${Date.now()}`;
        newProduct.qta = pos.quantita || '1';

        // Assegna alla posizione
        pos[productType] = newProduct;

        console.log(`➕ Creato ${productType} in posizione ${posId}`);
        return newProduct;
    }

    /**
     * Rimuove un prodotto dalla posizione
     * @param {Object} project - Progetto contenente la posizione
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto da rimuovere
     * @returns {boolean} true se rimosso con successo
     */
    function removeProduct(project, posId, productType) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ Posizione ${posId} non trovata`);
            return false;
        }

        if (pos[productType]) {
            pos[productType] = null;
            console.log(`➖ Rimosso ${productType} da posizione ${posId}`);
            return true;
        }

        return false;
    }

    // ========================================================================
    // VALIDAZIONE POSIZIONE
    // ========================================================================

    /**
     * Valida i campi obbligatori di una posizione
     * @param {Object} position - Posizione da validare
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    function validatePosition(position) {
        const errors = [];

        if (!position) {
            return { valid: false, errors: ['Posizione non definita'] };
        }

        if (!position.id) {
            errors.push('ID mancante');
        }

        if (!position.ambiente || position.ambiente.trim() === '') {
            errors.push('Ambiente obbligatorio');
        }

        // Verifica misure se ci sono prodotti
        if (position.infisso || position.persiana || position.tapparella || position.zanzariera) {
            if (!position.misure) {
                errors.push('Misure mancanti');
            } else {
                if (!position.misure.LI && !position.misure.LF) {
                    errors.push('Larghezza (LI o LF) mancante');
                }
                if (!position.misure.HI && !position.misure.HF) {
                    errors.push('Altezza (HI o HF) mancante');
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // ========================================================================
    // COPIA POSIZIONE
    // ========================================================================

    /**
     * Crea una copia profonda di una posizione con nuovo ID
     * @param {Object} position - Posizione da copiare
     * @param {string} newName - Nome per la nuova posizione (opzionale)
     * @returns {Object} Nuova posizione
     */
    function clonePosition(position, newName) {
        if (!position) return null;

        const cloned = deepClone(position);
        
        // Nuovo ID univoco
        cloned.id = `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Nuovo nome se specificato
        if (newName) {
            cloned.name = newName;
        } else {
            cloned.name = (position.name || 'Posizione') + ' (copia)';
        }

        // Nuovi ID per i prodotti
        const productTypes = ['infisso', 'persiana', 'tapparella', 'zanzariera', 'cassonetto', 'ingresso', 'portaInterna'];
        productTypes.forEach(type => {
            if (cloned[type]) {
                cloned[type].id = `${type}-${Date.now()}`;
            }
        });

        return cloned;
    }

    // ========================================================================
    // EXPORT MODULO
    // ========================================================================

    window.DATA_MANAGER = {
        VERSION: DATA_MANAGER_VERSION,
        
        // Helper
        findProject,
        findPosition,
        findPositionIndex,
        deepClone,
        
        // Update
        updatePosition,
        updateMisura,
        updateProduct,
        
        // Create/Remove
        createProduct,
        removeProduct,
        PRODUCT_TEMPLATES,
        
        // Utility
        validatePosition,
        clonePosition
    };

    console.log(`✅ Data Manager v${DATA_MANAGER_VERSION} caricato`);
    console.log('   Funzioni disponibili: DATA_MANAGER.updatePosition(), .updateMisura(), .updateProduct(), ...');

})();
