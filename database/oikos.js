/**
 * OIKOS DATABASE 2025
 * Porte Blindate - Listino EVO 2025
 * Evolution - Project - Tekno
 * 
 * SCONTO INSTALLATORE: 40% + 10% = 46% (composto)
 * Netto = Listino × 0.54
 * 
 * STRUTTURA PREZZO:
 * Porta Base + Rivestimento_Int + Rivestimento_Est + Colore_Telaio + Cilindro + Accessori
 * 
 * Fonte: Listino EVO 2025 (156 pagine) - In vigore da Settembre 2025
 * 
 * @version 1.0.0
 * @date 03/02/2026
 */

const OIKOS_DATABASE_2025 = {

    // ════════════════════════════════════════════════════════════════
    // INFORMAZIONI GENERALI
    // ════════════════════════════════════════════════════════════════
    info: {
        versione: "1.0.0",
        dataAggiornamento: "2026-02-03",
        fornitore: "OIKOS S.r.l.",
        sede: "Venezia",
        listino: "EVO 2025",
        inVigoreDa: "Settembre 2025",
        tipo: "porte_blindate",
        sconto1: 0.40,
        sconto2: 0.10,
        scontoComposto: 0.46,   // 1 - (0.60 × 0.90) = 0.46
        moltiplicatoreNetto: 0.54,
        note: "Prezzi IVA esclusa, franco stabilimento",
        linee: ["EVOLUTION_3", "EVOLUTION_4", "EVOLUTION_3_TT", "PROJECT", "TEKNO", "TEKNO_3TT"]
    },

    // ════════════════════════════════════════════════════════════════
    // LUCI - DIMENSIONI MASSIME (Luce Netta Passaggio)
    // ════════════════════════════════════════════════════════════════
    luci: {
        0: { L: 900,  H: 2100, label: "Luce 0", note: "Standard" },
        1: { L: 940,  H: 2210, label: "Luce 1" },
        2: { L: 1030, H: 2400, label: "Luce 2" },
        3: { L: 1350, H: 2210, label: "Luce 3", note: "Doppia Evolution" },
        4: { L: 1600, H: 2400, label: "Luce 4", note: "Doppia Evolution" },
        5: { L: 1000, H: 2700, label: "Luce 5", note: "Tekno" },
        6: { L: 1000, H: 3000, label: "Luce 6", note: "Tekno" },
        7: { L: 1750, H: 2700, label: "Luce 7", note: "Doppia Tekno" },
        8: { L: 1900, H: 3000, label: "Luce 8", note: "Doppia Tekno" }
    },

    // ════════════════════════════════════════════════════════════════
    // CONVERSIONI MISURE (da LNP)
    // ════════════════════════════════════════════════════════════════
    conversioni: {
        evolution: {
            luceForo:               { addL: 20, addH: 10 },
            luceEsternoCassa:       { addL: 120, addH: 60 },
            luceEsternoControtelaio:{ addL: 160, addH: 80 }
        },
        tekno: {
            luceForo:               { addL: 0, addH: 0, note: "coincide con LNP + ingombri telaio" },
            luceEsternoTelaio:      { addL: 0, addH: 0, note: "variabile per montaggio" }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // LINEE PRODOTTO - PREZZI BASE PORTA
    // ════════════════════════════════════════════════════════════════
    linee: {

        // ──────────────────────────────────────────────────────
        // EVOLUTION 3 - Classe 3, 9 punti chiusura
        // ──────────────────────────────────────────────────────
        EVOLUTION_3: {
            nome: "Evolution 3",
            versione: "1300",
            classe: 3,
            puntiChiusura: 9,
            tipologia: "anta_unica",
            omega: { verticali: 1, orizzontali: 3 },
            piastra: "30/10 + defender PLUS PVD",
            lamiera: "elettrozincata 15/10",
            telaioDiSerie: "RAL 8022",
            cerniere: 2,
            deviatori: 2,
            rostriFissi: 3,
            apertura: ["spingere", "tirare"],
            prezzi: {
                0: 1156,
                1: 1206,
                2: 1441
            },
            prestazioni: {
                acustica: { diSerie: 40, aRichiesta: 45, prezzo: 120 },
                termica: {
                    diSerie: 1.9,
                    kit_1_2: { 0: 272, 1: 308, 2: 354 },
                    kit_1:   { 0: 496, 1: 544, 2: 624 }
                },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 0: 405, 1: 464, 2: 499 },
            kitDam:  { 0: 459, 1: 489, 2: 514 }
        },

        // ──────────────────────────────────────────────────────
        // EVOLUTION 4 - Classe 4, 8 punti chiusura
        // ──────────────────────────────────────────────────────
        EVOLUTION_4: {
            nome: "Evolution 4",
            versione: "1400",
            classe: 4,
            puntiChiusura: 8,
            tipologia: "anta_unica",
            omega: { verticali: 1, orizzontali: 7 },
            piastra: "30/10 + inserto manganese + defender PLUS PVD",
            lamiera: "elettrozincata 15/10",
            telaioDiSerie: "RAL 8022",
            prezzi: {
                0: 1436,
                1: 1486,
                2: 1721
            },
            prestazioni: {
                acustica: { diSerie: 40, aRichiesta: 45, prezzo: 120 },
                termica: {
                    diSerie: 1.9,
                    kit_1_2: { 0: 272, 1: 308, 2: 354 },
                    kit_1:   { 0: 496, 1: 544, 2: 624 }
                },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 0: 405, 1: 464, 2: 499 },
            kitDam:  { 0: 459, 1: 489, 2: 514 },
            note: "Lato esterno: mascherina quadrata NON possibile"
        },

        // ──────────────────────────────────────────────────────
        // EVOLUTION 3 DOPPIA
        // ──────────────────────────────────────────────────────
        EVOLUTION_3_DOPPIA: {
            nome: "Evolution 3 Doppia",
            versione: "1300",
            classe: 3,
            puntiChiusura: 14,
            tipologia: "doppia_anta",
            omega: { verticali: 1, orizzontali: 3 },
            cerniere: 4,
            deviatori: 4,
            rostriFissi: 6,
            antaMinima: 300,
            antaMobile: "2/3 LNP (se non specificato)",
            prezzi: {
                3: 2217,
                4: 2532
            },
            prestazioni: {
                acustica: { diSerie: 40, aRichiesta: 43, prezzo: 210 },
                termica: {
                    diSerie: 1.7,
                    kit_1_2: { 3: 424, 4: 615 },
                    kit_1:   { 3: 832, 4: 1100 }
                },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 3: 750, 4: 844 }
        },

        // ──────────────────────────────────────────────────────
        // EVOLUTION 3 TT - Taglio Termico U=0.86
        // ──────────────────────────────────────────────────────
        EVOLUTION_3_TT_086: {
            nome: "Evolution 3 TT (U=0.86)",
            versione: "1500",
            classe: 3,
            puntiChiusura: 9,
            tipologia: "anta_unica",
            termicaTT: true,
            prezzi: {
                0: 2254,
                1: 2442,
                2: 2766
            },
            controtelaio4Lati: { 0: 360, 1: 380, 2: 420 },
            kitMaterialiPosa: 176,
            prestazioni: {
                acustica: { diSerie: 38 },
                termica: { diSerie: 0.86 },
                aria: { diSerie: 4 },
                acqua: { diSerie: "5A" },
                vento: { diSerie: "C5" }
            },
            soglia: { termica_standard: 0, termica_plus: 430 },
            note: "Spioncino non previsto. Con gres/riflessi U=0.86 non mantenuta"
        },

        // ──────────────────────────────────────────────────────
        // EVOLUTION 3 TT - Taglio Termico U=1
        // ──────────────────────────────────────────────────────
        EVOLUTION_3_TT_1: {
            nome: "Evolution 3 TT (U=1)",
            versione: "1500",
            classe: 3,
            puntiChiusura: 9,
            tipologia: "anta_unica",
            termicaTT: true,
            prezzi: {
                0: 1958,
                1: 2131,
                2: 2386
            },
            controtelaio4Lati: { 0: 360, 1: 380, 2: 420 },
            kitMaterialiPosa: 176,
            prestazioni: {
                acustica: { diSerie: 38 },
                termica: { diSerie: 1.0 },
                aria: { diSerie: 4 },
                acqua: { diSerie: "5A" },
                vento: { diSerie: "C5" }
            },
            soglia: { termica_standard: 0, termica_plus: 430 },
            note: "Spioncino non previsto"
        },

        // ──────────────────────────────────────────────────────
        // EVOLUTION 3 EI (Tagliafuoco)
        // ──────────────────────────────────────────────────────
        EVOLUTION_3_EI: {
            nome: "Evolution 3 EI 30/45/60/VKF60",
            versione: "1300 EI",
            classe: 3,
            tipologia: "anta_unica",
            chiudiportaDiSerie: true,
            prezzi: {
                // Solo Luce 0 - per luci maggiori chiedere preventivo
                "EI30":     { 0: 1731 },
                "EI45":     { 0: 1731 },
                "EI60":     { 0: 1891 },
                "VKF_EI60": { 0: 1891 }
            },
            aperturaATirareEI60: 386,
            prestazioni: {
                acustica: { diSerie: 42 },
                termica: { diSerie: 2.1 }
            },
            note: "Spioncino non realizzabile. Solo Linea Piano/Fugato/Pantografato/LegnoVivo/Massello"
        },

        // ──────────────────────────────────────────────────────
        // PROJECT - Classe 3, Rasomuro
        // ──────────────────────────────────────────────────────
        PROJECT: {
            nome: "Project 3 Rasomuro",
            versione: "1600",
            classe: 3,
            puntiChiusura: 5,
            tipologia: "anta_unica",
            omega: { verticali: 2, orizzontali: 3 },
            cerniereAScomparsa: true,
            rasomuro: true,
            telaioDiSerie: "RAL 8022",
            prezzi: {
                0: 1781,
                1: 1948,
                2: 2234
            },
            // PROJECT ha Telaio separato (non controtelaio)
            telaio: { 0: 457, 1: 470, 2: 565 },
            prestazioni: {
                acustica: { diSerie: 36, aRichiesta: 40, prezzo: 120 },
                termica: {
                    diSerie: 1.7,
                    kit_1_2: { 0: 272, 1: 308, 2: 354 }
                }
            }
        },

        // ──────────────────────────────────────────────────────
        // PROJECT EI 30 / VKF EI 30
        // ──────────────────────────────────────────────────────
        PROJECT_EI: {
            nome: "Project 3 EI 30 / VKF EI 30",
            versione: "1600 EI",
            classe: 3,
            tipologia: "anta_unica",
            chiudiportaDiSerie: true,
            prezzi: { 0: 1654 },
            telaio: { 0: 457 },
            chiudiportaAScomparsa: 762,
            prestazioni: {
                termica: { diSerie: 2.0 }
            },
            note: "Spioncino non realizzabile. No apertura a tirare."
        },

        // ──────────────────────────────────────────────────────
        // TEKNO - Classe 3, Rasomuro interno/complanare
        // ──────────────────────────────────────────────────────
        TEKNO: {
            nome: "Tekno 3 Rasomuro Interno",
            versione: "2300",
            classe: 3,
            puntiChiusura: 6,
            tipologia: "anta_unica",
            omega: { verticali: 2, orizzontali: 3 },
            cerniereAScomparsa: true,
            rasomuro: true,
            telaioDiSerie: "Alluminio spazzolato acciaio",
            kitManiglieriaCromoSatinato: true,
            prezzi: {
                0: 1505,
                1: 1655,
                2: 1974,
                5: 2353,
                6: 2614
            },
            telaio: { 0: 474, 1: 502, 2: 543, 5: 654, 6: 712 },
            prestazioni: {
                acustica: { diSerie: 43 },
                termica: {
                    diSerie: 1.6,
                    kit_1_2: { 0: 272, 1: 308, 2: 354, 5: 394, 6: 437 },
                    kit_1:   { 0: 496, 1: 544, 2: 624, 5: 710, 6: 798 }
                },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 0: 405, 1: 464, 2: 499, 5: 499, 6: 499 },
            kitDam:  { 0: 459, 1: 489, 2: 514, 5: 514, 6: 514 }
        },

        // ──────────────────────────────────────────────────────
        // TEKNO RASOMURO ESTERNO
        // ──────────────────────────────────────────────────────
        TEKNO_EST: {
            nome: "Tekno 3 Rasomuro Esterno",
            versione: "2300",
            classe: 3,
            puntiChiusura: 6,
            tipologia: "anta_unica",
            prezzi: {
                0: 2060,
                1: 2247,
                2: 2634,
                5: 3060,
                6: 3453
            },
            telaio: { 0: 474, 1: 502, 2: 543, 5: 654, 6: 712 },
            prestazioni: {
                acustica: { diSerie: 43 },
                termica: {
                    diSerie: 1.6,
                    kit_1_2: { 0: 272, 1: 308, 2: 354, 5: 394, 6: 437 },
                    kit_1:   { 0: 496, 1: 544, 2: 624, 5: 710, 6: 798 }
                },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 0: 405, 1: 464, 2: 499, 5: 499, 6: 499 },
            kitDam:  { 0: 459, 1: 489, 2: 514, 5: 514, 6: 514 }
        },

        // ──────────────────────────────────────────────────────
        // TEKNO DOPPIA
        // ──────────────────────────────────────────────────────
        TEKNO_DOPPIA: {
            nome: "Tekno 3 Doppia",
            versione: "2300 Doppia",
            classe: 3,
            puntiChiusura: 8,
            tipologia: "doppia_anta",
            prezzi: {
                3: 2815,
                4: 3611,
                7: 4455,
                8: 5346
            },
            telaio: { 3: 606, 4: 802, 7: 971, 8: 1155 },
            prestazioni: {
                acustica: { diSerie: 43 },
                termica: {
                    diSerie: 1.7,
                    kit_1_2: { 3: 442, 4: 568, 7: 702, 8: 841 },
                    kit_1:   { 3: 808, 4: 1037, 7: 1280, 8: 1536 }
                },
                aria: { diSerie: 2 }
            },
            kitMose: { 3: 663, 4: 864, 7: 1068, 8: 1280 },
            coloriTelaio: {
                // Tekno doppia ha colori telaio specifici per luce
                alluSpazzolatoAcciaio: { 3: 0, 4: 0, 7: 0, 8: 0 },
                polveri:    { 3: 426, 4: 470, 7: 525, 8: 580 },
                evergreen:  { 3: 548, 4: 604, 7: 675, 8: 746 },
                future:     { 3: 661, 4: 729, 7: 815, 8: 900 },
                liquido:    { 3: 843, 4: 931, 7: 1040, 8: 1149 }
            }
        },

        // ──────────────────────────────────────────────────────
        // TEKNO EI 60/90/VKF EI 90
        // ──────────────────────────────────────────────────────
        TEKNO_EI: {
            nome: "Tekno 3 EI 60/90/VKF EI 90",
            versione: "2300 EI",
            classe: 3,
            chiudiportaDiSerie: true,
            prezzi: { 0: 2804 },
            telaio: { 0: 474 },
            prestazioni: { acustica: { diSerie: 42 } },
            note: "Solo apertura a spingere. Solo Piano/Fugato/Pantografato/LegnoVivo/Massello"
        },

        // ──────────────────────────────────────────────────────
        // TEKNO EI 120
        // ──────────────────────────────────────────────────────
        TEKNO_EI120: {
            nome: "Tekno 3 EI 120",
            versione: "2300 EI",
            classe: 3,
            chiudiportaDiSerie: true,
            prezzi: { 0: 3498 },  // Luce foro fino a 905×2395
            telaio: { 0: 814 },
            chiudiportaAScomparsa: 1131,
            prestazioni: { acustica: { diSerie: 42 } }
        },

        // ──────────────────────────────────────────────────────
        // TEKNO UL FD 120 (mercato USA/Canada/UAE)
        // ──────────────────────────────────────────────────────
        TEKNO_UL: {
            nome: "Tekno 3 UL FD 120",
            versione: "2300 UL FD 120",
            classe: 3,
            chiudiportaDiSerie: true,
            prezzi: { 0: 3912 },  // Luce foro fino a 910×2395
            telaio: { 0: 814 },
            chiudiportaAScomparsa: 1102
        },

        // ──────────────────────────────────────────────────────
        // TEKNO ANTIURAGANO
        // ──────────────────────────────────────────────────────
        TEKNO_ANTIURAGANO: {
            nome: "Tekno 3 Antiuragano",
            versione: "2300",
            classe: 3,
            prezzi: { 0: 3376 },  // Luce foro fino a 1020×2425
            telaio: { 0: 543 },
            prestazioni: { antiuragano: "65 PSF" },
            note: "Certificata solo con apertura a tirare"
        },

        // ──────────────────────────────────────────────────────
        // TEKNO 3TT - Taglio Termico U=1
        // ──────────────────────────────────────────────────────
        TEKNO_3TT: {
            nome: "Tekno 3TT Rasomuro Interno (U=1)",
            versione: "2300",
            classe: 3,
            termicaTT: true,
            prezzi: {
                0: 2099,
                1: 2238,
                2: 2650,
                5: 3079,
                6: 3417
            },
            telaioTT: { 0: 736, 1: 784, 2: 856, 5: 986, 6: 1105 },
            prestazioni: {
                acustica: { diSerie: 42 },
                termica: { diSerie: 1.0 },
                aria: { diSerie: 2 },
                acqua: { diSerie: 0 },
                vento: { diSerie: "C4" }
            },
            kitMose: { 0: 405, 1: 464, 2: 499, 5: 499, 6: 499 },
            kitDam:  { 0: 459, 1: 489, 2: 514, 5: 514, 6: 514 },
            // Colori telaio TT diversi
            coloriTelaioTT: {
                alluSpazzolatoAcciaio: 0,
                polveri: 328,
                evergreen: 426,
                future: 512,
                liquido: 664
            }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // CILINDRI
    // ════════════════════════════════════════════════════════════════
    cilindri: {
        SEKUR: {
            nome: "SEKUR",
            prezzo: 238,
            profilo: "Esclusivo OIKOS",
            certificazioni: "SKG/A2P",
            duplicazione: "Solo presso OIKOS",
            chiavi: { cantiere: 1, utilizzo: 4, emergenza: 1 },
            chiaveAggiuntiva: 35,
            duplicatoChiave: 60
        },
        BASIC: {
            nome: "BASIC",
            prezzo: 123,
            cicliLavoro: "6.1M",
            sicurezzaChiave: "Grado 6",
            resistenzaTrapano: "D5",
            duplicazione: "Centro chiavi specializzato",
            chiavi: { cantiere: 1, utilizzo: 3 },
            chiaveAggiuntiva: 29,
            duplicatoChiave: 50
        }
    },

    // ════════════════════════════════════════════════════════════════
    // CONTROTELAIO / TELAIO
    // ════════════════════════════════════════════════════════════════
    controtelaio: {
        // Evolution standard (incluso nel prezzo base come controtelaio grezzo)
        evolution: { 0: 177, 1: 202, 2: 240 },
        // Evolution Doppia
        evolutionDoppia: { 3: 318, 4: 350 },
        // Maggiorazione per Telaio a Taglio Termico (Evolution standard)
        maggiorazioneTT_evolution: { 0: 246, 1: 276, 2: 309 },
        maggiorazioneTT_evolutionDoppia: { 3: 306, 4: 339 },
        // Evolution 3 TT ha controtelaio 4 lati dedicato
        evolution3TT: { 0: 360, 1: 380, 2: 420 }
    },

    // ════════════════════════════════════════════════════════════════
    // COLORI TELAIO E ALLUMINI
    // ════════════════════════════════════════════════════════════════
    coloriTelaio: {
        // Prezzi standard (anta unica, validi per Evolution e Tekno standard)
        standard: {
            RAL_8022:   { prezzo: 0, label: "RAL 8022 (standard)", note: "Evolution" },
            alluSpazzolato: { prezzo: 0, label: "Alluminio spazzolato acciaio", note: "Tekno" },
            polveri:    { prezzo: 246, label: "Colori OIKOS a Polveri" },
            evergreen:  { prezzo: 320, label: "Colori OIKOS Evergreen a Polveri" },
            future:     { prezzo: 384, label: "Colori OIKOS Future" },
            liquido:    { prezzo: 492, label: "Colori OIKOS a Liquido" }
        },
        // Evolution Doppia ha prezzi diversi
        evolutionDoppia: {
            RAL_8022:   0,
            polveri:    387,
            evergreen:  528,
            future:     634,
            liquido:    808
        },
        // Telaio bicolore (supplemento)
        bicolore: {
            evolution:    { polveri: 369, skydoors: 528, liquido: 738 },
            evolutionAvv: { polveri: 553, skydoors: 687, liquido: 948 },
            evolution3TT: { polveri: 615, skydoors: 880, liquido: 984 },
            tekno:        { polveri: 615, skydoors: 880, liquido: 984 }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // RIVESTIMENTI
    // ════════════════════════════════════════════════════════════════
    rivestimenti: {

        // ── LINEA PIANO - DI SERIE (pannelli MDF 9mm verticali) ──
        piano_diSerie: {
            linea: "Piano",
            modello: "Di Serie",
            supporto: "truciolare/MDF 9mm",
            orientamento: "verticale",
            essenze: {
                tanganica_1_2_mogano: {
                    label: "Tanganica 1-2 / Mogano 2-3",
                    prezzi: { 0: 192, 1: 192, 2: 235, 3: 346, 4: 414 }
                },
                laccato_bianco_oikos: {
                    label: "Laccato Bianco OIKOS",
                    prezzi: { 0: 130, 1: 145, 2: 179, 3: 284, 4: 358 }
                },
                rovere_1: {
                    label: "Rovere 1",
                    prezzi: { 0: 242, 1: 242, 2: 298, 3: 408, 4: 510 }
                },
                noce_nazionale_2: {
                    label: "Noce Nazionale 2",
                    prezzi: { 0: 276, 1: 276, 2: 340, 3: 459, 4: 573 }
                },
                mdf_da_laccare: {
                    label: "MDF da laccare",
                    prezzi: { 0: 114, 1: 117, 2: 127, 3: 192, 4: 192 }
                },
                supporto_cliente: {
                    label: "Supporto cliente 3-8mm",
                    prezzi: { 0: 101, 1: 101, 2: 101, 3: 182, 4: 182 }
                }
            },
            extra: {
                tinteACampione: { 0: 242, 1: 242, 2: 242 },
                maggiorazioneEsterni: { 0: 182, 1: 182, 2: 214, 3: 273, 4: 321 },
                montaggioPannelloCliente9mm: { 0: 152, 1: 152, 2: 152 },
                montaggioPannelloCliente6mm: { 0: 222, 1: 222, 2: 222 },
                corniciFermaPannello: { 0: 114, 1: 114, 2: 114, 3: 128, 4: 128 }
            }
        },

        // ── LINEA PIANO - MATERICI ──
        piano_materici: {
            linea: "Piano",
            modello: "Materici",
            supporto: "truciolare 9mm termo-strutturato",
            essenze: {
                bianco_talco:         { label: "Bianco Talco",         prezzi: { 0: 170, 1: 170, 2: 170 } },
                grigio_talco:         { label: "Grigio Talco",         prezzi: { 0: 170, 1: 170, 2: 170 } },
                bianco_sable:         { label: "Bianco Sablé",         prezzi: { 0: 170, 1: 170, 2: 170 } },
                grigio_sable:         { label: "Grigio Sablé",         prezzi: { 0: 170, 1: 170, 2: 170 } },
                bianco_rovere_sable:  { label: "Bianco Rovere Sablé",  prezzi: { 0: 170, 1: 170, 2: 170 } },
                grigio_rovere_sable:  { label: "Grigio Rovere Sablé",  prezzi: { 0: 170, 1: 170, 2: 170 } }
            },
            note: "Angolari e cornici non realizzabili. No porte EI"
        },

        // ── LINEA PIANO - NON DI SERIE (pannelli MDF 9mm) ──
        piano_nonDiSerie: {
            linea: "Piano",
            modello: "Non di Serie",
            // Anta unica Evolution (0-1, 2) + Tekno (5, 6) | Doppia Evo (3, 4) + Tekno (7, 8)
            essenze: {
                rovere_nat_2_3: {
                    label: "Rovere Naturale 2-3 / Miele / Wengè / Sbiancato",
                    antaUnica:  { "0-1": 405, 2: 483, 5: 526, 6: 585 },
                    doppiaAnta: { 3: 626, 4: 811, 7: 1104, 8: 1333 }
                },
                tanganica_3: {
                    label: "Tanganica 3",
                    antaUnica:  { "0-1": 405, 2: 483, 5: 526, 6: 585 },
                    doppiaAnta: { 3: 626, 4: 811, 7: 1104, 8: 1333 }
                },
                castagno_2_3: {
                    label: "Castagno 2-3 / Douglas 2 / Pino 2",
                    antaUnica:  { "0-1": 405, 2: 483, 5: 526, 6: 585 },
                    doppiaAnta: { 3: 626, 4: 811, 7: 1104, 8: 1333 }
                },
                noce_canaletto: {
                    label: "Noce Canaletto",
                    antaUnica:  { "0-1": 458, 2: 545, 5: 594, 6: 660 },
                    doppiaAnta: { 3: 700, 4: 889, 7: 1101, 8: 1317 }
                },
                teak: {
                    label: "Teak",
                    antaUnica:  { "0-1": 520, 2: 620, 5: 675, 6: 750 },
                    doppiaAnta: { 3: 782, 4: 1005, 7: 1243, 8: 1488 }
                },
                laccato_ral: {
                    label: "Laccato RAL / Laccati di Tendenza",
                    antaUnica:  { "0-1": 405, 2: 483, 5: 526, 6: 585 },
                    doppiaAnta: { 3: 626, 4: 811, 7: 1104, 8: 1333 }
                },
                altre_essenze: {
                    label: "Altre essenze a conferma",
                    antaUnica:  { "0-1": 486, 2: 579, 5: 631, 6: 702 },
                    doppiaAnta: { 3: 751, 4: 973, 7: 1324, 8: 1599 }
                }
            },
            extra: {
                tinteACampione: { "0-1": 187, 2: 220, 5: 236, 6: 268, 3: 268, 4: 342, 7: 420, 8: 509 },
                maggiorazioneEsterni: { "0-1": 149, 2: 178, 5: 194, 6: 216, 3: 216, 4: 276, 7: 339, 8: 410 },
                corniciFermaPannello: { "0-1": 114, 2: 114, 3: 228, 4: 228 },
                mdfDaLaccareEI: { 0: 171 },
                mdfLaccatoRalEI: { 0: 475 }
            }
        },

        // ── LINEA PIANO - ORIZZONTALE (Non di serie) ──
        piano_orizzontale: {
            linea: "Piano",
            modello: "Orizzontale",
            essenze: {
                rovere_nat: {
                    label: "Rovere Naturale/1-2-3/Miele/Wengè/Sbiancato / Tanganica 1-2 / Mogano 2-3",
                    antaUnica: { "0-1": 543, 2: 647, 5: 704, 6: 783 }
                },
                noce_canaletto: {
                    label: "Noce Canaletto",
                    antaUnica: { "0-1": 596, 2: 709, 5: 772, 6: 858 }
                },
                teak: {
                    label: "Teak",
                    antaUnica: { "0-1": 658, 2: 784, 5: 853, 6: 948 }
                },
                laccati_tendenza: {
                    label: "Laccati di Tendenza / Laccato RAL",
                    antaUnica: { "0-1": 597, 2: 712, 5: 774, 6: 861 }
                },
                spazzolato_rovere: {
                    label: "Spazzolato su Rovere / Laccati Metallizzati",
                    antaUnica: { "0-1": 692, 2: 825, 5: 898, 6: 999 }
                },
                rovere_raw: {
                    label: "Rovere Raw (Cenere/Allier/Moka)",
                    antaUnica: { "0-1": 658, 2: 784, 5: 853, 6: 948 }
                }
            }
        },

        // ── LINEA PIANO - VERTICALE (Non di serie) ──
        piano_verticale: {
            linea: "Piano",
            modello: "Verticale",
            essenze: {
                laccati_tendenza: {
                    label: "Laccati di Tendenza / Laccato RAL",
                    antaUnica: { "0-1": 459, 2: 547, 5: 596, 6: 663 }
                },
                rovere_raw: {
                    label: "Rovere Raw (Cenere/Allier/Moka)",
                    antaUnica: { "0-1": 513, 2: 611, 5: 666, 6: 741 }
                },
                laccati_metallizzati: {
                    label: "Laccati Metallizzati / Spazzolato Rovere",
                    antaUnica: { "0-1": 554, 2: 632, 5: 721, 6: 801 }
                }
            }
        },

        // ── LINEA PIANO - GRES ──
        piano_gres: {
            linea: "Piano",
            modello: "Gres",
            note: "Solo anta unica. Spioncino e limitatore non realizzabili",
            essenze: {
                neve_nero_assoluto: {
                    label: "Neve / Nero Assoluto / Calce",
                    antaUnica: { 0: 1304, 1: 1347, 2: 1436, 5: 1529, 6: 1542 }
                },
                corten_ossido_cemento_iron: {
                    label: "Cor-Ten / Ossido / Cemento / Iron",
                    antaUnica: { 0: 1375, 1: 1418, 2: 1507, 5: 1600, 6: 1613 }
                },
                ardesia: {
                    label: "Ardesia a Spacco",
                    antaUnica: { 0: 1734, 1: 1776, 2: 1865, 5: 1958, 6: 1972 }
                },
                pietra_piasentina: {
                    label: "Pietra Piasentina",
                    antaUnica: { 0: 1877, 1: 1919, 2: 2009, 5: 2101, 6: 2114 }
                },
                noir_desir: {
                    label: "Noir Desir / Bianco Statuario",
                    antaUnica: { 0: 1495, 1: 1538, 2: 1627, 5: 1720, 6: 1733 }
                },
                noir_desir_lucido: {
                    label: "Noir Desir Lucido / Bianco Statuario Lucido",
                    antaUnica: { 0: 1829, 1: 1871, 2: 1961, 5: 2054, 6: 2067 }
                }
            }
        },

        // ── LINEA PIANO - RIFLESSI VETRO ──
        piano_riflessi: {
            linea: "Piano",
            modello: "Riflessi Vetro",
            note: "Obbligatorio imballo gabbia/cassa. Spioncino e limitatore non realizzabili",
            essenze: {
                riflessi_lucido: {
                    label: "Riflessi Vetro Lucido (16 colori)",
                    antaUnica: { 0: 1197, 1: 1322, 2: 1534, 5: 1662, 6: 1830 }
                },
                riflessi_opaco: {
                    label: "Riflessi Vetro Opaco (10 colori)",
                    antaUnica: { 0: 1363, 1: 1505, 2: 1752, 5: 1900, 6: 2094 }
                }
            }
        },

        // ── LINEA FUGATO ──
        fugato: {
            linea: "Fugato",
            modelli: {
                V: {
                    label: "Modello V...V (incisioni 5mm passo 90mm)",
                    essenze: {
                        rovere_tanganica: {
                            label: "Rovere/Tanganica/Mogano/Pino/Douglas/Laccato RAL",
                            antaUnica: { "0-1": 592, 2: 706, 5: 769, 6: 855 },
                            doppiaAnta: { 3: 894, 4: 1156, 7: 1527, 8: 1846 }
                        }
                    }
                },
                HTF: {
                    label: "Modello HTF (incisioni V passo fisso 150-300mm)",
                    essenze: {
                        standard: {
                            label: "Rovere/Tanganica/Mogano/Laccato RAL",
                            antaUnica: { "0-1": 636, 2: 758, 5: 825, 6: 918 },
                            doppiaAnta: { 3: 1092, 4: 1317, 7: 1626, 8: 1965 }
                        }
                    }
                },
                HTA: {
                    label: "Modello HTA (passo 300mm + suddivisione)",
                    essenze: {
                        standard: {
                            label: "Rovere/Tanganica/Mogano/Laccato RAL",
                            antaUnica: { "0-1": 786, 2: 908, 5: 975, 6: 1068 },
                            doppiaAnta: { 3: 1242, 4: 1467, 7: 1776, 8: 2115 }
                        }
                    }
                },
                SCALA: {
                    label: "Modello Scala (passo variabile)",
                    essenze: {
                        standard: {
                            label: "Rovere/Tanganica/Mogano/Pino/Laccato RAL",
                            antaUnica: { "0-1": 821, 2: 979, 5: 1066, 6: 1185 },
                            doppiaAnta: { 3: 1222, 4: 1579, 7: 2048, 8: 2473 }
                        }
                    }
                }
            }
        },

        // ── COUNTRY LINE (Esterno - Okoumè) ──
        countryLine: {
            linea: "Country Line",
            supporto: "Compensato marino Okoumè M100",
            spessore: "9-14mm",
            verniciatura: "all'acqua per esterni",
            piano: {
                okoume_tinta: {
                    label: "Okoumè tinta 6-7-8 / Mogano",
                    antaUnica:  { 0: 423, 1: 482, 2: 536, 5: 677, 6: 718 },
                    doppiaAnta: { 3: 767, 4: 982, 7: 1261, 8: 1395 }
                },
                okoume_laccato: {
                    label: "Okoumè Laccato RAL",
                    antaUnica:  { 0: 469, 1: 532, 2: 596, 5: 742, 6: 790 },
                    doppiaAnta: { 3: 839, 4: 1077, 7: 1375, 8: 1532 }
                }
            }
        },

        // ── LEGNO VIVO (Esterno - Rovere spazzolato 23mm) ──
        legnoVivo: {
            linea: "Legno Vivo",
            supporto: "Compensato marino M100",
            spessore: "23mm",
            essenza: "Rovere spazzolato",
            note: "Garanzia 6-12 anni (trasparente) / 15 anni (laccata)"
        },

        // ── MASSELLO (Esterno - Okoumè/Castagno 23mm) ──
        massello: {
            linea: "Massello",
            supporto: "Compensato marino M100",
            spessore: "23mm",
            essenze: ["Okoumè", "Castagno"],
            note: "Garanzia 12 anni (tinta) / 15 anni (laccata)"
        }
    },

    // ════════════════════════════════════════════════════════════════
    // SOPRALUCE
    // ════════════════════════════════════════════════════════════════
    sopraluce: {
        evolution: {
            cieco: {
                H500: { "0-1": 931, 2: 977, 3: 1208, 4: 1413 },
                H800: { "0-1": 1330, 2: 1454, 3: 1754, 4: 2053 }
            },
            controtelaioSopraluce: { "0-1": 350, 2: 374, 3: 391, 4: 404 },
            maggiorazioneVetroSabbiato: {
                H500: { "0-1": 78, 2: 82, 3: 105, 4: 125 },
                H800: { "0-1": 120, 2: 132, 3: 168, 4: 200 }
            }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // FIANCOLUCE
    // ════════════════════════════════════════════════════════════════
    fiancoluce: {
        evolution: {
            senzaVetro: { 1: 1166, 2: 1308, 3: 1388, 4: 1540 },
            conVetroBlindat: { 1: 2209, 2: 2935, 3: 3526, 4: 4374 },
            maggiorazVetroSabbiato: { 1: 170, 2: 255, 3: 312, 4: 432 },
            coloriTelaio: {
                RAL_8022: { 1: 0, 2: 0, 3: 0, 4: 0 },
                polveri:   { 1: 256, 2: 290, 3: 298, 4: 336 },
                evergreen: { 1: 336, 2: 382, 3: 392, 4: 441 },
                future:    { 1: 404, 2: 460, 3: 472, 4: 532 },
                liquido:   { 1: 512, 2: 580, 3: 596, 4: 672 }
            }
        },
        tekno: {
            telaioFiancoluce: { 1: 612, 2: 696, 3: 773, 4: 866, 5: 1020, 6: 1229 },
            senzaVetro:       { 1: 1493, 2: 1568, 3: 1627, 4: 1857, 5: 2158, 6: 2670 },
            conVetroBlindat:  { 1: 2501, 2: 3080, 3: 3643, 4: 4477, 5: 5998, 6: 7510 },
            maggiorazVetroSabbiato: { 1: 155, 2: 236, 3: 310, 4: 411, 5: 589, 6: 748 },
            coloriTelaio: {
                alluSpazzolato: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
                polveri:   { 1: 260, 2: 298, 3: 308, 4: 343, 5: 401, 6: 450 },
                evergreen: { 1: 335, 2: 384, 3: 396, 4: 441, 5: 516, 6: 579 },
                future:    { 1: 400, 2: 457, 3: 472, 4: 525, 5: 615, 6: 690 },
                liquido:   { 1: 510, 2: 585, 3: 604, 4: 672, 5: 787, 6: 883 }
            }
        },
        tekno3TT: {
            telaioFiancoluce: { 1: 985, 2: 1175, 3: 1256, 4: 1414, 5: 1590, 6: 1784 }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // VETRI BLINDATI (per inserimento in anta)
    // ════════════════════════════════════════════════════════════════
    vetriBlindat: {
        // Vetro blindato anticrimine-antiproiettile BR2/P6B in vetrocamera
        modelli: {
            V1:  { nome: "V1 Isola",    trasparente: 2311, sabbiato: 2485, disegno: 216 },
            V2:  { nome: "V2 800 Veneto",trasparente: 1757, sabbiato: 1871, disegno: 216 },
            V3:  { nome: "V3 Classica",  trasparente: 1537, sabbiato: 1631, disegno: 216 },
            V4:  { nome: "V4 Musa",      trasparente: 1537, sabbiato: 1631, disegno: 216 },
            V5:  { nome: "V5 Rialto",    trasparente: 1456, sabbiato: 1516, disegno: 216 },
            V50: { nome: "V50 Anta semifissa", trasparente: 1537, sabbiato: 1631, disegno: 216 }
        },
        // Con vetro termico (Ug migliore)
        termico: {
            V1:  { trasparente: 2683, sabbiato: 2857 },
            V2:  { trasparente: 2030, sabbiato: 2144 },
            V3:  { trasparente: 1816, sabbiato: 1910 },
            V4:  { trasparente: 1816, sabbiato: 1910 },
            V5:  { trasparente: 1684, sabbiato: 1774 },
            V50: { trasparente: 1816, sabbiato: 1910 }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // SERRATURE E OPTIONAL
    // ════════════════════════════════════════════════════════════════
    serrature: {
        serraturaServizio:      { antaUnica: 128, doppiaAnta: 128, note: "Versione 1380/2380, escluso cilindro" },
        limitatoreApertura:     { antaUnica: 114, doppiaAnta: 114, note: "Non compatibile con Arckey" },
        riscontroElettrico:     { antaUnica: 298, doppiaAnta: 418 },
        microinterruttoreAllarme: { antaUnica: 104, doppiaAnta: 104 },
        telaioSenzaAletta:      { antaUnica: 44, doppiaAnta: 44, note: "1, 2 o 3 lati" },
        controtelaioAffossato:  { antaUnica: 154, doppiaAnta: 154, note: "max 50mm" },
        telaioAffossato:        { antaUnica: 242, doppiaAnta: 242, note: "max 50mm" },
        gradinoBattutaOikos:    { antaUnica: 224, doppiaAnta: 298, note: "Non certificabile aria-acqua-vento" },
        inversione_tirare:      { antaUnica: 379, doppiaAnta: 682, note: "Certificata solo Evolution 3/Arco" },
        terzaCerniera_evolution: 412,
        terzaCerniera_tekno:     { antaUnica: 204, doppiaAnta: 408 }
    },

    // ════════════════════════════════════════════════════════════════
    // CHIUDIPORTA
    // ════════════════════════════════════════════════════════════════
    chiudiporta: {
        aVista: {
            leva_110kg:   215,
            slitta_110kg: 352,
            slitta_170kg: 696,
            maggiorazioneColore: 44  // Nero opaco/Bianco/Bronzo
        },
        aScomparsa: {
            fino110kg: 762,
            fino170kg: 1131
        }
    },

    // ════════════════════════════════════════════════════════════════
    // MANIGLIE E ACCESSORI
    // ════════════════════════════════════════════════════════════════
    maniglie: {
        // Tekno
        manigliaTekno:  70,
        maniglioneTekno: 226,
        manigliaInternaSynua: 536,  // solo porta a spingere
        // Pomoli esterni
        pomoli: {
            PO05_T_OL:    105,  // Ottone lucido (standard Evolution)
            PO05_T_CS:    158,  // Cromo satinato
            PO05_T_CL:    200,  // Cromo lucido
            PO02_T_OL_TZ: 106   // Girevole, PVD
        },
        // Kit per cambio finitura
        kitInternoTondo:   { OL: 0, CS: 36, CL: 36, VP: 160, VL: 208, VS: 190 },
        kitEsternoTondo:   { OL: 0, CS: 36, CL: 36, VP: 160, VL: 208, VS: 190 },
        kitEsternoQuadrato:{ OL: 90, CS: 90, CL: 105, VP: 240, VL: 312, VS: 286 },
        // Pomolino limitatore
        pomoliniLimitatori: {
            tondo: { OL: 0, CS: 158, CL: 200 },
            quadro: { OL: 0, CS: 30, CL: 34 }
        },
        // Maniglioni grandi (per Tekno rasomuro esterno)
        jumbo: {
            interno_300: { VP: 1089, VL: 1239, VS: 1149 },
            interno_600: { VP: 1388, VL: 1538, VS: 1448 },
            esterno_300: { VP: 1076, VL: 1226, VS: 1136 },
            esterno_600: { VP: 1505, VL: 1655, VS: 1565 }
        },
        // Battenti decorativi
        battenti: {
            anello_OL_TZ: 274,
            leone_OL_TZ:  330
        }
    },

    // ════════════════════════════════════════════════════════════════
    // SISTEMA ARCKEY (Serratura Elettronica)
    // ════════════════════════════════════════════════════════════════
    arckey: {
        accessoriWireless: {
            lettoreRFID:          { prezzo: 625, lettoreNascosto: 130 },
            tastieraTouch:        { prezzo: 841, lettoreNascosto: 130 },
            tastieraTouchImpronta:{ prezzo: 1951, lettoreNascosto: 130 },
            tastieraRetroill:     272,
            tastieraTouchBase:    548,
            lettoreImpronta:      1438,
            gateway:              856,
            lettoreRFIDnascosto:  301,
            segnaleStatoPorta:    291,
            alimentatoreRete:     199,
            chiaveTrasponder:     62,
            tesseraOikosCard:     17,
            kit3AdminCards:       102
        },
        chiudiportaMotorizzato: {
            tekno_110kg: 4432   // Solo Luce 0/1
        }
    },

    // ════════════════════════════════════════════════════════════════
    // CORNICI E IMBOTTI
    // ════════════════════════════════════════════════════════════════
    cornici: {
        // Kit cornici Tekno 90×10mm: vedi pag. 142 listino
        imbotti: {
            // Altezza 1: 230+230+115 cm | Altezza 2: 300+300+150 cm
            altezza1: {
                mogano_tanganica: { larg20: 600, larg30: 780 },
                rovere_noce:      { larg20: 759, larg30: 925 },
                laccato_bianco:   { larg20: 600, larg30: 780 },
                laccato_ral:      { larg20: 600, larg30: 780 },
                ogniCmLarghPiu:   18
            },
            altezza2: {
                mogano_tanganica: { larg20: 706, larg30: 914 },
                rovere_noce:      { larg20: 895, larg30: 1085 },
                laccato_bianco:   { larg20: 706, larg30: 914 },
                laccato_ral:      { larg20: 706, larg30: 914 },
                ogniCmLarghPiu:   20
            },
            countryLine: {
                altezza1: { okoume_tinta: { larg20: 665, larg30: 870 }, okoume_laccato: { larg20: 696, larg30: 917 } },
                altezza2: { okoume_tinta: { larg20: 803, larg30: 1040 }, okoume_laccato: { larg20: 839, larg30: 1094 } }
            }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // IMBALLO (prezzi netti)
    // ════════════════════════════════════════════════════════════════
    imballo: {
        pluriball: 0,  // Compreso
        cartone: {
            antaUnica:  { 0: 34, 1: 38, 2: 44, 5: 49, 6: 54 },
            doppiaAnta: { 3: 54, 4: 70, 7: 86, 8: 103 }
        },
        paletta: {
            antaUnica: { 0: 38, 1: 38, 2: 38, 5: 38, 6: 38 },
            note: "Max 6 porte per paletta"
        },
        cassaLegno: {
            antaUnica:  { 0: 212, 1: 227, 2: 260, 5: 274, 6: 303 },
            doppiaAnta: { 3: 315, 4: 372, 7: 468, 8: 536 }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // TRASPORTO (contributo con consegna diretta OIKOS)
    // ════════════════════════════════════════════════════════════════
    trasporto: {
        consegnaDiretta: {
            // Prezzi per regione - anta unica
            LOMBARDIA: {
                antaUnica:  { 0: 62, 1: 62, 2: 74, 5: 71, 6: 96 },
                doppiaAnta: { 3: 102, 4: 124, 7: 155, 8: 186 }
            },
            VENETO_FRIULI: {
                antaUnica:  { 0: 56, 1: 56, 2: 67, 5: 72, 6: 81 },
                doppiaAnta: { 3: 87, 4: 112, 7: 140, 8: 166 }
            },
            VE_TV_PN: {
                antaUnica:  { 0: 48, 1: 48, 2: 57, 5: 62, 6: 69 },
                doppiaAnta: { 3: 76, 4: 98, 7: 123, 8: 148 }
            },
            TRENTINO: {
                antaUnica:  { 0: 62, 1: 62, 2: 74, 5: 71, 6: 96 },
                doppiaAnta: { 3: 102, 4: 124, 7: 155, 8: 186 }
            },
            EMILIA_ROMAGNA: {
                antaUnica:  { 0: 62, 1: 62, 2: 74, 5: 71, 6: 96 },
                doppiaAnta: { 3: 102, 4: 124, 7: 155, 8: 186 }
            },
            PIEMONTE: {
                antaUnica:  { 0: 74, 1: 74, 2: 89, 5: 97, 6: 106 },
                doppiaAnta: { 3: 114, 4: 149, 7: 186, 8: 224 }
            },
            TOSCANA: {
                antaUnica:  { 0: 74, 1: 74, 2: 89, 5: 97, 6: 106 },
                doppiaAnta: { 3: 114, 4: 149, 7: 186, 8: 224 }
            },
            LAZIO: {
                antaUnica:  { 0: 96, 1: 96, 2: 114, 5: 124, 6: 134 },
                doppiaAnta: { 3: 148, 4: 194, 7: 242, 8: 291 }
            },
            CAMPANIA: {
                antaUnica:  { 0: 115, 1: 115, 2: 138, 5: 150, 6: 168 },
                doppiaAnta: { 3: 177, 4: 232, 7: 290, 8: 349 }
            }
        },
        corriere: {
            LIGURIA:        { antaUnica: { 0: 206, 1: 206, 2: 222, 5: 292, 6: 314 } },
            PUGLIA:         { antaUnica: { 0: 192, 1: 192, 2: 216, 5: 267, 6: 286 } },
            ABRUZZO_MOLISE: { antaUnica: { 0: 192, 1: 192, 2: 216, 5: 267, 6: 286 } },
            CALABRIA:       { antaUnica: { 0: 206, 1: 206, 2: 222, 5: 292, 6: 314 } },
            SICILIA:        { antaUnica: { 0: 218, 1: 218, 2: 238, 5: 318, 6: 342 } },
            SARDEGNA:       { antaUnica: { 0: 218, 1: 218, 2: 238, 5: 318, 6: 342 } }
        }
    },

    // ════════════════════════════════════════════════════════════════
    // MATERIALI POSA (per TT)
    // ════════════════════════════════════════════════════════════════
    materialiPosa: {
        schiuma_PU_750ml:   31,
        barrieraVapore_6mt: 26,
        nastroMultifunzione: 72,  // 2 conf. da 5.6mt
        nastroPrecompresso: 24,   // conf. da 13mt
        butileFluido_290ml: 23
    },

    // ════════════════════════════════════════════════════════════════
    // KIT PLUS (condizioni climatiche aggressive)
    // ════════════════════════════════════════════════════════════════
    kitPlus: {
        antaEvolution: 368,
        pomoloAcciaioInox: 76,
        maniglione_MAC20S: 227,
        maniglione_MAC21S: 328
    },

    // ════════════════════════════════════════════════════════════════
    // SISTEMI UNIFICAZIONE CHIAVI
    // ════════════════════════════════════════════════════════════════
    sistemiChiavi: {
        KA: { prezzo: 50, note: "Chiavi uguali - ogni serratura stessa chiave" },
        KC: { prezzo: 70, note: "Cilindro centrale - ogni chiave propria + 1 comune" },
        MK: { prezzo: 70, note: "Chiave maestra - ogni chiave propria + maestra apre tutte" },
        chiaveMaestra: 72,
        chiaveEmergenza: 72
    },

    // ════════════════════════════════════════════════════════════════
    // TEMPI DI CONSEGNA
    // ════════════════════════════════════════════════════════════════
    tempiConsegna: {
        arancio: { settimane: "5 giorni", elementi: "Accessori, cornici, maniglie" },
        verde:   { settimane: "3 settimane", elementi: "Porta standard" },
        giallo:  { settimane: "7 settimane", elementi: "Porta con elementi speciali" },
        bianco:  { settimane: "11 settimane", elementi: "A preventivo" }
    }
};


// ════════════════════════════════════════════════════════════════
// FUNZIONI DI CALCOLO
// ════════════════════════════════════════════════════════════════

/**
 * Determina la luce corretta in base alle dimensioni LNP
 * @param {number} larghezza - Larghezza LNP in mm
 * @param {number} altezza - Altezza LNP in mm
 * @param {string} linea - Chiave linea (es. "EVOLUTION_3", "TEKNO")
 * @returns {number|null} Numero luce (0-8) o null se fuori range
 */
function determinaLuceOikos(larghezza, altezza, linea) {
    const db = OIKOS_DATABASE_2025;
    const lineaData = db.linee[linea];
    if (!lineaData) return null;

    const luciDisponibili = Object.keys(lineaData.prezzi).map(Number).sort((a, b) => a - b);

    for (const luce of luciDisponibili) {
        const dim = db.luci[luce];
        if (dim && larghezza <= dim.L && altezza <= dim.H) {
            return luce;
        }
    }
    return null; // Fuori range
}

/**
 * Calcola il prezzo completo di una porta blindata OIKOS
 * @param {Object} config - Configurazione porta
 * @returns {Object} Dettaglio prezzi con listino e netto
 */
function calcolaPrezzoOikos(config) {
    const db = OIKOS_DATABASE_2025;
    const {
        linea,              // es. "EVOLUTION_3", "TEKNO"
        luce,               // numero luce (0-6)
        rivestimentoInt,    // { linea, essenza, modello } oppure prezzo diretto
        rivestimentoEst,    // idem
        coloreTelaio,       // "RAL_8022", "polveri", "evergreen", "future", "liquido"
        cilindro,           // "SEKUR" o "BASIC"
        // Opzionali
        controtelaio,       // true/false (per Evolution; Project/Tekno usano telaio)
        kitTermico,         // "1.2" o "1" (se richiesto)
        kitAcustico,        // true/false
        kitMose,            // true/false
        kitDam,             // true/false
        vetro,              // { modello, tipo: "trasparente"|"sabbiato" }
        accessori           // array di chiavi da serrature/optional
    } = config;

    const lineaData = db.linee[linea];
    if (!lineaData) return { errore: `Linea "${linea}" non trovata` };

    const dettaglio = {};
    let totaleListino = 0;

    // 1. Prezzo base porta
    const prezzoBase = lineaData.prezzi[luce];
    if (prezzoBase === undefined) return { errore: `Luce ${luce} non disponibile per ${linea}` };
    dettaglio.portaBase = prezzoBase;
    totaleListino += prezzoBase;

    // 2. Controtelaio / Telaio
    if (lineaData.telaio && lineaData.telaio[luce] !== undefined) {
        // Project e Tekno: telaio separato
        dettaglio.telaio = lineaData.telaio[luce];
        totaleListino += dettaglio.telaio;
    } else if (lineaData.telaioTT && lineaData.telaioTT[luce] !== undefined) {
        // Tekno 3TT: telaio taglio termico
        dettaglio.telaioTT = lineaData.telaioTT[luce];
        totaleListino += dettaglio.telaioTT;
    } else if (controtelaio !== false) {
        // Evolution: controtelaio
        const ctPrezzi = lineaData.controtelaio4Lati || db.controtelaio.evolution;
        if (ctPrezzi && ctPrezzi[luce] !== undefined) {
            dettaglio.controtelaio = ctPrezzi[luce];
            totaleListino += dettaglio.controtelaio;
        }
    }

    // 3. Kit materiali posa (TT)
    if (lineaData.kitMaterialiPosa) {
        dettaglio.kitMaterialiPosa = lineaData.kitMaterialiPosa;
        totaleListino += dettaglio.kitMaterialiPosa;
    }

    // 4. Cilindro
    if (cilindro && db.cilindri[cilindro]) {
        dettaglio.cilindro = db.cilindri[cilindro].prezzo;
        totaleListino += dettaglio.cilindro;
    }

    // 5. Rivestimento interno (prezzo per lato)
    if (typeof rivestimentoInt === 'number') {
        dettaglio.rivestimentoInt = rivestimentoInt;
        totaleListino += rivestimentoInt;
    }

    // 6. Rivestimento esterno (prezzo per lato)
    if (typeof rivestimentoEst === 'number') {
        dettaglio.rivestimentoEst = rivestimentoEst;
        totaleListino += rivestimentoEst;
    }

    // 7. Colore telaio
    if (coloreTelaio) {
        // Check se la linea ha colori telaio specifici per luce (doppia, TT)
        if (lineaData.coloriTelaio && lineaData.coloriTelaio[coloreTelaio]) {
            const ct = lineaData.coloriTelaio[coloreTelaio];
            dettaglio.coloreTelaio = typeof ct === 'object' ? (ct[luce] || 0) : ct;
        } else if (lineaData.coloriTelaioTT && lineaData.coloriTelaioTT[coloreTelaio] !== undefined) {
            dettaglio.coloreTelaio = lineaData.coloriTelaioTT[coloreTelaio];
        } else {
            const std = db.coloriTelaio.standard[coloreTelaio];
            dettaglio.coloreTelaio = std ? std.prezzo : 0;
        }
        totaleListino += dettaglio.coloreTelaio;
    }

    // 8. Kit termico
    if (kitTermico && lineaData.prestazioni && lineaData.prestazioni.termica) {
        const kitKey = `kit_${kitTermico.toString().replace('.', '_')}`;
        const kitPrezzi = lineaData.prestazioni.termica[kitKey];
        if (kitPrezzi && kitPrezzi[luce] !== undefined) {
            dettaglio.kitTermico = kitPrezzi[luce];
            totaleListino += dettaglio.kitTermico;
        }
    }

    // 9. Kit acustico
    if (kitAcustico && lineaData.prestazioni && lineaData.prestazioni.acustica && lineaData.prestazioni.acustica.prezzo) {
        dettaglio.kitAcustico = lineaData.prestazioni.acustica.prezzo;
        totaleListino += dettaglio.kitAcustico;
    }

    // 10. Kit Mose / Dam
    if (kitMose && lineaData.kitMose && lineaData.kitMose[luce] !== undefined) {
        dettaglio.kitMose = lineaData.kitMose[luce];
        totaleListino += dettaglio.kitMose;
    }
    if (kitDam && lineaData.kitDam && lineaData.kitDam[luce] !== undefined) {
        dettaglio.kitDam = lineaData.kitDam[luce];
        totaleListino += dettaglio.kitDam;
    }

    // 11. Vetro blindato
    if (vetro && vetro.modello) {
        const vetroData = db.vetriBlindat.modelli[vetro.modello];
        if (vetroData) {
            const tipo = vetro.tipo || 'trasparente';
            dettaglio.vetro = vetroData[tipo] || 0;
            totaleListino += dettaglio.vetro;
        }
    }

    // Calcolo netto
    const netto = Math.round(totaleListino * db.info.moltiplicatoreNetto * 100) / 100;

    return {
        linea: lineaData.nome,
        luce: luce,
        dettaglio: dettaglio,
        totaleListino: Math.round(totaleListino * 100) / 100,
        scontoComposto: db.info.scontoComposto,
        totaleNetto: netto
    };
}

/**
 * Calcola il trasporto OIKOS per Lombardia
 * @param {number} luce - Numero luce
 * @param {string} tipologia - "antaUnica" o "doppiaAnta"
 * @returns {number} Costo trasporto
 */
function calcolaTrasportoOikos(luce, tipologia = 'antaUnica') {
    const lombardia = OIKOS_DATABASE_2025.trasporto.consegnaDiretta.LOMBARDIA;
    const prezzi = lombardia[tipologia];
    return prezzi ? (prezzi[luce] || 0) : 0;
}

/**
 * Restituisce tutte le linee disponibili con info base
 * @returns {Array} Lista linee con nome, classe, prezzi minimi
 */
function getLineeOikos() {
    const db = OIKOS_DATABASE_2025;
    return Object.entries(db.linee).map(([key, linea]) => ({
        key: key,
        nome: linea.nome,
        classe: linea.classe,
        versione: linea.versione,
        tipologia: linea.tipologia,
        prezzoMinimo: Math.min(...Object.values(linea.prezzi)),
        luciDisponibili: Object.keys(linea.prezzi).map(Number)
    }));
}


// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
    window.OIKOS_DATABASE_2025 = OIKOS_DATABASE_2025;
    window.calcolaPrezzoOikos = calcolaPrezzoOikos;
    window.determinaLuceOikos = determinaLuceOikos;
    window.calcolaTrasportoOikos = calcolaTrasportoOikos;
    window.getLineeOikos = getLineeOikos;
    console.log('📦 OIKOS DATABASE 2025 v1.0.0 caricato - Porte Blindate EVO 2025');
}
