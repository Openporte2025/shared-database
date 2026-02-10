/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📋 MODULO IVA E DETRAZIONI FISCALI - Open Porte & Finestre
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Wizard 5 step per determinare aliquota IVA e detrazione applicabile.
 * Fonte: Manuale IVA Ambrosi Partner (Agg. 13.0 05-2020) + Circolare AdE 15/E 2018
 *        + Legge di Bilancio 2025 (L. 207/2024) per detrazioni aggiornate
 * 
 * Da integrare in opzioni-comuni.js come window.OPZIONI.IVA_DETRAZIONI
 * 
 * Versione: 1.0.0
 * Data: 10 Febbraio 2026
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: TIPOLOGIA DI INTERVENTO (Art. 3 comma 1, D.P.R. 380/2001)
// ─────────────────────────────────────────────────────────────────────────────
const TIPOLOGIE_INTERVENTO = [
    { 
        id: 'manutenzione_ordinaria', 
        label: 'Manutenzione Ordinaria (lett. a)',
        desc: 'Sostituzione serramenti senza opere murarie, stessi materiali/sagoma',
        titolo: 'Nessuno (Edilizia Libera)',
        lettera: 'a'
    },
    { 
        id: 'manutenzione_straordinaria', 
        label: 'Manutenzione Straordinaria (lett. b)',
        desc: 'Cambio sagoma/materiali, piccole opere murarie, CILA o SCIA',
        titolo: 'CILA o SCIA',
        lettera: 'b'
    },
    { 
        id: 'restauro_risanamento', 
        label: 'Restauro/Risanamento Conservativo (lett. c)',
        desc: 'Conservazione organismo edilizio con opere sistematiche',
        titolo: 'CILA o SCIA',
        lettera: 'c'
    },
    { 
        id: 'ristrutturazione_edilizia', 
        label: 'Ristrutturazione Edilizia (lett. d)',
        desc: 'Trasformazione edificio, modifica prospetti/volumetria',
        titolo: 'SCIA o Permesso di Costruire',
        lettera: 'd'
    },
    { 
        id: 'nuova_costruzione', 
        label: 'Nuova Costruzione (lett. e)',
        desc: 'Costruzione nuovo fabbricato',
        titolo: 'Permesso di Costruire',
        lettera: 'e'
    },
    { 
        id: 'ristrutturazione_urbanistica', 
        label: 'Ristrutturazione Urbanistica (lett. f)',
        desc: 'Sostituzione tessuto urbanistico-edilizio',
        titolo: 'SCIA alternativa o Permesso di Costruire',
        lettera: 'f'
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: TIPOLOGIA DI EDIFICIO
// ─────────────────────────────────────────────────────────────────────────────
const TIPOLOGIE_EDIFICIO = [
    { 
        id: 'abitativa_privata', 
        label: 'Abitazione privata (Cat. A escluso A10)',
        desc: 'Categorie catastali A1-A9, A11 e pertinenze',
        catCatastali: ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A11']
    },
    { 
        id: 'condominio_abitativo', 
        label: 'Parti comuni condominio abitativo',
        desc: 'Edificio con >50% superficie abitativa (Tupini)',
        catCatastali: []
    },
    { 
        id: 'altro_edificio', 
        label: 'Altro edificio (uffici, negozi, locali pubblici)',
        desc: 'Cat. A10 (uffici), C1 (negozi), D, ecc.',
        catCatastali: ['A10','C1','D1','D2','D3','D4','D5']
    }
];

// Sub-step per nuove costruzioni (STEP 2B)
const TIPOLOGIE_EDIFICIO_NUOVA_COSTRUZIONE = [
    {
        id: 'prima_casa',
        label: 'Prima Casa (non di lusso)',
        desc: 'Cat. A2-A7, A11 con requisiti prima casa',
        catCatastali: ['A2','A3','A4','A5','A6','A7','A11']
    },
    {
        id: 'fabbricato_rurale',
        label: 'Fabbricato Rurale abitativo',
        desc: 'Abitazione proprietario fondo agricolo (A6 rurale)',
        catCatastali: ['A6']
    },
    {
        id: 'tupini_non_prima_casa',
        label: 'Edificio Tupini / Casa non di lusso (non prima casa)',
        desc: '>50% superficie abitativa non di lusso, ≤25% negozi',
        catCatastali: ['A2','A3','A4','A5','A6','A7','A11']
    },
    {
        id: 'assimilato_tupini',
        label: 'Edificio assimilato Tupini',
        desc: 'Scuole, ospedali, caserme, collegi, ecc. (L.659/1961)',
        catCatastali: []
    },
    {
        id: 'opere_urbanizzazione',
        label: 'Opere di Urbanizzazione',
        desc: 'Infrastrutture e servizi pubblici',
        catCatastali: []
    },
    {
        id: 'lusso',
        label: 'Casa di Lusso (A1, A8, A9)',
        desc: 'Abitazioni signorili, ville, castelli',
        catCatastali: ['A1','A8','A9']
    },
    {
        id: 'uffici_altri',
        label: 'Uffici (A10) / Altri edifici',
        desc: 'Strumentali, commerciali, produttivi',
        catCatastali: ['A10','C1','D1','D2','D3','D4','D5']
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: TIPOLOGIA DI SERVIZIO
// ─────────────────────────────────────────────────────────────────────────────
const TIPOLOGIE_SERVIZIO = [
    { 
        id: 'fornitura_posa', 
        label: 'Fornitura e posa in opera serramenti (+ accessori)',
        desc: 'Caso più comune: vendita + installazione'
    },
    { 
        id: 'fornitura_posa_accessori', 
        label: 'Fornitura e posa di soli accessori (senza serramento)',
        desc: 'Solo tapparelle, persiane, zanzariere, grate, ecc.'
    },
    { 
        id: 'sola_fornitura', 
        label: 'Sola fornitura serramenti (senza posa)',
        desc: 'Vendita prodotti senza installazione'
    },
    { 
        id: 'sola_manodopera', 
        label: 'Sola manodopera / servizi professionali',
        desc: 'Solo posa, rilievo misure, consulenza, pratica ENEA'
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4: TIPOLOGIA DI CLIENTE
// ─────────────────────────────────────────────────────────────────────────────
const TIPOLOGIE_CLIENTE = [
    { 
        id: 'persona_fisica', 
        label: 'Persona Fisica (privato)',
        desc: 'Cliente finale, proprietario immobile'
    },
    { 
        id: 'persona_giuridica', 
        label: 'Persona Giuridica (azienda/ente)',
        desc: 'Società, enti, associazioni'
    },
    { 
        id: 'impresa_appaltatrice', 
        label: 'Impresa Appaltatrice / Subappalto',
        desc: 'Impresa edile che subappalta, general contractor'
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5: TIPOLOGIA DI BONUS / DETRAZIONE
// (Aggiornato a Legge di Bilancio 2025-2026)
// ─────────────────────────────────────────────────────────────────────────────
const TIPOLOGIE_BONUS = [
    { 
        id: 'ecobonus', 
        label: 'Ecobonus (riqualificazione energetica)',
        desc: 'Art.14 DL 63/2013 - Richiede pratica ENEA',
        percentuale2025_primaCasa: 50,
        percentuale2025_altraCasa: 36,
        percentuale2026_primaCasa: 50,  // Confermato proroga
        percentuale2026_altraCasa: 36,
        percentuale2027_primaCasa: 36,
        percentuale2027_altraCasa: 30,
        massimoDetrazione: 60000, // €60.000 per unità immobiliare
        rate: 10,
        causaleBonifico: 'RIQUALIFICAZIONE ENERGETICA',
        richiedeENEA: true,
        note: 'Infissi devono rispettare trasmittanza termica per zona climatica. Non si possono ingrandire oltre misure originali.'
    },
    { 
        id: 'bonus_casa', 
        label: 'Bonus Casa (ristrutturazione)',
        desc: 'Art.16-bis TUIR - Manutenzione straordinaria o ristrutturazione',
        percentuale2025_primaCasa: 50,
        percentuale2025_altraCasa: 36,
        percentuale2026_primaCasa: 50,  // Confermato proroga
        percentuale2026_altraCasa: 36,
        percentuale2027_primaCasa: 36,
        percentuale2027_altraCasa: 30,
        massimoSpesa: 96000, // €96.000 per unità immobiliare
        rate: 10,
        causaleBonifico: 'RISTRUTTURAZIONE EDILIZIA',
        richiedeENEA: false,
        note: 'Richiede manutenzione straordinaria (CILA/SCIA) per singole unità. Ammette cambio misure senza limiti.'
    },
    { 
        id: 'bonus_sicurezza', 
        label: 'Bonus Sicurezza (prevenzione atti illeciti)',
        desc: 'Art.16-bis c.1 lett.f) TUIR - Porte blindate, inferriate, grate',
        percentuale2025_primaCasa: 50,
        percentuale2025_altraCasa: 36,
        percentuale2026_primaCasa: 50,
        percentuale2026_altraCasa: 36,
        percentuale2027_primaCasa: 36,
        percentuale2027_altraCasa: 30,
        massimoSpesa: 96000, // condiviso con Bonus Casa
        rate: 10,
        causaleBonifico: 'RISTRUTTURAZIONE EDILIZIA',
        richiedeENEA: false,
        note: 'Per porte blindate, inferriate, grate, tapparelle antieffrazione, videocitofoni. Fattura separata da serramenti se si usa Ecobonus per questi.'
    },
    { 
        id: 'nessuna', 
        label: 'Nessuna detrazione',
        desc: 'Cliente non intende usufruire di bonus fiscali',
        percentuale2025_primaCasa: 0,
        percentuale2025_altraCasa: 0,
        percentuale2026_primaCasa: 0,
        percentuale2026_altraCasa: 0,
        massimoSpesa: 0,
        rate: 0,
        causaleBonifico: null,
        richiedeENEA: false,
        note: ''
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// BENI SIGNIFICATIVI (D.M. 29/12/1999) - lista tassativa
// ─────────────────────────────────────────────────────────────────────────────
const BENI_SIGNIFICATIVI = [
    'Ascensori e montacarichi',
    'Infissi esterni ed interni',
    'Caldaie',
    'Videocitofoni',
    'Apparecchiature di condizionamento e riciclo aria',
    'Sanitari e rubinetterie da bagno',
    'Impianti di sicurezza'
];

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFICAZIONE PRODOTTI PER IVA
// (Circolare AdE 15/E del 12/07/2018 + Legge Bilancio 2018)
// ─────────────────────────────────────────────────────────────────────────────
const CLASSIFICAZIONE_PRODOTTI_IVA = {
    beniSignificativi: {
        label: 'Beni Significativi (IVA mista in manutenzione)',
        prodotti: ['infisso', 'portafinestra', 'finestra', 'portoncino', 'porta_interna', 'portaBlindataOikos']
    },
    partiStaccate_nonIntegrate: {
        label: 'Parti staccate NON integrate (IVA 10% in manutenzione)',
        nota: 'Autonomia funzionale rispetto al serramento - consigliato da Ambrosi Partner',
        prodotti: ['persiana', 'tapparella', 'avvolgibile', 'scuro', 'veneziana', 'frangisole',
                   'zanzariera', 'controtelaio', 'coprifilo', 'controdavanzale', 'motore']
    },
    partiStaccate_integrabili: {
        label: 'Parti staccate INTEGRABILI (scelta serramentista)',
        nota: 'Possono essere considerate integrate per detrarre con Ecobonus',
        prodotti: ['cassonetto', 'zanzariera', 'tapparella'],
        dizioneFattura_integrato: 'Strutturalmente integrato al serramento',
        dizioneFattura_nonIntegrato: 'Strutturalmente NON integrato al serramento'
    },
    sempreNonIntegrate: {
        label: 'SEMPRE parti staccate (per AdE)',
        nota: 'Grate di sicurezza: sempre autonome, mai integrabili',
        prodotti: ['grata_sicurezza', 'inferriata']
    },
    servizi: {
        label: 'Servizi e manodopera',
        prodotti: ['posa', 'smontaggio', 'smaltimento', 'trasporto']
    },
    serviziProfessionali: {
        label: 'Prestazioni professionali (SEMPRE 22%)',
        nota: 'Anche in ristrutturazione: sempre IVA 22%',
        prodotti: ['rilievo_misure', 'pratica_enea', 'progettazione', 'consulenza', 'direzione_lavori']
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// FUNZIONE PRINCIPALE: determinaIVA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determina aliquota IVA in base ai 5 parametri del wizard.
 * 
 * @param {string} intervento - ID da TIPOLOGIE_INTERVENTO
 * @param {string} edificio - ID da TIPOLOGIE_EDIFICIO o TIPOLOGIE_EDIFICIO_NUOVA_COSTRUZIONE
 * @param {string} servizio - ID da TIPOLOGIE_SERVIZIO
 * @param {string} cliente - ID da TIPOLOGIE_CLIENTE
 * @param {string} bonus - ID da TIPOLOGIE_BONUS (opzionale, non influisce sull'IVA)
 * @returns {object} { aliquota, ivaMista, note, documentazione[], dizioniFattura[] }
 */
function determinaIVA(intervento, edificio, servizio, cliente) {
    
    // === CASO 1: NUOVE COSTRUZIONI (lett. e) ===
    if (intervento === 'nuova_costruzione') {
        return _ivaPerNuovaCostruzione(edificio, servizio, cliente);
    }
    
    // === CASO 2: RISTRUTTURAZIONE / RESTAURO (lett. c, d, f) ===
    // IVA 10% su TUTTO (beni + servizi + posa), qualsiasi edificio, qualsiasi cliente
    // ECCEZIONE: prestazioni professionali sempre 22%
    if (['restauro_risanamento', 'ristrutturazione_edilizia', 'ristrutturazione_urbanistica'].includes(intervento)) {
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Ristrutturazione/Restauro: IVA 10% su tutto (fornitura + posa). Prestazioni professionali (rilievo, ENEA) restano al 22%.',
            documentazione: ['Titolo abilitativo (SCIA o Permesso di Costruire)', 'Visura catastale'],
            dizioniFattura: [
                'Non serve specificare "strutturalmente integrato/non integrato"',
                'Servizi professionali da fatturare separatamente al 22%'
            ],
            serviziProfessionali22: true
        };
    }
    
    // === CASO 3: MANUTENZIONE ORDINARIA o STRAORDINARIA (lett. a, b) ===
    return _ivaPerManutenzione(edificio, servizio, cliente);
}

/**
 * IVA per Manutenzione Ordinaria/Straordinaria
 */
function _ivaPerManutenzione(edificio, servizio, cliente) {
    
    // --- Sub-appalto: SEMPRE 22% ---
    if (cliente === 'impresa_appaltatrice') {
        return {
            aliquota: 22,
            ivaMista: false,
            note: 'Subappalto a impresa: IVA 22% su tutto. L\'impresa fatturerà poi al cliente finale con IVA agevolata.',
            documentazione: [],
            dizioniFattura: ['Fattura B2B standard al 22%']
        };
    }
    
    // --- Edificio NON abitativo: SEMPRE 22% ---
    if (edificio === 'altro_edificio') {
        return {
            aliquota: 22,
            ivaMista: false,
            note: 'Manutenzione su edificio non abitativo (uffici, negozi, ecc.): IVA 22% su tutto.',
            documentazione: ['Visura catastale'],
            dizioniFattura: []
        };
    }
    
    // --- Edificio abitativo (prevalente destinazione abitativa privata) ---
    // Cat. A (escluso A10), condomini >50% abitativo
    
    // Sola fornitura SENZA posa: SEMPRE 22%
    if (servizio === 'sola_fornitura') {
        return {
            aliquota: 22,
            ivaMista: false,
            note: 'Sola fornitura senza posa su immobile abitativo in manutenzione: IVA 22%. Per ottenere IVA agevolata serve contratto di fornitura E posa.',
            documentazione: ['Visura catastale'],
            dizioniFattura: []
        };
    }
    
    // Sola manodopera (senza fornitura beni significativi): IVA 10%
    if (servizio === 'sola_manodopera') {
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Sola manodopera/servizi su immobile abitativo: IVA 10%. Prestazioni professionali (rilievo, ENEA, progettazione) restano al 22%.',
            documentazione: ['Visura catastale'],
            dizioniFattura: [],
            serviziProfessionali22: true
        };
    }
    
    // Fornitura + posa di SOLI accessori (senza serramento): IVA 10%
    if (servizio === 'fornitura_posa_accessori') {
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Fornitura e posa di soli accessori (senza serramento) su immobile abitativo: IVA 10% su tutto. Non essendoci il bene significativo, non si applica IVA mista.',
            documentazione: ['Visura catastale'],
            dizioniFattura: [
                'Non serve specificare "strutturalmente integrato/non integrato" (manca il serramento)'
            ],
            serviziProfessionali22: true
        };
    }
    
    // === CASO PIÙ COMUNE: Fornitura + posa serramenti su abitativo ===
    // IVA MISTA 10%/22% con regola beni significativi
    return {
        aliquota: '10/22',
        ivaMista: true,
        note: 'IVA MISTA: 10% su servizi + beni non significativi + quota bene significativo pari al valore servizi. 22% sulla parte eccedente del bene significativo. Mark-up (ricarico) va scorporato dal bene significativo e messo in "Posa e Servizi".',
        documentazione: [
            'Visura catastale (conferma immobile abitativo)',
            'Autodichiarazione cliente per IVA agevolata'
        ],
        dizioniFattura: [
            'Serramento (Bene significativo ex D.M. 29/12/1999) - €___ (prezzo ACQUISTO)',
            'Tapparella/Persiana - Strutturalmente NON integrata al serramento - €___',
            'Cassonetto - Strutturalmente integrato al serramento - €___ (se Ecobonus)',
            'Zanzariera - Strutturalmente integrata/NON integrata - €___ (a scelta)',
            'Grate sicurezza - Sempre NON integrate - €___ (fatturare SEPARATAMENTE se Ecobonus)',
            'Coprifili e finitura - Strutturalmente NON integrati - €___',
            'Posa e Servizi (include mark-up) - €___'
        ],
        formulaCalcolo: 'calcolaIVAMista',
        serviziProfessionali22: true
    };
}

/**
 * IVA per Nuove Costruzioni
 */
function _ivaPerNuovaCostruzione(edificio, servizio, cliente) {
    
    // Prima Casa
    if (edificio === 'prima_casa') {
        if (servizio === 'sola_fornitura') {
            return {
                aliquota: 4,
                ivaMista: false,
                note: 'Sola fornitura beni finiti per prima casa in costruzione: IVA 4% (DPR 633/72, Tab. A, Parte II, n.24). Richiede autodichiarazione requisiti prima casa.',
                documentazione: ['Permesso di Costruire', 'Autodichiarazione requisiti prima casa', 'Visura catastale'],
                dizioniFattura: []
            };
        }
        if (cliente === 'impresa_appaltatrice') {
            // Impresa che costruisce per rivendere
            return {
                aliquota: 4,
                ivaMista: false,
                note: 'Fornitura + posa a impresa costruttrice per prima casa: IVA 4% (DPR 633/72, Tab. A, Parte II, n.39).',
                documentazione: ['Permesso di Costruire', 'Dichiarazione impresa costruttrice'],
                dizioniFattura: []
            };
        }
        // Fornitura + posa a privato/altro (non impresa costruttrice)
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Fornitura + posa per prima casa a soggetto NON impresa costruttrice: IVA 10% (DPR 633/72, Tab. A, Parte III, n.127-quaterdecies).',
            documentazione: ['Permesso di Costruire', 'Visura catastale', 'Autodichiarazione requisiti prima casa'],
            dizioniFattura: []
        };
    }
    
    // Fabbricato Rurale
    if (edificio === 'fabbricato_rurale') {
        return {
            aliquota: 4,
            ivaMista: false,
            note: 'Fabbricato rurale abitativo: IVA 4% sia fornitura che fornitura+posa (DPR 633/72, Tab. A, Parte II, n.24 e n.39).',
            documentazione: ['Permesso di Costruire', 'Documentazione ruralità fondo'],
            dizioniFattura: []
        };
    }
    
    // Tupini / Casa non di lusso (non prima casa)
    if (edificio === 'tupini_non_prima_casa') {
        if (servizio === 'sola_fornitura') {
            return {
                aliquota: 4,
                ivaMista: false,
                note: 'Sola fornitura beni finiti per edificio Tupini/casa non di lusso: IVA 4% (DPR 633/72, Tab. A, Parte II, n.24).',
                documentazione: ['Permesso di Costruire', 'Visura catastale', 'Verifica requisiti Tupini'],
                dizioniFattura: []
            };
        }
        if (cliente === 'impresa_appaltatrice') {
            return {
                aliquota: 4,
                ivaMista: false,
                note: 'Fornitura + posa a impresa costruttrice per edificio Tupini: IVA 4%.',
                documentazione: ['Permesso di Costruire', 'Dichiarazione impresa costruttrice'],
                dizioniFattura: []
            };
        }
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Fornitura + posa per edificio Tupini a privato: IVA 10% (DPR 633/72, Tab. A, Parte III, n.127-quaterdecies).',
            documentazione: ['Permesso di Costruire', 'Visura catastale'],
            dizioniFattura: []
        };
    }
    
    // Assimilato Tupini
    if (edificio === 'assimilato_tupini') {
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Edificio assimilato Tupini (scuole, ospedali, ecc.): IVA 10% fornitura e fornitura+posa.',
            documentazione: ['Permesso di Costruire'],
            dizioniFattura: []
        };
    }
    
    // Opere di Urbanizzazione
    if (edificio === 'opere_urbanizzazione') {
        return {
            aliquota: 10,
            ivaMista: false,
            note: 'Opere di urbanizzazione: IVA 10%.',
            documentazione: ['Documentazione urbanistica'],
            dizioniFattura: []
        };
    }
    
    // Casa di Lusso / Uffici / Altri edifici
    return {
        aliquota: 22,
        ivaMista: false,
        note: 'Nuova costruzione immobile di lusso (A1, A8, A9), uffici (A10) o altri edifici: IVA 22%.',
        documentazione: ['Permesso di Costruire'],
        dizioniFattura: []
    };
}


// ═══════════════════════════════════════════════════════════════════════════════
// CALCOLO IVA MISTA (Beni Significativi)
// Circolare AdE 15/E del 12/07/2018 + Legge Bilancio 2018
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcola IVA mista per beni significativi in manutenzione ordinaria/straordinaria.
 * 
 * Il VALORE del bene significativo = prezzo di ACQUISTO (non di vendita!)
 * Il MARK-UP (ricarico) va nei "Servizi" → soggetto a IVA 10%
 * 
 * @param {number} valoreBeneSignificativo - Prezzo di ACQUISTO del bene (serramento + eventuali integrati)
 * @param {number} valorePartiStaccate - Totale parti NON integrate (tapparelle, coprifili, ecc.)
 * @param {number} valorePosaServizi - Posa + mark-up + altri servizi
 * @returns {object} { imponibile10, iva10, imponibile22, iva22, totaleIVA, totale }
 */
function calcolaIVAMista(valoreBeneSignificativo, valorePartiStaccate, valorePosaServizi) {
    const totaleNonBeneSign = valorePartiStaccate + valorePosaServizi;
    const imponibileTotale = valoreBeneSignificativo + totaleNonBeneSign;
    
    let imponibile10, imponibile22;
    
    if (totaleNonBeneSign >= valoreBeneSignificativo) {
        // CASO 1: servizi + parti staccate ≥ bene significativo → TUTTO al 10%
        imponibile10 = imponibileTotale;
        imponibile22 = 0;
    } else {
        // CASO 2: IVA mista
        // 10% su: parti staccate + posa/servizi + quota bene significativo pari a totaleNonBeneSign
        // 22% su: eccedenza bene significativo
        imponibile10 = totaleNonBeneSign + totaleNonBeneSign; // = 2 × totaleNonBeneSign
        imponibile22 = valoreBeneSignificativo - totaleNonBeneSign;
        
        // Verifica coerenza
        if (imponibile10 + imponibile22 !== imponibileTotale) {
            // Aggiusta arrotondamento
            imponibile10 = imponibileTotale - imponibile22;
        }
    }
    
    const iva10 = Math.round(imponibile10 * 0.10 * 100) / 100;
    const iva22 = Math.round(imponibile22 * 0.22 * 100) / 100;
    const totaleIVA = Math.round((iva10 + iva22) * 100) / 100;
    const aliquotaMedia = imponibileTotale > 0 
        ? Math.round((totaleIVA / imponibileTotale) * 10000) / 100 
        : 0;
    
    return {
        imponibile10: Math.round(imponibile10 * 100) / 100,
        iva10,
        imponibile22: Math.round(imponibile22 * 100) / 100,
        iva22,
        totaleIVA,
        imponibileTotale: Math.round(imponibileTotale * 100) / 100,
        totale: Math.round((imponibileTotale + totaleIVA) * 100) / 100,
        aliquotaMedia,
        tuttoAl10: imponibile22 === 0
    };
}

/**
 * Calcola IVA per prestazioni professionali (SEMPRE 22%)
 */
function calcolaIVAProfessionale(importo) {
    const iva = Math.round(importo * 0.22 * 100) / 100;
    return {
        imponibile: importo,
        iva,
        totale: Math.round((importo + iva) * 100) / 100,
        aliquota: 22,
        nota: 'Prestazioni professionali: sempre IVA 22% (anche in ristrutturazione)'
    };
}


// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

const IVA_DETRAZIONI = {
    // Dati wizard 5 step
    tipologieIntervento: TIPOLOGIE_INTERVENTO,
    tipologieEdificio: TIPOLOGIE_EDIFICIO,
    tipologieEdificioNuovaCostruzione: TIPOLOGIE_EDIFICIO_NUOVA_COSTRUZIONE,
    tipologieServizio: TIPOLOGIE_SERVIZIO,
    tipologieCliente: TIPOLOGIE_CLIENTE,
    tipologieBonus: TIPOLOGIE_BONUS,
    
    // Classificazione prodotti
    beniSignificativi: BENI_SIGNIFICATIVI,
    classificazioneProdotti: CLASSIFICAZIONE_PRODOTTI_IVA,
    
    // Funzioni di calcolo
    determinaIVA,
    calcolaIVAMista,
    calcolaIVAProfessionale,
    
    // Versione
    versione: '1.0.0'
};

// Per uso standalone (test)
if (typeof window !== 'undefined') {
    if (!window.OPZIONI) window.OPZIONI = {};
    window.OPZIONI.IVA_DETRAZIONI = IVA_DETRAZIONI;
    console.log('✅ IVA_DETRAZIONI v1.0.0 caricato - Wizard IVA + Detrazioni disponibile');
}

// Per uso Node.js (test)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IVA_DETRAZIONI;
}
