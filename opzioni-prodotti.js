/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OPZIONI PRODOTTI - UNICA FONTE PRODOTTO v3.3.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * shared-database/opzioni-prodotti.js
 * Usato da: App Rilievo + Dashboard + Editor Posizione
 * 
 * REGOLA: Ogni dropdown statico di prodotto usa SOLO queste costanti.
 * Mai array inline nelle app.
 * 
 * v3.3.0 (12/02/2026):
 *   - NUOVO: P.BRM — costanti centralizzate per dropdown BRM
 *   - misureLarghezza/Altezza, PF, Cassonetto, B, C, operazioni
 *   - App rilievo: sostituire array hardcoded con OPZIONI_PRODOTTI.BRM.*
 *
 * v3.2.0 (12/02/2026):
 *   - FIX: Tapparelle cascading azienda→modello→colore→guida
 *   - FIX: getModelliTapparella() non fa più fallback a Plasticino
 *   - FIX: getColoriTapparella() ora accetta codice modello e mappa ai colori corretti
 *   - FIX: getColoriGuide(azienda) filtra per azienda (solo Plasticino ha guide)
 *   - NUOVO: modelloToColori mappa cod modello→categorie colori
 *   - NUOVO: getGuide(azienda), hasDatabaseTapparelle(azienda)
 *
 * v3.0.0 (05/02/2026):
 *   - UNIFICAZIONE: tutti i dati prodotto da opzioni-comuni.js migrati qui
 *   - opzioni-comuni.js ora contiene SOLO Ambienti + Piani
 *   - Aggiunto: colori infissi (PVC/Alu/Legno), tapparelle complete,
 *     motori Somfy, persiane complete, zanzariere Palagina, cassonetti
 *   - Tutte le funzioni helper migrate qui
 *   - Blocco sync retrocompatibilità RIMOSSO in v3.1.0 (non più necessario)
 * 
 * v2.0.0 (05/02/2026): Codici modello, ferramenta, latiDin, esecuzioni
 * v1.0.0 (02/02/2026): Versione iniziale
 * 
 * DIPENDENZE:
 * - Caricare DOPO finstral-opzioni.js (per integrazione vetri)
 * - Caricare DOPO finstral-opzioni.js (per integrazione vetri)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    const P = {

        // ═══════════════════════════════════════════════════════════════════════
        // 🏭 AZIENDE
        // ═══════════════════════════════════════════════════════════════════════
        AZIENDE: {
            infissi: ['Finstral', 'Essepi', 'Schüco', 'Oknoplast', 'Internorm'],
            persiane: ['P. Persiane', 'Pail', 'Gibus', 'Schenker'],
            tapparelle: ['Plasticino', 'New Solar', 'Estella'],
            zanzariere: ['Palagina', 'MV Line', 'Bettio'],
            cassonetti: ['Finstral', 'Alpac', 'Elicent']
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🪟 INFISSI
        // ═══════════════════════════════════════════════════════════════════════
        infissi: {
            aziende: ['Finstral', 'Essepi', 'Schüco', 'Oknoplast', 'Internorm'],

            tipiAnta: [
                'Classic-line', 'Slim-line', 'Slim-line Cristal',
                'Anta Twin',
                'Step-line', 'Step-line Door',
                'Nova-line', 'Nova-line Plus'
            ],

            finiture: ['pvc', 'legno', 'alluminio', 'ceramica'],

            allarme: ['si', 'no'],

            // Popolato da FINSTRAL_OPZIONI.vetri se disponibile (vedi init in fondo)
            vetri: [
                'Doppio Base 28mm',
                'Doppio + Sicurezza P2A',
                'Doppio + Sicurezza P4A',
                'Doppio Sicurezza Maggiorata P2A',
                'Doppio Sicurezza Maggiorata P4A',
                'Doppio Satinato',
                'Doppio Satinato + Sicurezza P2A',
                'Triplo Base 40mm',
                'Triplo Base 46mm (Ug 0.5)',
                'Triplo + Sicurezza P2A 46mm',
                'Triplo + Sicurezza P4A 46mm',
                'Triplo Sicurezza Maggiorata P2A',
                'Triplo Sicurezza Maggiorata P4A',
                'Triplo Satinato Bodysafe',
                'Triplo Satinato Bodysafe 6mm'
            ],

            maniglie: [
                '601 - STANDARD',
                '712 - A PRESSIONE',
                '773 - DOPPIA ANTA/RIBALTA',
                '772 - DOPPIA ANTA'
            ],

            coloriManiglia: [
                '01 - BIANCO', '07 - PERLA', '56 - NEUTRO ANODIZZATO',
                '74 - BRONZO', '40 - OTTONE LUCIDO', '79 - TITANIO',
                'M01 - BIANCO', 'M03 - NERO', 'M07 - BIANCO CREMA'
            ],

            tagliTelaio: [
                'nessuno', 'sopra', 'sotto', 'sopra-sotto',
                'dx', 'sx', 'dx-sx', '4-lati',
                'sopra-laterali', 'sotto-laterali'
            ],

            // ═══════════════════════════════════════════════════════════════
            // COLORI INFISSI FINSTRAL (da ex opzioni-comuni.js)
            // ═══════════════════════════════════════════════════════════════
            coloriPVC: [
                '01 - Bianco',
                '45 - Bianco satinato',
                '27 - Bianco crema satinato',
                '42 - Bianco goffrato',
                '07 - Bianco crema goffrato',
                '36 - Grigio topo',
                '46 - Grigio seta',
                '06 - Grigio (⚠️ scade 32/2026)',
                '13 - Castagno decoro legno',
                '19 - Rovere decoro legno',
                '55 - Noce chiaro decoro legno'
            ],

            coloriAlluminio: [
                'L13 - Castagno verniciato',
                'L14 - Mogano verniciato',
                'L16 - Douglas verniciato',
                'L18 - Noce verniciato',
                'L19 - Rovere verniciato',
                'L55 - Noce chiaro verniciato',
                'LX01 - Rovere naturale',
                'LX02 - Ciliegio scuro',
                'LX03 - Pino verniciato',
                'LX04 - Rovere venato'
            ],

            coloriLegno: [
                'G0 - Rovere naturale',
                'G0 - Faggio naturale',
                'G0 - Acero naturale',
                'G1 - Rovere tinto',
                'G1 - Noce',
                'G1 - Ciliegio',
                'G2 - Wengé',
                'G2 - Mogano',
                'G2 - Teak',
                'G3 - Essenze speciali',
                'G3 - RAL su legno'
            ],

            // ═══════════════════════════════════════════════════════════════
            // CODICI MODELLO FINSTRAL - Lista completa con gruppi
            // Fonte: catalogo Finstral EUR 2025/3
            // ═══════════════════════════════════════════════════════════════
            codiciModello: [
                // 1 Campo
                { gruppo: '📦 1 CAMPO', codice: '101', desc: 'anta' },
                { gruppo: '📦 1 CAMPO', codice: '102', desc: 'fisso' },
                // 2 Campi Orizzontali
                { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '201', desc: '2 ante' },
                { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '202', desc: 'anta+fisso' },
                { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '203', desc: 'fisso+anta' },
                { gruppo: '📦📦 2 CAMPI ORIZZ.', codice: '204', desc: '2 fissi' },
                // 2 Campi Verticali
                { gruppo: '📦📦 2 CAMPI VERT.', codice: '205', desc: '2 ante vert.' },
                { gruppo: '📦📦 2 CAMPI VERT.', codice: '206', desc: 'anta+fisso vert.' },
                { gruppo: '📦📦 2 CAMPI VERT.', codice: '207', desc: 'fisso+anta vert.' },
                { gruppo: '📦📦 2 CAMPI VERT.', codice: '208', desc: '2 fissi vert.' },
                // 3 Campi
                { gruppo: '📦📦📦 3 CAMPI', codice: '301', desc: '3 ante' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '302', desc: 'a+f+a' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '303', desc: 'f+a+f' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '304', desc: '3 fissi' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '305', desc: 'f+a+f vert.' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '306', desc: 'f+a+a vert.' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '307', desc: '3 fissi vert.' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '308', desc: 'f+2a alto' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '309', desc: '2a basso+f' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '310', desc: '2a basso+a' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '321', desc: 'f+a+a' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '322', desc: 'a+a+f' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '324', desc: 'a+f+a' },
                { gruppo: '📦📦📦 3 CAMPI', codice: '340', desc: 'a+2a alto' },
                // 4 Campi
                { gruppo: '📦📦📦📦 4 CAMPI', codice: '311', desc: '2f basso+2a alto' },
                { gruppo: '📦📦📦📦 4 CAMPI', codice: '314', desc: '2a basso+2f alto' },
                { gruppo: '📦📦📦📦 4 CAMPI', codice: '316', desc: '4 ante' },
                { gruppo: '📦📦📦📦 4 CAMPI', codice: '317', desc: '4 fissi' },
                // Montante Mobile
                { gruppo: '🔗 MONTANTE MOBILE', codice: '401', desc: '2 ante montante' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '402', desc: 'f+2a mont. alto' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '403', desc: '2a mont.+f alto' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '404', desc: '2f mont.+a alto' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '405', desc: 'a+2a mont. alto' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '414', desc: 'f+a mont. DX' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '415', desc: 'a mont. SX+f' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '420', desc: 'a+a mont. DX' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '421', desc: 'a mont. SX+a' },
                { gruppo: '🔗 MONTANTE MOBILE', codice: '424', desc: '3 ante mont.' },
                // Bilico
                { gruppo: '↔️ BILICO', codice: '450', desc: 'bilico' },
                { gruppo: '↔️ BILICO', codice: '451', desc: 'bilico+f DX' },
                { gruppo: '↔️ BILICO', codice: '452', desc: 'f SX+bilico' },
                { gruppo: '↔️ BILICO', codice: '453', desc: 'f+bilico+f' },
                { gruppo: '↔️ BILICO', codice: '456', desc: 'bilico+f alto' },
                { gruppo: '↔️ BILICO', codice: '457', desc: 'f basso+bilico' },
                // Scorrevoli
                { gruppo: '🚪 SCORREVOLI', codice: '500', desc: 'scorr. parallela' },
                { gruppo: '🚪 SCORREVOLI', codice: '501', desc: 'scorr. SX' },
                { gruppo: '🚪 SCORREVOLI', codice: '503', desc: 'scorr. SX+a DX' },
                { gruppo: '🚪 SCORREVOLI', codice: '504', desc: 'a SX+scorr. DX' },
                { gruppo: '🚪 SCORREVOLI', codice: '510', desc: '2 scorr.' },
                { gruppo: '🚪 SCORREVOLI', codice: '511', desc: 'scorr. DX' },
                // FIN-Slide HST
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS600', desc: 'solo fisso' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS601', desc: 'anta+fisso' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS602', desc: 'fisso+anta' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS610', desc: 'a+f+a' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS611', desc: 'a+2f+a' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS614', desc: '2a+fisso' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS615', desc: '2a coll.+fisso' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS616', desc: 'fisso+2a' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS617', desc: 'a+f+2a' },
                { gruppo: '🏠 FIN-SLIDE HST', codice: 'FS621', desc: '2 fissi' }
            ],

            // ═══════════════════════════════════════════════════════════════
            // FERRAMENTA FINSTRAL
            // ═══════════════════════════════════════════════════════════════
            ferramenta: [
                { gruppo: 'Anta/Ribalta', codice: '411', desc: 'A/R vista' },
                { gruppo: 'Anta/Ribalta', codice: '211', desc: 'A/R scomp.' },
                { gruppo: 'Solo Anta', codice: '430', desc: 'Anta int.' },
                { gruppo: 'Solo Anta', codice: '230', desc: 'Anta scomp.' },
                { gruppo: 'Con Montante', codice: '425', desc: '+leva vista' },
                { gruppo: 'Con Montante', codice: '225', desc: '+leva scomp.' },
                { gruppo: 'Porta-Finestra', codice: '475', desc: 'A/R+serr.' },
                { gruppo: 'Porta-Finestra', codice: '473', desc: 'Anta+serr.' },
                { gruppo: 'Scorrevoli', codice: '710', desc: 'Scorr. ribalta' },
                { gruppo: 'Scorrevoli', codice: '720', desc: 'Scorr. par.' }
            ],

            // ═══════════════════════════════════════════════════════════════
            // LATO DIN
            // ═══════════════════════════════════════════════════════════════
            latiDin: [
                { codice: '-1', desc: 'SX (-1)' },
                { codice: '-2', desc: 'DX (-2)' }
            ],

            // ═══════════════════════════════════════════════════════════════
            // ESECUZIONE DIN
            // ═══════════════════════════════════════════════════════════════
            esecuzioni: [
                { codice: '0', desc: '0 - Std', soloPVC: true },
                { codice: '3', desc: '3 - Perim+ang', soloPVC: false },
                { codice: '4', desc: '4 - Perim', soloPVC: false }
            ],

            // ═══════════════════════════════════════════════════════════════
            // MANIGLIE FINSTRAL (dettagliate con prezzi)
            // ═══════════════════════════════════════════════════════════════
            maniglieFinstral: [
                { codice: '7120', desc: 'Maniglia standard', prezzo: 0 },
                { codice: '7121', desc: 'Maniglia con chiave', prezzo: 30 },
                { codice: '7130', desc: 'Maniglia a bottone', prezzo: 15 },
                { codice: '7140', desc: 'Maniglia design', prezzo: 45 }
            ]
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🏠 PERSIANE
        // ═══════════════════════════════════════════════════════════════════════
        persiane: {
            aziende: ['P. Persiane', 'Pail', 'Gibus', 'Schenker'],

            modelli: [
                'Angela', 'Giulia', 'Luna', 'Aurora',
                'Alto Adige', 'Alto Adige (R)',
                'Cortina', 'Cortina (R)',
                'Oscura', 'Oscura (R)',
                'Nerina', 'Nerina (R)',
                'Scandola', 'Scandola (TT)',
                'Scandola Duo', 'Scandola Duo (TT)',
                'Oscura Duo', 'Oscura Duo (TT)'
            ],

            fissaggi: ['muro', 'telaio'],

            tipiTelaio: ['TH10', 'TH40', 'TH41', 'TH45', 'TH46R', 'TH62', 'TH80', 'TH53'],

            battute: ['3 LATI', '4 LATI', '2 LATI LATERALI'],

            tipi: ['F1', 'PF1', 'F2', 'PF2', 'F3', 'PF3', 'SCORREVOLE'],

            aperture: ['SP SX', 'SP DX', 'LIB SX', 'LIB DX', 'SCORR SX', 'SCORR DX'],

            // Tipi con descrizione (per dropdown dashboard/comuni)
            tipiDescrittivi: [
                'F2 - 2 Ante',
                'F3 - 3 Ante',
                'F4 - 4 Ante',
                'PF2 - Portafinestra 2 Ante',
                'PF3 - Portafinestra 3 Ante',
                'PF4 - Portafinestra 4 Ante'
            ],

            // Aperture con descrizione (per dropdown dashboard/comuni)
            apertureDescrittive: [
                'DX - Destra',
                'SX - Sinistra',
                'DX+SX - Centrale',
                'LIB/A - Libro Ante',
                'SCO - Scorrevole'
            ],

            // Cardini Punto Persiane
            cardini: [
                { codice: 'C.SAF90', nome: 'Cardine SAF a Muro 90°', prezzo: 8.50 },
                { codice: 'C.SAF135', nome: 'Cardine SAF a Muro 135°', prezzo: 9.20 },
                { codice: 'C.SAF180', nome: 'Cardine SAF a Muro 180°', prezzo: 10.00 },
                { codice: 'C.AVVIT', nome: 'Cardine Avvitabile Standard', prezzo: 6.80 },
                { codice: 'C.FISSO', nome: 'Cardine Fisso Tradizionale', prezzo: 5.50 },
                { codice: 'C.REG', nome: 'Cardine Regolabile', prezzo: 12.00 }
            ],

            // Fermapersiane Punto Persiane
            fermapersiane: [
                { codice: 'K.EASY', nome: 'Fermapersiana Easy Magnetico', prezzo: 15.00 },
                { codice: 'K.CLICK', nome: 'Fermapersiana Click a Scatto', prezzo: 12.50 },
                { codice: 'K.STOP', nome: 'Fermapersiana Stop Tradizionale', prezzo: 8.00 },
                { codice: 'K.GANCIO', nome: 'Gancio Ferma Anta', prezzo: 4.50 },
                { codice: 'K.ASTA', nome: 'Asta Ferma Persiana', prezzo: 6.00 }
            ]
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🔽 TAPPARELLE
        // ═══════════════════════════════════════════════════════════════════════
        tapparelle: {
            aziende: ['Plasticino', 'New Solar', 'Estella'],

            // Modelli per azienda
            modelli: {
                'Plasticino': [
                    // Alluminio Coibentato Media/Alta Densità
                    { cod: 'TA01', nome: 'Tipo ALUPROFIL MD 13x55', dim: '13x55', tipo: 'Alluminio Coibentato' },
                    { cod: 'TA25', nome: 'Tipo ALUPROFIL AD 13x55', dim: '13x55', tipo: 'Alluminio Coibentato' },
                    { cod: 'TA05', nome: 'Tipo ALUPROFIL MD 9x41', dim: '9x41', tipo: 'Alluminio Coibentato' },
                    { cod: 'TA30', nome: 'Tipo ALUPROFIL AD 9x41', dim: '9x41', tipo: 'Alluminio Coibentato' },
                    { cod: 'TA42', nome: 'Tipo ALUPROFIL MD 8,5x32', dim: '8.5x32', tipo: 'Alluminio Coibentato' },
                    { cod: 'TA07', nome: 'Tipo ALUPROFIL MD 8x37', dim: '8x37', tipo: 'Alluminio Coibentato' },
                    // Acciaio Coibentato
                    { cod: 'TA15', nome: 'Tipo STEELPROFIL 13x55', dim: '13x55', tipo: 'Acciaio Coibentato' },
                    { cod: 'TA20', nome: 'Tipo STEELPROFIL 9x40', dim: '9x40', tipo: 'Acciaio Coibentato' },
                    // PVC
                    { cod: 'A01', nome: 'Tipo ANTIGRANDINE 14x50', dim: '14x50', tipo: 'PVC' },
                    { cod: 'A10', nome: 'Tipo PESANTE 14x50', dim: '14x50', tipo: 'PVC' },
                    { cod: 'A16', nome: 'Tipo MINI 10 11x32', dim: '11x32', tipo: 'PVC' },
                    { cod: 'A15', nome: 'Tipo MINI 8 8x33', dim: '8x33', tipo: 'PVC' },
                    // Alluminio Estruso Sicurezza
                    { cod: 'TA10', nome: 'Tipo ALUBLIND 13x45', dim: '13x45', tipo: 'Alluminio Sicurezza' },
                    { cod: 'TA13', nome: 'Tipo ALUBLIND 9x27', dim: '9x27', tipo: 'Alluminio Sicurezza' },
                    // Termoisolante
                    { cod: 'A18', nome: 'Tipo COMBI 13x53', dim: '13x53', tipo: 'Termoisolante' },
                    { cod: 'A20', nome: 'Tipo COMBI 10x39', dim: '10x39', tipo: 'Termoisolante' },
                    // Orientabili
                    { cod: 'A40', nome: 'Tipo ORIENTA', dim: '', tipo: 'Orientabile' },
                    // Areazione
                    { cod: 'A50', nome: 'Tipo ESTELLA CLASSIC', dim: '', tipo: 'Areazione' }
                ],
                'New Solar': [],
                'Estella': []
            },

            // Colori tapparelle Plasticino
            colori: {
                'ALLUMINIO_UNITA': [
                    'Bianco 01', 'Bianco 9010', 'Avorio 34', 'Crema 39',
                    'Grigio 07', 'Argento 05', 'Grigio 10', 'Grigio 23',
                    'Salmone 06', 'Ocra 03', 'Marrone 08', 'Marrone 04',
                    'Marrone 48', 'Marrone 79', 'Verde 43', 'Verde 09',
                    'Verde 83', 'Verde 29', 'Rosso 02', 'Blu 35', 'Noce 61'
                ],
                'ALLUMINIO_LEGNO': [
                    'Pino 52', 'Rovere 56', 'Teak 44', 'Ciliegio 33',
                    'Ciliegio 60', 'Noce 47'
                ],
                'ALLUMINIO_RAFFAELLO': [
                    'Grigio Raffaello R94', 'Verde Raffaello R99',
                    'Marrone Raffaello R91', 'Rosso Raffaello R66'
                ],
                'PVC': [
                    'Bianco 01', 'Avorio 34', 'Beige 17', 'Beige 502',
                    'Grigio 07', 'Grigio 10', 'Marrone 81*', 'Marrone 0197*',
                    'Verde 06', 'Noce 37*', 'Nero 88*', 'Blu 15*', 'Blu 95*',
                    'Bruno 68', 'Bronzo', 'Ocra 84'
                ]
            },

            // Mappa codice modello → categorie colori disponibili
            modelloToColori: {
                // Alluminio Coibentato MD (hanno unita + legno + raffaello)
                'TA01': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                'TA05': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                'TA42': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                'TA07': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO'],  // no raffaello
                // Alluminio Coibentato AD
                'TA25': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                'TA30': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                // Acciaio Coibentato
                'TA15': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                'TA20': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
                // PVC
                'A01': ['PVC'], 'A10': ['PVC'], 'A16': ['PVC'], 'A15': ['PVC'],
                // Alluminio Sicurezza (solo RAL = unità)
                'TA10': ['ALLUMINIO_UNITA'], 'TA13': ['ALLUMINIO_UNITA'],
                // Termoisolante COMBI
                'A18': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO'],
                'A20': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO'],
                // Orientabili / Areazione
                'A40': ['ALLUMINIO_UNITA'], 'A50': ['ALLUMINIO_UNITA']
            },

            // Guide Plasticino
            guide: [
                'TG15 - Guide 30x25x30 Finestra',
                'TG10 - Guide 30x25x30 Portafinestra',
                'TG30 - Guide 30x25x30 Barra 6800mm',
                'TG25RIB - Guide 28x17x28 Ribassato Finestra',
                'TG20RIB - Guide 28x17x28 Ribassato Portafinestra',
                'TG35RIB - Guide 28x17x28 Ribassato Barra',
                'TG25 - Guide 28x17x28 Finestra',
                'TG20 - Guide 28x17x28 Portafinestra',
                'TG35 - Guide 28x17x28 Barra',
                'PF2 - Guide 21x20x21 Ferro Zn Finestra',
                'PF4 - Guide 21x20x21 Ferro Zn Portafinestra',
                'PF1 - Guide 21x20x21 Ferro Zn Barra'
            ],

            // Colori guide
            coloriGuide: {
                'ANODIZZATO': ['Argento', 'Bronzo', 'Elox', 'Bianco'],
                'VERNICIATO': [
                    'Avorio RAL 1013', 'Verde RAL 6005',
                    'Marrone RAL 8014', 'Marrone RAL 8017', 'Marrone RAL 8019'
                ]
            },

            // Accessori tapparella manuale
            accessoriManuali: [
                { id: 'rullo', label: 'Rullo ottagonale', icon: '🔄' },
                { id: 'supporti', label: 'Supporti + Cuscinetti', icon: '🔩' },
                { id: 'calotta', label: 'Calotta regolabile', icon: '🎩' },
                { id: 'puleggia', label: 'Puleggia', icon: '⚙️' },
                { id: 'avvolgitore', label: 'Avvolgitore + Cassetta', icon: '📦' },
                { id: 'cintino', label: 'Cintino', icon: '🎗️' },
                { id: 'passacinghia', label: 'Passacinghia', icon: '🔗' },
                { id: 'ganci', label: 'Ganci a molla', icon: '🪝' },
                { id: 'guide', label: 'Guide', icon: '🛤️' }
            ]
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🔌 MOTORI SOMFY
        // ═══════════════════════════════════════════════════════════════════════
        motori: {
            modelli: [
                { id: 'oximo_20', modello: 'Oximo 50 io 20/17', coppia: 20, prezzo: 137.66 },
                { id: 'oximo_30', modello: 'Oximo 50 io 30/17', coppia: 30, prezzo: 145.83 },
                { id: 'rs100_hybrid', modello: 'RS100 io hybrid 20/17', coppia: 20, prezzo: 836.95 },
                { id: 'lt50_helios', modello: 'LT 50 Helios WT 30/17', coppia: 30, prezzo: 119.88 },
                { id: 'lt60_orion', modello: 'LT60 Orion S 55/17', coppia: 55, prezzo: 174.00 }
            ],

            accessori: [
                { id: 'supporto', nome: 'Supporto operatore da avvitare', prezzo: 94.60 },
                { id: 'corona_60', nome: 'Corona OTT.60 I', prezzo: 17.67 },
                { id: 'ruota_60', nome: 'Ruota per rullo ottagonale Ø60mm', prezzo: 21.00 },
                { id: 'izymo', nome: 'IZYMO Shutter Receiver io', prezzo: 66.59 }
            ],

            comandi: [
                { id: 'amy1', nome: 'Amy 1 io + cornice quadrata', prezzo: 23.46 },
                { id: 'situo1', nome: 'Situo 1 IO Pure', prezzo: 84.20 },
                { id: 'situo5', nome: 'Situo 5 IO Pure', prezzo: 111.10 },
                { id: 'smoove', nome: 'Smoove Origin IO', prezzo: 77.60 }
            ]
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🦟 ZANZARIERE PALAGINA
        // ═══════════════════════════════════════════════════════════════════════
        zanzariere: {
            aziende: ['Palagina', 'MV Line', 'Bettio'],

            linee: [
                'SLIM 45',
                'SLIM 50',
                'CLASSIC',
                'PLISSE',
                'SCORREVOLE'
            ],

            modelli: {
                'SLIM 45': ['Verticale', 'Laterale', 'Anta Battente'],
                'SLIM 50': ['Verticale', 'Laterale', 'Anta Battente'],
                'CLASSIC': ['Verticale', 'Laterale'],
                'PLISSE': ['Verticale', 'Laterale 1 Anta', 'Laterale 2 Ante'],
                'SCORREVOLE': ['1 Anta', '2 Ante', '3 Ante']
            },

            fasceColore: [
                'Fascia A - Standard',
                'Fascia B - Intermedia',
                'Fascia C - Premium',
                'Fascia D - RAL'
            ],

            coloriTelaio: {
                'A': ['Bianco RAL 9016', 'Avorio RAL 1013', 'Marrone RAL 8017'],
                'B': ['Grigio RAL 7035', 'Grigio RAL 7016', 'Nero RAL 9005'],
                'C': ['Verde RAL 6005', 'Rosso RAL 3000', 'Blu RAL 5010'],
                'D': ['RAL a richiesta']
            },

            tipiRete: [
                'Rete Standard Grigio',
                'Rete Standard Nero',
                'Rete Trasparente',
                'Rete Pollentec',
                'Rete Pet Screen'
            ]
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📦 CASSONETTI
        // ═══════════════════════════════════════════════════════════════════════
        cassonetti: {
            aziende: ['Finstral', 'Alpac', 'Elicent'],

            tipi: ['Esterno', 'Interno', 'Posaclima'],

            materiali: ['PVC', 'Legno'],

            codiciPVC: [
                { codice: '148', desc: '148 - B≤148mm (standard)' },
                { codice: '148B', desc: '148B - B 335-600mm' },
                { codice: '300', desc: '300 - B≤300mm' },
                { codice: '300B', desc: '300B - B 335-600mm' }
            ],

            codiciLegno: [
                { codice: '9-48', desc: '9-48 - B≤150mm (L max 2240)' },
                { codice: '9-48B', desc: '9-48B - B≤600mm (L max 2240)' }
            ],

            gruppiColore: {
                'PVC': ['bianco', 'scuri'],
                'Legno': ['legno1', 'legno2+3']
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📐 MISURE BRM - Opzioni dropdown per configurazione BRM
    // ═══════════════════════════════════════════════════════════════════════════
    // Usato da: App Rilievo (renderBRMConfig, brmPersonalizzato posizione)
    // Centralizzato per evitare liste hardcoded in app.js
    // ═══════════════════════════════════════════════════════════════════════════

    P.BRM = {
        // Misure base per Larghezza (Finestra: F1, F2, F3, Fisso)
        misureLarghezza: ['LF', 'LVT', 'LVAR', 'TMV', 'LS'],
        // Misure base per Altezza
        misureAltezza: ['HF', 'HVT', 'HVAR', 'HMT', 'HSoffitto', 'HParapettoSoffitto', 'HPavimentoParapetto'],
        // Misure base per Larghezza Portafinestra (PF1, PF2, PF3)
        misureLarghezzaPF: ['LPF', 'LVT', 'LVAR', 'TMV', 'LS'],
        // Misure base per Altezza Portafinestra
        misureAltezzaPF: ['HPF', 'HVT', 'HVAR', 'HMT', 'HSoffitto', 'HParapettoSoffitto', 'HPavimentoParapetto'],

        // Cassonetti - misure specifiche
        misureLarghezzaCassonetto: ['(LS+SRSX+SRDX)', 'LVT', 'LF', 'TMV', 'BRM_L_INFISSO'],
        misureAltezzaCassonetto: ['HCASS', 'H Soffitto', 'H Parapetto/Soffitto', 'BRM_H_INFISSO'],
        misureB: ['Prof. Muro Int → MI', 'B'],
        misureC: ['Prof. Muro Int → MI', 'C'],

        // Operazioni disponibili
        operazioni: ['+', '-']
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 FUNZIONI HELPER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene i colori infissi in base alla finitura
     */
    P.getColoriPerFinitura = function(finitura) {
        const fin = (finitura || '').toLowerCase();
        if (fin.includes('legno') || fin === 'legno') return P.infissi.coloriLegno;
        if (fin.includes('alluminio') || fin.includes('aluminio') || fin === 'alu') return P.infissi.coloriAlluminio;
        return P.infissi.coloriPVC;
    };

    /**
     * Ottiene i modelli tapparella per azienda
     */
    P.getModelliTapparella = function(azienda) {
        if (!azienda) return [];
        return P.tapparelle.modelli[azienda] || [];
    };

    /**
     * Ottiene i colori tapparella per codice modello (cascading da modello)
     * @param {string} modelloCompleto - es. "TA01 - Tipo ALUPROFIL MD 13x55" o "TA01" o tipo colore "ALLUMINIO_UNITA"
     * @returns {string[]} lista colori disponibili
     */
    P.getColoriTapparella = function(modelloCompleto) {
        if (!modelloCompleto) return [];
        
        // Estrai codice modello (es. "TA01" da "TA01 - Tipo ALUPROFIL MD 13x55")
        const codice = modelloCompleto.split(' - ')[0].trim().toUpperCase();
        
        // Cerca nella mappa modello → colori
        const categorie = P.tapparelle.modelloToColori[codice];
        if (categorie) {
            let colori = [];
            for (const cat of categorie) {
                if (P.tapparelle.colori[cat]) {
                    colori = colori.concat(P.tapparelle.colori[cat]);
                }
            }
            return colori;
        }
        
        // Fallback: se il parametro è direttamente un tipo colore (retrocompatibilità)
        if (P.tapparelle.colori[modelloCompleto]) {
            return P.tapparelle.colori[modelloCompleto];
        }
        
        return [];
    };

    /**
     * Ottiene i colori per le guide (lista piatta) - solo Plasticino
     * @param {string} azienda - se non Plasticino ritorna []
     */
    P.getColoriGuide = function(azienda) {
        if (azienda && azienda !== 'Plasticino') return [];
        return [
            ...P.tapparelle.coloriGuide['ANODIZZATO'],
            ...P.tapparelle.coloriGuide['VERNICIATO'],
            'RAL a richiesta'
        ];
    };

    /**
     * Ottiene le guide disponibili per azienda
     * @param {string} azienda - se non Plasticino ritorna []
     */
    P.getGuide = function(azienda) {
        if (azienda && azienda !== 'Plasticino') return [];
        return P.tapparelle.guide;
    };

    /**
     * Verifica se un'azienda tapparelle ha database integrato
     */
    P.hasDatabaseTapparelle = function(azienda) {
        return azienda === 'Plasticino';
    };

    /**
     * Calcola numero cardini consigliati per tipo persiana
     */
    P.calcolaCardiniPersiana = function(tipo, aperturaLibro) {
        const match = (tipo || '').match(/(\d+)/);
        const numAnte = match ? parseInt(match[1]) : 2;
        let cardini = numAnte * 3;
        if (aperturaLibro) cardini += numAnte;
        return cardini;
    };

    /**
     * Calcola numero fermapersiane consigliati
     */
    P.calcolaFermapersiane = function(tipo) {
        const match = (tipo || '').match(/(\d+)/);
        return match ? parseInt(match[1]) : 2;
    };

    /**
     * Genera opzioni HTML per select modelli tapparella
     */
    P.getModelliTapparellaOptions = function(azienda, currentValue) {
        const modelli = P.getModelliTapparella(azienda);
        if (modelli.length === 0) return '<option value="">Nessun modello disponibile</option>';
        return modelli.map(m => {
            const value = `${m.cod} - ${m.nome}`;
            const selected = currentValue === value ? 'selected' : '';
            return `<option value="${value}" ${selected}>${m.cod} - ${m.nome}</option>`;
        }).join('');
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 HELPER HTML PER SELECT CON OPTGROUP
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera opzioni HTML per select codiceModello CON optgroup
     */
    P.getCodiciModelloHTML = function(currentValue) {
        const codici = P.infissi.codiciModello;
        let html = '<option value="">--</option>';
        let currentGruppo = '';
        for (const item of codici) {
            if (item.gruppo !== currentGruppo) {
                if (currentGruppo) html += '</optgroup>';
                html += `<optgroup label="${item.gruppo}">`;
                currentGruppo = item.gruppo;
            }
            const sel = currentValue === item.codice ? 'selected' : '';
            html += `<option value="${item.codice}" ${sel}>${item.codice} - ${item.desc}</option>`;
        }
        if (currentGruppo) html += '</optgroup>';
        return html;
    };

    /**
     * Genera opzioni HTML per select ferramenta CON optgroup
     */
    P.getFerramentaHTML = function(currentValue) {
        const ferr = P.infissi.ferramenta;
        let html = '<option value="">--</option>';
        let currentGruppo = '';
        for (const item of ferr) {
            if (item.gruppo !== currentGruppo) {
                if (currentGruppo) html += '</optgroup>';
                html += `<optgroup label="${item.gruppo}">`;
                currentGruppo = item.gruppo;
            }
            const sel = currentValue === item.codice ? 'selected' : '';
            html += `<option value="${item.codice}" ${sel}>${item.codice} - ${item.desc}</option>`;
        }
        if (currentGruppo) html += '</optgroup>';
        return html;
    };

    /**
     * Genera opzioni HTML per select lato DIN
     */
    P.getLatiDinHTML = function(currentValue) {
        let html = '<option value="">--</option>';
        for (const item of P.infissi.latiDin) {
            const sel = currentValue === item.codice ? 'selected' : '';
            html += `<option value="${item.codice}" ${sel}>${item.desc}</option>`;
        }
        return html;
    };

    /**
     * Genera opzioni HTML per select esecuzione DIN (filtra .0 per non-PVC)
     */
    P.getEsecuzioniHTML = function(currentValue, isPVC) {
        let html = '';
        for (const item of P.infissi.esecuzioni) {
            if (item.soloPVC && !isPVC) continue;
            const sel = currentValue === item.codice ? 'selected' : '';
            html += `<option value="${item.codice}" ${sel}>${item.desc}</option>`;
        }
        return html;
    };

    /**
     * Lista piatta codici modello per select semplici (editor)
     */
    P.getCodiciModelloFlat = function() {
        const result = [''];
        let currentGruppo = '';
        for (const item of P.infissi.codiciModello) {
            if (item.gruppo !== currentGruppo) {
                result.push(`— ${item.gruppo} —`);
                currentGruppo = item.gruppo;
            }
            result.push(`${item.codice} - ${item.desc}`);
        }
        return result;
    };

    /**
     * Lista piatta ferramenta per select semplici (editor)
     */
    P.getFerramentaFlat = function() {
        const result = [''];
        let currentGruppo = '';
        for (const item of P.infissi.ferramenta) {
            if (item.gruppo !== currentGruppo) {
                result.push(`— ${item.gruppo} —`);
                currentGruppo = item.gruppo;
            }
            result.push(`${item.codice} - ${item.desc}`);
        }
        return result;
    };

    P.getLatiDinFlat = function() {
        return ['', ...P.infissi.latiDin.map(l => `${l.codice} - ${l.desc}`)];
    };

    P.getEsecuzioniFlat = function() {
        return ['', ...P.infissi.esecuzioni.map(e => e.desc)];
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════════════════
    window.OPZIONI_PRODOTTI = P;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔗 INTEGRAZIONE FINSTRAL_OPZIONI (vetri dettagliati)
    // ═══════════════════════════════════════════════════════════════════════════
    if (typeof FINSTRAL_OPZIONI !== 'undefined' && FINSTRAL_OPZIONI.vetri && FINSTRAL_OPZIONI.vetri.length > 0) {
        P.infissi.vetri = FINSTRAL_OPZIONI.vetri.map(v => v.nome);
        console.log('✅ OPZIONI_PRODOTTI: vetri da FINSTRAL_OPZIONI (' + P.infissi.vetri.length + ')');
    } else {
        console.log('⚠️ OPZIONI_PRODOTTI: vetri fallback (' + P.infissi.vetri.length + ')');
    }

    console.log('✅ opzioni-prodotti.js v3.3.0 caricato - OPZIONI_PRODOTTI unica fonte + BRM costanti');

})();
