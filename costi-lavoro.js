// ═══════════════════════════════════════════════════════════════════════════
// 🔧 COSTI LAVORO 2025 - Posa, Smontaggio, Smaltimento, Componenti
// Fonte: COSTI-LAVORO-2025.md
// ═══════════════════════════════════════════════════════════════════════════
const COSTI_LAVORO = {
    // POSA IN OPERA (€/pezzo)
    posa: {
finestra: 200,
portafinestra: 250,
scorrevole: 300,
portoncino: 350,
blindata: 350,
persiana: 80,
tapparella: 120,      // Completa
cassonetto: 80,
zanzariera: 40,
motore: 60
    },
    // SMONTAGGIO (€/pezzo)
    smontaggio: {
finestra: 40,
portafinestra: 60,
scorrevole: 80,
portoncino: 100,
blindata: 100,
persiana: 30,
tapparella: 40,
cassonetto: 50,
zanzariera: 0,
motore: 0
    },
    // SMALTIMENTO (€/pezzo)
    smaltimento: {
finestra: 30,
portafinestra: 50,
scorrevole: 70,
portoncino: 80,
blindata: 80,
persiana: 25,
tapparella: 20,
cassonetto: 30,
zanzariera: 0,
motore: 0
    },
    // COMPONENTI POSA (€/pezzo)
    componenti: {
finestra: 35,
portafinestra: 45,
scorrevole: 60,
portoncino: 50,
blindata: 50,
persiana: 15,
tapparella: 20,
cassonetto: 15,
zanzariera: 10,
motore: 5
    },
    
    // Determina tipo prodotto da stringa
    getTipoProdotto: function(tipoStr) {
if (!tipoStr) return 'finestra';
const t = tipoStr.toLowerCase();
if (t.includes('portafinestra') || t.includes('porta-finestra') || t.includes('porta finestra')) return 'portafinestra';
if (t.includes('scorrevole') || t.includes('alzante')) return 'scorrevole';
if (t.includes('portoncino')) return 'portoncino';
if (t.includes('blindat')) return 'blindata';
if (t.includes('persiana')) return 'persiana';
if (t.includes('tapparella')) return 'tapparella';
if (t.includes('cassonetto')) return 'cassonetto';
if (t.includes('zanzariera')) return 'zanzariera';
if (t.includes('motore')) return 'motore';
if (t.includes('finestra')) return 'finestra';
return 'finestra'; // default
    },
    
    // Calcola costi per singolo prodotto
    calcolaCosti: function(tipoStr, quantita = 1) {
const tipo = this.getTipoProdotto(tipoStr);
return {
    tipo: tipo,
    posa: (this.posa[tipo] || 0) * quantita,
    smontaggio: (this.smontaggio[tipo] || 0) * quantita,
    smaltimento: (this.smaltimento[tipo] || 0) * quantita,
    componenti: (this.componenti[tipo] || 0) * quantita,
    quantita: quantita
};
    },
    
    // Calcola totali da array di righe preventivo
    calcolaTotaliDaRighe: function(righe) {
let totPosa = 0, totSmontaggio = 0, totSmaltimento = 0, totComponenti = 0;
const dettaglio = [];

righe.forEach(riga => {
    const costi = this.calcolaCosti(riga.tipo, riga.quantita || 1);
    totPosa += costi.posa;
    totSmontaggio += costi.smontaggio;
    totSmaltimento += costi.smaltimento;
    totComponenti += costi.componenti;
    dettaglio.push({
        posizione: riga.posizione,
        tipo: riga.tipo,
        tipoNorm: costi.tipo,
        quantita: costi.quantita,
        posa: costi.posa,
        smontaggio: costi.smontaggio,
        smaltimento: costi.smaltimento,
        componenti: costi.componenti
    });
});

return {
    posa: totPosa,
    smontaggio: totSmontaggio,
    smaltimento: totSmaltimento,
    componenti: totComponenti,
    totale: totPosa + totSmontaggio + totSmaltimento + totComponenti,
    dettaglio: dettaglio
};
    }
};

console.log('✅ COSTI_LAVORO v8.15 - Posa/Smontaggio/Smaltimento/Componenti configurati');
