/**
 * PROJECT MANAGER - Gestione Progetti e Posizioni
 * ═══════════════════════════════════════════════════════════════
 * Modulo condiviso per App Rilievo e Dashboard
 * 
 * Funzionalità:
 * - Creazione progetti con struttura completa
 * - Aggiunta/eliminazione/duplicazione posizioni
 * - Generazione ID sequenziali
 * - Gestione metadata e versioning
 * 
 * @version 1.0.0
 * @date 2026-01-21
 */

const PROJECT_MANAGER_VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════
// DEVICE IDENTIFICATION
// ═══════════════════════════════════════════════════════════════

const PROJECT_MANAGER = {
    
    /**
     * Ottiene o crea ID univoco dispositivo
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    },
    
    /**
     * Rileva tipo dispositivo automaticamente
     */
    detectDeviceName() {
        const ua = navigator.userAgent;
        
        if (/iPad/i.test(ua)) return 'Tablet iPad';
        if (/iPhone/i.test(ua)) return 'Smartphone iPhone';
        if (/Android/i.test(ua)) {
            if (/Mobile/i.test(ua)) return 'Smartphone Android';
            return 'Tablet Android';
        }
        if (/Windows/i.test(ua)) return 'PC Windows';
        if (/Mac/i.test(ua)) return 'PC Mac';
        if (/Linux/i.test(ua)) return 'PC Linux';
        
        return 'Dispositivo Sconosciuto';
    },
    
    /**
     * Ottiene nome dispositivo (con supporto nome custom)
     */
    getDeviceName() {
        let deviceName = localStorage.getItem('deviceName');
        if (!deviceName) {
            deviceName = this.detectDeviceName();
            const customName = localStorage.getItem('customDeviceName');
            if (customName) deviceName = customName;
            localStorage.setItem('deviceName', deviceName);
        }
        return deviceName;
    },
    
    /**
     * Imposta nome custom dispositivo
     */
    setDeviceName(name) {
        localStorage.setItem('customDeviceName', name);
        localStorage.setItem('deviceName', name);
        return name;
    },

    // ═══════════════════════════════════════════════════════════════
    // ID GENERATION
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Genera ID progetto formato ANNOP001 (es. 2026P001)
     * @param {Array} existingProjects - Array progetti esistenti per evitare duplicati
     */
    generateProjectId(existingProjects = []) {
        const currentYear = new Date().getFullYear();
        
        // Trova tutti i progetti dell'anno corrente
        const existingIds = existingProjects
            .map(p => p.id)
            .filter(id => id && id.startsWith(currentYear + 'P'));
        
        // Estrai i numeri esistenti
        const existingNumbers = existingIds
            .map(id => {
                const match = id.match(/^(\d{4})P(\d{3})$/);
                return match ? parseInt(match[2]) : 0;
            })
            .filter(n => n > 0);
        
        // Trova il prossimo numero disponibile
        const nextNumber = existingNumbers.length > 0 
            ? Math.max(...existingNumbers) + 1 
            : 1;
        
        // Formatta con padding (001, 002, 003, etc.)
        const paddedNumber = String(nextNumber).padStart(3, '0');
        
        return `${currentYear}P${paddedNumber}`;
    },
    
    /**
     * Genera ID posizione sequenziale: PROJECTID_01, PROJECTID_02, etc.
     * @param {string} projectId - ID del progetto
     * @param {Array} positions - Posizioni esistenti nel progetto
     */
    generatePositionId(projectId, positions = []) {
        const existingNumbers = positions
            .map(p => {
                const regex = new RegExp(`^${projectId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_(\\d+)$`);
                const match = p.id.match(regex);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => n > 0);
        
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        return `${projectId}_${String(nextNumber).padStart(2, '0')}`;
    },
    
    /**
     * Formatta ID progetto per visualizzazione (#2026P001)
     */
    formatProjectId(id) {
        if (!id) return '#UNKNOWN';
        if (/^\d{4}P\d{3}$/.test(id)) {
            return '#' + id;
        }
        return '#' + id.substring(0, 6).toUpperCase();
    },

    // ═══════════════════════════════════════════════════════════════
    // METADATA MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Inizializza metadata per nuovo progetto
     */
    initMetadata() {
        const now = new Date().toISOString();
        return {
            version: 1,
            created: now,
            updated: now,
            device: {
                id: this.getDeviceId(),
                name: this.getDeviceName()
            },
            syncStatus: 'local',
            changes: [{
                version: 1,
                timestamp: now,
                action: 'created',
                details: 'Progetto creato',
                device: {
                    id: this.getDeviceId(),
                    name: this.getDeviceName()
                }
            }]
        };
    },
    
    /**
     * Aggiorna timestamp e metadata progetto
     */
    updateMetadata(project, action, details) {
        if (!project) return;
        
        // Inizializza metadata se non esiste
        if (!project.metadata) {
            project.metadata = this.initMetadata();
        }
        
        // Incrementa versione
        project.metadata.version = (project.metadata.version || 0) + 1;
        
        // Aggiorna timestamp
        const now = new Date().toISOString();
        project.metadata.updated = now;
        project.updated = now; // Anche campo root per compatibilità
        
        // Aggiorna status
        project.metadata.syncStatus = 'local';
        
        // Aggiorna device info
        project.metadata.device = {
            id: this.getDeviceId(),
            name: this.getDeviceName()
        };
        
        // Aggiungi entry log modifiche
        if (!project.metadata.changes) {
            project.metadata.changes = [];
        }
        
        project.metadata.changes.push({
            version: project.metadata.version,
            timestamp: now,
            action: action,
            details: details,
            device: project.metadata.device
        });
        
        // Mantieni solo ultime 50 modifiche
        if (project.metadata.changes.length > 50) {
            project.metadata.changes = project.metadata.changes.slice(-50);
        }
        
        return project;
    },

    // ═══════════════════════════════════════════════════════════════
    // PROJECT TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Template vuoto per nuovo progetto
     */
    getEmptyProjectTemplate() {
        return {
            // Base
            id: '',
            name: '',
            client: '',
            clientData: {},
            linkSchizzo: '',
            
            // Prodotti attivi
            prodotti: {},
            
            // Caratteristiche muro globali
            caratteristicheMuro: {},
            
            // Config globali prodotti
            configInfissi: {},
            configPersiane: {},
            configTapparelle: {},
            configZanzariere: {
                azienda: '',
                modelloPF: '',
                modelloF: '',
                colore: ''
            },
            configCassonetti: {
                tipo: '',
                azienda: '',
                materiale: '',
                finitura: '',
                coibentazione: '',
                aSoffitto: '',
                materialeCass: '',
                codiceCass: '',
                gruppoColoreCass: '',
                coloreCass: '',
                codiceIsolamento: ''
            },
            
            // Rilievi globali
            rilievoInfissi: { materiale: '', note: '', togliere: false, smaltimento: false, coprifiliInt: false, coprifiliEst: false },
            rilievoPersiane: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoTapparelle: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoZanzariere: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoCassonetti: { materiale: '', note: '', togliere: false, smaltimento: false },
            
            // Config BRM globali
            brmConfigInfissi: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0', note: '' },
            brmConfigPersiane: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0', note: '' },
            brmConfigTapparelle: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0', note: '' },
            brmConfigZanzariere: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0', note: '' },
            brmConfigCassonetti: { 
                misuraBaseL: '', operazioneL: '-', valoreL: '0',
                misuraBaseH: '', operazioneH: '-', valoreH: '0',
                misuraBaseC: '', operazioneC: '-', valoreC: '0',
                misuraBaseB: '', operazioneB: '-', valoreB: '0',
                note: '', SRSX: '0', SRDX: '0', ZSX: '0', ZDX: '0'
            },
            
            // Posizioni
            positions: [],
            
            // Timestamp
            createdAt: '',
            
            // Metadata
            metadata: null
        };
    },
    
    /**
     * Template vuoto per nuova posizione
     */
    getEmptyPositionTemplate() {
        return {
            id: '',
            name: '',
            piano: '',
            ambiente: '',
            ambienteMode: 'select',
            quantita: '1',
            tipoposizione: '',
            misure: {},
            
            // Rilievi per posizione
            rilievo: { togliere: false, smaltimento: false, materiale: '', coprifiliInt: false, coprifiliEst: false, note: '' },
            rilievoPersiane: { togliere: false, smaltimento: false, materiale: '', note: '' },
            rilievoTapparelle: { togliere: false, smaltimento: false, materiale: '', note: '' },
            rilievoZanzariere: { togliere: false, smaltimento: false, materiale: '', note: '' },
            rilievoCassonetti: { togliere: false, smaltimento: false, materiale: '', note: '' },
            
            // Prodotti (singoli, non array)
            infisso: null,
            persiana: null,
            tapparella: null,
            zanzariera: null,
            cassonetto: null,
            blindata: null,
            portoncino: null,
            
            // Extra
            foto: [],
            note: '',
            noteVisibilita: []
        };
    },

    // ═══════════════════════════════════════════════════════════════
    // PROJECT OPERATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Crea nuovo progetto
     * @param {string} name - Nome progetto
     * @param {string} client - Nome cliente
     * @param {Array} existingProjects - Progetti esistenti (per generare ID univoco)
     * @returns {Object} Nuovo progetto
     */
    createProject(name, client, existingProjects = []) {
        const newId = this.generateProjectId(existingProjects);
        
        // Validazione ID
        if (!newId || newId === '#UNKNOWN' || newId === 'undefined' || newId.trim() === '') {
            console.error('❌ ERRORE: Generazione ID fallita');
            const fallbackId = `${new Date().getFullYear()}P${Date.now().toString().slice(-3)}`;
            console.warn('⚠️ Uso ID fallback:', fallbackId);
        }
        
        const project = this.getEmptyProjectTemplate();
        project.id = newId;
        project.name = name || '';
        project.client = client || '';
        project.createdAt = new Date().toISOString();
        project.metadata = this.initMetadata();
        
        console.log('✅ PROJECT_MANAGER: Nuovo progetto creato con ID:', newId);
        return project;
    },
    
    /**
     * Duplica progetto esistente
     * @param {Object} sourceProject - Progetto da duplicare
     * @param {Array} existingProjects - Progetti esistenti
     * @returns {Object} Progetto duplicato con nuovo ID
     */
    duplicateProject(sourceProject, existingProjects = []) {
        // Deep clone
        const newProject = JSON.parse(JSON.stringify(sourceProject));
        
        // Nuovo ID
        newProject.id = this.generateProjectId(existingProjects);
        newProject.name = sourceProject.name + ' (copia)';
        newProject.createdAt = new Date().toISOString();
        newProject.metadata = this.initMetadata();
        
        // Rigenera ID posizioni
        newProject.positions = newProject.positions.map((pos, idx) => {
            pos.id = `${newProject.id}_${String(idx + 1).padStart(2, '0')}`;
            return pos;
        });
        
        console.log('✅ PROJECT_MANAGER: Progetto duplicato:', newProject.id);
        return newProject;
    },

    // ═══════════════════════════════════════════════════════════════
    // POSITION OPERATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Aggiunge nuova posizione a progetto
     * @param {Object} project - Progetto target
     * @param {Object} options - Opzioni (ambiente, piano, copyGlobalConfig)
     * @returns {Object} Nuova posizione
     */
    addPosition(project, options = {}) {
        if (!project) {
            console.error('❌ PROJECT_MANAGER: Progetto non valido');
            return null;
        }
        
        if (!project.positions) {
            project.positions = [];
        }
        
        // Trova prossimo numero disponibile per nome
        const usedNumbers = new Set();
        project.positions.forEach(p => {
            const match = p.name.match(/Pos\.\s*(\d+)/);
            if (match) {
                usedNumbers.add(parseInt(match[1]));
            }
        });
        
        let newNum = 1;
        while (usedNumbers.has(newNum)) {
            newNum++;
        }
        
        // Crea posizione
        const pos = this.getEmptyPositionTemplate();
        pos.id = this.generatePositionId(project.id, project.positions);
        pos.name = `Pos. ${newNum}`;
        pos.piano = options.piano || project.clientData?.piano || '';
        pos.ambiente = options.ambiente || '';
        
        // Copia rilievi globali se richiesto
        if (options.copyGlobalConfig !== false) {
            if (project.rilievoInfissi) {
                pos.rilievo = { ...pos.rilievo, ...project.rilievoInfissi };
            }
            if (project.rilievoPersiane) {
                pos.rilievoPersiane = { ...pos.rilievoPersiane, ...project.rilievoPersiane };
            }
            if (project.rilievoTapparelle) {
                pos.rilievoTapparelle = { ...pos.rilievoTapparelle, ...project.rilievoTapparelle };
            }
            if (project.rilievoZanzariere) {
                pos.rilievoZanzariere = { ...pos.rilievoZanzariere, ...project.rilievoZanzariere };
            }
            if (project.rilievoCassonetti) {
                pos.rilievoCassonetti = { ...pos.rilievoCassonetti, ...project.rilievoCassonetti };
            }
        }
        
        // Aggiungi al progetto
        project.positions.push(pos);
        
        // Aggiorna metadata
        this.updateMetadata(project, 'addPosition', `Aggiunta posizione: ${pos.name}`);
        
        console.log('✅ PROJECT_MANAGER: Posizione aggiunta:', pos.id);
        return pos;
    },
    
    /**
     * Duplica posizione esistente
     * @param {Object} project - Progetto
     * @param {string} positionId - ID posizione da duplicare
     * @returns {Object} Posizione duplicata
     */
    duplicatePosition(project, positionId) {
        if (!project || !project.positions) return null;
        
        const sourcePos = project.positions.find(p => p.id === positionId);
        if (!sourcePos) {
            console.error('❌ PROJECT_MANAGER: Posizione non trovata:', positionId);
            return null;
        }
        
        // Deep clone
        const newPos = JSON.parse(JSON.stringify(sourcePos));
        
        // Nuovo ID e nome
        newPos.id = this.generatePositionId(project.id, project.positions);
        newPos.name = sourcePos.name + ' (copia)';
        
        // Aggiungi
        project.positions.push(newPos);
        
        // Aggiorna metadata
        this.updateMetadata(project, 'duplicatePosition', `Duplicata posizione: ${sourcePos.name} → ${newPos.name}`);
        
        console.log('✅ PROJECT_MANAGER: Posizione duplicata:', newPos.id);
        return newPos;
    },
    
    /**
     * Elimina posizione
     * @param {Object} project - Progetto
     * @param {string} positionId - ID posizione da eliminare
     * @returns {boolean} Successo
     */
    deletePosition(project, positionId) {
        if (!project || !project.positions) return false;
        
        const index = project.positions.findIndex(p => p.id === positionId);
        if (index === -1) {
            console.error('❌ PROJECT_MANAGER: Posizione non trovata:', positionId);
            return false;
        }
        
        const posName = project.positions[index].name;
        project.positions.splice(index, 1);
        
        // Aggiorna metadata
        this.updateMetadata(project, 'deletePosition', `Eliminata posizione: ${posName}`);
        
        console.log('✅ PROJECT_MANAGER: Posizione eliminata:', positionId);
        return true;
    },
    
    /**
     * Riordina posizioni
     * @param {Object} project - Progetto
     * @param {number} fromIndex - Indice origine
     * @param {number} toIndex - Indice destinazione
     */
    reorderPositions(project, fromIndex, toIndex) {
        if (!project || !project.positions) return false;
        
        if (fromIndex < 0 || fromIndex >= project.positions.length ||
            toIndex < 0 || toIndex >= project.positions.length) {
            return false;
        }
        
        const [moved] = project.positions.splice(fromIndex, 1);
        project.positions.splice(toIndex, 0, moved);
        
        this.updateMetadata(project, 'reorderPositions', `Riordinate posizioni`);
        
        return true;
    },

    // ═══════════════════════════════════════════════════════════════
    // PRODUCT OPERATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Aggiunge prodotto a posizione (copia config globale)
     * @param {Object} project - Progetto
     * @param {string} positionId - ID posizione
     * @param {string} productType - Tipo prodotto (infisso, persiana, tapparella, zanzariera, cassonetto)
     * @returns {Object} Prodotto creato
     */
    addProduct(project, positionId, productType) {
        if (!project || !project.positions) return null;
        
        const pos = project.positions.find(p => p.id === positionId);
        if (!pos) return null;
        
        // Mappa config globale per tipo prodotto
        const configMap = {
            infisso: 'configInfissi',
            persiana: 'configPersiane',
            tapparella: 'configTapparelle',
            zanzariera: 'configZanzariere',
            cassonetto: 'configCassonetti'
        };
        
        const globalConfigKey = configMap[productType];
        const globalConfig = project[globalConfigKey] || {};
        
        // Crea prodotto con config globale
        const product = {
            id: `${positionId}_${productType}_${Date.now()}`,
            qta: '1',
            ...JSON.parse(JSON.stringify(globalConfig))
        };
        
        // Calcola BRM se DATA_MANAGER disponibile
        if (typeof DATA_MANAGER !== 'undefined' && DATA_MANAGER.calculateBRM) {
            const brmConfigKey = `brmConfig${productType.charAt(0).toUpperCase() + productType.slice(1)}`;
            // BRM verrà calcolato quando ci sono le misure
        }
        
        // Assegna a posizione
        pos[productType] = product;
        
        // Aggiorna metadata
        this.updateMetadata(project, 'addProduct', `Aggiunto ${productType} a ${pos.name}`);
        
        console.log(`✅ PROJECT_MANAGER: ${productType} aggiunto a posizione ${positionId}`);
        return product;
    },
    
    /**
     * Rimuove prodotto da posizione
     */
    removeProduct(project, positionId, productType) {
        if (!project || !project.positions) return false;
        
        const pos = project.positions.find(p => p.id === positionId);
        if (!pos) return false;
        
        pos[productType] = null;
        
        this.updateMetadata(project, 'removeProduct', `Rimosso ${productType} da ${pos.name}`);
        
        return true;
    }
};

// Export per uso in altri moduli
if (typeof window !== 'undefined') {
    window.PROJECT_MANAGER = PROJECT_MANAGER;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROJECT_MANAGER;
}

console.log(`📦 PROJECT_MANAGER v${PROJECT_MANAGER_VERSION} caricato`);
