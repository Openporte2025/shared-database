/**
 * PALAGINA - Database Zanzariere 2025
 * 
 * Fonte: Catalogo Zanzariere_2025_IT_128_Web-cm.pdf
 * Data: 05 Dicembre 2025
 * Versione: 1.0
 * 
 * Struttura per integrazione Dashboard OpenPorte
 */

const PALAGINA_ZANZARIERE_2025 = {
    
    // ============================================================
    // METADATA
    // ============================================================
    metadata: {
        fornitore: 'Palagina',
        listino: 'Zanzariere 2025',
        dataListino: '2025-01-01',
        dataEstrazione: '2025-12-05',
        valuta: 'EUR',
        consegnaSettimane: 4,
        note: 'Prezzi netti installatore'
    },

    // ============================================================
    // LINEE PRODOTTO
    // ============================================================
    linee: {
        'SINTESI': {
            nome: 'Linea SINTESI',
            tipo: 'Avvolgibile verticale',
            descrizione: 'Zanzariere avvolgibili tradizionali'
        },
        'SV': {
            nome: 'Linea SV',
            tipo: 'Avvolgibile verticale',
            descrizione: 'NEW 2025 - Economica con rete HC di serie'
        },
        'EVO': {
            nome: 'Linea EVO',
            tipo: 'Speciali',
            descrizione: 'NEW 2025 - Per lucernari e applicazioni speciali'
        },
        'COMPATTO': {
            nome: 'Serie X - COMPATTO',
            tipo: 'Avvolgibile compatta',
            descrizione: 'Ingombro ridotto'
        }
    },

    // ============================================================
    // MODELLI CON PREZZI
    // ============================================================
    modelli: {
        // ----- LINEA SINTESI -----
        'EXTREMA': {
            linea: 'SINTESI',
            cassonetti: null,
            maxH: 230,
            prezzi: { F1: 164.00, F2: 172.20, F3: 196.80 },
            minMq: 2.00
        },
        'EXTREMA_CENTRALE': {
            linea: 'SINTESI',
            cassonetti: null,
            maxH: 230,
            prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 },
            minMq: 2.00
        },
        'EXTREMA_SR': {
            linea: 'SINTESI',
            cassonetti: null,
            maxH: 460,
            prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 },
            minMq: 4.00
        },
        'EXTREMA_INCASSO': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 230,
            prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 },
            minMq: 2.00
        },
        'EXTREMA_INCASSO_CENTRALE': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 460,
            prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 },
            minMq: 4.00
        },
        'EXTREMA_INCASSO_SR': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 460,
            prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 },
            minMq: 4.00
        },
        'NANO_SINTESI': {
            linea: 'SINTESI',
            cassonetti: [22],
            maxH: 180,
            prezzi: { F1: 148.00, F2: 155.40, F3: 177.60 },
            minMq: 2.00
        },
        'MICRO_SINTESI': {
            linea: 'SINTESI',
            cassonetti: [36],
            maxH: 200,
            prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 },
            minMq: 4.00
        },
        'MICRO_SINTESI_CENTRALE': {
            linea: 'SINTESI',
            cassonetti: [36],
            maxH: 200,
            prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 },
            minMq: 4.00
        },
        'SINTESI': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 210,
            prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 },
            minMq: 2.00
        },
        'SINTESI_CENTRALE': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 210,
            prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 },
            minMq: 2.00
        },
        'SINTESI_INCASSO': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 210,
            prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 },
            minMq: 2.00
        },
        'SINTESI_INCASSO_CENTRALE': {
            linea: 'SINTESI',
            cassonetti: [46, 50],
            maxH: 420,
            prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 },
            minMq: 4.00
        },

        // ----- LINEA SV (NEW 2025) -----
        'SV_700': {
            linea: 'SV',
            cassonetti: [45, 50],
            maxH: 250,
            prezzi: { F1: 84.00, F2: 92.40, F3: 109.20 },
            minMq: 1.50,
            reteDiSerie: 'HC'
        },

        // ----- LINEA EVO (NEW 2025) -----
        'EVO_ROOF': {
            linea: 'EVO',
            cassonetti: [40],
            maxH: 150,
            prezzi: { F1: 126.00, F2: null, F3: 176.40 }, // No F2!
            minMq: 1.50,
            tipo: 'Lucernario'
        },

        // ----- SERIE X - COMPATTO -----
        'X1_INCASSO': {
            linea: 'COMPATTO',
            cassonetti: [50],
            maxH: 200,
            prezzi: { F1: 113.50, F2: 124.85, F3: 141.88 },
            minMq: 1.50
        },
        'X3_LUCE': {
            linea: 'COMPATTO',
            cassonetti: [53],
            maxH: 200,
            prezzi: { F1: 144.50, F2: 158.95, F3: 180.63 },
            minMq: 1.50
        }
    },

    // ============================================================
    // COLORI PER FASCIA
    // ============================================================
    colori: {
        F1: [
            { cod: '1', nome: 'Argento OX', ral: null },
            { cod: '5', nome: 'Bianco', ral: '9010' },
            { cod: '6', nome: 'Avorio', ral: '1013' },
            { cod: '10', nome: 'Grigio polvere', ral: '7037' },
            { cod: '27', nome: 'Testa di moro', ral: null },
            { cod: '28', nome: 'Nero', ral: '9011 OP' },
            { cod: '30', nome: 'Bianco crema', ral: '9001' },
            { cod: '35', nome: 'Bronzo Verniciato', ral: null },
            { cod: '41', nome: 'Bianco', ral: '9010 OP' },
            { cod: '46', nome: 'Grigio chiaro', ral: '7035' },
            { cod: '49', nome: 'Verde', ral: '6005 OP' },
            { cod: '85', nome: 'Bianco traffico', ral: '9016 OP' },
            { cod: '90', nome: 'Marrone', ral: '8017 OP' },
            { cod: '91', nome: 'Grigio silver', ral: '9006' },
            { cod: '94', nome: 'Avorio', ral: '1013 OP' }
        ],
        F2: [
            { cod: '13', nome: 'Grigio Michelangelo', ral: null },
            { cod: '29', nome: 'Ferro micaceo', ral: null },
            { cod: '78', nome: 'Grigio antracite', ral: '7016 SablÃ©' }
        ],
        F3: [
            { cod: '17', nome: 'Rovere P9', codice: null },
            { cod: '26', nome: 'Renolit chiaro', codice: '386-73/R' },
            { cod: '32', nome: 'Renolit scuro', codice: '387-70/R' },
            { cod: '33', nome: 'Noce', codice: '360-70/R' },
            { cod: '37', nome: 'Douglas', codice: '335.80/R' },
            { cod: '48', nome: 'Rovere Scuro', codice: '474-123/R' }
        ]
    },

    // ============================================================
    // COLORI PLASTICA (per carro/guide)
    // ============================================================
    coloriPlastica: [
        { sigla: 'BI', nome: 'Bianco' },
        { sigla: 'AV', nome: 'Avorio' },
        { sigla: 'MA', nome: 'Marrone' },
        { sigla: 'NE', nome: 'Nero' },
        { sigla: 'BR', nome: 'Bronzo' },
        { sigla: 'GR', nome: 'Grigio' }
    ],

    // ============================================================
    // TIPI RETE
    // ============================================================
    reti: [
        { id: 'STD', nome: 'Standard PP', supplementoMq: 0, note: 'Polipropilene' },
        { id: 'HC', nome: 'HC Alto Contrasto', supplementoMq: 0, note: 'Nera, fibra vetro' },
        { id: 'FV', nome: 'Fibra vetro grigia', supplementoMq: 0, note: '' },
        { id: 'AB', nome: 'Anti-batterica certificata', supplementoMq: 0, note: 'Antracite' },
        { id: 'AT', nome: 'Alta trasparenza nera', supplementoMq: 5.00, note: '' },
        { id: 'SOL', nome: 'Solar 0,35', supplementoMq: 9.50, note: 'Grigia o nera' }
    ],

    // ============================================================
    // ACCESSORI
    // ============================================================
    accessori: [
        { id: 'GUIDA_PVC', nome: 'Guida a terra in PVC pendenza 8Â°', prezzo: 0, unita: 'cad', note: 'Senza magg.' },
        { id: 'QUICK_LOCK', nome: 'Sgancio Quick-Lock', prezzo: 18.00, unita: 'cad', note: '' },
        { id: 'SGANCIO_CRIC', nome: 'Sgancio cricchetto Lato Riscontro', prezzo: 20.50, unita: 'cad', note: '' },
        { id: 'CARRO_FLUO', nome: 'Carro Fluo', prezzo: 25.00, unita: 'cad', note: '' },
        { id: 'MANIGLIA_TESS', nome: 'Maniglia tessile', prezzo: 7.50, unita: 'cad', note: '' },
        { id: 'DOPPIA_MANIGLIA', nome: 'Doppia maniglia ribassata int/est', prezzo: 9.00, unita: 'coppia', note: '' },
        { id: 'GUIDA_ALU', nome: 'Guida inferiore in alluminio', prezzo: 10.50, unita: 'cad', note: '' },
        { id: 'TUBO_MAGNUM', nome: 'Tubo Magnum Ã˜28', prezzo: 18.00, unita: 'cad', note: 'Solo cass. 50mm' },
        { id: 'KIT_REGGI', nome: 'Kit Reggi Guide Pala-System', prezzo: 3.50, unita: 'kit', note: 'Tapp. 86/20A' },
        { id: 'BARRA_EXTRA', nome: 'Barramaniglia Extra Forte', prezzo: 4.50, unita: 'mq', note: 'Consig. >180cm' }
    ],

    // ============================================================
    // SUPPLEMENTI
    // ============================================================
    supplementi: {
        ralSpecial: {
            percentuale: 10, // +10% su F1
            fisso: 60.00     // â‚¬60,00 netti per modello
        }
    },

    // ============================================================
    // FUNZIONI DI CALCOLO
    // ============================================================
    
    /**
     * Calcola prezzo zanzariera
     * @param {string} modello - ID modello
     * @param {number} larghezzaCm - Larghezza in cm
     * @param {number} altezzaCm - Altezza in cm
     * @param {string} fascia - F1, F2, F3
     * @param {string} tipoRete - ID tipo rete
     * @param {Array} accessoriIds - Array di ID accessori
     * @returns {Object} - Dettaglio calcolo
     */
    calcolaPrezzo: function(modello, larghezzaCm, altezzaCm, fascia, tipoRete = 'STD', accessoriIds = []) {
        const mod = this.modelli[modello];
        if (!mod) {
            return { errore: `Modello ${modello} non trovato` };
        }

        // Calcola mq
        const mq = (larghezzaCm / 100) * (altezzaCm / 100);
        const mqFatturati = Math.max(mq, mod.minMq);

        // Prezzo base
        const prezzoMq = mod.prezzi[fascia];
        if (!prezzoMq) {
            return { errore: `Fascia ${fascia} non disponibile per ${modello}` };
        }
        const prezzoBase = mqFatturati * prezzoMq;

        // Supplemento rete
        const rete = this.reti.find(r => r.id === tipoRete);
        const suppRete = rete ? mqFatturati * rete.supplementoMq : 0;

        // Accessori
        let totAccessori = 0;
        const accessoriDettaglio = [];
        accessoriIds.forEach(accId => {
            const acc = this.accessori.find(a => a.id === accId);
            if (acc) {
                let costo = acc.prezzo;
                if (acc.unita === 'mq') {
                    costo = acc.prezzo * mqFatturati;
                }
                totAccessori += costo;
                accessoriDettaglio.push({ ...acc, costo });
            }
        });

        const totale = prezzoBase + suppRete + totAccessori;

        return {
            modello: modello,
            dimensioni: { L: larghezzaCm, H: altezzaCm },
            mqReali: parseFloat(mq.toFixed(4)),
            mqFatturati: parseFloat(mqFatturati.toFixed(2)),
            minMq: mod.minMq,
            fascia: fascia,
            prezzoMq: prezzoMq,
            prezzoBase: parseFloat(prezzoBase.toFixed(2)),
            rete: rete ? rete.nome : 'Standard',
            suppRete: parseFloat(suppRete.toFixed(2)),
            accessori: accessoriDettaglio,
            totAccessori: parseFloat(totAccessori.toFixed(2)),
            totale: parseFloat(totale.toFixed(2))
        };
    },

    /**
     * Ottiene lista modelli per una linea
     * @param {string} linea - ID linea
     * @returns {Array} - Lista modelli
     */
    getModelliByLinea: function(linea) {
        return Object.entries(this.modelli)
            .filter(([id, mod]) => mod.linea === linea)
            .map(([id, mod]) => ({ id, ...mod }));
    },

    /**
     * Ottiene colori per una fascia
     * @param {string} fascia - F1, F2, F3
     * @returns {Array} - Lista colori
     */
    getColoriByFascia: function(fascia) {
        return this.colori[fascia] || [];
    },

    /**
     * Determina fascia da codice colore
     * @param {string} codColore - Codice colore
     * @returns {string|null} - F1, F2, F3 o null
     */
    getFasciaByColore: function(codColore) {
        for (const [fascia, colori] of Object.entries(this.colori)) {
            if (colori.find(c => c.cod === codColore)) {
                return fascia;
            }
        }
        return null;
    }
};

// Export per Node.js (se usato lato server)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PALAGINA_ZANZARIERE_2025;
}

// 🔧 v1.0.1: Export globale per browser
if (typeof window !== 'undefined') {
    window.PALAGINA_ZANZARIERE_2025 = PALAGINA_ZANZARIERE_2025;
}
