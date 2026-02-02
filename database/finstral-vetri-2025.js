// ============================================================================
// FINSTRAL VETRI 2025 - Database Prezzi Estratti da Listino EUR 2025/10
// ============================================================================
// Valido dalla settimana di consegna 4/2026
// Supplementi per m² di vetro (minimo fatturabile 0,4 m²)
// ============================================================================

window.FINSTRAL_VETRI_2025 = {
    version: '2025.10',
    note: 'Prezzi in €/m² - Minimo fatturabile 0,4 m²',
    
    // =========================================================================
    // PLUS-VALOR 2 (DOPPIO VETRO) - Ug ~1.1 W/m²K
    // =========================================================================
    
    doppio: {
        nome: 'Plus-Valor 2 (Doppio Vetro)',
        descrizione: 'Vetro basso-emissivo doppio, Ug ~1.1 W/m²K',
        
        // VETRO BASE - INCLUSO NEL PREZZO FINESTRA (supplemento = 0)
        base: {
            '2F42': { struttura: '4T-16-4v', spessore: 24, ug: 1.1, supplemento: 0, note: 'Bodysafe 24mm' },
            '2F48': { struttura: '4T-20-4v', spessore: 28, ug: 1.1, supplemento: 0, note: '⭐ BASE STANDARD 28mm - INCLUSO' },
            '2F63': { struttura: '4T-20-6v', spessore: 30, ug: 1.1, supplemento: 11.5 }
        },
        
        // CON MULTIPROTECT (sicurezza antieffrazione esterna)
        multiprotect: {
            // Spessore 24mm
            '2142': { struttura: '33.1v-14-4F', spessore: 24, ug: 1.1, classe: null, supplemento: 12.9, note: 'Sicurezza base' },
            '2742': { struttura: '33.2m-14-4F', spessore: 24, ug: 1.1, classe: 'P1A', supplemento: 27.3 },
            
            // Spessore 28mm
            '2148': { struttura: '33.1v-18-4F', spessore: 28, ug: 1.1, classe: null, supplemento: 12.9 },
            '2248': { struttura: '44.2v-15-4F', spessore: 28, ug: 1.1, classe: 'P2A', supplemento: 45.7, note: '⭐ CONSIGLIATO sicurezza' },
            '2348': { struttura: '44.4v-14-4F', spessore: 28, ug: 1.1, classe: 'P4A', supplemento: 68.8, note: 'Alta sicurezza' },
            '2N48': { struttura: '44.6v-14-4F', spessore: 28, ug: 1.1, classe: 'P5A', supplemento: 105, note: 'Massima sicurezza' },
            
            // Spessore 30mm
            '2143': { struttura: '33.1v-20-4F', spessore: 30, ug: 1.1, classe: null, supplemento: 12.9 },
            '2743': { struttura: '33.2m-20-4F', spessore: 30, ug: 1.1, classe: 'P1A', supplemento: 27.3 },
            '2243': { struttura: '44.2v-18-4F', spessore: 30, ug: 1.1, classe: 'P2A', supplemento: 47.5 },
            '2343': { struttura: '44.4v-16-4F', spessore: 30, ug: 1.1, classe: 'P4A', supplemento: 68.8 },
            '2N43': { struttura: '44.6v-16-4F', spessore: 30, ug: 1.1, classe: 'P5A', supplemento: 105 }
        },
        
        // CON MULTIPROTECT + BODYSAFE (sicurezza interna + esterna)
        multiprotectBodysafe: {
            // Spessore 28mm
            '21F8': { struttura: '33.1v-18-4T', spessore: 28, ug: 1.1, classe: null, supplemento: 40.3 },
            '22F8': { struttura: '44.2v-15-4T', spessore: 28, ug: 1.1, classe: 'P2A', supplemento: 73.1, note: '⭐ SICUREZZA MAGGIORATA' },
            '23F8': { struttura: '44.4v-14-4T', spessore: 28, ug: 1.1, classe: 'P4A', supplemento: 99.0 },
            '2NF8': { struttura: '44.6v-14-4T', spessore: 28, ug: 1.1, classe: 'P5A', supplemento: 128 },
            
            // Spessore 30mm
            '21F3': { struttura: '33.1v-20-4T', spessore: 30, ug: 1.1, classe: null, supplemento: 40.3 },
            '22F3': { struttura: '44.2v-18-4T', spessore: 30, ug: 1.1, classe: 'P2A', supplemento: 74.8 },
            '23F3': { struttura: '44.4v-16-4T', spessore: 30, ug: 1.1, classe: 'P4A', supplemento: 99.0 },
            '2NF3': { struttura: '44.6v-16-4T', spessore: 30, ug: 1.1, classe: 'P5A', supplemento: 128 }
        }
    },
    
    // =========================================================================
    // MAX-VALOR 3 (TRIPLO VETRO) - Ug ~0.5-0.9 W/m²K
    // =========================================================================
    
    triplo: {
        nome: 'Max-Valor 3 (Triplo Vetro)',
        descrizione: 'Vetro basso-emissivo triplo, Ug ~0.5-0.9 W/m²K',
        
        // TRIPLO CON BODYSAFE (base per triplo)
        base: {
            '1F443': { struttura: '4Tm-8-4F-10-4m', spessore: 30, ug: 0.9, supplemento: 70.1 },
            '1F444': { struttura: '4Tm-14-4F-14-4m', spessore: 40, ug: 0.6, supplemento: 72.9, note: '⭐ TRIPLO BASE 40mm' },
            '1F464': { struttura: '4Tm-13-4F-13-6m', spessore: 40, ug: 0.7, supplemento: 85.2 },
            '1H664': { struttura: '6Tm-10-6F-12-6m', spessore: 40, ug: 0.8, supplemento: 106 },
            '1F449': { struttura: '4Tm-18-4F-16-4m', spessore: 46, ug: 0.5, supplemento: 74.2, note: '⭐ TRIPLO BASE 46mm - MIGLIOR Ug' },
            '1F469': { struttura: '4Tm-16-4F-16-6m', spessore: 46, ug: 0.6, supplemento: 85.2 },
            '1H669': { struttura: '6Tm-14-6F-14-6m', spessore: 46, ug: 0.6, supplemento: 106 },
            '1H46A': { struttura: '6Tm-18-4F-18-6m', spessore: 52, ug: 0.5, supplemento: 102 },
            '1H66A': { struttura: '6Tm-18-6F-16-6m', spessore: 52, ug: 0.5, supplemento: 110 }
        },
        
        // TRIPLO CON MULTIPROTECT (sicurezza antieffrazione)
        multiprotect: {
            // Spessore 40mm
            '11444': { struttura: '33.1m-12-4F-13-4m', spessore: 40, ug: 0.7, classe: null, supplemento: 82.4 },
            '12444': { struttura: '44.2m-10-4F-13-4m', spessore: 40, ug: 0.7, classe: 'P2A', supplemento: 114, note: '⭐ TRIPLO + SICUREZZA P2A' },
            '13444': { struttura: '44.4m-10-4F-12-4m', spessore: 40, ug: 0.8, classe: 'P4A', supplemento: 139 },
            '1N444': { struttura: '44.6m-10-4F-12-4m', spessore: 40, ug: 0.8, classe: 'P5A', supplemento: 167 },
            
            // Spessore 46mm
            '11449': { struttura: '33.1m-16-4F-15-4m', spessore: 46, ug: 0.6, classe: null, supplemento: 82.4 },
            '12449': { struttura: '44.2m-15-4F-14-4m', spessore: 46, ug: 0.6, classe: 'P2A', supplemento: 117, note: '⭐ TRIPLO 46mm + P2A' },
            '13449': { struttura: '44.4m-14-4F-14-4m', spessore: 46, ug: 0.6, classe: 'P4A', supplemento: 143 },
            '1N449': { struttura: '44.6m-14-4F-14-4m', spessore: 46, ug: 0.6, classe: 'P5A', supplemento: 171 },
            
            // Spessore 52mm
            '1144A': { struttura: '33.1m-18-4F-20-4m', spessore: 52, ug: 0.5, classe: null, supplemento: 86.5 },
            '1344A': { struttura: '44.4m-18-4F-16-4m', spessore: 52, ug: 0.5, classe: 'P4A', supplemento: 147 },
            '1N44A': { struttura: '44.6m-18-4F-16-4m', spessore: 52, ug: 0.5, classe: 'P5A', supplemento: 176 }
        },
        
        // TRIPLO CON MULTIPROTECT + BODYSAFE (sicurezza maggiorata)
        multiprotectBodysafe: {
            // Spessore 40mm
            '114F4': { struttura: '33.1m-12-4F-13-4Tm', spessore: 40, ug: 0.7, classe: null, supplemento: 114 },
            '124F4': { struttura: '44.2m-10-4F-13-4Tm', spessore: 40, ug: 0.7, classe: 'P2A', supplemento: 147, note: '⭐ TRIPLO SICUREZZA MAGGIORATA' },
            '134F4': { struttura: '44.4m-10-4F-12-4Tm', spessore: 40, ug: 0.8, classe: 'P4A', supplemento: 170 },
            '1N4F4': { struttura: '44.6m-10-4F-12-4Tm', spessore: 40, ug: 0.8, classe: 'P5A', supplemento: 199 },
            '126H4': { struttura: '44.2m-8-6F-12-6Tm', spessore: 40, ug: 0.8, classe: 'P2A', supplemento: 166 },
            '136H4': { struttura: '44.4m-8-6F-10-6Tm', spessore: 40, ug: 0.9, classe: 'P4A', supplemento: 192 }
        }
    },
    
    // =========================================================================
    // VETRI SATINATI (per privacy)
    // =========================================================================
    
    satinati: {
        nome: 'Vetri Satinati',
        descrizione: 'Vetro satinato bianco per privacy',
        
        // SATINATO PER DOPPIO VETRO
        doppio: {
            '48': { 
                nome: 'Vetro satinato bianco', 
                spessore: 4, 
                supplemento: 54.7,
                superficieMax: '3000 × 3200',
                vetroAdattabile: 'A',  // Colonna "Vetri ornamentali/speciali disponibili"
                note: '⭐ SATINATO DOPPIO STANDARD'
            },
            '49': { 
                nome: 'Satinato + Multiprotect 44.2 (P2A)', 
                spessore: 9, 
                supplemento: 54.7,
                superficieMax: '2400 × 3200',
                vetroAdattabile: 'E',  // Sostituisce Multiprotect 44.2 (P2A)
                classe: 'P2A',
                note: '⭐ SATINATO + SICUREZZA P2A - Aspetto diverso da cod.48'
            },
            '486': { 
                nome: 'Vetro satinato bianco 6mm', 
                spessore: 6, 
                supplemento: 54.7,
                superficieMax: '2400 × 3200',
                vetroAdattabile: 'B'
            }
        },
        
        // SATINATO BODYSAFE PER TRIPLO VETRO
        triplo: {
            '48T': { 
                nome: 'Vetro satinato bianco Bodysafe', 
                spessore: 4, 
                supplemento: 83.4,
                superficieMax: '2240 × 3200',
                vetroAdattabile: 'T',
                note: '⭐ SATINATO TRIPLO STANDARD'
            },
            '486T': { 
                nome: 'Vetro satinato bianco Bodysafe 6mm', 
                spessore: 6, 
                supplemento: 88.0,
                superficieMax: '2400 × 3200',
                vetroAdattabile: 'U'
            },
            '48TX': { 
                nome: 'Vetro satinato bianco Bodysafe (vetro a gradino smaltato)', 
                spessore: 4, 
                supplemento: 85.1,
                superficieMax: '2240 × 3200',
                vetroAdattabile: 'R',
                note: 'Per Nova-line Cristal Twin e Nova-line Twin'
            }
        }
    },
    
    // =========================================================================
    // LEGENDA VETRI ADATTABILI
    // =========================================================================
    // I codici lettera nella colonna "Vetri ornamentali/speciali disponibili" 
    // delle tabelle Plus-Valor 2 e Max-Valor 3 indicano quali ornamentali
    // si possono usare con quel tipo di vetro base.
    
    vetriAdattabili: {
        'A': 'Ornamentali 4mm per Plus-Valor 2 (doppio)',
        'B': 'Ornamentali 6mm per Plus-Valor 2 (doppio)',
        'E': 'Sostituisce Multiprotect 44.2 (P2A) - Per cod.49 satinato',
        'T': 'Bodysafe 4mm per Max-Valor 3 (triplo)',
        'U': 'Bodysafe 6mm per Max-Valor 3 (triplo)',
        'R': 'Bodysafe vetro a gradino smaltato (Nova-line Cristal/Twin)'
    },
    
    // =========================================================================
    // CLASSI SICUREZZA ANTIEFFRAZIONE
    // =========================================================================
    
    classiSicurezza: {
        'P1A': { descrizione: 'Resistenza base antieffrazione', tempo: '1 min' },
        'P2A': { descrizione: 'Resistenza media antieffrazione (consigliata)', tempo: '3 min' },
        'P4A': { descrizione: 'Resistenza alta antieffrazione', tempo: '5 min' },
        'P5A': { descrizione: 'Resistenza molto alta antieffrazione', tempo: '10 min' }
    }
};

// =========================================================================
// TABELLA RIASSUNTIVA - VETRI PRINCIPALI CON PREZZI
// =========================================================================

window.FINSTRAL_VETRI_PRINCIPALI = {
    
    // ═══════════════════════════════════════════════════════════════════════
    // DOPPIO VETRO (Plus-Valor 2)
    // ═══════════════════════════════════════════════════════════════════════
    
    'DOPPIO BASE (2F48)': { 
        codice: '2F48', 
        supplemento: 0, 
        ug: 1.1,
        spessore: 28,
        note: '⭐ INCLUSO nel prezzo finestra' 
    },
    
    'DOPPIO + SICUREZZA P2A (2248)': { 
        codice: '2248', 
        supplemento: 45.7, 
        ug: 1.1,
        spessore: 28,
        classe: 'P2A',
        note: 'Sicurezza consigliata'
    },
    
    'DOPPIO + SICUREZZA P4A (2348)': { 
        codice: '2348', 
        supplemento: 68.8, 
        ug: 1.1,
        spessore: 28,
        classe: 'P4A',
        note: 'Alta sicurezza'
    },
    
    'DOPPIO SICUREZZA MAGGIORATA P2A (22F8)': { 
        codice: '22F8', 
        supplemento: 73.1, 
        ug: 1.1,
        spessore: 28,
        classe: 'P2A',
        note: '⭐ Multiprotect + Bodysafe (interno+esterno)'
    },
    
    'DOPPIO SICUREZZA MAGGIORATA P4A (23F8)': { 
        codice: '23F8', 
        supplemento: 99.0, 
        ug: 1.1,
        spessore: 28,
        classe: 'P4A',
        note: 'Multiprotect P4A + Bodysafe'
    },
    
    'DOPPIO SATINATO (48)': { 
        codice: '48', 
        supplemento: 54.7, 
        spessore: 4,
        vetroAdattabile: 'A',
        note: '⭐ Satinato per privacy - vetri tipo A'
    },
    
    'DOPPIO SATINATO + SICUREZZA P2A (49)': { 
        codice: '49', 
        supplemento: 54.7, 
        spessore: 9,
        classe: 'P2A',
        vetroAdattabile: 'E',
        note: '⭐ Satinato + P2A - vetri tipo E (sostituisce 44.2)'
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TRIPLO VETRO (Max-Valor 3)
    // ═══════════════════════════════════════════════════════════════════════
    
    'TRIPLO BASE 40mm (1F444)': { 
        codice: '1F444', 
        supplemento: 72.9, 
        ug: 0.6,
        spessore: 40,
        note: '⭐ Triplo standard'
    },
    
    'TRIPLO BASE 46mm (1F449)': { 
        codice: '1F449', 
        supplemento: 74.2, 
        ug: 0.5,
        spessore: 46,
        note: '⭐ Triplo miglior isolamento (Ug 0.5)'
    },
    
    'TRIPLO + SICUREZZA P2A 40mm (12444)': { 
        codice: '12444', 
        supplemento: 114, 
        ug: 0.7,
        spessore: 40,
        classe: 'P2A',
        note: 'Triplo + sicurezza consigliata'
    },
    
    'TRIPLO + SICUREZZA P2A 46mm (12449)': { 
        codice: '12449', 
        supplemento: 117, 
        ug: 0.6,
        spessore: 46,
        classe: 'P2A',
        note: '⭐ Triplo + sicurezza P2A'
    },
    
    'TRIPLO + SICUREZZA P4A 46mm (13449)': { 
        codice: '13449', 
        supplemento: 143, 
        ug: 0.6,
        spessore: 46,
        classe: 'P4A',
        note: 'Triplo alta sicurezza'
    },
    
    'TRIPLO SICUREZZA MAGGIORATA P2A (124F4)': { 
        codice: '124F4', 
        supplemento: 147, 
        ug: 0.7,
        spessore: 40,
        classe: 'P2A',
        note: '⭐ Triplo + Multiprotect + Bodysafe'
    },
    
    'TRIPLO SICUREZZA MAGGIORATA P4A (134F4)': { 
        codice: '134F4', 
        supplemento: 170, 
        ug: 0.8,
        spessore: 40,
        classe: 'P4A',
        note: 'Triplo + Multiprotect P4A + Bodysafe'
    },
    
    'TRIPLO SATINATO Bodysafe (48T)': { 
        codice: '48T', 
        supplemento: 83.4, 
        spessore: 4,
        vetroAdattabile: 'T',
        note: '⭐ Satinato per triplo - vetri tipo T'
    },
    
    'TRIPLO SATINATO Bodysafe 6mm (486T)': { 
        codice: '486T', 
        supplemento: 88.0, 
        spessore: 6,
        vetroAdattabile: 'U',
        note: 'Satinato 6mm per triplo - vetri tipo U'
    }
};

// =========================================================================
// FUNZIONI HELPER
// =========================================================================

// Export (funzioni calcolaSupplementoVetro e getVetriPerTipo sono in finstral-opzioni.js)
if (typeof window !== 'undefined') {
    console.log('🪟 FINSTRAL_VETRI_2025 v2025.10 caricato');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        FINSTRAL_VETRI_2025, 
        FINSTRAL_VETRI_PRINCIPALI
    };
}

