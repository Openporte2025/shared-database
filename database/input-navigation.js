// ═══════════════════════════════════════════════════════════════════════════════
// 📱 INPUT NAVIGATION v1.1.0 - Navigazione Fluida Tastiera iPad
// ═══════════════════════════════════════════════════════════════════════════════
// PROBLEMA: Su iPad quando tocchi un altro input, fa blur→tastiera chiude→focus→riapre
// SOLUZIONE: Intercetta touchstart e fa focus diretto senza passare per blur
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_NAVIGATION = {
    VERSION: '1.1.0',
    initialized: false,
    lastActiveInput: null,
    
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
        
        // Listener globale per Enter/Tab (capture per intercettare prima)
        document.addEventListener('keydown', this.handleKeydown.bind(this), true);
        
        // 🆕 v1.1.0: Intercetta touchstart sugli input per evitare blur
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), true);
        
        // Track input attivo
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT') {
                this.lastActiveInput = e.target;
            }
        });
        
        this.initialized = true;
    },
    
    /**
     * 🆕 v1.1.0: Gestisce touchstart per prevenire chiusura tastiera
     * Quando tocchi un altro input mentre la tastiera è aperta,
     * facciamo focus diretto senza lasciare che il browser faccia blur
     */
    handleTouchStart(e) {
        const touchedElement = e.target;
        
        // Solo se tocchiamo un input
        if (touchedElement.tagName !== 'INPUT') return;
        
        // Solo se c'è già un input attivo (tastiera aperta)
        if (!this.lastActiveInput) return;
        
        // Se tocchiamo lo stesso input, lascia fare
        if (touchedElement === this.lastActiveInput) return;
        
        // Solo per input numerici
        if (touchedElement.type !== 'number' && touchedElement.type !== 'text') return;
        if (touchedElement.readOnly || touchedElement.disabled) return;
        
        // 🎯 TRUCCO: Preveniamo default e facciamo focus manuale
        // Questo evita il ciclo blur→focus che chiude/riapre tastiera
        e.preventDefault();
        
        // Salva valore del campo precedente (trigger change)
        if (this.lastActiveInput && this.lastActiveInput !== touchedElement) {
            this.lastActiveInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Focus diretto sul nuovo input
        touchedElement.focus();
        
        // Seleziona tutto per sovrascrittura facile
        setTimeout(() => {
            touchedElement.select();
        }, 10);
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
        
        // Solo per input numerici
        const isNumeric = input.type === 'number';
        if (!isNumeric) return;
        
        // Aggiungi attributi per tastiera iOS ottimizzata
        input.setAttribute('enterkeyhint', 'next');
        input.setAttribute('inputmode', 'decimal');
        
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
        if (input.type !== 'number' && input.type !== 'text') return;
        
        // Enter o Tab senza Shift
        if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            e.stopPropagation();
            this.focusNextInput(input);
        }
        
        // Shift+Tab per tornare indietro
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
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
            
            // Salva valore corrente
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Focus diretto
            nextInput.focus();
            setTimeout(() => nextInput.select(), 10);
        } else if (currentIndex === inputs.length - 1) {
            // Ultimo campo: salva e chiudi tastiera
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
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
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            prevInput.focus();
            setTimeout(() => prevInput.select(), 10);
        }
    },
    
    /**
     * Ottiene tutti gli input navigabili visibili
     */
    getNavigableInputs() {
        const allInputs = document.querySelectorAll('input[type="number"]:not([readonly]):not([disabled])');
        return Array.from(allInputs).filter(input => {
            // Escludi nascosti
            return input.offsetParent !== null;
        }).sort((a, b) => {
            // Ordina per tabindex se presente
            const tabA = parseInt(a.tabIndex) || 9999;
            const tabB = parseInt(b.tabIndex) || 9999;
            if (tabA !== tabB) return tabA - tabB;
            
            // Altrimenti per posizione verticale
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            if (Math.abs(rectA.top - rectB.top) > 20) {
                return rectA.top - rectB.top;
            }
            return rectA.left - rectB.left;
        });
    },
    
    /**
     * Osserva nuovi input aggiunti al DOM
     */
    observeNewInputs() {
        const observer = new MutationObserver((mutations) => {
            let hasNewInputs = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'INPUT') hasNewInputs = true;
                        if (node.querySelectorAll?.('input').length > 0) hasNewInputs = true;
                    }
                });
            });
            if (hasNewInputs) {
                this.applyToAllInputs();
            }
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
    setTimeout(() => INPUT_NAVIGATION.init(), 100);
}

window.INPUT_NAVIGATION = INPUT_NAVIGATION;
