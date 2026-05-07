/* ============================================================
   TOMMY'S HOTEL — FOOTER.JS
   Shared footer component fetched from footer.html
   ============================================================ */

(function () {
  const root = document.getElementById('footer-root');
  if (!root) return;

  // Fetch the footer template
  fetch('footer.html')
    .then(response => response.text())
    .then(html => {
      root.innerHTML = html;
      
      // Update the year
      const yearSpan = document.getElementById('footer-year');
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
      
      // Initialize newsletter form
      initFooterNewsletter();
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });

  function initFooterNewsletter() {
    const footerForm = document.getElementById('footer-newsletter-form');
    if (footerForm) {
      footerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = document.getElementById('footer-email-input');
        if (input && input.value.trim()) {
          footerForm.style.display = 'none';
          const msg = document.getElementById('footer-newsletter-success');
          if (msg) msg.style.display = 'block';
          
          // Optional: Add some animation or toast
          console.log('Newsletter subscription for:', input.value.trim());
        }
      });
    }
  }
})();
