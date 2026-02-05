/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 RENDER CONFIG CAMPI - Renderer generico config globale da CAMPI_PRODOTTI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * v1.0.0 (05/02/2026): Creazione iniziale
 * 
 * SCOPO: Genera HTML config globale leggendo da CAMPI_PRODOTTI
 *        Riusa renderSelectWithCustom e altri helper esistenti dell'app rilievo
 * 
 * DIPENDENZE: campi-prodotti.js, renderSelectWithCustom(), render()
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Render generico campi config globale per un prodotto.
 * Genera HTML per tutti i campi non-speciali (esclude gruppi custom).
 * 
 * @param {Object} project - Progetto corrente
 * @param {string} productName - es. 'persiana', 'tapparella'
 * @param {Object} opts - Opzioni
 * @param {string[]} opts.excludeGroups - Gruppi da escludere (renderizzati manualmente)
 * @param {string[]} opts.excludeKeys - Campi specifici da escludere
 * @param {number} opts.cols - Colonne griglia (default 2)
 * @param {boolean} opts.startNumbering - Numerazione automatica (default true)
 * @param {number} opts.startFrom - Numero iniziale (default 1)
 * @returns {string} HTML
 */
function renderConfigGlobaleFromCampi(project, productName, opts = {}) {
    if (typeof CAMPI_PRODOTTI === 'undefined' || !CAMPI_PRODOTTI[productName]) {
        console.warn(`⚠️ renderConfigGlobaleFromCampi: CAMPI_PRODOTTI.${productName} non trovato`);
        return '';
    }

    const def = CAMPI_PRODOTTI[productName];
    const configData = project[def.configKey] || {};
    const productType = def.productKey;  // per renderSelectWithCustom
    const campos = def.configGlobale;

    const excludeGroups = new Set(opts.excludeGroups || []);
    const excludeKeys = new Set(opts.excludeKeys || []);
    const cols = opts.cols || 2;
    const startNumbering = opts.startNumbering !== false;
    let fieldNum = opts.startFrom || 1;

    let html = '';
    let inGrid = false;  // tracking grid open/close
    let gridCount = 0;   // fields in current grid row

    for (const campo of campos) {
        // Skip esclusi
        if (excludeKeys.has(campo.key)) continue;
        if (campo.group && excludeGroups.has(campo.group)) continue;

        // Check visibilità
        if (!CAMPI_PRODOTTI.isVisible(campo, configData)) continue;

        const value = configData[campo.key] || '';
        const label = startNumbering ? `${fieldNum}. ${campo.label}` : campo.label;

        // Genera HTML per questo campo
        let fieldHtml = '';

        // Determina se ha bisogno di un wrapper con visibility condizionale live
        const needsVisibilityWrapper = campo.visibleIf && _isLiveVisibility(campo);
        const wrapperId = needsVisibilityWrapper ? 
            `campi-${productType}-${campo.key}-${project.id}` : null;

        if (campo.type === 'select' && campo.allowCustom) {
            // Usa renderSelectWithCustom esistente
            const options = _getOptionsArray(campo, configData);
            fieldHtml = renderSelectWithCustom(
                campo.key, value, options,
                project.id, null, productType, label
            );
        } else if (campo.type === 'select-dynamic' && campo.customGetter) {
            // Campi con getter custom (es. colori per finitura, telai per progetto)
            // Usa renderSelectWithCustom con opzioni dal getter
            const options = _getOptionsFromGetter(campo, project, configData);
            if (campo.allowCustom !== false) {
                fieldHtml = renderSelectWithCustom(
                    campo.key, value, options,
                    project.id, null, productType, label
                );
            } else {
                fieldHtml = _renderSimpleSelect(campo, value, options, project.id, productType, label);
            }
        } else if (campo.type === 'select-dynamic' && campo.optionsFn) {
            // Opzioni dinamiche con funzione
            const depVal = typeof campo.dependsOn === 'string'
                ? configData[campo.dependsOn]
                : (Array.isArray(campo.dependsOn) ? campo.dependsOn.map(d => configData[d]) : null);
            const options = campo.optionsFn(depVal) || [];
            if (campo.allowCustom) {
                fieldHtml = renderSelectWithCustom(
                    campo.key, value, options,
                    project.id, null, productType, label
                );
            } else {
                fieldHtml = _renderSimpleSelect(campo, value, options, project.id, productType, label);
            }
        } else if (campo.type === 'select') {
            // Select semplice senza custom
            const options = _getOptionsArray(campo, configData);
            fieldHtml = _renderSimpleSelect(campo, value, options, project.id, productType, label);
        } else if (campo.type === 'checkbox') {
            fieldHtml = _renderCheckbox(campo, value, project.id, productType, label);
        } else if (campo.type === 'text') {
            fieldHtml = _renderTextInput(campo, value, project.id, productType, label);
        } else if (campo.type === 'number') {
            fieldHtml = _renderNumberInput(campo, value, project.id, productType, label);
        } else if (campo.type === 'textarea') {
            fieldHtml = _renderTextarea(campo, value, project.id, productType, label);
        }

        // Wrapping con visibility condizionale
        if (needsVisibilityWrapper) {
            const visible = CAMPI_PRODOTTI.isVisible(campo, configData);
            fieldHtml = `<div id="${wrapperId}" style="display: ${visible ? 'block' : 'none'}">${fieldHtml}</div>`;
        }

        // Grid management: apri/chiudi griglia
        if (!inGrid && fieldHtml) {
            html += `<div class="grid md:grid-cols-${cols} gap-2">`;
            inGrid = true;
            gridCount = 0;
        }

        html += fieldHtml;
        gridCount++;
        fieldNum++;

        // Chiudi griglia ogni N colonne per mantenere layout pulito
        if (inGrid && gridCount >= cols) {
            html += `</div><div class="grid md:grid-cols-${cols} gap-2">`;
            gridCount = 0;
        }
    }

    // Chiudi griglia se aperta
    if (inGrid) {
        html += `</div>`;
    }

    return html;
}

// ─── Helper: determina se la visibilità è "live" (cambia con interazione) ─────
function _isLiveVisibility(campo) {
    if (!campo.visibleIf) return false;
    const v = campo.visibleIf;
    // Campi che dipendono da altri campi nella stessa form
    return v.field && (v.equals !== undefined || v.notEquals !== undefined || 
           v.equalsLower !== undefined || v.notEmpty !== undefined || v.containsLower !== undefined);
}

// ─── Helper: ottieni array di opzioni da un campo ────────────────────────────
function _getOptionsArray(campo, configData) {
    if (!campo.options) return [];
    const raw = typeof campo.options === 'function' ? campo.options() : campo.options;
    // Se sono oggetti {value, label}, estraiamo solo value per renderSelectWithCustom
    return raw.map(o => {
        if (typeof o === 'object' && o !== null && o.value !== undefined) {
            return o.value;
        }
        return o;
    });
}

// ─── Helper: opzioni da getter custom ────────────────────────────────────────
function _getOptionsFromGetter(campo, project, configData) {
    const getter = campo.customGetter;
    
    // Mapping getter noti → funzioni globali dell'app
    switch (getter) {
        case 'getTelaiPerProgetto':
            return typeof getTelaiPerProgetto === 'function' ? getTelaiPerProgetto(project) : [];
        case 'getAntaTwinModelli':
            if (typeof FINSTRAL_ANTA_TWIN !== 'undefined') {
                return Object.entries(FINSTRAL_ANTA_TWIN.tipiAnta).map(([k,v]) => `${v.cod} - ${v.desc}`);
            }
            return [];
        case 'getAntaTwinColori': {
            if (typeof FINSTRAL_ANTA_TWIN === 'undefined') return [];
            const tipo = configData.antaTwinTipo;
            const colori = tipo === 'veneziana' ? FINSTRAL_ANTA_TWIN.coloriVeneziana :
                           tipo === 'plissettata' ? FINSTRAL_ANTA_TWIN.coloriPlissettata : {};
            return Object.entries(colori).map(([cod, info]) => `${cod} - ${info.nome}`);
        }
        case 'getAntaTwinComandi':
            if (typeof FINSTRAL_ANTA_TWIN !== 'undefined') {
                return Object.entries(FINSTRAL_ANTA_TWIN.comandi).map(([cod, info]) => 
                    `${cod}${info.supplemento > 0 ? ' (+€' + info.supplemento + ')' : ''}`);
            }
            return [];
        case 'getColoriPersiane':
            return typeof COLORI_PERSIANE !== 'undefined' ? COLORI_PERSIANE : [];
        case 'getPalaginaLinee':
            if (typeof PALAGINA_ZANZARIERE !== 'undefined') {
                return Object.entries(PALAGINA_ZANZARIERE.linee).map(([id, l]) => id);
            }
            return [];
        case 'getPalaginaModelli': {
            if (typeof PALAGINA_ZANZARIERE === 'undefined') return [];
            const linea = configData[campo.dependsOn] || '';
            return (PALAGINA_ZANZARIERE.modelli[linea] || []).map(m => m.id);
        }
        case 'getPalaginaColori': {
            if (typeof PALAGINA_ZANZARIERE === 'undefined') return [];
            const fascia = configData.fasciaColore || '';
            return (PALAGINA_ZANZARIERE.colori[fascia] || []).map(c => c.nome);
        }
        case 'getPalaginaReti':
            return typeof PALAGINA_ZANZARIERE !== 'undefined' ? 
                PALAGINA_ZANZARIERE.reti.map(r => r.id) : [];
        case 'getPalaginaColoriPlastica':
            return typeof PALAGINA_ZANZARIERE !== 'undefined' ? 
                PALAGINA_ZANZARIERE.coloriPlastica : [];
        default:
            console.warn(`⚠️ renderConfigCampi: getter sconosciuto "${getter}"`);
            return [];
    }
}

// ─── Renderer: Select semplice (senza custom input) ─────────────────────────
function _renderSimpleSelect(campo, value, options, projectId, productType, label) {
    const isEmpty = !value || value === '';
    const updateFn = _getUpdateFnName(productType);
    const renderNeeded = campo.visibleIf ? '; render();' : '';
    
    // Normalizza opzioni: possono essere stringhe o {value, label}
    const normalizedOpts = options.map(o => {
        if (typeof o === 'object' && o !== null && o.value !== undefined) {
            return { value: o.value, label: o.label };
        }
        return { value: o, label: String(o) };
    });

    return `
        <div class="mb-2">
            ${label ? `<label class="block text-base font-bold mb-1 text-gray-800">${label}</label>` : ''}
            <select class="w-full px-3 py-2.5 border-2 rounded-lg text-base font-medium ${isEmpty ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-white'}"
                    onchange="${updateFn}('${projectId}', '${campo.key}', this.value)${renderNeeded}">
                <option value="">▼ Seleziona...</option>
                ${normalizedOpts.map(o => `
                    <option value="${o.value}" ${String(value) === String(o.value) ? 'selected' : ''}>${o.label}</option>
                `).join('')}
            </select>
        </div>
    `;
}

// ─── Renderer: Checkbox ─────────────────────────────────────────────────────
function _renderCheckbox(campo, value, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    const checked = value === true || value === 'true';
    const renderNeeded = campo.visibleIf || campo.group === 'cosa-serve' ? '; render();' : '';
    
    return `
        <label class="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border-2 ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} hover:border-blue-400 transition-all mb-2">
            <input type="checkbox" 
                   ${checked ? 'checked' : ''}
                   onchange="${updateFn}('${projectId}', '${campo.key}', this.checked)${renderNeeded}"
                   class="w-5 h-5 accent-blue-600">
            <span class="font-semibold text-gray-800">${label}</span>
        </label>
    `;
}

// ─── Renderer: Text Input ───────────────────────────────────────────────────
function _renderTextInput(campo, value, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    
    return `
        <div class="mb-2">
            ${label ? `<label class="block text-base font-bold mb-1 text-gray-800">${label}</label>` : ''}
            <input type="text" value="${value || ''}"
                   onchange="${updateFn}('${projectId}', '${campo.key}', this.value)"
                   placeholder="${campo.placeholder || ''}"
                   class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-base font-medium bg-white focus:ring-2 focus:ring-purple-500">
        </div>
    `;
}

// ─── Renderer: Number Input ─────────────────────────────────────────────────
function _renderNumberInput(campo, value, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    const unitStr = campo.unit ? ` (${campo.unit})` : '';
    
    return `
        <div class="mb-2">
            ${label ? `<label class="block text-base font-bold mb-1 text-gray-800">${label}${unitStr}</label>` : ''}
            <input type="number" value="${value || ''}"
                   onchange="${updateFn}('${projectId}', '${campo.key}', this.value)"
                   ${campo.readonly ? 'readonly' : ''}
                   class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-base font-medium bg-white focus:ring-2 focus:ring-purple-500">
        </div>
    `;
}

// ─── Renderer: Textarea ─────────────────────────────────────────────────────
function _renderTextarea(campo, value, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    
    return `
        <div class="mb-2 col-span-full">
            ${label ? `<label class="block text-base font-bold mb-1 text-gray-800">${label}</label>` : ''}
            <textarea onchange="${updateFn}('${projectId}', '${campo.key}', this.value)"
                      placeholder="${campo.placeholder || ''}"
                      rows="2"
                      class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-base font-medium bg-white focus:ring-2 focus:ring-purple-500">${value || ''}</textarea>
        </div>
    `;
}

// ─── Helper: nome funzione update per productType ───────────────────────────
function _getUpdateFnName(productType) {
    const map = {
        'infisso': 'updateConfigInfissi',
        'persiana': 'updateConfigPersiane',
        'tapparella': 'updateConfigTapparelle',
        'zanzariera': 'updateConfigZanzariere',
        'cassonetto': 'updateConfigCassonetti',
        'grata': 'updateConfigGrate'
    };
    return map[productType] || 'updateConfigInfissi';
}

console.log('✅ render-config-campi.js v1.0.0 caricato');
