/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📦 OPZIONI COMUNI - DATABASE CONDIVISO
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo file contiene TUTTE le opzioni e costanti condivise tra:
 * - App iPad OpenPorte (rilievo-test)
 * - Dashboard Rilievi (dashboard-test)
 * - Editor Posizioni
 * 
 * ⚠️ MODIFICA SOLO QUESTO FILE per aggiornare le opzioni ovunque!
 * 
 * Hosting: https://openporte2025.github.io/shared-database/opzioni-comuni.js
 * 
 * Versione: 1.0.0
 * Data: 20 Gennaio 2026
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 🏭 AZIENDE
// ═══════════════════════════════════════════════════════════════════════════════

const AZIENDE_INFISSI = [
    'Finstral',
    'Oknoplast',
    'Schüco',
    'Internorm',
    'Rehau',
    'Aluk',
    'Metra'
];

const AZIENDE_PERSIANE = [
    'P. Persiane',      // Punto Persiane
    'Pail',
    'Gibus',
    'Schenker'
];

const AZIENDE_TAPPARELLE = [
    'Plasticino',
    'New Solar',
    'Estella'
];

const AZIENDE_ZANZARIERE = [
    'Palagina',
    'MV Line',
    'Bettio'
];

const AZIENDE_CASSONETTI = [
    'Finstral',
    'Alpac',
    'Elicent'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🪟 INFISSI - TELAI FINSTRAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lista completa 58 telai FIN-Window da listino EUR 2025/10 pag.11-24
 */
const FINWINDOW_TELAI_OPTIONS = [
    // ══ TELAI 77mm ══
    '961 - Forma L 77mm',
    '861 - Forma L speciale',
    'G861 - Forma L vetro',
    '9G861 - Forma L vetro spec.',
    'A861 - Forma L alluminio',
    'D861 - Forma L design',
    'H861 - Forma L alta perf.',
    'F861 - Forma L fisso',
    'F961 - Forma L fisso 77mm',
    
    // ══ TELAI 90mm ══
    '962 - Forma L 84mm',
    '862 - Forma L 84mm spec.',
    'G862 - Forma L 84mm vetro',
    '9G862 - Forma L 84mm vetro spec.',
    'F962 - Forma L fisso 84mm',
    
    // ══ TELAI 124mm ══
    '963 - Forma L 104mm',
    '963N - Forma L 104mm nuovo',
    '963N5 - Forma L 104mm N5',
    
    // ══ TELAI FORMA Z ══
    'Z62 - Forma Z 77+8mm',
    'Z62N - Forma Z 77+8mm nuovo',
    'Z64N - Forma Z 84+8mm',
    'Z91 - Forma Z 90mm',
    'AZ62 - Forma Z alluminio',
    'AZ63 - Forma Z alluminio 104mm',
    
    // ══ TELAI SPECIALI ══
    '924 - Ristrutturazione',
    '991 - Passivhaus',
    '951 - Monoblocco',
    '965 - Plus 77mm',
    '966 - Plus 84mm',
    '967 - Plus 104mm',
    '129 - Zoccolo'
];

/**
 * Telai raggruppati per categoria (per UI con optgroup)
 */
const TELAI_PER_CATEGORIA = {
    '77mm': ['961', '861', 'G861', '9G861', 'A861', 'D861', 'H861', 'F861', 'F961'],
    '84mm': ['962', '862', 'G862', '9G862', 'F962'],
    '104mm': ['963', '963N', '963N5'],
    'Forma Z': ['Z62', 'Z62N', 'Z64N', 'Z91', 'AZ62', 'AZ63'],
    'Speciali': ['924', '991', '951', '965', '966', '967', '129']
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🪟 INFISSI - TIPI POSIZIONE
// ═══════════════════════════════════════════════════════════════════════════════

const TIPI_INFISSO = [
    'F1',   // Finestra 1 anta
    'F2',   // Finestra 2 ante
    'F3',   // Finestra 3 ante
    'PF1',  // Portafinestra 1 anta
    'PF2',  // Portafinestra 2 ante
    'PF3',  // Portafinestra 3 ante
    'FISSO' // Elemento fisso
];

const TIPI_INFISSO_DETTAGLIATI = {
    'F1':   { nome: 'Finestra 1 anta', ante: 1, isPF: false },
    'F2':   { nome: 'Finestra 2 ante', ante: 2, isPF: false },
    'F3':   { nome: 'Finestra 3 ante', ante: 3, isPF: false },
    'PF1':  { nome: 'Portafinestra 1 anta', ante: 1, isPF: true },
    'PF2':  { nome: 'Portafinestra 2 ante', ante: 2, isPF: true },
    'PF3':  { nome: 'Portafinestra 3 ante', ante: 3, isPF: true },
    'FISSO': { nome: 'Elemento fisso', ante: 0, isPF: false }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🪟 INFISSI - FINITURE E MATERIALI
// ═══════════════════════════════════════════════════════════════════════════════

const FINITURE_INFISSO = [
    'pvc',
    'pvc-alluminio',
    'alluminio',
    'legno',
    'legno-alluminio'
];

const FINITURE_LABELS = {
    'pvc': 'PVC',
    'pvc-alluminio': 'PVC/Alluminio',
    'alluminio': 'Alluminio',
    'legno': 'Legno',
    'legno-alluminio': 'Legno/Alluminio'
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COLORI PVC (Finstral listino pag.1)
// ═══════════════════════════════════════════════════════════════════════════════

const COLORI_PVC = [
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
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COLORI ALLUMINIO (Finstral listino pag.2 - gruppo 1H)
// ═══════════════════════════════════════════════════════════════════════════════

const COLORI_ALLUMINIO = [
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
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COLORI LEGNO (FINDOOR)
// ═══════════════════════════════════════════════════════════════════════════════

const COLORI_LEGNO = [
    // Gruppo 0 - Base
    'G0 - Rovere naturale',
    'G0 - Faggio naturale',
    'G0 - Acero naturale',
    // Gruppo 1
    'G1 - Rovere tinto',
    'G1 - Noce',
    'G1 - Ciliegio',
    // Gruppo 2
    'G2 - Wengé',
    'G2 - Mogano',
    'G2 - Teak',
    // Gruppo 3
    'G3 - Essenze speciali',
    'G3 - RAL su legno'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 FERRAMENTA FINSTRAL
// ═══════════════════════════════════════════════════════════════════════════════

const FERRAMENTA_CODICI = [
    // Anta/Ribalta - Cerniere a vista (4xx)
    { codice: '411', nome: 'Anta/ribalta', tipo: 'anta-ribalta', cerniere: 'a-vista' },
    { codice: '409', nome: 'Solo anta', tipo: 'anta', cerniere: 'a-vista' },
    { codice: '430', nome: 'Anta uscita sicurezza', tipo: 'anta-sicurezza', cerniere: 'a-vista' },
    { codice: '431', nome: 'A/R uscita sicurezza', tipo: 'anta-ribalta-sicurezza', cerniere: 'a-vista' },
    
    // Anta/Ribalta - Cerniere a scomparsa (2xx)
    { codice: '211', nome: 'A/R cerniere scomparsa', tipo: 'anta-ribalta', cerniere: 'scomparsa' },
    { codice: '209', nome: 'Anta cerniere scomparsa', tipo: 'anta', cerniere: 'scomparsa' },
    
    // Scorrevoli (9xx)
    { codice: '99', nome: 'Scorrevole', tipo: 'scorrevole', cerniere: null },
    { codice: '992', nome: 'Alzante scorrevole', tipo: 'alzante', cerniere: null },
    
    // Speciali
    { codice: '490', nome: 'Ribalta', tipo: 'ribalta', cerniere: 'a-vista' },
    { codice: '491', nome: 'Vasistas', tipo: 'vasistas', cerniere: 'a-vista' },
    { codice: '000', nome: 'Fisso (no ferramenta)', tipo: 'fisso', cerniere: null }
];

const FERRAMENTA_OPTIONS = FERRAMENTA_CODICI.map(f => `${f.codice} - ${f.nome}`);

// ═══════════════════════════════════════════════════════════════════════════════
// 🚪 LATI E ESECUZIONI (per DIN)
// ═══════════════════════════════════════════════════════════════════════════════

const LATI_DIN = [
    { codice: '-1', nome: 'Sinistro (DIN-L)' },
    { codice: '1', nome: 'Destro (DIN-R)' }
];

const ESECUZIONI_DIN = [
    { codice: '0', nome: 'Standard' },
    { codice: 'M', nome: 'Maniglia centrata' },
    { codice: 'B', nome: 'Maniglia bassa' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔘 MANIGLIE FINSTRAL
// ═══════════════════════════════════════════════════════════════════════════════

const MANIGLIE_FINSTRAL = [
    '2012 - Standard',
    '2020 - Design moderna',
    '2014 - Sicurezza',
    '2016 - Comfort',
    '1969 - Classica',
    '2050 - Premium'
];

const COLORI_MANIGLIA = [
    'Bianco RAL 9016',
    'Argento F1',
    'Bronzo',
    'Nero opaco',
    'Titanio',
    'Cromo satinato',
    'Ottone lucido'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🪟 VETRI
// ═══════════════════════════════════════════════════════════════════════════════

const TIPI_VETRO = [
    'Standard',
    'Doppio',
    'Triplo',
    'Triplo Plus',
    'Sicurezza P2A',
    'Sicurezza P4A',
    'Acustico',
    'Satinato',
    'Ornamentale'
];

const VETRI_ORNAMENTALI = [
    'Chinchilla',
    'Delta',
    'Florales',
    'Kathedral',
    'Master-Point',
    'Satinato'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🚨 ALLARME / SENSORI
// ═══════════════════════════════════════════════════════════════════════════════

const OPZIONI_ALLARME = [
    '',
    'Predisposizione',
    'Contatto magnetico',
    'Sensore rottura vetro',
    'Completo (magn.+rottura)'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 TIPI ANTA
// ═══════════════════════════════════════════════════════════════════════════════

const TIPI_ANTA = [
    'Nova-line',
    'Nova-line Plus',
    'Slim-line',
    'Slim-line Twin',
    'Classic-line',
    'Step-line'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 PERSIANE - PUNTO PERSIANE
// ═══════════════════════════════════════════════════════════════════════════════

const TIPI_PERSIANA = [
    'F1',   // 1 anta
    'F2',   // 2 ante
    'F3',   // 3 ante
    'PF1',  // Portafinestra 1 anta
    'PF2',  // Portafinestra 2 ante
    'PF3'   // Portafinestra 3 ante
];

const MODELLI_PERSIANA = [
    'Stecca aperta',
    'Stecca chiusa',
    'Dogato',
    'Alla Padovana',
    'Emiliana'
];

const APERTURE_PERSIANA = [
    'STD - Standard',
    'LIB - Libro',
    '/A - A ribalta'
];

const FISSAGGI_PERSIANA = [
    'Muro',
    'Telaio',
    'Controtelaio'
];

const COLORI_PERSIANA = [
    'Bianco RAL 9016',
    'Grigio RAL 7016',
    'Marrone RAL 8017',
    'Verde RAL 6005',
    'Avorio RAL 1013',
    'Testa di moro',
    'Grigio antracite'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔩 ACCESSORI PERSIANA (Punto Persiane)
// ═══════════════════════════════════════════════════════════════════════════════

const CARDINI_PUNTO_PERSIANE = [
    { codice: 'C.SAF90', nome: 'Cardine SAF 90°', prezzo: 0 },
    { codice: 'C.SAF180', nome: 'Cardine SAF 180°', prezzo: 5 },
    { codice: 'C.REG', nome: 'Cardine regolabile', prezzo: 8 },
    { codice: 'C.INOX', nome: 'Cardine INOX', prezzo: 12 }
];

const FERMAPERSIANE_PUNTO_PERSIANE = [
    { codice: 'K.EASY', nome: 'Ferma Easy click', prezzo: 0 },
    { codice: 'K.CALAMITA', nome: 'Ferma a calamita', prezzo: 6 },
    { codice: 'K.BRACCIO', nome: 'Ferma a braccio', prezzo: 10 },
    { codice: 'K.PAVIMENTO', nome: 'Ferma a pavimento', prezzo: 8 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎚️ TAPPARELLE - PLASTICINO
// ═══════════════════════════════════════════════════════════════════════════════

const MODELLI_TAPPARELLE = {
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
        // Speciali
        { cod: 'A40', nome: 'Tipo ORIENTA', dim: '', tipo: 'Orientabile' },
        { cod: 'A50', nome: 'Tipo ESTELLA CLASSIC', dim: '', tipo: 'Areazione' }
    ],
    'New Solar': [],
    'Estella': []
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COLORI TAPPARELLE PLASTICINO
// ═══════════════════════════════════════════════════════════════════════════════

const COLORI_TAPPARELLE_PLASTICINO = {
    // ALLUMINIO COIBENTATO - Tinta Unita
    'ALLUMINIO_UNITA': [
        'Bianco 01', 'Bianco 9010', 'Avorio 34', 'Crema 39', 
        'Grigio 07', 'Argento 05', 'Grigio 10', 'Grigio 23',
        'Salmone 06', 'Ocra 03', 'Marrone 08', 'Marrone 04', 
        'Marrone 48', 'Marrone 79', 'Verde 43', 'Verde 09',
        'Verde 83', 'Verde 29', 'Rosso 02', 'Blu 35', 'Noce 61'
    ],
    // ALLUMINIO COIBENTATO - Tinta Legno
    'ALLUMINIO_LEGNO': [
        'Pino 52', 'Rovere 56', 'Teak 44', 'Ciliegio 33', 
        'Ciliegio 60', 'Noce 47'
    ],
    // ALLUMINIO COIBENTATO - Tinta Raffaello
    'ALLUMINIO_RAFFAELLO': [
        'Grigio Raffaello R94', 'Verde Raffaello R99', 
        'Marrone Raffaello R91', 'Rosso Raffaello R66'
    ],
    // PVC
    'PVC': [
        'Bianco 01', 'Avorio 34', 'Beige 17', 'Beige 502',
        'Grigio 07', 'Grigio 10', 'Marrone 81*', 'Marrone 0197*',
        'Verde 06', 'Noce 37*', 'Nero 88*', 'Blu 15*', 'Blu 95*',
        'Bruno 68', 'Bronzo', 'Ocra 84'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🛤️ GUIDE TAPPARELLE PLASTICINO
// ═══════════════════════════════════════════════════════════════════════════════

const GUIDE_PLASTICINO = [
    // Alluminio Estruso 30x25x30
    'TG15 - Guide 30x25x30 Finestra',
    'TG10 - Guide 30x25x30 Portafinestra',
    'TG30 - Guide 30x25x30 Barra 6800mm',
    // Alluminio Estruso 28x17x28 Ribassato
    'TG25RIB - Guide 28x17x28 Ribassato Finestra',
    'TG20RIB - Guide 28x17x28 Ribassato Portafinestra',
    'TG35RIB - Guide 28x17x28 Ribassato Barra',
    // Alluminio Estruso 28x17x28 Standard
    'TG25 - Guide 28x17x28 Finestra',
    'TG20 - Guide 28x17x28 Portafinestra',
    'TG35 - Guide 28x17x28 Barra',
    // Ferro Zincato 21x20x21
    'PF2 - Guide 21x20x21 Ferro Zn Finestra',
    'PF4 - Guide 21x20x21 Ferro Zn Portafinestra',
    'PF1 - Guide 21x20x21 Ferro Zn Barra'
];

const COLORI_GUIDE_PLASTICINO = {
    'ANODIZZATO': ['Argento', 'Bronzo', 'Elox', 'Bianco'],
    'VERNICIATO': [
        'Avorio RAL 1013', 'Verde RAL 6005', 
        'Marrone RAL 8014', 'Marrone RAL 8017', 'Marrone RAL 8019'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 ACCESSORI TAPPARELLA
// ═══════════════════════════════════════════════════════════════════════════════

const ACCESSORI_TAPPARELLA = [
    { id: 'rullo', label: 'Rullo ottagonale', icon: '🔄' },
    { id: 'supporti', label: 'Supporti + Cuscinetti', icon: '🔩' },
    { id: 'calotta', label: 'Calotta regolabile', icon: '🎩' },
    { id: 'puleggia', label: 'Puleggia', icon: '⚙️' },
    { id: 'avvolgitore', label: 'Avvolgitore + Cassetta', icon: '📦' },
    { id: 'cintino', label: 'Cintino', icon: '🎗️' },
    { id: 'passacinghia', label: 'Passacinghia', icon: '🔗' },
    { id: 'ganci', label: 'Ganci a molla', icon: '🪝' },
    { id: 'guide', label: 'Guide', icon: '🛤️' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔌 MOTORI SOMFY
// ═══════════════════════════════════════════════════════════════════════════════

const MOTORI_SOMFY = [
    { id: 'oximo_20', modello: 'Oximo 50 io 20/17', coppia: 20, prezzo: 137.66 },
    { id: 'oximo_30', modello: 'Oximo 50 io 30/17', coppia: 30, prezzo: 145.83 },
    { id: 'rs100_hybrid', modello: 'RS100 io hybrid 20/17', coppia: 20, prezzo: 836.95 },
    { id: 'lt50_helios', modello: 'LT 50 Helios WT 30/17', coppia: 30, prezzo: 119.88 },
    { id: 'lt60_orion', modello: 'LT60 Orion S 55/17', coppia: 55, prezzo: 174.00 }
];

const ACCESSORI_MOTORE_SOMFY = [
    { id: 'supporto', nome: 'Supporto operatore da avvitare', prezzo: 94.60 },
    { id: 'corona_60', nome: 'Corona OTT.60 I', prezzo: 17.67 },
    { id: 'ruota_60', nome: 'Ruota per rullo ottagonale Ø60mm', prezzo: 21.00 },
    { id: 'izymo', nome: 'IZYMO Shutter Receiver io', prezzo: 66.59 }
];

const COMANDI_SOMFY = [
    { id: 'amy1', nome: 'Amy 1 io + cornice quadrata', prezzo: 23.46 },
    { id: 'situo1', nome: 'Situo 1 IO Pure', prezzo: 84.20 },
    { id: 'situo5', nome: 'Situo 5 IO Pure', prezzo: 111.10 },
    { id: 'smoove', nome: 'Smoove Origin IO', prezzo: 77.60 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🦟 ZANZARIERE - PALAGINA
// ═══════════════════════════════════════════════════════════════════════════════

const LINEE_ZANZARIERE_PALAGINA = {
    'F': [  // Per finestre
        'Classic',
        'Mini',
        'Plisse',
        'Avvolgibile'
    ],
    'PF': [ // Per portefinestre
        'Plisse',
        'Scorrevole',
        'Battente',
        'Avvolgibile'
    ]
};

const MODELLI_ZANZARIERE_PALAGINA = {
    'Classic': ['C22', 'C32', 'C42'],
    'Mini': ['M18', 'M22'],
    'Plisse': ['P32', 'P42', 'P52'],
    'Avvolgibile': ['A32', 'A42'],
    'Scorrevole': ['S42', 'S52'],
    'Battente': ['B32', 'B42']
};

const FASCE_COLORE_PALAGINA = [
    'Fascia 1 - Standard',
    'Fascia 2 - RAL comuni',
    'Fascia 3 - RAL speciali',
    'Fascia 4 - Effetti legno'
];

const COLORI_TELAIO_PALAGINA = [
    'Bianco RAL 9016',
    'Bianco RAL 9010',
    'Marrone RAL 8017',
    'Grigio RAL 7016',
    'Avorio RAL 1013',
    'Verde RAL 6005',
    'Effetto legno chiaro',
    'Effetto legno scuro'
];

const TIPI_RETE_PALAGINA = [
    'Standard grigia',
    'Antivento',
    'Antistrappo',
    'Pet Screen',
    'Tela solare'
];

const COLORI_PLASTICA_PALAGINA = [
    'Bianco',
    'Nero',
    'Grigio',
    'Marrone'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 CASSONETTI FINSTRAL
// ═══════════════════════════════════════════════════════════════════════════════

const TIPI_CASSONETTO = [
    'Esterno',
    'Interno',
    'A scomparsa',
    'Monoblocco'
];

const MATERIALI_CASSONETTO = [
    'PVC',
    'Legno'
];

const CODICI_CASSONETTO_PVC = [
    { codice: '148', nome: '148 - B≤148mm (standard)' },
    { codice: '148B', nome: '148B - B 335-600mm' },
    { codice: '300', nome: '300 - B≤300mm' },
    { codice: '300B', nome: '300B - B 335-600mm' }
];

const CODICI_CASSONETTO_LEGNO = [
    { codice: '9-48', nome: '9-48 - B≤150mm (L max 2240)' },
    { codice: '9-48B', nome: '9-48B - B≤600mm (L max 2240)' }
];

const GRUPPI_COLORE_CASSONETTO = {
    'PVC': [
        { gruppo: 'bianco', nome: '○ Tonalità Bianco (01,42,45,07,27)' },
        { gruppo: 'scuri', nome: '● Colori Scuri (06,46,13,19,55)' }
    ],
    'Legno': [
        { gruppo: 'legno1', nome: 'Gruppo 1 - Abete' },
        { gruppo: 'legno2+3', nome: 'Gruppo 2+3 - Rovere (prezzo maggiore)' }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 AMBIENTI E PIANI
// ═══════════════════════════════════════════════════════════════════════════════

const AMBIENTI = [
    'Soggiorno',
    'Cucina',
    'Camera',
    'Camera matrimoniale',
    'Camera singola',
    'Cameretta',
    'Bagno',
    'Bagno padronale',
    'Studio',
    'Ingresso',
    'Corridoio',
    'Lavanderia',
    'Ripostiglio',
    'Mansarda',
    'Taverna',
    'Garage',
    'Balcone',
    'Terrazzo'
];

const PIANI = [
    'Seminterrato',
    'Piano Terra',
    'Piano Rialzato',
    'Primo Piano',
    'Secondo Piano',
    'Terzo Piano',
    'Quarto Piano',
    'Mansarda',
    'Sottotetto'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 FUNZIONI HELPER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ottiene colori disponibili in base alla finitura
 */
function getColoriPerFinitura(finitura) {
    const fin = (finitura || '').toLowerCase();
    
    if (fin.includes('legno')) {
        return COLORI_LEGNO;
    } else if (fin.includes('alluminio') || fin.includes('alu')) {
        return COLORI_ALLUMINIO;
    } else {
        return COLORI_PVC;
    }
}

/**
 * Ottiene modelli tapparella per azienda
 */
function getModelliTapparella(azienda) {
    return MODELLI_TAPPARELLE[azienda] || MODELLI_TAPPARELLE['Plasticino'];
}

/**
 * Ottiene colori tapparella per modello
 */
function getColoriTapparella(modello) {
    if (!modello) return COLORI_TAPPARELLE_PLASTICINO['PVC'];
    
    const codice = modello.match(/^([A-Z0-9]+)/)?.[1] || '';
    
    // Mappa codice → categorie colori
    const mappaColori = {
        'TA01': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
        'TA25': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
        'TA05': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
        'TA30': ['ALLUMINIO_UNITA', 'ALLUMINIO_LEGNO', 'ALLUMINIO_RAFFAELLO'],
        'A01': ['PVC'],
        'A10': ['PVC'],
        'A16': ['PVC'],
        'A15': ['PVC']
    };
    
    const categorie = mappaColori[codice] || ['PVC'];
    let colori = [];
    
    categorie.forEach(cat => {
        if (COLORI_TAPPARELLE_PLASTICINO[cat]) {
            colori = colori.concat(COLORI_TAPPARELLE_PLASTICINO[cat]);
        }
    });
    
    return [...new Set(colori)];
}

/**
 * Ottiene tutti i colori guide disponibili
 */
function getColoriGuide() {
    return [
        ...COLORI_GUIDE_PLASTICINO['ANODIZZATO'],
        ...COLORI_GUIDE_PLASTICINO['VERNICIATO'],
        'RAL a richiesta'
    ];
}

/**
 * Calcola cardini suggeriti per persiana
 */
function calcolaCardiniPersiana(tipologia, aperturaLibro = false) {
    const base = {
        'F1': 3, 'F2': 6, 'F3': 9,
        'PF1': 4, 'PF2': 8, 'PF3': 12
    };
    let qty = base[tipologia] || 4;
    if (aperturaLibro) qty += 2;
    return qty;
}

/**
 * Calcola fermapersiane suggeriti
 */
function calcolaFermapersiane(tipologia) {
    const numAnte = parseInt(tipologia.replace('PF', '').replace('F', '')) || 2;
    return numAnte * 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORT - Espone tutto a window per uso globale
// ═══════════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
    window.OPZIONI = {
        // Aziende
        AZIENDE_INFISSI,
        AZIENDE_PERSIANE,
        AZIENDE_TAPPARELLE,
        AZIENDE_ZANZARIERE,
        AZIENDE_CASSONETTI,
        
        // Infissi
        FINWINDOW_TELAI_OPTIONS,
        TELAI_PER_CATEGORIA,
        TIPI_INFISSO,
        TIPI_INFISSO_DETTAGLIATI,
        FINITURE_INFISSO,
        FINITURE_LABELS,
        
        // Colori
        COLORI_PVC,
        COLORI_ALLUMINIO,
        COLORI_LEGNO,
        
        // Ferramenta
        FERRAMENTA_CODICI,
        FERRAMENTA_OPTIONS,
        LATI_DIN,
        ESECUZIONI_DIN,
        MANIGLIE_FINSTRAL,
        COLORI_MANIGLIA,
        
        // Vetri
        TIPI_VETRO,
        VETRI_ORNAMENTALI,
        OPZIONI_ALLARME,
        TIPI_ANTA,
        
        // Persiane
        TIPI_PERSIANA,
        MODELLI_PERSIANA,
        APERTURE_PERSIANA,
        FISSAGGI_PERSIANA,
        COLORI_PERSIANA,
        CARDINI_PUNTO_PERSIANE,
        FERMAPERSIANE_PUNTO_PERSIANE,
        
        // Tapparelle
        MODELLI_TAPPARELLE,
        COLORI_TAPPARELLE_PLASTICINO,
        GUIDE_PLASTICINO,
        COLORI_GUIDE_PLASTICINO,
        ACCESSORI_TAPPARELLA,
        
        // Motori
        MOTORI_SOMFY,
        ACCESSORI_MOTORE_SOMFY,
        COMANDI_SOMFY,
        
        // Zanzariere
        LINEE_ZANZARIERE_PALAGINA,
        MODELLI_ZANZARIERE_PALAGINA,
        FASCE_COLORE_PALAGINA,
        COLORI_TELAIO_PALAGINA,
        TIPI_RETE_PALAGINA,
        COLORI_PLASTICA_PALAGINA,
        
        // Cassonetti
        TIPI_CASSONETTO,
        MATERIALI_CASSONETTO,
        CODICI_CASSONETTO_PVC,
        CODICI_CASSONETTO_LEGNO,
        GRUPPI_COLORE_CASSONETTO,
        
        // Comuni
        AMBIENTI,
        PIANI,
        
        // Funzioni helper
        getColoriPerFinitura,
        getModelliTapparella,
        getColoriTapparella,
        getColoriGuide,
        calcolaCardiniPersiana,
        calcolaFermapersiane
    };
    
    console.log('✅ opzioni-comuni.js caricato - OPZIONI disponibili globalmente');
}

// Per Node.js / CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AZIENDE_INFISSI, AZIENDE_PERSIANE, AZIENDE_TAPPARELLE, AZIENDE_ZANZARIERE, AZIENDE_CASSONETTI,
        FINWINDOW_TELAI_OPTIONS, TELAI_PER_CATEGORIA, TIPI_INFISSO, TIPI_INFISSO_DETTAGLIATI,
        FINITURE_INFISSO, FINITURE_LABELS, COLORI_PVC, COLORI_ALLUMINIO, COLORI_LEGNO,
        FERRAMENTA_CODICI, FERRAMENTA_OPTIONS, LATI_DIN, ESECUZIONI_DIN,
        MANIGLIE_FINSTRAL, COLORI_MANIGLIA, TIPI_VETRO, VETRI_ORNAMENTALI, OPZIONI_ALLARME, TIPI_ANTA,
        TIPI_PERSIANA, MODELLI_PERSIANA, APERTURE_PERSIANA, FISSAGGI_PERSIANA, COLORI_PERSIANA,
        CARDINI_PUNTO_PERSIANE, FERMAPERSIANE_PUNTO_PERSIANE,
        MODELLI_TAPPARELLE, COLORI_TAPPARELLE_PLASTICINO, GUIDE_PLASTICINO, COLORI_GUIDE_PLASTICINO,
        ACCESSORI_TAPPARELLA, MOTORI_SOMFY, ACCESSORI_MOTORE_SOMFY, COMANDI_SOMFY,
        LINEE_ZANZARIERE_PALAGINA, MODELLI_ZANZARIERE_PALAGINA, FASCE_COLORE_PALAGINA,
        COLORI_TELAIO_PALAGINA, TIPI_RETE_PALAGINA, COLORI_PLASTICA_PALAGINA,
        TIPI_CASSONETTO, MATERIALI_CASSONETTO, CODICI_CASSONETTO_PVC, CODICI_CASSONETTO_LEGNO,
        GRUPPI_COLORE_CASSONETTO, AMBIENTI, PIANI,
        getColoriPerFinitura, getModelliTapparella, getColoriTapparella, getColoriGuide,
        calcolaCardiniPersiana, calcolaFermapersiane
    };
}
