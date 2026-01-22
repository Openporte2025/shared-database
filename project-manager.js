/**
 * PROJECT MANAGER - Gestione Progetti e Posizioni
 * ═══════════════════════════════════════════════════════════════
 * Modulo condiviso per App Rilievo e Dashboard
 * 
 * @version 1.0.0
 * @repository shared-database
 */

const PROJECT_MANAGER_VERSION = '1.0.0';

const PROJECT_MANAGER = {
    
    // ═══════════════════════════════════════════════════════════════
    // ID GENERATION
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Genera ID progetto formato ANNOP001 (es. 2026P001)
     */
    generateProjectId(existingProjects = []) {
        const currentYear = new Date().getFullYear();
        const existingIds = existingProjects
            .map(p => p.id)
            .filter(id => id && id.startsWith(currentYear + 'P'));
        
        const existingNumbers = existingIds
            .map(id => {
                const match = id.match(/^(\d{4})P(\d{3})$/);
                return match ? parseInt(match[2]) : 0;
            })
            .filter(n => n > 0);
        
        const nextNumber = existingNumbers.length > 0 
            ? Math.max(...existingNumbers) + 1 
            : 1;
        
        return `${currentYear}P${String(nextNumber).padStart(3, '0')}`;
    },
    
    /**
     * Genera ID posizione sequenziale
     */
    generatePositionId(projectId, positions = []) {
        const posNum = positions.length + 1;
        return `${projectId}_${String(posNum).padStart(2, '0')}`;
    },

    // ═══════════════════════════════════════════════════════════════
    // PROJECT OPERATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Crea nuovo progetto
     */
    createProject(name, client, existingProjects = []) {
        const projectId = this.generateProjectId(existingProjects);
        const now = new Date().toISOString();
        
        return {
            id: projectId,
            name: name || '',
            client: client || '',
            customerName: client || '',
            clientData: {
                nome: client || '',
                telefono: '',
                email: '',
                indirizzo: ''
            },
            prodotti: {
                infissi: true,
                persiane: false,
                tapparelle: false,
                zanzariere: false,
                cassonetti: false,
                blindate: false
            },
            configInfissi: {},
            configPersiane: {},
            configTapparelle: {},
            configZanzariere: {},
            configCassonetti: {},
            rilievoInfissi: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoPersiane: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoTapparelle: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoZanzariere: { materiale: '', note: '', togliere: false, smaltimento: false },
            rilievoCassonetti: { materiale: '', note: '', togliere: false, smaltimento: false },
            brmConfigInfissi: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0' },
            brmConfigPersiane: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0' },
            brmConfigTapparelle: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0' },
            brmConfigZanzariere: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0' },
            brmConfigCassonetti: { misuraBaseL: '', operazioneL: '-', valoreL: '0', misuraBaseH: '', operazioneH: '-', valoreH: '0' },
            positions: [],
            posizioni: [],
            createdAt: now,
            metadata: {
                version: 1,
                created: now,
                updated: now,
                syncStatus: 'local'
            }
        };
    },

    // ═══════════════════════════════════════════════════════════════
    // POSITION OPERATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Crea nuova posizione
     */
    createPosition(project, ambiente, piano = '', note = '') {
        if (!project) return null;
        
        if (!project.positions) project.positions = [];
        if (!project.posizioni) project.posizioni = [];
        
        const posNum = project.positions.length + 1;
        const posId = this.generatePositionId(project.id, project.positions);
        
        const newPos = {
            id: posId,
            name: `Pos. ${posNum}`,
            ambiente: ambiente || '',
            piano: piano || '',
            note: note || '',
            quantita: '1',
            misure: {},
            rilievo: { togliere: false, smaltimento: false, materiale: '', note: '' },
            infisso: null,
            persiana: null,
            tapparella: null,
            zanzariera: null,
            cassonetto: null,
            foto: []
        };
        
        project.positions.push(newPos);
        project.posizioni.push(newPos);
        
        // Aggiorna metadata
        if (project.metadata) {
            project.metadata.version = (project.metadata.version || 0) + 1;
            project.metadata.updated = new Date().toISOString();
        }
        
        return newPos;
    }
};

// Export globale
window.PROJECT_MANAGER = PROJECT_MANAGER;

console.log(`📦 PROJECT_MANAGER v${PROJECT_MANAGER_VERSION} caricato`);
