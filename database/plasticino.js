// ═══════════════════════════════════════════════════════════════════════════
// 🔧 PLASTICINO AVVOLGIBILI 2025 - Database Tapparelle
// Fonte: Listino-Catalogo Generale Avvolgibili 07.2022
// Sconto installatore: 45%
// ═══════════════════════════════════════════════════════════════════════════
const PLASTICINO_AVVOLGIBILI_2025 = {
    info: { fornitore: "PLASTICINO S.r.l.", sconto: 0.45 },
    
    // TELI PRINCIPALI (€/mq)
    teli: {
// Alluminio Media Densità
TA01: { codice: "TA01", nome: "ALUPROFIL MD 13x55", materiale: "Alluminio MD", sezione: "13x55", prezzi: { unita: 60.00, legno: 61.50, raffaello: 62.50 }, max_l: 3000 },
TA05: { codice: "TA05", nome: "ALUPROFIL MD 9x41", materiale: "Alluminio MD", sezione: "9x41", prezzi: { unita: 66.00, legno: 67.50, raffaello: 68.50 }, max_l: 2500 },
TA42: { codice: "TA42", nome: "ALUPROFIL MD 8.5x32", materiale: "Alluminio MD", sezione: "8.5x32", prezzi: { unita: 90.00, legno: 91.50, raffaello: 92.50 }, max_l: 2500 },
TA07: { codice: "TA07", nome: "ALUPROFIL MD 8x37", materiale: "Alluminio MD", sezione: "8x37", prezzi: { unita: 77.00, legno: 78.50 }, max_l: 2000 },

// Alluminio Alta Densità
TA25: { codice: "TA25", nome: "ALUPROFIL AD 13x55", materiale: "Alluminio AD", sezione: "13x55", prezzi: { unita: 73.00, legno: 74.50, raffaello: 75.50 }, max_l: 3500 },
TA30: { codice: "TA30", nome: "ALUPROFIL AD 9x41", materiale: "Alluminio AD", sezione: "9x41", prezzi: { unita: 72.00, legno: 73.50, raffaello: 74.50 } },

// Acciaio Coibentato
TA15: { codice: "TA15", nome: "STEELPROFIL 13x55", materiale: "Acciaio", sezione: "13x55", prezzi: { unita: 75.00, legno: 76.50, raffaello: 77.50, primer: 65.00 } },
TA20: { codice: "TA20", nome: "STEELPROFIL 9x40", materiale: "Acciaio", sezione: "9x40", prezzi: { unita: 109.00, legno: 118.00, raffaello: 120.00 }, max_l: 3200 },

// PVC Estruso
A01: { codice: "A01", nome: "ANTIGRANDINE 14x50", materiale: "PVC", sezione: "14x50", prezzi: { base: 46.20, speciali: 0.80 }, max_l: 2500 },
A10: { codice: "A10", nome: "PESANTE 14x50", materiale: "PVC", sezione: "14x50", prezzi: { base: 39.70, speciali: 0.80 }, max_l: 2500 },
A16: { codice: "A16", nome: "MINI 10 11x32", materiale: "PVC", sezione: "11x32", prezzi: { base: 54.40, speciali: 0.80 }, max_l: 2000 },
A15: { codice: "A15", nome: "MINI 8 8x33", materiale: "PVC", sezione: "8x33", prezzi: { base: 48.40, speciali: 0.80 }, max_l: 1500 },

// Alluminio Estruso Sicurezza
TA10: { codice: "TA10", nome: "ALUBLIND 13x45", materiale: "Alluminio Sicurezza", sezione: "13x45", prezzi: { ral: 230.00, decoral: 306.00 }, max_l: 4000 },
TA13: { codice: "TA13", nome: "ALUBLIND 9x27", materiale: "Alluminio Sicurezza", sezione: "9x27", prezzi: { ral: 250.00, decoral: 336.00 }, max_l: 3500 },

// Termoisolanti COMBI
A18: { codice: "A18", nome: "COMBI 13x53", materiale: "Termoisolante", sezione: "13x53", prezzi: { unita: 132.00, legno: 136.00 }, max_l: 4200 },
A20: { codice: "A20", nome: "COMBI 10x39", materiale: "Termoisolante", sezione: "10x39", prezzi: { unita: 143.00, legno: 147.00 }, max_l: 2900 }
    },
    
    // Rinforzi PVC (€/mq)
    rinforzi: {
E05: { min: 1250, max: 1730, prezzo: 5.80 },
E10: { min: 1750, max: 2030, prezzo: 6.70 },
E15: { min: 2050, max: 2430, prezzo: 7.90 },
E20: { min: 2450, max: 2830, prezzo: 10.60 },
E25: { min: 2850, max: 3230, prezzo: 13.20 },
E30: { min: 3250, max: 3630, prezzo: 17.20 }
    },
    
    // Accessori
    accessori: {
A30: { nome: "Imballo polietilene", prezzo: 3.50 },
A24: { nome: "Imballo cartone", prezzo: 5.90 }
    },
    
    // Calcola prezzo telo
    calcolaPrezzo: function(codice, L_mm, H_mm, tipoColore = 'unita', coloreSpeciale = false, conRinforzi = false) {
const telo = this.teli[codice];
if (!telo) return { errore: `Codice ${codice} non trovato` };

const L_m = L_mm / 1000;
const H_m = H_mm / 1000;
const mq = L_m * H_m;

let prezzo_mq = telo.prezzi.base || telo.prezzi.ral || telo.prezzi[tipoColore] || telo.prezzi.unita;
if (coloreSpeciale && telo.prezzi.speciali) prezzo_mq += telo.prezzi.speciali;

let prezzo_telo = mq * prezzo_mq;
let prezzo_rinforzi = 0;

if (conRinforzi && telo.materiale === "PVC") {
    for (const [cod, r] of Object.entries(this.rinforzi)) {
        if (L_mm >= r.min && L_mm <= r.max) {
            prezzo_rinforzi = mq * r.prezzo;
            break;
        }
    }
}

const listino = prezzo_telo + prezzo_rinforzi;
const netto = listino * (1 - this.info.sconto);

return {
    codice, modello: telo.nome, materiale: telo.materiale,
    L_mm, H_mm, mq: Math.round(mq * 100) / 100,
    prezzo_mq, prezzo_telo: Math.round(prezzo_telo * 100) / 100,
    prezzo_rinforzi: Math.round(prezzo_rinforzi * 100) / 100,
    listino: Math.round(listino * 100) / 100,
    netto: Math.round(netto * 100) / 100,
    sconto: this.info.sconto * 100
};
    },
    
    // Lista modelli
    getModelli: function() {
return Object.entries(this.teli).map(([cod, t]) => ({
    codice: cod, nome: t.nome, materiale: t.materiale, prezzo_base: t.prezzi.base || t.prezzi.unita || t.prezzi.ral
}));
    }
};

console.log('✅ PLASTICINO_AVVOLGIBILI_2025 v1.1 - Database Tapparelle (18 modelli, rinforzi PVC, guide, sconto 45%)');

// ═══════════════════════════════════════════════════════════════════════════
// 🛤️ GUIDE TAPPARELLE PLASTICINO - Prezzi a COPPIA tagliata/forata
// Fonte: Catalogo Plasticino 07.2022
// ═══════════════════════════════════════════════════════════════════════════
const PLASTICINO_GUIDE = {
    // Guide 30x25x30 - Standard (Argento/Bronzo/Elox/Bianco)
    'TG15OX': { nome: 'Guide 30x25x30 Finestra', dim: '30x25x30', prezzo: 40.00, um: 'CP' },
    'TG10OX': { nome: 'Guide 30x25x30 Portafinestra', dim: '30x25x30', prezzo: 57.60, um: 'CP' },
    // Guide 30x25x30 - RAL (Avorio/Verde/Marrone)
    'TG15VE': { nome: 'Guide 30x25x30 Finestra RAL', dim: '30x25x30', prezzo: 50.90, um: 'CP' },
    'TG10VE': { nome: 'Guide 30x25x30 Portafinestra RAL', dim: '30x25x30', prezzo: 69.00, um: 'CP' },
    // Guide 30x25x30 - RAL a richiesta
    'TG15RA': { nome: 'Guide 30x25x30 Finestra RAL custom', dim: '30x25x30', prezzo: null, um: 'CP' },
    'TG10RA': { nome: 'Guide 30x25x30 Portafinestra RAL custom', dim: '30x25x30', prezzo: null, um: 'CP' },
    
    // Guide 28x19x28 - Standard
    'TG18OX': { nome: 'Guide 28x19x28 Finestra', dim: '28x19x28', prezzo: 36.00, um: 'CP' },
    'TG17OX': { nome: 'Guide 28x19x28 Portafinestra', dim: '28x19x28', prezzo: 52.00, um: 'CP' },
    // Guide 28x19x28 - RAL
    'TG18VE': { nome: 'Guide 28x19x28 Finestra RAL', dim: '28x19x28', prezzo: 50.90, um: 'CP' },
    'TG17VE': { nome: 'Guide 28x19x28 Portafinestra RAL', dim: '28x19x28', prezzo: 69.00, um: 'CP' },
    
    // Guide 28x17x28 - Standard (ribassate)
    'TG25OX': { nome: 'Guide 28x17x28 Finestra', dim: '28x17x28', prezzo: 40.00, um: 'CP' },
    'TG20OX': { nome: 'Guide 28x17x28 Portafinestra', dim: '28x17x28', prezzo: 57.60, um: 'CP' },
    // Guide 28x17x28 - RAL
    'TG25VE': { nome: 'Guide 28x17x28 Finestra RAL', dim: '28x17x28', prezzo: 50.90, um: 'CP' },
    'TG20VE': { nome: 'Guide 28x17x28 Portafinestra RAL', dim: '28x17x28', prezzo: 69.00, um: 'CP' },
    // Guide 28x17x28 Ribassato - Standard
    'TG25RIBOX': { nome: 'Guide 28x17x28 Rib. Finestra', dim: '28x17x28', prezzo: 40.00, um: 'CP' },
    'TG20RIBOX': { nome: 'Guide 28x17x28 Rib. Portafinestra', dim: '28x17x28', prezzo: 57.60, um: 'CP' },
    
    // Barre 6800mm (prezzo al ML)
    'TG30': { nome: 'Barre 30x25x30 6800mm', dim: '30x25x30', prezzo: 11.40, um: 'ML' },
    'TG33': { nome: 'Barre 28x19x28 6800mm', dim: '28x19x28', prezzo: 10.20, um: 'ML' },
    'TG35': { nome: 'Barre 28x17x28 6800mm', dim: '28x17x28', prezzo: 9.70, um: 'ML' },
    'TG35RIB': { nome: 'Barre 28x17x28 Rib. 6800mm', dim: '28x17x28', prezzo: 9.70, um: 'ML' },
    
    // Ferro Zincato 21x20x21
    'PF2OX': { nome: 'Guide 21x20x21 Ferro Zn Finestra', dim: '21x20x21', prezzo: 20.00, um: 'CP' },
    'PF4OX': { nome: 'Guide 21x20x21 Ferro Zn Portafinestra', dim: '21x20x21', prezzo: 30.00, um: 'CP' },
    'PF1': { nome: 'Barre 21x20x21 Ferro Zn', dim: '21x20x21', prezzo: 5.50, um: 'ML' }
};

const PLASTICINO_COLORI_GUIDE = {
    standard: ['Argento', 'Bronzo', 'Elox', 'Bianco'],
    ral: ['Avorio RAL 1013', 'Verde RAL 6005', 'Marrone RAL 8014', 'Marrone RAL 8017', 'Marrone RAL 8019']
};

/**
 * Calcola prezzo guida tapparella
 * @param {string} codiceGuida - es. "TG20 - Guide 28x17x28 Portafinestra"
 * @param {string} coloreGuida - es. "Argento"
 * @param {number} altezzaMm - Altezza in mm (per barre ML)
 * @returns {Object} { codice, descrizione, prezzo, um }
 */
function calcolaPrezzoGuida(codiceGuida, coloreGuida = 'Argento', altezzaMm = null) {
    if (!codiceGuida) return { codice: '', prezzo: 0, note: 'Nessuna guida' };
    
    // Estrai codice base (es. "TG20 - Guide..." → "TG20")
    let codice = codiceGuida;
    if (codiceGuida.includes(' - ')) {
        codice = codiceGuida.split(' - ')[0].trim();
    }
    // Rimuovi eventuale suffisso RIB per lookup
    const codiceBase = codice.replace('RIB', '');
    const isRibassato = codice.includes('RIB');
    
    // Determina variante colore
    const isStandard = PLASTICINO_COLORI_GUIDE.standard.includes(coloreGuida);
    const isRAL = PLASTICINO_COLORI_GUIDE.ral.includes(coloreGuida);
    
    // Costruisci codice effettivo
    let codiceEffettivo = codice;
    // Per guide con varianti colore (TG10/15/18/17/20/25)
    if (!codice.includes('OX') && !codice.includes('VE') && !codice.includes('RA') && !codice.startsWith('PF')) {
        if (isRibassato) {
            codiceEffettivo = codice + (isRAL ? 'VE' : 'OX'); // TG20RIB → TG20RIBOX
        } else {
            const suffix = isRAL ? 'VE' : (isStandard ? 'OX' : 'RA');
            codiceEffettivo = codice + suffix;
        }
    }
    
    // Cerca nel database
    let guida = PLASTICINO_GUIDE[codiceEffettivo];
    
    // Fallback: prova con OX se non trovato
    if (!guida) guida = PLASTICINO_GUIDE[codice + 'OX'];
    if (!guida) guida = PLASTICINO_GUIDE[codice];
    
    if (!guida) {
        console.warn(`⚠️ Guida non trovata: ${codiceEffettivo} (da ${codiceGuida})`);
        return { codice: codiceEffettivo, prezzo: 0, note: 'Guida non trovata' };
    }
    
    if (guida.prezzo === null) {
        return { codice: codiceEffettivo, descrizione: guida.nome, prezzo: 0, um: guida.um, note: 'A PREVENTIVO' };
    }
    
    let prezzoFinale = guida.prezzo;
    
    // Se ML, calcola in base all'altezza (2 guide)
    if (guida.um === 'ML' && altezzaMm) {
        const metriLineari = (altezzaMm / 1000) * 2;
        prezzoFinale = Math.round(guida.prezzo * metriLineari * 100) / 100;
    }
    
    console.log(`🛤️ Guida ${codiceEffettivo}: €${prezzoFinale} (${guida.um}) [${coloreGuida}]`);
    
    return {
        codice: codiceEffettivo,
        descrizione: guida.nome,
        colore: coloreGuida,
        prezzo: prezzoFinale,
        um: guida.um
    };
}

// Export
if (typeof window !== 'undefined') {
    window.PLASTICINO_AVVOLGIBILI_2025 = PLASTICINO_AVVOLGIBILI_2025;
    window.PLASTICINO_GUIDE = PLASTICINO_GUIDE;
    window.PLASTICINO_COLORI_GUIDE = PLASTICINO_COLORI_GUIDE;
    window.calcolaPrezzoGuida = calcolaPrezzoGuida;
}
