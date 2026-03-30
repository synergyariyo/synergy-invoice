
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

// --- GOOGLE SIGN IN ---
window.signInWithGoogle = () => {
    if (!CHECK_PROTOCOL()) return;
    
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log("Logged in with Google:", result.user.displayName);
        closeAuthModal();
        window.location.href = 'dashboard.html'; 
    }).catch((error) => {
        let msg = error.message;
        if (error.code === 'auth/operation-not-supported-in-this-environment') {
            msg = "Login failed because you are not using a web server. Open your app via http://localhost or a live URL.";
        } else if (error.code === 'auth/network-request-failed') {
            msg = "Network Error: Check your internet or ensure your Firebase Project IDs are correct in auth.js.";
        }
        alert("Sign In Error: " + msg);
    });
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

// --- CLOUD STORAGE UTILITIES (FIRESTORE) ---
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

// --- MONITOR AUTH STATE ---
auth.onAuthStateChanged((user) => {
    updateAuthUI(user);
    if (user) {
        console.log("User active:", user.email);
        if (window.location.pathname.includes('dashboard.html')) {
            loadUserHistory(user.uid);
        }
    }
});

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

function updateAuthUI(user) {
    const authLinksIcons = document.querySelectorAll('.auth-link-text');
    const authBtnContainers = document.querySelectorAll('.auth-btn-container');

    if (user) {
        authBtnContainers.forEach(container => {
            container.innerHTML = `
                <div class="user-profile-nav" onclick="handleLogout()" title="Click to Logout">
                    <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + user.email}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary);">
                    <span style="font-size: 0.8rem; font-weight: 700;">${user.displayName || user.email.split('@')[0]}</span>
                </div>
            `;
        });
    } else {
        authBtnContainers.forEach(container => {
            container.innerHTML = `<a href="javascript:void(0)" onclick="openAuthModal()" class="auth-link">Sign In</a>`;
        });
    }
}
