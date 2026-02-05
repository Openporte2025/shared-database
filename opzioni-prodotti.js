/**
 * OPZIONI PRODOTTI - Modulo Centralizzato v2.0.0
 * 
 * shared-database/opzioni-prodotti.js
 * Usato da: App Rilievo + Dashboard + Editor Posizione
 * 
 * REGOLA: Ogni dropdown statico di prodotto usa SOLO queste costanti.
 * Mai array inline nelle app.
 * 
 * v2.0.0 (05/02/2026):
 *   - Aggiunto CODICI_MODELLO completi (59 codici con gruppi)
 *   - Aggiunto FERRAMENTA completa (10 codici con gruppi)
 *   - Aggiunto LATI_DIN e ESECUZIONI_DIN
 *   - Aggiunto MANIGLIE_FINSTRAL dettagliate
 *   - Helper getCodiciModelloHTML() per <select> con optgroup
 *   - Helper getFerramentaHTML() per <select> con optgroup
 *   - Allineato Aziende/Persiane tra opzioni-comuni.js e app
 * 
 * v1.0.0 (02/02/2026): Versione iniziale
 * 
 * DIPENDENZE:
 * - Caricare DOPO finstral-opzioni.js (per integrazione vetri)
 * - Caricare DOPO opzioni-comuni.js (non sovrascrive, complementa)
 */

window.OPZIONI_PRODOTTI = {

    // ════════════════════════════════════════════════════════════════════════
    // INFISSI
    // ════════════════════════════════════════════════════════════════════════
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
        ],

        // ═══════════════════════════════════════════════════════════════
        // CODICI MODELLO FINSTRAL - Lista completa con gruppi
        // Fonte di verità: catalogo Finstral EUR 2025/3
        // ═══════════════════════════════════════════════════════════════
        codiciModello: [
            // 1 Campo
            { gruppo: '📦 1 CAMPO', codice: '101', desc: 'anta' },
            { gruppo: '📦 1 CAMPO', codice: '102', desc: 'fisso' },
            // 2 Campi Orizzontali
            { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '201', desc: '2 ante' },
            { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '202', desc: 'anta+fisso' },
            { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '203', desc: 'fisso+anta' },
            { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '204', desc: '2 fissi' },
            // 2 Campi Verticali
            { gruppo: '📦📦 2 CAMPI VERT.', codice: '205', desc: '2 ante vert.' },
            { gruppo: '📦📦 2 CAMPI VERT.', codice: '206', desc: 'anta+fisso vert.' },
            { gruppo: '📦📦 2 CAMPI VERT.', codice: '207', desc: 'fisso+anta vert.' },
            { gruppo: '📦📦 2 CAMPI VERT.', codice: '208', desc: '2 fissi vert.' },
            // 3 Campi
            { gruppo: '📦📦📦 3 CAMPI', codice: '301', desc: '3 ante' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '302', desc: 'a+f+a' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '303', desc: 'f+a+f' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '304', desc: '3 fissi' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '305', desc: 'f+a+f vert.' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '306', desc: 'f+a+a vert.' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '307', desc: '3 fissi vert.' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '308', desc: 'f+2a alto' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '309', desc: '2a basso+f' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '310', desc: '2a basso+a' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '321', desc: 'f+a+a' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '322', desc: 'a+a+f' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '324', desc: 'a+f+a' },
            { gruppo: '📦📦📦 3 CAMPI', codice: '340', desc: 'a+2a alto' },
            // 4 Campi
            { gruppo: '📦📦📦📦 4 CAMPI', codice: '311', desc: '2f basso+2a alto' },
            { gruppo: '📦📦📦📦 4 CAMPI', codice: '314', desc: '2a basso+2f alto' },
            { gruppo: '📦📦📦📦 4 CAMPI', codice: '316', desc: '4 ante' },
            { gruppo: '📦📦📦📦 4 CAMPI', codice: '317', desc: '4 fissi' },
            // Montante Mobile
            { gruppo: '🔗 MONTANTE MOBILE', codice: '401', desc: '2 ante montante' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '402', desc: 'f+2a mont. alto' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '403', desc: '2a mont.+f alto' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '404', desc: '2f mont.+a alto' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '405', desc: 'a+2a mont. alto' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '414', desc: 'f+a mont. DX' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '415', desc: 'a mont. SX+f' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '420', desc: 'a+a mont. DX' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '421', desc: 'a mont. SX+a' },
            { gruppo: '🔗 MONTANTE MOBILE', codice: '424', desc: '3 ante mont.' },
            // Bilico
            { gruppo: '↔️ BILICO', codice: '450', desc: 'bilico' },
            { gruppo: '↔️ BILICO', codice: '451', desc: 'bilico+f DX' },
            { gruppo: '↔️ BILICO', codice: '452', desc: 'f SX+bilico' },
            { gruppo: '↔️ BILICO', codice: '453', desc: 'f+bilico+f' },
            { gruppo: '↔️ BILICO', codice: '456', desc: 'bilico+f alto' },
            { gruppo: '↔️ BILICO', codice: '457', desc: 'f basso+bilico' },
            // Scorrevoli
            { gruppo: '🚪 SCORREVOLI', codice: '500', desc: 'scorr. parallela' },
            { gruppo: '🚪 SCORREVOLI', codice: '501', desc: 'scorr. SX' },
            { gruppo: '🚪 SCORREVOLI', codice: '503', desc: 'scorr. SX+a DX' },
            { gruppo: '🚪 SCORREVOLI', codice: '504', desc: 'a SX+scorr. DX' },
            { gruppo: '🚪 SCORREVOLI', codice: '510', desc: '2 scorr.' },
            { gruppo: '🚪 SCORREVOLI', codice: '511', desc: 'scorr. DX' },
            // FIN-Slide HST
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS600', desc: 'solo fisso' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS601', desc: 'anta+fisso' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS602', desc: 'fisso+anta' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS610', desc: 'a+f+a' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS611', desc: 'a+2f+a' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS614', desc: '2a+fisso' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS615', desc: '2a coll.+fisso' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS616', desc: 'fisso+2a' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS617', desc: 'a+f+2a' },
            { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS621', desc: '2 fissi' }
        ],

        // ═══════════════════════════════════════════════════════════════
        // FERRAMENTA FINSTRAL - Lista completa con gruppi
        // ═══════════════════════════════════════════════════════════════
        ferramenta: [
            { gruppo: 'Anta/Ribalta', codice: '411', desc: 'A/R vista' },
            { gruppo: 'Anta/Ribalta', codice: '211', desc: 'A/R scomp.' },
            { gruppo: 'Solo Anta', codice: '430', desc: 'Anta int.' },
            { gruppo: 'Solo Anta', codice: '230', desc: 'Anta scomp.' },
            { gruppo: 'Con Montante', codice: '425', desc: '+leva vista' },
            { gruppo: 'Con Montante', codice: '225', desc: '+leva scomp.' },
            { gruppo: 'Porta-Finestra', codice: '475', desc: 'A/R+serr.' },
            { gruppo: 'Porta-Finestra', codice: '473', desc: 'Anta+serr.' },
            { gruppo: 'Scorrevoli', codice: '710', desc: 'Scorr. ribalta' },
            { gruppo: 'Scorrevoli', codice: '720', desc: 'Scorr. par.' }
        ],

        // ═══════════════════════════════════════════════════════════════
        // LATO DIN
        // ═══════════════════════════════════════════════════════════════
        latiDin: [
            { codice: '-1', desc: 'SX (-1)' },
            { codice: '-2', desc: 'DX (-2)' }
        ],

        // ═══════════════════════════════════════════════════════════════
        // ESECUZIONE DIN
        // ═══════════════════════════════════════════════════════════════
        esecuzioni: [
            { codice: '0', desc: '0 - Std', soloPVC: true },
            { codice: '3', desc: '3 - Perim+ang', soloPVC: false },
            { codice: '4', desc: '4 - Perim', soloPVC: false }
        ],

        // ═══════════════════════════════════════════════════════════════
        // MANIGLIE FINSTRAL (dettagliate con prezzi)
        // ═══════════════════════════════════════════════════════════════
        maniglieFinstral: [
            { codice: '7120', desc: 'Maniglia standard', prezzo: 0 },
            { codice: '7121', desc: 'Maniglia con chiave', prezzo: 30 },
            { codice: '7130', desc: 'Maniglia a bottone', prezzo: 15 },
            { codice: '7140', desc: 'Maniglia design', prezzo: 45 }
        ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // PERSIANE
    // ════════════════════════════════════════════════════════════════════════
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

    // ════════════════════════════════════════════════════════════════════════
    // TAPPARELLE
    // ════════════════════════════════════════════════════════════════════════
    tapparelle: {
        aziende: ['Plasticino', 'New Solar', 'Estella']
    },

    // ════════════════════════════════════════════════════════════════════════
    // ZANZARIERE
    // ════════════════════════════════════════════════════════════════════════
    zanzariere: {
        aziende: ['Palagina', 'Finstral']
    },

    // ════════════════════════════════════════════════════════════════════════
    // CASSONETTI
    // ════════════════════════════════════════════════════════════════════════
    cassonetti: {
        aziende: ['Finstral', 'Magò', 'Alpac']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// HELPER: Genera HTML <option>/<optgroup> per codici modello
// Usato da App Rilievo (inline template) e Editor Posizione
// ════════════════════════════════════════════════════════════════════════════

/**
 * Genera opzioni HTML per select codiceModello CON optgroup
 * @param {string} currentValue - valore attualmente selezionato
 * @returns {string} HTML options
 */
window.OPZIONI_PRODOTTI.getCodiciModelloHTML = function(currentValue) {
    const codici = this.infissi.codiciModello;
    let html = '<option value="">--</option>';
    let currentGruppo = '';
    
    for (const item of codici) {
        if (item.gruppo !== currentGruppo) {
            if (currentGruppo) html += '</optgroup>';
            html += `<optgroup label="${item.gruppo}">`;
            currentGruppo = item.gruppo;
        }
        const sel = currentValue === item.codice ? 'selected' : '';
        html += `<option value="${item.codice}" ${sel}>${item.codice} - ${item.desc}</option>`;
    }
    if (currentGruppo) html += '</optgroup>';
    return html;
};

/**
 * Genera opzioni HTML per select ferramenta CON optgroup
 * @param {string} currentValue - valore attualmente selezionato
 * @returns {string} HTML options
 */
window.OPZIONI_PRODOTTI.getFerramentaHTML = function(currentValue) {
    const ferr = this.infissi.ferramenta;
    let html = '<option value="">--</option>';
    let currentGruppo = '';
    
    for (const item of ferr) {
        if (item.gruppo !== currentGruppo) {
            if (currentGruppo) html += '</optgroup>';
            html += `<optgroup label="${item.gruppo}">`;
            currentGruppo = item.gruppo;
        }
        const sel = currentValue === item.codice ? 'selected' : '';
        html += `<option value="${item.codice}" ${sel}>${item.codice} - ${item.desc}</option>`;
    }
    if (currentGruppo) html += '</optgroup>';
    return html;
};

/**
 * Genera opzioni HTML per select lato DIN
 */
window.OPZIONI_PRODOTTI.getLatiDinHTML = function(currentValue) {
    let html = '<option value="">--</option>';
    for (const item of this.infissi.latiDin) {
        const sel = currentValue === item.codice ? 'selected' : '';
        html += `<option value="${item.codice}" ${sel}>${item.desc}</option>`;
    }
    return html;
};

/**
 * Genera opzioni HTML per select esecuzione DIN (filtra .0 per non-PVC)
 * @param {string} currentValue
 * @param {boolean} isPVC - true se finitura interna è PVC
 */
window.OPZIONI_PRODOTTI.getEsecuzioniHTML = function(currentValue, isPVC) {
    let html = '';
    for (const item of this.infissi.esecuzioni) {
        if (item.soloPVC && !isPVC) continue;
        const sel = currentValue === item.codice ? 'selected' : '';
        html += `<option value="${item.codice}" ${sel}>${item.desc}</option>`;
    }
    return html;
};

/**
 * Lista piatta codici modello per select semplici (editor)
 * Formato: ['', '📦 1 CAMPO', '101 - anta', '102 - fisso', ...]
 */
window.OPZIONI_PRODOTTI.getCodiciModelloFlat = function() {
    const codici = this.infissi.codiciModello;
    const result = [''];
    let currentGruppo = '';
    
    for (const item of codici) {
        if (item.gruppo !== currentGruppo) {
            result.push(`— ${item.gruppo} —`);
            currentGruppo = item.gruppo;
        }
        result.push(`${item.codice} - ${item.desc}`);
    }
    return result;
};

/**
 * Lista piatta ferramenta per select semplici (editor)
 */
window.OPZIONI_PRODOTTI.getFerramentaFlat = function() {
    const ferr = this.infissi.ferramenta;
    const result = [''];
    let currentGruppo = '';
    
    for (const item of ferr) {
        if (item.gruppo !== currentGruppo) {
            result.push(`— ${item.gruppo} —`);
            currentGruppo = item.gruppo;
        }
        result.push(`${item.codice} - ${item.desc}`);
    }
    return result;
};

/**
 * Lista piatta lati DIN per select semplici
 */
window.OPZIONI_PRODOTTI.getLatiDinFlat = function() {
    return ['', ...this.infissi.latiDin.map(l => `${l.codice} - ${l.desc}`)];
};

/**
 * Lista piatta esecuzioni per select semplici
 */
window.OPZIONI_PRODOTTI.getEsecuzioniFlat = function() {
    return ['', ...this.infissi.esecuzioni.map(e => e.desc)];
};

// ════════════════════════════════════════════════════════════════════════════
// INTEGRAZIONE FINSTRAL_OPZIONI (vetri dettagliati)
// ════════════════════════════════════════════════════════════════════════════
if (typeof FINSTRAL_OPZIONI !== 'undefined' && FINSTRAL_OPZIONI.vetri && FINSTRAL_OPZIONI.vetri.length > 0) {
    window.OPZIONI_PRODOTTI.infissi.vetri = FINSTRAL_OPZIONI.vetri.map(v => v.nome);
    console.log('✅ OPZIONI_PRODOTTI: vetri da FINSTRAL_OPZIONI (' + window.OPZIONI_PRODOTTI.infissi.vetri.length + ')');
} else {
    console.log('⚠️ OPZIONI_PRODOTTI: vetri fallback (' + window.OPZIONI_PRODOTTI.infissi.vetri.length + ')');
}

// Popola anche OPZIONI (opzioni-comuni.js) per retrocompatibilità editor
if (typeof window.OPZIONI !== 'undefined') {
    window.OPZIONI.CODICI_MODELLO = window.OPZIONI_PRODOTTI.getCodiciModelloFlat();
    window.OPZIONI.FERRAMENTA_CODICI = window.OPZIONI_PRODOTTI.infissi.ferramenta;
    window.OPZIONI.LATI_DIN = window.OPZIONI_PRODOTTI.infissi.latiDin;
    window.OPZIONI.ESECUZIONI_DIN = window.OPZIONI_PRODOTTI.infissi.esecuzioni;
    window.OPZIONI.MANIGLIE_FINSTRAL = window.OPZIONI_PRODOTTI.infissi.maniglieFinstral.map(
        m => `${m.codice} - ${m.desc}`
    );
    window.OPZIONI.COLORI_MANIGLIA = window.OPZIONI_PRODOTTI.infissi.coloriManiglia;
    window.OPZIONI.FINITURE_INFISSO = window.OPZIONI_PRODOTTI.infissi.finiture;
    window.OPZIONI.AZIENDE_INFISSI = window.OPZIONI_PRODOTTI.infissi.aziende;
    window.OPZIONI.MODELLI_PERSIANA = window.OPZIONI_PRODOTTI.persiane.modelli;
    window.OPZIONI.TIPI_PERSIANA = window.OPZIONI_PRODOTTI.persiane.tipi;
    window.OPZIONI.APERTURE_PERSIANA = window.OPZIONI_PRODOTTI.persiane.aperture;
    window.OPZIONI.FISSAGGI_PERSIANA = window.OPZIONI_PRODOTTI.persiane.fissaggi;
    window.OPZIONI.AZIENDE_PERSIANE = window.OPZIONI_PRODOTTI.persiane.aziende;
    window.OPZIONI.AZIENDE_TAPPARELLE = window.OPZIONI_PRODOTTI.tapparelle.aziende;
    window.OPZIONI.AZIENDE_ZANZARIERE = window.OPZIONI_PRODOTTI.zanzariere.aziende;
    window.OPZIONI.AZIENDE_CASSONETTI = window.OPZIONI_PRODOTTI.cassonetti.aziende;
    window.OPZIONI.OPZIONI_ALLARME = ['', ...window.OPZIONI_PRODOTTI.infissi.allarme];
    console.log('✅ OPZIONI_PRODOTTI: sincronizzato con OPZIONI (retrocompatibilità)');
}

console.log('✅ OPZIONI_PRODOTTI v2.0.0 caricato - ' + window.OPZIONI_PRODOTTI.infissi.codiciModello.length + ' codici modello');
