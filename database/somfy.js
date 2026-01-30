// ═══════════════════════════════════════════════════════════════════════════
// 🔌 DATABASE PREZZI SOMFY - v7.999 (04 DIC 2025)
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// 🔧 v8.09: DATABASE SOMFY LISTINO 2025 (Completo da Excel ufficiale)
// Fonte: Listino_2025_CUSTOMERS_IND_B2B_-_IND_B2C_-_INST_B2C.xlsx
// ═══════════════════════════════════════════════════════════════════════════
const SOMFY_PREZZI = {
    versione: "2025",
    dataAggiornamento: "2025-12-05",
    fonte: "Listino_2025_CUSTOMERS_IND_B2B_-_IND_B2C_-_INST_B2C.xlsx",
    note: "Prezzi LISTINO IVA esclusa - Applicare sconto installatore",
    
    // ⚠️ SCONTO INSTALLATORE - DA COMPILARE
    SCONTO_INSTALLATORE: 0,  // Esempio: 0.43 = 43% di sconto
    
    // Helper per calcolo prezzo netto
    getPrezzoNetto: function(prezzoListino) {
return Math.round(prezzoListino * (1 - this.SCONTO_INSTALLATORE) * 100) / 100;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MOTORI OXIMO IO (Connesso - Protocollo io-homecontrol)
    // ═══════════════════════════════════════════════════════════════════════
    motori: {
// OXIMO IO - Connessi
"oximo_io_6":  { ref: "1032696", nome: "OXIMO IO 6/17 VVF 3M UNIT", listino: 272.10, coppia: 6, velocita: 17 },
"oximo_io_10": { ref: "1037686", nome: "OXIMO IO 10/17 VVF 3M UNIT", listino: 284.52, coppia: 10, velocita: 17 },
"oximo_io_15": { ref: "1039589", nome: "OXIMO IO 15/17 VVF 3M", listino: 303.14, coppia: 15, velocita: 17 },
"oximo_io_20": { ref: "1041627", nome: "OXIMO IO 20/17 VVF 3M UNIT", listino: 321.79, coppia: 20, velocita: 17 },
"oximo_io_30": { ref: "1045513", nome: "OXIMO IO 30/17 VVF 3M UNIT", listino: 340.42, coppia: 30, velocita: 17 },
"oximo_io_40": { ref: "1049605", nome: "OXIMO IO 40/17 VVF 3M", listino: 371.49, coppia: 40, velocita: 17 },
"oximo_io_50": { ref: "1049732", nome: "OXIMO IO 50/12 VVF 3M BAR", listino: 383.91, coppia: 50, velocita: 12 },

// Alias retrocompatibilità
"oximo_20": { ref: "1041627", nome: "OXIMO IO 20/17 VVF 3M UNIT", listino: 321.79, coppia: 20, velocita: 17 },
"oximo_30": { ref: "1045513", nome: "OXIMO IO 30/17 VVF 3M UNIT", listino: 340.42, coppia: 30, velocita: 17 },
"oximo_50_io_20": { ref: "1041627", nome: "OXIMO IO 20/17 VVF 3M UNIT", listino: 321.79, coppia: 20, velocita: 17 },
"oximo_50_io_30": { ref: "1045513", nome: "OXIMO IO 30/17 VVF 3M UNIT", listino: 340.42, coppia: 30, velocita: 17 },

// OXIMO RTS - Radio unidirezionale
"oximo_rts_6":  { ref: "1032389", nome: "OXIMO RTS 6/17 VVF 3M UNIT", listino: 273.17, coppia: 6, velocita: 17 },
"oximo_rts_10": { ref: "1037384", nome: "OXIMO RTS 10/17 VVF 3M UNIT", listino: 285.64, coppia: 10, velocita: 17 },
"oximo_rts_15": { ref: "1039363", nome: "OXIMO RTS 15/17 VVF 3M UNIT", listino: 304.33, coppia: 15, velocita: 17 },
"oximo_rts_20": { ref: "1041374", nome: "OXIMO RTS 20/17 VVF 3M UNIT", listino: 323.06, coppia: 20, velocita: 17 },
"oximo_rts_30": { ref: "1045314", nome: "OXIMO RTS 30/17 VVF 3M UNIT", listino: 335.52, coppia: 30, velocita: 17 },
"oximo_rts_40": { ref: "1049430", nome: "OXIMO RTS 40/17 VVF 3M UNIT", listino: 372.95, coppia: 40, velocita: 17 },
"oximo_rts_50": { ref: "1049720", nome: "OXIMO RTS 50/12 VVF 3M BAR", listino: 385.43, coppia: 50, velocita: 12 },

// OXIMO WT - Wireless/Batteria
"oximo_wt_6":  { ref: "1032575", nome: "OXIMO WT 6/17 VVF 3M UNIT", listino: 210.54, coppia: 6, velocita: 17, wireless: true },
"oximo_wt_10": { ref: "1037579", nome: "OXIMO WT 10/17 VVF 3M UNIT", listino: 222.32, coppia: 10, velocita: 17, wireless: true },
"oximo_wt_15": { ref: "1039491", nome: "OXIMO WT 15/17 VVF 3M UNIT", listino: 234.08, coppia: 15, velocita: 17, wireless: true },
"oximo_wt_20": { ref: "1041526", nome: "OXIMO WT 20/17 VVF 3M UNIT", listino: 263.48, coppia: 20, velocita: 17, wireless: true },
"oximo_wt_30": { ref: "1045446", nome: "OXIMO WT 30/17 VVF 3M UNIT", listino: 295.24, coppia: 30, velocita: 17, wireless: true },
"oximo_wt_40": { ref: "1049541", nome: "OXIMO WT 40/17 VVF 3M UNIT", listino: 334.07, coppia: 40, velocita: 17, wireless: true },

// OXIMO AUTO - Finecorsa automatico
"oximo_auto_rts_6": { ref: "1130128", nome: "OXIMO 50 S AUTO RTS 6/17 VVF 3M", listino: 295.80, coppia: 6, velocita: 17, auto: true },
"oximo_auto_io_6":  { ref: "1130334", nome: "OXIMO 50 S AUTO IO 6/17 VVF 3M", listino: 321.79, coppia: 6, velocita: 17, auto: true },

// LT50 HELIOS - Motori cablati
"lt50_helios":      { ref: "1045041", nome: "LT HELIOS 30/17 VVF 2,5M UNIT", listino: 255.06, coppia: 30, velocita: 17 },
"lt50_helios_30":   { ref: "1045041", nome: "LT HELIOS 30/17 VVF 2,5M UNIT", listino: 255.06, coppia: 30, velocita: 17 },
"lt_helios_30_17":  { ref: "1045041", nome: "LT HELIOS 30/17 VVF 2,5M UNIT", listino: 255.06, coppia: 30, velocita: 17 },
"lt50_helios_30_12": { ref: "1045034", nome: "LT HELIOS 30/12 VVF 2,5M UNIT", listino: 156.07, coppia: 30, velocita: 12 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // COMANDI E TELECOMANDI
    // ═══════════════════════════════════════════════════════════════════════
    comandi: {
// AMY - Comandi a muro compatti
"amy_1_io":           { ref: "1871061", nome: "Amy 1 io C", listino: 57.45 },
"amy_1_io_frame":     { ref: "1871062", nome: "Amy 1 io + Frame C", listino: 57.45 },
"amy_1_modes":        { ref: "1871077", nome: "Amy 1 Modes io C", listino: 67.34 },
"amy_1_modes_frame":  { ref: "1871078", nome: "Amy 1 Modes io + Frame C", listino: 67.34 },
"amy_2_modes":        { ref: "1871095", nome: "Amy 2 Modes io C", listino: 90.00 },
"amy_4_modes_frame":  { ref: "1871114", nome: "Amy 4 Modes io + Frame C", listino: 99.60 },
"amy1": { ref: "1871062", nome: "Amy 1 io + Frame C", listino: 57.45 },  // Alias retrocompatibilità

// SITUO - Telecomandi portatili
"situo_1_rts":       { ref: "1870496", nome: "SITUO 1 RTS DIY", listino: 72.87 },
"situo_1_rts_pure":  { ref: "1870571", nome: "SITUO 1 RTS FCC PURE II", listino: 58.22 },
"situo_1_var_pure":  { ref: "1811608", nome: "SITUO 1 VAR RTS PURE II 20L", listino: 100.97 },

// SMOOVE - Comandi a muro
"smoove_origin_2_io":   { ref: "1800204", nome: "Smoove Origin 2 io + Frame", listino: 84.01 },
"smoove_origin_4_io":   { ref: "1800205", nome: "Smoove Origin 4 io + Frame 15L", listino: 102.94 },
"smoove_origin_2_rts":  { ref: "1800223", nome: "Smoove Origin 2 RTS + Frame", listino: 80.25 },
"smoove_origin_4_rts":  { ref: "1800295", nome: "Smoove Origin 4 RTS + Frame", listino: 103.35 },

// TELIS/CHRONIS - Timer e multicanale
"telis_6_chronis_pure":   { ref: "1805209", nome: "TELIS 6 CHRONIS RTS PURE", listino: 260.16 },
"chronis_io":             { ref: "1805228", nome: "CHRONIS IO 10L", listino: 188.15 },

// NINA - Touch screen
"nina_io":       { ref: "1805251", nome: "NINA IO", listino: 269.67 },
"nina_timer_io": { ref: "1811407", nome: "NINA TIMER IO", listino: 301.72 },

// INIS - Pulsanti/chiave
"inis_uno": { ref: "1800191", nome: "INIS UNO", listino: 21.70 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // RICEVITORI
    // ═══════════════════════════════════════════════════════════════════════
    ricevitori: {
// IZYMO - Micro da incasso
"izymo_shutter":     { ref: "1822660", nome: "IZYMO SHUTTER RECEIVER IO", listino: 114.82 },
"izymo_on_off":      { ref: "1822649", nome: "IZYMO ON-OFF RECEIVER IO", listino: 81.89 },
"izymo_dimmer":      { ref: "1822663", nome: "IZYMO DIMMER RECEIVER IO", listino: 92.62 },
"izymo_transmitter": { ref: "1822609", nome: "IZYMO TRANSMITTER IO", listino: 65.49 },
"izymo": { ref: "1822660", nome: "IZYMO SHUTTER RECEIVER IO", listino: 114.82 },  // Alias

// Universal - Per compatibilità RTS
"universal_rts":       { ref: "1810624", nome: "UNIVERSAL RECEIVER RTS", listino: 159.19 },
"universal_slim_rts":  { ref: "1810783", nome: "UNIVERSAL SLIM RECEIVER RTS", listino: 224.51 },

// Micro
"micro_shutter": { ref: "2401162", nome: "MICRO RECEIVER RTS FOR SHUTTER", listino: 81.07 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ACCESSORI
    // ═══════════════════════════════════════════════════════════════════════
    accessori: {
"supporto": { ref: "9019821", nome: "SUPPORTO OPERATORE DA AVVITARE", listino: 7.88 },
"supporto_operatore": { ref: "9019821", nome: "SUPPORTO OPERATORE DA AVVITARE", listino: 7.88 },
"ruota_60": { ref: "9751001", nome: "RUOTA PER RULLO OTTAGONALE 60mm", listino: 21.00 },
"corona_60": { ref: "9707025", nome: "CORONA OTT.60 I", listino: 17.67 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    // Helper per trovare prezzo motore per ID
    getPrezzoMotore: function(modelloId) {
if (!modelloId) return null;
const id = modelloId.toLowerCase().replace(/[\s-]/g, '_');
const motore = this.motori[id];
if (motore) {
    return { ...motore, prezzo: motore.listino, prezzoNetto: this.getPrezzoNetto(motore.listino) };
}
return null;
    },
    
    // Helper per trovare prezzo comando per ID
    getPrezzoComando: function(comandoId) {
if (!comandoId) return null;
const id = comandoId.toLowerCase().replace(/[\s-]/g, '_');
const comando = this.comandi[id];
if (comando) {
    return { ...comando, prezzo: comando.listino, prezzoNetto: this.getPrezzoNetto(comando.listino) };
}
// Cerca anche nei ricevitori
const ricevitore = this.ricevitori[id];
if (ricevitore) {
    return { ...ricevitore, prezzo: ricevitore.listino, prezzoNetto: this.getPrezzoNetto(ricevitore.listino) };
}
return null;
    },
    
    // Helper per calcolare prezzo totale kit motore
    calcolaPrezzoKit: function(motoreInfo) {
let totale = 0;
let dettaglio = [];

// Motore
const motore = this.getPrezzoMotore(motoreInfo.modelloId);
if (motore) {
    totale += motore.listino;
    dettaglio.push({ nome: motore.nome, prezzo: motore.listino });
}

// Comando
const comando = this.getPrezzoComando(motoreInfo.comandoId);
if (comando) {
    totale += comando.listino;
    dettaglio.push({ nome: comando.nome, prezzo: comando.listino });
}

// Accessori
const acc = motoreInfo.accessori || {};
if (acc.supporto && this.accessori.supporto) {
    totale += this.accessori.supporto.listino;
    dettaglio.push({ nome: this.accessori.supporto.nome, prezzo: this.accessori.supporto.listino });
}
if (acc.ruota_60 && this.accessori.ruota_60) {
    totale += this.accessori.ruota_60.listino;
    dettaglio.push({ nome: this.accessori.ruota_60.nome, prezzo: this.accessori.ruota_60.listino });
}
if (acc.corona_60 && this.accessori.corona_60) {
    totale += this.accessori.corona_60.listino;
    dettaglio.push({ nome: this.accessori.corona_60.nome, prezzo: this.accessori.corona_60.listino });
}

return { 
    totale, 
    totaleNetto: this.getPrezzoNetto(totale),
    dettaglio 
};
    }
};

console.log('✅ SOMFY_PREZZI v8.09 - Listino 2025 completo (OXIMO IO/RTS/WT, Amy, Situo, Smoove, IZYMO)');
