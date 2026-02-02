// ============================================================================
// FINSTRAL MODULE v1.0.0 - Modulo Calcolo Prezzi Centralizzato
// ============================================================================
// 
// Funzioni helper per calcolo prezzi infissi e cassonetti Finstral.
// Estratto da dashboard-app.js per condivisione tra App Rilievo e Dashboard.
//
// DIPENDENZE (caricare PRIMA di questo file):
//   - finstral.js (FINSTRAL_PREZZI, FINSLIDE_PREZZI, FINSTRAL_CASSONETTI_PREZZI)
//   - finstral-opzioni.js (FINSTRAL_OPZIONI, getGruppoColorePVC, getGruppoColoreAlluminio)
//   - finstral-vetri-2025.js (FINSTRAL_VETRI_2025, FINSTRAL_VETRI_PRINCIPALI)
//
// USATO DA:
//   - Dashboard: calcolo preventivo infissi/cassonetti
//   - App Rilievo: validazione e preview prezzi (futuro)
// ============================================================================

const SUPPLEMENTI_VETRI = {
    "doppio": 0,              // Incluso (standard)
    "triplo": 35,             // € 35/m²
    "triplo-sat": 50,         // € 50/m²
    "triplo-satinato": 50,
    "triplo-selettivo": 60    // € 60/m²
};


// ═══════════════════════════════════════════════════════════════
// 🔧 FUNZIONI PARSING MANIGLIE FINSTRAL - v7.26
// ═══════════════════════════════════════════════════════════════

/**
 * Estrae codice maniglia da stringa tipo "6010 - Finestra alluminio"
 * @param {string} manigliaValue - Valore salvato (es: "6010 - Finestra alluminio" o "standard")
 * @returns {string} - Codice maniglia (es: "6010") o stringa originale se non parsabile
 */
function estraiCodiceManiglia(manigliaValue) {
    if (!manigliaValue || manigliaValue === '') return '';
    
    // Se contiene " - " è formato nuovo: "6010 - Finestra alluminio"
    if (manigliaValue.includes(' - ')) {
        const match = manigliaValue.match(/^(\S+)/);
        return match ? match[1] : '';
    }
    
    // Altrimenti è valore vecchio: "standard", "inox", ecc.
    return manigliaValue;
}

/**
 * Estrae codice colore da stringa tipo "07 - Bianco perla"
 * @param {string} coloreValue - Valore salvato (es: "07 - Bianco perla" o "bianco")
 * @returns {string} - Codice colore (es: "07") o stringa originale se non parsabile
 */
function estraiCodiceColore(coloreValue) {
    if (!coloreValue || coloreValue === '') return '';
    
    // Se contiene " - " è formato nuovo: "07 - Bianco perla"
    if (coloreValue.includes(' - ')) {
        const match = coloreValue.match(/^(\S+)/);
        return match ? match[1] : '';
    }
    
    // Altrimenti è valore vecchio: "bianco", "bronzo", ecc.
    return coloreValue;
}

/**
 * Calcola supplemento maniglia usando database Finstral
 * Supporta sia formato nuovo (6010 - Finestra) che vecchio (standard, inox)
 * @param {string} manigliaValue - Valore maniglia salvato
 * @param {string} coloreValue - Valore colore salvato
 * @returns {number} - Supplemento in € (0 se non trovato o valori vecchi)
 */
function calcolaSupplementoManigliaFinstral(manigliaValue, coloreValue) {
    const codiceManiglia = estraiCodiceManiglia(manigliaValue);
    const codiceColore = estraiCodiceColore(coloreValue);
    
    // Se è formato vecchio (no codici Finstral), usa vecchia logica
    if (!manigliaValue || !manigliaValue.includes(' - ')) {
        // Valori vecchi: "standard", "inox", "design", ecc.
        return calcolaSupplementoManigliaVecchio(manigliaValue);
    }
    
    // Formato nuovo: usa database Finstral
    if (!codiceManiglia || !codiceColore) {
        return 0; // Campi vuoti
    }
    
    // Usa funzione del database
    return getSupplemento(codiceManiglia, codiceColore);
}

/**
 * Fallback per valori vecchi (pre-v4.31)
 * @param {string} tipoManiglia - "standard", "inox", "design", ecc.
 * @returns {number} - Supplemento in €
 */
function calcolaSupplementoManigliaVecchio(tipoManiglia) {
    if (!tipoManiglia) return 0;
    const maniglia = tipoManiglia.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    
    // Supplementi vecchi (compatibilità)
    const SUPPLEMENTI_VECCHI = {
        "standard": 0,
        "bianco": 0,
        "satinato": 0,
        "inox": 20,
        "design": 40,
        "con-chiave": 50
    };
    
    return SUPPLEMENTI_VECCHI[maniglia] || 0;
}

// SUPPLEMENTI MANIGLIE (DEPRECATO v7.26)
// SOSTITUITO da database MANIGLIE_FINSTRAL
// Mantenuto per riferimento storico
/*
const SUPPLEMENTI_MANIGLIE = {
    "standard": 0,            // Inclusa
    "bianco": 0,              // Inclusa
    "satinato": 0,            // Inclusa (variante standard)
    "inox": 20,               // € 20/pezzo
    "design": 40,             // € 40/pezzo
    "con-chiave": 50          // € 50/pezzo
};
*/

// MAPPING APERTURE → TIPI
const MAPPING_APERTURE_TIPI = {
    // Battenti standard
    'battente_1_anta': 'tipo_101',
    'battente': 'tipo_101',
    'vasistas': 'tipo_101',
    'ribalta': 'tipo_101',
    // Aperture direzionali
    'dx': 'tipo_101',
    'sx': 'tipo_101',
    'destra': 'tipo_101',
    'sinistra': 'tipo_101',
    // Fissi
    'fisso': 'tipo_102',
    'f1': 'tipo_102',  // App usa F1 per fisso 1 campo
    // 2 Ante
    'battente_2_ante': 'tipo_401',
    'due_ante': 'tipo_401',
    'f2': 'tipo_401',  // App usa F2 per fisso 2 campi (o 2 ante)
    '2_ante': 'tipo_401',
    // Scorrevoli
    'scorrevole': 'tipo_501',
    'scorrevole_parallela': 'tipo_501',
    // Fallback
    'default': 'tipo_101'
};

// COSTI EXTRA
const COSTI_EXTRA = {
    posa_per_pezzo: 50,         // € per pezzo
    smontaggio_per_pezzo: 30    // € per pezzo
};

// Funzione: Calcola perimetro BRM in metri lineari
function calcolaPerimetroBRM(larghezza_mm, altezza_mm) {
    return 2 * (larghezza_mm + altezza_mm) / 1000;
}

// Funzione: Trova campione prezzo base
function trovaCampionePrezzoBase(tipo, L_mm, A_mm) {
    let campioni;
    
    if (tipo === 'tipo_101') {
        campioni = CAMPIONI_TIPO_101;
    } else if (tipo === 'tipo_401') {
        campioni = CAMPIONI_TIPO_401;
    } else if (tipo === 'tipo_102') {
        // Fisso: usa tipo 101 con sconto 5%
        campioni = CAMPIONI_TIPO_101;
        const prezzo = trovaCampionePrezzoBase('tipo_101', L_mm, A_mm);
        return prezzo ? prezzo * 0.95 : null;
    } else {
        console.warn(`Tipo ${tipo} non trovato`);
        return null;
    }
    
    // Cerca campione esatto o più vicino
    for (const [L_min, L_max, A_min, A_max, prezzo] of campioni) {
        if (L_mm >= L_min && L_mm <= L_max && 
            A_mm >= A_min && A_mm <= A_max) {
            return prezzo;
        }
    }
    
    // Nessun campione trovato: usa più vicino per sicurezza
    let minDistanza = Infinity;
    let prezzoVicino = null;
    
    for (const [L_min, L_max, A_min, A_max, prezzo] of campioni) {
        const L_centro = (L_min + L_max) / 2;
        const A_centro = (A_min + A_max) / 2;
        const distanza = Math.sqrt(
            Math.pow(L_mm - L_centro, 2) + 
            Math.pow(A_mm - A_centro, 2)
        );
        
        if (distanza < minDistanza) {
            minDistanza = distanza;
            prezzoVicino = prezzo;
        }
    }
    
    console.warn(`⚠️ Prezzo per L=${L_mm}, A=${A_mm} non trovato, uso più vicino: €${prezzoVicino}`);
    return prezzoVicino;
}

// Funzione: Calcola supplemento telaio
function calcolaSupplementoTelaio(codiceTelaio, perimetro_ml, coloreScuro = false) {
    let supplemento = 0;
    
    // Cerca in telai PVC
    if (TELAI_PVC[codiceTelaio]) {
        const telaio = TELAI_PVC[codiceTelaio];
        if (telaio.supplemento_ml) {
            supplemento = telaio.supplemento_ml * perimetro_ml;
        } else {
            const sup_ml = coloreScuro ? telaio.supplemento_ml_scuro : telaio.supplemento_ml_chiaro;
            supplemento = sup_ml * perimetro_ml;
        }
    }
    // Cerca in telai Alluminio
    else if (TELAI_ALLUMINIO[codiceTelaio]) {
        const telaio = TELAI_ALLUMINIO[codiceTelaio];
        const sup_ml = coloreScuro ? telaio.supplemento_ml_scuro : telaio.supplemento_ml_chiaro;
        supplemento = sup_ml * perimetro_ml;
    }
    // Cerca in telai Interni
    else if (TELAI_INTERNI[codiceTelaio]) {
        const telaio = TELAI_INTERNI[codiceTelaio];
        const sup_ml = coloreScuro ? telaio.supplemento_ml_scuro : telaio.supplemento_ml_chiaro;
        supplemento = sup_ml * perimetro_ml;
    }
    
    return supplemento;
}

// Funzione: Determina se colore è scuro (gruppo B)
function isColoreScuro(colore) {
    if (!colore) return false;
    const coloreLC = colore.toLowerCase();
    
    // Gruppo A (chiari): bianco, bianco perla, bianco satinato, bianco goffrato
    const coloriChiari = ['bianco', 'white', 'ral 9010', 'ral 9016', 'perla', 'satinato', 'goffrato'];
    
    // Se contiene una parola chiara, è chiaro
    if (coloriChiari.some(c => coloreLC.includes(c))) {
        return false;
    }
    
    // Altrimenti consideralo scuro (gruppo B)
    return true;
}

// Funzione: Ottieni tipo da apertura
function getTipoDaApertura(apertura) {
    const aperturaLC = (apertura || '').toLowerCase().trim();
    return MAPPING_APERTURE_TIPI[aperturaLC] || MAPPING_APERTURE_TIPI['default'];
}

// Funzione: Calcola supplemento anta
function calcolaSupplementoAnta(tipoAnta, perimetro_ml) {
    if (!tipoAnta) return 0;
    const anta = tipoAnta.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    const suppl_ml = SUPPLEMENTI_ANTE[anta] || 0;
    return suppl_ml * perimetro_ml;
}

// Funzione: Calcola supplemento vetro
function calcolaSupplementoVetro(tipoVetro, superficie_mq) {
    if (!tipoVetro) return 0;
    const vetro = tipoVetro.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    
    // ✅ v7.73: Usa database Finstral per vetri 2113/11414
    let suppl_mq = 0;
    if (vetro.includes('triplo') || vetro === '11414' || vetro.includes('max-valor')) {
        suppl_mq = FINSTRAL_PREZZI.supplementiVetro?.["11414"] || 118.00;
    } else if (vetro.includes('doppio') || vetro === '2113') {
        suppl_mq = FINSTRAL_PREZZI.supplementiVetro?.["2113"] || 52.20;
    } else {
        suppl_mq = SUPPLEMENTI_VETRI[vetro] || 0;
    }
    
    // 🆕 v8.45: Supplemento AGGIUNTIVO per vetro satinato
    // Il satinato è un'opzione che si aggiunge al vetro base
    if (vetro.includes('satinato') || vetro.includes('satin')) {
        const supplSatinato = FINSTRAL_PREZZI.supplementiVetro?.satinato || 82.40;
        suppl_mq += supplSatinato;
        console.log(`🔷 Vetro satinato rilevato: +€${supplSatinato}/m² (totale €${suppl_mq}/m²)`);
    }
    
    // Supplemento vetro sempre applicato
    return suppl_mq * superficie_mq;
}

/**
 * ✅ v7.79: Cerca supplemento anta da tabella dimensionale
 * Per ante Slim-line Cristal, Twin, Nova Twin che hanno prezzo €/pezzo invece di €/ml
 * @param {string} tipoAnta - Tipo anta normalizzato (es. "slim-line-cristal")
 * @param {number} altezza_mm - Altezza anta in mm
 * @param {number} larghezza_mm - Larghezza anta in mm
 * @returns {number|null} Supplemento €/pezzo o null se non trovato
 */
function getSupplementoAntaDimensionale(tipoAnta, altezza_mm, larghezza_mm) {
    const tabella = FINSTRAL_PREZZI.tabelleAnteDimensionali?.[tipoAnta];
    if (!tabella) return null; // Non è un tipo con tabella dimensionale
    
    // Trova riga (altezza) più vicina
    const righe = Object.keys(tabella).map(Number).sort((a, b) => a - b);
    let rigaKey = righe[righe.length - 1]; // Default: ultima riga
    for (const r of righe) {
        if (r >= altezza_mm) {
            rigaKey = r;
            break;
        }
    }
    
    // Trova colonna (larghezza) più vicina
    const colonne = Object.keys(tabella[rigaKey] || {}).map(Number).sort((a, b) => a - b);
    let colonnaKey = colonne[colonne.length - 1]; // Default: ultima colonna
    for (const c of colonne) {
        if (c >= larghezza_mm) {
            colonnaKey = c;
            break;
        }
    }
    
    const prezzo = tabella[rigaKey]?.[colonnaKey];
    if (prezzo) {
        console.log(`📊 Tabella anta ${tipoAnta}: A=${altezza_mm}→${rigaKey}, L=${larghezza_mm}→${colonnaKey} = €${prezzo}`);
    }
    return prezzo || 0;
}

// Funzione: Calcola supplemento maniglia (DEPRECATA v7.26)
// SOSTITUITA da calcolaSupplementoManigliaFinstral()
// Mantenuta per debug e compatibilità temporanea
/*
function calcolaSupplementoManiglia(tipoManiglia) {
    if (!tipoManiglia) return 0;
    const maniglia = tipoManiglia.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    return SUPPLEMENTI_MANIGLIE[maniglia] || 0;
}
*/

/**
 * Estrae numero ante dal campo tipo (F1, F2, F3, F4, PF1, PF2)
 * @param {string} tipo - Tipo infisso/persiana (es. "F2", "PF1")
 * @returns {number} Numero ante (1, 2, 3, 4)
 */
function estraiNumeroAnte(tipo) {
    if (!tipo) return 1;
    
    // Estrai ultima cifra da tipo: F1→1, F2→2, PF2→2, F3→3, F4→4
    const match = tipo.match(/(\d+)$/);
    if (match) {
        return parseInt(match[1]);
    }
    
    return 1; // Default 1 anta
}

// ============================================================================
// CALCOLO PREZZO CASSONETTO + HELPER COLORI/FERRAMENTA
// ============================================================================

function calcolaPrezzoCassonettoFinstral(config) {
    const risultato = {
        success: false,
        prezzo: 0,
        dettaglio: {
            prezzoBase: 0,
            supplementoIsolamento: 0,
            numeroIsolamenti: 0
        },
        parametri: {},
        errori: []
    };
    
    try {
        // Estrai parametri
        const L = parseInt(config.L) || parseInt(config.BRM_L) || 0;  // Larghezza mm
        const A = parseInt(config.A) || parseInt(config.BRM_H) || parseInt(config.HCASS) || 0;  // Altezza mm
        const B = parseInt(config.B) || parseInt(config.BRM_B) || 0;  // Profondità mm
        const materiale = (config.materialeCass || config.materiale || 'PVC').toUpperCase();
        const gruppoColore = config.gruppoColoreCass || config.gruppoColore || 'bianco';
        const codiceIsolamento = config.codiceIsolamento || null;
        
        risultato.parametri = { L, A, B, materiale, gruppoColore, codiceIsolamento };
        
        // Validazione
        if (L <= 0) { risultato.errori.push('Larghezza L non valida'); return risultato; }
        if (A <= 0) { risultato.errori.push('Altezza A non valida'); return risultato; }
        
        // Determina codice cassonetto in base a B e materiale
        let codiceCass = config.codiceCass || '';
        if (!codiceCass) {
            if (materiale === 'LEGNO') {
                codiceCass = (B > 335) ? '9-48B' : '9-48';
            } else {
                // PVC: scegli tra 148 e 300 in base a B
                if (B <= 148) {
                    codiceCass = '148';
                } else if (B <= 300) {
                    codiceCass = '300';
                } else {
                    // B > 300 → versione B
                    codiceCass = (B <= 148 + 200) ? '148B' : '300B';
                }
            }
        }
        risultato.parametri.codiceCass = codiceCass;
        
        // Seleziona tabella prezzi
        let tabella = null;
        let colonnaColore = '';
        
        if (materiale === 'LEGNO') {
            tabella = codiceCass.includes('B') ? FINSTRAL_CASSONETTI_PREZZI.legno_948B : FINSTRAL_CASSONETTI_PREZZI.legno_948;
            colonnaColore = (gruppoColore === 'legno2+3' || gruppoColore === 'gruppo23' || gruppoColore === 'gruppo2+3') ? 'gruppo23' : 'gruppo1';
        } else {
            // PVC
            if (codiceCass === '148B') tabella = FINSTRAL_CASSONETTI_PREZZI.pvc_148B;
            else if (codiceCass === '300') tabella = FINSTRAL_CASSONETTI_PREZZI.pvc_300;
            else if (codiceCass === '300B') tabella = FINSTRAL_CASSONETTI_PREZZI.pvc_300B;
            else tabella = FINSTRAL_CASSONETTI_PREZZI.pvc_148;
            colonnaColore = (gruppoColore === 'scuri' || gruppoColore.includes('scur')) ? 'scuri' : 'bianco';
        }
        
        risultato.parametri.tabella = tabella.codice;
        risultato.parametri.colonnaColore = colonnaColore;
        
        // Verifica limite larghezza
        if (L > tabella.maxL) {
            risultato.errori.push(`Larghezza ${L}mm supera max ${tabella.maxL}mm per ${tabella.codice}`);
            return risultato;
        }
        
        // Trova indice colonna L (arrotondamento alla casella superiore)
        let idxL = tabella.colonneL.findIndex(col => L <= col);
        if (idxL === -1) idxL = tabella.colonneL.length - 1;
        
        // Trova indice riga A (arrotondamento alla casella superiore)
        let idxA = tabella.righeA.findIndex(row => A <= row);
        if (idxA === -1) idxA = tabella.righeA.length - 1;
        
        risultato.parametri.idxL = idxL;
        risultato.parametri.idxA = idxA;
        risultato.parametri.LArrotondato = tabella.colonneL[idxL];
        risultato.parametri.AArrotondato = tabella.righeA[idxA];
        
        // Ottieni prezzo dalla matrice
        const matricePrezzi = tabella[colonnaColore];
        if (!matricePrezzi || !matricePrezzi[idxA] || matricePrezzi[idxA][idxL] === undefined) {
            risultato.errori.push('Prezzo non trovato nella griglia');
            return risultato;
        }
        
        const prezzoBase = matricePrezzi[idxA][idxL];
        risultato.dettaglio.prezzoBase = prezzoBase;
        
        // Supplemento isolamento
        let supplementoIsolamento = 0;
        let numeroIsolamenti = 0;
        if (codiceIsolamento && FINSTRAL_CASSONETTI_PREZZI.isolamento[codiceIsolamento]) {
            const iso = FINSTRAL_CASSONETTI_PREZZI.isolamento[codiceIsolamento];
            // Se L > 1000mm servono più pezzi
            numeroIsolamenti = Math.ceil(L / 1000);
            supplementoIsolamento = iso.prezzo * numeroIsolamenti;
            risultato.dettaglio.supplementoIsolamento = supplementoIsolamento;
            risultato.dettaglio.numeroIsolamenti = numeroIsolamenti;
            risultato.dettaglio.codiceIsolamento = codiceIsolamento;
            risultato.dettaglio.spessoreIsolamento = iso.spessore;
        }
        
        // Totale
        risultato.prezzo = Math.round((prezzoBase + supplementoIsolamento) * 100) / 100;
        risultato.success = true;
        
        console.log('📦 Calcolo cassonetto Finstral:', risultato);
        return risultato;
        
    } catch (e) {
        risultato.errori.push('Errore calcolo: ' + e.message);
        console.error('❌ Errore calcolaPrezzoCassonettoFinstral:', e);
        return risultato;
    }
}

// ✅ v7.73: FUNZIONE MAPPING COLORE TESTO → CODICE FINSTRAL
function mappaColoreACodiceFinstral(coloreInput, tipo = 'pvc') {
    if (!coloreInput) return tipo === 'pvc' ? '01' : 'M01'; // Default bianco
    
    const colore = coloreInput.toLowerCase().trim();
    
    // 1. Cerca match esatto in coloriComuni
    for (const [nome, dati] of Object.entries(FINSTRAL_PREZZI.coloriComuni)) {
        if (colore === nome.toLowerCase() || colore.includes(nome.toLowerCase())) {
            return tipo === 'pvc' ? (dati.pvc || '01') : (dati.alluminio || 'M01');
        }
    }
    
    // 2. Pattern matching per codici RAL
    const ralMatch = colore.match(/ral\s*(\d{4})/i);
    if (ralMatch) {
        return tipo === 'pvc' ? '01' : 'RAL'; // Alluminio gruppo 2
    }
    
    // 3. Pattern matching per codici diretti Finstral (es. "F716", "L19", "M01")
    const codiceMatch = colore.match(/^([FLM]\d+|G\d+|LC\d+)/i);
    if (codiceMatch) {
        return codiceMatch[1].toUpperCase();
    }
    
    // ✅ v7.79: Pattern per codici PVC numerici (es. "45 - Bianco", "06 - Grigio")
    const codicePVCMatch = colore.match(/^(\d{2})\s*[-–]/);
    if (codicePVCMatch && tipo === 'pvc') {
        return codicePVCMatch[1];  // Restituisce "45", "06", "01", ecc.
    }
    
    // 4. Pattern matching per colori comuni
    if (colore.includes('bianco') || colore.includes('white')) {
        return tipo === 'pvc' ? '01' : 'M01';
    }
    if (colore.includes('grigio') || colore.includes('grey') || colore.includes('gray')) {
        if (colore.includes('antracite') || colore.includes('scuro')) {
            return tipo === 'pvc' ? '46' : 'F716';
        }
        return tipo === 'pvc' ? '46' : 'F744'; // grigio seta
    }
    if (colore.includes('nero') || colore.includes('black')) {
        return tipo === 'pvc' ? '06' : 'F905';
    }
    if (colore.includes('castagno') || colore.includes('marrone')) {
        return tipo === 'pvc' ? '13' : 'L13';
    }
    if (colore.includes('rovere') || colore.includes('oak')) {
        return tipo === 'pvc' ? '19' : 'L19';
    }
    if (colore.includes('noce')) {
        return tipo === 'pvc' ? '55' : 'L55';
    }
    
    // 5. Default
    return tipo === 'pvc' ? '01' : 'M01';
}

// ✅ v7.73: Determina gruppo colore PVC (A o B)
// getGruppoColorePVC → già in finstral-opzioni.js

// ═══════════════════════════════════════════════════════════════════════════
// ✅ v7.77: FUNZIONI HELPER FERRAMENTA / APERTURE / CERNIERE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ottiene codice ferramenta completo per tipo apertura
 * @param {string} tipoApertura - AR, A, R, FX, VA, SP, SPR, PFS
 * @param {boolean} cerniereScomparsa - true = scomparsa (2xx), false = vista (4xx)
 * @returns {object} - { codice, nome, minL, minH }
 */
function getCodiceApertura(tipoApertura, cerniereScomparsa = false) {
    const apertura = FINSTRAL_PREZZI.tipiApertura[tipoApertura];
    if (!apertura) {
        console.warn(`⚠️ Tipo apertura non trovato: ${tipoApertura}`);
        return { codice: "411.0", nome: "Anta/Ribalta", minL: 350, minH: 325 };
    }
    
    const codice = cerniereScomparsa && apertura.codiceScomparsa 
        ? apertura.codiceScomparsa 
        : apertura.codiceVista;
    
    return {
        codice: codice,
        nome: apertura.nome,
        minL: apertura.minL,
        minH: apertura.minH,
        hasCerniereScomparsa: !!apertura.codiceScomparsa
    };
}

/**
 * Formatta label tipo apertura per UI
 * @param {string} codice - AR, A, R, FX, VA, SP, SPR, PFS
 * @returns {string} - label leggibile
 */
function formatTipoApertura(codice) {
    const labels = {
        'AR': 'Anta/Ribalta',
        'A': 'Solo Anta',
        'R': 'Solo Ribalta',
        'FX': 'Fisso',
        'VA': 'Vasistas',
        'SP': 'Scorrevole',
        'SPR': 'Scorr. Ribalta',
        'PFS': 'Porta-Fin. Ser.'
    };
    return labels[codice] || codice;
}

/**
 * Calcola supplemento cerniere a scomparsa
 * @param {string} tipoApertura - AR, A, R, FX, VA, PFS
 * @param {number} numAnte - numero ante (default 1)
 * @returns {number} - supplemento in €
 */
function getSupplementoCerniereScomparsa(tipoApertura, numAnte = 1) {
    const suppl = FINSTRAL_PREZZI.supplementiCerniere[tipoApertura];
    if (!suppl) return 0;
    return suppl * numAnte;
}

/**
 * Calcola supplemento totale ferramenta
 * @param {object} config - { tipoApertura, cerniereScomparsa, sicurezza[], aerazione, comfort[], rc2 }
 * @returns {object} - { totale, dettaglio }
 */
function calcolaSupplementoFerramenta(config) {
    let totale = 0;
    const dettaglio = [];

    // Cerniere scomparsa
    if (config.cerniereScomparsa && config.tipoApertura) {
        const suppl = getSupplementoCerniereScomparsa(config.tipoApertura, config.numAnte || 1);
        if (suppl > 0) {
            totale += suppl;
            dettaglio.push({ tipo: 'Cerniere scomparsa', importo: suppl });
        }
    }

    // Sicurezza
    if (config.sicurezza && Array.isArray(config.sicurezza)) {
        config.sicurezza.forEach(s => {
            const suppl = FINSTRAL_PREZZI.supplementiSicurezza[s] || 0;
            if (suppl > 0) {
                totale += suppl;
                dettaglio.push({ tipo: `Sicurezza ${s}`, importo: suppl });
            }
        });
    }

    // Aerazione
    if (config.aerazione) {
        const suppl = FINSTRAL_PREZZI.supplementiAerazione[config.aerazione] || 0;
        if (suppl > 0) {
            totale += suppl;
            dettaglio.push({ tipo: `Aerazione ${config.aerazione}`, importo: suppl });
        }
    }

    // Comfort
    if (config.comfort && Array.isArray(config.comfort)) {
        config.comfort.forEach(c => {
            const suppl = FINSTRAL_PREZZI.supplementiComfort[c] || 0;
            if (suppl > 0) {
                totale += suppl;
                dettaglio.push({ tipo: `Comfort ${c}`, importo: suppl });
            }
        });
    }

    // RC2
    if (config.rc2) {
        const tipoAnta = (config.tipoAnta || '').toLowerCase();
        const supplRC2 = tipoAnta.includes('nova') 
            ? FINSTRAL_PREZZI.rc2.supplemento['nova-line']
            : FINSTRAL_PREZZI.rc2.supplemento['altri'];
        totale += supplRC2;
        dettaglio.push({ tipo: 'RC2 Antieffrazione', importo: supplRC2 });
    }

    console.log(`🔩 Supplemento ferramenta: €${totale.toFixed(2)}`, dettaglio);
    return { totale, dettaglio };
}

/**
 * Verifica compatibilità RC2 per telaio
 * @param {string} telaio - codice telaio (961, 967, etc.)
 * @returns {boolean}
 */
function isTelaioRC2Compatibile(telaio) {
    return FINSTRAL_PREZZI.rc2.telaiCompatibili.includes(telaio);
}

/**
 * Verifica misure minime per tipo apertura
 * @param {string} tipoApertura 
 * @param {number} larghezza - mm
 * @param {number} altezza - mm
 * @returns {boolean}
 */
function verificaMisureMinime(tipoApertura, larghezza, altezza) {
    const apertura = FINSTRAL_PREZZI.tipiApertura[tipoApertura];
    if (!apertura) return true; // Non verificabile
    return larghezza >= apertura.minL && altezza >= apertura.minH;
}

console.log('🔩 Helper ferramenta caricati: getCodiceApertura, getSupplementoCerniereScomparsa, calcolaSupplementoFerramenta');

// ============================================================================

// ============================================================================
// EXPORTS - Window globals per compatibilità dashboard
// ============================================================================
if (typeof window !== 'undefined') {
    // Costanti
    window.SUPPLEMENTI_VETRI = SUPPLEMENTI_VETRI;
    window.SUPPLEMENTI_MANIGLIE = SUPPLEMENTI_MANIGLIE;
    window.MAPPING_APERTURE_TIPI = MAPPING_APERTURE_TIPI;
    window.COSTI_EXTRA = COSTI_EXTRA;
    
    // Helper parsing
    window.estraiCodiceManiglia = estraiCodiceManiglia;
    window.estraiCodiceColore = estraiCodiceColore;
    
    // Calcolo supplementi
    window.calcolaSupplementoManigliaFinstral = calcolaSupplementoManigliaFinstral;
    window.calcolaSupplementoManigliaVecchio = calcolaSupplementoManigliaVecchio;
    window.calcolaPerimetroBRM = calcolaPerimetroBRM;
    window.trovaCampionePrezzoBase = trovaCampionePrezzoBase;
    window.calcolaSupplementoTelaio = calcolaSupplementoTelaio;
    window.isColoreScuro = isColoreScuro;
    window.getTipoDaApertura = getTipoDaApertura;
    window.calcolaSupplementoAnta = calcolaSupplementoAnta;
    window.calcolaSupplementoVetro = calcolaSupplementoVetro;
    window.getSupplementoAntaDimensionale = getSupplementoAntaDimensionale;
    window.calcolaSupplementoManiglia = calcolaSupplementoManiglia;
    window.estraiNumeroAnte = estraiNumeroAnte;
    
    // Cassonetto
    window.calcolaPrezzoCassonettoFinstral = calcolaPrezzoCassonettoFinstral;
    
    // Colori e mappature
    window.mappaColoreACodiceFinstral = mappaColoreACodiceFinstral;
    
    // Ferramenta e aperture
    window.getCodiceApertura = getCodiceApertura;
    window.formatTipoApertura = formatTipoApertura;
    window.getSupplementoCerniereScomparsa = getSupplementoCerniereScomparsa;
    window.calcolaSupplementoFerramenta = calcolaSupplementoFerramenta;
    window.isTelaioRC2Compatibile = isTelaioRC2Compatibile;
    window.verificaMisureMinime = verificaMisureMinime;
    
    console.log('✅ FINSTRAL-MODULE v1.0.0 caricato - Helper calcolo prezzi');
}

