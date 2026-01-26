// ============================================================================
// DATA MANAGER - Gestione Dati Unificata v1.2.0
// ============================================================================
// Modulo condiviso per gestire dati tra App Rilievo, Dashboard e Editor
// Standardizza su formato `positions` (app rilievo), converte automaticamente
// 
// v1.2.0: Aggiunto supporto formato ODOO (progetti da CRM senza posizioni)
// 
// USO:
//   DATA_MANAGER.updatePosition(project, posId, field, value)
//   DATA_MANAGER.updateProduct(project, posId, productType, field, value)
//   DATA_MANAGER.updateMisura(project, posId, field, value)
//   DATA_MANAGER.getPositions(project) // ritorna sempre array positions
//   DATA_MANAGER.setPositions(project, positions) // imposta positions
//   DATA_MANAGER.normalizeProject(project) // normalizza formato (incl. Odoo)
// ============================================================================

const DATA_MANAGER_VERSION = '1.2.0';

(function() {
    'use strict';
    
    console.log(`📦 Data Manager v${DATA_MANAGER_VERSION} - Caricamento...`);
    
    // ========================================================================
    // HELPER: Accesso unificato alle posizioni
    // ========================================================================
    
    /**
     * Ottiene l'array posizioni da un progetto (supporta positions e posizioni)
     * @param {Object} project - Oggetto progetto
     * @returns {Array} - Array di posizioni (mai null)
     */
    function getPositions(project) {
        if (!project) return [];
        
        // Priorità: positions (formato app rilievo) > posizioni (formato dashboard)
        if (project.positions && Array.isArray(project.positions)) {
            return project.positions;
        }
        if (project.posizioni && Array.isArray(project.posizioni)) {
            return project.posizioni;
        }
        
        return [];
    }
    
    /**
     * Imposta l'array posizioni su un progetto
     * Aggiorna ENTRAMBI i campi per compatibilità
     * @param {Object} project - Oggetto progetto
     * @param {Array} positions - Array di posizioni
     */
    function setPositions(project, positions) {
        if (!project) return;
        
        const arr = Array.isArray(positions) ? positions : [];
        
        // Imposta entrambi per compatibilità
        project.positions = arr;
        project.posizioni = arr;
    }
    
    /**
     * Trova una posizione per ID
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @returns {Object|null} - Posizione trovata o null
     */
    function findPosition(project, posId) {
        const positions = getPositions(project);
        return positions.find(p => p.id === posId) || null;
    }
    
    /**
     * Trova l'indice di una posizione
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @returns {number} - Indice (-1 se non trovata)
     */
    function findPositionIndex(project, posId) {
        const positions = getPositions(project);
        return positions.findIndex(p => p.id === posId);
    }
    
    // ========================================================================
    // FUNZIONI PRINCIPALI: Update dati
    // ========================================================================
    
    /**
     * Aggiorna un campo della posizione
     * Estratta da app.js rilievo v5.75
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} field - Nome del campo da aggiornare
     * @param {*} value - Nuovo valore
     * @param {Object} options - Opzioni aggiuntive
     * @returns {boolean} - true se aggiornato con successo
     */
    function updatePosition(project, posId, field, value, options = {}) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.updatePosition: Posizione ${posId} non trovata`);
            return false;
        }
        
        // Aggiorna il campo
        pos[field] = value;
        
        // 🔄 v5.622: Sincronizza quantità prodotti quando cambia quantità posizione
        if (field === 'quantita') {
            const qta = value || '1';
            // Aggiorna qta di tutti i prodotti associati
            if (pos.infisso) pos.infisso.qta = qta;
            if (pos.tapparella) {
                pos.tapparella.qta = qta;
                if (pos.tapparella.motore) pos.tapparella.motore.qta = qta;
            }
            if (pos.cassonetto) pos.cassonetto.qta = qta;
            if (pos.persiana) pos.persiana.qta = qta;
            if (pos.zanzariera) pos.zanzariera.qta = qta;
            console.log('🔄 DATA_MANAGER: Quantità posizione → sincronizzata a tutti i prodotti:', qta);
        }
        
        console.log(`✅ DATA_MANAGER.updatePosition: ${posId}.${field} = ${value}`);
        
        // Callback opzionale per salvataggio/render
        if (options.onUpdate && typeof options.onUpdate === 'function') {
            options.onUpdate(project, pos, field, value);
        }
        
        return true;
    }
    
    /**
     * Aggiorna un campo di un prodotto nella posizione
     * Estratta da app.js rilievo v5.75 - SEMPLIFICATA
     * (La logica complessa di ricalcolo BRM resta nelle app)
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto (infisso, persiana, tapparella, etc.)
     * @param {string} field - Nome del campo
     * @param {*} value - Nuovo valore
     * @param {Object} options - Opzioni aggiuntive
     * @returns {boolean} - true se aggiornato con successo
     */
    function updateProduct(project, posId, productType, field, value, options = {}) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.updateProduct: Posizione ${posId} non trovata`);
            return false;
        }
        
        // Verifica che il prodotto esista
        if (!pos[productType]) {
            console.warn(`⚠️ DATA_MANAGER.updateProduct: Prodotto ${productType} non esiste in posizione ${posId}`);
            return false;
        }
        
        // Aggiorna il campo
        pos[productType][field] = value;
        
        // 🎨 v4.78: Se PVC/PVC, sincronizza coloreInt e coloreEst (solo per infisso)
        if (productType === 'infisso') {
            const inf = pos.infisso;
            const isPvcPvc = inf.finituraInt === 'pvc' && inf.finituraEst === 'pvc';
            
            if (isPvcPvc) {
                if (field === 'coloreInt') {
                    inf.coloreEst = value;
                    console.log('🎨 DATA_MANAGER: PVC/PVC → coloreEst sincronizzato');
                } else if (field === 'coloreEst') {
                    inf.coloreInt = value;
                    console.log('🎨 DATA_MANAGER: PVC/PVC → coloreInt sincronizzato');
                }
            }
            
            // 🎯 AUTO-SELEZIONE tipoInfissoAssociato per INFISSO
            if (field === 'tipo') {
                let autoTipo = null;
                if (value && value.includes('PF')) {
                    autoTipo = 'PF';
                } else if (value && (value.match(/F\d/) || value === 'FISSO' || value === 'HST')) {
                    autoTipo = 'F';
                }
                if (autoTipo) {
                    inf.tipoInfissoAssociato = autoTipo;
                    console.log(`✅ DATA_MANAGER: Auto tipoInfissoAssociato: ${autoTipo}`);
                }
            }
            
            // 🔩 v5.53: AUTO-CALCOLO CERNIERE da ferramenta
            if (field === 'ferramenta1') {
                const ferr = value || '';
                let cerniere = '';
                if (['411', '409', '430', '453', '425', '475', '473', '471', 'B411'].includes(ferr)) {
                    cerniere = 'a-vista';
                } else if (['211', '209', '230', '232', '225', '275', 'B211'].includes(ferr)) {
                    cerniere = 'a-scomparsa';
                }
                if (cerniere) {
                    pos.infisso.cerniere = cerniere;
                    console.log(`🔩 DATA_MANAGER: Cerniere auto: ${ferr} → ${cerniere}`);
                }
            }
        }
        
        // 🎯 PERSIANE: Auto-selezione tipoInfissoAssociato
        if (productType === 'persiana' && field === 'tipo') {
            const per = pos.persiana;
            let autoTipo = null;
            if (value && value.includes('PF')) {
                autoTipo = 'PF';
            } else if (value && value.match(/F[A\d]/)) {
                autoTipo = 'F';
            }
            if (autoTipo) {
                per.tipoInfissoAssociato = autoTipo;
                console.log(`✅ DATA_MANAGER: Auto tipoInfissoAssociato persiana: ${autoTipo}`);
            }
        }
        
        console.log(`✅ DATA_MANAGER.updateProduct: ${posId}.${productType}.${field} = ${value}`);
        
        // Callback opzionale
        if (options.onUpdate && typeof options.onUpdate === 'function') {
            options.onUpdate(project, pos, productType, field, value);
        }
        
        return true;
    }
    
    /**
     * Aggiorna una misura della posizione
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} field - Nome del campo misura (LI, HI, LF, HF, etc.)
     * @param {*} value - Nuovo valore
     * @param {Object} options - Opzioni aggiuntive
     * @returns {boolean} - true se aggiornato con successo
     */
    function updateMisura(project, posId, field, value, options = {}) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.updateMisura: Posizione ${posId} non trovata`);
            return false;
        }
        
        // Assicura che l'oggetto misure esista
        if (!pos.misure) {
            pos.misure = {};
        }
        
        // Aggiorna la misura
        pos.misure[field] = value;
        
        console.log(`✅ DATA_MANAGER.updateMisura: ${posId}.misure.${field} = ${value}`);
        
        // Callback opzionale (per ricalcolo BRM)
        if (options.onUpdate && typeof options.onUpdate === 'function') {
            options.onUpdate(project, pos, field, value);
        }
        
        return true;
    }
    
    /**
     * Aggiorna una misura con validazione
     * Rimuove eventuali override di validazione quando il valore cambia
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} field - Nome del campo misura
     * @param {*} value - Nuovo valore
     * @param {Object} options - Opzioni aggiuntive
     * @returns {boolean} - true se aggiornato con successo
     */
    function updateMisuraWithValidation(project, posId, field, value, options = {}) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.updateMisuraWithValidation: Posizione ${posId} non trovata`);
            return false;
        }
        
        // 🛡️ Se l'utente modifica una misura con override, rimuovi l'override
        if (pos.validationOverrides && pos.validationOverrides[field]) {
            delete pos.validationOverrides[field];
            
            if (Object.keys(pos.validationOverrides).length === 0) {
                delete pos.validationOverrides;
            }
        }
        
        // Aggiorna la misura
        return updateMisura(project, posId, field, value, options);
    }
    
    // ========================================================================
    // FUNZIONI HELPER: Creazione prodotti
    // ========================================================================
    
    /**
     * Crea un prodotto vuoto nella posizione se non esiste
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto
     * @param {Object} defaults - Valori di default opzionali
     * @returns {Object|null} - Prodotto creato o esistente
     */
    function createProduct(project, posId, productType, defaults = {}) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.createProduct: Posizione ${posId} non trovata`);
            return null;
        }
        
        // Se esiste già, ritorna quello esistente
        if (pos[productType]) {
            console.log(`ℹ️ DATA_MANAGER.createProduct: ${productType} già esiste in ${posId}`);
            return pos[productType];
        }
        
        // Template prodotti di base
        const templates = {
            infisso: {
                id: `inf-${Date.now()}`,
                qta: pos.quantita || '1',
                tipo: '',
                tipoInfissoAssociato: 'F',
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
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            persiana: {
                id: `pers-${Date.now()}`,
                qta: pos.quantita || '1',
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
                qta: pos.quantita || '1',
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
                accessoriDaSostituire: {},
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            zanzariera: {
                id: `zanz-${Date.now()}`,
                qta: pos.quantita || '1',
                tipoInfissoAssociato: 'F',
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
                qta: pos.quantita || '1',
                azienda: 'Finstral',
                tipo: '',
                materialeCass: '',
                codiceCass: '',
                gruppoColoreCass: '',
                coloreCass: '',
                codiceIsolamento: '',
                coloreDaInfisso: true,
                aSoffitto: false,
                LS: '',
                SRSX: '',
                SRDX: '',
                ZSX: '',
                ZDX: '',
                HCASS: '',
                B: '',
                C: '',
                BSuperiore: '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            }
        };
        
        // Usa template se disponibile, altrimenti oggetto base
        const template = templates[productType] || { id: `${productType}-${Date.now()}`, qta: '1' };
        
        // Merge con defaults
        pos[productType] = { ...template, ...defaults };
        
        console.log(`✅ DATA_MANAGER.createProduct: Creato ${productType} in ${posId}`);
        return pos[productType];
    }
    
    /**
     * Rimuove un prodotto dalla posizione
     * 
     * @param {Object} project - Oggetto progetto
     * @param {string} posId - ID della posizione
     * @param {string} productType - Tipo prodotto
     * @returns {boolean} - true se rimosso con successo
     */
    function removeProduct(project, posId, productType) {
        const pos = findPosition(project, posId);
        if (!pos) {
            console.warn(`⚠️ DATA_MANAGER.removeProduct: Posizione ${posId} non trovata`);
            return false;
        }
        
        if (pos[productType]) {
            delete pos[productType];
            console.log(`✅ DATA_MANAGER.removeProduct: Rimosso ${productType} da ${posId}`);
            return true;
        }
        
        return false;
    }
    
    // ========================================================================
    // FUNZIONI HELPER: Conversione formati
    // ========================================================================
    
    /**
     * Normalizza un progetto per usare il formato `positions`
     * Converte `posizioni` → `positions` se necessario
     * 
     * @param {Object} project - Oggetto progetto
     * @returns {Object} - Progetto normalizzato
     */
    function normalizeProject(project) {
        if (!project) return project;
        
        // ════════════════════════════════════════════════════════════════
        // 🔗 v1.2.0: NORMALIZZAZIONE FORMATO ODOO
        // Progetti creati da Odoo CRM potrebbero avere solo dati cliente
        // senza positions/posizioni - li inizializziamo qui
        // ════════════════════════════════════════════════════════════════
        
        if (project.odoo_id || project.odoo_customer) {
            console.log('🔗 DATA_MANAGER: Rilevato formato ODOO, normalizzazione...');
            
            // Inizializza positions/posizioni se mancanti
            if (!project.positions) {
                project.positions = [];
                console.log('   ✅ Inizializzato positions: []');
            }
            if (!project.posizioni) {
                project.posizioni = project.positions;
                console.log('   ✅ Sincronizzato posizioni = positions');
            }
            
            // Normalizza dati cliente da odoo_customer
            const odooCustomer = project.odoo_customer || {};
            
            // Crea/completa oggetto cliente per dashboard
            if (!project.cliente) {
                project.cliente = {};
            }
            
            // Mappa campi Odoo → formato dashboard
            if (!project.cliente.nome && (project.name || odooCustomer.name)) {
                project.cliente.nome = project.name || odooCustomer.name || '';
            }
            if (!project.cliente.indirizzo && odooCustomer.street) {
                project.cliente.indirizzo = odooCustomer.street;
            }
            if (!project.cliente.citta && odooCustomer.city) {
                project.cliente.citta = odooCustomer.city;
            }
            if (!project.cliente.cap && odooCustomer.zip) {
                project.cliente.cap = odooCustomer.zip;
            }
            if (!project.cliente.telefono && (odooCustomer.phone || odooCustomer.mobile)) {
                project.cliente.telefono = odooCustomer.phone || odooCustomer.mobile || '';
            }
            if (!project.cliente.email && odooCustomer.email) {
                project.cliente.email = odooCustomer.email;
            }
            
            // Crea/completa clientData per retrocompatibilità
            if (!project.clientData) {
                project.clientData = {};
            }
            project.clientData.nome = project.cliente.nome || project.clientData.nome || '';
            project.clientData.telefono = project.cliente.telefono || project.clientData.telefono || '';
            project.clientData.email = project.cliente.email || project.clientData.email || '';
            project.clientData.indirizzo = project.cliente.indirizzo || project.clientData.indirizzo || '';
            
            // Imposta nome_ricerca per compatibilità
            if (!project.nome_ricerca) {
                project.nome_ricerca = project.name || project.cliente.nome || '';
            }
            
            // Imposta customerName per compatibilità
            if (!project.customerName) {
                project.customerName = project.name || project.cliente.nome || '';
            }
            
            // Imposta client per compatibilità
            if (!project.client) {
                project.client = project.name || project.cliente.nome || '';
            }
            
            console.log('   ✅ Normalizzazione Odoo completata:', {
                id: project.id,
                odoo_id: project.odoo_id,
                cliente: project.cliente.nome,
                positions: project.positions.length
            });
        }
        
        // ════════════════════════════════════════════════════════════════
        // NORMALIZZAZIONE STANDARD positions ↔ posizioni
        // ════════════════════════════════════════════════════════════════
        
        // Se ha posizioni ma non positions, converti
        if (project.posizioni && !project.positions) {
            project.positions = project.posizioni;
            console.log('🔄 DATA_MANAGER: Convertito posizioni → positions');
        }
        
        // Se ha positions ma non posizioni, aggiungi alias per compatibilità dashboard
        if (project.positions && !project.posizioni) {
            project.posizioni = project.positions;
        }
        
        // Assicura che siano sempre array
        if (!Array.isArray(project.positions)) {
            project.positions = [];
        }
        if (!Array.isArray(project.posizioni)) {
            project.posizioni = project.positions;
        }
        
        return project;
    }
    
    /**
     * Clona profondo un oggetto
     * @param {*} obj - Oggetto da clonare
     * @returns {*} - Clone
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    // ========================================================================
    // FUNZIONI DIRETTE SU POSIZIONE (per Editor che lavora su copia)
    // ========================================================================
    
    /**
     * Applica aggiornamento campo posizione direttamente sull'oggetto pos
     * Usato dall'Editor che lavora su una copia della posizione
     * 
     * @param {Object} pos - Oggetto posizione (diretto, non da progetto)
     * @param {string} field - Nome del campo
     * @param {*} value - Nuovo valore
     * @returns {boolean} - true se aggiornato
     */
    function applyPositionUpdate(pos, field, value) {
        if (!pos) return false;
        
        pos[field] = value;
        
        // 🔄 Sincronizza quantità ai prodotti
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
            console.log('🔄 DATA_MANAGER.applyPositionUpdate: Quantità → tutti i prodotti:', qta);
        }
        
        return true;
    }
    
    /**
     * Applica aggiornamento prodotto direttamente sull'oggetto pos
     * Include tutta la logica di business (auto-sync colori, tipoInfissoAssociato, cerniere)
     * 
     * @param {Object} pos - Oggetto posizione
     * @param {string} productType - Tipo prodotto
     * @param {string} field - Nome del campo
     * @param {*} value - Nuovo valore
     * @returns {boolean} - true se aggiornato
     */
    function applyProductUpdate(pos, productType, field, value) {
        if (!pos) return false;
        
        // Assicura che il prodotto esista
        if (!pos[productType]) {
            pos[productType] = {};
        }
        
        // Aggiorna il campo
        pos[productType][field] = value;
        
        // ========== LOGICA BUSINESS INFISSO ==========
        if (productType === 'infisso') {
            const inf = pos.infisso;
            
            // 🎨 Sincronizzazione colori PVC/PVC
            const isPvcPvc = inf.finituraInt === 'pvc' && inf.finituraEst === 'pvc';
            if (isPvcPvc) {
                if (field === 'coloreInt') {
                    inf.coloreEst = value;
                    console.log('🎨 DATA_MANAGER: PVC/PVC → coloreEst sincronizzato');
                } else if (field === 'coloreEst') {
                    inf.coloreInt = value;
                    console.log('🎨 DATA_MANAGER: PVC/PVC → coloreInt sincronizzato');
                }
            }
            
            // 🎯 Auto-selezione tipoInfissoAssociato
            if (field === 'tipo') {
                if (value && value.includes('PF')) {
                    inf.tipoInfissoAssociato = 'PF';
                    console.log('✅ DATA_MANAGER: Auto tipoInfissoAssociato = PF');
                } else if (value && (value.match(/F\d/) || value === 'FISSO' || value === 'HST')) {
                    inf.tipoInfissoAssociato = 'F';
                    console.log('✅ DATA_MANAGER: Auto tipoInfissoAssociato = F');
                }
            }
            
            // 🔩 Auto-calcolo cerniere da ferramenta
            if (field === 'ferramenta1') {
                const ferr = value || '';
                if (['411', '409', '430', '453', '425', '475', '473', '471', 'B411'].includes(ferr)) {
                    inf.cerniere = 'a-vista';
                    console.log(`🔩 DATA_MANAGER: Cerniere auto: ${ferr} → a-vista`);
                } else if (['211', '209', '230', '232', '225', '275', 'B211'].includes(ferr)) {
                    inf.cerniere = 'a-scomparsa';
                    console.log(`🔩 DATA_MANAGER: Cerniere auto: ${ferr} → a-scomparsa`);
                }
            }
            
            // 🔧 Reset esecuzione quando cambia finitura interna a ALU/LEGNO
            if (field === 'finituraInt') {
                const nuovaFinitura = (value || '').toLowerCase();
                if ((nuovaFinitura === 'alluminio' || nuovaFinitura === 'legno' || nuovaFinitura === 'alu') && inf.esecuzione1 === '0') {
                    inf.esecuzione1 = '3';
                    console.log(`🔧 DATA_MANAGER: Esecuzione reset a .3 (${nuovaFinitura} non supporta .0)`);
                }
            }
        }
        
        // ========== LOGICA BUSINESS PERSIANA ==========
        if (productType === 'persiana' && field === 'tipo') {
            const per = pos.persiana;
            if (value && value.includes('PF')) {
                per.tipoInfissoAssociato = 'PF';
                console.log('✅ DATA_MANAGER: Auto tipoInfissoAssociato persiana = PF');
            } else if (value && value.match(/F[A\d]/)) {
                per.tipoInfissoAssociato = 'F';
                console.log('✅ DATA_MANAGER: Auto tipoInfissoAssociato persiana = F');
            }
        }
        
        return true;
    }
    
    /**
     * Applica aggiornamento misura direttamente sull'oggetto pos
     * 
     * @param {Object} pos - Oggetto posizione
     * @param {string} field - Nome del campo misura
     * @param {*} value - Nuovo valore
     * @returns {boolean} - true se aggiornato
     */
    function applyMisuraUpdate(pos, field, value) {
        if (!pos) return false;
        
        if (!pos.misure) {
            pos.misure = {};
        }
        
        pos.misure[field] = value;
        return true;
    }
    
    /**
     * Crea prodotto direttamente sulla posizione (per Editor)
     * 
     * @param {Object} pos - Oggetto posizione
     * @param {string} productType - Tipo prodotto
     * @param {Object} defaults - Valori default opzionali
     * @returns {Object} - Prodotto creato
     */
    function applyCreateProduct(pos, productType, defaults = {}) {
        if (!pos) return null;
        
        // Se esiste già, ritorna quello esistente
        if (pos[productType]) {
            console.log(`ℹ️ DATA_MANAGER: ${productType} già esiste`);
            return pos[productType];
        }
        
        // Template prodotti
        const templates = {
            infisso: {
                id: `inf-${Date.now()}`,
                qta: pos.quantita || '1',
                tipo: '',
                tipoInfissoAssociato: 'F',
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
                qta: pos.quantita || '1',
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
                qta: pos.quantita || '1',
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
                accessoriDaSostituire: {},
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            },
            zanzariera: {
                id: `zanz-${Date.now()}`,
                qta: pos.quantita || '1',
                tipoInfissoAssociato: 'F',
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
                qta: pos.quantita || '1',
                azienda: 'Finstral',
                tipo: '',
                materialeCass: '',
                codiceCass: '',
                gruppoColoreCass: '',
                coloreCass: '',
                codiceIsolamento: '',
                coloreDaInfisso: true,
                aSoffitto: false,
                LS: '',
                SRSX: '',
                SRDX: '',
                ZSX: '',
                ZDX: '',
                HCASS: '',
                B: '',
                C: '',
                BSuperiore: '',
                BRM_L: 0,
                BRM_H: 0,
                note: ''
            }
        };
        
        const template = templates[productType] || { id: `${productType}-${Date.now()}`, qta: '1' };
        pos[productType] = { ...template, ...defaults };
        
        console.log(`✅ DATA_MANAGER.applyCreateProduct: Creato ${productType}`);
        return pos[productType];
    }
    
    // ========================================================================
    // 🔗 v1.2.0: HELPER ODOO
    // ========================================================================
    
    /**
     * Verifica se un progetto è in formato Odoo (da CRM)
     * @param {Object} project - Oggetto progetto
     * @returns {boolean} - true se è formato Odoo
     */
    function isOdooFormat(project) {
        return !!(project && (project.odoo_id || project.odoo_customer));
    }
    
    // ========================================================================
    // ESPORTA MODULO
    // ========================================================================
    
    const DATA_MANAGER = {
        VERSION: DATA_MANAGER_VERSION,
        
        // Accesso posizioni
        getPositions,
        setPositions,
        findPosition,
        findPositionIndex,
        
        // Update dati (su progetto)
        updatePosition,
        updateProduct,
        updateMisura,
        updateMisuraWithValidation,
        
        // Gestione prodotti (su progetto)
        createProduct,
        removeProduct,
        
        // 🆕 Funzioni dirette su posizione (per Editor)
        applyPositionUpdate,
        applyProductUpdate,
        applyMisuraUpdate,
        applyCreateProduct,
        
        // Helper
        normalizeProject,
        deepClone,
        
        // 🔗 v1.2.0: Odoo support
        isOdooFormat
    };
    
    // Esponi globalmente
    window.DATA_MANAGER = DATA_MANAGER;
    
    console.log(`✅ Data Manager v${DATA_MANAGER_VERSION} - Pronto!`);
    console.log('   📌 Funzioni progetto: updatePosition(), updateProduct(), updateMisura()');
    console.log('   📌 Funzioni editor: applyPositionUpdate(), applyProductUpdate(), applyMisuraUpdate()');
    console.log('   🔗 Supporto Odoo: normalizeProject() gestisce progetti da CRM');
    
})();
