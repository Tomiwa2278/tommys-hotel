/* ============================================================
   TOMMY'S HOTEL — MAIN.JS
   Global: page loader, scroll-to-top, cookie banner,
   scroll-reveal, lightbox utilities
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // PAGE LOADER
  // ============================================================
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  }

  // ============================================================
  // SCROLL TO TOP BUTTON
  // ============================================================
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // COOKIE CONSENT BANNER
  // ============================================================
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner && !localStorage.getItem('tommy-cookies-accepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 800);
  }

  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieDeclineBtn = document.getElementById('cookie-decline');

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('tommy-cookies-accepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  if (cookieDeclineBtn) {
    cookieDeclineBtn.addEventListener('click', () => {
      localStorage.setItem('tommy-cookies-accepted', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // ============================================================
  // SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // GLOBAL LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let lightboxImages = [];
  let lightboxIndex = 0;

  window.openLightbox = (images, startIndex = 0) => {
    if (!lightbox) return;
    lightboxImages = images;
    lightboxIndex = startIndex;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightboxImage = () => {
    if (!lightboxImg || lightboxImages.length === 0) return;
    const current = lightboxImages[lightboxIndex];
    lightboxImg.src = current.src || '';
    lightboxImg.alt = current.alt || '';
    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', window.closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) window.closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightboxImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightboxImage();
    });
  }

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // ============================================================
  // TESTIMONIALS CAROUSEL (Home page)
  // ============================================================
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoRotate;

  const goToSlide = (index) => {
    if (!track) return;
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const startAutoRotate = () => {
    autoRotate = setInterval(() => {
      goToSlide((currentSlide + 1) % dots.length);
    }, 5000);
  };

  if (track && dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoRotate);
        goToSlide(i);
        startAutoRotate();
      });
    });
    startAutoRotate();
  }

  // ============================================================
  // NEWSLETTER FORM (Home page)
  // ============================================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const success = document.getElementById('newsletter-success');
      if (input && input.value.trim()) {
        newsletterForm.style.display = 'none';
        if (success) success.classList.add('visible');
      }
    });
  }

  // ============================================================
  // GALLERY LIGHTBOX (Home page)
  // ============================================================
  const galleryItems = document.querySelectorAll('.gallery-item[data-gallery]');
  if (galleryItems.length > 0) {
    const images = Array.from(galleryItems).map(item => ({
      src: item.querySelector('img') ? item.querySelector('img').src : '',
      alt: item.querySelector('img') ? item.querySelector('img').alt : ''
    }));

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => window.openLightbox(images, i));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View gallery image ${i + 1}`);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openLightbox(images, i);
        }
      });
    });
  }

  // ============================================================
  // ANIMATED STAT COUNTERS (About page)
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  // ============================================================
  // HERO SEARCH (Home page) — redirect to rooms with params
  // ============================================================
  const heroSearchForm = document.getElementById('hero-search-form');
  const heroCheckIn = document.getElementById('hero-checkin');
  const heroCheckOut = document.getElementById('hero-checkout');

  if (heroCheckIn && heroCheckOut) {
    const today = new Date().toISOString().split('T')[0];
    heroCheckIn.setAttribute('min', today);
    
    heroCheckIn.addEventListener('change', () => {
      if (heroCheckIn.value) {
        const checkInDate = new Date(heroCheckIn.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        const minCheckOut = checkInDate.toISOString().split('T')[0];
        heroCheckOut.setAttribute('min', minCheckOut);
        if (heroCheckOut.value && heroCheckOut.value <= heroCheckIn.value) {
          heroCheckOut.value = minCheckOut;
        }
      }
    });

    // Initialize checkout min
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    heroCheckOut.setAttribute('min', tomorrow.toISOString().split('T')[0]);
  }

  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkIn = heroCheckIn?.value || '';
      const checkOut = heroCheckOut?.value || '';
      const roomType = document.getElementById('hero-room-type')?.value || '';
      const guests = document.getElementById('hero-guests')?.value || '';
      const params = new URLSearchParams({ checkIn, checkOut, roomType, guests });
      window.location.href = `rooms.html?${params.toString()}`;
    });
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
