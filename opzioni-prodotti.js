/**
 * OPZIONI PRODOTTI - Modulo Centralizzato
 * 
 * shared-database/opzioni-prodotti.js
 * Usato da: App Rilievo + Dashboard
 * 
 * REGOLA: Ogni dropdown statico di prodotto usa SOLO queste costanti.
 * Mai array inline nelle app.
 * 
 * Versione: 1.0.0
 * Data: 02/02/2026
 * 
 * DIPENDENZE:
 * - Caricare DOPO finstral-opzioni.js (per integrazione vetri)
 */

window.OPZIONI_PRODOTTI = {

    // ============================================================
    // INFISSI
    // ============================================================
    infissi: {
        aziende: ['Finstral', 'Essepi', 'Schüco', 'Oknoplast', 'Internorm'],
        
        tipiAnta: [
            'Classic-line', 'Slim-line', 'Slim-line Cristal', 
            'Slim-line Twin', 'Slim-line Cristal Twin',
            'Step-line', 'Step-line Door',
            'Nova-line', 'Nova-line Plus', 'Nova-line Twin', 'Nova-line Cristal Twin'
        ],
        
        finiture: ['pvc', 'legno', 'alluminio', 'ceramica'],
        
        allarme: ['si', 'no'],
        
        // Popolato da FINSTRAL_OPZIONI.vetri se disponibile (vedi init in fondo)
        vetri: [
            'Doppio Base 28mm',
            'Doppio + Sicurezza P2A',
            'Doppio + Sicurezza P4A',
            'Doppio Sicurezza Maggiorata P2A',
            'Doppio Sicurezza Maggiorata P4A',
            'Doppio Satinato',
            'Doppio Satinato + Sicurezza P2A',
            'Triplo Base 40mm',
            'Triplo Base 46mm (Ug 0.5)',
            'Triplo + Sicurezza P2A 46mm',
            'Triplo + Sicurezza P4A 46mm',
            'Triplo Sicurezza Maggiorata P2A',
            'Triplo Sicurezza Maggiorata P4A',
            'Triplo Satinato Bodysafe',
            'Triplo Satinato Bodysafe 6mm'
        ],
        
        maniglie: [
            '601 - STANDARD', 
            '712 - A PRESSIONE', 
            '773 - DOPPIA ANTA/RIBALTA', 
            '772 - DOPPIA ANTA'
        ],
        
        coloriManiglia: [
            '01 - BIANCO', '07 - PERLA', '56 - NEUTRO ANODIZZATO',
            '74 - BRONZO', '40 - OTTONE LUCIDO', '79 - TITANIO',
            'M01 - BIANCO', 'M03 - NERO', 'M07 - BIANCO CREMA'
        ],
        
        tagliTelaio: [
            'nessuno', 'sopra', 'sotto', 'sopra-sotto',
            'dx', 'sx', 'dx-sx', '4-lati',
            'sopra-laterali', 'sotto-laterali'
        ]
    },

    // ============================================================
    // PERSIANE
    // ============================================================
    persiane: {
        aziende: ['P. Persiane'],
        
        modelli: [
            'Angela', 'Giulia', 'Luna', 'Aurora',
            'Alto Adige', 'Alto Adige (R)',
            'Cortina', 'Cortina (R)',
            'Oscura', 'Oscura (R)',
            'Nerina', 'Nerina (R)',
            'Scandola', 'Scandola (TT)',
            'Scandola Duo', 'Scandola Duo (TT)',
            'Oscura Duo', 'Oscura Duo (TT)'
        ],
        
        fissaggi: ['muro', 'telaio'],
        
        tipiTelaio: ['TH10', 'TH40', 'TH41', 'TH45', 'TH46R', 'TH62', 'TH80', 'TH53'],
        
        battute: ['3 LATI', '4 LATI', '2 LATI LATERALI'],
        
        tipi: ['F1', 'PF1', 'F2', 'PF2', 'F3', 'PF3', 'SCORREVOLE'],
        
        aperture: ['SP SX', 'SP DX', 'LIB SX', 'LIB DX', 'SCORR SX', 'SCORR DX']
    },

    // ============================================================
    // TAPPARELLE
    // ============================================================
    tapparelle: {
        aziende: ['Plasticino', 'New Solar', 'Estella']
    },

    // ============================================================
    // ZANZARIERE
    // ============================================================
    zanzariere: {
        aziende: ['Palagina', 'Finstral']
    },

    // ============================================================
    // CASSONETTI
    // ============================================================
    cassonetti: {
        aziende: ['Finstral', 'Magò', 'Alpac']
    }
};

// ============================================================
// INTEGRAZIONE FINSTRAL_OPZIONI (vetri dettagliati)
// ============================================================
// Se finstral-opzioni.js è già caricato, sovrascrive fallback
if (typeof FINSTRAL_OPZIONI !== 'undefined' && FINSTRAL_OPZIONI.vetri && FINSTRAL_OPZIONI.vetri.length > 0) {
    window.OPZIONI_PRODOTTI.infissi.vetri = FINSTRAL_OPZIONI.vetri.map(v => v.nome);
    console.log('✅ OPZIONI_PRODOTTI: vetri caricati da FINSTRAL_OPZIONI (' + window.OPZIONI_PRODOTTI.infissi.vetri.length + ')');
} else {
    console.log('⚠️ OPZIONI_PRODOTTI: vetri fallback inline (' + window.OPZIONI_PRODOTTI.infissi.vetri.length + ')');
}

console.log('✅ OPZIONI_PRODOTTI v1.0.0 caricato');
