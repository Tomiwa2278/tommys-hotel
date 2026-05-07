/* ============================================================
   TOMMY'S HOTEL — DASHBOARD.JS
   Tab switching, bookings, profile, notifications, loyalty
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // USER DATA
  // ============================================================
  const userName = localStorage.getItem('tommy-user-name') || 'Valued Guest';
  const userEmail = localStorage.getItem('tommy-user-email') || 'guest@example.com';

  // Greet
  const greetingEl = document.getElementById('dashboard-greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    greetingEl.innerHTML = `${greet}, <span>${userName}</span>`;
  }

  const dateEl = document.getElementById('dashboard-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-NG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  }

  // Sidebar user name
  document.querySelectorAll('.sidebar-user-name-display').forEach(el => el.textContent = userName);

  // Profile form pre-fill
  const profileName = document.getElementById('profile-fullname');
  const profileEmail = document.getElementById('profile-email');
  if (profileName) profileName.value = userName + ' Example';
  if (profileEmail) profileEmail.value = userEmail;

  // ============================================================
  // TAB SWITCHING
  // ============================================================
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-tab], .dashboard-mobile-tabs .sidebar-nav-item[data-tab]');
  const tabs = document.querySelectorAll('.dashboard-tab');

  function switchTab(tabId) {
    tabs.forEach(t => t.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');

    navItems.forEach(n => {
      if (n.dataset.tab === tabId) n.classList.add('active');
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Default tab
  switchTab('overview');

  // ============================================================
  // LOYALTY PROGRESS ANIMATION
  // ============================================================
  const progressFill = document.getElementById('loyalty-progress-fill');
  if (progressFill) {
    setTimeout(() => {
      progressFill.style.width = progressFill.dataset.progress || '65%';
    }, 500);
  }

  // ============================================================
  // BOOKING CANCEL BUTTONS
  // ============================================================
  document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        const card = btn.closest('.booking-row-card');
        if (card) {
          const badge = card.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-error';
            badge.textContent = 'Cancelled';
          }
          btn.disabled = true;
          btn.textContent = 'Cancelled';
          btn.style.opacity = '0.5';
        }
      }
    });
  });

  // ============================================================
  // VIEW RECEIPT BUTTONS
  // ============================================================
  document.querySelectorAll('.view-receipt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref || 'TH' + Math.random().toString(36).toUpperCase().slice(2, 10);
      alert(`Booking Reference: ${ref}\n\nA receipt has been sent to your email address.\n(This is a demo — no actual email is sent.)`);
    });
  });

  // ============================================================
  // PROFILE FORM SAVE
  // ============================================================
  const profileForm = document.getElementById('profile-form');
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('profile-fullname')?.value.trim();
    if (nameVal) localStorage.setItem('tommy-user-name', nameVal.split(' ')[0]);

    const saveMsg = document.getElementById('profile-save-msg');
    if (saveMsg) {
      saveMsg.style.display = 'flex';
      setTimeout(() => saveMsg.style.display = 'none', 3000);
    }
  });

  // ============================================================
  // NOTIFICATION MARK READ
  // ============================================================
  document.querySelectorAll('.notification-item.unread').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('unread');
    });
  });

  // ============================================================
  // LOGOUT LINK
  // ============================================================
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('tommy-user-name');
    localStorage.removeItem('tommy-user-email');
    window.location.href = 'auth.html';
  });

});
