/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔄 GITHUB SYNC - Modulo Condiviso per Sincronizzazione Progetti
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * File condiviso tra:
 * - App iPad OpenPorte (rilievo-test)
 * - Dashboard Rilievi (dashboard-test)
 * - Editor Posizione
 * 
 * Hosting: https://openporte2025.github.io/shared-database/github-sync.js
 * 
 * Versione: 1.0.0
 * Data: 21 Gennaio 2026
 * 
 * USO:
 *   await GITHUB_SYNC.salvaProgetto(projectData);
 *   await GITHUB_SYNC.caricaProgetto(projectId);
 *   await GITHUB_SYNC.caricaListaProgetti();
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURAZIONE DEFAULT
    // ═══════════════════════════════════════════════════════════════════════════
    
    const DEFAULT_CONFIG = {
        owner: 'Openporte2025',
        repo: 'dati-cantieri',
        branch: 'main',
        projectsPath: 'progetti',
        token: null,
        lastSync: null,
        debug: false
    };

    // Config attiva (può essere sovrascritta)
    let config = { ...DEFAULT_CONFIG };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 FUNZIONI HELPER
    // ═══════════════════════════════════════════════════════════════════════════
    
    function log(...args) {
        if (config.debug) {
            console.log('[GITHUB_SYNC]', ...args);
        }
    }

    function error(...args) {
        console.error('[GITHUB_SYNC] ❌', ...args);
    }

    /**
     * Codifica contenuto in base64 (supporta UTF-8)
     */
    function encodeBase64(content) {
        try {
            // Metodo moderno
            const encoder = new TextEncoder();
            const data = encoder.encode(content);
            let binary = '';
            data.forEach(byte => binary += String.fromCharCode(byte));
            return btoa(binary);
        } catch (e) {
            // Fallback per browser vecchi
            return btoa(unescape(encodeURIComponent(content)));
        }
    }

    /**
     * Decodifica contenuto da base64 (supporta UTF-8)
     */
    function decodeBase64(base64) {
        try {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (e) {
            // Fallback
            return decodeURIComponent(escape(atob(base64)));
        }
    }

    /**
     * Costruisce URL API GitHub
     */
    function buildApiUrl(path) {
        return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    }

    /**
     * Headers per richieste GitHub
     */
    function getHeaders() {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
        if (config.token) {
            headers['Authorization'] = `token ${config.token}`;
        }
        return headers;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📥 CARICAMENTO PROGETTI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Carica lista progetti da GitHub
     * @returns {Promise<Array>} Lista di {id, nome, filename, url}
     */
    async function caricaListaProgetti() {
        if (!config.token) {
            error('Token non configurato');
            return [];
        }

        log('📥 Caricamento lista progetti...');

        try {
            const url = buildApiUrl(config.projectsPath);
            const response = await fetch(url, {
                headers: getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    log('📭 Cartella progetti vuota o non esistente');
                    return [];
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const files = await response.json();
            
            // Filtra solo file JSON
            const progetti = files
                .filter(f => f.name.endsWith('.json'))
                .map(f => {
                    const match = f.name.match(/progetto-(.+)\.json/);
                    return {
                        id: match ? match[1] : f.name,
                        filename: f.name,
                        path: f.path,
                        sha: f.sha,
                        downloadUrl: f.download_url
                    };
                });

            log(`✅ Trovati ${progetti.length} progetti`);
            return progetti;

        } catch (err) {
            error('Errore caricamento lista:', err.message);
            return [];
        }
    }

    /**
     * Carica un singolo progetto da GitHub
     * @param {string} projectId - ID del progetto (es: "2025P001")
     * @returns {Promise<Object|null>} Dati progetto o null
     */
    async function caricaProgetto(projectId) {
        if (!config.token) {
            error('Token non configurato');
            return null;
        }

        log(`📥 Caricamento progetto: ${projectId}`);

        try {
            const filePath = `${config.projectsPath}/progetto-${projectId}.json`;
            const url = buildApiUrl(filePath);
            
            const response = await fetch(url, {
                headers: getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    log(`📭 Progetto ${projectId} non trovato`);
                    return null;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            const fileData = await response.json();
            const content = decodeBase64(fileData.content);
            const projectData = JSON.parse(content);

            log(`✅ Progetto ${projectId} caricato`);
            
            return {
                ...projectData,
                _github: {
                    sha: fileData.sha,
                    path: filePath,
                    loadedAt: new Date().toISOString()
                }
            };

        } catch (err) {
            error(`Errore caricamento progetto ${projectId}:`, err.message);
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 SALVATAGGIO PROGETTI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Salva un progetto su GitHub
     * @param {Object} projectData - Dati del progetto
     * @param {Object} options - Opzioni {source: 'app'|'dashboard'|'editor'}
     * @returns {Promise<boolean>} true se successo
     */
    async function salvaProgetto(projectData, options = {}) {
        const source = options.source || 'unknown';
        
        // Validazione
        if (!config.token) {
            error('Token non configurato');
            throw new Error('Token GitHub non configurato. Vai in Impostazioni → GitHub.');
        }

        if (!projectData || !projectData.id) {
            error('Dati progetto mancanti o senza ID');
            throw new Error('Dati progetto non validi');
        }

        const projectId = projectData.id;
        const filePath = `${config.projectsPath}/progetto-${projectId}.json`;
        const fileName = `progetto-${projectId}.json`;

        log(`💾 Salvataggio progetto: ${projectId} (source: ${source})`);

        try {
            // 1. Ottieni SHA del file esistente (se esiste)
            const url = buildApiUrl(filePath);
            let sha = null;

            const checkResponse = await fetch(url, {
                headers: getHeaders()
            });

            if (checkResponse.ok) {
                const existing = await checkResponse.json();
                sha = existing.sha;
                log(`📝 File esistente - SHA: ${sha.substring(0, 10)}...`);
            } else if (checkResponse.status === 404) {
                log('📄 Nuovo file - creazione');
            } else {
                log(`⚠️ Check status: ${checkResponse.status}`);
            }

            // 2. Prepara dati da salvare
            const dataToSave = {
                ...projectData,
                _lastSave: {
                    timestamp: new Date().toISOString(),
                    source: source,
                    version: (projectData._lastSave?.version || 0) + 1
                }
            };

            // Aggiungi entry al changelog
            if (!dataToSave.changeLog) dataToSave.changeLog = [];
            dataToSave.changeLog.push({
                version: dataToSave._lastSave.version,
                timestamp: dataToSave._lastSave.timestamp,
                action: `saved_from_${source}`,
                details: `Progetto salvato da ${source}`,
                device: { id: source, name: source === 'app' ? 'App iPad' : source === 'dashboard' ? 'Dashboard Ufficio' : 'Editor' }
            });

            // 3. Codifica contenuto
            const content = JSON.stringify(dataToSave, null, 2);
            const base64Content = encodeBase64(content);

            // 4. Push su GitHub
            const putBody = {
                message: `💾 ${source}: Aggiornato ${fileName}`,
                content: base64Content,
                branch: config.branch
            };

            if (sha) {
                putBody.sha = sha;
            }

            const putResponse = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(putBody)
            });

            // 5. Gestisci conflitto SHA (409)
            if (putResponse.status === 409) {
                log('⚠️ Conflitto SHA - retry...');
                
                const retryCheck = await fetch(url, { headers: getHeaders() });
                if (retryCheck.ok) {
                    const current = await retryCheck.json();
                    putBody.sha = current.sha;
                    
                    const retryPut = await fetch(url, {
                        method: 'PUT',
                        headers: getHeaders(),
                        body: JSON.stringify(putBody)
                    });

                    if (retryPut.ok) {
                        config.lastSync = new Date().toISOString();
                        log(`✅ Progetto ${projectId} salvato (dopo retry)`);
                        return true;
                    } else {
                        const errData = await retryPut.json();
                        throw new Error(errData.message || 'Retry fallito');
                    }
                }
            }

            if (!putResponse.ok) {
                const errData = await putResponse.json();
                throw new Error(errData.message || `HTTP ${putResponse.status}`);
            }

            config.lastSync = new Date().toISOString();
            log(`✅ Progetto ${projectId} salvato con successo`);
            return true;

        } catch (err) {
            error(`Errore salvataggio progetto ${projectId}:`, err.message);
            throw err;
        }
    }

    /**
     * Elimina un progetto da GitHub
     * @param {string} projectId - ID del progetto
     * @returns {Promise<boolean>} true se successo
     */
    async function eliminaProgetto(projectId) {
        if (!config.token) {
            error('Token non configurato');
            return false;
        }

        log(`🗑️ Eliminazione progetto: ${projectId}`);

        try {
            const filePath = `${config.projectsPath}/progetto-${projectId}.json`;
            const url = buildApiUrl(filePath);

            // Ottieni SHA
            const checkResponse = await fetch(url, { headers: getHeaders() });
            
            if (!checkResponse.ok) {
                if (checkResponse.status === 404) {
                    log('📭 Progetto già eliminato o non esistente');
                    return true;
                }
                throw new Error(`HTTP ${checkResponse.status}`);
            }

            const fileData = await checkResponse.json();
            
            // Elimina
            const deleteResponse = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
                body: JSON.stringify({
                    message: `🗑️ Eliminato progetto-${projectId}.json`,
                    sha: fileData.sha,
                    branch: config.branch
                })
            });

            if (!deleteResponse.ok) {
                const errData = await deleteResponse.json();
                throw new Error(errData.message || `HTTP ${deleteResponse.status}`);
            }

            log(`✅ Progetto ${projectId} eliminato`);
            return true;

        } catch (err) {
            error(`Errore eliminazione progetto ${projectId}:`, err.message);
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAZIONE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Imposta configurazione
     * @param {Object} newConfig - Nuova configurazione
     */
    function setConfig(newConfig) {
        config = { ...config, ...newConfig };
        log('⚙️ Config aggiornata:', {
            owner: config.owner,
            repo: config.repo,
            hasToken: !!config.token
        });
    }

    /**
     * Ottiene configurazione corrente
     * @returns {Object} Configurazione (senza token per sicurezza)
     */
    function getConfig() {
        return {
            owner: config.owner,
            repo: config.repo,
            branch: config.branch,
            projectsPath: config.projectsPath,
            hasToken: !!config.token,
            lastSync: config.lastSync
        };
    }

    /**
     * Imposta token GitHub
     * @param {string} token - Token di accesso
     */
    function setToken(token) {
        config.token = token;
        log('🔑 Token configurato');
    }

    /**
     * Verifica se il token è configurato
     * @returns {boolean}
     */
    function hasToken() {
        return !!config.token && config.token.trim() !== '';
    }

    /**
     * Testa connessione GitHub
     * @returns {Promise<boolean>}
     */
    async function testConnection() {
        if (!config.token) {
            return false;
        }

        try {
            const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
            const response = await fetch(url, { headers: getHeaders() });
            return response.ok;
        } catch (err) {
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 EXPORT GLOBALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.GITHUB_SYNC = {
        // Configurazione
        setConfig,
        getConfig,
        setToken,
        hasToken,
        testConnection,
        
        // Operazioni progetti
        caricaListaProgetti,
        caricaProgetto,
        salvaProgetto,
        eliminaProgetto,
        
        // Alias inglesi
        loadProjects: caricaListaProgetti,
        loadProject: caricaProgetto,
        saveProject: salvaProgetto,
        deleteProject: eliminaProgetto,
        
        // Versione
        VERSION: '1.0.0'
    };

    console.log('✅ github-sync.js v1.0.0 caricato - GITHUB_SYNC disponibile');

})();
