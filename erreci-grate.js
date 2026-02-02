/**
 * ERRECI GRATE - Modulo Centralizzato Grate Sicurezza
 * 
 * Shared-database: usato da App Rilievo + Dashboard + App Posa
 * 
 * Versione: 1.0.0
 * Data: 02/02/2026
 * 
 * DIPENDENZE:
 * - ERRECI_DATABASE_2025 (shared-database/database/erreci.js) per calcolo prezzi
 * - renderSelectWithCustom() (definita nelle app)
 * - renderRilievoGlobale() (definita nelle app)  
 * - renderBRMConfig() (definita nelle app)
 * - syncConfigToPositions() (definita nelle app)
 * - handleProductSelectWithCustom() (definita nelle app)
 */

// ============================================================
// OPZIONI E COSTANTI
// ============================================================

const GRATE_OPZIONI = {

    // Linee disponibili
    linee: ['EDILIA2', 'EVOLUTA18', 'SIKURA', 'LIBERA'],

    // Modelli per linea
    modelliPerLinea: {
        EDILIA2: [
            'BASIC_T', 'BASIC_Q', 'ROYAL_T', 'ROYAL_Q'
        ],
        EVOLUTA18: [
            'BASIC_T', 'BASIC_Q',
            'ELEGANCE_T', 'ELEGANCE_Q', 'ROYAL_T', 'ROYAL_Q', 'RETRO_T', 'RETRO_Q',
            'PLUS', 'DELUXE', 'ONDA', 'STYLE',
            'LIBERTY_T', 'LIBERTY_Q', 'CLASSIC_T', 'CLASSIC_Q', 'ROMBO_T', 'ROMBO_Q'
        ],
        SIKURA: [
            'BASIC_T', 'BASIC_Q', 'ROYAL_T', 'ROYAL_Q'
        ],
        LIBERA: [
            'BASIC_T', 'BASIC_Q', 'ROYAL_T', 'ROYAL_Q'
        ]
    },

    // Nomi modelli per display
    nomiModelli: {
        'BASIC_T': 'Basic T', 'BASIC_Q': 'Basic Q',
        'ELEGANCE_T': 'Elegance T', 'ELEGANCE_Q': 'Elegance Q',
        'ROYAL_T': 'Royal T', 'ROYAL_Q': 'Royal Q',
        'RETRO_T': 'Retrò T', 'RETRO_Q': 'Retrò Q',
        'PLUS': 'Plus', 'DELUXE': 'Deluxe', 'ONDA': 'Onda', 'STYLE': 'Style',
        'LIBERTY_T': 'Liberty T', 'LIBERTY_Q': 'Liberty Q',
        'CLASSIC_T': 'Classic T', 'CLASSIC_Q': 'Classic Q',
        'ROMBO_T': 'Rombo T', 'ROMBO_Q': 'Rombo Q'
    },

    // Aperture per linea
    aperturePerLinea: {
        EDILIA2: ['1_ACS_180', '1_ASS_180', '2_ACS_180', '2_ASS_180', 'FST'],
        EVOLUTA18: ['1_ACS_180', '1_ASS_180', '1_SC', '2_ACS_180', '2_ASS_180', '2_SC', 'F', 'FST', 'FB'],
        SIKURA: ['1_ACS_180', '1_ASS_180', '2_ACS_180', '2_ASS_180', 'FST'],
        LIBERA: ['1_AP', '2_AP', 'F', 'FST']
    },

    // Nomi aperture per display
    nomiAperture: {
        '1_ACS_180': '1 Anta con Snodo 180°',
        '1_ASS_180': '1 Anta senza Snodo 180°',
        '1_SC': '1 Anta Scorrevole',
        '1_AP': '1 Anta Pieghevole',
        '2_ACS_180': '2 Ante con Snodo 180°',
        '2_ASS_180': '2 Ante senza Snodo 180°',
        '2_SC': '2 Ante Scorrevoli',
        '2_AP': '2 Ante Pieghevoli',
        'F': 'Fissa doppio telaio',
        'FST': 'Fissa telaio semplice',
        'FB': 'Fissa bombata'
    },

    // Tipologie telaio
    tipiTelaio: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],

    // Descrizioni telai
    descTelaio: {
        'A': 'Sup/Inf a filo 40mm',
        'B': 'Sup 40mm, Inf 20mm',
        'C': 'Personalizzabile X+Y (default 40mm)',
        'D': 'Sup ribassato (Y), Inf 20mm',
        'E': 'Sup a filo, Inf rialzato (X)',
        'F': 'Sup (Y da 0), Inf 10mm - Recupero tappi 4mm',
        'G': 'Sup ribassato (Y), Inf a filo'
    },

    // Colori standard
    colori: [
        'Verde Marmo', 'Marrone Marmo', 'Grigio Marmo', 'Bianco Marmo',
        'Grigio Micaceo', 'Nero Micaceo', 'Argento Micaceo',
        'Nero Martellato', 'Rame Martellato', 'Verde Ramato Martellato',
        'Grigio 400 Sablé', 'Ruggine',
        'RAL 6009 ruvido', 'RAL 6005 ruvido', 'RAL 7035 ruvido',
        'RAL 8017 ruvido', 'RAL 9005 ruvido', 'RAL 1013 ruvido', 'RAL 9010 ruvido'
    ],

    // Accessori disponibili
    accessori: [
        { id: 'predisposizione', nome: 'Predisposizione allarme' },
        { id: 'sensoreIntegrato', nome: 'Sensore integrato' },
        { id: 'sensoreVolumetrico', nome: 'Sensore volumetrico' },
        { id: 'predisposizioneZanzVertical', nome: 'Predisposizione zanzariera verticale' },
        { id: 'predisposizioneZanzOrizzontale', nome: 'Predisposizione zanzariera orizzontale' },
        { id: 'chiavistelloPersiana', nome: 'Chiavistello persiana' },
        { id: 'supportoGrataFissa', nome: 'Supporto grata fissa' }
    ],

    // Altezza cilindro
    altezzeCilindro: [
        { value: '600', label: 'Finestra (600mm)' },
        { value: '1100', label: 'Porta (1100mm)' }
    ]
};


// ============================================================
// TEMPLATE CONFIG GLOBALE
// ============================================================

const GRATE_CONFIG_TEMPLATE = {
    azienda: 'Erreci',
    linea: '',
    modello: '',
    tipoApertura: '',
    colore: '',
    tipoTelaio: 'A',
    snodo: '400',
    altezzaCilindro: '600',
    accessori: []
};


// ============================================================
// TEMPLATE PRODOTTO POSIZIONE
// ============================================================

const GRATE_PRODUCT_TEMPLATE = {
    id: '',
    qta: '1',
    azienda: 'Erreci',
    linea: '',
    modello: '',
    tipoApertura: '',
    colore: '',
    tipoTelaio: 'A',
    snodo: '400',
    altezzaCilindro: '600',
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
 * Crea grata da config globale (come addPersiana)
 * @param {Object} project
 * @param {Object} pos
 * @param {Function} calculateBRM - funzione BRM dell'app
 * @param {Function} generateId - funzione ID dell'app
 * @returns {Object} oggetto grata
 */
function createGrataFromConfig(project, pos, calculateBRM, generateId) {
    const config = project.configGrate || {};
    const brm = calculateBRM ? calculateBRM(project, pos, pos.misure, project.brmConfigGrate) : { L: 0, H: 0 };
    
    return {
        id: generateId ? generateId() : `grata-${Date.now()}`,
        qta: '1',
        azienda: config.azienda || 'Erreci',
        linea: config.linea || '',
        modello: config.modello || '',
        tipoApertura: config.tipoApertura || '',
        colore: config.colore || '',
        tipoTelaio: config.tipoTelaio || 'A',
        snodo: config.snodo || '400',
        altezzaCilindro: config.altezzaCilindro || '600',
        accessori: config.accessori ? [...config.accessori] : [],
        BRM_L: brm.L,
        BRM_H: brm.H,
        note: '',
        foto: []
    };
}

/**
 * Normalizza grata per export (come normalizzaPersiana)
 */
function normalizzaGrata(grata, project) {
    if (!grata) return null;
    const config = project?.configGrate || {};
    return {
        id: grata.id || '',
        qta: grata.qta || '1',
        azienda: grata.azienda || config.azienda || 'Erreci',
        linea: grata.linea || config.linea || '',
        modello: grata.modello || config.modello || '',
        tipoApertura: grata.tipoApertura || config.tipoApertura || '',
        colore: grata.colore || config.colore || '',
        tipoTelaio: grata.tipoTelaio || config.tipoTelaio || 'A',
        snodo: grata.snodo || config.snodo || '400',
        altezzaCilindro: grata.altezzaCilindro || config.altezzaCilindro || '600',
        accessori: grata.accessori || config.accessori || [],
        BRM_L: grata.BRM_L || 0,
        BRM_H: grata.BRM_H || 0,
        note: grata.note || '',
        foto: grata.foto || []
    };
}

/**
 * Ottieni modelli filtrati per linea selezionata
 */
function getModelliPerLinea(linea) {
    const modelli = GRATE_OPZIONI.modelliPerLinea[linea] || [];
    return modelli.map(id => ({
        value: id,
        label: GRATE_OPZIONI.nomiModelli[id] || id
    }));
}

/**
 * Ottieni aperture filtrate per linea selezionata
 */
function getAperturePerLinea(linea) {
    const aperture = GRATE_OPZIONI.aperturePerLinea[linea] || [];
    return aperture.map(id => ({
        value: id,
        label: GRATE_OPZIONI.nomiAperture[id] || id
    }));
}


// ============================================================
// FUNZIONI RENDER - CONFIG GLOBALE (Step Wizard)
// ============================================================

/**
 * Render form config globale grate (per wizard App Rilievo)
 * Usa renderSelectWithCustom, renderRilievoGlobale, renderBRMConfig dell'app
 */
function renderConfigGrateGlobale(project) {
    if (!project.prodotti?.grate) {
        return '<div class="text-center py-8"><p class="text-gray-500">Le grate non sono state selezionate. Salta questo step.</p></div>';
    }

    const config = project.configGrate || {};
    const lineaCorrente = config.linea || '';
    const modelliOptions = lineaCorrente ? getModelliPerLinea(lineaCorrente) : [];
    const apertureOptions = lineaCorrente ? getAperturePerLinea(lineaCorrente) : [];

    return `
        <div>
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span class="text-2xl">🔒</span> Configurazione Grate Sicurezza Default
            </h2>
            <p class="text-gray-600 mb-4">Imposta i valori di default per tutte le grate:</p>
            
            <div class="space-y-2 mt-4">
                <div class="grid md:grid-cols-2 gap-2">
                    <!-- 1. AZIENDA -->
                    ${typeof renderSelectWithCustom === 'function' ? renderSelectWithCustom(
                        'azienda',
                        config.azienda || 'Erreci',
                        ['Erreci'],
                        project.id,
                        null,
                        'grata',
                        '1. Azienda'
                    ) : ''}

                    <!-- 2. LINEA -->
                    <div>
                        <label class="block text-sm font-medium mb-1">2. Linea</label>
                        <select onchange="updateConfigGrate('${project.id}', 'linea', this.value); render();"
                                class="w-full px-3 py-2 border rounded-lg">
                            <option value="">Seleziona linea...</option>
                            ${GRATE_OPZIONI.linee.map(l => `
                                <option value="${l}" ${lineaCorrente === l ? 'selected' : ''}>${l}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                ${lineaCorrente ? `
                <div class="grid md:grid-cols-2 gap-2">
                    <!-- 3. MODELLO -->
                    <div>
                        <label class="block text-sm font-medium mb-1">3. Modello</label>
                        <select onchange="updateConfigGrate('${project.id}', 'modello', this.value)"
                                class="w-full px-3 py-2 border rounded-lg">
                            <option value="">Seleziona modello...</option>
                            ${modelliOptions.map(m => `
                                <option value="${m.value}" ${config.modello === m.value ? 'selected' : ''}>${m.label}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- 4. TIPO APERTURA -->
                    <div>
                        <label class="block text-sm font-medium mb-1">4. Tipo Apertura</label>
                        <select onchange="updateConfigGrate('${project.id}', 'tipoApertura', this.value)"
                                class="w-full px-3 py-2 border rounded-lg">
                            <option value="">Seleziona apertura...</option>
                            ${apertureOptions.map(a => `
                                <option value="${a.value}" ${config.tipoApertura === a.value ? 'selected' : ''}>${a.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-2">
                    <!-- 5. COLORE -->
                    ${typeof renderSelectWithCustom === 'function' ? renderSelectWithCustom(
                        'colore',
                        config.colore || '',
                        GRATE_OPZIONI.colori,
                        project.id,
                        null,
                        'grata',
                        '5. Colore'
                    ) : ''}

                    <!-- 6. TIPO TELAIO -->
                    <div>
                        <label class="block text-sm font-medium mb-1">6. Tipo Telaio</label>
                        <select onchange="updateConfigGrate('${project.id}', 'tipoTelaio', this.value)"
                                class="w-full px-3 py-2 border rounded-lg">
                            ${GRATE_OPZIONI.tipiTelaio.map(t => `
                                <option value="${t}" ${(config.tipoTelaio || 'A') === t ? 'selected' : ''}>${t} - ${GRATE_OPZIONI.descTelaio[t]}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- 7. ALTEZZA CILINDRO -->
                    <div>
                        <label class="block text-sm font-medium mb-1">7. Altezza Cilindro</label>
                        <select onchange="updateConfigGrate('${project.id}', 'altezzaCilindro', this.value)"
                                class="w-full px-3 py-2 border rounded-lg">
                            ${GRATE_OPZIONI.altezzeCilindro.map(a => `
                                <option value="${a.value}" ${(config.altezzaCilindro || '600') === a.value ? 'selected' : ''}>${a.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- SNODO (solo per aperture con snodo) -->
                ${(config.tipoApertura || '').includes('ACS') ? `
                <div class="grid md:grid-cols-2 gap-2">
                    <div>
                        <label class="block text-sm font-medium mb-1">Snodo (mm)</label>
                        <input type="number" value="${config.snodo || '400'}" min="180" max="600"
                               onchange="updateConfigGrate('${project.id}', 'snodo', this.value)"
                               class="w-full px-3 py-2 border rounded-lg"
                               placeholder="400mm default, min 180mm">
                    </div>
                </div>
                ` : ''}
                ` : '<p class="text-sm text-gray-400 mt-2">Seleziona una linea per configurare modello e apertura.</p>'}
            </div>
            
            ${typeof renderBRMConfig === 'function' ? renderBRMConfig(project, 'grate', 'Grate', '🔒') : ''}
        </div>
    `;
}


// ============================================================
// FUNZIONI RENDER - TAB POSIZIONE
// ============================================================

/**
 * Render tab grata nella posizione (come renderPersianeTab)
 */
function renderGrataTab(project, pos) {
    const grata = pos.grata;

    return `
        <div class="space-y-4">
            ${!grata ? `
                <!-- STATO INIZIALE: Prodotto non ancora creato -->
                <div class="text-center py-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p class="text-gray-700 mb-4 font-medium text-lg">Nessuna grata configurata</p>
                    <div class="flex flex-col items-center gap-3">
                        ${!pos.prodottiAssenti?.includes('grata') ? `
                            <button onclick="addGrata('${project.id}', '${pos.id}')"
                                    class="px-6 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 shadow-sm hover:shadow-md transition-all">
                                + Aggiungi Grata
                            </button>
                        ` : ''}
                        <label class="flex items-center gap-2 cursor-pointer text-sm bg-white px-4 py-2 rounded-lg border-2 border-yellow-400 shadow-sm hover:shadow-md transition-shadow">
                            <input type="checkbox" 
                                   ${pos.prodottiAssenti?.includes('grata') ? 'checked' : ''}
                                   onchange="toggleProdottoAssente('${project.id}', '${pos.id}', 'grate')"
                                   class="w-4 h-4">
                            <span class="text-gray-700 font-medium">⚠️ Non presente in questa posizione</span>
                        </label>
                    </div>
                </div>
            ` : (parseInt(grata.qta) === 0 || grata.qta === '0' || grata.qta === 0) ? `
                <!-- QTA = 0 -->
                <div class="product-card">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-semibold text-red-700 text-lg">🔒 Grata Sicurezza</h4>
                        <button onclick="deleteProduct('${project.id}', '${pos.id}', 'grata')"
                                class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700">
                            🗑️ Elimina
                        </button>
                    </div>
                    <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                        <p class="text-sm text-gray-600 mb-3">
                            💡 <strong>Quantità = 0</strong> → Aumenta la quantità per configurare.
                        </p>
                        <div class="max-w-xs">
                            <label class="text-xs font-medium block mb-1">Quantità</label>
                            <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'qta', this.value)"
                                    class="w-full compact-input border rounded font-semibold">
                                ${[0,1,2,3,4,5].map(n => `
                                    <option value="${n}" ${(grata.qta || '1') == n ? 'selected' : ''}>${n}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>
            ` : renderGrataForm(project, pos, grata)}
        </div>
    `;
}

/**
 * Render form completo grata (quando qta > 0)
 */
function renderGrataForm(project, pos, grata) {
    const lineaCorrente = grata.linea || '';
    const modelliOptions = lineaCorrente ? getModelliPerLinea(lineaCorrente) : [];
    const apertureOptions = lineaCorrente ? getAperturePerLinea(lineaCorrente) : [];
    const mostraSnodo = (grata.tipoApertura || '').includes('ACS');

    return `
        <div class="product-card">
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-red-700 text-lg">🔒 Grata Sicurezza</h4>
                <div class="flex gap-2">
                    <button onclick="ricaricaGrataDaGlobali('${project.id}', '${pos.id}')"
                            class="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
                            title="Ricarica configurazione da Config Globali">
                        🔄 Ricarica
                    </button>
                    <button onclick="deleteProduct('${project.id}', '${pos.id}', 'grata')"
                            class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700">
                        🗑️ Elimina
                    </button>
                </div>
            </div>

            <!-- 📋 DATI SPECIFICI -->
            <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-3">
                <h5 class="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    📋 Dati Specifici
                </h5>
                <div class="grid md:grid-cols-3 gap-3">
                    <div>
                        <label class="text-xs font-medium">Quantità</label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'qta', this.value)"
                                class="w-full compact-input border rounded mt-1 font-semibold">
                            ${[0,1,2,3,4,5].map(n => `
                                <option value="${n}" ${(grata.qta || '1') == n ? 'selected' : ''}>${n}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium">Linea <span class="text-red-600">*</span></label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'linea', this.value); render();"
                                class="w-full compact-input ${!lineaCorrente ? 'border-2 border-orange-400 bg-orange-50' : 'border'} rounded mt-1">
                            <option value="">-- Seleziona --</option>
                            ${GRATE_OPZIONI.linee.map(l => `
                                <option value="${l}" ${lineaCorrente === l ? 'selected' : ''}>${l}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium">Tipo Apertura <span class="text-red-600">*</span></label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'tipoApertura', this.value); render();"
                                class="w-full compact-input ${!grata.tipoApertura ? 'border-2 border-orange-400 bg-orange-50' : 'border'} rounded mt-1">
                            <option value="">-- Seleziona --</option>
                            ${apertureOptions.map(a => `
                                <option value="${a.value}" ${grata.tipoApertura === a.value ? 'selected' : ''}>${a.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <!-- ⚙️ CONFIGURAZIONE -->
            <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-3">
                <h5 class="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    ⚙️ Configurazione
                </h5>
                <div class="grid md:grid-cols-3 gap-3">
                    <!-- AZIENDA -->
                    ${typeof renderSelectWithCustom === 'function' ? renderSelectWithCustom(
                        'azienda',
                        grata.azienda || 'Erreci',
                        ['Erreci'],
                        project.id,
                        pos.id,
                        'grata',
                        'Azienda'
                    ) : ''}

                    <!-- MODELLO -->
                    <div>
                        <label class="text-xs font-medium">Modello</label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'modello', this.value)"
                                class="w-full compact-input border rounded mt-1">
                            <option value="">-- Seleziona --</option>
                            ${modelliOptions.map(m => `
                                <option value="${m.value}" ${grata.modello === m.value ? 'selected' : ''}>${m.label}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- COLORE -->
                    ${typeof renderSelectWithCustom === 'function' ? renderSelectWithCustom(
                        'colore',
                        grata.colore || '',
                        GRATE_OPZIONI.colori,
                        project.id,
                        pos.id,
                        'grata',
                        'Colore'
                    ) : ''}

                    <!-- TIPO TELAIO -->
                    <div>
                        <label class="text-xs font-medium">Tipo Telaio</label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'tipoTelaio', this.value)"
                                class="w-full compact-input border rounded mt-1">
                            ${GRATE_OPZIONI.tipiTelaio.map(t => `
                                <option value="${t}" ${(grata.tipoTelaio || 'A') === t ? 'selected' : ''}>${t} - ${GRATE_OPZIONI.descTelaio[t]}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- ALTEZZA CILINDRO -->
                    <div>
                        <label class="text-xs font-medium">Altezza Cilindro</label>
                        <select onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'altezzaCilindro', this.value)"
                                class="w-full compact-input border rounded mt-1">
                            ${GRATE_OPZIONI.altezzeCilindro.map(a => `
                                <option value="${a.value}" ${(grata.altezzaCilindro || '600') === a.value ? 'selected' : ''}>${a.label}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- SNODO (condizionale) -->
                    ${mostraSnodo ? `
                    <div>
                        <label class="text-xs font-medium">Snodo (mm)</label>
                        <input type="number" value="${grata.snodo || '400'}" min="180" max="600"
                               onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'snodo', this.value)"
                               class="w-full compact-input border rounded mt-1"
                               placeholder="400mm">
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- 🔧 ACCESSORI -->
            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-3">
                <h5 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    🔧 Accessori
                </h5>
                <div class="grid md:grid-cols-2 gap-2">
                    ${GRATE_OPZIONI.accessori.map(acc => `
                        <label class="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border ${(grata.accessori || []).includes(acc.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}">
                            <input type="checkbox" 
                                   ${(grata.accessori || []).includes(acc.id) ? 'checked' : ''}
                                   onchange="toggleAccessorioGrata('${project.id}', '${pos.id}', '${acc.id}')"
                                   class="w-4 h-4">
                            <span class="text-sm">${acc.nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- 📐 BRM -->
            <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-3">
                <h5 class="font-semibold text-green-800 mb-3">📐 BRM Grata</h5>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-medium">BRM Larghezza (mm)</label>
                        <input type="number" value="${grata.BRM_L || ''}"
                               onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'BRM_L', parseInt(this.value) || 0)"
                               class="w-full compact-input border rounded mt-1"
                               placeholder="Larghezza foro muro">
                    </div>
                    <div>
                        <label class="text-xs font-medium">BRM Altezza (mm)</label>
                        <input type="number" value="${grata.BRM_H || ''}"
                               onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'BRM_H', parseInt(this.value) || 0)"
                               class="w-full compact-input border rounded mt-1"
                               placeholder="Altezza foro muro">
                    </div>
                </div>
                ${grata.BRM_L > 0 && grata.BRM_H > 0 ? `
                <div class="mt-2 text-xs text-green-700">
                    ${grata.BRM_H > 1750 ? '⚠️ Traverso intermedio obbligatorio (H > 1750mm)' : '✅ Traverso non necessario'}
                </div>
                ` : ''}
            </div>

            <!-- NOTE -->
            <div>
                <label class="text-xs font-medium">Note</label>
                <textarea onchange="updateProduct('${project.id}', '${pos.id}', 'grata', 'note', this.value)"
                          class="w-full compact-input border rounded mt-1" rows="2"
                          placeholder="Note aggiuntive...">${grata.note || ''}</textarea>
            </div>
        </div>
    `;
}


// ============================================================
// FUNZIONE CALCOLO PREZZO (per Dashboard)
// ============================================================

/**
 * Calcola prezzo grata usando ERRECI_DATABASE_2025
 * @returns {Object} risultato con prezzo e dettagli
 */
function calcolaPrezzoGrata(grata, pos) {
    if (!grata || !grata.linea || !grata.modello || !grata.tipoApertura) {
        return { errore: 'Dati grata incompleti (linea/modello/apertura)' };
    }

    // BRM fallback
    let L = parseInt(grata.BRM_L) || 0;
    let H = parseInt(grata.BRM_H) || 0;
    if (!L && pos?.misure?.LI) L = parseInt(pos.misure.LI);
    if (!H && pos?.misure?.HI) H = parseInt(pos.misure.HI);

    if (!L || !H) {
        return { errore: `Dimensioni mancanti: L=${L}, H=${H}` };
    }

    // Usa il database unificato Erreci
    if (typeof calcolaPrezzoGrataErreci === 'function') {
        return calcolaPrezzoGrataErreci(grata.linea, grata.modello, grata.tipoApertura, L, H);
    }

    return { errore: 'ERRECI_DATABASE_2025 non caricato' };
}


// ============================================================
// EXPORT GLOBALE
// ============================================================

window.GRATE_MODULE = {
    // Opzioni
    OPZIONI: GRATE_OPZIONI,
    CONFIG_TEMPLATE: GRATE_CONFIG_TEMPLATE,
    PRODUCT_TEMPLATE: GRATE_PRODUCT_TEMPLATE,
    
    // Funzioni dati
    createFromConfig: createGrataFromConfig,
    normalizza: normalizzaGrata,
    getModelliPerLinea: getModelliPerLinea,
    getAperturePerLinea: getAperturePerLinea,
    
    // Funzioni render
    renderConfigGlobale: renderConfigGrateGlobale,
    renderTab: renderGrataTab,
    renderForm: renderGrataForm,
    
    // Calcolo prezzo
    calcolaPrezzo: calcolaPrezzoGrata
};

// Esporta anche le costanti per accesso diretto
window.GRATE_OPZIONI = GRATE_OPZIONI;
