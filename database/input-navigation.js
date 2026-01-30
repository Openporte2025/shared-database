// ═══════════════════════════════════════════════════════════════════════════════
// 📱 INPUT NAVIGATION v1.3.0 - Navigazione Fluida Tastiera iPad
// ═══════════════════════════════════════════════════════════════════════════════
// PROBLEMA: render() ricostruisce DOM → perde focus → tastiera chiude
// SOLUZIONE: Intercetta render() e ripristina focus automaticamente
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_NAVIGATION = {
    VERSION: '1.3.0',
    initialized: false,
    activeInputId: null,
    activeInputValue: null,
    selectionStart: null,
    selectionEnd: null,
    
    init() {
        if (this.initialized) return;
        
        console.log(`📱 INPUT_NAVIGATION v${this.VERSION} inizializzato`);
        
        // 🎯 MONKEY-PATCH: Intercetta render() per ripristinare focus
        this.patchRenderFunction();
        
        // Applica attributi a tutti gli input esistenti
        this.applyToAllInputs();
        
        // Osserva nuovi input aggiunti dinamicamente
        this.observeNewInputs();
        
        // Listener globale per Enter/Tab
        document.addEventListener('keydown', this.handleKeydown.bind(this), true);
        
        // Track focus attivo
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
                this.activeInputId = e.target.id;
                this.activeInputValue = e.target.value;
            }
        }, true);
        
        document.addEventListener('focusout', (e) => {
            // Salva selezione prima di perdere focus
            if (e.target.tagName === 'INPUT') {
                this.selectionStart = e.target.selectionStart;
                this.selectionEnd = e.target.selectionEnd;
            }
        }, true);
        
        this.initialized = true;
    },
    
    /**
     * 🎯 Intercetta render() globale per ripristinare focus dopo ricostruzione DOM
     */
    patchRenderFunction() {
        // Aspetta che render() sia definita
        const checkAndPatch = () => {
            if (typeof window.render === 'function' && !window.render._patched) {
                const originalRender = window.render;
                
                window.render = (...args) => {
                    // Salva stato focus PRIMA del render
                    const activeEl = document.activeElement;
                    const wasInput = activeEl && activeEl.tagName === 'INPUT';
                    const inputId = wasInput ? activeEl.id : null;
                    const inputValue = wasInput ? activeEl.value : null;
                    const hadFocus = wasInput && activeEl.type === 'number';
                    
                    // Esegui render originale
                    const result = originalRender.apply(this, args);
                    
                    // Ripristina focus DOPO il render (se era su un input numerico)
                    if (hadFocus && inputId) {
                        requestAnimationFrame(() => {
                            const newInput = document.getElementById(inputId);
                            if (newInput) {
                                newInput.focus();
                                // Metti cursore alla fine
                                const len = newInput.value.length;
                                newInput.setSelectionRange(len, len);
                                console.log(`📱 Focus ripristinato su #${inputId}`);
                            }
                        });
                    }
                    
                    return result;
                };
                
                window.render._patched = true;
                console.log('📱 render() patchata per preservare focus');
            } else if (!window.render) {
                // Riprova tra 100ms
                setTimeout(checkAndPatch, 100);
            }
        };
        
        checkAndPatch();
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
