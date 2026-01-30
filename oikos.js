// ═══════════════════════════════════════════════════════════════════════════
// 🔧 OIKOS EVO 2025 - Database Porte Blindate
// Fonte: Listino EVO 2025 (Settembre 2025)
// Sconto installatore: 40% + 10% = 46% effettivo
// ═══════════════════════════════════════════════════════════════════════════
const OIKOS_BLINDATE_2025 = {
    info: { fornitore: "OIKOS VENEZIA srl", listino: "EVO 2025", sconto: 0.46 },
    
    // Dimensioni LUCI (mm)
    luci: {
0: { max_L: 900, max_H: 2100 },
1: { max_L: 940, max_H: 2210 },
2: { max_L: 1030, max_H: 2400 },
3: { max_L: 1100, max_H: 2400 },
4: { max_L: 1200, max_H: 2400 },
5: { max_L: 1000, max_H: 2700 },
6: { max_L: 1000, max_H: 3000 }
    },
    
    // Prezzi base porta (€)
    porte: {
evolution_3: {
    nome: "Evolution 3", classe: 3, punti: 9,
    prezzi: { 0: 1156, 1: 1206, 2: 1441 }
},
evolution_4: {
    nome: "Evolution 4", classe: 4, punti: 8,
    prezzi: { 0: 1436, 1: 1486, 2: 1721 }
},
project: {
    nome: "Project", classe: 3, punti: 5,
    prezzi: { 0: 1173, 1: 1293, 2: 1480 }
},
tekno: {
    nome: "Tekno", classe: 3, punti: 6,
    prezzi: { 0: 1505, 1: 1655, 2: 1974, 5: 2353, 6: 2614 }
}
    },
    
    // Rivestimenti (€ per lato)
    rivestimenti: {
piano_tanganica: { linea: "Piano", nome: "Tanganica 1-2 / Mogano 2-3", prezzi: { 0: 192, 1: 192, 2: 235, 3: 346, 4: 414 } },
piano_laccato: { linea: "Piano", nome: "Laccato Bianco OIKOS", prezzi: { 0: 130, 1: 145, 2: 179, 3: 284, 4: 358 } },
piano_rovere: { linea: "Piano", nome: "Rovere 1", prezzi: { 0: 242, 1: 242, 2: 298, 3: 408, 4: 510 } },
piano_noce: { linea: "Piano", nome: "Noce Nazionale 2", prezzi: { 0: 276, 1: 276, 2: 340, 3: 459, 4: 573 } },
piano_bianco_talco: { linea: "Piano", nome: "Bianco/Grigio Talco", prezzi: { 0: 170, 1: 170, 2: 170 } },
mdf_laccare: { linea: "Piano", nome: "MDF da laccare", prezzi: { 0: 114, 1: 117, 2: 127, 3: 192, 4: 192 } }
    },
    
    // Colori telaio/allumini (€)
    colori_telaio: {
ral_8022: { nome: "RAL 8022 (standard)", prezzo: 0 },
oikos_polveri: { nome: "Colori OIKOS a Polveri", prezzo: 246 },
oikos_evergreen: { nome: "Colori OIKOS Evergreen", prezzo: 320 },
oikos_future: { nome: "Colori OIKOS Future", prezzo: 384 },
oikos_liquido: { nome: "Colori OIKOS a Liquido", prezzo: 492 }
    },
    
    // Accessori (€)
    accessori: {
cilindro_sekur: { nome: "Cilindro SEKUR", prezzo: 238 },
cilindro_basic: { nome: "Cilindro BASIC", prezzo: 123 },
telaio_tt: { nome: "Telaio Taglio Termico", prezzi: { 0: 177, 1: 202, 2: 240 } },
maniglia_ottone: { nome: "Maniglia interna ottone", prezzo: 0 },
pomolo_ottone: { nome: "Pomolo esterno ottone", prezzo: 0 },
spioncino_ottone: { nome: "Spioncino ottone", prezzo: 0 }
    },
    
    // Trova luce per dimensioni
    trovaLuce: function(L_mm, H_mm) {
for (let i = 0; i <= 6; i++) {
    const luce = this.luci[i];
    if (luce && L_mm <= luce.max_L && H_mm <= luce.max_H) return i;
}
return null;
    },
    
    // Calcola prezzo completo
    calcolaPrezzo: function(modello, L_mm, H_mm, riv_int = null, riv_est = null, colore_telaio = 'ral_8022', accessori = []) {
const porta = this.porte[modello];
if (!porta) return { errore: `Modello ${modello} non trovato` };

const luce = this.trovaLuce(L_mm, H_mm);
if (luce === null) return { errore: `Dimensioni ${L_mm}x${H_mm} fuori range` };

const prezzo_porta = porta.prezzi[luce];
if (!prezzo_porta) return { errore: `Luce ${luce} non disponibile per ${porta.nome}` };

// Rivestimenti
let prezzo_riv = 0;
if (riv_int && this.rivestimenti[riv_int]) {
    prezzo_riv += this.rivestimenti[riv_int].prezzi[luce] || 0;
}
if (riv_est && this.rivestimenti[riv_est]) {
    prezzo_riv += this.rivestimenti[riv_est].prezzi[luce] || 0;
}

// Colore telaio
const prezzo_colore = this.colori_telaio[colore_telaio]?.prezzo || 0;

// Accessori
let prezzo_acc = 0;
accessori.forEach(acc => {
    const a = this.accessori[acc];
    if (a) prezzo_acc += a.prezzo || (a.prezzi ? a.prezzi[luce] : 0) || 0;
});

const listino = prezzo_porta + prezzo_riv + prezzo_colore + prezzo_acc;
const netto = listino * (1 - this.info.sconto);

return {
    modello: porta.nome, classe: porta.classe,
    dimensioni: `${L_mm}x${H_mm}`, luce: luce,
    prezzo_porta, prezzo_riv, prezzo_colore, prezzo_acc,
    listino: Math.round(listino * 100) / 100,
    sconto: '46%',
    netto: Math.round(netto * 100) / 100
};
    },
    
    // Lista modelli
    getModelli: function() {
return Object.entries(this.porte).map(([k, p]) => ({
    codice: k, nome: p.nome, classe: p.classe, punti: p.punti
}));
    }
};

console.log('✅ OIKOS_BLINDATE_2025 v1.0 - Database Porte Blindate (4 linee, 6 luci, sconto 46%)');
