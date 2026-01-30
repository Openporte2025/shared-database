// ═══════════════════════════════════════════════════════════════════════════
// 🔧 PUNTO PERSIANE 2025 - Database Persiane 45/52 Collezione Infinita
// Fonte: Listino prezzi 45/52 aggiornato 14/10/2025
// Sconto installatore: 55%
// ═══════════════════════════════════════════════════════════════════════════
const PUNTO_PERSIANE_2025 = {
    info: { fornitore: "PUNTO PERSIANE", listino: "45/52", sconto: 0.55 },
    
    // Tipologie
    tipologie: {
F1: { nome: "Finestra 1 anta", ante: 1 },
F2: { nome: "Finestra 2 ante", ante: 2 },
PF1: { nome: "Porta Finestra 1 anta", ante: 1 },
PF2: { nome: "Porta Finestra 2 ante", ante: 2 }
    },
    
    // Modelli con maggiorazioni
    modelli: {
// Stecca fissa tonda
angela: { cat: "tonda", nome: "Angela", magg: 0.11 },
giulia: { cat: "tonda", nome: "Giulia", magg: 0.15 },
luna: { cat: "tonda", nome: "Luna", magg: 0.04 },
// Stecca romboidale
piemontese: { cat: "romboidale", nome: "Piemontese", magg: 0.04 },
firenze: { cat: "romboidale", nome: "Firenze", magg: 0.04 },
carolina: { cat: "romboidale", nome: "Carolina", magg: 0.11 },
storica: { cat: "romboidale", nome: "Storica", magg: 0.34 },
camelia: { cat: "romboidale", nome: "Camelia", magg: 0.29 },
// Orientabili
aurora: { cat: "orientabile", nome: "Aurora", magg: 0.17 },
alice: { cat: "orientabile", nome: "Alice", magg: 0.17 },
// Cieche e dogate
nerina: { cat: "cieca", nome: "Nerina", magg: 0.04 },
nerina_r: { cat: "cieca", nome: "Nerina [R]", magg: 0.225 },
canazei: { cat: "cieca", nome: "Canazei", magg: 0.17 },
alto_adige: { cat: "cieca", nome: "Alto Adige", magg: 0.33 },
alto_adige_r: { cat: "cieca", nome: "Alto Adige [R]", magg: 0.39 },
cortina: { cat: "cieca", nome: "Cortina", magg: 0.39 },
cortina_r: { cat: "cieca", nome: "Cortina [R]", magg: 0.44 },
diamante: { cat: "cieca", nome: "Diamante", magg: 0.34 }
    },
    
    // Categorie colore
    colori: {
cat_01: { nome: "Standard", magg: 0 },
cat_02a: { nome: "Opachi extra", magg: 0.03 },
cat_02b: { nome: "Textured", magg: 0.05 },
cat_03: { nome: "Legno EZY", magg: 0.20 },
cat_04: { nome: "Legno Élite", magg: 0.25 },
cat_05: { nome: "Legno Electo", magg: 0.25 },
cat_06: { nome: "Legno sublimato", magg: 0.30 },
cat_07: { nome: "Legno speciale", magg: 0.30 }
    },
    
    // Griglie prezzi base F1 (€)
    griglie_F1: {
L: [500, 600, 700, 800, 900, 1000, 1100, 1200],
H: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
P: [
    [257, 282, 306, 317, 326, 335, 350, 366],
    [275, 294, 314, 327, 338, 349, 365, 381],
    [291, 306, 323, 337, 350, 364, 379, 395],
    [307, 319, 329, 347, 363, 378, 395, 411],
    [307, 327, 346, 363, 379, 397, 415, 434],
    [320, 338, 356, 377, 391, 409, 426, 444],
    [330, 350, 370, 388, 408, 427, 448, 470],
    [337, 359, 379, 400, 422, 443, 460, 478],
    [349, 371, 395, 417, 437, 459, 480, 501],
    [355, 379, 403, 426, 448, 473, 496, 520],
    [371, 395, 418, 444, 468, 493, 517, 543],
    [384, 410, 435, 462, 488, 512, 539, 567],
    [397, 426, 455, 480, 507, 530, 562, 592],
    [411, 443, 473, 500, 527, 550, 586, 616]
]
    },
    
    // Griglie prezzi base F2 (€)
    griglie_F2: {
L: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
H: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
P: [
    [489, 500, 509, 520, 534, 548, 557, 572],
    [502, 514, 525, 537, 552, 566, 576, 592],
    [515, 527, 541, 554, 569, 586, 597, 613],
    [527, 542, 557, 572, 588, 605, 616, 635],
    [545, 562, 578, 593, 613, 631, 648, 662],
    [562, 577, 593, 613, 632, 651, 667, 686],
    [575, 595, 614, 636, 658, 679, 695, 715],
    [592, 613, 635, 656, 679, 697, 716, 740],
    [610, 633, 656, 680, 700, 722, 745, 770],
    [628, 652, 677, 702, 725, 749, 773, 798],
    [648, 674, 700, 726, 751, 777, 803, 830],
    [670, 698, 726, 753, 780, 808, 836, 865],
    [694, 724, 754, 783, 812, 842, 872, 903],
    [720, 752, 784, 815, 846, 878, 910, 943]
]
    },
    
    // Telai
    telai: {
TH40: {
    L: [[400,699], [700,999], [1000,1299], [1300,1599], [1600,1999], [2000,2399], [2400,3000]],
    H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
    P: [
        [116, 123, 136, 145, 162, 172, 186],
        [146, 152, 167, 174, 191, 201, 215],
        [174, 181, 198, 202, 214, 224, 237],
        [196, 202, 220, 228, 235, 258, 260]
    ]
},
TH45: {
    L: [[400,699], [700,999], [1000,1299], [1300,1599], [1600,1999], [2000,2399], [2400,3000]],
    H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
    P: [
        [65, 67, 71, 74, 84, 87, 92],
        [76, 79, 85, 86, 95, 98, 105],
        [90, 92, 93, 98, 102, 109, 114],
        [98, 100, 107, 108, 113, 119, 123]
    ]
}
    },
    
    // Trova prezzo in griglia
    trovaPrezzoGriglia: function(tipo, L_mm, H_mm) {
const g = tipo === 'F1' ? this.griglie_F1 : this.griglie_F2;
let idxL = g.L.findIndex(l => L_mm <= l);
if (idxL === -1) idxL = g.L.length - 1;
let idxH = g.H.findIndex(h => H_mm <= h);
if (idxH === -1) idxH = g.H.length - 1;
return { prezzo: g.P[idxH][idxL], L_grid: g.L[idxL], H_grid: g.H[idxH] };
    },
    
    // Trova prezzo telaio
    trovaPrezzoTelaio: function(tipo, L_mm, H_mm) {
const t = this.telai[tipo];
if (!t) return 0;
let idxL = t.L.findIndex(([min, max]) => L_mm >= min && L_mm <= max);
if (idxL === -1) idxL = t.L.length - 1;
let idxH = t.H.findIndex(([min, max]) => H_mm >= min && H_mm <= max);
if (idxH === -1) idxH = t.H.length - 1;
return t.P[idxH][idxL];
    },
    
    // Calcola prezzo completo
    calcolaPrezzo: function(tipologia, modello, L_mm, H_mm, colore = 'cat_01', telaio = null) {
const mod = this.modelli[modello] || { magg: 0, nome: 'Base' };
const col = this.colori[colore] || { magg: 0 };

// Prezzo griglia
const griglia = this.trovaPrezzoGriglia(tipologia, L_mm, H_mm);

// Prezzo base con modello
let prezzoBase = griglia.prezzo * (1 + mod.magg);

// Telaio
let prezzoTelaio = telaio ? this.trovaPrezzoTelaio(telaio, L_mm, H_mm) : 0;

// Totale con colore
let listino = (prezzoBase + prezzoTelaio) * (1 + col.magg);

// Netto con sconto
let netto = listino * (1 - this.info.sconto);

return {
    tipologia, modello: mod.nome, dimensioni: `${L_mm}x${H_mm}`,
    griglia: griglia.prezzo, magg_modello: `+${(mod.magg*100).toFixed(0)}%`,
    telaio: prezzoTelaio, magg_colore: `+${(col.magg*100).toFixed(0)}%`,
    listino: Math.round(listino * 100) / 100,
    sconto: '55%',
    netto: Math.round(netto * 100) / 100
};
    },
    
    // Lista modelli
    getModelli: function() {
return Object.entries(this.modelli).map(([k, m]) => ({
    codice: k, nome: m.nome, categoria: m.cat, maggiorazione: `+${(m.magg*100).toFixed(0)}%`
}));
    }
};

console.log('✅ PUNTO_PERSIANE_2025 v1.0 - Database Persiane (4 categorie, 18 modelli, sconto 55%)');
