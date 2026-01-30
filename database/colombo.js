/**
 * COLOMBO DESIGN DATABASE 2025
 * Maniglie per Porte - Prezzi da Ferramenta Venerota
 * 
 * SCONTO INSTALLATORE: 40%
 * Fonte: store.venerota.it (Dicembre 2025)
 * 
 * @version 1.0
 * @date 11/12/2025
 */

const COLOMBO_2025 = {
    
    // ==================== INFORMAZIONI GENERALI ====================
    info: {
nome: "COLOMBO DESIGN",
anno: "2025",
sconto: 0.40,
tipo: "maniglie",
materiale: "Ottone / Acciaio Inox",
produzione: "Made in Italy dal 1991",
fonte: "Ferramenta Venerota",
note: "Prezzi per coppia con rosetta/placca"
    },

    // ==================== MANIGLIE ====================
    // Prezzi LISTINO (il prezzo netto si calcola con sconto 40%)
    maniglie: {
// === SERIE ROBOT (Entry Level) ===
ROBOT: {
    nome: "Robot",
    rosetta_tonda: { listino: 35.33, netto: 21.20 },
    rosetta_stretta: { listino: 61.70, netto: 37.02 },
    placca: { listino: 57.20, netto: 34.32 }
},
ROBODUE: {
    nome: "Robodue",
    rosetta_tonda: { listino: 45.40, netto: 27.24 },
    rosetta_stretta: { listino: 64.40, netto: 38.64 }
},
ROBOTRE: {
    nome: "Robotre",
    rosetta_tonda: { listino: 37.33, netto: 22.40 },
    rosetta_stretta: { listino: 55.50, netto: 33.30 }
},
ROBOQUATTRO: {
    nome: "Roboquattro",
    rosetta_tonda: { listino: 37.33, netto: 22.40 },
    rosetta_stretta: { listino: 63.10, netto: 37.86 }
},
ROBOQUATTRO_S: {
    nome: "Roboquattro S",
    rosetta_quadra: { listino: 54.17, netto: 32.50 }
},
ROBOCINQUE: {
    nome: "Robocinque",
    rosetta_tonda: { listino: 52.30, netto: 31.38 }
},
ROBOCINQUE_S: {
    nome: "Robocinque S",
    rosetta_quadra: { listino: 56.50, netto: 33.90 },
    rosetta_stretta: { listino: 80.50, netto: 48.40 }
},

// === SERIE DESIGN ===
ALBA: {
    nome: "Alba",
    rosetta_quadra_bassa: { listino: 107.80, netto: 64.38 }
},
BLAZER: {
    nome: "Blazer",
    rosetta_tonda: { listino: 77.10, netto: 46.26 }
},
DEA: {
    nome: "Dea",
    rosetta_quadra_bassa: { listino: 141.80, netto: 85.08 }
},
EDO: {
    nome: "Edo",
    rosetta_tonda: { listino: 78.20, netto: 46.92 }
},
ELECTRA: {
    nome: "Electra",
    rosetta_quadra_bassa: { listino: 97.70, netto: 58.62 }
},
ELLE: {
    nome: "Elle",
    rosetta_tonda: { listino: 95.60, netto: 57.36 }
},
ELLESSE: {
    nome: "Ellesse",
    rosetta_quadra: { listino: 99.80, netto: 59.88 },
    rosetta_quadra_bassa: { listino: 139.10, netto: 83.46 }
},
ESPRIT: {
    nome: "Esprit",
    rosetta_quadra_bassa: { listino: 132.20, netto: 79.32 }
},
FEDRA: {
    nome: "Fedra",
    rosetta_quadra_bassa: { listino: 111.50, netto: 66.90 }
},
FLESSA: {
    nome: "Flessa",
    rosetta_tonda: { listino: 137.00, netto: 82.20 }
},
GIRA: {
    nome: "Gira",
    rosetta_tonda: { listino: 105.50, netto: 63.30 }
},
HEIDI: {
    nome: "Heidi",
    rosetta_tonda: { listino: 88.40, netto: 53.04 }
},
ISY: {
    nome: "Isy",
    rosetta_quadra: { listino: 111.30, netto: 66.78 },
    rosetta_quadra_bassa: { listino: 131.00, netto: 78.60 }
},
LUND: {
    nome: "Lund",
    rosetta_tonda_bassa: { listino: 94.30, netto: 56.58 }
},
MACH: {
    nome: "Mach",
    rosetta_tonda: { listino: 54.80, netto: 32.88 },
    rosetta_stretta: { listino: 66.80, netto: 40.08 },
    ribassata_stretta: { listino: 76.90, netto: 46.14 }
},
MADI: {
    nome: "Madi",
    rosetta_tonda: { listino: 83.70, netto: 50.22 }
},
META: {
    nome: "Meta",
    rosetta_tonda: { listino: 101.50, netto: 60.90 }
},
MILLA: {
    nome: "Milla",
    rosetta_tonda: { listino: 87.60, netto: 52.56 },
    rosetta_tonda_LC31: { listino: 92.10, netto: 55.26 }
},
OLLY: {
    nome: "Olly",
    rosetta_tonda: { listino: 82.40, netto: 49.44 }
},
PEGASO: {
    nome: "Pegaso",
    rosetta_tonda: { listino: 101.70, netto: 61.02 }
},
PETER: {
    nome: "Peter",
    rosetta_tonda: { listino: 89.80, netto: 53.88 }
},
PRIUS: {
    nome: "Prius",
    rosetta_quadra: { listino: 150.70, netto: 90.42 }
},
SIRIO: {
    nome: "Sirio",
    rosetta_tonda: { listino: 81.20, netto: 48.72 }
},
SLIM: {
    nome: "Slim",
    rosetta_tonda_bassa: { listino: 95.50, netto: 57.30 }
},
SPIDER: {
    nome: "Spider",
    rosetta_quadra: { listino: 136.70, netto: 82.02 }
},
STAR: {
    nome: "Star",
    rosetta_tonda: { listino: 78.80, netto: 47.28 }
},
TAILLA: {
    nome: "Tailla",
    rosetta_tonda: { listino: 99.80, netto: 59.88 }
},
TAIPAN: {
    nome: "Taipan",
    rosetta_tonda: { listino: 94.70, netto: 56.82 }
},
TENDER: {
    nome: "Tender",
    rosetta_tonda: { listino: 73.50, netto: 44.10 }
},
TOOL: {
    nome: "Tool",
    rosetta_tonda: { listino: 105.50, netto: 63.30 }
},
VIOLA: {
    nome: "Viola",
    rosetta_tonda: { listino: 85.50, netto: 51.30 }
},
WING: {
    nome: "Wing",
    rosetta_tonda: { listino: 115.70, netto: 69.42 }
},
ZELDA: {
    nome: "Zelda",
    rosetta_quadra: { listino: 148.50, netto: 89.10 },
    rosetta_quadra_bassa: { listino: 154.40, netto: 92.64 }
}
    },

    // ==================== FINITURE DISPONIBILI ====================
    finiture: {
CR: { nome: "Cromo lucido", codice: "CR" },
CS: { nome: "Cromo satinato", codice: "CS" },
HPS: { nome: "HPS (antigrafio)", codice: "HPS" },
NM: { nome: "Nero opaco", codice: "NM" },
OM: { nome: "Oro opaco", codice: "OM" },
GM: { nome: "Grafite opaco", codice: "GM" },
BM: { nome: "Bronzo opaco", codice: "BM" },
WM: { nome: "Bianco opaco", codice: "WM" },
ZN: { nome: "Zirconio nero", codice: "ZN" },
VL: { nome: "Vintage ottone", codice: "VL" },
PVD_GOLD: { nome: "PVD Oro", codice: "PVD-GO" },
PVD_BLACK: { nome: "PVD Nero", codice: "PVD-BK" }
    }
};

// ==================== FUNZIONE CALCOLO PREZZO ====================
function calcolaPrezzoColombo(modello, tipo_rosetta) {
    const maniglia = COLOMBO_2025.maniglie[modello.toUpperCase()];
    if (!maniglia) {
return { errore: `Modello ${modello} non trovato` };
    }
    
    const variante = maniglia[tipo_rosetta];
    if (!variante) {
return { errore: `Tipo rosetta ${tipo_rosetta} non disponibile per ${modello}` };
    }
    
    return {
modello: maniglia.nome,
tipo: tipo_rosetta,
listino: variante.listino,
netto: variante.netto,
sconto: COLOMBO_2025.info.sconto * 100 + '%'
    };
}

// ==================== LISTA MODELLI ====================
function listaModelliColombo() {
    const lista = [];
    for (const [codice, dati] of Object.entries(COLOMBO_2025.maniglie)) {
const varianti = Object.keys(dati).filter(k => k !== 'nome');
const prezzoMin = Math.min(...varianti.map(v => dati[v].netto));
lista.push({
    codice: codice,
    nome: dati.nome,
    varianti: varianti,
    prezzo_da: prezzoMin
});
    }
    return lista.sort((a, b) => a.prezzo_da - b.prezzo_da);
}

console.log('✅ COLOMBO-DATABASE-2025 caricato - ' + Object.keys(COLOMBO_2025.maniglie).length + ' modelli');
