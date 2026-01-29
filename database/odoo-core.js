// ============================================================================
// ODOO-CORE.js v1.0.0 - Modulo Centralizzato Comunicazione Odoo
// ============================================================================
// 
// Usato da: App Rilievo (iPad) + Dashboard (Ufficio) + App Posa
// 
// Funzionalità:
//   - Connessione a Odoo via server API (O.P.E.R.A.)
//   - CRUD Clienti
//   - CRUD Progetti con rilievi (x_studio_dati_rilievo_json)
//   - Cache offline (localStorage)
//   - Gestione conflitti multi-device
//   - Sync automatico quando torna online
//
// Dipendenze:
//   - JSON_MANAGER (opzionale, per normalizzazione dati)
//
// ============================================================================

const ODOO_CORE = (function() {
    'use strict';

    // =========================================================================
    // CONFIGURAZIONE
    // =========================================================================
    
    const CONFIG = {
        // URL del server O.P.E.R.A. (ngrok)
        serverUrl: 'https://jody-gowaned-hypsometrically.ngrok-free.dev',
        
        // Headers per ngrok
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        
        // Timeout chiamate (ms)
        timeout: 15000,
        
        // Prefisso cache localStorage
        cachePrefix: 'odoo_cache_',
        
        // Durata cache (ms) - 24 ore
        cacheTTL: 24 * 60 * 60 * 1000,
        
        // Campo Odoo per rilievo JSON (nome tecnico Studio)
        rilievoField: 'x_studio_dati_rilievo_json'
    };

    // =========================================================================
    // STATO INTERNO
    // =========================================================================
    
    let _isOnline = navigator.onLine;
    let _pendingSync = [];
    let _onSyncCallbacks = [];

    // =========================================================================
    // UTILITY - HTTP
    // =========================================================================

    /**
     * Fetch con timeout e gestione errori
     */
    async function fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...CONFIG.headers, ...options.headers },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Timeout connessione');
            }
            throw error;
        }
    }

    // =========================================================================
    // CACHE OFFLINE
    // =========================================================================

    const Cache = {
        /**
         * Salva in cache
         */
        set(key, data, metadata = {}) {
            try {
                const cacheKey = CONFIG.cachePrefix + key;
                const cacheData = {
                    data,
                    cachedAt: new Date().toISOString(),
                    serverWriteDate: metadata.write_date || null,
                    pendingSync: metadata.pendingSync || false
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                return true;
            } catch (e) {
                console.warn('⚠️ Cache write failed:', e);
                return false;
            }
        },

        /**
         * Legge da cache
         */
        get(key) {
            try {
                const cacheKey = CONFIG.cachePrefix + key;
                const cached = localStorage.getItem(cacheKey);
                if (!cached) return null;
                
                const cacheData = JSON.parse(cached);
                
                // Verifica scadenza (solo se non è pending sync)
                if (!cacheData.pendingSync) {
                    const age = Date.now() - new Date(cacheData.cachedAt).getTime();
                    if (age > CONFIG.cacheTTL) {
                        this.remove(key);
                        return null;
                    }
                }
                
                return cacheData;
            } catch (e) {
                console.warn('⚠️ Cache read failed:', e);
                return null;
            }
        },

        /**
         * Rimuove da cache
         */
        remove(key) {
            try {
                localStorage.removeItem(CONFIG.cachePrefix + key);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Lista tutti i progetti in cache
         */
        listProjects() {
            const projects = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CONFIG.cachePrefix + 'project_')) {
                    const cached = this.get(key.replace(CONFIG.cachePrefix, ''));
                    if (cached) {
                        projects.push({
                            key: key.replace(CONFIG.cachePrefix + 'project_', ''),
                            ...cached
                        });
                    }
                }
            }
            return projects;
        },

        /**
         * Lista progetti con modifiche pending
         */
        getPendingSync() {
            return this.listProjects().filter(p => p.pendingSync);
        },

        /**
         * Pulisci cache scaduta
         */
        cleanup() {
            const now = Date.now();
            let cleaned = 0;
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CONFIG.cachePrefix)) {
                    try {
                        const cached = JSON.parse(localStorage.getItem(key));
                        if (!cached.pendingSync) {
                            const age = now - new Date(cached.cachedAt).getTime();
                            if (age > CONFIG.cacheTTL) {
                                localStorage.removeItem(key);
                                cleaned++;
                            }
                        }
                    } catch (e) {}
                }
            }
            if (cleaned > 0) {
                console.log(`🧹 Cache cleanup: ${cleaned} items removed`);
            }
            return cleaned;
        }
    };

    // =========================================================================
    // API - CLIENTI
    // =========================================================================

    const Clienti = {
        /**
         * Cerca clienti
         * @param {string} query - Testo da cercare
         * @param {number} limit - Max risultati
         */
        async search(query, limit = 20) {
            try {
                const url = `${CONFIG.serverUrl}/api/customers?search=${encodeURIComponent(query)}&limit=${limit}`;
                const data = await fetchWithTimeout(url);
                return data.customers || [];
            } catch (error) {
                console.error('❌ Errore ricerca clienti:', error);
                return [];
            }
        },

        /**
         * Carica singolo cliente
         * @param {number} customerId - ID cliente Odoo
         */
        async get(customerId) {
            try {
                // Prova cache
                const cacheKey = `customer_${customerId}`;
                const cached = Cache.get(cacheKey);
                
                if (!_isOnline && cached) {
                    console.log('📦 Cliente da cache:', customerId);
                    return { ...cached.data, _fromCache: true };
                }
                
                // Fetch da server
                const url = `${CONFIG.serverUrl}/api/customer/${customerId}`;
                const data = await fetchWithTimeout(url);
                
                // Aggiorna cache
                Cache.set(cacheKey, data);
                
                return data;
            } catch (error) {
                console.error('❌ Errore caricamento cliente:', error);
                
                // Fallback cache
                const cached = Cache.get(`customer_${customerId}`);
                if (cached) {
                    console.log('📦 Fallback cache cliente:', customerId);
                    return { ...cached.data, _fromCache: true };
                }
                
                throw error;
            }
        },

        /**
         * Crea nuovo cliente
         * @param {Object} cliente - Dati cliente
         */
        async create(cliente) {
            if (!_isOnline) {
                throw new Error('Impossibile creare cliente offline');
            }
            
            try {
                const url = `${CONFIG.serverUrl}/api/customer`;
                const data = await fetchWithTimeout(url, {
                    method: 'POST',
                    body: JSON.stringify(cliente)
                });
                return data;
            } catch (error) {
                console.error('❌ Errore creazione cliente:', error);
                throw error;
            }
        },

        /**
         * Aggiorna cliente
         * @param {number} customerId - ID cliente
         * @param {Object} updates - Campi da aggiornare
         */
        async update(customerId, updates) {
            if (!_isOnline) {
                throw new Error('Impossibile aggiornare cliente offline');
            }
            
            try {
                const url = `${CONFIG.serverUrl}/api/customer/${customerId}`;
                const data = await fetchWithTimeout(url, {
                    method: 'PUT',
                    body: JSON.stringify(updates)
                });
                
                // Invalida cache
                Cache.remove(`customer_${customerId}`);
                
                return data;
            } catch (error) {
                console.error('❌ Errore aggiornamento cliente:', error);
                throw error;
            }
        }
    };

    // =========================================================================
    // API - PROGETTI
    // =========================================================================

    const Progetti = {
        /**
         * Lista progetti (opzionalmente solo quelli con rilievo)
         * @param {Object} options - { withRilievo: bool, limit: number }
         */
        async list(options = {}) {
            try {
                let url = `${CONFIG.serverUrl}/api/projects?limit=${options.limit || 50}`;
                if (options.withRilievo) url += '&with_rilievo=true';
                
                const data = await fetchWithTimeout(url);
                return data.projects || [];
            } catch (error) {
                console.error('❌ Errore lista progetti:', error);
                return [];
            }
        },

        /**
         * Trova progetti per cliente
         * @param {number} customerId - ID cliente Odoo
         */
        async findByCustomer(customerId) {
            try {
                const url = `${CONFIG.serverUrl}/api/projects/customer/${customerId}`;
                const data = await fetchWithTimeout(url);
                return data.projects || [];
            } catch (error) {
                console.error('❌ Errore ricerca progetti cliente:', error);
                return [];
            }
        },

        /**
         * Carica singolo progetto con rilievo
         * @param {number} projectId - ID progetto Odoo
         * @returns {Object} { data, source: 'server'|'cache', conflict: bool }
         */
        async get(projectId) {
            const cacheKey = `project_${projectId}`;
            
            try {
                // Se offline, usa cache
                if (!_isOnline) {
                    const cached = Cache.get(cacheKey);
                    if (cached) {
                        console.log('📦 Progetto da cache (offline):', projectId);
                        return { 
                            data: cached.data, 
                            source: 'cache', 
                            offline: true,
                            pendingSync: cached.pendingSync 
                        };
                    }
                    throw new Error('Offline e nessuna cache disponibile');
                }
                
                // Fetch da server
                const url = `${CONFIG.serverUrl}/api/project/${projectId}`;
                const serverData = await fetchWithTimeout(url);
                
                // Verifica conflitti con cache
                const cached = Cache.get(cacheKey);
                let conflict = false;
                
                if (cached && cached.pendingSync && cached.serverWriteDate) {
                    // Ho modifiche locali non sincronizzate
                    if (serverData.write_date !== cached.serverWriteDate) {
                        // Server ha versione diversa!
                        conflict = true;
                        console.warn('⚠️ Conflitto rilevato per progetto:', projectId);
                    }
                }
                
                // Aggiorna cache (solo se non c'è conflitto con pending)
                if (!conflict || !cached.pendingSync) {
                    Cache.set(cacheKey, serverData, { write_date: serverData.write_date });
                }
                
                return { 
                    data: serverData, 
                    source: 'server',
                    conflict,
                    localData: conflict ? cached.data : null
                };
                
            } catch (error) {
                console.error('❌ Errore caricamento progetto:', error);
                
                // Fallback cache
                const cached = Cache.get(cacheKey);
                if (cached) {
                    console.log('📦 Fallback cache progetto:', projectId);
                    return { 
                        data: cached.data, 
                        source: 'cache',
                        error: error.message
                    };
                }
                
                throw error;
            }
        },

        /**
         * Carica solo il rilievo JSON di un progetto
         * @param {number} projectId - ID progetto Odoo
         */
        async getRilievo(projectId) {
            try {
                const url = `${CONFIG.serverUrl}/api/project/${projectId}/rilievo`;
                const data = await fetchWithTimeout(url);
                return data.rilievo;
            } catch (error) {
                console.error('❌ Errore caricamento rilievo:', error);
                
                // Fallback cache
                const cached = Cache.get(`project_${projectId}`);
                if (cached && cached.data.rilievo) {
                    return cached.data.rilievo;
                }
                
                throw error;
            }
        },

        /**
         * Salva rilievo su progetto esistente
         * @param {number} projectId - ID progetto Odoo
         * @param {Object} rilievoData - Dati rilievo da salvare
         * @param {Object} options - { force: bool } per forzare anche se conflitto
         */
        async saveRilievo(projectId, rilievoData, options = {}) {
            const cacheKey = `project_${projectId}`;
            
            // Prepara dati (usa JSON_MANAGER se disponibile)
            let dataToSave = rilievoData;
            if (typeof JSON_MANAGER !== 'undefined' && JSON_MANAGER.exportProject) {
                try {
                    dataToSave = JSON_MANAGER.exportProject(rilievoData, { 
                        source: options.source || 'odoo-core' 
                    });
                } catch (e) {
                    console.warn('⚠️ JSON_MANAGER.exportProject fallito, uso dati raw');
                }
            }
            
            // Se offline, salva solo in cache
            if (!_isOnline) {
                console.log('📦 Salvataggio offline in cache:', projectId);
                
                // Recupera write_date esistente
                const cached = Cache.get(cacheKey);
                
                Cache.set(cacheKey, {
                    ...cached?.data,
                    rilievo: dataToSave
                }, {
                    write_date: cached?.serverWriteDate,
                    pendingSync: true
                });
                
                return { 
                    success: true, 
                    offline: true,
                    message: 'Salvato offline, sincronizzerà quando online' 
                };
            }
            
            try {
                // Verifica conflitti (se non force)
                if (!options.force) {
                    const cached = Cache.get(cacheKey);
                    if (cached && cached.serverWriteDate) {
                        // Leggi versione attuale server
                        const serverCheck = await this.get(projectId);
                        if (serverCheck.data.write_date !== cached.serverWriteDate) {
                            return {
                                success: false,
                                conflict: true,
                                serverData: serverCheck.data,
                                localData: dataToSave,
                                message: 'Conflitto: il progetto è stato modificato da un altro dispositivo'
                            };
                        }
                    }
                }
                
                // Salva su server
                const url = `${CONFIG.serverUrl}/api/project/${projectId}/rilievo`;
                const result = await fetchWithTimeout(url, {
                    method: 'POST',
                    body: JSON.stringify(dataToSave)
                });
                
                // Aggiorna cache con nuovo write_date
                const updated = await this.get(projectId);
                
                console.log('✅ Rilievo salvato su Odoo:', projectId);
                
                return {
                    success: true,
                    project_id: projectId,
                    write_date: updated.data.write_date
                };
                
            } catch (error) {
                console.error('❌ Errore salvataggio rilievo:', error);
                
                // Salva in cache come pending
                const cached = Cache.get(cacheKey);
                Cache.set(cacheKey, {
                    ...cached?.data,
                    rilievo: dataToSave
                }, {
                    write_date: cached?.serverWriteDate,
                    pendingSync: true
                });
                
                return {
                    success: false,
                    error: error.message,
                    savedToCache: true,
                    message: 'Errore server, salvato in cache locale'
                };
            }
        },

        /**
         * Crea nuovo progetto Odoo con rilievo
         * @param {Object} projectData - { name, partner_id, rilievo }
         */
        async create(projectData) {
            if (!_isOnline) {
                throw new Error('Impossibile creare progetto offline');
            }
            
            try {
                const url = `${CONFIG.serverUrl}/api/project/create`;
                const result = await fetchWithTimeout(url, {
                    method: 'POST',
                    body: JSON.stringify(projectData)
                });
                
                console.log('✅ Progetto creato:', result.project_id);
                
                return result;
            } catch (error) {
                console.error('❌ Errore creazione progetto:', error);
                throw error;
            }
        }
    };

    // =========================================================================
    // SYNC AUTOMATICO
    // =========================================================================

    const Sync = {
        /**
         * Sincronizza tutte le modifiche pending
         */
        async syncPending() {
            if (!_isOnline) {
                console.log('⏸️ Sync saltato: offline');
                return [];
            }
            
            const pending = Cache.getPendingSync();
            if (pending.length === 0) {
                console.log('✅ Nessuna modifica da sincronizzare');
                return [];
            }
            
            console.log(`🔄 Sincronizzazione ${pending.length} progetti...`);
            
            const results = [];
            
            for (const item of pending) {
                try {
                    const projectId = item.key;
                    const rilievo = item.data?.rilievo;
                    
                    if (!rilievo) continue;
                    
                    const result = await Progetti.saveRilievo(projectId, rilievo, { 
                        force: false,
                        source: 'sync-auto'
                    });
                    
                    results.push({
                        projectId,
                        ...result
                    });
                    
                    if (result.conflict) {
                        console.warn('⚠️ Conflitto durante sync:', projectId);
                    }
                    
                } catch (e) {
                    console.error('❌ Errore sync progetto:', item.key, e);
                    results.push({
                        projectId: item.key,
                        success: false,
                        error: e.message
                    });
                }
            }
            
            // Notifica callbacks
            _onSyncCallbacks.forEach(cb => {
                try { cb(results); } catch (e) {}
            });
            
            return results;
        },

        /**
         * Registra callback per eventi sync
         */
        onSync(callback) {
            _onSyncCallbacks.push(callback);
        },

        /**
         * Verifica stato connessione
         */
        isOnline() {
            return _isOnline;
        },

        /**
         * Forza check online
         */
        async checkConnection() {
            try {
                const response = await fetch(CONFIG.serverUrl, {
                    method: 'GET',
                    headers: CONFIG.headers
                });
                _isOnline = response.ok;
            } catch (e) {
                _isOnline = false;
            }
            return _isOnline;
        }
    };

    // =========================================================================
    // GESTIONE CONFLITTI
    // =========================================================================

    const Conflicts = {
        /**
         * Mostra dialog conflitto e restituisce scelta utente
         * @param {Object} serverData - Dati dal server
         * @param {Object} localData - Dati locali
         * @returns {Promise<'local'|'server'|'cancel'>}
         */
        async showConflictDialog(serverData, localData) {
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.id = 'odoo-conflict-dialog';
                overlay.innerHTML = `
                    <style>
                        #odoo-conflict-dialog {
                            position: fixed;
                            inset: 0;
                            background: rgba(0,0,0,0.6);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 99999;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        }
                        .conflict-box {
                            background: white;
                            border-radius: 12px;
                            padding: 24px;
                            max-width: 500px;
                            width: 90%;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        }
                        .conflict-title {
                            font-size: 18px;
                            font-weight: 600;
                            margin-bottom: 16px;
                            color: #d97706;
                        }
                        .conflict-msg {
                            color: #666;
                            margin-bottom: 20px;
                            line-height: 1.5;
                        }
                        .conflict-info {
                            background: #f3f4f6;
                            padding: 12px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            font-size: 13px;
                        }
                        .conflict-info strong {
                            color: #374151;
                        }
                        .conflict-buttons {
                            display: flex;
                            gap: 12px;
                            flex-wrap: wrap;
                        }
                        .conflict-btn {
                            flex: 1;
                            min-width: 120px;
                            padding: 12px 16px;
                            border: none;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .conflict-btn:hover {
                            transform: translateY(-1px);
                        }
                        .btn-local {
                            background: #3b82f6;
                            color: white;
                        }
                        .btn-server {
                            background: #10b981;
                            color: white;
                        }
                        .btn-cancel {
                            background: #e5e7eb;
                            color: #374151;
                        }
                    </style>
                    <div class="conflict-box">
                        <div class="conflict-title">⚠️ Conflitto Rilevato</div>
                        <div class="conflict-msg">
                            Il progetto è stato modificato su un altro dispositivo.<br>
                            Quale versione vuoi mantenere?
                        </div>
                        <div class="conflict-info">
                            <strong>Server:</strong> ${serverData.write_date || 'N/D'}<br>
                            <strong>Locale:</strong> ${localData._schema?.exportedAt || 'N/D'}
                        </div>
                        <div class="conflict-buttons">
                            <button class="conflict-btn btn-local" data-choice="local">
                                📱 Usa Mia Versione
                            </button>
                            <button class="conflict-btn btn-server" data-choice="server">
                                ☁️ Usa Server
                            </button>
                            <button class="conflict-btn btn-cancel" data-choice="cancel">
                                Annulla
                            </button>
                        </div>
                    </div>
                `;
                
                overlay.querySelectorAll('.conflict-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const choice = btn.dataset.choice;
                        overlay.remove();
                        resolve(choice);
                    });
                });
                
                document.body.appendChild(overlay);
            });
        },

        /**
         * Risolvi conflitto
         * @param {number} projectId 
         * @param {string} choice - 'local'|'server'
         * @param {Object} localData
         * @param {Object} serverData
         */
        async resolve(projectId, choice, localData, serverData) {
            if (choice === 'local') {
                // Forza salvataggio locale
                return await Progetti.saveRilievo(projectId, localData, { force: true });
            } else if (choice === 'server') {
                // Usa versione server, aggiorna cache
                Cache.set(`project_${projectId}`, serverData, {
                    write_date: serverData.write_date,
                    pendingSync: false
                });
                return { success: true, data: serverData };
            }
            return { success: false, cancelled: true };
        }
    };

    // =========================================================================
    // INIZIALIZZAZIONE
    // =========================================================================

    function init(options = {}) {
        // Override config
        if (options.serverUrl) CONFIG.serverUrl = options.serverUrl;
        if (options.timeout) CONFIG.timeout = options.timeout;
        
        // Event listeners online/offline
        window.addEventListener('online', async () => {
            console.log('🌐 Online! Avvio sync...');
            _isOnline = true;
            await Sync.syncPending();
        });
        
        window.addEventListener('offline', () => {
            console.log('📴 Offline');
            _isOnline = false;
        });
        
        // Cleanup cache all'avvio
        Cache.cleanup();
        
        console.log('🔌 ODOO_CORE v1.0.0 inizializzato');
        console.log(`   Server: ${CONFIG.serverUrl}`);
        console.log(`   Online: ${_isOnline}`);
        
        return true;
    }

    // =========================================================================
    // UTILITY PUBBLICHE
    // =========================================================================

    /**
     * Converti cliente Odoo in formato app
     */
    function odooCustomerToApp(odooCustomer) {
        if (!odooCustomer) return null;
        return {
            nome: odooCustomer.name || '',
            telefono: odooCustomer.phone || '',
            email: odooCustomer.email || '',
            indirizzo: odooCustomer.street || '',
            citta: odooCustomer.city || '',
            cap: odooCustomer.zip || '',
            partitaIva: odooCustomer.vat || '',
            odoo_id: odooCustomer.id
        };
    }

    /**
     * Converti cliente app in formato Odoo
     */
    function appCustomerToOdoo(appCustomer) {
        if (!appCustomer) return null;
        return {
            name: appCustomer.nome || appCustomer.ragioneSociale || '',
            phone: appCustomer.telefono || '',
            email: appCustomer.email || '',
            street: appCustomer.indirizzo || appCustomer.via || '',
            city: appCustomer.citta || appCustomer.comune || '',
            zip: appCustomer.cap || '',
            vat: appCustomer.partitaIva || ''
        };
    }

    // =========================================================================
    // FUNZIONE UNIVERSALE - Carica e mostra progetto in QUALSIASI app
    // =========================================================================

    /**
     * Carica progetto da Odoo e lo rende disponibile a qualsiasi app
     * (Dashboard Ufficio, App Rilievo iPad, App Posa)
     * 
     * Triggera evento 'odoo-project-loaded' che ogni app può ascoltare
     * 
     * @param {number} projectId - ID progetto Odoo
     * @returns {Object} progetto caricato
     */
    async function loadAndDisplay(projectId) {
        console.log('🚀 ODOO_CORE.loadAndDisplay:', projectId);
        
        // 1. Carica da Odoo (con gestione cache/conflitti)
        const result = await Progetti.get(projectId);
        
        if (!result.data) {
            throw new Error('Progetto non trovato');
        }
        
        // 2. Gestisci conflitto se presente
        if (result.conflict) {
            const choice = await Conflicts.showConflictDialog(
                result.data,
                result.localData
            );
            
            if (choice === 'cancel') {
                return null;
            }
            
            await Conflicts.resolve(projectId, choice, result.localData, result.data);
            return loadAndDisplay(projectId); // Ricarica
        }
        
        // 3. Prepara progetto
        const rilievo = result.data.rilievo || {};
        const project = {
            // Dati rilievo
            ...rilievo,
            // Assicura ID e nome
            id: rilievo.id || result.data.name,
            name: rilievo.name || result.data.name,
            // Assicura array posizioni
            positions: rilievo.positions || rilievo.posizioni || [],
            posizioni: rilievo.posizioni || rilievo.positions || [],
            // Riferimenti Odoo
            odoo_project_id: result.data.id,
            odoo_customer_id: result.data.partner_id,
            odoo_customer_name: result.data.partner_name,
            // Metadata
            _source: 'odoo',
            _loadedAt: new Date().toISOString(),
            _serverWriteDate: result.data.write_date
        };
        
        // 4. Salva in variabili globali (compatibilità con tutte le app)
        window.currentProject = project;
        window.progettoCorrente = project;
        window._odooLoadedProject = project;
        
        // 5. Carica nella Dashboard/App (metodo testato e funzionante)
        const proj = {
            ...rilievo,
            id: result.data.name,
            rawData: rilievo,
            rilievo: rilievo
        };
        
        // Metodo 1: App Rilievo
        if (typeof window.openProject === 'function') {
            window.openProject(proj);
            console.log('✅ Caricato via openProject (App Rilievo)');
        }
        // Metodo 2: Dashboard Ufficio
        else {
            if (!window.githubProjects) window.githubProjects = [];
            window.githubProjects = [proj, ...window.githubProjects.filter(p => p.id !== proj.id)];
            
            if (typeof window.renderProjectsList === 'function') {
                window.renderProjectsList();
            }
            
            if (typeof window.loadGitHubProject === 'function') {
                window.loadGitHubProject(proj.id);
                console.log('✅ Caricato via loadGitHubProject');
            }
        }
        
        // 6. Triggera evento che le app possono ascoltare
        window.dispatchEvent(new CustomEvent('odoo-project-loaded', {
            detail: { 
                project, 
                source: result.source,
                projectId: result.data.id 
            }
        }));
        
        // 7. Mostra notifica
        showNotification(
            result.source === 'cache' 
                ? '📦 Progetto caricato da cache' 
                : '✅ Progetto caricato da Odoo',
            'success'
        );
        
        console.log('✅ Progetto disponibile:', project.name || project.id);
        
        return project;
    }

    /**
     * Aggiorna campi form con dati progetto (fallback)
     */
    function updateFormFields(project) {
        const cliente = project.cliente || project.clientData || {};
        
        // Nome cliente
        const nomeField = document.getElementById('pm-nome') || 
                         document.getElementById('clienteNome') ||
                         document.querySelector('[name="nome"]');
        if (nomeField) nomeField.value = cliente.nome || project.name || '';
        
        // Telefono
        const telField = document.getElementById('pm-telefono') ||
                        document.getElementById('clienteTelefono');
        if (telField) telField.value = cliente.telefono || '';
        
        // Email
        const emailField = document.getElementById('pm-email') ||
                          document.getElementById('clienteEmail');
        if (emailField) emailField.value = cliente.email || '';
        
        // Indirizzo
        const indField = document.getElementById('pm-indirizzo') ||
                        document.getElementById('clienteIndirizzo');
        if (indField) indField.value = cliente.indirizzo || '';
    }

    /**
     * Notifica semplice
     */
    function showNotification(message, type = 'info') {
        // Prova toast esistente
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // Crea notifica semplice
        const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${colors[type] || colors.info}; color: white;
            padding: 12px 24px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000; font-family: system-ui, sans-serif;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    // =========================================================================
    // EXPORT PUBBLICO
    // =========================================================================

    return {
        // Configurazione
        CONFIG,
        init,
        
        // API Clienti
        clienti: Clienti,
        
        // API Progetti
        progetti: Progetti,
        
        // 🆕 Funzione universale
        loadAndDisplay,
        
        // Sync
        sync: Sync,
        
        // Cache
        cache: Cache,
        
        // Conflitti
        conflicts: Conflicts,
        
        // Utility
        odooCustomerToApp,
        appCustomerToOdoo,
        showNotification,
        
        // Stato
        isOnline: () => _isOnline,
        
        // Versione
        version: '1.1.0'
    };

})();


// =========================================================================
// EXPORT GLOBALE
// =========================================================================

if (typeof window !== 'undefined') {
    window.ODOO_CORE = ODOO_CORE;
    
    // Auto-init se DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ODOO_CORE.init());
    } else {
        ODOO_CORE.init();
    }
    
    console.log('🔌 ODOO_CORE disponibile globalmente');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ODOO_CORE };
}
