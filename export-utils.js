// ═══════════════════════════════════════════════════════════════════════════════
// 📦 EXPORT-UTILS v1.0.0 - Export centralizzato posizioni
// ═══════════════════════════════════════════════════════════════════════════════
// Shared tra App Rilievo e Dashboard
// OGNI prodotto aggiunto alla posizione viene esportato AUTOMATICAMENTE
// Non serve più modificare l'export per ogni nuovo prodotto!
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    /**
     * Esporta una posizione in formato JSON-safe (deep clone)
     * Include AUTOMATICAMENTE tutti i campi presenti nella posizione
     * @param {Object} pos - Posizione da esportare
     * @returns {Object} Posizione clonata pronta per JSON.stringify
     */
    function exportPosition(pos) {
        if (!pos) return null;
        
        const exported = {};
        
        for (const [key, value] of Object.entries(pos)) {
            // Salta undefined
            if (value === undefined) continue;
            
            // null → preserva (prodotto non presente)
            if (value === null) {
                exported[key] = null;
                continue;
            }
            
            // Booleani e numeri → copia diretta
            if (typeof value === 'boolean' || typeof value === 'number') {
                exported[key] = value;
                continue;
            }
            
            // Stringhe → copia diretta
            if (typeof value === 'string') {
                exported[key] = value;
                continue;
            }
            
            // Oggetti e Array → deep clone via JSON
            if (typeof value === 'object') {
                try {
                    exported[key] = JSON.parse(JSON.stringify(value));
                } catch (e) {
                    console.warn(`⚠️ Export: impossibile clonare campo "${key}"`, e);
                    exported[key] = null;
                }
                continue;
            }
            
            // Fallback
            exported[key] = value;
        }
        
        return exported;
    }

    /**
     * Esporta array di posizioni
     * @param {Array} positions - Array posizioni
     * @returns {Array} Array posizioni esportate
     */
    function exportPositions(positions) {
        if (!positions || !Array.isArray(positions)) return [];
        return positions.map(pos => exportPosition(pos));
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════
    window.exportPosition = exportPosition;
    window.exportPositions = exportPositions;

    console.log('✅ EXPORT-UTILS v1.0.0 caricato - Export posizioni centralizzato');
})();
