document.addEventListener('DOMContentLoaded', () => {

    // Inputs
    const bNameIn = document.getElementById('business-name-input');
    const bEmailIn = document.getElementById('business-email-input');
    const cNameIn = document.getElementById('client-name-input');
    const cAddressIn = document.getElementById('client-address-input');
    const invNoIn = document.getElementById('invoice-no-input');
    const invDateIn = document.getElementById('invoice-date-input');
    const dueDateIn = document.getElementById('due-date-input');
    const bankNameIn = document.getElementById('bank-name-input');
    const bankAcctNameIn = document.getElementById('bank-acct-name-input');
    const bankAcctNoIn = document.getElementById('bank-acct-no-input');
    const bankRoutingIn = document.getElementById('bank-routing-input');
    const taxIn = document.getElementById('tax-input');
    const discountIn = document.getElementById('discount-input');
    const currencySelect = document.getElementById('currency-select');
    const notesIn = document.getElementById('notes-input');
    const logoUpload = document.getElementById('logo-upload');
    const themeColorInput = document.getElementById('theme-color-input');
    const fontSelect = document.getElementById('font-select');
    const fontUpload = document.getElementById('font-upload');
    const invoiceThemeSelect = document.getElementById('invoice-theme-select');
    const invoicePreview = document.getElementById('invoice-preview');
    const bPhoneIn = document.getElementById('business-phone-input');

    // Displays
    const bNameDisp = document.getElementById('business-name-display');
    const bEmailDisp = document.getElementById('business-email-display');
    const bPhoneDisp = document.getElementById('business-phone-display');
    const cNameDisp = document.getElementById('client-name-display');
    const cAddressDisp = document.getElementById('client-address-display');
    const invNoDisp = document.getElementById('invoice-no-display');
    const invDateDisp = document.getElementById('invoice-date-display');
    const dueDateDisp = document.getElementById('due-date-display');
    const bankNameDisp = document.getElementById('bank-name-display');
    const bankAcctNameDisp = document.getElementById('bank-acct-name-display');
    const bankAcctNoDisp = document.getElementById('bank-acct-no-display');
    const bankRoutingDisp = document.getElementById('bank-routing-display');
    const routingContainer = document.getElementById('routing-container');
    const paymentInfoContainer = document.getElementById('payment-info-display-container');
    const notesDisp = document.getElementById('notes-display');
    const logoDisp = document.getElementById('logo-display');
    const taxRateDisp = document.getElementById('tax-rate-display');
    const discountRateDisp = document.getElementById('discount-rate-display');
    const discountAmountDisp = document.getElementById('discount-amount-display');
    const discountRow = document.getElementById('discount-row');

    // State
    let items = [
        { desc: 'Web Design Services', qty: 1, rate: 1200 }
    ];

    // Data binding mapper
    const mapInputToDisplay = (input, display) => {
        input.addEventListener('input', () => {
            display.textContent = input.value;
        });
    };

    mapInputToDisplay(bNameIn, bNameDisp);
    mapInputToDisplay(bEmailIn, bEmailDisp);
    mapInputToDisplay(bPhoneIn, bPhoneDisp);
    mapInputToDisplay(cNameIn, cNameDisp);
    mapInputToDisplay(cAddressIn, cAddressDisp);
    mapInputToDisplay(invNoIn, invNoDisp);
    mapInputToDisplay(invDateIn, invDateDisp);
    mapInputToDisplay(dueDateIn, dueDateDisp);
    mapInputToDisplay(notesIn, notesDisp);

    const checkPaymentInfo = () => {
        if (bankNameIn.value || bankAcctNameIn.value || bankAcctNoIn.value) {
            paymentInfoContainer.style.display = 'block';
        } else {
            paymentInfoContainer.style.display = 'none';
        }
        
        if (bankRoutingIn.value) {
            routingContainer.style.display = 'block';
        } else {
            routingContainer.style.display = 'none';
        }
    };

    [bankNameIn, bankAcctNameIn, bankAcctNoIn, bankRoutingIn].forEach(input => {
        mapInputToDisplay(input, document.getElementById(input.id.replace('-input', '-display')));
        input.addEventListener('input', checkPaymentInfo);
    });

    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoDisp.src = event.target.result;
                logoDisp.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            logoDisp.style.display = 'none';
        }
    });

    taxIn.addEventListener('input', () => {
        taxRateDisp.textContent = taxIn.value;
        renderItems();
    });

    discountIn.addEventListener('input', () => {
        discountRateDisp.textContent = discountIn.value;
        renderItems();
    });

    currencySelect.addEventListener('change', () => {
        renderItems();
        if (window.updateProPrice) window.updateProPrice();
    });

    // Items logic
    const itemsContainer = document.getElementById('items-container');
    const invoiceItemsDisplay = document.getElementById('invoice-items-display');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const taxAmountDisplay = document.getElementById('tax-amount-display');
    const totalDisplay = document.getElementById('total-display');

    function renderEditorItems() {
        itemsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
                <input type="text" placeholder="Description" value="${item.desc}" oninput="updateItem(${index}, 'desc', this.value)">
                <input type="number" placeholder="Qty" value="${item.qty}" min="1" oninput="updateItem(${index}, 'qty', this.value)">
                <input type="number" placeholder="Rate" value="${item.rate}" min="0" oninput="updateItem(${index}, 'rate', this.value)">
                <button class="remove-btn" onclick="removeItem(${index})">✕</button>
            `;
            itemsContainer.appendChild(row);
        });
    }

    window.updateItem = (index, field, value) => {
        items[index][field] = field === 'desc' ? value : parseFloat(value) || 0;
        renderItems();
    };

    window.removeItem = (index) => {
        items.splice(index, 1);
        renderEditorItems();
        renderItems();
    };

    document.getElementById('add-item-btn').addEventListener('click', () => {
        items.push({ desc: 'New Item', qty: 1, rate: 0 });
        renderEditorItems();
        renderItems();
    });

    const formatCurr = (val) => {
        const symbol = currencySelect.value;
        return symbol + val.toFixed(2);
    };

    function renderItems() {
        // Render preview table
        invoiceItemsDisplay.innerHTML = '';
        let subtotal = 0;

        items.forEach(item => {
            const amount = item.qty * item.rate;
            subtotal += amount;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-left" style="color: #334155; font-weight: 700;">${item.desc || '-'}</td>
                <td class="text-center" style="color: #475569;">${item.qty}</td>
                <td class="text-center" style="color: #475569;">${formatCurr(item.rate)}</td>
                <td class="text-right" style="color: #334155; font-weight: 600;">${formatCurr(amount)}</td>
            `;
            invoiceItemsDisplay.appendChild(tr);
        });

        // Calculations
        const taxRate = parseFloat(taxIn.value) || 0;
        const discountRate = parseFloat(discountIn.value) || 0;
        
        const discountAmount = subtotal * (discountRate / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const grandTotal = subtotalAfterDiscount + taxAmount;

        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            discountAmountDisp.textContent = '-' + formatCurr(discountAmount);
        } else {
            discountRow.style.display = 'none';
        }

        subtotalDisplay.textContent = formatCurr(subtotal);
        taxAmountDisplay.textContent = formatCurr(taxAmount);
        totalDisplay.textContent = formatCurr(grandTotal);
    }

    // PDF Generation
    document.getElementById('download-btn').addEventListener('click', () => {
        const element = document.getElementById('invoice-preview');
        
        // 1) Cache original state
        const currentScroll = window.scrollY;
        const originalPadding = element.style.padding;
        const originalWidth = element.style.width;
        const originalMaxWidth = element.style.maxWidth;

        // 2) Force strict desktop dimensions for proper A4 PDF rendering
        element.style.padding = '40px';
        element.style.width = '800px';
        element.style.maxWidth = 'none';
        
        // 3) FIX FOR MOBILE "BLANK PDF" BUG: 
        // We must scroll to the very top right before generating, since html2canvas 
        // captures invisible space on mobile layout column stacks.
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const opt = {
            margin:       0,
            filename:     `${invNoIn.value || 'invoice'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollY: 0,
                windowWidth: 800
            },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            // 4) Revert state seamlessly
            element.style.padding = originalPadding;
            element.style.width = originalWidth;
            element.style.maxWidth = originalMaxWidth;
            window.scrollTo({ top: currentScroll, left: 0, behavior: 'instant' });
        });
    });

    // Initial render
    renderEditorItems();
    renderItems();

    // =============== PRO SYSTEM SETTINGS ===============
    // CHANGE THIS VARIABLE TO `true` WHEN YOU WANT TO START CHARGING!
    const ENFORCE_PAYWALL = false; 
    
    // --> PASTE YOUR PAYSTACK PAYMENT LINK HERE:
    const PAYSTACK_PAYMENT_LINK = "https://paystack.com/pay/synergy-pro-upgrade"; 
    
    let isPro = false;

    const upgradeBtn = document.getElementById('upgrade-btn');
    const modal = document.getElementById('upgrade-modal');
    const closeModal = document.querySelector('.close-modal');
    const proPriceDisplay = document.getElementById('pro-price-display');
    const activateProBtn = document.getElementById('activate-pro-btn');
    const watermark = document.getElementById('invoice-watermark');
    const proBadge = document.getElementById('pro-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const proOverlay = document.getElementById('pro-overlay');
    const unlockBrandingBtn = document.getElementById('unlock-branding-btn');
    const brandingLock = document.getElementById('branding-lock');

    const getProPrice = () => {
        const sym = currencySelect.value;
        if (sym === '₦') return '₦2000';
        if (sym === '₹') return '₹200';
        if (sym === '¥') return '¥200';
        if (sym === 'R') return 'R20';
        return sym + '2';
    };

    window.updateProPrice = () => {
        if (modal.style.display === 'flex' && proPriceDisplay.textContent !== "FREE FOR A LIFETIME") {
            proPriceDisplay.textContent = getProPrice() + " / month";
        }
    };

    upgradeBtn.addEventListener('click', () => {
        proPriceDisplay.textContent = getProPrice() + " / month";
        if (!ENFORCE_PAYWALL && !isPro) {
            modalTitle.textContent = "Early Access Bonus!";
            modalDesc.textContent = "You are one of the first 50 users. You get Pro for FREE!";
            proPriceDisplay.textContent = "FREE FOR A LIFETIME";
            activateProBtn.textContent = "Claim Free Pro Account";
        } else if (ENFORCE_PAYWALL && !isPro) {
            modalTitle.textContent = "Upgrade to Synergy Pro";
            modalDesc.textContent = "Remove watermarks, unlock custom themes & fonts, and save clients instantly.";
            activateProBtn.textContent = "Subscribe via Paystack";
        }
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');

    activateProBtn.addEventListener('click', () => {
        if (!ENFORCE_PAYWALL || isPro) {
            isPro = true;
            proBadge.textContent = "PRO";
            proBadge.className = "pro-badge active";
            brandingLock.textContent = "UNLOCKED";
            brandingLock.className = "pro-badge active";
            watermark.style.display = 'none';
            upgradeBtn.style.display = 'none';
            proOverlay.style.display = 'none';
            modal.style.display = 'none';
            alert("Welcome to Synergy Pro! Branding features are unlocked and watermarks removed.");
            renderItems();
        } else {
            // Redirect user to the Paystack Checkout Page
            window.open(PAYSTACK_PAYMENT_LINK, '_blank');
        }
    });

    unlockBrandingBtn.addEventListener('click', () => {
        upgradeBtn.click();
    });

    themeColorInput.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });

    fontSelect.addEventListener('change', (e) => {
        invoicePreview.style.fontFamily = `"${e.target.value}", sans-serif`;
    });

    invoiceThemeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'dark') {
            invoicePreview.classList.add('dark-mode');
            document.querySelector('.preview-wrapper').style.background = '#121212';
        } else {
            invoicePreview.classList.remove('dark-mode');
            document.querySelector('.preview-wrapper').style.background = '#ffffff';
        }
    });

    fontUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fontUrl = URL.createObjectURL(file);
            const fontName = 'CustomUserFont_' + Date.now();
            const newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode(`
                @font-face {
                    font-family: '${fontName}';
                    src: url('${fontUrl}');
                }
            `));
            document.head.appendChild(newStyle);
            invoicePreview.style.fontFamily = `"${fontName}", sans-serif`;
            // Uncheck the dropdown to indicate custom font is active
            fontSelect.value = ""; 
        }
    });

    // =============== AI DICTATION FEATURE ===============
    const dictateBtn = document.getElementById('ai-dictate-btn');
    let activeInput = null;

    // Track the last focused input/textarea so we know where to inject the speech
    document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            activeInput = e.target;
        }
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        let isListening = false;

        dictateBtn.addEventListener('click', () => {
            if (!activeInput) {
                alert("Please tap directly inside a text box first (like Description or Notes), then tap the microphone to speak!");
                return;
            }

            if (isListening) {
                recognition.stop();
                return;
            }

            try {
                recognition.start();
                dictateBtn.classList.add('listening');
                isListening = true;
            } catch(err) {
                console.error("Speech error", err);
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (activeInput) {
                // Append text with space if it's not empty, otherwise just replace
                if (activeInput.value && activeInput.value.trim() !== '') {
                    activeInput.value += ' ' + transcript + (activeInput.tagName==='TEXTAREA'?'\n':'');
                } else {
                    activeInput.value = transcript;
                }
                // Dynamically trigger the live preview update
                activeInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };

        recognition.onend = () => {
            dictateBtn.classList.remove('listening');
            isListening = false;
        };

        recognition.onerror = (event) => {
            dictateBtn.classList.remove('listening');
            isListening = false;
            if(event.error === 'not-allowed') {
               alert("Microphone access was denied. Please allow microphone permissions in your browser.");
            }
        };

    } else {
        // Browser doesn't support the Voice API
        dictateBtn.style.display = 'none';
    }

});
