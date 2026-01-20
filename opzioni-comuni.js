/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📦 OPZIONI COMUNI - DATABASE CONDIVISO v1.2
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo file contiene TUTTE le opzioni e costanti condivise tra:
 * - App iPad OpenPorte (rilievo-test)
 * - Dashboard Rilievi (dashboard-test)
 * - Editor Posizioni
 * 
 * ⚠️ MODIFICA SOLO QUESTO FILE per aggiornare le opzioni ovunque!
 * 
 * Hosting: https://openporte2025.github.io/shared-database/opzioni-comuni.js
 * 
 * Versione: 1.2.0 (IIFE - NO CONFLITTI)
 * Data: 20 Gennaio 2026
 * 
 * NOTA: Tutte le costanti sono SOLO dentro window.OPZIONI per evitare
 * conflitti con variabili già dichiarate nelle app.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏭 AZIENDE
    // ═══════════════════════════════════════════════════════════════════════════
    
    const AZIENDE_INFISSI = [
        'Finstral',
        'Oknoplast',
        'Schüco',
        'Internorm',
        'Rehau',
        'Aluk',
        'Metra'
    ];
    
    const AZIENDE_PERSIANE = [
        'P. Persiane',
        'Pail',
        'Gibus',
        'Schenker'
    ];
    
    const AZIENDE_TAPPARELLE = [
        'Plasticino',
        'New Solar',
        'Estella'
    ];
    
    const AZIENDE_ZANZARIERE = [
        'Palagina',
        'MV Line',
        'Bettio'
    ];
    
    const AZIENDE_CASSONETTI = [
        'Finstral',
        'Alpac',
        'Elicent'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 COLORI TAPPARELLE PLASTICINO
    // ═══════════════════════════════════════════════════════════════════════════
    
    const COLORI_TAPPARELLE_PLASTICINO = {
        // ALLUMINIO COIBENTATO - Tinta Unita
        'ALLUMINIO_UNITA': [
            'Bianco 01', 'Bianco 9010', 'Avorio 34', 'Crema 39', 
            'Grigio 07', 'Argento 05', 'Grigio 10', 'Grigio 23',
            'Salmone 06', 'Ocra 03', 'Marrone 08', 'Marrone 04', 
            'Marrone 48', 'Marrone 79', 'Verde 43', 'Verde 09',
            'Verde 83', 'Verde 29', 'Rosso 02', 'Blu 35', 'Noce 61'
        ],
        // ALLUMINIO COIBENTATO - Tinta Legno
        'ALLUMINIO_LEGNO': [
            'Pino 52', 'Rovere 56', 'Teak 44', 'Ciliegio 33', 
            'Ciliegio 60', 'Noce 47'
        ],
        // ALLUMINIO COIBENTATO - Tinta Raffaello
        'ALLUMINIO_RAFFAELLO': [
            'Grigio Raffaello R94', 'Verde Raffaello R99', 
            'Marrone Raffaello R91', 'Rosso Raffaello R66'
        ],
        // PVC
        'PVC': [
            'Bianco 01', 'Avorio 34', 'Beige 17', 'Beige 502',
            'Grigio 07', 'Grigio 10', 'Marrone 81*', 'Marrone 0197*',
            'Verde 06', 'Noce 37*', 'Nero 88*', 'Blu 15*', 'Blu 95*',
            'Bruno 68', 'Bronzo', 'Ocra 84'
        ]
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛤️ GUIDE PLASTICINO
    // ═══════════════════════════════════════════════════════════════════════════
    
    const GUIDE_PLASTICINO = [
        // Alluminio Estruso 30x25x30
        'TG15 - Guide 30x25x30 Finestra',
        'TG10 - Guide 30x25x30 Portafinestra',
        'TG30 - Guide 30x25x30 Barra 6800mm',
        // Alluminio Estruso 28x17x28 Ribassato
        'TG25RIB - Guide 28x17x28 Ribassato Finestra',
        'TG20RIB - Guide 28x17x28 Ribassato Portafinestra',
        'TG35RIB - Guide 28x17x28 Ribassato Barra',
        // Alluminio Estruso 28x17x28 Standard
        'TG25 - Guide 28x17x28 Finestra',
        'TG20 - Guide 28x17x28 Portafinestra',
        'TG35 - Guide 28x17x28 Barra',
        // Ferro Zincato 21x20x21
        'PF2 - Guide 21x20x21 Ferro Zn Finestra',
        'PF4 - Guide 21x20x21 Ferro Zn Portafinestra',
        'PF1 - Guide 21x20x21 Ferro Zn Barra'
    ];
    
    const COLORI_GUIDE_PLASTICINO = {
        // Anodizzati standard
        'ANODIZZATO': [
            'Argento', 'Bronzo', 'Elox', 'Bianco'
        ],
        // Verniciati RAL
        'VERNICIATO': [
            'Avorio RAL 1013', 'Verde RAL 6005', 
            'Marrone RAL 8014', 'Marrone RAL 8017', 'Marrone RAL 8019'
        ]
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 MODELLI TAPPARELLE PER AZIENDA
    // ═══════════════════════════════════════════════════════════════════════════
    
    const MODELLI_TAPPARELLE = {
        'Plasticino': [
            // Alluminio Coibentato Media/Alta Densità
            { cod: 'TA01', nome: 'Tipo ALUPROFIL MD 13x55', dim: '13x55', tipo: 'Alluminio Coibentato' },
            { cod: 'TA25', nome: 'Tipo ALUPROFIL AD 13x55', dim: '13x55', tipo: 'Alluminio Coibentato' },
            { cod: 'TA05', nome: 'Tipo ALUPROFIL MD 9x41', dim: '9x41', tipo: 'Alluminio Coibentato' },
            { cod: 'TA30', nome: 'Tipo ALUPROFIL AD 9x41', dim: '9x41', tipo: 'Alluminio Coibentato' },
            { cod: 'TA42', nome: 'Tipo ALUPROFIL MD 8,5x32', dim: '8.5x32', tipo: 'Alluminio Coibentato' },
            { cod: 'TA07', nome: 'Tipo ALUPROFIL MD 8x37', dim: '8x37', tipo: 'Alluminio Coibentato' },
            // Acciaio Coibentato
            { cod: 'TA15', nome: 'Tipo STEELPROFIL 13x55', dim: '13x55', tipo: 'Acciaio Coibentato' },
            { cod: 'TA20', nome: 'Tipo STEELPROFIL 9x40', dim: '9x40', tipo: 'Acciaio Coibentato' },
            // PVC
            { cod: 'A01', nome: 'Tipo ANTIGRANDINE 14x50', dim: '14x50', tipo: 'PVC' },
            { cod: 'A10', nome: 'Tipo PESANTE 14x50', dim: '14x50', tipo: 'PVC' },
            { cod: 'A16', nome: 'Tipo MINI 10 11x32', dim: '11x32', tipo: 'PVC' },
            { cod: 'A15', nome: 'Tipo MINI 8 8x33', dim: '8x33', tipo: 'PVC' },
            // Alluminio Estruso Sicurezza
            { cod: 'TA10', nome: 'Tipo ALUBLIND 13x45', dim: '13x45', tipo: 'Alluminio Sicurezza' },
            { cod: 'TA13', nome: 'Tipo ALUBLIND 9x27', dim: '9x27', tipo: 'Alluminio Sicurezza' },
            // Termoisolante
            { cod: 'A18', nome: 'Tipo COMBI 13x53', dim: '13x53', tipo: 'Termoisolante' },
            { cod: 'A20', nome: 'Tipo COMBI 10x39', dim: '10x39', tipo: 'Termoisolante' },
            // Orientabili
            { cod: 'A40', nome: 'Tipo ORIENTA', dim: '', tipo: 'Orientabile' },
            // Areazione
            { cod: 'A50', nome: 'Tipo ESTELLA CLASSIC', dim: '', tipo: 'Areazione' }
        ],
        'New Solar': [],
        'Estella': []
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 DATABASE MOTORI SOMFY
    // ═══════════════════════════════════════════════════════════════════════════
    
    const MOTORI_SOMFY = [
        { id: 'oximo_20', modello: 'Oximo 50 io 20/17', coppia: 20, prezzo: 137.66 },
        { id: 'oximo_30', modello: 'Oximo 50 io 30/17', coppia: 30, prezzo: 145.83 },
        { id: 'rs100_hybrid', modello: 'RS100 io hybrid 20/17', coppia: 20, prezzo: 836.95 },
        { id: 'lt50_helios', modello: 'LT 50 Helios WT 30/17', coppia: 30, prezzo: 119.88 },
        { id: 'lt60_orion', modello: 'LT60 Orion S 55/17', coppia: 55, prezzo: 174.00 }
    ];
    
    const ACCESSORI_MOTORE_SOMFY = [
        { id: 'supporto', nome: 'Supporto operatore da avvitare', prezzo: 94.60 },
        { id: 'corona_60', nome: 'Corona OTT.60 I', prezzo: 17.67 },
        { id: 'ruota_60', nome: 'Ruota per rullo ottagonale Ø60mm', prezzo: 21.00 },
        { id: 'izymo', nome: 'IZYMO Shutter Receiver io', prezzo: 66.59 }
    ];
    
    const COMANDI_SOMFY = [
        { id: 'amy1', nome: 'Amy 1 io + cornice quadrata', prezzo: 23.46 },
        { id: 'situo1', nome: 'Situo 1 IO Pure', prezzo: 84.20 },
        { id: 'situo5', nome: 'Situo 5 IO Pure', prezzo: 111.10 },
        { id: 'smoove', nome: 'Smoove Origin IO', prezzo: 77.60 }
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 ACCESSORI TAPPARELLA MANUALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    const ACCESSORI_TAPPARELLA = [
        { id: 'rullo', label: 'Rullo ottagonale', icon: '🔄' },
        { id: 'supporti', label: 'Supporti + Cuscinetti', icon: '🔩' },
        { id: 'calotta', label: 'Calotta regolabile', icon: '🎩' },
        { id: 'puleggia', label: 'Puleggia', icon: '⚙️' },
        { id: 'avvolgitore', label: 'Avvolgitore + Cassetta', icon: '📦' },
        { id: 'cintino', label: 'Cintino', icon: '🎗️' },
        { id: 'passacinghia', label: 'Passacinghia', icon: '🔗' },
        { id: 'ganci', label: 'Ganci a molla', icon: '🪝' },
        { id: 'guide', label: 'Guide', icon: '🛤️' }
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏠 PERSIANE - PUNTO PERSIANE
    // ═══════════════════════════════════════════════════════════════════════════
    
    const CARDINI_PUNTO_PERSIANE = [
        { codice: 'C.SAF90', nome: 'Cardine SAF a Muro 90°', prezzo: 8.50 },
        { codice: 'C.SAF135', nome: 'Cardine SAF a Muro 135°', prezzo: 9.20 },
        { codice: 'C.SAF180', nome: 'Cardine SAF a Muro 180°', prezzo: 10.00 },
        { codice: 'C.AVVIT', nome: 'Cardine Avvitabile Standard', prezzo: 6.80 },
        { codice: 'C.FISSO', nome: 'Cardine Fisso Tradizionale', prezzo: 5.50 },
        { codice: 'C.REG', nome: 'Cardine Regolabile', prezzo: 12.00 }
    ];
    
    const FERMAPERSIANE_PUNTO_PERSIANE = [
        { codice: 'K.EASY', nome: 'Fermapersiana Easy Magnetico', prezzo: 15.00 },
        { codice: 'K.CLICK', nome: 'Fermapersiana Click a Scatto', prezzo: 12.50 },
        { codice: 'K.STOP', nome: 'Fermapersiana Stop Tradizionale', prezzo: 8.00 },
        { codice: 'K.GANCIO', nome: 'Gancio Ferma Anta', prezzo: 4.50 },
        { codice: 'K.ASTA', nome: 'Asta Ferma Persiana', prezzo: 6.00 }
    ];
    
    const TIPI_PERSIANA = [
        'F2 - 2 Ante',
        'F3 - 3 Ante', 
        'F4 - 4 Ante',
        'PF2 - Portafinestra 2 Ante',
        'PF3 - Portafinestra 3 Ante',
        'PF4 - Portafinestra 4 Ante'
    ];
    
    const APERTURE_PERSIANA = [
        'DX - Destra',
        'SX - Sinistra',
        'DX+SX - Centrale',
        'LIB/A - Libro Ante',
        'SCO - Scorrevole'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 COLORI INFISSI FINSTRAL
    // ═══════════════════════════════════════════════════════════════════════════
    
    const COLORI_PVC = [
        '01 - Bianco',
        '45 - Bianco satinato',
        '27 - Bianco crema satinato',
        '42 - Bianco goffrato',
        '07 - Bianco crema goffrato',
        '36 - Grigio topo',
        '46 - Grigio seta',
        '06 - Grigio (⚠️ scade 32/2026)',
        '13 - Castagno decoro legno',
        '19 - Rovere decoro legno',
        '55 - Noce chiaro decoro legno'
    ];
    
    const COLORI_ALLUMINIO = [
        'L13 - Castagno verniciato',
        'L14 - Mogano verniciato',
        'L16 - Douglas verniciato',
        'L18 - Noce verniciato',
        'L19 - Rovere verniciato',
        'L55 - Noce chiaro verniciato',
        'LX01 - Rovere naturale',
        'LX02 - Ciliegio scuro',
        'LX03 - Pino verniciato',
        'LX04 - Rovere venato'
    ];
    
    const COLORI_LEGNO = [
        'G0 - Rovere naturale',
        'G0 - Faggio naturale',
        'G0 - Acero naturale',
        'G1 - Rovere tinto',
        'G1 - Noce',
        'G1 - Ciliegio',
        'G2 - Wengé',
        'G2 - Mogano',
        'G2 - Teak',
        'G3 - Essenze speciali',
        'G3 - RAL su legno'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🦟 ZANZARIERE PALAGINA
    // ═══════════════════════════════════════════════════════════════════════════
    
    const LINEE_ZANZARIERE_PALAGINA = [
        'SLIM 45',
        'SLIM 50',
        'CLASSIC',
        'PLISSE',
        'SCORREVOLE'
    ];
    
    const MODELLI_ZANZARIERE_PALAGINA = {
        'SLIM 45': ['Verticale', 'Laterale', 'Anta Battente'],
        'SLIM 50': ['Verticale', 'Laterale', 'Anta Battente'],
        'CLASSIC': ['Verticale', 'Laterale'],
        'PLISSE': ['Verticale', 'Laterale 1 Anta', 'Laterale 2 Ante'],
        'SCORREVOLE': ['1 Anta', '2 Ante', '3 Ante']
    };
    
    const FASCE_COLORE_PALAGINA = [
        'Fascia A - Standard',
        'Fascia B - Intermedia',
        'Fascia C - Premium',
        'Fascia D - RAL'
    ];
    
    const COLORI_TELAIO_PALAGINA = {
        'A': ['Bianco RAL 9016', 'Avorio RAL 1013', 'Marrone RAL 8017'],
        'B': ['Grigio RAL 7035', 'Grigio RAL 7016', 'Nero RAL 9005'],
        'C': ['Verde RAL 6005', 'Rosso RAL 3000', 'Blu RAL 5010'],
        'D': ['RAL a richiesta']
    };
    
    const TIPI_RETE_PALAGINA = [
        'Rete Standard Grigio',
        'Rete Standard Nero',
        'Rete Trasparente',
        'Rete Pollentec',
        'Rete Pet Screen'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 CASSONETTI
    // ═══════════════════════════════════════════════════════════════════════════
    
    const TIPI_CASSONETTO = [
        'Esterno',
        'Interno',
        'Posaclima'
    ];
    
    const MATERIALI_CASSONETTO = [
        'PVC',
        'Legno'
    ];
    
    const CODICI_CASSONETTO_PVC = [
        { codice: '148', desc: '148 - B≤148mm (standard)' },
        { codice: '148B', desc: '148B - B 335-600mm' },
        { codice: '300', desc: '300 - B≤300mm' },
        { codice: '300B', desc: '300B - B 335-600mm' }
    ];
    
    const CODICI_CASSONETTO_LEGNO = [
        { codice: '9-48', desc: '9-48 - B≤150mm (L max 2240)' },
        { codice: '9-48B', desc: '9-48B - B≤600mm (L max 2240)' }
    ];
    
    const GRUPPI_COLORE_CASSONETTO = {
        'PVC': ['bianco', 'scuri'],
        'Legno': ['legno1', 'legno2+3']
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏷️ COMUNI
    // ═══════════════════════════════════════════════════════════════════════════
    
    const AMBIENTI = [
        'Cucina',
        'Soggiorno',
        'Camera',
        'Bagno',
        'Ingresso',
        'Corridoio',
        'Studio',
        'Lavanderia',
        'Cantina',
        'Garage',
        'Mansarda',
        'Terrazzo',
        'Balcone'
    ];
    
    const PIANI = [
        'Piano Terra',
        'Piano 1',
        'Piano 2',
        'Piano 3',
        'Piano 4',
        'Piano 5',
        'Seminterrato',
        'Sottotetto'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 FUNZIONI HELPER
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ottiene i colori in base alla finitura
     */
    function getColoriPerFinitura(finitura) {
        const fin = (finitura || '').toLowerCase();
        if (fin.includes('legno') || fin === 'legno') {
            return COLORI_LEGNO;
        }
        if (fin.includes('alluminio') || fin.includes('aluminio') || fin === 'alu') {
            return COLORI_ALLUMINIO;
        }
        return COLORI_PVC;
    }
    
    /**
     * Ottiene i modelli tapparella per azienda
     */
    function getModelliTapparella(azienda) {
        if (!azienda || !MODELLI_TAPPARELLE[azienda]) {
            return MODELLI_TAPPARELLE['Plasticino'] || [];
        }
        return MODELLI_TAPPARELLE[azienda];
    }
    
    /**
     * Ottiene i colori tapparella per tipo materiale
     */
    function getColoriTapparella(tipo) {
        if (tipo && COLORI_TAPPARELLE_PLASTICINO[tipo]) {
            return COLORI_TAPPARELLE_PLASTICINO[tipo];
        }
        // Default: tutti i colori uniti
        return COLORI_TAPPARELLE_PLASTICINO['ALLUMINIO_UNITA'];
    }
    
    /**
     * Ottiene i colori per le guide
     */
    function getColoriGuide() {
        return [
            ...COLORI_GUIDE_PLASTICINO['ANODIZZATO'],
            ...COLORI_GUIDE_PLASTICINO['VERNICIATO'],
            'RAL a richiesta'
        ];
    }
    
    /**
     * Calcola numero cardini consigliati per tipo persiana
     */
    function calcolaCardiniPersiana(tipo, aperturaLibro) {
        // Estrai numero ante dal tipo (F2, F3, F4, PF2, PF3, PF4)
        const match = tipo.match(/(\d+)/);
        const numAnte = match ? parseInt(match[1]) : 2;
        
        // 3 cardini per anta, +1 per apertura a libro
        let cardini = numAnte * 3;
        if (aperturaLibro) cardini += numAnte;
        
        return cardini;
    }
    
    /**
     * Calcola numero fermapersiane consigliati
     */
    function calcolaFermapersiane(tipo) {
        // Estrai numero ante dal tipo
        const match = tipo.match(/(\d+)/);
        const numAnte = match ? parseInt(match[1]) : 2;
        
        // 1 fermapersiana per anta
        return numAnte;
    }
    
    /**
     * Genera opzioni HTML per select modelli tapparella
     */
    function getModelliTapparellaOptions(azienda, currentValue) {
        const modelli = getModelliTapparella(azienda);
        if (modelli.length === 0) {
            return '<option value="">Nessun modello disponibile</option>';
        }
        return modelli.map(m => {
            const value = `${m.cod} - ${m.nome}`;
            const selected = currentValue === value ? 'selected' : '';
            return `<option value="${value}" ${selected}>${m.cod} - ${m.nome}</option>`;
        }).join('');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.OPZIONI = {
        // Aziende
        AZIENDE_INFISSI,
        AZIENDE_PERSIANE,
        AZIENDE_TAPPARELLE,
        AZIENDE_ZANZARIERE,
        AZIENDE_CASSONETTI,
        
        // Colori Infissi
        COLORI_PVC,
        COLORI_ALLUMINIO,
        COLORI_LEGNO,
        
        // Tapparelle
        MODELLI_TAPPARELLE,
        COLORI_TAPPARELLE_PLASTICINO,
        GUIDE_PLASTICINO,
        COLORI_GUIDE_PLASTICINO,
        ACCESSORI_TAPPARELLA,
        
        // Motori SOMFY
        MOTORI_SOMFY,
        ACCESSORI_MOTORE_SOMFY,
        COMANDI_SOMFY,
        
        // Persiane
        TIPI_PERSIANA,
        APERTURE_PERSIANA,
        CARDINI_PUNTO_PERSIANE,
        FERMAPERSIANE_PUNTO_PERSIANE,
        
        // Zanzariere Palagina
        LINEE_ZANZARIERE_PALAGINA,
        MODELLI_ZANZARIERE_PALAGINA,
        FASCE_COLORE_PALAGINA,
        COLORI_TELAIO_PALAGINA,
        TIPI_RETE_PALAGINA,
        
        // Cassonetti
        TIPI_CASSONETTO,
        MATERIALI_CASSONETTO,
        CODICI_CASSONETTO_PVC,
        CODICI_CASSONETTO_LEGNO,
        GRUPPI_COLORE_CASSONETTO,
        
        // Comuni
        AMBIENTI,
        PIANI,
        
        // Funzioni helper
        getColoriPerFinitura,
        getModelliTapparella,
        getColoriTapparella,
        getColoriGuide,
        calcolaCardiniPersiana,
        calcolaFermapersiane,
        getModelliTapparellaOptions
    };
    
    console.log('✅ opzioni-comuni.js v1.2 caricato - OPZIONI disponibili');
    
})();
