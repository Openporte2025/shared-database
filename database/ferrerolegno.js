const FERREROLEGNO_CONFIG = {
    fornitore: "FerreroLegno S.p.A.",
    validita: "2025-04-01",
    scontoInstallatore: 0.50,
    ivaEsclusa: true,
    trasportoEscluso: true,
    
    // Dimensioni standard
    larghezzeStandard: [600, 650, 700, 750, 800, 850, 900],
    altezzeStandard: [2000, 2100],
    
    // Linee disponibili
    linee: ["COLLEZIONI_FL", "REPLICA", "ZERO"]
};

// =============================================================================
// COLLEZIONI FL - PREZZI ANTE
// =============================================================================

const FERREROLEGNO_COLLEZIONI_FL = {
    
    // EXIT / EXITLYNE
    EXIT: {
nome: "EXIT",
spessore: 44,
tipologia: "tamburata_cristallo",
finiture: {
    "grezzo_prefinito": { cieca: 327, vetro: null },
    "iride": { cieca: 552, vetro: 1063 },
    "natural_touch_rovere": { cieca: 582, vetro: 1095 },
    "natural_touch_noce": { cieca: 592, vetro: 1105 },
    "ultralucido_base": { cieca: 906, vetro: 1451 },
    "ultralucido_cartella": { cieca: 1105, vetro: 1648 }
}
    },
    
    EXITLYNE: {
nome: "EXITLYNE",
spessore: 44,
tipologia: "tamburata_cristallo",
finiture: {
    "iride": { cieca: 533, vetro: 1047 },
    "natural_touch_rovere": { cieca: 563, vetro: 1079 },
    "natural_touch_noce": { cieca: 573, vetro: 1089 }
}
    },
    
    // EQUA
    EQUA: {
nome: "EQUA",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "blond_tanganika": { cieca: 436, con_1: 578, vetro: 981 },
    "noce_nazionale": { cieca: 491, con_1: 633, vetro: 1036 },
    "opaco_base": { cieca: 361, con_1: 503, vetro: 983 },
    "opaco_ral": { cieca: 417, con_1: 559, vetro: 1040 },
    "ultraopaco_base": { cieca: 381, con_1: 523, vetro: 1003 },
    "ultraopaco_cartella": { cieca: 437, con_1: 579, vetro: 1060 },
    "trame_base": { cieca: 522, con_1: 664, vetro: 1068 },
    "trame_ral": { cieca: 577, con_1: 719, vetro: 1123 }
}
    },
    
    EQUA_STYLA: {
nome: "EQUA STYLA",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "opaco_base": { cieca: 520 },
    "opaco_ral": { cieca: 576 },
    "ultraopaco_base": { cieca: 540 },
    "ultraopaco_cartella": { cieca: 596 }
}
    },
    
    // NOVA
    NOVA: {
nome: "NOVA",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "blond_tanganika": { cieca: 266, supernova: 354, vetro: 553 },
    "noce_nazionale": { cieca: 362, supernova: 450, vetro: 649 },
    "opaco_base": { cieca: 300, vetro: 583 },
    "opaco_ral": { cieca: 417, vetro: 704 }
}
    },
    
    // GLASS
    GLASS: {
nome: "GLASS",
spessore: 44,
tipologia: "tamburata_vetro",
finiture: {
    "blond_tanganika": { satinato: 844, fronte_retro: 892, decorato: 904, bolla: 944 },
    "noce_nazionale": { satinato: 885, fronte_retro: 933, decorato: 945, bolla: 985 },
    "opaco_base": { satinato: 873, fronte_retro: 921, decorato: 933, bolla: 973 },
    "opaco_ral": { satinato: 929, fronte_retro: 977, decorato: 989, bolla: 1029 },
    "ultraopaco_base": { satinato: 894, fronte_retro: 942, decorato: 954, bolla: 994 },
    "trame_base": { satinato: 935, fronte_retro: 983, decorato: 995, bolla: 1035 },
    "iride": { satinato: 974, fronte_retro: 1022, decorato: 1034, bolla: 1074 }
}
    },
    
    // INTAGLIO
    INTAGLIO: {
nome: "INTAGLIO",
spessore: 44,
tipologia: "pantografata",
modelli: ["0", "0_vetro", "1", "2", "4", "8", "10"],
finiture: {
    "blond_tanganika": { "0": 632, "0_vetro": 721, "1": 600, "2": 632, "4": 684, "8": 655 },
    "noce_nazionale": { "0": 672, "0_vetro": 782, "1": 663, "2": 672, "4": 743, "8": 703 },
    "opaco_base": { "0": 472, "0_vetro": 651, "1": 472, "2": 472, "4": 613, "8": 472 },
    "ultraopaco_base": { "0": 492, "0_vetro": 671, "1": 492, "2": 492, "4": 633, "8": 492 },
    "trame_base": { "0": 716, "0_vetro": 836, "1": 712, "2": 716, "4": 797, "8": 740 }
}
    },
    
    // PLISSÃˆ
    PLISSE: {
nome: "PLISSÃˆ",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "opaco_base": { cieca: 423 },
    "opaco_ral": { cieca: 480 },
    "ultraopaco_base": { cieca: 443 },
    "ultraopaco_cartella": { cieca: 500 }
}
    },
    
    // SUITE
    SUITE: {
nome: "SUITE",
spessore: 44,
tipologia: "tamburata",
modelli: ["4_6", "9", "10", "21_22_27"],
finiture: {
    "opaco_base": { "4_6": 403, "9": 457, "10": 500, "21_22_27": 423 },
    "opaco_ral": { "4_6": 458, "9": 512, "10": 557, "21_22_27": 480 },
    "ultraopaco_base": { "4_6": 423, "9": 477, "10": 520, "21_22_27": 443 },
    "ultraopaco_cartella": { "4_6": 478, "9": 532, "10": 577, "21_22_27": 500 },
    "trame_base": { "21_22_27": 553 },
    "trame_ral": { "21_22_27": 609 }
}
    },
    
    // MIXY
    MIXY: {
nome: "MIXY",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "opaco_base": { cieca: 367, predisposta_cristallo: 486 },
    "opaco_ral": { cieca: 423, predisposta_cristallo: 540 },
    "ultraopaco_base": { cieca: 387, predisposta_cristallo: 506 },
    "ultraopaco_cartella": { cieca: 443, predisposta_cristallo: 560 }
}
    },
    
    // YNCISA
    YNCISA: {
nome: "YNCISA",
spessore: 44,
tipologia: "tamburata",
finiture: {
    "opaco_base": { cieca: 414, con_cristallo: 532 },
    "opaco_ral": { cieca: 470, con_cristallo: 588 },
    "ultraopaco_base": { cieca: 434, con_cristallo: 552 },
    "ultraopaco_cartella": { cieca: 490, con_cristallo: 608 }
}
    },
    
    // KÃ‰VIA
    KEVIA: {
nome: "KÃ‰VIA",
spessore: 44,
tipologia: "pantografata",
finiture: {
    "opaco_base": { cieca: 403, con_cristallo: 521 },
    "opaco_ral": { cieca: 458, con_cristallo: 576 },
    "ultraopaco_base": { cieca: 423, con_cristallo: 541 }
}
    },
    
    // CLASSICHE
    DIVA: {
nome: "DIVA",
spessore: 44,
tipologia: "pantografata",
finiture: {
    "opaco_base": { cieca: 563 },
    "opaco_ral": { cieca: 618 },
    "patinato_bianco": { cieca: 678 },
    "patinato_crema": { cieca: 678 }
}
    },
    
    EPOCA: {
nome: "EPOCA",
spessore: 44,
tipologia: "pantografata",
finiture: {
    "opaco_base": { cieca: 563 },
    "opaco_ral": { cieca: 618 },
    "patinato_bianco": { cieca: 678 },
    "patinato_crema": { cieca: 678 }
}
    }
};

// =============================================================================
// REPLICA - PREZZI ANTE
// =============================================================================

const FERREROLEGNO_REPLICA = {
    
    // LISS
    LISS: {
nome: "LISS",
tipologia: "liscia_sintetica",
finiture: {
    "bianco_grigio_lino": { 
        liss: 173, liss_1: 245, liss_4: 296, liss_90: 296,
        vetro_sat: 427, vetro_fr: 469, vetro_point: 615, vetro_strip: 615
    },
    "noce": { 
        liss: 168, liss_1: 240, liss_4: 291, liss_90: 291,
        vetro_sat: 422, vetro_fr: 464, vetro_point: 610, vetro_strip: 610
    },
    "grafis": { 
        liss: 205, liss_1: 277, liss_4: 328, liss_90: 328,
        vetro_sat: 459, vetro_fr: 501, vetro_point: 647, vetro_strip: 647
    },
    "materic_ontario": { 
        liss: 230, liss_1: 302, liss_4: 353, liss_90: 353,
        vetro_sat: 484, vetro_fr: 526, vetro_point: 672, vetro_strip: 672
    }
}
    },
    
    // LISS VETRO LARGE
    LISS_VETRO_LARGE: {
nome: "LISS VETRO LARGE",
tipologia: "vetro_grande",
finiture: {
    "bianco_grigio_lino": { satinato: 636, fronte_retro: 684, decorato: 693, graffio: 782, bolla: 782 },
    "noce": { satinato: 621, fronte_retro: 669, decorato: 678, graffio: 767, bolla: 767 },
    "grafis": { satinato: 634, fronte_retro: 682, decorato: 691, graffio: 780, bolla: 780 },
    "materic_ontario": { satinato: 662, fronte_retro: 710, decorato: 719, graffio: 808, bolla: 808 }
}
    },
    
    // LOGICA
    LOGICA: {
nome: "LOGICA",
tipologia: "pantografata_sintetica",
finiture: {
    "grafis": { 
        logica: 223, logica_1: 295, logica_4: 346, logica_90: 346,
        vetro_sat: 477, vetro_fr: 519, vetro_point: 665, vetro_strip: 665
    },
    "materic_ontario": { 
        logica: 249, logica_1: 321, logica_4: 372, logica_90: 372,
        vetro_sat: 503, vetro_fr: 545, vetro_point: 691, vetro_strip: 691
    }
}
    },
    
    // TRATTO / SEGNI
    TRATTO: {
nome: "TRATTO",
tipologia: "pantografata_sintetica",
finiture: {
    "materic": { cieca: 394 },
    "ontario": { cieca: 394 }
}
    },
    
    SEGNI: {
nome: "SEGNI",
tipologia: "pantografata_sintetica",
finiture: {
    "materic": { cieca: 394 },
    "ontario": { cieca: 394 }
}
    },
    
    // AREA
    AREA: {
nome: "AREA",
tipologia: "pannelletti",
finiture: {
    "bianco": { cieca: 475, satinato: 567, fronte_retro: 617, decorato: 644, bolla: 723, graffio: 723 },
    "noce": { cieca: 461, satinato: 553, fronte_retro: 603, decorato: 630, bolla: 709, graffio: 709 },
    "grafis": { cieca: 475, satinato: 567, fronte_retro: 617, decorato: 644, bolla: 723, graffio: 723 },
    "materic_ontario": { cieca: 490, satinato: 582, fronte_retro: 632, decorato: 659, bolla: 738, graffio: 738 }
}
    },
    
    // AREA/31 SIMPLY
    AREA_31_SIMPLY: {
nome: "AREA/31 SIMPLY",
tipologia: "pannelletti_simply",
finiture: {
    "bianco": { lisci: 360, satinato: 506, fronte_retro: 556, decorato: 583, bolla: 662, graffio: 662 },
    "noce": { lisci: 351, satinato: 497, fronte_retro: 547, decorato: 574, bolla: 653, graffio: 653 },
    "grafis": { lisci: 398, satinato: 544, fronte_retro: 594, decorato: 621, bolla: 700, graffio: 700 },
    "materic_ontario": { lisci: 414, satinato: 560, fronte_retro: 610, decorato: 637, bolla: 716, graffio: 716 }
}
    },
    
    // FORMA
    FORMA: {
nome: "FORMA",
tipologia: "sagomata",
finiture: {
    "bianco": { pannelletto: 375, satinato: 491, fronte_retro: 541, decorato: 572 },
    "noce": { pannelletto: 364, satinato: 480, fronte_retro: 530, decorato: 561 },
    "rovere_gold": { pannelletto: 439, satinato: 555, fronte_retro: 605, decorato: 636 }
}
    }
};

// =============================================================================
// REPLICA - TELAI
// =============================================================================

const FERREROLEGNO_TELAI_REPLICA = {
    
    FLAT: {
nome: "FLAT",
tipo: "complanare",
spessori: [75, 100],
finiture: {
    "bianco_grigio_lino": { pivot: 308, scomparsa: 333 },
    "grafis_bianco": { pivot: 314, scomparsa: 339 },
    "materic": { pivot: 314, scomparsa: 339 },
    "ontario": { pivot: 314, scomparsa: 339 },
    "rovere_gold": { pivot: 314, scomparsa: 339 }
}
    },
    
    GENIUS_ELEVA: {
nome: "GENIUS ELEVA",
tipo: "standard",
spessori: [75, 100],
finiture: {
    "bianco_grigio_lino": { anuba: 161, pivot: 191 },
    "noce": { anuba: 157, pivot: 187 },
    "grafis_bianco": { anuba: 193, pivot: 223 },
    "grafis_beige_moka": { anuba: 193, pivot: 223 },
    "materic": { anuba: 208, pivot: null },
    "ontario": { anuba: 208, pivot: null },
    "rovere_gold": { anuba: 208, pivot: 238 }
}
    },
    
    OVAL_ELEVA: {
nome: "OVAL ELEVA",
tipo: "standard_stondato",
spessori: [80, 100],
finiture: {
    "bianco_grigio_lino": { anuba: 182, pivot: 212 },
    "noce": { anuba: 177, pivot: 207 },
    "grafis_bianco": { anuba: 212, pivot: 242 },
    "grafis_beige_moka": { anuba: 212, pivot: 242 },
    "rovere_gold": { anuba: 227, pivot: 257 }
}
    }
};

// =============================================================================
// ZERO - PREZZI ANTE
// =============================================================================

const FERREROLEGNO_ZERO = {
    
    // EXIT ZERO
    EXIT_ZERO: {
nome: "EXIT ZERO",
tipologia: "filo_muro",
finiture: {
    "grezzo_prefinito": { cieca: 327 },
    "iride": { cieca: 587 },
    "natural_touch_rovere": { cieca: 595 },
    "natural_touch_noce": { cieca: 605 },
    "ultralucido_base": { cieca: 906 },
    "ultralucido_cartella": { cieca: 1105 }
}
    },
    
    // EXITLYNE ZERO
    EXITLYNE_ZERO: {
nome: "EXITLYNE ZERO",
tipologia: "filo_muro",
finiture: {
    "iride": { cieca: 568 },
    "natural_touch_rovere": { cieca: 576 },
    "natural_touch_noce": { cieca: 586 }
}
    },
    
    // EQUA ZERO
    EQUA_ZERO: {
nome: "EQUA ZERO",
tipologia: "filo_muro",
finiture: {
    "opaco_base": { cieca: 396 },
    "opaco_ral": { cieca: 452 },
    "ultraopaco_base": { cieca: 416 },
    "ultraopaco_cartella": { cieca: 472 },
    "trame_base": { cieca: 557 },
    "trame_ral": { cieca: 612 }
}
    },
    
    // SUITE ZERO
    SUITE_ZERO: {
nome: "SUITE ZERO",
tipologia: "filo_muro",
modelli: ["21", "22", "27"],
finiture: {
    "opaco_base": { cieca: 423 },
    "opaco_ral": { cieca: 480 },
    "ultraopaco_base": { cieca: 443 },
    "ultraopaco_cartella": { cieca: 500 },
    "trame_base": { cieca: 553 }
}
    },
    
    // MIXY ZERO
    MIXY_ZERO: {
nome: "MIXY ZERO",
tipologia: "filo_muro",
finiture: {
    "opaco_base": { cieca: 367 },
    "opaco_ral": { cieca: 423 },
    "ultraopaco_base": { cieca: 387 },
    "ultraopaco_cartella": { cieca: 443 }
}
    },
    
    // YNCISA ZERO
    YNCISA_ZERO: {
nome: "YNCISA ZERO",
tipologia: "filo_muro",
finiture: {
    "opaco_base": { cieca: 414 },
    "opaco_ral": { cieca: 469 },
    "ultraopaco_base": { cieca: 434 },
    "ultraopaco_cartella": { cieca: 489 }
}
    },
    
    // LOGICA ZERO
    LOGICA_ZERO: {
nome: "LOGICA ZERO",
tipologia: "filo_muro",
finiture: {
    "materic": { cieca: 249 },
    "ontario": { cieca: 249 }
}
    },
    
    // PLISSE ZERO
    PLISSE_ZERO: {
nome: "PLISSÃˆ ZERO",
tipologia: "filo_muro",
finiture: {
    "opaco_base": { cieca: 423 },
    "opaco_ral": { cieca: 480 },
    "ultraopaco_base": { cieca: 443 },
    "ultraopaco_cartella": { cieca: 500 }
}
    }
};

// =============================================================================
// ZERO - TELAI A_FILO
// =============================================================================

const FERREROLEGNO_TELAI_ZERO = {
    
    A_FILO: {
nome: "A_FILO",
materiale: "alluminio",
prezzi: {
    70: 506,
    100: 540,
    125: 582
}
    },
    
    CONCEPT: {
nome: "CONCEPT",
materiale: "alluminio",
prezzi: {
    100: 677
}
    },
    
    maggiorazioni: {
telaio_doppio: 327,
telaio_muratura: 27  // zanche + rete porta intonaco
    }
};

// =============================================================================
// ZERO - BASIC ZERO (Vetro Temperato 8mm)
// =============================================================================

const FERREROLEGNO_BASIC_ZERO = {
    
    nome: "BASIC ZERO",
    tipologia: "vetro_temperato_8mm",
    
    // Prezzi per fascia altezza
    prezziPerAltezza: {
"2000-2049": {
    trasparente: 680,
    satinato: 752,
    grigio_bronzo: 752,
    extrachiaro: 824,
    decorato: 1060
},
"2050-2100": {
    trasparente: 714,
    satinato: 790,
    grigio_bronzo: 790,
    extrachiaro: 866,
    decorato: 1113
},
"2101-2249": {
    trasparente: 812,
    satinato: 897,
    grigio_bronzo: 897,
    extrachiaro: 984,
    decorato: 1264
},
"2250-2449": {
    trasparente: 896,
    satinato: 978,
    grigio_bronzo: 1069,
    extrachiaro: 1216,
    decorato: 1609
},
"2450-2700": {
    trasparente: 896,
    satinato: 978,
    grigio_bronzo: 1069,
    extrachiaro: 1297,
    decorato: 1751
}
    },
    
    // Maniglie
    maniglie: {
ponte_alluminio: 140,
ponte_laccato: 150,
vitra_senza_foro_cromo: 215,
vitra_senza_foro_laccato: 225,
vitra_yale_cromo: 325,
vitra_yale_laccato: 335,
vitra_nottolino_cromo: 360,
vitra_nottolino_laccato: 370,
pomax_tonda: 164
    }
};

// =============================================================================
// ZERO - FRAME ZERO (Vetro Temperato 6mm con profilo)
// =============================================================================

const FERREROLEGNO_FRAME_ZERO = {
    
    nome: "FRAME ZERO",
    tipologia: "vetro_temperato_6mm_profilo",
    spessoreVetro: "6mm filtrante / 3+3mm coprente",
    
    // Prezzi per fascia altezza e larghezza
    // Larghezze: 600-850, 900-1000, 1050-1200
    prezziPerAltezza: {
"2000-2049": {
    trasparente_bianco: { "600-850": 758, "900-1000": 799, "1050-1200": 855 },
    satinato_bianco: { "600-850": 852, "900-1000": 910, "1050-1200": 987 },
    grigio_bronzo: { "600-850": 927, "900-1000": 998, "1050-1200": 1093 },
    extrachiaro: { "600-850": 1048, "900-1000": 1143, "1050-1200": 1267 },
    decorato: { "600-850": 1142, "900-1000": 1251, "1050-1200": 1397 }
},
"2050-2100": {
    trasparente_bianco: { "600-850": 797, "900-1000": 840, "1050-1200": 899 },
    satinato_bianco: { "600-850": 897, "900-1000": 958, "1050-1200": 1039 },
    grigio_bronzo: { "600-850": 975, "900-1000": 1050, "1050-1200": 1150 },
    extrachiaro: { "600-850": 1103, "900-1000": 1203, "1050-1200": 1335 },
    decorato: { "600-850": 1202, "900-1000": 1316, "1050-1200": 1470 }
},
"2101-2249": {
    trasparente_bianco: { "600-850": 834, "900-1000": 878, "1050-1200": 939 },
    satinato_bianco: { "600-850": 938, "900-1000": 1002, "1050-1200": 1086 },
    grigio_bronzo: { "600-850": 1019, "900-1000": 1097, "1050-1200": 1202 },
    extrachiaro: { "600-850": 1153, "900-1000": 1258, "1050-1200": 1396 },
    decorato: { "600-850": 1257, "900-1000": 1376, "1050-1200": 1537 }
},
"2250-2449": {
    trasparente_bianco: { "600-850": 870, "900-1000": 918, "1050-1200": 980 },
    satinato_bianco: { "600-850": 977, "900-1000": 1044, "1050-1200": 1132 },
    grigio_bronzo: { "600-850": 1062, "900-1000": 1143, "1050-1200": 1253 },
    lucido_nero: { "600-850": 1142, "900-1000": 1238, "1050-1200": 1365 },
    riflettente: { "600-850": 1142, "900-1000": 1238, "1050-1200": 1365 },
    extrachiaro: { "600-850": 1236, "900-1000": 1349, "1050-1200": 1498 },
    satinato_nero: { "600-850": 1330, "900-1000": 1459, "1050-1200": 1629 },
    decorato_bit03: { "600-850": 1686, "900-1000": 1878, "1050-1200": 2132 },
    milky: { "600-850": 938, "900-1000": 995, "1050-1200": 1074 },
    lucido_colori: { "600-850": 1236, "900-1000": 1349, "1050-1200": 1498 },
    specchio_smoke_bronze: { "600-850": 1461, "900-1000": 1613, "1050-1200": 1814 }
},
"2450-2749": {
    trasparente_bianco: { "600-850": 895, "900-1000": 945, "1050-1200": 1012 },
    satinato_bianco: { "600-850": 1009, "900-1000": 1078, "1050-1200": 1169 },
    grigio_bronzo: { "600-850": 1097, "900-1000": 1181, "1050-1200": 1294 },
    lucido_nero: { "600-850": 1201, "900-1000": 1310, "1050-1200": 1453 },
    riflettente: { "600-850": 1201, "900-1000": 1310, "1050-1200": 1453 },
    extrachiaro: { "600-850": 1309, "900-1000": 1434, "1050-1200": 1603 },
    satinato_nero: { "600-850": 1414, "900-1000": 1560, "1050-1200": 1754 },
    decorato_bit03: { "600-850": 1808, "900-1000": 2022, "1050-1200": 2309 },
    milky: { "600-850": 977, "900-1000": 1044, "1050-1200": 1132 },
    lucido_colori: { "600-850": 1310, "900-1000": 1435, "1050-1200": 1604 },
    specchio_smoke_bronze: { "600-850": 1563, "900-1000": 1723, "1050-1200": 1946 }
}
    },
    
    // Telai specifici FRAME ZERO
    telai: {
A_FILO_70: 591,
A_FILO_100: 625,
A_FILO_125: 667,
muratura: 27
    },
    
    // Cristalli disponibili
    cristalli: [
"trasparente", "satinato", "satinato_fronte_retro", "riflettente",
"lucido_nero", "segni", "point", "strip", "textil", "bit03",
"chillout", "flutes", "milky", "lucido_colori", "satinato_colori", "specchio"
    ]
};

// =============================================================================
// ZERO - PREMIUM ZERO (Vetro Sicurezza 3mm bifacciale)
// =============================================================================

const FERREROLEGNO_PREMIUM_ZERO = {
    
    nome: "PREMIUM ZERO",
    tipologia: "vetro_sicurezza_3mm_bifacciale",
    spessoreAnta: 44,
    spessoreVetro: "3mm + 3mm (bifacciale)",
    
    // Prezzi per fascia altezza
    // Larghezze: 600-850, 900-1000
    prezziPerAltezza: {
"1400-2200": {
    lucido_base: { "600-850": 1222, "900-1000": 1393 },        // Black/Antracite/Ginger/Red/Beige/White
    specchio_classic: { "600-850": 1222, "900-1000": 1393 },
    satinato: { "600-850": 1441, "900-1000": 1626 },           // Black/Antracite/Ginger/Silver/White/Blue
    lucido_pearl_blue: { "600-850": 1441, "900-1000": 1626 },
    specchio_smoke_bronze: { "600-850": 1441, "900-1000": 1626 },
    bicolore: { "600-850": 1441, "900-1000": 1626 }            // escluso Ginger
},
"2201-2400": {
    lucido_base: { "600-850": 1296, "900-1000": 1549 },
    specchio_classic: { "600-850": 1296, "900-1000": 1549 },
    satinato: { "600-850": 1533, "900-1000": 1798 },
    lucido_pearl_blue: { "600-850": 1533, "900-1000": 1798 },
    specchio_smoke_bronze: { "600-850": 1533, "900-1000": 1798 },
    bicolore: { "600-850": 1533, "900-1000": 1798 }
},
"2401-2700": {
    lucido_base: { "600-850": 1432, "900-1000": 1722 },
    specchio_classic: { "600-850": 1432, "900-1000": 1722 },
    satinato: { "600-850": 1643, "900-1000": 1962 },
    lucido_pearl_blue: { "600-850": 1643, "900-1000": 1962 },
    specchio_smoke_bronze: { "600-850": 1643, "900-1000": 1962 },
    bicolore: { "600-850": 1643, "900-1000": 1962 }
},
"2701-2900": {
    lucido_base: { "600-850": 1709, "900-1000": 1801 },
    specchio_classic: { "600-850": 1709, "900-1000": 1801 },
    satinato: { "600-850": 1980, "900-1000": 2116 },
    lucido_pearl_blue: { "600-850": 1980, "900-1000": 2116 },
    specchio_smoke_bronze: { "600-850": 1980, "900-1000": 2116 },
    bicolore: { "600-850": 1980, "900-1000": 2116 }
}
    },
    
    // Maggiorazioni laccatura profilo
    laccaturaProfilo: {
"1400-2200": { bianco_base: 150, metallizzato: 265 },
"2201-2400": { bianco_base: 160, metallizzato: 280 },
"2401-2700": { bianco_base: 170, metallizzato: 295 },
"2701-2900": { bianco_base: 180, metallizzato: 310 }
    },
    
    // Maggiorazioni laccatura CONCEPT
    laccaturaConceptProfilo: {
"1400-2200": { bianco_base: 80, metallizzato: 110 },
"2201-2450": { bianco_base: 90, metallizzato: 125 },
"2451-2700": { bianco_base: 100, metallizzato: 140 },
"2701-2900": { bianco_base: 110, metallizzato: 155 }
    },
    
    // Telai Premium Zero (stessi di ZERO standard)
    telai: {
A_FILO_70: 506,
A_FILO_100: 540,
A_FILO_125: 582,
CONCEPT_100: 677,
muratura: 27
    },
    
    // Colori vetro disponibili
    coloriLucido: ["Black", "Antracite", "Ginger", "Red", "Beige", "White", "Pearl", "Blue"],
    coloriSatinato: ["Black", "Antracite", "Ginger", "Silver", "White", "Blue"],
    coloriSpecchio: ["Classic", "Smoke", "Bronze"],
    
    // Note
    note: "NO ANTE DOPPIE per Premium Zero"
};

// =============================================================================
// MAGGIORAZIONI COMUNI
// =============================================================================

const FERREROLEGNO_MAGGIORAZIONI = {
    
    // Dimensioni
    dimensioni: {
larghezza: {
    standard: [600, 650, 700, 750, 800, 850, 900],
    fuori_standard_50: { range: [500, 550, 950, 1000, 1050, 1100, 1150, 1200], perc: 0.50 }
},
altezza: {
    standard: [2000, 2100],
    fuori_standard_15: { range_min: 1950, range_max: 2200, perc: 0.15 },  // escluso 2000-2100
    fuori_standard_50: { ranges: [[1400, 1949], [1750, 1900], [2250, 2400]], perc: 0.50 },
    fuori_standard_55: { range_min: 2401, range_max: 2600, perc: 0.55 },
    fuori_standard_60: { range_min: 2601, range_max: 2900, perc: 0.60 }
}
    },
    
    // Versioni battente
    battente: {
specchio_sicurezza_4mm: 500,  // su 1 lato
cappucci_copricerniera: 23,    // per telaio
serratura_yale: 55,
serratura_yale_passepartout: 95
    },
    
    // Versioni scorrevole
    scorrevole: {
rolling_scrighi_con_serratura: 150,
rolling_scrighi_senza_serratura: 130,
rolling_scrighi_senza_nulla: 110,
rolling_prima_con_serratura: 545,
rolling_prima_senza_serratura: 465,
rolling_prima_senza_nulla: 440,
rolling_magic_completo: 510,
rolling_magic_senza_nulla: 485,
essential_syntesis_con_serratura: 225,
essential_syntesis_senza_serratura: 205,
essential_syntesis_senza_nulla: 185,
maniglia_quadra: 15,
serratura_yale: 55,
fermo_soft_monolaterale: 60,
fermo_soft_bilaterale: 90,
esclusione_cassonetto: -295
    },
    
    // Pieghevoli
    pieghevoli: {
modula_ferramenta: 420,
indue_ferramenta: 445,
fold_90_ferramenta_anta: 570,
fold_90_ferramenta_telaio: 120,
fold_180_ferramenta_anta: 590,
fold_180_ferramenta_telaio: 120,
telaio_doppio_replica: 85,
telaio_doppio_zero: 327,
anta_semifissa_wave: 110
    },
    
    // Maniglie
    maniglie: {
wave_senza_foro: 110,
wave_nottolino: 130,
quadra: 15,
rettangolare: 30
    }
};

// =============================================================================
// BEST SELLER - SOLUZIONI COMPLETE
// =============================================================================

const FERREROLEGNO_BEST_SELLER = {
    
    // REPLICA Best Seller
    REPLICA: {
"LISS_bianco_genius_anuba": { anta: 173, telaio: 161, totale: 334 },
"LISS_bianco_flat_pivot": { anta: 173, telaio: 308, totale: 481 },
"LISS_grafis_genius_anuba": { anta: 205, telaio: 193, totale: 398 },
"LOGICA_grafis_genius_anuba": { anta: 223, telaio: 193, totale: 416 },
"LOGICA_materic_genius_anuba": { anta: 249, telaio: 208, totale: 457 },
"AREA_grafis_genius_anuba": { anta: 475, telaio: 193, totale: 668 }
    },
    
    // ZERO Best Seller
    ZERO: {
"EXIT_grezzo_afilo_100": { anta: 327, telaio: 540, totale: 867 },
"EQUA_opaco_afilo_100": { anta: 396, telaio: 540, totale: 936 },
"EQUA_ultraopaco_afilo_100": { anta: 416, telaio: 540, totale: 956 },
"EXITLYNE_iride_afilo_100": { anta: 568, telaio: 540, totale: 1108 },
"MIXY_opaco_afilo_100": { anta: 367, telaio: 540, totale: 907 },
"YNCISA_opaco_afilo_100": { anta: 414, telaio: 540, totale: 954 },
"LOGICA_materic_afilo_100": { anta: 249, telaio: 540, totale: 789 }
    }
};

// =============================================================================
// FUNZIONE CALCOLO PREZZO
// =============================================================================

/**
 * Calcola prezzo porta FerreroLegno
 * @param {Object} config - Configurazione porta
 * @returns {Object} - Dettaglio prezzi
 */
function calcolaPrezzoFerreroLegno(config) {
    const {
linea = "COLLEZIONI_FL",     // COLLEZIONI_FL, REPLICA, ZERO
collezione,                   // es. "EXIT", "LISS", "EQUA_ZERO"
modello = "cieca",            // cieca, vetro, liss_4, etc.
finitura,                     // es. "opaco_base", "grafis"
telaio,                       // es. "GENIUS_ELEVA", "A_FILO"
telaioSpessore = 100,         // mm
telaioFinitura,               // finitura telaio
telaioCerniera = "anuba",     // anuba, pivot, scomparsa
larghezza = 800,              // mm
altezza = 2100,               // mm
versione = "battente",        // battente, scorrevole, pieghevole
opzioni = []                  // array opzioni aggiuntive
    } = config;
    
    let prezzoAnta = 0;
    let prezzoTelaio = 0;
    let prezzoOpzioni = 0;
    let maggiorazioneDim = 0;
    
    // Recupera prezzo anta in base alla linea
    let datiCollezione;
    if (linea === "COLLEZIONI_FL") {
datiCollezione = FERREROLEGNO_COLLEZIONI_FL[collezione];
    } else if (linea === "REPLICA") {
datiCollezione = FERREROLEGNO_REPLICA[collezione];
    } else if (linea === "ZERO") {
datiCollezione = FERREROLEGNO_ZERO[collezione];
    }
    
    if (datiCollezione && datiCollezione.finiture[finitura]) {
prezzoAnta = datiCollezione.finiture[finitura][modello] || 0;
    }
    
    // Recupera prezzo telaio
    if (linea === "REPLICA" && FERREROLEGNO_TELAI_REPLICA[telaio]) {
const datiTelaio = FERREROLEGNO_TELAI_REPLICA[telaio];
if (datiTelaio.finiture[telaioFinitura]) {
    prezzoTelaio = datiTelaio.finiture[telaioFinitura][telaioCerniera] || 0;
}
    } else if (linea === "ZERO" && FERREROLEGNO_TELAI_ZERO[telaio]) {
prezzoTelaio = FERREROLEGNO_TELAI_ZERO[telaio].prezzi[telaioSpessore] || 0;
    }
    
    // Calcola maggiorazione dimensioni
    const stdL = FERREROLEGNO_CONFIG.larghezzeStandard;
    const stdH = FERREROLEGNO_CONFIG.altezzeStandard;
    
    if (!stdL.includes(larghezza)) {
maggiorazioneDim += 0.50;  // fuori standard larghezza
    }
    if (!stdH.includes(altezza)) {
if (altezza >= 1950 && altezza <= 2200) {
    maggiorazioneDim += 0.15;
} else {
    maggiorazioneDim += 0.50;
}
    }
    
    // Calcola opzioni
    opzioni.forEach(opt => {
if (FERREROLEGNO_MAGGIORAZIONI.battente[opt]) {
    prezzoOpzioni += FERREROLEGNO_MAGGIORAZIONI.battente[opt];
} else if (FERREROLEGNO_MAGGIORAZIONI.scorrevole[opt]) {
    prezzoOpzioni += FERREROLEGNO_MAGGIORAZIONI.scorrevole[opt];
} else if (FERREROLEGNO_MAGGIORAZIONI.pieghevoli[opt]) {
    prezzoOpzioni += FERREROLEGNO_MAGGIORAZIONI.pieghevoli[opt];
} else if (FERREROLEGNO_MAGGIORAZIONI.maniglie[opt]) {
    prezzoOpzioni += FERREROLEGNO_MAGGIORAZIONI.maniglie[opt];
}
    });
    
    // Calcoli finali
    const subtotale = prezzoAnta + prezzoTelaio + prezzoOpzioni;
    const totaleListino = subtotale * (1 + maggiorazioneDim);
    const totaleNetto = totaleListino * (1 - FERREROLEGNO_CONFIG.scontoInstallatore);
    
    return {
linea,
collezione,
modello,
finitura,
dimensioni: { larghezza, altezza },
prezzoAnta,
prezzoTelaio,
prezzoOpzioni,
maggiorazioneDim: `${(maggiorazioneDim * 100).toFixed(0)}%`,
subtotale,
totaleListino: Math.round(totaleListino * 100) / 100,
scontoInstallatore: `${FERREROLEGNO_CONFIG.scontoInstallatore * 100}%`,
totaleNetto: Math.round(totaleNetto * 100) / 100
    };
}

// =============================================================================
// EXPORT
// =============================================================================


console.log('✅ FERREROLEGNO-DATABASE-2025 caricato');
