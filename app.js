document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.classList.add('splash-hidden');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    }, 2000);

    // GLOBAL VISITOR TRACKER - Standard Free-Tier
    // Using CounterAPI.dev (Community Free, Scalable, Reliable)
    const trackVisitor = async () => {
        const sessionKey = 'synergy_session_tracked';
        const hasTracked = sessionStorage.getItem(sessionKey);
        
        if (!hasTracked) {
            try {
                // Tracking visit for Synergy Invoice App - Live Global Key
                await fetch('https://api.counterapi.dev/v1/synergy_v1_live/global_visits/up');
                sessionStorage.setItem(sessionKey, 'true');
            } catch (err) {
                console.warn("Tracking failed, system bypassed.");
            }
        }
    };
    trackVisitor();


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
    const shippingIn = document.getElementById('shipping-input');
    const currencySelect = document.getElementById('currency-select');
    const notesIn = document.getElementById('notes-input');
    const logoUpload = document.getElementById('logo-upload');
    const themeColorInput = document.getElementById('theme-color-input');
    const fontSelect = document.getElementById('font-select');
    const fontUpload = document.getElementById('font-upload');
    const invoiceThemeSelect = document.getElementById('invoice-theme-select');
    const invoicePreview = document.getElementById('invoice-preview');
    const bPhoneIn = document.getElementById('business-phone-input');
    const goldToggle = document.getElementById('gold-border-toggle');
    const sigUpload = document.getElementById('signature-upload');

    // New Business Features Inputs
    const docTypeSelect = document.getElementById('doc-type-select');
    const paymentLinkIn = document.getElementById('payment-link-input');
    const crmClientSel = document.getElementById('crm-client-select');
    const saveClientBtn = document.getElementById('save-client-btn');
    const templateLibSel = document.getElementById('template-library-select');
    const saveTemplateBtn = document.getElementById('save-template-btn');

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
    const shippingAmountDisp = document.getElementById('shipping-amount-display');
    const shippingRow = document.getElementById('shipping-row');
    
    // New Business Features Displays
    const invoiceTitleDisp = document.getElementById('invoice-title-display');
    const totalLabelDisp = document.getElementById('total-label-display');
    const paymentLinkDisp = document.getElementById('payment-link-display');
    const paymentLinkCont = document.getElementById('payment-link-display-container');

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

    // Document Type Logic
    docTypeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'QUOTE') {
            invoiceTitleDisp.textContent = 'QUOTE / ESTIMATE';
            totalLabelDisp.textContent = 'Estimated Total:';
        } else if (val === 'RECEIPT') {
            invoiceTitleDisp.textContent = 'RECEIPT';
            totalLabelDisp.textContent = 'Amount Paid:';
        } else {
            invoiceTitleDisp.textContent = 'INVOICE';
            totalLabelDisp.textContent = 'Total Due:';
        }
    });

    // Payment Link Logic
    paymentLinkIn.addEventListener('input', (e) => {
        if(e.target.value.trim() !== '') {
            paymentLinkDisp.href = e.target.value;
            paymentLinkCont.style.display = 'block';
        } else {
            paymentLinkCont.style.display = 'none';
        }
    });

    // CRM Client System
    const loadCrmClients = () => {
        const clients = JSON.parse(localStorage.getItem('synergyCrmClients') || '[]');
        crmClientSel.innerHTML = '<option value="">Load Saved Client...</option>';
        clients.forEach((c, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = c.name;
            crmClientSel.appendChild(opt);
        });
    };
    loadCrmClients();

    saveClientBtn.addEventListener('click', () => {
        const name = cNameIn.value.trim();
        const address = cAddressIn.value.trim();
        if(name === '') return alert("Please enter a client name first.");
        const clients = JSON.parse(localStorage.getItem('synergyCrmClients') || '[]');
        const existingCode = clients.findIndex(c => c.name === name);
        if(existingCode !== -1) {
            clients[existingCode].address = address; // Update existing
        } else {
            clients.push({ name, address });
        }
        localStorage.setItem('synergyCrmClients', JSON.stringify(clients));
        alert("Client saved to browser memory securely!");
        loadCrmClients();
        crmClientSel.value = existingCode !== -1 ? existingCode : clients.length - 1;
    });

    crmClientSel.addEventListener('change', (e) => {
        if(e.target.value === '') return;
        const clients = JSON.parse(localStorage.getItem('synergyCrmClients') || '[]');
        const client = clients[e.target.value];
        if(client) {
            cNameIn.value = client.name;
            cAddressIn.value = client.address;
            cNameDisp.textContent = client.name;
            cAddressDisp.textContent = client.address;
        }
    });

    // Templates Library
    const loadTemplates = () => {
        const templates = JSON.parse(localStorage.getItem('synergyTemplates') || '[]');
        templateLibSel.innerHTML = '<option value="">Load Saved Draft...</option>';
        templates.forEach((t, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = t.templateName;
            templateLibSel.appendChild(opt);
        });
    };
    loadTemplates();

    saveTemplateBtn.addEventListener('click', () => {
        const templateName = prompt("Enter a name for this template (e.g. 'Monthly Retainer'):");
        if(!templateName) return;
        
        const templateData = {
            templateName,
            businessName: bNameIn.value,
            businessEmail: bEmailIn.value,
            businessPhone: bPhoneIn.value,
            notes: notesIn.value,
            terms: document.getElementById('terms-input').value,
            tax: taxIn.value,
            discount: discountIn.value,
            shipping: shippingIn.value,
            currency: currencySelect.value,
            bankName: bankNameIn.value,
            bankAcctName: bankAcctNameIn.value,
            bankAcctNo: bankAcctNoIn.value,
            bankRouting: bankRoutingIn.value,
            paymentLink: paymentLinkIn.value,
            items: [...items]
        };

        const templates = JSON.parse(localStorage.getItem('synergyTemplates') || '[]');
        templates.push(templateData);
        localStorage.setItem('synergyTemplates', JSON.stringify(templates));
        alert("Template saved locally!");
        loadTemplates();
        templateLibSel.value = templates.length - 1;
    });

    templateLibSel.addEventListener('change', (e) => {
        if(e.target.value === '') return;
        const templates = JSON.parse(localStorage.getItem('synergyTemplates') || '[]');
        const t = templates[e.target.value];
        if(t) {
            bNameIn.value = t.businessName || '';
            bEmailIn.value = t.businessEmail || '';
            bPhoneIn.value = t.businessPhone || '';
            notesIn.value = t.notes || '';
            document.getElementById('terms-input').value = t.terms || '';
            taxIn.value = t.tax || 0;
            discountIn.value = t.discount || 0;
            shippingIn.value = t.shipping || 0;
            currencySelect.value = t.currency || '$';
            bankNameIn.value = t.bankName || '';
            bankAcctNameIn.value = t.bankAcctName || '';
            bankAcctNoIn.value = t.bankAcctNo || '';
            bankRoutingIn.value = t.bankRouting || '';
            paymentLinkIn.value = t.paymentLink || '';
            
            // Trigger explicit updates for displays
            [bNameIn, bEmailIn, bPhoneIn, notesIn, bankNameIn, bankAcctNameIn, bankAcctNoIn, bankRoutingIn].forEach(input => {
                input.dispatchEvent(new Event('input'));
            });
            document.getElementById('terms-display').textContent = document.getElementById('terms-input').value;
            paymentLinkIn.dispatchEvent(new Event('input'));
            taxIn.dispatchEvent(new Event('input'));
            
            items = t.items ? [...t.items] : [];
            renderEditorItems();
            renderItems();
        }
    });

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

    goldToggle.addEventListener('change', (e) => {
        if(e.target.checked) invoicePreview.classList.add('gold-edges');
        else invoicePreview.classList.remove('gold-edges');
    });

    sigUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('signature-display').src = ev.target.result;
                document.getElementById('signature-display').style.display = 'block';
                document.getElementById('signature-line').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
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

    shippingIn.addEventListener('input', () => {
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
        // Format the number with thousand separators (commas) and exactly 2 decimal places
        return symbol + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Template Engine Logic
    const templateSelect = document.getElementById('template-select');
    const customTemplateGroup = document.getElementById('custom-template-upload-group');
    const templateUpload = document.getElementById('template-upload');

    templateSelect.addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        
        if (selected.classList.contains('pro-option') && !isPro) {
            e.target.value = 'standard';
            document.getElementById('upgrade-btn').click();
            return;
        }

        if (e.target.value === 'custom') {
            customTemplateGroup.style.display = 'block';
        } else {
            customTemplateGroup.style.display = 'none';
            invoicePreview.style.backgroundImage = 'none';
        }

        invoicePreview.className = invoicePreview.className.replace(/\b[a-z]+-template\b/g, '');
        invoicePreview.classList.add(`${e.target.value}-template`);
    });

    templateUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                invoicePreview.style.backgroundImage = `url(${ev.target.result})`;
                invoicePreview.style.backgroundSize = 'cover';
                invoicePreview.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file);
        }
    });

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
        const shippingFee = parseFloat(shippingIn.value) || 0;
        
        const discountAmount = subtotal * (discountRate / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const grandTotal = subtotalAfterDiscount + taxAmount + shippingFee;

        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            discountAmountDisp.textContent = '-' + formatCurr(discountAmount);
        } else {
            discountRow.style.display = 'none';
        }

        if (shippingFee > 0) {
            shippingRow.style.display = 'flex';
            shippingAmountDisp.textContent = formatCurr(shippingFee);
        } else {
            shippingRow.style.display = 'none';
        }

        subtotalDisplay.textContent = formatCurr(subtotal);
        taxAmountDisplay.textContent = formatCurr(taxAmount);
        totalDisplay.textContent = formatCurr(grandTotal);
    }

    // Force sync all displays with their input values (critical for PDF capture)
    function forceSyncPreview() {
        // Text Fields
        bNameDisp.textContent = bNameIn.value;
        bEmailDisp.textContent = bEmailIn.value;
        bPhoneDisp.textContent = bPhoneIn.value;
        cNameDisp.textContent = cNameIn.value;
        cAddressDisp.textContent = cAddressIn.value;
        invNoDisp.textContent = invNoIn.value;
        invDateDisp.textContent = invDateIn.value;
        dueDateDisp.textContent = dueDateIn.value;
        notesDisp.textContent = notesIn.value;
        taxRateDisp.textContent = taxIn.value;
        discountRateDisp.textContent = discountIn.value;
        
        // Banking & Payment
        bankNameDisp.textContent = bankNameIn.value;
        bankAcctNameDisp.textContent = bankAcctNameIn.value;
        bankAcctNoDisp.textContent = bankAcctNoIn.value;
        bankRoutingDisp.textContent = bankRoutingIn.value;
        
        // Terms
        document.getElementById('terms-display').textContent = document.getElementById('terms-input').value;
        
        // Items & Calculations
        renderItems();
        checkPaymentInfo();
        
        // Payment Link
        if(paymentLinkIn.value.trim() !== '') {
            paymentLinkDisp.href = paymentLinkIn.value;
            paymentLinkCont.style.display = 'block';
        } else {
            paymentLinkCont.style.display = 'none';
        }
    }

    // PDF Generation
    document.getElementById('download-btn').addEventListener('click', async () => {
        const btn = document.getElementById('download-btn');
        btn.textContent = "Processing...";
        btn.disabled = true;

        // Force a full UI sync to ensure PDF has latest data
        forceSyncPreview();

        const clientSafeName = cNameIn.value.trim() ? '_' + cNameIn.value.trim().replace(/[^a-zA-Z0-9]/g, '_') : '';
        const desiredFilename = `${invNoIn.value || 'Invoice'}${clientSafeName}`;
        
        const oldTitle = document.title;
        document.title = desiredFilename; // Helps natively suggest the filename!

        alert("To ensure your clients can perfectly copy text and Bank Accounts directly from the PDF, this app now uses your device's native PDF engine!\n\nWhen the screen appears, simply select 'Save as PDF' (or Print).");
        
        // Let the CSS @media print handle the flawless vector rendering
        setTimeout(() => {
            window.print();
            document.title = oldTitle;
            btn.textContent = "Generate PDF";
            btn.disabled = false;
            
            // Post-Download Action Trigger
            setTimeout(() => {
                if (confirm("PDF Downloaded! Would you like to send this to the Client via Email now?")) {
                    document.getElementById('email-btn').click();
                }
            }, 1000);
        }, 800);
    });

    function getInvoiceEmailContent() {
        const cEmail = document.getElementById('client-email-input').value.trim();
        const docName = document.getElementById('doc-type-select').options[document.getElementById('doc-type-select').selectedIndex].text;
        const bName = document.getElementById('business-name-input').value.trim() || 'My Business';
        const num = invNoIn.value.trim() || '001';
        const link = document.getElementById('payment-link-input').value.trim();
        const totalAmountText = document.getElementById('total-amount').textContent;
        const cName = cNameIn.value.trim() || 'Customer';

        const subject = `${docName} ${num} from ${bName}`;
        let body = `Hi ${cName},\n\n`;
        body += `*** IMPORTANT: PLEASE ATTACH THE PDF YOU JUST DOWNLOADED TO THIS EMAIL BEFORE SENDING ***\n\n`;
        body += `Please find the details for ${docName} #${num} below.\n\n`;
        body += `Amount Due: ${totalAmountText}\n`;
        if (link) {
            body += `\nYou can easily complete your payment online using this link:\n${link}\n`;
        }
        body += `\nLooking forward to doing business!\n\nBest Regards,\n${bName}`;

        return { email: cEmail, subject, body, cName, link };
    }

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
    const brandingLock = document.getElementById('branding-lock');

    // Intercept Premium Element Interactions natively without masking UI view
    document.querySelectorAll('.pro-input').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            if (!isPro) {
                e.preventDefault();
                upgradeBtn.click();
            }
        });
        el.addEventListener('click', (e) => {
            if (!isPro) {
                e.preventDefault();
            }
        });
    });

    let localProPrice = '$2';

    // Dynamic Regional Bank List Module
    const fetchBanks = async (countryCode) => {
        const bankListEl = document.getElementById('bank-list');
        if (!bankListEl) return;

        // User Requested Nigerian Banks - High Priority Fallback
        const NIGERIAN_BANKS_TOP = ["Opay", "PalmPay", "Kuda Bank", "Moniepoint", "Access Bank", "Zenith Bank", "United Bank for Africa (UBA)", "First Bank of Nigeria", "GTBank", "Fidelity Bank", "Wema Bank", "Stanbic IBTC", "Sterling Bank", "Union Bank", "Polaris Bank"];
        
        let banks = [];
        try {
            if (countryCode === 'NG') {
                // Try fetching live list, fallback to hardcoded top banks if it takes too long
                const res = await fetch('https://api.paystack.co/bank');
                const data = await res.json();
                const liveBanks = data.data.map(b => b.name);
                // Merge and remove duplicates
                banks = [...new Set([...NIGERIAN_BANKS_TOP, ...liveBanks])];
            } else {
                // Global Major Banks Fallback
                banks = ["Chase Bank", "Bank of America", "HSBC", "Barclays", "Standard Chartered", "Citibank", "Wells Fargo", "Goldman Sachs", "Lloyds Bank", "Deutsche Bank", "UBS", "Santander"];
            }
            
            bankListEl.innerHTML = '';
            banks.sort().forEach(bankName => {
                const opt = document.createElement('option');
                opt.value = bankName;
                bankListEl.appendChild(opt);
            });
        } catch (err) {
            console.warn("Live Bank list fetch failed, using manual top list.");
            if (countryCode === 'NG') {
                bankListEl.innerHTML = '';
                NIGERIAN_BANKS_TOP.sort().forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b;
                    bankListEl.appendChild(opt);
                });
            }
        }
    };

    // Geolocation Pricing & Regional Data Module
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const country = data.country_code || 'NG'; // DEFAULT TO NIGERIA for this app
            
            // 1. Pricing Logic
            if (country === 'NG') localProPrice = '₦2,500';
            else if (country === 'GB') localProPrice = '£2';
            else if (data.currency === 'EUR') localProPrice = '€2';
            else localProPrice = '$2';
            
            if (proPriceDisplay.textContent !== "FREE FOR A LIFETIME") {
                proPriceDisplay.textContent = localProPrice + " / month";
            }

            // 2. Bank List Logic
            fetchBanks(country);

        }).catch(() => {
            console.error("Geolocation bypassed, defaulting to Nigeria.");
            fetchBanks('NG'); // DEFAULT TO NIGERIA
        });

    window.updateProPrice = () => {
        if (modal.style.display === 'flex' && proPriceDisplay.textContent !== "FREE FOR A LIFETIME") {
            proPriceDisplay.textContent = localProPrice + " / month";
        }
    };

    upgradeBtn.addEventListener('click', () => {
        proPriceDisplay.textContent = localProPrice + " / month";
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
            // proOverlay removed intentionally, Pro unlocked
            modal.style.display = 'none';
            alert("Welcome to Synergy Pro! Branding features are unlocked and watermarks removed.");
            renderItems();
        } else {
            // Redirect user to the Paystack Checkout Page
            window.open(PAYSTACK_PAYMENT_LINK, '_blank');
        }
    });

    // Old branding button logic removed

    document.getElementById('notes-input').addEventListener('input', (e) => {
        document.getElementById('notes-display').textContent = e.target.value;
    });
    
    document.getElementById('terms-input').addEventListener('input', (e) => {
        document.getElementById('terms-display').textContent = e.target.value;
    });

    themeColorInput.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });

    fontSelect.addEventListener('change', (e) => {
        invoicePreview.style.fontFamily = `"${e.target.value}", sans-serif`;
    });

    invoiceThemeSelect.addEventListener('change', (e) => {
        invoicePreview.classList.remove('dark-mode', 'blue-mode', 'gold-mode');
        if (e.target.value === 'dark') {
            invoicePreview.classList.add('dark-mode');
            document.querySelector('.preview-wrapper').style.background = '#121212';
        } else if (e.target.value === 'blue') {
            invoicePreview.classList.add('blue-mode');
            document.querySelector('.preview-wrapper').style.background = '#0a1326';
        } else if (e.target.value === 'gold') {
            invoicePreview.classList.add('gold-mode');
            document.querySelector('.preview-wrapper').style.background = '#2e220b';
        } else {
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

    // =============== SPONSORED ADVERTS MODULE ===============
    const adsToggle = document.getElementById('ads-toggle');
    const adContainer = document.getElementById('sponsored-ad-container');
    const closeAdBtn = document.getElementById('close-ad-btn');
    const adContentWrapper = document.getElementById('ad-content-wrapper');

    const sampleAds = [
        '<div style="text-align:center; padding:20px; color:#f8fafc; font-family:\'Playfair Display\', serif;"><h4>Proverbs 16:3</h4><p style="font-size:0.85rem; margin-top:10px; color:#cbd5e1;">"Commit your work to the Lord, and your plans will be established."</p><p style="margin-top:15px; font-weight:bold; color:#10b981; font-family:\'Inter\', sans-serif;">Ethical Business Consultation</p></div>',
        '<div style="text-align:center; padding:20px; color:#f8fafc;"><h4>Empower Your Mission</h4><p style="font-size:0.85rem; margin-top:10px; color:#cbd5e1;">Grow your kingdom impact with cleanly integrated digital tools.</p><button style="margin-top:15px; padding:6px 15px; border-radius:4px; background:#6366f1; border:none; color:white; cursor:pointer;" onclick="alert(\'This would open the partner website!\')">Learn More</button></div>',
        '<div style="text-align:center; padding:20px; color:#f8fafc; font-family:\'Playfair Display\', serif;"><h4>Colossians 3:23</h4><p style="font-size:0.85rem; margin-top:10px; color:#cbd5e1;">"Whatever you do, work at it with all your heart, as working for the Lord..."</p><p style="margin-top:15px; font-weight:bold; color:#f59e0b; font-family:\'Inter\', sans-serif;">Kingdom Builders Network</p></div>'
    ];

    let adInterval;

    function showAd() {
        if (!adsToggle || !adsToggle.checked) return;
        const adHtml = sampleAds[Math.floor(Math.random() * sampleAds.length)];
        adContentWrapper.innerHTML = adHtml;
        adContainer.classList.remove('ad-slide-out');
    }

    if (adsToggle) {
        adsToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                setTimeout(showAd, 500); // Short delay before sliding in
                adInterval = setInterval(() => {
                    adContainer.classList.add('ad-slide-out');
                    setTimeout(showAd, 600); 
                }, 20000); // Rotates randomly every 20 seconds
            } else {
                clearInterval(adInterval);
                adContainer.classList.add('ad-slide-out');
                setTimeout(() => { adContentWrapper.innerHTML = ''; }, 500);
            }
        });
    }

    if (closeAdBtn) {
        closeAdBtn.addEventListener('click', () => {
            adContainer.classList.add('ad-slide-out');
            // Setting interval keeps running to eventually show a new ad later!
        });
    }

    // URL PARAMETER HANDLER - Direct Upgrade Trigger
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgrade') === 'true') {
        setTimeout(() => {
            if (upgradeBtn) upgradeBtn.click();
        }, 1200);
    }

    // ============================================================
    // EMAIL JS - MULTI-RECIPIENT INVOICE SENDER
    // ============================================================
    // HOW TO ACTIVATE:
    // 1. Go to https://www.emailjs.com and create a FREE account
    // 2. Create an Email Service (Gmail, Outlook, etc.)
    // 3. Create an Email Template with these variables:
    //      {{to_email}}, {{from_name}}, {{subject}}, {{message}}
    // 4. Replace the placeholders below with your actual IDs
    // ============================================================
    const EMAILJS_PUBLIC_KEY  = '_IT6zlNiJciLWzCKV';
    const EMAILJS_SERVICE_ID  = 'service_l8f9fru';
    const EMAILJS_TEMPLATE_ID = 'template_w5rqti4';

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    // Add Recipient Button
    const addRecipientBtn = document.getElementById('add-recipient-btn');
    if (addRecipientBtn) {
        addRecipientBtn.addEventListener('click', () => {
            const list = document.getElementById('email-recipients-list');
            const row = document.createElement('div');
            row.className = 'email-recipient-row';
            row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
            row.innerHTML = `
                <input type="email" class="recipient-email-input" placeholder="another@email.com" style="flex:1; font-size:0.85rem; padding:0.5rem 0.75rem;">
                <button onclick="this.parentElement.remove()" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:700;font-size:0.8rem;">✕</button>
            `;
            list.appendChild(row);
        });
    }

    // Send Invoice Email Button
    const sendEmailBtn = document.getElementById('send-invoice-email-btn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', async () => {

            // Collect all recipient emails
            const inputs = document.querySelectorAll('.recipient-email-input');
            const recipients = [...inputs]
                .map(i => i.value.trim())
                .filter(e => e && e.includes('@'));

            if (recipients.length === 0) {
                alert('Please enter at least one valid email address.');
                return;
            }

            // Check EmailJS is configured
            if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                alert('⚙️ Email Setup Required\n\nPaste your EmailJS Public Key, Service ID & Template ID into app.js to activate.');
                return;
            }

            // ✅ Init EmailJS right before sending (lazy — guarantees library is loaded)
            try {
                if (typeof emailjs === 'undefined') {
                    alert('❌ EmailJS library failed to load. Check your internet connection and try again.');
                    return;
                }
                emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            } catch (initErr) {
                console.error('EmailJS init error:', initErr);
            }

            // Extract invoice data from the actual input fields
            const businessName  = document.getElementById('business-name-input')?.value || 'Your Business';
            const clientName    = document.getElementById('client-name-input')?.value || 'Valued Client';
            const clientEmail   = document.getElementById('client-email-input')?.value || '';
            const invoiceNo     = document.getElementById('invoice-no-input')?.value || 'N/A';
            const invoiceDate   = document.getElementById('invoice-date-input')?.value || 'N/A';
            const dueDate       = document.getElementById('due-date-input')?.value || 'N/A';
            const totalDue      = document.getElementById('invoice-total')?.textContent
                               || document.getElementById('total-amount')?.textContent
                               || document.querySelector('.invoice-total')?.textContent || 'See invoice';
            const bankName      = document.getElementById('bank-name-input')?.value || '';
            const acctName      = document.getElementById('bank-acct-name-input')?.value || '';
            const acctNo        = document.getElementById('bank-acct-no-input')?.value || '';
            const paymentLink   = document.getElementById('payment-link-input')?.value || '';

            // Auto-add client email as first recipient if not already listed
            if (clientEmail && recipients.indexOf(clientEmail) === -1) {
                recipients.unshift(clientEmail);
            }

            const message = `
Dear ${clientName},

Please find your invoice PDF attached to this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━
INVOICE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice No:   ${invoiceNo}
Issue Date:   ${invoiceDate}
Due Date:     ${dueDate}
Total Due:    ${totalDue}
━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS
Bank:          ${bankName}
Account Name:  ${acctName}
Account No:    ${acctNo}
${paymentLink ? `Pay Online:    ${paymentLink}` : ''}

Thank you for your business.

Warm regards,
${businessName}
            `.trim();

            // ── AUTO-GENERATE & DOWNLOAD PDF before sending ──
            if (!isPro) {
                sendEmailBtn.disabled = false;
                sendEmailBtn.textContent = '📤 Send Invoice Email 💎';
                upgradeBtn.click(); // Trigger paywall
                return;
            }

            sendEmailBtn.disabled = true;
            sendEmailBtn.textContent = '📨 Sending Email...';

            // Ensure preview is fully updated before capture
            forceSyncPreview(); 
            const originalEl = document.getElementById('invoice-preview');

            let successCount = 0;
            let lastError = '';
            for (const email of recipients) {
                try {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        to_email:  email,
                        from_name: businessName,
                        subject:   `Invoice ${invoiceNo} from ${businessName} — Total: ${totalDue}`,
                        message:   message
                    });
                    successCount++;
                } catch (err) {
                    lastError = err?.text || err?.message || JSON.stringify(err);
                    console.error(`Failed to send to ${email}:`, err);
                }
            }

            sendEmailBtn.disabled = false;
            sendEmailBtn.textContent = '📤 Send Invoice Email 💎';

            if (successCount === recipients.length) {
                alert(`✅ Email Summary Sent!\n\n📧 A professional summary has been successfully sent to ${successCount} recipient${successCount > 1 ? 's' : ''}.\n\nTip: You can now click "Generate Standard PDF" to save a copy for your own records or to manually attach to a follow-up.`);
            } else {
                alert(`⚠️ Email sent to ${successCount} of ${recipients.length} recipients.\n\nError: ${lastError}`);
            }
        });
    }

});
