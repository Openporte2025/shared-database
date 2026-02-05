/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 DATABASE CONFIGURAZIONI - Mapping OPZIONI → Dropdown Dashboard
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo file crea DATABASE_CONFIGURAZIONI usando le costanti da opzioni-comuni.js
 * Da caricare DOPO opzioni-comuni.js e PRIMA di app.js
 * 
 * Versione: 1.0
 * Data: 20 Gennaio 2026
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    // Verifica che OPZIONI sia disponibile
    if (!window.OPZIONI) {
        console.error('❌ database-configurazioni.js: window.OPZIONI non trovato! Caricare opzioni-comuni.js prima.');
        return;
    }
    
    const O = window.OPZIONI;
    
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
                options: O.AZIENDE_INFISSI,
                allowCustom: true
            },
            finituraEst: {
                label: '🎨 Finitura Esterna',
                options: ['PVC', 'Alluminio', 'Legno', 'Legno-Alluminio'],
                allowCustom: false
            },
            finituraInt: {
                label: '🎨 Finitura Interna',
                options: ['PVC', 'Alluminio', 'Legno', 'Legno-Alluminio'],
                allowCustom: false
            },
            coloreEst: {
                label: '🌈 Colore Esterno',
                options: O.COLORI_PVC,
                optionsPVC: O.COLORI_PVC,
                optionsAlluminio: O.COLORI_ALLUMINIO,
                optionsLegno: O.COLORI_LEGNO,
                allowCustom: true
            },
            coloreInt: {
                label: '🌈 Colore Interno',
                options: O.COLORI_PVC,
                optionsPVC: O.COLORI_PVC,
                optionsAlluminio: O.COLORI_ALLUMINIO,
                optionsLegno: O.COLORI_LEGNO,
                allowCustom: true
            },
            vetro: {
                label: '💎 Vetro',
                options: ['Doppio standard', 'Triplo', 'Basso emissivo', 'Sicurezza', 'Acustico', 'Solare'],
                allowCustom: true
            },
            maniglia: {
                label: '🔧 Maniglia',
                options: ['Standard', 'Hoppe SecuSelect', 'Hoppe Tokyo', 'Olivari', 'Colombo'],
                allowCustom: true
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🎚️ TAPPARELLE
        // ─────────────────────────────────────────────────────────────────────
        tapparelle: {
            azienda: {
                label: '🏭 Azienda',
                options: O.AZIENDE_TAPPARELLE,
                allowCustom: false
            },
            modello: {
                label: '📋 Modello Telo',
                options: O.MODELLI_TAPPARELLE['Plasticino'].map(m => m.nome),
                allowCustom: true
            },
            colore: {
                label: '🎨 Colore Telo',
                options: [
                    ...O.COLORI_TAPPARELLE_PLASTICINO['ALLUMINIO_UNITA'],
                    ...O.COLORI_TAPPARELLE_PLASTICINO['ALLUMINIO_LEGNO'],
                    ...O.COLORI_TAPPARELLE_PLASTICINO['PVC']
                ],
                allowCustom: true
            },
            guidaTipo: {
                label: '🛤️ Tipo Guida',
                options: O.GUIDE_PLASTICINO,
                allowCustom: true
            },
            guidaColore: {
                label: '🎨 Colore Guida',
                options: O.getColoriGuide(),
                allowCustom: true
            },
            tipoManovra: {
                label: '⚙️ Tipo Manovra',
                options: ['Manuale cinghia', 'Manuale manovella', 'Motorizzata'],
                allowCustom: false
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // ⚡ MOTORI
        // ─────────────────────────────────────────────────────────────────────
        motori: {
            azienda: {
                label: '🏭 Azienda',
                options: ['Somfy', 'Nice', 'Came', 'Faac'],
                allowCustom: true
            },
            modello: {
                label: '📋 Modello',
                options: O.MOTORI_SOMFY.map(m => m.modello),
                allowCustom: true
            },
            comando: {
                label: '🎮 Comando',
                options: O.COMANDI_SOMFY.map(c => c.nome),
                allowCustom: true
            },
            accessori: {
                label: '🔧 Accessori',
                options: O.ACCESSORI_MOTORE_SOMFY.map(a => a.nome),
                allowCustom: true
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🚪 PERSIANE
        // ─────────────────────────────────────────────────────────────────────
        persiane: {
            azienda: {
                label: '🏭 Azienda',
                options: O.AZIENDE_PERSIANE,
                allowCustom: true
            },
            tipo: {
                label: '📐 Tipo',
                options: O.TIPI_PERSIANA,
                allowCustom: false
            },
            apertura: {
                label: '🚪 Apertura',
                options: O.APERTURE_PERSIANA,
                allowCustom: false
            },
            colore: {
                label: '🎨 Colore',
                options: ['Bianco', 'Avorio', 'Grigio', 'Marrone', 'Verde', 'Antracite', 'RAL a richiesta'],
                allowCustom: true
            },
            cardini: {
                label: '🔩 Cardini',
                options: O.CARDINI_PUNTO_PERSIANE.map(c => c.nome),
                allowCustom: true
            },
            fermapersiane: {
                label: '🔒 Fermapersiane',
                options: O.FERMAPERSIANE_PUNTO_PERSIANE.map(f => f.nome),
                allowCustom: true
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🦟 ZANZARIERE
        // ─────────────────────────────────────────────────────────────────────
        zanzariere: {
            azienda: {
                label: '🏭 Azienda',
                options: O.AZIENDE_ZANZARIERE,
                allowCustom: false
            },
            linea: {
                label: '📦 Linea',
                options: O.LINEE_ZANZARIERE_PALAGINA,
                allowCustom: false
            },
            modello: {
                label: '📋 Modello',
                // MODELLI_ZANZARIERE_PALAGINA è un oggetto {linea: [modelli]}
                options: Object.values(O.MODELLI_ZANZARIERE_PALAGINA).flat(),
                allowCustom: true
            },
            coloreTelaio: {
                label: '🎨 Colore Telaio',
                // COLORI_TELAIO_PALAGINA è un oggetto {fascia: [colori]}
                options: Object.values(O.COLORI_TELAIO_PALAGINA).flat(),
                allowCustom: true
            },
            tipoRete: {
                label: '🕸️ Tipo Rete',
                options: O.TIPI_RETE_PALAGINA,
                allowCustom: false
            }
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 📦 CASSONETTI
        // ─────────────────────────────────────────────────────────────────────
        cassonetti: {
            azienda: {
                label: '🏭 Azienda',
                options: O.AZIENDE_CASSONETTI,
                allowCustom: true
            },
            tipo: {
                label: '📐 Tipo',
                options: O.TIPI_CASSONETTO,
                allowCustom: false
            },
            materiale: {
                label: '🧱 Materiale',
                options: O.MATERIALI_CASSONETTO,
                allowCustom: false
            },
            codice: {
                label: '🏷️ Codice',
                options: [
                    ...O.CODICI_CASSONETTO_PVC.map(c => c.desc),
                    ...O.CODICI_CASSONETTO_LEGNO.map(c => c.desc)
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
    
    console.log('✅ database-configurazioni.js v1.0 caricato - DATABASE_CONFIGURAZIONI disponibile');
    
})();
