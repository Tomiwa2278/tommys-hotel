/* ============================================================
   TOMMY'S HOTEL — AUTH.JS
   Login/Register form toggle, validation, password toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // TAB SWITCHING
  // ============================================================
  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  const panels = document.querySelectorAll('.auth-form-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // ============================================================
  // PASSWORD SHOW/HIDE
  // ============================================================
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      btn.innerHTML = isHidden
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });

  // ============================================================
  // VALIDATION HELPERS
  // ============================================================
  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-error');
    if (el) el.classList.add('error');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-error');
    if (el) el.classList.remove('error');
    if (err) err.classList.remove('visible');
  }

  function validate(id, condition, msg) {
    if (!condition) { showFieldError(id, msg); return false; }
    clearFieldError(id); return true;
  }

  // Live clear errors on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input.id));
  });

  // ============================================================
  // SIGN IN FORM
  // ============================================================
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    let valid = true;

    valid &= validate('login-email', email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.');
    valid &= validate('login-password', password && password.length >= 6, 'Password must be at least 6 characters.');

    if (valid) {
      // Save user name for dashboard (demo only)
      const emailName = email.split('@')[0];
      localStorage.setItem('tommy-user-name', emailName.charAt(0).toUpperCase() + emailName.slice(1));
      localStorage.setItem('tommy-user-email', email);
      window.location.href = 'dashboard.html';
    }
  });

  // ============================================================
  // REGISTER FORM
  // ============================================================
  const registerForm = document.getElementById('register-form');
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reg-firstname')?.value.trim();
    const lastName  = document.getElementById('reg-lastname')?.value.trim();
    const email     = document.getElementById('reg-email')?.value.trim();
    const phone     = document.getElementById('reg-phone')?.value.trim();
    const password  = document.getElementById('reg-password')?.value;
    const confirm   = document.getElementById('reg-confirm')?.value;
    const terms     = document.getElementById('reg-terms')?.checked;
    let valid = true;

    valid &= validate('reg-firstname', firstName && firstName.length >= 2, 'Please enter your first name.');
    valid &= validate('reg-lastname', lastName && lastName.length >= 2, 'Please enter your last name.');
    valid &= validate('reg-email', email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.');
    valid &= validate('reg-phone', phone && phone.length >= 8, 'Please enter a valid phone number.');
    valid &= validate('reg-password', password && password.length >= 8, 'Password must be at least 8 characters.');
    valid &= validate('reg-confirm', confirm && confirm === password, 'Passwords do not match.');
    valid &= validate('reg-terms', terms, 'You must accept the terms to continue.');

    if (valid) {
      localStorage.setItem('tommy-user-name', firstName);
      localStorage.setItem('tommy-user-email', email);
      window.location.href = 'dashboard.html';
    }
  });

  // ============================================================
  // SOCIAL AUTH BUTTONS (visual only)
  // ============================================================
  document.querySelectorAll('.social-auth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Social login is not available in this demo. Please use the form above.');
    });
  });

  // ============================================================
  // FORGOT PASSWORD LINK
  // ============================================================
  document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your email address. (This is a demo)');
  });

  // ============================================================
  // THEME TOGGLE (auth page specific — no navbar)
  // ============================================================
  const authThemeBtn = document.getElementById('auth-theme-toggle');
  if (authThemeBtn) {
    const savedTheme = localStorage.getItem('tommy-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    authThemeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tommy-theme', next);
      updateAuthThemeIcon(next);
    });

    updateAuthThemeIcon(savedTheme);

    function updateAuthThemeIcon(theme) {
      authThemeBtn.innerHTML = theme === 'dark'
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

});
