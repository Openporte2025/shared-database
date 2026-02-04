// ═══════════════════════════════════════════════════════════════════════════════
// 🦟 PALAGINA MODULE v1.0.2 - Modulo Centralizzato Zanzariere
// Per shared-database - Usato da App Rilievo + Dashboard
// Pattern: identico a persiane-module.js
// Dipendenze: palagina.js (PALAGINA_DATABASE_2025) - per calcolo prezzi
//             opzioni-prodotti.js (OPZIONI_PRODOTTI.zanzariere) - opzionale
// v1.0.2: Fix SyntaxError "already been declared" - usa window.X
// ═══════════════════════════════════════════════════════════════════════════════

// ============================================================
// OPZIONI ZANZARIERE (centralizzate)
// ============================================================
window.PALAGINA_OPZIONI = {
    aziende: ['Palagina'],
    
    linee: ['SINTESI', 'SV', 'EVO', 'COMPATTO'],
    
    // Modelli raggruppati per linea
    modelliPerLinea: {
        'SINTESI': [
            'EXTREMA', 'EXTREMA_CENTRALE', 'EXTREMA_SR',
            'EXTREMA_INCASSO', 'EXTREMA_INCASSO_CENTRALE', 'EXTREMA_INCASSO_SR',
            'NANO_SINTESI', 'MICRO_SINTESI', 'MICRO_SINTESI_CENTRALE',
            'SINTESI', 'SINTESI_CENTRALE', 'SINTESI_INCASSO', 'SINTESI_INCASSO_CENTRALE'
        ],
        'SV':       ['SV_700'],
        'EVO':      ['EVO_ROOF'],
        'COMPATTO': ['X1_INCASSO', 'X3_LUCE']
    },
    
    // Lista piatta per dropdown
    modelli: [
        'EXTREMA', 'EXTREMA_CENTRALE', 'EXTREMA_SR',
        'EXTREMA_INCASSO', 'EXTREMA_INCASSO_CENTRALE', 'EXTREMA_INCASSO_SR',
        'NANO_SINTESI', 'MICRO_SINTESI', 'MICRO_SINTESI_CENTRALE',
        'SINTESI', 'SINTESI_CENTRALE', 'SINTESI_INCASSO', 'SINTESI_INCASSO_CENTRALE',
        'SV_700', 'EVO_ROOF',
        'X1_INCASSO', 'X3_LUCE'
    ],
    
    fasce: ['F1', 'F2', 'F3'],
    
    tipiRete: ['STD', 'HC', 'FV', 'AB', 'AT', 'SOL'],
    
    // Nomi rete per display
    nomiRete: {
        'STD': 'Standard PP',
        'HC':  'HC Alto Contrasto',
        'FV':  'Fibra vetro grigia',
        'AB':  'Anti-batterica',
        'AT':  'Alta trasparenza (+€5/mq)',
        'SOL': 'Solar 0,35 (+€9.50/mq)'
    },
    
    coloriPlastica: ['BI', 'AV', 'MA', 'NE', 'BR', 'GR'],
    
    nomiColoriPlastica: {
        'BI': 'Bianco', 'AV': 'Avorio', 'MA': 'Marrone',
        'NE': 'Nero', 'BR': 'Bronzo', 'GR': 'Grigio'
    },
    
    // Accessori disponibili
    accessori: [
        { id: 'GUIDA_PVC',       nome: 'Guida PVC pendenza 8°',      prezzo: 0 },
        { id: 'QUICK_LOCK',      nome: 'Sgancio Quick-Lock',          prezzo: 18.00 },
        { id: 'SGANCIO_CRIC',    nome: 'Sgancio cricchetto',          prezzo: 20.50 },
        { id: 'CARRO_FLUO',      nome: 'Carro Fluo',                  prezzo: 25.00 },
        { id: 'MANIGLIA_TESS',   nome: 'Maniglia tessile',            prezzo: 7.50 },
        { id: 'DOPPIA_MANIGLIA', nome: 'Doppia maniglia int/est',     prezzo: 9.00 },
        { id: 'GUIDA_ALU',       nome: 'Guida alluminio',             prezzo: 10.50 },
        { id: 'TUBO_MAGNUM',     nome: 'Tubo Magnum Ø28 (cass.50)',   prezzo: 18.00 },
        { id: 'KIT_REGGI',       nome: 'Kit Reggi Guide Pala-System', prezzo: 3.50 },
        { id: 'BARRA_EXTRA',     nome: 'Barramaniglia Extra Forte',   prezzo: 4.50 }
    ]
};


// ============================================================
// TEMPLATE CONFIG GLOBALE (configZanzariere)
// ============================================================
window.PALAGINA_CONFIG_TEMPLATE = {
    azienda: 'Palagina',
    linea: '',
    modello: '',
    fascia: '',
    colore: '',
    tipoRete: 'STD',
    colorePlastica: '',
    accessori: []
};

// ============================================================
// TEMPLATE BRM CONFIG ZANZARIERE (brmConfigZanzariere)
// ============================================================
window.PALAGINA_BRM_CONFIG_TEMPLATE = {
    misuraBaseL: '',
    operazioneL: '',
    valoreL: '',
    misuraBaseH: '',
    operazioneH: '',
    valoreH: '',
    note: ''
};

// ============================================================
// TEMPLATE PRODOTTO ZANZARIERA (pos.zanzariera)
// ============================================================
window.PALAGINA_PRODUCT_TEMPLATE = {
    id: '',
    qta: '1',
    azienda: 'Palagina',
    linea: '',
    modello: '',
    fascia: '',
    colore: '',
    tipoRete: 'STD',
    colorePlastica: '',
    accessori: [],
    BRM_L: 0,
    BRM_H: 0,
    note: '',
    foto: []
};


// ============================================================
// FUNZIONI DATI
// ============================================================

/**
 * Crea zanzariera da configZanzariere globale con calcolo BRM
 */
function createZanzarieraFromConfig(configZanzariere, brmConfigZanzariere, misure, posIndex) {
    var zanz = JSON.parse(JSON.stringify(PALAGINA_PRODUCT_TEMPLATE));
    zanz.id = 'zanz-' + (posIndex || 1);
    
    // Copia campi da config globale
    if (configZanzariere) {
        zanz.azienda = configZanzariere.azienda || 'Palagina';
        zanz.linea = configZanzariere.linea || '';
        zanz.modello = configZanzariere.modello || '';
        zanz.fascia = configZanzariere.fascia || '';
        zanz.colore = configZanzariere.colore || '';
        zanz.tipoRete = configZanzariere.tipoRete || 'STD';
        zanz.colorePlastica = configZanzariere.colorePlastica || '';
        zanz.accessori = (configZanzariere.accessori || []).slice();
    }
    
    // Calcola BRM se configurato
    if (brmConfigZanzariere && misure) {
        zanz.BRM_L = calcolaBRM_Zanzariera(brmConfigZanzariere, misure, 'L');
        zanz.BRM_H = calcolaBRM_Zanzariera(brmConfigZanzariere, misure, 'H');
    }
    
    return zanz;
}

/**
 * Calcolo BRM per dimensione L o H
 */
function calcolaBRM_Zanzariera(brmConfig, misure, dim) {
    var base = brmConfig['misuraBase' + dim];
    var op = brmConfig['operazione' + dim];
    var val = brmConfig['valore' + dim];
    
    if (!base || !misure[base]) return 0;
    
    var misuraBase = parseFloat(misure[base]) || 0;
    var valore = parseFloat(val) || 0;
    
    switch (op) {
        case '+': return misuraBase + valore;
        case '-': return misuraBase - valore;
        case '=': return valore || misuraBase;
        default: return misuraBase;
    }
}

/**
 * Normalizza zanzariera per export (pulisce campi vuoti/null)
 */
function normalizzaZanzariera(zanz) {
    if (!zanz) return null;
    
    return {
        id: zanz.id || '',
        qta: zanz.qta || '1',
        azienda: zanz.azienda || 'Palagina',
        linea: zanz.linea || '',
        modello: zanz.modello || '',
        fascia: zanz.fascia || '',
        colore: zanz.colore || '',
        tipoRete: zanz.tipoRete || 'STD',
        colorePlastica: zanz.colorePlastica || '',
        accessori: zanz.accessori || [],
        BRM_L: parseInt(zanz.BRM_L) || 0,
        BRM_H: parseInt(zanz.BRM_H) || 0,
        note: zanz.note || '',
        foto: zanz.foto || []
    };
}

/**
 * Ottieni modelli filtrati per linea
 */
function getModelliPerLinea(linea) {
    return PALAGINA_OPZIONI.modelliPerLinea[linea] || [];
}

/**
 * Ottieni colori per fascia dal database
 */
function getColoriPerFascia(fascia) {
    if (typeof PALAGINA_DATABASE_2025 === 'undefined') return [];
    var colori = PALAGINA_DATABASE_2025.comune.colori[fascia];
    return colori ? colori.map(function(c) {
        return c.cod + ' - ' + c.nome + (c.ral ? ' (' + c.ral + ')' : '');
    }) : [];
}

/**
 * Determina fascia da codice colore
 */
function getFasciaByColore(codColore) {
    if (typeof getFasciaByColorePalagina === 'function') {
        return getFasciaByColorePalagina(codColore);
    }
    return null;
}


// ============================================================
// FUNZIONI RENDER
// ============================================================

/**
 * Render Config Globale Zanzariere (per Wizard Step)
 * @param {object} config - configZanzariere corrente
 * @param {object} brmConfig - brmConfigZanzariere corrente
 * @param {function} onUpdate - callback string es. "updateConfigZanzariere"
 * @param {function} onBrmUpdate - callback string es. "updateBrmConfigZanzariere"
 */
function renderConfigZanzariereGlobale(config, brmConfig, onUpdate, onBrmUpdate) {
    var cfg = config || {};
    var brm = brmConfig || {};
    
    // Helper per select
    var sel = function(campo, valore, opzioni, label, labelFn) {
        var opts = opzioni.map(function(o) {
            var display = labelFn ? labelFn(o) : o;
            return '<option value="' + o + '" ' + (valore === o ? 'selected' : '') + '>' + display + '</option>';
        }).join('');
        return '<div class="form-group" style="margin-bottom:8px;">' +
            '<label style="font-weight:600;font-size:13px;">' + label + '</label>' +
            '<select onchange="' + onUpdate + '(\'' + campo + '\', this.value)" ' +
            'style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">' +
            '<option value="">-- Seleziona --</option>' + opts + '</select></div>';
    };
    
    // Modelli filtrati per linea selezionata
    var modelliDisponibili = cfg.linea ? getModelliPerLinea(cfg.linea) : PALAGINA_OPZIONI.modelli;
    
    // Colori filtrati per fascia selezionata
    var coloriDisponibili = cfg.fascia ? getColoriPerFascia(cfg.fascia) : [];
    var coloriDatalist = coloriDisponibili.map(function(c) { return '<option value="' + c + '">'; }).join('');
    
    // Accessori checkboxes
    var accessoriHtml = PALAGINA_OPZIONI.accessori.map(function(acc) {
        var checked = (cfg.accessori || []).indexOf(acc.id) >= 0 ? 'checked' : '';
        return '<label style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px;cursor:pointer;">' +
            '<input type="checkbox" ' + checked + ' onchange="' + onUpdate + '(\'accessori_toggle\', \'' + acc.id + '\')">' +
            acc.nome + (acc.prezzo > 0 ? ' (+€' + acc.prezzo.toFixed(2) + ')' : ' (incluso)') + '</label>';
    }).join('');
    
    return '<div style="padding:12px;">' +
        '<h3 style="margin:0 0 12px;font-size:16px;">🦟 Configurazione Globale Zanzariere</h3>' +
        
        sel('azienda', cfg.azienda, PALAGINA_OPZIONI.aziende, 'Azienda') +
        sel('linea', cfg.linea, PALAGINA_OPZIONI.linee, 'Linea') +
        sel('modello', cfg.modello, modelliDisponibili, 'Modello', function(m) { return m.replace(/_/g, ' '); }) +
        sel('fascia', cfg.fascia, PALAGINA_OPZIONI.fasce, 'Fascia Colore') +
        
        '<div class="form-group" style="margin-bottom:8px;">' +
            '<label style="font-weight:600;font-size:13px;">Colore</label>' +
            '<input type="text" list="coloriZanzDl" value="' + (cfg.colore || '') + '" ' +
            'onchange="' + onUpdate + '(\'colore\', this.value)" ' +
            'style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;" ' +
            'placeholder="Cerca colore...">' +
            '<datalist id="coloriZanzDl">' + coloriDatalist + '</datalist></div>' +
        
        sel('tipoRete', cfg.tipoRete, PALAGINA_OPZIONI.tipiRete, 'Tipo Rete', function(r) {
            return PALAGINA_OPZIONI.nomiRete[r] || r;
        }) +
        sel('colorePlastica', cfg.colorePlastica, PALAGINA_OPZIONI.coloriPlastica, 'Colore Plastica', function(c) {
            return c + ' - ' + (PALAGINA_OPZIONI.nomiColoriPlastica[c] || c);
        }) +
        
        '<div style="margin-bottom:8px;">' +
            '<label style="font-weight:600;font-size:13px;">Accessori</label>' +
            '<div style="background:#f9fafb;padding:8px;border-radius:6px;border:1px solid #e5e7eb;">' +
            accessoriHtml + '</div></div>' +
        
        '<hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;">' +
        '<h4 style="margin:0 0 8px;font-size:14px;">📐 BRM Zanzariere</h4>' +
        renderBrmConfigZanzariere(brm, onBrmUpdate) +
    '</div>';
}

/**
 * Render BRM Config
 */
function renderBrmConfigZanzariere(brm, onBrmUpdate) {
    var misureOptions = ['', 'LS', 'HS', 'LI', 'HI', 'LF', 'HF', 'LVT', 'HVT'];
    var opOptions = ['', '+', '-', '='];
    
    var selBrm = function(campo, valore, opzioni) {
        var opts = opzioni.map(function(o) {
            return '<option value="' + o + '" ' + (valore === o ? 'selected' : '') + '>' + (o || '--') + '</option>';
        }).join('');
        return '<select onchange="' + onBrmUpdate + '(\'' + campo + '\', this.value)" ' +
            'style="padding:6px;border:1px solid #ddd;border-radius:4px;">' + opts + '</select>';
    };
    
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<div>' +
            '<label style="font-size:12px;font-weight:600;">BRM Larghezza</label>' +
            '<div style="display:flex;gap:4px;align-items:center;">' +
            selBrm('misuraBaseL', brm.misuraBaseL || '', misureOptions) +
            selBrm('operazioneL', brm.operazioneL || '', opOptions) +
            '<input type="number" value="' + (brm.valoreL || '') + '" ' +
            'onchange="' + onBrmUpdate + '(\'valoreL\', this.value)" ' +
            'style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;" placeholder="mm">' +
            '</div></div>' +
        '<div>' +
            '<label style="font-size:12px;font-weight:600;">BRM Altezza</label>' +
            '<div style="display:flex;gap:4px;align-items:center;">' +
            selBrm('misuraBaseH', brm.misuraBaseH || '', misureOptions) +
            selBrm('operazioneH', brm.operazioneH || '', opOptions) +
            '<input type="number" value="' + (brm.valoreH || '') + '" ' +
            'onchange="' + onBrmUpdate + '(\'valoreH\', this.value)" ' +
            'style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;" placeholder="mm">' +
            '</div></div></div>' +
        '<div style="margin-top:8px;">' +
            '<label style="font-size:12px;font-weight:600;">Note BRM</label>' +
            '<input type="text" value="' + (brm.note || '') + '" ' +
            'onchange="' + onBrmUpdate + '(\'note\', this.value)" ' +
            'style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;" ' +
            'placeholder="Note calcolo BRM..."></div>';
}


/**
 * Render Tab Zanzariera nella posizione
 * 3 stati: vuoto (null), qta=0 (non serve), form completo
 * @param {object} zanz - pos.zanzariera (può essere null)
 * @param {string} posId - ID posizione
 * @param {object} configZanzariere - config globale
 * @param {object} callbacks - {onAdd, onRemove, onUpdate, onReload, onFieldChange}
 */
function renderZanzarieraTab(zanz, posId, configZanzariere, callbacks) {
    // STATO 1: Non inizializzata (null)
    if (!zanz) {
        return '<div style="text-align:center;padding:40px 20px;color:#6b7280;">' +
            '<div style="font-size:40px;margin-bottom:12px;">🦟</div>' +
            '<p style="margin:0 0 16px;font-size:14px;">Nessuna zanzariera configurata</p>' +
            '<button onclick="' + callbacks.onAdd + '(\'' + posId + '\')" ' +
            'style="padding:10px 24px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">' +
            '➕ Aggiungi Zanzariera</button></div>';
    }
    
    // STATO 2: qta = 0 (non serve)
    var qta = parseInt(zanz.qta) || 0;
    if (qta === 0) {
        var qtaOpts = [0,1,2,3,4,5].map(function(n) {
            return '<option value="' + n + '" ' + (qta === n ? 'selected' : '') + '>' + n + '</option>';
        }).join('');
        return '<div style="text-align:center;padding:40px 20px;color:#6b7280;">' +
            '<div style="font-size:40px;margin-bottom:12px;">🦟</div>' +
            '<p style="margin:0 0 8px;font-size:14px;">Zanzariera: <strong>Quantità 0</strong></p>' +
            '<p style="margin:0 0 16px;font-size:12px;color:#9ca3af;">Imposta quantità > 0 per configurare</p>' +
            '<div style="display:flex;gap:8px;justify-content:center;">' +
            '<select onchange="' + callbacks.onFieldChange + '(\'' + posId + '\', \'qta\', this.value)" ' +
            'style="padding:8px;border:1px solid #ddd;border-radius:6px;">' + qtaOpts + '</select>' +
            '<button onclick="' + callbacks.onRemove + '(\'' + posId + '\')" ' +
            'style="padding:8px 16px;background:#ef4444;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">' +
            '🗑️ Elimina</button></div></div>';
    }
    
    // STATO 3: Form completo
    return renderZanzarieraForm(zanz, posId, configZanzariere, callbacks);
}


/**
 * Render Form dettagliato Zanzariera
 */
function renderZanzarieraForm(zanz, posId, configZanzariere, callbacks) {
    var z = zanz || {};
    var cb = callbacks || {};
    
    // Helper select inline
    var sel = function(campo, valore, opzioni, label, labelFn) {
        var opts = opzioni.map(function(o) {
            var display = labelFn ? labelFn(o) : o;
            return '<option value="' + o + '" ' + (valore === o ? 'selected' : '') + '>' + display + '</option>';
        }).join('');
        return '<div style="margin-bottom:6px;">' +
            '<label style="font-size:12px;font-weight:600;color:#374151;">' + label + '</label>' +
            '<select onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'' + campo + '\', this.value)" ' +
            'style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">' +
            '<option value="">--</option>' + opts + '</select></div>';
    };
    
    // Modelli filtrati per linea
    var modelliDisponibili = z.linea ? getModelliPerLinea(z.linea) : PALAGINA_OPZIONI.modelli;
    
    // Colori filtrati per fascia
    var coloriDisponibili = z.fascia ? getColoriPerFascia(z.fascia) : [];
    var dlId = 'colZanz_' + posId;
    var coloriDatalist = coloriDisponibili.map(function(c) { return '<option value="' + c + '">'; }).join('');
    
    // Qta options
    var qtaOpts = [0,1,2,3,4,5,6,7,8,9,10].map(function(n) {
        return '<option value="' + n + '" ' + (parseInt(z.qta) === n ? 'selected' : '') + '>' + n + '</option>';
    }).join('');
    
    // Accessori checkboxes
    var accessoriSelezionati = z.accessori || [];
    var accessoriHtml = PALAGINA_OPZIONI.accessori.map(function(acc) {
        var checked = accessoriSelezionati.indexOf(acc.id) >= 0 ? 'checked' : '';
        return '<label style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:3px;cursor:pointer;">' +
            '<input type="checkbox" ' + checked + ' onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'accessori_toggle\', \'' + acc.id + '\')">' +
            acc.nome + (acc.prezzo > 0 ? ' (+€' + acc.prezzo.toFixed(2) + ')' : '') + '</label>';
    }).join('');
    
    return '<div style="padding:8px;">' +
        // HEADER: Qta + Azioni
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
                '<span style="font-weight:700;font-size:15px;">🦟 Zanzariera</span>' +
                '<label style="font-size:12px;">Qta:</label>' +
                '<select onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'qta\', this.value)" ' +
                'style="padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;">' + qtaOpts + '</select>' +
            '</div>' +
            '<div style="display:flex;gap:6px;">' +
                '<button onclick="' + cb.onReload + '(\'' + posId + '\')" title="Ricarica da Config Globale" ' +
                'style="padding:4px 10px;background:#f59e0b;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">' +
                '🔄 Ricarica</button>' +
                '<button onclick="' + cb.onRemove + '(\'' + posId + '\')" title="Elimina zanzariera" ' +
                'style="padding:4px 10px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">' +
                '🗑️</button>' +
            '</div>' +
        '</div>' +
        
        // SEZIONE 1: Dati Principali
        '<div style="background:#f0f9ff;padding:10px;border-radius:8px;margin-bottom:10px;">' +
            '<div style="font-weight:700;font-size:13px;color:#1e40af;margin-bottom:8px;">📋 Dati</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
                sel('azienda', z.azienda, PALAGINA_OPZIONI.aziende, 'Azienda') +
                sel('linea', z.linea, PALAGINA_OPZIONI.linee, 'Linea') +
                sel('modello', z.modello, modelliDisponibili, 'Modello', function(m) { return m.replace(/_/g, ' '); }) +
                sel('fascia', z.fascia, PALAGINA_OPZIONI.fasce, 'Fascia Colore') +
            '</div>' +
        '</div>' +
        
        // SEZIONE 2: Configurazione
        '<div style="background:#f0fdf4;padding:10px;border-radius:8px;margin-bottom:10px;">' +
            '<div style="font-weight:700;font-size:13px;color:#166534;margin-bottom:8px;">⚙️ Configurazione</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
                '<div style="margin-bottom:6px;">' +
                    '<label style="font-size:12px;font-weight:600;color:#374151;">Colore</label>' +
                    '<input type="text" list="' + dlId + '" value="' + (z.colore || '') + '" ' +
                    'onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'colore\', this.value)" ' +
                    'style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;" ' +
                    'placeholder="Cerca colore...">' +
                    '<datalist id="' + dlId + '">' + coloriDatalist + '</datalist></div>' +
                sel('tipoRete', z.tipoRete, PALAGINA_OPZIONI.tipiRete, 'Tipo Rete', function(r) {
                    return PALAGINA_OPZIONI.nomiRete[r] || r;
                }) +
                sel('colorePlastica', z.colorePlastica, PALAGINA_OPZIONI.coloriPlastica, 'Colore Plastica', function(c) {
                    return c + ' - ' + (PALAGINA_OPZIONI.nomiColoriPlastica[c] || c);
                }) +
            '</div>' +
        '</div>' +
        
        // SEZIONE 3: Accessori
        '<div style="background:#fef3c7;padding:10px;border-radius:8px;margin-bottom:10px;">' +
            '<div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:8px;">🔩 Accessori</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">' + accessoriHtml + '</div>' +
        '</div>' +
        
        // SEZIONE 4: BRM + Note
        '<div style="background:#faf5ff;padding:10px;border-radius:8px;margin-bottom:10px;">' +
            '<div style="font-weight:700;font-size:13px;color:#7c3aed;margin-bottom:8px;">📐 Misure BRM</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
                '<div>' +
                    '<label style="font-size:12px;font-weight:600;">BRM Larghezza (mm)</label>' +
                    '<input type="number" value="' + (z.BRM_L || '') + '" ' +
                    'onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'BRM_L\', this.value)" ' +
                    'style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;" placeholder="mm">' +
                '</div>' +
                '<div>' +
                    '<label style="font-size:12px;font-weight:600;">BRM Altezza (mm)</label>' +
                    '<input type="number" value="' + (z.BRM_H || '') + '" ' +
                    'onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'BRM_H\', this.value)" ' +
                    'style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;" placeholder="mm">' +
                '</div>' +
            '</div>' +
        '</div>' +
        
        // Note
        '<div style="margin-bottom:6px;">' +
            '<label style="font-size:12px;font-weight:600;">Note</label>' +
            '<textarea onchange="' + cb.onFieldChange + '(\'' + posId + '\', \'note\', this.value)" ' +
            'style="width:100%;padding:7px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;min-height:50px;" ' +
            'placeholder="Note zanzariera...">' + (z.note || '') + '</textarea></div>' +
    '</div>';
}


// ============================================================
// CALCOLO PREZZO
// ============================================================

/**
 * Calcola prezzo zanzariera usando PALAGINA_DATABASE_2025
 * @param {object} zanz - oggetto zanzariera dalla posizione
 * @returns {object} risultato calcolo oppure {errore: '...'}
 */
function calcolaPrezzoZanzariera(zanz) {
    if (typeof PALAGINA_DATABASE_2025 === 'undefined' || typeof calcolaPrezzoPalagina !== 'function') {
        return { errore: 'PALAGINA_DATABASE_2025 non caricato' };
    }
    
    if (!zanz || !zanz.modello) {
        return { errore: 'Dati zanzariera incompleti (modello obbligatorio)' };
    }
    
    var L = parseInt(zanz.BRM_L) || 0;
    var H = parseInt(zanz.BRM_H) || 0;
    
    if (L === 0 || H === 0) {
        return { errore: 'Misure BRM mancanti' };
    }
    
    // BRM è in mm, calcolaPrezzoPalagina vuole cm
    var Lcm = Math.round(L / 10);
    var Hcm = Math.round(H / 10);
    
    // Determina fascia
    var fascia = zanz.fascia;
    if (!fascia && zanz.colore) {
        var codColore = zanz.colore.split(' - ')[0].trim();
        fascia = getFasciaByColore(codColore);
    }
    
    if (!fascia) {
        return { errore: 'Fascia colore non determinata' };
    }
    
    // Chiama funzione esterna del database
    var risultato = calcolaPrezzoPalagina(
        zanz.modello,
        Lcm, Hcm,
        fascia,
        zanz.tipoRete || 'STD',
        zanz.accessori || []
    );
    
    return risultato;
}


// ============================================================
// EXPORT GLOBALE
// ============================================================

window.PALAGINA_MODULE = {
    // Opzioni
    OPZIONI: PALAGINA_OPZIONI,
    CONFIG_TEMPLATE: PALAGINA_CONFIG_TEMPLATE,
    BRM_CONFIG_TEMPLATE: PALAGINA_BRM_CONFIG_TEMPLATE,
    PRODUCT_TEMPLATE: PALAGINA_PRODUCT_TEMPLATE,
    
    // Funzioni dati
    createFromConfig: createZanzarieraFromConfig,
    normalizza: normalizzaZanzariera,
    getModelliPerLinea: getModelliPerLinea,
    getColoriPerFascia: getColoriPerFascia,
    getFasciaByColore: getFasciaByColore,
    
    // Funzioni render
    renderConfigGlobale: renderConfigZanzariereGlobale,
    renderTab: renderZanzarieraTab,
    renderForm: renderZanzarieraForm,
    
    // Calcolo prezzo
    calcolaPrezzo: calcolaPrezzoZanzariera
};

// Esporta anche le costanti per accesso diretto
window.PALAGINA_OPZIONI = PALAGINA_OPZIONI;

console.log('✅ palagina-module.js v1.0.1 caricato');
console.log('   🦟 Modelli:', PALAGINA_OPZIONI.modelli.length);
console.log('   🎨 Linee:', PALAGINA_OPZIONI.linee.length);
console.log('   🔩 Accessori:', PALAGINA_OPZIONI.accessori.length);
