// ============================================================================
// EXPORT-FATTURE-INFISSI.js v1.0.0 - Export .LST per "Fatture Infissi Web"
// ============================================================================
//
// Genera file .LST (ZIP rinominato) con XML compatibili con il software
// "Fatture Infissi Web" per fatturazione serramenti.
//
// FASE 1: Solo prodotti + prezzi vendita (posa/servizi si aggiungono nel sw)
// FASE 2 (futuro): Anche posa, servizi, dati ENEA/DTF
//
// DIPENDENZE:
//   - data-manager.js (DATA_MANAGER.leggiCliente, leggiImmobile, leggiIVA)
//   - app.js (window.righePreventivo, classificaProdottoFiscale, CLASSIFICAZIONE_FISCALE)
//   - JSZip (caricata da CDN se assente)
//
// FUNZIONI ESPORTATE:
//   - window.exportLST()           → genera e scarica file .LST
//   - window.exportLSTDatiPreview() → mostra anteprima dati (debug)
//
// STRUTTURA .LST:
//   tmpExport/Clienti.xml           - Anagrafica cliente
//   tmpExport/Fattura.xml           - Testata (totali, IVA, detrazione)
//   tmpExport/FatturaDettaglio.xml  - Righe prodotti
//   tmpExport/FatturaDTF.xml        - Dati tecnici ENEA (placeholder)
//   tmpExport/FatturaServizi.xml    - Servizi (vuoto fase 1)
//   tmpExport/Schema*.xml           - 5 XSD corrispondenti
//
// ============================================================================

const EXPORT_LST_VERSION = '1.0.0';

// ─────────────────────────────────────────────────────────────────────────────
// CARICAMENTO JSZip (lazy, da CDN)
// ─────────────────────────────────────────────────────────────────────────────
function _caricaJSZip() {
    return new Promise((resolve, reject) => {
        if (typeof JSZip !== 'undefined') return resolve(JSZip);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = () => resolve(JSZip);
        s.onerror = () => reject(new Error('Impossibile caricare JSZip dal CDN'));
        document.head.appendChild(s);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPATURA TipoVoce / SottoVoce per Fatture Infissi Web
// ─────────────────────────────────────────────────────────────────────────────
const LST_MAPPING = {
    // SottoVoce per Beni significativi (TipoVoce=1)
    sottoVoceBeniSignif: function(tipo) {
        const t = (tipo || '').toUpperCase();
        if (t.includes('PORTONCINO'))  return { codice: 5, descr: 'Portoncini' };
        if (t.includes('BLINDATA'))    return { codice: 5, descr: 'Portoncini' };
        if (t.includes('PORTA'))       return { codice: 2, descr: 'Porte-finestre' };
        if (t.includes('SCORREVOLE'))  return { codice: 2, descr: 'Porte-finestre' };
        if (t.includes('HST'))         return { codice: 2, descr: 'Porte-finestre' };
        return { codice: 1, descr: 'Finestre' };
    },

    // SottoVoce per Accessori integrati (TipoVoce=2)
    sottoVoceIntegrati: function(tipo) {
        const t = (tipo || '').toUpperCase();
        if (t.includes('ZANZARIERA'))  return { codice: 21, descr: 'Zanzariere' };
        if (t.includes('CASSONETTO')) return { codice: 22, descr: 'Cassonetti' };
        if (t.includes('VENEZIANA'))  return { codice: 23, descr: 'Veneziane integrate' };
        return { codice: 20, descr: 'Accessori integrati' };
    },

    // SottoVoce per Parti autonome (TipoVoce=3)
    sottoVoceAutonome: function(tipo) {
        const t = (tipo || '').toUpperCase();
        if (t.includes('TAPPARELLA')) return { codice: 30, descr: 'Tapparelle' };
        if (t.includes('PERSIANA'))   return { codice: 31, descr: 'Persiane' };
        if (t.includes('SCURO'))      return { codice: 32, descr: 'Scuri' };
        if (t.includes('MOTORE'))     return { codice: 35, descr: 'Motori' };
        if (t.includes('GRATA'))      return { codice: 36, descr: 'Grate/Inferriate' };
        return { codice: 33, descr: 'Accessori autonomi' };
    },

    // Classifica e assegna TipoVoce + SottoVoce
    classifica: function(riga) {
        const classificazione = typeof classificaProdottoFiscale === 'function'
            ? classificaProdottoFiscale(riga.tipo, true)
            : 'parte_autonoma';

        if (classificazione === 'bene_significativo') {
            const sv = this.sottoVoceBeniSignif(riga.tipo);
            return { tipoVoce: 1, tipoVoceDescr: 'Beni significativi', sottoVoce: sv.codice, sottoVoceDescr: sv.descr };
        }

        // Zanzariere integrate → TipoVoce 2
        const t = (riga.tipo || '').toUpperCase();
        if (t.includes('ZANZARIERA') || t.includes('CASSONETTO') || t.includes('VENEZIANA')) {
            const sv = this.sottoVoceIntegrati(riga.tipo);
            return { tipoVoce: 2, tipoVoceDescr: 'Accessori strutturalmente integrati', sottoVoce: sv.codice, sottoVoceDescr: sv.descr };
        }

        // Tutto il resto → TipoVoce 3 (parti autonome)
        const sv = this.sottoVoceAutonome(riga.tipo);
        return { tipoVoce: 3, tipoVoceDescr: 'Parti autonome', sottoVoce: sv.codice, sottoVoceDescr: sv.descr };
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCAPE XML
// ─────────────────────────────────────────────────────────────────────────────
function _xmlEsc(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────────────────────────────
// RACCOLTA DATI DAL PREVENTIVO
// ─────────────────────────────────────────────────────────────────────────────
function _raccogliDatiLST() {
    const data = window.currentData;
    if (!data) throw new Error('Nessun progetto caricato');

    const righe = window.righePreventivo;
    if (!righe || righe.length === 0) throw new Error('Nessuna riga preventivo. Calcola il preventivo prima di esportare.');

    // Dati cliente via DATA_MANAGER
    const DM = window.DATA_MANAGER;
    const cliente = DM ? DM.leggiCliente(data) : (data.clientData || {});
    const immobile = DM ? DM.leggiImmobile(data) : (data.immobile || {});
    const iva = DM ? DM.leggiIVA(data) : (data.ivaDetrazioni || {});

    // Detrazione
    let detrazionePct = 0;
    if (iva.bonus === 'ecobonus_50') detrazionePct = 50;
    else if (iva.bonus === 'ecobonus_65') detrazionePct = 65;
    else if (iva.bonus === 'bonus_casa_50') detrazionePct = 50;
    else if (iva.bonus === 'superbonus_110') detrazionePct = 110;
    else if (iva.bonus === 'superbonus_70') detrazionePct = 70;

    // Tipo intervento per Fatture Infissi Web
    const tipoIntervento = document.getElementById('tipoInterventoSelect')?.value || 'manutenzione';

    // Righe filtrate (solo prodotti, esclusi quelli con flag escluso)
    const righeValide = righe.filter(r => {
        if (DM && DM.isProdottoEscluso && DM.isProdottoEscluso(r)) return false;
        if (r._escluso) return false;
        return true;
    });

    // Calcolo ricarico globale
    const ricaricoPct = parseFloat(document.getElementById('ricaricoPct')?.value) || 30;

    // Calcola totali per testata
    let totBeniSignif = 0, totAccessori = 0, totAutonome = 0;
    const dettaglioRighe = righeValide.map((riga, idx) => {
        const classif = LST_MAPPING.classifica(riga);
        const costoAcquisto = parseFloat(riga._totaleNetto) || 0;
        const prezzoVendita = parseFloat(riga._totaleCliente) || parseFloat(riga.totale) || 0;
        const ricarico = costoAcquisto > 0 ? ((prezzoVendita / costoAcquisto) - 1) * 100 : 0;
        const qta = parseInt(riga.quantita) || 1;

        if (classif.tipoVoce === 1) totBeniSignif += prezzoVendita;
        else if (classif.tipoVoce === 2) totAccessori += prezzoVendita;
        else totAutonome += prezzoVendita;

        return {
            id: 20000 + idx + 1,
            ordine: idx + 1,
            classif,
            descrizione: riga.ambiente || '',
            mis1: parseInt(riga.larghezza) || 0,
            mis2: parseInt(riga.altezza) || 0,
            mq: ((parseInt(riga.larghezza) || 0) * (parseInt(riga.altezza) || 0)) / 1000000,
            foro: parseInt(riga.posizione) || idx + 1,
            um: 'pz',
            qta,
            costoAcquisto: costoAcquisto / qta, // unitario
            ricarico: Math.round(ricarico * 100) / 100,
            prezzoUnitario: prezzoVendita / qta,
            prezzoTotale: prezzoVendita,
            tipo: riga.tipo || '',
            azienda: riga.azienda || '',
            telaio: riga.telaio || ''
        };
    });

    // Totali IVA (fase 1: solo prodotti, senza posa/servizi)
    const subtotale = totBeniSignif + totAccessori + totAutonome;

    return {
        cliente: {
            id: 1,
            tipo: 1,
            ragioneSociale: cliente.nomeCompleto || cliente.nome || data.client || '',
            indirizzo: cliente.indirizzo || '',
            comune: (immobile.comune || cliente.citta || '') + (immobile.provincia ? ` (${immobile.provincia})` : ''),
            cap: immobile.cap || cliente.cap || '',
            piva: cliente.piva || '',
            cf: cliente.codiceFiscale || cliente.cf || '',
            detraeIVA: 0
        },
        testata: {
            id: 1000,
            tipo: 150,
            tipoDoc: 'Fattura',
            serie: new Date().getFullYear().toString(),
            numero: 0,
            data: new Date().toISOString().split('T')[0] + 'T00:00:00+01:00',
            pagamento: 'Bonifico risparmio energetico',
            pagamentoCod: 'BONIFICO RE',
            detrazione: detrazionePct,
            totDocumento: subtotale,
            totImponibile: subtotale,
            totIVA: 0, // calcolato da Fatture Infissi Web
            totBeni10: 0,
            totBeni22: 0,
            totServizi10: 0,
            totServizi22: 0,
            totPosaServizi: 0,
            totOpereCompl: 0,
            totServiziProf: 0,
            totMarkup: 0,
            riferimento: `Fornitura di manufatti - ${immobile.indirizzo || ''} ${immobile.comune || ''}`.trim(),
            tipoIntervento,
            zonaClimatica: immobile.zonaClimatica || '',
            indirizzoImmobile: immobile.indirizzo || '',
            comuneImmobile: immobile.comune || '',
            provinciaImmobile: immobile.provincia || '',
            capImmobile: immobile.cap || '',
            catastoFoglio: immobile.foglio || '',
            catastoParticella: immobile.particella || '',
            catastoSub: immobile.sub || '',
            catastoComune: immobile.comuneCatastale || ''
        },
        righe: dettaglioRighe,
        nomeProg: data.projectName || data.project || 'export'
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERAZIONE XML
// ─────────────────────────────────────────────────────────────────────────────

function _xmlClienti(c) {
    return `<?xml version="1.0" standalone="yes"?>\r\n<DocumentElement>\r\n  <Cliente>\r\n    <ID>${c.id}</ID>\r\n    <Tipo>${c.tipo}</Tipo>\r\n    <Ragione_x0020_sociale>${_xmlEsc(c.ragioneSociale)}</Ragione_x0020_sociale>\r\n    <Indirizzo>${_xmlEsc(c.indirizzo)}</Indirizzo>\r\n    <Comune>${_xmlEsc(c.cap)} - ${_xmlEsc(c.comune)}</Comune>\r\n    <CAP>${_xmlEsc(c.cap)}</CAP>\r\n    <Partita_x0020_IVA>${_xmlEsc(c.piva || ('C.F. ' + c.cf))}</Partita_x0020_IVA>\r\n    <Codice_x0020_Fiscale>${_xmlEsc(c.cf)}</Codice_x0020_Fiscale>\r\n    <Agente>0</Agente>\r\n    <Messaggio />\r\n    <Data_x0020_avviso>0001-01-01T00:00:00+01:00</Data_x0020_avviso>\r\n    <Cod_x0020_Dest_x0020_FE />\r\n    <Blocco_x0020_amm>0</Blocco_x0020_amm>\r\n    <Motivo_x0020_blocco />\r\n    <DetraeIVA>${c.detraeIVA}</DetraeIVA>\r\n  </Cliente>\r\n</DocumentElement>`;
}

function _xmlFattura(t, clienteId) {
    return `<?xml version="1.0" standalone="yes"?>\r\n<DocumentElement>\r\n  <Dati_x0020_di_x0020_testata>\r\n    <Documento_x0020_ID>${t.id}</Documento_x0020_ID>\r\n    <Tipo>${t.tipo}</Tipo>\r\n    <Tipo_x0020_Doc>${_xmlEsc(t.tipoDoc)}</Tipo_x0020_Doc>\r\n    <Serie>${t.serie}</Serie>\r\n    <Numero>${t.numero}</Numero>\r\n    <Data>${t.data}</Data>\r\n    <Nominativo_x0020_ID>${clienteId}</Nominativo_x0020_ID>\r\n    <Pagamento_x0020__x0028_cod_x0029_>${_xmlEsc(t.pagamentoCod)}</Pagamento_x0020__x0028_cod_x0029_>\r\n    <Pagamento>${_xmlEsc(t.pagamento)}</Pagamento>\r\n    <Risorsa_x0020_pag_x0020__x0028_cod_x0029_>1</Risorsa_x0020_pag_x0020__x0028_cod_x0029_>\r\n    <Risorsa_x0020_pag>IBAN ...</Risorsa_x0020_pag>\r\n    <Tot._x0020_Documento>${t.totDocumento}</Tot._x0020_Documento>\r\n    <Detrazione>${t.detrazione}</Detrazione>\r\n    <_x0025_Rit.Acconto>0</_x0025_Rit.Acconto>\r\n    <Rit.Acconto>0</Rit.Acconto>\r\n    <Tot.IVA>${t.totIVA}</Tot.IVA>\r\n    <Tot.Imponibile>${t.totImponibile}</Tot.Imponibile>\r\n    <TotServizi10>${t.totServizi10}</TotServizi10>\r\n    <TotBeni10>${t.totBeni10}</TotBeni10>\r\n    <TotBeni22>${t.totBeni22}</TotBeni22>\r\n    <TotServizi22>${t.totServizi22}</TotServizi22>\r\n    <Tot_x0020_Posa_x0020_Servizi>${t.totPosaServizi}</Tot_x0020_Posa_x0020_Servizi>\r\n    <Tot_x0020_Opere_x0020_complementari>${t.totOpereCompl}</Tot_x0020_Opere_x0020_complementari>\r\n    <Tot_x0020_servizi_x0020_professionali>0</Tot_x0020_servizi_x0020_professionali>\r\n    <Tot_x0020_tutti_x0020_servizi_x0020_prof>${t.totServiziProf}</Tot_x0020_tutti_x0020_servizi_x0020_prof>\r\n    <TotMarkup>${t.totMarkup}</TotMarkup>\r\n    <Riferimento>${_xmlEsc(t.riferimento)}</Riferimento>\r\n    <MenuVoci>1</MenuVoci>\r\n    <TipoVerificaBonus>-1</TipoVerificaBonus>\r\n    <Zona>${_xmlEsc(t.zonaClimatica)}</Zona>\r\n    <Indirizzo_x0020_immobile>${_xmlEsc(t.indirizzoImmobile)}</Indirizzo_x0020_immobile>\r\n    <Comune_x0020_immobile>${_xmlEsc(t.comuneImmobile)}</Comune_x0020_immobile>\r\n    <Provincia_x0020_immobile>${_xmlEsc(t.provinciaImmobile)}</Provincia_x0020_immobile>\r\n    <CAP_x0020_immobile>${_xmlEsc(t.capImmobile)}</CAP_x0020_immobile>\r\n    <Catasto_x0020_foglio>${_xmlEsc(t.catastoFoglio)}</Catasto_x0020_foglio>\r\n    <Catasto_x0020_particella>${_xmlEsc(t.catastoParticella)}</Catasto_x0020_particella>\r\n    <Catasto_x0020_Sub>${_xmlEsc(t.catastoSub)}</Catasto_x0020_Sub>\r\n    <Catasto_x0020_Comune>${_xmlEsc(t.catastoComune)}</Catasto_x0020_Comune>\r\n    <Acconto>false</Acconto>\r\n    <Contractor>1</Contractor>\r\n    <PercDetrazione>1</PercDetrazione>\r\n  </Dati_x0020_di_x0020_testata>\r\n</DocumentElement>`;
}

function _xmlDettaglio(righe, fatturaId) {
    let xml = `<?xml version="1.0" standalone="yes"?>\r\n<DocumentElement>\r\n`;
    righe.forEach(r => {
        const codIVA = r.classif.tipoVoce === 1 ? '10/22%' :
                       r.classif.tipoVoce === 2 ? '10/22%' : '10%';
        const percIVA = r.classif.tipoVoce >= 3 ? 10 : 22; // Default, ricalcolato da Fatture Infissi
        xml += `  <Dati_x0020_di_x0020_dettaglio>\r\n`;
        xml += `    <ID>${r.id}</ID>\r\n`;
        xml += `    <Ordine>${r.ordine}</Ordine>\r\n`;
        xml += `    <FatturaID>${fatturaId}</FatturaID>\r\n`;
        xml += `    <TipoVoce>${r.classif.tipoVoce}</TipoVoce>\r\n`;
        xml += `    <TipoVoceDescr>${_xmlEsc(r.classif.tipoVoceDescr)}</TipoVoceDescr>\r\n`;
        xml += `    <SottoVoce>${r.classif.sottoVoce}</SottoVoce>\r\n`;
        xml += `    <SottoVoceDescr>${_xmlEsc(r.classif.sottoVoceDescr)}</SottoVoceDescr>\r\n`;
        xml += `    <Descrizione>${_xmlEsc(r.descrizione)}</Descrizione>\r\n`;
        xml += `    <Mis1>${r.mis1}</Mis1>\r\n`;
        xml += `    <Mis2>${r.mis2}</Mis2>\r\n`;
        xml += `    <Cassonetto>false</Cassonetto>\r\n`;
        xml += `    <Oscuranti>false</Oscuranti>\r\n`;
        xml += `    <Foro>${r.foro}</Foro>\r\n`;
        xml += `    <UM>${r.um}</UM>\r\n`;
        xml += `    <Quantità>${r.qta}</Quantità>\r\n`;
        xml += `    <Piano>0</Piano>\r\n`;
        xml += `    <ImportoAcquisto>${r.costoAcquisto.toFixed(2)}</ImportoAcquisto>\r\n`;
        xml += `    <Ricarico>${r.ricarico.toFixed(2)}</Ricarico>\r\n`;
        xml += `    <Importo_x0020_Unitario>${r.prezzoUnitario.toFixed(2)}</Importo_x0020_Unitario>\r\n`;
        xml += `    <Sconti />\r\n`;
        xml += `    <ImpUnitScontato>${r.prezzoUnitario.toFixed(2)}</ImpUnitScontato>\r\n`;
        xml += `    <ImpTotScontato>${r.prezzoTotale.toFixed(2)}</ImpTotScontato>\r\n`;
        xml += `    <Codice_x0020_IVA>${codIVA}</Codice_x0020_IVA>\r\n`;
        xml += `    <Percentuale_x0020_IVA>${percIVA}</Percentuale_x0020_IVA>\r\n`;
        xml += `    <Importo_x0020_Imponibile>${r.prezzoTotale.toFixed(2)}</Importo_x0020_Imponibile>\r\n`;
        xml += `    <Importo_x0020_IVA>${(r.prezzoTotale * percIVA / 100).toFixed(4)}</Importo_x0020_IVA>\r\n`;
        xml += `    <Importo_x0020_Totale>${(r.prezzoTotale * (1 + percIVA / 100)).toFixed(4)}</Importo_x0020_Totale>\r\n`;
        xml += `    <Importo_x0020_Congruo>0</Importo_x0020_Congruo>\r\n`;
        xml += `    <NoRitenuta>false</NoRitenuta>\r\n`;
        xml += `    <Importo_x0020_DEI>0</Importo_x0020_DEI>\r\n`;
        xml += `    <Automatico>0</Automatico>\r\n`;
        xml += `  </Dati_x0020_di_x0020_dettaglio>\r\n`;
    });
    xml += `</DocumentElement>`;
    return xml;
}

function _xmlDTF(righe, fatturaId) {
    let xml = `<?xml version="1.0" standalone="yes"?>\r\n<DocumentElement>\r\n`;
    righe.forEach(r => {
        xml += `  <Dati_x0020_di_x0020_dettaglio>\r\n`;
        xml += `    <ID>${r.id}</ID>\r\n`;
        xml += `    <FatturaID>${fatturaId}</FatturaID>\r\n`;
        xml += `    <TipoVoce>${r.classif.tipoVoce}</TipoVoce>\r\n`;
        xml += `    <TipoVoceDescr>${_xmlEsc(r.classif.tipoVoceDescr)}</TipoVoceDescr>\r\n`;
        xml += `    <SottoVoce>${r.classif.sottoVoce}</SottoVoce>\r\n`;
        xml += `    <SottoVoceDescr>${_xmlEsc(r.classif.sottoVoceDescr)}</SottoVoceDescr>\r\n`;
        if (r.descrizione) xml += `    <Descrizione>${_xmlEsc(r.descrizione)}</Descrizione>\r\n`;
        if (r.mis1) xml += `    <Mis1>${r.mis1}</Mis1>\r\n`;
        if (r.mis2) xml += `    <Mis2>${r.mis2}</Mis2>\r\n`;
        xml += `    <Mq>${r.mq.toFixed(6)}</Mq>\r\n`;
        xml += `    <Cassonetto>false</Cassonetto>\r\n`;
        xml += `    <Oscuranti>false</Oscuranti>\r\n`;
        xml += `    <Foro>${r.foro}</Foro>\r\n`;
        xml += `    <UM>${r.um}</UM>\r\n`;
        xml += `    <Quantità>${r.qta}</Quantità>\r\n`;
        // Dati tecnici ENEA — placeholder, da compilare in Fatture Infissi Web
        xml += `    <Uw_x0020_new>0</Uw_x0020_new>\r\n`;
        xml += `    <Condiz_Riscald>false</Condiz_Riscald>\r\n`;
        xml += `    <Superficie_x0020_protetta>0</Superficie_x0020_protetta>\r\n`;
        xml += `    <GTot_x0020_new>0</GTot_x0020_new>\r\n`;
        xml += `    <Integrato>false</Integrato>\r\n`;
        xml += `  </Dati_x0020_di_x0020_dettaglio>\r\n`;
    });
    xml += `</DocumentElement>`;
    return xml;
}

function _xmlServizi() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<DocumentElement />`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMI XSD (copiati da file Pagnoncelli di riferimento)
// ─────────────────────────────────────────────────────────────────────────────

function _schemaClienti() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">\r\n  <xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:MainDataTable="Cliente" msdata:UseCurrentLocale="true">\r\n    <xs:complexType>\r\n      <xs:choice minOccurs="0" maxOccurs="unbounded">\r\n        <xs:element name="Cliente">\r\n          <xs:complexType>\r\n            <xs:sequence>\r\n              <xs:element name="ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Tipo" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Ragione_x0020_sociale" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Indirizzo" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Comune" type="xs:string" minOccurs="0" />\r\n              <xs:element name="CAP" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Partita_x0020_IVA" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Codice_x0020_Fiscale" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Agente" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Messaggio" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Data_x0020_avviso" type="xs:dateTime" minOccurs="0" />\r\n              <xs:element name="Cod_x0020_Dest_x0020_FE" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Blocco_x0020_amm" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Motivo_x0020_blocco" type="xs:string" minOccurs="0" />\r\n              <xs:element name="DetraeIVA" type="xs:int" minOccurs="0" />\r\n            </xs:sequence>\r\n          </xs:complexType>\r\n        </xs:element>\r\n      </xs:choice>\r\n    </xs:complexType>\r\n  </xs:element>\r\n</xs:schema>`;
}

function _schemaFattura() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">\r\n  <xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:MainDataTable="Dati_x0020_di_x0020_testata" msdata:UseCurrentLocale="true">\r\n    <xs:complexType>\r\n      <xs:choice minOccurs="0" maxOccurs="unbounded">\r\n        <xs:element name="Dati_x0020_di_x0020_testata">\r\n          <xs:complexType>\r\n            <xs:sequence>\r\n              <xs:element name="Documento_x0020_ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Tipo" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Tipo_x0020_Doc" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Serie" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Numero" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Data" type="xs:dateTime" minOccurs="0" />\r\n              <xs:element name="Nominativo_x0020_ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Tot._x0020_Documento" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Detrazione" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Tot.IVA" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Tot.Imponibile" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Zona" type="xs:string" minOccurs="0" />\r\n            </xs:sequence>\r\n          </xs:complexType>\r\n        </xs:element>\r\n      </xs:choice>\r\n    </xs:complexType>\r\n  </xs:element>\r\n</xs:schema>`;
}

function _schemaDettaglio() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">\r\n  <xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:MainDataTable="Dati_x0020_di_x0020_dettaglio" msdata:UseCurrentLocale="true">\r\n    <xs:complexType>\r\n      <xs:choice minOccurs="0" maxOccurs="unbounded">\r\n        <xs:element name="Dati_x0020_di_x0020_dettaglio">\r\n          <xs:complexType>\r\n            <xs:sequence>\r\n              <xs:element name="ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Ordine" type="xs:int" minOccurs="0" />\r\n              <xs:element name="FatturaID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="TipoVoce" type="xs:int" minOccurs="0" />\r\n              <xs:element name="TipoVoceDescr" type="xs:string" minOccurs="0" />\r\n              <xs:element name="SottoVoce" type="xs:int" minOccurs="0" />\r\n              <xs:element name="SottoVoceDescr" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Descrizione" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Mis1" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Mis2" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Foro" type="xs:int" minOccurs="0" />\r\n              <xs:element name="UM" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Quantità" type="xs:double" minOccurs="0" />\r\n              <xs:element name="ImportoAcquisto" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Ricarico" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Importo_x0020_Unitario" type="xs:double" minOccurs="0" />\r\n              <xs:element name="ImpTotScontato" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Codice_x0020_IVA" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Percentuale_x0020_IVA" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Importo_x0020_Imponibile" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Importo_x0020_IVA" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Importo_x0020_Totale" type="xs:double" minOccurs="0" />\r\n            </xs:sequence>\r\n          </xs:complexType>\r\n        </xs:element>\r\n      </xs:choice>\r\n    </xs:complexType>\r\n  </xs:element>\r\n</xs:schema>`;
}

function _schemaDTF() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">\r\n  <xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:MainDataTable="Dati_x0020_di_x0020_dettaglio" msdata:UseCurrentLocale="true">\r\n    <xs:complexType>\r\n      <xs:choice minOccurs="0" maxOccurs="unbounded">\r\n        <xs:element name="Dati_x0020_di_x0020_dettaglio">\r\n          <xs:complexType>\r\n            <xs:sequence>\r\n              <xs:element name="ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="FatturaID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="TipoVoce" type="xs:int" minOccurs="0" />\r\n              <xs:element name="TipoVoceDescr" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Mq" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Foro" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Quantità" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Uw_x0020_new" type="xs:double" minOccurs="0" />\r\n              <xs:element name="Integrato" type="xs:boolean" minOccurs="0" />\r\n            </xs:sequence>\r\n          </xs:complexType>\r\n        </xs:element>\r\n      </xs:choice>\r\n    </xs:complexType>\r\n  </xs:element>\r\n</xs:schema>`;
}

function _schemaServizi() {
    return `<?xml version="1.0" standalone="yes"?>\r\n<xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">\r\n  <xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:MainDataTable="Servizio" msdata:UseCurrentLocale="true">\r\n    <xs:complexType>\r\n      <xs:choice minOccurs="0" maxOccurs="unbounded">\r\n        <xs:element name="Servizio">\r\n          <xs:complexType>\r\n            <xs:sequence>\r\n              <xs:element name="ID" type="xs:int" minOccurs="0" />\r\n              <xs:element name="Descrizione" type="xs:string" minOccurs="0" />\r\n              <xs:element name="Importo" type="xs:double" minOccurs="0" />\r\n            </xs:sequence>\r\n          </xs:complexType>\r\n        </xs:element>\r\n      </xs:choice>\r\n    </xs:complexType>\r\n  </xs:element>\r\n</xs:schema>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNZIONE PRINCIPALE: EXPORT LST
// ─────────────────────────────────────────────────────────────────────────────

async function exportLST() {
    console.log(`📄 Export LST v${EXPORT_LST_VERSION} - Inizio...`);

    try {
        // 1. Raccogli dati
        const dati = _raccogliDatiLST();
        console.log(`📄 Raccolte ${dati.righe.length} righe prodotto`);

        // 2. Carica JSZip
        const JSZipLib = await _caricaJSZip();
        const zip = new JSZipLib();
        const folder = zip.folder('tmpExport');

        // 3. Genera XML dati
        folder.file('Clienti.xml', _xmlClienti(dati.cliente));
        folder.file('Fattura.xml', _xmlFattura(dati.testata, dati.cliente.id));
        folder.file('FatturaDettaglio.xml', _xmlDettaglio(dati.righe, dati.testata.id));
        folder.file('FatturaDTF.xml', _xmlDTF(dati.righe, dati.testata.id));
        folder.file('FatturaServizi.xml', _xmlServizi());

        // 4. Genera schemi XSD
        folder.file('SchemaClienti.xml', _schemaClienti());
        folder.file('SchemaFattura.xml', _schemaFattura());
        folder.file('SchemaFatturaDettaglio.xml', _schemaDettaglio());
        folder.file('SchemaFatturaDTF.xml', _schemaDTF());
        folder.file('SchemaFatturaServizi.xml', _schemaServizi());

        // 5. Genera ZIP e scarica come .LST
        const blob = await zip.generateAsync({ type: 'blob' });
        const nomeFile = (dati.cliente.ragioneSociale || dati.nomeProg || 'export')
            .replace(/[^a-zA-Z0-9àèéìòùÀÈÉÌÒÙ ]/g, '')
            .trim()
            .replace(/\s+/g, '_');

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nomeFile}.LST`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`✅ Export LST completato: ${nomeFile}.LST (${dati.righe.length} righe)`);

    } catch (err) {
        console.error('❌ Export LST fallito:', err);
        alert('❌ Errore export LST: ' + err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG: ANTEPRIMA DATI
// ─────────────────────────────────────────────────────────────────────────────
function exportLSTDatiPreview() {
    try {
        const dati = _raccogliDatiLST();
        console.log('📋 ANTEPRIMA EXPORT LST:');
        console.log('👤 Cliente:', dati.cliente);
        console.log('📄 Testata:', dati.testata);
        console.table(dati.righe.map(r => ({
            pos: r.foro,
            tipo: r.tipo,
            descr: r.descrizione,
            tipoVoce: `${r.classif.tipoVoce} - ${r.classif.tipoVoceDescr}`,
            sottoVoce: `${r.classif.sottoVoce} - ${r.classif.sottoVoceDescr}`,
            L: r.mis1, H: r.mis2,
            costo: `€${r.costoAcquisto.toFixed(2)}`,
            vendita: `€${r.prezzoUnitario.toFixed(2)}`,
            ricarico: `${r.ricarico.toFixed(1)}%`
        })));
        return dati;
    } catch (err) {
        console.error('❌ Preview fallita:', err);
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRAZIONE GLOBALE
// ─────────────────────────────────────────────────────────────────────────────
window.exportLST = exportLST;
window.exportLSTDatiPreview = exportLSTDatiPreview;

console.log(`📄 Export Fatture Infissi v${EXPORT_LST_VERSION} - Pronto!`);
