const addEmployeeBtn = document.getElementById('add-employee-button-js');
const employeeTableBody = document.getElementById('employee-table-body-js');
const searchInput = document.getElementById('employeeSearch');

// Load saved data from localStorage on page load
window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('employees')) || [];
  savedData.forEach(values => {
    if (values.some(v => v.trim() !== '')) {
      addEmployeeRow(values);
    }
  });

  sortTableRows(); // Sort the table after loading data

  const addRowExists = localStorage.getItem('addRowInProgress');
  if (addRowExists === 'true') {
    addInputRow();
  }
});

// Add employee button event listener
addEmployeeBtn.addEventListener('click', () => {
  if (document.querySelector('.add-row')) return; // Prevent multiple add rows
  addInputRow();
});

// Function to add an input row for adding a new employee
function addInputRow() {
  const row = document.createElement('tr');
  row.classList.add('add-row');
  row.innerHTML = `
    <td><input class="id-input" type="text" placeholder="ID" minlength="1" maxlength="6"></td>
    <td><input class="name-input" type="text" placeholder="Name"></td>
    <td><input class="position-input" type="text" placeholder="Position"></td>
    <td><input class="dept-input" type="text" placeholder="Department"></td>
    <td><input class="address-input" type="text" placeholder="Address"></td>
    <td><input class="contact-input" type="text" placeholder="Contact" maxlength="10"></td>
    <td>
    <div class="action-row-buttons">
      <button class="action-button save-button">Save</button>
      <button class="cancel-add-button">
        <img src="../../assets/cancel-icon.svg" alt="cancel">
      </button> 
    </div>
    </td>
  `;
  employeeTableBody.insertBefore(row, employeeTableBody.firstChild);

  const saveBtn = row.querySelector('.save-button');
  const cancelBtn = row.querySelector('.cancel-add-button'); // Select cancel button

  // Save button event listener for adding a new employee
  saveBtn.addEventListener('click', () => {
    const inputs = row.querySelectorAll('input');
    const values = Array.from(inputs).map(input => input.value.trim());

    if (values.some(v => v === '')) {
      showPrompt('Please fill in all fields.', () => {}, () => {}, 'save');
      return;
    }

    // Show prompt before saving
    showPrompt(
      'Do you want to save this new employee?',
      () => { // onConfirm
        addEmployeeRow(values);
        const allRows = getAllEmployeeData();
        localStorage.setItem('employees', JSON.stringify(allRows));
        localStorage.removeItem('addRowInProgress');
        employeeTableBody.removeChild(row);

        sortTableRows(); // Sort after adding
      },
      () => { // onCancel
        employeeTableBody.removeChild(row);
        localStorage.removeItem('addRowInProgress');
      },
      'newEmployee'
    );
  });

  // Cancel button event listener to remove the input row and clear flag
  cancelBtn.addEventListener('click', () => {
    employeeTableBody.removeChild(row);
    localStorage.removeItem('addRowInProgress');
  });

  localStorage.setItem('addRowInProgress', 'true');
}


// Function to add a row to the employee table
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
          <img class="edit-icon" src="../../assets/edit-icon.svg" alt="Edit">  
        </button>
        <button class="delete-button">
          <img class="delete-icon" src="../../assets/delete-icon.svg" alt="Delete">
        </button>
      </div>
    </td>
  `;

  const cells = newRow.querySelectorAll('td');
  let editBtn = newRow.querySelector('.edit-button'); // Use let because we reassign later
  const deleteBtn = newRow.querySelector('.delete-button');

  // Keep original values to restore on cancel
  let originalValues = Array.from(cells).slice(0, 6).map(cell => cell.textContent);

  // Helper to clear all event listeners on a button by replacing it
  function clearEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }

  // Function to handle editing an employee row
  function handleEdit() {
    originalValues = Array.from(cells).slice(0, 6).map(cell => cell.textContent);

    for (let i = 0; i < 6; i++) {
      cells[i].innerHTML = `<input type="text" class="edit-input" value="${originalValues[i]}">`;
    }

    editBtn.innerHTML = 'Save';
    editBtn.classList.remove('edit-button');
    editBtn.classList.add('edit-save-button');
    deleteBtn.style.display = 'none';

    // Remove old listeners and add save listener
    editBtn = clearEventListeners(editBtn);
    editBtn.addEventListener('click', handleSave);
  }

  // Function to handle saving an edited employee row
  function handleSave() {
    const inputs = newRow.querySelectorAll('input');
    const updatedValues = Array.from(inputs).map(input => input.value.trim());

    if (updatedValues.some(v => v === '')) {
      showPrompt('Please fill in all fields.', () => {
        inputs.forEach(input => {
          if (input.value.trim() === '') {
            input.style.border = '1px solid red';
          } else {
            input.style.border = '';
          }
        });
      }, () => {
        // On cancel, restore original values and reset button
        for (let i = 0; i < 6; i++) {
          cells[i].textContent = originalValues[i];
        }

        editBtn.innerHTML = `<img class="edit-icon" src="../../assets/edit-icon.svg" alt="Edit">`;
        editBtn.classList.remove('edit-save-button');
        editBtn.classList.add('edit-button');
        deleteBtn.style.display = '';

        // Remove old listeners and re-add edit listener
        editBtn = clearEventListeners(editBtn);
        editBtn.addEventListener('click', handleEdit);
      }, 'save');
      return;
    }

    // Update cells with new values
    for (let i = 0; i < 6; i++) {
      cells[i].textContent = updatedValues[i];
    }

    // Reset button to edit mode
    editBtn.innerHTML = `<img class="edit-icon" src="../../assets/edit-icon.svg" alt="Edit">`;
    editBtn.classList.remove('edit-save-button');
    editBtn.classList.add('edit-button');
    deleteBtn.style.display = '';

    // Update localStorage with edited data
    const updatedRows = getAllEmployeeData();
    localStorage.setItem('employees', JSON.stringify(updatedRows));

    sortTableRows(); // Sort the table after saving edits

    // Remove old listeners and re-add edit listener
    editBtn = clearEventListeners(editBtn);
    editBtn.addEventListener('click', handleEdit);
  }

  // Initial listener for edit button
  editBtn.addEventListener('click', handleEdit);

  // Delete button logic unchanged
  deleteBtn.addEventListener('click', () => {
    showPrompt('Are you sure you want to delete this employee?', () => {
      newRow.remove();
      const updatedRows = getAllEmployeeData();
      localStorage.setItem('employees', JSON.stringify(updatedRows));
    }, null, 'delete');
  });

  employeeTableBody.insertBefore(newRow, employeeTableBody.firstChild);
}


// Function to sort table rows based on the employee ID numbers to (0-9)
function sortTableRows() {
  const rows = Array.from(employeeTableBody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aID = parseInt(a.querySelector('td:nth-child(1)').textContent.trim()) || 0;
    const bID = parseInt(b.querySelector('td:nth-child(1)').textContent.trim()) || 0;
    return aID - bID;
  });

  rows.forEach(row => employeeTableBody.appendChild(row));
}

// Function to get all employee data from the table
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

// Search input event listener to filter employee rows
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

// Function to show a custom prompt with confirmation and cancellation
function showPrompt(message, onConfirm, onCancel, type = 'default') {
  const promptDiv = document.createElement('div');
  promptDiv.className = 'custom-prompt-overlay';

  let animationHTML = '';

  //animation icons
  if (type === 'delete') {
    animationHTML = `<video class="trash-bin-vid" src="../../assets/animation/trash-bin.mp4" autoplay muted loop></video>`;
  } else if (type === 'save') {
    animationHTML = `<video class="save-check-vid" src="../../assets/animation/missing-fill.mp4" autoplay muted loop></video>`;
  } else if (type === 'newEmployee') {
    animationHTML = `<video class="new-employee-vid" src="../../assets/animation/employee.mp4" autoplay muted loop></video>`;
  } else {
    animationHTML = `<div class="default-icon"></div>`;
  }

  promptDiv.innerHTML = `
    <div class="custom-prompt-box">
      <div class="custom-prompt-animation">
        ${animationHTML}
      </div>
      <p>${message}</p>
      <button class="custom-prompt-confirm">Confirm</button>
      <button class="custom-prompt-cancel">Cancel</button>
    </div>
  `;
  document.body.appendChild(promptDiv);

  const confirmBtn = promptDiv.querySelector('.custom-prompt-confirm');
  const cancelBtn = promptDiv.querySelector('.custom-prompt-cancel');

  confirmBtn.addEventListener('click', () => {
    onConfirm();
    document.body.removeChild(promptDiv);
  });

  cancelBtn.addEventListener('click', () => {
    if (onCancel) onCancel();
    document.body.removeChild(promptDiv);
  });
}
