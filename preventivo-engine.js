// ============================================================================
// PREVENTIVO ENGINE v1.0.0 (13 FEB 2026)
// Estratto da app.js v8.70 — Orchestratore calcolo preventivo multi-fornitore
// ============================================================================
// Dipendenze (tutte window.*):
//   - calcolaPrezzoFinstral() → finstral.js
//   - calcolaPrezzoCassonettoFinstral() → finstral.js
//   - determinaTipoInfisso() → finstral.js
//   - calcolaPerimetroBRM() → finstral.js
//   - estraiNumeroAnte() → finstral.js
//   - mappaColoreACodiceFinstral() → finstral-config.js
//   - calcolaPrezzoPLASTICINO(), calcolaPrezzoGuida() → plasticino.js
//   - calcolaPrezzoPersianaCOMPLETO() → erreci.js
//   - calcolaPrezzoBlindataOikos() → oikos.js
//   - calcolaPrezzoPortoncinoFindoor() → findoor.js
//   - getPrezzoMotore(), getPrezzoComando() → somfy.js
//   - getProductBRM() → shared-database
//   - getQta(), validaProdotto() → prodotti-config.js
// ============================================================================

function calcolaPreventivo(data) {
    console.log('💰 calcolaPreventivo() chiamata con data:', data);
    console.log('📊 Numero posizioni:', (data.positions || data.posizioni || []).length);
    
    const righe = [];
    let totaleMateriali = 0;
    let numeroPezzi = 0;
    
    // GESTISCI ENTRAMBE LE STRUTTURE: positions (app) e posizioni (vecchio)
    const posizioni = data.positions || data.posizioni || [];
    
    console.log('🔍 Struttura posizioni:', posizioni.length > 0 ? 'OK' : 'VUOTA');
    console.log('🔍 Array righe PRIMA forEach:', righe.length);
    
    // Processa ogni posizione
    posizioni.forEach((pos, index) => {
        // 🔐 v7.98_07: NORMALIZZA BLINDATA da ingresso.blindata se non già presente
        if (pos.ingresso?.blindata && !pos.blindata) {
            pos.blindata = pos.ingresso.blindata;
            console.log(`   🔐 NORMALIZZATO pos ${index + 1}: ingresso.blindata → blindata`);
        }
        
        // getQta() da prodotti-config.js (global)
        
        // Processa INFISSI
        const infissoQta = getQta(pos.infisso);
        if (pos.infisso && infissoQta > 0) {
            const infisso = pos.infisso;
            
            // 🔧 v8.54: BRM centralizzato via getProductBRM (offset +100/+50 per infissi)
            const brmInfisso = getProductBRM(infisso, pos, { L: 100, H: 50 });
            let L_mm = brmInfisso.L;
            let H_mm = brmInfisso.H;
            let brmStimato = brmInfisso.stimato;
            let brmOrigine = brmInfisso.origine;
            if (brmStimato) console.log(`📐 Pos ${index + 1}: BRM STIMATO da ${brmOrigine} → ${L_mm} × ${H_mm} mm`);
            
            if (L_mm && H_mm) {
                // ✅ v7.55: Log tipo e tipoAnta infissi
                const numAnteInfisso = estraiNumeroAnte(infisso.tipo);
                console.log(`🪟 Infisso tipo="${infisso.tipo || 'N/D'}" → ${numAnteInfisso} ante`);
                console.log(`🚪 Tipo Anta: "${infisso.tipoAnta || data.configInfissi?.tipoAnta || 'step-line'}"`);
                
                // Calcola perimetro BRM
                const perimetro_ml = calcolaPerimetroBRM(L_mm, H_mm);
                const superficie_mq = (L_mm * H_mm) / 1000000;
                
                // Ottieni telaio (da configurazione o da infisso)
                const telaio = infisso.telaio || 
                               data.configInfissi?.telaio || 
                               '961';
                
                // Determina colore (per supplemento)
                const coloreEsterno = infisso.coloreEst || 
                                     infisso.coloreEsterno || 
                                     data.configInfissi?.coloreEst ||
                                     data.configInfissi?.coloreEsterno || 
                                     '';
                const coloreInterno = infisso.coloreInt || 
                                     infisso.coloreInterno || 
                                     data.configInfissi?.coloreInt ||
                                     data.configInfissi?.coloreInterno || 
                                     '';
                const coloreScuro = isColoreScuro(coloreEsterno);
                
                // ✅ v7.73: Estrai tipo anta per calcolo colore
                const tipoAnta = infisso.tipoAnta || data.configInfissi?.tipoAnta || 'step-line';
                
                // ✅ v8.467: USA FUNZIONE CENTRALIZZATA PER DETERMINARE TIPO
                const tipoInfo = determinaTipoInfisso(infisso, data.configInfissi);
                const tipoFinstral = tipoInfo.tipoFinstral;
                const isScorrevole = tipoInfo.isScorrevole;
                const isFinSlide = tipoInfo.isFinSlide;  // 🆕 v8.472
                const tipoVisualizzato = tipoInfo.tipoVisualizzato;
                const ferramenta1 = infisso.ferramenta1 || '';
                
                // ✅ v8.468 FIX: Ripristina variabili per compatibilità
                const tipoInfisso = (infisso.tipo || tipoVisualizzato || '').toLowerCase();
                const apertura = infisso.apertura || infisso.tipo || 'battente';
                
                console.log(`🏷️ Pos ${index+1}: tipoVisualizzato="${tipoVisualizzato}", tipoFinstral="${tipoFinstral}", isScorrevole=${isScorrevole}, isFinSlide=${isFinSlide}`);
                
                // 🆕 v8.472: CALCOLO FIN-SLIDE (HST) - Usa database dedicato
                if (isFinSlide && typeof FINSLIDE_PREZZI !== 'undefined') {
                    // 🆕 v8.481: Supporta sia camelCase che snake_case da JSON
                    // 🆕 v8.483: Default telaio 90M (ALU-PVC 168mm)
                    const finslideTelaio = infisso.finslideTelaio || infisso.finslide_telaio || '90M';
                    const finslideAnta = infisso.finslideAnta || infisso.finslide_anta || 'Step-line Door';
                    const finslideFerramenta = infisso.finslideFerramenta || infisso.finslide_ferramenta || '83';
                    
                    console.log(`🏠 FIN-Slide Pos ${index+1}: Telaio=${finslideTelaio}, Anta=${finslideAnta}, Ferr=${finslideFerramenta}`);
                    
                    // Calcola prezzo telaio
                    const prezzoTelaio = FINSLIDE_PREZZI.calcolaPrezzoTelaio(finslideTelaio, L_mm, H_mm);
                    
                    // 🆕 v8.475: Determina numero ante mobili E numero elementi fissi
                    const numAnteMobili = tipoInfo.numAnte || 1;
                    let numFissi = 0;
                    
                    // Mappa codice → numero fissi
                    const mappaFissi = {
                        'FS600': 1,   // 1 fisso
                        'FS601': 1,   // anta + fisso
                        'FS602': 1,   // fisso + anta
                        'FS610': 1,   // anta + fisso + anta
                        'FS611': 2,   // anta + fisso + fisso + anta
                        'FS614': 1,   // 2 ante + fisso
                        'FS615': 1,   // 2 ante collegate + fisso
                        'FS616': 1,   // fisso + 2 ante
                        'FS617': 1,   // anta + fisso + 2 ante
                        'FS621': 2    // 2 fissi
                    };
                    numFissi = mappaFissi[tipoFinstral] || 0;
                    
                    // Calcola larghezze proporzionali
                    const numCampi = numAnteMobili + numFissi;
                    const larghezzaCampo = numCampi > 0 ? L_mm / numCampi : L_mm;
                    
                    // Calcola prezzo anta (solo per ante mobili)
                    const prezzoAntaUnit = numAnteMobili > 0 ? FINSLIDE_PREZZI.calcolaPrezzoAnta(finslideAnta, larghezzaCampo, H_mm) : 0;
                    const prezzoAnte = prezzoAntaUnit * numAnteMobili;
                    
                    // 🆕 v8.477: Calcola prezzo ELEMENTO FISSO (profilo battente FIN-Slide)
                    // L'elemento fisso FIN-Slide usa lo stesso profilo dell'anta, non tipo 102
                    // Fattore correttivo: ~63% del prezzo anta (basato su confronto protocollo)
                    let prezzoFissi = 0;
                    if (numFissi > 0) {
                        // Usa la stessa griglia delle ante con fattore 0.628
                        const prezzoFissoUnit = FINSLIDE_PREZZI.calcolaPrezzoAnta(finslideAnta, larghezzaCampo, H_mm) * 0.628;
                        prezzoFissi = prezzoFissoUnit * numFissi;
                        
                        console.log(`📐 Fisso FIN-Slide: ${larghezzaCampo}×${H_mm}, €${(prezzoFissoUnit/0.628).toFixed(0)}×0.628=${prezzoFissoUnit.toFixed(0)}×${numFissi}=€${prezzoFissi.toFixed(0)}`);
                    }
                    
                    // Supplemento ferramenta
                    const supplFerr = FINSLIDE_PREZZI.supplementiFerramenta?.[finslideFerramenta]?.prezzo || 0;
                    
                    // 🆕 v8.479: Calcola prezzo MANIGLIA HST
                    // Maniglia serie 2 = €166 (default per porta-finestra alzante scorrevole)
                    // 🆕 v8.481: Supporta sia camelCase che snake_case da JSON
                    const finslideManiglia = infisso.finslideManiglia || infisso.finslide_maniglia || 'serie2';
                    let prezzoManiglia = 0;
                    if (FINSLIDE_PREZZI.maniglie?.[finslideManiglia]) {
                        prezzoManiglia = FINSLIDE_PREZZI.maniglie[finslideManiglia].default || 166;
                    } else {
                        // Default: maniglia serie 2 per HST
                        prezzoManiglia = 166;
                    }
                    console.log(`🚪 Maniglia HST: ${finslideManiglia} = €${prezzoManiglia}`);
                    
                    // 🆕 v8.480: Calcola prezzo VETRI FIN-Slide
                    // Default: Max-Valor 3 triplo 46mm (più comune per HST)
                    // 🆕 v8.481: Supporta sia camelCase che snake_case da JSON
                    const finslideVetro = infisso.finslideVetro || infisso.finslide_vetro || 'Max-Valor3_46';
                    let prezzoVetri = 0;
                    
                    if (FINSLIDE_PREZZI.vetri?.[finslideVetro]) {
                        const vetroConfig = FINSLIDE_PREZZI.vetri[finslideVetro];
                        
                        // Superficie per campo in m²
                        const superficieCampo = (larghezzaCampo / 1000) * (H_mm / 1000);
                        
                        // Prezzo vetro anta: €145/m² (codice 11429)
                        // Prezzo vetro fisso: €176/m² (codice 12429) - vetro più spesso
                        const prezzoVetroAnta = vetroConfig.codici?.['11429']?.prezzoMq || vetroConfig.default || 145;
                        const prezzoVetroFisso = vetroConfig.codici?.['12429']?.prezzoMq || 176;
                        
                        const prezzoVetriAnte = superficieCampo * prezzoVetroAnta * numAnteMobili;
                        const prezzoVetriFissi = superficieCampo * prezzoVetroFisso * numFissi;
                        prezzoVetri = prezzoVetriAnte + prezzoVetriFissi;
                        
                        console.log(`🔷 Vetri FIN-Slide: ${superficieCampo.toFixed(2)}m² × (${numAnteMobili}×€${prezzoVetroAnta} + ${numFissi}×€${prezzoVetroFisso}) = €${prezzoVetri.toFixed(2)}`);
                    }
                    
                    // 🆕 v8.480: Totale FIN-Slide include FISSI + MANIGLIA + VETRI
                    const totaleFinSlide = prezzoTelaio + prezzoAnte + prezzoFissi + supplFerr + prezzoManiglia + prezzoVetri;
                    
                    console.log(`💰 FIN-Slide Pos ${index+1}: Telaio €${prezzoTelaio} + Ante €${prezzoAnte} + Fissi €${prezzoFissi} + Ferr €${supplFerr} + Maniglia €${prezzoManiglia} + Vetri €${prezzoVetri.toFixed(0)} = €${totaleFinSlide.toFixed(0)}`);
                    
                    // Quantità - 🆕 v8.510: USA SOLO prodotto.qta
                    const quantita = getQta(infisso) || 1;
                    const totaleRiga = totaleFinSlide * quantita;
                    
                    // ✅ v8.468: Validazione prodotto
                    const validazioneInfisso = validaProdotto('infisso', infisso, data.configInfissi);
                    
                    righe.push({
                        posizione: index + 1,
                        ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                        tipo: tipoVisualizzato,
                        tipoFinstral: tipoFinstral,
                        isScorrevole: true,
                        isFinSlide: true,
                        validazione: validazioneInfisso,
                        brmStimato: brmStimato,
                        brmOrigine: brmOrigine,
                        azienda: 'Finstral',
                        telaio: `HST-${finslideTelaio}`,
                        tipoAnta: finslideAnta,
                        vetro: finslideVetro,  // 🆕 v8.480: Tipo vetro HST
                        larghezza: L_mm,
                        altezza: H_mm,
                        superficie: superficie_mq.toFixed(2),
                        perimetro: perimetro_ml.toFixed(2),
                        prezzoBase: prezzoTelaio.toFixed(2),
                        supplemento: (prezzoAnte + prezzoFissi + supplFerr + prezzoManiglia + prezzoVetri).toFixed(2),  // 🆕 v8.480: Include vetri
                        supplementoTelaio: '0.00',
                        supplementoAnta: prezzoAnte.toFixed(2),
                        supplementoFisso: prezzoFissi.toFixed(2),
                        numFissi: numFissi,
                        supplementoVetro: prezzoVetri.toFixed(2),  // 🆕 v8.480: Vetri HST
                        vetroHST: finslideVetro,  // 🆕 v8.480
                        supplementoColore: '0.00',
                        supplementoManiglia: prezzoManiglia.toFixed(2),
                        manigliaHST: finslideManiglia,
                        supplementoMontante: '0.00',
                        supplementoSoglia: '0.00',
                        supplementoManigliettaPF: '0.00',
                        supplementoTagli: '0.00',
                        tagli: '',
                        isPortaFinestra: true,
                        prezzoUnitario: totaleFinSlide.toFixed(2),
                        quantita: quantita,
                        totale: totaleRiga.toFixed(2)
                    });
                    
                    totaleMateriali += totaleRiga;
                    numeroPezzi += quantita;
                    
                } else {
                // CALCOLO STANDARD (non FIN-Slide)
                
                // Determina materiale
                // ✅ v7.73 FIX: Usa finituraEst per determinare se esterno è alluminio
                // ✅ v8.520: Anche telaio con "riv.est." indica rivestimento ALU esterno
                const finituraEstInfisso = infisso.finituraEst || infisso.finitura_est || '';
                const finituraEstConfig = data.configInfissi?.finituraEst || data.configInfissi?.finitura_est || '';
                const finituraEst = (finituraEstInfisso || finituraEstConfig || '').toLowerCase();
                const telaioCodice = (typeof telaio === 'string' ? telaio : '').toLowerCase();
                const haRivestimentoEst = telaioCodice.includes('riv.est') || telaioCodice.includes('riv. est');
                // ✅ v8.70: La finitura esterna EFFETTIVA determina il materiale
                // "(riv.est.)" nel telaio indica solo che SUPPORTA rivestimento, non che ce l'ha
                const finituraIndicaPVC = finituraEst.includes('pvc');
                const finituraIndicaALU = finituraEst.includes('alluminio') || finituraEst.includes('alu');
                let materiale;
                if (finituraIndicaALU) {
                    materiale = 'alluminio';
                } else if (finituraIndicaPVC) {
                    materiale = 'pvc';
                } else {
                    // Fallback: se finitura è vuota, usa nome telaio
                    materiale = haRivestimentoEst ? 'alluminio' : 'pvc';
                }
                console.log(`🔧 Materiale Pos ${index+1}:`);
                console.log(`   infisso.finituraEst = "${infisso.finituraEst || 'undefined'}"`);
                console.log(`   infisso.finitura_est = "${infisso.finitura_est || 'undefined'}"`);
                console.log(`   configInfissi.finituraEst = "${data.configInfissi?.finituraEst || 'undefined'}"`);
                console.log(`   telaio riv.est: ${haRivestimentoEst}`);
                console.log(`   → finituraEst finale = "${finituraEst}" → materiale = ${materiale}`);
                
                // ✅ v7.73: Mappa colori a codici Finstral
                const codicePVC = mappaColoreACodiceFinstral(coloreInterno || coloreEsterno, 'pvc');
                const codiceAlluminio = materiale === 'alluminio' ? 
                    mappaColoreACodiceFinstral(coloreEsterno, 'alluminio') : null;
                
                // ✅ CALCOLO FINSTRAL COMPLETO CON COLORI
                console.log(`🚀 Chiamata calcolaPrezzoFinstral con materiale="${materiale}"${isScorrevole ? ', SCORREVOLE' : ''}`);
                const risultatoFinstral = calcolaPrezzoFinstral({
                    tipo: tipoFinstral,
                    larghezza: L_mm,
                    altezza: H_mm,
                    telaio: telaio,
                    materiale: materiale,
                    tipoAnta: tipoAnta,
                    colorePVC: codicePVC,
                    coloreAlluminio: codiceAlluminio,
                    ferramenta1: ferramenta1,
                    esecuzione1: infisso.esecuzione1 || '0',
                    isScorrevole: isScorrevole,
                    // ✅ v8.70: Passa TUTTI i config per calcolo centralizzato
                    vetro: infisso.vetro || data.configInfissi?.vetro || 'doppio',
                    maniglia: infisso.maniglia || data.configInfissi?.maniglia || '',
                    coloreManiglia: infisso.coloreManiglia || data.configInfissi?.coloreManiglia || '',
                    isPortaFinestra: tipoInfo.isPortaFinestra || H_mm >= 1800,
                    antaTwinTipo: infisso.antaTwinTipo || '',
                    antaTwinModello: infisso.antaTwinModello || '',
                    antaTwinColore: infisso.antaTwinColore || '',
                    antaTwinComando: infisso.antaTwinComando || data.configInfissi?.antaTwinComando || '27',
                    bancaleTipo: infisso.bancaleTipo || '',
                    bancaleProfondita: infisso.bancaleProfondita || '',
                    bancaleLunghezza: infisso.bancaleLunghezza || 0,
                    tagliTelaio: infisso.tagliTelaio || infisso.taglio || infisso.tagli || null,
                    numAnte: tipoInfo.numAnte || 1
                });
                
                // ✅ v8.70: CALCOLO CENTRALIZZATO - Dashboard legge solo risultatoFinstral
                if (risultatoFinstral.errore) {
                    console.warn(`⚠️ Finstral Pos ${index+1}: ${risultatoFinstral.errore}`);
                }
                
                const d = risultatoFinstral.dettaglio;
                const prezzoBase = d.prezzoBase || 0;
                const supplementoTelaio = d.supplementoTelaio || 0;
                const supplementoProfiloAnta = d.supplementoProfiloAnta || 0;
                const supplementoMontante = d.supplementoMontante || 0;
                const supplementoColore = (d.supplementoColorePVC || 0) + (d.supplementoColoreAlluminio || 0);
                const supplementoVetro = d.supplementoVetro || 0;
                const supplementoManiglia = d.supplementoManiglia || 0;
                const supplementoSoglia = d.supplementoSoglia || 0;
                const supplementoManigliettaPF = d.supplementoManigliettaPF || 0;
                const supplementoTagli = d.supplementoTagli || 0;
                const isPortaFinestra = d.isPortaFinestra || false;
                const taglioDescrizione = '';
                
                const prezzoUnitario = risultatoFinstral.totale || 0;
                const supplementoTotale = prezzoUnitario - prezzoBase;
                
                console.log(`💰 FINSTRAL Pos ${index+1}: tipo${tipoFinstral} ${L_mm}×${H_mm} tel.${telaio} ${tipoAnta}`);
                console.log(`   └─ Totale €${prezzoUnitario} (Base €${prezzoBase} + Suppl €${supplementoTotale.toFixed(2)})`);
                
                
                // Quantità - 🆕 v8.510: USA SOLO prodotto.qta
                const quantita = getQta(infisso) || 1;
                
                // Totale riga
                const totaleRiga = prezzoUnitario * quantita;
                
                // ✅ v8.468: Validazione prodotto
                const validazioneInfisso = validaProdotto('infisso', infisso, data.configInfissi);
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                    tipo: isScorrevole ? tipoVisualizzato : `Infisso ${tipoVisualizzato}`,  // ✅ v8.467
                    tipoFinstral: tipoFinstral,  // ✅ v8.467: Codice Finstral
                    isScorrevole: isScorrevole,  // ✅ v8.467
                    validazione: validazioneInfisso,  // ✅ v8.468: Stato validazione
                    brmStimato: brmStimato,  // 🆕 v8.470: Flag BRM stimato
                    brmOrigine: brmOrigine,  // 🆕 v8.470: Fonte BRM (LF+100, TMV-40, etc.)
                    azienda: infisso.azienda || data.configInfissi?.azienda || 'Finstral',
                    telaio: telaio,  // ✅ v8.10: Solo codice telaio (es. "961")
                    tipoAnta: tipoAnta,  // ✅ v8.10: Tipo anta separato (es. "Nova-line")
                    vetro: infisso.vetro || '',  // ✅ v8.40: Tipo vetro (triplo, doppio, satinato)
                    larghezza: L_mm,
                    altezza: H_mm,
                    superficie: superficie_mq.toFixed(2),
                    perimetro: perimetro_ml.toFixed(2),
                    prezzoBase: prezzoBase.toFixed(2),
                    supplemento: supplementoTotale.toFixed(2),
                    supplementoTelaio: supplementoTelaio.toFixed(2),
                    supplementoAnta: supplementoProfiloAnta.toFixed(2),  // ✅ v7.73: Rinominato
                    supplementoVetro: supplementoVetro.toFixed(2),
                    supplementoColore: supplementoColore.toFixed(2),  // ✅ v7.73
                    supplementoManiglia: supplementoManiglia.toFixed(2),
                    supplementoMontante: supplementoMontante.toFixed(2),  // ✅ v7.73: NUOVO
                    supplementoSoglia: supplementoSoglia.toFixed(2),  // ✅ v7.74: NUOVO
                    supplementoManigliettaPF: supplementoManigliettaPF.toFixed(2),  // ✅ v8.10: NUOVO
                    supplementoTagli: supplementoTagli.toFixed(2),  // ✅ v7.75: NUOVO
                    tagli: taglioDescrizione || '',  // ✅ v7.75: Codici taglio applicati
                    isPortaFinestra: isPortaFinestra,  // ✅ v7.74: Flag per debug
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: quantita,
                    totale: totaleRiga.toFixed(2)
                });
                
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
                }  // 🆕 v8.472: Fine else calcolo standard (non FIN-Slide)
            } else {
                console.warn(`⚠️ Pos ${index + 1}: Misure BRM non trovate, salto calcolo`);
            }
        }
        
        // ============================================================================
        // TAPPARELLE - PLASTICINO/NEW SOLAR/ESTELLA
        // ============================================================================
        
        // 🔍 DEBUG: Log completo posizione
        console.log(`🔍 DEBUG Pos ${index + 1}:`, {
            ha_tapparella: !!pos.tapparella,
            tapparella_completo: pos.tapparella,
            quantita: pos.tapparella?.quantita,
            azienda: pos.tapparella?.azienda,
            serveTapparella: pos.tapparella?.serveTapparella,
            serveMotore: pos.tapparella?.serveMotore
        });
        
        // 🆕 v7.996: Controlla serveTapparella - se false, salta telo e vai a motore
        const serveTapparella = pos.tapparella?.serveTapparella !== false;
        const serveMotore = pos.tapparella?.serveMotore === true;
        
        // ✅ FIX v7.996: Solo se serveTapparella è true (o undefined per retrocompatibilità)
        if (pos.tapparella && serveTapparella && hasQta(pos.tapparella)) {
            const tapp = pos.tapparella;
            const azienda = (tapp.azienda || '').toLowerCase();
            
            // FIX: Se quantita undefined, usa 1
            const quantita = parseInt(tapp.quantita) || 1;
            
            console.log(`✅ Pos ${index + 1} ha tapparella con quantità ${quantita}, azienda: "${azienda}"`);
            
            // 🔍 v7.50 DEBUG ESTREMO: Vedi TUTTA la struttura pos
            console.log(`🔍 v7.50 DEBUG pos.infisso completo:`, pos.infisso);
            console.log(`🔍 v7.50 pos.infisso.BRM_L = ${pos.infisso?.BRM_L} (type: ${typeof pos.infisso?.BRM_L})`);
            console.log(`🔍 v7.50 pos.infisso.BRM_H = ${pos.infisso?.BRM_H} (type: ${typeof pos.infisso?.BRM_H})`);
            console.log(`🔍 v7.50 pos.infisso.brm = `, pos.infisso?.brm);
            console.log(`🔍 v7.50 tapp.brm = `, tapp.brm);
            console.log(`🔍 v7.50 tapp completo:`, tapp);
            
            // 🔍 DEBUG: Accetta TUTTE le aziende per test
            const usaListinoPlasticino = LISTINO_PLASTICINO.aziende.includes(azienda);
            console.log(`🔍 Azienda "${azienda}" usa listino Plasticino? ${usaListinoPlasticino}`);
            console.log(`🔍 DEBUG: PROCEDO COMUNQUE con il calcolo (versione debug)`);
            
            // if (LISTINO_PLASTICINO.aziende.includes(azienda)) {  // ← RIMOSSO PER DEBUG
            if (true) {  // ← DEBUG: Accetta TUTTE le aziende
                // 🔧 v8.54: BRM centralizzato via getProductBRM (no offset per tapparelle)
                const brmTapp = getProductBRM(tapp, pos);
                let L_mm = brmTapp.L;
                let H_mm = brmTapp.H;
                let usaMisureForo = brmTapp.stimato;
                
                // 🆕 v7.81: MAGGIORAZIONI per misure foro (LF/HF)
                let L_telo_mm = L_mm;
                let H_telo_mm = H_mm;
                if (usaMisureForo) {
                    L_telo_mm = L_mm + 40;
                    H_telo_mm = H_mm + 200;
                }
                
                // ✅ Per calcolo Plasticino serve in CM (usa misure telo maggiorate)
                const L_cm = Math.round(L_telo_mm / 10);
                const H_cm = Math.round(H_telo_mm / 10);
                
                console.log(`✅ v7.81 Tapparella Pos ${index + 1}: Foro=${L_mm}×${H_mm}mm → Telo=${L_telo_mm}×${H_telo_mm}mm (${L_cm}×${H_cm}cm)`);
                
                if (L_cm > 0 && H_cm > 0) {
                    // Determina modello telo da dati tapparella (se presente)
                    const modelloTelo = tapp.modello || null;  // es. 'TA01', 'TA25', 'A01'
                    const coloreTelo = tapp.colore_tipo || null;  // es. 'tinta_unita', 'tinta_legno'
                    
                    // Calcola prezzo usando listino Plasticino COMPLETO (con telo)
                    const calcolo = calcolaPrezzoPLASTICINO(L_cm, H_cm, modelloTelo, coloreTelo);
                    
                    // 🆕 v7.81: Calcola prezzo guida
                    let prezzoGuida = 0;
                    let guidaInfo = { codice: '', descrizione: '', prezzo: 0 };
                    if (tapp.guida && tapp.guida !== '') {
                        guidaInfo = calcolaPrezzoGuida(tapp.guida, tapp.coloreGuida || 'Argento', H_mm);
                        prezzoGuida = guidaInfo.prezzo || 0;
                    }
                    
                    // Totale con guida
                    const totaleConGuida = calcolo.totale + prezzoGuida;
                    const totaleRiga = totaleConGuida * quantita;
                    
                    console.log(`💰 v7.81 Dettaglio tapparella Pos ${index + 1}:`, {
                        telo: `€${calcolo.telo.toFixed(2)} (${calcolo.telo_mq.toFixed(2)} mq × €${calcolo.telo_prezzo_mq}/mq) [${calcolo.telo_modello}]`,
                        rullo: `€${calcolo.rullo.toFixed(2)}`,
                        fissi: `€${calcolo.fissi.toFixed(2)}`,
                        supplemento: `€${calcolo.supplemento_altezza.toFixed(2)}`,
                        guida: `€${prezzoGuida.toFixed(2)} [${guidaInfo.codice || 'N/D'}]`,
                        totale: `€${totaleConGuida.toFixed(2)}`
                    });
                    
                    righe.push({
                        posizione: index + 1,
                        ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                        tipo: 'Tapparella',
                        azienda: tapp.azienda || 'Plasticino',
                        telaio: calcolo.telo_modello || '-',  // Mostra modello telo
                        larghezza: L_mm,  // ✅ v7.57: Mostra in MM (non cm!)
                        altezza: H_mm,    // ✅ v7.57: Mostra in MM (non cm!)
                        superficie: calcolo.telo_mq.toFixed(2),  // Superficie in mq
                        perimetro: '-',
                        // 🆕 v7.81: Mapping con GUIDA inclusa
                        prezzoBase: calcolo.telo.toFixed(2),             // TELO (costo principale)
                        supplementoTelaio: calcolo.rullo.toFixed(2),     // Rullo
                        supplementoAnta: calcolo.fissi.toFixed(2),       // Fissi
                        supplementoVetro: calcolo.supplemento_altezza.toFixed(2), // Supp altezza
                        supplementoManiglia: prezzoGuida.toFixed(2),     // 🆕 GUIDA
                        prezzoUnitario: totaleConGuida.toFixed(2),
                        quantita: quantita,
                        totale: totaleRiga.toFixed(2)
                    });
                    
                    totaleMateriali += totaleRiga;
                    numeroPezzi += quantita;
                    
                    console.log(`✅ Tapparella ${azienda} Pos ${index + 1}: ${L_mm}mm×${H_mm}mm = €${totaleConGuida.toFixed(2)} (Telo: €${calcolo.telo.toFixed(2)} + Rullo: €${calcolo.rullo.toFixed(2)} + Fissi: €${calcolo.fissi.toFixed(2)} + Guida: €${prezzoGuida.toFixed(2)})`);
                } else {
                    console.warn(`⚠️ Pos ${index + 1}: Tapparella ${azienda} senza misure, salto calcolo`);
                }
            } else {
                console.warn(`⚠️ Pos ${index + 1}: Azienda tapparelle "${tapp.azienda}" non ha listino prezzi`);
            }
        }
        
        // ============================================================================
        // 🔌 v7.999: MOTORI - Aggiunge riga SEMPRE quando serveMotore=true
        // (indipendentemente da serveTapparella - possono coesistere)
        // ============================================================================
        if (pos.tapparella && serveMotore) {
            const tapp = pos.tapparella;
            const motori = tapp.motori || [];
            const quantita = parseInt(tapp.qta || tapp.quantita) || 1;
            
            console.log(`🔌 v7.999 Pos ${index + 1}: MOTORE (serveMotore=true)`);
            console.log(`   Motori array:`, motori);
            
            // Se ci sono motori nell'array, creane una riga per ciascuno
            if (motori.length > 0) {
                motori.forEach((motore, motIdx) => {
                    const modelloId = motore.modelloId || tapp.motoreModelloDefault || 'oximo_20';
                    const comandoId = motore.comandoId || tapp.comandoDefault || '';
                    const accessori = motore.accessori || {};
                    const noteMotore = motore.note || '';
                    
                    // 🔌 v7.999: Calcola prezzo con SOMFY_PREZZI
                    const prezzoKit = SOMFY_PREZZI.calcolaPrezzoKit(motore);
                    const prezzoMotore = prezzoKit.totale;
                    
                    // Genera descrizione accessori per la riga
                    let descAccessori = [];
                    const motoreDb = SOMFY_PREZZI.getPrezzoMotore(modelloId);
                    if (motoreDb) descAccessori.push(motoreDb.nome);
                    const comandoDb = SOMFY_PREZZI.getPrezzoComando(comandoId);
                    if (comandoDb) descAccessori.push(comandoDb.nome);
                    if (accessori.supporto) descAccessori.push('Supporto');
                    if (accessori.ruota_60) descAccessori.push('Ruota 60');
                    if (accessori.corona_60) descAccessori.push('Corona');
                    
                    righe.push({
                        posizione: index + 1,
                        ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                        tipo: 'Motore',
                        azienda: tapp.motoreAzienda || 'Somfy',
                        telaio: modelloId.replace(/_/g, ' ').toUpperCase(),
                        larghezza: '-',
                        altezza: '-',
                        superficie: '-',
                        perimetro: '-',
                        prezzoBase: (motoreDb?.prezzo || 0).toFixed(2),
                        supplementoTelaio: (comandoDb?.prezzo || 0).toFixed(2),  // Comando
                        supplementoAnta: (accessori.supporto ? (SOMFY_PREZZI.accessori.supporto?.listino || 7.88) : 0).toFixed(2),  // Supporto da DB
                        supplementoVetro: (accessori.ruota_60 ? (SOMFY_PREZZI.accessori.ruota_60?.listino || 21.00) : 0).toFixed(2),  // Ruota da DB
                        supplementoManiglia: '0.00',
                        prezzoUnitario: prezzoMotore.toFixed(2),
                        quantita: quantita,
                        totale: (prezzoMotore * quantita).toFixed(2),
                        _tipoMotore: true,
                        _accessori: accessori,
                        _comandoId: comandoId,
                        _dettaglioKit: prezzoKit.dettaglio
                    });
                    
                    // ✅ v8.11 FIX CRITICO: Somma motori al totale materiali
                    totaleMateriali += prezzoMotore * quantita;
                    numeroPezzi += quantita;
                    
                    console.log(`✅ Motore Pos ${index + 1}: ${modelloId} = €${prezzoMotore.toFixed(2)} (aggiunto a totale)`);
                    console.log(`   Dettaglio:`, prezzoKit.dettaglio);
                });
            } else {
                // Nessun motore specificato, ma serveMotore=true
                // Usa modelloDefault se presente
                const modelloDefault = tapp.motoreModelloDefault || 'oximo_20';
                const comandoDefault = tapp.comandoDefault || '';
                
                // Calcola prezzo default
                const motoreDb = SOMFY_PREZZI.getPrezzoMotore(modelloDefault);
                const comandoDb = SOMFY_PREZZI.getPrezzoComando(comandoDefault);
                const prezzoMotore = (motoreDb?.prezzo || 0) + (comandoDb?.prezzo || 0);
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                    tipo: 'Motore',
                    azienda: tapp.motoreAzienda || 'Somfy',
                    telaio: modelloDefault.replace(/_/g, ' ').toUpperCase(),
                    larghezza: '-',
                    altezza: '-',
                    superficie: '-',
                    perimetro: '-',
                    prezzoBase: (motoreDb?.prezzo || 0).toFixed(2),
                    supplementoTelaio: (comandoDb?.prezzo || 0).toFixed(2),
                    supplementoAnta: '0.00',
                    supplementoVetro: '0.00',
                    supplementoManiglia: '0.00',
                    prezzoUnitario: prezzoMotore.toFixed(2),
                    quantita: quantita,
                    totale: (prezzoMotore * quantita).toFixed(2),
                    _tipoMotore: true
                });
                
                // ✅ v8.11 FIX CRITICO: Somma motori al totale materiali
                totaleMateriali += prezzoMotore * quantita;
                numeroPezzi += quantita;
                
                console.log(`✅ Motore Pos ${index + 1}: ${modelloDefault} (default) = €${prezzoMotore.toFixed(2)} (aggiunto a totale)`);
            }
        }
        
        // ============================================================================
        // PERSIANE - PUNTO PERSIANE
        // ============================================================================
        if (pos.persiana && hasQta(pos.persiana)) {
            const pers = pos.persiana;
            const quantita = parseInt(pers.quantita) || 1;
            
            // 🔧 v8.54: BRM centralizzato via getProductBRM
            const brmPers = getProductBRM(pers, pos);
            let L_mm = brmPers.L;
            let H_mm = brmPers.H;
            
            if (L_mm > 0 && H_mm > 0) {
                // ✅ v7.52: Implementato calcolo prezzi con listino Punto Persiane
                const azienda = (pers.azienda || '').toLowerCase();
                const usaListinoPuntoPersiane = LISTINO_PUNTO_PERSIANE.aziende.includes(azienda);
                
                console.log(`🔍 Azienda persiane "${azienda}" usa listino Punto Persiane? ${usaListinoPuntoPersiane}`);
                
                let prezzoUnitario = 0;
                let prezzoBase = 0;
                let supplementoColore = 0;
                let supplementoSpagnolette = 0;
                let categoriaColore = 'CAT01';
                let tipologia = 'F1';
                let cardini = 0;
                let imballo = 0;
                let contributoGestione = 0;
                
                if (usaListinoPuntoPersiane) {
                    // ✅ v7.55: Estrai numero ante dal campo tipo (F1, F2, PF2, ecc.)
                    const numAnte = estraiNumeroAnte(pers.tipo);
                    
                    // Determina se Finestra (F) o Porta Finestra (PF) in base altezza
                    const isPortaFinestra = H_mm >= 1800;
                    const prefix = isPortaFinestra ? 'PF' : 'F';
                    
                    // Determina tipologia in base al numero ante
                    tipologia = `${prefix}1`;
                    if (numAnte === 2) tipologia = `${prefix}2`;
                    else if (numAnte === 3) tipologia = 'F3'; // F3 solo finestre
                    else if (numAnte === 4) tipologia = 'F4'; // F4 solo finestre
                    
                    console.log(`📐 Persiana tipo="${pers.tipo}" → ${numAnte} ante, H=${H_mm}mm → ${isPortaFinestra ? 'Porta Finestra' : 'Finestra'} → Tipologia ${tipologia}`);
                    console.log(`📋 Modello persiana: "${pers.modello || 'N/D'}"`);
                    
                    // 🆕 v7.92: Usa calcolo COMPLETO con tutte le voci
                    const calcolo = calcolaPrezzoPersianaCOMPLETO(
                        L_mm, 
                        H_mm, 
                        tipologia, 
                        pers.modello || 'Alto Adige',  // Modello per maggiorazione
                        pers.colorePersiana,            // Colore
                        numAnte                         // Numero ante
                    );
                    
                    prezzoBase = calcolo.prezzo_base_con_modello;
                    supplementoColore = calcolo.supplemento_colore;
                    categoriaColore = calcolo.categoria_colore;
                    supplementoSpagnolette = calcolo.supplemento_spagnolette;
                    cardini = calcolo.cardini;
                    imballo = calcolo.imballo;
                    contributoGestione = calcolo.contributo_gestione;
                    
                    // Prezzo unitario finale CON TUTTE LE VOCI
                    prezzoUnitario = calcolo.totale;
                    
                    console.log(`✅ Persiana Pos ${index + 1}: TOTALE COMPLETO €${prezzoUnitario.toFixed(2)}`);
                } else {
                    console.warn(`⚠️ Pos ${index + 1}: Azienda persiane "${pers.azienda}" non ha listino prezzi`);
                }
                
                const totaleRiga = prezzoUnitario * quantita;
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                    tipo: `Persiana ${pers.tipo || tipologia}`,
                    azienda: pers.azienda || 'P. Persiane',
                    telaio: pers.modello ? `${pers.modello}` : '-',
                    larghezza: L_mm,
                    altezza: H_mm,
                    superficie: '-',
                    perimetro: '-',
                    prezzoBase: prezzoBase.toFixed(2),
                    supplementoTelaio: supplementoColore.toFixed(2),      // Colore
                    supplementoAnta: supplementoSpagnolette.toFixed(2),   // Spagnolette
                    supplementoVetro: cardini.toFixed(2),                 // 🆕 Cardini
                    supplementoManiglia: imballo.toFixed(2),              // 🆕 Imballo
                    supplementoColore: contributoGestione.toFixed(2),     // 🆕 Contributo gestione
                    supplementoMontante: '0.00',
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: quantita,
                    totale: totaleRiga.toFixed(2),
                    // Campi extra per debug
                    _colore: pers.colorePersiana || '-',
                    _categoriaColore: categoriaColore
                });
                
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
            }
        }
        
        // ============================================================================
        // ZANZARIERE - PALAGINA
        // ============================================================================
        if (pos.zanzariera && hasQta(pos.zanzariera)) {
            const zanz = pos.zanzariera;
            const quantita = parseInt(zanz.quantita) || 1;
            
            // 🔧 v8.54: BRM centralizzato via getProductBRM
            const brmZanz = getProductBRM(zanz, pos);
            let L_mm = brmZanz.L;
            let H_mm = brmZanz.H;
            
            if (L_mm > 0 && H_mm > 0) {
                // 🦟 v8.13: Calcolo prezzi con listino PALAGINA
                let prezzoUnitario = 0;
                let noteRiga = '';
                let dettaglioCalcolo = null;
                
                const modello = zanz.modello || 'SINTESI';  // Default SINTESI
                const codColore = zanz.codiceColore || zanz.colore || '';
                const tipoRete = zanz.rete || zanz.tipoRete || 'STD';
                const accessoriIds = zanz.accessori || [];
                
                // Determina fascia colore
                let fascia = zanz.fascia || 'F1';
                if (codColore && PALAGINA_ZANZARIERE_2025.getFasciaByColore) {
                    const fasciaCalc = PALAGINA_ZANZARIERE_2025.getFasciaByColore(codColore);
                    if (fasciaCalc) fascia = fasciaCalc;
                }
                
                // Calcola prezzo con database PALAGINA
                const L_cm = L_mm / 10;  // mm → cm
                const H_cm = H_mm / 10;
                
                if (PALAGINA_ZANZARIERE_2025.modelli[modello]) {
                    dettaglioCalcolo = PALAGINA_ZANZARIERE_2025.calcolaPrezzo(modello, L_cm, H_cm, fascia, tipoRete, accessoriIds);
                    if (dettaglioCalcolo && !dettaglioCalcolo.errore) {
                        prezzoUnitario = dettaglioCalcolo.totale;
                        noteRiga = `${modello} ${fascia} ${dettaglioCalcolo.mqFatturati}mq @${dettaglioCalcolo.prezzoMq}€`;
                        console.log(`🦟 PALAGINA Pos ${index + 1}: ${modello} ${L_cm}×${H_cm}cm ${fascia} = €${prezzoUnitario}`);
                    } else {
                        noteRiga = dettaglioCalcolo?.errore || '⚠️ Errore calcolo';
                        console.warn(`⚠️ PALAGINA Pos ${index + 1}: ${dettaglioCalcolo?.errore}`);
                    }
                } else {
                    noteRiga = `⚠️ Modello ${modello} non in listino`;
                    console.warn(`⚠️ PALAGINA Pos ${index + 1}: Modello ${modello} non trovato`);
                }
                
                const totaleRiga = prezzoUnitario * quantita;
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                    tipo: 'Zanzariera',
                    azienda: zanz.azienda || 'Palagina',
                    telaio: modello || '-',
                    larghezza: L_mm,
                    altezza: H_mm,
                    superficie: dettaglioCalcolo?.mqFatturati || '-',
                    perimetro: fascia || '-',
                    prezzoBase: (dettaglioCalcolo?.prezzoBase || 0).toFixed(2),
                    supplementoTelaio: (dettaglioCalcolo?.suppRete || 0).toFixed(2),
                    supplementoAnta: (dettaglioCalcolo?.totAccessori || 0).toFixed(2),
                    supplementoVetro: '0.00',
                    supplementoManiglia: '0.00',
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: quantita,
                    totale: totaleRiga.toFixed(2),
                    note: noteRiga,
                    _dettaglioPalagina: dettaglioCalcolo  // Per popup dettaglio
                });
                
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
                
                console.log(`✅ Zanzariera Pos ${index + 1}: ${L_mm}×${H_mm} ${modello} ${fascia} = €${totaleRiga.toFixed(2)}`);
            }
        }
        
        // ============================================================================
        // CASSONETTI - FINSTRAL/MAGÒ/ALPAC
        // ============================================================================
        if (pos.cassonetto && hasQta(pos.cassonetto)) {
            const cass = pos.cassonetto;
            const quantita = parseInt(cass.qta) || 1;
            
            // 🔧 v8.54: BRM centralizzato via getProductBRM
            const brmCass = getProductBRM(cass, pos);
            let L_mm = brmCass.L;
            let A_mm = brmCass.H;
            let B_mm = brmCass.B;
            let C_mm = brmCass.C;
            
            // Fallback speciale cassonetto: LS+SRSX+SRDX
            if (!L_mm && cass.LS) {
                L_mm = (parseInt(cass.LS) || 0) + (parseInt(cass.SRSX) || 0) + (parseInt(cass.SRDX) || 0);
            }
            
            const azienda = cass.azienda || 'Finstral';
            const materialeCass = cass.materialeCass || 'PVC';
            const codiceCass = cass.codiceCass || '';
            // ✅ v8.11: Determina gruppo colore dal codice colore effettivo, non da gruppoColoreCass
            const coloreCass = cass.coloreCass || '';
            const gruppoColoreCass = determinaGruppoColoreCassonetto(coloreCass);
            const codiceIsolamento = cass.isolamentoPosaclima ? (cass.codiceIsolamento || '') : '';
            
            if (L_mm > 0 && A_mm > 0 && azienda.toLowerCase() === 'finstral') {
                // 🆕 v7.996: Usa calcolaPrezzoCassonettoFinstral
                const calcolo = calcolaPrezzoCassonettoFinstral({
                    L: L_mm,
                    A: A_mm,
                    B: B_mm,
                    materialeCass: materialeCass,
                    codiceCass: codiceCass,
                    gruppoColoreCass: gruppoColoreCass,
                    codiceIsolamento: codiceIsolamento
                });
                
                if (calcolo.success) {
                    const prezzoUnitario = calcolo.prezzo;
                    const totaleRiga = prezzoUnitario * quantita;
                    
                    righe.push({
                        posizione: index + 1,
                        ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                        tipo: 'Cassonetto',
                        azienda: azienda,
                        telaio: `${materialeCass} ${calcolo.parametri.codiceCass || codiceCass}`,
                        larghezza: L_mm,
                        altezza: A_mm,
                        B: B_mm,
                        superficie: '-',
                        perimetro: '-',
                        prezzoBase: calcolo.dettaglio.prezzoBase.toFixed(2),
                        supplementoTelaio: '0.00',
                        supplementoAnta: '0.00',
                        supplementoVetro: calcolo.dettaglio.supplementoIsolamento.toFixed(2),
                        supplementoManiglia: '0.00',
                        prezzoUnitario: prezzoUnitario.toFixed(2),
                        quantita: quantita,
                        totale: totaleRiga.toFixed(2),
                        materialeCass: materialeCass,
                        codiceCass: calcolo.parametri.codiceCass,
                        gruppoColoreCass: gruppoColoreCass,
                        codiceIsolamento: codiceIsolamento,
                        _tipoCassonetto: true
                    });
                    
                    totaleMateriali += totaleRiga;
                    numeroPezzi += quantita;
                    
                    console.log(`✅ Cassonetto Finstral Pos ${index + 1}: ${L_mm}×${A_mm}mm (B=${B_mm}) = €${prezzoUnitario.toFixed(2)} [${materialeCass} ${calcolo.parametri.codiceCass}]`);
                } else {
                    console.warn(`⚠️ Cassonetto Pos ${index + 1}: Calcolo fallito -`, calcolo.errori);
                    // Riga placeholder senza prezzo
                    righe.push({
                        posizione: index + 1,
                        ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                        tipo: 'Cassonetto',
                        azienda: azienda,
                        telaio: `${materialeCass} ${codiceCass}`,
                        larghezza: L_mm,
                        altezza: A_mm,
                        superficie: '-',
                        perimetro: '-',
                        prezzoBase: '0.00',
                        supplementoTelaio: '0.00',
                        supplementoAnta: '0.00',
                        supplementoVetro: '0.00',
                        supplementoManiglia: '0.00',
                        prezzoUnitario: '0.00',
                        quantita: quantita,
                        totale: '0.00',
                        note: calcolo.errori.join(', '),
                        _tipoCassonetto: true
                    });
                }
            } else if (L_mm > 0 && A_mm > 0) {
                // Altre aziende (no calcolo automatico)
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                    tipo: 'Cassonetto',
                    azienda: azienda,
                    telaio: '-',
                    larghezza: L_mm,
                    altezza: A_mm,
                    superficie: '-',
                    perimetro: '-',
                    prezzoBase: '0.00',
                    supplementoTelaio: '0.00',
                    supplementoAnta: '0.00',
                    supplementoVetro: '0.00',
                    supplementoManiglia: '0.00',
                    prezzoUnitario: '0.00',
                    quantita: quantita,
                    totale: '0.00',
                    note: `${azienda}: prezzo manuale`,
                    _tipoCassonetto: true
                });
                console.log(`📦 Cassonetto ${azienda} Pos ${index + 1}: ${L_mm}×${A_mm}mm - Prezzo manuale`);
            }
        }
        
        // ============================================================================
        // 🔒 v8.52: GRATE SICUREZZA - ERRECI
        // ============================================================================
        if (pos.grata && hasQta(pos.grata)) {
            const grata = pos.grata;
            const quantita = getQta(grata) || 1;
            
            // 🔧 v8.54: BRM centralizzato con fallback LF/HF
            const brmGrata = typeof getProductBRM !== 'undefined' 
                ? getProductBRM(grata, pos) 
                : { L: parseInt(grata.BRM_L) || 0, H: parseInt(grata.BRM_H) || 0 };
            const L_mm = brmGrata.L;
            const H_mm = brmGrata.H;
            if (brmGrata.stimato) console.log(`📐 Grata Pos ${index+1}: BRM stimato da ${brmGrata.origine} → ${L_mm}×${H_mm}`);
            
            let prezzoUnitario = 0;
            let noteRiga = '';
            let tipoDesc = `Grata ${grata.linea || ''} ${grata.tipoApertura || ''}`.trim();
            
            // Calcolo prezzo se GRATE_MODULE è disponibile
            let dettaglioGrata = null;
            if (typeof GRATE_MODULE !== 'undefined' && GRATE_MODULE.calcolaPrezzo) {
                // 🔧 v8.54: Passa BRM calcolato dentro l'oggetto grata per calcolaPrezzo
                const grataConBRM = Object.assign({}, grata, { BRM_L: L_mm, BRM_H: H_mm });
                const risultato = GRATE_MODULE.calcolaPrezzo(grataConBRM, pos);
                if (risultato && !risultato.errore) {
                    prezzoUnitario = risultato.prezzo || 0;
                    noteRiga = risultato.dettaglio || '';
                    dettaglioGrata = risultato;
                } else {
                    noteRiga = risultato?.errore || 'Errore calcolo';
                }
            } else {
                noteRiga = 'Modulo grate non caricato';
            }
            
            const totaleRiga = prezzoUnitario * quantita;
            if (prezzoUnitario > 0) {
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
            }
            
            righe.push({
                posizione: index + 1,
                ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                tipo: tipoDesc,
                azienda: grata.azienda || 'Erreci',
                telaio: grata.modello || '-',
                larghezza: L_mm,
                altezza: H_mm,
                superficie: '-',
                perimetro: '-',
                prezzoBase: prezzoUnitario.toFixed(2),
                supplementoTelaio: '0.00',
                supplementoAnta: '0.00',
                supplementoVetro: '0.00',
                supplementoManiglia: '0.00',
                prezzoUnitario: prezzoUnitario.toFixed(2),
                quantita: quantita,
                totale: totaleRiga.toFixed(2),
                note: noteRiga,
                _tipoGrata: true,
                _dettaglioGrata: dettaglioGrata
            });
            
            console.log(`🔒 Grata Pos ${index + 1}: ${L_mm}×${H_mm}mm = €${prezzoUnitario.toFixed(2)}`);
        }
        
        // ============================================================================
        // PORTE BLINDATE - OIKOS
        // ============================================================================
        // 🔐 v7.98: blindata esiste se ha LNP o versione (LNP può essere stringa)
        const hasBlindataData = pos.blindata && (
            parseInt(pos.blindata.LNP_L) > 0 || 
            parseInt(pos.blindata.LNP_H) > 0 || 
            pos.blindata.versione
        );
        
        if (hasBlindataData) {
            const bld = pos.blindata;
            const quantita = 1; // Porte blindate sempre qta 1
            
            // Leggi misure LNP (Luce Netta Passaggio) - possono essere stringhe
            const L_mm = parseInt(bld.LNP_L) || 0;
            const H_mm = parseInt(bld.LNP_H) || 0;
            
            console.log(`🔐 Blindata Pos ${index + 1}: LNP=${L_mm}×${H_mm}mm, versione=${bld.versione}`);
            
            if (L_mm > 0 && H_mm > 0) {
                // Calcola prezzo con funzione Oikos
                const prezzoCalcolato = calcolaPrezzoBlindataOikos(bld);
                const prezzoUnitario = prezzoCalcolato.totale || 0;
                const totaleRiga = prezzoUnitario * quantita;
                
                // Descrizione configurazione
                const configDesc = [
                    bld.versione || 'E3',
                    bld.tipoAnta === 'doppia' ? '2 Ante' : '1 Anta',
                    bld.sensoApertura || '',
                    bld.controtelaio === 'si' ? 'Con CT' : 'Senza CT'
                ].filter(x => x).join(' | ');
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                    tipo: `🔐 Blindata ${bld.versione || 'E3'}`,
                    azienda: bld.azienda || 'Oikos',
                    telaio: configDesc,
                    larghezza: L_mm,
                    altezza: H_mm,
                    superficie: ((L_mm * H_mm) / 1000000).toFixed(2),
                    perimetro: '-',
                    prezzoBase: (prezzoCalcolato.dettaglio?.prezzoBase || 0).toFixed(2),
                    supplementoTelaio: (prezzoCalcolato.dettaglio?.controtelaio || 0).toFixed(2),
                    supplementoAnta: (prezzoCalcolato.dettaglio?.cilindro || 0).toFixed(2),
                    supplementoVetro: (prezzoCalcolato.dettaglio?.rivestimenti || 0).toFixed(2),
                    supplementoColore: (prezzoCalcolato.dettaglio?.colore || 0).toFixed(2),
                    supplementoManiglia: (prezzoCalcolato.dettaglio?.optional || 0).toFixed(2),
                    supplementoMontante: (prezzoCalcolato.dettaglio?.kitAAV || 0).toFixed(2),
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: quantita,
                    totale: totaleRiga.toFixed(2),
                    _tipoBlindato: true,
                    _luceCalcolata: bld.luceCalcolata || 'luce0'
                });
                
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
                
                console.log(`✅ Blindata Pos ${index + 1}: €${prezzoUnitario.toFixed(2)} (${bld.luceCalcolata})`);
            } else {
                console.warn(`⚠️ Pos ${index + 1}: Misure blindata non trovate`);
            }
        }
        
        // ============================================================================
        // 🚪 PORTONCINI FIN-DOOR FINSTRAL - v8.63
        // ============================================================================
        // v8.63: Fix normalizzazione - pos.portoncino può esistere vuoto (senza BRM)
        // Controlla se pos.portoncino ha dati reali, altrimenti copia da ingresso
        const ptcDirect = pos.portoncino;
        const ptcIngresso = pos.ingresso?.portoncino;
        const hasPtcDirectData = ptcDirect && (parseInt(ptcDirect.BRM_L) > 0 || parseInt(ptcDirect.BRM_H) > 0 || ptcDirect.tipoApertura);
        
        if (ptcIngresso && !hasPtcDirectData) {
            pos.portoncino = ptcIngresso;
            console.log(`   🚪 NORMALIZZATO pos ${index + 1}: ingresso.portoncino → portoncino (BRM=${ptcIngresso.BRM_L}×${ptcIngresso.BRM_H})`);
        }
        
        const hasPortoncinoData = pos.portoncino && (
            parseInt(pos.portoncino.BRM_L) > 0 || 
            parseInt(pos.portoncino.BRM_H) > 0 || 
            pos.portoncino.tipoApertura
        );
        
        if (hasPortoncinoData) {
            const ptc = pos.portoncino;
            const quantita = 1;
            
            const L_mm = parseInt(ptc.BRM_L) || 0;
            const H_mm = parseInt(ptc.BRM_H) || 0;
            
            console.log(`🚪 Portoncino Pos ${index + 1}: BRM=${L_mm}×${H_mm}mm, tipo=${ptc.tipoApertura}`);
            
            if (L_mm > 0 && H_mm > 0) {
                try {
                // v8.63: passa larghezza/altezza per compatibilità con findoor-portoncini.js v2.0.0
                ptc.larghezza = ptc.larghezza || ptc.BRM_L;
                ptc.altezza = ptc.altezza || ptc.BRM_H;
                
                const prezzoCalcolato = (typeof calcolaPrezzoPortoncinoFindoor === 'function') 
                    ? calcolaPrezzoPortoncinoFindoor(ptc) 
                    : _calcolaPortoncinoStub(ptc, L_mm, H_mm);
                const prezzoUnitario = prezzoCalcolato.totale || 0;
                const totaleRiga = prezzoUnitario * quantita;
                
                const configDesc = [
                    `Tipo ${ptc.tipoApertura || '720'}`,
                    ptc.materialeInt && ptc.materialeEst ? `${ptc.materialeInt}-${ptc.materialeEst}` : '',
                    ptc.modelloAnta ? `Mod.${ptc.modelloAnta}` : ''
                ].filter(x => x).join(' | ');
                
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || pos.stanza || `Pos ${index + 1}`,
                    tipo: `🚪 Portoncino ${ptc.tipoApertura || '720'}`,
                    azienda: 'Finstral',
                    telaio: configDesc,
                    larghezza: L_mm,
                    altezza: H_mm,
                    superficie: ((L_mm * H_mm) / 1000000).toFixed(2),
                    perimetro: '-',
                    prezzoBase: (prezzoCalcolato.prezzoBase || 0).toFixed(2),
                    supplementoTelaio: (prezzoCalcolato.supplModello || 0).toFixed(2),
                    supplementoAnta: (prezzoCalcolato.supplSerratura || 0).toFixed(2),
                    supplementoVetro: (prezzoCalcolato.supplCerniere || 0).toFixed(2),
                    supplementoColore: (prezzoCalcolato.supplCilindro || 0).toFixed(2),
                    supplementoManiglia: (prezzoCalcolato.supplManiglia || 0).toFixed(2),
                    supplementoMontante: ((prezzoCalcolato.prezzoLaterali || 0) + (prezzoCalcolato.prezzoSopraluce || 0)).toFixed(2),
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: quantita,
                    totale: totaleRiga.toFixed(2),
                    _tipoPortoncino: true,
                    _prezzoCalcolato: prezzoCalcolato
                });
                
                totaleMateriali += totaleRiga;
                numeroPezzi += quantita;
                
                console.log(`✅ Portoncino Pos ${index + 1}: €${prezzoUnitario.toFixed(2)}${prezzoCalcolato._stub ? ' (STUB)' : ''}`);
                } catch(e) {
                    console.error(`❌ Errore calcolo portoncino Pos ${index + 1}:`, e);
                }
            } else {
                console.warn(`⚠️ Pos ${index + 1}: Misure portoncino non trovate`);
            }
        }
        
        // ============================================================================
        // 🆕 v8.56: CLICK ZIP - GIBUS
        // ============================================================================
        if (pos.clickZip && pos.clickZip.serveClickZip !== false) {
            const cz = pos.clickZip;
            const quantita = parseInt(cz.qta) || 1;
            const prezzoUnitario = parseFloat(cz.prezzoListino) || 0;
            const totaleRiga = prezzoUnitario * quantita;
            if (prezzoUnitario > 0) { totaleMateriali += totaleRiga; numeroPezzi += quantita; }
            righe.push({
                posizione: index + 1,
                ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                tipo: `🌀 Click Zip ${cz.modello || ''}`.trim(),
                azienda: 'Gibus',
                telaio: cz.tessuto || '-',
                larghezza: parseInt(cz.larghezza) || 0,
                altezza: parseInt(cz.altezza) || 0,
                superficie: '-', perimetro: '-',
                prezzoBase: prezzoUnitario.toFixed(2),
                supplementoTelaio: '0.00', supplementoAnta: '0.00', supplementoVetro: '0.00', supplementoManiglia: '0.00',
                prezzoUnitario: prezzoUnitario.toFixed(2),
                quantita: quantita,
                totale: totaleRiga.toFixed(2),
                note: cz.note || ''
            });
        }
        
        // ============================================================================
        // 🆕 v8.56: TENDE A BRACCI - GIBUS
        // ============================================================================
        if (pos.tendaBracci?.tende?.length > 0) {
            pos.tendaBracci.tende.forEach((t, ti) => {
                const prezzoUnitario = parseFloat(t.prezzoListino) || 0;
                if (prezzoUnitario > 0) { totaleMateriali += prezzoUnitario; numeroPezzi += 1; }
                righe.push({
                    posizione: index + 1,
                    ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                    tipo: `🎪 Tenda Bracci ${t.modello || ''}`.trim(),
                    azienda: 'Gibus',
                    telaio: t.tessuto || '-',
                    larghezza: parseInt(t.larghezza) || 0,
                    altezza: parseInt(t.sporgenza) || 0,
                    superficie: '-', perimetro: '-',
                    prezzoBase: prezzoUnitario.toFixed(2),
                    supplementoTelaio: '0.00', supplementoAnta: '0.00', supplementoVetro: '0.00', supplementoManiglia: '0.00',
                    prezzoUnitario: prezzoUnitario.toFixed(2),
                    quantita: 1,
                    totale: prezzoUnitario.toFixed(2),
                    note: ''
                });
            });
        }
        
        // ============================================================================
        // 🆕 v8.56: PORTE INTERNE - FERREROLEGNO/FLESSYA
        // ============================================================================
        if (pos.portaInterna && (getQta(pos.portaInterna) > 0 || pos.portaInterna.modello)) {
            const pi = pos.portaInterna;
            const quantita = getQta(pi) || 1;
            const prezzoUnitario = parseFloat(pi.prezzoListino) || parseFloat(pi.prezzo) || 0;
            const totaleRiga = prezzoUnitario * quantita;
            if (prezzoUnitario > 0) { totaleMateriali += totaleRiga; numeroPezzi += quantita; }
            righe.push({
                posizione: index + 1,
                ambiente: pos.ambiente || pos.nome || `Pos ${index + 1}`,
                tipo: `🚪 Porta Interna ${pi.modello || ''}`.trim(),
                azienda: pi.azienda || 'FerreroLegno',
                telaio: pi.finitura || '-',
                larghezza: parseInt(pi.larghezza) || 0,
                altezza: parseInt(pi.altezza) || 0,
                superficie: '-', perimetro: '-',
                prezzoBase: prezzoUnitario.toFixed(2),
                supplementoTelaio: '0.00', supplementoAnta: '0.00', supplementoVetro: '0.00', supplementoManiglia: '0.00',
                prezzoUnitario: prezzoUnitario.toFixed(2),
                quantita: quantita,
                totale: totaleRiga.toFixed(2),
                note: pi.note || ''
            });
        }
    });
    console.log('🔍 Dettaglio righe create:');
    righe.forEach((r, i) => {
        console.log(`   Riga ${i + 1}: ${r.tipo} - ${r.azienda} - ${r.ambiente} - €${r.totale}`);
    });
    
    // 💰 v8.14: Calcolo sconti fornitori per ogni riga
    const ricaricoPct = parseFloat(document.getElementById('ricaricoPct')?.value || 30);
    let totaleNetto = 0;
    let totaleCliente = 0;
    
    righe.forEach(riga => {
        const totaleListino = parseFloat(riga.totale) || 0;
        const sconto = SCONTI_FORNITORI.getSconto(riga.azienda);
        const netto = totaleListino * (1 - sconto / 100);
        const cliente = netto * (1 + ricaricoPct / 100);
        
        riga._scontoPerc = sconto.toFixed(0);
        riga._totaleNetto = netto.toFixed(2);
        riga._totaleCliente = cliente.toFixed(2);
        
        totaleNetto += netto;
        totaleCliente += cliente;
        
        console.log(`💰 ${riga.azienda}: €${totaleListino} -${sconto}% = €${netto.toFixed(2)} +${ricaricoPct}% = €${cliente.toFixed(2)}`);
    });
    
    // Calcola posa e smontaggio
    const posa = numeroPezzi * COSTI_EXTRA.posa_per_pezzo;
    const smontaggio = numeroPezzi * COSTI_EXTRA.smontaggio_per_pezzo;
    
    // Posa e smontaggio: applica ricarico
    const posaNetto = posa;  // Nessuno sconto sulla posa
    const posaCliente = posa * (1 + ricaricoPct / 100);
    const smontaggioNetto = smontaggio;
    const smontaggioCliente = smontaggio * (1 + ricaricoPct / 100);
    
    const subtotale = totaleMateriali + posa + smontaggio;
    
    // IVA (calcolata dopo in ricalcolaTotaliPreventivo)
    const ivaPercent = 0; // v8.16: IVA gestita separatamente in base a tipo intervento
    const iva = subtotale * (ivaPercent / 100);
    const totale = subtotale + iva;
    
    console.log(`💰 TOTALI: Listino €${totaleMateriali.toFixed(2)} | Netto €${totaleNetto.toFixed(2)} | Cliente €${totaleCliente.toFixed(2)} | Ricarico ${ricaricoPct}%`);
    
    return {
        righe: righe,
        totaleMateriali: totaleMateriali,
        _totaleNetto: totaleNetto,
        _totaleCliente: totaleCliente,
        _ricaricoPct: ricaricoPct,
        posa: posa,
        _posaNetto: posaNetto,
        _posaCliente: posaCliente,
        smontaggio: smontaggio,
        _smontaggioNetto: smontaggioNetto,
        _smontaggioCliente: smontaggioCliente,
        subtotale: subtotale,
        ivaPercent: ivaPercent,
        iva: iva,
        totale: totale
    };
}

// Export globale
window.calcolaPreventivo = calcolaPreventivo;
console.log('✅ preventivo-engine.js v1.0.0 caricato');
