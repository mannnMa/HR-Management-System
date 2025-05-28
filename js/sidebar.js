const searchInputGeneral = document.getElementById('searchGeneral');
const sidebarButtons = document.querySelectorAll('.sidebar button');

//
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
