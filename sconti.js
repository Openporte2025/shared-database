// ═══════════════════════════════════════════════════════════════════════════
// 💰 SISTEMA SCONTI FORNITORI v8.14
// Sconti applicati dai fornitori a Open Porte & Finestre
// ═══════════════════════════════════════════════════════════════════════════
const SCONTI_FORNITORI = {
    // Sconti effettivi (già calcolati per sconti composti)
    sconti: {
'FINSTRAL':       36.76,  // 32% + 7% composto
'PALAGINA':       50.00,
'PUNTO PERSIANE': 55.00,
'SOMFY':          40.00,
'FERREROLEGNO':   50.00,
'FLESSYA':        53.00,
'OIKOS':          46.00,  // 40% + 10% composto
'PLASTICINO':     45.00,  // Tapparelle/Avvolgibili
'OLIVARI':        43.00,  // 40% + 5% composto - Maniglie
'COLOMBO DESIGN': 40.00,  // Maniglie
'GIBUS':          48.00,  // Click Zip, Tende da Sole
    },
    
    // Alias per normalizzazione nomi
    alias: {
'finstral': 'FINSTRAL',
'palagina': 'PALAGINA',
'punto persiane': 'PUNTO PERSIANE',
'puntopersiane': 'PUNTO PERSIANE',
'somfy': 'SOMFY',
'ferrerolegno': 'FERREROLEGNO',
'ferrero legno': 'FERREROLEGNO',
'flessya': 'FLESSYA',
'oikos': 'OIKOS',
'plasticino': 'PLASTICINO',
'olivari': 'OLIVARI',
'colombo': 'COLOMBO DESIGN',
'colombo design': 'COLOMBO DESIGN',
'gibus': 'GIBUS',
'click zip': 'GIBUS',
'clickzip': 'GIBUS',
    },
    
    // Normalizza nome azienda
    normalizzaAzienda: function(azienda) {
if (!azienda) return 'ALTRO';
const lower = azienda.toLowerCase().trim();
return this.alias[lower] || azienda.toUpperCase();
    },
    
    // Ottieni sconto % per azienda
    getSconto: function(azienda) {
const nome = this.normalizzaAzienda(azienda);
return this.sconti[nome] || 0;
    },
    
    // Calcola prezzo netto (tuo costo)
    calcolaNetto: function(prezzoListino, azienda) {
const sconto = this.getSconto(azienda);
return prezzoListino * (1 - sconto / 100);
    },
    
    // Calcola prezzo cliente con ricarico
    calcolaPrezzoCliente: function(prezzoListino, azienda, ricarico = 0) {
const netto = this.calcolaNetto(prezzoListino, azienda);
return netto * (1 + ricarico / 100);
    },
    
    // Calcola margine
    calcolaMargine: function(prezzoListino, azienda, ricarico = 0) {
const netto = this.calcolaNetto(prezzoListino, azienda);
const cliente = netto * (1 + ricarico / 100);
return cliente - netto;
    },
    
    // Formatta con dettaglio
    calcolaDettaglio: function(prezzoListino, azienda, ricarico = 0) {
const nome = this.normalizzaAzienda(azienda);
const sconto = this.getSconto(azienda);
const netto = this.calcolaNetto(prezzoListino, azienda);
const cliente = this.calcolaPrezzoCliente(prezzoListino, azienda, ricarico);
const margine = cliente - netto;

return {
    azienda: nome,
    listino: parseFloat(prezzoListino.toFixed(2)),
    sconto: sconto,
    netto: parseFloat(netto.toFixed(2)),
    ricarico: ricarico,
    cliente: parseFloat(cliente.toFixed(2)),
    margine: parseFloat(margine.toFixed(2))
};
    }
};

console.log('✅ SCONTI_FORNITORI v8.43 - Sistema sconti attivo (11 fornitori + GIBUS)');
