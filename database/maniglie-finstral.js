// ═══════════════════════════════════════════════════════════════
// 🔧 DATABASE MANIGLIE FINSTRAL - Estratto da catalogo EUR 2025/3
// ═══════════════════════════════════════════════════════════════

const MANIGLIE_FINSTRAL = {
    
    // ───────────────────────────────────────────────────────────
    // COLORI DISPONIBILI
    // ───────────────────────────────────────────────────────────
    colori: {
"01": "bianco",
"07": "bianco perla",
"56": "neutro anodizzato",
"79": "colore titanio",
"74": "colore bronzo",
"40": "ottone lucido",
"0156": "interno bianco",
"0174": "esterno neutro / colore bronzo",
"M01": "bianco opaco",
"M03": "nero opaco",
"M07": "bianco crema",
"43": "acciaio inox",
"E03": "nero anodizzato"
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 1 - Maniglie Classic-line, Slim-line, Step-line, Nova-line
    // ───────────────────────────────────────────────────────────
    serie1: {
// FINESTRE
"6010": {
    codice: "6010",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56", "79", "74", "40", "0156", "0174"],
    supplemento: 19.6
},
"6011": {
    codice: "6011",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56", "79", "74", "40", "0156", "0174"],
    supplemento: 19.6
},
"6012": {
    codice: "6012",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56", "79", "74", "40", "0156", "0174"],
    supplemento: 19.6
},

"6020": {
    codice: "6020",
    descrizione: "maniglia per finestra in alluminio con pulsante",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 15.4,
    supplementoExtra: {
"56": 64.4
    }
},
"6021": {
    codice: "6021",
    descrizione: "maniglia per finestra in alluminio con pulsante",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 15.4,
    supplementoExtra: {
"56": 64.4
    }
},

"6030": {
    codice: "6030",
    descrizione: "maniglia per finestra in alluminio con chiusura inclusa placca antiperforazione",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 30.1,
    supplementoExtra: {
"56": 83.5
    }
},
"6031": {
    codice: "6031",
    descrizione: "maniglia per finestra in alluminio con chiusura inclusa placca antiperforazione",
    tipo: "finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 30.1,
    supplementoExtra: {
"56": 83.5
    }
},

// APERTURA SCORREVOLE PARALLELA
"6470": {
    codice: "6470",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio",
    tipo: "scorrevole",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 0
},
"6471": {
    codice: "6471",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio",
    tipo: "scorrevole",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 0
},

// PORTA-FINESTRA
"6710": {
    codice: "6710",
    descrizione: "doppia maniglia in alluminio cilindro incluso (per anta 935, 947 e 953)",
    tipo: "porta-finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 51.4,
    supplementoExtra: {
"56": 18.9
    }
},

"6700": {
    codice: "6700",
    descrizione: "doppia maniglia in alluminio con collo esterno ribassato (36 mm) cilindro incluso (per anta 935, 947 e 953)",
    tipo: "porta-finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 0
},

"6750": {
    codice: "6750",
    descrizione: "doppia maniglia in alluminio anta/ribalta cilindro incluso (per anta 935 e 953)",
    tipo: "porta-finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 68.4
},

"6740": {
    codice: "6740",
    descrizione: "doppia maniglia in alluminio anta/ribalta con collo esterno ribassato (36 mm) cilindro incluso (per anta 935 e 953)",
    tipo: "porta-finestra",
    serie: "1",
    colori: ["01", "07", "56"],
    supplemento: 0
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 2 - Maniglie moderne
    // ───────────────────────────────────────────────────────────
    serie2: {
// FINESTRE
"7040": {
    codice: "7040",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 9.12
},
"7041": {
    codice: "7041",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 9.12
},
"7042": {
    codice: "7042",
    descrizione: "maniglia per finestra in alluminio",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 9.12
},

"7120": {
    codice: "7120",
    descrizione: "maniglia a pressione in alluminio",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 11.6
},
"7121": {
    codice: "7121",
    descrizione: "maniglia a pressione in alluminio",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 11.6
},

"7130": {
    codice: "7130",
    descrizione: "maniglia a pressione in alluminio con chiusura incluso placca antiperforazione",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 63.2
},
"7131": {
    codice: "7131",
    descrizione: "maniglia a pressione in alluminio con chiusura incluso placca antiperforazione",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 63.2
},

"7070": {
    codice: "7070",
    descrizione: "maniglia per apertura a ribalta e ad anta (TBT) - apertura ad anta deve essere sbloccata mediante la chiave",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 47.0
},
"7071": {
    codice: "7071",
    descrizione: "maniglia per apertura a ribalta e ad anta (TBT) - apertura ad anta deve essere sbloccata mediante la chiave",
    tipo: "finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 47.0
},

// PORTA-FINESTRA
"7720": {
    codice: "7720",
    descrizione: "doppia maniglia in alluminio apertura ad anta cilindro incluso (per anta 935, 947 e 953)",
    tipo: "porta-finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 24.4
},

"7730": {
    codice: "7730",
    descrizione: "doppia maniglia in alluminio anta/ribalta cilindro incluso (per anta 935 e 953)",
    tipo: "porta-finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 24.4
},

"7740": {
    codice: "7740",
    descrizione: "doppia maniglia in alluminio anta/ribalta con collo esterno ribassato cilindro incluso (per anta 935 e 953)",
    tipo: "porta-finestra",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 30.6
},

// APERTURA SCORREVOLE
"7500": {
    codice: "7500",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 23.5
},
"7501": {
    codice: "7501",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 23.5
},

"7510": {
    codice: "7510",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio con chiusura incluso placca antiperforazione",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 49.5
},
"7511": {
    codice: "7511",
    descrizione: "maniglia per porta-finestra scorrevole in alluminio con chiusura incluso placca antiperforazione",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 49.5
},

"7520": {
    codice: "7520",
    descrizione: "doppia maniglia per porta-finestra scorrevole in alluminio cilindro incluso (per anta 935 e 953)",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 53.4
},

"7530": {
    codice: "7530",
    descrizione: "doppia maniglia per porta-finestra scorrevole in alluminio con collo esterno ribassato cilindro incluso (per anta 935 e 953)",
    tipo: "scorrevole",
    serie: "2",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 70.4
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 3 - Acciaio inox
    // ───────────────────────────────────────────────────────────
    serie3: {
"8010": {
    codice: "8010",
    descrizione: "maniglia per finestra in acciaio inox",
    tipo: "finestra",
    serie: "3",
    colori: ["43"],
    supplemento: 18.4
},
"8011": {
    codice: "8011",
    descrizione: "maniglia per finestra in acciaio inox",
    tipo: "finestra",
    serie: "3",
    colori: ["43"],
    supplemento: 18.4
},

"8020": {
    codice: "8020",
    descrizione: "maniglia per porta-finestra scorrevole in acciaio inox",
    tipo: "scorrevole",
    serie: "3",
    colori: ["43"],
    supplemento: 50.8
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 4
    // ───────────────────────────────────────────────────────────
    serie4: {
"1040": {
    codice: "1040",
    descrizione: "maniglia senza rosetta",
    tipo: "finestra",
    serie: "4",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 19.6,
    supplementoExtra: {
"M07": 63.1
    }
},
"1041": {
    codice: "1041",
    descrizione: "maniglia senza rosetta",
    tipo: "finestra",
    serie: "4",
    colori: ["M01", "79", "M03", "M07"],
    supplemento: 19.6,
    supplementoExtra: {
"M07": 63.1
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 11
    // ───────────────────────────────────────────────────────────
    serie11: {
// FINESTRE
"1901": {
    codice: "1901",
    descrizione: "maniglia per finestra serie 11 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 31.3,
    supplementoExtra: {
"E03": 35.2,
"extra": 75.1
    }
},

"19110": {
    codice: "19110",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 26.2,
    supplementoExtra: {
"E03": 28.8,
"extra": 70.0
    }
},
"19111": {
    codice: "19111",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 26.2,
    supplementoExtra: {
"E03": 28.8,
"extra": 70.0
    }
},
"19112": {
    codice: "19112",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 26.2,
    supplementoExtra: {
"E03": 28.8,
"extra": 70.0
    }
},

"49110": {
    codice: "49110",
    descrizione: "maniglia a pressione serie 11 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 59.9,
    supplementoExtra: {
"E03": 68.6,
"extra": 104
    }
},
"49111": {
    codice: "49111",
    descrizione: "maniglia a pressione serie 11 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 59.9,
    supplementoExtra: {
"E03": 68.6,
"extra": 104
    }
},

// PORTA-FINESTRA
"29110": {
    codice: "29110",
    descrizione: "doppia maniglia serie 11 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "11",
    colori: ["56", "43", "E03"],
    supplemento: 67.6,
    supplementoExtra: {
"E03": 71.6,
"extra": 155
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 12
    // ───────────────────────────────────────────────────────────
    serie12: {
"1902": {
    codice: "1902",
    descrizione: "maniglia per finestra serie 12 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "12",
    colori: ["56", "43", "E03"],
    supplemento: 36.5,
    supplementoExtra: {
"43": 58.7,
"E03": 40.4,
"extra": 80.3
    }
},

"19120": {
    codice: "19120",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "12",
    colori: ["56", "43", "E03"],
    supplemento: 30.7,
    supplementoExtra: {
"43": 53.9,
"E03": 34.6,
"extra": 74.6
    }
},
"19122": {
    codice: "19122",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "12",
    colori: ["56", "43", "E03"],
    supplemento: 30.7,
    supplementoExtra: {
"43": 53.9,
"E03": 34.6,
"extra": 74.6
    }
},

"49120": {
    codice: "49120",
    descrizione: "maniglia a pressione serie 12 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "12",
    colori: ["56", "43", "E03"],
    supplemento: 64.4,
    supplementoExtra: {
"43": 96.8,
"E03": 74.4,
"extra": 108
    }
},

"29120": {
    codice: "29120",
    descrizione: "doppia maniglia serie 12 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "12",
    colori: ["56", "43", "E03"],
    supplemento: 77.4,
    supplementoExtra: {
"43": 134,
"E03": 82.6,
"extra": 165
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 13
    // ───────────────────────────────────────────────────────────
    serie13: {
"1903": {
    codice: "1903",
    descrizione: "maniglia per finestra serie 13 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 60.0,
    supplementoExtra: {
"43": 89.9,
"E03": 70.4,
"extra": 104
    }
},

"19130": {
    codice: "19130",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 56.5,
    supplementoExtra: {
"43": 86.2,
"E03": 65.6,
"extra": 100
    }
},
"19131": {
    codice: "19131",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 56.5,
    supplementoExtra: {
"43": 86.2,
"E03": 65.6,
"extra": 100
    }
},
"19132": {
    codice: "19132",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 56.5,
    supplementoExtra: {
"43": 86.2,
"E03": 65.6,
"extra": 100
    }
},

"49130": {
    codice: "49130",
    descrizione: "maniglia a pressione serie 13 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 90.2,
    supplementoExtra: {
"43": 129,
"E03": 105,
"extra": 134
    }
},
"49131": {
    codice: "49131",
    descrizione: "maniglia a pressione serie 13 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 90.2,
    supplementoExtra: {
"43": 129,
"E03": 105,
"extra": 134
    }
},

"29130": {
    codice: "29130",
    descrizione: "doppia maniglia serie 13 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "13",
    colori: ["56", "43", "E03"],
    supplemento: 127,
    supplementoExtra: {
"43": 199,
"E03": 144,
"extra": 214
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 14
    // ───────────────────────────────────────────────────────────
    serie14: {
"1904": {
    codice: "1904",
    descrizione: "maniglia per finestra serie 14 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 41.3,
    supplementoExtra: {
"E03": 52.9,
"extra": 85.1
    }
},

"19140": {
    codice: "19140",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 34.6,
    supplementoExtra: {
"E03": 38.5,
"extra": 78.4
    }
},
"19141": {
    codice: "19141",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 34.6,
    supplementoExtra: {
"E03": 38.5,
"extra": 78.4
    }
},
"19142": {
    codice: "19142",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 34.6,
    supplementoExtra: {
"E03": 38.5,
"extra": 78.4
    }
},

"49140": {
    codice: "49140",
    descrizione: "maniglia a pressione serie 14 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 68.2,
    supplementoExtra: {
"E03": 78.2,
"extra": 112
    }
},
"49141": {
    codice: "49141",
    descrizione: "maniglia a pressione serie 14 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 68.2,
    supplementoExtra: {
"E03": 78.2,
"extra": 112
    }
},

"29140": {
    codice: "29140",
    descrizione: "doppia maniglia serie 14 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "14",
    colori: ["56", "43", "E03"],
    supplemento: 83.9,
    supplementoExtra: {
"E03": 90.3,
"extra": 172
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 15
    // ───────────────────────────────────────────────────────────
    serie15: {
"1905": {
    codice: "1905",
    descrizione: "maniglia per finestra serie 15 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 37.2,
    supplementoExtra: {
"43": 59.1,
"E03": 46.2,
"extra": 81.0
    }
},

"19150": {
    codice: "19150",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 30.7,
    supplementoExtra: {
"43": 52.7,
"E03": 38.5,
"extra": 74.6
    }
},
"19151": {
    codice: "19151",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 30.7,
    supplementoExtra: {
"43": 52.7,
"E03": 38.5,
"extra": 74.6
    }
},
"19152": {
    codice: "19152",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 30.7,
    supplementoExtra: {
"43": 52.7,
"E03": 38.5,
"extra": 74.6
    }
},

"49150": {
    codice: "49150",
    descrizione: "maniglia a pressione serie 15 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 64.4,
    supplementoExtra: {
"43": 95.5,
"E03": 78.2,
"extra": 108
    }
},
"49151": {
    codice: "49151",
    descrizione: "maniglia a pressione serie 15 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 64.4,
    supplementoExtra: {
"43": 95.5,
"E03": 78.2,
"extra": 108
    }
},

"29150": {
    codice: "29150",
    descrizione: "doppia maniglia serie 15 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "15",
    colori: ["56", "43", "E03"],
    supplemento: 76.1,
    supplementoExtra: {
"43": 132,
"E03": 89.0,
"extra": 164
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // SERIE 16
    // ───────────────────────────────────────────────────────────
    serie16: {
"1906": {
    codice: "1906",
    descrizione: "maniglia per finestra serie 16 con fissaggio a scomparsa e rosetta rotonda",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 53.7,
    supplementoExtra: {
"43": 103,
"E03": 61.3,
"extra": 97.5
    }
},

"19160": {
    codice: "19160",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 47.3,
    supplementoExtra: {
"43": 95.8,
"E03": 53.7,
"extra": 91.1
    }
},
"19161": {
    codice: "19161",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 47.3,
    supplementoExtra: {
"43": 95.8,
"E03": 53.7,
"extra": 91.1
    }
},
"19162": {
    codice: "19162",
    descrizione: "maniglia con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 47.3,
    supplementoExtra: {
"43": 95.8,
"E03": 53.7,
"extra": 91.1
    }
},

"49160": {
    codice: "49160",
    descrizione: "maniglia a pressione serie 16 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 80.9,
    supplementoExtra: {
"43": 139,
"E03": 93.4,
"extra": 125
    }
},
"49161": {
    codice: "49161",
    descrizione: "maniglia a pressione serie 16 con fissaggio a scomparsa e rosetta ovale",
    tipo: "finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 80.9,
    supplementoExtra: {
"43": 139,
"E03": 93.4,
"extra": 125
    }
},

"29160": {
    codice: "29160",
    descrizione: "doppia maniglia serie 16 apertura ad anta - rosetta inferiore fissata dall'esterno",
    tipo: "porta-finestra",
    serie: "16",
    colori: ["56", "43", "E03"],
    supplemento: 110,
    supplementoExtra: {
"43": 218,
"E03": 120,
"extra": 198
    }
}
    },

    // ───────────────────────────────────────────────────────────
    // ACCESSORI
    // ───────────────────────────────────────────────────────────
    accessori: {
"690": {
    codice: "690",
    descrizione: "rosetta per maniglia estraibile",
    tipo: "accessorio",
    colori: ["01", "56"],
    supplemento: 1.63
},
"691": {
    codice: "691",
    descrizione: "maniglia estraibile",
    tipo: "accessorio",
    colori: ["01", "56"],
    supplemento: 4.09
},
"100": {
    codice: "100",
    descrizione: "senza maniglia solo foro maniglia (per finestra)",
    tipo: "accessorio",
    colori: [],
    supplemento: -5.34
},
"100HY": {
    codice: "100HY",
    descrizione: "senza maniglia solo foro maniglia (per finestra)",
    tipo: "accessorio",
    colori: [],
    supplemento: -5.34
},
"1900": {
    codice: "1900",
    descrizione: "senza maniglia, foro per fissaggio a scomparsa della maniglia estraibile per finestre del produttore FSB",
    tipo: "accessorio",
    colori: [],
    supplemento: -5.34
},
"97": {
    codice: "97",
    descrizione: "senza maniglia solo foro maniglia (per porta-finestra con chiave)",
    tipo: "accessorio",
    colori: [],
    supplemento: -14.1
},
"99": {
    codice: "99",
    descrizione: "senza maniglia solo foro maniglia (con placca per porta-finestra con chiave)",
    tipo: "accessorio",
    colori: [],
    supplemento: -25.4
},
"96": {
    codice: "96",
    descrizione: "senza maniglia solo foro maniglia (con rosetta per porta-finestra con chiave)",
    tipo: "accessorio",
    colori: [],
    supplemento: -25.4
},
"70": {
    codice: "70",
    descrizione: "accessorio anta per protezione antiperforazione",
    tipo: "accessorio",
    colori: [],
    supplemento: 4.41
}
    }
};

// ═══════════════════════════════════════════════════════════════
// FUNZIONI HELPER
// ═══════════════════════════════════════════════════════════════

// Ottiene maniglia per codice
function getManigliaByCode(codice) {
    // ✅ v8.10: Cerca codice esatto
    for (const serie in MANIGLIE_FINSTRAL) {
if (serie === 'colori' || serie === 'accessori') continue;
if (MANIGLIE_FINSTRAL[serie][codice]) {
    return MANIGLIE_FINSTRAL[serie][codice];
}
    }
    
    // ✅ v8.10: Se non trovato e codice è 3 cifre, prova con "0" alla fine (712 → 7120)
    if (codice && codice.length === 3) {
const codiceEsteso = codice + "0";
for (const serie in MANIGLIE_FINSTRAL) {
    if (serie === 'colori' || serie === 'accessori') continue;
    if (MANIGLIE_FINSTRAL[serie][codiceEsteso]) {
console.log(`🔧 Maniglia: ${codice} → ${codiceEsteso} (padding)`);
return MANIGLIE_FINSTRAL[serie][codiceEsteso];
    }
}
    }
    
    return null;
}

// Ottiene supplemento per maniglia+colore
function getSupplemento(codiceManiglia, codiceColore) {
    const maniglia = getManigliaByCode(codiceManiglia);
    if (!maniglia) return 0;
    
    // Supplemento base
    let supplemento = maniglia.supplemento || 0;
    
    // Supplemento extra per colore specifico
    if (maniglia.supplementoExtra && maniglia.supplementoExtra[codiceColore]) {
supplemento = maniglia.supplementoExtra[codiceColore];
    }
    
    return supplemento;
}

// Ottiene descrizione colore
function getColoreDescrizione(codiceColore) {
    return MANIGLIE_FINSTRAL.colori[codiceColore] || codiceColore;
}

// Ottiene lista maniglie per tipo
function getManiglieByTipo(tipo) {
    const risultato = [];
    for (const serie in MANIGLIE_FINSTRAL) {
if (serie === 'colori' || serie === 'accessori') continue;
for (const codice in MANIGLIE_FINSTRAL[serie]) {
    const maniglia = MANIGLIE_FINSTRAL[serie][codice];
    if (maniglia.tipo === tipo) {
risultato.push(maniglia);
    }
}
    }
    return risultato;
}

// Export per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
MANIGLIE_FINSTRAL,
getManigliaByCode,
getSupplemento,
getColoreDescrizione,
getManiglieByTipo
    };
}
