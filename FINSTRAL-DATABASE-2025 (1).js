/**
 * FINSTRAL - DATABASE COMPLETO 2025
 * ═══════════════════════════════════════════════════════════════
 * Listino EUR 2025/10 - Ottobre 2025
 * 
 * STRUTTURA PREZZI FINSTRAL:
 * - Prezzo Base = griglia dimensionale (BRM-L × BRM-H)
 * - + Supplemento Telaio (interno PVC + esterno ALU)
 * - + Supplemento Anta (interno PVC + esterno ALU)
 * - + Supplemento Nodo Centrale (se presente)
 * - + Supplemento Ferramenta
 * - + Supplemento Accessori
 * - + Supplemento Vetro
 * - = Prezzo Unitario elemento
 * 
 * IMPORTANTE - GRUPPI COLORE:
 * - Gruppo A = tonalità di bianco (01, 42, 45, 07, 27)
 * - Gruppo B = colori scuri (06, 13, 19, 55, 36, 46)
 * - Gruppo 1H = decoro legno alluminio (L13, L19, L55, etc.)
 * 
 * Il gruppo colore determina quale colonna di supplementi usare!
 * 
 * @version 2.0.0
 * @date 27/01/2026
 * @source Listino EUR 2025/10 Finstral
 */

// ════════════════════════════════════════════════════════════════
// 1. GRUPPI COLORE PVC
// ════════════════════════════════════════════════════════════════

const FINSTRAL_COLORI_PVC = {
    // Gruppo A - Tonalità di bianco
    '01': { nome: 'Bianco extraliscia', gruppo: 'A', superficie: 'extraliscia' },
    '45': { nome: 'Bianco satinata', gruppo: 'A', superficie: 'satinata' },
    '27': { nome: 'Bianco crema satinata', gruppo: 'A', superficie: 'satinata' },
    '42': { nome: 'Bianco goffrata', gruppo: 'A', superficie: 'goffrata' },
    '07': { nome: 'Bianco crema goffrata', gruppo: 'A', superficie: 'goffrata' },
    
    // Gruppo B - Colori scuri
    '36': { nome: 'Grigio topo', gruppo: 'B', note: 'Solo con ALU-ALU o ALU-Legno' },
    '46': { nome: 'Grigio seta satinata', gruppo: 'B', superficie: 'satinata' },
    '06': { nome: 'Grigio satinata', gruppo: 'B', superficie: 'satinata', note: '⚠️ Disponibile fino a 32/2026' },
    '13': { nome: 'Castagno decoro legno', gruppo: 'B', superficie: 'goffrata' },
    '19': { nome: 'Rovere decoro legno', gruppo: 'B', superficie: 'goffrata' },
    '55': { nome: 'Noce chiaro decoro legno', gruppo: 'B', superficie: 'goffrata' }
};

// ════════════════════════════════════════════════════════════════
// 2. GRUPPI COLORE ALLUMINIO
// ════════════════════════════════════════════════════════════════

const FINSTRAL_COLORI_ALU = {
    // Gruppo 1 - Standard (nessun supplemento colore, nessun costo preparazione)
    'M01': { nome: 'Bianco opaco', gruppo: '1', abbinaPVC: ['01', '42', '45'] },
    'F901': { nome: 'Bianco crema', gruppo: '1', abbinaPVC: ['07', '27'] },
    'F744': { nome: 'Grigio seta', gruppo: '1', abbinaPVC: ['46'] },
    'F742': { nome: 'Grigio traffico', gruppo: '1', abbinaPVC: ['06'] },
    'F716': { nome: 'Grigio antracite', gruppo: '1' },
    'M905': { nome: 'Nero intenso', gruppo: '1' },
    'M716': { nome: 'Grigio antracite opaco', gruppo: '1' },
    'DB703': { nome: 'Antracite metallizzato satinato opaco', gruppo: '1' },
    
    // Gruppo 1H - Decoro legno (nessun supplemento, nessun costo preparazione)
    'L13': { nome: 'Castagno verniciato', gruppo: '1H', abbinaPVC: ['13'] },
    'L14': { nome: 'Mogano verniciato', gruppo: '1H' },
    'L16': { nome: 'Douglas verniciato', gruppo: '1H' },
    'L18': { nome: 'Noce verniciato', gruppo: '1H' },
    'L19': { nome: 'Rovere verniciato', gruppo: '1H', abbinaPVC: ['19'] },
    'L55': { nome: 'Noce chiaro verniciato', gruppo: '1H', abbinaPVC: ['55'] },
    'LX01': { nome: 'Rovere naturale', gruppo: '1H' },
    'LX02': { nome: 'Ciliegio scuro', gruppo: '1H' },
    'LX03': { nome: 'Pino verniciato', gruppo: '1H' },
    'LX04': { nome: 'Rovere venato', gruppo: '1H' },
    
    // Gruppo 2 - RAL standard (+290€/ordine preparazione)
    'RAL_STANDARD': { nome: 'Colori RAL standard', gruppo: '2', costoPreparazione: 290 },
    
    // Gruppo 3 - Colori speciali (+1439€/ordine preparazione)
    'RAL_SPECIALE': { nome: 'Colori RAL speciali/NCS', gruppo: '3', costoPreparazione: 1439 }
};

// ════════════════════════════════════════════════════════════════
// 3. TELAI - SUPPLEMENTI PER ML
// ════════════════════════════════════════════════════════════════

/**
 * STRUTTURA SUPPLEMENTI TELAIO:
 * - pvcA/pvcB = supplemento profilo PVC interno (€/ml)
 * - aluA/aluB = supplemento rivestimento alluminio esterno (€/ml)
 * 
 * Per calcolare il supplemento totale telaio:
 * 1. Determinare gruppo colore PVC interno (A o B)
 * 2. Se PVC-ALU: supplemento = (pvc + alu) × perimetro_ml
 * 3. Se PVC-PVC: supplemento = pvc × perimetro_ml
 */

const FINSTRAL_TELAI = {
    // ═══════════════════════════════════════════════════════════
    // TELAI FORMA A L (961, 962, 963, 924, 991, 951)
    // ═══════════════════════════════════════════════════════════
    '961': {
        nome: 'Forma ad L - 77mm',
        codice: '961',
        profondita: 77,
        vistaEsterna: 67,
        supplementi: {
            // 961.. PVC interno
            pvcA: 0,        // compreso nel prezzo base
            pvcB: 5.20,     // +5.20 €/ml per gruppo B
            // 961N rivestimento alluminio
            aluA: 17.2,     // gruppo A
            aluB: 20.4      // gruppo B / 1H
        }
    },
    '962': {
        nome: 'Forma ad L - 84mm',
        codice: '962',
        profondita: 84,
        vistaEsterna: 67,
        supplementi: {
            pvcA: 0,
            pvcB: 5.61,
            aluA: 17.2,
            aluB: 22.4
        }
    },
    '963': {
        nome: 'Forma ad L - 104mm',
        codice: '963',
        profondita: 104,
        vistaEsterna: 67,
        supplementi: {
            pvcA: 2.89,
            pvcB: 9.31,
            aluA: 18.0,
            aluB: 24.9
        }
    },
    '924': {
        nome: 'Forma ad L - 90mm',
        codice: '924',
        profondita: 90,
        vistaEsterna: 67,
        supplementi: {
            pvcA: 8.83,
            pvcB: 14.3,
            aluA: 18.0,
            aluB: 21.3
        }
    },
    '991': {
        nome: 'Forma ad L - 90mm (alternativo)',
        codice: '991',
        profondita: 90,
        vistaEsterna: 67,
        supplementi: {
            pvcA: 10.9,
            pvcB: 16.5,
            aluA: 18.0,
            aluB: 21.3
        }
    },
    '951': {
        nome: 'Forma ad L - 124mm',
        codice: '951',
        profondita: 124,
        vistaEsterna: 67,
        supplementi: {
            pvcA: 13.0,
            pvcB: 20.1,
            aluA: 19.5,
            aluB: 23.8
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // TELAI 964, 965, 966, 967 (apertura verso interno)
    // ═══════════════════════════════════════════════════════════
    '964': {
        nome: 'Telaio 77mm - apertura interna',
        codice: '964',
        profondita: 77,
        supplementi: {
            pvcA: 5.00,
            pvcB: 10.5,
            aluA: 15.0,
            aluB: 17.3
        }
    },
    '965': {
        nome: 'Telaio 77mm - Step-line',
        codice: '965',
        profondita: 77,
        supplementi: {
            // 965.. PVC interno
            pvcA: 7.71,
            pvcB: 13.1,
            // 965N rivestimento alluminio
            aluA: 15.0,
            aluB: 17.3
        },
        variantiRivestimento: {
            'N': { nome: 'Standard', aluA: 15.0, aluB: 17.3 },
            'N5': { nome: 'Sottile', aluA: 18.3, aluB: 19.7 },
            'M': { nome: 'Medio', aluA: 18.3, aluB: 21.3 },
            'X': { nome: 'Solo laterali/superiore', aluA: 24.1, aluB: 26.0 }
        }
    },
    '966': {
        nome: 'Telaio 84mm',
        codice: '966',
        profondita: 84,
        supplementi: {
            pvcA: 11.8,
            pvcB: 17.7,
            aluA: 15.0,
            aluB: 17.3
        }
    },
    '967': {
        nome: 'Telaio 104mm',
        codice: '967',
        profondita: 104,
        supplementi: {
            pvcA: 7.22,
            pvcB: 12.8,
            aluA: 15.0,
            aluB: 17.5
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // TELAI FORMA A Z (Z62, Z91)
    // ═══════════════════════════════════════════════════════════
    'Z62': {
        nome: 'Forma a Z - 77+8mm',
        codice: 'Z62',
        profondita: 85,  // 77+8
        vistaEsterna: 67,
        supplementi: {
            // Z62.. PVC interno
            pvcA: 5.32,
            pvcB: 10.6,
            // Z62N rivestimento alluminio
            aluA: 15.0,
            aluB: 18.3
        },
        variantiRivestimento: {
            'N': { nome: 'Standard', aluA: 15.0, aluB: 18.3 },
            'X': { nome: 'Solo laterali/superiore', aluA: 24.1, aluB: 26.0 }
        }
    },
    'Z91': {
        nome: 'Forma a Z - 90mm',
        codice: 'Z91',
        profondita: 90,
        supplementi: {
            pvcA: 16.4,
            pvcB: 22.2,
            aluA: 15.0,
            aluB: 18.3
        }
    },
    
    // Alias per compatibilità
    'Z62N': { alias: 'Z62', note: 'Usa Z62 con rivestimento N' },
    'Z64N': { alias: 'Z62', note: 'Usa Z62' },
    '965N': { alias: '965', note: 'Usa 965 con rivestimento N' }
};

// ════════════════════════════════════════════════════════════════
// 4. ANTE - SUPPLEMENTI PER ML PERIMETRO ANTA
// ════════════════════════════════════════════════════════════════

/**
 * STRUTTURA SUPPLEMENTI ANTA:
 * - pvcA/pvcB = supplemento profilo PVC anta (€/ml)
 * - aluA/aluB = supplemento rivestimento alluminio anta (€/ml)
 * 
 * NOTA: Per ante con finitura PVC-ALU, sommare ENTRAMBI i supplementi!
 */

const FINSTRAL_ANTE = {
    'Classic-line': {
        codice: '973',
        descrizione: 'Classic-line',
        supplementi: {
            // 973. PVC interno
            pvcA: 0,        // compreso nel prezzo base
            pvcB: 6.35,     // +6.35 €/ml per gruppo B
            // 973K rivestimento alluminio
            aluA: 10.7,
            aluB: 11.6
        },
        nodoCentrale: {
            codice: '28K',
            // Supplemento per pezzo (non per ml!)
            prezzoA: 27.2,
            prezzoB: 29.7
        }
    },
    'Step-line': {
        codice: '974',
        descrizione: 'Step-line',
        supplementi: {
            pvcA: 0,        // compreso nel prezzo base
            pvcB: 6.24,     // +6.24 €/ml per gruppo B
            aluA: 10.7,
            aluB: 11.2
        },
        nodoCentrale: {
            codice: '28K',
            prezzoA: 27.2,
            prezzoB: 29.7
        }
    },
    'Slim-line': {
        codice: '970',
        descrizione: 'Slim-line',
        supplementi: {
            pvcA: 1.94,
            pvcB: 8.87,
            aluA: 10.7,
            aluB: 11.6
        },
        nodoCentrale: {
            codice: 'NL45',
            prezzoA: 27.8,
            prezzoB: 30.1
        }
    },
    'Nova-line': {
        codice: '953',
        descrizione: 'Nova-line (vetro a filo esterno)',
        tipo: 'vetro-PVC',
        supplementi: {
            // Nova-line ha sempre anta vetro-PVC, quindi usa solo supplemento PVC
            pvcA: 5.51,
            pvcB: 11.6,
            // Il "rivestimento" è il vetro smaltato, non alluminio
            aluA: 0,
            aluB: 0
        },
        nodoCentrale: {
            codice: 'NL45',
            prezzoA: 27.8,
            prezzoB: 30.1
        },
        note: 'Anta con vetro smaltato a filo esterno - rivestimento ALU non applicabile'
    },
    'Nova-line Plus': {
        codice: '941',
        descrizione: 'Nova-line Plus',
        tipo: 'vetro-PVC',
        supplementi: {
            pvcA: 23.1,
            pvcB: 29.3,
            aluA: 0,
            aluB: 0
        }
    },
    'Slim-line Twin': {
        codice: '952T',
        descrizione: 'Slim-line Twin',
        supplementi: {
            pvcA: 1.94,
            pvcB: 8.87,
            aluA: 10.7,
            aluB: 11.6
        },
        note: 'Richiede configurazione Anta Twin'
    },
    'FISSO': {
        codice: 'F',
        descrizione: 'Elemento fisso (nessuna anta mobile)',
        supplementi: {
            pvcA: 0,
            pvcB: 0,
            aluA: 0,
            aluB: 0
        }
    }
};

// ════════════════════════════════════════════════════════════════
// 5. FERRAMENTA
// ════════════════════════════════════════════════════════════════

const FINSTRAL_FERRAMENTA = {
    // ANTA/RIBALTA (cerniere a vista - serie 4xx)
    '411': {
        codice: '411.0',
        descrizione: 'Anta/ribalta',
        tipo: 'anta-ribalta',
        cerniere: 'a-vista',
        prezzo: 11.90,
        note: 'Apertura standard'
    },
    '409': {
        codice: '409.0',
        descrizione: 'Solo anta',
        tipo: 'anta',
        cerniere: 'a-vista',
        prezzo: 9.50,
        note: 'Solo apertura laterale'
    },
    '430': {
        codice: '430.0',
        descrizione: 'Anta con uscita sicurezza',
        tipo: 'anta-sicurezza',
        cerniere: 'a-vista',
        prezzo: 14.20
    },
    '453': {
        codice: '453.0',
        descrizione: 'Anta/ribalta porta',
        tipo: 'anta-ribalta-porta',
        cerniere: 'a-vista',
        prezzo: 13.50,
        note: 'Per porte-finestre'
    },
    '425': {
        codice: '425.0',
        descrizione: 'Anta doppia',
        tipo: 'doppia-anta',
        cerniere: 'a-vista',
        prezzo: 18.90
    },
    '475': {
        codice: '475.0',
        descrizione: 'Scorrevole parallelo',
        tipo: 'scorrevole',
        cerniere: 'nessuna',
        prezzo: 45.00
    },
    
    // ANTA/RIBALTA (cerniere a scomparsa - serie 2xx)
    '211': {
        codice: '211.0',
        descrizione: 'Anta/ribalta (a scomparsa)',
        tipo: 'anta-ribalta',
        cerniere: 'a-scomparsa',
        prezzo: 15.20,
        note: 'Cerniere nascoste'
    },
    '209': {
        codice: '209.0',
        descrizione: 'Solo anta (a scomparsa)',
        tipo: 'anta',
        cerniere: 'a-scomparsa',
        prezzo: 12.80
    },
    '230': {
        codice: '230.0',
        descrizione: 'Anta sicurezza (a scomparsa)',
        tipo: 'anta-sicurezza',
        cerniere: 'a-scomparsa',
        prezzo: 17.50
    },
    '225': {
        codice: '225.0',
        descrizione: 'Anta doppia (a scomparsa)',
        tipo: 'doppia-anta',
        cerniere: 'a-scomparsa',
        prezzo: 22.30
    },
    
    // FISSO
    '99': {
        codice: '99.0',
        descrizione: 'Elemento fisso',
        tipo: 'fisso',
        cerniere: 'nessuna',
        prezzo: 0,
        note: 'Vetro montato nel telaio, nessuna apertura'
    },
    
    // SCORREVOLI (serie 7xx)
    '711': {
        codice: '711.0',
        descrizione: 'Scorrevole alzante',
        tipo: 'scorrevole-alzante',
        prezzo: 85.00
    },
    '721': {
        codice: '721.0',
        descrizione: 'Scorrevole traslante',
        tipo: 'scorrevole-traslante',
        prezzo: 65.00
    }
};

// Esecuzione Din (lato apertura)
const FINSTRAL_DIN = {
    '1': { descrizione: 'Sinistra (SX)', lato: 'sinistra' },
    '2': { descrizione: 'Destra (DX)', lato: 'destra' },
    '-1': { descrizione: 'Sinistra (SX)', lato: 'sinistra' },
    '-2': { descrizione: 'Destra (DX)', lato: 'destra' }
};

// ════════════════════════════════════════════════════════════════
// 6. MANIGLIE
// ════════════════════════════════════════════════════════════════

const FINSTRAL_MANIGLIE = {
    '7120': {
        codice: '7120',
        descrizione: 'Maniglia a pressione in alluminio serie 2',
        tipo: 'a-pressione',
        materiale: 'alluminio',
        prezzo: 11.80,  // Da conferma ordine
        note: 'Standard accessori'
    },
    '7110': {
        codice: '7110',
        descrizione: 'Maniglia standard',
        tipo: 'standard',
        materiale: 'alluminio',
        prezzo: 0
    },
    '7130': {
        codice: '7130',
        descrizione: 'Maniglia design',
        tipo: 'design',
        materiale: 'alluminio',
        prezzo: 12.00,
        note: 'Supplemento'
    }
};

// Colori maniglia
const FINSTRAL_COLORI_MANIGLIA = {
    '01': { nome: 'Bianco', gruppo: 'standard' },
    '03': { nome: 'Nero', gruppo: 'standard' },
    '79': { nome: 'Titanio', gruppo: 'standard' },
    '06': { nome: 'Grigio', gruppo: 'standard' },
    '09': { nome: 'Bronzo', gruppo: 'premium' },
    '12': { nome: 'Ottone', gruppo: 'premium' }
};

// ════════════════════════════════════════════════════════════════
// 7. ACCESSORI
// ════════════════════════════════════════════════════════════════

const FINSTRAL_ACCESSORI = {
    '70': {
        codice: '70',
        descrizione: 'Protezione antiperforazione',
        prezzo: 4.50,
        note: 'Placca di sicurezza'
    },
    '454': {
        codice: '454',
        descrizione: 'Maniglietta/barra esterna',
        prezzo: 39.10,
        note: 'Per porte-finestre, permette apertura dall\'esterno'
    },
    '46-S': {
        codice: '46-S',
        descrizione: 'Profilo aggiuntivo complanare interno',
        prezzoMl: 17.18,  // €/ml
        note: 'Aggiunto sotto per porte-finestre'
    },
    '21': {
        codice: '21',
        descrizione: 'Fori di fissaggio 6mm per controtelaio',
        prezzo: 0,
        note: 'Lavorazione telaio, compresa'
    }
};

// ════════════════════════════════════════════════════════════════
// 8. VETRI
// ════════════════════════════════════════════════════════════════

const FINSTRAL_VETRI = {
    // Plus-Valor 2 (doppio vetro alta prestazione)
    'Plus-Valor2': {
        codice: 'Plus-Valor2',
        descrizione: 'Plus-Valor 2 con Multiprotect',
        composizione: '33.1v-18-33.1',
        spessore: 30,
        ug: 1.0,
        tipo: 'doppio',
        sicurezza: true,
        // Prezzo per campo vetro (da conferma: 39.94€ per campo)
        prezzoCampo: 39.94,
        note: 'Vetro/pannello campo 1, campo 2, etc.'
    },
    '11414': {
        codice: '11414',
        descrizione: 'Max-Valor 3 + 2x Multiprotect',
        composizione: '33.1M-10-4F-13-33.1M',
        spessore: 40,
        ug: 0.7,
        tipo: 'triplo',
        sicurezza: true,
        prezzoBase: 144.00,  // €/m²
        note: 'Protezione antinfortunistica interno 2(B)2'
    },
    '11411': {
        codice: '11411',
        descrizione: 'Max-Valor 3 standard',
        composizione: '4-10-4F-10-4',
        spessore: 32,
        ug: 0.9,
        tipo: 'triplo',
        sicurezza: false,
        prezzoBase: 150.00
    },
    '11410': {
        codice: '11410',
        descrizione: 'Doppio vetro standard',
        composizione: '4-16-4',
        spessore: 24,
        ug: 1.1,
        tipo: 'doppio',
        sicurezza: false,
        prezzoBase: 80.00
    }
};

// Vetri ornamentali (per bagni, privacy)
const FINSTRAL_VETRI_ORNAMENTALI = {
    '48': {
        codice: '48',
        descrizione: 'Satinato',
        supplemento: 83.40,  // Supplemento fisso
        note: 'Privacy per bagni'
    },
    '41': {
        codice: '41',
        descrizione: 'Cattedrale',
        supplemento: 45.00
    },
    '43': {
        codice: '43',
        descrizione: 'Delta',
        supplemento: 50.00
    }
};

// Fermavetro
const FINSTRAL_FERMAVETRO = {
    '66': {
        codice: '66',
        descrizione: 'Fermavetro Classic',
        note: 'Linee decise'
    },
    '67': {
        codice: '67',
        descrizione: 'Fermavetro Slim',
        note: 'Linee sottili'
    }
};

// Colore distanziale
const FINSTRAL_DISTANZIALE = {
    '03': { nome: 'Nero', codice: '03' },
    '01': { nome: 'Alluminio', codice: '01' },
    '02': { nome: 'Bianco', codice: '02' }
};

// ════════════════════════════════════════════════════════════════
// 9. SOGLIE (per porte-finestre)
// ════════════════════════════════════════════════════════════════

const FINSTRAL_SOGLIE = {
    '377K': {
        codice: '377K',
        descrizione: 'Soglia ribassata a taglio termico',
        note: 'Per porte-finestre, scarico acqua 0'
    },
    '376': {
        codice: '376',
        descrizione: 'Soglia standard',
        note: 'Altezza standard'
    }
};

// ════════════════════════════════════════════════════════════════
// 10. FUNZIONI DI CALCOLO
// ════════════════════════════════════════════════════════════════

/**
 * Determina il gruppo colore (A o B) dal codice colore PVC
 * @param {string} colorePVC - Codice colore PVC (es. "13", "01")
 * @returns {string} - 'A' o 'B'
 */
function getGruppoColore(colorePVC) {
    const colore = FINSTRAL_COLORI_PVC[colorePVC];
    if (!colore) {
        console.warn(`Colore PVC ${colorePVC} non trovato, uso gruppo A`);
        return 'A';
    }
    return colore.gruppo;
}

/**
 * Calcola supplemento telaio
 * @param {string} codiceTelaio - Codice telaio (es. "965", "Z62")
 * @param {string} colorePVC - Codice colore PVC interno
 * @param {boolean} conAlluminio - true se PVC-ALU, false se PVC-PVC
 * @param {number} perimetroMl - Perimetro telaio in metri lineari
 * @returns {Object} - { pvc: €, alu: €, totale: € }
 */
function calcolaSupplementoTelaio(codiceTelaio, colorePVC, conAlluminio, perimetroMl) {
    // Risolvi alias
    let telaio = FINSTRAL_TELAI[codiceTelaio];
    if (telaio && telaio.alias) {
        telaio = FINSTRAL_TELAI[telaio.alias];
    }
    
    if (!telaio || !telaio.supplementi) {
        console.warn(`Telaio ${codiceTelaio} non trovato`);
        return { pvc: 0, alu: 0, totale: 0 };
    }
    
    const gruppo = getGruppoColore(colorePVC);
    const supp = telaio.supplementi;
    
    // Supplemento PVC interno
    const suppPvc = (gruppo === 'B' ? supp.pvcB : supp.pvcA) * perimetroMl;
    
    // Supplemento ALU esterno (solo se PVC-ALU)
    let suppAlu = 0;
    if (conAlluminio) {
        suppAlu = (gruppo === 'B' ? supp.aluB : supp.aluA) * perimetroMl;
    }
    
    return {
        pvc: Math.round(suppPvc * 100) / 100,
        alu: Math.round(suppAlu * 100) / 100,
        totale: Math.round((suppPvc + suppAlu) * 100) / 100
    };
}

/**
 * Calcola supplemento anta
 * @param {string} tipoAnta - Tipo anta (es. "Classic-line", "Step-line")
 * @param {string} colorePVC - Codice colore PVC interno
 * @param {boolean} conAlluminio - true se PVC-ALU
 * @param {number} perimetroAntaMl - Perimetro totale ante in ml
 * @returns {Object} - { pvc: €, alu: €, totale: € }
 */
function calcolaSupplementoAnta(tipoAnta, colorePVC, conAlluminio, perimetroAntaMl) {
    const anta = FINSTRAL_ANTE[tipoAnta];
    if (!anta || !anta.supplementi) {
        console.warn(`Anta ${tipoAnta} non trovata`);
        return { pvc: 0, alu: 0, totale: 0 };
    }
    
    const gruppo = getGruppoColore(colorePVC);
    const supp = anta.supplementi;
    
    // Supplemento PVC
    const suppPvc = (gruppo === 'B' ? supp.pvcB : supp.pvcA) * perimetroAntaMl;
    
    // Supplemento ALU (solo se PVC-ALU e anta non è Nova-line)
    let suppAlu = 0;
    if (conAlluminio && anta.tipo !== 'vetro-PVC') {
        suppAlu = (gruppo === 'B' ? supp.aluB : supp.aluA) * perimetroAntaMl;
    }
    
    return {
        pvc: Math.round(suppPvc * 100) / 100,
        alu: Math.round(suppAlu * 100) / 100,
        totale: Math.round((suppPvc + suppAlu) * 100) / 100
    };
}

/**
 * Calcola supplemento nodo centrale (per finestre a 2+ ante)
 * @param {string} tipoAnta - Tipo anta
 * @param {string} colorePVC - Codice colore PVC
 * @param {boolean} conAlluminio - true se PVC-ALU
 * @returns {number} - Prezzo supplemento in €
 */
function calcolaSupplementoNodoCentrale(tipoAnta, colorePVC, conAlluminio) {
    const anta = FINSTRAL_ANTE[tipoAnta];
    if (!anta || !anta.nodoCentrale) {
        return 0;
    }
    
    const gruppo = getGruppoColore(colorePVC);
    const nodo = anta.nodoCentrale;
    
    // Il nodo centrale ha prezzo fisso per pezzo
    return gruppo === 'B' ? nodo.prezzoB : nodo.prezzoA;
}

/**
 * Calcola supplemento vetro (per campo)
 * @param {string} codiceVetro - Codice vetro
 * @param {number} numCampi - Numero di campi vetro
 * @returns {number} - Prezzo supplemento in €
 */
function calcolaSupplementoVetro(codiceVetro, numCampi = 1) {
    const vetro = FINSTRAL_VETRI[codiceVetro];
    if (!vetro) {
        console.warn(`Vetro ${codiceVetro} non trovato`);
        return 0;
    }
    
    // Se ha prezzo per campo
    if (vetro.prezzoCampo) {
        return vetro.prezzoCampo * numCampi;
    }
    
    return 0;
}

/**
 * Calcola supplemento ferramenta
 */
function calcolaSupplementoFerramenta(codice) {
    const ferr = FINSTRAL_FERRAMENTA[codice];
    return ferr ? ferr.prezzo : 0;
}

/**
 * Calcola prezzo totale elemento Finstral
 * @param {Object} config - Configurazione completa elemento
 * @returns {Object} - Dettaglio prezzi
 */
function calcolaPrezzoTotaleElemento(config) {
    const {
        prezzoBase = 0,         // Prezzo base da griglia Finstral
        telaio,                 // Codice telaio (es. "965")
        tipoAnta,               // Tipo anta (es. "Classic-line")
        colorePVC = '01',       // Colore PVC interno
        conAlluminio = true,    // PVC-ALU o PVC-PVC
        BRM_L,                  // Larghezza BRM in mm
        BRM_H,                  // Altezza BRM in mm
        numAnte = 1,            // Numero di ante
        conNodoCentrale = false,// Se ha montante mobile
        ferramenta,             // Codice ferramenta
        vetro,                  // Codice vetro
        numCampiVetro = 1,      // Numero campi vetro
        maniglia                // Codice maniglia
    } = config;
    
    // Calcola perimetri
    const perimetroTelaioMl = 2 * (BRM_L + BRM_H) / 1000;
    
    // Perimetro anta: dipende dal numero di ante
    // Per 2 ante: ogni anta ha larghezza = (BRM_L - montante) / 2
    const larghezzaAnta = numAnte > 1 ? (BRM_L - 50) / numAnte : BRM_L - 60;
    const altezzaAnta = BRM_H - 60;
    const perimetroSingolaAnta = 2 * (larghezzaAnta + altezzaAnta) / 1000;
    const perimetroTotaleAnteMl = perimetroSingolaAnta * numAnte;
    
    // Calcola supplementi
    const suppTelaio = calcolaSupplementoTelaio(telaio, colorePVC, conAlluminio, perimetroTelaioMl);
    const suppAnta = calcolaSupplementoAnta(tipoAnta, colorePVC, conAlluminio, perimetroTotaleAnteMl);
    const suppNodo = conNodoCentrale ? calcolaSupplementoNodoCentrale(tipoAnta, colorePVC, conAlluminio) : 0;
    const suppFerr = calcolaSupplementoFerramenta(ferramenta);
    const suppVetro = calcolaSupplementoVetro(vetro, numCampiVetro);
    const suppManiglia = maniglia ? (FINSTRAL_MANIGLIE[maniglia]?.prezzo || 0) : 0;
    
    const totale = prezzoBase + 
                   suppTelaio.totale + 
                   suppAnta.totale + 
                   suppNodo + 
                   suppFerr + 
                   suppVetro + 
                   suppManiglia;
    
    return {
        prezzoBase,
        supplementoTelaio: suppTelaio,
        supplementoAnta: suppAnta,
        supplementoNodoCentrale: suppNodo,
        supplementoFerramenta: suppFerr,
        supplementoVetro: suppVetro,
        supplementoManiglia: suppManiglia,
        totale: Math.round(totale * 100) / 100,
        
        // Dettagli calcolo
        dettagli: {
            gruppoColore: getGruppoColore(colorePVC),
            perimetroTelaioMl: Math.round(perimetroTelaioMl * 100) / 100,
            perimetroAnteMl: Math.round(perimetroTotaleAnteMl * 100) / 100
        }
    };
}

// ════════════════════════════════════════════════════════════════
// 11. SCONTI
// ════════════════════════════════════════════════════════════════

const FINSTRAL_SCONTI = {
    // Sconto zona (per provincia)
    zona: {
        'BG': 32,  // Bergamo
        'MI': 32,  // Milano
        'BS': 32,  // Brescia
        'default': 30
    },
    
    // Sconto cliente (negoziato)
    cliente: {
        'OPEN': 7,  // Open Porte & Finestre
        'default': 0
    }
};

/**
 * Applica sconti al totale
 */
function applicaSconti(totaleListino, provincia = 'BG', codiceCliente = 'OPEN') {
    const scontoZona = FINSTRAL_SCONTI.zona[provincia] || FINSTRAL_SCONTI.zona.default;
    const scontoCliente = FINSTRAL_SCONTI.cliente[codiceCliente] || FINSTRAL_SCONTI.cliente.default;
    
    // Sconti in cascata
    const dopoZona = totaleListino * (1 - scontoZona / 100);
    const dopoCliente = dopoZona * (1 - scontoCliente / 100);
    
    return {
        totaleListino,
        scontoZona,
        importoScontoZona: Math.round((totaleListino - dopoZona) * 100) / 100,
        dopoScontoZona: Math.round(dopoZona * 100) / 100,
        scontoCliente,
        importoScontoCliente: Math.round((dopoZona - dopoCliente) * 100) / 100,
        imponibile: Math.round(dopoCliente * 100) / 100
    };
}

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined') {
    module.exports = {
        // Database
        FINSTRAL_COLORI_PVC,
        FINSTRAL_COLORI_ALU,
        FINSTRAL_TELAI,
        FINSTRAL_ANTE,
        FINSTRAL_FERRAMENTA,
        FINSTRAL_DIN,
        FINSTRAL_MANIGLIE,
        FINSTRAL_COLORI_MANIGLIA,
        FINSTRAL_ACCESSORI,
        FINSTRAL_VETRI,
        FINSTRAL_VETRI_ORNAMENTALI,
        FINSTRAL_FERMAVETRO,
        FINSTRAL_DISTANZIALE,
        FINSTRAL_SOGLIE,
        FINSTRAL_SCONTI,
        
        // Funzioni
        getGruppoColore,
        calcolaSupplementoTelaio,
        calcolaSupplementoAnta,
        calcolaSupplementoNodoCentrale,
        calcolaSupplementoVetro,
        calcolaSupplementoFerramenta,
        calcolaPrezzoTotaleElemento,
        applicaSconti
    };
}

// Per uso in browser
if (typeof window !== 'undefined') {
    window.FINSTRAL_DB = {
        // Database
        COLORI_PVC: FINSTRAL_COLORI_PVC,
        COLORI_ALU: FINSTRAL_COLORI_ALU,
        TELAI: FINSTRAL_TELAI,
        ANTE: FINSTRAL_ANTE,
        FERRAMENTA: FINSTRAL_FERRAMENTA,
        DIN: FINSTRAL_DIN,
        MANIGLIE: FINSTRAL_MANIGLIE,
        COLORI_MANIGLIA: FINSTRAL_COLORI_MANIGLIA,
        ACCESSORI: FINSTRAL_ACCESSORI,
        VETRI: FINSTRAL_VETRI,
        VETRI_ORNAMENTALI: FINSTRAL_VETRI_ORNAMENTALI,
        FERMAVETRO: FINSTRAL_FERMAVETRO,
        DISTANZIALE: FINSTRAL_DISTANZIALE,
        SOGLIE: FINSTRAL_SOGLIE,
        SCONTI: FINSTRAL_SCONTI,
        
        // Funzioni
        getGruppoColore,
        calcolaSupplementoTelaio,
        calcolaSupplementoAnta,
        calcolaSupplementoNodoCentrale,
        calcolaSupplementoVetro,
        calcolaSupplementoFerramenta,
        calcolaPrezzoTotaleElemento,
        applicaSconti
    };
}
