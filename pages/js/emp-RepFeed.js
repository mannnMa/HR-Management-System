// Get all necessary DOM elements
const viewButtons = document.querySelectorAll('.card-view-btn');
const trainingContainer = document.getElementById('trainingRequestContainer');
const leaveContainer = document.getElementById('leaveRequestContainer');
const otherFormsContainer = document.getElementById('otherFormsContainer');
const otherFormsTitle = document.getElementById('otherFormsTitle');
const otherFormsContent = document.getElementById('otherFormsContent');

// Close button elements
const closeTrainingBtn = document.getElementById('closeTrainingFormBtn');
const closeLeaveBtn = document.getElementById('closeLeaveFormBtn');
const closeOtherFormsBtn = document.getElementById('closeOtherFormsBtn');

// Form elements
const trainingForm = document.getElementById('trainingRequestForm');
const leaveForm = document.getElementById('leaveRequestForm');
const trainingTypeSelect = document.getElementById('trainingTypeSelect');
const customTrainingRow = document.getElementById('customTrainingRow');

// Success message elements
const trainingSuccessMessage = document.getElementById('trainingSuccessMessage');
const leaveSuccessMessage = document.getElementById('leaveSuccessMessage');

// Function to hide all forms
function hideAllForms() {
    trainingContainer.classList.add('form-hidden');
    leaveContainer.classList.add('form-hidden');
    otherFormsContainer.classList.add('form-hidden');
    
    // Hide success messages
    trainingSuccessMessage.style.display = 'none';
    leaveSuccessMessage.style.display = 'none';
}

// Function to reset all forms
function resetAllForms() {
    trainingForm.reset();
    leaveForm.reset();
    customTrainingRow.classList.add('form-hidden');
}

// Add click event listeners to view buttons
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const formType = button.getAttribute('data-form-type');
        
        hideAllForms();
        resetAllForms();
        
        switch(formType) {
            case 'training':
                trainingContainer.classList.remove('form-hidden');
                trainingContainer.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'leave':
                leaveContainer.classList.remove('form-hidden');
                leaveContainer.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'feedback':
                otherFormsTitle.textContent = 'Feedback Form';
                otherFormsContent.innerHTML = '<p>The feedback form is coming soon. You will be able to share your comments, suggestions, or concerns to help improve our services and work environment.</p>';
                otherFormsContainer.classList.remove('form-hidden');
                otherFormsContainer.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'report':
                otherFormsTitle.textContent = 'Report Form';
                otherFormsContent.innerHTML = '<p>The report form is coming soon. You will be able to submit reports on work activities, incidents, or observations for documentation and review.</p>';
                otherFormsContainer.classList.remove('form-hidden');
                otherFormsContainer.scrollIntoView({ behavior: 'smooth' });
                break;
        }
    });
});

// Close button event listeners
closeTrainingBtn.addEventListener('click', () => {
    hideAllForms();
});

closeLeaveBtn.addEventListener('click', () => {
    hideAllForms();
});

closeOtherFormsBtn.addEventListener('click', () => {
    hideAllForms();
});

// Training type select change handler
trainingTypeSelect.addEventListener('change', () => {
    if (trainingTypeSelect.value === 'other') {
        customTrainingRow.classList.remove('form-hidden');
    } else {
        customTrainingRow.classList.add('form-hidden');
    }
});

// Training form submission
trainingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(trainingForm);
    const employeeName = formData.get('employeeName');
    const department = formData.get('department');
    const trainingType = formData.get('trainingType');
    const customTraining = formData.get('customTraining');
    
    // Basic validation
    if (!employeeName.trim()) {
        alert('Please enter your name.');
        document.getElementById('employeeNameInput').focus();
        return;
    }
    
    if (!department) {
        alert('Please select your department.');
        document.getElementById('departmentSelect').focus();
        return;
    }
    
    if (!trainingType) {
        alert('Please select a training type.');
        trainingTypeSelect.focus();
        return;
    }
    
    if (trainingType === 'other' && !customTraining.trim()) {
        alert('Please specify the type of training you need.');
        document.getElementById('customTrainingInput').focus();
        return;
    }
    
    // Show success message
    trainingSuccessMessage.style.display = 'block';
    trainingSuccessMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Reset form and close after short delay
    setTimeout(() => {
        trainingForm.reset();
        customTrainingRow.classList.add('form-hidden');
        trainingSuccessMessage.style.display = 'none';
        hideAllForms();
    }, 3000);
});

// Leave form submission
leaveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(leaveForm);
    const employeeName = formData.get('employeeName');
    const department = formData.get('department');
    const leaveType = formData.get('leaveType');
    const leaveDateStart = formData.get('leaveDateStart');
    const returnDate = formData.get('returnDate');
    const reason = formData.get('reason');
    
    // Basic validation
    if (!employeeName.trim()) {
        alert('Please enter your name.');
        document.getElementById('leaveEmployeeNameInput').focus();
        return;
    }
    
    if (!department) {
        alert('Please select your department.');
        document.getElementById('leaveDepartmentSelect').focus();
        return;
    }
    
    if (!leaveType) {
        alert('Please select a leave type.');
        document.getElementById('leaveTypeSelect').focus();
        return;
    }
    
    if (!leaveDateStart) {
        alert('Please select your leave start date.');
        document.getElementById('leaveDateStart').focus();
        return;
    }
    
    if (!returnDate) {
        alert('Please select your return date.');
        document.getElementById('returnDate').focus();
        return;
    }
    
    // Date validation - return date should be after leave date
    const startDate = new Date(leaveDateStart);
    const endDate = new Date(returnDate);
    
    if (endDate <= startDate) {
        alert('Return date must be after the leave start date.');
        document.getElementById('returnDate').focus();
        return;
    }
    
    // Optional reason validation for certain leave types
    if (['sick-leave', 'emergency', 'bereavement'].includes(leaveType) && !reason.trim()) {
        const confirmed = confirm('No reason provided. Are you sure you want to submit without a reason?');
        if (!confirmed) {
            document.getElementById('reasonTextarea').focus();
            return;
        }
    }
    
    // Show success message
    leaveSuccessMessage.style.display = 'block';
    leaveSuccessMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Reset form and close after short delay
    setTimeout(() => {
        leaveForm.reset();
        leaveSuccessMessage.style.display = 'none';
        hideAllForms();
    }, 3000);
});

// Date input constraints
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const leaveDateStart = document.getElementById('leaveDateStart');
    const returnDate = document.getElementById('returnDate');
    
    // Set minimum date to today
    leaveDateStart.min = today;
    returnDate.min = today;
    
    // Update return date minimum when leave start date changes
    leaveDateStart.addEventListener('change', () => {
        if (leaveDateStart.value) {
            const nextDay = new Date(leaveDateStart.value);
            nextDay.setDate(nextDay.getDate() + 1);
            returnDate.min = nextDay.toISOString().split('T')[0];
            
            // Clear return date if it's before the new minimum
            if (returnDate.value && new Date(returnDate.value) <= new Date(leaveDateStart.value)) {
                returnDate.value = '';
            }
        }
    });
});

// Optional: Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAllForms();
    }
});

// Optional: Click outside to close forms
document.addEventListener('click', (e) => {
    const formContainers = [trainingContainer, leaveContainer, otherFormsContainer];
    
    formContainers.forEach(container => {
        if (!container.classList.contains('form-hidden')) {
            if (!container.contains(e.target) && !e.target.classList.contains('card-view-btn')) {
                // Don't close if clicking on form elements or buttons
                if (!e.target.closest('.request-card')) {
                    hideAllForms();
                }
            }
        }
    });
});

// File upload functionality - Add this to your existing JavaScript

// File upload variables
const fileInput = document.getElementById('attachmentFiles');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

// File upload event listener
if (fileInput) {
    fileInput.addEventListener('change', handleFileSelection);
}

function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    const maxSize = 25 * 1024 * 1024; 
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    
    files.forEach(file => {
        // Check file size
        if (file.size > maxSize) {
            showFileError(`File "${file.name}" is too large. Maximum size is 5MB.`);
            return;
        }
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
            showFileError(`File "${file.name}" is not a supported format. Please use PDF, DOC, DOCX, JPG, PNG, or TXT files.`);
            return;
        }
        
        // Check if file already exists
        if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
            showFileError(`File "${file.name}" is already selected.`);
            return;
        }
        
        selectedFiles.push(file);
    });
    
    displaySelectedFiles();
    clearFileError();
}

function displaySelectedFiles() {
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'file-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-remove';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove file';
        removeBtn.addEventListener('click', () => removeFile(index));
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileSize);
        fileItem.appendChild(removeBtn);
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    displaySelectedFiles();
    
    // Reset file input to allow re-selection of the same file
    fileInput.value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showFileError(message) {
    clearFileError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'file-error';
    errorDiv.textContent = message;
    fileList.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function clearFileError() {
    const existingError = fileList.querySelector('.file-error');
    if (existingError) {
        existingError.remove();
    }
}

// Update the resetAllForms function to include file reset
function resetAllForms() {
    trainingForm.reset();
    leaveForm.reset();
    customTrainingRow.classList.add('form-hidden');
    
    // Reset file uploads
    selectedFiles = [];
    if (fileList) {
        fileList.innerHTML = '';
    }
    if (fileInput) {
        fileInput.value = '';
    }
}

// Update the leave form submission to include file handling
// Replace the existing leave form event listener with this updated version:

leaveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(leaveForm);
    const employeeName = formData.get('employeeName');
    const department = formData.get('department');
    const leaveType = formData.get('leaveType');
    const leaveDateStart = formData.get('leaveDateStart');
    const returnDate = formData.get('returnDate');
    const reason = formData.get('reason');
    
    // Basic validation
    if (!employeeName.trim()) {
        alert('Please enter your name.');
        document.getElementById('leaveEmployeeNameInput').focus();
        return;
    }
    
    if (!department) {
        alert('Please select your department.');
        document.getElementById('leaveDepartmentSelect').focus();
        return;
    }
    
    if (!leaveType) {
        alert('Please select a leave type.');
        document.getElementById('leaveTypeSelect').focus();
        return;
    }
    
    if (!leaveDateStart) {
        alert('Please select your leave start date.');
        document.getElementById('leaveDateStart').focus();
        return;
    }
    
    if (!returnDate) {
        alert('Please select your return date.');
        document.getElementById('returnDate').focus();
        return;
    }
    
    // Date validation - return date should be after leave date
    const startDate = new Date(leaveDateStart);
    const endDate = new Date(returnDate);
    
    if (endDate <= startDate) {
        alert('Return date must be after the leave start date.');
        document.getElementById('returnDate').focus();
        return;
    }
    
    // Optional reason validation for certain leave types
    if (['sick-leave', 'emergency', 'bereavement'].includes(leaveType) && !reason.trim()) {
        const confirmed = confirm('No reason provided. Are you sure you want to submit without a reason?');
        if (!confirmed) {
            document.getElementById('reasonTextarea').focus();
            return;
        }
    }
    
    // Add files to form data
    selectedFiles.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
    });
    
    // Here you would typically send the formData to your server
    // For now, we'll just show the success message
    console.log('Form submitted with files:', selectedFiles);
    
    // Show success message
    leaveSuccessMessage.style.display = 'block';
    leaveSuccessMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Reset form and close after short delay
    setTimeout(() => {
        leaveForm.reset();
        selectedFiles = [];
        fileList.innerHTML = '';
        fileInput.value = '';
        leaveSuccessMessage.style.display = 'none';
        hideAllForms();
    }, 3000);
});