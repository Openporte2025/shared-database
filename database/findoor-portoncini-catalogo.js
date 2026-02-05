// ============================================================================
// FINDOOR-PORTONCINI.js v3.0.0 - Database Portoncini FIN-Door Finstral
// ============================================================================
// Listino EUR 2025/10 - Ottobre 2025 (359 pagine)
// Modulo STANDALONE per shared-database
//
// CONTIENE: Tutti i dati per configurazione portoncini FIN-Door
// - 97 modelli (55 STD + 12 T935 + 30 INLAY)
// - Colori PVC, Alluminio, Legno, Superfici Inlay
// - Tipi apertura, combinazioni materiali, telai
// - Maniglie REALI: set, maniglioni, aste, interne, barre (pag. 134-153)
// - Ferramenta: serrature, cerniere, cilindri, chiudiporta, soglie, RC2
// - Accessori: contatti, spioncini, fermaporta, limitatori
// - Prezzi base porta 720 PVC/ALU (pag. 82) - SOLO per modelli con prezzi [0,0]
// - Griglie laterali 102HT (pag. 83-85), fissi accoppiati (pag. 86-87)
// - Griglie sopraluce fisso/anta (pag. 88-89)
// - calcolaPrezzoPortoncinoFindoor() - calcolo completo CORRETTO v3
//
// ═══ LOGICA PREZZO v3 ═══
// Il PREZZO MODELLO è il prezzo principale della porta (come da conferma Finstral).
// NON si somma al prezzo base griglia. La griglia base serve SOLO per modelli
// con prezzi [0,0] (alcuni INLAY). Supplementi separati: telaio, colori, maniglie.
//
// DIPENDENZE: nessuna (modulo autonomo)
// USATO DA: App iPad (rilievo-test) + Dashboard (dashboard-test)
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
// 10. MANIGLIE REALI (pag. 134-153 listino EUR 2025/10)
// ════════════════════════════════════════════════════════════════════════════
// Codici colore: 01=bianco, 02=marrone, 07=grigio, 43=inox, 44=inox satinato,
//   48=ottone PVD, 41=ottone brunito, 56=alluminio neutro, E03=nero, RAL=verniciato

window.FINDOOR_MANIGLIE = {
    // ── SET MANIGLIE ESTERNE (coppia int+est, pag. 134-137) ──
    set: {
        '450': { desc: 'Maniglia su rosetta ovale', finiture: { '01': 104, '02': 104, '56': 104, '44': 104 } },
        '451': { desc: 'Maniglia int + piatta est', finiture: { '56': 104, '44': 104 } },
        '452': { desc: 'Maniglia su rosetta tonda', finiture: { '01': 104, '02': 104, '56': 104, '44': 104 } },
        '425': { desc: 'Maniglia design su rosetta', finiture: { '56': 118 } },
        '426': { desc: 'Maniglia design premium', finiture: { '56': 141 } },
        '401': { desc: 'Maniglia classica su placca', finiture: { '01': 104, '02': 104, '56': 104 } },
        '404': { desc: 'Maniglia classica premium', finiture: { '01': 141, '02': 141, '56': 141 } },
        '423': { desc: 'Maniglia ottone su rosetta', finiture: { '41': 141, '48': 214 } },
        '424': { desc: 'Maniglia ottone su placca', finiture: { '41': 140, '48': 214 } },
        '405': { desc: 'Pomello fisso est + maniglia int', finiture: { '56': 77.1 } },
        '407': { desc: 'Pomello + rosetta protez. cilindro', finiture: { '56': 90.4 } },
        '406': { desc: 'Pomello girevole est + man. int', finiture: { '56': 86.4 } }
    },

    // ── MANIGLIONI ESTERNI (pag. 138-140) ──
    maniglioni: {
        '506': { desc: 'Pomello fisso ø35mm', finiture: { '43': 223 } },
        '487': { desc: 'Maniglione ø35mm prof.90mm', finiture: { '43': 289 } },
        '488': { desc: 'Maniglione ø35mm asse 300mm L485', finiture: { '43': 519 } },
        '485': { desc: 'Maniglione ø35mm asse 300mm', finiture: { '43': 200 } },
        '468': { desc: 'Maniglione 45×15 asse 450mm', finiture: { '56': 413, 'E03': 523 } },
        '469': { desc: 'Maniglione 45×15 asse 450mm curvo', finiture: { '56': 434, 'E03': 553 } },
        '498': { desc: 'Maniglione 45×15 asse 350mm', finiture: { '56': 395, 'E03': 505 } },
        '391': { desc: 'Piastra 330×125mm', finiture: { '43': 133 } },
        '390': { desc: 'Piastra inox 330×90mm', finiture: { '43': 260 } },
        '341': { desc: 'Maniglione design 120×150mm', finiture: { '43': 293 } }
    },

    // ── MANIGLIE AD ASTA (pag. 141-142) ──
    // Prezzi: 43=inox, colori=verniciato RAL
    aste: {
        '490': { desc: 'Asta tonda ø30mm 500mm', finiture: { '43': 147, 'colori': 258 } },
        '491': { desc: 'Asta tonda ø30mm 600mm', finiture: { '43': 168, 'colori': 279 } },
        '492': { desc: 'Asta tonda ø30mm 1000mm', finiture: { '43': 189, 'colori': 300 } },
        '493': { desc: 'Asta tonda ø30mm 1800mm', finiture: { '43': 223, 'colori': 334 }, minAnta: 2000 },
        '494': { desc: 'Asta tonda ø30mm personaliz.', finiture: { '43': 466, 'colori': 577 } },
        '310': { desc: 'Asta piatta 40×15mm 500mm', finiture: { '43': 154, 'colori': 265 } },
        '311': { desc: 'Asta piatta 40×15mm 600mm', finiture: { '43': 175, 'colori': 285 } },
        '312': { desc: 'Asta piatta 40×15mm 1000mm', finiture: { '43': 196, 'colori': 306 } },
        '313': { desc: 'Asta piatta 40×15mm 1800mm', finiture: { '43': 230, 'colori': 341 } },
        '320': { desc: 'Asta quadra 35×35mm 500mm', finiture: { '43': 196, 'colori': 306 } },
        '321': { desc: 'Asta quadra 35×35mm 600mm', finiture: { '43': 203, 'colori': 313 } },
        '438': { desc: 'Asta tonda ø30mm variabile', finiture: { '43': 419, 'colori': 529 } },
        '439': { desc: 'Asta quadra 30×30mm variabile', finiture: { '43': 440, 'colori': 551 } },
        '380': { desc: 'Maniglione ø35mm 600mm asse 400', finiture: { '43': 145 } },
        '381': { desc: 'Maniglione ø35mm 1200mm asse 1000', finiture: { '43': 213 } },
        '382': { desc: 'Maniglione ø35mm 1600mm asse 1260', finiture: { '43': 263 }, minAnta: 2000 },
        '453': { desc: 'Maniglione angolare 1050×1050mm', finiture: { '43': 663 } }
    },

    // ── MANIGLIE INTERNE (pag. 146-149) ──
    interne: {
        '500': { desc: 'Maniglia int. su rosetta ovale', finiture: { '01': 90.1, '07': 97.4, '56': 90.1, '43': 105, '48': 164 } },
        '502': { desc: 'Maniglia int. semplice', finiture: { '56': 51.8, '44': 51.8 } },
        '570': { desc: 'Maniglia int. design S.10', finiture: { '56': 87.3, 'E03': 92.5, '43': 149 } },
        '571': { desc: 'Maniglia int. design S.11', finiture: { '56': 92.5, 'E03': 97.7, '43': 158 } },
        '574': { desc: 'Maniglia int. design S.11', finiture: { '56': 76.9, 'E03': 79.5, '43': 139 } },
        '575': { desc: 'Maniglia int. design S.12', finiture: { '56': 82.1, 'E03': 84.7, '43': 129, '48': 189 } },
        '576': { desc: 'Maniglia int. design S.13', finiture: { '56': 107, 'E03': 116, '43': 162, '48': 222 } },
        '577': { desc: 'Maniglia int. design S.14', finiture: { '56': 84.7, 'E03': 88.6, '43': 149 } }
    },

    // ── BARRE MANIGLIA (pag. 144) ──
    barre: {
        '70515': { desc: 'Barra verticale est. (solo Flat Planar)', finiture: { 'colori': 42.8 } },
        '830':   { desc: 'Rosetta quadrata', finiture: { 'colori': 122 } },
        '830L':  { desc: 'Rosetta quadrata con LED', finiture: { 'colori': 352 } },
        '830-6': { desc: 'Rosetta con Inlay ceramica', finiture: { 'colori': 361 } },
        '830L6': { desc: 'Rosetta Inlay ceramica + LED', finiture: { 'colori': 591 } }
    },

    // ── PREPARAZIONE FORI (pag. 153-154) ──
    fori: {
        '125_43': { desc: 'Rosetta rotonda inox', prezzo: 16.8 },
        '125_col': { desc: 'Rosetta rotonda verniciata', prezzo: 35.0 },
        '126_43': { desc: 'Rosetta rotonda inox + quadrotto', prezzo: 16.8 },
        '126_col': { desc: 'Rosetta rotonda vern. + quadrotto', prezzo: 35.0 },
        '118R_56': { desc: 'Cilindro con rosetta alluminio', prezzo: 9.50 },
        '118R_43': { desc: 'Cilindro con rosetta inox', prezzo: 9.50 },
        '127':     { desc: 'Senza fori maniglia', prezzo: 0 }
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
    // ── Porta 720 tipo base, pag 84 listino EUR 2025/10 ──
    // PVC-PVC: Step Frame - Step Frame
    PVC_PVC: {
        colonne: [990, 1115, 1240, 1365],
        righe: {
            2040: [1265, 1323, 1378, 1436],
            2165: [1297, 1356, 1416, 1473],
            2290: [1329, 1389, 1450, 1512],
            2415: [1440, 1503, 1566, 1629],
            2540: [1472, 1537, 1601, 1666],
            2665: [1505, 1571, 1638, 1703],
            2790: [1536, 1604, 1673, 1742],
            2915: [1568, 1639, 1709, 1779]
        }
    },
    // ALU-ALU: Flat Frame - Flat Frame, Flat Frame - Step Frame
    ALU_ALU: {
        colonne: [990, 1115, 1240, 1365, 1490],
        righe: {
            2040: [1908, 1983, 2058, 2135, 2208],
            2165: [1960, 2038, 2115, 2192, 2270],
            2290: [2012, 2092, 2172, 2251, 2330],
            2415: [2077, 2159, 2241, 2322, 2402],
            2540: [2129, 2212, 2296, 2380, 2464],
            2665: [2182, 2267, 2353, 2439, 2525],
            2790: [2234, 2322, 2408, 2497, 2585],
            2915: [2286, 2376, 2466, 2556, 2646]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 12b. PREZZI LATERALI - Tipo 102HT con soglia (pag 83-85)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_PREZZI_LATERALI = {
    // PVC-PVC pag 83 (prima tabella) - tipo 102HT
    PVC_PVC: {
        colonne: [615, 740, 865, 990, 1115, 1240, 1365, 1490, 1615, 1740, 1865, 1990, 2115, 2240, 2365, 2490, 2615, 2740, 2865, 2990, 3115],
        righe: {
            2040: [445, 501, 553, 606, 658, 710, 763, 816, 868, 922, 974, 1027, 1079, 1132, 1186, 1237, 1289, 1342, 1395, 1448, 1501],
            2165: [459, 516, 570, 626, 682, 735, 792, 846, 902, 955, 1012, 1066, 1122, 1175, 1231, 1286, 1341, 1396, 1452, 1507, 1562],
            2290: [476, 534, 590, 644, 704, 759, 815, 870, 927, 984, 1040, 1098, 1154, 1211, 1267, 1324, 1379, 1436, 1492, 1549, 1605],
            2415: [488, 549, 606, 665, 724, 782, 840, 900, 958, 1018, 1074, 1134, 1192, 1251, 1311, 1368, 1427, 1485, 1544, 1602, 1662],
            2540: [506, 564, 623, 687, 747, 807, 868, 928, 990, 1050, 1113, 1172, 1232, 1294, 1355, 1415, 1475, 1537, 1595, 1658, 1719],
            2665: [519, 581, 643, 707, 767, 831, 895, 955, 1019, 1080, 1143, 1207, 1269, 1332, 1394, 1458, 1521, 1581, 1644, 1707, 1769],
            2790: [533, 597, 661, 726, 791, 856, 920, 984, 1049, 1114, 1177, 1242, 1308, 1372, 1436, 1500, 1565, 1630, 1694, 1758, 1824],
            2915: [547, 612, 680, 746, 814, 879, 945, 1013, 1077, 1143, 1213, 1275, 1343, 1411, 1475, 1543, 1610, 1674, 1742, 1808, 1874]
        }
    },
    // PVC-PVC pag 83 (seconda tabella) - tipo 102HT variante
    PVC_PVC_ZOCCOLO: {
        colonne: [615, 740, 865, 990, 1115, 1240, 1490, 1615, 1740, 1865, 1990, 2115, 2240, 2365, 2490, 2615, 2740, 2865, 2990, 3115],
        righe: {
            2040: [519, 573, 623, 678, 727, 778, 839, 893, 944, 996, 1048, 1101, 1151, 1205, 1256, 1309, 1361, 1412, 1464, 1517],
            2165: [536, 591, 644, 700, 751, 809, 868, 924, 977, 1032, 1087, 1141, 1195, 1251, 1305, 1359, 1415, 1468, 1523, 1576],
            2290: [552, 608, 665, 722, 778, 837, 901, 957, 1014, 1070, 1127, 1182, 1240, 1297, 1354, 1411, 1467, 1524, 1579, 1638],
            2415: [571, 627, 689, 745, 805, 861, 928, 986, 1046, 1104, 1161, 1220, 1279, 1337, 1395, 1454, 1512, 1570, 1629, 1687],
            2540: [587, 650, 708, 767, 830, 889, 960, 1019, 1079, 1140, 1203, 1260, 1323, 1381, 1442, 1503, 1564, 1625, 1684, 1745],
            2665: [604, 668, 730, 794, 854, 915, 986, 1049, 1113, 1173, 1235, 1297, 1361, 1422, 1483, 1547, 1608, 1671, 1732, 1794],
            2790: [621, 690, 749, 816, 879, 944, 1017, 1079, 1143, 1210, 1272, 1337, 1400, 1464, 1529, 1592, 1658, 1723, 1784, 1849],
            2915: [640, 705, 770, 839, 906, 971, 1048, 1114, 1179, 1246, 1314, 1379, 1447, 1514, 1578, 1646, 1712, 1779, 1846, 1911]
        }
    },
    // ALU-ALU pag 84 - tipo 102HT
    ALU_ALU: {
        colonne: [615, 740, 865, 990, 1115, 1240, 1490, 1615, 1740, 1865, 1990, 2115, 2240, 2365, 2490, 2615, 2740, 2865, 2990, 3115],
        righe: {
            2040: [733, 809, 882, 957, 1031, 1105, 1183, 1259, 1332, 1408, 1481, 1553, 1629, 1702, 1777, 1849, 1925, 1998, 2072, 2147],
            2165: [754, 829, 904, 977, 1057, 1131, 1214, 1289, 1364, 1440, 1516, 1590, 1667, 1741, 1818, 1892, 1969, 2044, 2120, 2194],
            2290: [770, 849, 926, 1007, 1082, 1161, 1245, 1324, 1403, 1479, 1558, 1636, 1713, 1790, 1869, 1946, 2025, 2102, 2181, 2258],
            2415: [792, 871, 950, 1030, 1109, 1190, 1277, 1356, 1436, 1516, 1594, 1675, 1754, 1833, 1915, 1993, 2073, 2153, 2233, 2311],
            2540: [806, 891, 968, 1052, 1134, 1215, 1306, 1386, 1468, 1551, 1633, 1715, 1795, 1878, 1958, 2042, 2124, 2204, 2286, 2368],
            2665: [824, 910, 993, 1075, 1159, 1244, 1336, 1420, 1503, 1586, 1671, 1754, 1838, 1922, 2004, 2088, 2174, 2257, 2340, 2425],
            2790: [845, 930, 1017, 1101, 1189, 1271, 1367, 1451, 1537, 1622, 1709, 1792, 1879, 1964, 2050, 2136, 2221, 2305, 2391, 2477],
            2915: [863, 950, 1037, 1124, 1214, 1301, 1398, 1483, 1572, 1659, 1746, 1833, 1922, 2009, 2095, 2184, 2270, 2357, 2447, 2533]
        }
    },
    // ALU-ALU pag 85 (seconda tabella 102HT)
    ALU_ALU_2: {
        colonne: [615, 740, 865, 990, 1115, 1240, 1490, 1615, 1740, 1865, 1990, 2115, 2240, 2365, 2490, 2615, 2740, 2865, 2990, 3115],
        righe: {
            2040: [902, 972, 1047, 1117, 1190, 1259, 1339, 1411, 1482, 1554, 1628, 1697, 1769, 1842, 1914, 1984, 2057, 2128, 2199, 2273],
            2165: [929, 1004, 1077, 1149, 1224, 1296, 1377, 1450, 1524, 1597, 1671, 1743, 1817, 1889, 1964, 2036, 2109, 2183, 2256, 2330],
            2290: [955, 1032, 1108, 1181, 1258, 1335, 1418, 1490, 1568, 1643, 1719, 1793, 1870, 1945, 2021, 2096, 2172, 2248, 2324, 2398],
            2415: [982, 1061, 1138, 1216, 1293, 1369, 1456, 1532, 1611, 1686, 1765, 1842, 1919, 1994, 2074, 2151, 2227, 2304, 2383, 2460],
            2540: [1009, 1091, 1167, 1247, 1326, 1407, 1494, 1571, 1651, 1731, 1811, 1889, 1969, 2048, 2127, 2206, 2287, 2364, 2444, 2525],
            2665: [1036, 1119, 1202, 1281, 1363, 1441, 1532, 1615, 1694, 1776, 1856, 1938, 2019, 2099, 2180, 2261, 2343, 2423, 2503, 2585],
            2790: [1065, 1148, 1232, 1313, 1396, 1479, 1571, 1654, 1737, 1820, 1901, 1985, 2070, 2152, 2234, 2316, 2399, 2482, 2566, 2648],
            2915: [1093, 1175, 1260, 1347, 1431, 1516, 1610, 1693, 1779, 1864, 1948, 2033, 2117, 2201, 2287, 2372, 2455, 2541, 2624, 2708]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 12c. PREZZI LATERALI/SOPRALUCE FISSO - Tipo 102 accoppiato (pag 87)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_PREZZI_FISSO = {
    // ALU-ALU pag 87 - tipo 102 elemento fisso accoppiato
    ALU_ALU: {
        colonne: [615, 740, 865, 990, 1115, 1240, 1355, 1480, 1605, 1730, 1855, 1980, 2105, 2230, 2355, 2490],
        righe: {
            605:  [333, 356, 378, 402, 424, 445, 469, 495, 515, 538, 562, 584, 607, 629, 651, 677],
            730:  [356, 379, 408, 431, 455, 482, 508, 533, 557, 581, 607, 631, 658, 683, 706, 731],
            855:  [378, 408, 434, 459, 490, 514, 543, 570, 599, 623, 653, 681, 707, 733, 761, 791],
            980:  [402, 431, 460, 494, 520, 549, 581, 610, 640, 668, 699, 729, 757, 788, 818, 844],
            1105: [424, 457, 490, 520, 551, 584, 616, 649, 681, 710, 744, 775, 809, 839, 871, 903],
            1230: [445, 483, 516, 550, 585, 618, 654, 689, 722, 755, 791, 825, 858, 894, 928, 961],
            1355: [469, 508, 543, 581, 616, 654, 691, 724, 761, 800, 836, 872, 908, 945, 983, 1017],
            1480: [496, 533, 570, 610, 649, 689, 724, 764, 804, 842, 883, 921, 958, 999, 1039, 1073],
            1605: [516, 557, 599, 641, 681, 722, 761, 804, 845, 888, 929, 968, 1009, 1051, 1090, 1133],
            1730: [539, 582, 623, 668, 715, 755, 800, 842, 888, 930, 974, 1014, 1059, 1104, 1148, 1189],
            1855: [562, 609, 653, 700, 745, 791, 837, 883, 929, 974, 1018, 1062, 1110, 1156, 1203, 1246],
            1980: [585, 634, 681, 729, 775, 826, 872, 921, 968, 1014, 1062, 1113, 1160, 1210, 1258, 1307],
            2105: [608, 658, 708, 758, 810, 858, 908, 958, 1010, 1059, 1110, 1160, 1211, 1262, 1313, 1363],
            2230: [632, 683, 734, 788, 840, 895, 947, 999, 1052, 1104, 1157, 1210, 1262, 1314, 1367, 1420],
            2355: [653, 710, 762, 820, 873, 928, 983, 1039, 1093, 1148, 1203, 1258, 1313, 1367, 1422, 1475],
            2480: [678, 732, 792, 848, 904, 962, 1017, 1074, 1134, 1191, 1246, 1308, 1363, 1420, 1475, 1533],
            2605: [700, 758, 818, 878, 936, 996, 1054, 1115, 1171, 1230, 1293, 1350, 1413, 1467, 1530, 1589],
            2730: [713, 773, 831, 895, 954, 1012, 1073, 1135, 1199, 1255, 1316, 1377, 1439, 1497, 1561, 1622],
            2855: [723, 788, 844, 908, 974, 1031, 1095, 1156, 1218, 1275, 1341, 1406, 1468, 1527, 1589, 1655],
            2980: [734, 803, 858, 925, 992, 1050, 1116, 1173, 1240, 1302, 1364, 1431, 1497, 1556, 1624, 1686]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 12d. PREZZI SOPRALUCE (pag 88-89)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_PREZZI_SOPRALUCE = {
    // PVC-PVC pag 88 - sopraluce fisso
    PVC_PVC_FISSO: {
        colonne: [740, 990, 1240, 1490, 1740, 1990, 2240, 2490],
        righe: {
            355: [181, 194, 212, 228, 244, 262, 277, 298],
            480: [186, 203, 222, 240, 264, 288, 312, 335],
            605: [195, 211, 233, 263, 289, 317, 345, 375],
            730: [203, 221, 251, 286, 315, 346, 379, 410],
            855: [215, 235, 275, 312, 345, 381, 418, 452],
            980: [222, 251, 295, 334, 375, 412, 452, 493]
        }
    },
    // PVC-PVC pag 88 - sopraluce con anta Step-line
    PVC_PVC_ANTA: {
        colonne: [740, 990, 1240, 1490, 1740, 1990, 2240, 2490, 2740],
        righe: {
            355: [181, 194, 212, 228, 244, 262, 277, 298, 318],
            480: [186, 203, 222, 240, 264, 288, 312, 335, 359],
            605: [195, 211, 233, 263, 289, 317, 345, 375, 403],
            730: [203, 221, 251, 286, 315, 346, 379, 410, 443],
            855: [215, 235, 275, 312, 345, 381, 418, 452, 490],
            980: [222, 251, 295, 334, 375, 412, 452, 493, 532]
        }
    },
    // ALU-ALU pag 89 - sopraluce fisso
    ALU_ALU_FISSO: {
        colonne: [990, 1240, 1490, 1740, 1990, 2240, 2490],
        righe: {
            605: [402, 445, 495, 538, 584, 630, 675],
            730: [430, 481, 533, 581, 632, 682, 731],
            855: [458, 516, 571, 623, 681, 733, 791]
        }
    },
    // ALU-ALU pag 89 - sopraluce Nova-line
    ALU_ALU_NOVALINE: {
        colonne: [1050, 1300, 1550, 1800, 2050, 2300, 2490],
        righe: {
            665: [616, 680, 753, 839, 908, 965, 1028]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 13. SERRATURE E FERRAMENTA (pag. 108-132 listino EUR 2025/10)
// ════════════════════════════════════════════════════════════════════════════

window.FINDOOR_SERRATURE = {
    // ── SERRATURE (pag. 108-115) ──
    // Prezzo per anta. 101.0 = compresa nel prezzo base
    '101.0': { desc: 'Serratura manuale (standard)', prezzo: 0, note: 'compresa' },
    '102.0': { desc: 'Serratura autobloccante', prezzo: 28.7 },
    '102.T': { desc: 'Serr. autobloccante con scrocco', prezzo: 32.6 },
    '102.0M': { desc: 'Serr. autobloccante motorizzata', prezzo: 462.7, note: '28.7+434' },
    '103.0': { desc: 'Serr. motorizzata con cilindro', prezzo: 654 },
    '105.0_2': { desc: 'Serr. motorizzata Instinct 2 punti', prezzo: 1630, maxH: 2051 },
    '105.0_3': { desc: 'Serr. motorizzata Instinct 3 punti', prezzo: 1897, maxH: 2401 },
    '105.0_4': { desc: 'Serr. motorizzata Instinct 4 punti', prezzo: 2164, maxH: 2600 }
};

window.FINDOOR_ACCESSORI_SERRATURA = {
    // ── ACCESSORI SERRATURA (pag. 116-130) ──
    '105_00': { desc: 'Apriporta elettrico', prezzo: 86.4 },
    '107_00': { desc: 'Apriporta elettrico maggiorato', prezzo: 95.3 },
    '106_00': { desc: 'Dispositivo fermo a giorno', prezzo: 62.4 },
    '108_00': { desc: 'Verifica chiusura a chiave', prezzo: 93.6 },
    '230AC':  { desc: 'Alimentatore integrato', prezzo: 164 },
    'TC_1':   { desc: 'Telecomando singolo', prezzo: 160 },
    'TC_71':  { desc: 'Telecomando + modulo controllo', prezzo: 315 },
    'LI_60E': { desc: 'Lettore impronte digitali inox', prezzo: 906 },
    'LI_60V': { desc: 'Lettore impronte digitali verniciato', prezzo: 924 },
    'TC_1310': { desc: 'Telecomando aggiuntivo', prezzo: 60.4 },
    'AL_02':  { desc: 'Alimentatore 12V DC', prezzo: 65.2 }
};

window.FINDOOR_CERNIERE = {
    // ── CERNIERE (pag. 109-110) ──
    'S805':  { desc: 'Cerniere in vista con rostri sicurezza', prezzo: 0, note: 'comprese' },
    'S250':  { desc: 'Cerniere in vista standard', prezzo: 0, note: 'comprese' },
    '300':   { desc: 'Cerniere carichi elevati', prezzo: 78.2, note: 'per anta' },
    '201':   { desc: 'Cerniere a scomparsa (T935/T947/T936/T926)', prezzo: 228, note: 'per anta' },
    '211':   { desc: 'Cerniere a scomparsa (T812/T815/F96/A96/A95)', prezzo: 415, note: 'per anta' },
    '220':   { desc: 'Cerniere a scomparsa complanare (telaio 707)', prezzo: 415, note: 'per anta' }
};

window.FINDOOR_CILINDRI = {
    // ── CILINDRI (pag. 111-114) ──
    '02P':     { desc: 'Cilindro standard', prezzo: 0, note: 'compreso' },
    '1P':      { desc: 'Cilindro sicurezza classe 1', prezzo: 71.2 },
    '2P':      { desc: 'Cilindro sicurezza classe 2', prezzo: 236 },
    '2PHS':    { desc: 'Cilindro chiave maestra HS', prezzo: 392 },
    'CH_180':  { desc: 'Chiave aggiuntiva', prezzo: 22.3 },
    'CH_1P':   { desc: 'Duplicato chiave 1P (security card)', prezzo: 68.5 },
    'CH_2P':   { desc: 'Duplicato chiave 2P (security card)', prezzo: 80.8 },
    'CH_HS':   { desc: 'Chiave maestra HS', prezzo: 34.9 },
    'POM_1P':  { desc: 'Pomello interno 1P', prezzo: 2.79 },
    'POM_2P':  { desc: 'Pomello interno 2P', prezzo: 52.4 },
    'ROT_1P':  { desc: 'Rotazione libera 1P (35mm)', prezzo: 11.7 },
    'ROT_2P':  { desc: 'Rotazione libera 2P (31mm)', prezzo: 8.24 },
    'KA_1P':   { desc: 'Chiave unificata 1P', prezzo: 3.77 },
    'KA_2P':   { desc: 'Chiave unificata 2P', prezzo: 16.1 }
};

window.FINDOOR_CHIUDIPORTA = {
    // ── CHIUDIPORTA (pag. 156-160) ──
    '901': { desc: 'Chiudiporta standard', prezzi: {
        'M01': 475, 'M03': 475, '07': 475, '02': 475, '16': 475, '56': 475, 'RAL': 518
    }},
    '903': { desc: 'Chiudiporta scorrevole', prezzi: {
        'M01': 475, 'M03': 475, '07': 475, '02': 475, '16': 475, '56': 475, 'RAL': 518
    }},
    '905': { desc: 'Chiudiporta apertura esterno', prezzi: { 'M03': 504, '56': 504 } },
    '907': { desc: 'Chiudiporta scorrevole var.', prezzi: { '56': 475, 'RAL': 518 } },
    '911': { desc: 'Chiudiporta a scomparsa', prezzo: 386 }
};

window.FINDOOR_SOGLIE = {
    // ── SOGLIE (pag. 59-60) ──
    // Apertura interno
    'S0': { desc: 'Soglia ribassata 2cm (standard)', prezzo_ml: 0, note: 'compresa' },
    'S1': { desc: 'Soglia ribassata 2cm disparità liv.', prezzo_ml: 0, note: 'compresa' },
    'S2': { desc: 'Soglia ribassata 2cm profilo alu', prezzo_ml: 5.18 },
    'S3': { desc: 'Soglia ribassata 0cm + lama parafreddo', prezzo_ml: 147 },
    'S4': { desc: 'Senza soglia + lama parafreddo', prezzo_ml: 104 },
    // Apertura esterno (stessi prezzi)
    'A0': { desc: 'Soglia rib. 2cm est. (standard)', prezzo_ml: 0, note: 'compresa' },
    'A1': { desc: 'Soglia rib. 2cm est. disparità', prezzo_ml: 0, note: 'compresa' },
    'A2': { desc: 'Soglia rib. 2cm est. profilo alu', prezzo_ml: 5.18 },
    'A3': { desc: 'Soglia rib. 0cm est. + lama', prezzo_ml: 147 },
    'A4': { desc: 'Senza soglia est. + lama', prezzo_ml: 104 }
};

window.FINDOOR_RC2 = {
    // ── RC2 SICUREZZA (pag. 133) ──
    'RC2':    { desc: 'Allestimento sicurezza RC2', prezzo: 16.4, note: 'per porta' },
    'PZ_RC':  { desc: 'Protezione cilindro RC2', prezzo: 135 }
};

window.FINDOOR_ACCESSORI = {
    // ── ACCESSORI VARI (pag. 131-132) ──
    'Z50':    { desc: 'Contatto magnetico 10m', prezzo: 46.8 },
    'Z50_2':  { desc: 'Contatto magnetico 20m', prezzo: 105 },
    'Z50V':   { desc: 'Contatto magnetico 6m', prezzo: 58.3 },
    'B001':   { desc: 'Limitatore apertura', prezzo: 51.5 },
    '109_51': { desc: 'Spioncino cromato', prezzo: 51.8 },
    '109_52': { desc: 'Spioncino nichelato', prezzo: 51.8 },
    '356_43': { desc: 'Spioncino digitale', prezzo: 151 },
    '112_51': { desc: 'Tappo paracolpi', prezzo: 10.4 },
    '102_56': { desc: 'Fermaporta alluminio neutro', prezzo: 125 },
    '102_01': { desc: 'Fermaporta bianco', prezzo: 86.3 },
    '102_02': { desc: 'Fermaporta marrone', prezzo: 86.3 },
    '02_11203': { desc: 'Trasmettitore citofoni', prezzo: 148 }
};

// ════════════════════════════════════════════════════════════════════════════
// 14. SUPPLEMENTI COLORE PORTONCINO (specifici per porte, diversi da finestre)
// ════════════════════════════════════════════════════════════════════════════
// I portoncini hanno supplementi colore DIVERSI dalle finestre:
// - PVC: supplemento FISSO per lato (interno/esterno) basato su gruppo colore
// - ALU: supplemento €/ml perimetro telaio basato su gruppo colore
// Fonte: conferme ordine Finstral + listino EUR 2025/10

window.FINDOOR_SUPPL_COLORI_PORTONCINO = {
    PVC: {
        // Supplemento per LATO (interno o esterno) - fisso per porta
        gruppoA: 0,      // Bianco - incluso
        gruppoB: 95      // Scuri/Decoro legno (es. Noce chiaro 55)
    },
    ALU: {
        // Supplemento €/ml perimetro telaio
        gruppo1:  0,      // Standard - incluso
        gruppo1H: 0,      // Decoro legno - incluso
        gruppo2:  54,     // Speciali
        gruppo3:  105     // NCS/DB/RAL speciali
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 15. HELPER FUNCTIONS
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
 * Cerca prezzo in griglia dimensionale con interpolazione
 * Trova la cella >= L e >= H (arrotondamento per eccesso)
 */
window.cercaPrezzoGriglia = function(griglia, L, H) {
    if (!griglia || !griglia.colonne || !griglia.righe) return 0;

    // Trova colonna (larghezza) >= L
    let colIdx = griglia.colonne.findIndex(c => c >= L);
    if (colIdx < 0) colIdx = griglia.colonne.length - 1;

    // Trova riga (altezza) >= H
    const altezze = Object.keys(griglia.righe).map(Number).sort((a, b) => a - b);
    const altTrovata = altezze.find(a => a >= H) || altezze[altezze.length - 1];

    return griglia.righe[altTrovata]?.[colIdx] || 0;
};

/**
 * Cerca prezzo base portoncino porta 720
 * @param {number} L - Larghezza BRM mm
 * @param {number} H - Altezza BRM mm
 * @param {string} comb - Combinazione materiali: 'PVC-PVC', 'PVC-ALU', 'LEGNO-ALU', 'ALU-ALU'
 */
window.calcolaPrezzoBasePortoncino = function(L, H, comb) {
    // PVC-ALU e LEGNO-ALU usano griglia ALU
    const tabKey = (comb === 'PVC-PVC') ? 'PVC_PVC' : 'ALU_ALU';
    const tab = window.FINDOOR_PREZZI_BASE[tabKey];
    return window.cercaPrezzoGriglia(tab, L, H);
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * FUNZIONE PRINCIPALE DI CALCOLO PORTONCINO FINDOOR v3.0
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LOGICA PREZZO (da conferma Finstral reale):                     │
 * │                                                                  │
 * │ TOTALE = prezzoModello          (prezzo modello = prezzo porta)  │
 * │        + supplTelaio            (€/ml perimetro telaio)         │
 * │        + supplColoreInt         (colore lato interno)            │
 * │        + supplColoreEst         (colore lato esterno)            │
 * │        + supplSerratura / supplCerniere / supplCilindro          │
 * │        + supplSoglia / supplManiglia / supplManigliaInt          │
 * │        + supplChiudiporta / supplRC2 / supplAccessori            │
 * │        + prezzoLaterali / prezzoSopraluce                        │
 * │                                                                  │
 * │ NOTA: prezzoBase griglia usato SOLO se modello ha prezzi [0,0]  │
 * │ Il prezzo modello NON si somma al base: È il prezzo porta.      │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Usata da: App iPad + Dashboard (STESSA funzione, STESSO risultato)
 * 
 * @param {Object} ptc - Dati portoncino dalla posizione
 * @returns {Object} Risultato con tutti i supplementi e totale
 */
window.calcolaPrezzoPortoncinoFindoor = function(ptc) {
    const result = {
        prezzoBase: 0,          // Solo se modello ha prezzi [0,0]
        prezzoModello: 0,       // Prezzo modello = prezzo principale porta
        supplModello: 0,        // ALIAS legacy di prezzoModello (retrocompat)
        supplTelaio: 0,         // Supplemento telaio (€/ml × perimetro)
        supplColoreInt: 0,      // Colore lato interno
        supplColoreEst: 0,      // Colore lato esterno
        supplSerratura: 0,
        supplCerniere: 0,
        supplCilindro: 0,
        supplSoglia: 0,
        supplManiglia: 0,
        supplManigliaInt: 0,
        supplChiudiporta: 0,
        supplRC2: 0,
        supplAccessori: 0,
        prezzoLaterali: 0,
        prezzoSopraluce: 0,
        totale: 0,
        dettaglio: []
    };

    try {
        // ── Combinazione materiali ──
        const comb = window.getCombinazioneMat(ptc);
        const isAlu = (comb !== 'PVC-PVC');

        // ── Dimensioni BRM ──
        const L = parseInt(ptc.larghezza || ptc.BRM_L || ptc.LVT || 1000);
        const H = parseInt(ptc.altezza || ptc.BRM_H || ptc.HVT || 2100);
        const isGrande = (L > 1115 || H > 2355);
        const perimetroMl = 2 * (L + H) / 1000;

        result.dettaglio.push(`Config: ${comb}, ${L}×${H}mm, perimetro ${perimetroMl.toFixed(2)}ml`);

        // ══════════════════════════════════════════════════════════
        // 1. PREZZO MODELLO = PREZZO PRINCIPALE DELLA PORTA
        // ══════════════════════════════════════════════════════════
        // Il prezzo del modello È il costo della porta (da conferma Finstral).
        // NON è un supplemento da sommare a un prezzo base griglia.
        // Solo se il modello ha prezzi [0,0] si usa la griglia base.
        
        if (ptc.modelloAnta) {
            const modello = window.FINDOOR_MODELLI_ANTA[ptc.modelloAnta];
            if (modello) {
                const idx = isGrande ? 1 : 0;
                const prezzoMod = modello.prezzi[idx] || 0;
                
                if (prezzoMod > 0) {
                    // Modello con prezzo → È il prezzo della porta
                    result.prezzoModello = prezzoMod;
                    result.supplModello = prezzoMod;  // alias legacy
                    result.prezzoBase = 0;             // NO griglia base
                    result.dettaglio.push(`Modello ${ptc.modelloAnta} (${modello.cat}): €${prezzoMod}${isGrande ? ' [grande]' : ''}`);
                } else {
                    // Modello con prezzo 0 → usa griglia base
                    result.prezzoBase = window.calcolaPrezzoBasePortoncino(L, H, comb);
                    result.prezzoModello = 0;
                    result.supplModello = 0;
                    result.dettaglio.push(`Modello ${ptc.modelloAnta} (${modello.cat}): da griglia base €${result.prezzoBase}`);
                }
            }
        } else {
            // Nessun modello → usa griglia base
            result.prezzoBase = window.calcolaPrezzoBasePortoncino(L, H, comb);
            result.dettaglio.push(`Base ${comb} ${L}×${H} (no modello): €${result.prezzoBase}`);
        }

        // ══════════════════════════════════════════════════════════
        // 2. SUPPLEMENTO TELAIO (€/ml × perimetro)
        // ══════════════════════════════════════════════════════════
        if (ptc.telaio) {
            const telaiData = window.FINDOOR_TELAI_PER_COMB[comb];
            if (telaiData) {
                for (const [forma, telai] of Object.entries(telaiData)) {
                    const tel = telai[ptc.telaio];
                    if (tel) {
                        const supplMl = isAlu ? (tel.supplAlu || 0) : (tel.supplPvc || 0);
                        if (supplMl > 0) {
                            result.supplTelaio = Math.round(supplMl * perimetroMl * 100) / 100;
                            result.dettaglio.push(`Telaio ${ptc.telaio} (${forma}): €${supplMl}/ml × ${perimetroMl.toFixed(2)}ml = +€${result.supplTelaio}`);
                        }
                        break;
                    }
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 3. SUPPLEMENTI COLORE (interno + esterno)
        // ══════════════════════════════════════════════════════════
        const supplColori = window.FINDOOR_SUPPL_COLORI_PORTONCINO;
        
        // Normalizza gruppo colore: 'gruppoA' → 'A', 'B' → 'B', 'gruppo1H' → '1H'
        function normalizzaGruppo(g) {
            if (!g) return '';
            return String(g).replace(/^gruppo/i, '');
        }
        
        // ── Colore INTERNO ──
        const gInt = normalizzaGruppo(ptc.coloreIntGruppo || ptc.gruppoColoreInt || '');
        if (gInt) {
            const matInt = ptc.materialeInt || 'PVC';
            if (matInt === 'PVC') {
                const suppl = supplColori.PVC['gruppo' + gInt] ?? (supplColori.PVC[gInt] || 0);
                if (suppl > 0) {
                    result.supplColoreInt = suppl;
                    result.dettaglio.push(`Colore Int PVC (gruppo${gInt}): +€${suppl}`);
                }
            } else {
                // ALU o LEGNO interno
                const supplMl = supplColori.ALU['gruppo' + gInt] ?? (supplColori.ALU[gInt] || 0);
                if (supplMl > 0) {
                    result.supplColoreInt = Math.round(supplMl * perimetroMl * 100) / 100;
                    result.dettaglio.push(`Colore Int ALU (gruppo${gInt}): €${supplMl}/ml = +€${result.supplColoreInt}`);
                }
            }
        }

        // ── Colore ESTERNO ──
        const gEst = normalizzaGruppo(ptc.coloreEstGruppo || ptc.gruppoColoreEst || '');
        if (gEst) {
            const matEst = ptc.materialeEst || ptc.materialeInt || 'PVC';
            if (matEst === 'PVC') {
                const suppl = supplColori.PVC['gruppo' + gEst] ?? (supplColori.PVC[gEst] || 0);
                if (suppl > 0) {
                    result.supplColoreEst = suppl;
                    result.dettaglio.push(`Colore Est PVC (gruppo${gEst}): +€${suppl}`);
                }
            } else {
                // ALU esterno
                const supplMl = supplColori.ALU['gruppo' + gEst] ?? (supplColori.ALU[gEst] || 0);
                if (supplMl > 0) {
                    result.supplColoreEst = Math.round(supplMl * perimetroMl * 100) / 100;
                    result.dettaglio.push(`Colore Est ALU (gruppo${gEst}): €${supplMl}/ml = +€${result.supplColoreEst}`);
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 4. SERRATURA
        // ══════════════════════════════════════════════════════════
        const codSerr = ptc.serratura || '101.0';
        const serr = window.FINDOOR_SERRATURE[codSerr];
        if (serr && serr.prezzo > 0) {
            result.supplSerratura = serr.prezzo;
            result.dettaglio.push(`Serratura ${codSerr}: +€${serr.prezzo}`);
        }

        // ══════════════════════════════════════════════════════════
        // 5. CERNIERE
        // ══════════════════════════════════════════════════════════
        if (ptc.cerniere) {
            const cern = window.FINDOOR_CERNIERE[ptc.cerniere];
            if (cern && cern.prezzo > 0) {
                result.supplCerniere = cern.prezzo;
                result.dettaglio.push(`Cerniere ${ptc.cerniere}: +€${cern.prezzo}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // 6. CILINDRO
        // ══════════════════════════════════════════════════════════
        if (ptc.cilindro) {
            const cil = window.FINDOOR_CILINDRI[ptc.cilindro];
            if (cil && cil.prezzo > 0) {
                result.supplCilindro = cil.prezzo;
                result.dettaglio.push(`Cilindro ${ptc.cilindro}: +€${cil.prezzo}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // 7. SOGLIA (€/ml × larghezza)
        // ══════════════════════════════════════════════════════════
        if (ptc.soglia) {
            const sogl = window.FINDOOR_SOGLIE[ptc.soglia];
            if (sogl && sogl.prezzo_ml > 0) {
                const Lm = L / 1000;
                result.supplSoglia = Math.round(sogl.prezzo_ml * Lm * 100) / 100;
                result.dettaglio.push(`Soglia ${ptc.soglia}: €${sogl.prezzo_ml}/ml × ${Lm.toFixed(2)}ml = +€${result.supplSoglia}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // 8. MANIGLIA ESTERNA (set/maniglione/asta/barra)
        // ══════════════════════════════════════════════════════════
        if (ptc.maniglia && ptc.manigliaFinitura) {
            const cats = ['set', 'maniglioni', 'aste', 'barre'];
            for (const cat of cats) {
                const item = window.FINDOOR_MANIGLIE[cat]?.[ptc.maniglia];
                if (item) {
                    const prezzo = item.finiture?.[ptc.manigliaFinitura] || 0;
                    if (prezzo > 0) {
                        result.supplManiglia = prezzo;
                        result.dettaglio.push(`Maniglia ${ptc.maniglia} (${cat}/${ptc.manigliaFinitura}): +€${prezzo}`);
                    }
                    break;
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 9. MANIGLIA INTERNA
        // ══════════════════════════════════════════════════════════
        if (ptc.manigliaInt && ptc.manigliaIntFinitura) {
            const item = window.FINDOOR_MANIGLIE.interne?.[ptc.manigliaInt];
            if (item) {
                const prezzo = item.finiture?.[ptc.manigliaIntFinitura] || 0;
                if (prezzo > 0) {
                    result.supplManigliaInt = prezzo;
                    result.dettaglio.push(`Maniglia int. ${ptc.manigliaInt}: +€${prezzo}`);
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 10. CHIUDIPORTA
        // ══════════════════════════════════════════════════════════
        if (ptc.chiudiporta) {
            const cp = window.FINDOOR_CHIUDIPORTA[ptc.chiudiporta];
            if (cp) {
                const prezzo = cp.prezzo || (cp.prezzi ? (cp.prezzi[ptc.chiudiportaFinitura] || cp.prezzi['56'] || 0) : 0);
                if (prezzo > 0) {
                    result.supplChiudiporta = prezzo;
                    result.dettaglio.push(`Chiudiporta ${ptc.chiudiporta}: +€${prezzo}`);
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 11. RC2 SICUREZZA
        // ══════════════════════════════════════════════════════════
        if (ptc.rc2) {
            result.supplRC2 = (window.FINDOOR_RC2['RC2']?.prezzo || 0);
            if (ptc.rc2_pz) result.supplRC2 += (window.FINDOOR_RC2['PZ_RC']?.prezzo || 0);
            if (result.supplRC2 > 0) {
                result.dettaglio.push(`RC2: +€${result.supplRC2}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // 12. ACCESSORI AGGIUNTIVI
        // ══════════════════════════════════════════════════════════
        if (ptc.accessori && Array.isArray(ptc.accessori)) {
            for (const acc of ptc.accessori) {
                const codice = acc.codice || acc;
                const item = window.FINDOOR_ACCESSORI[codice] || window.FINDOOR_ACCESSORI_SERRATURA[codice];
                if (item) {
                    const qta = acc.qta || 1;
                    const prezzoAcc = (item.prezzo || 0) * qta;
                    result.supplAccessori += prezzoAcc;
                    if (prezzoAcc > 0) {
                        result.dettaglio.push(`Acc. ${codice} x${qta}: +€${prezzoAcc}`);
                    }
                }
            }
        }

        // ══════════════════════════════════════════════════════════
        // 13. ELEMENTI LATERALI
        // ══════════════════════════════════════════════════════════
        if (ptc.laterale) {
            const latL = parseInt(ptc.laterale.larghezza || 0);
            const latH = parseInt(ptc.laterale.altezza || H);
            if (latL > 0) {
                const tabKey = isAlu ? 'ALU_ALU' : 'PVC_PVC';
                const griglia = window.FINDOOR_PREZZI_LATERALI[tabKey];
                result.prezzoLaterali = window.cercaPrezzoGriglia(griglia, latL, latH);
                const numLat = ptc.laterale.quantita || 1;
                result.prezzoLaterali *= numLat;
                result.dettaglio.push(`Laterale ${latL}×${latH} x${numLat}: +€${result.prezzoLaterali}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // 14. SOPRALUCE
        // ══════════════════════════════════════════════════════════
        if (ptc.sopraluce) {
            const sopL = parseInt(ptc.sopraluce.larghezza || L);
            const sopH = parseInt(ptc.sopraluce.altezza || 0);
            if (sopH > 0) {
                const tabKey = isAlu ? 'ALU_ALU_FISSO' : 'PVC_PVC_FISSO';
                const griglia = window.FINDOOR_PREZZI_SOPRALUCE[tabKey];
                result.prezzoSopraluce = window.cercaPrezzoGriglia(griglia, sopL, sopH);
                result.dettaglio.push(`Sopraluce ${sopL}×${sopH}: +€${result.prezzoSopraluce}`);
            }
        }

        // ══════════════════════════════════════════════════════════
        // TOTALE
        // ══════════════════════════════════════════════════════════
        result.totale = result.prezzoBase + result.prezzoModello +
            result.supplTelaio + result.supplColoreInt + result.supplColoreEst +
            result.supplSerratura + result.supplCerniere + result.supplCilindro +
            result.supplSoglia + result.supplManiglia + result.supplManigliaInt +
            result.supplChiudiporta + result.supplRC2 + result.supplAccessori +
            result.prezzoLaterali + result.prezzoSopraluce;

        result.totale = Math.round(result.totale * 100) / 100;
        result.dettaglio.push(`── TOTALE: €${result.totale.toLocaleString('it-IT')} ──`);

    } catch (e) {
        console.error('❌ Errore calcolo portoncino FIN-Door:', e);
        result.dettaglio.push(`ERRORE: ${e.message}`);
    }

    return result;
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
console.log(`📦 FINDOOR-PORTONCINI v3.0.0 caricato: ${Object.keys(window.FINDOOR_MODELLI_ANTA).length} modelli, ${Object.keys(window.FINDOOR_TIPI_APERTURA).length} tipi apertura, calcolo v3 (modello=prezzo porta)`);

})();
