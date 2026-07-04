// ── TOAST ──────────────────────────────────────────────────────────────────
function showToast(message, type = '') {

    const toast = document.getElementById('toast');

    toast.textContent = message;

    toast.className = 'toast show ' + type;

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// ── TAB SWITCHER (Login / Sign Up) ─────────────────────────────────────────
function switchAuthTab(tabName, button) {

    document.querySelectorAll('.log-form').forEach(f => {
        f.classList.remove('active-form');
    });

    document.querySelectorAll('.auth-tabs .tab-btn').forEach(b => {
        b.classList.remove('active-tab');
    });

    document.getElementById(tabName + 'Form').classList.add('active-form');

    button.classList.add('active-tab');
}

// ── PASSWORD VISIBILITY TOGGLE ─────────────────────────────────────────────
function togglePassword(inputId, iconEl) {

    const input = document.getElementById(inputId);

    if (input.type === 'password') {
        input.type = 'text';
        iconEl.classList.remove('fa-eye');
        iconEl.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconEl.classList.remove('fa-eye-slash');
        iconEl.classList.add('fa-eye');
    }
}

// ── USER STORE (localStorage-based, same pattern as main app) ─────────────
function getUsers() {
    return JSON.parse(localStorage.getItem('ctUsers')) || [];
}

function saveUsers(users) {
    localStorage.setItem('ctUsers', JSON.stringify(users));
}

function setCurrentUser(email) {
    localStorage.setItem('ctCurrentUser', email);
}

// ── SIGN UP ─────────────────────────────────────────────────────────────────
function handleSignup(event) {

    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'orange');
        return false;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'orange');
        return false;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'orange');
        return false;
    }

    const users = getUsers();

    if (users.some(u => u.email === email)) {
        showToast('An account with this email already exists', 'orange');
        return false;
    }

    users.push({ name, email, password });

    saveUsers(users);

    setCurrentUser(email);

    showToast('✅ Account created! Welcome, ' + name, 'green');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);

    return false;
}

// ── LOGIN ───────────────────────────────────────────────────────────────────
function handleLogin(event) {

    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showToast('Please enter your email and password', 'orange');
        return false;
    }

    const users = getUsers();

    const match = users.find(u => u.email === email && u.password === password);

    if (!match) {
        showToast('Invalid email or password', 'orange');
        return false;
    }

    setCurrentUser(email);

    if (rememberMe) {
        localStorage.setItem('ctRememberedEmail', email);
    } else {
        localStorage.removeItem('ctRememberedEmail');
    }

    showToast('✅ Welcome back, ' + match.name + '!', 'green');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);

    return false;
}

// ── FORGOT PASSWORD ─────────────────────────────────────────────────────────
function handleForgotPassword(event) {

    event.preventDefault();

    const email = prompt('Enter your account email to reset your password:');

    if (!email) return;

    const users = getUsers();

    const match = users.find(u => u.email === email.trim().toLowerCase());

    if (!match) {
        showToast('No account found with that email', 'orange');
        return;
    }

    const newPassword = prompt('Enter a new password (min 6 characters):');

    if (!newPassword || newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'orange');
        return;
    }

    match.password = newPassword;

    saveUsers(users);

    showToast('✅ Password updated. You can now log in.', 'green');
}

// ── ILLUSTRATION PANEL PREVIEW STATS ────────────────────────────────────────
// Pulls a quick snapshot from existing app data (if the user has used the
// tracker before) so the illustration panel feels alive rather than static.
function populateIllustrationStats() {

    const totalEmission = Number(localStorage.getItem('totalEmission')) || 0;

    const monthlyGoal = Number(localStorage.getItem('monthlyGoal')) || 100;

    const trees = totalEmission / 22;

    const score = monthlyGoal > 0
        ? Math.max(0, Math.min(100, Math.round(100 - (totalEmission / monthlyGoal) * 100)))
        : 100;

    document.getElementById('illustrationSaved').textContent = totalEmission.toFixed(0) + ' kg';

    document.getElementById('illustrationTrees').textContent = trees.toFixed(1);

    document.getElementById('illustrationScore').textContent = score + '%';
}

// ── INIT ─────────────────────────────────────────────────────────────────────
(function init() {

    populateIllustrationStats();

    const rememberedEmail = localStorage.getItem('ctRememberedEmail');

    if (rememberedEmail) {
        document.getElementById('loginEmail').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }

})();
