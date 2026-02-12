// ============================================================================
// DOCUMENTO-GENERATOR.js v1.0.0 - Modulo Genera Documento Centralizzato
// ============================================================================
//
// CHANGELOG v1.0.0:
// - Estratto da Dashboard app.js (righe 14969-15265)
// - Modulo condiviso per Dashboard e App Rilievo
// - Modale 2-step: scelta tipo → dati cliente → genera
// - Precompilazione da cliente/odoo_customer/clientData
// - Supporto Preventivo Semplice/Premium/Conferma Ordine
//
// 🎯 SCOPO: Gestione modale genera documento con form dati cliente
//
// Usato da:
// - Dashboard: pulsante "Genera Documento"
// - App Rilievo: (futuro)
//
// DIPENDENZE:
// - preventivo-stampa.js (generaDocumentoPremium, generaHTMLDocumentoStampa)
//
// Funzioni esportate:
// - window.apriSceltaDocumento()
// - window.selezionaTipoDocumento(tipo)
// - window.tornaSceltaTipo()
// - window.generaDocumentoFinale()
// - window.chiudiModalDatiCliente()
// - window.generaDocumentoCliente(tipo) [compatibilità]
//
// ============================================================================

const DOCUMENTO_GENERATOR = {
    version: '1.0.0'
};

// ============================================================================
// STEP 1: Apertura modale con scelta tipo documento
// ============================================================================

window.apriSceltaDocumento = function() {
    console.log('📄 apriSceltaDocumento v1.0.0 (modulo)');
    
    if (!window.currentData && !window.projectData) {
        alert('⚠️ Nessun progetto caricato. Carica prima un rilievo.');
        return;
    }
    
    // Reset a Step 1
    var stepScelta = document.getElementById('stepSceltaTipo');
    var stepDati = document.getElementById('stepDatiCliente');
    var footer = document.getElementById('footerDatiCliente');
    var titolo = document.getElementById('titoloModalDocumento');
    
    if (stepScelta) stepScelta.style.display = 'block';
    if (stepDati) stepDati.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (titolo) titolo.textContent = '📄 Genera Documento';
    
    // Mostra modal
    var modal = document.getElementById('modalDatiCliente');
    if (modal) {
        modal.style.display = 'flex';
        console.log('✅ Modal scelta documento aperto');
    }
};

// ============================================================================
// STEP 2: Selezione tipo e passaggio a form dati cliente
// ============================================================================

window.selezionaTipoDocumento = function(tipo) {
    console.log('📄 Tipo selezionato:', tipo);
    
    // Salva tipo
    var tipoInput = document.getElementById('tipoDocumentoCliente');
    if (tipoInput) tipoInput.value = tipo;
    
    // Nascondi Step 1, mostra Step 2
    var stepScelta = document.getElementById('stepSceltaTipo');
    var stepDati = document.getElementById('stepDatiCliente');
    var footer = document.getElementById('footerDatiCliente');
    
    if (stepScelta) stepScelta.style.display = 'none';
    if (stepDati) stepDati.style.display = 'block';
    if (footer) footer.style.display = 'flex';
    
    // Aggiorna titolo e badge
    var titoli = {
        'preventivo_semplice': { titolo: '📋 Preventivo Semplice', badge: '📋 Preventivo Semplice', bg: '#8b5cf6', color: 'white' },
        'preventivo_premium': { titolo: '⭐ Preventivo Premium', badge: '⭐ Preventivo Premium', bg: '#f59e0b', color: 'white' },
        'conferma_premium': { titolo: '✅ Conferma Ordine', badge: '✅ Conferma Ordine Premium', bg: '#10b981', color: 'white' }
    };
    
    var config = titoli[tipo] || titoli['preventivo_semplice'];
    var titoloEl = document.getElementById('titoloModalDocumento');
    if (titoloEl) titoloEl.textContent = config.titolo;
    
    var badge = document.getElementById('badgeTipoSelezionato');
    if (badge) {
        badge.textContent = config.badge;
        badge.style.background = config.bg;
        badge.style.color = config.color;
    }
    
    // Mostra/nascondi sezione acconto (solo conferma)
    var sezioneAcconto = document.getElementById('sezioneAccontoConferma');
    if (sezioneAcconto) {
        sezioneAcconto.style.display = tipo === 'conferma_premium' ? 'block' : 'none';
    }
    
    // Precompila campi
    _precompilaFormDatiCliente(tipo);
};

// ============================================================================
// NAVIGAZIONE: Torna a Step 1
// ============================================================================

window.tornaSceltaTipo = function() {
    var stepScelta = document.getElementById('stepSceltaTipo');
    var stepDati = document.getElementById('stepDatiCliente');
    var footer = document.getElementById('footerDatiCliente');
    var titolo = document.getElementById('titoloModalDocumento');
    
    if (stepScelta) stepScelta.style.display = 'block';
    if (stepDati) stepDati.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (titolo) titolo.textContent = '📄 Genera Documento';
};

// ============================================================================
// CHIUDI MODALE
// ============================================================================

window.chiudiModalDatiCliente = function() {
    var modal = document.getElementById('modalDatiCliente');
    if (modal) modal.style.display = 'none';
};

// ============================================================================
// PRECOMPILAZIONE FORM (funzione interna)
// ============================================================================

function _precompilaFormDatiCliente(tipo) {
    var progetto = window.currentData || window.projectData;
    console.log('📋 Precompila dati cliente...');
    
    // Supporto formato Odoo
    var odooCustomer = progetto ? (progetto.odoo_customer || {}) : {};
    var cliente = progetto ? (progetto.cliente || {}) : {};
    var clientData = progetto ? (progetto.clientData || {}) : {};
    
    // ═══ NOME CLIENTE ═══
    var nomeCliente = '';
    if (cliente.nome) {
        nomeCliente = cliente.nome;
    } else if (odooCustomer.name) {
        nomeCliente = odooCustomer.name;
    } else if (clientData.nome) {
        nomeCliente = clientData.nome;
    } else if (progetto && progetto.name) {
        nomeCliente = progetto.name;
    } else if (progetto && progetto.client) {
        nomeCliente = progetto.client;
    } else if (progetto && progetto.customerName) {
        nomeCliente = progetto.customerName;
    }
    
    // Fallback: leggi da UI se disponibile
    if (!nomeCliente) {
        var clienteDisplay = document.getElementById('projectClientDisplay');
        nomeCliente = clienteDisplay ? clienteDisplay.textContent.replace('👤 ', '').trim() : '';
        if (nomeCliente === 'Cliente Non Specificato') nomeCliente = '';
    }
    
    // ═══ TELEFONO ═══
    var telefono = cliente.telefono || odooCustomer.phone || odooCustomer.mobile || clientData.telefono || '';
    
    // ═══ EMAIL ═══
    var email = cliente.email || odooCustomer.email || clientData.email || '';
    
    // ═══ INDIRIZZO ═══
    var via = cliente.indirizzo || cliente.via || odooCustomer.street || clientData.indirizzo || (progetto ? progetto.indirizzo : '') || '';
    var citta = cliente.citta || cliente.città || odooCustomer.city || clientData.citta || (progetto ? progetto.citta : '') || '';
    var cap = cliente.cap || odooCustomer.zip || clientData.cap || '';
    
    var indirizzo = via;
    if (citta && indirizzo.indexOf(citta) < 0) {
        indirizzo += (cap ? ', ' + cap : '') + ' ' + citta;
    }
    
    // ═══ CODICE FISCALE / P.IVA ═══
    var cf = cliente.cf || cliente.codiceFiscale || cliente.piva || 
             odooCustomer.vat || clientData.cf || '';
    
    // ═══ OGGETTO ═══
    var progettoDisplay = document.getElementById('projectNameDisplay');
    var oggetto = progettoDisplay ? progettoDisplay.textContent.trim() : '';
    if (!oggetto || oggetto === 'Nome Progetto') {
        oggetto = (progetto ? progetto.nome_ricerca : '') || (progetto ? progetto.name : '') || 'Fornitura e posa serramenti';
    }
    
    // ═══ COMPILA I CAMPI ═══
    _setVal('clienteNome', nomeCliente);
    _setVal('clienteTelefono', telefono);
    _setVal('clienteEmail', email);
    _setVal('clienteIndirizzo', indirizzo);
    _setVal('clienteCF', cf);
    _setVal('docOggetto', oggetto);
    
    // Campi ENEA
    var immobile = progetto ? (progetto.immobile || {}) : {};
    var comune = cliente.comune || immobile.comune || clientData.comune || citta || '';
    var provincia = cliente.provincia || immobile.provincia || clientData.provincia || '';
    var capSeparato = cliente.cap || immobile.cap || clientData.cap || cap || '';
    var zonaClimatica = immobile.zonaClimatica || cliente.zonaClimatica || '';
    
    _setVal('clienteComune', comune);
    _setVal('clienteProvincia', provincia);
    _setVal('clienteCAP', capSeparato);
    _setVal('clienteZonaClimatica', zonaClimatica);
    
    // Dati IVA/Detrazioni
    var ivaD = immobile.ivaDetrazioni || {};
    _setVal('clienteTipoIntervento', immobile.tipoIntervento || ivaD.tipoIntervento || '');
    _setVal('clienteTipoEdificio', immobile.tipoEdificio || ivaD.tipoEdificio || '');
    _setVal('clienteTipoServizio', immobile.tipoServizio || ivaD.tipoServizio || '');
    _setVal('clienteTipoCliente', immobile.tipoCliente || ivaD.tipoCliente || '');
    _setVal('clienteTipoBonus', immobile.tipoBonus || ivaD.tipoBonus || '');
    
    // Aggiorna descrizioni IVA (se funzione disponibile)
    if (typeof aggiornaDescrizioniIVA === 'function') {
        aggiornaDescrizioniIVA();
    } else if (typeof window.aggiornaDescrizioniIVA === 'function') {
        window.aggiornaDescrizioniIVA();
    }
    
    // Data odierna
    _setVal('docData', new Date().toISOString().split('T')[0]);
    
    // Numero documento
    var anno = new Date().getFullYear();
    var prefisso = tipo === 'conferma_premium' ? 'ORD-' : 'PREV-';
    _setVal('docNumero', prefisso + anno + '/');
    
    console.log('✅ Precompilato:', { nome: nomeCliente, telefono: telefono, email: email, indirizzo: indirizzo });
}

// Helper: set value safe
function _setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val || '';
}

// ============================================================================
// RESET FORM
// ============================================================================

function _resetFormDatiCliente() {
    var campi = ['clienteNome', 'clienteTelefono', 'clienteIndirizzo', 'clienteEmail', 'clienteCF', 
                 'clienteComune', 'clienteProvincia', 'clienteCAP', 'clienteZonaClimatica',
                 'clienteTipoIntervento', 'clienteTipoEdificio', 'clienteTipoServizio', 'clienteTipoCliente', 'clienteTipoBonus',
                 'docNumero', 'docOggetto', 'docNote'];
    campi.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
    });
}

// ============================================================================
// GENERAZIONE DOCUMENTO FINALE
// ============================================================================

window.generaDocumentoFinale = function() {
    var tipo = document.getElementById('tipoDocumentoCliente') ? document.getElementById('tipoDocumentoCliente').value : 'preventivo_semplice';
    console.log('📄 generaDocumentoFinale:', tipo);
    
    // Lista placeholder da ignorare
    var placeholdersDaIgnorare = [
        'Mario Rossi', 'Cliente', '333 1234567', 'mario@email.it', 
        'RSSMRA80A01B157K', 'Via Roma 1, Bergamo', '2025/001',
        'Sostituzione serramenti appartamento', 'Eventuali note...'
    ];
    
    function getValorePulito(id, fallback) {
        var el = document.getElementById(id);
        if (!el) return fallback || '';
        var val = el.value.trim();
        if (!val || placeholdersDaIgnorare.indexOf(val) >= 0) {
            return fallback || '';
        }
        return val;
    }
    
    // Raccogli dati form
    var datiCliente = {
        nome: getValorePulito('clienteNome', ''),
        indirizzo: getValorePulito('clienteIndirizzo', ''),
        telefono: getValorePulito('clienteTelefono', ''),
        email: getValorePulito('clienteEmail', ''),
        cf: getValorePulito('clienteCF', '')
    };
    
    var datiDoc = {
        numero: getValorePulito('docNumero', ''),
        data: document.getElementById('docData') ? document.getElementById('docData').value : new Date().toISOString().split('T')[0],
        oggetto: getValorePulito('docOggetto', 'Fornitura e posa serramenti'),
        note: getValorePulito('docNote', ''),
        accontoPct: parseFloat(document.getElementById('accontoPct') ? document.getElementById('accontoPct').value : 30) || 30,
        tempiConsegna: document.getElementById('tempiConsegna') ? document.getElementById('tempiConsegna').value : '6-8 settimane'
    };
    
    // Raccogli ENEA e voci extra dal DOM
    var eneaChecked = document.getElementById('checkENEA') ? document.getElementById('checkENEA').checked : false;
    var eneaValore = parseFloat(document.getElementById('inputENEA') ? document.getElementById('inputENEA').value : 0) || 0;
    
    var voce1Checked = document.getElementById('checkVoceExtra1') ? document.getElementById('checkVoceExtra1').checked : false;
    var voce1Nome = document.getElementById('inputNomeVoceExtra1') ? document.getElementById('inputNomeVoceExtra1').value : '';
    var voce1Valore = parseFloat(document.getElementById('inputVoceExtra1') ? document.getElementById('inputVoceExtra1').value : 0) || 0;
    var voce1IVA = parseInt(document.getElementById('selectIVAVoceExtra1') ? document.getElementById('selectIVAVoceExtra1').value : 22) || 22;
    
    var voce2Checked = document.getElementById('checkVoceExtra2') ? document.getElementById('checkVoceExtra2').checked : false;
    var voce2Nome = document.getElementById('inputNomeVoceExtra2') ? document.getElementById('inputNomeVoceExtra2').value : '';
    var voce2Valore = parseFloat(document.getElementById('inputVoceExtra2') ? document.getElementById('inputVoceExtra2').value : 0) || 0;
    var voce2IVA = parseInt(document.getElementById('selectIVAVoceExtra2') ? document.getElementById('selectIVAVoceExtra2').value : 22) || 22;
    
    console.log('📝 Voci Extra lette dal DOM:', {
        enea: { valore: eneaValore, checked: eneaChecked },
        voce1: { nome: voce1Nome, valore: voce1Valore, iva: voce1IVA, checked: voce1Checked },
        voce2: { nome: voce2Nome, valore: voce2Valore, iva: voce2IVA, checked: voce2Checked }
    });
    
    // Raccogli totali dal DOM
    var totali = {
        materiali: document.getElementById('totaleCliente') ? document.getElementById('totaleCliente').textContent : '€ 0.00',
        lavori: document.getElementById('totaleLavoriCliente') ? document.getElementById('totaleLavoriCliente').textContent : '€ 0.00',
        subtotale: document.getElementById('subtotaleCliente') ? document.getElementById('subtotaleCliente').textContent : '€ 0.00',
        imponibile10: document.getElementById('valImponibile10') ? document.getElementById('valImponibile10').textContent : '',
        imponibile22: document.getElementById('valImponibile22') ? document.getElementById('valImponibile22').textContent : '',
        iva10: document.getElementById('valIVA10') ? document.getElementById('valIVA10').textContent : '',
        iva22: document.getElementById('valIVA22') ? document.getElementById('valIVA22').textContent : '',
        totaleFinale: document.getElementById('grandTotalCliente') ? document.getElementById('grandTotalCliente').textContent : '€ 0.00',
        tipoIntervento: document.getElementById('tipoInterventoSelect') ? document.getElementById('tipoInterventoSelect').value : 'manutenzione',
        enea: { valore: eneaValore, checked: eneaChecked },
        voceExtra1: { nome: voce1Nome, valore: voce1Valore, iva: voce1IVA, checked: voce1Checked },
        voceExtra2: { nome: voce2Nome, valore: voce2Valore, iva: voce2IVA, checked: voce2Checked }
    };
    
    console.log('📊 Totali letti dal DOM:', totali);
    console.log('📋 Righe preventivo:', window.righePreventivo ? window.righePreventivo.length : 0);
    
    // Genera HTML in base al tipo
    var righe = window.righePreventivo || [];
    var htmlDoc;
    
    if (tipo === 'preventivo_premium' || tipo === 'conferma_premium') {
        if (typeof window.generaDocumentoPremium === 'function') {
            htmlDoc = window.generaDocumentoPremium(tipo, datiCliente, datiDoc, righe, totali);
        } else {
            alert('⚠️ Modulo preventivo-stampa.js non caricato');
            return;
        }
    } else {
        if (typeof window.generaHTMLDocumentoStampa === 'function') {
            htmlDoc = window.generaHTMLDocumentoStampa('preventivo', datiCliente, datiDoc, righe, totali);
        } else {
            alert('⚠️ Modulo preventivo-stampa.js non caricato');
            return;
        }
    }
    
    // Apri in nuova finestra
    var win = window.open('', '_blank');
    if (win) {
        win.document.write(htmlDoc);
        win.document.close();
    } else {
        alert('⚠️ Popup bloccato. Consenti popup per visualizzare il documento.');
    }
    
    // Chiudi modal
    window.chiudiModalDatiCliente();
    console.log('✅ Documento generato:', tipo);
};

// ============================================================================
// COMPATIBILITÀ con vecchie chiamate
// ============================================================================

window.generaDocumentoCliente = function(tipo) {
    window.apriSceltaDocumento();
};

// ============================================================================
// EXPORT
// ============================================================================

if (typeof window !== 'undefined') {
    window.DOCUMENTO_GENERATOR = DOCUMENTO_GENERATOR;
    console.log(`📄 DOCUMENTO_GENERATOR v${DOCUMENTO_GENERATOR.version} - Caricato`);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOCUMENTO_GENERATOR };
}
