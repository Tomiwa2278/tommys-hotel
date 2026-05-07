/* ============================================================
   TOMMY'S HOTEL — NAVBAR.JS
   Shared navbar component injected into every page
   ============================================================ */

(function () {
  const navbarHTML = `
    <nav class="navbar" id="main-navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo" aria-label="Tommy's Hotel - Home">
          Tommy's <span>Hotel</span>
        </a>

        <div class="navbar-links" role="list">
          <a href="index.html" data-page="index" role="listitem">Home</a>
          <a href="rooms.html" data-page="rooms" role="listitem">Rooms</a>
          <a href="about.html" data-page="about" role="listitem">About</a>
          <a href="contact.html" data-page="contact" role="listitem">Contact</a>
        </div>

        <div class="navbar-actions">
          <a href="booking.html" class="btn btn-primary" id="nav-book-btn">Book Now</a>
          <button class="theme-toggle" id="theme-toggle-btn" aria-label="Toggle dark/light mode" title="Toggle theme">
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <button class="navbar-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="nav-drawer">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div class="navbar-drawer" id="nav-drawer" aria-hidden="true" role="dialog" aria-label="Mobile navigation">
        <div class="navbar-drawer-inner">
          <a href="index.html" data-page="index">Home</a>
          <a href="rooms.html" data-page="rooms">Rooms</a>
          <a href="about.html" data-page="about">About</a>
          <a href="contact.html" data-page="contact">Contact</a>
          <a href="auth.html">Sign In / Register</a>
          <a href="booking.html" class="btn btn-primary">Book Now</a>
        </div>
      </div>
    </nav>
  `;

  // Inject navbar
  const root = document.getElementById('navbar-root');
  if (root) root.innerHTML = navbarHTML;

  // ---- Active link detection ----
  const path = window.location.pathname;
  const pageName = path.split('/').pop().replace('.html', '') || 'index';

  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    }
  });

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('main-navbar');
  const onScroll = () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Hamburger toggle ----
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);
    });

    // Close drawer when link clicked
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Theme Toggle ----
  const themeBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = themeBtn ? themeBtn.querySelector('.sun-icon') : null;
  const moonIcon = themeBtn ? themeBtn.querySelector('.moon-icon') : null;

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tommy-theme', theme);
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        themeBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        themeBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  };

  // Load saved theme
  const savedTheme = localStorage.getItem('tommy-theme') || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
