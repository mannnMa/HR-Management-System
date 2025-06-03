document.addEventListener('DOMContentLoaded', () => {
    const searchInputGeneral = document.getElementById('searchGeneral');
    const sidebarButtons = document.querySelectorAll(
      '.employee-button, .payroll-button, .job-button, .calendar-button'
    );
    const logOutButton = document.getElementById('logOutButton');
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmYes = document.getElementById('confirmYes');
    const confirmCancel = document.getElementById('confirmCancel');
    const btn = document.querySelector('.payroll-button');
    
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
              if (wrapper) wrapper.style.display = '';
            } else {
              if (wrapper) wrapper.style.display = 'none';
            }
          }
        });
      });
    }

    // Show the confirmation modal when log out button is clicked
    if (logOutButton) {
      logOutButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (confirmOverlay) {
          confirmOverlay.style.display = 'flex';
        }
      });
    }

    // Confirm button - submit the form
    if (confirmYes) {
      confirmYes.addEventListener('click', function () {
        const form = document.querySelector('form');
        if (form) form.submit();
      });
    }

    // Cancel button - close modal
    if (confirmCancel) {
      confirmCancel.addEventListener('click', function () {
        if (confirmOverlay) confirmOverlay.style.display = 'none';
      });
    }

    // Highlight the active sidebar button based on the current URL path
    const buttons = {
      management: '.employee-button',
      payroll: '.payroll-button',
      job: '.job-button',
      calendar: '.calendar-button',
      login: '.log-out-button',
    };

    // Remove any existing active classes
    document.querySelectorAll(Object.values(buttons).join(',')).forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    // Get the last segment of the URL path (e.g., calendar.html)
    const pathSegments = window.location.pathname.toLowerCase().split('/');
    const currentPage = pathSegments[pathSegments.length - 1];

    // Match the page keyword to a button
    for (const key in buttons) {
      if (currentPage.includes(key)) {
        const btn = document.querySelector(buttons[key]);
        if (btn) btn.classList.add('active');
        break;
      }
    }
  });