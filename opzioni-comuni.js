/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📦 OPZIONI COMUNI - DATI POSIZIONE/MURO v2.0.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo file contiene SOLO dati di posizione/muro condivisi tra:
 * - App iPad OpenPorte (rilievo-test)
 * - Dashboard Rilievi (dashboard-test)
 * - Editor Posizioni
 * 
 * ⚠️ TUTTI i dati prodotto sono in opzioni-prodotti.js (UNICA FONTE)
 * 
 * Hosting: https://openporte2025.github.io/shared-database/opzioni-comuni.js
 * 
 * v2.1.0 (06/02/2026): LISTA DEFINITIVA - 22 AMBIENTI + 11 PIANI (unica fonte per tutti i file)
 * v2.0.0 (05/02/2026): PULIZIA - migrato tutto prodotto → opzioni-prodotti.js
 * v1.2.0 (20/01/2026): Versione con tutti i dati (ora in opzioni-prodotti.js)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🏷️ AMBIENTI (dati posizione/muro)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const AMBIENTI = [
        'Sala', 'Soggiorno', 'Cucina', 'Camera', 'Stanza', 'Cameretta', 
        'Matrimoniale', 'Disimpegno', 'Studio', 'Ufficio', 
        'Bagno1', 'Bagno2', 'Ripostiglio', 'Lavanderia', 
        'Scala', 'Cantina', 'Garage',
        'Mansarda', 'Terrazzo', 'Balcone', 'Corridoio', 'Ingresso'
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏷️ PIANI (dati posizione/muro)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const PIANI = [
        'Interrato', 'Seminterrato', 'Piano Terra', 'Rialzato',
        'Primo Piano', 'Secondo Piano', 'Terzo Piano', 'Quarto Piano',
        'Quinto Piano', 'Mansarda', 'Sottotetto'
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.OPZIONI = {
        AMBIENTI,
        PIANI,
        // Helper: genera <option> HTML da una lista
        htmlOptions: function(lista, selectedValue, placeholder) {
            let html = placeholder ? `<option value="">${placeholder}</option>` : '';
            lista.forEach(v => {
                html += `<option value="${v}" ${v === selectedValue ? 'selected' : ''}>${v}</option>`;
            });
            return html;
        }
    };
    
    console.log('✅ opzioni-comuni.js v2.1.0 caricato - 22 AMBIENTI + 11 PIANI (unica fonte)');
    
})();
