// ============================================
// CANTIERI-LINK v1.0.0
// Aggiunge bottone "Stato Cantieri" nella sidebar
// Apre: shared-database/cantieri.html
// ============================================

(function() {
    'use strict';

    const CANTIERI_URL = 'https://openporte2025.github.io/shared-database/cantieri.html';
    const MAX_RETRIES = 10;
    let retries = 0;

    function addCantieriButton() {
        // Evita duplicati
        if (document.getElementById('btn-cantieri-link')) return;

        // Cerca sidebar
        const sidebar = document.querySelector('.sidebar, #sidebar, [class*="sidebar"], .side-panel, #side-panel');
        if (!sidebar) {
            retries++;
            if (retries < MAX_RETRIES) setTimeout(addCantieriButton, 1000);
            return;
        }

        // Crea bottone
        const btn = document.createElement('div');
        btn.id = 'btn-cantieri-link';
        btn.innerHTML = '🏗️ Stato Cantieri';
        btn.style.cssText = [
            'padding: 10px 15px',
            'cursor: pointer',
            'font-weight: 600',
            'font-size: 14px',
            'color: #1e40af',
            'border-top: 1px solid #e2e8f0',
            'margin-top: 8px',
            'transition: background 0.2s'
        ].join(';');

        btn.onmouseenter = function() { btn.style.background = '#eff6ff'; };
        btn.onmouseleave = function() { btn.style.background = ''; };

        btn.onclick = function() {
            var from = encodeURIComponent(window.location.href);
            window.open(CANTIERI_URL + '?from=' + from, '_blank');
        };

        // Inserisci prima di "Impostazioni" o in fondo
        var items = sidebar.querySelectorAll('div, a, button, li');
        var settingsItem = null;
        for (var i = 0; i < items.length; i++) {
            var text = items[i].textContent.trim().toLowerCase();
            if (text === 'impostazioni' || text === 'settings' || text === 'config') {
                settingsItem = items[i];
                break;
            }
        }

        if (settingsItem) {
            sidebar.insertBefore(btn, settingsItem);
        } else {
            sidebar.appendChild(btn);
        }

        console.log('✅ [CANTIERI-LINK] Bottone aggiunto alla sidebar');
    }

    // Avvia dopo caricamento DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addCantieriButton, 1500);
        });
    } else {
        setTimeout(addCantieriButton, 1500);
    }

})();
