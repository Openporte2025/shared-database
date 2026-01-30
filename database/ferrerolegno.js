// ═══════════════════════════════════════════════════════════════════════════
// 🚪 FERREROLEGNO 2025 - LINEA ZERO - Database Completo
// Fonte: Listino prezzi 1 Aprile 2025
// Porte filomuro con telaio A_FILO / CONCEPT
// Versione: 1.0.0
// ═══════════════════════════════════════════════════════════════════════════

const FERREROLEGNO_ZERO_2025 = {
    version: '1.1.0',
    info: {
        fornitore: "FerreroLegno S.p.A.",
        linea: "ZERO - Porte Filomuro + FOLD Cross-Linea",
        validita: "2025-04-01",
        sconto: 0.50,
        ivaEsclusa: true,
        trasportoEscluso: true,
        nota: "FOLD è un sistema di apertura disponibile per ZERO, COLLEZIONI FL e REPLICA"
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // COLLEZIONI ZERO
    // ═══════════════════════════════════════════════════════════════════════
    collezioni: [
        // LEGNO/LACCATO
        { codice: "EXIT_ZERO", nome: "Exit Zero", gruppo: "Legno/Laccato", descrizione: "Venatura orizzontale" },
        { codice: "EXITLYNE_ZERO", nome: "Exitlyne Zero", gruppo: "Legno/Laccato", descrizione: "Venatura verticale" },
        { codice: "EQUA_ZERO", nome: "Equa Zero", gruppo: "Legno/Laccato", descrizione: "Con Equa Styla Zero" },
        
        // PANTOGRAFATE
        { codice: "INTAGLIO_ZERO", nome: "Intaglio Zero", gruppo: "Pantografate", varianti: ["/0", "/1", "/2", "/4", "/8", "/10"] },
        { codice: "PLISSE_ZERO", nome: "Plissè Zero", gruppo: "Pantografate", varianti: ["PLISSE", "PLISSE_VARIO"] },
        { codice: "SUITE_ZERO", nome: "Suite Zero", gruppo: "Pantografate", varianti: ["/4", "/6", "/9", "/10", "/21", "/22", "/27", "/29", "/33", "/23"] },
        { codice: "MIXY_ZERO", nome: "Mixy Zero", gruppo: "Pantografate", varianti: ["/1", "/2", "/3", "/7", "/8", "/23", "/24"] },
        { codice: "YNCISA_ZERO", nome: "Yncisa Zero", gruppo: "Pantografate", varianti: ["/0", "/1", "/8", "/70", "SEGNI", "TRATTO", "STYLA", "TARTAN", "ZIG/1", "ZIG/2"] },
        
        // SINTETICHE
        { codice: "LISS_ZERO", nome: "Liss Zero", gruppo: "Sintetiche", descrizione: "Venatura verticale" },
        { codice: "LOGICA_ZERO", nome: "Logica Zero", gruppo: "Sintetiche", descrizione: "Venatura orizzontale" },
        { codice: "TRATTO_ZERO", nome: "Tratto Zero", gruppo: "Sintetiche" },
        { codice: "SEGNI_ZERO", nome: "Segni Zero", gruppo: "Sintetiche" },
        
        // TUTTO VETRO
        { codice: "BASIC_ZERO", nome: "Basic Zero", gruppo: "Vetro", descrizione: "Solo vetro temperato mm 8" },
        { codice: "FRAME_ZERO", nome: "Frame Zero", gruppo: "Vetro", descrizione: "Vetro con profilo perimetrale alluminio" },
        { codice: "PREMIUM_ZERO", nome: "Premium Zero", gruppo: "Vetro", descrizione: "Vetro stratificato mm 3+3" }
    ],
    
    // ═══════════════════════════════════════════════════════════════════════
    // SISTEMI DI APERTURA PIEGHEVOLE (FOLD)
    // FOLD NON è una collezione, ma un SISTEMA che usa ante da altre collezioni!
    // ═══════════════════════════════════════════════════════════════════════
    sistemiFold: {
        descrizione: "FOLD è un sistema di apertura pieghevole disponibile per più linee",
        linee: {
            ZERO: {
                telaio: "A_FILO",
                spessore: 125,
                collezioniCompatibili: ["EXIT_ZERO", "EQUA_ZERO", "PLISSE_ZERO", "YNCISA_ZERO"]
            },
            COLLEZIONI_FL: {
                telaio: "EVOLUTO_ELEVA",
                spessore: [75, 100],
                collezioniCompatibili: ["EXIT", "EXITLYNE", "EQUA", "NOVA", "EQUA_STYLA", "PLISSE", "YNCISA"]
            },
            REPLICA: {
                telaio: "FLAT",
                spessore: [75, 100],
                collezioniCompatibili: ["LISS", "LOGICA", "TRATTO", "SEGNI", "AREA"]
            }
        },
        varianti: ["FOLD_90", "FOLD_180", "MODULA", "INDUE"],
        nota: "Solo apertura complanare a TIRARE con maniglia Wave"
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FINITURE DISPONIBILI
    // ═══════════════════════════════════════════════════════════════════════
    finiture: {
        // Grezzo
        grezzo_prefinito: { codice: "F43", nome: "Grezzo Prefinito", gruppo: "Grezzo" },
        
        // Natural Touch
        noce_natural_touch: { codice: "F1", nome: "Noce Natural Touch", gruppo: "Natural Touch" },
        noce_canaletto: { codice: "F2", nome: "Noce Canaletto", gruppo: "Natural Touch" },
        rovere_natural_touch: { codice: "F3", nome: "Rovere Natural Touch", gruppo: "Natural Touch" },
        
        // Iride
        iride_cipria: { codice: "F12", nome: "Iride Cipria", gruppo: "Iride" },
        iride_foresta: { codice: "F13", nome: "Iride Foresta", gruppo: "Iride" },
        iride_mare: { codice: "F14", nome: "Iride Mare", gruppo: "Iride" },
        iride_duna: { codice: "F15", nome: "Iride Duna", gruppo: "Iride" },
        iride_corda: { codice: "F16", nome: "Iride Corda", gruppo: "Iride" },
        iride_palude: { codice: "F17", nome: "Iride Palude", gruppo: "Iride" },
        iride_bruciato: { codice: "F18", nome: "Iride Bruciato", gruppo: "Iride" },
        iride_ebano: { codice: "F19", nome: "Iride Ebano", gruppo: "Iride" },
        
        // Essenze
        noce_nazionale: { codice: "F8", nome: "Noce Nazionale", gruppo: "Essenze" },
        tanganika: { codice: "F9", nome: "Tanganika", gruppo: "Essenze" },
        blond: { codice: "F10", nome: "Blond", gruppo: "Essenze" },
        
        // Opaco
        opaco_bianco: { codice: "F35", nome: "Bianco", gruppo: "Opaco" },
        opaco_bianco_optical: { codice: "F36", nome: "Bianco Optical", gruppo: "Opaco" },
        opaco_grigio_lux: { codice: "F37", nome: "Grigio Lux", gruppo: "Opaco" },
        opaco_tortora: { codice: "F38", nome: "Tortora", gruppo: "Opaco" },
        opaco_ral_ncs: { codice: "F39", nome: "RAL / NCS", gruppo: "Opaco" },
        
        // ULTRAopaco
        ultra_bianco: { codice: "F49", nome: "ULTRAopaco Bianco", gruppo: "ULTRAopaco" },
        ultra_bianco_optical: { codice: "F50", nome: "ULTRAopaco Bianco Optical", gruppo: "ULTRAopaco" },
        ultra_grigio_lux: { codice: "F51", nome: "ULTRAopaco Grigio Lux", gruppo: "ULTRAopaco" },
        ultra_tortora: { codice: "F52", nome: "ULTRAopaco Tortora", gruppo: "ULTRAopaco" },
        ultra_metallo_light: { codice: "F53", nome: "ULTRAopaco Metallo Light", gruppo: "ULTRAopaco" },
        ultra_metallo_pure: { codice: "F54", nome: "ULTRAopaco Metallo Pure", gruppo: "ULTRAopaco" },
        ultra_metallo_dark: { codice: "F55", nome: "ULTRAopaco Metallo Dark", gruppo: "ULTRAopaco" },
        ultra_laguna_light: { codice: "F56", nome: "ULTRAopaco Laguna Light", gruppo: "ULTRAopaco" },
        ultra_laguna_pure: { codice: "F57", nome: "ULTRAopaco Laguna Pure", gruppo: "ULTRAopaco" },
        ultra_laguna_dark: { codice: "F58", nome: "ULTRAopaco Laguna Dark", gruppo: "ULTRAopaco" },
        ultra_lichene_light: { codice: "F59", nome: "ULTRAopaco Lichene Light", gruppo: "ULTRAopaco" },
        ultra_lichene_pure: { codice: "F60", nome: "ULTRAopaco Lichene Pure", gruppo: "ULTRAopaco" },
        ultra_oliva_light: { codice: "F61", nome: "ULTRAopaco Oliva Light", gruppo: "ULTRAopaco" },
        ultra_oliva_pure: { codice: "F62", nome: "ULTRAopaco Oliva Pure", gruppo: "ULTRAopaco" },
        ultra_oliva_dark: { codice: "F63", nome: "ULTRAopaco Oliva Dark", gruppo: "ULTRAopaco" },
        ultra_ombra_light: { codice: "F64", nome: "ULTRAopaco Ombra Light", gruppo: "ULTRAopaco" },
        ultra_ombra_pure: { codice: "F65", nome: "ULTRAopaco Ombra Pure", gruppo: "ULTRAopaco" },
        ultra_ombra_dark: { codice: "F66", nome: "ULTRAopaco Ombra Dark", gruppo: "ULTRAopaco" },
        ultra_terra_light: { codice: "F67", nome: "ULTRAopaco Terra Light", gruppo: "ULTRAopaco" },
        ultra_terra_pure: { codice: "F68", nome: "ULTRAopaco Terra Pure", gruppo: "ULTRAopaco" },
        ultra_malva_light: { codice: "F69", nome: "ULTRAopaco Malva Light", gruppo: "ULTRAopaco" },
        ultra_malva_pure: { codice: "F70", nome: "ULTRAopaco Malva Pure", gruppo: "ULTRAopaco" },
        ultra_corallo_light: { codice: "F71", nome: "ULTRAopaco Corallo Light", gruppo: "ULTRAopaco" },
        ultra_corallo_pure: { codice: "F72", nome: "ULTRAopaco Corallo Pure", gruppo: "ULTRAopaco" },
        ultra_nero_profondo: { codice: "F73", nome: "ULTRAopaco Nero Profondo", gruppo: "ULTRAopaco" },
        
        // ULTRAlucido
        lucido_bianco: { codice: "F74", nome: "ULTRAlucido Bianco", gruppo: "ULTRAlucido" },
        lucido_bianco_optical: { codice: "F75", nome: "ULTRAlucido Bianco Optical", gruppo: "ULTRAlucido" },
        lucido_grigio_lux: { codice: "F76", nome: "ULTRAlucido Grigio Lux", gruppo: "ULTRAlucido" },
        lucido_tortora: { codice: "F77", nome: "ULTRAlucido Tortora", gruppo: "ULTRAlucido" },
        lucido_cartella: { codice: "F78-98", nome: "ULTRAlucido Cartella Colori", gruppo: "ULTRAlucido" },
        
        // Trame
        trame_bianco: { codice: "F44", nome: "Trame Bianco", gruppo: "Trame" },
        trame_bianco_optical: { codice: "F45", nome: "Trame Bianco Optical", gruppo: "Trame" },
        trame_grigio_lux: { codice: "F46", nome: "Trame Grigio Lux", gruppo: "Trame" },
        trame_tortora: { codice: "F47", nome: "Trame Tortora", gruppo: "Trame" },
        trame_ral_ncs: { codice: "F48", nome: "Trame RAL / NCS", gruppo: "Trame" },
        
        // Laminati / Sintetiche
        laminato_grigio: { codice: "F103", nome: "Grigio", gruppo: "Laminato" },
        laminato_lino: { codice: "F102", nome: "Lino", gruppo: "Laminato" },
        laminato_noce: { codice: "F34", nome: "Noce", gruppo: "Laminato" },
        ontario_perla: { codice: "F20", nome: "Ontario Perla", gruppo: "Ontario" },
        ontario_cenere: { codice: "F21", nome: "Ontario Cenere", gruppo: "Ontario" },
        ontario_sabbia: { codice: "F22", nome: "Ontario Sabbia", gruppo: "Ontario" },
        ontario_polvere: { codice: "F23", nome: "Ontario Polvere", gruppo: "Ontario" },
        ontario_cuoio: { codice: "F24", nome: "Ontario Cuoio", gruppo: "Ontario" },
        ontario_noce: { codice: "F25", nome: "Ontario Noce", gruppo: "Ontario" },
        ontario_platino: { codice: "F100", nome: "Ontario Platino", gruppo: "Ontario" },
        materic_bianco: { codice: "F29", nome: "Materic Bianco", gruppo: "Materic" },
        materic_greige: { codice: "F30", nome: "Materic Greige", gruppo: "Materic" },
        materic_noir: { codice: "F31", nome: "Materic Noir", gruppo: "Materic" },
        rovere_gold: { codice: "F32", nome: "Rovere Gold", gruppo: "Rovere" },
        rovere_alba: { codice: "F101", nome: "Rovere Alba", gruppo: "Rovere" },
        
        // Laccati Metallizzati (per telaio Concept)
        laccato_bianco: { codice: "LB", nome: "Laccato Bianco", gruppo: "Laccato" },
        laccato_bianco_optical: { codice: "LBO", nome: "Laccato Bianco Optical", gruppo: "Laccato" },
        laccato_grigio_lux: { codice: "LGL", nome: "Laccato Grigio Lux", gruppo: "Laccato" },
        laccato_tortora: { codice: "LT", nome: "Laccato Tortora", gruppo: "Laccato" },
        laccato_nero: { codice: "LN", nome: "Laccato Nero", gruppo: "Laccato" },
        laccato_ghisa: { codice: "LG", nome: "Laccato Ghisa", gruppo: "Laccato" },
        metallizzato_vulcano: { codice: "MV", nome: "Metallizzato Vulcano", gruppo: "Metallizzato" },
        metallizzato_platino: { codice: "MP", nome: "Metallizzato Platino", gruppo: "Metallizzato" },
        metallizzato_grigio_perla: { codice: "MGP", nome: "Metallizzato Grigio Perla", gruppo: "Metallizzato" },
        cromo_satinato: { codice: "CS", nome: "Cromo Satinato", gruppo: "Metallizzato" }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FINITURE PER COLLEZIONE
    // ═══════════════════════════════════════════════════════════════════════
    finiturePerCollezione: {
        // EXIT ZERO: Grezzo + Iride + Natural Touch + ULTRAlucido
        EXIT_ZERO: ['grezzo_prefinito', 'iride_cipria', 'iride_foresta', 'iride_mare', 'iride_duna', 
                    'iride_corda', 'iride_palude', 'iride_bruciato', 'iride_ebano',
                    'noce_natural_touch', 'noce_canaletto', 'rovere_natural_touch',
                    'lucido_bianco', 'lucido_bianco_optical', 'lucido_grigio_lux', 'lucido_tortora', 'lucido_cartella'],
        
        // EXITLYNE ZERO: Iride + Natural Touch (NO Grezzo, NO ULTRAlucido)
        EXITLYNE_ZERO: ['iride_cipria', 'iride_foresta', 'iride_mare', 'iride_duna', 
                        'iride_corda', 'iride_palude', 'iride_bruciato', 'iride_ebano',
                        'noce_natural_touch', 'noce_canaletto', 'rovere_natural_touch'],
        
        // EQUA ZERO: Trame + Opaco + ULTRAopaco
        EQUA_ZERO: ['trame_bianco', 'trame_bianco_optical', 'trame_grigio_lux', 'trame_tortora', 'trame_ral_ncs',
                    'opaco_bianco', 'opaco_bianco_optical', 'opaco_grigio_lux', 'opaco_tortora', 'opaco_ral_ncs',
                    'ultra_bianco', 'ultra_bianco_optical', 'ultra_grigio_lux', 'ultra_tortora',
                    'ultra_metallo_light', 'ultra_metallo_pure', 'ultra_metallo_dark',
                    'ultra_laguna_light', 'ultra_laguna_pure', 'ultra_laguna_dark',
                    'ultra_lichene_light', 'ultra_lichene_pure',
                    'ultra_oliva_light', 'ultra_oliva_pure', 'ultra_oliva_dark',
                    'ultra_ombra_light', 'ultra_ombra_pure', 'ultra_ombra_dark',
                    'ultra_terra_light', 'ultra_terra_pure',
                    'ultra_malva_light', 'ultra_malva_pure',
                    'ultra_corallo_light', 'ultra_corallo_pure', 'ultra_nero_profondo'],
        
        // INTAGLIO ZERO: Essenze + Iride + Trame + Opaco + ULTRAopaco
        INTAGLIO_ZERO: ['blond', 'noce_nazionale', 'tanganika',
                        'iride_cipria', 'iride_foresta', 'iride_mare', 'iride_duna', 
                        'iride_corda', 'iride_palude', 'iride_bruciato', 'iride_ebano',
                        'trame_bianco', 'trame_bianco_optical', 'trame_grigio_lux', 'trame_tortora', 'trame_ral_ncs',
                        'opaco_bianco', 'opaco_bianco_optical', 'opaco_grigio_lux', 'opaco_tortora', 'opaco_ral_ncs',
                        'ultra_bianco', 'ultra_bianco_optical', 'ultra_grigio_lux', 'ultra_tortora',
                        'ultra_metallo_light', 'ultra_metallo_pure', 'ultra_metallo_dark',
                        'ultra_laguna_light', 'ultra_laguna_pure', 'ultra_laguna_dark',
                        'ultra_lichene_light', 'ultra_lichene_pure',
                        'ultra_oliva_light', 'ultra_oliva_pure', 'ultra_oliva_dark',
                        'ultra_ombra_light', 'ultra_ombra_pure', 'ultra_ombra_dark',
                        'ultra_terra_light', 'ultra_terra_pure',
                        'ultra_malva_light', 'ultra_malva_pure',
                        'ultra_corallo_light', 'ultra_corallo_pure', 'ultra_nero_profondo'],
        
        // PLISSE/MIXY/YNCISA ZERO: Opaco + ULTRAopaco
        PLISSE_ZERO: ['opaco_bianco', 'opaco_bianco_optical', 'opaco_grigio_lux', 'opaco_tortora', 'opaco_ral_ncs',
                      'ultra_bianco', 'ultra_bianco_optical', 'ultra_grigio_lux', 'ultra_tortora',
                      'ultra_metallo_light', 'ultra_metallo_pure', 'ultra_metallo_dark',
                      'ultra_laguna_light', 'ultra_laguna_pure', 'ultra_laguna_dark',
                      'ultra_lichene_light', 'ultra_lichene_pure',
                      'ultra_oliva_light', 'ultra_oliva_pure', 'ultra_oliva_dark',
                      'ultra_ombra_light', 'ultra_ombra_pure', 'ultra_ombra_dark',
                      'ultra_terra_light', 'ultra_terra_pure',
                      'ultra_malva_light', 'ultra_malva_pure',
                      'ultra_corallo_light', 'ultra_corallo_pure', 'ultra_nero_profondo'],
        
        // SUITE ZERO: Opaco + ULTRAopaco + Trame (solo 21/22/27)
        SUITE_ZERO: ['opaco_bianco', 'opaco_bianco_optical', 'opaco_grigio_lux', 'opaco_tortora', 'opaco_ral_ncs',
                     'ultra_bianco', 'ultra_bianco_optical', 'ultra_grigio_lux', 'ultra_tortora',
                     'ultra_laguna_light', 'ultra_laguna_pure', 'ultra_laguna_dark',
                     'ultra_lichene_light', 'ultra_lichene_pure',
                     'ultra_oliva_light', 'ultra_oliva_pure', 'ultra_oliva_dark',
                     'ultra_ombra_light', 'ultra_ombra_pure', 'ultra_ombra_dark',
                     'ultra_terra_light', 'ultra_terra_pure',
                     'ultra_malva_light', 'ultra_malva_pure',
                     'ultra_corallo_light', 'ultra_corallo_pure', 'ultra_nero_profondo',
                     'trame_bianco', 'trame_bianco_optical', 'trame_grigio_lux', 'trame_tortora', 'trame_ral_ncs'],
        
        // LISS ZERO: Ontario + Materic + Rovere + Grigio + Lino
        LISS_ZERO: ['laminato_grigio', 'laminato_lino',
                    'ontario_perla', 'ontario_cenere', 'ontario_sabbia', 'ontario_polvere', 
                    'ontario_cuoio', 'ontario_noce', 'ontario_platino',
                    'materic_bianco', 'materic_greige', 'materic_noir',
                    'rovere_gold', 'rovere_alba'],
        
        // LOGICA/TRATTO/SEGNI ZERO: Ontario + Materic + Rovere
        LOGICA_ZERO: ['ontario_perla', 'ontario_cenere', 'ontario_sabbia', 'ontario_polvere', 
                      'ontario_cuoio', 'ontario_noce', 'ontario_platino',
                      'materic_bianco', 'materic_greige', 'materic_noir',
                      'rovere_gold', 'rovere_alba']
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // PREZZI ANTE ZERO (senza telaio, con ferramenta cromo satinato)
    // Cerniere a scomparsa + Serratura Magnetica
    // ═══════════════════════════════════════════════════════════════════════
    prezziAnte: {
        EXIT_ZERO: {
            grezzo_prefinito: 327,
            iride: 587,
            natural_touch_rovere: 595,
            natural_touch_noce: 605,  // Noce / Noce Canaletto
            lucido_base: 906,         // Bianco/Bianco Optical/Grigio Lux/Tortora
            lucido_cartella: 1105
        },
        
        EXITLYNE_ZERO: {
            iride: 568,
            natural_touch_rovere: 576,
            natural_touch_noce: 586   // Noce / Noce Canaletto
        },
        
        EQUA_ZERO: {
            trame_base: 557,          // Bianco/Grigio Lux/Tortora/Bianco Optical
            trame_ral: 612,
            opaco_base: 396,          // Bianco/Bianco Optical/Grigio Lux/Tortora
            opaco_ral: 452,
            ultra_base: 416,          // Bianco/Bianco Optical/Grigio Lux/Tortora
            ultra_cartella: 472
        },
        
        // Per INTAGLIO/PLISSE/SUITE/MIXY/YNCISA: consultare listino CollezioniFL
        // I prezzi base sono gli stessi, più maggiorazioni ZERO
        
        PLISSE_ZERO: {
            opaco_base: 423,
            opaco_ral: 480,
            ultra_base: 443,
            ultra_cartella: 500
        },
        
        MIXY_ZERO: {
            opaco_base: 367,
            opaco_ral: 423,
            ultra_base: 387,
            ultra_cartella: 443
        },
        
        YNCISA_ZERO: {
            opaco_base: 414,
            opaco_ral: 469,
            ultra_base: 434,
            ultra_cartella: 489
        },
        
        SUITE_ZERO: {
            // Suite/4
            suite_4_opaco_base: 403,
            suite_4_opaco_ral: 458,
            suite_4_ultra_base: 423,
            suite_4_ultra_cartella: 478,
            // Suite/21/22/27 (con trame disponibili)
            suite_21_opaco_base: 423,
            suite_21_trame_base: 553,
            suite_21_trame_ral: 609
        },
        
        // LISS ZERO (finitura sintetica)
        LISS_ZERO: {
            grigio_lino: 249,         // Grigio / Lino
            ontario_materic: 249,     // Ontario / Materic
            rovere: 269               // Rovere Gold / Alba
        },
        
        LOGICA_ZERO: {
            ontario_materic: 249,
            rovere: 269
        },
        
        TRATTO_ZERO: {
            ontario_materic: 249,
            rovere: 269
        },
        
        SEGNI_ZERO: {
            ontario_materic: 249,
            rovere: 269
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // PREZZI TELAI A_FILO / CONCEPT
    // In alluminio con contropiastra cromo satinato
    // ═══════════════════════════════════════════════════════════════════════
    prezziTelai: {
        A_FILO: {
            mm_70: 506,
            mm_100: 540,
            mm_125: 582
        },
        CONCEPT: {
            mm_100: 677
        },
        // BASIC ZERO / FRAME ZERO (solo battente)
        A_FILO_BASIC: {
            mm_70: 591,
            mm_100: 625,
            mm_125: 667
        },
        A_FILO_FRAME: {
            mm_70: 591,
            mm_100: 625,
            mm_125: 667
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGGIORAZIONI
    // ═══════════════════════════════════════════════════════════════════════
    maggiorazioni: {
        telai: {
            doppio: 327,
            muratura: 27  // N°10 zanche + rete porta intonaco
        },
        
        profilo_concept: {
            // Laccato Bianco/Bianco Optical/Nero/Grigio Lux/Tortora/Ghisa
            laccato: {
                h_1400_2200: 80,
                h_2201_2450: 90,
                h_2451_2700: 100,
                h_2701_2900: 110
            },
            // Metallizzato Vulcano/Platino/Grigio Perla
            metallizzato: {
                h_1400_2200: 110,
                h_2201_2450: 125,
                h_2451_2700: 140,
                h_2701_2900: 155
            }
        },
        
        dimensioni: {
            larghezza: {
                standard: [600, 650, 700, 750, 800, 850, 900],
                fuori_standard_50: { 
                    range: [[500, 550], [950, 1000]], 
                    maggiorazione: 0.50 
                },
                fuori_standard_50_scorrevole: { 
                    range: [[1050, 1200]], 
                    maggiorazione: 0.50,
                    nota: "Solo ante scorrevoli"
                }
            },
            altezza: {
                standard: [2000, 2100],
                fuori_standard_15: { 
                    range: [[1950, 2200]], 
                    escluso: [2000, 2100],
                    maggiorazione: 0.15 
                },
                fuori_standard_50: { 
                    range: [[1400, 1949], [2201, 2400]], 
                    maggiorazione: 0.50,
                    nota_grezzo: "Grezzo: Anta +25%, Telaio +50%"
                },
                fuori_standard_55: { 
                    range: [[2401, 2600]], 
                    maggiorazione: 0.55 
                },
                fuori_standard_60: { 
                    range: [[2601, 2900]], 
                    maggiorazione: 0.60 
                }
            }
        },
        
        versioni: {
            specchio_sicurezza_4mm: 500,
            serratura_yale: 55,
            serratura_yale_passepartout: 95,
            
            // Scorrevoli Essential/Syntesis
            scorrevole_essential_syntesis: {
                con_serratura_maniglia: 225,
                no_serratura_maniglia: 205,
                no_serratura_no_maniglia: 185,
                maniglia_quadra: 15,
                serratura_yale: 55,
                maniglia_vaschetta: 100
            },
            
            // Magnetica Touch
            magnetica_touch: {
                singola_senza_maniglia: 100,
                doppia_senza_maniglia: 200,
                singola_maniglia_lui: 264,
                doppia_maniglia_lui: 364,
                singola_premi_apri: 204,
                doppia_premi_apri: 304,
                singola_maniglia_wave: 210,
                doppia_maniglia_wave: 310,
                singola_pomax_tonda: 264,
                doppia_pomax_tonda: 364,
                singola_pomax_quadra: 264,
                doppia_pomax_quadra: 364
            }
        },
        
        maniglie: {
            wave_senza_foro: 110,
            wave_nottolino: 130
        },
        
        fermi_ammortizzati: {
            monolaterale: 85,
            bilaterale: 120
        },
        
        push_pull_syntesis: 50
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FOLD - SISTEMA PIEGHEVOLE CROSS-LINEA
    // Prezzi ferramenta e telai per ogni linea
    // ═══════════════════════════════════════════════════════════════════════
    foldPrezzi: {
        // FOLD su ZERO (Telaio A_FILO mm 125)
        ZERO: {
            telaio: "A_FILO",
            spessore: 125,
            prezzoTelaio: 582,
            FOLD_90: {
                ferramenta_anta: 570,
                ferramenta_telaio: 120
            },
            FOLD_180: {
                ferramenta_anta: 590,
                ferramenta_telaio: 120
            },
            telaio_doppio: 327,
            telaio_muratura: 27,
            maniglia_wave_senza_foro: 110,
            maniglia_wave_nottolino: 130
        },
        
        // FOLD su COLLEZIONI FL (Telaio EVOLUTO ELEVA mm 75/100)
        COLLEZIONI_FL: {
            telaio: "EVOLUTO_ELEVA",
            spessore: [75, 100],
            prezziTelaio: {
                // Per finitura
                blond_tanganika: 351,
                noce_nazionale: 398,
                grezzo_prefinito: -25, // Sconto su base bianco
                opaco_base: 439,
                opaco_ral: 538,
                ultra_base: 459,
                ultra_cartella: 516,
                trame_base: 554,
                trame_ral: 652,
                iride: 518,
                natural_touch_rovere: 524,
                natural_touch_noce: 534,
                lucido_base: 737,
                lucido_cartella: 882
            },
            FOLD_90: {
                ferramenta_anta: 570,
                ferramenta_telaio: 120
            },
            FOLD_180: {
                ferramenta_anta: 590,
                ferramenta_telaio: 120
            },
            maggiorazione_spessore: {
                mm_125: 40,
                mm_150: 40
            },
            telaio_doppio: 135,
            maniglia_wave_senza_foro: 110,
            maniglia_wave_nottolino: 130
        },
        
        // FOLD su REPLICA (Telaio FLAT mm 75/100)
        REPLICA: {
            telaio: "FLAT",
            spessore: [75, 100],
            prezziTelaio: {
                bianco_grigio_lino: 353,
                grafis: 359,
                materic_ontario: 359
            },
            FOLD_90: {
                ferramenta_anta: 570,
                ferramenta_telaio: 120
            },
            FOLD_180: {
                ferramenta_anta: 590,
                ferramenta_telaio: 120
            },
            telaio_doppio: 85,
            maniglia_wave_senza_foro: 110,
            maniglia_wave_nottolino: 130
        }
    },
    
    // Prezzi ante per FOLD (stessi prezzi delle collezioni base)
    foldPrezziAnte: {
        // ZERO
        EXIT_ZERO: { grezzo: 327, iride: 587, natural_touch_rovere: 595, natural_touch_noce: 605, lucido_base: 906, lucido_cartella: 1105 },
        EQUA_ZERO: { opaco_base: 396, opaco_ral: 452, ultra_base: 416, ultra_cartella: 472, trame_base: 557, trame_ral: 612 },
        PLISSE_ZERO: { opaco_base: 423, opaco_ral: 480, ultra_base: 443, ultra_cartella: 500 },
        YNCISA_ZERO: { opaco_base: 414, opaco_ral: 469, ultra_base: 434, ultra_cartella: 489 },
        
        // COLLEZIONI FL
        EXIT: { grezzo: 327, iride: 552, natural_touch_rovere: 582, natural_touch_noce: 592, lucido_base: 906, lucido_cartella: 1105 },
        EXITLYNE: { iride: 533, natural_touch_rovere: 563, natural_touch_noce: 573 },
        EQUA: { blond_tanganika: 436, noce_nazionale: 491, opaco_base: 361, opaco_ral: 417, ultra_base: 381, ultra_cartella: 437, trame_base: 522, trame_ral: 577 },
        NOVA: { blond_tanganika: 266, noce_nazionale: 362 },
        EQUA_STYLA: { opaco_base: 520, opaco_ral: 576, ultra_base: 540, ultra_cartella: 596 },
        PLISSE: { opaco_base: 423, opaco_ral: 480, ultra_base: 443, ultra_cartella: 500 },
        YNCISA: { opaco_base: 414, opaco_ral: 469, ultra_base: 434, ultra_cartella: 489 },
        
        // REPLICA
        LISS: { bianco_grigio_lino: 173, noce: 168, grafis: 205, materic_ontario: 230 },
        LOGICA: { grafis: 223, materic_ontario: 249 },
        TRATTO: { materic_ontario: 394 },
        SEGNI: { materic_ontario: 394 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // BASIC ZERO (solo vetro temperato mm 8)
    // Solo ante singole versione a spingere
    // ═══════════════════════════════════════════════════════════════════════
    basicZero: {
        // Cristalli filtranti mm 8
        filtranti: {
            // Altezze 1400-2249
            h_1400_2249: {
                trasparente_bianco: 855,
                satinato_bianco: 918,
                trasparente_grigio_bronzo: 918,
                satinato_grigio_bronzo: 991,
                trasparente_extrachiaro: 991,
                lucido_nero: 1114,
                riflettente: 1114,
                satinato_extrachiaro: 1175,
                satinato_nero: 1234,
                fronte_retro_extrachiaro: 1234,
                segni_satinato_bianco: 1175,
                segni_satinato_extrachiaro: 1234,
                point_strip: 1537,
                bit_03_textil_chillout: 1537
            },
            // Altezze 2250-2449
            h_2250_2449: {
                trasparente_bianco: 876,
                satinato_bianco: 944,
                trasparente_grigio_bronzo: 944,
                satinato_grigio_bronzo: 1025,
                trasparente_extrachiaro: 1025,
                lucido_nero: 1158,
                riflettente: 1158,
                satinato_extrachiaro: 1226,
                satinato_nero: 1291,
                fronte_retro_extrachiaro: 1291,
                segni_satinato_bianco: 1226,
                segni_satinato_extrachiaro: 1291,
                point_strip: 1609,
                bit_03_textil_chillout: 1609
            },
            // Altezze 2450-2700
            h_2450_2700: {
                trasparente_bianco: 896,
                satinato_bianco: 978,
                trasparente_grigio_bronzo: 978,
                satinato_grigio_bronzo: 1069,
                trasparente_extrachiaro: 1069,
                lucido_nero: 1216,
                riflettente: 1216,
                satinato_extrachiaro: 1297,
                satinato_nero: 1375,
                fronte_retro_extrachiaro: 1375,
                segni_satinato_bianco: 1297,
                segni_satinato_extrachiaro: 1375,
                point_strip: 1751,
                bit_03_textil_chillout: 1751
            }
        },
        maniglie: {
            ponte_alluminio: 140,
            ponte_laccato: 150,
            ponte_metallizzato: 150,
            vitra_senza_foro_cromo: 215,
            vitra_senza_foro_laccato: 225,
            vitra_yale_cromo: 325,
            vitra_yale_laccato: 335,
            vitra_nottolino_cromo: 360,
            vitra_nottolino_laccato: 370,
            pomax_tonda: 164,
            pomax_quadra: 164,
            pomolo_1_cromo: 164,
            pomolo_1_laccato: 180,
            pomolo_2: 164,
            pomolo_3: 98,
            oliva: 79,
            cilindro_yale_sfuso: 112,
            nottolino_sfuso: 44
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FRAME ZERO (vetro con profilo perimetrale alluminio)
    // Cristallo temperato mm 6 o stratificato mm 3+3
    // ═══════════════════════════════════════════════════════════════════════
    frameZero: {
        // Cristalli filtranti mm 6
        filtranti: {
            // Altezze 1400-2249, Larghezza 600-850
            h_1400_2249_L_600_850: {
                trasparente_bianco: 780,
                satinato_bianco: 896,
                trasparente_grigio_bronzo: 896,
                satinato_grigio_bronzo: 964,
                trasparente_extrachiaro: 964,
                lucido_nero: 1069,
                riflettente: 1069,
                flutes_trasparente: 1069,
                satinato_extrachiaro: 1159,
                satinato_nero: 1250,
                fronte_retro: 1159,
                segni_satinato_bianco: 1159,
                segni_satinato_extrachiaro: 1250,
                point_strip_bit03_chillout_textil: 1569
            },
            // Altezze 1400-2249, Larghezza 900-1000
            h_1400_2249_L_900_1000: {
                trasparente_bianco: 851,
                satinato_bianco: 950,
                trasparente_grigio_bronzo: 950,
                satinato_grigio_bronzo: 1029,
                trasparente_extrachiaro: 1029,
                lucido_nero: 1170,
                riflettente: 1170,
                flutes_trasparente: 1170,
                satinato_extrachiaro: 1267,
                satinato_nero: 1367,
                fronte_retro: 1267,
                segni_satinato_bianco: 1267,
                segni_satinato_extrachiaro: 1367,
                point_strip_bit03_chillout_textil: 1741
            },
            // Altezze 1400-2249, Larghezza 1050-1200
            h_1400_2249_L_1050_1200: {
                trasparente_bianco: 904,
                satinato_bianco: 1023,
                trasparente_grigio_bronzo: 1023,
                satinato_grigio_bronzo: 1117,
                trasparente_extrachiaro: 1117,
                lucido_nero: 1284,
                riflettente: 1284,
                flutes_trasparente: 1284,
                satinato_extrachiaro: 1403,
                satinato_nero: 1522,
                fronte_retro: 1403,
                segni_satinato_bianco: 1403,
                segni_satinato_extrachiaro: 1522,
                point_strip_bit03_chillout_textil: 1972
            }
        },
        // Cristalli coprenti mm 3+3
        coprenti: {
            h_1400_2249_L_600_850: {
                milky: 896,
                lucido_colori: 1166,  // Black/Antracite/Ginger/Red/Beige
                specchio_classic: 1166,
                satinato_colori: 1166,
                lucido_pearl_blue: 1368,
                specchio_smoke_bronze: 1368,
                lucido_white: 1368,
                bicolore: 1368
            },
            h_1400_2249_L_900_1000: {
                milky: 950,
                lucido_colori: 1267,
                specchio_classic: 1267,
                satinato_colori: 1267,
                lucido_pearl_blue: 1504,
                specchio_smoke_bronze: 1504,
                lucido_white: 1504,
                bicolore: 1504
            },
            h_1400_2249_L_1050_1200: {
                milky: 1023,
                lucido_colori: 1403,
                specchio_classic: 1403,
                satinato_colori: 1403,
                lucido_pearl_blue: 1687,
                specchio_smoke_bronze: 1687,
                lucido_white: 1687,
                bicolore: 1687
            }
        },
        finitura_profilo: {
            bianco_optical_nero: {
                h_1400_2200: 160,
                h_2250_2400: 170,
                h_2450_2700: 180,
                h_2750_2900: 190
            }
        },
        maniglie: {
            wave_senza_foro_cromo: 273,
            wave_senza_foro_laccato: 283,
            wave_nottolino_cromo: 273,
            wave_nottolino_laccato: 283,
            wave_yale_cromo: 273,
            wave_yale_laccato: 283,
            vitra_senza_foro_grigio: 235,
            vitra_senza_foro_laccato: 245,
            vitra_yale_grigio: 345,
            vitra_yale_laccato: 355,
            vitra_nottolino_grigio: 385,
            vitra_nottolino_laccato: 395
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // BLYNDO (rivestimento portoncino blindato)
    // ═══════════════════════════════════════════════════════════════════════
    blyndo: {
        // Larghezza 200-1190, Altezza 1900-2400
        EXIT: {
            grezzo_prefinito: 312,
            natural_touch: 524,  // Noce/Noce Canaletto/Rovere
            lucido: 829,
            iride: 562
        },
        EXITLYNE: {
            natural_touch: 524,
            iride: 562
        },
        EQUA: {
            opaco: 403,
            ultra: 424,
            trame: 562
        },
        doppio: "prezzo singolo x2",
        nota: "Solo con angolari in legno"
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // BEST SELLER ZERO (prezzi completi anta + telaio)
    // Dimensioni standard 600-900 x 2000-2100, Telaio A_Filo 100mm
    // ═══════════════════════════════════════════════════════════════════════
    bestSeller: {
        EXIT_ZERO_grezzo: { battente: 867, battente_125: 909, scorrevole_senza_serratura: 532, scorrevole_con_serratura: 552 },
        EQUA_ZERO_opaco_base: { battente: 936, battente_125: 978, scorrevole_senza_serratura: 601, scorrevole_con_serratura: 621 },
        EQUA_ZERO_ultra_base: { battente: 956, battente_125: 998, scorrevole_senza_serratura: 621, scorrevole_con_serratura: 641 },
        EQUA_ZERO_trame_base: { battente: 1097, battente_125: 1139, scorrevole_senza_serratura: 762, scorrevole_con_serratura: 782 },
        EXITLYNE_ZERO_iride: { battente: 1108, battente_125: 1150, scorrevole_senza_serratura: 773, scorrevole_con_serratura: 793 },
        EXITLYNE_ZERO_noce: { battente: 1126, battente_125: 1168, scorrevole_senza_serratura: 791, scorrevole_con_serratura: 811 },
        EXITLYNE_ZERO_rovere: { battente: 1116, battente_125: 1158, scorrevole_senza_serratura: 781, scorrevole_con_serratura: 801 },
        MIXY_ZERO_opaco_base: { battente: 907, battente_125: 949, scorrevole_senza_serratura: 572, scorrevole_con_serratura: 592 },
        MIXY_ZERO_ultra_base: { battente: 927, battente_125: 969, scorrevole_senza_serratura: 592, scorrevole_con_serratura: 612 },
        YNCISA_ZERO_opaco_base: { battente: 954, battente_125: 996, scorrevole_senza_serratura: 619, scorrevole_con_serratura: 639 },
        YNCISA_ZERO_ultra_base: { battente: 974, battente_125: 1016, scorrevole_senza_serratura: 639, scorrevole_con_serratura: 659 },
        SUITE_21_opaco_base: { battente: 963, battente_125: 1005, scorrevole_senza_serratura: 628, scorrevole_con_serratura: 648 },
        SUITE_21_trame_base: { battente: 1093, battente_125: 1135, scorrevole_senza_serratura: 758, scorrevole_con_serratura: 778 },
        LOGICA_ZERO_materic_ontario: { battente: 789, battente_125: 831, scorrevole_senza_serratura: 454, scorrevole_con_serratura: 474 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // FUNZIONI HELPER
    // ═══════════════════════════════════════════════════════════════════════
    
    getCollezioni: function() {
        return this.collezioni;
    },
    
    getCollezioniRaggruppatePer: function() {
        const gruppi = {};
        this.collezioni.forEach(c => {
            if (!gruppi[c.gruppo]) gruppi[c.gruppo] = [];
            gruppi[c.gruppo].push(c);
        });
        return gruppi;
    },
    
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
    
    isFinituraDisponibile: function(codiceCollezione, codiceFinitura) {
        const disponibili = this.finiturePerCollezione[codiceCollezione];
        return disponibili ? disponibili.includes(codiceFinitura) : false;
    },
    
    calcolaMaggiorazioneDimensioni: function(larghezza, altezza, isGrezzo = false) {
        let maggiorazione = 0;
        
        // Larghezza
        if ((larghezza >= 500 && larghezza <= 550) || (larghezza >= 950 && larghezza <= 1200)) {
            maggiorazione += 0.50;
        }
        
        // Altezza
        if (altezza >= 1950 && altezza <= 2200 && altezza !== 2000 && altezza !== 2100) {
            maggiorazione += 0.15;
        } else if ((altezza >= 1400 && altezza <= 1949) || (altezza >= 2201 && altezza <= 2400)) {
            maggiorazione += 0.50;
        } else if (altezza >= 2401 && altezza <= 2600) {
            maggiorazione += 0.55;
        } else if (altezza >= 2601 && altezza <= 2900) {
            maggiorazione += 0.60;
        }
        
        return maggiorazione;
    },
    
    /**
     * Calcola prezzo sistema FOLD
     * @param {string} linea - 'ZERO', 'COLLEZIONI_FL', 'REPLICA'
     * @param {string} tipoFold - 'FOLD_90' o 'FOLD_180'
     * @param {string} collezione - es. 'EXIT_ZERO', 'EQUA', 'LISS'
     * @param {string} finitura - chiave finitura
     * @param {boolean} doppia - porta doppia
     * @returns {Object} dettaglio prezzi
     */
    calcolaPrezzoFold: function(linea, tipoFold, collezione, finitura, doppia = false) {
        const fold = this.foldPrezzi[linea];
        const ante = this.foldPrezziAnte[collezione];
        
        if (!fold || !ante) {
            return { errore: "Linea o collezione non trovata" };
        }
        
        const prezzoAnta = ante[finitura] || 0;
        const ferramenta = fold[tipoFold];
        
        let totaleAnta = prezzoAnta + ferramenta.ferramenta_anta;
        let totaleTelaio = (typeof fold.prezzoTelaio === 'number' ? fold.prezzoTelaio : 0) + ferramenta.ferramenta_telaio;
        
        if (doppia) {
            totaleAnta = totaleAnta * 2 + 60; // +60€ per doppia
            totaleTelaio += fold.telaio_doppio;
        }
        
        const maniglia = fold.maniglia_wave_senza_foro;
        
        return {
            linea: linea,
            tipoFold: tipoFold,
            collezione: collezione,
            finitura: finitura,
            doppia: doppia,
            dettaglio: {
                prezzoAntaBase: prezzoAnta,
                ferramenta_anta: ferramenta.ferramenta_anta,
                ferramenta_telaio: ferramenta.ferramenta_telaio,
                telaio: typeof fold.prezzoTelaio === 'number' ? fold.prezzoTelaio : 'vedi prezziTelaio',
                maniglia_wave: maniglia
            },
            totale: {
                anta: totaleAnta,
                telaio: totaleTelaio,
                maniglia: doppia ? maniglia * 2 : maniglia,
                TOTALE: totaleAnta + totaleTelaio + (doppia ? maniglia * 2 : maniglia)
            }
        };
    }
};

// Export per test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FERREROLEGNO_ZERO_2025;
}

// Log al caricamento
if (typeof console !== 'undefined') {
    console.log('✅ FERREROLEGNO_ZERO_2025 v1.1.0 caricato');
    console.log('   📋 Collezioni:', FERREROLEGNO_ZERO_2025.collezioni.length);
    console.log('   🎨 Finiture:', Object.keys(FERREROLEGNO_ZERO_2025.finiture).length);
    console.log('   🔄 FOLD disponibile per: ZERO, COLLEZIONI FL, REPLICA');
}
