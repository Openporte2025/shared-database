/**
 * FLESSYA DATABASE 2025
 * Porte Interne - Listino 2025/26
 * 
 * SCONTO INSTALLATORE: 53%
 * 
 * Struttura prezzo:
 * Prezzo porta = Base finitura + Modello + Versione + Telaio/Cornice + Spessore muro + Accessori
 * 
 * @version 1.0
 * @date 11/12/2025
 */

const FLESSYA_2025 = {
    
    // ==================== INFORMAZIONI GENERALI ====================
    info: {
nome: "FLESSYA",
anno: "2025/26",
sconto: 0.53,
tipo: "porte_interne",
note: "I prezzi definitivi verranno sempre comunicati tramite conferma d'ordine"
    },

    // ==================== LINEE PRODOTTO ====================
    linee: {
NIDIO: {
    codice: "N00",
    descrizione: "Porte tamburate in legno",
    spessore_anta: 44,
    caratteristiche: "Intelaiate massello abete, nido d'ape, MDF 4mm"
},
NIDIO_INCISE: {
    codice: "N13",
    descrizione: "Porte tamburate con incisioni",
    spessore_anta: 44,
    caratteristiche: "MDF 5/8mm, lavorazioni incise"
},
TALEA: {
    codice: "T00",
    descrizione: "Porte pantografate",
    spessore_anta: 44,
    caratteristiche: "Massello toulipier, MDF 8mm"
},
CLASSIKA: {
    codice: "C00",
    descrizione: "Porte pantografate classiche",
    spessore_anta: 44,
    caratteristiche: "Massello toulipier, MDF 5mm rinforzato"
},
PLENIA: {
    codice: "P00",
    descrizione: "Porte massello impiallacciato e laccate",
    spessore_anta: 44,
    caratteristiche: "Elementi in legno massellato assemblati"
},
KIKKA: {
    codice: "K00",
    descrizione: "Porte in vetro con bordatura legno",
    spessore_vetro: 8,
    caratteristiche: "Vetro sp.8mm o 4+4, bordatura listellare 40x40mm"
},
VETRA: {
    codice: "V00",
    descrizione: "Porte in vetro",
    caratteristiche: "Porte tutto vetro con telaio"
},
S_NZIALE_MONO: {
    codice: "S00-MONO",
    descrizione: "Porte vetro e alluminio - singola",
    caratteristiche: "Vetro monolitico 8mm, profilo alluminio"
},
S_NZIALE_DUO: {
    codice: "S00-DUO",
    descrizione: "Porte vetro e alluminio - doppia",
    caratteristiche: "Doppia lastra vetro 5mm, profilo alluminio"
},
RASOMURO: {
    codice: "RMU",
    descrizione: "Porte rasomuro",
    caratteristiche: "Sistema rasomuro filo parete"
},
RECEPTIVA_EI30: {
    codice: "EI30",
    descrizione: "Porte REI antincendio EI30",
    spessore_anta: 44,
    caratteristiche: "Resistenza fuoco EI30, abbattimento acustico 27dB"
},
RECEPTIVA_EI60: {
    codice: "EI60",
    descrizione: "Porte REI antincendio EI60",
    spessore_anta: 58,
    caratteristiche: "Resistenza fuoco EI60, rovere massiccio"
},
RECEPTIVA_N00_27DB: {
    codice: "N00-27dB",
    descrizione: "Porte abbattimento acustico 27dB",
    caratteristiche: "Certificato abbattimento acustico 27dB"
},
RECEPTIVA_N00_32DB: {
    codice: "N00-32dB",
    descrizione: "Porte abbattimento acustico 32dB",
    caratteristiche: "Certificato abbattimento acustico 32dB"
},
RECEPTIVA_N00_40DB: {
    codice: "N00-40dB",
    descrizione: "Porte abbattimento acustico 40dB",
    caratteristiche: "Certificato abbattimento acustico 40dB"
},
RECEPTIVA_N00_42DB: {
    codice: "N00-42dB",
    descrizione: "Porte abbattimento acustico 42dB",
    caratteristiche: "Certificato abbattimento acustico 42dB"
},
MADERA: {
    codice: "M00",
    descrizione: "Porte in legno massello",
    caratteristiche: "Porte classiche in legno massello"
},
ANALOGICA: {
    codice: "A00",
    descrizione: "Porte moderne",
    caratteristiche: "Design moderno lineare"
},
EMPIRIA: {
    codice: "EN00",
    descrizione: "Porte tamburate / PVC / HPL",
    caratteristiche: "Anta tamburata EN00, PVC ER00, HPL ES00"
},
LAMINIO: {
    codice: "LM00",
    descrizione: "Porte laminato",
    caratteristiche: "Rivestimento laminato"
},
LAMINIO_PLUS: {
    codice: "LMP00",
    descrizione: "Porte laminato plus",
    caratteristiche: "Rivestimento laminato premium"
},
RESINAE: {
    codice: "RS00",
    descrizione: "Porte in resina",
    caratteristiche: "Rivestimento in resina"
}
    },

    // ==================== FINITURE ====================
    finiture: {
// LACCATI STANDARD
"0": { nome: "Laccato bianco RAL 9016", categoria: "laccati_standard" },
"1": { nome: "Laccato avorio RAL 1013", categoria: "laccati_standard" },
"2": { nome: "Laccato bianco crema RAL 9001", categoria: "laccati_standard" },
"5": { nome: "Laccato bianco puro RAL 9010", categoria: "laccati_standard" },
"9": { nome: "Laccato nero RAL 9005", categoria: "laccati_extra" },

// LACCATI BASE
"3": { nome: "Laccato base", categoria: "laccati_base" },

// LACCATI EXTRA
"4": { nome: "Laccato extra", categoria: "laccati_extra" },

// LACCATI IDEA
"6": { nome: "Laccato colori idea", categoria: "laccati_idea" },

// LACCATI SPECIALI
"7": { nome: "Laccato corten", categoria: "laccati_speciali" },

// LACCATI ULTRA
"15": { nome: "Laccato ULTRA standard-idea", categoria: "laccati_ultra" },
"16": { nome: "Laccato ULTRA base-extra", categoria: "laccati_ultra" },

// GOFFRATI
"10": { nome: "Goffrato standard-idea", categoria: "goffrati" },
"11": { nome: "Goffrato base-extra", categoria: "goffrati" },

// LUCIDI
"30": { nome: "Laccato lucido standard-idea", categoria: "lucidi" },
"31": { nome: "Laccato lucido base-extra", categoria: "lucidi" },

// LACCATI PORO APERTO
"39": { nome: "Frassino poro aperto RAL 9016", categoria: "poro_aperto" },
"40": { nome: "Frassino poro aperto standard-idea", categoria: "poro_aperto" },
"41": { nome: "Frassino poro aperto base-extra", categoria: "poro_aperto" },
"50": { nome: "Frassino epoca standard-idea", categoria: "poro_aperto" },
"51": { nome: "Frassino epoca base-extra", categoria: "poro_aperto" },
"60": { nome: "Pino graffiato standard-idea", categoria: "poro_aperto" },
"61": { nome: "Pino graffiato base-extra", categoria: "poro_aperto" },
"20": { nome: "Rovere decapÃ¨", categoria: "poro_aperto" },

// LEGNI
"100": { nome: "Tanganika", categoria: "legni" },
"101": { nome: "Tanganika cuoio", categoria: "legni" },
"102": { nome: "Tanganika ciliegio", categoria: "legni" },
"103": { nome: "Tanganika tabacco", categoria: "legni" },
"120": { nome: "Rovere", categoria: "legni" },
"121": { nome: "Rovere tabacco", categoria: "legni" },
"122": { nome: "Rovere caffÃ¨", categoria: "legni" },
"123": { nome: "Rovere sbiancato", categoria: "legni" },
"126": { nome: "Rovere grigio", categoria: "legni" },
"127": { nome: "Rovere cenere", categoria: "legni" },
"128": { nome: "Rovere nodato", categoria: "legni" },
"129": { nome: "Rovere crudo", categoria: "legni" },
"140": { nome: "Noce nazionale bicolore", categoria: "legni" },
"150": { nome: "Ciliegio", categoria: "legni" },

// SPECIALI
"110": { nome: "Mogano", categoria: "speciali" },
"170": { nome: "Noce biondo", categoria: "speciali" },
"181": { nome: "Frassino antico", categoria: "speciali" },
"183": { nome: "Frassino sbiancato", categoria: "speciali" },
"231": { nome: "Pino graffiato rame", categoria: "speciali" },
"232": { nome: "Pino graffiato antico", categoria: "speciali" },

// GREZZO
"G0": { nome: "Grezzo da laccare", categoria: "grezzo" },
"F0": { nome: "Fondo levigato-cementite", categoria: "grezzo" }
    },

    // ==================== PREZZI BASE PER LINEA ====================
    // Formato: [80x210, 90x210, 120x210, 120x240, 120x288]
    prezzi_base: {
NIDIO: {
    "0":   [475, 508, 589, 744, 828],    // Bianco 9016
    "1":   [518, 555, 651, 817, 908],    // Avorio 1013
    "2":   [518, 555, 651, 817, 908],    // Bianco crema 9001
    "3":   [623, 660, 756, 922, 1013],   // Base
    "4":   [738, 775, 852, 1041, 1133],  // Extra
    "5":   [518, 555, 651, 817, 908],    // Bianco 9010
    "6":   [570, 607, 704, 869, 961],    // Idea
    "7":   [886, 923, 998, 1185, 1287],  // Corten
    "9":   [738, 775, 852, 1041, 1133],  // Nero 9005
    "15":  [723, 760, 856, 1022, 1113],  // ULTRA standard-idea
    "16":  [838, 875, 952, 1141, 1233],  // ULTRA base-extra
    "10":  [655, 692, 787, 954, 1045],   // Goffrato standard
    "11":  [770, 807, 888, 1089, 1180],  // Goffrato extra
    "30":  [1165, 1198, 1313, 1507, 1591], // Lucido standard
    "31":  [1270, 1303, 1418, 1612, 1696], // Lucido extra
    "40":  [682, 714, 846, 1062, 1146],  // Frassino poro standard
    "41":  [787, 819, 951, 1167, 1251],  // Frassino poro extra
    "50":  [682, 714, 846, 1062, 1146],  // Frassino epoca standard
    "51":  [787, 819, 951, 1167, 1251],  // Frassino epoca extra
    "60":  [682, 714, 846, 1062, 1146],  // Pino graffiato standard
    "61":  [787, 819, 951, 1167, 1251],  // Pino graffiato extra
    "20":  [787, 819, 951, 1167, 1251],  // Rovere decapÃ¨
    "100": [496, 534, 633, 912, 996],    // Tanganika
    "101": [496, 534, 633, 912, 996],    // Tanganika cuoio
    "102": [496, 534, 633, 912, 996],    // Tanganika ciliegio
    "103": [496, 534, 633, 912, 996],    // Tanganika tabacco
    "120": [578, 616, 725, 1019, 1103],  // Rovere
    "121": [578, 616, 725, 1019, 1103],  // Rovere tabacco
    "122": [682, 714, 846, 1062, 1146],  // Rovere caffÃ¨
    "123": [682, 714, 846, 1062, 1146],  // Rovere sbiancato
    "126": [734, 767, 898, 1115, 1199],  // Rovere grigio
    "127": [734, 767, 898, 1115, 1199],  // Rovere cenere
    "128": [734, 767, 898, 1115, 1199],  // Rovere nodato
    "129": [1160, 1218, 1392, 1515, 1645], // Rovere crudo
    "140": [636, 672, 823, 1054, 1138],  // Noce bicolore
    "150": [636, 672, 823, 1054, 1138],  // Ciliegio
    "110": [540, 578, 676, 956, 1040],   // Mogano
    "170": [786, 818, 1025, 1315, 1399], // Noce biondo
    "181": [734, 767, 898, 1115, 1199],  // Frassino antico
    "183": [682, 714, 846, 1062, 1146],  // Frassino sbiancato
    "231": [734, 767, 898, 1115, 1199],  // Pino rame
    "232": [734, 767, 898, 1115, 1199],  // Pino antico
    "G0":  [320, 352, 425, 583, 667],    // Grezzo
    "F0":  [464, 498, 579, 734, 818]     // Fondo
},

NIDIO_INCISE: {
    "0":   [599, 632, 713, 868, 952],
    "1":   [599, 632, 713, 868, 952],
    "2":   [599, 632, 713, 868, 952],
    "3":   [704, 737, 818, 973, 1057],
    "4":   [819, 852, 914, 1092, 1177],
    "5":   [599, 632, 713, 868, 952],
    "6":   [651, 684, 766, 920, 1005],
    "7":   [967, 1000, 1060, 1236, 1331],
    "9":   [819, 852, 914, 1092, 1177],
    "15":  [804, 837, 918, 1073, 1157],
    "16":  [919, 952, 1014, 1192, 1277],
    "10":  [779, 816, 911, 1078, 1169],
    "11":  [894, 931, 1012, 1213, 1304],
    "30":  [1289, 1322, 1437, 1631, 1715],
    "31":  [1394, 1427, 1542, 1736, 1820],
    "40":  [806, 838, 970, 1186, 1270],
    "41":  [911, 943, 1075, 1291, 1375],
    "60":  [806, 838, 970, 1186, 1270],
    "61":  [911, 943, 1075, 1291, 1375],
    "G0":  [444, 476, 549, 707, 791],
    "F0":  [588, 622, 703, 858, 942]
},

TALEA: {
    "0":   [599, 632, 713, 868, 952],
    "1":   [599, 632, 713, 868, 952],
    "2":   [599, 632, 713, 868, 952],
    "3":   [704, 737, 818, 984, 1068],
    "4":   [819, 852, 914, 1092, 1177],
    "5":   [599, 632, 713, 868, 952],
    "6":   [651, 684, 766, 931, 1015],
    "7":   [967, 1000, 1060, 1236, 1331],
    "9":   [819, 852, 914, 1092, 1177],
    "15":  [804, 837, 918, 1073, 1157],
    "16":  [919, 952, 1014, 1192, 1277],
    "10":  [779, 816, 911, 1078, 1169],
    "11":  [894, 931, 1012, 1213, 1304],
    "30":  [1289, 1322, 1437, 1631, 1715],
    "31":  [1394, 1427, 1542, 1736, 1820],
    "40":  [906, 938, 1070, 1286, 1370],
    "41":  [1011, 1043, 1175, 1391, 1475],
    "60":  [906, 938, 1070, 1286, 1370],
    "61":  [1011, 1043, 1175, 1391, 1475],
    "G0":  [456, 472, 552, 746, 839],
    "F0":  [588, 622, 703, 858, 942]
},

CLASSIKA: {
    "0":   [861, 895, 1081, 1341, 1425],
    "1":   [861, 895, 1081, 1341, 1425],
    "2":   [861, 895, 1081, 1341, 1425],
    "3":   [966, 1000, 1165, 1446, 1530],
    "4":   [1071, 1115, 1280, 1565, 1649],
    "5":   [861, 895, 1081, 1341, 1425],
    "6":   [914, 947, 1123, 1383, 1572],
    "7":   [1229, 1273, 1437, 1723, 1807],
    "9":   [1071, 1115, 1280, 1565, 1649],
    "15":  [1066, 1100, 1265, 1546, 1630],
    "16":  [1171, 1215, 1380, 1665, 1749],
    "10":  [1041, 1078, 1259, 1550, 1641],
    "11":  [1157, 1193, 1380, 1686, 1777],
    "30":  [1509, 1543, 1763, 2061, 2145],
    "31":  [1614, 1648, 1868, 2166, 2250],
    "G0":  [703, 736, 887, 1098, 1261],
    "F0":  [851, 884, 1070, 1295, 1414]
},

// Formato PLENIA: [80x210, 90x210, 120x210, 90x278, 120x278]
PLENIA: {
    "0":   [719, 746, 851, 869, 953],
    "1":   [733, 763, 876, 894, 982],
    "2":   [733, 763, 876, 894, 982],
    "3":   [838, 868, 981, 999, 1087],
    "4":   [943, 973, 1086, 1104, 1192],
    "5":   [733, 763, 876, 894, 982],
    "6":   [765, 797, 903, 926, 999],
    "7":   [1059, 1089, 1201, 1262, 1318],
    "9":   [943, 973, 1086, 1104, 1192],
    "15":  [938, 968, 1081, 1099, 1187],
    "16":  [1043, 1073, 1186, 1204, 1292],
    "10":  [870, 900, 1012, 1030, 1119],
    "11":  [996, 1026, 1138, 1152, 1245],
    "30":  [1409, 1436, 1569, 1615, 1707],
    "31":  [1514, 1544, 1682, 1729, 1821],
    "40":  [877, 909, 1017, 1040, 1126],
    "41":  [982, 1014, 1122, 1145, 1231],
    "50":  [877, 909, 1017, 1040, 1126],
    "51":  [982, 1014, 1122, 1145, 1231],
    "60":  [877, 909, 1017, 1040, 1126],
    "61":  [982, 1014, 1122, 1145, 1231],
    "20":  [982, 1014, 1122, 1145, 1231],
    "100": [700, 733, 847, 865, 928],
    "101": [700, 733, 847, 865, 928],
    "102": [700, 733, 847, 865, 928],
    "103": [700, 733, 847, 865, 928],
    "120": [776, 808, 917, 945, 1024],
    "121": [776, 808, 917, 945, 1024],
    "122": [877, 909, 1017, 1040, 1126],
    "123": [877, 909, 1017, 1040, 1126],
    "126": [930, 961, 1069, 1093, 1178],
    "127": [930, 961, 1069, 1093, 1178],
    "140": [846, 877, 986, 1008, 1115],
    "150": [846, 877, 986, 1008, 1115],
    "170": [1003, 1034, 1173, 1225, 1305],
    "181": [930, 961, 1069, 1093, 1178],
    "183": [877, 909, 1017, 1040, 1126],
    "231": [930, 961, 1069, 1093, 1178],
    "232": [930, 961, 1069, 1093, 1178]
},

// KIKKA: [80x210, 90x210, 120x210, 90x278, 120x278]
KIKKA: {
    "0":   [1778, 1884, 2302, 2345, 2793],
    "1":   [1792, 1901, 2327, 2370, 2822],
    "2":   [1792, 1901, 2327, 2370, 2822],
    "3":   [1897, 2006, 2432, 2475, 2927],
    "4":   [2002, 2111, 2537, 2580, 3032],
    "5":   [1792, 1901, 2327, 2370, 2822],
    "6":   [1824, 1935, 2354, 2402, 2839],
    "7":   [2118, 2227, 2652, 2696, 3158],
    "9":   [2002, 2111, 2537, 2580, 3032],
    "15":  [1997, 2106, 2532, 2575, 3027],
    "16":  [2102, 2211, 2637, 2680, 3132],
    "10":  [1929, 2038, 2463, 2517, 2959],
    "11":  [2055, 2164, 2585, 2626, 3082],
    "30":  [2468, 2874, 3320, 3391, 3847],
    "31":  [2573, 2982, 3433, 3505, 3961],
    "40":  [1936, 2047, 2468, 2516, 2966],
    "41":  [2041, 2152, 2573, 2621, 3071],
    "50":  [1936, 2047, 2468, 2516, 2966],
    "51":  [2041, 2152, 2573, 2621, 3071],
    "60":  [1936, 2047, 2468, 2516, 2966],
    "61":  [2041, 2152, 2573, 2621, 3071],
    "20":  [2041, 2152, 2573, 2621, 3071],
    "100": [1759, 1871, 2298, 2341, 2768],
    "101": [1759, 1871, 2298, 2341, 2768],
    "102": [1759, 1871, 2298, 2341, 2768],
    "103": [1759, 1871, 2298, 2341, 2768],
    "120": [1835, 1946, 2368, 2421, 2864],
    "121": [1835, 1946, 2368, 2421, 2864],
    "122": [1936, 2047, 2468, 2516, 2966],
    "123": [1936, 2047, 2468, 2516, 2966],
    "126": [1989, 2099, 2520, 2569, 3018],
    "127": [1989, 2099, 2520, 2569, 3018],
    "128": [1989, 2099, 2520, 2569, 3018],
    "140": [1905, 2015, 2437, 2484, 2955],
    "150": [1905, 2015, 2437, 2484, 2955],
    "170": [2062, 2172, 2624, 2701, 3145],
    "181": [1989, 2099, 2520, 2569, 3018],
    "183": [1936, 2047, 2468, 2516, 2966],
    "231": [1989, 2099, 2520, 2569, 3018],
    "232": [1989, 2099, 2520, 2569, 3018]
},

// S-NZIALE MONO Battente: [60x210, 70x210, 80x210, 90x210, 100x210]
S_NZIALE_MONO_BATTENTE: {
    "700": [1548, 1598, 1650, 1701, 1752],  // Trasparente
    "707": [1624, 1687, 1750, 1814, 1866],  // Extra chiaro
    "711": [1770, 1827, 1884, 1940, 1997],  // Grigio
    "712": [1770, 1827, 1884, 1940, 1997],  // Bronzo
    "725": [1849, 1947, 2047, 2147, 2247],  // Semiriflettente
    "701": [1616, 1679, 1742, 1804, 1867],  // Acidato
    "702": [1772, 1858, 1945, 2032, 2046],  // Acidato extra chiaro
    "721": [1861, 1961, 2061, 2161, 2261],  // Acidato grigio
    "722": [1861, 1961, 2061, 2161, 2261],  // Acidato bronzo
    "703": [1758, 1825, 1837, 1895, 1916],  // Sabbiato trasparente
    "704": [1833, 1885, 1938, 1990, 2045],  // Sabbiato acidato
    "708": [2155, 2200, 2245, 2289, 2334],  // Scavo
    "710": [1862, 1963, 2064, 2165, 2267],  // Specchio
    "715": [2299, 2463, 2627, 2790, 2806],  // Laccato acidato
    "713": [2096, 2228, 2360, 2493, 2625],  // Laccato lucido
    "716": [2359, 2517, 2675, 2832, 2990],  // Stampa trasparente
    "717": [1939, 2029, 2120, 2210, 2300],  // Stampa acidato
    "718": [2010, 2121, 2232, 2342, 2453],  // Tessuto bianco
    "719": [2010, 2121, 2232, 2342, 2453],  // Tessuto nero
    "720": [2010, 2121, 2232, 2342, 2453]   // Tessuto naturale
},

// S-NZIALE MONO Scorrevole Scomparsa: [60x210, 70x210, 80x210, 90x210, 100x210, 110x210, 120x210]
S_NZIALE_MONO_SCOMPARSA: {
    "700": [1429, 1479, 1531, 1581, 1633, 1684, 1734],
    "707": [1504, 1568, 1631, 1695, 1746, 1798, 1850],
    "711": [1651, 1708, 1764, 1821, 1878, 1934, 1991],
    "712": [1651, 1708, 1764, 1821, 1878, 1934, 1991],
    "725": [1730, 1828, 1928, 2028, 2128, 2228, 2328],
    "701": [1497, 1560, 1622, 1685, 1748, 1810, 1873],
    "702": [1653, 1739, 1826, 1913, 1927, 2014, 2100],
    "721": [1742, 1842, 1941, 2041, 2141, 2241, 2341],
    "722": [1742, 1842, 1941, 2041, 2141, 2241, 2341],
    "703": [1639, 1705, 1718, 1775, 1797, 1852, 1892],
    "704": [1714, 1766, 1819, 1870, 1926, 1990, 2041],
    "708": [2035, 2081, 2126, 2170, 2215, 2275, 2322],
    "710": [1743, 1844, 1945, 2046, 2147, 2248, 2350],
    "715": [2180, 2344, 2507, 2671, 2687, 2850, 3014],
    "713": [1976, 2109, 2241, 2374, 2506, 2639, 2771],
    "716": [2240, 2398, 2555, 2713, 2871, 3029, 3186],
    "717": [1820, 1910, 2000, 2091, 2181, 2271, 2362],
    "718": [1891, 2002, 2112, 2223, 2334, 2445, 2555],
    "719": [1891, 2002, 2112, 2223, 2334, 2445, 2555],
    "720": [1891, 2002, 2112, 2223, 2334, 2445, 2555]
},

// S-NZIALE MONO Rasomuro: [60x210, 70x210, 80x210, 90x210, 100x210, 110x210, 120x210]
S_NZIALE_MONO_RASOMURO: {
    "700": [834, 884, 936, 987, 1038, 1089, 1140],
    "707": [910, 973, 1036, 1100, 1152, 1203, 1255],
    "711": [1057, 1113, 1170, 1226, 1283, 1339, 1396],
    "712": [1057, 1113, 1170, 1226, 1283, 1339, 1396],
    "725": [1135, 1234, 1333, 1433, 1533, 1633, 1733],
    "701": [902, 965, 1028, 1090, 1153, 1215, 1278],
    "702": [1058, 1144, 1231, 1318, 1332, 1419, 1506],
    "721": [1147, 1247, 1347, 1447, 1547, 1646, 1746],
    "722": [1147, 1247, 1347, 1447, 1547, 1646, 1746],
    "703": [1044, 1111, 1123, 1181, 1202, 1258, 1297],
    "704": [1119, 1171, 1224, 1276, 1331, 1395, 1447],
    "708": [1441, 1486, 1531, 1575, 1620, 1680, 1727],
    "710": [1148, 1249, 1350, 1451, 1553, 1654, 1755],
    "715": [1585, 1749, 1913, 2076, 2092, 2256, 2419],
    "713": [1382, 1514, 1646, 1779, 1911, 2044, 2176],
    "716": [1645, 1803, 1961, 2118, 2276, 2434, 2592],
    "717": [1225, 1315, 1406, 1496, 1586, 1677, 1767],
    "718": [1296, 1407, 1518, 1628, 1739, 1850, 1961],
    "719": [1296, 1407, 1518, 1628, 1739, 1850, 1961],
    "720": [1296, 1407, 1518, 1628, 1739, 1850, 1961]
},

// RECEPTIVA EI30 27dB: [80x210, 90x210, 104x210, 104x240, 94x276]
RECEPTIVA_EI30_27DB: {
    "0":   [1046, 1079, 1160, 1315, 1399],
    "1":   [1089, 1126, 1222, 1388, 1479],
    "2":   [1089, 1126, 1222, 1388, 1479],
    "3":   [1194, 1231, 1327, 1493, 1584],
    "4":   [1309, 1346, 1423, 1612, 1704],
    "5":   [1089, 1126, 1222, 1388, 1479],
    "6":   [1141, 1178, 1275, 1440, 1532],
    "7":   [1457, 1494, 1569, 1756, 1858],
    "9":   [1309, 1346, 1423, 1612, 1704],
    "10":  [1226, 1263, 1358, 1525, 1616],
    "11":  [1341, 1378, 1459, 1660, 1751],
    "30":  [1736, 1769, 1884, 2078, 2162],
    "31":  [1841, 1874, 1989, 2183, 2267]
},

// RECEPTIVA 32dB: [80x210, 90x210, 104x210, 104x240, 94x276]
RECEPTIVA_32DB: {
    "0":   [1146, 1179, 1260, 1415, 1499],
    "1":   [1189, 1226, 1322, 1488, 1579],
    "2":   [1189, 1226, 1322, 1488, 1579],
    "3":   [1294, 1331, 1427, 1593, 1684],
    "4":   [1409, 1446, 1523, 1712, 1804],
    "5":   [1189, 1226, 1322, 1488, 1579],
    "6":   [1241, 1278, 1375, 1540, 1632],
    "7":   [1557, 1594, 1669, 1856, 1958],
    "9":   [1409, 1446, 1523, 1712, 1804],
    "10":  [1326, 1363, 1458, 1625, 1716],
    "11":  [1441, 1478, 1559, 1760, 1851],
    "30":  [1836, 1869, 1984, 2178, 2262],
    "31":  [1941, 1974, 2089, 2283, 2367]
},

// RECEPTIVA 40dB
RECEPTIVA_40DB: {
    "0":   [1424, 1457, 1538, 1693, 1777],
    "1":   [1467, 1504, 1600, 1766, 1857],
    "2":   [1467, 1504, 1600, 1766, 1857],
    "3":   [1572, 1609, 1705, 1871, 1962],
    "4":   [1687, 1724, 1801, 1990, 2082],
    "5":   [1467, 1504, 1600, 1766, 1857],
    "6":   [1519, 1556, 1653, 1818, 1910],
    "7":   [1835, 1872, 1947, 2134, 2236],
    "9":   [1687, 1724, 1801, 1990, 2082],
    "10":  [1604, 1641, 1736, 1903, 1994],
    "11":  [1719, 1756, 1837, 2038, 2129],
    "30":  [2114, 2147, 2262, 2456, 2540],
    "31":  [2219, 2252, 2367, 2561, 2645]
},

// RECEPTIVA 42dB
RECEPTIVA_42DB: {
    "0":   [1729, 1762, 1843, 1998, 2082],
    "1":   [1772, 1809, 1905, 2071, 2162],
    "2":   [1772, 1809, 1905, 2071, 2162],
    "3":   [1877, 1914, 2010, 2176, 2267],
    "4":   [1992, 2029, 2106, 2295, 2387],
    "5":   [1772, 1809, 1905, 2071, 2162],
    "6":   [1824, 1861, 1958, 2123, 2215],
    "7":   [2140, 2177, 2252, 2439, 2541],
    "9":   [1992, 2029, 2106, 2295, 2387],
    "10":  [1909, 1946, 2041, 2208, 2299],
    "11":  [2024, 2061, 2142, 2343, 2434],
    "30":  [2419, 2452, 2567, 2761, 2845],
    "31":  [2524, 2557, 2672, 2866, 2950]
}
    },

    // ==================== SUPPLEMENTI MODELLI ====================
    supplementi_modelli: {
NIDIO: {
    // Modelli intarsiati
    "N00": { "90x210": 0, "120x288": 0 },
    "N05": { "90x210": 38, "120x288": 38 },
    "N06": { "90x210": 88, "120x288": 88 },
    "N06H": { "90x210": 88, "120x288": 88 },
    "N06Z": { "90x210": 150, "120x288": 150 },
    "N07": { "90x210": 100, "120x288": 100 },
    "N08": { "90x210": 200, "120x288": 200 },
    "N09": { "90x210": 150, "120x288": 150 },
    "N10": { "90x210": 180, "120x288": 180 },
    "N11": { "90x210": 300, "120x288": 300 },
    "N12": { "90x210": 300, "120x288": 300 },
    // Modelli inserti alluminio
    "N01D": { "90x210": 101, "120x288": 101 },
    "N01": { "90x210": 63, "120x288": 63 },
    "N02": { "90x210": 101, "120x288": 101 },
    "N03": { "90x210": 126, "120x288": 126 },
    "N04": { "90x210": 126, "120x288": 126 },
    // Modelli vetro
    "N50": { "90x210": 90, "120x288": 108 },
    "N50S": { "90x210": 90, "120x288": 108 },
    "N51": { "90x210": 280, "120x288": 297 },
    "N52": { "90x210": 280, "120x288": 297 },
    "N53": { "90x210": 90, "120x288": 108 },
    "N54": { "90x210": 208, "120x288": 246 },
    "N55": { "90x210": 262, "120x288": 308 },
    "N56": { "90x210": 259, "120x288": 478 },
    "N57": { "90x210": 551, "120x288": 770 },
    "N58": { "90x210": 551, "120x288": 770 },
    // Modelli foderine
    "N30": { "90x210": 198, "120x288": 276 },
    "N31": { "90x210": 450, "120x288": 528 },
    "N32": { "90x210": 450, "120x288": 528 },
    "N33": { "90x210": 271, "120x288": 380 },
    "N34": { "90x210": 523, "120x288": 634 },
    "N35": { "90x210": 523, "120x288": 634 },
    "N36": { "90x210": 347, "120x288": 486 },
    "N37": { "90x210": 347, "120x288": 486 },
    "N38": { "90x210": 420, "120x288": 590 },
    // Modelli bugne
    "N40": { "90x210": 254, "120x288": 373 },
    "N41": { "90x210": 506, "120x288": 624 },
    "N42": { "90x210": 506, "120x288": 624 },
    "N43": { "90x210": 402, "120x288": 582 },
    "N44": { "90x210": 654, "120x288": 833 },
    "N45": { "90x210": 654, "120x288": 833 },
    "N46": { "90x210": 530, "120x288": 774 },
    "N47": { "90x210": 530, "120x288": 774 },
    "N48": { "90x210": 660, "120x288": 970 }
},

TALEA: {
    "T00": { "90x210": 0, "120x288": 0 },
    "T01": { "90x210": 0, "120x288": 0 },
    "T02": { "90x210": 0, "120x288": 0 },
    "T03": { "90x210": 0, "120x288": 0 },
    "T04": { "90x210": 0, "120x288": 0 },
    "T20": { "90x210": 0, "120x288": 0 },
    "T21": { "90x210": 0, "120x288": 0 },
    "T22": { "90x210": 0, "120x288": 0 },
    "T23": { "90x210": 0, "120x288": 0 },
    "T24": { "90x210": 0, "120x288": 0 },
    // Modelli vetro
    "T50": { "90x210": 150, "120x288": 150 },
    "T51": { "90x210": 170, "120x288": 170 },
    "T52": { "90x210": 170, "120x288": 170 },
    "T53": { "90x210": 210, "120x288": 210 },
    "T54": { "90x210": 230, "120x288": 230 },
    "T60": { "90x210": 100, "120x288": 100 },
    "T61": { "90x210": 140, "120x288": 140 },
    "T62": { "90x210": 140, "120x288": 140 },
    "T63": { "90x210": 170, "120x288": 170 },
    "T64": { "90x210": 190, "120x288": 190 },
    "T65": { "90x210": 170, "120x288": 170 },
    "T66": { "90x210": 320, "120x288": 320 },
    "T70": { "90x210": 200, "120x288": 200 },
    "T71": { "90x210": 100, "120x288": 100 },
    "T72": { "90x210": 170, "120x288": 170 },
    "T73": { "90x210": 100, "120x288": 100 },
    "T74": { "90x210": 280, "120x288": 280 },
    "T80": { "90x210": 230, "120x288": 230 },
    "T81": { "90x210": 200, "120x288": 200 },
    "T82": { "90x210": 250, "120x288": 250 },
    "T83": { "90x210": 380, "120x288": 380 },
    // Modelli inglese
    "T10": { "90x210": 100, "120x288": 100 },
    "T11": { "90x210": 130, "120x288": 130 },
    "T12": { "90x210": 130, "120x288": 130 },
    "T13": { "90x210": 160, "120x288": 160 },
    "T14": { "90x210": 280, "120x288": 280 },
    "T15": { "90x210": 200, "120x288": 200 },
    "T16": { "90x210": 150, "120x288": 150 },
    "T17": { "90x210": 100, "120x288": 100 },
    "T90": { "90x210": 100, "120x288": 100 },
    "T91": { "90x210": 130, "120x288": 130 },
    "T92": { "90x210": 130, "120x288": 130 },
    "T93": { "90x210": 160, "120x288": 160 },
    "T94": { "90x210": 280, "120x288": 280 },
    "T95": { "90x210": 160, "120x288": 160 },
    "T96": { "90x210": 100, "120x288": 100 },
    "T97": { "90x210": 200, "120x288": 200 }
},

CLASSIKA: {
    "C00": { "90x210": 0, "120x288": 0 },
    "C01": { "90x210": 0, "120x288": 0 },
    "C02": { "90x210": 0, "120x288": 0 },
    "C03": { "90x210": 0, "120x288": 0 },
    "C04": { "90x210": 0, "120x288": 0 },
    "C20": { "90x210": 0, "120x288": 0 },
    "C21": { "90x210": 0, "120x288": 0 },
    "C22": { "90x210": 0, "120x288": 0 },
    "C23": { "90x210": 0, "120x288": 0 },
    "C24": { "90x210": 0, "120x288": 0 },
    "C25": { "90x210": 0, "120x288": 0 },
    "C30": { "90x210": 0, "120x288": 0 },
    "C31": { "90x210": 0, "120x288": 0 },
    "C32": { "90x210": 0, "120x288": 0 },
    "C35": { "90x210": 0, "120x288": 0 },
    // Modelli vetro
    "C50": { "90x210": 150, "120x288": 150 },
    "C51": { "90x210": 170, "120x288": 170 },
    "C53": { "90x210": 210, "120x288": 210 },
    "C60": { "90x210": 100, "120x288": 100 },
    "C61": { "90x210": 140, "120x288": 140 },
    "C63": { "90x210": 170, "120x288": 170 },
    "C65": { "90x210": 170, "120x288": 170 },
    "C70": { "90x210": 200, "120x288": 200 },
    "C71": { "90x210": 100, "120x288": 100 },
    "C72": { "90x210": 170, "120x288": 170 },
    // Inglese
    "C10": { "90x210": 100, "120x288": 100 },
    "C11": { "90x210": 130, "120x288": 130 },
    "C13": { "90x210": 160, "120x288": 160 },
    "C15": { "90x210": 200, "120x288": 200 },
    "C16": { "90x210": 150, "120x288": 150 },
    "C17": { "90x210": 100, "120x288": 100 },
    "C90": { "90x210": 100, "120x288": 100 },
    "C91": { "90x210": 130, "120x288": 130 },
    "C93": { "90x210": 160, "120x288": 160 },
    "C95": { "90x210": 160, "120x288": 160 }
}
    },

    // ==================== SUPPLEMENTI VERSIONI (APERTURE) ====================
    versioni: {
// Battente
BT: { nome: "Battente", "1anta": 0, "2ante": 0, "1anta_sopraluce": 0, "2ante_sopraluce": 0 },
CS: { nome: "Cerniere a scomparsa", "1anta_h210": 100, "1anta_oltre": 150, "2ante_h210": 200, "2ante_oltre": 250 },
FL: { nome: "Fuori luce", "1anta": 50, "2ante": 60, "1anta_sopraluce": 100, "2ante_sopraluce": 120 },
FLB: { nome: "Fuori luce con battuta", "1anta": 150, "2ante": 160, "1anta_sopraluce": 200, "2ante_sopraluce": 220 },
FLBCS: { nome: "Fuori luce battuta + cerniere scomparsa", "1anta": 250, "2ante": 400, "1anta_sopraluce": 250, "2ante_sopraluce": 400 },
PY: { nome: "Portoncino (serratura yale)", "1anta": 50, "2ante": 50, "1anta_sopraluce": 50, "2ante_sopraluce": 50 },
IL: { nome: "Inlinea", "1anta": 320, "2ante": 470, "1anta_sopraluce": 380, "2ante_sopraluce": 540 },
ILT: { nome: "Inlinea a tirare", "1anta": 320, "2ante": 470, "1anta_sopraluce": 380, "2ante_sopraluce": 540 },
TR: { nome: "Trapezio", "1anta": 225, "2ante": 412, "1anta_sopraluce": 225, "2ante_sopraluce": 412 },
VV: { nome: "Va e vieni", "1anta": 165, "2ante": 313, "1anta_sopraluce": 222, "2ante_sopraluce": 336 },
L13: { nome: "Libro 1/3 - 2/3", "1anta": 620, "2ante": 1240, "1anta_sopraluce": 620, "2ante_sopraluce": 1240 },
L12: { nome: "Libro 1/2 - 1/2", "1anta": 670, "2ante": 1340, "1anta_sopraluce": 670, "2ante_sopraluce": 1340 },
LT: { nome: "Libro traslante", "1anta": 780, "2ante": 1560, "1anta_sopraluce": 780, "2ante_sopraluce": 1560 },
RT: { nome: "Rototraslante", "1anta": 520, "2ante": 1040 },
PV: { nome: "Pivot", "1anta": 300, "2ante": 600 },

// Scorrevoli
SS90: { nome: "Scorrevole scomparsa 9cm", "1anta": 150, "2ante": 200 },
SS100: { nome: "Scorrevole scomparsa 10cm", "1anta": 150, "2ante": 200 },
SS105: { nome: "Scorrevole scomparsa 10.5cm", "1anta": 100, "2ante": 150 },
SS115: { nome: "Scorrevole scomparsa 11.5cm", "1anta": 150, "2ante": 200 },
SS125: { nome: "Scorrevole scomparsa 12.5cm", "1anta": 150, "2ante": 200 },
SS145: { nome: "Scorrevole scomparsa 14.5cm", "1anta": 150, "2ante": 200 },
SAR: { nome: "Armonico", "1anta": 180, "2ante": 280 },
SAP: { nome: "Applauso", "1anta": 180, "2ante": 280 },
SES: { nome: "Rasomuro", "1anta": 0, "2ante": 0 },
SGL: { nome: "Gran luce", "2ante": 320 },
SPR: { nome: "Pratico", "2ante": 600 }
    },

    // ==================== TELAI E CORNICI ====================
    telai_cornici: {
"Lineo + Recta": 0,       // Standard
"Lineo + Plana": 15,
"Lineo + Curva": 30,
"Lineo + Sagoma": 80,
"Lineo + Ampia": 30,
"Lineo + Barocca": 220,
"Lineo + Nove": 15,
"Lineo + Mini": 50,       // Solo laccati lisci
"Lineo + Design": 70,    // Solo laccati lisci
"Radius + Recta": 0,
"Radius + Curva": 30,
"Radius + Sagoma": 80,
"Radius + Barocca": 220
    },

    // ==================== SUPPLEMENTI FERRAMENTA ====================
    ferramenta: {
finiture: {
    "cromo_satinata": 0,  // Standard
    "cromo_lucida": 10,
    "bronzata": 10,
    "ottone_lucida": 10,
    "magnetica_bianca": 20,
    "magnetica_nera": 20
},
serratura: {
    "patent": 0,         // Standard
    "libero_occupato": 10,
    "yale": 30,
    "magnetica": 10      // Maggiorazione
},
maniglie_S_NZIALE: {
    "a_L_h14": 0,
    "a_L_h20": 10,
    "a_L_h40": 20,
    "a_L_h50": 25,
    "a_L_h100": 110,
    "quadrata_inox_64": 80,
    "rettangolare_inox_150": 90
}
    },

    // ==================== SUPPLEMENTI ALLUMINIO S-NZIALE ====================
    supplementi_alluminio: {
argento: 0,
laccati_serie: 340,
laccati_fuori_serie: 580,
ferramenta_laccata: 40,
telaio_minimale: -200
    },

    // ==================== SUPPLEMENTI EXTRA ALTEZZA ====================
    extra_altezza: {
"fino_220": 0.05,  // +5%
"fino_240": 0.10,  // +10%
"fino_270": 0.20,  // +20%
"fino_300": 0.30   // +30%
    },

    // ==================== LAVORAZIONI ====================
    lavorazioni: {
ante: {
    "LA01": { desc: "Anta sollevata/ribassata", prezzo: 15 },
    "LA03": { desc: "Rinforzo MDF 8mm", prezzo: 65 },
    "LA04": { desc: "Rinforzo MDF 5mm", prezzo: 35 },
    "LA09": { desc: "Anta spessore 38mm", prezzo: 50 },
    "LA11": { desc: "Predisposizione griglie aerazione", prezzo: 40 },
    "LA12": { desc: "Specchiatura a rombo", prezzo: 30 },
    "LA13": { desc: "Specchiatura triangolare", prezzo: 80 },
    "LA14": { desc: "Specchio complanare", prezzo: 570 },
    "LA15": { desc: "Predisposizione maniglie incasso", prezzo: 30 },
    "LA16": { desc: "Predisposizione kit chiusura", prezzo: 50 },
    "LA18": { desc: "Impiallacciatura a telaio", prezzo: 45 },
    "LA19": { desc: "Anta inferiore 26cm", prezzo: 45 },
    "LA20": { desc: "Predisposizione chiudiporta aereo", prezzo: 35 },
    "LA21": { desc: "Predisposizione maniglione antipanico", prezzo: 35 },
    "LA30": { desc: "Fermavetro ribassato", prezzo: 38 },
    "LA31": { desc: "Fermavetri complanari inglesi (cad)", prezzo: 25 },
    "LA32": { desc: "Fermavetri complanari 1 lato (cad)", prezzo: 200 },
    "LA33": { desc: "Fermavetro complanare", prezzo: 80 },
    "LA38": { desc: "Predisposizione vetro 6-19mm", prezzo: 20 },
    "LA53": { desc: "Anta mobile su semifissa (scomparsa)", prezzo: 100 },
    "LA55": { desc: "Anta mobile su semifissa (anuba)", prezzo: 150 },
    "LA70": { desc: "Raddrizza ante", prezzo: 150 }
},
verniciatura: {
    "LV01": { desc: "2 colori (interno/esterno)", prezzo: 200 },
    "LV02": { desc: "2 essenze (interno/esterno)", prezzo: 150 },
    "LV03": { desc: "Anta diversa da telaio", prezzo: 25 },
    "LV04": { desc: "1 lato essenza + 1 lato laccato", prezzo: 200 },
    "LV06": { desc: "Lucida trasparente spazzolata", prezzo: 400 },
    "LV10": { desc: "Finitura anticato", prezzo: 400 },
    "LV13": { desc: "Finitura lusso", prezzo: 400 }
},
telai: {
    "LT01": { desc: "Telaio senza traverso", prezzo: 15 }
}
    },

    // ==================== VETRI ====================
    vetri: {
tipologie: {
    trasparente: 0,
    acidato: 0,
    extra_chiaro: 200,
    grigio: 100,
    bronzo: 100,
    semiriflettente: 100
},
speciali_kikka: {
    sabbiati_flessya: 500,
    sabbia: 500,
    scavo: 750,
    stampati: 500,
    stampa_digitale: 1350,
    laccato_lucido: 1050,
    laccato_acidato: 1340,
    tessuto: 1000,
    materia: 1000
},
maggiorazioni_120x288: {
    extra_chiaro: 300,
    grigio: 150,
    bronzo: 150,
    sabbiati: 700,
    scavo: 950,
    stampati: 1000,
    stampa_digitale: 1570,
    laccato_lucido: 1250,
    laccato_acidato: 1540,
    tessuto: 1300,
    materia: 1300
}
    },

    // ==================== ACCESSORI ====================
    accessori: {
capitelli: {
    "A-B-C": { "1anta": 150, "2ante": 200 }
},
cornici_unghiate: 120,
basette_20x10: 60,
stampa_digitale: {
    "anta_90x210": 350,
    "anta_cornici_90x210": 450,
    "anta_oltre_90x210": 550,
    "anta_cornici_oltre": 700,
    "personalizzata_90x210": 450,
    "personalizzata_oltre": 650
},
effetto_essenza: 128,
tinta_campione_fino_3: 250,
tinta_campione_oltre_3: 180,
tranciato_orizzontale: 38
    },

    // ==================== FUNZIONI CALCOLO ====================
    
    /**
     * Calcola il prezzo di una porta FLESSYA
     */
    calcolaPrezzo: function(params) {
const {
    linea,
    finitura,
    dimensione,       // es: "80x210", "90x210", etc
    modello,
    versione,
    telaio_cornice,
    spessore_muro,
    accessori = []
} = params;

let prezzoTotale = 0;
let dettaglio = [];

// 1. Prezzo base
const prezziLinea = this.prezzi_base[linea];
if (!prezziLinea || !prezziLinea[finitura]) {
    return { errore: "Linea o finitura non trovata" };
}

const indice = this.getIndiceDimensione(linea, dimensione);
const prezzoBase = prezziLinea[finitura][indice];
prezzoTotale += prezzoBase;
dettaglio.push({ voce: "Prezzo base", importo: prezzoBase });

// 2. Supplemento modello
if (modello && this.supplementi_modelli[linea]) {
    const suppModello = this.supplementi_modelli[linea][modello];
    if (suppModello) {
        const chiave = dimensione.includes("120") ? "120x288" : "90x210";
        const importoModello = suppModello[chiave] || 0;
        prezzoTotale += importoModello;
        if (importoModello > 0) {
            dettaglio.push({ voce: `Modello ${modello}`, importo: importoModello });
        }
    }
}

// 3. Supplemento versione
if (versione && this.versioni[versione]) {
    const suppVersione = this.versioni[versione]["1anta"] || 0;
    prezzoTotale += suppVersione;
    if (suppVersione > 0) {
        dettaglio.push({ voce: `Versione ${versione}`, importo: suppVersione });
    }
}

// 4. Supplemento telaio/cornice
if (telaio_cornice && this.telai_cornici[telaio_cornice]) {
    const suppTelaio = this.telai_cornici[telaio_cornice];
    prezzoTotale += suppTelaio;
    if (suppTelaio > 0) {
        dettaglio.push({ voce: telaio_cornice, importo: suppTelaio });
    }
}

// 5. Accessori
accessori.forEach(acc => {
    if (acc.prezzo) {
        prezzoTotale += acc.prezzo;
        dettaglio.push({ voce: acc.nome, importo: acc.prezzo });
    }
});

return {
    prezzoListino: prezzoTotale,
    prezzoNetto: Math.round(prezzoTotale * (1 - this.info.sconto)),
    sconto: this.info.sconto,
    dettaglio: dettaglio
};
    },
    
    /**
     * Ottiene l'indice della dimensione nell'array prezzi
     */
    getIndiceDimensione: function(linea, dimensione) {
// Dimensioni standard: [80x210, 90x210, 120x210, 120x240, 120x288]
// PLENIA/KIKKA: [80x210, 90x210, 120x210, 90x278, 120x278]
const mappa = {
    "60x210": 0,
    "70x210": 1,
    "80x210": 0,
    "90x210": 1,
    "100x210": 2,
    "110x210": 3,
    "120x210": 2,
    "104x210": 2,
    "90x278": 3,
    "120x240": 3,
    "104x240": 3,
    "120x278": 4,
    "94x276": 4,
    "120x288": 4
};
return mappa[dimensione] || 1;
    }
};

// Export per Node.js

console.log('✅ FLESSYA-DATABASE-2025 caricato');
