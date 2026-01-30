// ============================================================================
// 🔧 OLIVARI MANIGLIE 2025 - Listino N°55
// ============================================================================
/**
 * OLIVARI DATABASE 2025
 * Maniglie e Accessori - Listino NÂ°55 Gennaio 2025
 * 
 * SCONTO INSTALLATORE: 40% + 5% = 43% effettivo
 * Calcolo: 100 Ã— 0.60 Ã— 0.95 = 57.00 (netto 57%, sconto 43%)
 * 
 * NOTA: Aumento 4% previsto dal 01/01/2026
 * 
 * @version 1.0
 * @date 11/12/2025
 */

const OLIVARI_2025 = {
    
    // ==================== INFORMAZIONI GENERALI ====================
    info: {
nome: "OLIVARI",
listino: "NÂ°55",
anno: "Gennaio 2025",
sconto_1: 0.40,
sconto_2: 0.05,
sconto_effettivo: 0.43,  // 1 - (0.60 Ã— 0.95) = 0.43
tipo: "maniglie",
materiale: "Ottone",
produzione: "Made in Italy dal 1911",
minimo_ordine: 250,  // â‚¬ Italia
validita: "31/12/2025",
note: "Prezzi per coppia (maniglie/pomoli) o pezzo (cremonesi/DK)"
    },

    // ==================== FINITURE ====================
    finiture: {
// CROMO - Garanzia 10 anni
CR: { nome: "Cromo lucido", codice: "CR", garanzia: 10, maggiorazione: 0 },
CO: { nome: "Cromo satinato", codice: "CO", garanzia: 10, maggiorazione: 0.09 },

// SUPERFINISHÂ® - Garanzia 30 anni
ZL: { nome: "SuperOro lucido", codice: "ZL", garanzia: 30, maggiorazione: 0.22 },
TS: { nome: "SuperOro satinato", codice: "TS", garanzia: 30, maggiorazione: 0.27 },
NL: { nome: "SuperNichel lucido", codice: "NL", garanzia: 30, maggiorazione: 0.22 },
NS: { nome: "SuperNichel satinato", codice: "NS", garanzia: 30, maggiorazione: 0.27 },
IS: { nome: "SuperInox satinato", codice: "IS", garanzia: 30, maggiorazione: 0.21 },

// SUPERFINISHÂ® - Garanzia 10 anni
RS: { nome: "SuperRame satinato", codice: "RS", garanzia: 10, maggiorazione: 0.33 },
DS: { nome: "SuperBronzo satinato", codice: "DS", garanzia: 10, maggiorazione: 0.33 },
US: { nome: "SuperAntracite satinato", codice: "US", garanzia: 10, maggiorazione: 0.28 },

// ALTRI
NP: { nome: "Nero opaco", codice: "NP", garanzia: 5, maggiorazione: -0.03 },
BP: { nome: "Bianco opaco", codice: "BP", garanzia: 5, maggiorazione: -0.03 },

// COMBINAZIONI
CD: { nome: "Cromo lucido + bianco", codice: "CD", garanzia: 10, maggiorazione: -0.28 },
MD: { nome: "Cromo satinato + bianco", codice: "MD", garanzia: 10, maggiorazione: -0.19 }
    },

    // ==================== MODELLI MANIGLIE ====================
    // Prezzi base in Cromo lucido (CR) per coppia
    // Formato: { rosette, verticali, placca, magnetica }
    maniglie: {
// DESIGN ICONICI
ABC: { codice: 255, designer: "OMA/Rem Koolhaas", rosette: 176.45, verticali: 176.45, placca: 236.45 },
ADAMANT: { codice: 216, designer: "Patricia Urquiola", rosette: 222.60, verticali: 237.20, placca: 292.80 },
AGATA: { codice: 116, designer: "Franco Albini/Franca Helg", rosette: 127.60, verticali: 142.90, placca: 198.10, magnetica: 148.65 },
ALA: { codice: 215, designer: "Studio Olivari", rosette: 146.75, verticali: 162.05, placca: 217.25, magnetica: 167.80 },
ALBA: { codice: 267, designer: "Studio Olivari", rosette: 231.90, verticali: 231.90, placca: 291.90 },
ALEXANDRA: { codice: 150, designer: "Studio Olivari", rosette: 99.95, verticali: 115.25, placca: 170.45, magnetica: 121.00 },
ARC: { codice: 225, designer: "Studio Olivari", rosette: 227.15, verticali: 227.15, placca: 287.00 },
ASTER: { codice: 174, designer: "Studio Olivari", rosette: 158.10, verticali: 173.40, placca: 228.60, magnetica: 179.15 },
ATENA_LIGNE: { codice: "1AL", designer: "Studio Olivari", rosette: 245.60, verticali: 245.60, placca: 305.60 },
ATENA_PANIER: { codice: "1AP", designer: "Studio Olivari", rosette: 263.35, verticali: 263.35, placca: 323.35 },
ATENA_RANK: { codice: "1AR", designer: "Studio Olivari", rosette: 291.95, verticali: 291.95, placca: 351.95 },
AURELIA: { codice: 185, designer: "Studio Olivari", rosette: 163.40, verticali: 178.70, placca: 233.90, magnetica: 184.45 },
AURORA: { codice: 164, designer: "Studio Olivari", rosette: 134.65, verticali: 134.65, placca: 194.50 },
BAU: { codice: 263, designer: "Studio Olivari", rosette: 229.05, verticali: 229.05, placca: 288.90 },
BEIJING: { codice: 208, designer: "Studio Olivari", rosette: 188.85, verticali: 188.85, placca: 248.85 },
BETA: { codice: 221, designer: "Studio Olivari", rosette: 155.35, verticali: 155.35, placca: 215.20 },
BIOS: { codice: 204, designer: "Studio Olivari", rosette: 154.80, verticali: 154.80, placca: 214.65 },
BLADE: { codice: 213, designer: "Studio Olivari", rosette: 170.30, verticali: 170.30, placca: 230.15 },
BOND: { codice: 163, designer: "Studio Olivari", rosette: 80.60, verticali: 95.90, placca: 151.10, magnetica: 101.65 },
CHELSEA: { codice: 232, designer: "Studio Olivari", rosette: 150.05, verticali: 150.05, placca: 209.90 },
CHEVRON: { codice: 248, designer: "Studio Olivari", rosette: 306.00, verticali: 306.00, placca: 366.00 },
CHIARA: { codice: 125, designer: "Studio Olivari", rosette: 94.55, verticali: 109.85, placca: 165.05, magnetica: 115.60 },
CLUB: { codice: 181, designer: "Studio Olivari", rosette: 100.40, verticali: 115.70, placca: 170.90, magnetica: 121.45 },
COMET: { codice: 183, designer: "Studio Olivari", rosette: 120.40, verticali: 120.40, placca: 180.25 },
CONCA: { codice: 236, designer: "Patricia Urquiola", rosette: 152.75, verticali: 152.75, placca: 212.60 },
CONCA_L: { codice: 272, designer: "Patricia Urquiola", rosette: 204.55, verticali: 219.15, placca: 274.75 },
CONO: { codice: 265, designer: "Luigi Caccia Dominioni", rosette: 131.70, verticali: 131.70, placca: 191.55 },
CRYSTAL_DIAMOND: { codice: 246, designer: "Studio Olivari", rosette: 248.50, verticali: 248.50, placca: 308.40 },
CRYSTALROYAL: { codice: 245, designer: "Studio Olivari", rosette: 255.60, verticali: 255.60, placca: 315.45 },
DENVER: { codice: 218, designer: "Studio Olivari", rosette: 144.75, verticali: 144.75, placca: 204.60 },
DIANA: { codice: 206, designer: "Studio Olivari", rosette: 137.35, verticali: 152.65, placca: 207.85, magnetica: 158.40 },
DIANA_BARLEY: { codice: "1DB", designer: "Studio Olivari", rosette: 217.70, verticali: 232.30, placca: 287.90 },
DIANA_CHEVRON: { codice: "1DC", designer: "Studio Olivari", rosette: 232.35, verticali: 246.95, placca: 302.55 },
DIANA_DAMIER: { codice: "1DD", designer: "Studio Olivari", rosette: 227.60, verticali: 242.20, placca: 297.80 },
DIVA: { codice: 256, designer: "Studio Olivari", rosette: 192.90, verticali: 192.90, placca: 252.75 },
DOLCE_VITA: { codice: 243, designer: "Studio Olivari", rosette: 141.95, verticali: 141.95, placca: 201.80 },
DYNAMIC: { codice: 261, designer: "Studio Olivari", rosette: 235.35, verticali: 235.35, placca: 295.35 },
EMILIA: { codice: 167, designer: "Studio Olivari", rosette: 106.85, verticali: 122.15, placca: 177.35, magnetica: 127.90 },
EUCLIDE: { codice: 229, designer: "Studio Olivari", rosette: 144.10, verticali: 144.10, placca: 203.95 },
EUCLIDE_Q: { codice: 230, designer: "Studio Olivari", rosette: 185.40, verticali: 185.40, placca: 245.25 },
FIN: { codice: 217, designer: "Studio Olivari", rosette: 131.25, verticali: 131.25, placca: 191.10 },
FLAMINIA: { codice: 159, designer: "Studio Olivari", rosette: 107.40, verticali: 107.40, placca: 167.25 },
FLUTE: { codice: 270, designer: "Studio Olivari", rosette: 116.95, verticali: 132.25, placca: 187.45, magnetica: 138.00 },
FUTURA: { codice: 172, designer: "Studio Olivari", rosette: 121.05, verticali: 136.35, placca: 191.55, magnetica: 142.10 },
GARDA: { codice: 105, designer: "Studio Olivari", rosette: 77.80, verticali: 93.10, placca: 148.40, magnetica: 98.85 },
GLORIA: { codice: 268, designer: "Studio Olivari", rosette: 141.45, verticali: 141.45, placca: 201.45 },
GLORIA_Q: { codice: 269, designer: "Studio Olivari", rosette: 146.05, verticali: 146.05, placca: 206.05 },
GOLIA: { codice: 160, designer: "Studio Olivari", rosette: 112.00, verticali: 112.00, placca: 171.85 },
HYBRID: { codice: 271, designer: "Studio Olivari", rosette: 126.45, verticali: 126.45, placca: 186.30 },  // cromo+bianco
ICE_CUBE: { codice: 223, designer: "Studio Olivari", rosette: 266.60, verticali: null, placca: null },  // solo rosette
ICONA: { codice: 254, designer: "Studio Olivari", rosette: 137.35, verticali: 152.65, placca: 207.85, magnetica: 158.40 },
LAMA: { codice: 107, designer: "Studio Olivari", rosette: 123.85, verticali: 139.15, placca: 194.35, magnetica: 144.90 },
LAMA_L: { codice: 106, designer: "Studio Olivari", rosette: 155.45, verticali: 163.75, placca: null },
LASER: { codice: 176, designer: "Studio Olivari", rosette: 170.40, verticali: 178.70, placca: null },
LINK: { codice: 200, designer: "Studio Olivari", rosette: 152.05, verticali: 160.35, placca: null },
LIPSTICK: { codice: 273, designer: "Studio Olivari", rosette: 143.20, verticali: 151.50, placca: null },
LIVING: { codice: 222, designer: "Studio Olivari", rosette: 134.95, verticali: 143.25, placca: null },
LOGO_L: { codice: 198, designer: "Studio Olivari", rosette: 175.40, verticali: 183.70, placca: null },
LOTUS: { codice: 238, designer: "Studio Olivari", rosette: 170.95, verticali: 179.25, placca: null },
LOTUS_Q: { codice: 241, designer: "Studio Olivari", rosette: 179.55, verticali: 187.85, placca: null },
LUCY: { codice: 231, designer: "Studio Olivari", rosette: 100.50, verticali: 108.80, placca: null },
LUGANO: { codice: 258, designer: "Studio Olivari", rosette: 103.30, verticali: 111.60, placca: null },
MARBELLA: { codice: 237, designer: "Studio Olivari", rosette: 104.65, verticali: 112.95, placca: null },
MARILYN: { codice: 252, designer: "Studio Olivari", rosette: 153.90, verticali: 162.20, placca: null },
MELANZANA: { codice: 266, designer: "Luigi Caccia Dominioni", rosette: 155.90, verticali: 155.90, placca: 215.75 },
MILANO: { codice: 259, designer: "Studio Olivari", rosette: 109.10, verticali: 117.40, placca: null },
MILANO_Q: { codice: 260, designer: "Studio Olivari", rosette: 121.50, verticali: 129.80, placca: null },
MINERVA: { codice: 205, designer: "Studio Olivari", rosette: 137.05, verticali: 145.35, placca: null },
NINA: { codice: 234, designer: "Studio Olivari", rosette: 71.50, verticali: 79.80, placca: null },
NOVELLA: { codice: 165, designer: "Studio Olivari", rosette: 83.45, verticali: 91.75, placca: null },
OKAY: { codice: 262, designer: "Studio Olivari", rosette: 81.45, verticali: 89.75, placca: null },
ONDA: { codice: 175, designer: "Studio Olivari", rosette: 74.75, verticali: 83.05, placca: null },
OPEN: { codice: 249, designer: "Studio Olivari", rosette: 76.00, verticali: 84.30, placca: null },
ORVIETO: { codice: 170, designer: "Studio Olivari", rosette: 93.05, verticali: 101.35, placca: null },
PADDLE: { codice: 264, designer: "Studio Olivari", rosette: 76.55, verticali: 84.85, placca: null },
PLANET: { codice: 195, designer: "Studio Olivari", rosette: 132.00, verticali: 147.30, placca: 202.50, magnetica: 153.05 },
PLANET_Q: { codice: 203, designer: "Studio Olivari", rosette: 166.50, verticali: 180.70, placca: 236.70 },
PLUME: { codice: 253, designer: "Studio Olivari", rosette: 66.30, verticali: 74.60, placca: null },
RADIAL: { codice: 235, designer: "Studio Olivari", rosette: 66.90, verticali: 75.20, placca: null },
RAFFAELLA: { codice: 128, designer: "Studio Olivari", rosette: 62.25, verticali: 70.55, placca: null },
SECTOR: { codice: 186, designer: "Studio Olivari", rosette: 47.05, verticali: 55.35, placca: null },
SERENELLA: { codice: 130, designer: "Studio Olivari", rosette: 61.55, verticali: 69.85, placca: null },
SIBILLA: { codice: 154, designer: "Studio Olivari", rosette: 57.10, verticali: 65.40, placca: null },
SIENA: { codice: 169, designer: "Studio Olivari", rosette: 72.35, verticali: 80.65, placca: null },
SKY: { codice: 214, designer: "Studio Olivari", rosette: 82.55, verticali: 90.85, placca: null },
STILO: { codice: 190, designer: "Studio Olivari", rosette: 57.15, verticali: 65.45, placca: null },
TECNO: { codice: 182, designer: "Studio Olivari", rosette: 68.15, verticali: 76.45, placca: null },
TIME: { codice: 192, designer: "Studio Olivari", rosette: 47.55, verticali: 55.85, placca: null },
TIME_Q: { codice: 201, designer: "Studio Olivari", rosette: 89.40, verticali: 97.70, placca: null },
TIZIANELLA_F: { codice: 112, designer: "Studio Olivari", rosette: 92.60, verticali: 100.90, placca: null },
TOTAL: { codice: 207, designer: "Studio Olivari", rosette: 96.75, verticali: 105.05, placca: null },
TREND: { codice: 228, designer: "Studio Olivari", rosette: 115.55, verticali: 123.85, placca: null },
TWIST: { codice: 242, designer: "Studio Olivari", rosette: 137.70, verticali: 146.00, placca: null },
UOVO: { codice: 108, designer: "Studio Olivari", rosette: 138.85, verticali: 154.15, placca: 209.35, magnetica: 159.90 },
VIRGOLA: { codice: 251, designer: "Studio Olivari", rosette: 83.55, verticali: 91.85, placca: null },
VOLA: { codice: 257, designer: "Max Pajetta", rosette: 192.90, verticali: 192.90, placca: 252.75 },
WIND: { codice: 187, designer: "Studio Olivari", rosette: 109.50, verticali: 124.80, placca: 180.00, magnetica: 130.55 }
    },

    // ==================== CREMONESI (per finestre) ====================
    // Prezzi in Cromo lucido (CR) per PEZZO
    cremonesi: {
ABC: { senza_mov: 97.65, con_mov: 105.95, dk_4scatti: 105.95, dk_sicurezza: 130.00 },
ADAMANT: { senza_mov: 123.85, con_mov: 132.15, dk_4scatti: 132.15, dk_sicurezza: 156.20 },
AGATA: { senza_mov: 75.90, con_mov: 84.20, dk_4scatti: 84.20, dk_sicurezza: 108.25 },
ALA: { senza_mov: 94.75, con_mov: 103.05, dk_4scatti: 103.05, dk_sicurezza: 127.10 },
ASTER: { senza_mov: 101.15, con_mov: 109.45, dk_4scatti: 109.45, dk_sicurezza: 133.50 },
BOND: { senza_mov: 47.05, con_mov: 55.35, dk_4scatti: 55.35, dk_sicurezza: 79.40 },
CHIARA: { senza_mov: 57.10, con_mov: 65.40, dk_4scatti: 65.40, dk_sicurezza: 89.45 },
CLUB: { senza_mov: 62.25, con_mov: 70.55, dk_4scatti: 70.55, dk_sicurezza: 94.60 },
DIANA: { senza_mov: 89.40, con_mov: 97.70, dk_4scatti: 97.70, dk_sicurezza: 121.75 },
EMILIA: { senza_mov: 57.15, con_mov: 65.45, dk_4scatti: 65.45, dk_sicurezza: 89.50 },
FUTURA: { senza_mov: 71.50, con_mov: 79.80, dk_4scatti: 79.80, dk_sicurezza: 103.85 },
GARDA: { senza_mov: 47.55, con_mov: 55.85, dk_4scatti: 55.85, dk_sicurezza: 79.90 },
ICONA: { senza_mov: 82.55, con_mov: 90.85, dk_4scatti: 90.85, dk_sicurezza: 114.90 },
LAMA: { senza_mov: 71.50, con_mov: 79.80, dk_4scatti: 79.80, dk_sicurezza: 103.85 },
PLANET: { senza_mov: 83.30, con_mov: 92.80, dk_4scatti: 92.80, dk_sicurezza: 116.85 },
UOVO: { senza_mov: 87.90, con_mov: 97.40, dk_4scatti: 97.40, dk_sicurezza: 121.45 },
VOLA: { senza_mov: 126.70, con_mov: 135.00, dk_4scatti: 135.00, dk_sicurezza: 159.05 },
WIND: { senza_mov: 68.15, con_mov: 76.45, dk_4scatti: 76.45, dk_sicurezza: 100.50 }
    },

    // ==================== POMOLI ====================
    // Prezzi in Cromo lucido (CR) per coppia (pomoli zancati) o pezzo (fissi)
    pomoli: {
// POMOLI ZANCATI (offset)
BLINDO: { codice: 178, coppia: 137.35, fisso: 86.85 },
CONCA: { codice: 236, coppia: 152.75, fisso: 90.65 },
MELANZANA: { codice: 266, coppia: 155.90, fisso: 98.40 },
PLANET: { codice: 195, coppia: 132.00, fisso: 83.30 },
PLANET_Q: { codice: 203, coppia: 166.50, fisso: 103.90 },
UOVO: { codice: 108, coppia: 138.85, fisso: 87.90 },

// POMOLI CENTRALI
DIANA_CENTRALE: { codice: 206, coppia: 188.40, fisso: 113.05 }
    },

    // ==================== BOCCHETTE ====================
    // Prezzi in Cromo lucido (CR) per coppia
    bocchette: {
// TONDE
tonde_patent: { codice: 1151, prezzo: 25.80 },
tonde_yale: { codice: 1152, prezzo: 25.80 },
tonde_B_patent: { codice: "1501B", prezzo: 35.20 },
tonde_B_yale: { codice: "1502B", prezzo: 35.20 },

// VERTICALI
verticali_patent: { codice: 1154, prezzo: 27.60 },
verticali_yale: { codice: 1155, prezzo: 27.60 },
verticali_B_patent: { codice: "1511B", prezzo: 37.00 },
verticali_B_yale: { codice: "1512B", prezzo: 37.00 },

// QUADRATE
quadrate_patent: { codice: 1201, prezzo: 32.40 },
quadrate_yale: { codice: 1202, prezzo: 32.40 },
quadrate_B_patent: { codice: "1521B", prezzo: 41.80 },
quadrate_B_yale: { codice: "1522B", prezzo: 41.80 }
    },

    // ==================== CHIAVISTELLI ====================
    // Prezzi in Cromo lucido (CR) per pezzo
    chiavistelli: {
H106V6: { descrizione: "Chiavistello rettangolare", prezzo: 38.50 },
H106V6B: { descrizione: "Chiavistello rettangolare basso", prezzo: 48.20 },
H136V6: { descrizione: "Chiavistello tondo", prezzo: 42.30 },
H136V6B: { descrizione: "Chiavistello tondo basso", prezzo: 52.00 },
H200V6: { descrizione: "Chiavistello ovale", prezzo: 36.80 },
H200V6B: { descrizione: "Chiavistello ovale basso", prezzo: 46.50 },
H202V6: { descrizione: "Chiavistello quadrato", prezzo: 44.60 },
H202V6B: { descrizione: "Chiavistello quadrato basso", prezzo: 54.30 }
    },

    // ==================== MANIGLIONI ====================
    // Prezzi in Cromo lucido (CR) per pezzo
    maniglioni: {
// STANDARD (interasse 300mm)
standard_300: {
    CR: 197.85,
    CO: 218.55,
    NS: 257.20,
    IS: 257.20,
    RS: 304.35,
    DS: 304.35,
    US: 289.00
},
// STANDARD (interasse 400mm)
standard_400: {
    CR: 227.60,
    CO: 251.20,
    NS: 295.85,
    IS: 295.85,
    RS: 350.00,
    DS: 350.00,
    US: 332.35
},
// STANDARD (interasse 600mm)
standard_600: {
    CR: 287.10,
    CO: 316.90,
    NS: 373.30,
    IS: 373.30,
    RS: 441.60,
    DS: 441.60,
    US: 419.30
}
    },

    // ==================== FERMAPORTE ====================
    fermaporte: {
a_pavimento: { CR: 29.00, CO: 32.50, NS: 38.50, IS: 38.50 },
a_parete: { CR: 24.00, CO: 27.00, NS: 32.00, IS: 32.00 },
magnetico: { CR: 45.00, CO: 50.00, NS: 59.00, IS: 59.00 }
    },

    // ==================== SUPPLEMENTI ====================
    supplementi: {
// Ferro quadro speciale
ferro_9mm: 8.50,    // invece di 8mm standard
ferro_10mm: 12.00,

// Spessori porta non standard
porta_63_75mm: 15.00,
porta_75_90mm: 25.00,

// Rosette/placche alte invece di basse
rosette_alte: 12.00,
placche_alte: 18.00,

// Finiture speciali su richiesta
finitura_speciale_min: 150.00  // quantitÃ  minima richiesta
    }
};

// ==================== FUNZIONE CALCOLO PREZZO ====================
function calcolaPrezzoOlivari(modello, tipo_montaggio, finitura, quantita = 1, opzioni = {}) {
    const info = OLIVARI_2025.info;
    const maniglia = OLIVARI_2025.maniglie[modello];
    const fin = OLIVARI_2025.finiture[finitura];
    
    if (!maniglia) {
return { errore: `Modello ${modello} non trovato` };
    }
    
    if (!fin) {
return { errore: `Finitura ${finitura} non trovata` };
    }
    
    // Prezzo base per tipo montaggio
    let prezzoBase;
    switch (tipo_montaggio) {
case 'rosette':
    prezzoBase = maniglia.rosette;
    break;
case 'verticali':
    prezzoBase = maniglia.verticali;
    break;
case 'placca':
    prezzoBase = maniglia.placca;
    break;
case 'magnetica':
    prezzoBase = maniglia.magnetica;
    break;
default:
    prezzoBase = maniglia.rosette;
    }
    
    if (!prezzoBase) {
return { errore: `Tipo montaggio ${tipo_montaggio} non disponibile per ${modello}` };
    }
    
    // Applica maggiorazione finitura
    const prezzoFinitura = prezzoBase * (1 + fin.maggiorazione);
    
    // Supplementi
    let supplementi = 0;
    if (opzioni.rosette_alte) supplementi += OLIVARI_2025.supplementi.rosette_alte;
    if (opzioni.ferro_9mm) supplementi += OLIVARI_2025.supplementi.ferro_9mm;
    if (opzioni.ferro_10mm) supplementi += OLIVARI_2025.supplementi.ferro_10mm;
    if (opzioni.porta_spessa) {
if (opzioni.spessore_porta <= 75) {
    supplementi += OLIVARI_2025.supplementi.porta_63_75mm;
} else {
    supplementi += OLIVARI_2025.supplementi.porta_75_90mm;
}
    }
    
    // Totale listino
    const prezzoListino = (prezzoFinitura + supplementi) * quantita;
    
    // Calcolo sconto (40% + 5%)
    const prezzoNetto = prezzoListino * (1 - info.sconto_1) * (1 - info.sconto_2);
    
    return {
modello: modello,
codice: maniglia.codice,
designer: maniglia.designer,
tipo_montaggio: tipo_montaggio,
finitura: fin.nome,
garanzia_anni: fin.garanzia,
quantita: quantita,
prezzo_unitario_listino: Math.round((prezzoFinitura + supplementi) * 100) / 100,
prezzoListino: Math.round(prezzoListino * 100) / 100,
sconto: `${info.sconto_1 * 100}% + ${info.sconto_2 * 100}%`,
sconto_effettivo: `${info.sconto_effettivo * 100}%`,
prezzoNetto: Math.round(prezzoNetto * 100) / 100,
supplementi: supplementi > 0 ? supplementi : null
    };
}

// ==================== FUNZIONE LISTA MODELLI ====================
function listaModelliOlivari() {
    const modelli = [];
    for (const [nome, dati] of Object.entries(OLIVARI_2025.maniglie)) {
modelli.push({
    nome: nome,
    codice: dati.codice,
    designer: dati.designer,
    prezzo_base_CR: dati.rosette,
    disponibile_placca: dati.placca ? true : false,
    disponibile_magnetica: dati.magnetica ? true : false
});
    }
    return modelli.sort((a, b) => a.prezzo_base_CR - b.prezzo_base_CR);
}

// ==================== EXPORT ====================

console.log('✅ OLIVARI-DATABASE-2025 caricato');

