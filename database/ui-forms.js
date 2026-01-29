// ============================================================================
// UI-FORMS v1.0.0 - Componenti UI Centralizzati
// ============================================================================
// 
// Modulo condiviso per: App Rilievo + Dashboard + App Posa
// 
// Genera HTML per form comuni, leggendo opzioni da JSON_MANAGER.CONFIG
// Una sola fonte → usata ovunque
//
// ============================================================================

const UI_FORMS = {

    version: '1.0.0',

    // =========================================================================
    // FORM DATI CLIENTE
    // =========================================================================
    
    /**
     * Genera HTML form dati cliente completo
     * @param {Object} cliente - Dati cliente esistenti
     * @param {Object} immobile - Dati immobile esistenti
     * @param {Object} options - { onChangeCallback: 'nomeFunzione', idPrefix: 'app' }
     * @returns {string} HTML
     */
    renderFormCliente(cliente, immobile, options = {}) {
        cliente = cliente || {};
        immobile = immobile || {};
        const cb = options.onChangeCallback || 'updateClienteField';
        const prefix = options.idPrefix || 'cliente';
        
        return `
        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">👤</span> Dati Cliente
            </h3>
            
            <!-- ANAGRAFICA -->
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nome</label>
                    <input type="text" 
                           id="${prefix}-nome"
                           value="${this._escapeHtml(cliente.nome || '')}"
                           onchange="${cb}('nome', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Mario">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Cognome</label>
                    <input type="text"
                           id="${prefix}-cognome"
                           value="${this._escapeHtml(cliente.cognome || '')}"
                           onchange="${cb}('cognome', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Rossi">
                </div>
            </div>
            
            <!-- CODICE FISCALE -->
            <div class="mb-4">
                <label class="block text-xs font-semibold text-gray-600 mb-1">Codice Fiscale</label>
                <input type="text"
                       id="${prefix}-codiceFiscale"
                       value="${this._escapeHtml(cliente.codiceFiscale || '')}"
                       onchange="${cb}('codiceFiscale', this.value.toUpperCase())"
                       maxlength="16"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono"
                       placeholder="RSSMRA80A01H501X">
            </div>
            
            <!-- CONTATTI -->
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">📞 Telefono</label>
                    <input type="tel"
                           id="${prefix}-telefono"
                           value="${this._escapeHtml(cliente.telefono || '')}"
                           onchange="${cb}('telefono', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="333 1234567">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">📧 Email</label>
                    <input type="email"
                           id="${prefix}-email"
                           value="${this._escapeHtml(cliente.email || '')}"
                           onchange="${cb}('email', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="mario.rossi@email.it">
                </div>
            </div>
            
            <!-- SEPARATORE -->
            <div class="border-t border-gray-200 my-4"></div>
            
            <!-- INDIRIZZO LAVORI -->
            <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>📍</span> Indirizzo Lavori
            </h4>
            
            <div class="mb-3">
                <label class="block text-xs font-semibold text-gray-600 mb-1">Via / Indirizzo</label>
                <input type="text"
                       id="${prefix}-indirizzo"
                       value="${this._escapeHtml(immobile.indirizzo || cliente.indirizzo || '')}"
                       onchange="${cb}('indirizzo', this.value, 'immobile')"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Via Roma 1">
            </div>
            
            <div class="grid grid-cols-6 gap-3 mb-4">
                <div class="col-span-3">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Comune</label>
                    <input type="text"
                           id="${prefix}-comune"
                           value="${this._escapeHtml(immobile.comune || cliente.comune || '')}"
                           onchange="${cb}('comune', this.value, 'immobile')"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Bergamo">
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Prov</label>
                    <input type="text"
                           id="${prefix}-provincia"
                           value="${this._escapeHtml(immobile.provincia || cliente.provincia || '')}"
                           onchange="${cb}('provincia', this.value.toUpperCase(), 'immobile')"
                           maxlength="2"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-center"
                           placeholder="BG">
                </div>
                <div class="col-span-2">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">CAP</label>
                    <input type="text"
                           id="${prefix}-cap"
                           value="${this._escapeHtml(immobile.cap || cliente.cap || '')}"
                           onchange="${cb}('cap', this.value, 'immobile')"
                           maxlength="5"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                           placeholder="24100">
                </div>
            </div>
            
            <!-- SEPARATORE -->
            <div class="border-t border-gray-200 my-4"></div>
            
            <!-- DATI FISCALI -->
            <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>📋</span> Dati Fiscali
            </h4>
            
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">🌡️ Zona Climatica</label>
                    <select id="${prefix}-zonaClimatica"
                            onchange="${cb}('zonaClimatica', this.value, 'immobile')"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        ${this._renderOptions('zonaClimatica', immobile.zonaClimatica || 'E')}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">💰 Detrazione</label>
                    <select id="${prefix}-tipoDetrazione"
                            onchange="${cb}('tipoDetrazione', this.value, 'immobile')"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        ${this._renderOptions('tipoDetrazione', immobile.tipoDetrazione || '50')}
                    </select>
                </div>
            </div>
        </div>
        `;
    },

    // =========================================================================
    // FORM ESISTENTE GLOBALE
    // =========================================================================
    
    /**
     * Genera HTML form esistente (infissi attuali)
     * @param {Object} esistente - Dati esistente
     * @param {Object} options - { onChangeCallback, idPrefix }
     * @returns {string} HTML
     */
    renderFormEsistente(esistente, options = {}) {
        esistente = esistente || {};
        const infisso = esistente.infisso || {};
        const cb = options.onChangeCallback || 'updateEsistenteField';
        const prefix = options.idPrefix || 'esistente';
        
        return `
        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">🪟</span> Infisso Esistente (da sostituire)
            </h3>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Materiale</label>
                    <select id="${prefix}-materiale"
                            onchange="${cb}('materiale', this.value)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        ${this._renderOptions('materialeEsistente', infisso.materiale || 'legno')}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Vetro</label>
                    <select id="${prefix}-vetro"
                            onchange="${cb}('vetro', this.value)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        ${this._renderOptions('vetroEsistente', infisso.vetro || 'doppio')}
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox"
                           id="${prefix}-togliere"
                           ${infisso.togliere !== false ? 'checked' : ''}
                           onchange="${cb}('togliere', this.checked)"
                           class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">🔧 Rimozione inclusa</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox"
                           id="${prefix}-smaltimento"
                           ${infisso.smaltimento !== false ? 'checked' : ''}
                           onchange="${cb}('smaltimento', this.checked)"
                           class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">♻️ Smaltimento incluso</span>
                </label>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox"
                           id="${prefix}-coprifiliInt"
                           ${esistente.coprifiliInt ? 'checked' : ''}
                           onchange="${cb}('coprifiliInt', this.checked)"
                           class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">📏 Coprifili INTERNI</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox"
                           id="${prefix}-coprifiliEst"
                           ${esistente.coprifiliEst ? 'checked' : ''}
                           onchange="${cb}('coprifiliEst', this.checked)"
                           class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">📏 Coprifili ESTERNI</span>
                </label>
            </div>
        </div>
        `;
    },

    // =========================================================================
    // SELETTORE POSIZIONE (F/PF + Installazione)
    // =========================================================================
    
    /**
     * Genera HTML selettori posizione (tipo apertura + installazione)
     * @param {Object} posizione - Dati posizione
     * @param {Object} options - { onChangeCallback, projectId, posId }
     * @returns {string} HTML
     */
    renderSelettoriPosizione(posizione, options = {}) {
        const tipoApertura = posizione.tipoApertura || null;
        const installazione = posizione.installazione || posizione.posizioneTelaio || null;
        const cb = options.onChangeCallback || 'updatePosizioneField';
        const projectId = options.projectId || '';
        const posId = options.posId || posizione.id || '';
        
        return `
            ${this._renderSelettoreToggle('tipoApertura', tipoApertura, cb, projectId, posId, 'Tipo Apertura')}
            ${this._renderSelettoreToggle('installazione', installazione, cb, projectId, posId, 'Installazione')}
        `;
    },
    
    /**
     * Genera singolo selettore toggle
     */
    _renderSelettoreToggle(tipoOpzione, valoreCorrente, callback, projectId, posId, label) {
        const opzioni = this._getOpzioni(tipoOpzione);
        if (!opzioni) return `<div class="text-red-500 text-sm">Opzioni ${tipoOpzione} non trovate</div>`;
        
        const isSelected = opzioni.some(opt => opt.codice === valoreCorrente);
        const borderClass = isSelected ? 'border-green-400' : 'border-orange-400';
        const bgClass = isSelected ? 'bg-green-50' : 'bg-orange-50';
        
        const colori = {
            tipoApertura: { 0: 'blue', 1: 'green' },
            installazione: { 0: 'indigo', 1: 'amber' }
        };
        
        const bottoniHTML = opzioni.map((opt, idx) => {
            const colore = colori[tipoOpzione]?.[idx] || 'gray';
            const isAttivo = opt.codice === valoreCorrente;
            
            const classeAttivo = isAttivo 
                ? `bg-${colore}-600 text-white border-${colore}-600 shadow-lg` 
                : `bg-white text-gray-600 border-gray-300 hover:border-${colore}-400 hover:bg-${colore}-50`;
            
            return `
                <button type="button" 
                        onclick="${callback}('${projectId}', '${posId}', '${tipoOpzione}', '${opt.codice}')"
                        class="px-4 py-2 text-sm font-bold rounded-lg transition-all border-2 ${classeAttivo}">
                    ${opt.nome}
                </button>
            `;
        }).join('');
        
        return `
        <div class="mb-4 p-3 border-2 rounded-lg ${borderClass} ${bgClass}">
            <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-700">${label}:</label>
                    ${!isSelected ? '<span class="text-orange-600 text-sm font-bold">⚠️ Obbligatorio</span>' : '<span class="text-green-600 text-sm">✓</span>'}
                </div>
                <div class="flex gap-2 flex-wrap">
                    ${bottoniHTML}
                </div>
            </div>
            ${!isSelected ? `<p class="text-xs text-orange-700 mt-2">👆 Seleziona ${label}</p>` : ''}
        </div>
        `;
    },

    // =========================================================================
    // UTILITY
    // =========================================================================
    
    /**
     * Genera HTML options da JSON_MANAGER.CONFIG.OPZIONI
     */
    _renderOptions(tipoOpzione, valoreSelezionato) {
        const opzioni = this._getOpzioni(tipoOpzione);
        if (!opzioni) return '<option value="">Tipo non trovato</option>';
        
        return opzioni.map(opt => {
            const selected = opt.codice === valoreSelezionato ? 'selected' : '';
            return `<option value="${opt.codice}" ${selected}>${opt.nome}</option>`;
        }).join('\n');
    },
    
    /**
     * Ottiene opzioni da JSON_MANAGER o fallback locale
     */
    _getOpzioni(tipoOpzione) {
        // Prima prova JSON_MANAGER
        if (typeof JSON_MANAGER !== 'undefined' && JSON_MANAGER.CONFIG?.OPZIONI?.[tipoOpzione]) {
            return JSON_MANAGER.CONFIG.OPZIONI[tipoOpzione];
        }
        
        // Fallback locale
        const FALLBACK = {
            zonaClimatica: [
                { codice: 'A', nome: 'A - Molto caldo' },
                { codice: 'B', nome: 'B - Caldo' },
                { codice: 'C', nome: 'C - Temperato caldo' },
                { codice: 'D', nome: 'D - Temperato freddo' },
                { codice: 'E', nome: 'E - Freddo' },
                { codice: 'F', nome: 'F - Molto freddo' }
            ],
            tipoDetrazione: [
                { codice: 'nessuna', nome: 'Nessuna detrazione' },
                { codice: '50', nome: '50% - Ristrutturazione' },
                { codice: '65', nome: '65% - Risparmio energetico' },
                { codice: '110', nome: '110% - Superbonus' }
            ],
            tipoApertura: [
                { codice: 'F', nome: '🪟 F - Finestra' },
                { codice: 'PF', nome: '🚪 PF - Porta-finestra' }
            ],
            installazione: [
                { codice: 'filo_muro', nome: '🧱 Filo Muro Interno' },
                { codice: 'mazzetta', nome: '📐 In Mazzetta' }
            ],
            materialeEsistente: [
                { codice: 'legno', nome: 'Legno' },
                { codice: 'pvc', nome: 'PVC' },
                { codice: 'alluminio', nome: 'Alluminio' },
                { codice: 'ferro', nome: 'Ferro' },
                { codice: 'legno_alluminio', nome: 'Legno/Alluminio' }
            ],
            vetroEsistente: [
                { codice: 'singolo', nome: 'Singolo' },
                { codice: 'doppio', nome: 'Doppio' },
                { codice: 'triplo', nome: 'Triplo' }
            ]
        };
        
        return FALLBACK[tipoOpzione] || null;
    },
    
    /**
     * Escape HTML per prevenire XSS
     */
    _escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    
    /**
     * Valida codice fiscale italiano (basic)
     */
    validateCodiceFiscale(cf) {
        if (!cf) return { valid: false, error: 'Codice fiscale mancante' };
        cf = cf.toUpperCase().trim();
        if (cf.length !== 16) return { valid: false, error: 'Deve essere di 16 caratteri' };
        const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
        if (!regex.test(cf)) return { valid: false, error: 'Formato non valido' };
        return { valid: true };
    },
    
    /**
     * Valida CAP italiano
     */
    validateCAP(cap) {
        if (!cap) return { valid: false, error: 'CAP mancante' };
        const regex = /^[0-9]{5}$/;
        if (!regex.test(cap)) return { valid: false, error: 'Deve essere di 5 cifre' };
        return { valid: true };
    }
};


// =========================================================================
// EXPORT
// =========================================================================

if (typeof window !== 'undefined') {
    window.UI_FORMS = UI_FORMS;
    console.log('🎨 UI_FORMS v' + UI_FORMS.version + ' caricato');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI_FORMS };
}
