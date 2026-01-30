// ============================================================================
// 🚪 LISTINO FIN-DOOR PORTONCINI FINSTRAL - EUR 2025/3
// ============================================================================
const LISTINO_FINDOOR_PORTONCINI = {
    // PREZZI BASE TIPO 720 - Flat Frame ALU-ALU
    prezziBase720_ALU: {
        990: { 2040: 1240, 2165: 1272, 2290: 1303, 2415: 1412, 2540: 1443, 2665: 1475, 2790: 1506, 2915: 1537 },
        1115: { 2040: 1297, 2165: 1329, 2290: 1362, 2415: 1474, 2540: 1507, 2665: 1540, 2790: 1573, 2915: 1607 },
        1240: { 2040: 1351, 2165: 1388, 2290: 1422, 2415: 1535, 2540: 1570, 2665: 1606, 2790: 1640, 2915: 1675 },
        1365: { 2040: 1408, 2165: 1444, 2290: 1482, 2415: 1597, 2540: 1633, 2665: 1670, 2790: 1708, 2915: 1744 }
    },
    // PREZZI BASE TIPO 720 - Step Frame PVC-PVC
    prezziBase720_PVC: {
        990: { 2040: 1871, 2165: 1922, 2290: 1973, 2415: 2036, 2540: 2087, 2665: 2139, 2790: 2190, 2915: 2241 },
        1115: { 2040: 1944, 2165: 1998, 2290: 2051, 2415: 2117, 2540: 2169, 2665: 2223, 2790: 2276, 2915: 2329 },
        1240: { 2040: 2018, 2165: 2074, 2290: 2129, 2415: 2197, 2540: 2251, 2665: 2307, 2790: 2361, 2915: 2418 },
        1365: { 2040: 2093, 2165: 2149, 2290: 2207, 2415: 2276, 2540: 2333, 2665: 2391, 2790: 2448, 2915: 2506 },
        1490: { 2040: 2165, 2165: 2225, 2290: 2284, 2415: 2355, 2540: 2416, 2665: 2475, 2790: 2534, 2915: 2594 }
    },
    // SUPPLEMENTI MODELLO ANTA (pag. 66-72)
    supplementiModello: {
        '01': { standard: 0, grande: 0 },
        '02': { standard: 43, grande: 54 },
        '03': { standard: 98, grande: 123 },
        '04': { standard: 149, grande: 186 },
        '05': { standard: 205, grande: 256 },
        '06': { standard: 262, grande: 328 },
        '07': { standard: 320, grande: 400 },
        '20': { standard: 425, grande: 531 },
        '21': { standard: 530, grande: 662 },
        '22': { standard: 640, grande: 800 },
        '23': { standard: 755, grande: 944 },
        '24': { standard: 875, grande: 1094 },
        '41': { standard: 320, grande: 400 },
        '43': { standard: 486, grande: 608 },
        '44': { standard: 589, grande: 736 },
        '45': { standard: 698, grande: 873 },
        '46': { standard: 812, grande: 1015 },
        '47': { standard: 932, grande: 1165 },
        '48': { standard: 1058, grande: 1322 },
        '49': { standard: 1190, grande: 1487 }
    },
    // SUPPLEMENTI COLORE
    supplementiColore: {
        'gruppoA': 0, 'gruppoB': 95, 'gruppoC': 185, 'legno': 250, 'speciale': 380
    },
    // MANIGLIE
    maniglie: {
        set: { '100': 0, '101': 45, '102': 85, '103': 125, '104': 180, '105': 240 },
        maniglioni: { '340': 185, '341': 245, '342': 310, '343': 395, '350': 450, '351': 520 }
    },
    // CILINDRI
    cilindri: { '1P': 0, '1P+TP': 95, '2P': 145, '2P+TP': 195, '3P+TP': 280 },
    // CERNIERE
    cerniere: { 'standard': 0, 'scomparsa': 185 },
    // FONOASSORBENTE
    fonoassorbente: 320,
    // MOLTIPLICATORI TIPO APERTURA
    moltiplicatoriTipo: {
        '720': 1.0, '625': 1.0, '621': 1.45, '622': 1.45,
        '633': 1.85, '636': 1.75, '624': 1.35, '623': 1.40
    }
};

// 🚪 Funzione calcolo prezzo Portoncino Fin-Door
function calcolaPrezzoPortoncinoFindoor(ptc) {
    const dettaglio = {
        prezzoBase: 0, supplementoModello: 0, supplementoColoreInt: 0, supplementoColoreEst: 0,
        maniglia: 0, cilindro: 0, cerniere: 0, fonoassorbente: 0, moltiplicatoreTipo: 1, totale: 0
    };
    if (!ptc) return dettaglio;
    
    // 1. Tabella prezzi base
    const isALU = (ptc.materialeInt === 'ALU' && ptc.materialeEst === 'ALU');
    const tabella = isALU ? LISTINO_FINDOOR_PORTONCINI.prezziBase720_ALU : LISTINO_FINDOOR_PORTONCINI.prezziBase720_PVC;
    
    // 2. Trova prezzo base da griglia
    const L = parseInt(ptc.BRM_L) || 1000;
    const H = parseInt(ptc.BRM_H) || 2100;
    const larghezze = Object.keys(tabella).map(Number).sort((a,b) => a-b);
    const largBase = larghezze.find(l => l >= L) || larghezze[larghezze.length - 1];
    const altezze = Object.keys(tabella[largBase] || {}).map(Number).sort((a,b) => a-b);
    const altBase = altezze.find(a => a >= H) || altezze[altezze.length - 1];
    dettaglio.prezzoBase = tabella[largBase]?.[altBase] || 1500;
    
    // 3. Supplemento modello anta
    const isGrande = (L > 1115 || H > 2355);
    const modello = ptc.modelloAnta || '01';
    const supplMod = LISTINO_FINDOOR_PORTONCINI.supplementiModello[modello];
    dettaglio.supplementoModello = supplMod ? (isGrande ? supplMod.grande : supplMod.standard) : 0;
    
    // 4. Supplementi colore
    dettaglio.supplementoColoreInt = LISTINO_FINDOOR_PORTONCINI.supplementiColore[ptc.gruppoColoreInt] || 0;
    dettaglio.supplementoColoreEst = LISTINO_FINDOOR_PORTONCINI.supplementiColore[ptc.gruppoColoreEst] || 0;
    
    // 5. Maniglia
    if (ptc.tipoManiglia === 'maniglione') {
        dettaglio.maniglia = LISTINO_FINDOOR_PORTONCINI.maniglie.maniglioni[ptc.codManiglia] || 0;
    } else {
        dettaglio.maniglia = LISTINO_FINDOOR_PORTONCINI.maniglie.set[ptc.codManiglia] || 0;
    }
    
    // 6-8. Cilindro, Cerniere, Fonoassorbente
    dettaglio.cilindro = LISTINO_FINDOOR_PORTONCINI.cilindri[ptc.cilindro] || 0;
    dettaglio.cerniere = LISTINO_FINDOOR_PORTONCINI.cerniere[ptc.cerniere] || 0;
    if (ptc.fonoassorbente) dettaglio.fonoassorbente = LISTINO_FINDOOR_PORTONCINI.fonoassorbente;
    
    // 9. Moltiplicatore tipo apertura
    dettaglio.moltiplicatoreTipo = LISTINO_FINDOOR_PORTONCINI.moltiplicatoriTipo[ptc.tipoApertura] || 1;
    
    // 10. Calcolo totale
    const subtotale = dettaglio.prezzoBase + dettaglio.supplementoModello + dettaglio.supplementoColoreInt + 
                      dettaglio.supplementoColoreEst + dettaglio.maniglia + dettaglio.cilindro + 
                      dettaglio.cerniere + dettaglio.fonoassorbente;
    dettaglio.totale = Math.round(subtotale * dettaglio.moltiplicatoreTipo);
    
    console.log(`🚪 Calcolo Findoor: Base €${dettaglio.prezzoBase} + Mod €${dettaglio.supplementoModello} + Col €${dettaglio.supplementoColoreInt + dettaglio.supplementoColoreEst} + Man €${dettaglio.maniglia} × ${dettaglio.moltiplicatoreTipo} = €${dettaglio.totale}`);
    return dettaglio;
}

const LISTINO_PUNTO_PERSIANE = {
    // Tipologia F1: Finestra 1 anta
    // Larghezze: 500-1200mm | Altezze: 700-2000mm
    F1: {
        larghezze: [500, 600, 700, 800, 900, 1000, 1100, 1200],
        prezzi: {
            700:  [257, 282, 306, 317, 326, 335, 350, 366],
            800:  [275, 294, 314, 327, 338, 349, 365, 381],
            900:  [291, 306, 323, 337, 350, 364, 379, 395],
            1000: [307, 319, 329, 347, 363, 378, 395, 411],
            1100: [307, 327, 346, 363, 379, 397, 415, 434],
            1200: [320, 338, 356, 377, 391, 409, 426, 444],
            1300: [330, 350, 370, 388, 408, 427, 448, 470],
            1400: [337, 359, 379, 400, 422, 443, 460, 478],
            1500: [349, 371, 395, 417, 437, 459, 480, 501],
            1600: [355, 379, 403, 426, 448, 473, 496, 520],
            1700: [371, 395, 418, 444, 468, 493, 517, 543],
            1800: [384, 410, 435, 462, 488, 512, 539, 567],
            1900: [397, 426, 455, 480, 507, 530, 562, 592],
            2000: [411, 443, 473, 500, 527, 550, 586, 616]
        }
    },
    
    // Tipologia F2: Finestra 2 ante
    // Larghezze: 800-1500mm | Altezze: 700-2000mm
    F2: {
        larghezze: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
        prezzi: {
            700:  [489, 500, 509, 520, 534, 548, 557, 572],
            800:  [502, 514, 525, 537, 552, 566, 576, 592],
            900:  [515, 527, 541, 554, 569, 586, 597, 613],
            1000: [527, 542, 557, 572, 588, 605, 616, 635],
            1100: [545, 562, 578, 593, 613, 631, 648, 662],
            1200: [562, 577, 593, 613, 632, 651, 667, 686],
            1300: [575, 595, 614, 636, 658, 679, 695, 715],
            1400: [592, 613, 635, 656, 679, 697, 716, 740],
            1500: [610, 633, 656, 680, 700, 721, 743, 767],
            1600: [627, 650, 672, 695, 720, 742, 766, 790],
            1700: [642, 667, 691, 716, 740, 764, 789, 814],
            1800: [660, 686, 711, 737, 761, 786, 811, 837],
            1900: [679, 706, 732, 758, 783, 808, 834, 861],
            2000: [699, 727, 753, 780, 806, 831, 858, 885]
        }
    },
    
    // Tipologia F3: Finestra 3 ante
    // Larghezze: 1200-2300mm | Altezze: 700-2000mm
    F3: {
        larghezze: [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300],
        prezzi: {
            700:  [779, 783, 788, 792, 797, 817, 830, 837, 863, 871, 872, 890],
            800:  [790, 799, 809, 818, 827, 844, 860, 870, 889, 901, 908, 925],
            900:  [801, 816, 829, 842, 858, 872, 887, 902, 918, 930, 944, 960],
            1000: [814, 832, 849, 869, 886, 900, 917, 933, 946, 960, 978, 995],
            1100: [840, 861, 880, 900, 919, 934, 954, 970, 988, 1006, 1020, 1042],
            1200: [883, 899, 913, 928, 944, 963, 981, 1002, 1017, 1037, 1054, 1075],
            1300: [898, 918, 939, 959, 979, 1001, 1018, 1041, 1060, 1079, 1098, 1118],
            1400: [915, 936, 960, 983, 1006, 1027, 1049, 1070, 1089, 1110, 1133, 1156],
            1500: [941, 966, 992, 1016, 1042, 1062, 1087, 1109, 1133, 1156, 1178, 1200],
            1600: [972, 996, 1018, 1042, 1064, 1088, 1112, 1134, 1159, 1183, 1208, 1232],
            1700: [1001, 1026, 1051, 1077, 1101, 1129, 1156, 1181, 1208, 1234, 1259, 1284],
            1800: [1026, 1053, 1080, 1107, 1134, 1161, 1187, 1214, 1240, 1267, 1293, 1320],
            1900: [1057, 1085, 1113, 1140, 1169, 1195, 1223, 1250, 1278, 1305, 1332, 1360],
            2000: [1090, 1118, 1147, 1176, 1204, 1232, 1260, 1288, 1316, 1345, 1373, 1401]
        }
    },
    
    // Tipologia F4: Finestra 4 ante
    // Larghezze: 1600-3000mm | Altezze: 800-2000mm
    F4: {
        larghezze: [1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000],
        prezzi: {
            800:  [1192, 1206, 1220, 1233, 1242, 1256, 1268, 1284, 1298, 1314, 1325, 1335, 1347, 1357, 1369],
            900:  [1225, 1236, 1248, 1262, 1275, 1289, 1303, 1319, 1334, 1350, 1364, 1375, 1385, 1397, 1409],
            1000: [1253, 1265, 1277, 1289, 1308, 1323, 1338, 1355, 1369, 1385, 1405, 1416, 1426, 1438, 1448],
            1100: [1293, 1305, 1317, 1329, 1350, 1365, 1381, 1397, 1421, 1438, 1454, 1465, 1490, 1515, 1542],
            1200: [1325, 1336, 1348, 1360, 1381, 1396, 1421, 1438, 1457, 1473, 1498, 1507, 1528, 1549, 1571],
            1300: [1360, 1372, 1383, 1396, 1423, 1439, 1466, 1482, 1509, 1525, 1549, 1559, 1585, 1610, 1637],
            1400: [1398, 1410, 1421, 1433, 1464, 1478, 1506, 1522, 1549, 1564, 1589, 1599, 1628, 1655, 1684],
            1500: [1435, 1446, 1459, 1471, 1506, 1521, 1551, 1566, 1594, 1609, 1634, 1644, 1679, 1716, 1753],
            1600: [1470, 1482, 1494, 1507, 1540, 1554, 1585, 1600, 1632, 1647, 1677, 1688, 1725, 1762, 1800],
            1700: [1506, 1518, 1530, 1542, 1580, 1594, 1628, 1643, 1676, 1691, 1725, 1736, 1776, 1816, 1856],
            1800: [1542, 1554, 1567, 1579, 1620, 1634, 1671, 1686, 1720, 1735, 1773, 1784, 1827, 1870, 1913],
            1900: [1583, 1595, 1607, 1619, 1664, 1678, 1718, 1733, 1770, 1785, 1825, 1836, 1883, 1930, 1977],
            2000: [1624, 1637, 1649, 1661, 1708, 1722, 1765, 1780, 1820, 1835, 1877, 1888, 1939, 1990, 2041]
        }
    },
    
    // Tipologia PF1: Porta Finestra 1 anta
    // Larghezze: 500-1200mm | Altezze: 1800-2700mm
    PF1: {
        larghezze: [500, 600, 700, 800, 900, 1000, 1100, 1200],
        prezzi: {
            1800: [446, 474, 504, 530, 563, 590, 619, 648],
            1900: [451, 481, 510, 543, 575, 603, 636, 670],
            2000: [466, 496, 529, 562, 591, 621, 656, 691],
            2100: [471, 506, 542, 575, 608, 639, 671, 703],
            2200: [491, 522, 553, 590, 623, 659, 691, 722],
            2300: [491, 529, 567, 600, 638, 673, 710, 747],
            2400: [506, 542, 578, 616, 656, 691, 729, 767],
            2500: [516, 553, 591, 631, 669, 708, 745, 785],
            2600: [526, 565, 604, 645, 682, 726, 764, 802],
            2700: [536, 577, 617, 659, 695, 743, 781, 821]
        }
    },
    
    // Tipologia PF2: Porta Finestra 2 ante
    // Larghezze: 800-1500mm | Altezze: 1800-2700mm
    PF2: {
        larghezze: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
        prezzi: {
            1800: [761, 789, 817, 847, 875, 906, 933, 961],
            1900: [776, 804, 834, 866, 894, 927, 955, 985],
            2000: [794, 826, 858, 887, 919, 954, 983, 1015],
            2100: [815, 845, 875, 909, 941, 976, 1007, 1040],
            2200: [828, 865, 901, 932, 966, 1002, 1035, 1068],
            2300: [848, 881, 915, 952, 985, 1023, 1058, 1094],
            2400: [866, 902, 939, 976, 1012, 1051, 1088, 1123],
            2500: [881, 919, 958, 995, 1034, 1071, 1111, 1147],
            2600: [894, 935, 977, 1014, 1054, 1091, 1135, 1173],
            2700: [910, 954, 997, 1035, 1077, 1112, 1159, 1198]
        }
    },
    
    // Aziende che usano questo listino
    aziende: ['punto persiane', 'p. persiane', 'p persiane', 'punto', 'persiane']
};

/**
 * Database Categorie Colori Persiane Punto Persiane
 * Fonte: Listino Punto Persiane 45/52 Ottobre 2025 (pag.124-125)
 */
const COLORI_PERSIANE_CATEGORIE = {
    // Categoria 01 (0% maggiorazione) - Standard
    'CAT01': {
        maggiorazione: 0,
        colori: ['CPF910L', 'CPF113L', 'CPF701L', 'CPF716L', 'CPF605L', 'CPF609T', 'CPF817L']
    },
    
    // Categoria 02A (+3%) - Opachi speciali
    'CAT02A': {
        maggiorazione: 3,
        colori: ['CPF735L', 'CPF609L', 'CPF621L', 'CPF119L', 'CPF524L', 'CPF811L']
    },
    
    // Categoria 02B (+5%) - Textured
    'CAT02B': {
        maggiorazione: 5,
        colori: ['CPF910T', 'CPF113T', 'CPF701T', 'CPF305T', 'CPF605T', 'CPF817T']
    },
    
    // Categoria 03 (+20%) - Legno Ezy
    'CAT03': {
        maggiorazione: 20,
        colori: ['CPF820H', 'CPF818H', 'CPF813H', 'CPFR811', 'CPF812H', 'CPFN630', 'CPFN632']
    },
    
    // Categoria 04 (+25%) - Legno Élite
    'CAT04': {
        maggiorazione: 25,
        colori: ['HD303', 'HD360', 'HD366']
    },
    
    // Categoria 05 (+25%) - Sublimato Electo
    'CAT05': {
        maggiorazione: 25,
        colori: ['CPF90RC', 'CPF91RS', 'CPF51CR']
    },
    
    // Categoria 06 (+30%) - Sublimato
    'CAT06': {
        maggiorazione: 30,
        colori: ['CPF358R', 'CPF127R', 'CPF375R', 'CPF378R', 'CPF317R']
    },
    
    // Categoria 07 (+30%) - Speciale
    'CAT07': {
        maggiorazione: 30,
        colori: ['CPF70KA'] // Winchester
    },
    
    // Categoria 08 (A preventivo) - Speciali con cambio cabina
    'CAT08': {
        maggiorazione: 0, // Da calcolare a parte
        supplementoCabina: 237,
        colori: ['CPFSLV7', 'CPFRGG4', 'CPF744L']
    }
};

/**
 * Trova maggiorazione colore persiana
 * @param {string} coloreCompleto - Colore formato "CPF70KA - Winchester"
 * @returns {object} { maggiorazione: number, categoria: string, supplementoCabina: number }
 */
function trovaMaggiorazioneColorePersiana(coloreCompleto) {
    if (!coloreCompleto) return { maggiorazione: 0, categoria: 'CAT01', supplementoCabina: 0 };
    
    // Estrai codice colore (prima del trattino)
    const codice = coloreCompleto.split('-')[0].trim().toUpperCase();
    
    // Cerca in tutte le categorie
    for (const [catId, catData] of Object.entries(COLORI_PERSIANE_CATEGORIE)) {
        if (catData.colori.some(c => codice.includes(c))) {
            console.log(`🎨 Colore "${codice}" → ${catId} (+${catData.maggiorazione}%)`);
            return {
                maggiorazione: catData.maggiorazione,
                categoria: catId,
                supplementoCabina: catData.supplementoCabina || 0
            };
        }
    }
    
    // Default: categoria standard
    console.warn(`⚠️ Colore "${codice}" non trovato, uso CAT01 (0%)`);
    return { maggiorazione: 0, categoria: 'CAT01', supplementoCabina: 0 };
}

/**
 * Calcola prezzo persiana Punto Persiane con interpolazione lineare
 * @param {number} L_mm - Larghezza in mm
 * @param {number} H_mm - Altezza in mm
 * @param {string} tipologia - Tipologia (F1, F2, F3, F4, PF1, PF2)
 * @returns {object} Dettaglio calcolo con prezzo base, totale
 */
function calcolaPrezzoPUNTOPERSIANE(L_mm, H_mm, tipologia = 'F1') {
    // Verifica tipologia esistente
    if (!LISTINO_PUNTO_PERSIANE[tipologia]) {
        console.warn(`⚠️ Tipologia ${tipologia} non trovata, uso F1`);
        tipologia = 'F1';
    }
    
    const listino = LISTINO_PUNTO_PERSIANE[tipologia];
    const larghezze = listino.larghezze;
    const altezze = Object.keys(listino.prezzi).map(Number).sort((a,b) => a-b);
    
    // Trova larghezza più vicina o interpola
    let idx_L = -1;
    for (let i = 0; i < larghezze.length; i++) {
        if (L_mm <= larghezze[i]) {
            idx_L = i;
            break;
        }
    }
    
    // Se fuori range, usa estremi
    if (idx_L === -1) idx_L = larghezze.length - 1;
    if (idx_L === 0 && L_mm < larghezze[0]) idx_L = 0;
    
    // Trova altezza più vicina o interpola
    let idx_H = -1;
    for (let i = 0; i < altezze.length; i++) {
        if (H_mm <= altezze[i]) {
            idx_H = i;
            break;
        }
    }
    
    // Se fuori range, usa estremi
    if (idx_H === -1) idx_H = altezze.length - 1;
    if (idx_H === 0 && H_mm < altezze[0]) idx_H = 0;
    
    // Leggi prezzo dalla griglia
    const L_ref = larghezze[idx_L];
    const H_ref = altezze[idx_H];
    const prezzoBase = listino.prezzi[H_ref][idx_L];
    
    console.log(`📐 Persiana ${tipologia}: L=${L_mm}mm→${L_ref}mm, H=${H_mm}mm→${H_ref}mm = €${prezzoBase}`);
    
    return {
        prezzo_base: prezzoBase,
        totale: prezzoBase,
        dettaglio: {
            larghezza_mm: L_mm,
            altezza_mm: H_mm,
            larghezza_ref: L_ref,
            altezza_ref: H_ref,
            tipologia: tipologia
        }
    };
}

/**
 * 🆕 v7.92: Calcolo COMPLETO prezzo persiana con tutte le voci
 * Include: base + maggiorazione modello + colore + cardini + imballo + contributo
 */
function calcolaPrezzoPersianaCOMPLETO(L_mm, H_mm, tipologia, modello, colore, numAnte = 2) {
    // 1. Prezzo base da griglia
    const calcBase = calcolaPrezzoPUNTOPERSIANE(L_mm, H_mm, tipologia);
    let prezzoBase = calcBase.prezzo_base;
    
    // 2. Maggiorazione modello
    const maggiorazioneModello = MAGGIORAZIONI_MODELLI_PERSIANE[modello] || 0;
    const supplementoModello = prezzoBase * maggiorazioneModello;
    prezzoBase += supplementoModello;
    
    console.log(`🏠 Modello ${modello}: Base €${calcBase.prezzo_base} + ${(maggiorazioneModello*100).toFixed(1)}% = €${prezzoBase.toFixed(2)}`);
    
    // 3. Maggiorazione colore
    let supplementoColore = 0;
    let categoriaColore = 'CAT01';
    if (colore) {
        const infoColore = trovaMaggiorazioneColorePersiana(colore);
        supplementoColore = prezzoBase * (infoColore.maggiorazione / 100);
        categoriaColore = infoColore.categoria;
        console.log(`🎨 Colore ${colore} (${categoriaColore}): +${infoColore.maggiorazione}% = €${supplementoColore.toFixed(2)}`);
    }
    
    // 4. Spagnolette: INCLUSE nel prezzo base (Kit spagnoletta nera standard)
    // Il supplemento €45 è SOLO per aperture a LIBRO (LIB-DX, LIB-SX)
    const supplementoSpagnolette = 0; // v7.93: Già incluse nel prezzo base
    
    // Subtotale persiana
    const subtotalePersiana = prezzoBase + supplementoColore + supplementoSpagnolette;
    
    // 5. Cardini (4 pz × €3.50 = €14.00 per F2)
    const cardini = VOCI_FISSE_PERSIANE.cardiniBase * VOCI_FISSE_PERSIANE.cardiniQuantita;
    
    // 6. Imballo 3%
    const baseImballo = subtotalePersiana + cardini;
    const imballo = baseImballo * (VOCI_FISSE_PERSIANE.imballoPercent / 100);
    
    // 7. Contributo gestione
    const contributoGestione = VOCI_FISSE_PERSIANE.contributoGestione;
    
    // TOTALE FINALE
    const totaleFinale = subtotalePersiana + cardini + imballo + contributoGestione;
    
    console.log(`💰 Persiana COMPLETO: Base €${prezzoBase.toFixed(2)} + Colore €${supplementoColore.toFixed(2)} + Spagn €${supplementoSpagnolette} + Cardini €${cardini.toFixed(2)} + Imb €${imballo.toFixed(2)} + Contrib €${contributoGestione} = €${totaleFinale.toFixed(2)}`);
    
    return {
        prezzo_base_griglia: calcBase.prezzo_base,
        maggiorazione_modello: supplementoModello,
        prezzo_base_con_modello: prezzoBase,
        supplemento_colore: supplementoColore,
        categoria_colore: categoriaColore,
        supplemento_spagnolette: supplementoSpagnolette,
        subtotale_persiana: subtotalePersiana,
        cardini: cardini,
        imballo: imballo,
        contributo_gestione: contributoGestione,
        totale: totaleFinale,
        dettaglio: calcBase.dettaglio
    };
}

// ============================================================================
// LISTINO PLASTICINO TAPPARELLE - 2025
// ============================================================================

const LISTINO_PLASTICINO = {
    // Componenti base tapparella
    componenti: {
        rullo: {
            codice: "COMP-01",
            nome: "Rullo Ottagonale 60mm",
            prezzo_al_metro: 13.20,
            calcolo: "larghezza_luce_m × 13.20"
        },
        fissi: {
            calotta: 15.00,              // COMP-02
            avvolgitore: 10.00,          // COMP-03
            cuscinetto: 3.50,            // COMP-04
            supporti_coppia: 6.00,       // COMP-05 (2 pz)
            ganci_coppia: 7.20,          // COMP-06 (2 pz)
            placca: 5.00,                // COMP-08
            passacinghia: 1.70,          // COMP-09
            macchinetta: 18.00           // COMP-10
        },
        totale_fissi: 66.40  // Somma componenti fissi
    },
    
    // 🆕 TELI AVVOLGIBILI - Database completo da catalogo Plasticino 07.2022
    teli: {
        // ALLUMINIO COIBENTATO MEDIA DENSITÀ
        'TA01': { nome: 'ALUPROFIL MD 13x55', tipo: 'Alluminio MD', prezzo_tinta_unita: 60.00, prezzo_tinta_legno: 61.50, prezzo_tinta_raffaello: 62.50 },
        'TA25': { nome: 'ALUPROFIL AD 13x55', tipo: 'Alluminio AD', prezzo_tinta_unita: 73.00, prezzo_tinta_legno: 74.50, prezzo_tinta_raffaello: 75.50 },
        'TA05': { nome: 'ALUPROFIL MD 9x41', tipo: 'Alluminio MD', prezzo_tinta_unita: 66.00, prezzo_tinta_legno: 67.50, prezzo_tinta_raffaello: 68.50 },
        'TA30': { nome: 'ALUPROFIL AD 9x41', tipo: 'Alluminio AD', prezzo_tinta_unita: 72.00, prezzo_tinta_legno: 73.50, prezzo_tinta_raffaello: 74.50 },
        'TA42': { nome: 'ALUPROFIL MD 8,5x32', tipo: 'Alluminio MD', prezzo_tinta_unita: 90.00, prezzo_tinta_legno: 91.50, prezzo_tinta_raffaello: 92.50 },
        'TA07': { nome: 'ALUPROFIL MD 8x37', tipo: 'Alluminio MD', prezzo_tinta_unita: 77.00, prezzo_tinta_legno: 78.50, prezzo_tinta_raffaello: null },
        
        // ACCIAIO COIBENTATO
        'TA15': { nome: 'STEELPROFIL 13x55', tipo: 'Acciaio', prezzo_tinta_unita: 75.00, prezzo_tinta_legno: 76.50, prezzo_tinta_raffaello: 77.50 },
        'TA20': { nome: 'STEELPROFIL 9x40', tipo: 'Acciaio', prezzo_tinta_unita: 109.00, prezzo_tinta_legno: 118.00, prezzo_tinta_raffaello: 120.00 },
        
        // PVC ESTRUSO
        'A01': { nome: 'ANTIGRANDINE 14x50', tipo: 'PVC', prezzo_tinta_unita: 46.20, prezzo_tinta_legno: null, prezzo_tinta_raffaello: null },
        'A10': { nome: 'PESANTE 14x50', tipo: 'PVC', prezzo_tinta_unita: 39.70, prezzo_tinta_legno: null, prezzo_tinta_raffaello: null },
        'A16': { nome: 'MINI 10 11x32', tipo: 'PVC', prezzo_tinta_unita: 54.40, prezzo_tinta_legno: null, prezzo_tinta_raffaello: null }
    },
    
    // Modello telo di default (se non specificato)
    modello_telo_default: 'TA01',  // ALUPROFIL MD 13x55 tinta unita
    colore_telo_default: 'tinta_unita',
    
    // Supplementi opzionali
    supplementi: {
        doppia_altezza: {
            codice: "COMP-07",
            soglia_cm: 300,              // Applica supplemento se H > 300cm
            prezzo_al_metro: 0.50,
            calcolo: "(altezza - 300) / 100 × 0.50"
        }
    },
    
    // 🆕 GUIDE TAPPARELLE - Da catalogo Plasticino 07.2022
    guide: {
        // Guide 30x25x30 - COLORI STANDARD (Argento, Bronzo, Elox, Bianco)
        'TG15OX': { nome: 'Guide 30x25x30 FINESTRA', prezzo: 40.00, um: 'CP' },
        'TG10OX': { nome: 'Guide 30x25x30 PORTAFINESTRA', prezzo: 57.60, um: 'CP' },
        
        // Guide 30x25x30 - COLORI RAL
        'TG15VE': { nome: 'Guide 30x25x30 FINESTRA RAL', prezzo: 50.90, um: 'CP' },
        'TG10VE': { nome: 'Guide 30x25x30 PORTAFINESTRA RAL', prezzo: 69.00, um: 'CP' },
        
        // Guide 30x25x30 - RAL A RICHIESTA
        'TG15RA': { nome: 'Guide 30x25x30 FINESTRA RAL custom', prezzo: null, um: 'CP' },
        'TG10RA': { nome: 'Guide 30x25x30 PORTAFINESTRA RAL custom', prezzo: null, um: 'CP' },
        
        // Guide 28x19x28
        'TG18OX': { nome: 'Guide 28x19x28 FINESTRA', prezzo: 36.00, um: 'CP' },
        'TG17OX': { nome: 'Guide 28x19x28 PORTAFINESTRA', prezzo: 52.00, um: 'CP' },
        
        // Guide BARRE 6800mm
        'TG30': { nome: 'Guide 30x25x30 BARRE 6800mm', prezzo: 11.40, um: 'ML' },
        'TG33': { nome: 'Guide 28x19x28 BARRE 6800mm', prezzo: 10.20, um: 'ML' }
    },
    
    // Colori guide disponibili
    colori_guide: {
        standard: ['Argento', 'Bronzo', 'Elox', 'Bianco'],
        ral: ['Avorio RAL 1013', 'Verde RAL 6005', 'Marrone RAL 8014', 'Marrone RAL 8017', 'Marrone RAL 8019']
    },
    
    // Aziende che usano questo listino
    aziende: ['plasticino', 'new solar', 'estella']
};

// ============================================================================
// LISTINO ACCESSORI PERSIANE - Cardini + Fermapersiane (Punto Persiane)
// ============================================================================

const LISTINO_ACCESSORI_PERSIANE = {
    // Cardini a muro (pag. 190)
    cardini: {
        'C.SAF90': { nome: 'Cardine SAF 90mm (facciata)', prezzo: 0 },
        'C.SAF150': { nome: 'Cardine SAF 150mm (cappotto)', prezzo: 0 },
        'C.SAF240': { nome: 'Cardine SAF 240mm (cappotto spesso)', prezzo: 0 },
        'C.SAF320': { nome: 'Cardine SAF 320mm (cappotto XL)', prezzo: 0 },
        'C.REG.SAF90': { nome: 'Cardine Regolabile 90mm', prezzo: 0 },
        'C.REG.SAF150': { nome: 'Cardine Regolabile 150mm', prezzo: 0 },
        'CHA.1': { nome: 'Cardine mensola lama stretta', prezzo: 18.00 },
        'CHA.SP': { nome: 'Spessore 3mm per CHA.1', prezzo: 6.00 }
    },
    
    // Fermapersiane (pag. 182)
    fermapersiane: {
        'K.EASY': { nome: 'Ferma KOMFORT a scomparsa', prezzo: 56.00 },
        'F.INC': { nome: 'Fermo Piemontese incassato', prezzo: 45.00 },
        'GRILLO': { nome: 'Ferma tipo Grillo', prezzo: 0 },
        'SALTARELLO': { nome: 'Ferma tipo Saltarello', prezzo: 0 },
        'PIEMONTESE': { nome: 'Ferma tipo Piemontese', prezzo: 0 },
        'OMETTO': { nome: 'Ferma tipo Ometto (pavimento)', prezzo: 0 }
    },
    
    // Verniciatura accessori (pag. 191)
    verniciatura: {
        cardini: { prezzo_unitario: 22.00, minimo_fatturabile: 60.00, contributo_fisso: 100.00 },
        bandelle: { prezzo_unitario: 7.00, minimo_fatturabile: 84.00, contributo_fisso: 100.00 }
    }
};

/**
 * Calcola prezzo accessori persiana (Cardini + Fermapersiane)
 * @param {object} accessoriPersiana - Oggetto con cardini e fermapersiane
 * @returns {object} Dettaglio calcolo con prezzi
 */
function calcolaPrezzoAccessoriPersiana(accessoriPersiana) {
    if (!accessoriPersiana) return { totale: 0, dettaglio: [] };
    
    let totale = 0;
    const dettaglio = [];
    
    // Cardini
    if (accessoriPersiana.cardini && accessoriPersiana.cardini.qta > 0) {
        const cardine = LISTINO_ACCESSORI_PERSIANE.cardini[accessoriPersiana.cardini.modello] || { prezzo: 0 };
        const prezzoCardini = accessoriPersiana.cardini.qta * cardine.prezzo;
        totale += prezzoCardini;
        if (cardine.prezzo > 0) {
            dettaglio.push({
                tipo: 'Cardini',
                modello: accessoriPersiana.cardini.modello,
                nome: cardine.nome,
                qta: accessoriPersiana.cardini.qta,
                prezzo_unitario: cardine.prezzo,
                prezzo_totale: prezzoCardini
            });
        }
    }
    
    // Fermapersiane
    if (accessoriPersiana.fermapersiane && accessoriPersiana.fermapersiane.qta > 0) {
        const ferma = LISTINO_ACCESSORI_PERSIANE.fermapersiane[accessoriPersiana.fermapersiane.modello] || { prezzo: 0 };
        const prezzoFerma = accessoriPersiana.fermapersiane.qta * ferma.prezzo;
        totale += prezzoFerma;
        if (ferma.prezzo > 0) {
            dettaglio.push({
                tipo: 'Fermapersiane',
                modello: accessoriPersiana.fermapersiane.modello,
                nome: ferma.nome,
                qta: accessoriPersiana.fermapersiane.qta,
                prezzo_unitario: ferma.prezzo,
                prezzo_totale: prezzoFerma
            });
        }
    }
    
    return { totale, dettaglio };
}

/**
 * Calcola prezzo tapparella Plasticino completo
 * @param {number} L_cm - Larghezza luce in cm
 * @param {number} H_cm - Altezza in cm
 * @param {string} modello_telo - Modello telo (es. 'TA01', 'TA25', 'A01'). Default: 'TA01'
 * @param {string} colore_telo - Tipo colore ('tinta_unita', 'tinta_legno', 'tinta_raffaello'). Default: 'tinta_unita'
 * @returns {object} Dettaglio calcolo con rullo, telo, fissi, supplemento, totale
 */
function calcolaPrezzoPLASTICINO(L_cm, H_cm, modello_telo = null, colore_telo = null) {
    const L_m = L_cm / 100;
    
    // COMP-01: Rullo (al metro sulla larghezza luce)
    const prezzoRullo = L_m * LISTINO_PLASTICINO.componenti.rullo.prezzo_al_metro;
    
    // 🆕 TELO AVVOLGIBILE (al mq sulla superficie)
    const superficie_mq = (L_cm * H_cm) / 10000;
    
    // Determina modello telo (usa default se non specificato)
    let modello = modello_telo || LISTINO_PLASTICINO.modello_telo_default;
    const coloreTipo = colore_telo || LISTINO_PLASTICINO.colore_telo_default;
    
    // Recupera dati telo
    let teloData = LISTINO_PLASTICINO.teli[modello];
    if (!teloData) {
        console.warn(`⚠️ Modello telo "${modello}" non trovato, uso default ${LISTINO_PLASTICINO.modello_telo_default}`);
        modello = LISTINO_PLASTICINO.modello_telo_default;
        teloData = LISTINO_PLASTICINO.teli[modello];
    }
    
    // Recupera prezzo in base al colore
    let prezzoTeloAlMq = 0;
    if (coloreTipo === 'tinta_raffaello' && teloData.prezzo_tinta_raffaello) {
        prezzoTeloAlMq = teloData.prezzo_tinta_raffaello;
    } else if (coloreTipo === 'tinta_legno' && teloData.prezzo_tinta_legno) {
        prezzoTeloAlMq = teloData.prezzo_tinta_legno;
    } else {
        prezzoTeloAlMq = teloData.prezzo_tinta_unita;
    }
    
    const prezzoTelo = superficie_mq * prezzoTeloAlMq;
    
    // COMP-02 a COMP-10: Componenti fissi (totale €66.40)
    const fissi = LISTINO_PLASTICINO.componenti.totale_fissi;
    
    // COMP-07: Supplemento doppia altezza (se H > 300cm)
    let suppAltezza = 0;
    if (H_cm > LISTINO_PLASTICINO.supplementi.doppia_altezza.soglia_cm) {
        const H_extra_m = (H_cm - LISTINO_PLASTICINO.supplementi.doppia_altezza.soglia_cm) / 100;
        suppAltezza = H_extra_m * LISTINO_PLASTICINO.supplementi.doppia_altezza.prezzo_al_metro;
    }
    
    // Totale tapparella = RULLO + TELO + FISSI + SUPPLEMENTO ALTEZZA
    const totale = prezzoRullo + prezzoTelo + fissi + suppAltezza;
    
    return {
        rullo: prezzoRullo,
        telo: prezzoTelo,
        telo_mq: superficie_mq,
        telo_prezzo_mq: prezzoTeloAlMq,
        telo_modello: teloData.nome,
        fissi: fissi,
        supplemento_altezza: suppAltezza,
        totale: totale,
        dettaglio: {
            larghezza_cm: L_cm,
            altezza_cm: H_cm,
            larghezza_m: L_m.toFixed(2),
            superficie_mq: superficie_mq.toFixed(2),
            sopra_soglia: H_cm > LISTINO_PLASTICINO.supplementi.doppia_altezza.soglia_cm
        }
    };
}

/**
 * 🆕 Calcola prezzo guida tapparella
 * @param {string} codiceGuida - Es. "TG10 - Guide 30x25x30 Portafinestra"
 * @param {string} coloreGuida - Es. "Argento"
 * @param {number} altezzaMm - Altezza finestra in mm (per barre)
 */
function calcolaPrezzoGuida(codiceGuida, coloreGuida = 'Argento', altezzaMm = null) {
    if (!codiceGuida || codiceGuida === '') {
        return { codice: '', prezzo: 0, note: 'Nessuna guida' };
    }
    
    // Estrai codice dalla stringa (es. "TG10 - Guide..." → "TG10")
    let codice = codiceGuida;
    if (codiceGuida.includes(' - ')) {
        codice = codiceGuida.split(' - ')[0].trim();
    }
    
    // Determina variante in base al colore
    const coloriStandard = LISTINO_PLASTICINO.colori_guide?.standard || [];
    const coloriRAL = LISTINO_PLASTICINO.colori_guide?.ral || [];
    const isColoreStandard = coloriStandard.includes(coloreGuida);
    const isColoreRAL = coloriRAL.includes(coloreGuida);
    
    let codiceEffettivo = codice;
    if (codice === 'TG15' || codice === 'TG10') {
        if (isColoreStandard) codiceEffettivo = codice + 'OX';
        else if (isColoreRAL) codiceEffettivo = codice + 'VE';
        else codiceEffettivo = codice + 'RA';
    }
    
    const guida = LISTINO_PLASTICINO.guide?.[codiceEffettivo];
    if (!guida) {
        console.warn(`⚠️ Guida "${codiceEffettivo}" non trovata nel listino`);
        return { codice: codiceEffettivo, prezzo: 0, note: 'Guida non trovata' };
    }
    
    if (guida.prezzo === null) {
        return { codice: codiceEffettivo, descrizione: guida.nome, prezzo: 0, note: 'A PREVENTIVO' };
    }
    
    let prezzoFinale = guida.prezzo;
    let quantita = 1;
    
    // Se ML, calcola in base all'altezza (2 guide)
    if (guida.um === 'ML' && altezzaMm) {
        quantita = (altezzaMm / 1000) * 2;
        prezzoFinale = Math.round(guida.prezzo * quantita * 100) / 100;
    }
    
    return {
        codice: codiceEffettivo,
        descrizione: guida.nome,
        colore: coloreGuida,
        prezzoUnitario: guida.prezzo,
        prezzo: prezzoFinale,
        um: guida.um,
        quantita: quantita
    };
}

/**
 * 🧪 Test Calcolo Tapparella
 * Funzione per testare rapidamente il calcolo prezzi nel popup Gestione Listini
 */
function testCalcoloTapparella() {
    const L_input = document.getElementById('test-tapp-L').value;
    const H_input = document.getElementById('test-tapp-H').value;
    
    const resultDiv = document.getElementById('test-tapp-result');
    const dettaglioDiv = document.getElementById('test-tapp-dettaglio');
    
    if (!L_input || !H_input) {
        resultDiv.innerHTML = '⚠️';
        resultDiv.style.color = '#dc2626';
        dettaglioDiv.style.display = 'none';
        return;
    }
    
    const L_cm = parseFloat(L_input);
    const H_cm = parseFloat(H_input);
    
    if (L_cm <= 0 || H_cm <= 0) {
        resultDiv.innerHTML = '❌';
        resultDiv.style.color = '#dc2626';
        dettaglioDiv.style.display = 'none';
        return;
    }
    
    // Calcola prezzo
    const calcolo = calcolaPrezzoPLASTICINO(L_cm, H_cm);
    
    // Mostra risultato
    resultDiv.innerHTML = `€${calcolo.totale.toFixed(2)}`;
    resultDiv.style.color = '#059669';
    
    // Mostra dettaglio
    dettaglioDiv.style.display = 'block';
    dettaglioDiv.innerHTML = `
        <strong>Dettaglio Calcolo:</strong><br>
        L = ${L_cm}cm (${calcolo.dettaglio.larghezza_m}m)<br>
        H = ${H_cm}cm ${calcolo.dettaglio.sopra_soglia ? '(> 300cm ⚠️)' : '(≤ 300cm ✓)'}<br>
        <br>
        Rullo: ${calcolo.dettaglio.larghezza_m}m × €13.20 = €${calcolo.rullo.toFixed(2)}<br>
        Componenti Fissi: €${calcolo.fissi.toFixed(2)}<br>
        ${calcolo.supplemento_altezza > 0 ? 
            `Supplemento Altezza: €${calcolo.supplemento_altezza.toFixed(2)}<br>` : 
            ''}
        <br>
        <strong style="color: #059669;">TOTALE: €${calcolo.totale.toFixed(2)}</strong>
    `;
}

/**
 * 🧪 Test Calcolo Tapparella per TAB Dettaglio Costi
 */
function testCalcoloTapparellaDettaglio() {
    const L_input = document.getElementById('test-tapp-L-dettaglio').value;
    const H_input = document.getElementById('test-tapp-H-dettaglio').value;
    
    const resultDiv = document.getElementById('test-tapp-result-dettaglio');
    const dettaglioDiv = document.getElementById('test-tapp-dettaglio-result');
    
    if (!L_input || !H_input) {
        resultDiv.innerHTML = '⚠️';
        resultDiv.style.color = '#dc2626';
        dettaglioDiv.style.display = 'none';
        return;
    }
    
    const L_cm = parseFloat(L_input);
    const H_cm = parseFloat(H_input);
    
    if (L_cm <= 0 || H_cm <= 0) {
        resultDiv.innerHTML = '❌';
        resultDiv.style.color = '#dc2626';
        dettaglioDiv.style.display = 'none';
        return;
    }
    
    // Calcola prezzo
    const calcolo = calcolaPrezzoPLASTICINO(L_cm, H_cm);
    
    // Mostra risultato
    resultDiv.innerHTML = `€${calcolo.totale.toFixed(2)}`;
    resultDiv.style.color = '#059669';
    
    // Mostra dettaglio
    dettaglioDiv.style.display = 'block';
    dettaglioDiv.innerHTML = `
        <strong>Dettaglio Calcolo:</strong><br>
        L = ${L_cm}cm (${calcolo.dettaglio.larghezza_m}m)<br>
        H = ${H_cm}cm ${calcolo.dettaglio.sopra_soglia ? '(> 300cm ⚠️)' : '(≤ 300cm ✓)'}<br>
        <br>
        Rullo: ${calcolo.dettaglio.larghezza_m}m × €13.20 = €${calcolo.rullo.toFixed(2)}<br>
        Componenti Fissi: €${calcolo.fissi.toFixed(2)}<br>
        ${calcolo.supplemento_altezza > 0 ? 
            `Supplemento Altezza: €${calcolo.supplemento_altezza.toFixed(2)}<br>` : 
            ''}
        <br>
        <strong style="color: #059669;">TOTALE: €${calcolo.totale.toFixed(2)}</strong>
    `;
}

// ============================================================================
// ✅ v7.73: DATABASE CONFIGURAZIONI PRODOTTI
// ============================================================================

// ============================================================================
// ✅ v7.73: DATABASE CONFIGURAZIONI CON AZIENDE DA AZIENDE.txt
// ============================================================================
// v7.80: DATABASE CONFIGURAZIONI con valori corretti dai file progetto
const DATABASE_CONFIGURAZIONI = {
    infissi: {
        azienda: { options: ['finstral', 'essepi', 'schuco', 'oknoplast', 'internorm'], allowCustom: true, label: '🏢 Azienda' },
        telaio: { options: ['961', '962', '963', '964', '965', '966', '967', 'Z62', 'Z91', '924', '951', '991', '129', '923'], allowCustom: true, label: '🪟 Telaio' },
        materialeTelaio: { options: ['PVC/PVC', 'PVC/Alluminio', 'Legno/Alluminio'], allowCustom: true, label: '🔩 Materiale' },
        tipoAnta: { options: ['Nova-line', 'Nova-line Plus', 'Nova-line Twin', 'Nova-line Cristal Twin', 'Classic-line', 'Step-line', 'Step-line Door', 'Slim-line', 'Slim-line Cristal', 'Slim-line Twin', 'Slim-line Cristal Twin'], allowCustom: true, label: '🚪 Tipo Anta' },
        vetro: { options: ['doppio', 'triplo', 'doppio satinato', 'triplo satinato'], allowCustom: true, label: '💎 Vetro' },
        finituraInt: { options: ['pvc', 'alluminio', 'legno'], allowCustom: true, label: '✨ Finitura Int' },
        coloreInt: { 
            options: [
                '01 - Bianco', '45 - Bianco', '27 - Bianco perla', '42 - Bianco', '07 - Bianco perla',
                '46 - Grigio seta', '06 - Grigio', '13 - Castagno decoro legno', '19 - Rovere decoro legno', '55 - Noce chiaro decoro legno'
            ],
            allowCustom: true, label: '🎨 Colore Int'
        },
        finituraEst: { options: ['pvc', 'alluminio', 'legno'], allowCustom: true, label: '✨ Finitura Est' },
        coloreEst: { 
            options: [
                '01 - Bianco', '45 - Bianco', '27 - Bianco perla', '42 - Bianco', '07 - Bianco perla',
                '46 - Grigio seta', '06 - Grigio', '13 - Castagno decoro legno', '19 - Rovere decoro legno', '55 - Noce chiaro decoro legno',
                'L13 - Castagno verniciato', 'L14 - Mogano verniciato', 'L16 - Douglas verniciato', 'L18 - Noce verniciato', 'L19 - Rovere verniciato',
                'M01 - Bianco opaco', 'F716 - Grigio antracite', 'F744 - Grigio seta', 'F905 - Nero intenso'
            ],
            allowCustom: true, label: '🎨 Colore Est'
        },
        maniglia: { 
            options: ['601 - STANDARD', '712 - A PRESSIONE', '773 - DOPPIA ANTA/RIBALTA', '772 - DOPPIA ANTA'], 
            allowCustom: true, label: '🔧 Maniglia' 
        },
        coloreManiglia: { 
            options: ['01 - BIANCO', '07 - PERLA', '56 - NEUTRO ANODIZZATO', '74 - BRONZO', '40 - OTTONE LUCIDO', '79 - TITANIO', 'M01 - BIANCO', 'M03 - NERO', 'M07 - BIANCO CREMA'], 
            allowCustom: true, label: '🎨 Col. Maniglia' 
        },
        allarme: { options: ['no', 'predisposizione', 'installato'], allowCustom: false, label: '🔔 Allarme' }
    },
    persiane: {
        azienda: { options: ['P. Persiane'], allowCustom: true, label: '🏢 Azienda' },
        modello: { options: ['Angela', 'Giulia', 'Luna', 'Aurora', 'Alto Adige', 'Cortina', 'Oscura', 'Nerina', 'Scandola', 'Scandola Duo', 'Oscura Duo'], allowCustom: true, label: '📋 Modello' },
        telaio: { options: ['TH10', 'TH40', 'TH41', 'TH45', 'TH46R', 'TH62', 'TH80', 'TH53'], allowCustom: true, label: '🪟 Telaio' },
        colore: { options: ['CPF910L - Bianco puro', 'CPF113L - Bianco perla', 'CPF701L - Grigio argento', 'CPF716L - Antracite', 'CPF605L - Verde muschio', 'CPF817L - Marrone cioccolato'], allowCustom: true, label: '🎨 Colore' }
    },
    tapparelle: {
        azienda: { options: ['Plasticino', 'New Solar', 'Estella'], allowCustom: true, label: '🏢 Azienda' },
        tipo: { options: ['Standard', 'Coibentata', 'Alta densità', 'Blindata'], allowCustom: true, label: '📋 Tipo' },
        materiale: { options: ['PVC', 'Alluminio', 'Acciaio'], allowCustom: true, label: '🔩 Materiale' },
        colore: { options: ['Bianco', 'Avorio', 'Marrone', 'Grigio'], allowCustom: true, label: '🎨 Colore' },
        automazione: { options: ['Cinghia', 'Manovella', 'Motore', 'Motore+telecomando'], allowCustom: true, label: '⚡ Automazione' }
    },
    cassonetti: {
        azienda: { options: ['Finstral', 'Magò', 'Alpac'], allowCustom: true, label: '🏢 Azienda' },
        tipo: { options: ['Cassonetto', 'Isolamento', 'Monoblocco'], allowCustom: true, label: '📋 Tipo' },
        ispezione: { options: ['Frontale', 'Esterna'], allowCustom: true, label: '🔍 Ispezione' },
        isolamentoPosaclima: { options: ['Sì', 'No'], allowCustom: false, label: '🌡️ Isolamento Posaclima' }
    },
    zanzariere: {
        azienda: { options: ['Palagina', 'Finstral'], allowCustom: true, label: '🏢 Azienda' },
        tipo: { options: ['A rullo verticale', 'A rullo laterale', 'Plissé', 'Fissa', 'A battente'], allowCustom: true, label: '📋 Tipo' },
        colore: { options: ['Bianco', 'Marrone', 'Grigio', 'Nero'], allowCustom: true, label: '🎨 Colore' },
        rete: { options: ['Standard', 'Antivento', 'Anti polline', 'Pet resistant'], allowCustom: true, label: '🕸️ Tipo Rete' }
    }
};

// Stato configurazione corrente
let configCorrente = {
    infissi: {},
    persiane: {},
    tapparelle: {},
    cassonetti: {},
    zanzariere: {}
};

