// ============================================================================
// prodotti-config.js v1.0.0 (03 FEB 2026)
// REGISTRO UNICO PRODOTTI - Shared tra App Rilievo e Dashboard
// Aggiungere QUI un prodotto → appare automaticamente in TUTTE le viste
// ============================================================================

// ============================================================================
// HELPER QUANTITÀ UNIFICATO
// Legge quantità da prodotto: supporta sia 'qta' che 'quantita'
// ============================================================================
function getQta(prodotto) {
    if (!prodotto) return 0;
    if (typeof DATA_ACCESSOR !== 'undefined') {
        return DATA_ACCESSOR.getQuantita(prodotto);
    }
    return parseInt(prodotto.quantita) || parseInt(prodotto.qta) || 0;
}

function hasQta(prodotto) {
    return getQta(prodotto) > 0;
}

// ============================================================================
// PRODOTTI_CONFIG - REGISTRO UNICO
// key:            chiave oggetto in pos.xxx
// label:          nome visualizzato
// icon:           emoji
// color/bg/border: colori UI
// aziendaDefault: fornitore di default
// totaleKey:      chiave per contatori (n_xxx, totali.xxx)
// hasProdotto:    (opz) funzione custom per verificare presenza
// getData:        (opz) funzione custom per estrarre dati
// getQta:         (opz) funzione custom per contare quantità
// ============================================================================
const PRODOTTI_CONFIG = [
    { key: 'infisso',      label: 'Infissi',        icon: '🪟', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', aziendaDefault: 'Finstral', totaleKey: 'infissi' },
    { key: 'tapparella',   label: 'Tapparelle',     icon: '🔽', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd', aziendaDefault: 'Plasticino', totaleKey: 'tapparelle',
      hasProdotto: (pos) => pos.tapparella && pos.tapparella.serveTapparella !== false && hasQta(pos.tapparella) },
    { key: 'cassonetto',   label: 'Cassonetti',     icon: '📦', color: '#92400e', bg: '#fef3c7', border: '#fcd34d', aziendaDefault: 'Finstral', totaleKey: 'cassonetti' },
    { key: 'persiana',     label: 'Persiane',       icon: '🏠', color: '#3730a3', bg: '#e0e7ff', border: '#a5b4fc', aziendaDefault: 'P. Persiane', totaleKey: 'persiane' },
    { key: 'zanzariera',   label: 'Zanzariere',     icon: '🦟', color: '#9d174d', bg: '#fce7f3', border: '#f9a8d4', aziendaDefault: 'Palagina', totaleKey: 'zanzariere' },
    { key: 'grata',        label: 'Grate',          icon: '🔒', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', aziendaDefault: 'Erreci', totaleKey: 'grate' },
    { key: 'portaInterna', label: 'Porte Interne',  icon: '🚪', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', aziendaDefault: 'FerreroLegno', totaleKey: 'porteInterne' },
    { key: 'clickZip',     label: 'Click Zip',      icon: '🌀', color: '#166534', bg: '#f0fdf4', border: '#86efac', aziendaDefault: 'Gibus', totaleKey: 'clickZip',
      hasProdotto: (pos) => pos.clickZip && pos.clickZip.serveClickZip !== false },
    { key: 'tendaBracci',  label: 'Tende a Bracci', icon: '🎪', color: '#c2410c', bg: '#fff7ed', border: '#fdba74', aziendaDefault: 'Gibus', totaleKey: 'tendeBracci',
      hasProdotto: (pos) => pos.tendaBracci && pos.tendaBracci.tende && pos.tendaBracci.tende.length > 0,
      getQta: (pos) => pos.tendaBracci?.tende?.length || 0 },
    { key: 'blindata',     label: 'Blindate',       icon: '🔐', color: '#b91c1c', bg: '#fef2f2', border: '#fca5a5', aziendaDefault: 'Oikos', totaleKey: 'blindate',
      hasProdotto: (pos) => { const b = pos.blindata || pos.ingresso?.blindata; return b && (parseInt(b.LNP_L) > 0 || parseInt(b.LNP_H) > 0 || b.versione); },
      getData: (pos) => pos.blindata || pos.ingresso?.blindata },
    { key: 'portoncino',   label: 'Portoncini',     icon: '🚪', color: '#9f1239', bg: '#fff1f2', border: '#fda4af', aziendaDefault: 'Oikos', totaleKey: 'portoncini',
      hasProdotto: (pos) => { const p = pos.portoncino || pos.ingresso?.portoncino; return p && (p.azienda || p.modelloAnta || p.tipoApertura); },
      getData: (pos) => pos.portoncino || pos.ingresso?.portoncino },
    { key: 'motore',       label: 'Motori',         icon: '🔌', color: '#b45309', bg: '#fef3c7', border: '#fcd34d', aziendaDefault: 'Somfy', totaleKey: 'motori',
      hasProdotto: (pos) => pos.tapparella?.serveMotore === true,
      getData: (pos) => pos.tapparella }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Controlla se prodotto esiste nella posizione */
function prodottoPresente(pos, cfg) {
    if (cfg.hasProdotto) return cfg.hasProdotto(pos);
    return !!pos[cfg.key];
}

/** Ottieni dati prodotto dalla posizione */
function getProdottoData(pos, cfg) {
    if (cfg.getData) return cfg.getData(pos);
    return pos[cfg.key];
}

/** Ottieni quantità prodotto (default 1 se presente) */
function getQtaProdotto(pos, cfg) {
    if (cfg.getQta) return cfg.getQta(pos);
    const prod = getProdottoData(pos, cfg);
    if (!prod) return 0;
    return getQta(prod) || 1;
}

/** Conta totali per tutti i prodotti in un array di posizioni */
function countAllProducts(posizioni) {
    const counts = { n_posizioni: posizioni.length };
    PRODOTTI_CONFIG.forEach(cfg => {
        counts['n_' + cfg.totaleKey] = 0;
        posizioni.forEach(pos => {
            if (prodottoPresente(pos, cfg)) {
                counts['n_' + cfg.totaleKey] += getQtaProdotto(pos, cfg);
            }
        });
    });
    return counts;
}

console.log(`✅ prodotti-config.js v1.0.0 caricato: ${PRODOTTI_CONFIG.length} prodotti registrati`);
