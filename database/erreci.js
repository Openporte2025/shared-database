/**
 * ERRECI DATABASE UNIFICATO 2025
 * Grate di Sicurezza - Erreci Sicurezza S.r.l.
 * 
 * LINEE PRODOTTO:
 * - EDILIA2: Classe 2 (RC2) - Telaio 30x30mm
 * - EVOLUTA18: Classe 3 (RC3) - Telaio 40x40mm  
 * - SIKURA: Classe 4 (RC4) - Telaio 40x40mm rinforzato
 * - LIBERA: Classe 3 (RC3) - Telaio 40x40mm con cerniera a scomparsa
 * 
 * Versione: 1.2
 * Data: 19/01/2026
 * Aggiornamento: Aggiunta linea LIBERA completa (18 modelli, cerniera a scomparsa)
 */

const ERRECI_DATABASE_2025 = {
    
    // ========================================
    // INFORMAZIONI AZIENDA (COMUNI)
    // ========================================
    
    info: {
        versione: "1.2",
        dataAggiornamento: "2026-01-19",
        fornitore: "Erreci Sicurezza S.r.l.",
        indirizzo: "Viale delle industrie 5/7, 26845 Codogno (LO)",
        telefono: "0377/436041",
        email: "info@errecisicurezza.com",
        ordini: "eleonora@errecisicurezza.com",
        sconto: 0,
        linee: ["EDILIA2", "EVOLUTA18", "SIKURA", "LIBERA"]
    },

    // ========================================
    // CONFIGURAZIONI COMUNI
    // ========================================
    
    comune: {
        // Colori standard (inclusi nel prezzo) - identici per tutte le linee
        coloriStandard: [
            "Verde Marmo", "Marrone Marmo", "Grigio Marmo", "Bianco Marmo",
            "Grigio Micaceo", "Nero Micaceo", "Argento Micaceo",
            "Nero Martellato", "Rame Martellato", "Verde Ramato Martellato",
            "Grigio 400 SablÃƒÂ©", "Ruggine",
            "RAL 6009 ruvido", "RAL 6005 ruvido", "RAL 7035 ruvido", 
            "RAL 8017 ruvido", "RAL 9005 ruvido", "RAL 1013 ruvido", "RAL 9010 ruvido"
        ],
        
        // Altezza cilindro
        altezzaCilindro: {
            finestra: 600,
            porta: 1100
        },
        
        // Supplementi comuni
        supplementi: {
            coloreRAL: { sotto20mq: 340, sopra20mq: 0 },
            imballo: { percentuale: 2 },
            approntamentoRapido: { percentuale: 10 },
            profiliAggiuntivi: { perGrata: 46 }
        },
        
        // Accessori comuni a tutte le linee
        accessori: {
            allarme: {
                predisposizione: 71,
                sensoreIntegrato: 194,
                sensoreVolumetrico: 163,
                sensoreNonIntegrato: 204,
                sirenaEsterna: 469,
                centraleCompleta: 918,
                centraleDuplicatore: 316,
                visionWlinkTastiera: 367,
                telecomandoAggiuntivo: 102
            },
            cilindri: {
                passanteAntitrapanoDefender: 38,
                mezzoCilindroEVO_K64: 49,
                cilindroPassanteEVO_K64_Defender: 114,
                carbonitrurazione: 137
            },
            vari: {
                trattamentoVerniceProtettiva: 38,
                chiavistelloPersiana: 35,
                predisposizioneZanzarieraV: 70,
                predisposizioneZanzarieraO: 143,
                supportoChiavistelloGrataFissa: 15
            },
            ricambi: {
                serratura2Punti: 38,
                serratura4Punti: 72,
                mezzoCilindroAntitrapano: 49,
                cilindroAntitrapanoPassante: 73,
                mezzoCilindroEVO_K64: 61,
                cilindroPassanteEVO_K64: 93,
                defenderProtezione: 21,
                chiaveAggiuntiva: 13
            }
        },
        
        // Garanzia comune
        garanzia: {
            durata: 1,
            include: "Sostituzione componenti difettosi",
            esclusioni: [
                "Mancata osservanza manuale installazione",
                "Mancata osservanza manuale uso e manutenzione",
                "Modifiche o manomissioni",
                "Ritardo o inadempienza nei pagamenti",
                "Zone entro 200m da stabilimenti chimici/raffinerie",
                "Zone entro 200m dal mare (senza Primer Zinco)",
                "Installazioni oltre 2000m slm",
                "Danni da grandine e calamitÃƒÂ  naturali"
            ]
        }
    },

    // ========================================
    // TRASPORTI (COMUNI)
    // ========================================
    
    trasporti: {
        lombardiaPrincipale: {
            zone: ["BG", "BS", "CR", "LO", "MB", "MI", "MN", "PV"],
            prezzi: [28, 20, 16]
        },
        lombardiaSecondaria: {
            zone: ["SO", "CO", "LC", "VA"],
            prezzi: [33, 28, 20]
        },
        valleAosta: {
            zone: ["AO"],
            prezzi: [34, 30, 22]
        },
        piemonte: {
            zone: ["AL", "AT", "BI", "CN", "NO", "TO", "VB", "VC"],
            prezzi: [28, 20, 16]
        },
        liguria: {
            zone: ["GE", "IM", "SP", "SV"],
            prezzi: [30, 25, 16]
        },
        emiliaOccidentale: {
            zone: ["PC", "PR", "RE", "MO", "BO", "FE"],
            prezzi: [28, 20, 16]
        },
        emiliaOrientale: {
            zone: ["FC", "RA", "RN"],
            prezzi: [42, 38, 30]
        },
        venetoPrincipale: {
            zone: ["PD", "VI", "VR"],
            prezzi: [42, 38, 34]
        },
        venetoSecondario: {
            zone: ["BL", "RO", "VE", "TV"],
            prezzi: [46, 42, 38]
        },
        friuli: {
            zone: ["GO", "PN", "UD", "TS"],
            prezzi: [55, 50, 46]
        },
        trentino: {
            zone: ["BZ", "TN"],
            prezzi: [42, 38, 30]
        },
        toscanaNord: {
            zone: ["AR", "FI", "MS", "PI", "LU", "PT", "PO", "LI"],
            prezzi: [42, 38, 30]
        },
        toscanaSud: {
            zone: ["GR", "SI"],
            prezzi: [57, 52, 46]
        },
        marche: {
            zone: ["AN", "AP", "FM", "MC", "PU"],
            prezzi: [64, 57, 53]
        },
        aPreventivo: {
            zone: ["PG", "TR", "FR", "LT", "RI", "RM", "VT", "AQ", "CH", "PE", "TE",
                   "CB", "IS", "MT", "PZ", "AV", "BN", "CE", "NA", "SA",
                   "BA", "BAT", "BR", "FG", "LE", "TA", "CS", "CZ", "KR", "RC", "VV",
                   "AG", "CL", "CT", "EN", "ME", "PA", "RG", "SR", "TP",
                   "CA", "CI", "NU", "OG", "OR", "OT", "SS", "VS"],
            note: "A preventivo"
        }
    },

    // ========================================
    // FASCE DIMENSIONALI COMUNI
    // ========================================
    
    fasceDimensionali: {
        // Altezza comune a tutte le linee
        altezza: [
            { min: 640, max: 870, indice: 0 },
            { min: 871, max: 1100, indice: 1 },
            { min: 1101, max: 1350, indice: 2 },
            { min: 1351, max: 1600, indice: 3 },
            { min: 1601, max: 1750, indice: 4 },
            { min: 1751, max: 2100, indice: 5 },
            { min: 2101, max: 2350, indice: 6 },
            { min: 2351, max: 2600, indice: 7 },
            { min: 2601, max: 2850, indice: 8 }
        ],
        
        // Larghezza 1 anta EDILIA2/EVOLUTA18
        larghezza1Anta: [
            { min: 415, max: 475, indice: 0 },
            { min: 476, max: 535, indice: 1 },
            { min: 536, max: 595, indice: 2 },
            { min: 596, max: 655, indice: 3 },
            { min: 656, max: 715, indice: 4 },
            { min: 716, max: 775, indice: 5 },
            { min: 776, max: 835, indice: 6 },
            { min: 836, max: 895, indice: 7 },
            { min: 896, max: 955, indice: 8 },
            { min: 956, max: 1015, indice: 9 }
        ],
        
        // Larghezza 1 anta SIKURA (piÃƒÂ¹ larga)
        larghezza1AntaSikura: [
            { min: 600, max: 655, indice: 0 },
            { min: 656, max: 715, indice: 1 },
            { min: 716, max: 775, indice: 2 },
            { min: 776, max: 835, indice: 3 },
            { min: 836, max: 895, indice: 4 },
            { min: 896, max: 955, indice: 5 },
            { min: 956, max: 1015, indice: 6 },
            { min: 1016, max: 1075, indice: 7 },
            { min: 1076, max: 1135, indice: 8 },
            { min: 1136, max: 1200, indice: 9 }
        ],
        
        // Larghezza 2 ante EDILIA2/EVOLUTA18
        larghezza2Ante: [
            { min: 900, max: 962, indice: 0 },
            { min: 963, max: 1082, indice: 1 },
            { min: 1083, max: 1202, indice: 2 },
            { min: 1203, max: 1322, indice: 3 },
            { min: 1323, max: 1442, indice: 4 },
            { min: 1443, max: 1562, indice: 5 },
            { min: 1563, max: 1682, indice: 6 },
            { min: 1683, max: 1802, indice: 7 },
            { min: 1803, max: 1922, indice: 8 },
            { min: 1923, max: 2042, indice: 9 },
            { min: 2043, max: 2160, indice: 10 }
        ],
        
        // Larghezza 2 ante SIKURA
        larghezza2AnteSikura: [
            { min: 1000, max: 1082, indice: 0 },
            { min: 1083, max: 1202, indice: 1 },
            { min: 1203, max: 1322, indice: 2 },
            { min: 1323, max: 1442, indice: 3 },
            { min: 1443, max: 1562, indice: 4 },
            { min: 1563, max: 1682, indice: 5 },
            { min: 1683, max: 1802, indice: 6 },
            { min: 1803, max: 1922, indice: 7 },
            { min: 1923, max: 2042, indice: 8 },
            { min: 2043, max: 2160, indice: 9 }
        ],
        
        // Larghezza fissa (comune)
        larghezzaFissa: [
            { min: 415, max: 535, indice: 0 },
            { min: 536, max: 655, indice: 1 },
            { min: 656, max: 775, indice: 2 },
            { min: 776, max: 895, indice: 3 },
            { min: 896, max: 1015, indice: 4 },
            { min: 1016, max: 1135, indice: 5 },
            { min: 1136, max: 1255, indice: 6 },
            { min: 1256, max: 1375, indice: 7 },
            { min: 1376, max: 1495, indice: 8 },
            { min: 1496, max: 1615, indice: 9 },
            { min: 1616, max: 1735, indice: 10 },
            { min: 1736, max: 1855, indice: 11 },
            { min: 1856, max: 1975, indice: 12 },
            { min: 1976, max: 2095, indice: 13 },
            { min: 2096, max: 2200, indice: 14 }
        ]
    },

    // ========================================
    // LINEA EDILIA2 - CLASSE 2 (RC2)
    // ========================================
    
    EDILIA2: {
        info: {
            nome: "Edilia 2",
            certificazione: "Classe 2 (RC2)",
            norma: "UNI EN 1627:2011",
            listino: "Edilia 2 - 2020 Rev.2025"
        },
        
        struttura: {
            telaioPerimetrale: "30x30x2mm acciaio zincato",
            ante: "30x30x2mm acciaio zincato",
            barre: "ÃƒËœ14mm acciaio zincato",
            ingombroComplessivo: 37
        },
        
        tipiApertura: {
            "1_ACS_180": { nome: "1 Anta con Snodo 180Ã‚Â°", serratura: "2 punti" },
            "1_ASS_180": { nome: "1 Anta senza Snodo", serratura: "2 punti" },
            "2_ACS_180": { nome: "2 Ante con Snodo 180Ã‚Â°", serratura: "3 punti" },
            "2_ASS_180": { nome: "2 Ante senza Snodo", serratura: "3 punti" },
            "FST": { nome: "Fissa telaio semplice", serratura: null }
        },
        
        modelli: {
            "BASIC_T": { nome: "Basic T", categoria: "BASIC", supplemento: 0 },
            "BASIC_Q": { nome: "Basic Q", categoria: "BASIC", supplemento: 5 },
            "ROYAL_T": { nome: "Royal T", categoria: "ROYAL", supplemento: 0 },
            "ROYAL_Q": { nome: "Royal Q", categoria: "ROYAL", supplemento: 5 }
        },
        
        tempiConsegna: {
            standard: { produzione: 3, trasporto: 1, totale: 4 },
            rapido: { produzione: 1, trasporto: 1, totale: 2, supplemento: 10 }
        },
        
        // Tipologie telaio specifiche EDILIA2
        tipologieTelai: {
            A: {
                nome: "Modello A",
                traversoSuperiore: 30,
                traversoInferiore: 30,
                superioreAFilo: true,
                inferioreAFilo: true,
                personalizzabile: false,
                note: "Telaio standard non personalizzabile"
            },
            B: {
                nome: "Modello B",
                traversoSuperiore: 30,
                traversoInferiore: 20,
                superioreAFilo: true,
                inferioreAFilo: true,
                personalizzabile: false,
                note: "Traverso inferiore ridotto"
            },
            C: {
                nome: "Modello C",
                traversoSuperiore: 30,
                traversoInferiore: 30,
                superioreAFilo: false,
                inferioreAFilo: false,
                personalizzabile: true,
                personalizzaY: true,
                personalizzaX: true,
                defaultY: 40,
                defaultX: 40,
                note: "Completamente personalizzabile. Per ACS/ASS 180 verificare altezza traverso infisso interno"
            },
            D: {
                nome: "Modello D",
                traversoSuperiore: 30,
                traversoInferiore: 20,
                superioreAFilo: false,
                inferioreAFilo: true,
                personalizzabile: true,
                personalizzaY: true,
                personalizzaX: false,
                defaultY: 40,
                note: "Personalizzabile solo parte superiore"
            },
            E: {
                nome: "Modello E",
                traversoSuperiore: 30,
                traversoInferiore: 30,
                superioreAFilo: true,
                inferioreAFilo: false,
                personalizzabile: true,
                personalizzaY: false,
                personalizzaX: true,
                defaultX: 40,
                note: "Personalizzabile solo parte inferiore"
            },
            F: {
                nome: "Modello F",
                traversoSuperiore: 30,
                traversoInferiore: 10,
                superioreAFilo: true,
                inferioreAFilo: true,
                personalizzabile: true,
                personalizzaY: true,
                personalizzaX: false,
                defaultY: 0,
                recuperoTappi: 5,
                note: "Traverso inferiore 10mm, recupero tappi solo 5mm"
            },
            G: {
                nome: "Modello G",
                traversoSuperiore: 30,
                traversoInferiore: 30,
                superioreAFilo: false,
                inferioreAFilo: true,
                personalizzabile: true,
                personalizzaY: true,
                personalizzaX: false,
                defaultY: 40,
                note: "Ribassato 40mm dal voltino. Per ACS/ASS 180 verificare altezza traverso infisso interno"
            }
        },
        
        // Snodo specifico EDILIA2
        snodo: {
            lunghezzaSerie: 400,
            misuraMinima: 180,
            note: "Se diverso da 400mm, indicare nella conferma d'ordine"
        },
        
        // Profili aggiuntivi
        profiliAggiuntivi: {
            prezzo: 46,
            unita: "grata",
            tipologie: {
                D: { descrizione: "Tubolare 20mm", lato: "DX" },
                F: { descrizione: "Tubolare 30mm", lato: "DX" },
                H: { descrizione: "Tubolare 40mm", lato: "entrambi" },
                K: { descrizione: "Tubolare 50mm angolato", lato: "entrambi" }
            }
        },
        
        // Chiavistelli specifici
        chiavistelli: {
            persiana1Anta: { escursione: 100, prezzo: 35 },
            persiana2Ante: { escursione: 50, prezzo: 35 },
            supportoGrataFissa: { prezzo: 15 }
        },
        
        prezzi: {
            BASIC: {
                "1_ACS_180": [
                    [534, 547, 561, 575, 607, 621, 662, 668, 682],
                    [538, 552, 567, 583, 616, 631, 674, 680, 695],
                    [543, 558, 574, 590, 625, 641, 685, 692, 708],
                    [548, 564, 582, 599, 635, 652, 698, 705, 723],
                    [552, 569, 587, 605, 642, 660, 708, 715, 734],
                    [556, 574, 593, 613, 651, 670, 720, 727, 747],
                    [560, 579, 600, 621, 659, 680, 731, 739, 760],
                    [565, 585, 607, 628, 668, 690, 743, 751, 773],
                    [569, 590, 613, 636, 677, 700, 754, 763, 786],
                    [574, 596, 620, 643, 685, 710, 766, 775, 799]
                ],
                "1_ASS_180": null,
                "2_ACS_180": [
                    [742, 764, 788, 812, 872, 896, 970, 980, 1004],
                    [751, 775, 801, 827, 889, 915, 994, 1004, 1030],
                    [760, 786, 814, 842, 907, 935, 1017, 1028, 1056],
                    [769, 796, 827, 857, 924, 954, 1040, 1052, 1082],
                    [777, 807, 840, 872, 941, 974, 1063, 1076, 1108],
                    [786, 818, 853, 888, 959, 994, 1086, 1099, 1134],
                    [795, 829, 866, 903, 976, 1013, 1109, 1123, 1160],
                    [804, 840, 879, 918, 994, 1033, 1132, 1147, 1186],
                    [813, 851, 892, 933, 1011, 1052, 1155, 1171, 1212],
                    [822, 862, 905, 948, 1028, 1072, 1178, 1195, 1238],
                    [830, 872, 918, 963, 1045, 1091, 1200, 1218, 1264]
                ],
                "2_ASS_180": null,
                "FST": [
                    [330, 342, 359, 371, 378, 452, 464, 476, 488],
                    [340, 353, 373, 388, 396, 473, 488, 502, 517],
                    [349, 364, 387, 404, 414, 495, 512, 529, 545],
                    [358, 376, 402, 421, 432, 517, 536, 555, 574],
                    [397, 416, 443, 463, 475, 572, 592, 612, 632],
                    [406, 427, 457, 480, 493, 593, 616, 638, 661],
                    [416, 439, 472, 497, 511, 615, 640, 665, 689],
                    [425, 450, 486, 513, 529, 637, 664, 691, 718],
                    [435, 462, 500, 530, 547, 659, 688, 717, 747],
                    [444, 473, 515, 546, 565, 680, 712, 744, 775],
                    [475, 506, 551, 585, 605, 730, 764, 798, 832],
                    [484, 517, 565, 601, 623, 752, 788, 824, 860],
                    [493, 529, 579, 618, 641, 773, 812, 850, 889],
                    [499, 535, 587, 627, 651, 785, 825, 865, 904],
                    [508, 546, 601, 643, 668, 806, 847, 889, 931]
                ]
            },
            ROYAL: {
                "1_ACS_180": [
                    [573, 587, 602, 617, 652, 667, 711, 718, 733],
                    [577, 592, 608, 626, 661, 678, 724, 731, 747],
                    [582, 599, 616, 633, 671, 688, 736, 744, 761],
                    [588, 605, 625, 653, 682, 700, 750, 758, 777],
                    [592, 611, 630, 654, 690, 709, 761, 769, 789],
                    [596, 616, 636, 658, 699, 720, 774, 782, 803],
                    [601, 621, 644, 667, 708, 731, 786, 795, 817],
                    [606, 628, 652, 674, 718, 741, 799, 808, 831],
                    [611, 633, 658, 683, 727, 751, 811, 821, 845],
                    [616, 640, 666, 691, 736, 752, 824, 834, 860]
                ],
                "1_ASS_180": null,
                "2_ACS_180": [
                    [795, 819, 845, 871, 936, 962, 1042, 1053, 1079],
                    [805, 831, 859, 887, 955, 983, 1068, 1079, 1107],
                    [815, 843, 873, 904, 974, 1004, 1093, 1105, 1135],
                    [825, 854, 887, 920, 992, 1025, 1118, 1131, 1163],
                    [833, 866, 902, 936, 1011, 1047, 1143, 1157, 1192],
                    [843, 878, 916, 953, 1030, 1068, 1168, 1182, 1220],
                    [853, 890, 930, 970, 1050, 1089, 1193, 1208, 1248],
                    [863, 902, 944, 986, 1068, 1110, 1218, 1234, 1276],
                    [872, 913, 958, 1002, 1087, 1131, 1242, 1260, 1304],
                    [906, 925, 972, 1018, 1105, 1153, 1267, 1286, 1332],
                    [919, 936, 986, 1035, 1123, 1173, 1291, 1311, 1360]
                ],
                "2_ASS_180": null,
                "FST": [
                    [351, 363, 385, 397, 404, 485, 497, 510, 522],
                    [364, 377, 404, 418, 427, 513, 528, 542, 557],
                    [376, 392, 423, 440, 450, 541, 558, 575, 592],
                    [389, 407, 442, 461, 473, 569, 588, 607, 627],
                    [429, 448, 485, 505, 517, 626, 646, 667, 687],
                    [442, 463, 504, 527, 540, 654, 677, 699, 722],
                    [454, 477, 523, 548, 563, 682, 707, 732, 757],
                    [467, 492, 542, 569, 586, 710, 737, 765, 792],
                    [479, 506, 561, 591, 609, 738, 768, 797, 827],
                    [492, 521, 580, 612, 631, 766, 798, 830, 862],
                    [527, 558, 622, 656, 677, 823, 858, 892, 926],
                    [539, 573, 641, 677, 699, 851, 888, 925, 961],
                    [552, 587, 660, 699, 722, 879, 918, 957, 996],
                    [557, 594, 668, 708, 732, 892, 932, 972, 1012],
                    [569, 608, 686, 728, 754, 918, 960, 1002, 1045]
                ]
            }
        }
    },

    // ========================================
    // LINEA EVOLUTA18 - CLASSE 3 (RC3)
    // ========================================
    
    EVOLUTA18: {
        info: {
            nome: "Evoluta 18",
            certificazione: "Classe 3 (RC3)",
            norma: "UNI ENV 1627",
            listino: "Evoluta18 2020 Rev.2025"
        },
        
        struttura: {
            telaioPerimetrale: "40x40x2mm acciaio zincato",
            ante: "40x40x2mm acciaio zincato",
            barre: "ÃƒËœ14mm acciaio zincato",
            ingombroComplessivo: 47,
            traversoIntermedio: "Obbligatorio per H > 1750mm"
        },
        
        tipiApertura: {
            "1_ACS_180": { nome: "1 Anta con Snodo 180Ã‚Â°", serratura: "4 punti" },
            "1_ASS_180": { nome: "1 Anta senza Snodo", serratura: "4 punti" },
            "1_SC": { nome: "1 Anta Scorrevole", serratura: "3 punti" },
            "2_ACS_180": { nome: "2 Ante con Snodo 180Ã‚Â°", serratura: "4 punti" },
            "2_ASS_180": { nome: "2 Ante senza Snodo", serratura: "4 punti" },
            "2_SC": { nome: "2 Ante Scorrevole", serratura: "3 punti" },
            "F": { nome: "Fissa doppio telaio", serratura: null },
            "FST": { nome: "Fissa telaio semplice", serratura: null },
            "FB": { nome: "Fissa bombata", serratura: null }
        },
        
        modelli: {
            "BASIC_T": { nome: "Basic T", categoria: "BASIC", supplemento: 0 },
            "BASIC_Q": { nome: "Basic Q", categoria: "BASIC", supplemento: 0 },
            "ELEGANCE_T": { nome: "Elegance T", categoria: "ELEGANCE", supplemento: 0 },
            "ELEGANCE_Q": { nome: "Elegance Q", categoria: "ELEGANCE", supplemento: 0 },
            "ROYAL_T": { nome: "Royal T", categoria: "ELEGANCE", supplemento: 0 },
            "ROYAL_Q": { nome: "Royal Q", categoria: "ELEGANCE", supplemento: 0 },
            "RETRO_T": { nome: "RetrÃƒÂ² T", categoria: "ELEGANCE", supplemento: 0 },
            "RETRO_Q": { nome: "RetrÃƒÂ² Q", categoria: "ELEGANCE", supplemento: 0 },
            "PLUS": { nome: "Plus", categoria: "ELEGANCE", supplemento: 5 },
            "DELUXE": { nome: "Deluxe", categoria: "ELEGANCE", supplemento: 5 },
            "ONDA": { nome: "Onda", categoria: "ELEGANCE", supplemento: 5 },
            "STYLE": { nome: "Style", categoria: "ELEGANCE", supplemento: 5 },
            "LIBERTY_T": { nome: "Liberty T", categoria: "ELEGANCE", supplemento: 8 },
            "LIBERTY_Q": { nome: "Liberty Q", categoria: "ELEGANCE", supplemento: 8 },
            "CLASSIC_T": { nome: "Classic T", categoria: "ELEGANCE", supplemento: 8 },
            "CLASSIC_Q": { nome: "Classic Q", categoria: "ELEGANCE", supplemento: 8 },
            "ROMBO_T": { nome: "Rombo T", categoria: "ELEGANCE", supplemento: 12 },
            "ROMBO_Q": { nome: "Rombo Q", categoria: "ELEGANCE", supplemento: 12 }
        },
        
        tempiConsegna: {
            standard: { produzione: 4, trasporto: 1, totale: 5 },
            rapido: { produzione: 1, trasporto: 1, totale: 2, supplemento: 10 }
        },
        
        prezzi: {
            BASIC: {
                "1_ACS_180": [
                    [649, 662, 681, 695, 704, 871, 886, 900, 915],
                    [652, 666, 685, 700, 709, 878, 892, 907, 922],
                    [658, 674, 695, 711, 721, 893, 909, 926, 942],
                    [690, 706, 728, 745, 755, 936, 953, 970, 987],
                    [696, 714, 738, 756, 768, 951, 970, 988, 1007],
                    [700, 717, 742, 761, 773, 957, 976, 996, 1015],
                    [729, 747, 772, 792, 804, 995, 1014, 1034, 1054],
                    [735, 755, 782, 804, 816, 1010, 1031, 1052, 1074],
                    [738, 758, 787, 808, 822, 1016, 1038, 1060, 1082],
                    [745, 766, 796, 820, 834, 1031, 1054, 1078, 1102]
                ],
                "1_ASS_180": [
                    [533, 546, 565, 580, 589, 712, 726, 741, 756],
                    [536, 550, 570, 585, 594, 718, 733, 748, 763],
                    [543, 558, 580, 597, 607, 733, 750, 767, 784],
                    [576, 592, 614, 631, 642, 778, 796, 813, 831],
                    [582, 600, 624, 643, 655, 794, 813, 832, 851],
                    [586, 604, 629, 648, 660, 800, 820, 839, 859],
                    [616, 634, 660, 680, 692, 826, 846, 866, 886],
                    [622, 642, 670, 692, 705, 841, 863, 885, 906],
                    [626, 646, 675, 697, 710, 847, 870, 892, 914],
                    [632, 654, 685, 709, 723, 863, 887, 911, 935]
                ],
                "1_SC": null,
                "F": [
                    [478, 490, 508, 521, 528, 687, 700, 713, 726],
                    [488, 502, 522, 537, 546, 709, 724, 739, 754],
                    [498, 513, 537, 554, 564, 730, 747, 765, 782],
                    [507, 525, 551, 571, 582, 751, 771, 790, 810],
                    [546, 566, 594, 616, 629, 810, 832, 854, 875],
                    [556, 577, 609, 633, 647, 832, 856, 879, 903],
                    [565, 589, 623, 649, 665, 853, 879, 905, 931],
                    [572, 597, 632, 659, 675, 866, 893, 920, 947],
                    [581, 608, 647, 676, 693, 887, 916, 946, 975],
                    [591, 620, 661, 692, 711, 909, 940, 971, 1003],
                    [627, 658, 702, 735, 755, 964, 998, 1031, 1065],
                    [636, 669, 716, 752, 773, 986, 1021, 1057, 1093],
                    [646, 681, 730, 768, 791, 1007, 1045, 1083, 1121],
                    [656, 693, 745, 785, 809, 1028, 1069, 1109, 1149],
                    [665, 703, 758, 800, 826, 1048, 1090, 1133, 1175]
                ],
                "FST": [
                    [330, 342, 359, 371, 378, 452, 464, 476, 488],
                    [340, 353, 373, 388, 396, 473, 488, 502, 517],
                    [349, 364, 387, 404, 414, 495, 512, 529, 545],
                    [358, 376, 402, 421, 432, 517, 536, 555, 574],
                    [397, 416, 443, 463, 475, 572, 592, 612, 632],
                    [406, 427, 457, 480, 493, 593, 616, 638, 661],
                    [416, 439, 472, 497, 511, 615, 640, 665, 689],
                    [425, 450, 486, 513, 529, 637, 664, 691, 718],
                    [435, 462, 500, 530, 547, 659, 688, 717, 747],
                    [444, 473, 515, 546, 565, 680, 712, 744, 775],
                    [475, 506, 551, 585, 605, 730, 764, 798, 832],
                    [484, 517, 565, 601, 623, 752, 788, 824, 860],
                    [493, 529, 579, 618, 641, 773, 812, 850, 889],
                    [499, 535, 587, 627, 651, 785, 825, 865, 904],
                    [508, 546, 601, 643, 668, 806, 847, 889, 931]
                ],
                "2_ACS_180": [
                    [992, 1014, 1048, 1072, 1087, 1381, 1406, 1430, 1455],
                    [1005, 1031, 1069, 1097, 1113, 1413, 1441, 1469, 1497],
                    [1012, 1039, 1078, 1107, 1124, 1426, 1455, 1484, 1513],
                    [1019, 1047, 1087, 1117, 1135, 1439, 1469, 1499, 1529],
                    [1065, 1096, 1141, 1174, 1194, 1513, 1547, 1580, 1614],
                    [1072, 1104, 1150, 1185, 1205, 1526, 1561, 1595, 1630],
                    [1085, 1120, 1171, 1209, 1231, 1558, 1596, 1634, 1672],
                    [1092, 1128, 1180, 1219, 1242, 1571, 1610, 1649, 1688],
                    [1135, 1174, 1230, 1273, 1299, 1638, 1681, 1724, 1766],
                    [1141, 1182, 1240, 1283, 1310, 1651, 1695, 1739, 1783],
                    [1155, 1198, 1260, 1307, 1336, 1683, 1730, 1770, 1824]
                ],
                "2_ASS_180": [
                    [781, 804, 837, 862, 877, 1074, 1099, 1124, 1148],
                    [794, 820, 858, 886, 903, 1106, 1134, 1162, 1190],
                    [801, 828, 867, 897, 914, 1119, 1148, 1177, 1207],
                    [808, 836, 877, 907, 925, 1132, 1162, 1193, 1223],
                    [854, 885, 930, 964, 984, 1206, 1240, 1273, 1307],
                    [861, 893, 939, 974, 995, 1219, 1254, 1289, 1324],
                    [874, 909, 960, 998, 1021, 1251, 1289, 1327, 1366],
                    [881, 917, 969, 1009, 1032, 1264, 1303, 1343, 1382],
                    [924, 963, 1020, 1062, 1088, 1331, 1374, 1417, 1460],
                    [930, 971, 1029, 1073, 1099, 1344, 1388, 1432, 1476],
                    [944, 987, 1050, 1097, 1125, 1376, 1423, 1470, 1518]
                ],
                "2_SC": null
            },
            ELEGANCE: {
                "1_ACS_180": [
                    [642, 655, 677, 691, 700, 875, 889, 904, 918],
                    [645, 659, 681, 696, 705, 881, 896, 911, 926],
                    [658, 674, 695, 711, 721, 893, 909, 926, 942],
                    [683, 699, 723, 741, 751, 933, 950, 968, 985],
                    [691, 709, 734, 753, 764, 950, 969, 987, 1006],
                    [696, 714, 740, 759, 771, 958, 977, 996, 1016],
                    [724, 743, 769, 790, 802, 996, 1015, 1035, 1055],
                    [731, 751, 779, 801, 813, 1011, 1031, 1052, 1073],
                    [735, 756, 785, 807, 820, 1019, 1040, 1061, 1082],
                    [743, 764, 795, 819, 832, 1034, 1056, 1079, 1101]
                ],
                "1_ASS_180": [
                    [529, 543, 564, 579, 588, 717, 732, 747, 762],
                    [532, 546, 569, 584, 594, 724, 739, 755, 770],
                    [543, 558, 580, 597, 607, 733, 750, 767, 784],
                    [569, 586, 610, 628, 639, 780, 799, 817, 835],
                    [578, 596, 621, 640, 651, 796, 816, 835, 854],
                    [583, 601, 627, 647, 658, 804, 824, 844, 864],
                    [611, 630, 658, 679, 691, 832, 853, 874, 895],
                    [618, 639, 668, 691, 703, 847, 869, 891, 913],
                    [622, 644, 674, 697, 710, 854, 878, 901, 924],
                    [630, 652, 685, 709, 723, 870, 895, 919, 944]
                ],
                "1_SC": null,
                "F": [
                    [475, 487, 508, 521, 529, 696, 709, 722, 735],
                    [487, 502, 524, 539, 548, 720, 736, 751, 766],
                    [498, 514, 539, 556, 567, 745, 762, 779, 796],
                    [509, 527, 555, 575, 586, 769, 788, 807, 827],
                    [550, 571, 602, 625, 638, 832, 854, 876, 898],
                    [562, 584, 619, 644, 658, 856, 880, 904, 928],
                    [573, 598, 635, 662, 677, 879, 905, 931, 957],
                    [581, 607, 646, 674, 690, 895, 922, 949, 976],
                    [592, 620, 662, 692, 709, 919, 948, 977, 1006],
                    [603, 633, 678, 710, 728, 943, 974, 1005, 1036],
                    [640, 672, 720, 755, 775, 1002, 1036, 1069, 1103],
                    [650, 684, 736, 773, 795, 1026, 1062, 1098, 1134],
                    [661, 697, 751, 790, 814, 1049, 1087, 1126, 1164],
                    [672, 710, 767, 808, 834, 1073, 1113, 1154, 1194],
                    [682, 721, 781, 824, 851, 1095, 1137, 1180, 1222]
                ],
                "FST": [
                    [327, 339, 361, 373, 380, 461, 473, 486, 498],
                    [340, 353, 377, 392, 401, 486, 501, 516, 531],
                    [352, 367, 393, 410, 420, 511, 528, 545, 562],
                    [363, 380, 409, 428, 439, 536, 555, 575, 594],
                    [404, 424, 455, 477, 490, 594, 616, 638, 660],
                    [416, 438, 472, 496, 510, 619, 644, 669, 694],
                    [428, 451, 489, 515, 531, 645, 672, 699, 727],
                    [436, 461, 500, 528, 545, 663, 692, 720, 749],
                    [448, 474, 517, 547, 565, 689, 720, 751, 782],
                    [459, 488, 533, 566, 585, 715, 749, 782, 816],
                    [496, 528, 576, 612, 633, 773, 809, 845, 882],
                    [506, 540, 592, 630, 653, 799, 837, 875, 914],
                    [517, 553, 608, 649, 673, 825, 866, 906, 946],
                    [528, 566, 624, 667, 693, 851, 894, 936, 978],
                    [538, 578, 639, 684, 712, 876, 921, 965, 1009]
                ],
                "2_ACS_180": [
                    [1020, 1043, 1082, 1107, 1122, 1426, 1451, 1475, 1500],
                    [1040, 1065, 1112, 1140, 1157, 1470, 1498, 1526, 1554],
                    [1047, 1073, 1121, 1150, 1168, 1483, 1512, 1541, 1570],
                    [1054, 1081, 1131, 1161, 1179, 1496, 1526, 1557, 1587],
                    [1101, 1132, 1186, 1221, 1241, 1575, 1609, 1643, 1677],
                    [1108, 1140, 1196, 1232, 1252, 1588, 1623, 1658, 1693],
                    [1122, 1158, 1221, 1261, 1284, 1625, 1664, 1703, 1742],
                    [1130, 1166, 1231, 1272, 1296, 1639, 1679, 1719, 1759],
                    [1176, 1216, 1286, 1330, 1357, 1712, 1756, 1800, 1844],
                    [1183, 1224, 1296, 1341, 1368, 1726, 1771, 1816, 1861],
                    [1198, 1243, 1320, 1369, 1398, 1761, 1809, 1856, 1904]
                ],
                "2_ASS_180": [
                    [806, 829, 869, 893, 908, 1115, 1140, 1164, 1189],
                    [826, 852, 899, 927, 944, 1159, 1187, 1215, 1243],
                    [833, 860, 908, 938, 955, 1173, 1202, 1231, 1260],
                    [840, 868, 918, 949, 966, 1186, 1217, 1247, 1277],
                    [887, 921, 973, 1007, 1027, 1263, 1296, 1329, 1362],
                    [895, 929, 982, 1017, 1038, 1276, 1310, 1345, 1380],
                    [909, 946, 1006, 1044, 1067, 1313, 1351, 1389, 1427],
                    [917, 954, 1016, 1055, 1079, 1327, 1366, 1405, 1444],
                    [963, 1004, 1071, 1113, 1140, 1400, 1443, 1486, 1529],
                    [971, 1013, 1081, 1124, 1152, 1414, 1458, 1502, 1546],
                    [986, 1030, 1105, 1152, 1181, 1449, 1496, 1544, 1591]
                ],
                "2_SC": null
            }
        }
    },

    // ========================================
    // LINEA SIKURA - CLASSE 4 (RC4)
    // ========================================
    
    SIKURA: {
        info: {
            nome: "Sikura",
            certificazione: "Classe 4 (RC4)",
            norma: "UNI ENV 1627:2000",
            listino: "Sikura 2020 Rev.2025",
            certificatore: "Istituto Giordano"
        },
        
        struttura: {
            telaioPerimetrale: "40x40x2mm rinforzato",
            ante: "40x40x2mm rinforzato",
            barre: "ÃƒËœ14mm acciaio zincato",
            ingombroComplessivo: 47,
            traversoIntermedio: "Obbligatorio per H > 1750mm"
        },
        
        tipiApertura: {
            "1_ACS_180": { nome: "1 Anta con Snodo 180Ã‚Â°", serratura: "4 punti" },
            "1_ASS_180": { nome: "1 Anta senza Snodo", serratura: "4 punti" },
            "2_ACS_180": { nome: "2 Ante con Snodo 180Ã‚Â°", serratura: "4 punti" },
            "2_ASS_180": { nome: "2 Ante senza Snodo", serratura: "4 punti" },
            "FST": { nome: "Fisso", serratura: null }
        },
        
        modelli: {
            "BASIC_T": { nome: "Basic T", categoria: "BASIC", supplemento: 0 },
            "BASIC_Q": { nome: "Basic Q", categoria: "BASIC", supplemento: 0 },
            "ROYAL_T": { nome: "Royal T", categoria: "ROYAL", supplemento: 0 },
            "ROYAL_Q": { nome: "Royal Q", categoria: "ROYAL", supplemento: 0 },
            "PLUS": { nome: "Plus", categoria: "PREMIUM", supplemento: 0 },
            "STYLE": { nome: "Style", categoria: "PREMIUM", supplemento: 0 },
            "DELUXE": { nome: "Deluxe", categoria: "PREMIUM", supplemento: 0 },
            "ONDA": { nome: "Onda", categoria: "PREMIUM", supplemento: 0 },
            "LIBERTY_T": { nome: "Liberty T", categoria: "PREMIUM", supplemento: 0 },
            "LIBERTY_Q": { nome: "Liberty Q", categoria: "PREMIUM", supplemento: 0 },
            "CLASSIC_T": { nome: "Classic T", categoria: "PREMIUM", supplemento: 0 },
            "CLASSIC_Q": { nome: "Classic Q", categoria: "PREMIUM", supplemento: 0 }
        },
        
        tempiConsegna: {
            standard: { produzione: 4, trasporto: 1, totale: 5 },
            rapido: { produzione: 1, trasporto: 1, totale: 2, supplemento: 10 }
        },
        
        prezzi: {
            BASIC: {
                "1_ACS_180": [
                    [956, 970, 989, 1004, 1013, 1165, 1180, 1195, 1210],
                    [962, 977, 999, 1016, 1026, 1180, 1197, 1214, 1230],
                    [965, 981, 1004, 1021, 1031, 1186, 1204, 1221, 1238],
                    [994, 1010, 1034, 1052, 1062, 1224, 1242, 1259, 1277],
                    [1001, 1018, 1044, 1063, 1075, 1239, 1258, 1278, 1297],
                    [1004, 1022, 1048, 1068, 1080, 1245, 1265, 1285, 1305],
                    [1010, 1030, 1058, 1080, 1093, 1260, 1282, 1303, 1325],
                    [1017, 1038, 1068, 1091, 1106, 1275, 1298, 1322, 1345],
                    [1020, 1042, 1072, 1096, 1111, 1281, 1305, 1329, 1353],
                    [1026, 1050, 1082, 1108, 1124, 1296, 1322, 1347, 1373]
                ],
                "1_ASS_180": [
                    [788, 804, 826, 843, 854, 974, 992, 1009, 1027],
                    [794, 812, 836, 855, 867, 990, 1009, 1028, 1047],
                    [798, 816, 841, 860, 872, 996, 1016, 1035, 1055],
                    [828, 846, 872, 892, 904, 1022, 1042, 1062, 1082],
                    [834, 854, 882, 904, 917, 1037, 1059, 1081, 1102],
                    [838, 858, 887, 909, 922, 1043, 1066, 1088, 1110],
                    [844, 866, 897, 921, 935, 1059, 1083, 1107, 1131],
                    [850, 874, 907, 933, 948, 1074, 1100, 1126, 1151],
                    [854, 878, 912, 938, 953, 1080, 1107, 1133, 1159],
                    [860, 886, 922, 950, 966, 1096, 1124, 1152, 1180]
                ],
                "2_ACS_180": [
                    [1343, 1368, 1406, 1433, 1450, 1695, 1722, 1750, 1777],
                    [1350, 1376, 1415, 1443, 1461, 1708, 1736, 1765, 1794],
                    [1356, 1384, 1424, 1454, 1471, 1721, 1750, 1780, 1810],
                    [1401, 1432, 1476, 1509, 1529, 1793, 1826, 1859, 1892],
                    [1408, 1439, 1485, 1519, 1540, 1806, 1840, 1874, 1908],
                    [1421, 1456, 1506, 1543, 1566, 1837, 1874, 1912, 1950],
                    [1428, 1463, 1515, 1554, 1577, 1850, 1888, 1927, 1966],
                    [1469, 1508, 1564, 1606, 1631, 1915, 1958, 2000, 2042],
                    [1476, 1516, 1573, 1616, 1642, 1928, 1972, 2015, 2058],
                    [1489, 1532, 1593, 1640, 1668, 1959, 2006, 2053, 2099]
                ],
                "2_ASS_180": [
                    [1040, 1066, 1104, 1132, 1149, 1318, 1346, 1374, 1402],
                    [1047, 1074, 1113, 1143, 1160, 1331, 1360, 1389, 1419],
                    [1054, 1082, 1123, 1153, 1171, 1344, 1374, 1405, 1435],
                    [1100, 1131, 1176, 1210, 1230, 1418, 1452, 1485, 1519],
                    [1107, 1139, 1185, 1220, 1241, 1431, 1466, 1501, 1536],
                    [1120, 1155, 1206, 1244, 1267, 1463, 1501, 1539, 1578],
                    [1127, 1163, 1215, 1255, 1278, 1476, 1515, 1555, 1594],
                    [1170, 1209, 1266, 1308, 1334, 1543, 1586, 1629, 1672],
                    [1176, 1217, 1275, 1319, 1345, 1556, 1600, 1644, 1688],
                    [1190, 1233, 1296, 1343, 1371, 1588, 1635, 1682, 1730]
                ],
                "FST": [
                    [400, 412, 429, 441, 448, 522, 534, 546, 558],
                    [410, 423, 443, 458, 466, 543, 558, 572, 587],
                    [419, 434, 457, 474, 484, 565, 582, 599, 615],
                    [428, 446, 472, 491, 502, 587, 606, 625, 644],
                    [467, 486, 513, 533, 545, 642, 662, 682, 702],
                    [476, 497, 527, 550, 563, 663, 686, 708, 731],
                    [486, 509, 542, 567, 581, 685, 710, 735, 759],
                    [495, 520, 556, 583, 599, 707, 734, 761, 788],
                    [505, 532, 570, 600, 617, 729, 758, 787, 817],
                    [514, 543, 585, 616, 635, 750, 782, 814, 845],
                    [545, 576, 621, 655, 675, 800, 834, 868, 902],
                    [554, 587, 635, 671, 693, 822, 858, 894, 930],
                    [563, 599, 649, 688, 711, 843, 882, 920, 959],
                    [569, 605, 657, 697, 721, 855, 895, 935, 974],
                    [578, 616, 671, 713, 738, 876, 917, 959, 1001]
                ]
            },
            ROYAL: {
                "1_ACS_180": [
                    [984, 998, 1022, 1038, 1047, 1207, 1222, 1237, 1253],
                    [993, 1009, 1037, 1054, 1064, 1228, 1245, 1262, 1279],
                    [997, 1013, 1041, 1059, 1069, 1234, 1252, 1269, 1286],
                    [1027, 1043, 1072, 1090, 1101, 1273, 1291, 1309, 1327],
                    [1036, 1054, 1087, 1106, 1118, 1294, 1314, 1333, 1353],
                    [1039, 1058, 1091, 1111, 1123, 1300, 1321, 1341, 1361],
                    [1049, 1069, 1106, 1127, 1140, 1321, 1343, 1365, 1387],
                    [1058, 1080, 1121, 1143, 1157, 1342, 1366, 1389, 1413],
                    [1061, 1084, 1125, 1148, 1162, 1348, 1373, 1397, 1421],
                    [1071, 1095, 1140, 1164, 1179, 1369, 1395, 1421, 1447]
                ],
                "1_ASS_180": [
                    [814, 830, 857, 875, 885, 1014, 1032, 1049, 1067],
                    [824, 842, 872, 891, 903, 1035, 1055, 1074, 1093],
                    [827, 845, 876, 896, 908, 1042, 1062, 1081, 1101],
                    [859, 877, 909, 929, 942, 1068, 1088, 1109, 1129],
                    [868, 888, 924, 946, 959, 1089, 1112, 1134, 1156],
                    [871, 892, 928, 951, 964, 1096, 1118, 1141, 1164],
                    [881, 903, 943, 967, 982, 1117, 1142, 1166, 1190],
                    [890, 914, 958, 984, 999, 1138, 1166, 1191, 1217],
                    [893, 918, 962, 989, 1004, 1145, 1172, 1198, 1225],
                    [903, 929, 977, 1005, 1022, 1166, 1196, 1223, 1251]
                ],
                "2_ACS_180": [
                    [1380, 1406, 1452, 1479, 1496, 1754, 1781, 1809, 1837],
                    [1387, 1413, 1461, 1490, 1507, 1767, 1796, 1824, 1853],
                    [1393, 1421, 1470, 1500, 1518, 1780, 1810, 1839, 1869],
                    [1445, 1476, 1532, 1565, 1585, 1865, 1898, 1931, 1965],
                    [1452, 1483, 1541, 1576, 1596, 1878, 1912, 1947, 1981],
                    [1471, 1506, 1571, 1609, 1631, 1921, 1959, 1997, 2034],
                    [1478, 1513, 1580, 1619, 1642, 1934, 1973, 2012, 2051],
                    [1526, 1565, 1639, 1681, 1706, 2013, 2055, 2097, 2140],
                    [1533, 1573, 1648, 1691, 1717, 2026, 2069, 2113, 2156],
                    [1552, 1595, 1677, 1724, 1752, 2069, 2116, 2162, 2209]
                ],
                "2_ASS_180": [
                    [1073, 1099, 1142, 1171, 1188, 1368, 1398, 1427, 1456],
                    [1080, 1108, 1152, 1182, 1200, 1382, 1412, 1443, 1473],
                    [1087, 1116, 1161, 1192, 1211, 1395, 1427, 1458, 1489],
                    [1141, 1172, 1219, 1252, 1272, 1482, 1515, 1549, 1582],
                    [1148, 1180, 1228, 1262, 1283, 1496, 1530, 1564, 1599],
                    [1167, 1202, 1256, 1293, 1316, 1542, 1578, 1614, 1650],
                    [1175, 1210, 1265, 1304, 1327, 1556, 1593, 1630, 1667],
                    [1223, 1260, 1319, 1359, 1384, 1638, 1678, 1717, 1756],
                    [1230, 1269, 1328, 1370, 1395, 1652, 1692, 1733, 1773],
                    [1250, 1291, 1355, 1400, 1427, 1695, 1739, 1782, 1826]
                ],
                "FST": null
            },
            PREMIUM: {
                "1_ACS_180": [
                    [1020, 1034, 1059, 1075, 1084, 1253, 1268, 1283, 1299],
                    [1032, 1048, 1076, 1093, 1103, 1279, 1296, 1313, 1329],
                    [1037, 1053, 1081, 1098, 1109, 1287, 1304, 1322, 1339],
                    [1068, 1084, 1114, 1132, 1143, 1326, 1344, 1362, 1380],
                    [1078, 1097, 1130, 1150, 1161, 1349, 1369, 1389, 1409],
                    [1081, 1101, 1134, 1155, 1167, 1356, 1377, 1397, 1418],
                    [1092, 1113, 1150, 1172, 1185, 1379, 1401, 1423, 1445],
                    [1103, 1125, 1166, 1189, 1203, 1402, 1426, 1449, 1473],
                    [1106, 1129, 1171, 1195, 1209, 1409, 1433, 1458, 1482],
                    [1117, 1143, 1190, 1215, 1228, 1435, 1460, 1485, 1511]
                ],
                "1_ASS_180": [
                    [853, 866, 886, 900, 909, 1060, 1074, 1089, 1103],
                    [864, 878, 898, 913, 922, 1082, 1097, 1112, 1127],
                    [868, 882, 903, 919, 928, 1089, 1104, 1120, 1135],
                    [902, 916, 938, 954, 964, 1117, 1133, 1149, 1165],
                    [913, 928, 951, 967, 977, 1140, 1156, 1173, 1189],
                    [916, 932, 956, 973, 983, 1146, 1163, 1180, 1197],
                    [928, 944, 968, 986, 996, 1169, 1186, 1204, 1222],
                    [939, 956, 981, 999, 1009, 1192, 1209, 1228, 1246],
                    [942, 960, 986, 1005, 1015, 1198, 1216, 1235, 1254],
                    [954, 972, 998, 1018, 1028, 1221, 1239, 1259, 1279]
                ],
                "2_ACS_180": [
                    [1491, 1511, 1543, 1564, 1577, 1890, 1911, 1933, 1954],
                    [1498, 1519, 1552, 1575, 1588, 1903, 1926, 1948, 1971],
                    [1505, 1527, 1562, 1586, 1600, 1917, 1941, 1964, 1988],
                    [1565, 1588, 1625, 1649, 1664, 2011, 2035, 2060, 2085],
                    [1572, 1596, 1634, 1660, 1676, 2024, 2050, 2076, 2102],
                    [1596, 1620, 1660, 1687, 1703, 2071, 2097, 2124, 2151],
                    [1603, 1628, 1670, 1698, 1715, 2084, 2112, 2140, 2168],
                    [1659, 1686, 1729, 1758, 1776, 2171, 2200, 2229, 2258],
                    [1666, 1694, 1739, 1769, 1787, 2184, 2215, 2245, 2275],
                    [1689, 1718, 1765, 1796, 1815, 2230, 2262, 2293, 2324]
                ],
                "2_ASS_180": [
                    [1126, 1145, 1173, 1193, 1207, 1432, 1453, 1474, 1495],
                    [1133, 1153, 1183, 1203, 1218, 1446, 1468, 1490, 1512],
                    [1140, 1161, 1193, 1214, 1229, 1459, 1482, 1506, 1529],
                    [1200, 1223, 1257, 1280, 1295, 1551, 1576, 1601, 1626],
                    [1208, 1232, 1267, 1291, 1307, 1565, 1591, 1617, 1643],
                    [1228, 1255, 1295, 1322, 1339, 1609, 1638, 1666, 1695],
                    [1236, 1264, 1305, 1333, 1350, 1623, 1652, 1682, 1712],
                    [1291, 1322, 1367, 1397, 1416, 1710, 1742, 1774, 1806],
                    [1299, 1330, 1377, 1408, 1428, 1724, 1757, 1790, 1823],
                    [1322, 1356, 1408, 1442, 1463, 1773, 1809, 1844, 1880]
                ],
                "FST": null
            }
        }
    },

    // ========================================
    // LINEA LIBERA - CLASSE 3 (RC3) - CERNIERA A SCOMPARSA
    // ========================================
    
    LIBERA: {
        info: {
            nome: "Libera",
            certificazione: "Classe 3 (RC3)",
            norma: "UNI EN 1627:2011",
            listino: "Libera 2020 - Rev.2025",
            caratteristicaPrincipale: "Cerniera a scomparsa unica nel suo genere"
        },
        
        struttura: {
            telaioPerimetrale: "40x40x2mm acciaio zincato con compensatori 20x45x20",
            telaioAlternativo: "50x50x2mm con aletta 25mm",
            ante: "40x40x2mm acciaio zincato",
            barre: "Ã˜14mm acciaio zincato pieno",
            cerniere: "A scomparsa in acciaio microfuso, anti-attacco",
            rostriAntistrappo: "Di serie",
            ingombroComplessivo: 47
        },
        
        detrazioniCostruzione: {
            telaioConiAletta: { larghezza: -10, altezza: -6, tappi: 8, note: "NON SONO PRESENTI COMPENSATORI E TAPPI" },
            telaio40x40Compensatori: { larghezza: -14, altezza: -4, tappi: 8, note: "Tappi per compensazione altezza" },
            telaioF: { larghezza: -14, altezza: -4, tappi: 4, note: "Recupero tappi ridotto" }
        },
        
        tipiApertura: {
            "1_AP": { 
                nome: "1 Anta Apribile con cerniera a scomparsa", 
                codice: "1 AP",
                apertura: "esterna 180Â°",
                serratura: "2 punti", 
                escursione: 25,
                puntiChiusura: "1 superiore + 1 inferiore"
            },
            "2_AP": { 
                nome: "2 Ante Apribili con cerniera a scomparsa", 
                codice: "2 AP",
                apertura: "esterna 180Â°",
                serratura: "3 punti", 
                escursione: 25,
                puntiChiusura: "1 superiore + 1 inferiore + 1 centrale"
            },
            "2_AP_AA": {
                nome: "2 Ante Snodata/Ribaltabile anta su anta",
                codice: "2 AP AA",
                apertura: "snodata/ribaltabile",
                serratura: "3 punti",
                supplemento: 0,
                note: "Prezzo da tabella 2 AP"
            },
            "3_AP": {
                nome: "3 Ante Snodata/Ribaltabile",
                codice: "3 AP",
                serratura: "3 punti",
                supplemento: 306,
                note: "Prezzo 2 AP + â‚¬306"
            },
            "4_AP": {
                nome: "4 Ante Snodata/Ribaltabile",
                codice: "4 AP",
                serratura: "3 punti",
                supplemento: 612,
                note: "Prezzo 2 AP + â‚¬612"
            },
            "FST": { 
                nome: "Fissa con telaio semplice", 
                codice: "FST",
                serratura: null 
            }
        },
        
        // 18 modelli disponibili raggruppati in 4 categorie di prezzo
        modelli: {
            // Categoria BASIC
            "BASIC_T": { nome: "Basic T (ferro tondo)", categoria: "BASIC", supplemento: 0, ferroQuadro: false },
            "BASIC_Q": { nome: "Basic Q (ferro quadro)", categoria: "BASIC", supplemento: 5, ferroQuadro: true },
            // Categoria ELEGANCE/RETRO/ROYAL
            "ELEGANCE_T": { nome: "Elegance T", categoria: "ELEGANCE", supplemento: 0, ferroQuadro: false },
            "ELEGANCE_Q": { nome: "Elegance Q", categoria: "ELEGANCE", supplemento: 5, ferroQuadro: true },
            "RETRO_T": { nome: "RetrÃ² T", categoria: "ELEGANCE", supplemento: 0, ferroQuadro: false },
            "RETRO_Q": { nome: "RetrÃ² Q", categoria: "ELEGANCE", supplemento: 5, ferroQuadro: true },
            "ROYAL_T": { nome: "Royal T", categoria: "ELEGANCE", supplemento: 0, ferroQuadro: false },
            "ROYAL_Q": { nome: "Royal Q", categoria: "ELEGANCE", supplemento: 5, ferroQuadro: true },
            // Categoria PLUS/DELUXE
            "PLUS": { nome: "Plus", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "DELUXE": { nome: "Deluxe", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "ONDA": { nome: "Onda", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "STYLE": { nome: "Style", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "LIBERTY_T": { nome: "Liberty T", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "LIBERTY_Q": { nome: "Liberty Q", categoria: "PLUS_DELUXE", supplemento: 5, ferroQuadro: true },
            "CLASSIC_T": { nome: "Classic T", categoria: "PLUS_DELUXE", supplemento: 0, ferroQuadro: false },
            "CLASSIC_Q": { nome: "Classic Q", categoria: "PLUS_DELUXE", supplemento: 5, ferroQuadro: true },
            // Categoria ROMBO
            "ROMBO_T": { nome: "Rombo T", categoria: "ROMBO", supplemento: 0, ferroQuadro: false },
            "ROMBO_Q": { nome: "Rombo Q", categoria: "ROMBO", supplemento: 5, ferroQuadro: true }
        },
        
        tempiConsegna: {
            standard: { produzione: 4, trasporto: 1, totale: 5 },
            rapido: { produzione: 1, trasporto: 1, totale: 2, supplemento: 10 }
        },
        
        // Tipologie telaio LIBERA
        tipologieTelai: {
            A: {
                nome: "Modello A",
                descrizione: "Traverso superiore e inferiore a filo muro",
                tubolare: "40x40 o 50x50 con aletta 25mm",
                personalizzabile: false,
                codici: ["AP1", "AP2", "AP3", "AP4"]
            },
            B: {
                nome: "Modello B",
                descrizione: "Traverso superiore e inferiore a filo muro, inferiore 20mm",
                tubolare: "40x40 o 50x50 con aletta 25mm",
                personalizzabile: false,
                codici: ["AP1", "AP2", "AP3", "AP4"]
            },
            E: {
                nome: "Modello E",
                descrizione: "Traverso superiore a filo voltino, inferiore rialzato 40mm dalla soglia",
                tubolare: "40x40 o 50x50 con aletta 25mm",
                personalizzabile: true,
                personalizzaX: true,
                defaultX: 40,
                codici: ["AP1", "AP2", "AP3", "AP4"]
            },
            F: {
                nome: "Modello F",
                descrizione: "Traverso superiore e inferiore a filo muro",
                tubolare: "40x40 o 50x50 con aletta 25mm",
                personalizzabile: false,
                tappiRidotti: 4,
                codici: ["AP1", "AP2", "AP3", "AP4"]
            }
        },
        
        // Esecuzioni speciali
        esecuzioniSpeciali: {
            sopraluce: {
                rettangolareFisso: { supplemento: 227, note: "Sopraluce rettangolare fisso" },
                arcoTuttoSestoRibassato: { supplemento: 340, note: "Sopraluce ad arco tutto sesto ribassato" },
                trapezio: { supplemento: 340, note: "Sopraluce a trapezio" }
            },
            apribili: {
                arcoTuttoSestoRibassato: { supplemento: 453, note: "Apribile ad arco a tutto sesto ribassato" },
                trapezio: { supplemento: 227, note: "Apribile a trapezio" }
            },
            fissi: {
                arco: { supplemento: 227, note: "Fisso ad arco" },
                trapezio: { supplemento: 227, note: "Fisso a trapezio" },
                oblo: { supplemento: 340, note: "Fisso oblÃ²" }
            },
            parapetto: {
                fisso: { supplemento: 227, note: "Parapetto fisso" }
            },
            fissaggioFrontale: {
                note: "Per grate fisse o apribili. Indicare lunghezza tubolare X per fissaggio"
            },
            disegniSpeciali: {
                DIS1Q: { riferimentoPrezzo: "DELUXE", supplemento: 0 },
                DIS3TQ: { riferimentoPrezzo: "DELUXE", supplemento: 10 },
                DIS4TQ: { riferimentoPrezzo: "DELUXE", supplemento: 10 },
                DIS5Q: { riferimentoPrezzo: "DELUXE", supplemento: 10 },
                DIS7TQ: { riferimentoPrezzo: "DELUXE", supplemento: 5 },
                DIS9: { riferimentoPrezzo: "DELUXE", supplementoPiatto30x8: true },
                DIS10T: { riferimentoPrezzo: "ROMBO", supplemento: 0 },
                DIS11TQ: { riferimentoPrezzo: "DELUXE", supplemento: 10 }
            }
        },
        
        // Accessori specifici LIBERA
        accessoriSpecifici: {
            cilindroCE: {
                passanteAntitrapanoDefender: 38,
                mezzoCilindroEVO_K64: 49,
                cilindroPassanteEVO_K64_Defender: 73,
                carbonitrurazione: 61
            },
            serraturaCE: {
                note: "LIBERA CE: serratura a 4 punti (2 superiori + 2 inferiori) escursione 25mm"
            },
            imbottino: {
                prezzo: 70,
                misure: ["30mm", "40mm"],
                note: "Specificare misura imbottino"
            },
            interfacciaImpianto: {
                prezzo: 91,
                note: "Interfaccia per centrale impianto giÃ  esistente (in alternativa alla centrale completa)"
            }
        },
        
        // FASCE DIMENSIONALI LIBERA
        fasce: {
            altezza: [
                { min: 640, max: 870, indice: 0 },
                { min: 871, max: 1100, indice: 1 },
                { min: 1101, max: 1350, indice: 2 },
                { min: 1351, max: 1600, indice: 3 },
                { min: 1601, max: 1750, indice: 4 },
                { min: 1751, max: 2100, indice: 5 },
                { min: 2101, max: 2350, indice: 6 },
                { min: 2351, max: 2600, indice: 7 },
                { min: 2601, max: 2850, indice: 8 }
            ],
            larghezza1Anta: [
                { min: 415, max: 475, indice: 0 },
                { min: 476, max: 535, indice: 1 },
                { min: 536, max: 595, indice: 2 },
                { min: 596, max: 655, indice: 3 },
                { min: 656, max: 715, indice: 4 },
                { min: 716, max: 775, indice: 5 },
                { min: 776, max: 835, indice: 6 },
                { min: 836, max: 895, indice: 7 },
                { min: 896, max: 955, indice: 8 },
                { min: 956, max: 1015, indice: 9 }
            ],
            larghezza2Ante: [
                { min: 900, max: 962, indice: 0 },
                { min: 963, max: 1082, indice: 1 },
                { min: 1083, max: 1202, indice: 2 },
                { min: 1203, max: 1322, indice: 3 },
                { min: 1323, max: 1442, indice: 4 },
                { min: 1443, max: 1562, indice: 5 },
                { min: 1563, max: 1682, indice: 6 },
                { min: 1683, max: 1802, indice: 7 },
                { min: 1803, max: 1922, indice: 8 },
                { min: 1923, max: 2042, indice: 9 },
                { min: 2043, max: 2160, indice: 10 }
            ],
            larghezzaFissa: [
                { min: 415, max: 535, indice: 0 },
                { min: 536, max: 655, indice: 1 },
                { min: 656, max: 775, indice: 2 },
                { min: 776, max: 895, indice: 3 },
                { min: 896, max: 1015, indice: 4 },
                { min: 1016, max: 1135, indice: 5 },
                { min: 1136, max: 1255, indice: 6 },
                { min: 1256, max: 1375, indice: 7 },
                { min: 1376, max: 1495, indice: 8 },
                { min: 1496, max: 1615, indice: 9 },
                { min: 1616, max: 1735, indice: 10 },
                { min: 1736, max: 1855, indice: 11 },
                { min: 1856, max: 1975, indice: 12 },
                { min: 1976, max: 2095, indice: 13 },
                { min: 2096, max: 2200, indice: 14 }
            ]
        },
        
        // TABELLE PREZZI LIBERA
        prezzi: {
            // CATEGORIA BASIC (Basic T base, Basic Q = +5%)
            BASIC: {
                "1_AP": [
                    // Altezze: 640-870, 871-1100, 1101-1350, 1351-1600, 1601-1750, 1751-2100, 2101-2350, 2351-2600, 2601-2850
                    [608, 622, 642, 658, 667, 794, 809, 826, 842],
                    [612, 626, 647, 663, 672, 801, 817, 833, 850],
                    [619, 635, 658, 676, 686, 817, 835, 854, 872],
                    [654, 670, 693, 711, 723, 866, 886, 904, 924],
                    [660, 679, 704, 724, 737, 883, 904, 925, 946],
                    [664, 683, 709, 729, 742, 890, 912, 932, 954],
                    [696, 714, 742, 763, 775, 918, 940, 962, 984],
                    [702, 723, 752, 775, 789, 935, 959, 983, 1005],
                    [706, 727, 758, 781, 794, 941, 966, 990, 1014],
                    [712, 735, 768, 793, 808, 959, 985, 1011, 1037]
                ],
                "2_AP": [
                    [984, 1009, 1045, 1072, 1088, 1258, 1286, 1313, 1339],
                    [998, 1026, 1068, 1098, 1116, 1293, 1324, 1354, 1385],
                    [1006, 1035, 1077, 1110, 1128, 1307, 1339, 1371, 1403],
                    [1014, 1044, 1088, 1120, 1140, 1322, 1354, 1388, 1421],
                    [1063, 1097, 1145, 1182, 1204, 1402, 1439, 1475, 1512],
                    [1071, 1105, 1155, 1193, 1215, 1416, 1455, 1493, 1531],
                    [1085, 1123, 1178, 1219, 1244, 1451, 1493, 1534, 1577],
                    [1092, 1131, 1187, 1231, 1255, 1465, 1508, 1552, 1594],
                    [1139, 1181, 1242, 1288, 1316, 1538, 1585, 1632, 1679],
                    [1145, 1190, 1252, 1300, 1328, 1553, 1601, 1649, 1697],
                    [1160, 1207, 1275, 1326, 1356, 1588, 1639, 1690, 1742]
                ],
                "FST": [
                    [309, 321, 338, 350, 357, 431, 443, 455, 467],
                    [319, 332, 352, 367, 375, 452, 467, 481, 496],
                    [328, 343, 366, 383, 393, 474, 491, 508, 524],
                    [337, 355, 381, 400, 411, 496, 515, 534, 553],
                    [376, 395, 422, 442, 454, 551, 571, 591, 611],
                    [385, 406, 436, 459, 472, 572, 595, 617, 640],
                    [395, 418, 451, 476, 490, 594, 619, 644, 668],
                    [404, 429, 465, 492, 508, 616, 643, 670, 697],
                    [414, 441, 479, 509, 526, 638, 667, 696, 726],
                    [423, 452, 494, 525, 544, 659, 691, 723, 754],
                    [454, 485, 530, 564, 584, 709, 743, 777, 811],
                    [463, 496, 544, 580, 602, 731, 767, 803, 839],
                    [472, 508, 558, 597, 620, 752, 791, 829, 868],
                    [478, 514, 566, 606, 630, 764, 804, 844, 883],
                    [487, 525, 580, 622, 647, 785, 826, 868, 910]
                ]
            },
            // CATEGORIA ELEGANCE (Elegance/RetrÃ²/Royal T base, Q = +5%)
            ELEGANCE: {
                "1_AP": [
                    [629, 644, 666, 682, 691, 826, 842, 858, 875],
                    [633, 647, 671, 687, 698, 833, 850, 867, 883],
                    [643, 660, 687, 705, 716, 856, 875, 893, 912],
                    [679, 696, 724, 743, 753, 907, 927, 946, 965],
                    [689, 708, 740, 760, 772, 930, 952, 973, 993],
                    [692, 711, 744, 765, 777, 938, 960, 980, 1002],
                    [726, 745, 779, 800, 813, 966, 988, 1011, 1033],
                    [735, 756, 794, 817, 831, 989, 1014, 1038, 1062],
                    [739, 761, 798, 823, 836, 997, 1021, 1046, 1071],
                    [749, 772, 814, 839, 855, 1020, 1047, 1073, 1099]
                ],
                "2_AP": [
                    [1011, 1036, 1079, 1105, 1122, 1303, 1330, 1356, 1384],
                    [1033, 1061, 1112, 1142, 1160, 1351, 1382, 1412, 1443],
                    [1039, 1069, 1122, 1153, 1172, 1365, 1397, 1428, 1461],
                    [1047, 1077, 1131, 1165, 1184, 1379, 1412, 1446, 1479],
                    [1104, 1138, 1200, 1237, 1259, 1474, 1511, 1548, 1585],
                    [1112, 1146, 1210, 1248, 1271, 1488, 1526, 1565, 1603],
                    [1132, 1171, 1242, 1284, 1308, 1536, 1610, 1620, 1662],
                    [1140, 1180, 1252, 1295, 1321, 1550, 1594, 1637, 1680],
                    [1194, 1236, 1317, 1363, 1392, 1639, 1686, 1733, 1779],
                    [1201, 1245, 1328, 1375, 1403, 1653, 1701, 1749, 1797],
                    [1222, 1269, 1359, 1411, 1442, 1700, 1752, 1804, 1856]
                ],
                "FST": [
                    [327, 339, 361, 373, 380, 461, 473, 486, 498],
                    [340, 353, 380, 394, 403, 489, 504, 518, 533],
                    [352, 368, 399, 416, 426, 517, 534, 551, 568],
                    [365, 383, 418, 437, 449, 545, 564, 583, 603],
                    [405, 424, 461, 481, 493, 602, 622, 643, 663],
                    [418, 439, 480, 503, 516, 630, 653, 675, 698],
                    [430, 453, 499, 524, 539, 658, 683, 708, 733],
                    [443, 468, 518, 545, 562, 686, 713, 741, 768],
                    [455, 482, 537, 567, 585, 714, 744, 773, 803],
                    [468, 497, 556, 588, 607, 742, 774, 806, 838],
                    [503, 534, 598, 632, 653, 799, 834, 868, 902],
                    [515, 549, 617, 653, 675, 827, 864, 901, 937],
                    [528, 563, 636, 675, 698, 855, 894, 933, 972],
                    [533, 570, 644, 684, 708, 868, 908, 948, 988],
                    [545, 584, 662, 704, 730, 894, 936, 978, 1021]
                ]
            },
            // CATEGORIA PLUS_DELUXE (Plus/Style/Deluxe/Onda/Liberty/Classic T base, Q = +5%)
            PLUS_DELUXE: {
                "1_AP": [
                    [664, 677, 695, 708, 717, 870, 883, 898, 912],
                    [668, 681, 700, 713, 722, 877, 891, 906, 920],
                    [680, 693, 712, 727, 737, 902, 916, 931, 947],
                    [719, 732, 753, 768, 777, 956, 972, 988, 1003],
                    [730, 745, 766, 782, 791, 980, 997, 1013, 1029],
                    [734, 749, 771, 788, 797, 988, 1004, 1022, 1038],
                    [770, 785, 808, 825, 835, 1019, 1036, 1053, 1071],
                    [782, 797, 822, 838, 849, 1044, 1061, 1080, 1097],
                    [785, 802, 827, 845, 855, 1050, 1069, 1087, 1106],
                    [797, 814, 839, 858, 869, 1075, 1094, 1113, 1133]
                ],
                "2_AP": [
                    [1128, 1150, 1182, 1206, 1220, 1450, 1473, 1496, 1519],
                    [1154, 1177, 1211, 1235, 1250, 1501, 1526, 1548, 1574],
                    [1161, 1185, 1222, 1248, 1263, 1517, 1543, 1568, 1594],
                    [1170, 1194, 1233, 1260, 1275, 1532, 1559, 1585, 1613],
                    [1238, 1264, 1304, 1332, 1348, 1640, 1668, 1695, 1724],
                    [1246, 1273, 1315, 1344, 1361, 1655, 1685, 1714, 1743],
                    [1272, 1300, 1344, 1374, 1393, 1707, 1738, 1768, 1799],
                    [1279, 1308, 1355, 1386, 1406, 1723, 1754, 1786, 1818],
                    [1344, 1374, 1422, 1455, 1475, 1822, 1855, 1887, 1920],
                    [1352, 1383, 1433, 1467, 1488, 1837, 1871, 1906, 1940],
                    [1377, 1410, 1462, 1497, 1518, 1888, 1924, 1959, 1995]
                ],
                "FST": [
                    [365, 373, 387, 396, 402, 513, 522, 531, 540],
                    [382, 391, 407, 417, 423, 548, 558, 568, 578],
                    [399, 409, 427, 438, 445, 582, 594, 605, 616],
                    [416, 427, 446, 459, 466, 617, 630, 642, 654],
                    [460, 473, 494, 507, 516, 680, 694, 707, 721],
                    [477, 491, 514, 528, 537, 715, 730, 744, 759],
                    [494, 509, 533, 549, 558, 750, 765, 781, 797],
                    [511, 527, 553, 570, 580, 784, 801, 818, 835],
                    [528, 544, 573, 591, 601, 819, 837, 855, 873],
                    [545, 562, 592, 611, 623, 854, 873, 892, 911],
                    [587, 606, 637, 657, 669, 922, 942, 962, 982],
                    [604, 623, 657, 678, 691, 956, 978, 999, 1020],
                    [621, 641, 676, 699, 712, 991, 1014, 1036, 1059],
                    [626, 648, 685, 709, 723, 1004, 1027, 1051, 1075],
                    [643, 665, 704, 728, 743, 1037, 1061, 1086, 1111]
                ]
            },
            // CATEGORIA ROMBO (Rombo T base, Rombo Q = +5%)
            ROMBO: {
                "1_AP": [
                    [693, 718, 738, 756, 771, 932, 947, 973, 999],
                    [706, 726, 748, 769, 785, 948, 977, 996, 1021],
                    [713, 734, 758, 789, 797, 965, 998, 1025, 1045],
                    [766, 789, 821, 845, 864, 1056, 1071, 1106, 1126],
                    [779, 804, 832, 858, 878, 1075, 1107, 1129, 1160],
                    [787, 813, 840, 880, 890, 1088, 1129, 1152, 1186],
                    [843, 871, 909, 938, 961, 1166, 1191, 1227, 1252],
                    [857, 890, 921, 952, 976, 1186, 1204, 1251, 1298],
                    [860, 896, 929, 976, 987, 1198, 1247, 1275, 1341],
                    [865, 907, 952, 986, 1014, 1218, 1270, 1313, 1379]
                ],
                "2_AP": [
                    [1245, 1282, 1326, 1365, 1395, 1645, 1700, 1733, 1779],
                    [1262, 1303, 1346, 1407, 1422, 1685, 1746, 1798, 1832],
                    [1279, 1323, 1385, 1431, 1468, 1754, 1791, 1848, 1885],
                    [1307, 1355, 1412, 1462, 1502, 1797, 1858, 1898, 1959],
                    [1385, 1437, 1491, 1571, 1587, 1899, 1980, 2022, 2088],
                    [1403, 1458, 1536, 1595, 1640, 1941, 2027, 2098, 2143],
                    [1417, 1503, 1564, 1625, 1674, 2027, 2057, 2150, 2243],
                    [1446, 1517, 1591, 1656, 1708, 2053, 2151, 2202, 2283],
                    [1516, 1602, 1696, 1765, 1820, 2169, 2273, 2358, 2412],
                    [1532, 1653, 1725, 1798, 1856, 2267, 2301, 2413, 2524],
                    [1560, 1668, 1752, 1829, 1890, 2308, 2407, 2466, 2560]
                ],
                "FST": [
                    [415, 433, 453, 471, 486, 599, 612, 635, 663],
                    [431, 452, 482, 503, 521, 636, 663, 696, 713],
                    [453, 477, 502, 541, 548, 686, 725, 736, 775],
                    [467, 509, 538, 566, 589, 716, 761, 805, 818],
                    [533, 575, 607, 652, 666, 802, 840, 863, 911],
                    [553, 606, 647, 681, 711, 854, 884, 925, 979],
                    [559, 612, 683, 721, 753, 865, 942, 1004, 1019],
                    [580, 637, 705, 770, 779, 912, 983, 1039, 1105],
                    [589, 664, 727, 819, 793, 960, 1007, 1084, 1144],
                    [606, 670, 749, 802, 837, 971, 1061, 1111, 1194],
                    [638, 705, 773, 851, 912, 1067, 1120, 1217, 1306],
                    [647, 711, 804, 887, 944, 1078, 1144, 1263, 1335],
                    [663, 736, 818, 915, 962, 1125, 1215, 1289, 1385],
                    [672, 760, 841, 931, 992, 1173, 1239, 1335, 1413],
                    [687, 766, 854, 966, 1009, 1183, 1291, 1360, 1461]
                ]
            }
        }
    }
};

// ========================================
// FUNZIONI DI UTILITA' UNIFICATE
// ========================================

/**
 * Trova fascia dimensionale
 */
function troveFasciaErreci(valore, tipo, linea) {
    let fasce;
    
    // LIBERA ha fasce proprie
    if (linea === 'LIBERA') {
        const liberaFasce = ERRECI_DATABASE_2025.LIBERA.fasce;
        if (tipo === 'altezza') {
            fasce = liberaFasce.altezza;
        } else if (tipo === 'larghezza1Anta') {
            fasce = liberaFasce.larghezza1Anta;
        } else if (tipo === 'larghezza2Ante') {
            fasce = liberaFasce.larghezza2Ante;
        } else if (tipo === 'larghezzaFissa') {
            fasce = liberaFasce.larghezzaFissa;
        }
    }
    // Gestione fasce specifiche per SIKURA
    else if (linea === 'SIKURA') {
        if (tipo === 'larghezza1Anta') {
            fasce = ERRECI_DATABASE_2025.fasceDimensionali.larghezza1AntaSikura;
        } else if (tipo === 'larghezza2Ante') {
            fasce = ERRECI_DATABASE_2025.fasceDimensionali.larghezza2AnteSikura;
        } else {
            fasce = ERRECI_DATABASE_2025.fasceDimensionali[tipo];
        }
    } else {
        fasce = ERRECI_DATABASE_2025.fasceDimensionali[tipo];
    }
    
    if (!fasce) return -1;
    
    for (let i = 0; i < fasce.length; i++) {
        if (valore >= fasce[i].min && valore <= fasce[i].max) {
            return fasce[i].indice;
        }
    }
    return -1;
}

/**
 * Calcola prezzo grata Erreci (funzione unificata)
 * @param {string} linea - EDILIA2, EVOLUTA18, SIKURA, LIBERA
 * @param {string} modello - es. BASIC_T, ROYAL_Q, ELEGANCE_T, ROMBO_Q
 * @param {string} tipoApertura - es. 1_ACS_180, 2_ASS_180, FST, 1_AP, 2_AP
 * @param {number} larghezza - mm
 * @param {number} altezza - mm
 */
function calcolaPrezzoGrataErreci(linea, modello, tipoApertura, larghezza, altezza) {
    const db = ERRECI_DATABASE_2025;
    const lineaDb = db[linea];
    
    if (!lineaDb) {
        return { errore: `Linea ${linea} non trovata. Usa: EDILIA2, EVOLUTA18, SIKURA, LIBERA` };
    }
    
    // Verifica modello
    const modConfig = lineaDb.modelli[modello];
    if (!modConfig) {
        return { errore: `Modello ${modello} non trovato per linea ${linea}` };
    }
    
    // Trova categoria prezzo
    const categoria = modConfig.categoria;
    
    // Fascia altezza
    const indiceFasciaH = troveFasciaErreci(altezza, 'altezza', linea);
    if (indiceFasciaH < 0) {
        return { errore: `Altezza ${altezza}mm fuori range (640-2850mm)` };
    }
    
    // Fascia larghezza - gestione LIBERA
    let tipoLarghezza;
    if (tipoApertura === 'FST' || tipoApertura === 'F') {
        tipoLarghezza = 'larghezzaFissa';
    } else if (tipoApertura.startsWith('2_') || tipoApertura === '2_AP') {
        tipoLarghezza = 'larghezza2Ante';
    } else {
        tipoLarghezza = 'larghezza1Anta';
    }
    
    const indiceFasciaL = troveFasciaErreci(larghezza, tipoLarghezza, linea);
    if (indiceFasciaL < 0) {
        return { errore: `Larghezza ${larghezza}mm fuori range per ${tipoApertura}` };
    }
    
    // Recupera tabella prezzi
    const tabellaCategoria = lineaDb.prezzi[categoria];
    if (!tabellaCategoria) {
        return { errore: `Categoria ${categoria} non trovata per ${linea}` };
    }
    
    // Ottieni tabella
    let tabella = tabellaCategoria[tipoApertura];
    
    // Gestione riferimenti (null = usa altra tabella)
    if (tabella === null) {
        if (tipoApertura === '1_ASS_180') tabella = tabellaCategoria['1_ACS_180'];
        else if (tipoApertura === '2_ASS_180') tabella = tabellaCategoria['2_ACS_180'];
        else if (tipoApertura === '1_SC') tabella = tabellaCategoria['1_ASS_180'];
        else if (tipoApertura === '2_SC') tabella = tabellaCategoria['2_ASS_180'];
        else if (tipoApertura === 'FST' && categoria === 'ROYAL') {
            tabella = lineaDb.prezzi['BASIC']['FST'];
        }
    }
    
    if (!tabella) {
        return { errore: `Tipo apertura ${tipoApertura} non disponibile per ${categoria}` };
    }
    
    // Lookup prezzo base
    const prezzoBase = tabella[indiceFasciaL][indiceFasciaH];
    
    // Applica supplemento modello
    const supplementoPercentuale = modConfig.supplemento || 0;
    const prezzoFinale = Math.round(prezzoBase * (1 + supplementoPercentuale / 100));
    
    return {
        prezzo: prezzoFinale,
        prezzoBase: prezzoBase,
        supplementoPercentuale: supplementoPercentuale,
        linea: linea,
        modello: modello,
        categoria: categoria,
        tipoApertura: tipoApertura,
        larghezza: larghezza,
        altezza: altezza,
        fasciaLarghezza: indiceFasciaL,
        fasciaAltezza: indiceFasciaH,
        certificazione: lineaDb.info.certificazione
    };
}

/**
 * Calcola costo trasporto
 */
function calcolaTrasportoErreci(provincia, quantita) {
    const db = ERRECI_DATABASE_2025.trasporti;
    
    for (const zona in db) {
        if (db[zona].zone && db[zona].zone.includes(provincia)) {
            if (zona === 'aPreventivo') {
                return { aPreventivo: true, provincia: provincia, note: db[zona].note };
            }
            const prezzi = db[zona].prezzi;
            let indice = quantita >= 10 ? 2 : (quantita >= 4 ? 1 : 0);
            return {
                costoUnitario: prezzi[indice],
                quantita: quantita,
                totale: prezzi[indice] * quantita,
                zona: zona
            };
        }
    }
    return { errore: `Provincia ${provincia} non trovata` };
}

/**
 * Confronta prezzi tra le 3 linee per stesse dimensioni
 */
function confrontaPrezziLinee(modelloBase, tipoApertura, larghezza, altezza) {
    const risultati = {};
    const linee = ['EDILIA2', 'EVOLUTA18', 'SIKURA'];
    
    // Mappatura modelli equivalenti
    const mappaModelli = {
        'BASIC_T': { EDILIA2: 'BASIC_T', EVOLUTA18: 'BASIC_T', SIKURA: 'BASIC_T' },
        'BASIC_Q': { EDILIA2: 'BASIC_Q', EVOLUTA18: 'BASIC_Q', SIKURA: 'BASIC_Q' },
        'ROYAL_T': { EDILIA2: 'ROYAL_T', EVOLUTA18: 'ROYAL_T', SIKURA: 'ROYAL_T' },
        'ROYAL_Q': { EDILIA2: 'ROYAL_Q', EVOLUTA18: 'ROYAL_Q', SIKURA: 'ROYAL_Q' }
    };
    
    const mappa = mappaModelli[modelloBase];
    if (!mappa) {
        return { errore: `Modello ${modelloBase} non confrontabile tra linee` };
    }
    
    for (const linea of linee) {
        const modello = mappa[linea];
        if (modello) {
            const prezzo = calcolaPrezzoGrataErreci(linea, modello, tipoApertura, larghezza, altezza);
            if (!prezzo.errore) {
                risultati[linea] = {
                    prezzo: prezzo.prezzo,
                    certificazione: prezzo.certificazione
                };
            }
        }
    }
    
    return risultati;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ERRECI_DATABASE_2025,
        calcolaPrezzoGrataErreci,
        calcolaTrasportoErreci,
        troveFasciaErreci,
        confrontaPrezziLinee
    };
}
