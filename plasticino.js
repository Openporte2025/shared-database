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

console.log('✅ PLASTICINO_AVVOLGIBILI_2025 v1.0 - Database Tapparelle (18 modelli, rinforzi PVC, sconto 45%)');
