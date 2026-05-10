/* ============================================================
   TOMMY'S HOTEL — ROOMS.JS
   Room data, filtering, sorting, comparison drawer
   ============================================================ */

// ============================================================
// ROOM DATA
// ============================================================
const ROOMS_DATA = [
  {
    id: 1,
    name: "The Harmony Deluxe",
    type: "Deluxe Room",
    typeKey: "deluxe",
    tagline: "A sanctuary of calm with golden hour views",
    description: "Sink into the Harmony Deluxe and let the world slow down. Bathed in warm afternoon light, this room was designed for guests who know the difference between a good night's sleep and a transformative one. Every surface speaks of quiet elegance.",
    price: 85000,
    priceUSD: 54,
    image: "images/rooms/deluxe-room-1.jpg",
    images: ["images/rooms/deluxe-room-1.jpg","images/rooms/deluxe-room-2.jpg"],
    rating: 4.8,
    reviews: 124,
    guests: 2,
    beds: "King Bed",
    amenities: ["King Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","City View"],
    popular: true,
    newest: false
  },
  {
    id: 2,
    name: "The Serenity Studio",
    type: "Studio",
    typeKey: "studio",
    tagline: "Minimalist elegance for the modern explorer",
    description: "The Serenity Studio is for those who travel light but live fully. Compact, intentional, and beautifully considered — every inch of this space was designed to make you feel like you have everything you need and nothing you don't.",
    price: 65000,
    priceUSD: 41,
    image: "images/rooms/suite-1.jpg",
    images: ["images/rooms/suite-1.jpg","images/rooms/suite-2.jpg"],
    rating: 4.7,
    reviews: 89,
    guests: 1,
    beds: "Queen Bed",
    amenities: ["Queen Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Work Desk"],
    popular: false,
    newest: true
  },
  {
    id: 3,
    name: "The Indulgence Suite",
    type: "Signature Suite",
    typeKey: "signature",
    tagline: "Because you deserve more than the ordinary",
    description: "The Indulgence Suite doesn't ask you to compromise. It asks you to decide how you'd like your champagne — chilled by the minibar or delivered by a smiling member of our in-room dining team. This is what more looks like.",
    price: 150000,
    priceUSD: 95,
    image: "images/rooms/suite-2.jpg",
    images: ["images/rooms/suite-2.jpg","images/rooms/suite-1.jpg"],
    rating: 4.9,
    reviews: 211,
    guests: 2,
    beds: "King Bed",
    amenities: ["King Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Mini Bar","Room Service","Private Balcony"],
    popular: true,
    newest: false
  },
  {
    id: 4,
    name: "The Magnolia Family Suite",
    type: "Family Suite",
    typeKey: "family",
    tagline: "Space, laughter, and memories in the making",
    description: "The Magnolia Family Suite was built around a simple truth: the best family moments need room to breathe. Two connecting rooms, a shared living area, and enough space for everyone to find their corner — this is where family stories begin.",
    price: 120000,
    priceUSD: 76,
    image: "images/rooms/family-room-1.jpg",
    images: ["images/rooms/family-room-1.jpg","images/rooms/family-room-2.jpg"],
    rating: 4.8,
    reviews: 156,
    guests: 4,
    beds: "2 Queen Beds",
    amenities: ["2 Queen Beds","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Living Area","Kids Amenities"],
    popular: true,
    newest: false
  },
  {
    id: 5,
    name: "The Azure Signature",
    type: "Signature Suite",
    typeKey: "signature",
    tagline: "Where the sky meets your morning coffee",
    description: "Open the curtains in The Azure Signature and you'll understand why guests often miss their breakfast — the view demands your full attention. Floor-to-ceiling windows frame a skyline that changes with every hour of the day.",
    price: 175000,
    priceUSD: 111,
    image: "images/rooms/suite-1.jpg",
    images: ["images/rooms/suite-1.jpg","images/rooms/suite-2.jpg"],
    rating: 4.9,
    reviews: 178,
    guests: 2,
    beds: "King Bed",
    amenities: ["King Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Mini Bar","City View","Private Balcony"],
    popular: true,
    newest: false
  },
  {
    id: 6,
    name: "The Prestige Corner Room",
    type: "Deluxe Room",
    typeKey: "deluxe",
    tagline: "Commanding views, commanding presence",
    description: "Perched on the corner of our premium floor, The Prestige Corner Room offers a dual-aspect view that makes every sunrise feel like it was arranged personally for you. For guests who want more perspective — in every sense.",
    price: 95000,
    priceUSD: 60,
    image: "images/rooms/deluxe-room-2.jpg",
    images: ["images/rooms/deluxe-room-2.jpg","images/rooms/deluxe-room-1.jpg"],
    rating: 4.8,
    reviews: 102,
    guests: 2,
    beds: "King Bed",
    amenities: ["King Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Dual City View","Blackout Curtains"],
    popular: false,
    newest: true
  },
  {
    id: 7,
    name: "The Ember Executive Suite",
    type: "Signature Suite",
    typeKey: "signature",
    tagline: "Designed for those who lead",
    description: "The Ember Executive Suite was designed around the insight that great decisions are rarely made at a desk. You'll find a dedicated workspace, high-speed fibre, a private meeting nook, and enough quiet to think with clarity.",
    price: 200000,
    priceUSD: 127,
    image: "images/rooms/suite-2.jpg",
    images: ["images/rooms/suite-2.jpg","images/rooms/suite-1.jpg"],
    rating: 4.9,
    reviews: 93,
    guests: 2,
    beds: "King Bed",
    amenities: ["King Bed","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Work Desk","Room Service","Mini Bar","City View"],
    popular: false,
    newest: true
  },
  {
    id: 8,
    name: "The Grand Presidential",
    type: "Presidential Suite",
    typeKey: "presidential",
    tagline: "The pinnacle of what luxury feels like",
    description: "There are rooms, and then there is The Grand Presidential. A two-bedroom private residence stretching across our top floor, featuring a private dining room, a butler on call around the clock, and a terrace that makes Lagos look like it belongs to you.",
    price: 450000,
    priceUSD: 286,
    image: "images/rooms/presidential-suite-1.jpg",
    images: ["images/rooms/presidential-suite-1.jpg","images/rooms/presidential-suite-2.jpg"],
    rating: 5.0,
    reviews: 47,
    guests: 4,
    beds: "2 King Beds",
    amenities: ["2 King Beds","Free WiFi","En-suite Bathroom","Smart TV","Air Conditioning","Mini Bar","Room Service","Private Dining","Butler Service","Private Terrace","City View","Blackout Curtains"],
    popular: true,
    newest: false
  }
];

// ============================================================
// STATE
// ============================================================
// ============================================================
// STATE
// ============================================================
let filteredRooms = [...ROOMS_DATA];

// ============================================================
// RENDER ROOMS
// ============================================================
function renderRooms(rooms) {
  const grid = document.getElementById('rooms-grid');
  const countEl = document.getElementById('rooms-count-text');
  const emptyState = document.getElementById('rooms-empty');

  if (!grid) return;

  if (rooms.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.add('visible');
    if (countEl) countEl.innerHTML = `Showing <strong>0</strong> of <strong>${ROOMS_DATA.length}</strong> rooms`;
    return;
  }

  if (emptyState) emptyState.classList.remove('visible');
  if (countEl) countEl.innerHTML = `Showing <strong>${rooms.length}</strong> of <strong>${ROOMS_DATA.length}</strong> rooms`;

  grid.innerHTML = rooms.map(room => `
    <article class="room-listing-card reveal" aria-label="${room.name}">
      <div class="room-listing-img">
        <img src="${room.image}" alt="${room.name} - ${room.type}" loading="lazy">
      </div>
      <div class="room-listing-body">
        <div class="room-listing-top">
          <h3 class="room-listing-name">${room.name}</h3>
          <span class="badge badge-gold">${room.type}</span>
        </div>
        <div class="stars" aria-label="${room.rating} stars">
          ${'★'.repeat(Math.floor(room.rating))}${room.rating % 1 ? '☆' : ''}
          <span style="font-family:var(--font-body);color:var(--text-secondary);margin-left:4px;font-size:0.75rem">(${room.reviews})</span>
        </div>
        <p class="room-listing-desc" style="margin-top:0.5rem">${room.tagline}</p>
        <div class="room-amenity-icons">
          <span class="room-amenity-icon-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            ${room.beds}
          </span>
          <span class="room-amenity-icon-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="5" width="22" height="14" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Free WiFi
          </span>
          <span class="room-amenity-icon-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.5L12 2l10 8.5"/></svg>
            ${room.guests} Guests
          </span>
          <span class="room-amenity-icon-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            AC
          </span>
        </div>
        <div class="room-listing-footer">
          <div class="room-listing-price">
            <span class="amount">₦${room.price.toLocaleString()}</span>
            <span class="per-night">/ night · ~$${room.priceUSD}</span>
          </div>
          <div class="room-listing-actions">
            <a href="room-details.html?id=${room.id}" class="btn btn-outline btn-sm">View Details</a>
            <a href="booking.html?room=${room.id}" class="btn btn-primary btn-sm">Book Now</a>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Re-observe reveals
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    revealObserverInstance && revealObserverInstance.observe(el);
  });
}

// Re-use reveal observer
let revealObserverInstance = null;
if (window.IntersectionObserver) {
  revealObserverInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserverInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
}

// ============================================================
// FILTERS
// ============================================================
function applyFilters() {
  const priceMax = parseInt(document.getElementById('price-max')?.value || 500000);
  const guestMin = parseInt(document.getElementById('filter-guests')?.value || 0);
  const sortVal = document.getElementById('sort-select')?.value || 'popular';

  const checkedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);

  filteredRooms = ROOMS_DATA.filter(room => {
    if (room.price > priceMax) return false;
    if (guestMin > 0 && room.guests < guestMin) return false;
    if (checkedTypes.length > 0 && !checkedTypes.includes(room.typeKey)) return false;
    return true;
  });

  // Sort
  if (sortVal === 'price-asc') filteredRooms.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-desc') filteredRooms.sort((a, b) => b.price - a.price);
  else if (sortVal === 'popular') filteredRooms.sort((a, b) => b.reviews - a.reviews);
  else if (sortVal === 'newest') filteredRooms.sort((a, b) => (b.newest ? 1 : 0) - (a.newest ? 1 : 0));

  renderRooms(filteredRooms);
}

function resetFilters() {
  const priceSlider = document.getElementById('price-max');
  const guestsInput = document.getElementById('filter-guests');
  if (priceSlider) { priceSlider.value = 500000; updatePriceDisplay(); }
  if (guestsInput) guestsInput.value = '';
  document.querySelectorAll('.type-filter').forEach(cb => cb.checked = false);
  applyFilters();
}

// Price slider display
function updatePriceDisplay() {
  const slider = document.getElementById('price-max');
  const display = document.getElementById('price-max-display');
  if (slider && display) {
    const val = parseInt(slider.value);
    display.textContent = '₦' + val.toLocaleString();
    const pct = ((val - 50000) / (500000 - 50000)) * 100;
    slider.style.setProperty('--range-pct', pct + '%');
  }
}

// ============================================================
// URL PARAMS (from hero search)
// ============================================================
function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  const roomType = params.get('roomType');
  const guests = params.get('guests');

  if (roomType) {
    const cb = document.querySelector(`.type-filter[value="${roomType}"]`);
    if (cb) cb.checked = true;
  }
  if (guests) {
    const gi = document.getElementById('filter-guests');
    if (gi) gi.value = guests;
  }
}

// ============================================================
// STICKY BOOK BANNER
// ============================================================
function initStickyBanner() {
  const banner = document.getElementById('sticky-book-banner');
  const hero = document.querySelector('.rooms-page-hero');
  if (!banner || !hero) return;

  banner.style.display = 'block';
  const heroBottom = hero.offsetTop + hero.offsetHeight;

  window.addEventListener('scroll', () => {
    banner.classList.toggle('visible', window.scrollY > heroBottom);
  }, { passive: true });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyURLParams();
  applyFilters();
  initStickyBanner();

  // Price slider
  const priceSlider = document.getElementById('price-max');
  if (priceSlider) {
    priceSlider.addEventListener('input', updatePriceDisplay);
    updatePriceDisplay();
  }

  // Apply filters button
  document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);
  document.getElementById('reset-filters-btn')?.addEventListener('click', resetFilters);

  // Sort select
  document.getElementById('sort-select')?.addEventListener('change', applyFilters);

  // Mobile filter toggle
  document.getElementById('filter-toggle-btn')?.addEventListener('click', () => {
    document.querySelector('.filter-sidebar')?.classList.toggle('mobile-open');
  });

  // Type filter checkboxes live update
  document.querySelectorAll('.type-filter').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // Date validation
  const checkInInput = document.getElementById('filter-checkin');
  const checkOutInput = document.getElementById('filter-checkout');

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);

    checkInInput.addEventListener('change', () => {
      if (checkInInput.value) {
        const checkInDate = new Date(checkInInput.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        const minCheckOut = checkInDate.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOut);
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = minCheckOut;
        }
      }
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOutInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
  }
});

