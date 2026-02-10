/**
 * ═══════════════════════════════════════════════════════════════
 * 📦 PALAGINA - Database Zanzariere Unificato
 * ═══════════════════════════════════════════════════════════════
 * 
 * v2.1 (10/02/2026) - Prezzi +3.50€/m² F1 allineati a configuratore Palagina
 * Fonte: Catalogo Zanzariere_2025_IT_128_Web-cm.pdf
 * 
 * ESPORTA:
 *   PALAGINA_ZANZARIERE       → dropdown UI (linee, modelli per linea, colori, reti)
 *   PALAGINA_ZANZARIERE_2025  → calcolo prezzi (modelli flat, calcolaPrezzo, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

// ========================================
// DATI BASE
// ========================================

var _PAL_LINEE = {
    'SINTESI': { nome: 'Linea SINTESI', tipo: 'Avvolgibile verticale' },
    'SV':      { nome: 'Linea SV',      tipo: 'Avvolgibile verticale' },
    'EVO':     { nome: 'Linea EVO',     tipo: 'Speciali' },
    'COMPATTO':{ nome: 'Serie X - COMPATTO', tipo: 'Avvolgibile compatta' }
};

var _PAL_MODELLI = {
    // ----- LINEA SINTESI -----
    'EXTREMA':                  { linea: 'SINTESI', cassonetti: null,     maxH: 230, prezzi: { F1: 167.50, F2: 175.88, F3: 201.00 }, minMq: 2.00 },
    'EXTREMA_CENTRALE':         { linea: 'SINTESI', cassonetti: null,     maxH: 230, prezzi: { F1: 177.00, F2: 185.85, F3: 212.40 }, minMq: 2.00 },
    'EXTREMA_SR':               { linea: 'SINTESI', cassonetti: null,     maxH: 460, prezzi: { F1: 177.00, F2: 185.85, F3: 212.40 }, minMq: 4.00 },
    'EXTREMA_INCASSO':          { linea: 'SINTESI', cassonetti: [46, 50], maxH: 230, prezzi: { F1: 177.00, F2: 185.85, F3: 212.40 }, minMq: 2.00 },
    'EXTREMA_INCASSO_CENTRALE': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 460, prezzi: { F1: 177.00, F2: 185.85, F3: 212.40 }, minMq: 4.00 },
    'EXTREMA_INCASSO_SR':       { linea: 'SINTESI', cassonetti: [46, 50], maxH: 460, prezzi: { F1: 177.00, F2: 185.85, F3: 212.40 }, minMq: 4.00 },
    'NANO_SINTESI':             { linea: 'SINTESI', cassonetti: [22],     maxH: 180, prezzi: { F1: 151.50, F2: 159.08, F3: 181.80 }, minMq: 2.00 },
    'MICRO_SINTESI':            { linea: 'SINTESI', cassonetti: [36],     maxH: 200, prezzi: { F1: 160.50, F2: 168.53, F3: 192.60 }, minMq: 4.00 },
    'MICRO_SINTESI_CENTRALE':   { linea: 'SINTESI', cassonetti: [36],     maxH: 200, prezzi: { F1: 160.50, F2: 168.53, F3: 192.60 }, minMq: 4.00 },
    'SINTESI':                  { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 160.50, F2: 168.53, F3: 192.60 }, minMq: 2.00 },
    'SINTESI_CENTRALE':         { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 169.50, F2: 177.97, F3: 203.40 }, minMq: 2.00 },
    'SINTESI_INCASSO':          { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 169.50, F2: 177.97, F3: 203.40 }, minMq: 2.00 },
    'SINTESI_INCASSO_CENTRALE': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 420, prezzi: { F1: 169.50, F2: 177.97, F3: 203.40 }, minMq: 4.00 },
    // ----- LINEA SV (NEW 2025) -----
    'SV_700':    { linea: 'SV',      cassonetti: [45, 50], maxH: 250, prezzi: { F1: 87.50, F2: 91.88, F3: 105.00 }, minMq: 1.50, reteDiSerie: 'HC' },
    // ----- LINEA EVO (NEW 2025) -----
    'EVO_ROOF':  { linea: 'EVO',     cassonetti: [40],     maxH: 150, prezzi: { F1: 129.50, F2: null, F3: 155.40 }, minMq: 1.50, tipo: 'Lucernario' },
    // ----- SERIE X - COMPATTO -----
    'X1_INCASSO':{ linea: 'COMPATTO', cassonetti: [50],    maxH: 200, prezzi: { F1: 117.00, F2: 122.85, F3: 140.40 }, minMq: 1.50 },
    'X3_LUCE':   { linea: 'COMPATTO', cassonetti: [53],    maxH: 200, prezzi: { F1: 148.00, F2: 155.40, F3: 177.60 }, minMq: 1.50 }
};

var _PAL_COLORI = {
    F1: [
        { cod: '1',  nome: 'Argento OX',       ral: null },
        { cod: '5',  nome: 'Bianco',            ral: '9010' },
        { cod: '6',  nome: 'Avorio',            ral: '1013' },
        { cod: '10', nome: 'Grigio polvere',    ral: '7037' },
        { cod: '27', nome: 'Testa di moro',     ral: null },
        { cod: '28', nome: 'Nero',              ral: '9011 OP' },
        { cod: '30', nome: 'Bianco crema',      ral: '9001' },
        { cod: '35', nome: 'Bronzo Verniciato', ral: null },
        { cod: '41', nome: 'Bianco',            ral: '9010 OP' },
        { cod: '46', nome: 'Grigio chiaro',     ral: '7035' },
        { cod: '49', nome: 'Verde',             ral: '6005 OP' },
        { cod: '85', nome: 'Bianco traffico',   ral: '9016 OP' },
        { cod: '90', nome: 'Marrone',           ral: '8017 OP' },
        { cod: '91', nome: 'Grigio silver',     ral: '9006' },
        { cod: '94', nome: 'Avorio',            ral: '1013 OP' }
    ],
    F2: [
        { cod: '13', nome: 'Grigio Michelangelo', ral: null },
        { cod: '29', nome: 'Ferro micaceo',       ral: null },
        { cod: '78', nome: 'Grigio antracite',    ral: '7016 Sablé' }
    ],
    F3: [
        { cod: '17', nome: 'Rovere P9',      codice: null },
        { cod: '26', nome: 'Renolit chiaro', codice: '386-73/R' },
        { cod: '32', nome: 'Renolit scuro',  codice: '387-70/R' },
        { cod: '33', nome: 'Noce',           codice: '360-70/R' },
        { cod: '37', nome: 'Douglas',        codice: '335.80/R' },
        { cod: '48', nome: 'Rovere Scuro',   codice: '474-123/R' }
    ]
};

var _PAL_RETI = [
    { id: 'STD', nome: 'Standard PP',               supplementoMq: 0,    note: 'Polipropilene' },
    { id: 'HC',  nome: 'HC Alto Contrasto',          supplementoMq: 0,    note: 'Nera, fibra vetro' },
    { id: 'FV',  nome: 'Fibra vetro grigia',         supplementoMq: 0,    note: '' },
    { id: 'AB',  nome: 'Anti-batterica certificata', supplementoMq: 0,    note: 'Antracite' },
    { id: 'AT',  nome: 'Alta trasparenza nera',      supplementoMq: 5.00, note: '' },
    { id: 'SOL', nome: 'Solar 0,35',                 supplementoMq: 9.50, note: 'Grigia o nera' }
];

var _PAL_COLORI_PLASTICA = ['Bianco', 'Avorio', 'Marrone', 'Nero', 'Bronzo', 'Grigio'];

var _PAL_ACCESSORI = [
    { id: 'GUIDA_PVC',      nome: 'Guida a terra in PVC pendenza 8°', prezzo: 0,     unita: 'cad' },
    { id: 'QUICK_LOCK',     nome: 'Sgancio Quick-Lock',               prezzo: 18.00, unita: 'cad' },
    { id: 'SGANCIO_CRIC',   nome: 'Sgancio cricchetto Lato Riscontro',prezzo: 20.50, unita: 'cad' },
    { id: 'CARRO_FLUO',     nome: 'Carro Fluo',                       prezzo: 25.00, unita: 'cad' },
    { id: 'MANIGLIA_TESS',  nome: 'Maniglia tessile',                 prezzo: 7.50,  unita: 'cad' },
    { id: 'DOPPIA_MANIGLIA',nome: 'Doppia maniglia ribassata int/est',prezzo: 9.00,  unita: 'coppia' },
    { id: 'GUIDA_ALU',      nome: 'Guida inferiore in alluminio',     prezzo: 10.50, unita: 'cad' },
    { id: 'TUBO_MAGNUM',    nome: 'Tubo Magnum Ø28',                  prezzo: 18.00, unita: 'cad' },
    { id: 'KIT_REGGI',      nome: 'Kit Reggi Guide Pala-System',      prezzo: 3.50,  unita: 'kit' },
    { id: 'BARRA_EXTRA',    nome: 'Barramaniglia Extra Forte',        prezzo: 4.50,  unita: 'mq' }
];

var _PAL_SUPPLEMENTI = {
    ralSpecial: { percentuale: 10, fisso: 60.00 }
};


// ========================================
// 🔄 PALAGINA_ZANZARIERE (dropdown UI)
// Struttura cascading: linee → modelli[linea] → colori[fascia]
// ========================================

var PALAGINA_ZANZARIERE = {
    linee: _PAL_LINEE,
    modelli: {},   // { 'SINTESI': [{id, nome, cassonetti, maxH}, ...], 'SV': [...] }
    colori: _PAL_COLORI,
    reti: _PAL_RETI,
    coloriPlastica: _PAL_COLORI_PLASTICA
};

// Popola modelli raggruppati per linea (cascading dropdown)
(function() {
    for (var linea in _PAL_LINEE) {
        PALAGINA_ZANZARIERE.modelli[linea] = [];
    }
    for (var id in _PAL_MODELLI) {
        var m = _PAL_MODELLI[id];
        if (!PALAGINA_ZANZARIERE.modelli[m.linea]) {
            PALAGINA_ZANZARIERE.modelli[m.linea] = [];
        }
        PALAGINA_ZANZARIERE.modelli[m.linea].push({
            id: id,
            nome: id.replace(/_/g, ' '),
            cassonetti: m.cassonetti ? m.cassonetti.join('/') : '-',
            maxH: m.maxH
        });
    }
})();


// ========================================
// 🔄 PALAGINA_ZANZARIERE_2025 (calcolo prezzi)
// Struttura flat: modelli[id] con prezzi + funzioni calcolo
// ========================================

var PALAGINA_ZANZARIERE_2025 = {
    metadata: {
        fornitore: 'Palagina',
        listino: 'Zanzariere 2025',
        dataListino: '2025-01-01',
        dataEstrazione: '2025-12-05',
        valuta: 'EUR',
        consegnaSettimane: 4
    },
    linee: _PAL_LINEE,
    modelli: _PAL_MODELLI,
    colori: _PAL_COLORI,
    coloriPlastica: _PAL_COLORI_PLASTICA,
    reti: _PAL_RETI,
    accessori: _PAL_ACCESSORI,
    supplementi: _PAL_SUPPLEMENTI,

    // Calcola prezzo zanzariera
    calcolaPrezzo: function(modello, larghezzaCm, altezzaCm, fascia, reteId, accessoriIds) {
        var mod = this.modelli[modello];
        if (!mod) return null;

        fascia = fascia || 'F1';
        accessoriIds = accessoriIds || [];

        var prezzoMq = mod.prezzi[fascia];
        if (prezzoMq === null || prezzoMq === undefined) return null;

        var mq = (larghezzaCm / 100) * (altezzaCm / 100);
        var mqFatturati = Math.max(mq, mod.minMq);
        var prezzoBase = mqFatturati * prezzoMq;

        // Supplemento rete
        var suppRete = 0;
        if (reteId) {
            var rete = this.reti.find(function(r) { return r.id === reteId; });
            if (rete && rete.supplementoMq > 0) {
                suppRete = mqFatturati * rete.supplementoMq;
            }
        }

        // Accessori
        var totAccessori = 0;
        var self = this;
        accessoriIds.forEach(function(accId) {
            var acc = self.accessori.find(function(a) { return a.id === accId; });
            if (acc) {
                totAccessori += acc.unita === 'mq' ? acc.prezzo * mqFatturati : acc.prezzo;
            }
        });

        return {
            modello: modello,
            dimensioni: { L: larghezzaCm, H: altezzaCm },
            mqReali: parseFloat(mq.toFixed(4)),
            mqFatturati: parseFloat(mqFatturati.toFixed(2)),
            minMq: mod.minMq,
            fascia: fascia,
            prezzoMq: prezzoMq,
            prezzoBase: parseFloat(prezzoBase.toFixed(2)),
            suppRete: parseFloat(suppRete.toFixed(2)),
            totAccessori: parseFloat(totAccessori.toFixed(2)),
            totale: parseFloat((prezzoBase + suppRete + totAccessori).toFixed(2))
        };
    },

    getModelliByLinea: function(linea) {
        var result = [];
        for (var id in this.modelli) {
            if (this.modelli[id].linea === linea) {
                result.push({ id: id, nome: id.replace(/_/g, ' '), prezzi: this.modelli[id].prezzi });
            }
        }
        return result;
    },

    getColoriByFascia: function(fascia) {
        return this.colori[fascia] || [];
    },

    getFasciaByColore: function(codColore) {
        for (var fascia in this.colori) {
            var found = this.colori[fascia].find(function(c) { return c.cod === codColore; });
            if (found) return fascia;
        }
        return null;
    }
};


console.log('✅ database/palagina.js v2.1 caricato — prezzi +3.50 allineati configuratore');
console.log('   📦 PALAGINA_ZANZARIERE (dropdown cascading)');
console.log('   📦 PALAGINA_ZANZARIERE_2025 (pricing)');

// Export Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PALAGINA_ZANZARIERE, PALAGINA_ZANZARIERE_2025 };
}
