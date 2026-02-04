/**
 * PROJECT-LIST-VIEW.js v1.1
 * Modulo condiviso per visualizzazione lista progetti
 * Usato da: App Rilievo + Dashboard Rilievi
 * Deploy: shared-database/project-list-view.js
 * 
 * ╔══════════════════════════════════════════════════════════╗
 * ║  CONFIGURAZIONE STATI — MODIFICA SOLO QUI               ║
 * ║  Aggiungi/rinomina/riordina stati in STATI_CONFIG        ║
 * ║  Tutto il resto si adatta automaticamente                ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// =============================================================================
// CONFIGURAZIONE CENTRALIZZATA STATI
// =============================================================================
// Ordine array = ordine tabs + ordine ciclo bottone stato
// Per aggiungere uno stato: aggiungi un oggetto qui sotto
// Per rinominare: cambia label/labelSingolare
// Per riordinare: sposta l'oggetto nella posizione desiderata
// Per cambiare colori: modifica color/bg

const STATI_CONFIG = [
    {
        key: 'preventivo',              // Valore salvato nei dati progetto
        label: '📋 Preventivi',         // Label tab (plurale)
        labelSingolare: 'Preventivo',   // Label bottone card (singolare)
        icon: '📋',                     // Emoji icona
        color: '#6366f1',               // Colore testo/bordo (indigo)
        bg: '#eef2ff',                  // Sfondo tab attivo / bottone
        emptyMsg: 'Nessun preventivo in corso',
        emptyIcon: '📋',
        dimCards: false                  // true = card semi-trasparenti
    },
    {
        key: 'ordine',
        label: '✅ Ordini',
        labelSingolare: 'Ordine',
        icon: '✅',
        color: '#059669',               // Verde
        bg: '#ecfdf5',
        emptyMsg: 'Nessun ordine confermato',
        emptyIcon: '✅',
        dimCards: false
    },
    {
        key: 'annullato',
        label: '❌ Annullati',
        labelSingolare: 'Annullato',
        icon: '❌',
        color: '#9ca3af',               // Grigio
        bg: '#f9fafb',
        emptyMsg: 'Nessun progetto annullato',
        emptyIcon: '🗄️',
        dimCards: true                   // Card opacizzate
    }
];

// =============================================================================
// DERIVATI AUTOMATICI (non toccare)
// =============================================================================
const STATI_MAP = {};
const STATI_KEYS = [];
const STATI_CYCLE = {};
const STATI_DEFAULT = STATI_CONFIG[0]?.key || 'preventivo';

STATI_CONFIG.forEach((s, i) => {
    STATI_MAP[s.key] = s;
    STATI_KEYS.push(s.key);
    const nextIndex = (i + 1) % STATI_CONFIG.length;
    STATI_CYCLE[s.key] = STATI_CONFIG[nextIndex].key;
});

// =============================================================================
// MODULO PRINCIPALE
// =============================================================================

const ProjectListView = {
    VERSION: '1.1',
    _currentTab: STATI_DEFAULT,

    // Esponi config per accesso esterno
    STATI: STATI_CONFIG,
    STATI_MAP: STATI_MAP,
    STATI_KEYS: STATI_KEYS,
    STATI_DEFAULT: STATI_DEFAULT,

    // =========================================================================
    // NORMALIZZAZIONE
    // =========================================================================
    
    normalize(project, source) {
        if (source === 'app') {
            const clientName = project.client || 
                [project.clientData?.cognome, project.clientData?.nome].filter(Boolean).join(' ') || 
                'Cliente';
            return {
                id: project.id,
                clientName: clientName,
                projectName: project.name || '—',
                posCount: (project.positions || []).length,
                stato: STATI_MAP[project.stato] ? project.stato : STATI_DEFAULT,
                hasOdoo: !!(project.odoo_customer_id || project.odoo_customer),
                version: project.metadata?.version || null,
                dateStr: project.metadata?.updated 
                    ? new Date(project.metadata.updated).toLocaleDateString('it-IT', {day:'2-digit', month:'2-digit', year:'2-digit'}) 
                    : '',
                sortKey: project.metadata?.updated || project.dataModifica || project.createdAt || '',
                completamento: null,
                ambiente: null,
                _source: 'app'
            };
        } else {
            return {
                id: project.id,
                clientName: project.cliente || project.nome || 'Cliente',
                projectName: project.nome || '—',
                posCount: typeof project.posizioni === 'number' ? project.posizioni : 0,
                stato: STATI_MAP[project.rawData?.stato] ? project.rawData.stato : STATI_DEFAULT,
                hasOdoo: !!(project.rawData?.odoo_customer_id || project.rawData?.odoo_customer),
                version: null,
                dateStr: project.dataModifica || '',
                sortKey: project.timestampModifica || 0,
                completamento: project.completamento ?? null,
                ambiente: project.ambiente || null,
                _source: 'dashboard'
            };
        }
    },

    normalizeAll(projects, source) {
        return (projects || []).map(p => this.normalize(p, source));
    },

    // =========================================================================
    // HTML
    // =========================================================================

    generateHTML(normalizedProjects, options = {}) {
        const opts = {
            onOpenFn: 'openProject',
            onDeleteFn: 'deleteProject',
            showCompletamento: false,
            showAmbiente: false,
            stickyTabs: true,
            stickyTop: '0px',
            fullPage: false,
            ...options
        };

        const currentTab = this._currentTab;
        const counts = {};
        STATI_KEYS.forEach(k => { counts[k] = normalizedProjects.filter(p => p.stato === k).length; });

        const filtered = normalizedProjects
            .filter(p => p.stato === currentTab)
            .sort((a, b) => {
                if (typeof a.sortKey === 'number' && typeof b.sortKey === 'number') return b.sortKey - a.sortKey;
                return String(b.sortKey).localeCompare(String(a.sortKey));
            });

        const tabsHTML = this._generateTabs(counts, currentTab, opts);
        const cardsHTML = this._generateCards(filtered, currentTab, opts);

        if (opts.fullPage) {
            return `<div style="min-height:100vh;background:#f3f4f6;">
                ${tabsHTML}
                <div style="padding:12px 16px;max-width:1400px;margin:0 auto;">${cardsHTML}</div>
            </div>`;
        }
        return `${tabsHTML}<div style="padding:12px 16px;">${cardsHTML}</div>`;
    },

    _generateTabs(counts, currentTab, opts) {
        const sticky = opts.stickyTabs ? `position:sticky;top:${opts.stickyTop};z-index:30;` : '';
        return `
            <div style="${sticky}background:#f3f4f6;padding:8px 16px 0;">
                <div style="display:flex;gap:4px;background:white;border-radius:12px 12px 0 0;padding:4px;box-shadow:0 -2px 10px rgba(0,0,0,0.05);max-width:1400px;margin:0 auto;">
                    ${STATI_CONFIG.map(tab => {
                        const active = currentTab === tab.key;
                        const count = counts[tab.key] || 0;
                        return `<button onclick="ProjectListView.setTab('${tab.key}')" 
                            style="flex:1;padding:10px 8px;border:none;border-radius:10px;font-weight:${active?700:500};font-size:14px;cursor:pointer;transition:all 0.2s;
                            background:${active ? tab.bg : 'transparent'};color:${active ? tab.color : '#6b7280'};
                            ${active ? 'box-shadow:0 2px 8px rgba(0,0,0,0.08);' : ''}">
                            ${tab.label}
                            <span style="display:inline-block;min-width:22px;padding:1px 6px;border-radius:10px;font-size:12px;font-weight:700;
                                background:${active ? tab.color : '#e5e7eb'};color:${active ? 'white' : '#6b7280'};margin-left:4px;">${count}</span>
                        </button>`;
                    }).join('')}
                </div>
            </div>`;
    },

    _generateCards(filtered, currentTab, opts) {
        const sc = STATI_MAP[currentTab];
        if (filtered.length === 0) {
            return `<div style="text-align:center;padding:60px 20px;color:#9ca3af;font-size:16px;">
                <div style="font-size:48px;margin-bottom:12px;">${sc?.emptyIcon || '📋'}</div>
                ${sc?.emptyMsg || 'Nessun progetto'}
            </div>`;
        }
        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;">
            ${filtered.map(p => this._generateCard(p, currentTab, opts)).join('')}
        </div>`;
    },

    _generateCard(p, currentTab, opts) {
        const sc = STATI_MAP[p.stato] || STATI_MAP[STATI_DEFAULT];
        const tabCfg = STATI_MAP[currentTab];

        let completamentoBadge = '';
        if (opts.showCompletamento && p.completamento !== null) {
            const cc = p.completamento >= 80 ? '#10b981' : p.completamento >= 50 ? '#f59e0b' : '#ef4444';
            completamentoBadge = ` <span style="padding:2px 8px;background:${cc};color:white;border-radius:12px;font-size:11px;font-weight:700;">${p.completamento}%</span>`;
        }

        const odooBadge = p.hasOdoo 
            ? '<span style="display:inline-block;padding:1px 6px;background:#714B67;color:white;border-radius:4px;font-size:10px;font-weight:600;margin-left:6px;vertical-align:middle;">Odoo</span>' : '';

        const ambienteRow = (opts.showAmbiente && p.ambiente && p.ambiente !== 'N/D')
            ? `<div style="font-size:12px;color:#9ca3af;margin-bottom:4px;">🏠 ${p.ambiente}</div>` : '';

        const idFmt = typeof formatProjectId === 'function' ? formatProjectId(p.id) : ('#' + p.id);

        const deleteBtn = opts.onDeleteFn 
            ? `<button onclick="event.stopPropagation();${opts.onDeleteFn}('${p.id}')" title="Elimina"
                    style="padding:4px 6px;border:none;background:none;cursor:pointer;font-size:14px;opacity:0.4;transition:opacity 0.15s;"
                    onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.4'">🗑️</button>` : '';

        return `<div onclick="${opts.onOpenFn}('${p.id}')" 
             style="background:white;border-radius:12px;padding:14px 16px;cursor:pointer;border:1px solid #e5e7eb;
                    transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.06);position:relative;
                    ${tabCfg?.dimCards ? 'opacity:0.65;' : ''}"
             onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';this.style.transform='translateY(-2px)'"
             onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)';this.style.transform='none'">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:16px;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        ${(p.clientName || '').toUpperCase()}${odooBadge}${completamentoBadge}
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
                    <button onclick="event.stopPropagation();ProjectListView.cycleStato('${p.id}')" title="Cambia stato"
                            style="padding:4px 8px;border:1px solid ${sc.color};background:${sc.bg};border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:${sc.color};transition:all 0.15s;">
                        ${sc.icon} ${sc.labelSingolare}
                    </button>
                    ${deleteBtn}
                </div>
            </div>
            <div style="font-size:13px;color:#6b7280;margin-bottom:${ambienteRow ? '4' : '8'}px;display:flex;align-items:center;gap:6px;">
                <span style="font-weight:500;">${p.projectName}</span>
                <span style="font-family:monospace;font-size:11px;padding:1px 5px;background:#f3f4f6;border-radius:4px;color:#9ca3af;">${idFmt}</span>
            </div>
            ${ambienteRow}
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ca3af;padding-top:6px;border-top:1px solid #f3f4f6;">
                <span>📋 ${p.posCount} posizioni</span>
                ${p.version ? '<span style="font-family:monospace;">v' + p.version + '</span>' : ''}
                ${p.dateStr ? '<span>' + p.dateStr + '</span>' : ''}
                <span style="color:#6366f1;font-weight:600;">Apri →</span>
            </div>
        </div>`;
    },

    // =========================================================================
    // AZIONI
    // =========================================================================

    setTab(tab) {
        if (STATI_MAP[tab]) this._currentTab = tab;
        if (typeof render === 'function') render();
        else if (this._renderCallback) this._renderCallback();
    },

    cycleStato(projectId) {
        let projectName = '', newStato = '';

        // App Rilievo
        if (typeof state !== 'undefined' && state.projects) {
            const p = state.projects.find(p => p.id === projectId);
            if (p) {
                const old = STATI_MAP[p.stato] ? p.stato : STATI_DEFAULT;
                p.stato = STATI_CYCLE[old] || STATI_DEFAULT;
                newStato = p.stato;
                projectName = p.name || p.client || projectId;
                if (typeof saveState === 'function') saveState();
            }
        }

        // Dashboard
        if (typeof window !== 'undefined' && window.githubProjects) {
            const p = window.githubProjects.find(p => p.id === projectId);
            if (p) {
                const old = STATI_MAP[p.rawData?.stato] ? p.rawData.stato : STATI_DEFAULT;
                const next = STATI_CYCLE[old] || STATI_DEFAULT;
                if (p.rawData) p.rawData.stato = next;
                newStato = next;
                projectName = p.nome || p.cliente || projectId;
                if (typeof saveProjectStatoToGitHub === 'function') saveProjectStatoToGitHub(projectId, next);
            }
        }

        if (newStato) {
            const sc = STATI_MAP[newStato];
            const msg = `${projectName}: ${sc?.icon || ''} ${sc?.labelSingolare || newStato}`;
            if (typeof showNotification === 'function') showNotification(msg, 'success', 2000);
            else if (typeof showAlert === 'function') showAlert('success', msg);
        }

        this.setTab(this._currentTab);
    },

    onRender(callback) {
        this._renderCallback = callback;
    }
};

if (typeof window !== 'undefined') {
    window.ProjectListView = ProjectListView;
}
