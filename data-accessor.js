// ============================================================================
// DATA_ACCESSOR - Accesso Unificato ai Dati Progetto v1.0.0
// ============================================================================
// 
// 🎯 SCOPO: UN SOLO MODO per leggere i dati da JSON progetto
// 
// Usato da:
// - Dashboard: lista posizioni, dettaglio, preventivo, stampa
// - App Rilievo: visualizzazione, stampa preventivo
// 
// Risolve problemi di:
// - qta vs quantita
// - positions vs posizioni
// - infisso vs infissi
// - Strutture dati inconsistenti
//
// ============================================================================

const DATA_ACCESSOR = {
    version: '1.0.0',

    // ════════════════════════════════════════════════════════════════════════
    // POSIZIONI
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene array posizioni da progetto (normalizzato)
     * @param {Object} progetto - Oggetto progetto
     * @returns {Array} Array di posizioni
     */
    getPosizioni(progetto) {
        if (!progetto) return [];
        return progetto.posizioni || progetto.positions || [];
    },

    /**
     * Conta totale posizioni
     */
    countPosizioni(progetto) {
        return this.getPosizioni(progetto).length;
    },

    // ════════════════════════════════════════════════════════════════════════
    // QUANTITÀ (il problema principale!)
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene quantità da qualsiasi prodotto
     * Cerca in ordine: quantita, qta, default 1
     * @param {Object} prodotto - Oggetto prodotto (infisso, persiana, etc.)
     * @returns {number} Quantità (minimo 1)
     */
    getQuantita(prodotto) {
        if (!prodotto) return 0;
        const q = parseInt(prodotto.quantita) || parseInt(prodotto.qta) || 0;
        return q;
    },

    /**
     * Imposta quantità in modo uniforme (sempre come 'quantita')
     */
    setQuantita(prodotto, valore) {
        if (!prodotto) return;
        prodotto.quantita = parseInt(valore) || 0;
        // Mantieni anche qta per retrocompatibilità
        prodotto.qta = prodotto.quantita;
    },

    // ════════════════════════════════════════════════════════════════════════
    // INFISSO
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene infisso normalizzato da posizione
     * @param {Object} pos - Oggetto posizione
     * @param {Object} progetto - Progetto (per config globale)
     * @returns {Object} Infisso normalizzato con tutti i campi
     */
    getInfisso(pos, progetto = null) {
        if (!pos) return null;
        
        // Trova l'oggetto infisso
        const raw = pos.infisso || pos.infissi || pos.prodotti?.infisso || null;
        if (!raw) return null;

        // Config globale per fallback
        const configGlobale = progetto?.configInfissi || {};

        // Normalizza
        return {
            // Quantità (SEMPRE presente)
            quantita: this.getQuantita(raw),
            qta: this.getQuantita(raw),
            
            // Identificazione
            azienda: raw.azienda || configGlobale.azienda || 'Finstral',
            codiceModello: raw.codiceModello || raw.codice_modello || '',
            
            // Telaio e finiture
            telaio: raw.telaio || configGlobale.telaio || '',
            finituraInt: raw.finituraInt || raw.finitura_int || configGlobale.finituraInt || 'pvc',
            finituraEst: raw.finituraEst || raw.finitura_est || configGlobale.finituraEst || 'pvc',
            coloreInt: raw.coloreInt || raw.colore_int || configGlobale.coloreInt || '',
            coloreEst: raw.coloreEst || raw.colore_est || configGlobale.coloreEst || '',
            
            // Tipo anta e vetro
            tipoAnta: raw.tipoAnta || raw.tipo_anta || configGlobale.tipoAnta || '',
            vetro: raw.vetro || configGlobale.vetro || '',
            
            // Allarme e accessori
            allarme: raw.allarme || configGlobale.allarme || 'no',
            cerniere: raw.cerniere || configGlobale.cerniere || '',
            maniglia: raw.maniglia || configGlobale.maniglia || '',
            coloreManiglia: raw.coloreManiglia || raw.colore_maniglia || configGlobale.coloreManiglia || '',
            
            // Tagli telaio
            tagliTelaio: raw.tagliTelaio || raw.tagli_telaio || configGlobale.tagliTelaio || '',
            codTagliValues: raw.codTagliValues || raw.cod_tagli_values || configGlobale.codTagliValues || [],
            
            // Ferramenta
            ferramenta1: raw.ferramenta1 || '',
            lato1: raw.lato1 || '',
            esecuzione1: raw.esecuzione1 || '',
            ferramenta2: raw.ferramenta2 || '',
            lato2: raw.lato2 || '',
            esecuzione2: raw.esecuzione2 || '',
            
            // Dimensioni BRM
            BRM_L: parseInt(raw.BRM_L) || parseInt(raw.brm_l) || 0,
            BRM_H: parseInt(raw.BRM_H) || parseInt(raw.brm_h) || 0,
            
            // Bancale
            bancaleTipo: raw.bancaleTipo || raw.bancale_tipo || '',
            bancaleProfondita: parseInt(raw.bancaleProfondita) || 0,
            
            // Note
            note: raw.note || '',
            
            // Raw per accesso diretto se serve
            _raw: raw
        };
    },

    /**
     * Verifica se posizione ha infisso valido (con quantità > 0)
     */
    hasInfisso(pos) {
        const inf = this.getInfisso(pos);
        return inf && inf.quantita > 0;
    },

    // ════════════════════════════════════════════════════════════════════════
    // PERSIANA
    // ════════════════════════════════════════════════════════════════════════

    getPersiana(pos, progetto = null) {
        if (!pos) return null;
        
        const raw = pos.persiana || pos.persiane || pos.prodotti?.persiana || null;
        if (!raw) return null;

        const configGlobale = progetto?.configPersiane || {};

        return {
            quantita: this.getQuantita(raw),
            qta: this.getQuantita(raw),
            
            azienda: raw.azienda || configGlobale.azienda || '',
            modello: raw.modello || configGlobale.modello || '',
            tipo: raw.tipo || configGlobale.tipo || '',
            apertura: raw.apertura || configGlobale.apertura || '',
            fissaggio: raw.fissaggio || configGlobale.fissaggio || '',
            colorePersiana: raw.colorePersiana || raw.colore_persiana || configGlobale.colorePersiana || '',
            coloreTelaio: raw.coloreTelaio || raw.colore_telaio || configGlobale.coloreTelaio || '',
            battuta: raw.battuta || '',
            
            BRM_L: parseInt(raw.BRM_L) || parseInt(raw.brm_l) || 0,
            BRM_H: parseInt(raw.BRM_H) || parseInt(raw.brm_h) || 0,
            
            note: raw.note || '',
            _raw: raw
        };
    },

    hasPersiana(pos) {
        const pers = this.getPersiana(pos);
        return pers && pers.quantita > 0;
    },

    // ════════════════════════════════════════════════════════════════════════
    // TAPPARELLA
    // ════════════════════════════════════════════════════════════════════════

    getTapparella(pos, progetto = null) {
        if (!pos) return null;
        
        const raw = pos.tapparella || pos.tapparelle || pos.prodotti?.tapparella || null;
        if (!raw) return null;

        const configGlobale = progetto?.configTapparelle || {};

        return {
            quantita: this.getQuantita(raw),
            qta: this.getQuantita(raw),
            
            azienda: raw.azienda || configGlobale.azienda || '',
            modello: raw.modello || configGlobale.modello || '',
            colore: raw.colore || configGlobale.colore || '',
            guida: raw.guida || configGlobale.guida || '',
            coloreGuida: raw.coloreGuida || raw.colore_guida || configGlobale.coloreGuida || '',
            
            // Motore
            motoreModello: raw.motoreModello || raw.motore_modello || configGlobale.motoreModelloDefault || '',
            comando: raw.comando || configGlobale.comandoDefault || '',
            
            BRM_L: parseInt(raw.BRM_L) || parseInt(raw.brm_l) || 0,
            BRM_H: parseInt(raw.BRM_H) || parseInt(raw.brm_h) || 0,
            
            note: raw.note || '',
            _raw: raw
        };
    },

    hasTapparella(pos) {
        const tap = this.getTapparella(pos);
        return tap && tap.quantita > 0;
    },

    // ════════════════════════════════════════════════════════════════════════
    // ZANZARIERA
    // ════════════════════════════════════════════════════════════════════════

    getZanzariera(pos, progetto = null) {
        if (!pos) return null;
        
        const raw = pos.zanzariera || pos.zanzariere || pos.prodotti?.zanzariera || null;
        if (!raw) return null;

        const configGlobale = progetto?.configZanzariere || {};

        return {
            quantita: this.getQuantita(raw),
            qta: this.getQuantita(raw),
            
            azienda: raw.azienda || configGlobale.azienda || '',
            modello: raw.modello || configGlobale.modello || '',
            colore: raw.colore || configGlobale.colore || '',
            
            BRM_L: parseInt(raw.BRM_L) || parseInt(raw.brm_l) || 0,
            BRM_H: parseInt(raw.BRM_H) || parseInt(raw.brm_h) || 0,
            
            note: raw.note || '',
            _raw: raw
        };
    },

    hasZanzariera(pos) {
        const zanz = this.getZanzariera(pos);
        return zanz && zanz.quantita > 0;
    },

    // ════════════════════════════════════════════════════════════════════════
    // CASSONETTO
    // ════════════════════════════════════════════════════════════════════════

    getCassonetto(pos, progetto = null) {
        if (!pos) return null;
        
        const raw = pos.cassonetto || pos.cassonetti || pos.prodotti?.cassonetto || null;
        if (!raw) return null;

        const configGlobale = progetto?.configCassonetti || {};

        return {
            quantita: this.getQuantita(raw),
            qta: this.getQuantita(raw),
            
            materiale: raw.materiale || raw.materialeCass || configGlobale.materialeCass || '',
            codice: raw.codice || raw.codiceCass || configGlobale.codiceCass || '',
            gruppoColore: raw.gruppoColore || raw.gruppoColoreCass || configGlobale.gruppoColoreCass || '',
            colore: raw.colore || raw.coloreCass || configGlobale.coloreCass || '',
            
            BRM_L: parseInt(raw.BRM_L) || parseInt(raw.brm_l) || 0,
            
            note: raw.note || '',
            _raw: raw
        };
    },

    hasCassonetto(pos) {
        const cass = this.getCassonetto(pos);
        return cass && cass.quantita > 0;
    },

    // ════════════════════════════════════════════════════════════════════════
    // CONTEGGI TOTALI
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Conta totale prodotti per tipo in tutto il progetto
     * Somma le quantità, non solo le posizioni
     */
    countProdotti(progetto) {
        const posizioni = this.getPosizioni(progetto);
        
        let totali = {
            infissi: 0,
            persiane: 0,
            tapparelle: 0,
            zanzariere: 0,
            cassonetti: 0
        };

        posizioni.forEach(pos => {
            const inf = this.getInfisso(pos, progetto);
            const pers = this.getPersiana(pos, progetto);
            const tap = this.getTapparella(pos, progetto);
            const zanz = this.getZanzariera(pos, progetto);
            const cass = this.getCassonetto(pos, progetto);

            if (inf) totali.infissi += inf.quantita;
            if (pers) totali.persiane += pers.quantita;
            if (tap) totali.tapparelle += tap.quantita;
            if (zanz) totali.zanzariere += zanz.quantita;
            if (cass) totali.cassonetti += cass.quantita;
        });

        return totali;
    },

    // ════════════════════════════════════════════════════════════════════════
    // CLIENTE E PROGETTO
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene dati cliente normalizzati
     */
    getCliente(progetto) {
        if (!progetto) return {};
        
        // Priorità: cliente > odoo_customer > clientData > root
        const cliente = progetto.cliente || progetto.odoo_customer || progetto.clientData || {};
        
        return {
            nome: cliente.nome || cliente.name || progetto.nome_cliente || progetto.nomeCliente || '',
            cognome: cliente.cognome || '',
            telefono: cliente.telefono || cliente.phone || cliente.mobile || '',
            email: cliente.email || '',
            indirizzo: cliente.indirizzo || cliente.street || progetto.indirizzo || '',
            citta: cliente.citta || cliente.city || '',
            cap: cliente.cap || cliente.zip || '',
            codiceFiscale: cliente.codiceFiscale || cliente.codice_fiscale || cliente.vat || '',
            _raw: cliente
        };
    },

    /**
     * Ottiene nome progetto
     */
    getNomeProgetto(progetto) {
        if (!progetto) return '';
        return progetto.nome || progetto.name || progetto.nomeProgetto || 
               this.getCliente(progetto).nome || 'Progetto';
    },

    /**
     * Ottiene indirizzo progetto
     */
    getIndirizzo(progetto) {
        if (!progetto) return '';
        return progetto.indirizzo || progetto.address || 
               this.getCliente(progetto).indirizzo || '';
    },

    // ════════════════════════════════════════════════════════════════════════
    // DIMENSIONI E CALCOLI
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Calcola superficie in m² da BRM
     */
    getSuperficie(prodotto) {
        if (!prodotto) return 0;
        const l = parseInt(prodotto.BRM_L) || parseInt(prodotto.brm_l) || 0;
        const h = parseInt(prodotto.BRM_H) || parseInt(prodotto.brm_h) || 0;
        return (l * h) / 1000000; // mm² → m²
    },

    /**
     * Calcola perimetro in ml da BRM
     */
    getPerimetro(prodotto) {
        if (!prodotto) return 0;
        const l = parseInt(prodotto.BRM_L) || parseInt(prodotto.brm_l) || 0;
        const h = parseInt(prodotto.BRM_H) || parseInt(prodotto.brm_h) || 0;
        return (2 * l + 2 * h) / 1000; // mm → m
    },

    /**
     * Formatta dimensioni per visualizzazione
     */
    formatDimensioni(prodotto) {
        if (!prodotto) return 'N/D';
        const l = parseInt(prodotto.BRM_L) || parseInt(prodotto.brm_l) || 0;
        const h = parseInt(prodotto.BRM_H) || parseInt(prodotto.brm_h) || 0;
        if (l === 0 && h === 0) return 'N/D';
        return `${l} × ${h} mm`;
    },

    // ════════════════════════════════════════════════════════════════════════
    // HELPER PER STAMPA/VISUALIZZAZIONE
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Genera descrizione infisso per stampa
     */
    getDescrizioneInfisso(infisso) {
        if (!infisso) return '';
        
        const parts = [];
        if (infisso.azienda) parts.push(infisso.azienda);
        if (infisso.telaio) parts.push(`Telaio ${infisso.telaio}`);
        if (infisso.finituraInt && infisso.finituraEst) {
            parts.push(`${infisso.finituraInt.toUpperCase()}-${infisso.finituraEst.toUpperCase()}`);
        }
        if (infisso.tipoAnta) parts.push(infisso.tipoAnta);
        
        return parts.join(' | ');
    },

    /**
     * Genera stringa quantità per visualizzazione
     * Es: "× 6 pz" o "" se qta=1
     */
    formatQuantita(quantita, mostraSeSingolo = false) {
        const q = parseInt(quantita) || 1;
        if (q === 1 && !mostraSeSingolo) return '';
        return `× ${q} pz`;
    },

    /**
     * Genera label tipo infisso (F1, PF2, etc.)
     */
    getTipoInfissoLabel(codiceModello) {
        if (!codiceModello) return '';
        
        // Estrai il tipo base dal codice
        const codice = codiceModello.toString().split(' ')[0];
        
        // Determina F (finestra) o PF (porta-finestra) o altro
        if (codice.startsWith('1')) return 'F1';
        if (codice.startsWith('2')) return 'F2';
        if (codice.startsWith('3')) return 'F3';
        if (codice.startsWith('4')) return 'F4';
        if (codice.startsWith('FS')) return 'HST'; // Scorrevole
        
        // Per porte-finestre (codici alti o specifici)
        if (codice === '201' || codice === '202') return 'PF2';
        
        return 'F1'; // Default
    }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════════

// Per browser (globale)
if (typeof window !== 'undefined') {
    window.DATA_ACCESSOR = DATA_ACCESSOR;
    console.log(`📦 DATA_ACCESSOR v${DATA_ACCESSOR.version} - Caricato`);
}

// Per Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATA_ACCESSOR;
}
