// ═══════════════════════════════════════════════════════════════════════════
// 💰 SISTEMA SCONTI FORNITORI v2.0 (03 FEB 2026)
// Sconti applicati dai fornitori a Open Porte & Finestre
// Supporta override da localStorage per personalizzazione da UI
// ═══════════════════════════════════════════════════════════════════════════
const SCONTI_FORNITORI = {

    // Sconti di default (codice sorgente - non modificabili)
    _defaults: {
        'FINSTRAL':       36.76,  // 32% + 7% composto
        'PALAGINA':       50.00,
        'PUNTO PERSIANE': 55.00,
        'SOMFY':          40.00,
        'FERREROLEGNO':   50.00,
        'FLESSYA':        53.00,
        'OIKOS':          46.00,  // 40% + 10% composto
        'PLASTICINO':     45.00,
        'OLIVARI':        43.00,  // 40% + 5% composto
        'COLOMBO DESIGN': 40.00,
        'GIBUS':          48.00,
        'ERRECI':         45.00,
    },

    // Sconti attivi (defaults + override localStorage)
    sconti: {},

    // Alias per normalizzazione nomi
    alias: {
        'finstral': 'FINSTRAL',
        'palagina': 'PALAGINA',
        'punto persiane': 'PUNTO PERSIANE',
        'puntopersiane': 'PUNTO PERSIANE',
        'p. persiane': 'PUNTO PERSIANE',
        'p.persiane': 'PUNTO PERSIANE',
        'somfy': 'SOMFY',
        'ferrerolegno': 'FERREROLEGNO',
        'ferrero legno': 'FERREROLEGNO',
        'flessya': 'FLESSYA',
        'oikos': 'OIKOS',
        'plasticino': 'PLASTICINO',
        'olivari': 'OLIVARI',
        'colombo': 'COLOMBO DESIGN',
        'colombo design': 'COLOMBO DESIGN',
        'gibus': 'GIBUS',
        'click zip': 'GIBUS',
        'clickzip': 'GIBUS',
        'erreci': 'ERRECI',
    },

    // ═══════════════════════════════════════════════════════════════════
    // INIT - Carica defaults + override da localStorage
    // ═══════════════════════════════════════════════════════════════════
    init: function() {
        this.sconti = { ...this._defaults };
        try {
            const saved = localStorage.getItem('sconti_fornitori_override');
            if (saved) {
                const overrides = JSON.parse(saved);
                Object.assign(this.sconti, overrides);
                console.log('💰 Sconti: caricati override localStorage', overrides);
            }
        } catch(e) {
            console.warn('⚠️ Sconti: errore lettura localStorage', e);
        }
    },

    // Salva solo le differenze rispetto ai defaults
    _saveOverrides: function() {
        const overrides = {};
        for (const [k, v] of Object.entries(this.sconti)) {
            if (this._defaults[k] === undefined || this._defaults[k] !== v) {
                overrides[k] = v;
            }
        }
        if (Object.keys(overrides).length > 0) {
            localStorage.setItem('sconti_fornitori_override', JSON.stringify(overrides));
        } else {
            localStorage.removeItem('sconti_fornitori_override');
        }
    },

    // ═══════════════════════════════════════════════════════════════════
    // METODI GESTIONE SCONTI
    // ═══════════════════════════════════════════════════════════════════

    /** Imposta/aggiorna sconto per azienda */
    setSconto: function(azienda, percentuale) {
        const nome = this.normalizzaAzienda(azienda);
        this.sconti[nome] = parseFloat(percentuale) || 0;
        this._saveOverrides();
    },

    /** Rimuovi sconto custom (ripristina default o elimina) */
    removeSconto: function(azienda) {
        const nome = this.normalizzaAzienda(azienda);
        if (this._defaults[nome] !== undefined) {
            this.sconti[nome] = this._defaults[nome];
        } else {
            delete this.sconti[nome];
        }
        this._saveOverrides();
    },

    /** Ripristina tutti i defaults */
    resetAll: function() {
        this.sconti = { ...this._defaults };
        localStorage.removeItem('sconti_fornitori_override');
    },

    /** Ottieni lista completa per UI */
    getAll: function() {
        return Object.entries(this.sconti).map(([nome, sconto]) => ({
            nome,
            sconto,
            isDefault: this._defaults[nome] === sconto,
            hasDefault: this._defaults[nome] !== undefined,
            defaultValue: this._defaults[nome]
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    },

    // ═══════════════════════════════════════════════════════════════════
    // METODI CALCOLO (invariati)
    // ═══════════════════════════════════════════════════════════════════

    normalizzaAzienda: function(azienda) {
        if (!azienda) return 'ALTRO';
        const lower = azienda.toLowerCase().trim();
        return this.alias[lower] || azienda.toUpperCase();
    },

    getSconto: function(azienda) {
        const nome = this.normalizzaAzienda(azienda);
        return this.sconti[nome] || 0;
    },

    calcolaNetto: function(prezzoListino, azienda) {
        const sconto = this.getSconto(azienda);
        return prezzoListino * (1 - sconto / 100);
    },

    calcolaPrezzoCliente: function(prezzoListino, azienda, ricarico) {
        ricarico = ricarico || 0;
        const netto = this.calcolaNetto(prezzoListino, azienda);
        return netto * (1 + ricarico / 100);
    },

    calcolaDettaglio: function(prezzoListino, azienda, ricarico) {
        ricarico = ricarico || 0;
        const nome = this.normalizzaAzienda(azienda);
        const sconto = this.getSconto(azienda);
        const netto = this.calcolaNetto(prezzoListino, azienda);
        const cliente = this.calcolaPrezzoCliente(prezzoListino, azienda, ricarico);
        return {
            azienda: nome,
            listino: parseFloat(prezzoListino.toFixed(2)),
            sconto: sconto,
            netto: parseFloat(netto.toFixed(2)),
            ricarico: ricarico,
            cliente: parseFloat(cliente.toFixed(2)),
            margine: parseFloat((cliente - netto).toFixed(2))
        };
    }
};

// Init al caricamento
SCONTI_FORNITORI.init();
console.log(`✅ SCONTI_FORNITORI v2.0 - ${Object.keys(SCONTI_FORNITORI.sconti).length} fornitori attivi`);
