// ═══════════════════════════════════════════════════════════════════════════════
// 📦 CASSONETTI MODULE v1.0.0 - Configurazione Cassonetti Finstral Centralizzata
// ═══════════════════════════════════════════════════════════════════════════════
// Funzioni condivise tra App Rilievo e Dashboard per:
// - Codici cassonetto per materiale
// - Gruppi colore per materiale
// - Colori specifici per gruppo (PVC/Legno)
// - Isolamento Posaclima
// - Logica sync colore da infisso
// ═══════════════════════════════════════════════════════════════════════════════

window.CASSONETTI_MODULE = {
    VERSION: '1.0.0',

    // ══════════════════════════════════════════════════════════════
    // DATABASE COLORI CASSONETTI FINSTRAL
    // ══════════════════════════════════════════════════════════════

    CODICI: {
        PVC: [
            { code: '148', name: '148 - B≤148mm (standard)' },
            { code: '148B', name: '148B - B 335-600mm' },
            { code: '300', name: '300 - B≤300mm' },
            { code: '300B', name: '300B - B 335-600mm' }
        ],
        Legno: [
            { code: '9-48', name: '9-48 - B≤150mm (L max 2240)' },
            { code: '9-48B', name: '9-48B - B≤600mm (L max 2240)' }
        ]
    },

    GRUPPI_COLORE: {
        PVC: [
            { code: 'bianco', name: '○ Tonalità Bianco (01,42,45,07,27)' },
            { code: 'scuri', name: '● Colori Scuri (06,46,13,19,55)' }
        ],
        Legno: [
            { code: 'legno1', name: 'Gruppo 1 - Abete' },
            { code: 'legno2+3', name: 'Gruppo 2+3 - Rovere (prezzo maggiore)' }
        ]
    },

    COLORI: {
        bianco: [
            { code: '01', name: '01 - Bianco extraliscio' },
            { code: '42', name: '42 - Bianco goffrato' },
            { code: '45', name: '45 - Bianco satinato' },
            { code: '07', name: '07 - Bianco perla goffrato' },
            { code: '27', name: '27 - Bianco perla satinato' }
        ],
        scuri: [
            { code: '06', name: '06 - Grigio' },
            { code: '46', name: '46 - Grigio seta' },
            { code: '13', name: '13 - Decoro legno castagno' },
            { code: '19', name: '19 - Decoro legno rovere' },
            { code: '55', name: '55 - Decoro legno noce chiaro' }
        ],
        legno1: [
            { code: '1X01', name: '1X01 - Abete naturale' },
            { code: '1X03', name: '1X03 - Abete sbiancato bianco' },
            { code: '1X05', name: '1X05 - Abete sbiancato' },
            { code: '1X06', name: '1X06 - Abete grigio beige' },
            { code: '1X07', name: '1X07 - Abete marrone' },
            { code: '1X08', name: '1X08 - Abete bianco perla' }
        ],
        'legno2+3': [
            { code: '2X01', name: '2X01 - Rovere naturale' },
            { code: '2X02', name: '2X02 - Rovere oleato naturale' },
            { code: '3X02', name: '3X02 - Rovere grigio luce' },
            { code: '3X03', name: '3X03 - Rovere grigio sabbia' },
            { code: '3X04', name: '3X04 - Rovere grigio quarzo' },
            { code: '3X05', name: '3X05 - Rovere grigio carbone' },
            { code: '3X06', name: '3X06 - Rovere marrone scuro' },
            { code: '3X07', name: '3X07 - Rovere bianco a poro aperto' },
            { code: '3X08', name: '3X08 - Rovere bianco perla a poro aperto' }
        ]
    },

    ISOLAMENTO: [
        { code: '40830', name: '40830 - 25mm (+63,1€/pz)', prezzo: 63.1 },
        { code: '40831', name: '40831 - 13mm (+47,4€/pz)', prezzo: 47.4 }
    ],

    // ══════════════════════════════════════════════════════════════
    // HELPER: Ottieni lista colori per materiale + gruppo
    // ══════════════════════════════════════════════════════════════

    getColori(materiale, gruppo) {
        if (!gruppo) return [];
        return this.COLORI[gruppo] || [];
    },

    getCodici(materiale) {
        return this.CODICI[materiale] || [];
    },

    getGruppiColore(materiale) {
        return this.GRUPPI_COLORE[materiale] || [];
    },

    getNomeColore(materiale, gruppo, codice) {
        const colori = this.getColori(materiale, gruppo);
        const found = colori.find(c => c.code === codice);
        return found ? found.name : codice || '';
    },

    // ══════════════════════════════════════════════════════════════
    // RENDER: Select HTML per CONFIG GLOBALE
    // ══════════════════════════════════════════════════════════════

    /**
     * Render select codice cassonetto
     * @param {string} projectId
     * @param {string} materiale - 'PVC' | 'Legno'
     * @param {string} current - valore selezionato
     * @param {string} [updateFn] - nome funzione onchange (default: updateConfigCassonetti)
     */
    renderSelectCodice(projectId, materiale, current, updateFn) {
        const fn = updateFn || 'updateConfigCassonetti';
        const codici = this.getCodici(materiale);
        if (codici.length === 0) {
            return '<p class="text-gray-400 text-sm py-2">← Seleziona prima materiale</p>';
        }
        let opts = '<option value="">Seleziona codice...</option>';
        codici.forEach(c => {
            opts += `<option value="${c.code}" ${current === c.code ? 'selected' : ''}>${c.name}</option>`;
        });
        return `<select onchange="${fn}('${projectId}', 'codiceCass', this.value)" class="w-full px-3 py-2 border rounded-lg">${opts}</select>`;
    },

    /**
     * Render select gruppo colore
     */
    renderSelectGruppoColore(projectId, materiale, current, updateFn, doRender) {
        const fn = updateFn || 'updateConfigCassonetti';
        const renderCall = doRender !== false ? '; render();' : '';
        const gruppi = this.getGruppiColore(materiale);
        if (gruppi.length === 0) {
            return '<p class="text-gray-400 text-sm py-2">← Seleziona prima materiale</p>';
        }
        let opts = '<option value="">Seleziona gruppo...</option>';
        gruppi.forEach(g => {
            opts += `<option value="${g.code}" ${current === g.code ? 'selected' : ''}>${g.name}</option>`;
        });
        return `<select onchange="${fn}('${projectId}', 'gruppoColoreCass', this.value)${renderCall}" class="w-full px-3 py-2 border rounded-lg">${opts}</select>`;
    },

    /**
     * Render select colore specifico (con logica sync da infisso)
     * @param {string} projectId
     * @param {string} materiale
     * @param {string} gruppo
     * @param {boolean} syncAttivo - se true, colore da infisso (readonly)
     * @param {string} coloreInfisso - colore dall'infisso
     * @param {string} coloreCass - colore indipendente cassonetto
     * @param {string} [updateFn]
     */
    renderSelectColore(projectId, materiale, gruppo, syncAttivo, coloreInfisso, coloreCass, updateFn) {
        const fn = updateFn || 'updateConfigCassonetti';
        const colori = this.getColori(materiale, gruppo);
        const displayValue = syncAttivo ? coloreInfisso : coloreCass;

        if (colori.length === 0) {
            return '<p class="text-gray-400 text-sm py-2">← Seleziona prima gruppo colore</p>';
        }

        // Sync attivo → campo disabilitato
        if (syncAttivo) {
            const nome = this.getNomeColore(materiale, gruppo, displayValue) || displayValue || 'Da serramento';
            return `<input type="text" value="${nome}" disabled class="w-full px-3 py-2 border rounded-lg bg-blue-100 text-gray-600">`;
        }

        // Sync disattivo → select editabile
        let opts = '<option value="">Seleziona colore...</option>';
        colori.forEach(c => {
            opts += `<option value="${c.code}" ${displayValue === c.code ? 'selected' : ''}>${c.name}</option>`;
        });
        return `<select onchange="${fn}('${projectId}', 'coloreCass', this.value)" class="w-full px-3 py-2 border rounded-lg">${opts}</select>`;
    },

    /**
     * Render select isolamento Posaclima
     */
    renderSelectIsolamento(projectId, current, updateFn) {
        const fn = updateFn || 'updateConfigCassonetti';
        let opts = '<option value="">Seleziona...</option>';
        this.ISOLAMENTO.forEach(i => {
            opts += `<option value="${i.code}" ${current === i.code ? 'selected' : ''}>${i.name}</option>`;
        });
        return `
            <div>
                <label class="block text-sm font-medium mb-1">10. Codice Isolamento</label>
                <select onchange="${fn}('${projectId}', 'codiceIsolamento', this.value)" class="w-full px-3 py-2 border rounded-lg bg-yellow-50">${opts}</select>
                <p class="text-xs text-yellow-600 mt-1">Usb: 0,87 W/m²K con isolamento</p>
            </div>
        `;
    },

    // ══════════════════════════════════════════════════════════════
    // RENDER: Select HTML per POSIZIONE SINGOLA (compact)
    // ══════════════════════════════════════════════════════════════

    renderSelectCodicePos(projectId, posId, materiale, current) {
        const codici = this.getCodici(materiale);
        if (codici.length === 0) {
            return '<span class="text-xs text-gray-400 mt-1 block">← Materiale</span>';
        }
        let opts = '<option value="">--</option>';
        codici.forEach(c => {
            opts += `<option value="${c.code}" ${current === c.code ? 'selected' : ''}>${c.code}</option>`;
        });
        return `<select onchange="updateProduct('${projectId}', '${posId}', 'cassonetto', 'codiceCass', this.value)" class="w-full compact-input border rounded mt-1">${opts}</select>`;
    },

    renderSelectGruppoColorePos(projectId, posId, materiale, current) {
        const gruppi = this.getGruppiColore(materiale);
        if (gruppi.length === 0) {
            return '<span class="text-xs text-gray-400 mt-1 block">← Materiale</span>';
        }
        const shortNames = { bianco: '○ Bianco', scuri: '● Scuri', legno1: 'Gr.1 Abete', 'legno2+3': 'Gr.2+3 Rovere' };
        let opts = '<option value="">--</option>';
        gruppi.forEach(g => {
            opts += `<option value="${g.code}" ${current === g.code ? 'selected' : ''}>${shortNames[g.code] || g.name}</option>`;
        });
        return `<select onchange="updateProduct('${projectId}', '${posId}', 'cassonetto', 'gruppoColoreCass', this.value); render();" class="w-full compact-input border rounded mt-1">${opts}</select>`;
    },

    renderSelectColorePos(projectId, posId, cas, coloreInfisso) {
        const materiale = cas.materialeCass || '';
        const gruppo = cas.gruppoColoreCass || '';
        const syncAttivo = cas.coloreDaInfisso !== false;
        const coloreCass = cas.coloreCass || '';
        const displayValue = syncAttivo ? coloreInfisso : coloreCass;
        const colori = this.getColori(materiale, gruppo);

        if (colori.length === 0) {
            return '<span class="text-xs text-gray-400 mt-1 block">← Gruppo Colore</span>';
        }

        if (syncAttivo) {
            const nome = this.getNomeColore(materiale, gruppo, displayValue) || displayValue || 'Da serramento';
            return `<input type="text" value="${nome}" disabled class="w-full compact-input border rounded mt-1 bg-blue-100 text-gray-600 text-xs">`;
        }

        let opts = '<option value="">--</option>';
        colori.forEach(c => {
            opts += `<option value="${c.code}" ${displayValue === c.code ? 'selected' : ''}>${c.name}</option>`;
        });
        return `<select onchange="updateProduct('${projectId}', '${posId}', 'cassonetto', 'coloreCass', this.value)" class="w-full compact-input border rounded mt-1">${opts}</select>`;
    }
};

console.log(`📦 CASSONETTI_MODULE v${CASSONETTI_MODULE.VERSION} caricato`);
