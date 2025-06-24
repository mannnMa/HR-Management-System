document.addEventListener('DOMContentLoaded', () => {
  const searchInputGeneral = document.getElementById('searchGeneral');
  const sidebarButtons = document.querySelectorAll(
    '.profile-button, .payslip-button, .report-button'
  );
  const logOutButton = document.getElementById('logOutButton');
  const confirmOverlay = document.getElementById('confirmOverlay'); // Make sure this exists in your HTML
  const confirmYes = document.getElementById('confirmYes');
  const confirmCancel = document.getElementById('confirmCancel');

  // Search functionality for sidebar buttons
  if (searchInputGeneral) {
    searchInputGeneral.addEventListener('input', () => {
      const searchTerm = searchInputGeneral.value.toLowerCase();

      sidebarButtons.forEach(button => {
        const span = button.querySelector('span');
        if (span) {
          const text = span.textContent.toLowerCase();
          const wrapper = button.closest('a') || button.parentElement;
          if (text.includes(searchTerm)) {
            wrapper.style.display = '';
          } else {
            wrapper.style.display = 'none';
          }
        }
      });
    });
  }

  // Show confirmation modal on logout
  if (logOutButton) {
    logOutButton.addEventListener('click', function (event) {
      event.preventDefault();
      if (confirmOverlay) {
        confirmOverlay.style.display = 'flex';
      } else {
        // fallback if modal doesn't exist — just submit
        document.querySelector('form')?.submit();
      }
    });
  }

  // Confirm logout
  if (confirmYes) {
    confirmYes.addEventListener('click', function () {
      const form = document.querySelector('form');
      if (form) form.submit();
    });
  }

  // Cancel logout
  if (confirmCancel) {
    confirmCancel.addEventListener('click', function () {
      if (confirmOverlay) confirmOverlay.style.display = 'none';
    });
  }

  // Active link highlighting
  const pageMap = {
    dashboard: '.profile-button',
    payslip: '.payslip-button',
    repfeed: '.report-button',
    login: '.log-out-button',
  };

  // Clear existing active classes
  document.querySelectorAll(Object.values(pageMap).join(',')).forEach(btn => {
    btn.classList.remove('active');
  });

  // Get current page from URL
  const currentPage = window.location.pathname.toLowerCase().split('/').pop();

  for (const key in pageMap) {
    if (currentPage.includes(key)) {
      const btn = document.querySelector(pageMap[key]);
      if (btn) btn.classList.add('active');
      break;
    }
  }
});
