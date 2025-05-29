const searchInputGeneral = document.getElementById('searchGeneral');
const sidebarButtons = document.querySelectorAll(
  '.employee-button, .payroll-button, .job-button, .calendar-button'
);

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
