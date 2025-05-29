const searchInputGeneral = document.getElementById('searchGeneral');
const sidebarButtons = document.querySelectorAll(
  '.employee-button, .payroll-button, .job-button, .calendar-button'
);
const logOutButton = document.getElementById('logOutButton');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmYes = document.getElementById('confirmYes');
const confirmCancel = document.getElementById('confirmCancel');

//search funtionality for general button search input
searchInputGeneral.addEventListener('input', () => {
  const searchTerm = searchInputGeneral.value.toLowerCase();

  sidebarButtons.forEach(button => {
    const span = button.querySelector('span');
    if (span) {
      const text = span.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        button.style.display = '';
      } else {
        button.style.display = 'none';
      }
    }
  });
});

// Show the confirmation modal when log out button is clicked
logOutButton.addEventListener('click', function (event) {
  event.preventDefault(); 
  confirmOverlay.style.display = 'flex'; 
});

// Confirm button → submit the form
confirmYes.addEventListener('click', function () {
  document.querySelector('form').submit();
});

// Cancel button → close modal
confirmCancel.addEventListener('click', function () {
  confirmOverlay.style.display = 'none';
});