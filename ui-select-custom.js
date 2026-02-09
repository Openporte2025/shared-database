/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎨 UI-SELECT-CUSTOM - Select con opzione "Scrivi manualmente" (shared)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * v1.0.0 (09/02/2026): Estratto da App Rilievo per condivisione con Dashboard
 * 
 * SCOPO: Genera HTML per dropdown con opzione custom input.
 *        Usato da render-config-campi.js e editor-posizione.js
 * 
 * DIPENDENZE: Nessuna
 * 
 * CALLBACK: Ogni app registra il proprio handler di salvataggio:
 *   window.UI_SELECT_CUSTOM.onConfigChange = (projectId, productType, field, value) => { ... }
 *   window.UI_SELECT_CUSTOM.onPositionChange = (projectId, posId, productType, field, value) => { ... }
 *   window.UI_SELECT_CUSTOM.onAfterChange = (fieldName, value, projectId, posId, productType) => { ... }
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    const VERSION = '1.0.0';

    // ═══════════════════════════════════════════════════════════════════════════
    // CALLBACKS (da registrare da ogni app)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const callbacks = {
        // Chiamato quando cambia un campo config globale
        // (projectId, productType, field, value) => void
        onConfigChange: null,
        
        // Chiamato quando cambia un campo posizione
        // (projectId, posId, productType, field, value) => void
        onPositionChange: null,
        
        // Chiamato dopo qualsiasi cambio (per re-render, aggiornamento colori, etc.)
        // (fieldName, value, projectId, posId, productType) => void
        onAfterChange: null
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER: Select con opzione custom
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera HTML per un select con opzione "Scrivi manualmente"
     * 
     * @param {string} fieldName - Nome campo (es. 'azienda', 'coloreInt')
     * @param {string} currentValue - Valore corrente
     * @param {string[]} options - Array opzioni disponibili
     * @param {string} projectId - ID progetto
     * @param {string|null} posId - ID posizione (null = config globale)
     * @param {string} productType - Tipo prodotto (es. 'infisso', 'persiana')
     * @param {string} label - Etichetta da mostrare
     * @returns {string} HTML
     */
    function renderSelectWithCustom(fieldName, currentValue, options, projectId, posId, productType, label) {
        // Normalizza options: supporta sia stringhe che oggetti {value, label}
        const normalizedOptions = (options || []).map(opt => {
            if (typeof opt === 'object' && opt !== null && opt.value !== undefined) {
                return { value: String(opt.value), label: opt.label || String(opt.value) };
            }
            return { value: String(opt), label: String(opt) };
        });
        
        // Determina se il valore corrente è custom (non nella lista)
        const optionValues = normalizedOptions.map(o => o.value);
        const isCustom = currentValue && currentValue !== '' && !optionValues.includes(currentValue);
        const selectedValue = isCustom ? '__custom__' : (currentValue || '');
        const isEmpty = !currentValue || currentValue === '';
        
        // ID univoco per l'input custom
        const customInputId = `${fieldName}_custom_${projectId || 'global'}_${posId || 'config'}_${productType || 'infisso'}`;
        
        // Classi CSS adattive (supporta sia Tailwind che CSS vanilla)
        const selectClass = isEmpty 
            ? 'ui-select-custom-empty' 
            : 'ui-select-custom-filled';
        
        return `
            <div class="ui-select-custom-wrapper mb-2">
                ${label ? `<label class="ui-select-custom-label block text-base font-bold mb-1 text-gray-800">${label}</label>` : ''}
                
                <select 
                    class="ui-select-custom-select w-full px-3 py-2.5 border-2 rounded-lg text-base font-medium ${selectClass} focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    onchange="UI_SELECT_CUSTOM.handleChange('${fieldName}', this, '${projectId}', '${posId || ''}', '${productType}')"
                >
                    <option value="" class="text-gray-400">▼ Seleziona...</option>
                    ${normalizedOptions.map(opt => `
                        <option value="${_escHtml(opt.value)}" ${selectedValue === opt.value ? 'selected' : ''} class="text-gray-900 font-medium">
                            ${_escHtml(opt.label)}
                        </option>
                    `).join('')}
                    <option value="__custom__" ${isCustom ? 'selected' : ''} class="text-blue-600 font-semibold">
                        🖊️ Scrivi manualmente
                    </option>
                </select>
                
                <input 
                    type="text" 
                    class="ui-select-custom-input w-full px-3 py-2.5 border-2 border-blue-400 rounded-lg mt-2 text-base font-medium bg-blue-50 focus:ring-2 focus:ring-blue-500" 
                    id="${customInputId}"
                    placeholder="✏️ Scrivi valore personalizzato..."
                    value="${isCustom ? _escHtml(currentValue) : ''}"
                    style="display: ${isCustom ? 'block' : 'none'};"
                    onchange="UI_SELECT_CUSTOM.handleCustomInput('${fieldName}', this, '${projectId}', '${posId || ''}', '${productType}')"
                />
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLER: Cambio select
    // ═══════════════════════════════════════════════════════════════════════════
    
    function handleChange(fieldName, selectElement, projectId, posId, productType) {
        const value = selectElement.value;
        const customInputId = `${fieldName}_custom_${projectId || 'global'}_${posId || 'config'}_${productType || 'infisso'}`;
        const customInput = document.getElementById(customInputId);
        
        // Feedback visivo
        if (value === '' || value === '__custom__') {
            selectElement.classList.remove('ui-select-custom-filled');
            selectElement.classList.add('ui-select-custom-empty');
        } else {
            selectElement.classList.remove('ui-select-custom-empty');
            selectElement.classList.add('ui-select-custom-filled');
        }
        
        if (value === '__custom__') {
            if (customInput) {
                customInput.style.display = 'block';
                customInput.focus();
            }
            return; // Non salvare ancora, aspetta input custom
        }
        
        // Nascondi input custom
        if (customInput) {
            customInput.style.display = 'none';
            customInput.value = '';
        }
        
        if (value !== '') {
            _dispatchChange(fieldName, value, projectId, posId, productType);
        }
    }
    
    /**
     * Handler per input custom (testo libero)
     */
    function handleCustomInput(fieldName, inputElement, projectId, posId, productType) {
        const value = inputElement.value.trim();
        if (value) {
            _dispatchChange(fieldName, value, projectId, posId, productType);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DISPATCH: Chiama il callback registrato dall'app
    // ═══════════════════════════════════════════════════════════════════════════
    
    function _dispatchChange(fieldName, value, projectId, posId, productType) {
        console.log(`🎨 UI_SELECT_CUSTOM: ${productType}.${fieldName} = "${value}" (pos: ${posId || 'config'})`);
        
        if (posId && posId !== '' && posId !== 'config') {
            // Cambio su posizione
            if (callbacks.onPositionChange) {
                callbacks.onPositionChange(projectId, posId, productType, fieldName, value);
            }
        } else {
            // Cambio su config globale
            if (callbacks.onConfigChange) {
                callbacks.onConfigChange(projectId, productType, fieldName, value);
            }
        }
        
        // Callback post-cambio (per re-render, aggiornamento colori, etc.)
        if (callbacks.onAfterChange) {
            callbacks.onAfterChange(fieldName, value, projectId, posId, productType);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    function _escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CSS DEFAULTS (iniettati se non presenti)
    // ═══════════════════════════════════════════════════════════════════════════
    
    function injectDefaultStyles() {
        if (document.getElementById('ui-select-custom-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ui-select-custom-styles';
        style.textContent = `
            .ui-select-custom-empty {
                border-color: #fb923c !important;
                background-color: #fff7ed !important;
            }
            .ui-select-custom-filled {
                border-color: #d1d5db !important;
                background-color: #fff !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inietta stili al caricamento
    injectDefaultStyles();

    // ═══════════════════════════════════════════════════════════════════════════
    // EXPORT
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.UI_SELECT_CUSTOM = {
        VERSION: VERSION,
        
        // Render
        renderSelect: renderSelectWithCustom,
        
        // Handlers (chiamati da onclick/onchange nell'HTML generato)
        handleChange: handleChange,
        handleCustomInput: handleCustomInput,
        
        // Callbacks da registrare
        get onConfigChange() { return callbacks.onConfigChange; },
        set onConfigChange(fn) { callbacks.onConfigChange = fn; },
        
        get onPositionChange() { return callbacks.onPositionChange; },
        set onPositionChange(fn) { callbacks.onPositionChange = fn; },
        
        get onAfterChange() { return callbacks.onAfterChange; },
        set onAfterChange(fn) { callbacks.onAfterChange = fn; }
    };
    
    // Retrocompatibilità: renderSelectWithCustom come funzione globale
    // Così render-config-campi.js continua a funzionare senza modifiche
    window.renderSelectWithCustom = renderSelectWithCustom;
    
    console.log(`✅ ui-select-custom.js v${VERSION} caricato`);

})();
