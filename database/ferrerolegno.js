// ═══════════════════════════════════════════════════════════════════════════
// 🚪 FERREROLEGNO 2025 - LINEA REPLICA - Database Completo
// Fonte: Listino prezzi 1 Aprile 2025
// Sconto installatore: 50%
// Versione: 2.1.0 - COMPLETA con tutte le tipologie + mapping finiture corretto
// ═══════════════════════════════════════════════════════════════════════════

const FERREROLEGNO_REPLICA_2025 = {
    version: '2.1.0',
    info: {
        fornitore: "FerreroLegno S.p.A.",
        linea: "REPLICA",
        validita: "2025-04-01",
        sconto: 0.50,
        ivaEsclusa: true,
        trasportoEscluso: true
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // COLLEZIONI DISPONIBILI (per dropdown)
    // Ordinate come nel configuratore ufficiale
    // ═══════════════════════════════════════════════════════════════════════
    collezioni: [
        // === VENA VERTICALE ===
        { codice: "LISS", nome: "LISS", gruppo: "Vena Verticale" },
        { codice: "LISS_1", nome: "LISS / 1 con filetto in alluminio", gruppo: "Vena Verticale" },
        { codice: "LISS_4", nome: "LISS / 4 con filetti in alluminio", gruppo: "Vena Verticale" },
        { codice: "LISS_90", nome: "LISS / 90 con filetti in alluminio", gruppo: "Vena Verticale" },
        { codice: "LISS_VETRO", nome: "LISS VETRO", gruppo: "Vena Verticale" },
        { codice: "LISS_VETRO_LARGE", nome: "LISS VETRO LARGE", gruppo: "Vena Verticale" },
        
        // === VENA ORIZZONTALE ===
        { codice: "LOGICA", nome: "LOGICA", gruppo: "Vena Orizzontale" },
        { codice: "LOGICA_1", nome: "LOGICA / 1 con filetto in alluminio", gruppo: "Vena Orizzontale" },
        { codice: "LOGICA_4", nome: "LOGICA / 4 con filetti in alluminio", gruppo: "Vena Orizzontale" },
        { codice: "LOGICA_90", nome: "LOGICA / 90 con filetti in alluminio", gruppo: "Vena Orizzontale" },
        { codice: "LOGICA_VETRO", nome: "LOGICA VETRO", gruppo: "Vena Orizzontale" },
        { codice: "TRATTO", nome: "TRATTO", gruppo: "Vena Orizzontale" },
        { codice: "SEGNI", nome: "SEGNI", gruppo: "Vena Orizzontale" },
        
        // === AREA ===
        { codice: "AREA", nome: "AREA", gruppo: "Area" },
        { codice: "AREA_1", nome: "AREA / 1", gruppo: "Area" },
        { codice: "AREA_2", nome: "AREA / 2", gruppo: "Area" },
        { codice: "AREA_2_SIMPLY", nome: "AREA / 2 SIMPLY", gruppo: "Area" },
        { codice: "AREA_31", nome: "AREA / 31", gruppo: "Area" },
        { codice: "AREA_31_SIMPLY", nome: "AREA / 31 SIMPLY", gruppo: "Area" },
        { codice: "AREA_4", nome: "AREA / 4 con filetti in alluminio", gruppo: "Area" },
        
        // === FORMA ===
        { codice: "FORMA_2", nome: "FORMA / 2", gruppo: "Forma" },
        { codice: "FORMA_3", nome: "FORMA / 3", gruppo: "Forma" },
        { codice: "FORMA_5", nome: "FORMA / 5", gruppo: "Forma" },
        
        // === FOLD ===
        { codice: "FOLD", nome: "FOLD", gruppo: "Fold" }
    ],
    
    // ═══════════════════════════════════════════════════════════════════════
    // FINITURE DISPONIBILI PER COLLEZIONE
    // Mappatura esatta dal listino ufficiale
    // ═══════════════════════════════════════════════════════════════════════
    finiturePerCollezione: {
        // LISS e varianti: TUTTE le finiture
        LISS: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
               'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
               'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        LISS_1: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        LISS_4: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        LISS_90: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                  'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                  'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        LISS_VETRO: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                     'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                     'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        LISS_VETRO_LARGE: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                           'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                           'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino', 'noce'],
        
        // LOGICA e varianti: NO Bianco/Grigio/Lino/Noce semplici
        LOGICA: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'rovere_alba'],
        LOGICA_1: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                   'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                   'rovere_gold', 'rovere_alba'],
        LOGICA_4: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                   'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                   'rovere_gold', 'rovere_alba'],
        LOGICA_90: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                    'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                    'rovere_gold', 'rovere_alba'],
        LOGICA_VETRO: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                       'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                       'rovere_gold', 'rovere_alba'],
        
        // TRATTO / SEGNI: NO Grafis, NO Bianco/Grigio/Lino/Noce semplici
        TRATTO: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                 'materic_bianco', 'materic_greige', 'materic_noir', 'rovere_gold', 'rovere_alba'],
        SEGNI: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
                'materic_bianco', 'materic_greige', 'materic_noir', 'rovere_gold', 'rovere_alba'],
        
        // AREA e varianti: NO Ontario Platino, NO Rovere Alba
        AREA: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
               'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
               'rovere_gold', 'bianco', 'noce'],
        AREA_1: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'bianco', 'noce'],
        AREA_2: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'bianco', 'noce'],
        AREA_2_SIMPLY: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                        'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                        'rovere_gold', 'bianco', 'noce'],
        AREA_31: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                  'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                  'rovere_gold', 'bianco', 'noce'],
        AREA_31_SIMPLY: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                         'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                         'rovere_gold', 'bianco', 'noce'],
        AREA_4: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce',
                 'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
                 'rovere_gold', 'bianco', 'noce'],
        
        // FORMA: SOLO Bianco, Noce, Rovere Gold
        FORMA_2: ['bianco', 'noce', 'rovere_gold'],
        FORMA_3: ['bianco', 'noce', 'rovere_gold'],
        FORMA_5: ['bianco', 'noce'],  // Rovere Gold non disponibile per Forma/5
        
        // FOLD: dipende dal modello anta scelto
        FOLD: ['ontario_perla', 'ontario_polvere', 'ontario_cuoio', 'ontario_cenere', 'ontario_sabbia', 'ontario_noce', 'ontario_platino',
               'grafis_bianco', 'grafis_beige', 'grafis_moka', 'materic_bianco', 'materic_greige', 'materic_noir',
               'rovere_gold', 'rovere_alba', 'bianco', 'grigio', 'lino']
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TUTTE LE FINITURE (anagrafica completa)
    // ═══════════════════════════════════════════════════════════════════════
    finiture: {
        // Altri
        bianco: { codice: "F33", nome: "Bianco", gruppo: "Altri" },
        noce: { codice: "F34", nome: "Noce", gruppo: "Altri" },
        lino: { codice: "F102", nome: "Lino", gruppo: "Altri" },
        grigio: { codice: "F103", nome: "Grigio", gruppo: "Altri" },
        
        // Grafis
        grafis_bianco: { codice: "F26", nome: "Grafis Bianco", gruppo: "Grafis" },
        grafis_beige: { codice: "F27", nome: "Grafis Beige", gruppo: "Grafis" },
        grafis_moka: { codice: "F28", nome: "Grafis Moka", gruppo: "Grafis" },
        
        // Materic
        materic_bianco: { codice: "F29", nome: "Materic Bianco", gruppo: "Materic" },
        materic_greige: { codice: "F30", nome: "Materic Greige", gruppo: "Materic" },
        materic_noir: { codice: "F31", nome: "Materic Noir", gruppo: "Materic" },
        
        // Ontario
        ontario_perla: { codice: "F20", nome: "Ontario Perla", gruppo: "Ontario" },
        ontario_cenere: { codice: "F21", nome: "Ontario Cenere", gruppo: "Ontario" },
        ontario_sabbia: { codice: "F22", nome: "Ontario Sabbia", gruppo: "Ontario" },
        ontario_polvere: { codice: "F23", nome: "Ontario Polvere", gruppo: "Ontario" },
        ontario_cuoio: { codice: "F24", nome: "Ontario Cuoio", gruppo: "Ontario" },
        ontario_noce: { codice: "F25", nome: "Ontario Noce", gruppo: "Ontario" },
        ontario_platino: { codice: "F100", nome: "Ontario Platino", gruppo: "Ontario" },
        
        // Rovere
        rovere_gold: { codice: "F32", nome: "Rovere Gold", gruppo: "Rovere" },
        rovere_alba: { codice: "F101", nome: "Rovere Alba", gruppo: "Rovere" }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // PREZZI ANTE - Raggruppati per gruppi di finitura
    // bianco_grigio_lino = Bianco/Grigio/Lino
    // noce = Noce
    // grafis = Grafis Bianco/Beige/Moka
    // materic_ontario = Materic + Ontario + Rovere Gold + Rovere Alba
    // ═══════════════════════════════════════════════════════════════════════
    prezziAnte: {
        // === LISS (base) ===
        LISS: {
            bianco_grigio_lino: 173,
            noce: 168,
            grafis: 205,
            materic_ontario: 230
        },
        
        // === LISS / 1 ===
        LISS_1: {
            bianco_grigio_lino: 245,
            noce: 240,
            grafis: 277,
            materic_ontario: 302
        },
        
        // === LISS / 4 ===
        LISS_4: {
            bianco_grigio_lino: 296,
            noce: 291,
            grafis: 328,
            materic_ontario: 353
        },
        
        // === LISS / 90 ===
        LISS_90: {
            bianco_grigio_lino: 296,
            noce: 291,
            grafis: 328,
            materic_ontario: 353
        },
        
        // === LISS VETRO (cristallo satinato/trasparente) ===
        LISS_VETRO: {
            satinato: {
                bianco_grigio_lino: 427,
                noce: 422,
                grafis: 459,
                materic_ontario: 484
            },
            fronte_retro: {
                bianco_grigio_lino: 469,
                noce: 464,
                grafis: 501,
                materic_ontario: 526
            },
            point: {
                bianco_grigio_lino: 615,
                noce: 610,
                grafis: 647,
                materic_ontario: 672
            },
            strip: {
                bianco_grigio_lino: 615,
                noce: 610,
                grafis: 647,
                materic_ontario: 672
            }
        },
        
        // === LISS VETRO LARGE ===
        LISS_VETRO_LARGE: {
            satinato: {
                bianco_grigio_lino: 636,
                noce: 621,
                grafis: 634,
                materic_ontario: 662
            },
            fronte_retro: {
                bianco_grigio_lino: 684,
                noce: 669,
                grafis: 682,
                materic_ontario: 710
            },
            decorato: {
                bianco_grigio_lino: 693,
                noce: 678,
                grafis: 691,
                materic_ontario: 719
            },
            graffio: {
                bianco_grigio_lino: 782,
                noce: 767,
                grafis: 780,
                materic_ontario: 808
            },
            bolla: {
                bianco_grigio_lino: 782,
                noce: 767,
                grafis: 780,
                materic_ontario: 808
            },
            point: {
                bianco_grigio_lino: 887,
                noce: 872,
                grafis: 885,
                materic_ontario: 913
            },
            strip: {
                bianco_grigio_lino: 887,
                noce: 872,
                grafis: 885,
                materic_ontario: 913
            },
            textil: {
                bianco_grigio_lino: 887,
                noce: 872,
                grafis: 885,
                materic_ontario: 913
            },
            chillout: {
                bianco_grigio_lino: 887,
                noce: 872,
                grafis: 885,
                materic_ontario: 913
            }
        },
        
        // === LOGICA (base) ===
        LOGICA: {
            grafis: 223,
            materic_ontario: 249
        },
        
        // === LOGICA / 1 ===
        LOGICA_1: {
            grafis: 295,
            materic_ontario: 321
        },
        
        // === LOGICA / 4 ===
        LOGICA_4: {
            grafis: 346,
            materic_ontario: 372
        },
        
        // === LOGICA / 90 ===
        LOGICA_90: {
            grafis: 346,
            materic_ontario: 372
        },
        
        // === LOGICA VETRO ===
        LOGICA_VETRO: {
            satinato: {
                grafis: 477,
                materic_ontario: 503
            },
            fronte_retro: {
                grafis: 519,
                materic_ontario: 545
            },
            point: {
                grafis: 665,
                materic_ontario: 691
            },
            strip: {
                grafis: 665,
                materic_ontario: 691
            }
        },
        
        // === TRATTO ===
        TRATTO: {
            materic_ontario: 394
        },
        
        // === SEGNI ===
        SEGNI: {
            materic_ontario: 394
        },
        
        // === AREA (cieca) ===
        AREA: {
            bianco: 431,
            noce: 419,
            grafis: 433,
            materic_ontario: 449
        },
        
        // === AREA / 1 ===
        AREA_1: {
            bianco: 374,
            noce: 362,
            grafis: 376,
            materic_ontario: 392
        },
        
        // === AREA / 2 (cieca) ===
        AREA_2: {
            cieca: {
                bianco: 431,
                noce: 419,
                grafis: 433,
                materic_ontario: 449
            },
            satinato: {
                bianco: 533,
                noce: 521,
                grafis: 535,
                materic_ontario: 551
            },
            fronte_retro: {
                bianco: 581,
                noce: 569,
                grafis: 583,
                materic_ontario: 599
            },
            decorato_2filetti: {
                bianco: 615,
                noce: 603,
                grafis: 617,
                materic_ontario: 633
            },
            decorato_perimetrale: {
                bianco: 615,
                noce: 603,
                grafis: 617,
                materic_ontario: 633
            },
            bolla: {
                bianco: 689,
                noce: 677,
                grafis: 691,
                materic_ontario: 707
            },
            graffio: {
                bianco: 689,
                noce: 677,
                grafis: 691,
                materic_ontario: 707
            },
            point: {
                bianco: 794,
                noce: 782,
                grafis: 796,
                materic_ontario: 812
            },
            strip: {
                bianco: 794,
                noce: 782,
                grafis: 796,
                materic_ontario: 812
            },
            textil: {
                bianco: 794,
                noce: 782,
                grafis: 796,
                materic_ontario: 812
            },
            flutes: {
                bianco: 794,
                noce: 782,
                grafis: 796,
                materic_ontario: 812
            },
            chillout: {
                bianco: 794,
                noce: 782,
                grafis: 796,
                materic_ontario: 812
            }
        },
        
        // === AREA / 2 SIMPLY ===
        AREA_2_SIMPLY: {
            cieca: {
                bianco: 541,
                noce: 529,
                grafis: 543,
                materic_ontario: 559
            }
        },
        
        // === AREA / 4 ===
        AREA_4: {
            bianco: 541,
            noce: 529,
            grafis: 543,
            materic_ontario: 559
        },
        
        // === AREA / 31 ===
        AREA_31: {
            cieca: {
                bianco: 475,
                noce: 461,
                grafis: 475,
                materic_ontario: 490
            },
            satinato: {
                bianco: 567,
                noce: 553,
                grafis: 567,
                materic_ontario: 582
            },
            fronte_retro: {
                bianco: 617,
                noce: 603,
                grafis: 617,
                materic_ontario: 632
            },
            decorato: {
                bianco: 644,
                noce: 630,
                grafis: 644,
                materic_ontario: 659
            },
            bolla: {
                bianco: 723,
                noce: 709,
                grafis: 723,
                materic_ontario: 738
            },
            graffio: {
                bianco: 723,
                noce: 709,
                grafis: 723,
                materic_ontario: 738
            },
            point: {
                bianco: 835,
                noce: 821,
                grafis: 835,
                materic_ontario: 850
            },
            strip: {
                bianco: 835,
                noce: 821,
                grafis: 835,
                materic_ontario: 850
            },
            textil: {
                bianco: 835,
                noce: 821,
                grafis: 835,
                materic_ontario: 850
            },
            flutes: {
                bianco: 723,
                noce: 709,
                grafis: 723,
                materic_ontario: 738
            },
            chillout: {
                bianco: 835,
                noce: 821,
                grafis: 835,
                materic_ontario: 850
            }
        },
        
        // === AREA / 31 SIMPLY ===
        AREA_31_SIMPLY: {
            cieca: {
                bianco: 360,
                noce: 351,
                grafis: 398,
                materic_ontario: 414
            },
            satinato: {
                bianco: 506,
                noce: 497,
                grafis: 544,
                materic_ontario: 560
            },
            fronte_retro: {
                bianco: 556,
                noce: 547,
                grafis: 594,
                materic_ontario: 610
            },
            decorato: {
                bianco: 583,
                noce: 574,
                grafis: 621,
                materic_ontario: 637
            },
            bolla: {
                bianco: 662,
                noce: 653,
                grafis: 700,
                materic_ontario: 716
            },
            graffio: {
                bianco: 662,
                noce: 653,
                grafis: 700,
                materic_ontario: 716
            },
            point: {
                bianco: 774,
                noce: 765,
                grafis: 812,
                materic_ontario: 828
            },
            strip: {
                bianco: 774,
                noce: 765,
                grafis: 812,
                materic_ontario: 828
            },
            textil: {
                bianco: 774,
                noce: 765,
                grafis: 812,
                materic_ontario: 828
            },
            flutes: {
                bianco: 662,
                noce: 653,
                grafis: 700,
                materic_ontario: 716
            },
            chillout: {
                bianco: 774,
                noce: 765,
                grafis: 812,
                materic_ontario: 828
            }
        },
        
        // === FORMA / 2 ===
        FORMA_2: {
            cieca: {
                bianco: 375,
                noce: 364,
                rovere_gold: 439
            },
            satinato: {
                bianco: 491,
                noce: 480,
                rovere_gold: 555
            },
            fronte_retro: {
                bianco: 541,
                noce: 530,
                rovere_gold: 605
            },
            decorato_perimetrale: {
                bianco: 572,
                noce: 561,
                rovere_gold: 636
            },
            decorato_2filetti: {
                bianco: 572,
                noce: 561,
                rovere_gold: 636
            }
        },
        
        // === FORMA / 3 ===
        FORMA_3: {
            cieca: {
                bianco: 418,
                noce: 406,
                rovere_gold: 464
            },
            satinato: {
                bianco: 573,
                noce: 561,
                rovere_gold: 619
            },
            fronte_retro: {
                bianco: 606,
                noce: 594,
                rovere_gold: 652
            },
            decorato: {
                bianco: 639,
                noce: 627,
                rovere_gold: 685
            }
        },
        
        // === FORMA / 5 ===
        FORMA_5: {
            cieca: {
                bianco: 603,
                noce: 586
            },
            satinato: {
                bianco: 758,
                noce: 741
            },
            fronte_retro: {
                bianco: 804,
                noce: 787
            },
            decorato: {
                bianco: 824,
                noce: 807
            }
        },
        
        // === FOLD ===
        FOLD: {
            LISS: {
                bianco_grigio_lino: 173,
                grafis: 205,
                materic_ontario: 230
            },
            LOGICA: {
                grafis: 223,
                materic_ontario: 249
            },
            TRATTO: {
                materic_ontario: 394
            },
            SEGNI: {
                materic_ontario: 394
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // PREZZI TELAI
    // ═══════════════════════════════════════════════════════════════════════
    prezziTelai: {
        FLAT: {
            pivot: {
                bianco_grigio_lino: 308,
                grafis_bianco: 314,
                materic_ontario: 314,
                rovere_gold: 314
            },
            scomparsa: {
                bianco_grigio_lino: 333,
                grafis_bianco: 339,
                materic_ontario: 339,
                rovere_gold: 339
            }
        },
        GENIUS_ELEVA: {
            anuba: {
                bianco_grigio_lino: 161,
                noce: 157,
                grafis: 193,
                materic_ontario: 208,
                rovere_gold: 208
            },
            pivot: {
                bianco_grigio_lino: 191,
                noce: 187,
                grafis: 223,
                rovere_gold: 238
            },
            scomparsa: {
                bianco_grigio_lino: null, // non disponibile per alcuni
                noce: null,
                grafis: null,
                materic_ontario: null,
                rovere_gold: null
            }
        },
        OVAL_ELEVA: {
            anuba: {
                bianco_grigio_lino: 182,
                noce: 177,
                grafis: 212,
                rovere_gold: 227
            },
            pivot: {
                bianco_grigio_lino: 212,
                noce: 207,
                grafis: 242,
                rovere_gold: 257
            }
        },
        FOLD_FLAT: {
            bianco_grigio_lino: 353,
            grafis: 359,
            materic_ontario: 359,
            rovere_gold: 359
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGGIORAZIONI DIMENSIONI
    // ═══════════════════════════════════════════════════════════════════════
    maggiorazioniDimensioni: {
        larghezza: {
            standard: [600, 650, 700, 750, 800, 850, 900],
            fuoriStandard: {
                range: [[300, 550], [950, 1200]],
                maggiorazione: 0.50 // +50%
            }
        },
        altezza: {
            standard: [2000, 2100],
            fuoriStandard_15: {
                range: [[1950, 1990], [2010, 2090], [2110, 2200]],
                maggiorazione: 0.15 // +15%
            },
            fuoriStandard_50: {
                range: [[1400, 1900], [2250, 2400]],
                maggiorazione: 0.50 // +50%
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGGIORAZIONI VERSIONI
    // ═══════════════════════════════════════════════════════════════════════
    maggiorazioniVersioni: {
        cappucci_anuba_ottone_bianco_nero: 23,
        serratura_yale: 55,
        serratura_yale_passepartout: 95,
        specchio_sicurezza_4mm: 500,
        extrachiaro: 72,
        extrachiaro_large: 102,
        flat_coprifilo_complanare: 45,
        
        // Scorrevoli
        rolling_scrighi: {
            con_serratura_maniglia: 150,
            no_serratura_maniglia: 130,
            no_serratura_no_maniglia: 110,
            maniglia_quadra: 15,
            serratura_yale: 55
        },
        rolling_scrighi_essential_syntesis: {
            con_serratura_maniglia: 225,
            no_serratura_maniglia: 205,
            no_serratura_no_maniglia: 185
        },
        rolling_prima: {
            con_serratura_maniglia: 545,
            no_serratura_maniglia: 465,
            no_serratura_no_maniglia: 440,
            maniglia_quadra: 15,
            esclusione_cassonetto: -295,
            fermo_monolaterale: 60,
            fermo_bilaterale: 90
        },
        rolling_magic: {
            no_serratura_maniglia: 510,
            no_serratura_no_maniglia: 485,
            maniglia_quadra: 15,
            maniglia_rettangolare: 30
        },
        
        // Pieghevoli
        modula: {
            ferramenta: 420,
            serratura_yale: 55,
            serratura_yale_passepartout: 95
        },
        indue: {
            ferramenta_serratura_maniglia: 445,
            maniglia_quadra: 15
        },
        fold_90: {
            ferramenta_anta: 570,
            ferramenta_telaio: 120
        },
        maniglia_wave: {
            senza_foro: 110,
            nottolino: 130
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGGIORAZIONI TELAI PER SPESSORE
    // ═══════════════════════════════════════════════════════════════════════
    maggiorazioniSpessore: {
        125: { copertura: [120, 145], maggiorazione: 37 },
        150: { copertura: [146, 169], maggiorazione: 37 }
        // Oltre 169: Telaio + Stipite
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FUNZIONI HELPER
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Ottiene finiture disponibili per una collezione
     * @param {string} codiceCollezione - es. 'LISS', 'LOGICA', 'FORMA_2'
     * @returns {Array} Lista finiture disponibili con dettagli
     */
    getFiniturePer: function(codiceCollezione) {
        const codiciFinitura = this.finiturePerCollezione[codiceCollezione];
        if (!codiciFinitura) return [];
        
        return codiciFinitura.map(codice => {
            const fin = this.finiture[codice];
            return {
                codice: codice,
                nome: fin ? fin.nome : codice,
                codiceProdotto: fin ? fin.codice : null,
                gruppo: fin ? fin.gruppo : null
            };
        });
    },
    
    /**
     * Ottiene finiture raggruppate per una collezione
     * @param {string} codiceCollezione
     * @returns {Object} Finiture raggruppate per gruppo (Ontario, Grafis, etc.)
     */
    getFinitureRaggruppatePer: function(codiceCollezione) {
        const finiture = this.getFiniturePer(codiceCollezione);
        const gruppi = {};
        
        finiture.forEach(f => {
            const gruppo = f.gruppo || 'Altri';
            if (!gruppi[gruppo]) gruppi[gruppo] = [];
            gruppi[gruppo].push(f);
        });
        
        return gruppi;
    },
    
    /**
     * Verifica se una finitura è disponibile per una collezione
     */
    isFinituraDisponibile: function(codiceCollezione, codiceFinitura) {
        const disponibili = this.finiturePerCollezione[codiceCollezione];
        return disponibili ? disponibili.includes(codiceFinitura) : false;
    },
    
    /**
     * Ottiene lista collezioni per dropdown
     */
    getCollezioni: function() {
        return this.collezioni;
    },
    
    /**
     * Ottiene lista collezioni raggruppate
     */
    getCollezioniRaggruppate: function() {
        const gruppi = {};
        this.collezioni.forEach(c => {
            if (!gruppi[c.gruppo]) gruppi[c.gruppo] = [];
            gruppi[c.gruppo].push(c);
        });
        return gruppi;
    },
    
    /**
     * Calcola prezzo anta
     */
    calcolaPrezzoAnta: function(collezione, finitura, variante = null) {
        const prezzi = this.prezziAnte[collezione];
        if (!prezzi) return null;
        
        if (variante && prezzi[variante]) {
            return prezzi[variante][finitura] || null;
        }
        
        return prezzi[finitura] || null;
    },
    
    /**
     * Calcola prezzo completo porta
     */
    calcolaPrezzo: function(config) {
        const {
            collezione,
            finitura,
            varianteVetro = null,
            tipoTelaio = 'GENIUS_ELEVA',
            tipoCerniera = 'anuba',
            larghezza = 800,
            altezza = 2100,
            opzioni = []
        } = config;
        
        let totale = 0;
        const dettaglio = {};
        
        // 1. Prezzo anta
        const prezzoAnta = this.calcolaPrezzoAnta(collezione, finitura, varianteVetro);
        if (prezzoAnta === null) {
            return { errore: `Combinazione non disponibile: ${collezione} - ${finitura}` };
        }
        dettaglio.anta = prezzoAnta;
        totale += prezzoAnta;
        
        // 2. Prezzo telaio
        const telai = this.prezziTelai[tipoTelaio];
        if (telai && telai[tipoCerniera]) {
            const prezzoTelaio = telai[tipoCerniera][finitura] || 
                                 telai[tipoCerniera].materic_ontario || 
                                 Object.values(telai[tipoCerniera])[0];
            if (prezzoTelaio) {
                dettaglio.telaio = prezzoTelaio;
                totale += prezzoTelaio;
            }
        }
        
        // 3. Maggiorazioni dimensioni
        let maggiorazioneDim = 0;
        
        // Larghezza
        if (!this.maggiorazioniDimensioni.larghezza.standard.includes(larghezza)) {
            maggiorazioneDim = 0.50;
        }
        
        // Altezza
        if (!this.maggiorazioniDimensioni.altezza.standard.includes(altezza)) {
            if (altezza >= 1950 && altezza <= 2200 && altezza !== 2000 && altezza !== 2100) {
                maggiorazioneDim = Math.max(maggiorazioneDim, 0.15);
            } else {
                maggiorazioneDim = 0.50;
            }
        }
        
        if (maggiorazioneDim > 0) {
            const maggiorazione = totale * maggiorazioneDim;
            dettaglio.maggiorazioneDimensioni = maggiorazione;
            totale += maggiorazione;
        }
        
        // 4. Opzioni
        opzioni.forEach(opt => {
            if (this.maggiorazioniVersioni[opt]) {
                const val = this.maggiorazioniVersioni[opt];
                if (typeof val === 'number') {
                    dettaglio[opt] = val;
                    totale += val;
                }
            }
        });
        
        return {
            collezione,
            finitura,
            tipoTelaio,
            tipoCerniera,
            dimensioni: `${larghezza}x${altezza}`,
            dettaglio,
            totaleListino: Math.round(totale * 100) / 100,
            sconto: '50%',
            totaleNetto: Math.round(totale * (1 - this.info.sconto) * 100) / 100
        };
    }
};

// Export per test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FERREROLEGNO_REPLICA_2025;
}

// Log al caricamento
if (typeof console !== 'undefined') {
    console.log('✅ FERREROLEGNO_REPLICA_2025 v2.0.0 caricato');
    console.log('   📋 Collezioni:', FERREROLEGNO_REPLICA_2025.collezioni.length);
    console.log('   🎨 Finiture:', Object.keys(FERREROLEGNO_REPLICA_2025.finiture).length);
}
