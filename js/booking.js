/* ============================================================
   TOMMY'S HOTEL — BOOKING.JS
   Form validation, date picker, payment toggle, success modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // PRE-FILL FROM URL PARAMS
  // ============================================================
  const params = new URLSearchParams(window.location.search);
  const roomId = parseInt(params.get('room')) || 3;
  const checkIn = params.get('checkIn') || '';
  const checkOut = params.get('checkOut') || '';
  const guests = params.get('guests') || '1';

  // Default dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const adultsInput = document.getElementById('adults');

  if (checkinInput) { checkinInput.value = checkIn || today; checkinInput.min = today; }
  if (checkoutInput) { checkoutInput.value = checkOut || tomorrow; checkoutInput.min = tomorrow; }
  if (adultsInput) adultsInput.value = guests;

  // ============================================================
  // ROOM DATA (same source as rooms.js)
  // ============================================================
  const ROOMS_QUICK = [
    { id: 1, name: "The Harmony Deluxe", price: 85000, image: "images/rooms/deluxe-room-1.jpg" },
    { id: 2, name: "The Serenity Studio", price: 65000, image: "images/rooms/suite-1.jpg" },
    { id: 3, name: "The Indulgence Suite", price: 150000, image: "images/rooms/suite-2.jpg" },
    { id: 4, name: "The Magnolia Family Suite", price: 120000, image: "images/rooms/family-room-1.jpg" },
    { id: 5, name: "The Azure Signature", price: 175000, image: "images/rooms/suite-1.jpg" },
    { id: 6, name: "The Prestige Corner Room", price: 95000, image: "images/rooms/deluxe-room-2.jpg" },
    { id: 7, name: "The Ember Executive Suite", price: 200000, image: "images/rooms/suite-2.jpg" },
    { id: 8, name: "The Grand Presidential", price: 450000, image: "images/rooms/presidential-suite-1.jpg" }
  ];

  const room = ROOMS_QUICK.find(r => r.id === roomId) || ROOMS_QUICK[2];

  // ============================================================
  // UPDATE ORDER SUMMARY
  // ============================================================
  function updateOrderSummary() {
    const ci = checkinInput?.value;
    const co = checkoutInput?.value;
    const adults = parseInt(adultsInput?.value || 1);
    const children = parseInt(document.getElementById('children')?.value || 0);

    let nights = 1;
    if (ci && co) {
      const diff = (new Date(co) - new Date(ci)) / 86400000;
      if (diff > 0) nights = Math.round(diff);
    }

    const roomTotal = room.price * nights;
    const taxes = Math.round(roomTotal * 0.075);
    const serviceCharge = 15000;
    const total = roomTotal + taxes + serviceCharge;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    setEl('summary-room-name', room.name);
    setEl('summary-nights', `${nights} night${nights !== 1 ? 's' : ''}`);
    setEl('summary-guests', `${adults} adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}`);
    setEl('summary-checkin', ci ? new Date(ci).toLocaleDateString('en-NG', {weekday:'short',day:'numeric',month:'short',year:'numeric'}) : '—');
    setEl('summary-checkout', co ? new Date(co).toLocaleDateString('en-NG', {weekday:'short',day:'numeric',month:'short',year:'numeric'}) : '—');
    setEl('summary-room-price', `₦${roomTotal.toLocaleString()}`);
    setEl('summary-taxes', `₦${taxes.toLocaleString()}`);
    setEl('summary-service', `₦${serviceCharge.toLocaleString()}`);
    setEl('summary-total', `₦${total.toLocaleString()}`);

    const imgEl = document.getElementById('summary-room-img');
    if (imgEl) {
      imgEl.src = room.image;
      imgEl.alt = room.name;
    }
  }

  updateOrderSummary();
  checkinInput?.addEventListener('change', updateOrderSummary);
  checkoutInput?.addEventListener('change', updateOrderSummary);
  adultsInput?.addEventListener('change', updateOrderSummary);
  document.getElementById('children')?.addEventListener('change', updateOrderSummary);

  // Date logic
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', () => {
      const min = new Date(checkinInput.value);
      min.setDate(min.getDate() + 1);
      const minStr = min.toISOString().split('T')[0];
      checkoutInput.min = minStr;
      if (checkoutInput.value <= checkinInput.value) checkoutInput.value = minStr;
    });
  }

  // ============================================================
  // PAYMENT METHOD TOGGLE
  // ============================================================
  const paymentBtns = document.querySelectorAll('.payment-method-btn');
  const cardPanel = document.getElementById('card-panel');
  const bankPanel = document.getElementById('bank-panel');

  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const method = btn.dataset.method;
      if (cardPanel) cardPanel.classList.toggle('active', method === 'card');
      if (bankPanel) bankPanel.classList.toggle('active', method === 'bank');
    });
  });

  // ============================================================
  // CARD NUMBER FORMATTING
  // ============================================================
  const cardNumberInput = document.getElementById('card-number');
  const cardDisplay = document.getElementById('card-number-display');
  const cardHolderInput = document.getElementById('card-holder');
  const cardHolderDisplay = document.getElementById('card-holder-display');

  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
      if (cardDisplay) {
        cardDisplay.textContent = val.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
      }
    });
  }

  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', () => {
      if (cardHolderDisplay) {
        cardHolderDisplay.textContent = cardHolderInput.value || 'CARDHOLDER NAME';
      }
    });
  }

  // Expiry formatting
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
      e.target.value = val;
    });
  }

  // ============================================================
  // PROMO CODE
  // ============================================================
  document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
    const promoInput = document.getElementById('promo-code');
    const promoMsg = document.getElementById('promo-message');
    if (!promoInput || !promoMsg) return;

    const validCodes = ['TOMMY10', 'WELCOME', 'LUXURY20'];
    if (validCodes.includes(promoInput.value.trim().toUpperCase())) {
      promoMsg.textContent = '✓ Promo code applied! 10% discount added.';
      promoMsg.style.color = 'var(--color-success)';
    } else {
      promoMsg.textContent = '✗ Invalid promo code.';
      promoMsg.style.color = 'var(--color-error)';
    }
    promoMsg.style.display = 'block';
    setTimeout(() => { promoMsg.style.display = 'none'; }, 3000);
  });

  // ============================================================
  // FORM VALIDATION
  // ============================================================
  const form = document.getElementById('booking-form');

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (field) field.classList.add('error');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('visible'); }
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (field) field.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
  }

  function validateField(fieldId, condition, message) {
    if (!condition) { showError(fieldId, message); return false; }
    clearError(fieldId); return true;
  }

  function validateForm() {
    let valid = true;
    const fullName = document.getElementById('full-name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();

    valid &= validateField('full-name', fullName && fullName.length >= 2, 'Please enter your full name.');
    valid &= validateField('email', email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.');
    valid &= validateField('phone', phone && phone.length >= 8, 'Please enter a valid phone number.');

    const ci = checkinInput?.value;
    const co = checkoutInput?.value;
    valid &= validateField('checkin', ci, 'Please select a check-in date.');
    valid &= validateField('checkout', co && co > ci, 'Check-out must be after check-in.');

    // Payment validation
    const activeMethod = document.querySelector('.payment-method-btn.active')?.dataset.method;
    if (activeMethod === 'card') {
      const cn = cardNumberInput?.value.replace(/\s/g, '');
      const exp = expiryInput?.value;
      const cvv = document.getElementById('card-cvv')?.value;
      const ch = cardHolderInput?.value.trim();
      valid &= validateField('card-number', cn && cn.length === 16, 'Please enter a valid 16-digit card number.');
      valid &= validateField('card-expiry', exp && exp.length === 5, 'Please enter a valid expiry (MM/YY).');
      valid &= validateField('card-cvv', cvv && cvv.length >= 3, 'Please enter a valid CVV.');
      valid &= validateField('card-holder', ch && ch.length >= 2, 'Please enter the cardholder name.');
    }

    return !!valid;
  }

  // Live validation
  ['full-name','email','phone','checkin','checkout','card-number','card-expiry','card-cvv','card-holder'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', () => {
      const el = document.getElementById(id);
      if (el && el.value.trim()) clearError(id);
    });
  });

  // ============================================================
  // SUBMIT
  // ============================================================
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate booking ref
    const ref = 'TH' + Date.now().toString(36).toUpperCase().slice(-8);
    const refEl = document.getElementById('booking-ref-number');
    if (refEl) refEl.textContent = ref;

    // Show success modal
    document.getElementById('success-modal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Modal close actions
  document.getElementById('modal-view-bookings')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  document.getElementById('modal-return-home')?.addEventListener('click', () => {
    document.getElementById('success-modal')?.classList.remove('active');
    document.body.style.overflow = '';
    window.location.href = 'index.html';
  });

});
