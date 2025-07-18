document.addEventListener('DOMContentLoaded', () => {
  const searchInputGeneral = document.getElementById('searchGeneral');
  const sidebarButtons = document.querySelectorAll(
    '.profile-button, .employee-button, .payroll-button, .job-button, .calendar-button'
  );
  const logOutButton = document.getElementById('logOutButton');
  const confirmOverlay = document.getElementById('confirmOverlay'); // Make sure you have this in HTML
  const confirmYes = document.getElementById('confirmYes');
  const confirmCancel = document.getElementById('confirmCancel');

  // Sidebar Search Filter
  if (searchInputGeneral) {
    searchInputGeneral.addEventListener('input', () => {
      const searchTerm = searchInputGeneral.value.toLowerCase();

      sidebarButtons.forEach(button => {
        const span = button.querySelector('span');
        if (span) {
          const text = span.textContent.toLowerCase();
          const wrapper = button.closest('a') || button.parentElement;
          if (text.includes(searchTerm)) {
            if (wrapper) wrapper.style.display = '';
          } else {
            if (wrapper) wrapper.style.display = 'none';
          }
        }
      });
    });
  }

  // Logout Confirmation Modal
  if (logOutButton) {
    logOutButton.addEventListener('click', function (event) {
      event.preventDefault();
      if (confirmOverlay) {
        confirmOverlay.style.display = 'flex';
      } else {
        document.querySelector('form')?.submit(); // fallback
      }
    });
  }

  if (confirmYes) {
    confirmYes.addEventListener('click', function () {
      document.querySelector('form')?.submit();
    });
  }

  if (confirmCancel) {
    confirmCancel.addEventListener('click', function () {
      if (confirmOverlay) confirmOverlay.style.display = 'none';
    });
  }

  // Highlight Active Sidebar Button
  const buttons = {
    dashboard: '.profile-button',
    management: '.employee-button',
    payroll: '.payroll-button',
    job: '.job-button',
    calendar: '.calendar-button',
    login: '.log-out-button',
  };

  // Remove existing active classes
  document.querySelectorAll(Object.values(buttons).join(',')).forEach(btn => {
    if (btn) btn.classList.remove('active');
  });

  // Get current page (e.g., job.html)
  const currentPage = window.location.pathname.toLowerCase().split('/').pop();

  for (const key in buttons) {
    if (currentPage.includes(key)) {
      const btn = document.querySelector(buttons[key]);
      if (btn) btn.classList.add('active');
      break;
    }
  }
});
