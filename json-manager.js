// ============================================================================
// JSON-MANAGER v2.0.0
// ============================================================================
// 
// Modulo unificato per App Rilievo + Dashboard + O.P.E.R.A.
// 
// v2.0.0 - Riorganizzazione completa:
//   • Supporto Odoo (campi protetti)
//   • Supporto Fattura Infissi Web (dati fiscali/ENEA)
//   • Nuovi campi: installazione, vetroVecchio, zonaClimatica, etc.
//
// ============================================================================

const JSON_MANAGER = {
    
    version: '2.0.0',
    schemaVersion: '6.0',


    // =========================================================================
    // 1. CONFIGURAZIONE
    // =========================================================================
    
    CONFIG: {
        // Campi Odoo che non devono MAI essere sovrascritti
        ODOO_PROTECTED: ['odoo_id', 'odoo_customer_id', 'odoo_customer'],
        
        // Valori di default
        DEFAULTS: {
            zonaClimatica: 'E',
            tipoDetrazione: '50',
            installazione: 'mazzetta',
            piano: '1',
            quantita: '1',
            vetroVecchio: 'doppio',
            materialeVecchio: 'legno'
        },
        
        // Opzioni per i dropdown nelle app
        OPZIONI: {
            zonaClimatica: ['A', 'B', 'C', 'D', 'E', 'F'],
            tipoDetrazione: ['nessuna', '50', '65', '110'],
            installazione: ['mazzetta', 'filo muro interno', 'filo muro esterno'],
            vetro: ['singolo', 'doppio', 'triplo'],
            materiale: ['legno', 'pvc', 'alluminio', 'ferro', 'misto']
        },
        
        // Aziende di default per prodotto
        AZIENDE: {
            infisso: 'finstral',
            persiana: 'P. Persiane',
            tapparella: 'Plasticino',
            zanzariera: 'Palagina',
            cassonetto: 'Finstral',
            blindata: 'Oikos',
            portaInterna: 'FERREROLEGNO'
        }
    },


    // =========================================================================
    // 2. EXPORT PROGETTO
    // =========================================================================
    
    /**
     * Esporta un progetto in formato JSON standard
     * @param {Object} project - Progetto da esportare
     * @param {Object} options - { source: 'app'|'dashboard'|'opera' }
     * @returns {Object} JSON strutturato
     */
    exportProject(project, options = {}) {
        if (!project) throw new Error('Progetto non valido');
        
        const now = new Date().toISOString();
        const source = options.source || 'unknown';
        
        return {
            
            // --- SCHEMA ---
            _schema: {
                version: this.schemaVersion,
                managerVersion: this.version,
                exportedAt: now,
                exportedFrom: source
            },
            
            // --- IDENTIFICATIVI ---
            id: project.id,
            name: project.name || '',
            client: project.client || '',
            
            // --- ODOO (protetti) ---
            odoo_id: project.odoo_id || null,
            odoo_customer_id: project.odoo_customer_id || project.odoo_id || null,
            odoo_customer: project.odoo_customer || null,
            
            // --- CLIENTE ---
            clientData: this._exportClientData(project.clientData),
            
            // --- IMMOBILE E FISCALE ---
            immobile: this._exportImmobile(project),
            
            // --- CONFIGURAZIONI GLOBALI ---
            linkSchizzo: project.linkSchizzo || '',
            prodotti: this._exportProdottiAbilitati(project.prodotti),
            caratteristicheMuro: this._exportCaratteristicheMuro(project.caratteristicheMuro),
            
            // --- CONFIG PRODOTTI ---
            configInfissi: project.configInfissi || {},
            configPersiane: project.configPersiane || {},
            configTapparelle: project.configTapparelle || {},
            configZanzariere: project.configZanzariere || {},
            configCassonetti: project.configCassonetti || {},
            
            // --- RILIEVI GLOBALI ---
            rilievoGlobaleInfissi: project.rilievoGlobaleInfissi || {},
            rilievoPersiane: project.rilievoPersiane || {},
            rilievoTapparelle: project.rilievoTapparelle || {},
            
            // --- BRM CONFIG ---
            brmConfigInfissi: project.brmConfigInfissi || {},
            brmConfigPersiane: project.brmConfigPersiane || {},
            brmConfigTapparelle: project.brmConfigTapparelle || {},
            brmConfigZanzariere: project.brmConfigZanzariere || {},
            
            // --- POSIZIONI ---
            positions: (project.positions || []).map(p => this._exportPosition(p)),
            
            // --- TOTALI ---
            totali: this._calcolaTotali(project),
            
            // --- METADATA ---
            metadata: this._exportMetadata(project, source)
        };
    },


    // =========================================================================
    // 3. EXPORT SEZIONI
    // =========================================================================
    
    /**
     * Dati cliente (separati per Fattura Infissi Web)
     */
    _exportClientData(cd) {
        cd = cd || {};
        return {
            // Anagrafica
            nome: cd.nome || '',
            cognome: cd.cognome || '',
            ragioneSociale: cd.ragioneSociale || '',
            codiceFiscale: cd.codiceFiscale || '',
            partitaIva: cd.partitaIva || '',
            
            // Contatti
            telefono: cd.telefono || '',
            email: cd.email || '',
            pec: cd.pec || '',
            
            // Indirizzo (separato)
            via: cd.via || cd.indirizzo || '',
            cap: cd.cap || '',
            comune: cd.comune || '',
            provincia: cd.provincia || '',
            
            // Indirizzo completo (retrocompatibilità)
            indirizzo: cd.indirizzo || this._buildIndirizzo(cd)
        };
    },
    
    /**
     * Dati immobile per detrazioni fiscali
     */
    _exportImmobile(project) {
        const imm = project.immobile || {};
        const cd = project.clientData || {};
        
        return {
            // Indirizzo lavori (può essere diverso da residenza)
            via: imm.via || cd.via || '',
            cap: imm.cap || cd.cap || '',
            comune: imm.comune || cd.comune || '',
            provincia: imm.provincia || cd.provincia || '',
            
            // Dati fiscali
            zonaClimatica: imm.zonaClimatica || project.zonaClimatica || this.CONFIG.DEFAULTS.zonaClimatica,
            tipoDetrazione: imm.tipoDetrazione || project.tipoDetrazione || this.CONFIG.DEFAULTS.tipoDetrazione,
            tipoIntervento: imm.tipoIntervento || 'manutenzione_ordinaria',
            
            // Catasto (opzionale)
            catastoFoglio: imm.catastoFoglio || '',
            catastoParticella: imm.catastoParticella || '',
            catastoSub: imm.catastoSub || ''
        };
    },
    
    /**
     * Singola posizione
     */
    _exportPosition(pos) {
        return {
            // Identificativi
            id: pos.id,
            name: pos.name || pos.nome || '',
            
            // Localizzazione
            ambiente: pos.ambiente || '',
            piano: pos.piano || this.CONFIG.DEFAULTS.piano,
            
            // Tipo e quantità
            quantita: pos.quantita || this.CONFIG.DEFAULTS.quantita,
            tipoposizione: pos.tipoposizione || null,  // finestra, portafinestra
            tipoApertura: pos.tipoApertura || null,    // F, PF
            
            // INSTALLAZIONE (filo muro / mazzetta)
            installazione: pos.installazione || this.CONFIG.DEFAULTS.installazione,
            
            // Misure
            misure: this._exportMisure(pos.misure),
            misureNonServe: pos.misureNonServe || {},
            
            // Caratteristiche muro (override)
            overrideCaratteristiche: pos.overrideCaratteristiche || false,
            caratteristicheMuroOverride: pos.caratteristicheMuroOverride || null,
            
            // RILIEVO (infisso esistente per ENEA)
            rilievo: this._exportRilievo(pos.rilievo),
            
            // Prodotti assenti
            prodottiAssenti: pos.prodottiAssenti || [],
            
            // Prodotti configurati
            infisso: pos.infisso ? this._exportInfisso(pos.infisso) : null,
            persiana: pos.persiana ? this._exportPersiana(pos.persiana) : null,
            tapparella: pos.tapparella ? this._exportTapparella(pos.tapparella) : null,
            zanzariera: pos.zanzariera ? this._exportZanzariera(pos.zanzariera) : null,
            cassonetto: pos.cassonetto ? this._exportCassonetto(pos.cassonetto) : null,
            ingresso: pos.ingresso || null,
            portaInterna: pos.portaInterna || null,
            clickZip: pos.clickZip || null,
            tendaBracci: pos.tendaBracci || null,
            
            // Note e media
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
        };
    },
    
    /**
     * Rilievo infisso esistente (per ENEA)
     */
    _exportRilievo(ril) {
        ril = ril || {};
        return {
            // Smontaggio
            togliere: ril.togliere ?? false,
            smaltimento: ril.smaltimento ?? false,
            
            // INFISSO VECCHIO (per ENEA)
            materialeVecchio: ril.materialeVecchio || ril.materiale || this.CONFIG.DEFAULTS.materialeVecchio,
            vetroVecchio: ril.vetroVecchio || this.CONFIG.DEFAULTS.vetroVecchio,
            
            // Coprifili
            coprifiliInt: ril.coprifiliInt ?? false,
            coprifiliEst: ril.coprifiliEst ?? false,
            
            // Note
            note: ril.note || ''
        };
    },
    
    /**
     * Misure posizione
     */
    _exportMisure(mis) {
        mis = mis || {};
        return {
            LVT: mis.LVT ?? '',      // Larghezza vetro/telaio
            HVT: mis.HVT ?? '',      // Altezza vetro/telaio
            LF: mis.LF ?? '',        // Larghezza foro
            HF: mis.HF ?? '',        // Altezza foro
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
     * Importa un progetto da JSON
     */
    importProject(jsonData, options = {}) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        // Valida
        const validation = this.validateJSON(data);
        if (!validation.valid && !options.forceImport) {
            throw new Error(`JSON non valido: ${validation.errors.join(', ')}`);
        }
        
        return {
            // Identificativi
            id: data.id || this._generateId(),
            name: data.name || '',
            client: data.client || '',
            
            // Odoo (protetti)
            odoo_id: data.odoo_id || null,
            odoo_customer_id: data.odoo_customer_id || data.odoo_id || null,
            odoo_customer: data.odoo_customer || null,
            
            // Cliente
            clientData: data.clientData || {},
            
            // Immobile
            immobile: data.immobile || {},
            
            // Configurazioni
            linkSchizzo: data.linkSchizzo || '',
            prodotti: data.prodotti || {},
            caratteristicheMuro: data.caratteristicheMuro || {},
            
            configInfissi: data.configInfissi || {},
            configPersiane: data.configPersiane || {},
            configTapparelle: data.configTapparelle || {},
            configZanzariere: data.configZanzariere || {},
            configCassonetti: data.configCassonetti || {},
            
            rilievoGlobaleInfissi: data.rilievoGlobaleInfissi || {},
            rilievoPersiane: data.rilievoPersiane || {},
            rilievoTapparelle: data.rilievoTapparelle || {},
            
            brmConfigInfissi: data.brmConfigInfissi || {},
            brmConfigPersiane: data.brmConfigPersiane || {},
            brmConfigTapparelle: data.brmConfigTapparelle || {},
            brmConfigZanzariere: data.brmConfigZanzariere || {},
            
            // Posizioni
            positions: (data.positions || []).map(p => this._importPosition(p)),
            
            // Metadata
            metadata: {
                ...data.metadata,
                importedAt: new Date().toISOString(),
                importedFrom: options.source || 'unknown'
            }
        };
    },
    
    _importPosition(pos) {
        return {
            id: pos.id || this._generateId('pos'),
            name: pos.name || pos.nome || '',
            ambiente: pos.ambiente || '',
            piano: pos.piano || this.CONFIG.DEFAULTS.piano,
            quantita: pos.quantita || this.CONFIG.DEFAULTS.quantita,
            tipoposizione: pos.tipoposizione || null,
            tipoApertura: pos.tipoApertura || null,
            installazione: pos.installazione || this.CONFIG.DEFAULTS.installazione,
            
            misure: pos.misure || {},
            misureNonServe: pos.misureNonServe || {},
            overrideCaratteristiche: pos.overrideCaratteristiche || false,
            caratteristicheMuroOverride: pos.caratteristicheMuroOverride || null,
            rilievo: pos.rilievo || {},
            prodottiAssenti: pos.prodottiAssenti || [],
            
            infisso: pos.infisso || null,
            persiana: pos.persiana || null,
            tapparella: pos.tapparella || null,
            zanzariera: pos.zanzariera || null,
            cassonetto: pos.cassonetto || null,
            ingresso: pos.ingresso || null,
            portaInterna: pos.portaInterna || null,
            clickZip: pos.clickZip || null,
            tendaBracci: pos.tendaBracci || null,
            
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
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
        
        // Errori
        if (!data.id) errors.push('id mancante');
        
        // Warning
        if (!data.odoo_id) warnings.push('Non collegato a Odoo');
        if (!data.immobile?.zonaClimatica) warnings.push('Zona climatica mancante');
        if (!data.clientData?.codiceFiscale) warnings.push('Codice fiscale mancante');
        
        // Posizioni
        (data.positions || []).forEach((pos, i) => {
            const n = i + 1;
            if (!pos.ambiente) warnings.push(`Pos ${n}: ambiente mancante`);
            if (!pos.piano) warnings.push(`Pos ${n}: piano mancante`);
            if (!pos.installazione) warnings.push(`Pos ${n}: installazione mancante`);
            if (!pos.rilievo?.vetroVecchio) warnings.push(`Pos ${n}: vetro vecchio mancante (ENEA)`);
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
    // 8. FATTURA INFISSI WEB HELPERS
    // =========================================================================
    
    /**
     * Verifica dati pronti per Fattura Infissi Web
     */
    checkReadyForFatturaInfissi(project) {
        const missing = [];
        const cd = project.clientData || {};
        const imm = project.immobile || {};
        
        // Cliente
        if (!cd.codiceFiscale && !cd.partitaIva) missing.push('Codice Fiscale o P.IVA');
        if (!cd.cap) missing.push('CAP');
        if (!cd.comune) missing.push('Comune');
        
        // Immobile
        if (!imm.zonaClimatica) missing.push('Zona climatica');
        
        // Posizioni
        (project.positions || []).forEach((pos, i) => {
            const n = i + 1;
            if (!pos.piano) missing.push(`Pos ${n}: piano`);
            if (!pos.installazione) missing.push(`Pos ${n}: installazione`);
            if (!pos.rilievo?.vetroVecchio) missing.push(`Pos ${n}: vetro vecchio`);
            if (!pos.rilievo?.materialeVecchio) missing.push(`Pos ${n}: materiale vecchio`);
        });
        
        return {
            ready: missing.length === 0,
            missing
        };
    },
    
    /**
     * Determina materiale per ENEA (nuovo)
     */
    getMaterialeENEA(infisso) {
        if (!infisso) return '';
        const i = (infisso.finituraInt || '').toLowerCase();
        const e = (infisso.finituraEst || '').toLowerCase();
        if (i === e) return i || 'misto';
        return 'misto';
    },


    // =========================================================================
    // 9. UTILITY
    // =========================================================================
    
    _buildIndirizzo(cd) {
        const parts = [cd.via, cd.cap, cd.comune, cd.provincia].filter(Boolean);
        return parts.join(', ');
    },
    
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
    
    _exportCaratteristicheMuro(cm) {
        cm = cm || {};
        return {
            spessoreMuroInt: cm.spessoreMuroInt ?? '',
            spessoreMuroEst: cm.spessoreMuroEst ?? '',
            tipoMuro: cm.tipoMuro ?? '',
            isolamento: cm.isolamento ?? ''
        };
    },
    
    _calcolaTotali(project) {
        const pos = project.positions || [];
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


    // =========================================================================
    // 10. DOWNLOAD / UPLOAD
    // =========================================================================
    
    downloadJSON(project, options = {}) {
        const data = this.exportProject(project, options);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const filename = options.filename || `progetto-${data.id}.json`;
        
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
