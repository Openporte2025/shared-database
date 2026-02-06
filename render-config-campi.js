/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 RENDER CONFIG CAMPI - Renderer generico config globale da CAMPI_PRODOTTI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * v1.2.1 (06/02/2026): Fix getColoriPersiane fallback chain (COLORI_PERSIANE → PERSIANE_MODULE → OPZIONI_PRODOTTI)
 * v1.2.0 (06/02/2026): Renderer posizione prodotti da CAMPI_PRODOTTI
 * v1.1.0 (06/02/2026): Supporto multi-checkbox, optionLabel/optionValue, gruppi speciali
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
        } else if (campo.type === 'multi-checkbox') {
            fieldHtml = _renderMultiCheckbox(campo, configData[campo.key], project.id, productType, label);
        } else if (campo.type === 'select' && typeof campo.optionLabel === 'function') {
            // Select con oggetti (optionLabel/optionValue) - es. SOMFY
            fieldHtml = _renderObjectSelect(campo, value, project.id, productType, label);
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
           v.equalsLower !== undefined || v.notEmpty !== undefined || 
           v.containsLower !== undefined || v.equalsAny !== undefined);
}

// ─── Helper: ottieni array di opzioni da un campo ────────────────────────────
function _getOptionsArray(campo, configData) {
    if (!campo.options) return [];
    const raw = typeof campo.options === 'function' ? campo.options() : campo.options;
    if (!Array.isArray(raw)) {
        console.warn(`⚠️ _getOptionsArray: options() non ha restituito array per "${campo.key}"`, raw);
        return [];
    }
    // Se campo ha optionLabel/optionValue (es. motori SOMFY), genera {value, label}
    if (campo.optionLabel && campo.optionValue) {
        return raw.map(o => ({
            value: campo.optionValue(o),
            label: campo.optionLabel(o)
        }));
    }
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
            // 1. COLORI_PERSIANE (da persiane.js)
            if (typeof COLORI_PERSIANE !== 'undefined' && COLORI_PERSIANE.length > 0) return COLORI_PERSIANE;
            // 2. PERSIANE_MODULE (da persiane-module.js)
            if (typeof PERSIANE_MODULE !== 'undefined' && PERSIANE_MODULE.getColoriPerCategoria) {
                const cats = PERSIANE_MODULE.getColoriPerCategoria();
                const all = [];
                Object.values(cats).forEach(arr => all.push(...arr));
                return all;
            }
            // 3. OPZIONI_PRODOTTI fallback
            if (typeof OPZIONI_PRODOTTI !== 'undefined' && OPZIONI_PRODOTTI.persiane?.colori) {
                return OPZIONI_PRODOTTI.persiane.colori;
            }
            return [];
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
    
    // Safety: assicura che options sia array
    if (!Array.isArray(options)) {
        console.warn(`⚠️ _renderSimpleSelect: options non è array per campo "${campo.key}"`, options);
        options = [];
    }
    
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

// ─── Renderer: Multi-Checkbox (es. accessori motore SOMFY) ──────────────────
function _renderMultiCheckbox(campo, currentValues, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    const options = _getOptionsArray(campo, {});
    const values = currentValues || {};

    // Se opzioni sono oggetti con optionLabel/optionValue
    const rawOpts = typeof campo.options === 'function' ? campo.options() : (campo.options || []);
    const hasLabelFn = typeof campo.optionLabel === 'function';

    let html = `<div class="mb-2 col-span-full">
        ${label ? `<label class="block text-base font-bold mb-2 text-gray-800">${label}</label>` : ''}
        <div class="grid grid-cols-2 gap-2">`;

    for (const opt of rawOpts) {
        const val = hasLabelFn ? campo.optionValue(opt) : opt;
        const lab = hasLabelFn ? campo.optionLabel(opt) : String(opt);
        const checked = values[val] || false;

        html += `
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border ${checked ? 'bg-indigo-100 border-indigo-400' : 'bg-white border-gray-300'} cursor-pointer hover:bg-indigo-50">
                <input type="checkbox" 
                       ${checked ? 'checked' : ''}
                       onchange="${updateFn}AccessorioMotore('${projectId}', '${val}', this.checked)"
                       class="w-4 h-4 accent-indigo-600">
                <span class="text-sm">${lab}</span>
            </label>`;
    }

    html += `</div></div>`;
    return html;
}

// ─── Renderer: Select con optionLabel/optionValue (oggetti SOMFY) ───────────
function _renderObjectSelect(campo, value, projectId, productType, label) {
    const updateFn = _getUpdateFnName(productType);
    const rawOpts = typeof campo.options === 'function' ? campo.options() : (campo.options || []);
    const isEmpty = !value || value === '';
    const renderNeeded = campo.visibleIf ? '; render();' : '';

    let optsHtml = '<option value="">▼ Seleziona...</option>';
    for (const opt of rawOpts) {
        const val = campo.optionValue(opt);
        const lab = campo.optionLabel(opt);
        optsHtml += `<option value="${val}" ${String(value) === String(val) ? 'selected' : ''}>${lab}</option>`;
    }

    return `
        <div class="mb-2">
            ${label ? `<label class="block text-base font-bold mb-1 text-gray-800">${label}</label>` : ''}
            <select class="w-full px-3 py-2.5 border-2 rounded-lg text-base font-medium ${isEmpty ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-white'}"
                    onchange="${updateFn}('${projectId}', '${campo.key}', this.value)${renderNeeded}">
                ${optsHtml}
            </select>
        </div>
    `;
}

// ─── Renderer: Gruppo "cosa-serve" con styling speciale ─────────────────────
function _renderCosaServeGroup(campos, configData, projectId, productType, meta) {
    const updateFn = _getUpdateFnName(productType);
    const colors = meta?.cosaServeColors || {
        bg: 'from-amber-100 to-orange-100',
        border: 'amber-400',
        title: 'amber-800',
        hint: 'amber-700'
    };

    let checkboxesHtml = '';
    const icons = { serveTapparella: '🎚️', serveMotore: '🔌', serveAccessori: '🔧' };
    const activeColors = { serveTapparella: 'amber', serveMotore: 'blue', serveAccessori: 'purple' };

    for (const campo of campos) {
        const checked = campo.key === 'serveTapparella' 
            ? configData[campo.key] !== false  // default true
            : configData[campo.key] || false;
        const color = activeColors[campo.key] || 'amber';
        const icon = icons[campo.key] || '✓';

        checkboxesHtml += `
            <label class="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border-2 ${checked ? `border-${color}-500 bg-${color}-50` : 'border-gray-300'} hover:border-${color}-400 transition-all">
                <input type="checkbox" 
                       ${checked ? 'checked' : ''}
                       onchange="${updateFn}('${projectId}', '${campo.key}', this.checked); render();"
                       class="w-5 h-5 accent-${color}-600">
                <span class="font-semibold text-gray-800">${icon} ${campo.label}</span>
            </label>`;
    }

    return `
        <div class="bg-gradient-to-r ${colors.bg} border-2 border-${colors.border} rounded-lg p-4 mb-4">
            <h5 class="font-bold text-${colors.title} mb-3 flex items-center gap-2">
                🎯 Cosa serve di default nelle nuove posizioni?
            </h5>
            <div class="flex flex-wrap gap-4">${checkboxesHtml}</div>
            <p class="text-xs text-${colors.hint} mt-2">💡 Questi valori saranno pre-impostati quando aggiungi una nuova posizione</p>
        </div>
    `;
}

// ─── Renderer: Sezione motore con titolo e bordo ────────────────────────────
function _renderMotoreSection(campos, configData, projectId, productType) {
    const updateFn = _getUpdateFnName(productType);
    let fieldsHtml = '';

    for (const campo of campos) {
        const value = configData[campo.key] || '';
        const label = campo.label;

        if (campo.type === 'multi-checkbox') {
            fieldsHtml += _renderMultiCheckbox(campo, configData[campo.key], projectId, productType, label);
        } else if (campo.type === 'select' && typeof campo.optionLabel === 'function') {
            fieldsHtml += _renderObjectSelect(campo, value, projectId, productType, label);
        } else if (campo.type === 'select') {
            const options = _getOptionsArray(campo, configData);
            fieldsHtml += _renderSimpleSelect(campo, value, options, projectId, productType, label);
        }
    }

    return `
        <div class="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4 mt-4 mb-4">
            <h5 class="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                🔌 Configurazione Motore Default
            </h5>
            <div class="grid md:grid-cols-2 gap-4">${fieldsHtml}</div>
            <p class="text-xs text-indigo-600 mt-2">💡 Questi valori saranno pre-impostati quando clicchi "+ Aggiungi Motore"</p>
        </div>
    `;
}

/**
 * Render config globale AVANZATO con supporto gruppi speciali.
 * Gestisce: cosa-serve (checkbox styled), motore (sezione dedicata), campi normali.
 * 
 * @param {Object} project
 * @param {string} productName - es. 'tapparella'
 * @param {Object} opts - { excludeKeys, cols }
 * @returns {string} HTML completo
 */
function renderConfigGlobaleAdvanced(project, productName, opts = {}) {
    if (typeof CAMPI_PRODOTTI === 'undefined' || !CAMPI_PRODOTTI[productName]) {
        return renderConfigGlobaleFromCampi(project, productName, opts);
    }

    const def = CAMPI_PRODOTTI[productName];
    const configData = project[def.configKey] || {};
    const productType = def.productKey;
    const campos = def.configGlobale;

    // Separa per gruppo
    const cosaServe = campos.filter(c => c.group === 'cosa-serve');
    const motore = campos.filter(c => c.group === 'motore');
    const normalCampos = campos.filter(c => c.group !== 'cosa-serve' && c.group !== 'motore');

    let html = '';

    // 1. Checkbox "cosa serve" (se presente)
    if (cosaServe.length > 0) {
        html += _renderCosaServeGroup(cosaServe, configData, project.id, productType);
    }

    // 2. Campi normali (solo se visibili)
    const visibleNormal = normalCampos.filter(c => CAMPI_PRODOTTI.isVisible(c, configData));
    if (visibleNormal.length > 0) {
        html += renderConfigGlobaleFromCampi(project, productName, {
            ...opts,
            excludeGroups: ['cosa-serve', 'motore']
        });
    }

    // 3. Sezione motore (se serveMotore)
    if (motore.length > 0 && configData.serveMotore) {
        html += _renderMotoreSection(motore, configData, project.id, productType);
    }

    return html;
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

/**
 * 🆕 v1.2.0: Render campi prodotto in posizione da CAMPI_PRODOTTI.
 * Genera HTML per campi configGlobale + posizione di un prodotto.
 * NON include: BRM, Foto, Accessori, Note (gestiti da sezioni dedicate).
 * 
 * @param {Object} project - Progetto
 * @param {Object} pos - Posizione
 * @param {string} productName - es. 'persiana'
 * @param {Object} productData - Dati prodotto (pos.persiana)
 * @param {Object} opts - { excludeKeys, excludeGroups }
 * @returns {{ qtaHtml: string, posFieldsHtml: string, configFieldsHtml: string }}
 */
function renderPositionProductFromCampi(project, pos, productName, productData, opts = {}) {
    if (typeof CAMPI_PRODOTTI === 'undefined' || !CAMPI_PRODOTTI[productName]) {
        return null;
    }
    
    const def = CAMPI_PRODOTTI[productName];
    const productType = def.productKey;
    const excludeKeys = new Set(opts.excludeKeys || ['BRM_L', 'BRM_H', 'note']);
    const excludeGroups = new Set(opts.excludeGroups || ['link-prodotti']);
    
    // Merge config globale + product data per visibilità
    const configData = project[def.configKey] || {};
    const mergedData = { ...configData, ...productData };
    
    let qtaHtml = '';
    let posFieldsHtml = '';
    let configFieldsHtml = '';
    
    // === CAMPI POSIZIONE ===
    for (const campo of def.posizione) {
        if (excludeKeys.has(campo.key)) continue;
        if (campo.group && excludeGroups.has(campo.group)) continue;
        if (!CAMPI_PRODOTTI.isVisible(campo, mergedData)) continue;
        
        const value = productData[campo.key] !== undefined ? productData[campo.key] : '';
        
        if (campo.key === 'qta') {
            // Qta: sempre select 0-10
            qtaHtml = _renderPosSelect(campo, value, project.id, pos.id, productType, 'Quantità');
            continue;
        }
        
        posFieldsHtml += _renderPosField(campo, value, project.id, pos.id, productType, mergedData);
    }
    
    // === CAMPI CONFIG GLOBALE (mostrati in posizione come "Configurazione") ===
    for (const campo of def.configGlobale) {
        if (excludeKeys.has(campo.key)) continue;
        if (campo.group && excludeGroups.has(campo.group)) continue;
        if (campo.group === 'cosa-serve') continue; // gestito separatamente per tapparelle
        if (campo.group === 'motore') continue; // gestito separatamente
        if (!CAMPI_PRODOTTI.isVisible(campo, mergedData)) continue;
        
        const value = productData[campo.key] !== undefined ? productData[campo.key] : '';
        configFieldsHtml += _renderPosField(campo, value, project.id, pos.id, productType, mergedData);
    }
    
    return { qtaHtml, posFieldsHtml, configFieldsHtml };
}

// ─── Renderer posizione: campo generico ─────────────────────────────────────
function _renderPosField(campo, value, projectId, posId, productType, mergedData) {
    if (campo.type === 'select' && campo.allowCustom) {
        const options = _getOptionsArray(campo, mergedData);
        return renderSelectWithCustom(
            campo.key, value, options,
            projectId, posId, productType, campo.label
        );
    }
    if (campo.type === 'select-dynamic') {
        let options = [];
        if (campo.optionsFn && campo.dependsOn) {
            const depVal = typeof campo.dependsOn === 'string'
                ? mergedData[campo.dependsOn]
                : campo.dependsOn.map(d => mergedData[d]);
            options = campo.optionsFn(depVal) || [];
        } else if (campo.customGetter) {
            options = _getOptionsFromGetter(campo, { id: projectId }, mergedData);
        }
        if (campo.allowCustom !== false) {
            return renderSelectWithCustom(
                campo.key, value, options,
                projectId, posId, productType, campo.label
            );
        }
        return _renderPosSelect(campo, value, projectId, posId, productType, campo.label, options);
    }
    if (campo.type === 'select') {
        const options = _getOptionsArray(campo, mergedData);
        return _renderPosSelect(campo, value, projectId, posId, productType, campo.label, options);
    }
    if (campo.type === 'checkbox') {
        return _renderPosCheckbox(campo, value, projectId, posId, productType);
    }
    if (campo.type === 'text') {
        return _renderPosText(campo, value, projectId, posId, productType);
    }
    if (campo.type === 'number') {
        return _renderPosNumber(campo, value, projectId, posId, productType);
    }
    return '';
}

// ─── Renderer posizione: Select semplice ────────────────────────────────────
function _renderPosSelect(campo, value, projectId, posId, productType, label, options) {
    if (!options) {
        const raw = typeof campo.options === 'function' ? campo.options() : (campo.options || []);
        options = raw;
    }
    const isEmpty = !value && value !== 0 && value !== '0';
    const isQta = campo.key === 'qta';
    const borderClass = isEmpty && !isQta ? 'border-2 border-orange-400 bg-orange-50' : 'border';
    
    return `
        <div>
            <label class="text-xs font-medium">${label}${campo.required ? ' <span class="text-red-600">*</span>' : ''}</label>
            <select onchange="updateProduct('${projectId}', '${posId}', '${productType}', '${campo.key}', this.value)"
                    class="w-full compact-input ${borderClass} rounded mt-1 ${isQta ? 'font-semibold' : ''}">
                ${!isQta ? '<option value="">-- Seleziona --</option>' : ''}
                ${options.map(opt => {
                    const optVal = typeof opt === 'object' && opt.value !== undefined ? opt.value : opt;
                    const optLab = typeof opt === 'object' && opt.label !== undefined ? opt.label : opt;
                    return `<option value="${optVal}" ${String(value) == String(optVal) ? 'selected' : ''}>${optLab}</option>`;
                }).join('')}
            </select>
        </div>
    `;
}

// ─── Renderer posizione: Checkbox ───────────────────────────────────────────
function _renderPosCheckbox(campo, value, projectId, posId, productType) {
    const checked = value === true || value === 'true';
    return `
        <label class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${checked ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300'}">
            <input type="checkbox" ${checked ? 'checked' : ''}
                   onchange="updateProduct('${projectId}', '${posId}', '${productType}', '${campo.key}', this.checked)"
                   class="w-4 h-4">
            <span class="text-sm font-medium">${campo.label}</span>
        </label>
    `;
}

// ─── Renderer posizione: Text ───────────────────────────────────────────────
function _renderPosText(campo, value, projectId, posId, productType) {
    return `
        <div>
            <label class="text-xs font-medium">${campo.label}</label>
            <input type="text" value="${value || ''}"
                   onchange="updateProduct('${projectId}', '${posId}', '${productType}', '${campo.key}', this.value)"
                   placeholder="${campo.placeholder || ''}"
                   class="w-full compact-input border rounded mt-1">
        </div>
    `;
}

// ─── Renderer posizione: Number ─────────────────────────────────────────────
function _renderPosNumber(campo, value, projectId, posId, productType) {
    const unitStr = campo.unit ? ` (${campo.unit})` : '';
    return `
        <div>
            <label class="text-xs font-medium">${campo.label}${unitStr}</label>
            <input type="number" value="${value || ''}"
                   onchange="updateProduct('${projectId}', '${posId}', '${productType}', '${campo.key}', this.value)"
                   ${campo.readonly ? 'readonly' : ''}
                   class="w-full compact-input border rounded mt-1 ${campo.readonly ? 'bg-gray-50' : ''}">
        </div>
    `;
}

console.log('✅ render-config-campi.js v1.3.0 caricato');
