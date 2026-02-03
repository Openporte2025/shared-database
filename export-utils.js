// ═══════════════════════════════════════════════════════════════════════════════
// 📦 EXPORT-UTILS v1.1.0 - Utility centralizzate shared
// ═══════════════════════════════════════════════════════════════════════════════
// Shared tra App Rilievo e Dashboard
// Contiene:
//   - exportPositions() / exportPosition() → export JSON automatico
//   - calculateBRM() → calcolo BRM per TUTTI i prodotti
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // 📦 EXPORT POSIZIONI - Deep clone automatico tutti i campi
    // ═══════════════════════════════════════════════════════════════

    function exportPosition(pos) {
        if (!pos) return null;
        const exported = {};
        for (const [key, value] of Object.entries(pos)) {
            if (value === undefined) continue;
            if (value === null) { exported[key] = null; continue; }
            if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
                exported[key] = value;
                continue;
            }
            if (typeof value === 'object') {
                try { exported[key] = JSON.parse(JSON.stringify(value)); }
                catch (e) { console.warn('⚠️ Export: impossibile clonare "' + key + '"', e); exported[key] = null; }
                continue;
            }
            exported[key] = value;
        }
        return exported;
    }

    function exportPositions(positions) {
        if (!positions || !Array.isArray(positions)) return [];
        return positions.map(pos => exportPosition(pos));
    }

    // ═══════════════════════════════════════════════════════════════
    // 📐 CALCULATE BRM - Calcolo BRM per tutti i prodotti
    // ═══════════════════════════════════════════════════════════════
    // Fallback automatico: se BRM non configurato → usa LF/HF → LVT/HVT
    // ═══════════════════════════════════════════════════════════════

    function calculateBRM(project, pos, misure, brmConfig, tipo) {
        if (!misure) return { L: null, H: null, C: null, B: null };

        // Se brmConfig vuoto/null → fallback diretto a LF/HF
        if (!brmConfig) {
            return {
                L: parseFloat(misure.LF) || parseFloat(misure.LVT) || null,
                H: parseFloat(misure.HF) || parseFloat(misure.HVT) || null,
                C: null,
                B: null
            };
        }

        // Portafinestra?
        const isPortafinestra = tipo && (tipo.includes('PF') || tipo.toUpperCase().includes('PF'));

        // Helper: calcola formula composita (es. "LS+SRSX+SRDX")
        const calcolaMisura = (formula, mis) => {
            if (!formula) return null;
            formula = formula.replace(/\s+/g, '').replace(/[()]/g, '');
            if (formula.includes('+')) {
                let totale = 0;
                for (const parte of formula.split('+')) {
                    const v = parseFloat(mis[parte.trim()]);
                    if (!isNaN(v)) totale += v;
                }
                return totale;
            }
            const v = parseFloat(mis[formula]);
            return isNaN(v) ? null : v;
        };

        // === CALCOLA L ===
        let L = null;
        const lBaseKey = (isPortafinestra && brmConfig.misuraBaseL_PF) ? 'misuraBaseL_PF' : 'misuraBaseL';
        const lOpKey   = (isPortafinestra && brmConfig.misuraBaseL_PF) ? 'operazioneL_PF' : 'operazioneL';
        const lValKey  = (isPortafinestra && brmConfig.misuraBaseL_PF) ? 'valoreL_PF' : 'valoreL';

        if (brmConfig[lBaseKey]) {
            const baseL = calcolaMisura(brmConfig[lBaseKey], misure);
            if (baseL !== null) {
                const valoreL = parseFloat(brmConfig[lValKey]) || 0;
                const isCassonetto = misure.LS !== undefined;

                if (isCassonetto && brmConfig[lOpKey] === '+') {
                    const allPerLato = valoreL / 2;
                    const allSX = (misure.ZSX_tipo === 'muro') ? 0 : allPerLato;
                    const allDX = (misure.ZDX_tipo === 'muro') ? 0 : allPerLato;
                    L = baseL + allSX + allDX;
                } else if (brmConfig[lOpKey] === '+') {
                    L = baseL + valoreL;
                } else {
                    L = baseL - valoreL;
                }
            }
        }

        // === CALCOLA H ===
        let H = null;
        const hBaseKey = (isPortafinestra && brmConfig.misuraBaseH_PF) ? 'misuraBaseH_PF' : 'misuraBaseH';
        const hOpKey   = (isPortafinestra && brmConfig.misuraBaseH_PF) ? 'operazioneH_PF' : 'operazioneH';
        const hValKey  = (isPortafinestra && brmConfig.misuraBaseH_PF) ? 'valoreH_PF' : 'valoreH';

        if (brmConfig[hBaseKey]) {
            const baseH = calcolaMisura(brmConfig[hBaseKey], misure);
            if (baseH !== null) {
                const valoreH = parseFloat(brmConfig[hValKey]) || 0;
                H = (brmConfig[hOpKey] === '+') ? baseH + valoreH : baseH - valoreH;
            }
        }

        // === CALCOLA C (cassonetti) ===
        let C = null;
        if (brmConfig.misuraBaseC) {
            const baseC = calcolaMisura(brmConfig.misuraBaseC, misure);
            if (baseC !== null) {
                const valoreC = parseFloat(brmConfig.valoreC) || 0;
                C = (brmConfig.operazioneC === '+') ? baseC + valoreC : baseC - valoreC;
            }
        }

        // === CALCOLA B (cassonetti) ===
        let B = null;
        if (brmConfig.misuraBaseB) {
            const baseB = calcolaMisura(brmConfig.misuraBaseB, misure);
            if (baseB !== null) {
                const valoreB = parseFloat(brmConfig.valoreB) || 0;
                B = (brmConfig.operazioneB === '+') ? baseB + valoreB : baseB - valoreB;
            }
        }

        // === FALLBACK: se L/H null → usa LF/HF dalle misure ===
        if (L === null) L = parseFloat(misure.LF) || parseFloat(misure.LVT) || null;
        if (H === null) H = parseFloat(misure.HF) || parseFloat(misure.HVT) || null;

        return { L, H, C, B };
    }

    // ═══════════════════════════════════════════════════════════════
    // 📐 GET PRODUCT BRM - Legge BRM da prodotto con fallback misure
    // ═══════════════════════════════════════════════════════════════
    // Usato da Dashboard per TUTTI i prodotti: infissi, tapparelle,
    // persiane, zanzariere, cassonetti, grate
    // 
    // offsets (opzionale): { L: +100, H: +50 } per infissi Finstral
    //   Applicati SOLO quando si usa fallback (BRM non disponibile)
    // ═══════════════════════════════════════════════════════════════

    function getProductBRM(product, pos, offsets) {
        if (!product) return { L: 0, H: 0, C: 0, B: 0, stimato: false, origine: 'none' };

        let L = parseInt(product.BRM_L) || parseInt(product.brm?.L) || 0;
        let H = parseInt(product.BRM_H) || parseInt(product.brm?.H) || parseInt(product.HCASS) || 0;
        let C = parseInt(product.BRM_C) || parseInt(product.C) || 0;
        let B = parseInt(product.BRM_B) || parseInt(product.B) || 0;
        let stimato = false;
        let origine = 'BRM';

        const misure = pos?.misure || {};
        const oL = (offsets && offsets.L) || 0;  // es. +100 per infissi
        const oH = (offsets && offsets.H) || 0;  // es. +50 per infissi

        // Fallback L
        if (!L && misure.LF)  { L = parseInt(misure.LF) + oL;  stimato = true; origine = oL ? `LF+${oL}` : 'LF'; }
        if (!L && misure.LVT) { L = parseInt(misure.LVT) + oL; stimato = true; origine = oL ? `LVT+${oL}` : 'LVT'; }
        if (!L && misure.TMV) { L = parseInt(misure.TMV) - (oL ? 40 : 0); stimato = true; origine = oL ? 'TMV-40' : 'TMV'; }

        // Fallback H
        if (!H && misure.HF)  { H = parseInt(misure.HF) + oH;  stimato = true; }
        if (!H && misure.HVT) { H = parseInt(misure.HVT) + oH; stimato = true; }
        if (!H && misure.HMT) { H = parseInt(misure.HMT) - (oH ? 20 : 0); stimato = true; }

        return { L, H, C, B, stimato, origine };
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════
    window.exportPosition = exportPosition;
    window.exportPositions = exportPositions;
    window.calculateBRM = calculateBRM;
    window.getProductBRM = getProductBRM;

    console.log('✅ EXPORT-UTILS v1.1.0 caricato - Export posizioni + calculateBRM + getProductBRM centralizzati');
})();
