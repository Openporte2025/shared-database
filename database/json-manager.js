// ============================================================================
// JSON-MANAGER v2.0.0 - Gestione Unificata Export/Import JSON
// ============================================================================
// 
// Modulo centralizzato per: App Rilievo + Dashboard + App Posa + O.P.E.R.A.
// 
// STRUTTURA JSON:
//   1. CLIENTE      - Anagrafica completa
//   2. IMMOBILE     - Indirizzo lavori, zona climatica, detrazioni
//   3. MURO         - Caratteristiche globali vano
//   4. ESISTENTE    - Infissi/prodotti attuali (globale → override posizione)
//   5. CONFIG       - Configurazione prodotti (globale → override posizione)
//   6. POSIZIONI    - Array singoli vani
//   7. ODOO         - Link CRM (campi protetti)
//   8. METADATA     - Versioning, sync
//
// ============================================================================

const JSON_MANAGER = {
    
    version: '2.0.0',
    schemaVersion: '6.0',

    // =========================================================================
    // 1. CONFIGURAZIONE CENTRALIZZATA
    // =========================================================================
    
    CONFIG: {
        
        // Campi Odoo protetti (mai sovrascrivere)
        ODOO_PROTECTED: ['odoo_id', 'odoo_customer_id', 'odoo_customer'],
        
        // Valori di default
        DEFAULTS: {
            // Immobile
            zonaClimatica: 'E',
            tipoDetrazione: '50',
            
            // Posizione
            installazione: 'mazzetta',
            piano: '0',
            quantita: '1',
            
            // Esistente
            materialeInfisso: 'legno',
            vetroEsistente: 'doppio',
            materialePersiana: 'legno',
            tipoTapparella: 'plastica'
        },
        
        // Opzioni dropdown (usate da tutte le app)
        OPZIONI: {
            zonaClimatica: [
                { codice: 'A', nome: 'A - Molto caldo' },
                { codice: 'B', nome: 'B - Caldo' },
                { codice: 'C', nome: 'C - Temperato caldo' },
                { codice: 'D', nome: 'D - Temperato freddo' },
                { codice: 'E', nome: 'E - Freddo' },
                { codice: 'F', nome: 'F - Molto freddo' }
            ],
            tipoDetrazione: [
                { codice: 'nessuna', nome: 'Nessuna detrazione' },
                { codice: '50', nome: '50% - Ristrutturazione' },
                { codice: '65', nome: '65% - Risparmio energetico' },
                { codice: '110', nome: '110% - Superbonus' }
            ],
            tipoApertura: [
                { codice: 'F', nome: '🪟 F - Finestra' },
                { codice: 'PF', nome: '🚪 PF - Porta-finestra' }
            ],
            installazione: [
                { codice: 'filo_muro', nome: '🧱 Filo Muro Interno' },
                { codice: 'mazzetta', nome: '📐 In Mazzetta' }
            ],
            materialeEsistente: [
                { codice: 'legno', nome: 'Legno' },
                { codice: 'pvc', nome: 'PVC' },
                { codice: 'alluminio', nome: 'Alluminio' },
                { codice: 'ferro', nome: 'Ferro' },
                { codice: 'legno_alluminio', nome: 'Legno/Alluminio' }
            ],
            vetroEsistente: [
                { codice: 'singolo', nome: 'Singolo' },
                { codice: 'doppio', nome: 'Doppio' },
                { codice: 'triplo', nome: 'Triplo' }
            ],
            tipoMuro: [
                { codice: 'muratura', nome: 'Muratura piena' },
                { codice: 'forato', nome: 'Laterizio forato' },
                { codice: 'cartongesso', nome: 'Cartongesso' },
                { codice: 'cemento', nome: 'Cemento armato' },
                { codice: 'pietra', nome: 'Pietra' }
            ]
        },
        
        // Aziende di default per prodotto
        AZIENDE: {
            infisso: 'Finstral',
            persiana: 'P. Persiane',
            tapparella: 'Plasticino',
            zanzariera: 'Palagina',
            cassonetto: 'Finstral',
            blindata: 'Oikos',
            portoncino: 'Oikos',
            portaInterna: 'FerreroLegno'
        }
    },

    // =========================================================================
    // 2. EXPORT PROGETTO
    // =========================================================================
    
    /**
     * Esporta progetto in formato JSON standard
     * @param {Object} project - Progetto da esportare
     * @param {Object} options - { source: 'app-rilievo'|'dashboard'|'posa' }
     * @returns {Object} JSON strutturato
     */
    exportProject(project, options = {}) {
        if (!project) throw new Error('Progetto non valido');
        
        const now = new Date().toISOString();
        const source = options.source || 'unknown';
        
        return {
            // === SCHEMA ===
            _schema: {
                version: this.schemaVersion,
                managerVersion: this.version,
                exportedAt: now,
                exportedFrom: source
            },
            
            // === IDENTIFICATIVI ===
            id: project.id,
            name: project.name || '',
            
            // === 1. CLIENTE ===
            cliente: this._exportCliente(project.cliente || project.clientData),
            
            // === 2. IMMOBILE ===
            immobile: this._exportImmobile(project.immobile, project.cliente || project.clientData),
            
            // === 3. MURO (globale) ===
            muro: this._exportMuro(project.muro || project.caratteristicheMuro),
            
            // === 4. ESISTENTE (globale) ===
            esistente: this._exportEsistenteGlobale(project.esistente || project.rilievoGlobaleInfissi),
            
            // === 5. CONFIG PRODOTTI (globale) ===
            configProdotti: {
                infissi: project.configInfissi || {},
                persiane: project.configPersiane || {},
                tapparelle: project.configTapparelle || {},
                zanzariere: project.configZanzariere || {},
                cassonetti: project.configCassonetti || {}
            },
            
            // Prodotti abilitati
            prodottiAbilitati: this._exportProdottiAbilitati(project.prodotti),
            
            // Link schizzo
            linkSchizzo: project.linkSchizzo || '',
            
            // === 6. POSIZIONI ===
            posizioni: (project.positions || project.posizioni || []).map(p => this._exportPosizione(p)),
            
            // === 7. ODOO ===
            odoo: {
                id: project.odoo_id || null,
                customer_id: project.odoo_customer_id || project.odoo_id || null,
                customer: project.odoo_customer || null
            },
            
            // === 8. METADATA ===
            metadata: this._exportMetadata(project, source),
            
            // === TOTALI ===
            totali: this._calcolaTotali(project)
        };
    },

    // =========================================================================
    // 3. EXPORT SEZIONI
    // =========================================================================
    
    /**
     * 1. CLIENTE - Anagrafica completa
     */
    _exportCliente(cl) {
        cl = cl || {};
        return {
            // Anagrafica
            nome: cl.nome || '',
            cognome: cl.cognome || '',
            ragioneSociale: cl.ragioneSociale || '',
            codiceFiscale: cl.codiceFiscale || '',
            partitaIva: cl.partitaIva || '',
            
            // Contatti
            telefono: cl.telefono || '',
            email: cl.email || '',
            
            // Indirizzo residenza
            indirizzo: cl.indirizzo || cl.via || '',
            comune: cl.comune || '',
            provincia: cl.provincia || '',
            cap: cl.cap || ''
        };
    },
    
    /**
     * 2. IMMOBILE - Dove si fa il lavoro
     */
    _exportImmobile(imm, cliente) {
        imm = imm || {};
        cliente = cliente || {};
        
        return {
            // Indirizzo lavori (default = residenza cliente)
            indirizzo: imm.indirizzo || imm.via || cliente.indirizzo || cliente.via || '',
            comune: imm.comune || cliente.comune || '',
            provincia: imm.provincia || cliente.provincia || '',
            cap: imm.cap || cliente.cap || '',
            
            // Dati fiscali/ENEA
            zonaClimatica: imm.zonaClimatica || this.CONFIG.DEFAULTS.zonaClimatica,
            tipoDetrazione: imm.tipoDetrazione || this.CONFIG.DEFAULTS.tipoDetrazione,
            
            // Catasto (opzionale)
            catastoFoglio: imm.catastoFoglio || '',
            catastoParticella: imm.catastoParticella || '',
            catastoSub: imm.catastoSub || ''
        };
    },
    
    /**
     * 3. MURO - Caratteristiche globali vano
     */
    _exportMuro(muro) {
        muro = muro || {};
        return {
            tipoMuro: muro.tipoMuro || '',
            spessoreInt: muro.spessoreInt || muro.spessoreMuroInt || '',
            spessoreEst: muro.spessoreEst || muro.spessoreMuroEst || '',
            isolamento: muro.isolamento || '',
            note: muro.note || ''
        };
    },
    
    /**
     * 4. ESISTENTE - Prodotti attuali (globale, ereditato a posizioni)
     */
    _exportEsistenteGlobale(es) {
        es = es || {};
        return {
            infisso: {
                materiale: es.materialeInfisso || es.materiale || this.CONFIG.DEFAULTS.materialeInfisso,
                vetro: es.vetroEsistente || es.vetro || this.CONFIG.DEFAULTS.vetroEsistente,
                stato: es.statoInfisso || '',
                togliere: es.togliere ?? true,
                smaltimento: es.smaltimento ?? true
            },
            persiana: {
                materiale: es.materialePersiana || this.CONFIG.DEFAULTS.materialePersiana,
                stato: es.statoPersiana || '',
                togliere: es.toglierePersiana ?? false,
                smaltimento: es.smaltimentoPersiana ?? false
            },
            tapparella: {
                tipo: es.tipoTapparella || this.CONFIG.DEFAULTS.tipoTapparella,
                stato: es.statoTapparella || '',
                togliere: es.togliereTapparella ?? false,
                smaltimento: es.smaltimentoTapparella ?? false
            },
            cassonetto: {
                tipo: es.tipoCassonetto || '',
                stato: es.statoCassonetto || '',
                togliere: es.togliereCassonetto ?? false,
                smaltimento: es.smaltimentoCassonetto ?? false
            },
            // Coprifili
            coprifiliInt: es.coprifiliInt ?? false,
            coprifiliEst: es.coprifiliEst ?? false,
            note: es.note || ''
        };
    },
    
    /**
     * 6. POSIZIONE singola
     */
    _exportPosizione(pos) {
        return {
            // Identificativi
            id: pos.id,
            nome: pos.name || pos.nome || '',
            
            // Localizzazione
            ambiente: pos.ambiente || '',
            piano: pos.piano || this.CONFIG.DEFAULTS.piano,
            
            // Tipo vano
            tipoApertura: pos.tipoApertura || null,
            installazione: pos.installazione || pos.posizioneTelaio || this.CONFIG.DEFAULTS.installazione,
            
            // Quantità
            quantita: pos.quantita || this.CONFIG.DEFAULTS.quantita,
            
            // Misure
            misure: this._exportMisure(pos.misure),
            misureNonServe: pos.misureNonServe || {},
            
            // ESISTENTE (override del globale)
            esistente: pos.esistente || pos.rilievo ? this._exportEsistentePosizione(pos.esistente || pos.rilievo) : null,
            
            // MURO (override del globale)
            muroOverride: pos.overrideCaratteristiche ? pos.caratteristicheMuroOverride : null,
            
            // PRODOTTI
            infisso: pos.infisso ? this._exportInfisso(pos.infisso) : null,
            persiana: pos.persiana ? this._exportPersiana(pos.persiana) : null,
            tapparella: pos.tapparella ? this._exportTapparella(pos.tapparella) : null,
            zanzariera: pos.zanzariera ? this._exportZanzariera(pos.zanzariera) : null,
            cassonetto: pos.cassonetto ? this._exportCassonetto(pos.cassonetto) : null,
            ingresso: pos.ingresso || null,
            portaInterna: pos.portaInterna || null,
            
            // Prodotti assenti (esclusi deliberatamente)
            prodottiAssenti: pos.prodottiAssenti || [],
            
            // Note e media
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
        };
    },
    
    /**
     * ESISTENTE a livello posizione (override del globale)
     */
    _exportEsistentePosizione(es) {
        if (!es) return null;
        return {
            infisso: {
                materiale: es.materiale || es.materialeVecchio || null,
                vetro: es.vetro || es.vetroVecchio || null,
                togliere: es.togliere ?? null,
                smaltimento: es.smaltimento ?? null
            },
            coprifiliInt: es.coprifiliInt ?? null,
            coprifiliEst: es.coprifiliEst ?? null,
            note: es.note || ''
        };
    },
    
    /**
     * MISURE posizione
     */
    _exportMisure(mis) {
        mis = mis || {};
        return {
            LVT: mis.LVT ?? '',
            HVT: mis.HVT ?? '',
            LF: mis.LF ?? '',
            HF: mis.HF ?? '',
            TMV: mis.TMV ?? '',
            HMT: mis.HMT ?? '',
            L4: mis.L4 ?? '',
            H4: mis.H4 ?? '',
            DeltaINT: mis.DeltaINT ?? '',
            DeltaEST: mis.DeltaEST ?? '',
            HSoffitto: mis.HSoffitto ?? '',
            HParapettoSoffitto: mis.HParapettoSoffitto ?? '',
            HPavimentoParapetto: mis.HPavimentoParapetto ?? ''
        };
    },

    // =========================================================================
    // 4. EXPORT PRODOTTI
    // =========================================================================
    
    _exportInfisso(inf) {
        return {
            qta: inf.qta || inf.quantita || '1',
            azienda: inf.azienda || this.CONFIG.AZIENDE.infisso,
            tipo: inf.tipo || '',
            tipoInfissoAssociato: inf.tipoInfissoAssociato || 'F',
            codiceModello: inf.codiceModello || '',
            
            telaio: inf.telaio || '',
            finituraInt: inf.finituraInt || '',
            finituraEst: inf.finituraEst || '',
            coloreInt: inf.coloreInt || '',
            coloreEst: inf.coloreEst || '',
            tipoAnta: inf.tipoAnta || '',
            vetro: inf.vetro || '',
            maniglia: inf.maniglia || '',
            coloreManiglia: inf.coloreManiglia || '',
            cerniere: inf.cerniere || '',
            allarme: inf.allarme || '',
            
            // Ferramenta
            ferramenta1: inf.ferramenta1 || '',
            lato1: inf.lato1 || '',
            esecuzione1: inf.esecuzione1 || '',
            ferramenta2: inf.ferramenta2 || '',
            lato2: inf.lato2 || '',
            esecuzione2: inf.esecuzione2 || '',
            ferramenta3: inf.ferramenta3 || '',
            lato3: inf.lato3 || '',
            esecuzione3: inf.esecuzione3 || '',
            
            // Tagli telaio
            tagliTelaio: inf.tagliTelaio || '',
            codTagliValues: inf.codTagliValues || [],
            
            // Bancale
            bancaleTipo: inf.bancaleTipo || '',
            bancaleBordo: inf.bancaleBordo || '0',
            bancaleProfondita: inf.bancaleProfondita || '',
            
            // Anta Twin
            antaTwinTipo: inf.antaTwinTipo || '',
            antaTwinModello: inf.antaTwinModello || '',
            antaTwinColore: inf.antaTwinColore || '',
            antaTwinComando: inf.antaTwinComando || '27',
            
            // FIN-Slide
            finslideTelaio: inf.finslideTelaio || '',
            finslideAnta: inf.finslideAnta || '',
            finslideFerramenta: inf.finslideFerramenta || '',
            finslideManiglia: inf.finslideManiglia || '',
            finslideColoreManiglia: inf.finslideColoreManiglia || '',
            finslideVetro: inf.finslideVetro || '',
            
            // BRM
            BRM_L: inf.BRM_L ?? null,
            BRM_H: inf.BRM_H ?? null,
            
            note: inf.note || '',
            foto: inf.foto || [],
            manuallyEdited: inf.manuallyEdited || false
        };
    },
    
    _exportPersiana(per) {
        return {
            qta: per.qta || per.quantita || '1',
            azienda: per.azienda || this.CONFIG.AZIENDE.persiana,
            tipo: per.tipo || '',
            tipoInfissoAssociato: per.tipoInfissoAssociato || 'F',
            apertura: per.apertura || '',
            modello: per.modello || '',
            fissaggio: per.fissaggio || '',
            colorePersiana: per.colorePersiana || '',
            coloreTelaio: per.coloreTelaio || '',
            battuta: per.battuta || '',
            tipoStecca: per.tipoStecca || '',
            asolato: per.asolato || '',
            tipoTelaio: per.tipoTelaio || '',
            BRM_L: per.BRM_L ?? null,
            BRM_H: per.BRM_H ?? null,
            accessoriPersiana: per.accessoriPersiana || {},
            note: per.note || '',
            foto: per.foto || []
        };
    },
    
    _exportTapparella(tap) {
        return {
            qta: tap.qta || tap.quantita || '1',
            serveTapparella: tap.serveTapparella ?? true,
            serveMotore: tap.serveMotore ?? false,
            serveAccessori: tap.serveAccessori ?? false,
            tapparellaEsistente: tap.tapparellaEsistente || 'manuale',
            azienda: tap.azienda || this.CONFIG.AZIENDE.tapparella,
            modello: tap.modello || '',
            tipo: tap.tipo || '',
            colore: tap.colore || '',
            guida: tap.guida || '',
            coloreGuida: tap.coloreGuida || '',
            motoreAzienda: tap.motoreAzienda || 'Somfy',
            motoreModello: tap.motoreModello || '',
            motori: tap.motori || [],
            accessoriDaSostituire: tap.accessoriDaSostituire || {},
            BRM_L: tap.BRM_L ?? null,
            BRM_H: tap.BRM_H ?? null,
            note: tap.note || '',
            foto: tap.foto || []
        };
    },
    
    _exportZanzariera(zan) {
        return {
            qta: zan.qta || zan.quantita || '1',
            azienda: zan.azienda || this.CONFIG.AZIENDE.zanzariera,
            tipoInfissoAssociato: zan.tipoInfissoAssociato || 'F',
            linea: zan.linea || '',
            modello: zan.modello || '',
            fasciaColore: zan.fasciaColore || '',
            coloreTelaio: zan.coloreTelaio || '',
            tipoRete: zan.tipoRete || '',
            colorePlastica: zan.colorePlastica || '',
            BRM_L: zan.BRM_L ?? null,
            BRM_H: zan.BRM_H ?? null,
            note: zan.note || '',
            foto: zan.foto || []
        };
    },
    
    _exportCassonetto(cas) {
        return {
            qta: cas.qta || cas.quantita || '1',
            azienda: cas.azienda || this.CONFIG.AZIENDE.cassonetto,
            tipo: cas.tipo || '',
            materialeCass: cas.materialeCass || '',
            codiceCass: cas.codiceCass || '',
            gruppoColoreCass: cas.gruppoColoreCass || '',
            coloreCass: cas.coloreCass || '',
            codiceIsolamento: cas.codiceIsolamento || '',
            sovrappiSostit: cas.sovrappiSostit || '',
            aSoffitto: cas.aSoffitto || false,
            isolamentoPosaclima: cas.isolamentoPosaclima || false,
            LS: cas.LS ?? 0,
            SRSX: cas.SRSX ?? 0,
            SRDX: cas.SRDX ?? 0,
            ZSX: cas.ZSX ?? 0,
            ZDX: cas.ZDX ?? 0,
            HCASS: cas.HCASS ?? 0,
            B: cas.B ?? 0,
            C: cas.C ?? 0,
            BSuperiore: cas.BSuperiore ?? 0,
            BRM_L: cas.BRM_L ?? null,
            BRM_H: cas.BRM_H ?? null,
            note: cas.note || ''
        };
    },

    // =========================================================================
    // 5. IMPORT PROGETTO
    // =========================================================================
    
    /**
     * Importa progetto da JSON
     */
    importProject(jsonData, options = {}) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        // Valida
        const validation = this.validateJSON(data);
        if (!validation.valid && !options.forceImport) {
            console.warn('⚠️ Import warnings:', validation.warnings);
        }
        
        // Supporta sia formato nuovo (cliente) che vecchio (clientData)
        const cliente = data.cliente || data.clientData || {};
        
        return {
            // Identificativi
            id: data.id || this._generateId(),
            name: data.name || '',
            
            // Cliente (normalizzato)
            cliente: cliente,
            clientData: cliente, // Retrocompatibilità
            
            // Immobile
            immobile: data.immobile || {},
            
            // Muro (normalizzato)
            muro: data.muro || data.caratteristicheMuro || {},
            caratteristicheMuro: data.muro || data.caratteristicheMuro || {},
            
            // Esistente (globale)
            esistente: data.esistente || {},
            rilievoGlobaleInfissi: data.esistente?.infisso || data.rilievoGlobaleInfissi || {},
            
            // Config prodotti
            configInfissi: data.configProdotti?.infissi || data.configInfissi || {},
            configPersiane: data.configProdotti?.persiane || data.configPersiane || {},
            configTapparelle: data.configProdotti?.tapparelle || data.configTapparelle || {},
            configZanzariere: data.configProdotti?.zanzariere || data.configZanzariere || {},
            configCassonetti: data.configProdotti?.cassonetti || data.configCassonetti || {},
            
            // Prodotti abilitati
            prodotti: data.prodottiAbilitati || data.prodotti || {},
            
            // Link
            linkSchizzo: data.linkSchizzo || '',
            
            // Posizioni (normalizzate)
            positions: (data.posizioni || data.positions || []).map(p => this._importPosizione(p)),
            
            // Odoo
            odoo_id: data.odoo?.id || data.odoo_id || null,
            odoo_customer_id: data.odoo?.customer_id || data.odoo_customer_id || null,
            odoo_customer: data.odoo?.customer || data.odoo_customer || null,
            
            // Metadata
            metadata: {
                ...data.metadata,
                importedAt: new Date().toISOString(),
                importedFrom: options.source || 'unknown'
            }
        };
    },
    
    _importPosizione(pos) {
        return {
            id: pos.id || this._generateId('pos'),
            name: pos.nome || pos.name || '',
            nome: pos.nome || pos.name || '',
            ambiente: pos.ambiente || '',
            piano: pos.piano || this.CONFIG.DEFAULTS.piano,
            quantita: pos.quantita || this.CONFIG.DEFAULTS.quantita,
            
            tipoApertura: pos.tipoApertura || null,
            installazione: pos.installazione || this.CONFIG.DEFAULTS.installazione,
            posizioneTelaio: pos.installazione || pos.posizioneTelaio || this.CONFIG.DEFAULTS.installazione,
            
            misure: pos.misure || {},
            misureNonServe: pos.misureNonServe || {},
            
            // Esistente (override)
            esistente: pos.esistente || null,
            rilievo: pos.esistente ? this._importEsistentePosizione(pos.esistente) : (pos.rilievo || {}),
            
            // Muro override
            overrideCaratteristiche: !!pos.muroOverride,
            caratteristicheMuroOverride: pos.muroOverride || null,
            
            // Prodotti
            infisso: pos.infisso || null,
            persiana: pos.persiana || null,
            tapparella: pos.tapparella || null,
            zanzariera: pos.zanzariera || null,
            cassonetto: pos.cassonetto || null,
            ingresso: pos.ingresso || null,
            portaInterna: pos.portaInterna || null,
            
            prodottiAssenti: pos.prodottiAssenti || [],
            
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
        };
    },
    
    _importEsistentePosizione(es) {
        if (!es) return {};
        return {
            materiale: es.infisso?.materiale || '',
            materialeVecchio: es.infisso?.materiale || '',
            vetro: es.infisso?.vetro || '',
            vetroVecchio: es.infisso?.vetro || '',
            togliere: es.infisso?.togliere ?? true,
            smaltimento: es.infisso?.smaltimento ?? true,
            coprifiliInt: es.coprifiliInt ?? false,
            coprifiliEst: es.coprifiliEst ?? false,
            note: es.note || ''
        };
    },

    // =========================================================================
    // 6. VALIDAZIONE
    // =========================================================================
    
    validateJSON(data) {
        const errors = [];
        const warnings = [];
        
        if (!data) {
            return { valid: false, errors: ['JSON vuoto'], warnings };
        }
        
        // Errori bloccanti
        if (!data.id) errors.push('ID progetto mancante');
        
        // Warnings
        const cliente = data.cliente || data.clientData || {};
        if (!cliente.nome && !cliente.cognome && !cliente.ragioneSociale) {
            warnings.push('Dati cliente mancanti');
        }
        if (!cliente.codiceFiscale && !cliente.partitaIva) {
            warnings.push('Codice fiscale o P.IVA mancante');
        }
        
        const immobile = data.immobile || {};
        if (!immobile.zonaClimatica) {
            warnings.push('Zona climatica mancante (necessaria per ENEA)');
        }
        
        // Posizioni
        const posizioni = data.posizioni || data.positions || [];
        posizioni.forEach((pos, i) => {
            const n = i + 1;
            if (!pos.ambiente) warnings.push(`Posizione ${n}: ambiente mancante`);
            if (!pos.tipoApertura) warnings.push(`Posizione ${n}: tipo apertura (F/PF) mancante`);
            if (!pos.installazione && !pos.posizioneTelaio) warnings.push(`Posizione ${n}: installazione mancante`);
        });
        
        return { valid: errors.length === 0, errors, warnings };
    },

    // =========================================================================
    // 7. ODOO HELPERS
    // =========================================================================
    
    /**
     * Merge preservando SEMPRE i campi Odoo esistenti
     */
    mergePreservingOdoo(existing, newData) {
        const odoo = {};
        this.CONFIG.ODOO_PROTECTED.forEach(f => {
            if (existing?.[f]) odoo[f] = existing[f];
        });
        return { ...newData, ...odoo };
    },
    
    /**
     * Imposta dati Odoo
     */
    setOdooData(project, odooId, odooCustomer = null) {
        return {
            ...project,
            odoo_id: odooId,
            odoo_customer_id: odooId,
            odoo_customer: odooCustomer
        };
    },
    
    /**
     * Verifica collegamento Odoo
     */
    hasOdooLink(project) {
        return !!(project?.odoo_id || project?.odoo_customer_id);
    },
    
    /**
     * Estrai ID Odoo
     */
    getOdooId(project) {
        return project?.odoo_id || project?.odoo_customer_id || null;
    },

    // =========================================================================
    // 8. FATTURA INFISSI / ENEA HELPERS
    // =========================================================================
    
    /**
     * Verifica dati pronti per Fattura Infissi Web
     */
    checkReadyForFatturaInfissi(project) {
        const missing = [];
        const cliente = project.cliente || project.clientData || {};
        const immobile = project.immobile || {};
        
        // Cliente
        if (!cliente.codiceFiscale && !cliente.partitaIva) missing.push('Codice Fiscale o P.IVA');
        if (!cliente.cap) missing.push('CAP cliente');
        if (!cliente.comune) missing.push('Comune cliente');
        
        // Immobile
        if (!immobile.zonaClimatica) missing.push('Zona climatica');
        
        // Posizioni
        const posizioni = project.positions || project.posizioni || [];
        posizioni.forEach((pos, i) => {
            const n = i + 1;
            if (!pos.piano) missing.push(`Pos ${n}: piano`);
            if (!pos.installazione && !pos.posizioneTelaio) missing.push(`Pos ${n}: installazione`);
            
            const es = pos.esistente || pos.rilievo || {};
            const infEs = es.infisso || es;
            if (!infEs.vetro && !infEs.vetroVecchio) missing.push(`Pos ${n}: vetro esistente`);
            if (!infEs.materiale && !infEs.materialeVecchio) missing.push(`Pos ${n}: materiale esistente`);
        });
        
        return {
            ready: missing.length === 0,
            missing
        };
    },
    
    /**
     * Determina materiale per ENEA dal nuovo infisso
     */
    getMaterialeENEA(infisso) {
        if (!infisso) return '';
        const int = (infisso.finituraInt || '').toLowerCase();
        const est = (infisso.finituraEst || '').toLowerCase();
        if (int === est) return int || 'misto';
        return 'misto';
    },

    // =========================================================================
    // 9. UTILITY
    // =========================================================================
    
    _exportProdottiAbilitati(prod) {
        prod = prod || {};
        return {
            infissi: prod.infissi ?? true,
            persiane: prod.persiane ?? false,
            tapparelle: prod.tapparelle ?? false,
            zanzariere: prod.zanzariere ?? false,
            cassonetti: prod.cassonetti ?? false,
            blindate: prod.blindate ?? false,
            portoncini: prod.portoncini ?? false,
            porteInterne: prod.porteInterne ?? false
        };
    },
    
    _calcolaTotali(project) {
        const pos = project.positions || project.posizioni || [];
        return {
            n_posizioni: pos.length,
            n_infissi: pos.filter(p => p.infisso).length,
            n_persiane: pos.filter(p => p.persiana).length,
            n_tapparelle: pos.filter(p => p.tapparella).length,
            n_zanzariere: pos.filter(p => p.zanzariera).length,
            n_cassonetti: pos.filter(p => p.cassonetto).length
        };
    },
    
    _exportMetadata(project, source) {
        const now = new Date().toISOString();
        const m = project.metadata || {};
        return {
            version: (m.version || 0) + 1,
            created: m.created || now,
            updated: now,
            schemaVersion: this.schemaVersion,
            device: m.device || { id: 'unknown' }
        };
    },
    
    _generateId(prefix = 'prj') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    },
    
    /**
     * Genera HTML options per select da CONFIG.OPZIONI
     */
    generaOptions(tipoOpzione, valoreSelezionato = '') {
        const opzioni = this.CONFIG.OPZIONI[tipoOpzione];
        if (!opzioni) return '<option value="">Tipo non trovato</option>';
        
        return opzioni.map(opt => {
            const selected = opt.codice === valoreSelezionato ? 'selected' : '';
            return `<option value="${opt.codice}" ${selected}>${opt.nome}</option>`;
        }).join('\n');
    },
    
    /**
     * Verifica se valore è valido per tipo opzione
     */
    isValidOption(tipoOpzione, valore) {
        const opzioni = this.CONFIG.OPZIONI[tipoOpzione];
        if (!opzioni || !valore) return false;
        return opzioni.some(o => o.codice === valore);
    },

    // =========================================================================
    // 10. DOWNLOAD / UPLOAD
    // =========================================================================
    
    downloadJSON(project, options = {}) {
        const data = this.exportProject(project, options);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const cliente = data.cliente || {};
        const nomeCliente = cliente.cognome || cliente.nome || cliente.ragioneSociale || 'Cliente';
        const filename = options.filename || `PROGETTO-${nomeCliente}-${data.name || 'Progetto'}-${new Date().toISOString().split('T')[0]}.json`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true, filename };
    },
    
    async uploadJSON(file, options = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    resolve(this.importProject(JSON.parse(e.target.result), options));
                } catch (err) {
                    reject(new Error(`Errore: ${err.message}`));
                }
            };
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsText(file);
        });
    }
};


// =========================================================================
// EXPORT
// =========================================================================

if (typeof window !== 'undefined') {
    window.JSON_MANAGER = JSON_MANAGER;
    console.log('📦 JSON_MANAGER v' + JSON_MANAGER.version + ' caricato');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JSON_MANAGER };
}
