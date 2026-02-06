// ═══════════════════════════════════════════════════════════════════════════════
// 🚪 OIKOS MODULE v1.0.0 - Modulo Centralizzato Porte Blindate
// Per shared-database - Usato da App Rilievo + Dashboard
// Pattern: identico a persiane-module.js / erreci-grate.js
// Dipendenze: oikos.js (OIKOS_DATABASE_2025, calcolaPrezzoOikos, determinaLuceOikos)
// ═══════════════════════════════════════════════════════════════════════════════

// ============================================================
// OPZIONI BLINDATE (centralizzate)
// ============================================================
const OIKOS_OPZIONI = {
    aziende: ['Oikos'],
    
    // Linee prodotto (chiavi per OIKOS_DATABASE_2025.linee)
    linee: [
        'EVOLUTION_3',
        'EVOLUTION_4', 
        'EVOLUTION_3_DOPPIA',
        'EVOLUTION_3_TT_086',
        'EVOLUTION_3_TT_1',
        'EVOLUTION_3_EI',
        'PROJECT',
        'PROJECT_EI',
        'TEKNO',
        'TEKNO_EST',
        'TEKNO_DOPPIA',
        'TEKNO_EI',
        'TEKNO_EI120',
        'TEKNO_UL',
        'TEKNO_ANTIURAGANO',
        'TEKNO_3TT'
    ],
    
    // Linee raggruppate per UI
    lineePerCategoria: {
        'Evolution': [
            { key: 'EVOLUTION_3', label: 'Evolution 3 - Classe 3' },
            { key: 'EVOLUTION_4', label: 'Evolution 4 - Classe 4' },
            { key: 'EVOLUTION_3_DOPPIA', label: 'Evolution 3 Doppia' },
            { key: 'EVOLUTION_3_TT_086', label: 'Evolution 3 TT (U=0.86)' },
            { key: 'EVOLUTION_3_TT_1', label: 'Evolution 3 TT (U=1)' },
            { key: 'EVOLUTION_3_EI', label: 'Evolution 3 EI 30/45/60' }
        ],
        'Project': [
            { key: 'PROJECT', label: 'Project 3 Rasomuro' },
            { key: 'PROJECT_EI', label: 'Project 3 EI 30' }
        ],
        'Tekno': [
            { key: 'TEKNO', label: 'Tekno 3 Rasomuro Interno' },
            { key: 'TEKNO_EST', label: 'Tekno 3 Rasomuro Esterno' },
            { key: 'TEKNO_DOPPIA', label: 'Tekno 3 Doppia' },
            { key: 'TEKNO_3TT', label: 'Tekno 3TT (U=1)' },
            { key: 'TEKNO_EI', label: 'Tekno 3 EI 60/90' },
            { key: 'TEKNO_EI120', label: 'Tekno 3 EI 120' },
            { key: 'TEKNO_UL', label: 'Tekno 3 UL FD 120' },
            { key: 'TEKNO_ANTIURAGANO', label: 'Tekno 3 Antiuragano' }
        ]
    },
    
    // Cilindri
    cilindri: ['SEKUR', 'BASIC'],
    
    // Colori telaio
    coloriTelaio: [
        { key: 'RAL_8022', label: 'RAL 8022 (standard Evolution)' },
        { key: 'alluSpazzolato', label: 'Alluminio spazzolato acciaio (standard Tekno)' },
        { key: 'polveri', label: 'Colori OIKOS a Polveri' },
        { key: 'evergreen', label: 'Colori OIKOS Evergreen a Polveri' },
        { key: 'future', label: 'Colori OIKOS Future' },
        { key: 'liquido', label: 'Colori OIKOS a Liquido' }
    ],
    
    // Aperture
    aperture: ['spingere', 'tirare'],
    
    // ── RIVESTIMENTI ──
    // Linee rivestimento
    lineeRivestimento: [
        'Piano Di Serie',
        'Piano Materici',
        'Piano Non di Serie',
        'Piano Orizzontale',
        'Piano Verticale',
        'Piano Gres',
        'Piano Riflessi',
        'Fugato V',
        'Fugato HTF',
        'Fugato HTA',
        'Fugato Scala',
        'Country Line Piano',
        'Country Line Fugato',
        'Legno Vivo',
        'Massello',
        'Tekno HTA',
        'Tekno HTO',
        'Tekno HT1',
        'Tekno HT2',
        'Tekno HT3',
        'Tekno HTL',
        'Skydoors'
    ],
    
    // Essenze principali (semplificato per dropdown)
    essenze: [
        'Tanganica 1-2',
        'Mogano 2-3',
        'Rovere 1',
        'Rovere 2-3',
        'Rovere Naturale',
        'Noce Nazionale 2',
        'Noce Canaletto',
        'Castagno 2-3',
        'Douglas 2',
        'Pino 2',
        'Teak',
        'Okoumè',
        'Laccato Bianco OIKOS',
        'Laccato RAL',
        'Laccati di Tendenza',
        'MDF da laccare',
        'Supporto cliente'
    ],
    
    // Tinte (per essenze legno)
    tinte: [
        'Naturale',
        '1', '2', '3',
        'Miele',
        'Wengè',
        'Sbiancato',
        'Bianco gesso',
        'Grigio piombo',
        'Moka',
        'Platino',
        'Bronzo',
        'Cenere',
        'Tabacco',
        'Madreperla',
        'Grigio agata',
        'Quercia antica',
        'Cor-ten ruggine',
        'Ossido Bruno',
        'Ossido Nero',
        'Ardesia',
        'Fumo',
        'RAL ...'
    ],
    
    // Materici (Piano Materici)
    materici: [
        'Bianco Talco',
        'Grigio Talco',
        'Bianco Sablé',
        'Grigio Sablé',
        'Bianco Rovere Sablé',
        'Grigio Rovere Sablé'
    ],
    
    // Gres
    gres: [
        'Neve',
        'Nero Assoluto',
        'Calce Bianco',
        'Calce Grigio',
        'Calce Tortora',
        'Calce Antracite',
        'Calce Nero',
        'Cor-Ten Ruggine',
        'Cor-Ten Acciaio',
        'Ossido Bruno',
        'Ossido Nero',
        'Cemento Liscio 1',
        'Cemento Liscio 2',
        'Cemento Cassero 1',
        'Cemento Cassero 2',
        'Cemento Cassero 3',
        'Iron',
        'Ardesia a Spacco Nero',
        'Ardesia a Spacco Bianco',
        'Pietra Piasentina',
        'Noir Desir',
        'Noir Desir Lucido',
        'Bianco Statuario',
        'Bianco Statuario Lucido'
    ],
    
    // Riflessi Vetro
    riflessiVetro: {
        lucido: ['Bianco Panna', 'Bianco', 'Bianco Gesso', 'Bianco Seta', 'Grigio Ghiaia', 
                 'Grigio Muschio', 'Bronzo Scuro', 'Bronzo Chiaro', 'Tabacco', 'Moka', 
                 'Grigio Piombo', 'Rame', 'Oro', 'Platino', 'Fumo', 'Nero'],
        opaco: ['Bianco Panna', 'Bianco', 'Bianco Gesso', 'Grigio Muschio', 'Bronzo Scuro',
                'Bronzo Chiaro', 'Moka', 'Platino', 'Fumo', 'Nero']
    },
    
    // Kit opzionali
    kitOpzionali: [
        { key: 'kitTermico_1_2', label: 'Kit Termico U=1.2' },
        { key: 'kitTermico_1', label: 'Kit Termico U=1.0' },
        { key: 'kitAcustico', label: 'Kit Acustico 45dB' },
        { key: 'kitMose', label: 'Kit Mose (aria 4)' },
        { key: 'kitDam', label: 'Kit Dam (acqua 5A)' }
    ],
    
    // Accessori serratura
    accessoriSerratura: [
        { key: 'serraturaServizio', label: 'Serratura di servizio' },
        { key: 'limitatoreApertura', label: 'Limitatore apertura' },
        { key: 'riscontroElettrico', label: 'Riscontro elettrico' },
        { key: 'microinterruttoreAllarme', label: 'Microinterruttore allarme' }
    ],
    
    // Chiudiporta
    chiudiporta: [
        { key: 'nessuno', label: 'Nessuno' },
        { key: 'leva_110kg', label: 'A leva 110kg' },
        { key: 'slitta_110kg', label: 'A slitta 110kg' },
        { key: 'slitta_170kg', label: 'A slitta 170kg' },
        { key: 'scomparsa_110kg', label: 'A scomparsa 110kg' },
        { key: 'scomparsa_170kg', label: 'A scomparsa 170kg' }
    ],
    
    // Vetri blindati
    vetriBlindat: ['V1', 'V2', 'V3', 'V4', 'V5', 'V50'],
    tipiVetro: ['trasparente', 'sabbiato'],
    
    // Imballo
    imballo: ['pluriball', 'cartone', 'paletta', 'cassaLegno']
};


// ============================================================
// TEMPLATE CONFIG GLOBALE (configBlindata)
// ============================================================
const OIKOS_CONFIG_TEMPLATE = {
    azienda: 'Oikos',
    cilindro: 'SEKUR',
    coloreTelaio: 'RAL_8022',
    apertura: 'spingere',
    // Note generali
    noteGenerali: ''
};

// ============================================================
// TEMPLATE BRM CONFIG BLINDATA (brmConfigBlindata)
// ============================================================
const OIKOS_BRM_CONFIG_TEMPLATE = {
    // Per blindate: LNP (Luce Netta Passaggio) = misura foro
    misuraBaseL: 'LF',  // Default: Larghezza Foro
    operazioneL: '=',
    valoreL: '',
    misuraBaseH: 'HF',  // Default: Altezza Foro
    operazioneH: '=',
    valoreH: '',
    note: ''
};

// ============================================================
// TEMPLATE PRODOTTO BLINDATA (pos.blindata)
// ============================================================
const OIKOS_PRODUCT_TEMPLATE = {
    id: '',
    qta: '1',
    azienda: 'Oikos',
    
    // ── Configurazione principale ──
    linea: '',              // chiave da OIKOS_DATABASE_2025.linee
    luce: null,             // 0-8, calcolato automaticamente da LNP
    cilindro: 'SEKUR',
    coloreTelaio: 'RAL_8022',
    apertura: 'spingere',
    
    // ── Dimensioni (LNP = Luce Netta Passaggio) ──
    LNP_L: 0,               // Larghezza LNP in mm
    LNP_H: 0,               // Altezza LNP in mm
    
    // ── Rivestimento INTERNO ──
    rivestimentoInt: {
        linea: '',          // es. 'Piano Di Serie', 'Fugato V'
        modello: '',        // es. 'Di Serie', 'HTF'
        essenza: '',        // es. 'Rovere 1', 'Laccato RAL'
        tinta: '',          // es. 'Naturale', 'Miele'
        perEsterno: false,  // maggiorazione verniciatura esterni
        note: ''
    },
    
    // ── Rivestimento ESTERNO ──
    rivestimentoEst: {
        linea: '',
        modello: '',
        essenza: '',
        tinta: '',
        perEsterno: true,   // default true per esterno
        note: ''
    },
    
    // ── Kit prestazioni ──
    kitTermico: '',         // '', '1.2', '1'
    kitAcustico: false,
    kitMose: false,
    kitDam: false,
    
    // ── Accessori ──
    accessori: {
        serraturaServizio: false,
        limitatoreApertura: false,
        riscontroElettrico: false,
        microinterruttoreAllarme: false,
        chiudiporta: 'nessuno',
        vetroBlindat: '',       // '', 'V1', 'V2', etc.
        tipoVetro: 'trasparente',
        sopraluce: false,
        sopraluceH: 0,          // 500 o 800
        fiancoluce: false,
        imballo: 'cartone'
    },
    
    // ── Arckey (opzionale) ──
    arckey: {
        abilitato: false,
        lettore: '',            // 'rfid', 'tastiera', 'impronta'
        gateway: false
    },
    
    // ── Note e foto ──
    note: '',
    foto: []
};


// ============================================================
// FUNZIONI DATI
// ============================================================

/**
 * Crea blindata da configBlindata globale con calcolo LNP/Luce
 */
function createBlindataFromConfig(configBlindata, brmConfigBlindata, misure, posIndex) {
    const bl = JSON.parse(JSON.stringify(OIKOS_PRODUCT_TEMPLATE));
    bl.id = `blind-${posIndex || 1}`;
    
    // Copia campi da config globale
    if (configBlindata) {
        bl.cilindro = configBlindata.cilindro || 'SEKUR';
        bl.coloreTelaio = configBlindata.coloreTelaio || 'RAL_8022';
        bl.apertura = configBlindata.apertura || 'spingere';
    }
    
    // Calcola LNP se configurato
    if (brmConfigBlindata && misure) {
        bl.LNP_L = calcolaBRM_Blindata(brmConfigBlindata, misure, 'L');
        bl.LNP_H = calcolaBRM_Blindata(brmConfigBlindata, misure, 'H');
    }
    
    return bl;
}

/**
 * Calcolo BRM/LNP per dimensione L o H
 */
function calcolaBRM_Blindata(brmConfig, misure, dim) {
    const base = brmConfig[`misuraBase${dim}`];
    const op = brmConfig[`operazione${dim}`];
    const val = brmConfig[`valore${dim}`];
    
    if (!base || !misure[base]) return 0;
    
    const misuraBase = parseFloat(misure[base]) || 0;
    const valore = parseFloat(val) || 0;
    
    switch (op) {
        case '+': return misuraBase + valore;
        case '-': return misuraBase - valore;
        case '=': return valore || misuraBase;
        default: return misuraBase;
    }
}

/**
 * Determina automaticamente la Luce da LNP e linea
 * @returns {number|null} Luce 0-8 o null se fuori range
 */
function determinaLuceAutomatica(LNP_L, LNP_H, linea) {
    if (!linea || !LNP_L || !LNP_H) return null;
    
    // Usa funzione da oikos.js se disponibile
    if (typeof determinaLuceOikos === 'function') {
        return determinaLuceOikos(LNP_L, LNP_H, linea);
    }
    
    // Fallback: tabella luci base
    const luci = [
        { luce: 0, L: 900, H: 2100 },
        { luce: 1, L: 940, H: 2210 },
        { luce: 2, L: 1030, H: 2400 },
        { luce: 3, L: 1350, H: 2210 },  // Doppia
        { luce: 4, L: 1600, H: 2400 },  // Doppia
        { luce: 5, L: 1000, H: 2700 },  // Tekno
        { luce: 6, L: 1000, H: 3000 },  // Tekno
        { luce: 7, L: 1750, H: 2700 },  // Tekno Doppia
        { luce: 8, L: 1900, H: 3000 }   // Tekno Doppia
    ];
    
    for (const l of luci) {
        if (LNP_L <= l.L && LNP_H <= l.H) {
            return l.luce;
        }
    }
    return null;
}

/**
 * Normalizza blindata per export (pulisce campi vuoti/null)
 */
function normalizzaBlindata(bl) {
    if (!bl) return null;
    
    return {
        id: bl.id || '',
        qta: bl.qta || '1',
        azienda: bl.azienda || 'Oikos',
        linea: bl.linea || '',
        luce: bl.luce,
        cilindro: bl.cilindro || 'SEKUR',
        coloreTelaio: bl.coloreTelaio || '',
        apertura: bl.apertura || 'spingere',
        LNP_L: parseInt(bl.LNP_L) || 0,
        LNP_H: parseInt(bl.LNP_H) || 0,
        rivestimentoInt: {
            linea: bl.rivestimentoInt?.linea || '',
            modello: bl.rivestimentoInt?.modello || '',
            essenza: bl.rivestimentoInt?.essenza || '',
            tinta: bl.rivestimentoInt?.tinta || '',
            perEsterno: !!bl.rivestimentoInt?.perEsterno,
            note: bl.rivestimentoInt?.note || ''
        },
        rivestimentoEst: {
            linea: bl.rivestimentoEst?.linea || '',
            modello: bl.rivestimentoEst?.modello || '',
            essenza: bl.rivestimentoEst?.essenza || '',
            tinta: bl.rivestimentoEst?.tinta || '',
            perEsterno: !!bl.rivestimentoEst?.perEsterno,
            note: bl.rivestimentoEst?.note || ''
        },
        kitTermico: bl.kitTermico || '',
        kitAcustico: !!bl.kitAcustico,
        kitMose: !!bl.kitMose,
        kitDam: !!bl.kitDam,
        accessori: {
            serraturaServizio: !!bl.accessori?.serraturaServizio,
            limitatoreApertura: !!bl.accessori?.limitatoreApertura,
            riscontroElettrico: !!bl.accessori?.riscontroElettrico,
            microinterruttoreAllarme: !!bl.accessori?.microinterruttoreAllarme,
            chiudiporta: bl.accessori?.chiudiporta || 'nessuno',
            vetroBlindat: bl.accessori?.vetroBlindat || '',
            tipoVetro: bl.accessori?.tipoVetro || 'trasparente',
            sopraluce: !!bl.accessori?.sopraluce,
            sopraluceH: parseInt(bl.accessori?.sopraluceH) || 0,
            fiancoluce: !!bl.accessori?.fiancoluce,
            imballo: bl.accessori?.imballo || 'cartone'
        },
        arckey: {
            abilitato: !!bl.arckey?.abilitato,
            lettore: bl.arckey?.lettore || '',
            gateway: !!bl.arckey?.gateway
        },
        note: bl.note || '',
        foto: bl.foto || []
    };
}

/**
 * Ottieni info linea da database
 */
function getInfoLinea(lineaKey) {
    if (typeof OIKOS_DATABASE_2025 === 'undefined') return null;
    return OIKOS_DATABASE_2025.linee[lineaKey] || null;
}

/**
 * Ottieni luci disponibili per una linea
 */
function getLuciDisponibili(lineaKey) {
    const linea = getInfoLinea(lineaKey);
    if (!linea || !linea.prezzi) return [];
    return Object.keys(linea.prezzi).map(Number).sort((a, b) => a - b);
}


// ============================================================
// FUNZIONI RENDER
// ============================================================

/**
 * Render Config Globale Blindate (per Wizard Step)
 */
function renderConfigBlindataGlobale(config, brmConfig, onUpdate, onBrmUpdate) {
    const cfg = config || {};
    const brm = brmConfig || {};
    
    // Helper per select
    const sel = (campo, valore, opzioni, label) => {
        const opts = opzioni.map(o => {
            const val = typeof o === 'object' ? o.key : o;
            const lbl = typeof o === 'object' ? o.label : o;
            return `<option value="${val}" ${valore === val ? 'selected' : ''}>${lbl}</option>`;
        }).join('');
        return `
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-weight:600;font-size:13px;">${label}</label>
                <select onchange="${onUpdate}('${campo}', this.value)" 
                        style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">
                    <option value="">-- Seleziona --</option>
                    ${opts}
                </select>
            </div>`;
    };
    
    return `
        <div style="padding:12px;">
            <h3 style="margin:0 0 12px;font-size:16px;">🚪 Configurazione Globale Porte Blindate</h3>
            
            ${sel('cilindro', cfg.cilindro, OIKOS_OPZIONI.cilindri, 'Cilindro Default')}
            ${sel('coloreTelaio', cfg.coloreTelaio, OIKOS_OPZIONI.coloriTelaio, 'Colore Telaio Default')}
            ${sel('apertura', cfg.apertura, OIKOS_OPZIONI.aperture, 'Apertura Default')}
            
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-weight:600;font-size:13px;">Note Generali</label>
                <textarea onchange="${onUpdate}('noteGenerali', this.value)"
                          style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;min-height:50px;"
                          placeholder="Note generali blindate...">${cfg.noteGenerali || ''}</textarea>
            </div>
            
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;">
            <h4 style="margin:0 0 8px;font-size:14px;">📐 Calcolo LNP (Luce Netta Passaggio)</h4>
            ${renderBrmConfigBlindata(brm, onBrmUpdate)}
        </div>`;
}

/**
 * Render BRM Config per Blindate
 */
function renderBrmConfigBlindata(brm, onBrmUpdate) {
    const misureOptions = ['', 'LF', 'HF', 'LS', 'HS', 'LI', 'HI', 'LVT', 'HVT'];
    const opOptions = ['', '+', '-', '='];
    
    const selBrm = (campo, valore, opzioni) => {
        const opts = opzioni.map(o => 
            `<option value="${o}" ${valore === o ? 'selected' : ''}>${o || '--'}</option>`
        ).join('');
        return `<select onchange="${onBrmUpdate}('${campo}', this.value)" 
                        style="padding:6px;border:1px solid #ddd;border-radius:4px;">
                    ${opts}
                </select>`;
    };
    
    return `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
                <label style="font-size:12px;font-weight:600;">LNP Larghezza</label>
                <div style="display:flex;gap:4px;align-items:center;">
                    ${selBrm('misuraBaseL', brm.misuraBaseL || 'LF', misureOptions)}
                    ${selBrm('operazioneL', brm.operazioneL || '=', opOptions)}
                    <input type="number" value="${brm.valoreL || ''}" 
                           onchange="${onBrmUpdate}('valoreL', this.value)"
                           style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;"
                           placeholder="mm">
                </div>
            </div>
            <div>
                <label style="font-size:12px;font-weight:600;">LNP Altezza</label>
                <div style="display:flex;gap:4px;align-items:center;">
                    ${selBrm('misuraBaseH', brm.misuraBaseH || 'HF', misureOptions)}
                    ${selBrm('operazioneH', brm.operazioneH || '=', opOptions)}
                    <input type="number" value="${brm.valoreH || ''}" 
                           onchange="${onBrmUpdate}('valoreH', this.value)"
                           style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;"
                           placeholder="mm">
                </div>
            </div>
        </div>
        <div style="margin-top:8px;">
            <label style="font-size:12px;font-weight:600;">Note LNP</label>
            <input type="text" value="${brm.note || ''}" 
                   onchange="${onBrmUpdate}('note', this.value)"
                   style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;"
                   placeholder="Note calcolo LNP...">
        </div>`;
}


/**
 * Render Tab Blindata nella posizione
 * 3 stati: vuoto (null), qta=0 (non serve), form completo
 */
function renderBlindataTab(bl, posId, configBlindata, callbacks) {
    // STATO 1: Non inizializzata (null)
    if (!bl) {
        return `
            <div style="text-align:center;padding:40px 20px;color:#6b7280;">
                <div style="font-size:40px;margin-bottom:12px;">🚪</div>
                <p style="margin:0 0 16px;font-size:14px;">Nessuna porta blindata configurata</p>
                <button onclick="${callbacks.onAdd}('${posId}')" 
                        style="padding:10px 24px;background:#dc2626;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
                    ➕ Aggiungi Porta Blindata
                </button>
            </div>`;
    }
    
    // STATO 2: qta = 0 (non serve)
    const qta = parseInt(bl.qta) || 0;
    if (qta === 0) {
        return `
            <div style="text-align:center;padding:40px 20px;color:#6b7280;">
                <div style="font-size:40px;margin-bottom:12px;">🚪</div>
                <p style="margin:0 0 8px;font-size:14px;">Porta Blindata: <strong>Quantità 0</strong></p>
                <p style="margin:0 0 16px;font-size:12px;color:#9ca3af;">Imposta quantità > 0 per configurare</p>
                <div style="display:flex;gap:8px;justify-content:center;">
                    <select onchange="${callbacks.onFieldChange}('${posId}', 'qta', this.value)"
                            style="padding:8px;border:1px solid #ddd;border-radius:6px;">
                        ${[0,1,2].map(n => `<option value="${n}" ${qta===n?'selected':''}>${n}</option>`).join('')}
                    </select>
                    <button onclick="${callbacks.onRemove}('${posId}')" 
                            style="padding:8px 16px;background:#ef4444;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">
                        🗑️ Elimina
                    </button>
                </div>
            </div>`;
    }
    
    // STATO 3: Form completo
    return renderBlindataForm(bl, posId, configBlindata, callbacks);
}


/**
 * Render Form dettagliato Blindata
 */
function renderBlindataForm(bl, posId, configBlindata, callbacks) {
    const b = bl || {};
    const cb = callbacks || {};
    
    // Helper select
    const sel = (campo, valore, opzioni, label, nested = '') => {
        const opts = opzioni.map(o => {
            const val = typeof o === 'object' ? o.key : o;
            const lbl = typeof o === 'object' ? o.label : o;
            return `<option value="${val}" ${valore === val ? 'selected' : ''}>${lbl}</option>`;
        }).join('');
        const path = nested ? `${nested}.${campo}` : campo;
        return `
            <div style="margin-bottom:6px;">
                <label style="font-size:12px;font-weight:600;color:#374151;">${label}</label>
                <select onchange="${cb.onFieldChange}('${posId}', '${path}', this.value)"
                        style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    <option value="">--</option>
                    ${opts}
                </select>
            </div>`;
    };
    
    // Determina luce automatica
    const luceAuto = determinaLuceAutomatica(b.LNP_L, b.LNP_H, b.linea);
    const luceDisplay = luceAuto !== null ? `Luce ${luceAuto}` : 'N/D';
    
    // Info linea
    const infoLinea = getInfoLinea(b.linea);
    const luciDisp = getLuciDisponibili(b.linea);
    
    return `
        <div style="padding:8px;">
            <!-- HEADER: Qta + Azioni -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-weight:700;font-size:15px;">🚪 Porta Blindata</span>
                    <label style="font-size:12px;">Qta:</label>
                    <select onchange="${cb.onFieldChange}('${posId}', 'qta', this.value)"
                            style="padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;">
                        ${[0,1,2].map(n => 
                            `<option value="${n}" ${parseInt(b.qta)===n?'selected':''}>${n}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="display:flex;gap:6px;">
                    <button onclick="${cb.onReload}('${posId}')" title="Ricarica da Config Globale"
                            style="padding:4px 10px;background:#f59e0b;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                        🔄 Ricarica
                    </button>
                    <button onclick="${cb.onRemove}('${posId}')" title="Elimina blindata"
                            style="padding:4px 10px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                        🗑️
                    </button>
                </div>
            </div>
            
            <!-- SEZIONE 1: Linea e Dimensioni -->
            <div style="background:#fef2f2;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#991b1b;margin-bottom:8px;">🏷️ Linea & Dimensioni</div>
                
                <!-- Linea con gruppi -->
                <div style="margin-bottom:8px;">
                    <label style="font-size:12px;font-weight:600;color:#374151;">Linea Prodotto</label>
                    <select onchange="${cb.onFieldChange}('${posId}', 'linea', this.value)"
                            style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                        <option value="">-- Seleziona Linea --</option>
                        ${Object.entries(OIKOS_OPZIONI.lineePerCategoria).map(([cat, linee]) => `
                            <optgroup label="${cat}">
                                ${linee.map(l => `<option value="${l.key}" ${b.linea === l.key ? 'selected' : ''}>${l.label}</option>`).join('')}
                            </optgroup>
                        `).join('')}
                    </select>
                </div>
                
                <!-- LNP -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                    <div>
                        <label style="font-size:12px;font-weight:600;">LNP Largh. (mm)</label>
                        <input type="number" value="${b.LNP_L || ''}" 
                               onchange="${cb.onFieldChange}('${posId}', 'LNP_L', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    </div>
                    <div>
                        <label style="font-size:12px;font-weight:600;">LNP Alt. (mm)</label>
                        <input type="number" value="${b.LNP_H || ''}" 
                               onchange="${cb.onFieldChange}('${posId}', 'LNP_H', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    </div>
                    <div>
                        <label style="font-size:12px;font-weight:600;">Luce</label>
                        <div style="padding:7px;background:#e5e7eb;border-radius:6px;font-size:13px;font-weight:600;text-align:center;">
                            ${luceDisplay}
                        </div>
                    </div>
                </div>
                
                ${infoLinea ? `<div style="margin-top:6px;font-size:11px;color:#6b7280;">
                    ${infoLinea.nome} - Classe ${infoLinea.classe || '?'} | Luci disponibili: ${luciDisp.join(', ')}
                </div>` : ''}
            </div>
            
            <!-- SEZIONE 2: Configurazione Base -->
            <div style="background:#f0fdf4;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#166534;margin-bottom:8px;">⚙️ Configurazione</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${sel('cilindro', b.cilindro, OIKOS_OPZIONI.cilindri, 'Cilindro')}
                    ${sel('coloreTelaio', b.coloreTelaio, OIKOS_OPZIONI.coloriTelaio, 'Colore Telaio')}
                    ${sel('apertura', b.apertura, OIKOS_OPZIONI.aperture, 'Apertura')}
                </div>
            </div>
            
            <!-- SEZIONE 3: Rivestimento INTERNO -->
            <div style="background:#eff6ff;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#1e40af;margin-bottom:8px;">🎨 Rivestimento INTERNO</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${sel('linea', b.rivestimentoInt?.linea, OIKOS_OPZIONI.lineeRivestimento, 'Linea', 'rivestimentoInt')}
                    ${sel('essenza', b.rivestimentoInt?.essenza, OIKOS_OPZIONI.essenze, 'Essenza', 'rivestimentoInt')}
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Tinta</label>
                        <input type="text" value="${b.rivestimentoInt?.tinta || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'rivestimentoInt.tinta', this.value)"
                               list="tinteInt_${posId}"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Tinta...">
                        <datalist id="tinteInt_${posId}">
                            ${OIKOS_OPZIONI.tinte.map(t => `<option value="${t}">`).join('')}
                        </datalist>
                    </div>
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Note Int.</label>
                        <input type="text" value="${b.rivestimentoInt?.note || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'rivestimentoInt.note', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Note...">
                    </div>
                </div>
            </div>
            
            <!-- SEZIONE 4: Rivestimento ESTERNO -->
            <div style="background:#fef3c7;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:8px;">🎨 Rivestimento ESTERNO</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${sel('linea', b.rivestimentoEst?.linea, OIKOS_OPZIONI.lineeRivestimento, 'Linea', 'rivestimentoEst')}
                    ${sel('essenza', b.rivestimentoEst?.essenza, OIKOS_OPZIONI.essenze, 'Essenza', 'rivestimentoEst')}
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Tinta</label>
                        <input type="text" value="${b.rivestimentoEst?.tinta || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'rivestimentoEst.tinta', this.value)"
                               list="tinteEst_${posId}"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Tinta...">
                        <datalist id="tinteEst_${posId}">
                            ${OIKOS_OPZIONI.tinte.map(t => `<option value="${t}">`).join('')}
                        </datalist>
                    </div>
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Note Est.</label>
                        <input type="text" value="${b.rivestimentoEst?.note || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'rivestimentoEst.note', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Note...">
                    </div>
                </div>
                <div style="margin-top:4px;">
                    <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                        <input type="checkbox" ${b.rivestimentoEst?.perEsterno ? 'checked' : ''}
                               onchange="${cb.onFieldChange}('${posId}', 'rivestimentoEst.perEsterno', this.checked)">
                        Maggiorazione verniciatura per esterni
                    </label>
                </div>
            </div>
            
            <!-- SEZIONE 5: Kit Prestazioni -->
            <div style="background:#faf5ff;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#7c3aed;margin-bottom:8px;">🔧 Kit Prestazioni</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;">Kit Termico</label>
                        <select onchange="${cb.onFieldChange}('${posId}', 'kitTermico', this.value)"
                                style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                            <option value="" ${!b.kitTermico ? 'selected' : ''}>Nessuno</option>
                            <option value="1.2" ${b.kitTermico === '1.2' ? 'selected' : ''}>U=1.2</option>
                            <option value="1" ${b.kitTermico === '1' ? 'selected' : ''}>U=1.0</option>
                        </select>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:4px;padding-top:18px;">
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.kitAcustico ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'kitAcustico', this.checked)">
                            Kit Acustico 45dB
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.kitMose ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'kitMose', this.checked)">
                            Kit Mose (aria 4)
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.kitDam ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'kitDam', this.checked)">
                            Kit Dam (acqua 5A)
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- SEZIONE 6: Accessori -->
            <div style="background:#f0f9ff;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#0369a1;margin-bottom:8px;">🔩 Accessori</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.accessori?.serraturaServizio ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'accessori.serraturaServizio', this.checked)">
                            Serratura servizio
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.accessori?.limitatoreApertura ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'accessori.limitatoreApertura', this.checked)">
                            Limitatore apertura
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.accessori?.riscontroElettrico ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'accessori.riscontroElettrico', this.checked)">
                            Riscontro elettrico
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
                            <input type="checkbox" ${b.accessori?.microinterruttoreAllarme ? 'checked' : ''}
                                   onchange="${cb.onFieldChange}('${posId}', 'accessori.microinterruttoreAllarme', this.checked)">
                            Microinterruttore allarme
                        </label>
                    </div>
                    <div>
                        ${sel('chiudiporta', b.accessori?.chiudiporta, OIKOS_OPZIONI.chiudiporta, 'Chiudiporta', 'accessori')}
                        ${sel('imballo', b.accessori?.imballo, OIKOS_OPZIONI.imballo, 'Imballo', 'accessori')}
                    </div>
                </div>
            </div>
            
            <!-- Note -->
            <div style="margin-bottom:6px;">
                <label style="font-size:12px;font-weight:600;">Note</label>
                <textarea onchange="${cb.onFieldChange}('${posId}', 'note', this.value)"
                          style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;min-height:50px;"
                          placeholder="Note porta blindata...">${b.note || ''}</textarea>
            </div>
        </div>`;
}


// ============================================================
// CALCOLO PREZZO
// ============================================================

/**
 * Calcola prezzo blindata usando OIKOS_DATABASE_2025
 */
function calcolaPrezzoBlindata(bl) {
    if (typeof OIKOS_DATABASE_2025 === 'undefined') {
        return { errore: 'OIKOS_DATABASE_2025 non caricato' };
    }
    
    if (!bl || !bl.linea) {
        return { errore: 'Dati blindata incompleti (linea obbligatoria)' };
    }
    
    const L = parseInt(bl.LNP_L) || 0;
    const H = parseInt(bl.LNP_H) || 0;
    
    if (L === 0 || H === 0) {
        return { errore: 'Misure LNP mancanti' };
    }
    
    // Determina luce
    const luce = determinaLuceAutomatica(L, H, bl.linea);
    if (luce === null) {
        return { errore: `Dimensioni ${L}x${H} fuori range per ${bl.linea}` };
    }
    
    // Usa calcolaPrezzoOikos se disponibile
    if (typeof calcolaPrezzoOikos === 'function') {
        const config = {
            linea: bl.linea,
            luce: luce,
            cilindro: bl.cilindro,
            coloreTelaio: bl.coloreTelaio,
            kitTermico: bl.kitTermico,
            kitAcustico: bl.kitAcustico,
            kitMose: bl.kitMose,
            kitDam: bl.kitDam
            // rivestimenti da aggiungere separatamente
        };
        
        const risultato = calcolaPrezzoOikos(config);
        
        // Aggiungi info luce calcolata
        if (!risultato.errore) {
            risultato.luceCalcolata = luce;
            risultato.LNP = { L, H };
        }
        
        return risultato;
    }
    
    return { errore: 'Funzione calcolaPrezzoOikos non disponibile' };
}


// ============================================================
// EXPORT GLOBALE
// ============================================================

window.OIKOS_MODULE = {
    // Opzioni
    OPZIONI: OIKOS_OPZIONI,
    CONFIG_TEMPLATE: OIKOS_CONFIG_TEMPLATE,
    BRM_CONFIG_TEMPLATE: OIKOS_BRM_CONFIG_TEMPLATE,
    PRODUCT_TEMPLATE: OIKOS_PRODUCT_TEMPLATE,
    
    // Funzioni dati
    createFromConfig: createBlindataFromConfig,
    normalizza: normalizzaBlindata,
    determinaLuce: determinaLuceAutomatica,
    getInfoLinea: getInfoLinea,
    getLuciDisponibili: getLuciDisponibili,
    
    // Funzioni render
    renderConfigGlobale: renderConfigBlindataGlobale,
    renderTab: renderBlindataTab,
    renderForm: renderBlindataForm,
    
    // Calcolo prezzo
    calcolaPrezzo: calcolaPrezzoBlindata
};

// Esporta anche le costanti per accesso diretto
window.OIKOS_OPZIONI = OIKOS_OPZIONI;

console.log('✅ oikos-module.js v1.0.0 caricato');
console.log('   🚪 Linee:', OIKOS_OPZIONI.linee.length);
console.log('   🎨 Rivestimenti:', OIKOS_OPZIONI.lineeRivestimento.length);
console.log('   🔧 Kit:', OIKOS_OPZIONI.kitOpzionali.length);
