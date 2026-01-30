// ═══════════════════════════════════════════════════════════════════════════
// 🦟 DATABASE PALAGINA ZANZARIERE 2025
// Fonte: Catalogo Zanzariere_2025_IT_128_Web-cm.pdf
// ═══════════════════════════════════════════════════════════════════════════
const PALAGINA_ZANZARIERE_2025 = {
    metadata: {
        fornitore: 'Palagina',
        listino: 'Zanzariere 2025',
        dataListino: '2025-01-01',
        dataEstrazione: '2025-12-05',
        valuta: 'EUR',
        consegnaSettimane: 4,
        note: 'Prezzi netti installatore'
    },

    // MODELLI CON PREZZI €/mq per fascia
    modelli: {
        // ----- LINEA SINTESI -----
        'EXTREMA': { linea: 'SINTESI', maxH: 230, prezzi: { F1: 164.00, F2: 172.20, F3: 196.80 }, minMq: 2.00 },
        'EXTREMA_CENTRALE': { linea: 'SINTESI', maxH: 230, prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 }, minMq: 2.00 },
        'EXTREMA_SR': { linea: 'SINTESI', maxH: 460, prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 }, minMq: 4.00 },
        'EXTREMA_INCASSO': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 230, prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 }, minMq: 2.00 },
        'EXTREMA_INCASSO_CENTRALE': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 460, prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 }, minMq: 4.00 },
        'EXTREMA_INCASSO_SR': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 460, prezzi: { F1: 173.50, F2: 182.18, F3: 208.20 }, minMq: 4.00 },
        'NANO_SINTESI': { linea: 'SINTESI', cassonetti: [22], maxH: 180, prezzi: { F1: 148.00, F2: 155.40, F3: 177.60 }, minMq: 2.00 },
        'MICRO_SINTESI': { linea: 'SINTESI', cassonetti: [36], maxH: 200, prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 }, minMq: 4.00 },
        'MICRO_SINTESI_CENTRALE': { linea: 'SINTESI', cassonetti: [36], maxH: 200, prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 }, minMq: 4.00 },
        'SINTESI': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 157.00, F2: 164.85, F3: 188.40 }, minMq: 2.00 },
        'SINTESI_CENTRALE': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 }, minMq: 2.00 },
        'SINTESI_INCASSO': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 210, prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 }, minMq: 2.00 },
        'SINTESI_INCASSO_CENTRALE': { linea: 'SINTESI', cassonetti: [46, 50], maxH: 420, prezzi: { F1: 166.00, F2: 174.30, F3: 199.20 }, minMq: 4.00 },

        // ----- LINEA SV (NEW 2025) -----
        'SV_700': { linea: 'SV', cassonetti: [45, 50], maxH: 250, prezzi: { F1: 84.00, F2: 92.40, F3: 109.20 }, minMq: 1.50, reteDiSerie: 'HC' },

        // ----- LINEA EVO (NEW 2025) -----
        'EVO_ROOF': { linea: 'EVO', cassonetti: [40], maxH: 150, prezzi: { F1: 126.00, F2: null, F3: 176.40 }, minMq: 1.50, tipo: 'Lucernario' },

        // ----- SERIE X - COMPATTO -----
        'X1_INCASSO': { linea: 'COMPATTO', cassonetti: [50], maxH: 200, prezzi: { F1: 113.50, F2: 124.85, F3: 141.88 }, minMq: 1.50 },
        'X3_LUCE': { linea: 'COMPATTO', cassonetti: [53], maxH: 200, prezzi: { F1: 144.50, F2: 158.95, F3: 180.63 }, minMq: 1.50 }
    },

    // COLORI PER FASCIA
    colori: {
        F1: [
            { cod: '1', nome: 'Argento OX' }, { cod: '5', nome: 'Bianco', ral: '9010' },
            { cod: '6', nome: 'Avorio', ral: '1013' }, { cod: '10', nome: 'Grigio polvere', ral: '7037' },
            { cod: '27', nome: 'Testa di moro' }, { cod: '28', nome: 'Nero', ral: '9011 OP' },
            { cod: '30', nome: 'Bianco crema', ral: '9001' }, { cod: '35', nome: 'Bronzo Verniciato' },
            { cod: '41', nome: 'Bianco', ral: '9010 OP' }, { cod: '46', nome: 'Grigio chiaro', ral: '7035' },
            { cod: '49', nome: 'Verde', ral: '6005 OP' }, { cod: '85', nome: 'Bianco traffico', ral: '9016 OP' },
            { cod: '90', nome: 'Marrone', ral: '8017 OP' }, { cod: '91', nome: 'Grigio silver', ral: '9006' },
            { cod: '94', nome: 'Avorio', ral: '1013 OP' }
        ],
        F2: [
            { cod: '13', nome: 'Grigio Michelangelo' }, { cod: '29', nome: 'Ferro micaceo' },
            { cod: '78', nome: 'Grigio antracite', ral: '7016 Sablé' }
        ],
        F3: [
            { cod: '17', nome: 'Rovere P9' }, { cod: '26', nome: 'Renolit chiaro', codice: '386-73/R' },
            { cod: '32', nome: 'Renolit scuro', codice: '387-70/R' }, { cod: '33', nome: 'Noce', codice: '360-70/R' },
            { cod: '37', nome: 'Douglas', codice: '335.80/R' }, { cod: '48', nome: 'Rovere Scuro', codice: '474-123/R' }
        ]
    },

    // TIPI RETE CON SUPPLEMENTI €/mq
    reti: {
        'STD': { nome: 'Standard PP', supplementoMq: 0, note: 'Polipropilene' },
        'HC': { nome: 'HC Alto Contrasto', supplementoMq: 0, note: 'Nera, fibra vetro' },
        'FV': { nome: 'Fibra vetro grigia', supplementoMq: 0 },
        'AB': { nome: 'Anti-batterica certificata', supplementoMq: 0, note: 'Antracite' },
        'AT': { nome: 'Alta trasparenza nera', supplementoMq: 5.00 },
        'SOL': { nome: 'Solar 0,35', supplementoMq: 9.50, note: 'Grigia o nera' }
    },

    // ACCESSORI
    accessori: {
        'GUIDA_PVC': { nome: 'Guida a terra in PVC pendenza 8°', prezzo: 0, unita: 'cad' },
        'QUICK_LOCK': { nome: 'Sgancio Quick-Lock', prezzo: 18.00, unita: 'cad' },
        'SGANCIO_CRIC': { nome: 'Sgancio cricchetto Lato Riscontro', prezzo: 20.50, unita: 'cad' },
        'CARRO_FLUO': { nome: 'Carro Fluo', prezzo: 25.00, unita: 'cad' },
        'MANIGLIA_TESS': { nome: 'Maniglia tessile', prezzo: 7.50, unita: 'cad' },
        'DOPPIA_MANIGLIA': { nome: 'Doppia maniglia ribassata int/est', prezzo: 9.00, unita: 'coppia' },
        'GUIDA_ALU': { nome: 'Guida inferiore in alluminio', prezzo: 10.50, unita: 'cad' },
        'TUBO_MAGNUM': { nome: 'Tubo Magnum Ø28', prezzo: 18.00, unita: 'cad', note: 'Solo cass. 50mm' },
        'KIT_REGGI': { nome: 'Kit Reggi Guide Pala-System', prezzo: 3.50, unita: 'kit' },
        'BARRA_EXTRA': { nome: 'Barramaniglia Extra Forte', prezzo: 4.50, unita: 'mq', note: 'Consig. >180cm' }
    },

    // SUPPLEMENTI SPECIALI
    supplementi: {
        ralSpecial: { percentuale: 10, fisso: 60.00 }  // +10% su F1 + €60 netti
    },

    // FUNZIONE: Determina fascia da codice colore
    getFasciaByColore: function(codColore) {
        const cod = String(codColore);
        for (const [fascia, colori] of Object.entries(this.colori)) {
            if (colori.find(c => c.cod === cod)) return fascia;
        }
        return null;
    },

    // FUNZIONE: Calcola prezzo zanzariera
    calcolaPrezzo: function(modello, larghezzaCm, altezzaCm, fascia, tipoRete = 'STD', accessoriIds = []) {
        const mod = this.modelli[modello];
        if (!mod) return { errore: `Modello ${modello} non trovato`, totale: 0 };

        // Calcola mq
        const mq = (larghezzaCm / 100) * (altezzaCm / 100);
        const mqFatturati = Math.max(mq, mod.minMq);

        // Prezzo base
        const prezzoMq = mod.prezzi[fascia];
        if (!prezzoMq) return { errore: `Fascia ${fascia} non disponibile per ${modello}`, totale: 0 };
        const prezzoBase = mqFatturati * prezzoMq;

        // Supplemento rete
        const rete = this.reti[tipoRete];
        const suppRete = rete ? mqFatturati * rete.supplementoMq : 0;

        // Accessori
        let totAccessori = 0;
        const accessoriDettaglio = [];
        (accessoriIds || []).forEach(accId => {
            const acc = this.accessori[accId];
            if (acc) {
                let costo = acc.prezzo;
                if (acc.unita === 'mq') costo = acc.prezzo * mqFatturati;
                totAccessori += costo;
                accessoriDettaglio.push({ id: accId, ...acc, costo });
            }
        });

        const totale = prezzoBase + suppRete + totAccessori;

        return {
            modello, dimensioni: { L: larghezzaCm, H: altezzaCm },
            mqReali: parseFloat(mq.toFixed(4)),
            mqFatturati: parseFloat(mqFatturati.toFixed(2)),
            minMq: mod.minMq,
            fascia, prezzoMq,
            prezzoBase: parseFloat(prezzoBase.toFixed(2)),
            rete: rete ? rete.nome : 'Standard',
            suppRete: parseFloat(suppRete.toFixed(2)),
            accessori: accessoriDettaglio,
            totAccessori: parseFloat(totAccessori.toFixed(2)),
            totale: parseFloat(totale.toFixed(2))
        };
    }
};

console.log('✅ PALAGINA_ZANZARIERE_2025 v1.0 - Catalogo Zanzariere 2025 (18 modelli, 3 fasce colore, 6 reti, 10 accessori)');
