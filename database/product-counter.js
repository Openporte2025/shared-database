// ============================================================================
// PRODUCT_COUNTER v1.0.0 - Conteggio Prodotti Centralizzato
// ============================================================================
// Modulo condiviso: App Rilievo + Dashboard + App Posa
// Una sola logica di conteggio per tutti!
// ============================================================================

const PRODUCT_COUNTER = {

    version: '1.0.0',

    // =========================================================================
    // CONTEGGIO SINGOLO PRODOTTO
    // =========================================================================
    
    /**
     * Ottiene quantità di un prodotto (usa DATA_ACCESSOR se disponibile)
     * @param {Object} prodotto - Oggetto prodotto (infisso, persiana, etc.)
     * @returns {number} Quantità (default 1 se esiste, 0 se non esiste)
     */
    getQuantita(prodotto) {
        if (!prodotto) return 0;
        
        // Usa DATA_ACCESSOR se disponibile
        if (typeof DATA_ACCESSOR !== 'undefined') {
            return DATA_ACCESSOR.getQuantita(prodotto);
        }
        
        // Fallback: leggi da vari campi possibili
        const qta = prodotto.quantita || prodotto.qta || prodotto.quantity || 1;
        return parseInt(qta) || 1;
    },

    // =========================================================================
    // CONTEGGIO PER POSIZIONE
    // =========================================================================
    
    /**
     * Conta prodotti in una singola posizione
     * @param {Object} pos - Posizione
     * @returns {Object} { infissi, persiane, tapparelle, zanzariere, cassonetti, totale }
     */
    countPosition(pos) {
        if (!pos) return this._emptyCount();
        
        return {
            infissi: pos.infisso ? this.getQuantita(pos.infisso) : 0,
            persiane: pos.persiana ? this.getQuantita(pos.persiana) : 0,
            tapparelle: pos.tapparella ? this.getQuantita(pos.tapparella) : 0,
            zanzariere: pos.zanzariera ? this.getQuantita(pos.zanzariera) : 0,
            cassonetti: pos.cassonetto ? this.getQuantita(pos.cassonetto) : 0,
            get totale() {
                return this.infissi + this.persiane + this.tapparelle + this.zanzariere + this.cassonetti;
            }
        };
    },

    // =========================================================================
    // CONTEGGIO PER PROGETTO
    // =========================================================================
    
    /**
     * Conta tutti i prodotti di un progetto
     * @param {Object} project - Progetto con positions/posizioni
     * @returns {Object} Totali per tipo + statistiche
     */
    countProject(project) {
        if (!project) return this._emptyStats();
        
        const positions = project.positions || project.posizioni || [];
        
        let totaleInfissi = 0;
        let totalePersiane = 0;
        let totaleTapparelle = 0;
        let totaleZanzariere = 0;
        let totaleCassonetti = 0;
        
        let posizioniConInfissi = 0;
        let posizioniConPersiane = 0;
        let posizioniConTapparelle = 0;
        let posizioniConZanzariere = 0;
        let posizioniConCassonetti = 0;
        
        const pianiSet = new Set();
        const ambientiSet = new Set();
        
        positions.forEach(pos => {
            const count = this.countPosition(pos);
            
            // Somma quantità
            totaleInfissi += count.infissi;
            totalePersiane += count.persiane;
            totaleTapparelle += count.tapparelle;
            totaleZanzariere += count.zanzariere;
            totaleCassonetti += count.cassonetti;
            
            // Conta posizioni che hanno il prodotto
            if (count.infissi > 0) posizioniConInfissi++;
            if (count.persiane > 0) posizioniConPersiane++;
            if (count.tapparelle > 0) posizioniConTapparelle++;
            if (count.zanzariere > 0) posizioniConZanzariere++;
            if (count.cassonetti > 0) posizioniConCassonetti++;
            
            // Raccogli piani e ambienti
            if (pos.piano) pianiSet.add(pos.piano);
            if (pos.ambiente || pos.stanza) ambientiSet.add(pos.ambiente || pos.stanza);
        });
        
        const totaleProdotti = totaleInfissi + totalePersiane + totaleTapparelle + totaleZanzariere + totaleCassonetti;
        
        return {
            // Quantità totali (usa questi per preventivi!)
            totaleInfissi,
            totalePersiane,
            totaleTapparelle,
            totaleZanzariere,
            totaleCassonetti,
            totaleProdotti,
            
            // Conteggio posizioni (quante posizioni hanno quel prodotto)
            posizioniConInfissi,
            posizioniConPersiane,
            posizioniConTapparelle,
            posizioniConZanzariere,
            posizioniConCassonetti,
            
            // Statistiche generali
            totalePosizioni: positions.length,
            numeroPiani: pianiSet.size,
            numeroAmbienti: ambientiSet.size,
            
            // Percentuali (per grafici)
            percentualeInfissi: totaleProdotti > 0 ? Math.round((totaleInfissi / totaleProdotti) * 100) : 0,
            percentualePersiane: totaleProdotti > 0 ? Math.round((totalePersiane / totaleProdotti) * 100) : 0,
            percentualeTapparelle: totaleProdotti > 0 ? Math.round((totaleTapparelle / totaleProdotti) * 100) : 0,
            percentualeZanzariere: totaleProdotti > 0 ? Math.round((totaleZanzariere / totaleProdotti) * 100) : 0,
            percentualeCassonetti: totaleProdotti > 0 ? Math.round((totaleCassonetti / totaleProdotti) * 100) : 0
        };
    },

    // =========================================================================
    // CONTEGGIO SPECIFICO PER TIPO
    // =========================================================================
    
    /**
     * Conta solo infissi di un progetto
     */
    countInfissi(project) {
        return this.countProject(project).totaleInfissi;
    },
    
    /**
     * Conta solo persiane di un progetto
     */
    countPersiane(project) {
        return this.countProject(project).totalePersiane;
    },
    
    /**
     * Conta solo tapparelle di un progetto
     */
    countTapparelle(project) {
        return this.countProject(project).totaleTapparelle;
    },
    
    /**
     * Conta solo zanzariere di un progetto
     */
    countZanzariere(project) {
        return this.countProject(project).totaleZanzariere;
    },
    
    /**
     * Conta solo cassonetti di un progetto
     */
    countCassonetti(project) {
        return this.countProject(project).totaleCassonetti;
    },
    
    /**
     * 🆕 Conta posizioni di un progetto (gestisce entrambi i nomi)
     */
    countPositions(project) {
        if (!project) return 0;
        const positions = project.positions || project.posizioni || [];
        return positions.length;
    },
    
    /**
     * 🆕 Ottiene array posizioni (gestisce entrambi i nomi)
     */
    getPositions(project) {
        if (!project) return [];
        return project.positions || project.posizioni || [];
    },

    // =========================================================================
    // HELPER
    // =========================================================================
    
    _emptyCount() {
        return { infissi: 0, persiane: 0, tapparelle: 0, zanzariere: 0, cassonetti: 0, totale: 0 };
    },
    
    _emptyStats() {
        return {
            totaleInfissi: 0, totalePersiane: 0, totaleTapparelle: 0,
            totaleZanzariere: 0, totaleCassonetti: 0, totaleProdotti: 0,
            posizioniConInfissi: 0, posizioniConPersiane: 0, posizioniConTapparelle: 0,
            posizioniConZanzariere: 0, posizioniConCassonetti: 0,
            totalePosizioni: 0, numeroPiani: 0, numeroAmbienti: 0,
            percentualeInfissi: 0, percentualePersiane: 0, percentualeTapparelle: 0,
            percentualeZanzariere: 0, percentualeCassonetti: 0
        };
    },
    
    /**
     * Formatta conteggio per display
     */
    formatCount(project, options = {}) {
        const stats = this.countProject(project);
        const parts = [];
        
        if (stats.totaleInfissi > 0) parts.push(`🪟 ${stats.totaleInfissi} infissi`);
        if (stats.totalePersiane > 0) parts.push(`🚪 ${stats.totalePersiane} persiane`);
        if (stats.totaleTapparelle > 0) parts.push(`🎚️ ${stats.totaleTapparelle} tapparelle`);
        if (stats.totaleZanzariere > 0) parts.push(`🦟 ${stats.totaleZanzariere} zanzariere`);
        if (stats.totaleCassonetti > 0) parts.push(`📦 ${stats.totaleCassonetti} cassonetti`);
        
        if (options.separator) {
            return parts.join(options.separator);
        }
        return parts.join(' | ');
    }
};

// Export
if (typeof window !== 'undefined') {
    window.PRODUCT_COUNTER = PRODUCT_COUNTER;
    console.log('📊 PRODUCT_COUNTER v' + PRODUCT_COUNTER.version + ' caricato');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCT_COUNTER };
}
