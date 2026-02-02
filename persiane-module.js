// ═══════════════════════════════════════════════════════════════════════════════
// 🪟 PERSIANE MODULE v1.0.0 - Modulo Centralizzato Persiane
// Per shared-database - Usato da App Rilievo + Dashboard
// Pattern: identico a erreci-grate.js
// Dipendenze: persiane.js (COLORI_PERSIANE, CARDINI, FERMAPERSIANE)
//             persiane-prezzi.js (PUNTO_PERSIANE_2025) - opzionale per calcolo
//             opzioni-prodotti.js (OPZIONI_PRODOTTI.persiane) - opzionale
// ═══════════════════════════════════════════════════════════════════════════════

// ============================================================
// OPZIONI PERSIANE (centralizzate)
// ============================================================
const PERSIANE_OPZIONI = {
    aziende: ['P. Persiane'],
    
    tipi: ['F1', 'PF1', 'F2', 'PF2', 'F3', 'PF3', 'F4', 'PF4', 'SCORREVOLE'],
    
    aperture: ['SP SX', 'SP DX', 'LIB SX', 'LIB DX', 'SCORR SX', 'SCORR DX'],
    
    fissaggi: ['muro', 'telaio'],
    
    battute: ['3 LATI', '4 LATI', '2 LATI LATERALI'],
    
    // Modelli raggruppati per categoria
    modelliPerCategoria: {
        'Stecca Fissa Tonda':      ['Angela', 'Giulia', 'Luna'],
        'Stecca Fissa Romboidale': ['Piemontese', 'Firenze', 'Carolina', 'Storica', 'Camelia'],
        'Orientabili':             ['Aurora', 'Alice'],
        'Cieche e Dogate':         ['Nerina', 'Nerina [R]', 'Canazei', 'Alto Adige', 'Alto Adige [R]', 
                                    'Cortina', 'Cortina [R]', 'Diamante', 'Oscura', 'Oscura [R]'],
        'Scandola':                ['Scandola', 'Scandola Duo', 'Scandola [TT]', 'Scandola Duo [TT]', 
                                    'Oscura Duo', 'Oscura Duo [TT]'],
        'Ultratech':               ['Aida']
    },
    
    // Lista piatta per dropdown
    modelli: [
        'Angela', 'Giulia', 'Luna',
        'Piemontese', 'Firenze', 'Carolina', 'Storica', 'Camelia',
        'Aurora', 'Alice',
        'Nerina', 'Nerina [R]', 'Canazei', 'Alto Adige', 'Alto Adige [R]',
        'Cortina', 'Cortina [R]', 'Diamante', 'Oscura', 'Oscura [R]',
        'Scandola', 'Scandola Duo', 'Scandola [TT]', 'Scandola Duo [TT]',
        'Oscura Duo', 'Oscura Duo [TT]',
        'Aida'
    ],
    
    // Telai con dettagli
    telaiDettaglio: [
        { codice: 'TH10', nome: 'TH10 - Telaio base' },
        { codice: 'TH40', nome: 'TH40 - Telaio 40mm' },
        { codice: 'TH41', nome: 'TH41 - Telaio 41mm' },
        { codice: 'TH45', nome: 'TH45 - Telaio 45mm' },
        { codice: 'TH46R', nome: 'TH46R - Telaio 46mm rinforzato' },
        { codice: 'TH62', nome: 'TH62 - Telaio 62mm' },
        { codice: 'TH80', nome: 'TH80 - Telaio 80mm' },
        { codice: 'TH53', nome: 'TH53 - Telaio a sporgere' }
    ],
    
    tipiTelaio: ['TH10', 'TH40', 'TH41', 'TH45', 'TH46R', 'TH62', 'TH80', 'TH53'],
    
    // Mapping modello → codice per PUNTO_PERSIANE_2025
    modelloToCodice: {
        'Angela': 'angela', 'Giulia': 'giulia', 'Luna': 'luna',
        'Piemontese': 'piemontese', 'Firenze': 'firenze', 'Carolina': 'carolina',
        'Storica': 'storica', 'Camelia': 'camelia',
        'Aurora': 'aurora', 'Alice': 'alice',
        'Nerina': 'nerina', 'Nerina [R]': 'nerina_r',
        'Canazei': 'canazei', 'Diamante': 'diamante',
        'Alto Adige': 'alto_adige', 'Alto Adige [R]': 'alto_adige_r',
        'Cortina': 'cortina', 'Cortina [R]': 'cortina_r',
        'Oscura': 'oscura', 'Oscura [R]': 'oscura_r',
        'Scandola': 'scandola', 'Scandola Duo': 'scandola_duo',
        'Scandola [TT]': 'scandola_tt', 'Scandola Duo [TT]': 'scandola_duo_tt',
        'Oscura Duo': 'oscura_duo', 'Oscura Duo [TT]': 'oscura_duo_tt',
        'Aida': 'aida'
    }
};


// ============================================================
// TEMPLATE CONFIG GLOBALE (configPersiane)
// ============================================================
const PERSIANE_CONFIG_TEMPLATE = {
    azienda: 'P. Persiane',
    modello: '',
    fissaggio: '',
    colorePersiana: '',
    coloreTelaio: '',
    battuta: '',
    tipoStecca: '',
    asolato: '',
    tipo: '',
    apertura: '',
    tipoTelaio: ''
};

// ============================================================
// TEMPLATE BRM CONFIG PERSIANE (brmConfigPersiane)
// ============================================================
const PERSIANE_BRM_CONFIG_TEMPLATE = {
    misuraBaseL: '',
    operazioneL: '',
    valoreL: '',
    misuraBaseH: '',
    operazioneH: '',
    valoreH: '',
    note: ''
};

// ============================================================
// TEMPLATE PRODOTTO PERSIANA (pos.persiana)
// ============================================================
const PERSIANE_PRODUCT_TEMPLATE = {
    id: '',
    qta: '1',
    azienda: 'P. Persiane',
    modello: '',
    tipo: '',
    apertura: '',
    fissaggio: '',
    colorePersiana: '',
    coloreTelaio: '',
    battuta: '',
    tipoStecca: '',
    asolato: '',
    tipoTelaio: '',
    BRM_L: 0,
    BRM_H: 0,
    note: '',
    foto: [],
    accessoriPersiana: {
        cardini: { qta: 0, modello: '' },
        fermapersiane: { qta: 0, modello: '' }
    }
};


// ============================================================
// FUNZIONI DATI
// ============================================================

/**
 * Crea persiana da configPersiane globale con calcolo BRM
 */
function createPersianaFromConfig(configPersiane, brmConfigPersiane, misure, posIndex) {
    const pers = JSON.parse(JSON.stringify(PERSIANE_PRODUCT_TEMPLATE));
    pers.id = `pers-${posIndex || 1}`;
    
    // Copia campi da config globale
    if (configPersiane) {
        pers.azienda = configPersiane.azienda || 'P. Persiane';
        pers.modello = configPersiane.modello || '';
        pers.tipo = configPersiane.tipo || '';
        pers.apertura = configPersiane.apertura || '';
        pers.fissaggio = configPersiane.fissaggio || '';
        pers.colorePersiana = configPersiane.colorePersiana || '';
        pers.coloreTelaio = configPersiane.coloreTelaio || '';
        pers.battuta = configPersiane.battuta || '';
        pers.tipoStecca = configPersiane.tipoStecca || '';
        pers.asolato = configPersiane.asolato || '';
        pers.tipoTelaio = configPersiane.tipoTelaio || '';
    }
    
    // Calcola BRM se configurato
    if (brmConfigPersiane && misure) {
        pers.BRM_L = calcolaBRM_Persiana(brmConfigPersiane, misure, 'L');
        pers.BRM_H = calcolaBRM_Persiana(brmConfigPersiane, misure, 'H');
    }
    
    // Auto-calcola cardini e fermapersiane se tipo definito
    if (pers.tipo) {
        autoCalcolaAccessoriPersiana(pers);
    }
    
    return pers;
}

/**
 * Calcolo BRM per dimensione L o H
 */
function calcolaBRM_Persiana(brmConfig, misure, dim) {
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
 * Auto-calcola quantità cardini e fermapersiane in base a tipologia
 */
function autoCalcolaAccessoriPersiana(pers) {
    if (!pers.tipo) return;
    
    // Usa funzioni da persiane.js se disponibili
    if (typeof calcolaCardiniPersiana === 'function') {
        const isLibro = (pers.apertura || '').includes('LIB');
        pers.accessoriPersiana.cardini.qta = calcolaCardiniPersiana(pers.tipo, isLibro);
    }
    if (typeof calcolaFermapersiane === 'function') {
        pers.accessoriPersiana.fermapersiane.qta = calcolaFermapersiane(pers.tipo);
    }
}

/**
 * Normalizza persiana per export (pulisce campi vuoti/null)
 */
function normalizzaPersiana(pers) {
    if (!pers) return null;
    
    return {
        id: pers.id || '',
        qta: pers.qta || '1',
        azienda: pers.azienda || 'P. Persiane',
        modello: pers.modello || '',
        tipo: pers.tipo || '',
        apertura: pers.apertura || '',
        fissaggio: pers.fissaggio || '',
        colorePersiana: pers.colorePersiana || '',
        coloreTelaio: pers.coloreTelaio || '',
        battuta: pers.battuta || '',
        tipoStecca: pers.tipoStecca || '',
        asolato: pers.asolato || '',
        tipoTelaio: pers.tipoTelaio || '',
        BRM_L: parseInt(pers.BRM_L) || 0,
        BRM_H: parseInt(pers.BRM_H) || 0,
        note: pers.note || '',
        foto: pers.foto || [],
        accessoriPersiana: {
            cardini: {
                qta: parseInt(pers.accessoriPersiana?.cardini?.qta) || 0,
                modello: pers.accessoriPersiana?.cardini?.modello || ''
            },
            fermapersiane: {
                qta: parseInt(pers.accessoriPersiana?.fermapersiane?.qta) || 0,
                modello: pers.accessoriPersiana?.fermapersiane?.modello || ''
            }
        }
    };
}

/**
 * Ottieni colori raggruppati per categoria (per datalist/dropdown arricchito)
 */
function getColoriPerCategoria() {
    if (typeof PUNTO_PERSIANE_2025 === 'undefined') return {};
    
    const result = {};
    for (const [catKey, catData] of Object.entries(PUNTO_PERSIANE_2025.colori)) {
        result[catData.nome] = catData.codici.map(cod => {
            // Cerca descrizione completa in COLORI_PERSIANE
            const full = (typeof COLORI_PERSIANE !== 'undefined') 
                ? COLORI_PERSIANE.find(c => c.startsWith(cod)) 
                : null;
            return full || cod;
        });
    }
    return result;
}

/**
 * Ottieni modelli raggruppati per categoria
 */
function getModelliPerCategoria() {
    return PERSIANE_OPZIONI.modelliPerCategoria;
}


// ============================================================
// FUNZIONI RENDER
// ============================================================

/**
 * Render Config Globale Persiane (per Wizard Step)
 * @param {object} config - configPersiane corrente
 * @param {object} brmConfig - brmConfigPersiane corrente
 * @param {function} onUpdate - callback(campo, valore)
 * @param {function} onBrmUpdate - callback(campo, valore)
 */
function renderConfigPersianeGlobale(config, brmConfig, onUpdate, onBrmUpdate) {
    const cfg = config || {};
    const brm = brmConfig || {};
    
    // Helper per select
    const sel = (campo, valore, opzioni, label) => {
        const opts = opzioni.map(o => 
            `<option value="${o}" ${valore === o ? 'selected' : ''}>${o}</option>`
        ).join('');
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
    
    // Helper per colori persiana (con datalist da COLORI_PERSIANE)
    const coloriList = (typeof COLORI_PERSIANE !== 'undefined') ? COLORI_PERSIANE : [];
    const coloriDatalist = coloriList.map(c => `<option value="${c}">`).join('');
    
    return `
        <div style="padding:12px;">
            <h3 style="margin:0 0 12px;font-size:16px;">🪟 Configurazione Globale Persiane</h3>
            
            ${sel('azienda', cfg.azienda, PERSIANE_OPZIONI.aziende, 'Azienda')}
            ${sel('modello', cfg.modello, PERSIANE_OPZIONI.modelli, 'Modello')}
            ${sel('fissaggio', cfg.fissaggio, PERSIANE_OPZIONI.fissaggi, 'Fissaggio')}
            
            ${cfg.fissaggio === 'telaio' ? sel('tipoTelaio', cfg.tipoTelaio, PERSIANE_OPZIONI.tipiTelaio, 'Tipo Telaio') : ''}
            
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-weight:600;font-size:13px;">Colore Persiana</label>
                <input type="text" list="coloriPersiane" value="${cfg.colorePersiana || ''}"
                       onchange="${onUpdate}('colorePersiana', this.value)"
                       style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"
                       placeholder="Cerca colore...">
                <datalist id="coloriPersiane">${coloriDatalist}</datalist>
            </div>
            
            ${sel('battuta', cfg.battuta, PERSIANE_OPZIONI.battute, 'Battuta')}
            
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-weight:600;font-size:13px;">Tipo Stecca</label>
                <input type="text" value="${cfg.tipoStecca || ''}"
                       onchange="${onUpdate}('tipoStecca', this.value)"
                       style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"
                       placeholder="Es: Fissa tonda, Orientabile...">
            </div>
            
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-weight:600;font-size:13px;">Asolato</label>
                <input type="text" value="${cfg.asolato || ''}"
                       onchange="${onUpdate}('asolato', this.value)"
                       style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"
                       placeholder="Es: Si, No">
            </div>
            
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;">
            <h4 style="margin:0 0 8px;font-size:14px;">📐 BRM Persiane</h4>
            ${renderBrmConfig(brm, onBrmUpdate)}
        </div>`;
}

/**
 * Render BRM Config
 */
function renderBrmConfig(brm, onBrmUpdate) {
    const misureOptions = ['', 'LS', 'HS', 'LI', 'HI', 'LF', 'HF', 'LVT', 'HVT'];
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
                <label style="font-size:12px;font-weight:600;">BRM Larghezza</label>
                <div style="display:flex;gap:4px;align-items:center;">
                    ${selBrm('misuraBaseL', brm.misuraBaseL || '', misureOptions)}
                    ${selBrm('operazioneL', brm.operazioneL || '', opOptions)}
                    <input type="number" value="${brm.valoreL || ''}" 
                           onchange="${onBrmUpdate}('valoreL', this.value)"
                           style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;"
                           placeholder="mm">
                </div>
            </div>
            <div>
                <label style="font-size:12px;font-weight:600;">BRM Altezza</label>
                <div style="display:flex;gap:4px;align-items:center;">
                    ${selBrm('misuraBaseH', brm.misuraBaseH || '', misureOptions)}
                    ${selBrm('operazioneH', brm.operazioneH || '', opOptions)}
                    <input type="number" value="${brm.valoreH || ''}" 
                           onchange="${onBrmUpdate}('valoreH', this.value)"
                           style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;"
                           placeholder="mm">
                </div>
            </div>
        </div>
        <div style="margin-top:8px;">
            <label style="font-size:12px;font-weight:600;">Note BRM</label>
            <input type="text" value="${brm.note || ''}" 
                   onchange="${onBrmUpdate}('note', this.value)"
                   style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;"
                   placeholder="Note calcolo BRM...">
        </div>`;
}


/**
 * Render Tab Persiana nella posizione
 * 3 stati: vuoto (null), qta=0 (non serve), form completo
 * @param {object} pers - pos.persiana (può essere null)
 * @param {string} posId - ID posizione
 * @param {object} configPersiane - config globale
 * @param {object} callbacks - {onAdd, onRemove, onUpdate, onReload, onFieldChange}
 */
function renderPersianaTab(pers, posId, configPersiane, callbacks) {
    // STATO 1: Non inizializzata (null)
    if (!pers) {
        return `
            <div style="text-align:center;padding:40px 20px;color:#6b7280;">
                <div style="font-size:40px;margin-bottom:12px;">🪟</div>
                <p style="margin:0 0 16px;font-size:14px;">Nessuna persiana configurata</p>
                <button onclick="${callbacks.onAdd}('${posId}')" 
                        style="padding:10px 24px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
                    ➕ Aggiungi Persiana
                </button>
            </div>`;
    }
    
    // STATO 2: qta = 0 (non serve)
    const qta = parseInt(pers.qta) || 0;
    if (qta === 0) {
        return `
            <div style="text-align:center;padding:40px 20px;color:#6b7280;">
                <div style="font-size:40px;margin-bottom:12px;">🪟</div>
                <p style="margin:0 0 8px;font-size:14px;">Persiana: <strong>Quantità 0</strong></p>
                <p style="margin:0 0 16px;font-size:12px;color:#9ca3af;">Imposta quantità > 0 per configurare</p>
                <div style="display:flex;gap:8px;justify-content:center;">
                    <select onchange="${callbacks.onFieldChange}('${posId}', 'qta', this.value)"
                            style="padding:8px;border:1px solid #ddd;border-radius:6px;">
                        ${[0,1,2,3,4,5].map(n => `<option value="${n}" ${qta===n?'selected':''}>${n}</option>`).join('')}
                    </select>
                    <button onclick="${callbacks.onRemove}('${posId}')" 
                            style="padding:8px 16px;background:#ef4444;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">
                        🗑️ Elimina
                    </button>
                </div>
            </div>`;
    }
    
    // STATO 3: Form completo
    return renderPersianaForm(pers, posId, configPersiane, callbacks);
}


/**
 * Render Form dettagliato Persiana
 */
function renderPersianaForm(pers, posId, configPersiane, callbacks) {
    const p = pers || {};
    const cb = callbacks || {};
    
    // Helper select inline
    const sel = (campo, valore, opzioni, label) => {
        const opts = opzioni.map(o => 
            `<option value="${o}" ${valore === o ? 'selected' : ''}>${o}</option>`
        ).join('');
        return `
            <div style="margin-bottom:6px;">
                <label style="font-size:12px;font-weight:600;color:#374151;">${label}</label>
                <select onchange="${cb.onFieldChange}('${posId}', '${campo}', this.value)"
                        style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    <option value="">--</option>
                    ${opts}
                </select>
            </div>`;
    };
    
    // Colori datalist
    const coloriList = (typeof COLORI_PERSIANE !== 'undefined') ? COLORI_PERSIANE : [];
    const dlId = `colPers_${posId}`;
    const coloriDatalist = coloriList.map(c => `<option value="${c}">`).join('');
    
    // Cardini dropdown
    const cardiniList = (typeof CARDINI_PUNTO_PERSIANE !== 'undefined') ? CARDINI_PUNTO_PERSIANE : [];
    const cardiniOpts = cardiniList.map(c => 
        `<option value="${c.codice}" ${(p.accessoriPersiana?.cardini?.modello === c.codice) ? 'selected' : ''}>${c.nome}${c.prezzo > 0 ? ` (+€${c.prezzo})` : ''}</option>`
    ).join('');
    
    // Fermapersiane dropdown
    const fermaList = (typeof FERMAPERSIANE_PUNTO_PERSIANE !== 'undefined') ? FERMAPERSIANE_PUNTO_PERSIANE : [];
    const fermaOpts = fermaList.map(f => 
        `<option value="${f.codice}" ${(p.accessoriPersiana?.fermapersiane?.modello === f.codice) ? 'selected' : ''}>${f.nome}${f.prezzo > 0 ? ` (+€${f.prezzo})` : ''}</option>`
    ).join('');
    
    return `
        <div style="padding:8px;">
            <!-- HEADER: Qta + Azioni -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-weight:700;font-size:15px;">🪟 Persiana</span>
                    <label style="font-size:12px;">Qta:</label>
                    <select onchange="${cb.onFieldChange}('${posId}', 'qta', this.value)"
                            style="padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;">
                        ${[0,1,2,3,4,5,6,7,8,9,10].map(n => 
                            `<option value="${n}" ${parseInt(p.qta)===n?'selected':''}>${n}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="display:flex;gap:6px;">
                    <button onclick="${cb.onReload}('${posId}')" title="Ricarica da Config Globale"
                            style="padding:4px 10px;background:#f59e0b;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                        🔄 Ricarica
                    </button>
                    <button onclick="${cb.onRemove}('${posId}')" title="Elimina persiana"
                            style="padding:4px 10px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                        🗑️
                    </button>
                </div>
            </div>
            
            <!-- SEZIONE 1: Dati Principali -->
            <div style="background:#f0f9ff;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#1e40af;margin-bottom:8px;">📋 Dati</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${sel('azienda', p.azienda, PERSIANE_OPZIONI.aziende, 'Azienda')}
                    ${sel('tipo', p.tipo, PERSIANE_OPZIONI.tipi, 'Tipologia')}
                    ${sel('modello', p.modello, PERSIANE_OPZIONI.modelli, 'Modello')}
                    ${sel('apertura', p.apertura, PERSIANE_OPZIONI.aperture, 'Apertura')}
                </div>
            </div>
            
            <!-- SEZIONE 2: Configurazione -->
            <div style="background:#f0fdf4;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#166534;margin-bottom:8px;">⚙️ Configurazione</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${sel('fissaggio', p.fissaggio, PERSIANE_OPZIONI.fissaggi, 'Fissaggio')}
                    ${p.fissaggio === 'telaio' ? sel('tipoTelaio', p.tipoTelaio, PERSIANE_OPZIONI.tipiTelaio, 'Tipo Telaio') : ''}
                    ${sel('battuta', p.battuta, PERSIANE_OPZIONI.battute, 'Battuta')}
                    
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Colore Persiana</label>
                        <input type="text" list="${dlId}" value="${p.colorePersiana || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'colorePersiana', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Cerca colore...">
                        <datalist id="${dlId}">${coloriDatalist}</datalist>
                    </div>
                    
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Colore Telaio</label>
                        <input type="text" value="${p.coloreTelaio || ''}"
                               onchange="${cb.onFieldChange}('${posId}', 'coloreTelaio', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="Colore telaio...">
                    </div>
                </div>
            </div>
            
            <!-- SEZIONE 3: Accessori (Cardini + Fermapersiane) -->
            <div style="background:#fef3c7;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:8px;">🔩 Accessori</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <!-- Cardini -->
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Cardini (Qta)</label>
                        <input type="number" value="${p.accessoriPersiana?.cardini?.qta || 0}" min="0" max="20"
                               onchange="${cb.onFieldChange}('${posId}', 'accessoriPersiana.cardini.qta', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    </div>
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Modello Cardine</label>
                        <select onchange="${cb.onFieldChange}('${posId}', 'accessoriPersiana.cardini.modello', this.value)"
                                style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                            <option value="">--</option>
                            ${cardiniOpts}
                        </select>
                    </div>
                    
                    <!-- Fermapersiane -->
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Fermapersiane (Qta)</label>
                        <input type="number" value="${p.accessoriPersiana?.fermapersiane?.qta || 0}" min="0" max="20"
                               onchange="${cb.onFieldChange}('${posId}', 'accessoriPersiana.fermapersiane.qta', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                    </div>
                    <div style="margin-bottom:6px;">
                        <label style="font-size:12px;font-weight:600;color:#374151;">Modello Fermapersiana</label>
                        <select onchange="${cb.onFieldChange}('${posId}', 'accessoriPersiana.fermapersiane.modello', this.value)"
                                style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
                            <option value="">--</option>
                            ${fermaOpts}
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- SEZIONE 4: BRM + Note -->
            <div style="background:#faf5ff;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="font-weight:700;font-size:13px;color:#7c3aed;margin-bottom:8px;">📐 Misure BRM</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <div>
                        <label style="font-size:12px;font-weight:600;">BRM Larghezza (mm)</label>
                        <input type="number" value="${p.BRM_L || ''}" 
                               onchange="${cb.onFieldChange}('${posId}', 'BRM_L', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="mm">
                    </div>
                    <div>
                        <label style="font-size:12px;font-weight:600;">BRM Altezza (mm)</label>
                        <input type="number" value="${p.BRM_H || ''}" 
                               onchange="${cb.onFieldChange}('${posId}', 'BRM_H', this.value)"
                               style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"
                               placeholder="mm">
                    </div>
                </div>
            </div>
            
            <!-- Note -->
            <div style="margin-bottom:6px;">
                <label style="font-size:12px;font-weight:600;">Note</label>
                <textarea onchange="${cb.onFieldChange}('${posId}', 'note', this.value)"
                          style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;min-height:50px;"
                          placeholder="Note persiana...">${p.note || ''}</textarea>
            </div>
        </div>`;
}


// ============================================================
// CALCOLO PREZZO
// ============================================================

/**
 * Calcola prezzo persiana usando PUNTO_PERSIANE_2025
 * @param {object} pers - oggetto persiana dalla posizione
 * @param {number} totaleCommessaNetto - totale commessa per scaglioni (opzionale)
 * @returns {object} risultato calcolo oppure {errore: '...'}
 */
function calcolaPrezzoPersiana(pers, totaleCommessaNetto = 0) {
    if (typeof PUNTO_PERSIANE_2025 === 'undefined') {
        return { errore: 'PUNTO_PERSIANE_2025 non caricato' };
    }
    
    if (!pers || !pers.tipo || !pers.modello) {
        return { errore: 'Dati persiana incompleti (tipo e modello obbligatori)' };
    }
    
    const L = parseInt(pers.BRM_L) || 0;
    const H = parseInt(pers.BRM_H) || 0;
    
    if (L === 0 || H === 0) {
        return { errore: 'Misure BRM mancanti' };
    }
    
    // Converti nome modello → codice per PUNTO_PERSIANE_2025
    const codiceModello = PERSIANE_OPZIONI.modelloToCodice[pers.modello] || pers.modello.toLowerCase();
    
    // Codice colore (prendi solo il codice prima di ' - ')
    const codiceColore = pers.colorePersiana ? pers.colorePersiana.split(' - ')[0].trim() : null;
    
    // Codice telaio (solo se fissaggio = telaio)
    const codiceTelaio = (pers.fissaggio === 'telaio' && pers.tipoTelaio) ? pers.tipoTelaio : null;
    
    // Calcola con PUNTO_PERSIANE_2025
    const risultato = PUNTO_PERSIANE_2025.calcolaPrezzo(
        pers.tipo,
        codiceModello,
        L, H,
        codiceColore,
        codiceTelaio,
        totaleCommessaNetto
    );
    
    // Aggiungi costo accessori
    if (!risultato.errore) {
        let costoAccessori = 0;
        
        // Cardini
        if (pers.accessoriPersiana?.cardini?.modello && typeof CARDINI_PUNTO_PERSIANE !== 'undefined') {
            const cardine = CARDINI_PUNTO_PERSIANE.find(c => c.codice === pers.accessoriPersiana.cardini.modello);
            if (cardine) {
                costoAccessori += (cardine.prezzo || 0) * (parseInt(pers.accessoriPersiana.cardini.qta) || 0);
            }
        }
        
        // Fermapersiane
        if (pers.accessoriPersiana?.fermapersiane?.modello && typeof FERMAPERSIANE_PUNTO_PERSIANE !== 'undefined') {
            const ferma = FERMAPERSIANE_PUNTO_PERSIANE.find(f => f.codice === pers.accessoriPersiana.fermapersiane.modello);
            if (ferma) {
                costoAccessori += (ferma.prezzo || 0) * (parseInt(pers.accessoriPersiana.fermapersiane.qta) || 0);
            }
        }
        
        risultato.costoAccessori = costoAccessori;
        risultato.prezzoTotaleConAccessori = Math.round((risultato.prezzoNettoFinale + costoAccessori) * 100) / 100;
    }
    
    return risultato;
}


// ============================================================
// EXPORT GLOBALE
// ============================================================

window.PERSIANE_MODULE = {
    // Opzioni
    OPZIONI: PERSIANE_OPZIONI,
    CONFIG_TEMPLATE: PERSIANE_CONFIG_TEMPLATE,
    BRM_CONFIG_TEMPLATE: PERSIANE_BRM_CONFIG_TEMPLATE,
    PRODUCT_TEMPLATE: PERSIANE_PRODUCT_TEMPLATE,
    
    // Funzioni dati
    createFromConfig: createPersianaFromConfig,
    normalizza: normalizzaPersiana,
    autoCalcolaAccessori: autoCalcolaAccessoriPersiana,
    getColoriPerCategoria: getColoriPerCategoria,
    getModelliPerCategoria: getModelliPerCategoria,
    
    // Funzioni render
    renderConfigGlobale: renderConfigPersianeGlobale,
    renderTab: renderPersianaTab,
    renderForm: renderPersianaForm,
    
    // Calcolo prezzo
    calcolaPrezzo: calcolaPrezzoPersiana
};

// Esporta anche le costanti per accesso diretto
window.PERSIANE_OPZIONI = PERSIANE_OPZIONI;

console.log('✅ persiane-module.js v1.0.0 caricato');
console.log('   🪟 Modelli:', PERSIANE_OPZIONI.modelli.length);
console.log('   🔧 Telai:', PERSIANE_OPZIONI.tipiTelaio.length);
console.log('   📦 Categorie:', Object.keys(PERSIANE_OPZIONI.modelliPerCategoria).length);
