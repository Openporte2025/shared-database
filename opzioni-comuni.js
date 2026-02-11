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
 * v2.2.0 (11/02/2026): Aggiunto IVA/DETRAZIONI (5 categorie: intervento, edificio, servizio, cliente, bonus)
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
    // 🏛️ IVA E DETRAZIONI FISCALI (dati cantiere/cliente)
    // ═══════════════════════════════════════════════════════════════════════════

    const TIPI_INTERVENTO = [
        { id: 'manutenzione_ordinaria',   nome: 'Manutenzione Ordinaria (lett. a)',   descrizione: 'Sostituzione serramenti senza opere murarie, stessi materiali/sagoma', titolo: 'Nessuno (Edilizia Libera)', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' },
        { id: 'manutenzione_straordinaria', nome: 'Manutenzione Straordinaria (lett. b)', descrizione: 'Modifica materiali, sagoma, aperture o opere murarie', titolo: 'CILA o SCIA', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' },
        { id: 'restauro',                 nome: 'Restauro/Risanamento (lett. c)',     descrizione: 'Interventi conservativi su edifici di pregio', titolo: 'SCIA', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' },
        { id: 'ristrutturazione_edilizia', nome: 'Ristrutturazione edilizia (lett. d)', descrizione: 'Trasformazione organismi edilizi con demolizione/ricostruzione', titolo: 'SCIA o Permesso di costruire', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' },
        { id: 'ristrutturazione_urbana',  nome: 'Ristrutturazione urbana (lett. f)',  descrizione: 'Interventi su tessuto urbanistico-edilizio', titolo: 'Permesso di costruire', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' },
        { id: 'nuove_costruzioni',        nome: 'Nuove costruzioni',                  descrizione: 'Costruzione nuovi edifici o ampliamenti', titolo: 'Permesso di costruire', rifNormativo: 'D.P.R. 380/2001 Art. 3 comma 1' }
    ];

    const TIPI_EDIFICIO = [
        { id: 'abitazione_privata',   nome: 'Abitazione privata (Cat. A escluso A10)', descrizione: 'Categorie catastali A1-A9, A11 e pertinenze' },
        { id: 'parti_comuni',         nome: 'Parti comuni condominio abitativo',       descrizione: 'Parti comuni di condomini a prevalente destinazione abitativa' },
        { id: 'altri_edifici',        nome: 'Altri edifici (strumentali, uffici, negozi)', descrizione: 'Immobili strumentali, uffici, negozi, locali pubblici' }
    ];

    const TIPI_SERVIZIO = [
        { id: 'fornitura_posa_serramenti', nome: 'Fornitura e posa in opera serramenti (+ accessori)', descrizione: '' },
        { id: 'fornitura_posa_accessori',  nome: 'Fornitura e posa di soli accessori (senza serramento)', descrizione: '' },
        { id: 'sola_fornitura',            nome: 'Sola fornitura serramenti (senza posa)',  descrizione: '' },
        { id: 'sola_manodopera',           nome: 'Sola manodopera / servizi professionali', descrizione: '' }
    ];

    const TIPI_CLIENTE = [
        { id: 'persona_fisica',     nome: 'Persona fisica' },
        { id: 'persona_giuridica',  nome: 'Persona giuridica' },
        { id: 'impresa_appaltatrice', nome: 'Imprese appaltatrici' }
    ];

    const TIPI_BONUS = [
        { id: 'ecobonus',          nome: 'Ecobonus',            percentuale: 50, note: 'Efficienza energetica - art. 14 DL 63/2013' },
        { id: 'bonus_casa',        nome: 'Bonus casa',          percentuale: 50, note: 'Ristrutturazione - art. 16 DL 63/2013' },
        { id: 'bonus_sicurezza',   nome: 'Bonus sicurezza',     percentuale: 50, note: 'Sicurezza - art. 16 DL 63/2013' },
        { id: 'nessuna',           nome: 'Nessuna detrazione',  percentuale: 0,  note: '' }
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.OPZIONI = {
        AMBIENTI,
        PIANI,
        // IVA e Detrazioni
        TIPI_INTERVENTO,
        TIPI_EDIFICIO,
        TIPI_SERVIZIO,
        TIPI_CLIENTE,
        TIPI_BONUS,
        // Helper: genera <option> HTML da una lista
        htmlOptions: function(lista, selectedValue, placeholder) {
            let html = placeholder ? `<option value="">${placeholder}</option>` : '';
            lista.forEach(v => {
                html += `<option value="${v}" ${v === selectedValue ? 'selected' : ''}>${v}</option>`;
            });
            return html;
        },
        // Helper: genera <option> HTML da array di oggetti {id, nome}
        htmlOptionsObj: function(lista, selectedId, placeholder) {
            let html = placeholder ? `<option value="">${placeholder}</option>` : '';
            lista.forEach(item => {
                html += `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${item.nome}</option>`;
            });
            return html;
        }
    };
    
    console.log('✅ opzioni-comuni.js v2.2.0 caricato - AMBIENTI + PIANI + IVA/DETRAZIONI (unica fonte)');
    
})();
