// ============================================================================
// VALIDATION v1.0.0 - Validazione Centralizzata
// ============================================================================
// Modulo condiviso: App Rilievo + Dashboard + App Posa
// ============================================================================

const VALIDATION = {

    version: '1.0.0',

    // =========================================================================
    // VALIDAZIONE PROGETTO
    // =========================================================================
    
    validateProject(project) {
        const errors = [];
        const warnings = [];
        
        if (!project) return { valid: false, errors: ['Progetto non valido'], warnings, completion: 0 };
        
        if (!project.name && !project.nome) errors.push('Nome progetto mancante');
        
        const cliente = project.cliente || project.clientData || {};
        if (!cliente.nome && !project.client) warnings.push('Nome cliente mancante');
        
        const positions = project.positions || project.posizioni || [];
        if (positions.length === 0) warnings.push('Nessuna posizione');
        
        let posErrors = 0;
        positions.forEach(pos => {
            if (!this.validatePosition(pos).valid) posErrors++;
        });
        if (posErrors > 0) warnings.push(`${posErrors} posizioni incomplete`);
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            completion: this.calculateProjectCompletion(project)
        };
    },

    // =========================================================================
    // VALIDAZIONE POSIZIONE
    // =========================================================================
    
    validatePosition(position, options = {}) {
        if (typeof POSITION_UTILS !== 'undefined') {
            return POSITION_UTILS.validate(position, options);
        }
        
        const errors = [];
        if (!position) return { valid: false, errors: ['Posizione non valida'], warnings: [] };
        if (!position.tipoApertura) errors.push('Tipo apertura mancante');
        if (!position.installazione && !position.posizioneTelaio) errors.push('Installazione mancante');
        
        return { valid: errors.length === 0, errors, warnings: [] };
    },

    // =========================================================================
    // VALIDAZIONE CLIENTE ENEA
    // =========================================================================
    
    validateClienteENEA(project) {
        const errors = [];
        const warnings = [];
        
        const cliente = project.cliente || project.clientData || {};
        const immobile = project.immobile || {};
        
        if (!cliente.nome && !cliente.cognome) errors.push('Nome cliente obbligatorio');
        if (!cliente.codiceFiscale && !cliente.cf) errors.push('Codice fiscale obbligatorio');
        if (!immobile.indirizzo && !cliente.indirizzo) errors.push('Indirizzo obbligatorio');
        if (!immobile.comune && !cliente.comune) errors.push('Comune obbligatorio');
        if (!immobile.zonaClimatica) errors.push('Zona climatica obbligatoria');
        if (!immobile.tipoDetrazione || immobile.tipoDetrazione === 'nessuna') {
            warnings.push('Nessuna detrazione selezionata');
        }
        
        return {
            valid: errors.length === 0,
            ready: errors.length === 0 && immobile.tipoDetrazione && immobile.tipoDetrazione !== 'nessuna',
            errors,
            warnings
        };
    },

    // =========================================================================
    // VERIFICA PRONTO EXPORT
    // =========================================================================
    
    checkReadyForExport(project) {
        const result = { ready: true, missing: [], warnings: [] };
        
        if (!project) return { ready: false, missing: ['Progetto non caricato'], warnings: [] };
        
        const cliente = project.cliente || project.clientData || {};
        if (!cliente.nome && !project.client) {
            result.missing.push('Nome cliente');
            result.ready = false;
        }
        
        const positions = project.positions || project.posizioni || [];
        if (positions.length === 0) {
            result.missing.push('Almeno una posizione');
            result.ready = false;
        }
        
        let incomplete = 0;
        let noMisure = 0;
        positions.forEach(pos => {
            if (!pos.tipoApertura || (!pos.installazione && !pos.posizioneTelaio)) incomplete++;
            const m = pos.misure || {};
            if (!m.LVT && !m.LF && !m.larghezza) noMisure++;
        });
        
        if (incomplete > 0) result.warnings.push(`${incomplete} posizioni incomplete`);
        if (noMisure > 0) result.warnings.push(`${noMisure} posizioni senza misure`);
        
        return result;
    },

    // =========================================================================
    // CALCOLO COMPLETAMENTO
    // =========================================================================
    
    calculateProjectCompletion(project) {
        if (!project) return 0;
        
        let points = 0, max = 100;
        
        // Nome (10pt)
        if (project.name || project.nome) points += 10;
        
        // Cliente (15pt)
        const cliente = project.cliente || project.clientData || {};
        if (cliente.nome || project.client) points += 10;
        if (cliente.telefono || cliente.email) points += 5;
        
        // Prodotti (10pt)
        const prodotti = project.prodotti || {};
        if (Object.values(prodotti).some(v => v === true)) points += 10;
        
        // Posizioni (40pt)
        const positions = project.positions || project.posizioni || [];
        if (positions.length > 0) {
            let posPoints = 0;
            positions.forEach(pos => {
                let pp = 0;
                if (pos.tipoApertura) pp += 25;
                if (pos.installazione || pos.posizioneTelaio) pp += 25;
                const m = pos.misure || {};
                if (m.LVT || m.LF) pp += 25;
                if (m.HVT || m.HF) pp += 25;
                posPoints += pp;
            });
            points += Math.round((posPoints / (positions.length * 100)) * 40);
        }
        
        // Config (15pt)
        if (project.configInfissi?.azienda) points += 5;
        if (project.configPersiane?.azienda) points += 5;
        if (project.configTapparelle?.azienda) points += 5;
        
        // Immobile ENEA (10pt)
        const immobile = project.immobile || {};
        if (immobile.zonaClimatica) points += 5;
        if (immobile.tipoDetrazione) points += 5;
        
        return Math.min(100, points);
    },

    // =========================================================================
    // HELPER
    // =========================================================================
    
    getCompletionStyle(pct) {
        if (pct >= 90) return { icon: '✅', color: '#10b981', label: 'Completo' };
        if (pct >= 70) return { icon: '🟢', color: '#22c55e', label: 'Quasi completo' };
        if (pct >= 50) return { icon: '🟡', color: '#f59e0b', label: 'In corso' };
        if (pct >= 25) return { icon: '🟠', color: '#f97316', label: 'Iniziato' };
        return { icon: '🔴', color: '#ef4444', label: 'Da completare' };
    }
};

// Export
if (typeof window !== 'undefined') {
    window.VALIDATION = VALIDATION;
    console.log('✅ VALIDATION v' + VALIDATION.version + ' caricato');
}
