// ============================================================================
// JSON-MANAGER v1.1.0 - Gestione Unificata Export/Import JSON
// v1.1.0: Aggiunto supporto campi Odoo (odoo_id, odoo_customer) - PROTETTI
// ============================================================================
// 
// ⚠️ MODULO CENTRALIZZATO - Usato da App Rilievo + Dashboard
// 
// Funzionalità:
// - Export progetto in formato JSON standard
// - Import progetto da JSON con validazione
// - Normalizzazione dati bidirezionale
// - Validazione struttura e campi obbligatori
//
// Riferimento: SCHEMA-JSON-OPENPORTE.md
// ============================================================================

const JSON_MANAGER = {
    
    version: '1.1.0',
    schemaVersion: '5.78',
    
    // =========================================================================
    // COSTANTI E CONFIGURAZIONE
    // =========================================================================
    
    CAMPI_OBBLIGATORI: {
        progetto: ['id', 'name'],
        posizione: ['id', 'ambiente'],
        infisso: ['tipo', 'tipoInfissoAssociato'],
        persiana: ['azienda'],
        tapparella: ['azienda'],
        zanzariera: ['azienda', 'tipoInfissoAssociato'],
        cassonetto: ['azienda']
    },
    
    AZIENDE_DEFAULT: {
        infisso: 'finstral',
        persiana: 'P. Persiane',
        tapparella: 'Plasticino',
        zanzariera: 'Palagina',
        cassonetto: 'Finstral',
        blindata: 'Oikos',
        portaInterna: 'FERREROLEGNO',
        clickZip: 'GIBUS',
        tendaBracci: 'GIBUS',
        motore: 'Somfy'
    },
    
    // =========================================================================
    // EXPORT - Da struttura interna a JSON standard
    // =========================================================================
    
    /**
     * Esporta progetto in formato JSON standard
     * @param {Object} project - Progetto da esportare
     * @param {Object} options - Opzioni export
     * @returns {Object} JSON strutturato per export
     */
    exportProject(project, options = {}) {
        if (!project) {
            throw new Error('Progetto non valido');
        }
        
        const now = new Date().toISOString();
        const source = options.source || 'unknown';
        
        return {
            // Header
            _schema: {
                version: this.schemaVersion,
                exportedAt: now,
                exportedFrom: source,
                managerVersion: this.version
            },
            
            // Identificativi
            id: project.id,
            name: project.name || '',
            client: project.client || '',
            
            // === CAMPI ODOO (PROTETTI - mai sovrascrivere se esistenti) ===
            odoo_id: project.odoo_id || null,
            odoo_customer_id: project.odoo_customer_id || project.odoo_id || null,
            odoo_customer: project.odoo_customer || null,
            // === FINE CAMPI ODOO ===
            
            // Dati cliente
            clientData: this._normalizeClientData(project.clientData),
            
            // Link schizzo
            linkSchizzo: project.linkSchizzo || '',
            
            // Prodotti abilitati
            prodotti: this._normalizeProdotti(project.prodotti),
            
            // Caratteristiche muro globali
            caratteristicheMuro: this._normalizeCaratteristicheMuro(project.caratteristicheMuro),
            
            // Configurazioni globali prodotti
            configInfissi: this._normalizeConfigInfissi(project.configInfissi),
            configPersiane: this._normalizeConfigPersiane(project.configPersiane),
            configTapparelle: this._normalizeConfigTapparelle(project.configTapparelle),
            configZanzariere: this._normalizeConfigZanzariere(project.configZanzariere),
            configCassonetti: this._normalizeConfigCassonetti(project.configCassonetti),
            
            // Rilievi globali
            rilievoGlobaleInfissi: project.rilievoGlobaleInfissi || {},
            rilievoPersiane: project.rilievoPersiane || {},
            rilievoTapparelle: project.rilievoTapparelle || {},
            
            // BRM Config
            brmConfigInfissi: project.brmConfigInfissi || {},
            brmConfigPersiane: project.brmConfigPersiane || {},
            brmConfigTapparelle: project.brmConfigTapparelle || {},
            brmConfigZanzariere: project.brmConfigZanzariere || {},
            
            // Posizioni
            positions: (project.positions || []).map(pos => this._exportPosition(pos)),
            
            // Totali
            totali: this._calcolaTotali(project),
            
            // Metadata
            metadata: this._generateMetadata(project, source)
        };
    },
    
    /**
     * Esporta singola posizione
     */
    _exportPosition(pos) {
        const posData = {
            id: pos.id,
            name: pos.name || pos.nome || '',
            ambiente: pos.ambiente || '',
            piano: pos.piano || '',
            quantita: pos.quantita || '1',
            tipoApertura: pos.tipoApertura || null, // 🆕 v5.78: F/PF obbligatorio
            
            // Misure
            misure: this._normalizeMisure(pos.misure),
            misureNonServe: pos.misureNonServe || {},
            
            // Override caratteristiche muro
            overrideCaratteristiche: pos.overrideCaratteristiche || false,
            caratteristicheMuroOverride: pos.caratteristicheMuroOverride || null,
            
            // Rilievo preesistente
            rilievo: this._normalizeRilievo(pos.rilievo),
            
            // Prodotti assenti
            prodottiAssenti: pos.prodottiAssenti || [],
            
            // Note e foto
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
        };
        
        // Aggiungi prodotti se presenti
        if (pos.infisso) posData.infisso = this._exportInfisso(pos.infisso);
        if (pos.persiana) posData.persiana = this._exportPersiana(pos.persiana);
        if (pos.tapparella) posData.tapparella = this._exportTapparella(pos.tapparella);
        if (pos.zanzariera) posData.zanzariera = this._exportZanzariera(pos.zanzariera);
        if (pos.cassonetto) posData.cassonetto = this._exportCassonetto(pos.cassonetto);
        if (pos.ingresso) posData.ingresso = this._exportIngresso(pos.ingresso);
        if (pos.portaInterna) posData.portaInterna = this._exportPortaInterna(pos.portaInterna);
        if (pos.clickZip) posData.clickZip = this._exportClickZip(pos.clickZip);
        if (pos.tendaBracci) posData.tendaBracci = this._exportTendaBracci(pos.tendaBracci);
        
        return posData;
    },
    
    /**
     * Export Infisso
     */
    _exportInfisso(inf) {
        return {
            qta: inf.qta || inf.quantita || '1',
            quantita: inf.qta || inf.quantita || '1', // Duplicato per compatibilità
            
            azienda: inf.azienda || this.AZIENDE_DEFAULT.infisso,
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
            allarme: inf.allarme || '',
            cerniere: inf.cerniere || '',
            maniglia: inf.maniglia || '',
            coloreManiglia: inf.coloreManiglia || '',
            tagliTelaio: inf.tagliTelaio || '',
            codTagliValues: inf.codTagliValues || [],
            
            // Ferramenta (fino a 3 campi)
            ferramenta1: inf.ferramenta1 || '',
            lato1: inf.lato1 || '',
            esecuzione1: inf.esecuzione1 || '',
            ferramenta2: inf.ferramenta2 || '',
            lato2: inf.lato2 || '',
            esecuzione2: inf.esecuzione2 || '',
            ferramenta3: inf.ferramenta3 || '',
            lato3: inf.lato3 || '',
            esecuzione3: inf.esecuzione3 || '',
            
            // Bancale
            bancaleTipo: inf.bancaleTipo || '',
            bancaleBordo: inf.bancaleBordo || '0',
            bancaleProfondita: inf.bancaleProfondita || '',
            
            // Anta Twin
            antaTwinTipo: inf.antaTwinTipo || '',
            antaTwinModello: inf.antaTwinModello || '',
            antaTwinColore: inf.antaTwinColore || '',
            antaTwinComando: inf.antaTwinComando || '27',
            
            // FIN-Slide HST
            finslideTelaio: inf.finslideTelaio || '',
            finslideAnta: inf.finslideAnta || '',
            finslideFerramenta: inf.finslideFerramenta || '',
            finslideManiglia: inf.finslideManiglia || '',
            finslideColoreManiglia: inf.finslideColoreManiglia || '',
            finslideVetro: inf.finslideVetro || '',
            
            // BRM
            BRM_L: inf.BRM_L ?? null,
            BRM_H: inf.BRM_H ?? null,
            
            // Extra
            note: inf.note || '',
            foto: inf.foto || [],
            manuallyEdited: inf.manuallyEdited || false
        };
    },
    
    /**
     * Export Persiana
     */
    _exportPersiana(per) {
        return {
            qta: per.qta || per.quantita || '1',
            quantita: per.qta || per.quantita || '1',
            
            azienda: per.azienda || this.AZIENDE_DEFAULT.persiana,
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
            
            // BRM
            BRM_L: per.BRM_L ?? null,
            BRM_H: per.BRM_H ?? null,
            
            // Accessori
            accessoriPersiana: per.accessoriPersiana || {},
            
            // Extra
            note: per.note || '',
            foto: per.foto || []
        };
    },
    
    /**
     * Export Tapparella
     */
    _exportTapparella(tap) {
        return {
            qta: tap.qta || tap.quantita || '1',
            quantita: tap.qta || tap.quantita || '1',
            
            serveTapparella: tap.serveTapparella ?? true,
            serveMotore: tap.serveMotore ?? false,
            serveAccessori: tap.serveAccessori ?? false,
            tapparellaEsistente: tap.tapparellaEsistente || 'manuale',
            
            azienda: tap.azienda || this.AZIENDE_DEFAULT.tapparella,
            modello: tap.modello || '',
            tipo: tap.tipo || '',
            colore: tap.colore || '',
            guida: tap.guida || '',
            coloreGuida: tap.coloreGuida || '',
            
            // Motore
            motoreAzienda: tap.motoreAzienda || this.AZIENDE_DEFAULT.motore,
            motoreModello: tap.motoreModello || '',
            motori: tap.motori || [],
            
            // Accessori da sostituire
            accessoriDaSostituire: tap.accessoriDaSostituire || {},
            
            // BRM
            BRM_L: tap.BRM_L ?? null,
            BRM_H: tap.BRM_H ?? null,
            
            // Extra
            note: tap.note || '',
            foto: tap.foto || []
        };
    },
    
    /**
     * Export Zanzariera
     */
    _exportZanzariera(zan) {
        return {
            qta: zan.qta || zan.quantita || '1',
            quantita: zan.qta || zan.quantita || '1',
            
            azienda: zan.azienda || this.AZIENDE_DEFAULT.zanzariera,
            tipoInfissoAssociato: zan.tipoInfissoAssociato || 'F',
            linea: zan.linea || '',
            modello: zan.modello || '',
            fasciaColore: zan.fasciaColore || '',
            coloreTelaio: zan.coloreTelaio || '',
            tipoRete: zan.tipoRete || '',
            colorePlastica: zan.colorePlastica || '',
            
            // BRM
            BRM_L: zan.BRM_L ?? null,
            BRM_H: zan.BRM_H ?? null,
            
            // Extra
            note: zan.note || '',
            foto: zan.foto || []
        };
    },
    
    /**
     * Export Cassonetto
     */
    _exportCassonetto(cas) {
        return {
            qta: cas.qta || cas.quantita || '1',
            quantita: cas.qta || cas.quantita || '1',
            
            azienda: cas.azienda || this.AZIENDE_DEFAULT.cassonetto,
            tipo: cas.tipo || '',
            materialeCass: cas.materialeCass || '',
            codiceCass: cas.codiceCass || '',
            gruppoColoreCass: cas.gruppoColoreCass || '',
            coloreCass: cas.coloreCass || '',
            codiceIsolamento: cas.codiceIsolamento || '',
            sovrappiSostit: cas.sovrappiSostit || '',
            aSoffitto: cas.aSoffitto || false,
            isolamentoPosaclima: cas.isolamentoPosaclima || false,
            
            // Misure cassonetto
            LS: cas.LS ?? 0,
            SRSX: cas.SRSX ?? 0,
            SRDX: cas.SRDX ?? 0,
            ZSX: cas.ZSX ?? 0,
            ZDX: cas.ZDX ?? 0,
            HCASS: cas.HCASS ?? 0,
            B: cas.B ?? 0,
            C: cas.C ?? 0,
            BSuperiore: cas.BSuperiore ?? 0,
            
            // BRM
            BRM_L: cas.BRM_L ?? null,
            BRM_H: cas.BRM_H ?? null,
            
            // Extra
            note: cas.note || ''
        };
    },
    
    /**
     * Export Ingresso (Portoncino o Blindata)
     */
    _exportIngresso(ing) {
        const data = {
            tipo: ing.tipo || null // 'portoncino' o 'blindata'
        };
        
        if (ing.portoncino) {
            data.portoncino = { ...ing.portoncino };
        }
        
        if (ing.blindata) {
            data.blindata = { ...ing.blindata };
        }
        
        return data;
    },
    
    /**
     * Export Porta Interna
     */
    _exportPortaInterna(pi) {
        return {
            qta: pi.qta || pi.quantita || '1',
            quantita: pi.qta || pi.quantita || '1',
            azienda: pi.azienda || this.AZIENDE_DEFAULT.portaInterna,
            ...pi
        };
    },
    
    /**
     * Export ClickZip
     */
    _exportClickZip(cz) {
        return {
            qta: cz.qta || cz.quantita || '1',
            quantita: cz.qta || cz.quantita || '1',
            azienda: cz.azienda || this.AZIENDE_DEFAULT.clickZip,
            ...cz
        };
    },
    
    /**
     * Export Tenda Bracci
     */
    _exportTendaBracci(tb) {
        return {
            qta: tb.qta || tb.quantita || '1',
            quantita: tb.qta || tb.quantita || '1',
            azienda: tb.azienda || this.AZIENDE_DEFAULT.tendaBracci,
            ...tb
        };
    },
    
    // =========================================================================
    // IMPORT - Da JSON a struttura interna
    // =========================================================================
    
    /**
     * Importa progetto da JSON
     * @param {Object|string} jsonData - JSON da importare (oggetto o stringa)
     * @param {Object} options - Opzioni import
     * @returns {Object} Progetto normalizzato
     */
    importProject(jsonData, options = {}) {
        // Parse se stringa
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        // Validazione base
        const validation = this.validateJSON(data);
        if (!validation.valid && !options.forceImport) {
            throw new Error(`JSON non valido: ${validation.errors.join(', ')}`);
        }
        
        // Normalizza in struttura interna
        return {
            id: data.id || this._generateId(),
            name: data.name || '',
            client: data.client || '',
            
            // === CAMPI ODOO (PROTETTI - mai sovrascrivere se esistenti) ===
            odoo_id: data.odoo_id || null,
            odoo_customer_id: data.odoo_customer_id || data.odoo_id || null,
            odoo_customer: data.odoo_customer || null,
            // === FINE CAMPI ODOO ===
            
            clientData: data.clientData || {},
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
            
            positions: (data.positions || []).map(pos => this._importPosition(pos)),
            
            metadata: {
                ...data.metadata,
                importedAt: new Date().toISOString(),
                importedFrom: options.source || 'unknown'
            }
        };
    },
    
    /**
     * Importa singola posizione
     */
    _importPosition(pos) {
        const position = {
            id: pos.id || this._generateId('pos'),
            name: pos.name || pos.nome || '',
            ambiente: pos.ambiente || '',
            piano: pos.piano || '',
            quantita: pos.quantita || '1',
            tipoApertura: pos.tipoApertura || null,
            
            misure: pos.misure || {},
            misureNonServe: pos.misureNonServe || {},
            
            overrideCaratteristiche: pos.overrideCaratteristiche || false,
            caratteristicheMuroOverride: pos.caratteristicheMuroOverride || null,
            
            rilievo: pos.rilievo || {},
            prodottiAssenti: pos.prodottiAssenti || [],
            
            note: pos.note || '',
            foto: pos.foto || [],
            drawings: pos.drawings || []
        };
        
        // Importa prodotti normalizzando qta/quantita
        if (pos.infisso) position.infisso = this._normalizeQuantita(pos.infisso);
        if (pos.persiana) position.persiana = this._normalizeQuantita(pos.persiana);
        if (pos.tapparella) position.tapparella = this._normalizeQuantita(pos.tapparella);
        if (pos.zanzariera) position.zanzariera = this._normalizeQuantita(pos.zanzariera);
        if (pos.cassonetto) position.cassonetto = this._normalizeQuantita(pos.cassonetto);
        if (pos.ingresso) position.ingresso = pos.ingresso;
        if (pos.portaInterna) position.portaInterna = this._normalizeQuantita(pos.portaInterna);
        if (pos.clickZip) position.clickZip = this._normalizeQuantita(pos.clickZip);
        if (pos.tendaBracci) position.tendaBracci = this._normalizeQuantita(pos.tendaBracci);
        
        return position;
    },
    
    /**
     * Normalizza quantità (qta/quantita)
     */
    _normalizeQuantita(prodotto) {
        if (!prodotto) return prodotto;
        const qta = prodotto.qta || prodotto.quantita || '1';
        return {
            ...prodotto,
            qta: qta,
            quantita: qta
        };
    },
    
    // =========================================================================
    // VALIDAZIONE
    // =========================================================================
    
    /**
     * Valida struttura JSON
     * @param {Object} data - JSON da validare
     * @returns {Object} { valid: boolean, errors: [], warnings: [] }
     */
    validateJSON(data) {
        const errors = [];
        const warnings = [];
        
        // Controlli base
        if (!data) {
            errors.push('JSON vuoto');
            return { valid: false, errors, warnings };
        }
        
        if (!data.id) {
            errors.push('Campo "id" mancante');
        }
        
        // Warning per campi Odoo mancanti
        if (!data.odoo_id && !data.odoo_customer_id) {
            warnings.push('Progetto non collegato a Odoo (odoo_id mancante)');
        }
        
        // Controlla posizioni
        if (data.positions && Array.isArray(data.positions)) {
            data.positions.forEach((pos, idx) => {
                if (!pos.id) {
                    warnings.push(`Posizione ${idx + 1}: id mancante`);
                }
                if (!pos.ambiente) {
                    warnings.push(`Posizione ${idx + 1}: ambiente mancante`);
                }
                if (!pos.tipoApertura) {
                    warnings.push(`Posizione ${idx + 1}: tipoApertura (F/PF) mancante`);
                }
                
                // Controlla infisso
                if (pos.infisso) {
                    if (!pos.infisso.tipo && !pos.infisso.codiceModello) {
                        warnings.push(`Posizione ${idx + 1} - Infisso: tipo o codiceModello mancante`);
                    }
                }
            });
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    // =========================================================================
    // HELPER - Normalizzazione campi
    // =========================================================================
    
    _normalizeClientData(cd) {
        return {
            nome: cd?.nome || '',
            cognome: cd?.cognome || '',
            telefono: cd?.telefono || '',
            email: cd?.email || '',
            indirizzo: cd?.indirizzo || '',
            citta: cd?.citta || '',
            cap: cd?.cap || '',
            piano: cd?.piano || '',
            note: cd?.note || ''
        };
    },
    
    _normalizeProdotti(prod) {
        return {
            infissi: prod?.infissi ?? false,
            persiane: prod?.persiane ?? false,
            tapparelle: prod?.tapparelle ?? false,
            zanzariere: prod?.zanzariere ?? false,
            cassonetti: prod?.cassonetti ?? false,
            blindate: prod?.blindate ?? false,
            portoncini: prod?.portoncini ?? false,
            porteInterne: prod?.porteInterne ?? false,
            clickZip: prod?.clickZip ?? false,
            tendeBracci: prod?.tendeBracci ?? false
        };
    },
    
    _normalizeCaratteristicheMuro(cm) {
        return {
            profMuroInt: cm?.profMuroInt || '',
            profMuroEst: cm?.profMuroEst || '',
            profPianaSopra: cm?.profPianaSopra || '',
            profPianaSotto: cm?.profPianaSotto || '',
            telaioProfondita: cm?.telaioProfondita || '',
            telaioLarghezza: cm?.telaioLarghezza || '',
            telaioAltezza: cm?.telaioAltezza || '',
            falsoEsistente: cm?.falsoEsistente || 'no',
            spessoreFalso: cm?.spessoreFalso || '',
            distanzaFalsoInfisso: cm?.distanzaFalsoInfisso || '',
            distanzaMuroInfisso: cm?.distanzaMuroInfisso || '',
            guidaEsistente: cm?.guidaEsistente || '',
            guidaTipo: cm?.guidaTipo || '',
            profGuida: cm?.profGuida || '',
            larghezzaGuida: cm?.larghezzaGuida || '',
            guidaProfondita: cm?.guidaProfondita || '',
            guidaAltezza: cm?.guidaAltezza || '',
            coprifiloLarghezza: cm?.coprifiloLarghezza || '',
            battutaSuperioreTapparella: cm?.battutaSuperioreTapparella || ''
        };
    },
    
    _normalizeConfigInfissi(cfg) {
        return {
            azienda: cfg?.azienda || 'finstral',
            telaio: cfg?.telaio || '',
            finituraInt: cfg?.finituraInt || '',
            finituraEst: cfg?.finituraEst || '',
            coloreInt: cfg?.coloreInt || '',
            coloreEst: cfg?.coloreEst || '',
            tipoAnta: cfg?.tipoAnta || '',
            vetro: cfg?.vetro || '',
            allarme: cfg?.allarme || '',
            cerniere: cfg?.cerniere || '',
            maniglia: cfg?.maniglia || '',
            coloreManiglia: cfg?.coloreManiglia || '',
            tagliTelaio: cfg?.tagliTelaio || '',
            codTagliValues: cfg?.codTagliValues || [],
            bancaleTipo: cfg?.bancaleTipo || '',
            bancaleBordo: cfg?.bancaleBordo || '0',
            bancaleProfondita: cfg?.bancaleProfondita || '',
            antaTwinTipo: cfg?.antaTwinTipo || '',
            antaTwinModello: cfg?.antaTwinModello || '',
            antaTwinColore: cfg?.antaTwinColore || '',
            antaTwinComando: cfg?.antaTwinComando || '27'
        };
    },
    
    _normalizeConfigPersiane(cfg) {
        return {
            azienda: cfg?.azienda || '',
            modello: cfg?.modello || '',
            fissaggio: cfg?.fissaggio || '',
            colorePersiana: cfg?.colorePersiana || '',
            coloreTelaio: cfg?.coloreTelaio || '',
            battuta: cfg?.battuta || '',
            tipoStecca: cfg?.tipoStecca || '',
            asolato: cfg?.asolato || '',
            tipo: cfg?.tipo || '',
            apertura: cfg?.apertura || ''
        };
    },
    
    _normalizeConfigTapparelle(cfg) {
        return {
            serveTapparella: cfg?.serveTapparella ?? true,
            serveMotore: cfg?.serveMotore ?? false,
            serveAccessori: cfg?.serveAccessori ?? false,
            azienda: cfg?.azienda || 'Plasticino',
            modello: cfg?.modello || '',
            tipo: cfg?.tipo || '',
            colore: cfg?.colore || '',
            guida: cfg?.guida || '',
            coloreGuida: cfg?.coloreGuida || '',
            accessoriDaSostituire: cfg?.accessoriDaSostituire || {},
            motoreAzienda: cfg?.motoreAzienda || 'Somfy',
            motoreModelloDefault: cfg?.motoreModelloDefault || '',
            comandoDefault: cfg?.comandoDefault || '',
            accessoriMotoreDefault: cfg?.accessoriMotoreDefault || {}
        };
    },
    
    _normalizeConfigZanzariere(cfg) {
        return {
            azienda: cfg?.azienda || 'Palagina',
            modelloF: cfg?.modelloF || '',
            modelloPF: cfg?.modelloPF || '',
            colore: cfg?.colore || ''
        };
    },
    
    _normalizeConfigCassonetti(cfg) {
        return {
            tipo: cfg?.tipo || '',
            azienda: cfg?.azienda || 'Finstral',
            materiale: cfg?.materiale || '',
            finitura: cfg?.finitura || '',
            coibentazione: cfg?.coibentazione || '',
            aSoffitto: cfg?.aSoffitto || '',
            materialeCass: cfg?.materialeCass || '',
            codiceCass: cfg?.codiceCass || '',
            gruppoColoreCass: cfg?.gruppoColoreCass || '',
            coloreCass: cfg?.coloreCass || '',
            coloreDaInfisso: cfg?.coloreDaInfisso ?? true,
            codiceIsolamento: cfg?.codiceIsolamento || ''
        };
    },
    
    _normalizeMisure(mis) {
        return {
            LVT: mis?.LVT ?? '',
            HVT: mis?.HVT ?? '',
            LF: mis?.LF ?? '',
            HF: mis?.HF ?? '',
            TMV: mis?.TMV ?? '',
            HMT: mis?.HMT ?? '',
            L4: mis?.L4 ?? '',
            H4: mis?.H4 ?? '',
            DeltaINT: mis?.DeltaINT ?? '',
            DeltaEST: mis?.DeltaEST ?? '',
            HSoffitto: mis?.HSoffitto ?? '',
            HParapettoSoffitto: mis?.HParapettoSoffitto ?? '',
            HPavimentoParapetto: mis?.HPavimentoParapetto ?? ''
        };
    },
    
    _normalizeRilievo(ril) {
        return {
            togliere: ril?.togliere ?? false,
            smaltimento: ril?.smaltimento ?? false,
            materiale: ril?.materiale || '',
            coprifiliInt: ril?.coprifiliInt ?? false,
            coprifiliEst: ril?.coprifiliEst ?? false,
            note: ril?.note || ''
        };
    },
    
    _calcolaTotali(project) {
        const positions = project.positions || [];
        return {
            n_posizioni: positions.length,
            n_infissi: positions.filter(p => p.infisso).length,
            n_persiane: positions.filter(p => p.persiana).length,
            n_tapparelle: positions.filter(p => p.tapparella).length,
            n_zanzariere: positions.filter(p => p.zanzariera).length,
            n_cassonetti: positions.filter(p => p.cassonetto).length,
            n_blindate: positions.filter(p => p.ingresso?.tipo === 'blindata').length,
            n_portoncini: positions.filter(p => p.ingresso?.tipo === 'portoncino').length,
            n_porteInterne: positions.filter(p => p.portaInterna).length,
            n_clickZip: positions.filter(p => p.clickZip).length,
            n_tendeBracci: positions.filter(p => p.tendaBracci).length
        };
    },
    
    _generateMetadata(project, source) {
        const now = new Date().toISOString();
        const existing = project.metadata || {};
        
        return {
            version: (existing.version || 0) + 1,
            created: existing.created || now,
            updated: now,
            device: existing.device || { id: 'unknown', name: 'Unknown Device' },
            syncStatus: 'exported',
            schemaVersion: this.schemaVersion,
            changes: [
                ...(existing.changes || []),
                {
                    version: (existing.version || 0) + 1,
                    timestamp: now,
                    action: `exported_from_${source}`,
                    details: `Esportato da ${source}`
                }
            ]
        };
    },
    
    _generateId(prefix = 'prj') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // =========================================================================
    // ODOO INTEGRATION HELPERS
    // =========================================================================
    
    /**
     * Lista dei campi Odoo protetti che non devono mai essere sovrascritti
     */
    ODOO_PROTECTED_FIELDS: ['odoo_id', 'odoo_customer_id', 'odoo_customer'],
    
    /**
     * Merge progetto preservando SEMPRE i campi Odoo esistenti
     * Usa questa funzione quando aggiorni un progetto per non perdere il link a Odoo
     * 
     * @param {Object} existingProject - Progetto esistente (con odoo_id)
     * @param {Object} newData - Nuovi dati da applicare
     * @returns {Object} Progetto merged con campi Odoo preservati
     */
    mergePreservingOdoo(existingProject, newData) {
        // Estrai campi Odoo dal progetto esistente
        const odooFields = {};
        this.ODOO_PROTECTED_FIELDS.forEach(field => {
            if (existingProject && existingProject[field]) {
                odooFields[field] = existingProject[field];
            }
        });
        
        // Merge: newData vince, ma campi Odoo vengono preservati
        return {
            ...newData,
            ...odooFields  // Odoo fields sempre in cima (prevalgono)
        };
    },
    
    /**
     * Imposta dati Odoo su un progetto
     * @param {Object} project - Progetto
     * @param {number} odooId - ID cliente Odoo
     * @param {Object} odooCustomer - Dati cliente Odoo opzionali
     * @returns {Object} Progetto con dati Odoo
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
     * Verifica se un progetto è collegato a Odoo
     * @param {Object} project - Progetto
     * @returns {boolean}
     */
    hasOdooLink(project) {
        return !!(project && (project.odoo_id || project.odoo_customer_id));
    },
    
    /**
     * Estrae l'ID Odoo da un progetto
     * @param {Object} project - Progetto
     * @returns {number|null}
     */
    getOdooId(project) {
        if (!project) return null;
        return project.odoo_id || project.odoo_customer_id || null;
    },
    
    // =========================================================================
    // UTILITÀ DOWNLOAD/UPLOAD
    // =========================================================================
    
    /**
     * Scarica JSON come file
     * @param {Object} project - Progetto da esportare
     * @param {Object} options - Opzioni { source, filename }
     */
    downloadJSON(project, options = {}) {
        const data = this.exportProject(project, options);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const filename = options.filename || 
            `PROGETTO-${project.client || 'Cliente'}-${project.name || 'Progetto'}-${new Date().toISOString().split('T')[0]}.json`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true, filename };
    },
    
    /**
     * Carica JSON da file input
     * @param {File} file - File da caricare
     * @param {Object} options - Opzioni import
     * @returns {Promise<Object>} Progetto importato
     */
    async uploadJSON(file, options = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    const project = this.importProject(jsonData, options);
                    resolve(project);
                } catch (error) {
                    reject(new Error(`Errore parsing JSON: ${error.message}`));
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
