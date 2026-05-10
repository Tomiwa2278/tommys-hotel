/* ============================================================
   TOMMY'S HOTEL — DASHBOARD.JS
   Tab switching, bookings, profile, notifications, loyalty
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // USER DATA
  // ============================================================
  const userRole = localStorage.getItem('tommy-user-role') || 'user';
  const userName = localStorage.getItem('tommy-user-name') || 'Staff User';
  const userEmail = localStorage.getItem('tommy-user-email') || 'staff@tommyshotel.com';

  const isAuthorized = userRole === 'admin' || userRole === 'staff';
  const isStaffDashboard = window.location.pathname.includes('staff-dashboard.html');
  const isDashboard = window.location.pathname.includes('dashboard.html') && !isStaffDashboard;

  if ((isDashboard || isStaffDashboard) && !isAuthorized) {
    window.location.href = 'admin-auth.html';
    return;
  }

  // Double check role-based access to specific files
  if (isDashboard && userRole !== 'admin') {
    window.location.href = 'staff-dashboard.html';
    return;
  }
  if (isStaffDashboard && userRole === 'admin') {
    window.location.href = 'dashboard.html';
    return;
  }

  // Handle Role Badges and Admin-Only elements
  const roleBadge = document.getElementById('sidebar-role-badge');
  if (roleBadge) {
    roleBadge.textContent = userRole === 'admin' ? 'System Administrator' : 'Hotel Staff';
  }

  const avatarInitials = document.getElementById('sidebar-avatar-initials');
  if (avatarInitials && userName) {
    avatarInitials.textContent = userName.substring(0, 2).toUpperCase();
  }

  if (userRole !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }

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

    // Persist tab
    localStorage.setItem('tommy-active-tab', tabId);
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Default tab or persisted tab
  const savedTab = localStorage.getItem('tommy-active-tab') || 'overview';
  switchTab(savedTab);

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
  // BOOKING MANAGEMENT
  // ============================================================
  function getBookings() {
    const local = localStorage.getItem('tommy-bookings');
    return local ? JSON.parse(local) : [];
  }

  function renderBookings() {
    const listContainer = document.querySelector('.bookings-list');
    if (!listContainer) return;

    // Clear existing static items but keep a few as defaults if nothing in storage? 
    // Actually, user wants to see their new bookings, so let's merge or just show all.
    const bookings = getBookings();
    
    // Update Stat mini card
    const activeCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length;
    const statEl = document.getElementById('stat-active-bookings');
    if (statEl) statEl.textContent = 24 + activeCount; // Base 24 + dynamic ones

    if (bookings.length === 0) return;

    // Prepend new bookings to the list
    bookings.sort((a, b) => new Date(b.dateBooked) - new Date(a.dateBooked)).forEach(b => {
      const card = document.createElement('div');
      card.className = 'booking-row-card';
      card.innerHTML = `
          <div class="booking-row-info">
              <h3 class="booking-row-name">${b.roomName}</h3>
              <div class="booking-row-meta">
                  <span style="color:var(--color-secondary); font-weight:600;">Guest: ${b.guestName || 'Anonymous'}</span>
                  <span>·</span>
                  <span>Ref: ${b.ref}</span>
                  <span>·</span>
                  <span>${new Date(b.checkIn).toLocaleDateString('en-NG', {month:'short', day:'numeric'})} - ${new Date(b.checkOut).toLocaleDateString('en-NG', {month:'short', day:'numeric', year:'numeric'})}</span>
              </div>
              <div class="booking-row-contact" style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 0.5rem;">
                <span>📧 ${b.guestEmail || 'N/A'}</span> <span style="margin: 0 8px;">|</span> <span>📱 ${b.guestPhone || 'N/A'}</span>
              </div>
              <span class="badge badge-${b.status === 'Confirmed' ? 'success' : b.status === 'Cancelled' ? 'error' : 'gold'}">${b.status === 'Pending' ? 'Pending Payment' : b.status}</span>
          </div>
          <div class="booking-row-actions">
              <div class="booking-row-price">₦${parseInt(b.price).toLocaleString()}</div>
              
              <div class="booking-action-buttons" style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
                  <button class="btn btn-outline btn-sm view-receipt-btn" data-ref="${b.ref}">View Receipt</button>
                  
                  ${b.status === 'Pending' && (userRole === 'admin' || userRole === 'staff') ? `
                      <button class="btn btn-primary btn-sm confirm-payment-btn" data-ref="${b.ref}">Confirm Payment</button>
                  ` : ''}

                  ${b.status !== 'Cancelled' ? `
                      <button class="btn btn-outline btn-sm modify-booking-btn" data-ref="${b.ref}">Modify</button>
                      <button class="btn btn-outline btn-sm cancel-booking-btn" data-ref="${b.ref}" style="color: var(--color-error); border-color: rgba(220,53,69,0.3);">
                        ${b.status === 'Pending' ? 'Decline / Cancel' : 'Cancel Booking'}
                      </button>
                  ` : ''}
              </div>
          </div>
      `;
      listContainer.prepend(card);
    });

    // Re-attach listeners for new buttons
    attachBookingListeners();
  }

  function attachBookingListeners() {
    document.querySelectorAll('.confirm-payment-btn').forEach(btn => {
      btn.onclick = () => {
        const ref = btn.dataset.ref;
        const bookings = getBookings();
        const target = bookings.find(b => b.ref === ref);
        if (target) {
          target.status = 'Confirmed';
          localStorage.setItem('tommy-bookings', JSON.stringify(bookings));
          showToast(`Payment confirmed for ${ref}. Booking is now Active.`, 'success');
          setTimeout(() => location.reload(), 1500);
        }
      };
    });

    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.onclick = () => {
        const ref = btn.dataset.ref;
        const bookings = getBookings();
        const target = bookings.find(b => b.ref === ref);
        
        const confirmMsg = target?.status === 'Pending' 
          ? 'Decline this booking? (Payment not received)' 
          : 'Are you sure you want to cancel this booking?';

        if (confirm(confirmMsg)) {
          if (target) {
            target.status = 'Cancelled';
            localStorage.setItem('tommy-bookings', JSON.stringify(bookings));
            showToast(`Booking ${ref} has been cancelled.`, 'info');
            setTimeout(() => location.reload(), 1500);
          }
        }
      };
    });

    document.querySelectorAll('.view-receipt-btn').forEach(btn => {
      btn.onclick = () => {
        const ref = btn.dataset.ref;
        alert(`Booking Reference: ${ref}\n\nA receipt has been sent to your email address.`);
      };
    });

    document.querySelectorAll('.modify-booking-btn').forEach(btn => {
      btn.onclick = () => {
        const ref = btn.dataset.ref;
        const newDate = prompt(`Modify Booking ${ref}\nEnter new Check-in date (YYYY-MM-DD):`);
        if (newDate) {
          const bookings = getBookings();
          const target = bookings.find(b => b.ref === ref);
          if (target) {
            target.checkIn = newDate;
            localStorage.setItem('tommy-bookings', JSON.stringify(bookings));
            showToast(`Booking ${ref} modified successfully!`, 'success');
            setTimeout(() => location.reload(), 1200);
          }
        }
      };
    });
  }

  renderBookings();
  
  // Static view receipt buttons (fallback for items already in HTML)
  document.querySelectorAll('.view-receipt-btn').forEach(btn => {
    if (!btn.onclick) {
      btn.addEventListener('click', () => {
        const ref = btn.dataset.ref || 'TH-STATIC';
        alert(`Booking Reference: ${ref}\n\nA receipt has been sent to your email address.`);
      });
    }
  });

  // ============================================================
  // STAFF DIRECTORY & ASSIGNMENT (Admin Only)
  // ============================================================
  
  // Default staff data if empty
  const defaultStaff = [
    { id: 1, name: 'Tomiwa Tommy', role: 'Admin', dept: 'Management', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', role: 'Staff', dept: 'Front Desk', status: 'Active' },
    { id: 3, name: 'Michael Chen', role: 'Staff', dept: 'Security', status: 'On Leave' }
  ];

  function getStaffList() {
    const data = localStorage.getItem('tommy-staff-list');
    return data ? JSON.parse(data) : defaultStaff;
  }

  function saveStaffList(list) {
    localStorage.setItem('tommy-staff-list', JSON.stringify(list));
  }

  function renderStaffList() {
    const tbody = document.querySelector('#staff-directory-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const staff = getStaffList();
    const statuses = ['Active', 'On Leave', 'Suspended', 'Terminated'];
    
    staff.forEach(person => {
      let badgeClass = 'badge-muted';
      if (person.status === 'Active') badgeClass = 'badge-success';
      if (person.status === 'On Leave') badgeClass = 'badge-gold';
      if (person.status === 'Suspended') badgeClass = 'badge-error';

      const optionsHtml = statuses.map(s => `<option value="${s}" ${s === person.status ? 'selected' : ''}>${s}</option>`).join('');

      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${person.name}</td>
          <td>${person.role}</td>
          <td>${person.dept}</td>
          <td><span class="badge ${badgeClass}">${person.status}</span></td>
          <td>
             <select class="form-control" style="width: auto; min-width: 130px; padding: 0.3rem 0.8rem; font-size: var(--text-sm); min-height: auto;" onchange="window.updateStaffStatus(${person.id}, this.value)">
                ${optionsHtml}
             </select>
          </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Global function for the inline onchange handler
  window.updateStaffStatus = function(id, newStatus) {
    const staff = getStaffList();
    const person = staff.find(s => s.id === id);
    if (person) {
      person.status = newStatus;
      saveStaffList(staff);
      renderStaffList();
    }
  };

  // Initial render
  if (userRole === 'admin') {
     renderStaffList();
  }

  const assignStaffForm = document.getElementById('assign-staff-form');
  assignStaffForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const staffName = document.getElementById('staff-name')?.value;
    const staffEmail = document.getElementById('staff-email')?.value;
    const staffRoleSelect = document.getElementById('staff-role');
    const staffRoleText = staffRoleSelect ? staffRoleSelect.options[staffRoleSelect.selectedIndex].text : 'Staff';
    const staffDept = document.getElementById('staff-dept')?.value || 'General';

    if (staffName && staffEmail) {
      const saveMsg = document.getElementById('staff-assign-msg');
      if (saveMsg) {
        saveMsg.style.display = 'inline';
        setTimeout(() => {
          saveMsg.style.display = 'none';
          assignStaffForm.reset();
        }, 3000);
      }
      
      const staffList = getStaffList();
      const newId = staffList.length ? Math.max(...staffList.map(s => s.id)) + 1 : 1;
      const displayRole = staffRoleText.split(' ').pop(); 
      
      staffList.push({
        id: newId,
        name: staffName,
        role: displayRole,
        dept: staffDept,
        status: 'Active'
      });
      
      saveStaffList(staffList);
      renderStaffList();
      
      console.log(`New Staff Assigned: ${staffName} (${staffEmail}) as ${staffRoleText}`);
    }
  });

  // Profile form save
  const profileForm = document.getElementById('profile-form');
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('profile-fullname')?.value.trim();
    if (nameVal) localStorage.setItem('tommy-user-name', nameVal.split(' ')[0]);

    const saveMsg = document.getElementById('profile-save-msg');
    if (saveMsg) {
      saveMsg.style.display = 'inline';
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
    localStorage.removeItem('tommy-user-role');
    localStorage.removeItem('tommy-is-admin');
    window.location.href = 'admin-auth.html';
  });

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notif toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-msg">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============================================================
  // OVERVIEW ACTIONS (Admin & Staff)
  // ============================================================
  
  const detailsModal = document.getElementById('booking-details-modal');

  // Admin: View Upcoming Details
  document.getElementById('view-upcoming-details')?.addEventListener('click', () => {
    detailsModal?.classList.add('active');
  });

  // Close Modals
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detailsModal?.classList.remove('active');
    });
  });

  // Close on overlay click
  detailsModal?.addEventListener('click', (e) => {
    if (e.target === detailsModal) detailsModal.classList.remove('active');
  });

  // Admin: Manage Upcoming Stay
  document.getElementById('manage-upcoming-stay')?.addEventListener('click', () => {
    showToast('Navigating to Reservations...', 'info');
    setTimeout(() => switchTab('bookings'), 500);
  });

  // Modal: Manage Button
  document.getElementById('modal-manage-btn')?.addEventListener('click', () => {
    detailsModal?.classList.remove('active');
    setTimeout(() => switchTab('bookings'), 300);
  });

  // Staff: Check In
  document.querySelectorAll('.check-in-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const guestName = row?.cells[0].textContent;
      btn.textContent = 'Checked In';
      btn.disabled = true;
      btn.className = 'btn btn-success btn-sm';
      showToast(`Guest ${guestName} checked in!`, 'success');
    });
  });

  // Staff: Notify Housekeeping
  document.querySelectorAll('.notify-hk-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const roomName = row?.cells[1].textContent;
      btn.textContent = 'Notified';
      btn.disabled = true;
      showToast(`Housekeeping alerted for ${roomName}`, 'info');
    });
  });

});
