// ═══════════════════════════════════════════════════════════════════════════════
// 📱 INPUT NAVIGATION v1.2.0 - Navigazione Fluida Tastiera iPad
// ═══════════════════════════════════════════════════════════════════════════════
// Gestisce Enter/Tab per passare al campo successivo senza chiudere tastiera
// NOTA: Il tocco su altri campi è gestito nativamente dal browser
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_NAVIGATION = {
    VERSION: '1.2.0',
    initialized: false,
    
    init() {
        if (this.initialized) return;
        
        console.log(`📱 INPUT_NAVIGATION v${this.VERSION} inizializzato`);
        
        // Applica attributi a tutti gli input esistenti
        this.applyToAllInputs();
        
        // Osserva nuovi input aggiunti dinamicamente
        this.observeNewInputs();
        
        // Listener globale per Enter/Tab
        document.addEventListener('keydown', this.handleKeydown.bind(this), true);
        
        this.initialized = true;
    },
    
    /**
     * Applica attributi per tastiera iOS ottimizzata
     */
    applyToAllInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => this.enhanceInput(input));
    },
    
    enhanceInput(input) {
        if (input.dataset.navEnhanced) return;
        
        // enterkeyhint="next" mostra "Avanti" su tastiera iOS
        input.setAttribute('enterkeyhint', 'next');
        input.setAttribute('inputmode', 'decimal');
        
        input.dataset.navEnhanced = 'true';
    },
    
    /**
     * Gestisce Enter/Tab per navigazione
     */
    handleKeydown(e) {
        const input = e.target;
        
        if (input.tagName !== 'INPUT') return;
        if (input.type !== 'number') return;
        
        // Enter → passa al prossimo
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            this.focusNextInput(input);
        }
        
        // Tab → passa al prossimo (già nativo ma miglioriamo)
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            this.focusNextInput(input);
        }
        
        // Shift+Tab → torna indietro
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            this.focusPrevInput(input);
        }
    },
    
    focusNextInput(currentInput) {
        const inputs = this.getNavigableInputs();
        const currentIndex = inputs.indexOf(currentInput);
        
        if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            const nextInput = inputs[currentIndex + 1];
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            nextInput.focus();
            nextInput.select();
        } else {
            // Ultimo campo: salva e chiudi
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            currentInput.blur();
        }
    },
    
    focusPrevInput(currentInput) {
        const inputs = this.getNavigableInputs();
        const currentIndex = inputs.indexOf(currentInput);
        
        if (currentIndex > 0) {
            const prevInput = inputs[currentIndex - 1];
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            prevInput.focus();
            prevInput.select();
        }
    },
    
    getNavigableInputs() {
        const allInputs = document.querySelectorAll('input[type="number"]:not([readonly]):not([disabled])');
        return Array.from(allInputs).filter(input => input.offsetParent !== null);
    },
    
    observeNewInputs() {
        const observer = new MutationObserver(() => {
            this.applyToAllInputs();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// Auto-inizializza
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => INPUT_NAVIGATION.init());
} else {
    setTimeout(() => INPUT_NAVIGATION.init(), 100);
}

window.INPUT_NAVIGATION = INPUT_NAVIGATION;
