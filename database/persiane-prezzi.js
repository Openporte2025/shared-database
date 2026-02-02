// ═══════════════════════════════════════════════════════════════════════════
// 🔧 PUNTO PERSIANE 2025 - Database Persiane 45/52 Collezione Infinita
// Fonte: Listino prezzi 45/52 aggiornato 14/10/2025
// Sconto installatore: 55%
// Versione: 2.0.0 - COMPLETA con tutte le tipologie e logica corretta
// ═══════════════════════════════════════════════════════════════════════════

const PUNTO_PERSIANE_2025 = {
    version: '2.0.0',
    info: { 
        fornitore: "PUNTO PERSIANE", 
        listino: "45/52 Collezione Infinita", 
        dataListino: "14/10/2025",
        sconto: 0.55  // 55% sconto installatore
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TIPOLOGIE DISPONIBILI
    // ═══════════════════════════════════════════════════════════════════════
    tipologie: {
        F1:  { nome: "Finestra 1 anta", ante: 1, tipo: 'finestra' },
        F2:  { nome: "Finestra 2 ante", ante: 2, tipo: 'finestra' },
        F3:  { nome: "Finestra 3 ante", ante: 3, tipo: 'finestra' },
        F4:  { nome: "Finestra 4 ante", ante: 4, tipo: 'finestra' },
        PF1: { nome: "Porta Finestra 1 anta", ante: 1, tipo: 'portafinestra' },
        PF2: { nome: "Porta Finestra 2 ante", ante: 2, tipo: 'portafinestra' },
        PF3: { nome: "Porta Finestra 3 ante", ante: 3, tipo: 'portafinestra' },
        PF4: { nome: "Porta Finestra 4 ante", ante: 4, tipo: 'portafinestra' }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MODELLI CON GRUPPI MAGGIORAZIONE
    // ATTENZIONE: Le maggiorazioni sono in EURO NETTI per COMMESSA, non %!
    // ═══════════════════════════════════════════════════════════════════════
    modelli: {
        // STECCA FISSA TONDA
        angela:      { cat: "tonda", nome: "Angela", gruppo: 1 },
        giulia:      { cat: "tonda", nome: "Giulia", gruppo: 1 },
        luna:        { cat: "tonda", nome: "Luna", gruppo: 1 },
        
        // STECCA FISSA ROMBOIDALE
        piemontese:  { cat: "romboidale", nome: "Piemontese", gruppo: 2 },
        firenze:     { cat: "romboidale", nome: "Firenze", gruppo: 2 },
        carolina:    { cat: "romboidale", nome: "Carolina", gruppo: 2 },
        storica:     { cat: "romboidale", nome: "Storica", gruppo: 2 },
        camelia:     { cat: "romboidale", nome: "Camelia", gruppo: 2 },
        
        // ORIENTABILI
        aurora:      { cat: "orientabile", nome: "Aurora", gruppo: 1 },
        alice:       { cat: "orientabile", nome: "Alice", gruppo: 1 },
        
        // CIECHE E DOGATE
        nerina:      { cat: "cieca", nome: "Nerina", gruppo: 2 },
        nerina_r:    { cat: "cieca", nome: "Nerina [R]", gruppo: 2 },
        canazei:     { cat: "cieca", nome: "Canazei", gruppo: 3 },
        alto_adige:  { cat: "cieca", nome: "Alto Adige", gruppo: 1 },
        alto_adige_r:{ cat: "cieca", nome: "Alto Adige [R]", gruppo: 1 },
        cortina:     { cat: "cieca", nome: "Cortina", gruppo: 1 },
        cortina_r:   { cat: "cieca", nome: "Cortina [R]", gruppo: 1 },
        diamante:    { cat: "cieca", nome: "Diamante", gruppo: 3 },
        oscura:      { cat: "cieca", nome: "Oscura", gruppo: 1 },
        oscura_r:    { cat: "cieca", nome: "Oscura [R]", gruppo: 1 },
        
        // SCANDOLA
        scandola:    { cat: "scandola", nome: "Scandola", gruppo: 2 },
        scandola_duo:{ cat: "scandola", nome: "Scandola Duo", gruppo: 2 },
        scandola_tt: { cat: "scandola", nome: "Scandola [TT]", gruppo: 2 },
        oscura_duo:  { cat: "scandola", nome: "Oscura Duo", gruppo: 2 },
        
        // ULTRATECH (tutti gruppo 1)
        aida:        { cat: "ultratech", nome: "Aida", gruppo: 3 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGGIORAZIONI PER GRUPPO (€ NETTI per commessa)
    // Basate sul totale ordine NETTO (dopo sconto 55%)
    // ═══════════════════════════════════════════════════════════════════════
    maggiorazioniGruppo: {
        // Gruppo 1: Angela, Giulia, Luna, Aurora, Alto Adige, Cortina, Oscura, etc.
        1: {
            soglie: [697, 1197, 3897, Infinity],
            maggiorazioni: [97, 57, 0, 0]  // € netti
        },
        // Gruppo 2: Firenze, Camelia, Piemontese, Storica, Nerina, Scandola
        2: {
            soglie: [697, 1197, 3897, Infinity],
            maggiorazioni: [157, 127, 57, 0]  // € netti
        },
        // Gruppo 3: Canazei, Diamante, Aida
        3: {
            soglie: [697, 1197, 3897, Infinity],
            maggiorazioni: [207, 127, 0, 157]  // € netti (ultimo scaglione ha 157!)
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // CATEGORIE COLORE (maggiorazioni in %)
    // ═══════════════════════════════════════════════════════════════════════
    colori: {
        cat_01:  { nome: "Standard", magg: 0, codici: ['CPF910L', 'CPF113L', 'CPF701L', 'CPF716L', 'CPF605L', 'CPF609T', 'CPF817L', 'CPF735L'] },
        cat_02a: { nome: "Opachi extra", magg: 0.03, codici: ['CPF609L', 'CPF621L', 'CPF119L', 'CPF524L', 'CPF811L'] },
        cat_02b: { nome: "Textured", magg: 0.05, codici: ['CPF910T', 'CPF113T', 'CPF701T', 'CPF305T', 'CPF605T', 'CPF817T'] },
        cat_03:  { nome: "Legno EZY", magg: 0.20, codici: ['CPF820H', 'CPF818H', 'CPF813H', 'CPFR811', 'CPF812H', 'CPFN630', 'CPFN632'] },
        cat_04:  { nome: "Legno Élite", magg: 0.25, codici: ['HD303', 'HD360', 'HD366'] },
        cat_05:  { nome: "Legno Electo", magg: 0.25, codici: ['CPF90RC', 'CPF91RS', 'CPF51CR'] },
        cat_06:  { nome: "Legno sublimato", magg: 0.30, codici: ['CPF358R', 'CPF127R', 'CPF375R', 'CPF378R', 'CPF317R'] },
        cat_07:  { nome: "Legno speciale", magg: 0.30, codici: ['CPF70KA'] },
        cat_08:  { nome: "Speciali (a preventivo)", magg: 0, costoFisso: 237, codici: ['CPFSLV7', 'CPFRGG4', 'CPF744L'] }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GRIGLIE PREZZI BASE (Cat. 1 - Standard)
    // Stecca fissa tonda
    // ═══════════════════════════════════════════════════════════════════════
    
    // F1 - Finestra 1 anta (pag. 32)
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
    
    // F2 - Finestra 2 ante (pag. 33) - CORRETTO!
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
            [610, 633, 656, 680, 700, 721, 743, 767],  // CORRETTO
            [627, 650, 672, 695, 720, 742, 766, 790],  // CORRETTO
            [642, 667, 694, 720, 743, 768, 792, 819],  // CORRETTO
            [676, 702, 728, 757, 782, 809, 834, 859],  // CORRETTO
            [693, 719, 744, 778, 803, 832, 859, 881],  // CORRETTO
            [710, 735, 761, 800, 825, 856, 884, 902]   // CORRETTO
        ]
    },
    
    // PF1 - Porta Finestra 1 anta (pag. 36)
    griglie_PF1: {
        L: [500, 600, 700, 800, 900, 1000, 1100, 1200],
        H: [1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700],
        P: [
            [446, 474, 504, 530, 563, 590, 619, 648],
            [451, 481, 510, 543, 575, 603, 636, 670],
            [466, 496, 529, 562, 591, 621, 656, 691],
            [471, 506, 542, 575, 608, 639, 671, 703],
            [491, 522, 553, 590, 623, 659, 691, 722],
            [491, 529, 567, 600, 638, 673, 710, 747],
            [506, 542, 578, 616, 656, 691, 729, 767],
            [516, 553, 591, 631, 669, 708, 745, 785],
            [526, 565, 604, 645, 682, 726, 764, 802],
            [536, 577, 617, 659, 695, 743, 781, 821]
        ]
    },
    
    // PF2 - Porta Finestra 2 ante (pag. 37)
    griglie_PF2: {
        L: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
        H: [1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700],
        P: [
            [761, 789, 817, 847, 875, 906, 933, 961],
            [776, 804, 834, 866, 894, 927, 955, 985],
            [794, 826, 858, 887, 919, 954, 983, 1015],
            [815, 845, 875, 909, 941, 976, 1007, 1040],
            [828, 865, 901, 932, 966, 1002, 1035, 1068],
            [848, 881, 915, 952, 985, 1023, 1058, 1094],
            [866, 902, 939, 976, 1012, 1051, 1088, 1123],
            [881, 919, 958, 995, 1034, 1071, 1111, 1147],
            [894, 935, 977, 1014, 1054, 1091, 1135, 1173],
            [910, 954, 997, 1035, 1077, 1112, 1159, 1198]
        ]
    },
    
    // PF3 - Porta Finestra 3 ante (pag. 38)
    griglie_PF3: {
        L: [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300],
        H: [1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700],
        P: [
            [1192, 1222, 1252, 1283, 1312, 1341, 1372, 1402, 1430, 1459, 1489, 1518],
            [1221, 1250, 1278, 1308, 1336, 1370, 1400, 1431, 1464, 1490, 1523, 1554],
            [1242, 1275, 1309, 1341, 1375, 1406, 1441, 1474, 1506, 1539, 1568, 1601],
            [1280, 1311, 1341, 1373, 1404, 1436, 1473, 1506, 1540, 1573, 1606, 1640],
            [1302, 1337, 1373, 1409, 1444, 1477, 1513, 1548, 1583, 1614, 1651, 1685],
            [1326, 1361, 1397, 1432, 1468, 1506, 1543, 1578, 1612, 1653, 1687, 1725],
            [1352, 1391, 1428, 1466, 1504, 1541, 1581, 1614, 1655, 1694, 1730, 1767],
            [1380, 1419, 1458, 1498, 1537, 1572, 1611, 1653, 1689, 1728, 1767, 1808],
            [1408, 1447, 1488, 1528, 1568, 1602, 1644, 1692, 1723, 1762, 1804, 1848],
            [1435, 1476, 1517, 1559, 1600, 1634, 1677, 1731, 1756, 1796, 1842, 1889]
        ]
    },
    
    // PF4 - Porta Finestra 4 ante (pag. 39)
    griglie_PF4: {
        L: [1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000],
        H: [1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700],
        P: [
            [1715, 1742, 1772, 1801, 1829, 1859, 1889, 1916, 1945, 1975, 2004, 2033, 2062, 2091, 2119],
            [1742, 1773, 1803, 1833, 1862, 1894, 1926, 1954, 1984, 2014, 2047, 2075, 2104, 2133, 2162],
            [1780, 1813, 1846, 1878, 1909, 1940, 1968, 2000, 2033, 2068, 2102, 2132, 2163, 2193, 2225],
            [1821, 1853, 1884, 1914, 1945, 1978, 2011, 2044, 2077, 2112, 2146, 2177, 2207, 2238, 2270],
            [1850, 1887, 1924, 1961, 1997, 2028, 2059, 2092, 2124, 2162, 2199, 2230, 2263, 2295, 2326],
            [1891, 1924, 1956, 1990, 2024, 2060, 2097, 2131, 2165, 2203, 2241, 2275, 2310, 2345, 2379],
            [1926, 1963, 1999, 2036, 2073, 2110, 2146, 2182, 2218, 2257, 2296, 2333, 2369, 2406, 2443],
            [1954, 1993, 2033, 2072, 2111, 2147, 2184, 2223, 2261, 2298, 2336, 2377, 2416, 2456, 2497],
            [1984, 2025, 2067, 2108, 2148, 2186, 2223, 2263, 2304, 2340, 2377, 2420, 2463, 2507, 2550],
            [2012, 2056, 2099, 2143, 2187, 2224, 2261, 2304, 2346, 2381, 2416, 2463, 2511, 2559, 2606]
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TELAI (prezzi per telaio su 3 lati)
    // ═══════════════════════════════════════════════════════════════════════
    telai: {
        TH10: {
            nome: "TH10 - Telaio base",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [77, 84, 92, 97, 111, 117, 125],
                [96, 99, 111, 114, 128, 134, 140],
                [114, 119, 133, 136, 140, 147, 153],
                [127, 134, 146, 149, 153, 161, 170]
            ]
        },
        TH40: {
            nome: "TH40 - Telaio 40mm",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [116, 123, 136, 145, 162, 172, 186],
                [146, 152, 167, 174, 191, 201, 215],
                [174, 181, 198, 202, 214, 224, 237],
                [196, 202, 220, 228, 235, 258, 260]
            ]
        },
        TH41: {
            nome: "TH41 - Telaio 41mm",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [65, 67, 71, 78, 84, 87, 92],
                [76, 79, 85, 90, 95, 98, 105],
                [90, 92, 93, 98, 102, 109, 114],
                [98, 100, 107, 108, 113, 119, 123]
            ]
        },
        TH45: {
            nome: "TH45 - Telaio 45mm",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [65, 67, 71, 74, 84, 87, 92],
                [76, 79, 85, 86, 95, 98, 105],
                [90, 92, 96, 98, 102, 109, 114],
                [98, 100, 107, 111, 113, 119, 123]
            ]
        },
        TH46R: {
            nome: "TH46R - Telaio 46mm rinforzato",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [105, 112, 121, 127, 138, 148, 158],
                [134, 138, 147, 152, 166, 174, 188],
                [157, 163, 172, 177, 187, 195, 207],
                [175, 183, 191, 198, 203, 215, 228]
            ]
        },
        TH62: {
            nome: "TH62 - Telaio 62mm",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [116, 123, 136, 145, 162, 172, 186],
                [146, 152, 167, 174, 191, 201, 215],
                [174, 181, 198, 202, 214, 224, 237],
                [196, 202, 220, 228, 235, 245, 260]
            ]
        },
        TH80: {
            nome: "TH80 - Telaio 80mm",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [135, 145, 161, 171, 190, 201, 221],
                [174, 184, 199, 209, 229, 242, 259],
                [218, 228, 237, 247, 258, 271, 289],
                [247, 256, 268, 275, 286, 299, 319]
            ]
        },
        TH53: {
            nome: "TH53 - Telaio a sporgere (senza cerniere)",
            L: [[400,699], [700,909], [1000,1209], [1300,1509], [1600,1909], [2000,2309], [2400,3000]],
            H: [[700,1399], [1400,1899], [1900,2299], [2300,2700]],
            P: [
                [142, 149, 158, 164, 174, 185, 196],
                [173, 178, 188, 194, 202, 214, 226],
                [194, 201, 210, 216, 224, 236, 247],
                [216, 223, 231, 240, 247, 257, 267]
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUPPLEMENTI APERTURA A LIBRO
    // ═══════════════════════════════════════════════════════════════════════
    supplementiApertura: {
        F2_LIB: 45,      // € per persiana
        F2_LIB_A: 30,    // € per persiana (asimmetrico)
        PF2_LIB: 45,
        PF2_LIB_A: 30
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FUNZIONI DI CALCOLO
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Trova prezzo base in griglia
     */
    trovaPrezzoGriglia: function(tipologia, L_mm, H_mm) {
        const grigliaKey = `griglie_${tipologia}`;
        const g = this[grigliaKey];
        
        if (!g) {
            console.warn(`⚠️ Griglia non trovata per tipologia: ${tipologia}`);
            return null;
        }
        
        // Trova indice L (prima colonna >= L_mm)
        let idxL = g.L.findIndex(l => L_mm <= l);
        if (idxL === -1) idxL = g.L.length - 1;
        
        // Trova indice H (prima riga >= H_mm)
        let idxH = g.H.findIndex(h => H_mm <= h);
        if (idxH === -1) idxH = g.H.length - 1;
        
        return {
            prezzo: g.P[idxH][idxL],
            L_grid: g.L[idxL],
            H_grid: g.H[idxH],
            idxL: idxL,
            idxH: idxH
        };
    },
    
    /**
     * Trova prezzo telaio
     */
    trovaPrezzoTelaio: function(codiceTelaio, L_mm, H_mm) {
        const t = this.telai[codiceTelaio];
        if (!t) {
            console.warn(`⚠️ Telaio non trovato: ${codiceTelaio}`);
            return 0;
        }
        
        // Trova indice L
        let idxL = t.L.findIndex(([min, max]) => L_mm >= min && L_mm <= max);
        if (idxL === -1) idxL = t.L.length - 1;
        
        // Trova indice H
        let idxH = t.H.findIndex(([min, max]) => H_mm >= min && H_mm <= max);
        if (idxH === -1) idxH = t.H.length - 1;
        
        return t.P[idxH][idxL];
    },
    
    /**
     * Trova categoria colore da codice
     */
    trovaCategoriaColore: function(codiceColore) {
        for (const [cat, dati] of Object.entries(this.colori)) {
            if (dati.codici && dati.codici.includes(codiceColore)) {
                return { categoria: cat, ...dati };
            }
        }
        return { categoria: 'cat_01', ...this.colori.cat_01 };
    },
    
    /**
     * Calcola maggiorazione modello basata sul totale commessa
     */
    calcolaMaggiorazioneModello: function(codiceModello, totaleCommessaNetto) {
        const mod = this.modelli[codiceModello];
        if (!mod) return 0;
        
        const gruppo = this.maggiorazioniGruppo[mod.gruppo];
        if (!gruppo) return 0;
        
        // Trova lo scaglione giusto
        for (let i = 0; i < gruppo.soglie.length; i++) {
            if (totaleCommessaNetto < gruppo.soglie[i]) {
                return gruppo.maggiorazioni[i];
            }
        }
        return 0;
    },
    
    /**
     * Calcola prezzo completo persiana
     * @param {string} tipologia - F1, F2, PF1, PF2, etc.
     * @param {string} modello - codice modello (es. 'angela', 'giulia')
     * @param {number} L_mm - larghezza in mm
     * @param {number} H_mm - altezza in mm
     * @param {string} codiceColore - codice colore (es. 'CPF910L')
     * @param {string|null} codiceTelaio - codice telaio (es. 'TH40') o null
     * @param {number} totaleCommessaNetto - totale commessa per calcolo scaglioni (opzionale)
     */
    calcolaPrezzo: function(tipologia, modello, L_mm, H_mm, codiceColore = null, codiceTelaio = null, totaleCommessaNetto = 0) {
        // 1. Prezzo base da griglia
        const griglia = this.trovaPrezzoGriglia(tipologia, L_mm, H_mm);
        if (!griglia) {
            return { errore: `Tipologia ${tipologia} non supportata` };
        }
        
        // 2. Info modello
        const mod = this.modelli[modello] || { nome: modello, cat: 'standard', gruppo: 1 };
        
        // 3. Info colore
        const coloreInfo = codiceColore ? this.trovaCategoriaColore(codiceColore) : { magg: 0, categoria: 'cat_01' };
        
        // 4. Prezzo telaio
        const prezzoTelaio = codiceTelaio ? this.trovaPrezzoTelaio(codiceTelaio, L_mm, H_mm) : 0;
        
        // 5. Calcolo prezzi
        const prezzoBase = griglia.prezzo;
        const prezzoConTelaio = prezzoBase + prezzoTelaio;
        const prezzoConColore = prezzoConTelaio * (1 + coloreInfo.magg);
        const costoFissoColore = coloreInfo.costoFisso || 0;
        const prezzoListino = prezzoConColore + costoFissoColore;
        
        // 6. Prezzo netto (con sconto 55%)
        const prezzoNetto = prezzoListino * (1 - this.info.sconto);
        
        // 7. Maggiorazione modello (€ netti, basata su totale commessa)
        const maggiorazioneModelloNetto = this.calcolaMaggiorazioneModello(modello, totaleCommessaNetto);
        
        return {
            tipologia: tipologia,
            modello: mod.nome,
            categoria: mod.cat,
            dimensioni: `${L_mm}x${H_mm}`,
            griglia: {
                L: griglia.L_grid,
                H: griglia.H_grid,
                prezzo: griglia.prezzo
            },
            telaio: {
                codice: codiceTelaio,
                prezzo: prezzoTelaio
            },
            colore: {
                codice: codiceColore,
                categoria: coloreInfo.categoria,
                maggiorazione: `+${(coloreInfo.magg * 100).toFixed(0)}%`,
                costoFisso: costoFissoColore
            },
            prezzoBase: prezzoBase,
            prezzoConTelaio: prezzoConTelaio,
            prezzoListino: Math.round(prezzoListino * 100) / 100,
            sconto: '55%',
            prezzoNetto: Math.round(prezzoNetto * 100) / 100,
            maggiorazioneModelloNetto: maggiorazioneModelloNetto,
            prezzoNettoFinale: Math.round((prezzoNetto + maggiorazioneModelloNetto) * 100) / 100,
            note: maggiorazioneModelloNetto > 0 ? 
                `Maggiorazione modello: +€${maggiorazioneModelloNetto} netti (basata su scaglione commessa)` : null
        };
    },
    
    /**
     * Calcola totale commessa con maggiorazioni
     * @param {Array} items - array di {tipologia, modello, L, H, colore, telaio, qta}
     */
    calcolaTotaleCommessa: function(items) {
        // Prima passata: calcola totale netto senza maggiorazioni modello
        let totaleNettoBase = 0;
        const dettagli = [];
        
        for (const item of items) {
            const qta = item.qta || 1;
            const calc = this.calcolaPrezzo(
                item.tipologia, 
                item.modello, 
                item.L, 
                item.H, 
                item.colore, 
                item.telaio,
                0  // prima passata senza totale
            );
            
            if (!calc.errore) {
                totaleNettoBase += calc.prezzoNetto * qta;
                dettagli.push({
                    ...item,
                    qta: qta,
                    prezzoUnitarioNetto: calc.prezzoNetto,
                    subtotaleNetto: calc.prezzoNetto * qta,
                    dettaglioCalcolo: calc
                });
            }
        }
        
        // Seconda passata: aggiungi maggiorazioni modello basate sul totale
        let maggiorazioniModello = 0;
        const modelliUsati = new Set();
        
        for (const det of dettagli) {
            // La maggiorazione modello si applica una volta per modello per commessa
            if (!modelliUsati.has(det.modello)) {
                const magg = this.calcolaMaggiorazioneModello(det.modello, totaleNettoBase);
                maggiorazioniModello += magg;
                det.maggiorazioneModello = magg;
                modelliUsati.add(det.modello);
            } else {
                det.maggiorazioneModello = 0;
            }
        }
        
        return {
            items: dettagli,
            totaleNettoBase: Math.round(totaleNettoBase * 100) / 100,
            maggiorazioniModello: maggiorazioniModello,
            totaleNettoFinale: Math.round((totaleNettoBase + maggiorazioniModello) * 100) / 100,
            scaglione: totaleNettoBase < 697 ? '< €697' : 
                       totaleNettoBase < 1197 ? '€697-1197' :
                       totaleNettoBase < 3897 ? '€1197-3897' : '> €3897'
        };
    },
    
    /**
     * Lista modelli disponibili
     */
    getModelli: function() {
        return Object.entries(this.modelli).map(([codice, m]) => ({
            codice: codice,
            nome: m.nome,
            categoria: m.cat,
            gruppo: m.gruppo
        }));
    },
    
    /**
     * Lista telai disponibili
     */
    getTelai: function() {
        return Object.entries(this.telai).map(([codice, t]) => ({
            codice: codice,
            nome: t.nome
        }));
    },
    
    /**
     * Lista tipologie disponibili
     */
    getTipologie: function() {
        return Object.entries(this.tipologie).map(([codice, t]) => ({
            codice: codice,
            nome: t.nome,
            ante: t.ante,
            tipo: t.tipo
        }));
    }
};

// Test al caricamento
if (typeof console !== 'undefined') {
    console.log('✅ PUNTO_PERSIANE_2025 v2.0.0 caricato');
    console.log('   📋 Tipologie:', Object.keys(PUNTO_PERSIANE_2025.tipologie).join(', '));
    console.log('   🎨 Modelli:', Object.keys(PUNTO_PERSIANE_2025.modelli).length);
    console.log('   🔧 Telai:', Object.keys(PUNTO_PERSIANE_2025.telai).length);
    
    // Test rapido
    const test = PUNTO_PERSIANE_2025.calcolaPrezzo('F1', 'angela', 800, 1200, 'CPF910L', 'TH40', 500);
    console.log('   🧪 Test F1 800x1200 Angela + TH40:', test.prezzoNettoFinale, '€ netti');
}
