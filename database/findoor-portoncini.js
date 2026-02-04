// ============================================================================
// FINDOOR-PORTONCINI.js v1.0.0 - Database Portoncini FIN-Door Finstral
// ============================================================================
// Listino EUR 2025/10 - Ottobre 2025 (359 pagine)
// Modulo STANDALONE per shared-database
//
// CONTIENE: Tutti i dati per configurazione portoncini FIN-Door
// - 67 modelli standard (01-122) + 30 modelli Inlay (C2.0-28.0)
// - Colori PVC, Alluminio, Legno, Superfici Inlay
// - Tipi apertura, combinazioni materiali
// - Telai per combinazione, ante per combinazione
// - Maniglie (set + maniglioni), Tagli telaio
// - Prezzi base (griglie PVC/ALU)
// - Helper functions: getTipoAperturaInfo, getCombinazioneMat, etc.
//
// SOSTITUISCE: sezione FINDOOR_* in finstral-config.js
// ESTRAE DA app.js: getTipoAperturaInfo()
//
// DIPENDENZE: nessuna (modulo autonomo)
// ============================================================================

(function() {
'use strict';

// ════════════════════════════════════════════════════════════════════════════
// 1. TIPI APERTURA (configurazioni vano) - Estratto da app.js
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_TIPI_APERTURA = {
    '720':  { desc: 'Porta singola standard', ante: 1, laterali: 0, sopraluce: false },
    '625':  { desc: 'Porta singola (variante calcolo)', ante: 1, laterali: 0, sopraluce: false },
    '621':  { desc: 'Porta + laterale fisso SX', ante: 1, laterali: 1, sopraluce: false },
    '622':  { desc: 'Porta + laterale fisso DX', ante: 1, laterali: 1, sopraluce: false },
    '621C': { desc: 'Accoppiata + laterale fisso SX', ante: 1, laterali: 1, sopraluce: false },
    '622C': { desc: 'Accoppiata + laterale fisso DX', ante: 1, laterali: 1, sopraluce: false },
    '633':  { desc: 'Porta + 2 laterali fissi', ante: 1, laterali: 2, sopraluce: false },
    '633C': { desc: 'Accoppiata + 2 laterali fissi', ante: 1, laterali: 2, sopraluce: false },
    '624':  { desc: 'Porta + sopraluce fisso', ante: 1, laterali: 0, sopraluce: true },
    '623':  { desc: 'Porta + anta superiore (ribalta)', ante: 1, laterali: 0, sopraluce: true },
    '624C': { desc: 'Accoppiata + sopraluce', ante: 1, laterali: 0, sopraluce: true },
    '623C': { desc: 'Accoppiata + anta superiore', ante: 1, laterali: 0, sopraluce: true },
    '636':  { desc: 'Doppia porta (2 ante)', ante: 2, laterali: 0, sopraluce: false },
    '626':  { desc: 'Doppia porta + laterale SX', ante: 2, laterali: 1, sopraluce: false },
    '627':  { desc: 'Doppia porta + laterale DX', ante: 2, laterali: 1, sopraluce: false },
    '649':  { desc: 'Doppia porta + 2 laterali', ante: 2, laterali: 2, sopraluce: false },
    '628':  { desc: 'Doppia porta + sopraluce', ante: 2, laterali: 0, sopraluce: true },
    '629':  { desc: 'Doppia porta + anta superiore', ante: 2, laterali: 0, sopraluce: true },
    '634':  { desc: 'Porta + laterale + sopraluce', ante: 1, laterali: 1, sopraluce: true },
    '638':  { desc: 'Porta + laterale + 2 sopraluce', ante: 1, laterali: 1, sopraluce: true },
    '644':  { desc: 'Porta + laterale + anta superiore', ante: 1, laterali: 1, sopraluce: true },
    '640':  { desc: 'Porta + 2 laterali + sopraluce', ante: 1, laterali: 2, sopraluce: true },
    '663':  { desc: 'Porta + 2 laterali + 3 sopraluce', ante: 1, laterali: 2, sopraluce: true }
};

// ════════════════════════════════════════════════════════════════════════════
// 2. MODELLI ANTA - 97 modelli completi dal listino EUR 2025/10
// ════════════════════════════════════════════════════════════════════════════
// Categorie:
//   STD = Standard (sistemi F96/A96/T926/A95/T936) - 55 modelli
//   T935 = Solo sistema T935/T947 (PVC-PVC) - 12 modelli  
//   INLAY = Cornice applicata T935/T947 - 30 modelli
//
// Prezzi: [standard, misura_grande] - Grande = L>1115 o H>2355
// Sistemi: F96=PVC Flat, A96=ALU, T926=T-type, A95=ALU-ALU, T936=T-ALU

window.FINDOOR_MODELLI_ANTA = {
    // ── MODELLI STANDARD (F96/A96/T926/A95/T936) ──
    '01':   { cat: 'STD', desc: 'Pannello liscio', minL: 460, minH: 1770, prezzi: [2561, 2704], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '02':   { cat: 'STD', desc: 'Fresatura', minL: 750, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '04':   { cat: 'STD', desc: 'Fresatura', minL: 600, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '05':   { cat: 'STD', desc: 'Fresatura', minL: 600, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '06':   { cat: 'STD', desc: 'Fresatura', minL: 600, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '07':   { cat: 'STD', desc: 'Fresatura', minL: 460, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '20':   { cat: 'STD', desc: 'Inserto inox/ceramica', minL: 460, minH: 1770, prezzi: [2662, 2805], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '21':   { cat: 'STD', desc: 'Inserto inox/ceramica', minL: 460, minH: 1770, prezzi: [2662, 2805], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '23':   { cat: 'STD', desc: 'Fresatura + inserto inox/ceramica', minL: 600, minH: 1770, prezzi: [2935, 3078], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '24':   { cat: 'STD', desc: 'Inserto inox/ceramica', minL: 460, minH: 1770, prezzi: [2662, 2805], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '41':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 800, minH: 1770, prezzi: [3568, 3710], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '43':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 880, minH: 1900, prezzi: [3872, 4015], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '44':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 860, minH: 1770, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '45':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 650, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '46-1': { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 750, minH: 1860, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '46-2': { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 750, minH: 1860, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '47-1': { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 750, minH: 1860, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '47-2': { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 750, minH: 1860, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '48':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 600, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '49':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 600, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '50-1': { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 700, minH: 1910, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '50-2': { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 700, minH: 1910, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '51':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 700, minH: 1870, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '52':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 680, minH: 1810, prezzi: [3243, 3386], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '54':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 600, minH: 1850, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '58':   { cat: 'STD', desc: 'Inserto vetro + inox', minL: 840, minH: 1770, prezzi: [2952, 3095], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '61':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 800, minH: 1770, prezzi: [3047, 3190], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '62':   { cat: 'STD', desc: 'Inserto vetro + inox', minL: 500, minH: 1850, prezzi: [3234, 3377], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '63':   { cat: 'STD', desc: 'Inserto vetro + inox', minL: 800, minH: 1850, prezzi: [3234, 3377], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '64':   { cat: 'STD', desc: 'Fresatura + vetro + inox', minL: 850, minH: 1950, prezzi: [3780, 3923], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '66':   { cat: 'STD', desc: 'Fresatura + vetro + inox', minL: 850, minH: 1770, prezzi: [3371, 3514], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '72':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 700, minH: 1970, prezzi: [3035, 3178], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '74':   { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 700, minH: 1920, prezzi: [3035, 3178], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '85':   { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 650, minH: 1830, prezzi: [3035, 3178], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '100':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 970, minH: 1770, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '101':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 970, minH: 1770, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '102':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 970, minH: 1770, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '103':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 970, minH: 1770, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '104':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 720, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '105':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 720, minH: 2110, prezzi: [3116, 3258], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '106':  { cat: 'STD', desc: 'Inserto vetro + inox', minL: 460, minH: 1770, prezzi: [3371, 3514], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '107':  { cat: 'STD', desc: 'Inserto vetro + inox', minL: 460, minH: 1770, prezzi: [3371, 3514], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '108':  { cat: 'STD', desc: 'Fresatura + inserto vetro', minL: 800, minH: 1770, prezzi: [3035, 3178], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '109':  { cat: 'STD', desc: 'Fresatura', minL: 450, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '110':  { cat: 'STD', desc: 'Fresatura', minL: 450, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '111':  { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 920, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '112':  { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 920, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '113':  { cat: 'STD', desc: 'Fresatura', minL: 800, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '114':  { cat: 'STD', desc: 'Fresatura', minL: 800, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '115':  { cat: 'STD', desc: 'Fresatura', minL: 600, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '116':  { cat: 'STD', desc: 'Fresatura', minL: 800, minH: 1770, prezzi: [2579, 2722], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '117':  { cat: 'STD', desc: 'Inserto vetro + inox', minL: 800, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '118':  { cat: 'STD', desc: 'Inserto vetro + inox', minL: 800, minH: 1770, prezzi: [3234, 3377], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '119':  { cat: 'STD', desc: 'Inserto vetro + inox', minL: 800, minH: 1770, prezzi: [3234, 3377], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '120':  { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 600, minH: 1770, prezzi: [2862, 2998], fono: true, sistemi: ['A96'] },
    '121':  { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 800, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },
    '122':  { cat: 'STD', desc: 'Inserto vetro/ceramica', minL: 700, minH: 1770, prezzi: [2957, 3100], fono: true, sistemi: ['F96','A96','T926','A95','T936'] },

    // ── MODELLI T935/T947 (solo PVC-PVC Step Frame) ──
    '86':   { cat: 'T935', desc: 'Fresatura (solo T935)', minL: 830, minH: 1980, prezzi: [1267, 1267], fono: true, sistemi: ['T935'] },
    '87':   { cat: 'T935', desc: 'Fresatura (solo T935)', minL: 850, minH: 1995, prezzi: [1267, 1267], fono: true, sistemi: ['T935'] },
    '89':   { cat: 'T935', desc: 'Fresatura (solo T935)', minL: 830, minH: 1980, prezzi: [1267, 1267], fono: true, sistemi: ['T935'] },
    '91':   { cat: 'T935', desc: 'Fresatura (solo T935)', minL: 860, minH: 1960, prezzi: [1267, 1267], fono: true, sistemi: ['T935'] },
    '92':   { cat: 'T935', desc: 'Fresatura (T812/T815 + T935)', minL: 720, minH: 1720, prezzi: [2355, 2355], fono: true, sistemi: ['T935','T812'] },
    '93':   { cat: 'T935', desc: 'Fresatura (T812/T815 + T935)', minL: 750, minH: 1770, prezzi: [2355, 2355], fono: true, sistemi: ['T935','T812'] },
    '94':   { cat: 'T935', desc: 'Fresatura + inserto vetro (T812 + T935)', minL: 920, minH: 2000, prezzi: [2940, 2940], fono: true, sistemi: ['T935','T812'] },
    '96':   { cat: 'T935', desc: 'Fresatura + inserto vetro (T812 + T935)', minL: 920, minH: 2000, prezzi: [3210, 3210], fono: true, sistemi: ['T935','T812'] },
    '97':   { cat: 'T935', desc: 'Fresatura + inserto vetro (T812 + T935)', minL: 720, minH: 2030, prezzi: [2813, 2813], fono: true, sistemi: ['T935','T812'] },
    '98':   { cat: 'T935', desc: 'Fresatura + inserto vetro (T812 + T935)', minL: 760, minH: 1780, prezzi: [2985, 2985], fono: true, sistemi: ['T935','T812'] },

    // ── MODELLI INLAY (cornice applicata, solo T935/T947) ──
    'C2.0':  { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '2.0':   { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C2.1':  { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '2.1':   { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '2.3':   { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C4.0':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C4.3':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C5.0':  { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '5.0':   { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C5.3':  { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C10.1': { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '10.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C11.1': { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C11.2': { cat: 'INLAY', desc: 'Cornice + inserto vetro (listelli)', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '11.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '11.2':  { cat: 'INLAY', desc: 'Cornice + inserto vetro (listelli)', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '14.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 525, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '16.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1800, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '17.0':  { cat: 'INLAY', desc: 'Cornice applicata', minL: 745, minH: 1800, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '18.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 525, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '19.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [2237, 2716], fono: false, sistemi: ['T935'] },
    '20.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '20.2':  { cat: 'INLAY', desc: 'Cornice + inserto vetro (listelli)', minL: 745, minH: 1865, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '21.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 665, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '21.2':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 665, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '22.1':  { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 665, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '25.0':  { cat: 'INLAY', desc: 'Cornice + fresatura + vetro', minL: 665, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    '26.0':  { cat: 'INLAY', desc: 'Cornice + fresatura + vetro', minL: 665, minH: 1770, prezzi: [0, 0], fono: false, sistemi: ['T935'] },
    'C27.1': { cat: 'INLAY', desc: 'Cornice + inserto vetro', minL: 835, minH: 1865, prezzi: [2165, 2644], fono: false, sistemi: ['T935'] },
    '28.0':  { cat: 'INLAY', desc: 'Fresatura', minL: 500, minH: 1770, prezzi: [1406, 2048], fono: false, sistemi: ['T935'] }
};

// ════════════════════════════════════════════════════════════════════════════
// 3. COLORI PVC - Gruppi A e B (pag. 76)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_COLORI_PVC = {
    gruppoA: {
        desc: 'Gruppo A - Bianco',
        suppl: 0,
        colori: [
            { cod: '01', nome: 'Bianco extraliscio' },
            { cod: '45', nome: 'Bianco satinato' },
            { cod: '27', nome: 'Bianco perla satinato' },
            { cod: '42', nome: 'Bianco goffrato' },
            { cod: '07', nome: 'Bianco perla goffrato' }
        ]
    },
    gruppoB: {
        desc: 'Gruppo B - Scuri/Decoro legno',
        suppl: 0,  // incluso nel prezzo base
        colori: [
            { cod: '46', nome: 'Grigio seta satinato' },
            { cod: '06', nome: 'Grigio goffrato' },
            { cod: '13', nome: 'Castagno decoro legno' },
            { cod: '19', nome: 'Rovere decoro legno' },
            { cod: '55', nome: 'Noce chiaro decoro legno' }
        ]
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 4. COLORI ALLUMINIO - Gruppi 1, 1H, 2, 3 (pag. 77-78)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_COLORI_ALU = {
    gruppo1: {
        desc: 'Gruppo 1 - Standard',
        suppl: 0,
        colori: [
            'F05','F45','F90','F91','F113','F609','F703','F716','F739','F742','F744',
            'F819','F901','F905',
            'M01','M119','M605','M701','M716','M722','M735','M817','M901','M905',
            'M906','M907','M910','M916',
            '9017'
        ]
    },
    gruppo1H: {
        desc: 'Gruppo 1H - Decoro legno',
        suppl: 0,
        colori: [
            'L13','L14','L16','L18','L19','L55',
            'LX01','LX02','LX03','LX04'
        ]
    },
    gruppo2: {
        desc: 'Gruppo 2 - Speciali',
        suppl: 54,  // €/ml perimetro telaio
        colori: [
            'F09','F92','F93','F94','F95','F119','F305','F511','F612',
            'F702','F721','F722','F723','F822','F918','F958',
            'M822'
        ]
    },
    gruppo3: {
        desc: 'Gruppo 3 - NCS/DB/Colori speciali',
        suppl: 105,  // €/ml perimetro telaio
        colori: ['NCS','DB','RAL speciali']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 5. SUPERFICI LEGNO - Gruppi 0-4 (pag. 79)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_COLORI_LEGNO = {
    gruppo0: {
        desc: 'Gruppo 0 - Grezzo',
        colori: ['Grezzo (senza trattamento)']
    },
    gruppo1: {
        desc: 'Gruppo 1 - Abete rosso chiaro',
        colori: ['1X03','1X10','1X11','1X12','1X13','1X14']
    },
    gruppo2: {
        desc: 'Gruppo 2 - Abete rosso scuro',
        colori: ['2X01','2X02','2X03']
    },
    gruppo3: {
        desc: 'Gruppo 3 - Larice',
        colori: ['3X02','3X03','3X04','3X05','3X06','3X07','3X10']
    },
    gruppo4: {
        desc: 'Gruppo 4 - Rovere',
        colori: ['4X01']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 6. SUPERFICI INLAY (pag. 80) - Solo per modelli INLAY
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_SUPERFICI_INLAY = {
    ceramica: {
        desc: 'Ceramica',
        codici: ['7C03','7C04','7C05','7C06','7C07','7C08','7C09','7C10','7C11','7C12','7C13','7C14','7C15','7C16','7C17']
    },
    legno: {
        desc: 'Legno',
        codici: ['7X01','7X02','7X03','7X04','7X05']
    },
    metallo: {
        desc: 'Metallo',
        codici: ['7M01','7M02','7M03','7M04','7M05']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 7. COMBINAZIONI MATERIALI
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_COMBINAZIONI = {
    'PVC':   ['PVC', 'ALU'],       // PVC interno → PVC o ALU esterno
    'LEGNO': ['ALU'],              // Legno interno → solo ALU esterno
    'ALU':   ['ALU']               // ALU interno → solo ALU esterno
};

// ════════════════════════════════════════════════════════════════════════════
// 8. TELAI PER COMBINAZIONE MATERIALI (pag. 10-22)
// ════════════════════════════════════════════════════════════════════════════
// Struttura: COMB → FORMA → CODICE → { desc, spessore, supplPvc, supplAlu }

window.FINDOOR_TELAI_PER_COMB = {
    'PVC-PVC': {
        'L': {
            '961':  { desc: 'PVC-PVC 77mm (standard)', spessore: 77, supplPvc: 0, supplAlu: 5.20 },
            '962':  { desc: 'PVC-PVC 90mm', spessore: 90, supplPvc: 0, supplAlu: 5.61 },
            '963':  { desc: 'PVC-PVC 124mm', spessore: 124, supplPvc: 2.89, supplAlu: 9.31 },
            '961N': { desc: 'PVC-PVC 77mm Nova-line', spessore: 77, supplPvc: 5.28, supplAlu: 10.5 },
            '962N': { desc: 'PVC-PVC 90mm Nova-line', spessore: 90, supplPvc: 5.28, supplAlu: 10.5 },
            '963N': { desc: 'PVC-PVC 124mm Nova-line', spessore: 124, supplPvc: 8.17, supplAlu: 14.6 },
            '961N5':{ desc: 'PVC-PVC 77mm Nova-line 5°', spessore: 77, supplPvc: 5.28, supplAlu: 10.5 },
            '962N5':{ desc: 'PVC-PVC 90mm Nova-line 5°', spessore: 90, supplPvc: 5.28, supplAlu: 10.5 },
            '963N5':{ desc: 'PVC-PVC 124mm Nova-line 5°', spessore: 124, supplPvc: 8.17, supplAlu: 14.6 },
            '961X': { desc: 'PVC-PVC 77mm (variante)', spessore: 77, supplPvc: 0, supplAlu: 5.20 },
            '962X': { desc: 'PVC-PVC 90mm (variante)', spessore: 90, supplPvc: 0, supplAlu: 5.61 },
            '963X': { desc: 'PVC-PVC 124mm (variante)', spessore: 124, supplPvc: 2.89, supplAlu: 9.31 },
            '924':  { desc: 'PVC-PVC 90mm (variante)', spessore: 90, supplPvc: 0, supplAlu: 5.61 },
            '991':  { desc: 'PVC-PVC 77mm', spessore: 77, supplPvc: 0, supplAlu: 5.20 },
            '951':  { desc: 'PVC-PVC 62mm', spessore: 62, supplPvc: 0, supplAlu: 5.20 },
            '924K': { desc: 'PVC-PVC 90mm RC2', spessore: 90, supplPvc: 0, supplAlu: 5.61 },
            '991K': { desc: 'PVC-PVC 77mm RC2', spessore: 77, supplPvc: 0, supplAlu: 5.20 },
            '951K': { desc: 'PVC-PVC 62mm RC2', spessore: 62, supplPvc: 0, supplAlu: 5.20 },
            '924N': { desc: 'PVC-PVC 90mm Nova-line', spessore: 90, supplPvc: 5.28, supplAlu: 10.5 },
            '991N': { desc: 'PVC-PVC 77mm Nova-line', spessore: 77, supplPvc: 5.28, supplAlu: 10.5 },
            '951L': { desc: 'PVC-PVC 62mm (variante L)', spessore: 62, supplPvc: 0, supplAlu: 5.20 }
        },
        'Z': {
            '962Z': { desc: 'PVC-PVC 90mm forma Z', spessore: 90, supplPvc: 0, supplAlu: 5.61 },
            '961Z': { desc: 'PVC-PVC 77mm forma Z', spessore: 77, supplPvc: 0, supplAlu: 5.20 }
        },
        'T': {
            '935T': { desc: 'PVC-PVC T935 Step Frame', spessore: 77, supplPvc: 0, supplAlu: 5.20 },
            '947T': { desc: 'PVC-PVC T947 Step Frame', spessore: 90, supplPvc: 0, supplAlu: 5.61 }
        }
    },
    'PVC-ALU': {
        'L': {
            'A961':  { desc: 'ALU-PVC 77mm', spessore: 77, supplAlu: 16.30 },
            'A962':  { desc: 'ALU-PVC 90mm', spessore: 90, supplAlu: 16.70 },
            'A963':  { desc: 'ALU-PVC 124mm', spessore: 124, supplAlu: 20.30 },
            'A961N': { desc: 'ALU-PVC 77mm Nova-line', spessore: 77, supplAlu: 21.50 },
            'A962N': { desc: 'ALU-PVC 90mm Nova-line', spessore: 90, supplAlu: 21.90 },
            'A963N': { desc: 'ALU-PVC 124mm Nova-line', spessore: 124, supplAlu: 25.90 },
            'A924':  { desc: 'ALU-PVC 90mm (variante)', spessore: 90, supplAlu: 16.70 },
            'A991':  { desc: 'ALU-PVC 77mm', spessore: 77, supplAlu: 16.30 },
            'A951':  { desc: 'ALU-PVC 62mm', spessore: 62, supplAlu: 16.30 }
        },
        'Z': {
            'A962Z': { desc: 'ALU-PVC 90mm forma Z', spessore: 90, supplAlu: 16.70 }
        }
    },
    'LEGNO-ALU': {
        'L': {
            'A705':  { desc: 'ALU-Legno 78mm', spessore: 78, supplAlu: 24.20 },
            'A706':  { desc: 'ALU-Legno 84mm (est.)', spessore: 84, supplAlu: 32.40 }
        },
        'Z': {
            '707':   { desc: 'ALU-Legno 75mm', spessore: 75, supplAlu: 36.40 }
        },
        'T': {
            '718T':  { desc: 'ALU-Legno 87mm', spessore: 87, supplAlu: 32.40 }
        }
    },
    'ALU-ALU': {
        'L': {
            'A926':  { desc: 'ALU-ALU 78mm', spessore: 78, supplAlu: 24.20 },
            'A926N': { desc: 'ALU-ALU 78mm Nova-line', spessore: 78, supplAlu: 29.40 },
            'A936':  { desc: 'ALU-ALU 90mm', spessore: 90, supplAlu: 27.80 },
            'A936N': { desc: 'ALU-ALU 90mm Nova-line', spessore: 90, supplAlu: 33.00 },
            'A95':   { desc: 'ALU-ALU standard', spessore: 78, supplAlu: 24.20 }
        },
        'Z': {
            'A926Z': { desc: 'ALU-ALU 78mm forma Z', spessore: 78, supplAlu: 24.20 }
        },
        'T': {
            'A926T': { desc: 'ALU-ALU 78mm T-shape', spessore: 78, supplAlu: 24.20 }
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 9. TIPI ANTA PER COMBINAZIONE (pag. 24-30)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_ANTE_PER_COMB = {
    'PVC-PVC': [
        { cod: 'FLAT_FRAME-FLAT_FRAME', desc: 'Flat Frame - Flat Frame', tab: 'PVC' },
        { cod: 'FLAT_FRAME-STEP_FRAME', desc: 'Flat Frame - Step Frame', tab: 'PVC' },
        { cod: 'STEP_FRAME-STEP_FRAME', desc: 'Step Frame - Step Frame', tab: 'PVC' }
    ],
    'PVC-ALU': [
        { cod: 'STEP_PLANAR-FLAT_FRAME', desc: 'Step Planar (ALU) - Flat Frame (PVC)', tab: 'ALU' },
        { cod: 'STEP_PLANAR-STEP_FRAME', desc: 'Step Planar (ALU) - Step Frame (PVC)', tab: 'ALU' }
    ],
    'LEGNO-ALU': [
        { cod: 'STEP_PLANAR-LEGNO', desc: 'Step Planar (ALU) - Legno int.', tab: 'ALU' },
        { cod: 'FLAT_PLANAR-LEGNO', desc: 'Flat Planar (ALU) - Legno int.', tab: 'ALU' }
    ],
    'ALU-ALU': [
        { cod: 'FLAT_PLANAR-FLAT_PLANAR', desc: 'Flat Planar - Flat Planar', tab: 'ALU' },
        { cod: 'FLAT_PLANAR-STEP_PLANAR', desc: 'Flat Planar - Step Planar', tab: 'ALU' },
        { cod: 'STEP_PLANAR-STEP_PLANAR', desc: 'Step Planar - Step Planar', tab: 'ALU' }
    ]
};

// ════════════════════════════════════════════════════════════════════════════
// 10. MANIGLIE - Set e Maniglioni (pag. 55-60)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_MANIGLIE = {
    set: {
        'S01': { desc: 'Dublin (PVC)', prezzo: 0 },
        'S02': { desc: 'London (PVC)', prezzo: 64 },
        'S03': { desc: 'Amsterdam (PVC satinato)', prezzo: 114 },
        'S04': { desc: 'New York (inox)', prezzo: 197 },
        'S05': { desc: 'Shanghai (inox satinato)', prezzo: 197 },
        'S06': { desc: 'Tokio (inox lucido)', prezzo: 241 },
        'S07': { desc: 'Paris (inox)', prezzo: 241 },
        'S08': { desc: 'Berlin (inox nero)', prezzo: 197 },
        'S09': { desc: 'Roma (inox opaco)', prezzo: 241 },
        'S10': { desc: 'Sydney (inox design)', prezzo: 287 },
        'S11': { desc: 'Vienna (inox premium)', prezzo: 362 },
        'S12': { desc: 'Milano (inox flat)', prezzo: 241 }
    },
    maniglioni: {
        'M01': { desc: 'Maniglione 400mm dritto (inox)', prezzo: 183 },
        'M02': { desc: 'Maniglione 600mm dritto (inox)', prezzo: 225 },
        'M03': { desc: 'Maniglione 800mm dritto (inox)', prezzo: 268 },
        'M04': { desc: 'Maniglione 1000mm dritto (inox)', prezzo: 310 },
        'M05': { desc: 'Maniglione 400mm curvo (inox)', prezzo: 225 },
        'M06': { desc: 'Maniglione 600mm curvo (inox)', prezzo: 268 },
        'M07': { desc: 'Maniglione 800mm angolo (inox)', prezzo: 310 },
        'M08': { desc: 'Maniglione 1200mm dritto (inox)', prezzo: 362 },
        'M09': { desc: 'Maniglione 1600mm dritto (inox)', prezzo: 415 }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 11. TAGLI TELAIO - Prezzi €/ml e disponibilità per telaio
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_TAGLI_PREZZI = {
    'T001': 5.20, 'T002': 7.80, 'T003': 9.40, 'T004': 12.60,
    'T005': 15.80, 'T006': 18.40, 'T007': 21.00, 'T008': 8.50,
    'T009': 11.20, 'T010': 14.80, 'T011': 6.30, 'T012': 9.10,
    'T013': 13.40, 'T014': 16.20, 'T015': 19.80, 'T016': 22.40,
    'T017': 7.50, 'T018': 10.80, 'T019': 14.20, 'T020': 17.60,
    'T021': 5.80, 'T022': 8.40, 'T023': 12.60, 'T024': 15.40,
    'T025': 18.80
};

window.FINDOOR_TAGLI_PER_TELAIO = {
    '961':  ['T001','T002','T003','T008','T011','T017','T021'],
    '962':  ['T001','T002','T003','T004','T008','T009','T011','T012','T017','T018','T021','T022'],
    '963':  ['T001','T002','T003','T004','T005','T008','T009','T010','T011','T012','T013','T017','T018','T019','T021','T022','T023'],
    '961N': ['T001','T002','T003','T008','T011','T017','T021'],
    '962N': ['T001','T002','T003','T004','T008','T009','T011','T012','T017','T018','T021','T022'],
    '963N': ['T001','T002','T003','T004','T005','T008','T009','T010','T011','T012','T013'],
    '924':  ['T001','T002','T003','T004','T008','T009','T011','T012'],
    '991':  ['T001','T002','T003','T008','T011'],
    '951':  ['T001','T002','T008','T011'],
    'A961': ['T001','T002','T003','T008','T011','T017'],
    'A962': ['T001','T002','T003','T004','T008','T009','T011','T012'],
    'A963': ['T001','T002','T003','T004','T005','T008','T009','T010'],
    'A926': ['T001','T002','T003','T008','T011'],
    'A936': ['T001','T002','T003','T004','T008','T009']
};

// ════════════════════════════════════════════════════════════════════════════
// 12. PREZZI BASE - Griglie LxH (pag. 77-85)
// ════════════════════════════════════════════════════════════════════════════
// Colonne: Larghezze BRM (mm) | Righe: Altezze BRM (mm) → Prezzo €

window.FINDOOR_PREZZI_BASE = {
    PVC: {
        colonne: [700, 800, 900, 1000, 1100, 1115],
        righe: {
            1800: [1298, 1355, 1412, 1470, 1527, 1534],
            1900: [1355, 1412, 1470, 1527, 1584, 1591],
            2000: [1412, 1470, 1527, 1584, 1641, 1649],
            2100: [1470, 1527, 1584, 1641, 1698, 1706],
            2200: [1527, 1584, 1641, 1698, 1756, 1763],
            2300: [1584, 1641, 1698, 1756, 1813, 1820],
            2355: [1613, 1670, 1727, 1785, 1842, 1849]
        }
    },
    PVC_GRANDE: {
        colonne: [1116, 1200, 1300, 1400],
        righe: {
            1800: [1541, 1598, 1670, 1741],
            1900: [1598, 1656, 1727, 1798],
            2000: [1656, 1713, 1784, 1856],
            2100: [1713, 1770, 1842, 1913],
            2200: [1770, 1827, 1899, 1970],
            2300: [1827, 1885, 1956, 2027],
            2356: [1856, 1913, 1985, 2056],
            2500: [1913, 1970, 2042, 2113]
        }
    },
    ALU: {
        colonne: [700, 800, 900, 1000, 1100, 1115],
        righe: {
            1800: [1870, 1941, 2013, 2084, 2156, 2163],
            1900: [1941, 2013, 2084, 2156, 2227, 2234],
            2000: [2013, 2084, 2156, 2227, 2299, 2306],
            2100: [2084, 2156, 2227, 2299, 2370, 2377],
            2200: [2156, 2227, 2299, 2370, 2442, 2449],
            2300: [2227, 2299, 2370, 2442, 2513, 2520],
            2355: [2263, 2334, 2406, 2477, 2549, 2556]
        }
    },
    ALU_GRANDE: {
        colonne: [1116, 1200, 1300, 1400],
        righe: {
            1800: [2170, 2242, 2327, 2413],
            1900: [2242, 2313, 2399, 2484],
            2000: [2313, 2385, 2470, 2556],
            2100: [2385, 2456, 2542, 2627],
            2200: [2456, 2528, 2613, 2699],
            2300: [2528, 2599, 2685, 2770],
            2356: [2563, 2635, 2720, 2806],
            2500: [2635, 2706, 2792, 2877]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 13. HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Restituisce info descrittiva del tipo apertura
 * ESTRATTO da app.js getTipoAperturaInfo()
 */
window.getTipoAperturaInfo = function(tipo) {
    const t = window.FINDOOR_TIPI_APERTURA[tipo];
    return t ? t.desc : 'Seleziona tipo apertura';
};

/**
 * Determina combinazione materiali (es. "PVC-ALU")
 */
window.getCombinazioneMat = function(ptc) {
    const matInt = ptc.materialeInt || 'PVC';
    const matEst = ptc.materialeEst || 'PVC';
    // LEGNO interno → sempre ALU esterno
    if (matInt === 'LEGNO') return 'LEGNO-ALU';
    // ALU interno → sempre ALU esterno
    if (matInt === 'ALU') return 'ALU-ALU';
    // PVC interno
    return matEst === 'ALU' ? 'PVC-ALU' : 'PVC-PVC';
};

/**
 * Restituisce array tipi anta disponibili per combinazione
 */
window.getAntePerComb = function(comb) {
    return window.FINDOOR_ANTE_PER_COMB[comb] || [];
};

/**
 * Cerca prezzo base in griglia dimensionale
 */
window.calcolaPrezzoBasePortoncino = function(L, H, tipoTab) {
    const isGrande = (L > 1115 || H > 2355);
    const tabKey = isGrande ? tipoTab + '_GRANDE' : tipoTab;
    const tab = window.FINDOOR_PREZZI_BASE[tabKey];
    if (!tab) return 0;

    // Trova colonna (larghezza)
    let colIdx = tab.colonne.findIndex(c => c >= L);
    if (colIdx < 0) colIdx = tab.colonne.length - 1;

    // Trova riga (altezza)
    const altezze = Object.keys(tab.righe).map(Number).sort((a, b) => a - b);
    const altTrovata = altezze.find(a => a >= H) || altezze[altezze.length - 1];

    return tab.righe[altTrovata]?.[colIdx] || 0;
};

/**
 * Calcola supplemento modello anta
 * prezzi[0] = standard, prezzi[1] = misura grande
 */
window.calcolaSupplModelloAnta = function(codModello, tipoAnta, isGrande) {
    const modello = window.FINDOOR_MODELLI_ANTA[codModello];
    if (!modello) return 0;
    const idx = isGrande ? 1 : 0;
    return modello.prezzi[idx] || 0;
};

/**
 * Aggiorna materiale esterno in base alla combinazione
 * Se matInt=ALU o LEGNO → forza matEst=ALU
 * NOTA: utility pura (dati). Per UI wrapper con projectId/posId → app.js
 */
window.findoorAdjustCombinazione = function(ptc) {
    const matInt = ptc.materialeInt || 'PVC';
    if (matInt === 'ALU' || matInt === 'LEGNO') {
        ptc.materialeEst = 'ALU';
    }
    return window.getCombinazioneMat(ptc);
};

/**
 * Filtra modelli compatibili con la combinazione materiali corrente
 */
window.getModelliPerCombinazione = function(comb) {
    const tutti = window.FINDOOR_MODELLI_ANTA;
    const risultati = {};
    
    for (const [cod, mod] of Object.entries(tutti)) {
        // I modelli T935/INLAY sono solo per PVC-PVC Step Frame
        if (mod.cat === 'T935' || mod.cat === 'INLAY') {
            if (comb === 'PVC-PVC') risultati[cod] = mod;
        } else {
            // STD disponibili per tutte le combinazioni
            risultati[cod] = mod;
        }
    }
    return risultati;
};

/**
 * Genera options HTML per select modello anta
 * Raggruppa per categoria (STD/T935/INLAY) con optgroup
 */
window.getModelliAntaOptionsHTML = function(selectedCod, comb) {
    const modelli = window.getModelliPerCombinazione(comb || 'PVC-PVC');
    
    const categorie = {
        'STD': { label: '── Modelli Standard ──', items: [] },
        'T935': { label: '── Modelli T935/T947 ──', items: [] },
        'INLAY': { label: '── Modelli Inlay (cornice) ──', items: [] }
    };
    
    for (const [cod, mod] of Object.entries(modelli)) {
        const prezzoStr = mod.prezzi[0] > 0 ? ` (€${mod.prezzi[0].toLocaleString('it-IT')})` : '';
        categorie[mod.cat].items.push(
            `<option value="${cod}" ${selectedCod === cod ? 'selected' : ''}>${cod} - ${mod.desc}${prezzoStr} [min ${mod.minL}×${mod.minH}]</option>`
        );
    }
    
    let html = '<option value="">Seleziona modello...</option>';
    for (const [cat, data] of Object.entries(categorie)) {
        if (data.items.length > 0) {
            html += `<optgroup label="${data.label}">`;
            html += data.items.join('');
            html += '</optgroup>';
        }
    }
    return html;
};

// Log caricamento
console.log(`📦 FINDOOR-PORTONCINI v1.0.0 caricato: ${Object.keys(window.FINDOOR_MODELLI_ANTA).length} modelli, ${Object.keys(window.FINDOOR_TIPI_APERTURA).length} tipi apertura`);

})();
