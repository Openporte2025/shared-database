// ============================================================================
// FINSTRAL OPZIONI CENTRALIZZATE - v1.0.0
// ============================================================================
// 
// ⚠️ QUESTO È L'UNICO FILE DA MODIFICARE PER LE OPZIONI FINSTRAL!
// 
// Usato da:
// - App Rilievo OpenPorte (Step 2 + Step 3)
// - Dashboard Ufficio (visualizzazione + calcoli)
// 
// Quando aggiungi/modifichi un'opzione, fallo QUI e basta.
// Le app generano le <select> dinamicamente da questo file.
//
// Riferimento: Listino Finstral EUR 2025/10
// ============================================================================

window.FINSTRAL_OPZIONI = {

    // ═══════════════════════════════════════════════════════════════════════
    // TELAI
    // ═══════════════════════════════════════════════════════════════════════
    telai: [
        // Forma L (standard)
        { codice: "961", nome: "961 - Forma L 77mm", profondita: 77, forma: "L" },
        { codice: "962", nome: "962 - Forma L 84mm", profondita: 84, forma: "L" },
        { codice: "963", nome: "963 - Forma L 104mm", profondita: 104, forma: "L" },
        { codice: "964", nome: "964 - Forma L 57mm", profondita: 57, forma: "L" },
        { codice: "965", nome: "965 - Forma Z 77mm", profondita: 77, forma: "Z" },
        { codice: "966", nome: "966 - Forma Z 77mm", profondita: 77, forma: "Z" },
        { codice: "967", nome: "967 - Forma Z 77mm", profondita: 77, forma: "Z" },
        // Forma Z con risvolto
        { codice: "Z62", nome: "Z62 - Forma Z 77+8mm", profondita: 85, forma: "Z" },
        { codice: "Z91", nome: "Z91 - Forma Z 90mm", profondita: 90, forma: "Z" },
        // Altri
        { codice: "924", nome: "924 - Forma L 90mm", profondita: 90, forma: "L" },
        { codice: "991", nome: "991 - Forma L 90mm", profondita: 90, forma: "L" },
        { codice: "951", nome: "951 - Forma L 124mm", profondita: 124, forma: "L" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // COLORI PVC (interno)
    // Gruppo A = tonalità bianco (supplementi minori)
    // Gruppo B = colori scuri (supplementi maggiori)
    // ═══════════════════════════════════════════════════════════════════════
    coloriPVC: [
        // Gruppo A - Bianchi
        { codice: "01", nome: "01 - Bianco standard", gruppo: "A" },
        { codice: "42", nome: "42 - Bianco goffrato", gruppo: "A" },
        { codice: "45", nome: "45 - Bianco liscio", gruppo: "A" },
        { codice: "07", nome: "07 - Bianco puro", gruppo: "A" },
        { codice: "27", nome: "27 - Bianco crema", gruppo: "A" },
        // Gruppo B - Scuri
        { codice: "06", nome: "06 - Grigio (⚠️ scade 32/2026)", gruppo: "B" },
        { codice: "36", nome: "36 - Grigio topo", gruppo: "B" },
        { codice: "46", nome: "46 - Grigio seta", gruppo: "B" },
        { codice: "13", nome: "13 - Castagno decoro legno", gruppo: "B" },
        { codice: "19", nome: "19 - Rovere decoro legno", gruppo: "B" },
        { codice: "55", nome: "55 - Noce chiaro decoro legno", gruppo: "B" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // COLORI ALLUMINIO (esterno)
    // Gruppo 1 = standard
    // Gruppo 1H = verniciati legno
    // Gruppo 2 = RAL (+ costo preparazione €284)
    // Gruppo 3 = NCS/DB speciali (+ costo preparazione €1410)
    // ═══════════════════════════════════════════════════════════════════════
    coloriAlluminio: [
        // Gruppo 1 - Standard
        { codice: "9016", nome: "RAL 9016 - Bianco traffico", gruppo: "1" },
        { codice: "9010", nome: "RAL 9010 - Bianco puro", gruppo: "1" },
        { codice: "7016", nome: "RAL 7016 - Grigio antracite", gruppo: "1" },
        { codice: "8017", nome: "RAL 8017 - Marrone cioccolato", gruppo: "1" },
        { codice: "6005", nome: "RAL 6005 - Verde muschio", gruppo: "1" },
        { codice: "5011", nome: "RAL 5011 - Blu acciaio", gruppo: "1" },
        // Gruppo 1H - Verniciati legno
        { codice: "L13", nome: "L13 - Castagno verniciato", gruppo: "1H" },
        { codice: "L14", nome: "L14 - Mogano verniciato", gruppo: "1H" },
        { codice: "L16", nome: "L16 - Douglas verniciato", gruppo: "1H" },
        { codice: "L18", nome: "L18 - Noce verniciato", gruppo: "1H" },
        { codice: "L19", nome: "L19 - Rovere verniciato", gruppo: "1H" },
        { codice: "L55", nome: "L55 - Noce chiaro verniciato", gruppo: "1H" },
        // Effetti legno naturale
        { codice: "LX01", nome: "LX01 - Rovere naturale", gruppo: "1H" },
        { codice: "LX02", nome: "LX02 - Ciliegio scuro", gruppo: "1H" },
        { codice: "LX03", nome: "LX03 - Pino verniciato", gruppo: "1H" },
        { codice: "LX04", nome: "LX04 - Rovere venato", gruppo: "1H" },
        // Gruppo 2 - RAL a richiesta
        { codice: "RAL", nome: "RAL a richiesta (+€284 preparazione)", gruppo: "2" },
        // Gruppo 3 - NCS speciali
        { codice: "NCS", nome: "NCS a richiesta (+€1410 preparazione)", gruppo: "3" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // TIPI ANTA (profilo battente)
    // ═══════════════════════════════════════════════════════════════════════
    tipiAnta: [
        { codice: "973", nome: "Classic-line", key: "classic-line" },
        { codice: "974", nome: "Step-line", key: "step-line" },
        { codice: "970", nome: "Slim-line", key: "slim-line" },
        { codice: "971", nome: "Nova-line", key: "nova-line" },
        { codice: "953", nome: "Nova-line 40", key: "nova-line-40" },
        { codice: "941", nome: "Nova-line Plus", key: "nova-line-plus" },
        { codice: "787", nome: "Nova-line Twin", key: "nova-line-twin" },
        { codice: "935", nome: "Slim-line Cristal", key: "slim-line-cristal" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // FINITURE (combinazione interno/esterno)
    // ═══════════════════════════════════════════════════════════════════════
    finiture: [
        { codice: "pvc-pvc", nome: "PVC / PVC", interno: "pvc", esterno: "pvc" },
        { codice: "pvc-alu", nome: "PVC / Alluminio", interno: "pvc", esterno: "alluminio" },
        { codice: "alu-alu", nome: "Alluminio / Alluminio", interno: "alluminio", esterno: "alluminio" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // VETRI (codici Finstral)
    // ═══════════════════════════════════════════════════════════════════════
    vetri: [
        // Doppi vetri
        { codice: "2113", nome: "Doppio 33.1v-18-33.1v", tipo: "doppio", spessore: 36 },
        { codice: "2114", nome: "Doppio 44.2v-16-33.1v", tipo: "doppio", spessore: 38 },
        { codice: "2115", nome: "Doppio 44.2v-14-44.2v", tipo: "doppio", spessore: 40 },
        // Tripli vetri
        { codice: "3113", nome: "Triplo 33.1v-14-4-14-33.1v", tipo: "triplo", spessore: 48 },
        { codice: "3114", nome: "Triplo 44.2v-12-4-12-33.1v", tipo: "triplo", spessore: 50 },
        // Ornamentali (per bagni)
        { codice: "2113S", nome: "Doppio satinato", tipo: "doppio", ornamentale: true },
        { codice: "3113S", nome: "Triplo satinato", tipo: "triplo", ornamentale: true },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // MANIGLIE
    // ═══════════════════════════════════════════════════════════════════════
    maniglie: [
        { codice: "7120", nome: "Maniglia standard", tipo: "standard" },
        { codice: "7121", nome: "Maniglia con chiave", tipo: "chiave" },
        { codice: "7125", nome: "Maniglia design", tipo: "design" },
        { codice: "7130", nome: "Maniglia a bottone", tipo: "bottone" },
        { codice: "7140", nome: "Maniglietta esterna", tipo: "maniglietta" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // COLORI MANIGLIA
    // ═══════════════════════════════════════════════════════════════════════
    coloriManiglia: [
        { codice: "79", nome: "Argento" },
        { codice: "01", nome: "Bianco" },
        { codice: "06", nome: "Grigio" },
        { codice: "80", nome: "Nero" },
        { codice: "81", nome: "Bronzo" },
        { codice: "82", nome: "Ottone" },
        { codice: "F9", nome: "Acciaio inox" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // FERRAMENTA
    // ═══════════════════════════════════════════════════════════════════════
    ferramenta: [
        { codice: "411", nome: "Standard anta-ribalta" },
        { codice: "211", nome: "A scomparsa" },
        { codice: "432", nome: "Solo ribalta" },
        { codice: "435", nome: "Solo apertura" },
        { codice: "405", nome: "Scorrevole parallelo" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // TIPOLOGIE INFISSO (codice modello)
    // ═══════════════════════════════════════════════════════════════════════
    tipologie: [
        { codice: "101", nome: "1 anta", ante: 1, tipo: "F" },
        { codice: "102", nome: "Fisso", ante: 0, tipo: "FX" },
        { codice: "201", nome: "2 ante senza montante", ante: 2, tipo: "F" },
        { codice: "301", nome: "3 ante", ante: 3, tipo: "F" },
        { codice: "401", nome: "2 ante con montante mobile", ante: 2, tipo: "F" },
        { codice: "420", nome: "3 ante composito", ante: 3, tipo: "F" },
        { codice: "421", nome: "3 ante composito variante", ante: 3, tipo: "F" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // SOGLIE (per porte-finestre)
    // ═══════════════════════════════════════════════════════════════════════
    soglie: [
        { codice: "377K", nome: "Soglia ribassata taglio termico" },
        { codice: "377", nome: "Soglia standard" },
        { codice: "378", nome: "Soglia a filo pavimento" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // VETRI - Listino EUR 2025/10
    // Supplementi in €/m² (minimo fatturabile 0,4 m²)
    // ═══════════════════════════════════════════════════════════════════════
    vetri: [
        // DOPPIO VETRO (Plus-Valor 2) - Ug 1.1
        { codice: "2F48", nome: "Doppio Base 28mm", tipo: "doppio", variante: "base", supplemento: 0, ug: 1.1, note: "⭐ INCLUSO" },
        { codice: "2248", nome: "Doppio + Sicurezza P2A", tipo: "doppio", variante: "sicurezza", classe: "P2A", supplemento: 45.7, ug: 1.1 },
        { codice: "2348", nome: "Doppio + Sicurezza P4A", tipo: "doppio", variante: "sicurezza", classe: "P4A", supplemento: 68.8, ug: 1.1 },
        { codice: "22F8", nome: "Doppio Sicurezza Maggiorata P2A", tipo: "doppio", variante: "sicurezza-magg", classe: "P2A", supplemento: 73.1, ug: 1.1, note: "Multiprotect+Bodysafe" },
        { codice: "23F8", nome: "Doppio Sicurezza Maggiorata P4A", tipo: "doppio", variante: "sicurezza-magg", classe: "P4A", supplemento: 99.0, ug: 1.1 },
        { codice: "48", nome: "Doppio Satinato", tipo: "doppio", variante: "satinato", supplemento: 54.7, vetroAdattabile: "A" },
        { codice: "49", nome: "Doppio Satinato + Sicurezza P2A", tipo: "doppio", variante: "satinato", classe: "P2A", supplemento: 54.7, vetroAdattabile: "E" },
        
        // TRIPLO VETRO (Max-Valor 3) - Ug 0.5-0.7
        { codice: "1F444", nome: "Triplo Base 40mm", tipo: "triplo", variante: "base", supplemento: 72.9, ug: 0.6 },
        { codice: "1F449", nome: "Triplo Base 46mm (Ug 0.5)", tipo: "triplo", variante: "base", supplemento: 74.2, ug: 0.5, note: "⭐ Miglior isolamento" },
        { codice: "12449", nome: "Triplo + Sicurezza P2A 46mm", tipo: "triplo", variante: "sicurezza", classe: "P2A", supplemento: 117, ug: 0.6 },
        { codice: "13449", nome: "Triplo + Sicurezza P4A 46mm", tipo: "triplo", variante: "sicurezza", classe: "P4A", supplemento: 143, ug: 0.6 },
        { codice: "124F4", nome: "Triplo Sicurezza Maggiorata P2A", tipo: "triplo", variante: "sicurezza-magg", classe: "P2A", supplemento: 147, ug: 0.7, note: "Multiprotect+Bodysafe" },
        { codice: "134F4", nome: "Triplo Sicurezza Maggiorata P4A", tipo: "triplo", variante: "sicurezza-magg", classe: "P4A", supplemento: 170, ug: 0.8 },
        { codice: "48T", nome: "Triplo Satinato Bodysafe", tipo: "triplo", variante: "satinato", supplemento: 83.4, vetroAdattabile: "T" },
        { codice: "486T", nome: "Triplo Satinato Bodysafe 6mm", tipo: "triplo", variante: "satinato", supplemento: 88.0, vetroAdattabile: "U" },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // TIPO APERTURA (F/PF) - Ereditato ai prodotti
    // ═══════════════════════════════════════════════════════════════════════
    tipoApertura: [
        { codice: "F", nome: "🪟 F - Finestra" },
        { codice: "PF", nome: "🚪 PF - Porta-finestra" },
    ],

};

// ═══════════════════════════════════════════════════════════════════════════
// FUNZIONI HELPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determina il gruppo colore PVC dal codice
 * @param {string} codicePVC - Codice colore PVC (es. "13")
 * @returns {string} "A" o "B"
 */
function getGruppoColorePVC(codicePVC) {
    if (!codicePVC) return 'A';
    const codice = codicePVC.toString().split(' ')[0]; // Estrae "13" da "13 - Castagno"
    const colore = FINSTRAL_OPZIONI.coloriPVC.find(c => c.codice === codice);
    return colore?.gruppo || 'A';
}

/**
 * Determina il gruppo colore Alluminio dal codice
 * @param {string} codiceAlu - Codice colore alluminio (es. "L13")
 * @returns {string} "1", "1H", "2", o "3"
 */
function getGruppoColoreAlluminio(codiceAlu) {
    if (!codiceAlu) return '1';
    const codice = codiceAlu.toString().split(' ')[0].toUpperCase();
    const colore = FINSTRAL_OPZIONI.coloriAlluminio.find(c => c.codice.toUpperCase() === codice);
    if (colore) return colore.gruppo;
    // Fallback per RAL/NCS custom
    if (codice.startsWith('RAL')) return '2';
    if (codice.startsWith('NCS') || codice.startsWith('DB')) return '3';
    if (codice.startsWith('L')) return '1H';
    return '1';
}

/**
 * Trova il key normalizzato per tipo anta
 * @param {string} tipoAnta - Nome o codice anta (es. "Classic-line" o "973")
 * @returns {string} Key normalizzato (es. "classic-line")
 */
function normalizzaTipoAnta(tipoAnta) {
    if (!tipoAnta) return 'step-line';
    const input = tipoAnta.toString().toLowerCase().trim();
    // Cerca per codice
    const byCodice = FINSTRAL_OPZIONI.tipiAnta.find(a => a.codice === tipoAnta);
    if (byCodice) return byCodice.key;
    // Cerca per nome o key
    const byNome = FINSTRAL_OPZIONI.tipiAnta.find(a => 
        a.nome.toLowerCase() === input || 
        a.key === input ||
        input.includes(a.key)
    );
    return byNome?.key || 'step-line';
}

/**
 * Ottiene vetri filtrati per tipo
 * @param {string} tipo - "doppio", "triplo", o null per tutti
 * @returns {Array} Array di vetri
 */
function getVetriPerTipo(tipo = null) {
    if (!tipo) return FINSTRAL_OPZIONI.vetri;
    return FINSTRAL_OPZIONI.vetri.filter(v => v.tipo === tipo);
}

/**
 * Ottiene dati vetro da codice
 * @param {string} codice - Codice vetro (es. "2F48", "48T")
 * @returns {Object|null} Dati vetro o null
 */
function getVetro(codice) {
    if (!codice) return null;
    return FINSTRAL_OPZIONI.vetri.find(v => v.codice === codice);
}

/**
 * Calcola supplemento vetro per superficie
 * @param {string} codice - Codice vetro
 * @param {number} superficieM2 - Superficie in m²
 * @returns {number} Supplemento totale in €
 */
function calcolaSupplementoVetro(codice, superficieM2) {
    const vetro = getVetro(codice);
    if (!vetro) return 0;
    const superficieEffettiva = Math.max(superficieM2, 0.4); // Minimo 0.4 m²
    return vetro.supplemento * superficieEffettiva;
}

/**
 * Genera HTML per una <select> da un array di opzioni
 * @param {Array} opzioni - Array di opzioni
 * @param {string} valoreSel - Valore selezionato
 * @param {string} labelKey - Chiave per il label (default: "nome")
 * @param {string} valueKey - Chiave per il value (default: "codice")
 * @returns {string} HTML options
 */
function generaOpzioniSelect(opzioni, valoreSel = '', labelKey = 'nome', valueKey = 'codice') {
    return opzioni.map(opt => {
        const value = opt[valueKey] || '';
        const label = opt[labelKey] || value;
        const selected = value === valoreSel ? 'selected' : '';
        return `<option value="${value}" ${selected}>${label}</option>`;
    }).join('\n');
}

/**
 * Genera HTML completo per una <select> Finstral
 * @param {string} tipo - Tipo opzione (telai, coloriPVC, tipiAnta, etc.)
 * @param {string} id - ID elemento select
 * @param {string} valoreSel - Valore selezionato
 * @param {string} classe - Classi CSS aggiuntive
 * @returns {string} HTML select completo
 */
function generaSelectFinstral(tipo, id, valoreSel = '', classe = '') {
    const opzioni = FINSTRAL_OPZIONI[tipo];
    if (!opzioni) return `<select id="${id}" class="${classe}"><option>Tipo non trovato</option></select>`;
    
    const options = generaOpzioniSelect(opzioni, valoreSel);
    return `<select id="${id}" class="${classe}">
        <option value="">-- Seleziona --</option>
        ${options}
    </select>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

// Per browser (globale)
if (typeof window !== 'undefined') {
    window.FINSTRAL_OPZIONI = FINSTRAL_OPZIONI;
    window.getGruppoColorePVC = getGruppoColorePVC;
    window.getGruppoColoreAlluminio = getGruppoColoreAlluminio;
    window.normalizzaTipoAnta = normalizzaTipoAnta;
    window.getVetriPerTipo = getVetriPerTipo;
    window.getVetro = getVetro;
    window.calcolaSupplementoVetro = calcolaSupplementoVetro;
    window.generaOpzioniSelect = generaOpzioniSelect;
    window.generaSelectFinstral = generaSelectFinstral;
}

// Per Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FINSTRAL_OPZIONI,
        getGruppoColorePVC,
        getGruppoColoreAlluminio,
        normalizzaTipoAnta,
        getVetriPerTipo,
        getVetro,
        calcolaSupplementoVetro,
        generaOpzioniSelect,
        generaSelectFinstral
    };
}
