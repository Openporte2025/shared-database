// ═══════════════════════════════════════════════════════════════════════════════
// 📱 INPUT NAVIGATION v1.0.0 - Navigazione Fluida Tastiera iPad
// ═══════════════════════════════════════════════════════════════════════════════
// Centralizza la gestione della navigazione tra input su dispositivi touch
// - Enter/Tab → passa al campo successivo senza chiudere tastiera
// - enterkeyhint="next" per mostrare "Avanti" su tastiera iOS
// - Auto-inizializza su tutti gli input presenti e futuri
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_NAVIGATION = {
    VERSION: '1.0.0',
    initialized: false,
    
    /**
     * Inizializza la navigazione su tutti gli input
     */
    init() {
        if (this.initialized) return;
        
        console.log(`📱 INPUT_NAVIGATION v${this.VERSION} inizializzato`);
        
        // Applica a tutti gli input esistenti
        this.applyToAllInputs();
        
        // Osserva nuovi input aggiunti dinamicamente
        this.observeNewInputs();
        
        // Listener globale per Enter
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        this.initialized = true;
    },
    
    /**
     * Applica attributi e comportamenti a tutti gli input number
     */
    applyToAllInputs() {
        const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => this.enhanceInput(input));
    },
    
    /**
     * Migliora un singolo input con attributi per iPad
     */
    enhanceInput(input) {
        // Salta se già processato
        if (input.dataset.navEnhanced) return;
        
        // Solo per input numerici o di misure
        const isNumeric = input.type === 'number';
        const isMeasure = input.placeholder?.includes('0') || 
                         input.className?.includes('measure') ||
                         input.id?.includes('brm') ||
                         input.id?.includes('hsoff') ||
                         input.id?.includes('hparap');
        
        if (!isNumeric && !isMeasure) return;
        
        // Aggiungi attributi per tastiera iOS ottimizzata
        input.setAttribute('enterkeyhint', 'next');
        
        // inputmode numeric per tastiera numerica su iOS
        if (isNumeric) {
            input.setAttribute('inputmode', 'numeric');
        }
        
        // Marca come processato
        input.dataset.navEnhanced = 'true';
    },
    
    /**
     * Gestisce pressione tasti Enter/Tab
     */
    handleKeydown(e) {
        const input = e.target;
        
        // Solo per input
        if (input.tagName !== 'INPUT') return;
        
        // Enter o Tab senza Shift
        if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            this.focusNextInput(input);
        }
        
        // Shift+Tab per tornare indietro
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            this.focusPrevInput(input);
        }
    },
    
    /**
     * Trova e focalizza il prossimo input
     */
    focusNextInput(currentInput) {
        const inputs = this.getNavigableInputs();
        const currentIndex = inputs.indexOf(currentInput);
        
        if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            const nextInput = inputs[currentIndex + 1];
            this.focusInput(nextInput);
        } else if (currentIndex === inputs.length - 1) {
            // Ultimo campo: blur per chiudere tastiera
            currentInput.blur();
        }
    },
    
    /**
     * Trova e focalizza l'input precedente
     */
    focusPrevInput(currentInput) {
        const inputs = this.getNavigableInputs();
        const currentIndex = inputs.indexOf(currentInput);
        
        if (currentIndex > 0) {
            const prevInput = inputs[currentIndex - 1];
            this.focusInput(prevInput);
        }
    },
    
    /**
     * Ottiene tutti gli input navigabili visibili
     */
    getNavigableInputs() {
        const allInputs = document.querySelectorAll('input[type="number"], input[type="text"], select');
        return Array.from(allInputs).filter(input => {
            // Escludi nascosti e readonly
            if (input.offsetParent === null) return false;
            if (input.readOnly || input.disabled) return false;
            if (input.type === 'hidden') return false;
            
            // Priorità a input con tabindex
            return true;
        }).sort((a, b) => {
            // Ordina per tabindex se presente
            const tabA = parseInt(a.tabIndex) || 9999;
            const tabB = parseInt(b.tabIndex) || 9999;
            if (tabA !== tabB) return tabA - tabB;
            
            // Altrimenti ordina per posizione DOM
            return 0;
        });
    },
    
    /**
     * Focalizza un input mantenendo tastiera aperta
     */
    focusInput(input) {
        // Trigger blur event per salvare valore precedente
        if (document.activeElement && document.activeElement !== input) {
            document.activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Focus immediato per non far chiudere tastiera
        input.focus();
        
        // Seleziona tutto il testo per sovrascrittura facile
        if (input.type === 'number' || input.type === 'text') {
            input.select();
        }
    },
    
    /**
     * Osserva nuovi input aggiunti al DOM
     */
    observeNewInputs() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        // Cerca input nel nodo aggiunto
                        if (node.tagName === 'INPUT') {
                            this.enhanceInput(node);
                        }
                        // Cerca input nei figli
                        const inputs = node.querySelectorAll?.('input[type="number"], input[type="text"]');
                        inputs?.forEach(input => this.enhanceInput(input));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// Auto-inizializza quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => INPUT_NAVIGATION.init());
} else {
    // DOM già caricato
    setTimeout(() => INPUT_NAVIGATION.init(), 100);
}

// Esporta per uso globale
window.INPUT_NAVIGATION = INPUT_NAVIGATION;
