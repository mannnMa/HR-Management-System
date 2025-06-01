const searchInputGeneral = document.getElementById('searchGeneral');
const sidebarButtons = document.querySelectorAll(
  '.employee-button, .payroll-button, .job-button, .calendar-button'
);
const logOutButton = document.getElementById('logOutButton');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmYes = document.getElementById('confirmYes');
const confirmCancel = document.getElementById('confirmCancel');

// search functionality for general button search input
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

// Show the confirmation modal when log out button is clicked
logOutButton.addEventListener('click', function (event) {
  event.preventDefault(); 
  if (confirmOverlay) {
    confirmOverlay.style.display = 'flex'; 
  }
});

// Confirm button - submit the form
if (confirmYes) {
  confirmYes.addEventListener('click', function () {
    document.querySelector('form').submit();
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

document.querySelectorAll(Object.values(buttons).join(',')).forEach(btn => btn.classList.remove('active'));

const pathname = window.location.pathname.toLowerCase();

for (const key in buttons) {
  if (pathname.includes(key)) {
    const btn = document.querySelector(buttons[key]);
    if (btn) btn.classList.add('active');
    break;
  }
}
