/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 DATABASE CONFIGURAZIONI - Mapping OPZIONI_PRODOTTI → Dropdown Dashboard
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo file crea DATABASE_CONFIGURAZIONI usando OPZIONI_PRODOTTI (unica fonte)
 * Da caricare DOPO opzioni-prodotti.js e PRIMA di app.js
 * 
 * v2.0 (05/02/2026): Legge da OPZIONI_PRODOTTI v3.0.0 (unica fonte)
 * v1.0 (20/01/2026): Leggeva da OPZIONI (vecchio)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    // Verifica che OPZIONI_PRODOTTI sia disponibile
    if (!window.OPZIONI_PRODOTTI) {
        console.error('❌ database-configurazioni.js: window.OPZIONI_PRODOTTI non trovato! Caricare opzioni-prodotti.js prima.');
        return;
    }
    
    const P = window.OPZIONI_PRODOTTI;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 DATABASE_CONFIGURAZIONI
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.DATABASE_CONFIGURAZIONI = {
        
        // ─────────────────────────────────────────────────────────────────────
        // 🪟 INFISSI
        // ─────────────────────────────────────────────────────────────────────
        infissi: {
            azienda: {
                label: '🏭 Azienda',
                options: P.AZIENDE.infissi,
                allowCustom: true
            },
            finituraEst: {
                label: '🎨 Finitura Esterna',
                options: P.infissi.finiture.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
                allowCustom: false
            },
            finituraInt: {
                label: '🎨 Finitura Interna',
                options: P.infissi.finiture.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
                allowCustom: false
            },
            coloreEst: {
                label: '🌈 Colore Esterno',
                options: P.infissi.coloriPVC,
                optionsPVC: P.infissi.coloriPVC,
                optionsAlluminio: P.infissi.coloriAlluminio,
                optionsLegno: P.infissi.coloriLegno,
                allowCustom: true
            },
            coloreInt: {
                label: '🌈 Colore Interno',
                options: P.infissi.coloriPVC,
                optionsPVC: P.infissi.coloriPVC,
                optionsAlluminio: P.infissi.coloriAlluminio,
                optionsLegno: P.infissi.coloriLegno,
                allowCustom: true
            },
            tipoAnta: {
                label: '🚪 Tipo Anta',
                options: P.infissi.tipiAnta,
                allowCustom: true
            },
            vetro: {
                label: '💎 Vetro',
                options: P.infissi.vetri,
                allowCustom: true
            },
            maniglia: {
                label: '🔧 Maniglia',
                options: P.infissi.maniglie,
                allowCustom: true
            },
            coloreManiglia: {
                label: '🎨 Colore Maniglia',
                options: P.infissi.coloriManiglia,
                allowCustom: true
            },
            tagliTelaio: {
                label: '✂️ Tagli Telaio',
                options: P.infissi.tagliTelaio,
                allowCustom: false
            },
            allarme: {
                label: '🔔 Allarme',
                options: P.infissi.allarme,
                allowCustom: false
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🎚️ TAPPARELLE
        // ─────────────────────────────────────────────────────────────────────
        tapparelle: {
            azienda: {
                label: '🏭 Azienda',
                options: P.AZIENDE.tapparelle,
                allowCustom: true
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🏠 PERSIANE
        // ─────────────────────────────────────────────────────────────────────
        persiane: {
            azienda: {
                label: '🏭 Azienda',
                options: P.AZIENDE.persiane,
                allowCustom: true
            },
            modello: {
                label: '📋 Modello',
                options: P.persiane.modelli,
                allowCustom: true
            },
            tipo: {
                label: '📐 Tipo',
                options: P.persiane.tipiDescrittivi,
                allowCustom: false
            },
            apertura: {
                label: '🚪 Apertura',
                options: P.persiane.apertureDescrittive,
                allowCustom: false
            },
            fissaggio: {
                label: '🔩 Fissaggio',
                options: P.persiane.fissaggi,
                allowCustom: false
            },
            tipoTelaio: {
                label: '🪟 Tipo Telaio',
                options: P.persiane.tipiTelaio,
                allowCustom: true
            },
            battuta: {
                label: '📏 Battuta',
                options: P.persiane.battute,
                allowCustom: false
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🦟 ZANZARIERE
        // ─────────────────────────────────────────────────────────────────────
        zanzariere: {
            azienda: {
                label: '🏭 Azienda',
                options: P.AZIENDE.zanzariere,
                allowCustom: true
            },
            linea: {
                label: '📋 Linea',
                options: P.zanzariere.linee,
                allowCustom: false
            },
            fasciaColore: {
                label: '🎨 Fascia Colore',
                options: P.zanzariere.fasceColore,
                allowCustom: false
            },
            tipoRete: {
                label: '🕸️ Tipo Rete',
                options: P.zanzariere.tipiRete,
                allowCustom: false
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 📦 CASSONETTI
        // ─────────────────────────────────────────────────────────────────────
        cassonetti: {
            azienda: {
                label: '🏭 Azienda',
                options: P.AZIENDE.cassonetti,
                allowCustom: true
            },
            tipo: {
                label: '📐 Tipo',
                options: P.cassonetti.tipi,
                allowCustom: false
            },
            materiale: {
                label: '🧱 Materiale',
                options: P.cassonetti.materiali,
                allowCustom: false
            },
            codice: {
                label: '🏷️ Codice',
                options: [
                    ...P.cassonetti.codiciPVC.map(c => c.desc),
                    ...P.cassonetti.codiciLegno.map(c => c.desc)
                ],
                allowCustom: true
            },
            colore: {
                label: '🎨 Colore',
                options: ['Bianco', 'Avorio', 'Grigio', 'Marrone', 'Legno chiaro', 'Legno scuro'],
                allowCustom: true
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🔐 BLINDATE
        // ─────────────────────────────────────────────────────────────────────
        blindate: {
            azienda: {
                label: '🏭 Azienda',
                options: ['Oikos', 'Dierre', 'Alias', 'Gasperotti'],
                allowCustom: true
            },
            classe: {
                label: '🛡️ Classe Sicurezza',
                options: ['Classe 3', 'Classe 4', 'Classe 5'],
                allowCustom: false
            },
            pannelloEst: {
                label: '🎨 Pannello Esterno',
                options: ['Liscio', 'Pantografato', 'Bugna', 'Vetro'],
                allowCustom: true
            },
            pannelloInt: {
                label: '🎨 Pannello Interno',
                options: ['Liscio', 'Pantografato', 'Specchio', 'Laminato'],
                allowCustom: true
            }
        }
    };
    
    console.log('✅ database-configurazioni.js v2.0 caricato - legge da OPZIONI_PRODOTTI');
    
})();
