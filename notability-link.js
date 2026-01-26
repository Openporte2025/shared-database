// ============================================================================
// NOTABILITY-LINK.js - Gestione Link Schizzo Notability
// ============================================================================
// Modulo condiviso per App Rilievo, Dashboard Ufficio e App Posa
// 
// USO:
//   NOTABILITY.open(project)           - Apre lo schizzo
//   NOTABILITY.edit(project, callbacks) - Modifica/aggiunge link
//   NOTABILITY.renderButton(project)   - Ritorna HTML pulsante
//   NOTABILITY.hasLink(project)        - Verifica se ha link
//
// @version 1.0.0
// @repository shared-database
// ============================================================================

const NOTABILITY_VERSION = '1.0.0';

(function() {
    'use strict';
    
    console.log(`📎 Notability Link v${NOTABILITY_VERSION} - Caricamento...`);
    
    // ========================================================================
    // HELPER: Verifica se progetto ha link schizzo
    // ========================================================================
    
    /**
     * Verifica se il progetto ha un link schizzo
     * @param {Object} project - Oggetto progetto
     * @returns {boolean}
     */
    function hasLink(project) {
        return !!(project && project.linkSchizzo && project.linkSchizzo.trim());
    }
    
    /**
     * Ottiene il link schizzo dal progetto
     * @param {Object} project - Oggetto progetto
     * @returns {string} - Link o stringa vuota
     */
    function getLink(project) {
        if (!project) return '';
        return project.linkSchizzo || '';
    }
    
    // ========================================================================
    // FUNZIONI PRINCIPALI
    // ========================================================================
    
    /**
     * Apre il link schizzo nel browser/app
     * - Su PC: apre PDF nel browser
     * - Su iPad: Notability gestisce il deep link automaticamente
     * 
     * @param {Object} project - Oggetto progetto con linkSchizzo
     * @param {Object} callbacks - Callbacks opzionali { onNotFound, onOpen }
     */
    function openSchizzo(project, callbacks = {}) {
        const { onNotFound, onOpen } = callbacks;
        
        if (!project || !hasLink(project)) {
            console.warn('📎 Nessuno schizzo allegato');
            if (onNotFound && typeof onNotFound === 'function') {
                onNotFound();
            } else {
                // Fallback: usa notifica globale se disponibile
                if (typeof showNotification === 'function') {
                    showNotification('⚠️ Nessuno schizzo allegato', 'warning');
                } else if (typeof showAlert === 'function') {
                    showAlert('warning', '⚠️ Nessuno schizzo allegato');
                } else {
                    alert('⚠️ Nessuno schizzo allegato');
                }
            }
            return false;
        }
        
        // Apri in nuova tab - Notability.com gestisce automaticamente il deep link su iPad
        window.open(project.linkSchizzo, '_blank');
        console.log('📎 Aperto schizzo:', project.linkSchizzo);
        
        if (onOpen && typeof onOpen === 'function') {
            onOpen(project.linkSchizzo);
        }
        
        return true;
    }
    
    /**
     * Modifica/Aggiungi link schizzo con prompt
     * 
     * @param {Object} project - Oggetto progetto (verrà modificato direttamente)
     * @param {Object} callbacks - Callbacks { onSave, onRemove, onCancel, notify }
     * @returns {boolean} - true se modificato, false se annullato
     */
    function editLinkSchizzo(project, callbacks = {}) {
        const { onSave, onRemove, onCancel, notify } = callbacks;
        
        if (!project) {
            console.error('📎 Progetto non fornito');
            return false;
        }
        
        const currentLink = project.linkSchizzo || '';
        const newLink = prompt(
            '📎 Link Schizzo Notability\n\n' +
            'Incolla qui il link di condivisione da Notability.\n' +
            'Esempio: https://notability.com/n/xxxx...\n\n' +
            'Lascia vuoto per rimuovere.',
            currentLink
        );
        
        // Se l'utente ha premuto Annulla, newLink è null
        if (newLink === null) {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
            return false;
        }
        
        // Salva il link (anche vuoto per rimuovere)
        const trimmedLink = newLink.trim();
        project.linkSchizzo = trimmedLink;
        
        // Notifica
        const notifyFn = notify || showNotification || showAlert || console.log;
        
        if (trimmedLink) {
            console.log('📎 Link schizzo salvato:', trimmedLink);
            if (typeof notifyFn === 'function') {
                notifyFn('✅ Link schizzo salvato!', 'success');
            }
            if (onSave && typeof onSave === 'function') {
                onSave(trimmedLink);
            }
        } else {
            console.log('📎 Link schizzo rimosso');
            if (typeof notifyFn === 'function') {
                notifyFn('🗑️ Link schizzo rimosso', 'info');
            }
            if (onRemove && typeof onRemove === 'function') {
                onRemove();
            }
        }
        
        return true;
    }
    
    /**
     * Modifica link con modale custom (alternativa a prompt)
     * Per UI più avanzate
     * 
     * @param {Object} project - Oggetto progetto
     * @param {Object} options - Opzioni { container, onSave, onCancel }
     */
    function editLinkModal(project, options = {}) {
        const { container, onSave, onCancel } = options;
        const targetContainer = container || document.body;
        
        const currentLink = project?.linkSchizzo || '';
        
        // Crea modale
        const modalHtml = `
            <div id="notabilityModal" class="notability-modal-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); display: flex; align-items: center;
                justify-content: center; z-index: 10000; backdrop-filter: blur(4px);
            ">
                <div class="notability-modal" style="
                    background: white; border-radius: 16px; padding: 24px;
                    max-width: 500px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                ">
                    <h3 style="margin: 0 0 16px; font-size: 18px; color: #1f2937;">
                        📎 Link Schizzo Notability
                    </h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
                        Incolla il link di condivisione da Notability.<br>
                        <small>Esempio: https://notability.com/n/xxxx...</small>
                    </p>
                    <input type="url" id="notabilityLinkInput" 
                           value="${currentLink}"
                           placeholder="https://notability.com/n/..."
                           style="
                               width: 100%; padding: 12px; border: 2px solid #e5e7eb;
                               border-radius: 8px; font-size: 14px; margin-bottom: 16px;
                               box-sizing: border-box;
                           ">
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="NOTABILITY._closeModal(false)" style="
                            padding: 10px 20px; border: none; border-radius: 8px;
                            background: #e5e7eb; color: #374151; cursor: pointer;
                            font-weight: 600;
                        ">Annulla</button>
                        <button onclick="NOTABILITY._closeModal(true)" style="
                            padding: 10px 20px; border: none; border-radius: 8px;
                            background: linear-gradient(135deg, #10b981, #059669);
                            color: white; cursor: pointer; font-weight: 600;
                        ">💾 Salva</button>
                    </div>
                </div>
            </div>
        `;
        
        // Inserisci modale
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = modalHtml;
        targetContainer.appendChild(modalWrapper.firstElementChild);
        
        // Focus su input
        setTimeout(() => {
            const input = document.getElementById('notabilityLinkInput');
            if (input) input.focus();
        }, 100);
        
        // Salva riferimenti per chiusura
        window._notabilityModalProject = project;
        window._notabilityModalOnSave = onSave;
        window._notabilityModalOnCancel = onCancel;
    }
    
    /**
     * Chiude modale (chiamata internamente)
     * @private
     */
    function _closeModal(save) {
        const modal = document.getElementById('notabilityModal');
        const input = document.getElementById('notabilityLinkInput');
        const project = window._notabilityModalProject;
        const onSave = window._notabilityModalOnSave;
        const onCancel = window._notabilityModalOnCancel;
        
        if (save && project && input) {
            const newLink = input.value.trim();
            project.linkSchizzo = newLink;
            console.log('📎 Link schizzo aggiornato:', newLink);
            
            if (onSave && typeof onSave === 'function') {
                onSave(newLink);
            }
        } else {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
        }
        
        // Rimuovi modale
        if (modal) modal.remove();
        
        // Pulisci riferimenti
        delete window._notabilityModalProject;
        delete window._notabilityModalOnSave;
        delete window._notabilityModalOnCancel;
    }
    
    // ========================================================================
    // RENDER HELPERS
    // ========================================================================
    
    /**
     * Genera HTML per pulsante schizzo
     * 
     * @param {Object} project - Oggetto progetto
     * @param {Object} options - Opzioni { showEditButton, size, style }
     * @returns {string} - HTML del pulsante
     */
    function renderButton(project, options = {}) {
        const { showEditButton = true, size = 'normal', style = '' } = options;
        const has = hasLink(project);
        const projectId = project?.id || '';
        
        const sizeStyles = {
            small: 'padding: 4px 8px; font-size: 12px;',
            normal: 'padding: 8px 16px; font-size: 14px;',
            large: 'padding: 12px 24px; font-size: 16px;'
        };
        
        const btnStyle = sizeStyles[size] || sizeStyles.normal;
        
        let html = `<div class="schizzo-container" style="display: inline-flex; gap: 4px; ${style}">`;
        
        // Pulsante principale
        html += `
            <button class="btn-schizzo ${has ? 'has-schizzo' : 'no-schizzo'}" 
                    onclick="NOTABILITY.openFromId('${projectId}')"
                    style="
                        ${btnStyle}
                        border: none; border-radius: 8px; cursor: pointer;
                        background: ${has ? 'linear-gradient(135deg, #10b981, #059669)' : '#e5e7eb'};
                        color: ${has ? 'white' : '#6b7280'};
                        font-weight: 600;
                    "
                    title="${has ? '📎 Apri schizzo' : '📎 Aggiungi schizzo'}">
                📎 ${has ? 'SCHIZZO' : 'Schizzo'}
            </button>
        `;
        
        // Pulsante modifica (opzionale)
        if (showEditButton) {
            html += `
                <button class="btn-schizzo-edit" 
                        onclick="NOTABILITY.editFromId('${projectId}')"
                        style="
                            padding: 8px; border: none; border-radius: 8px;
                            background: #f3f4f6; cursor: pointer;
                        "
                        title="Modifica link schizzo">
                    ✏️
                </button>
            `;
        }
        
        html += '</div>';
        
        return html;
    }
    
    // ========================================================================
    // HELPER PER INTEGRAZIONE CON DIVERSE APP
    // ========================================================================
    
    /**
     * Apre schizzo cercando progetto per ID
     * Cerca in: window.currentData, state.projects, githubProjects
     * 
     * @param {string} projectId - ID del progetto
     */
    function openFromId(projectId) {
        const project = findProject(projectId);
        if (project) {
            openSchizzo(project);
        } else {
            console.error('📎 Progetto non trovato:', projectId);
        }
    }
    
    /**
     * Modifica schizzo cercando progetto per ID
     * 
     * @param {string} projectId - ID del progetto
     */
    function editFromId(projectId) {
        const project = findProject(projectId);
        if (project) {
            editLinkSchizzo(project, {
                onSave: () => {
                    // Prova a salvare e re-renderizzare
                    if (typeof saveState === 'function') saveState();
                    if (typeof render === 'function') render();
                    if (typeof GITHUB_SYNC !== 'undefined' && GITHUB_SYNC.salvaProgetto) {
                        GITHUB_SYNC.salvaProgetto(project).catch(console.error);
                    }
                }
            });
        } else {
            console.error('📎 Progetto non trovato:', projectId);
        }
    }
    
    /**
     * Trova progetto per ID in tutte le fonti disponibili
     * @private
     */
    function findProject(projectId) {
        // 1. window.currentData (Dashboard)
        if (window.currentData && window.currentData.id === projectId) {
            return window.currentData;
        }
        
        // 2. state.projects (App Rilievo)
        if (typeof state !== 'undefined' && state.projects) {
            const found = state.projects.find(p => p.id === projectId);
            if (found) return found;
        }
        
        // 3. window.githubProjects (Dashboard)
        if (window.githubProjects && Array.isArray(window.githubProjects)) {
            const found = window.githubProjects.find(p => p.id === projectId);
            if (found) return found;
        }
        
        // 4. window.projectData (Dashboard alternativo)
        if (window.projectData && window.projectData.id === projectId) {
            return window.projectData;
        }
        
        return null;
    }
    
    // ========================================================================
    // ESPORTA MODULO
    // ========================================================================
    
    const NOTABILITY = {
        VERSION: NOTABILITY_VERSION,
        
        // Core functions
        open: openSchizzo,
        edit: editLinkSchizzo,
        editModal: editLinkModal,
        
        // Helpers
        hasLink,
        getLink,
        renderButton,
        
        // ID-based (per onclick)
        openFromId,
        editFromId,
        
        // Private (per modale)
        _closeModal
    };
    
    // Esponi globalmente
    window.NOTABILITY = NOTABILITY;
    
    console.log(`✅ Notability Link v${NOTABILITY_VERSION} - Pronto!`);
    console.log('   📌 NOTABILITY.open(project) - Apre schizzo');
    console.log('   📌 NOTABILITY.edit(project) - Modifica link');
    console.log('   📌 NOTABILITY.renderButton(project) - HTML pulsante');
    
})();
