
// Firebase Configuration Placeholder
// USER ACTION REQUIRED: Replace with your own Firebase Project Config from Console!
const firebaseConfig = {
  apiKey: "AIzaSyBjYssVtzbHOuEIWNwEZMQL7XNBdU__FWc",
  authDomain: "studio-6067138608-35365.firebaseapp.com",
  projectId: "studio-6067138608-35365",
  storageBucket: "studio-6067138608-35365.firebasestorage.app",
  messagingSenderId: "420171485203",
  appId: "1:420171485203:web:51ed86261505cab5996fe6",
  measurementId: "G-VVGWVMQT2Q"
};

// Initialize Firebase (Compatibility Mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- AUTH UI HANDLERS ---

// Protocol Check: Firebase Auth requires a web server (HTTP/HTTPS)
const CHECK_PROTOCOL = () => {
    if (window.location.protocol === 'file:') {
        alert("⚠️ Synergy Login requires a Web Server!\n\nTo make sign-in work, please run your app on a local server (like VS Code Live Server or by typing 'npx serve' in your terminal).\n\nOpening the file directly (file://) is not supported by Google security.");
        return false;
    }
    return true;
};

window.openAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'flex';
};

window.closeAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'none';
};

window.togglePasswordVisibility = (inputId) => {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
};

// --- GOOGLE SIGN IN (POPUP PROTECTED) ---
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Synergy Session Persistence: ACTIVE");
    })
    .catch((error) => {
        console.error("Persistence Error:", error);
    });

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Synergy Session Persistence: ACTIVE");
    })
    .catch((error) => {
        console.error("Persistence Error:", error);
    });

// --- GOOGLE SIGN IN (REDIRECT PROTECTED) ---
// Handle redirect result on page load
firebase.auth().getRedirectResult().then(function(result) {
    if (result.user) {
        console.log("Logged in gracefully from redirect:", result.user.displayName);
        if (typeof closeAuthModal === 'function') closeAuthModal();
        window.location.href = 'dashboard.html'; 
    }
}).catch(function(error) {
    console.error("Redirect Auth Error:", error.code, error.message);
    if(error.code !== 'auth/redirect-cancelled-by-user') {
        alert("Sign In Error: " + error.message);
    }
});

let isAuthWorking = false;
window.signInWithGoogle = () => {
    if (isAuthWorking) return; 
    if (!CHECK_PROTOCOL()) return;
    
    isAuthWorking = true;
    const btn = document.querySelector('.google-auth-btn');
    if (btn) btn.style.opacity = '0.5';
    btn.innerHTML = 'Redirecting to Google... <span class="spinner"></span>';

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
};

// --- EMAIL SIGN IN/REG ---
window.handleEmailAuth = (e) => {
    e.preventDefault();
    if (!CHECK_PROTOCOL()) return;

    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    const isReg = document.getElementById('auth-mode-reg').checked;

    if (isReg) {
        auth.createUserWithEmailAndPassword(email, pass).then((userCredential) => {
            alert("✅ Account Created Successfully!");
            closeAuthModal();
            window.location.href = 'dashboard.html';
        }).catch(err => alert("Registration Failed: " + err.message));
    } else {
        auth.signInWithEmailAndPassword(email, pass).then((userCredential) => {
            closeAuthModal();
            window.location.href = 'dashboard.html';
        }).catch(err => alert("Login Failed: " + err.message));
    }
};

window.handleLogout = () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
};

// --- SET GLOBAL PERSISTENCE (Standard for Premium SaaS) ---
firebase.auth().setPersistence(firebase.auth.Persistence.LOCAL)
  .catch((e) => console.warn("Persistence failed:", e));

window.saveDocumentToCloud = async (type, data) => {
    const user = auth.currentUser;
    if (!user) return; 

    try {
        await db.collection('documents').add({
            userId: user.uid,
            type: type, 
            data: data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userName: user.displayName || user.email
        });
        console.log(`Cloud backup: ${type} saved.`);
    } catch (err) {
        console.warn("Cloud backup failed:", err);
    }
};

window.saveUserProfile = async (profileData) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await db.collection('profiles').doc(user.uid).set({
            ...profileData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("User profile synced to cloud.");
    } catch (e) {
        console.error("Profile sync failed:", e);
    }
};

window.getUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    try {
        const doc = await db.collection('profiles').doc(user.uid).get();
        return doc.exists ? doc.data() : null;
    } catch (e) {
        console.error("Error fetching profile:", e);
        return null;
    }
};

// --- MONITOR AUTH STATE (PERFORMANCE OPTIMIZED) ---
auth.onAuthStateChanged((user) => {
    // 1. Immediate UI update for basic auth status
    updateAuthUI(user);
    
    if (user) {
        console.log("Synergy Session Active:", user.email);

        // SYNERGY SMART CTA: Update index.html button if user is already logged in
        const homeCta = document.querySelector('.hero .btn-primary');
        if (homeCta && (homeCta.innerText.includes('Started') || homeCta.innerText.includes('Launch'))) {
            homeCta.innerHTML = "Launch Dashboard &rarr;";
            homeCta.onclick = () => window.location.href = 'dashboard.html';
            homeCta.style.display = 'inline-flex';
        }
        
        // 2. Premium Paywall Enforcement & Profile Sync
        syncPremiumStatus(user);

        // 3. Page-Specific Data Loading
        const path = window.location.pathname;
        if (path.includes('dashboard.html')) {
            loadUserHistory(user.uid);
        }
        if (path.includes('app.html') || path.includes('estimate.html') || path.includes('quote.html') || path.includes('delivery.html') || path.includes('receipt.html')) {
            if (typeof window.restoreProfile === 'function') window.restoreProfile();
            else setTimeout(() => { if(window.restoreProfile) window.restoreProfile(); }, 800);
        }
    }
});

async function syncPremiumStatus(user) {
    try {
        const doc = await db.collection('profiles').doc(user.uid).get();
        let data = doc.exists ? doc.data() : null;

        // If new user, initialize profile
        if (!data) {
            data = {
                email: user.email,
                isPro: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('profiles').doc(user.uid).set(data);
        }

        // PAYWALL LOGIC: Check if 5-day grace period is over
        const createdDate = data.createdAt ? data.createdAt.toDate() : new Date();
        const diffDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
        const isPro = data.isPro === true;
        const isExpired = diffDays > 5 && !isPro;

        window.SYNERGY_PRO_STATUS = { isPro, isExpired, diffDays };
        
        // Trigger UI updates based on fresh Pro status
        updateAuthUI(user, isPro);
        
        // FORCE REDIRECT: If trying to use tools while expired
        const restrictedPages = ['app.html', 'estimate.html', 'quote.html', 'delivery.html', 'receipt.html', 'expenses.html'];
        const isRestrictedPage = restrictedPages.some(p => window.location.pathname.includes(p));
        
        if (isExpired && isRestrictedPage) {
            alert("⏰ Your 5-day free premium trial has ended. Please upgrade to Synergy Pro to continue using these professional tools!");
            window.location.href = 'index.html#pricing';
        }

    } catch (err) {
        console.warn("Premium sync delayed:", err);
    }
}

// PREMIUM TOOL GATE
window.checkPremiumTool = (e) => {
    if (!window.SYNERGY_PRO_STATUS?.isPro) {
        if(e) e.preventDefault();
        alert("💎 Synergy Global Pro Feature Detected!\n\nWe are taking you to the pricing panel where you can lock in your upgrade via our Executive WhatsApp Concierge.");
        window.location.href = 'index.html#pricing';
        return false;
    }
    return true;
};

async function loadUserHistory(uid) {
    const container = document.getElementById('history-container');
    const kpiCount = document.getElementById('kpi-count');
    const kpiRevenue = document.getElementById('kpi-revenue');

    try {
        const snapshot = await db.collection('documents')
            .where('userId', '==', uid)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        if (snapshot.empty) return;

        container.innerHTML = ''; 
        let totalVal = 0;
        let count = 0;

        snapshot.forEach(doc => {
            const docData = doc.data();
            const details = docData.data;
            count++;
            
            const amountStr = details.totalDue || details.grandTotal || '0';
            const amount = parseFloat(amountStr.replace(/[^0-9.]/g, '') || 0);
            totalVal += amount;

            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-meta">
                    <h4>${docData.type === 'invoice' ? '📄 A4 Invoice' : '🧾 Thermal Receipt'} - ${details.invoiceNo || details.receiptNo || 'DOC'}</h4>
                    <p>To: ${details.clientName || 'Customer'}</p>
                </div>
                <div class="history-amount">${details.totalDue || details.grandTotal || '₦0.00'}</div>
            `;
            container.appendChild(div);
        });

        if (kpiCount) kpiCount.innerText = count;
        if (kpiRevenue) kpiRevenue.innerText = `₦${totalVal.toLocaleString()}`;

    } catch (err) {
        console.error("Failed to load history:", err);
    }
}

function updateAuthUI(user, isProIn = false) {
    const authBtnContainers = document.querySelectorAll('.auth-btn-container');
    const heroCtaDiv = document.getElementById('hero-cta-container');

    if (user) {
        // We might already know Pro status from syncPremiumStatus
        const isPro = isProIn || (window.SYNERGY_PRO_STATUS && window.SYNERGY_PRO_STATUS.isPro);
        
        authBtnContainers.forEach(container => {
            const phot = user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || user.email);
            container.innerHTML = `
                <div style="position: relative; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px;" onclick="handleLogout()" title="Click to Logout">
                    <div style="position: relative; width: 34px; height: 34px;">
                        <img src="${phot}" 
                             class="${isPro ? 'pro-glow' : ''}" 
                             style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid ${isPro ? 'transparent' : 'var(--primary-color)'}; object-fit: cover;">
                        ${isPro ? '<span class="pro-badge-mini" style="background:#bf953f; color:white; font-size:10px; padding:2px 4px; border-radius:4px; position:absolute; bottom:-5px; right:-5px; font-weight:900; border:1px solid white;">PRO</span>' : ''}
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 800; color: ${isPro ? '#bf953f' : 'inherit'}">${user.displayName || user.email.split('@')[0]}</span>
                </div>
            `;
        });

        // --- SMART RECOGNITION (LANDING PAGE) ---
        if (heroCtaDiv) {
            heroCtaDiv.innerHTML = `
                <div style="text-align:center; animation: fadeIn 1s ease;">
                    <div style="margin-bottom:1.2rem; font-weight:800; color:var(--primary); font-size:1.1rem; letter-spacing:0px;">Welcome back, ${user.displayName?.split(' ')[0] || user.email.split('@')[0]} 👋</div>
                    <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                        <a href="dashboard.html" class="btn btn-primary" style="padding: 1.1rem 2.5rem; font-size: 1rem; background:linear-gradient(135deg, var(--primary), var(--accent));">Open Your Dashboard &rarr;</a>
                        <a href="app.html" class="btn btn-outline" style="padding: 1.1rem 2.5rem; font-size: 1rem;">Create New Invoice</a>
                    </div>
                </div>
            `;
        }
    } else {
        authBtnContainers.forEach(container => {
            container.innerHTML = `
                <a href="javascript:void(0)" onclick="openAuthModal()" class="auth-link" style="color: var(--accent); text-decoration: none; font-weight: 700; font-size: 0.85rem;">Sign In</a>
            `;
        });
    }
}
