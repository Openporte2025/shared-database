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
        },

        // 🆕 v2.2.0: Oggetto IVA_DETRAZIONI con renderWizardIVA per App Rilievo
        IVA_DETRAZIONI: {
            /**
             * Renderizza i 5 dropdown IVA/Detrazioni dentro un container
             * @param {string} containerId - ID del div container
             * @param {object} saved - Dati salvati {tipoIntervento, tipoEdificio, tipoServizio, tipoCliente, tipoBonus}
             * @param {object} opts - {compact, onChange: function(dati)}
             */
            renderWizardIVA: function(containerId, saved, opts) {
                const container = document.getElementById(containerId);
                if (!container) return;
                
                saved = saved || {};
                opts = opts || {};
                const O = window.OPZIONI;
                
                const selectStyle = 'width:100%;padding:8px 10px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;background:#fff;';
                const labelStyle = 'display:block;font-size:12px;font-weight:600;color:#4b5563;margin-bottom:4px;';
                const descStyle = 'font-size:11px;color:#6b7280;margin-top:2px;';
                
                function renderSelect(id, label, lista, savedVal) {
                    let options = `<option value="">-- ${label} --</option>`;
                    lista.forEach(item => {
                        options += `<option value="${item.id}" ${item.id === savedVal ? 'selected' : ''}>${item.nome}</option>`;
                    });
                    return `
                        <div style="margin-bottom:8px;">
                            <label style="${labelStyle}">${label}</label>
                            <select id="${containerId}-${id}" style="${selectStyle}" 
                                    onchange="window.OPZIONI.IVA_DETRAZIONI._onFieldChange('${containerId}')">
                                ${options}
                            </select>
                            <div id="${containerId}-${id}-desc" style="${descStyle}"></div>
                        </div>
                    `;
                }
                
                container.innerHTML = `
                    <div style="margin-top:8px;">
                        <h4 style="font-size:14px;font-weight:700;color:#374151;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                            <span>🏛️</span> IVA e Detrazioni Fiscali
                        </h4>
                        ${renderSelect('tipoIntervento', '1. Tipo Intervento', O.TIPI_INTERVENTO, saved.tipoIntervento)}
                        ${renderSelect('tipoEdificio', '2. Tipo Edificio', O.TIPI_EDIFICIO, saved.tipoEdificio)}
                        ${renderSelect('tipoServizio', '3. Tipo Servizio', O.TIPI_SERVIZIO, saved.tipoServizio)}
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            ${renderSelect('tipoCliente', '4. Tipo Cliente', O.TIPI_CLIENTE, saved.tipoCliente)}
                            ${renderSelect('tipoBonus', '5. Tipo Bonus', O.TIPI_BONUS, saved.tipoBonus)}
                        </div>
                    </div>
                `;
                
                // Salva riferimento al callback onChange
                container._ivaOnChange = opts.onChange || null;
                
                // Aggiorna descrizioni iniziali
                this._updateDescs(containerId);
            },
            
            _onFieldChange: function(containerId) {
                this._updateDescs(containerId);
                const container = document.getElementById(containerId);
                if (!container) return;
                
                const dati = {
                    tipoIntervento: document.getElementById(containerId + '-tipoIntervento')?.value || '',
                    tipoEdificio: document.getElementById(containerId + '-tipoEdificio')?.value || '',
                    tipoServizio: document.getElementById(containerId + '-tipoServizio')?.value || '',
                    tipoCliente: document.getElementById(containerId + '-tipoCliente')?.value || '',
                    tipoBonus: document.getElementById(containerId + '-tipoBonus')?.value || ''
                };
                
                if (container._ivaOnChange) {
                    container._ivaOnChange(dati);
                }
            },
            
            _updateDescs: function(containerId) {
                const O = window.OPZIONI;
                const tipoInt = document.getElementById(containerId + '-tipoIntervento')?.value;
                const descEl = document.getElementById(containerId + '-tipoIntervento-desc');
                if (descEl && tipoInt) {
                    const item = O.TIPI_INTERVENTO.find(t => t.id === tipoInt);
                    descEl.textContent = item ? item.descrizione : '';
                } else if (descEl) { descEl.textContent = ''; }
                
                const tipoEd = document.getElementById(containerId + '-tipoEdificio')?.value;
                const descEdEl = document.getElementById(containerId + '-tipoEdificio-desc');
                if (descEdEl && tipoEd) {
                    const item = O.TIPI_EDIFICIO.find(t => t.id === tipoEd);
                    descEdEl.textContent = item ? item.descrizione : '';
                } else if (descEdEl) { descEdEl.textContent = ''; }
            }
        }
    };
    
    console.log('✅ opzioni-comuni.js v2.2.0 caricato - AMBIENTI + PIANI + IVA/DETRAZIONI (unica fonte)');
    
})();
