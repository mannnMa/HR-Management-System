const addEmployeeBtn = document.getElementById('add-employee-button-js');
const employeeTableBody = document.getElementById('employee-table-body-js');
const searchInput = document.getElementById('employeeSearch');

// Load saved data on page load
window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('employees')) || [];
  savedData.forEach(values => {
    if (values.some(v => v.trim() !== '')) {
      addEmployeeRow(values);
    }
  });

  // Check if an add row was left open
  const addRowExists = localStorage.getItem('addRowInProgress');
  if (addRowExists === 'true') {
    addInputRow();
  }
});

addEmployeeBtn.addEventListener('click', () => {
  if (document.querySelector('.add-row')) return;  // prevent multiple add rows
  addInputRow();
});

// Function to create an input row
function addInputRow() {
  const row = document.createElement('tr');
  row.classList.add('add-row');
  row.innerHTML = `
    <td><input class="id-input" type="text" placeholder="ID"></td>
    <td><input class="name-input" type="text" placeholder="Name"></td>
    <td><input class="position-input" type="text" placeholder="Position"></td>
    <td><input class="dept-input" type="text" placeholder="Department"></td>
    <td><input class="address-input" type="text" placeholder="Address"></td>
    <td><input class="contact-input" type="text" placeholder="Contact"></td>
    <td><button class="action-button">Save</button></td>
  `;
  employeeTableBody.appendChild(row);

  // Set flag to remember the add row exists
  localStorage.setItem('addRowInProgress', 'true');

  const saveBtn = row.querySelector('.action-button');
  saveBtn.addEventListener('click', () => {
    const inputs = row.querySelectorAll('input');
    const values = Array.from(inputs).map(input => input.value.trim());

    if (values.some(v => v === '')) {
      alert('Please fill in all fields.');
      return;
    }

    addEmployeeRow(values);

    // Save to localStorage
    const allRows = getAllEmployeeData();
    localStorage.setItem('employees', JSON.stringify(allRows));

    // Remove the add row flag
    localStorage.removeItem('addRowInProgress');

    // Remove the input row
    employeeTableBody.removeChild(row);
  });
}

// Function to add a display row
function addEmployeeRow(values) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${values[0]}</td>
    <td>${values[1]}</td>
    <td>${values[2]}</td>
    <td>${values[3]}</td>
    <td>${values[4]}</td>
    <td>${values[5]}</td>
    <td class="action-cell">
      <div class="action-row-buttons">
        <button class="edit-button">
          <img class="edit-icon" src="assets/edit-icon.svg" alt="Edit">  
        </button>
        <button class="delete-button">
          <img class="delete-icon" src="assets/delete-icon.svg" alt="Delete">
        </button>
      </div>
    </td>
  `;

  const editBtn = newRow.querySelector('.edit-button');
  const deleteBtn = newRow.querySelector('.delete-button');

  // EDIT FUNCTIONALITY
  function handleEdit() {
    const cells = newRow.querySelectorAll('td');
    const originalValues = Array.from(cells).slice(0, 6).map(cell => cell.textContent);

    for (let i = 0; i < 6; i++) {
      cells[i].innerHTML = `<input type="text" class="edit-input" value="${originalValues[i]}">`;
    }

    editBtn.textContent = 'Save';
    editBtn.classList.remove('edit-button');
    editBtn.classList.add('edit-save-button');

    deleteBtn.style.display = 'none';

    editBtn.removeEventListener('click', handleEdit);
    editBtn.addEventListener('click', handleSave);
  }

  function handleSave() {
    const inputs = newRow.querySelectorAll('input');
    const updatedValues = Array.from(inputs).map(input => input.value.trim());

    if (updatedValues.some(v => v === '')) {
      alert('Please fill in all fields.');
      return;
    }

    const cells = newRow.querySelectorAll('td');
    for (let i = 0; i < 6; i++) {
      cells[i].textContent = updatedValues[i];
    }

    editBtn.innerHTML = `<img class="edit-icon" src="assets/edit-icon.svg" alt="Edit">`;
    editBtn.classList.remove('edit-save-button');
    editBtn.classList.add('edit-button');

    deleteBtn.style.display = '';

    const updatedRows = getAllEmployeeData();
    localStorage.setItem('employees', JSON.stringify(updatedRows));

    editBtn.removeEventListener('click', handleSave);
    editBtn.addEventListener('click', handleEdit);
  }

  editBtn.addEventListener('click', handleEdit);

  // DELETE FUNCTIONALITY
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this employee?')) {
      newRow.remove();
      const updatedRows = getAllEmployeeData();
      localStorage.setItem('employees', JSON.stringify(updatedRows));
    }
  });

  employeeTableBody.appendChild(newRow);
}

// Helper to collect all employee data from table
function getAllEmployeeData() {
  const rows = employeeTableBody.querySelectorAll('tr');
  const data = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 6) {
      const rowData = [
        cells[0].textContent.trim(),
        cells[1].textContent.trim(),
        cells[2].textContent.trim(),
        cells[3].textContent.trim(),
        cells[4].textContent.trim(),
        cells[5].textContent.trim()
      ];
      if (rowData.some(v => v !== '')) {
        data.push(rowData);
      }
    }
  });
  return data;
}

// Search functionality (by ID)
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = employeeTableBody.querySelectorAll('tr');

  rows.forEach(row => {
    const idCell = row.querySelector('td:nth-child(1)');
    if (idCell) {
      const idText = idCell.textContent.toLowerCase();
      row.style.display = idText.includes(searchTerm) ? '' : 'none';
    }
  });
});



