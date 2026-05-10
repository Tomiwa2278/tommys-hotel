/* ============================================================
   TOMMY'S HOTEL — ROOM-DETAILS.JS
   Gallery lightbox, accordion, sticky CTA, similar rooms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // GET ROOM DATA FROM URL
  // ============================================================
  const params = new URLSearchParams(window.location.search);
  const roomId = parseInt(params.get('id')) || 3; // default to Indulgence Suite

  // Room data inline (reuse from rooms.js if available, else fallback)
  const ROOMS = typeof ROOMS_DATA !== 'undefined' ? ROOMS_DATA : [
    { id: 3, name: "The Indulgence Suite", type: "Signature Suite", price: 150000, priceUSD: 95,
      description: "The Indulgence Suite doesn't ask you to compromise. A space where world-class comfort meets genuine warmth, every detail has been considered — from the hand-selected linens to the curated in-room dining menu. This is what more looks like, and it looks like this.", rating: 4.9, reviews: 211, guests: 2, beds: "King Bed", typeKey: "signature" }
  ];

  const room = ROOMS.find ? ROOMS.find(r => r.id === roomId) : ROOMS[0];

  if (room) {
    // Update page title and key elements
    const roomNameEl = document.getElementById('room-name');
    const roomTypeEl = document.getElementById('room-type-badge');
    const roomPriceEl = document.getElementById('room-price');
    const roomPriceSideEl = document.getElementById('sidebar-price');
    const roomDescEl = document.getElementById('room-description');
    const roomRatingEl = document.getElementById('room-rating');
    const mobilePriceEl = document.getElementById('mobile-price');

    if (roomNameEl) roomNameEl.textContent = room.name;
    if (roomTypeEl) roomTypeEl.textContent = room.type;
    if (roomPriceEl) roomPriceEl.textContent = `₦${room.price.toLocaleString()}`;
    if (roomPriceSideEl) roomPriceSideEl.textContent = `₦${room.price.toLocaleString()}`;
    if (mobilePriceEl) mobilePriceEl.textContent = `₦${room.price.toLocaleString()}`;
    if (roomDescEl) roomDescEl.textContent = room.description || '';
    if (roomRatingEl) roomRatingEl.textContent = `${room.rating} (${room.reviews} reviews)`;

    document.title = `${room.name} — Tommy's Hotel`;

    // Book links
    document.querySelectorAll('.book-this-room-link').forEach(link => {
      link.href = `booking.html?room=${room.id}`;
    });
  }

  // ============================================================
  // THUMBNAIL GALLERY
  // ============================================================
  const heroImg = document.getElementById('gallery-hero-img');
  const thumbs = document.querySelectorAll('.room-thumb');

  const galleryImages = [
    { src: 'images/details/room-detail-1.png', alt: 'Room main view' },
    { src: 'images/rooms/suite-2.jpg', alt: 'Room second view' },
    { src: 'images/rooms/deluxe-room-2.jpg', alt: 'Room bathroom' },
    { src: 'images/rooms/family-room-1.jpg', alt: 'Room detail' }
  ];

  if (heroImg && galleryImages[0]) {
    heroImg.src = galleryImages[0].src;
    heroImg.alt = galleryImages[0].alt;
  }

  thumbs.forEach((thumb, i) => {
    const img = thumb.querySelector('img');
    if (img && galleryImages[i]) {
      img.src = galleryImages[i].src;
      img.alt = galleryImages[i].alt;
    }
    
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (heroImg) {
        heroImg.src = thumb.querySelector('img')?.src || '';
        heroImg.alt = thumb.querySelector('img')?.alt || '';
      }
    });
  });

  // Hero click opens lightbox
  const galleryHero = document.getElementById('gallery-hero');
  if (galleryHero) {
    galleryHero.addEventListener('click', () => {
      window.openLightbox && window.openLightbox(galleryImages, 0);
    });
  }

  // ============================================================
  // ACCORDION (Policies)
  // ============================================================
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  // ============================================================
  // STICKY MOBILE CTA — appears after scrolling past gallery
  // ============================================================
  const mobileCta = document.querySelector('.room-mobile-cta');
  if (mobileCta) {
    const gallery = document.querySelector('.room-gallery');
    if (gallery) {
      const showAfter = gallery.offsetTop + gallery.offsetHeight;
      window.addEventListener('scroll', () => {
        mobileCta.classList.toggle('visible', window.scrollY > showAfter);
      }, { passive: true });
    }
  }

  // ============================================================
  // BOOKING SIDEBAR — date inputs
  // ============================================================
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const checkinInput = document.getElementById('sidebar-checkin');
  const checkoutInput = document.getElementById('sidebar-checkout');

  if (checkinInput) { checkinInput.value = today; checkinInput.min = today; }
  if (checkoutInput) { checkoutInput.value = tomorrow; checkoutInput.min = tomorrow; }

  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', () => {
      const minCheckout = new Date(checkinInput.value);
      minCheckout.setDate(minCheckout.getDate() + 1);
      checkoutInput.min = minCheckout.toISOString().split('T')[0];
      if (checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = minCheckout.toISOString().split('T')[0];
      }
    });
  }

  // Sidebar book button
  const sidebarBookBtn = document.getElementById('sidebar-book-btn');
  if (sidebarBookBtn && room) {
    sidebarBookBtn.addEventListener('click', () => {
      const ci = checkinInput?.value || '';
      const co = checkoutInput?.value || '';
      const adults = document.getElementById('sidebar-adults')?.value || '1';
      const children = document.getElementById('sidebar-children')?.value || '0';
      window.location.href = `booking.html?room=${room.id}&checkIn=${ci}&checkOut=${co}&adults=${adults}&children=${children}`;
    });
  }

});
