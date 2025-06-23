// Get all necessary DOM elements
const viewButtons = document.querySelectorAll('.card-view-btn');
const trainingContainer = document.getElementById('trainingRequestContainer');
const leaveContainer = document.getElementById('leaveRequestContainer');
const feedbackContainer = document.getElementById('feedbackContainer');
const reportContainer = document.getElementById('reportContainer');
const otherFormsContainer = document.getElementById('otherFormsContainer');
const otherFormsTitle = document.getElementById('otherFormsTitle');
const otherFormsContent = document.getElementById('otherFormsContent');

// Close button elements
const closeTrainingBtn = document.getElementById('closeTrainingFormBtn');
const closeLeaveBtn = document.getElementById('closeLeaveFormBtn');
const closeFeedbackBtn = document.getElementById('closeFeedbackFormBtn');
const closeReportBtn = document.getElementById('closeReportFormBtn');
const closeOtherFormsBtn = document.getElementById('closeOtherFormsBtn');

// Form elements
const trainingForm = document.getElementById('trainingRequestForm');
const leaveForm = document.getElementById('leaveRequestForm');
const feedbackForm = document.getElementById('feedbackForm');
const reportForm = document.getElementById('reportForm');
const trainingTypeSelect = document.getElementById('trainingTypeSelect');
const customTrainingRow = document.getElementById('customTrainingRow');

// Success message elements
const trainingSuccessMessage = document.getElementById('trainingSuccessMessage');
const leaveSuccessMessage = document.getElementById('leaveSuccessMessage');
const feedbackSuccessMessage = document.getElementById('feedbackSuccessMessage');
const reportSuccessMessage = document.getElementById('reportSuccessMessage');

// File upload variables
const fileInput = document.getElementById('attachmentFiles');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

// CONSOLIDATED FUNCTIONS (defined only once)
function hideAllForms() {
    const containers = [trainingContainer, leaveContainer, feedbackContainer, reportContainer, otherFormsContainer];
    containers.forEach(container => {
        if (container) container.classList.add('form-hidden');
    });
    
    // Hide success messages
    const messages = [trainingSuccessMessage, leaveSuccessMessage, feedbackSuccessMessage, reportSuccessMessage];
    messages.forEach(message => {
        if (message) message.style.display = 'none';
    });
}

function resetAllForms() {
    const forms = [trainingForm, leaveForm, feedbackForm, reportForm];
    forms.forEach(form => {
        if (form) form.reset();
    });
    
    if (customTrainingRow) customTrainingRow.classList.add('form-hidden');
    
    // Reset file uploads
    selectedFiles = [];
    if (fileList) fileList.innerHTML = '';
    if (fileInput) fileInput.value = '';
}

// CONSOLIDATED VIEW BUTTON EVENT LISTENER (attached only once)
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const formType = button.getAttribute('data-form-type');
        
        hideAllForms();
        resetAllForms();
        
        switch(formType) {
            case 'training':
                if (trainingContainer) {
                    trainingContainer.classList.remove('form-hidden');
                    trainingContainer.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'leave':
                if (leaveContainer) {
                    leaveContainer.classList.remove('form-hidden');
                    leaveContainer.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'feedback':
                if (feedbackContainer) {
                    feedbackContainer.classList.remove('form-hidden');
                    feedbackContainer.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'report':
                if (reportContainer) {
                    reportContainer.classList.remove('form-hidden');
                    reportContainer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.error('Report container not found in HTML');
                }
                break;
        }
    });
});

// Close button event listeners
if (closeTrainingBtn) closeTrainingBtn.addEventListener('click', hideAllForms);
if (closeLeaveBtn) closeLeaveBtn.addEventListener('click', hideAllForms);
if (closeFeedbackBtn) closeFeedbackBtn.addEventListener('click', hideAllForms);
if (closeReportBtn) closeReportBtn.addEventListener('click', hideAllForms);
if (closeOtherFormsBtn) closeOtherFormsBtn.addEventListener('click', hideAllForms);

// Training type select change handler
if (trainingTypeSelect) {
    trainingTypeSelect.addEventListener('change', () => {
        if (customTrainingRow) {
            if (trainingTypeSelect.value === 'other') {
                customTrainingRow.classList.remove('form-hidden');
            } else {
                customTrainingRow.classList.add('form-hidden');
            }
        }
    });
}

// REPORT FORM SUBMISSION (with better error handling and 8 character minimum)
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        console.log('Report form submit event triggered'); // Debug log
        e.preventDefault();
        
        const formData = new FormData(reportForm);
        
        // Try different possible field names for each input
        const employeeName = formData.get('employeeName') || formData.get('employee_name') || formData.get('name');
        const department = formData.get('department') || formData.get('dept');
        const reportType = formData.get('reportType') || formData.get('report_type') || formData.get('type');
        const reportDescription = formData.get('report') || formData.get('reportDescription') || formData.get('report_description') || formData.get('description');
        
        // Debug: Log all form data to see what's actually being submitted
        console.log('All form data entries:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        console.log('Extracted values:', { employeeName, department, reportType, reportDescription }); // Debug log
        
        // Basic validation with better error handling
        const employeeNameInput = document.getElementById('reportEmployeeNameInput') || document.querySelector('input[name="employeeName"]') || document.querySelector('input[name="employee_name"]') || document.querySelector('input[name="name"]');
        if (!employeeName || !employeeName.trim()) {
            alert('Please enter your name.');
            if (employeeNameInput) employeeNameInput.focus();
            return;
        }
        
        const departmentSelect = document.getElementById('reportDepartmentSelect') || document.querySelector('select[name="department"]') || document.querySelector('select[name="dept"]');
        if (!department) {
            alert('Please select your department.');
            if (departmentSelect) departmentSelect.focus();
            return;
        }
        
        const reportTypeSelect = document.getElementById('reportTypeSelect') || document.querySelector('select[name="reportType"]') || document.querySelector('select[name="report_type"]') || document.querySelector('select[name="type"]');
        if (!reportType) {
            alert('Please select a report type.');
            if (reportTypeSelect) reportTypeSelect.focus();
            return;
        }
        
        const reportDescriptionTextarea = document.getElementById('reportTextarea') || document.getElementById('reportDescriptionTextarea') || document.querySelector('textarea[name="report"]') || document.querySelector('textarea[name="reportDescription"]') || document.querySelector('textarea[name="description"]');
        if (!reportDescription || !reportDescription.trim()) {
            alert('Please describe your report.');
            console.log('Description field value:', reportDescription); // Additional debug
            console.log('Description textarea element:', reportDescriptionTextarea); // Additional debug
            if (reportDescriptionTextarea) {
                console.log('Textarea actual value:', reportDescriptionTextarea.value); // Additional debug
                reportDescriptionTextarea.focus();
            }
            return;
        }
        
        // Changed minimum description length validation from 20 to 8 characters
        if (reportDescription.trim().length < 8) {
            alert('Please provide more detailed description (at least 8 characters).');
            if (reportDescriptionTextarea) reportDescriptionTextarea.focus();
            return;
        }
        
        // Here you would typically send the data to your server
        console.log('Report submitted successfully:', {
            employeeName: employeeName.trim(),
            department: department,
            reportType: reportType,
            reportDescription: reportDescription.trim()
        });
        
        // Show success message
        if (reportSuccessMessage) {
            reportSuccessMessage.style.display = 'block';
            reportSuccessMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form and close after short delay
        setTimeout(() => {
            reportForm.reset();
            if (reportSuccessMessage) reportSuccessMessage.style.display = 'none';
            hideAllForms();
        }, 3000);
    });
} else {
    console.error('Report form not found in HTML');
}

// Training form submission
if (trainingForm) {
    trainingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(trainingForm);
        const employeeName = formData.get('employeeName');
        const department = formData.get('department');
        const trainingType = formData.get('trainingType');
        const customTraining = formData.get('customTraining');
        
        // Basic validation
        if (!employeeName || !employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('employeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('departmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!trainingType) {
            alert('Please select a training type.');
            if (trainingTypeSelect) trainingTypeSelect.focus();
            return;
        }
        
        if (trainingType === 'other' && (!customTraining || !customTraining.trim())) {
            alert('Please specify the type of training you need.');
            const customInput = document.getElementById('customTrainingInput');
            if (customInput) customInput.focus();
            return;
        }
        
        // Show success message
        if (trainingSuccessMessage) {
            trainingSuccessMessage.style.display = 'block';
            trainingSuccessMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form and close after short delay
        setTimeout(() => {
            trainingForm.reset();
            if (customTrainingRow) customTrainingRow.classList.add('form-hidden');
            if (trainingSuccessMessage) trainingSuccessMessage.style.display = 'none';
            hideAllForms();
        }, 3000);
    });
}

// Leave form submission
if (leaveForm) {
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
        if (!employeeName || !employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('leaveEmployeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('leaveDepartmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!leaveType) {
            alert('Please select a leave type.');
            const typeSelect = document.getElementById('leaveTypeSelect');
            if (typeSelect) typeSelect.focus();
            return;
        }
        
        if (!leaveDateStart) {
            alert('Please select your leave start date.');
            const startInput = document.getElementById('leaveDateStart');
            if (startInput) startInput.focus();
            return;
        }
        
        if (!returnDate) {
            alert('Please select your return date.');
            const returnInput = document.getElementById('returnDate');
            if (returnInput) returnInput.focus();
            return;
        }
        
        // Date validation
        const startDate = new Date(leaveDateStart);
        const endDate = new Date(returnDate);
        
        if (endDate <= startDate) {
            alert('Return date must be after the leave start date.');
            const returnInput = document.getElementById('returnDate');
            if (returnInput) returnInput.focus();
            return;
        }
        
        // Optional reason validation for certain leave types
        if (['sick-leave', 'emergency', 'bereavement'].includes(leaveType) && (!reason || !reason.trim())) {
            const confirmed = confirm('No reason provided. Are you sure you want to submit without a reason?');
            if (!confirmed) {
                const reasonTextarea = document.getElementById('reasonTextarea');
                if (reasonTextarea) reasonTextarea.focus();
                return;
            }
        }
        
        // Add files to form data
        selectedFiles.forEach((file, index) => {
            formData.append(`attachment_${index}`, file);
        });
        
        console.log('Leave form submitted with files:', selectedFiles);
        
        // Show success message
        if (leaveSuccessMessage) {
            leaveSuccessMessage.style.display = 'block';
            leaveSuccessMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form and close after short delay
        setTimeout(() => {
            leaveForm.reset();
            selectedFiles = [];
            if (fileList) fileList.innerHTML = '';
            if (fileInput) fileInput.value = '';
            if (leaveSuccessMessage) leaveSuccessMessage.style.display = 'none';
            hideAllForms();
        }, 3000);
    });
}

// Feedback form submission (also changed to 8 characters minimum)
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const employeeName = formData.get('employeeName');
        const department = formData.get('department');
        const feedbackType = formData.get('feedbackType');
        const feedback = formData.get('feedback');
        
        // Basic validation
        if (!employeeName || !employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('feedbackEmployeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('feedbackDepartmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!feedbackType) {
            alert('Please select a feedback type.');
            const typeSelect = document.getElementById('feedbackTypeSelect');
            if (typeSelect) typeSelect.focus();
            return;
        }
        
        if (!feedback || !feedback.trim()) {
            alert('Please describe your feedback.');
            const textarea = document.getElementById('feedbackTextarea');
            if (textarea) textarea.focus();
            return;
        }
        
        // Changed minimum feedback length validation from 10 to 8 characters
        if (feedback.trim().length < 8) {
            alert('Please provide more detailed feedback (at least 8 characters).');
            const textarea = document.getElementById('feedbackTextarea');
            if (textarea) textarea.focus();
            return;
        }
        
        console.log('Feedback submitted:', {
            employeeName: employeeName.trim(),
            department: department,
            feedbackType: feedbackType,
            feedback: feedback.trim()
        });
        
        // Show success message
        if (feedbackSuccessMessage) {
            feedbackSuccessMessage.style.display = 'block';
            feedbackSuccessMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form and close after short delay
        setTimeout(() => {
            feedbackForm.reset();
            if (feedbackSuccessMessage) feedbackSuccessMessage.style.display = 'none';
            hideAllForms();
        }, 3000);
    });
}

// File upload functionality
if (fileInput) {
    fileInput.addEventListener('change', handleFileSelection);
}

function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    const maxSize = 25 * 1024 * 1024; 
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    
    files.forEach(file => {
        if (file.size > maxSize) {
            showFileError(`File "${file.name}" is too large. Maximum size is 25MB.`);
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showFileError(`File "${file.name}" is not a supported format. Please use PDF, DOC, DOCX, JPG, PNG, or TXT files.`);
            return;
        }
        
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
    if (!fileList) return;
    
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
    if (fileInput) fileInput.value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showFileError(message) {
    if (!fileList) return;
    
    clearFileError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'file-error';
    errorDiv.textContent = message;
    fileList.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function clearFileError() {
    if (!fileList) return;
    
    const existingError = fileList.querySelector('.file-error');
    if (existingError) {
        existingError.remove();
    }
}

// Date input constraints
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const leaveDateStart = document.getElementById('leaveDateStart');
    const returnDate = document.getElementById('returnDate');
    
    if (leaveDateStart) {
        leaveDateStart.min = today;
        
        leaveDateStart.addEventListener('change', () => {
            if (leaveDateStart.value && returnDate) {
                const nextDay = new Date(leaveDateStart.value);
                nextDay.setDate(nextDay.getDate() + 1);
                returnDate.min = nextDay.toISOString().split('T')[0];
                
                if (returnDate.value && new Date(returnDate.value) <= new Date(leaveDateStart.value)) {
                    returnDate.value = '';
                }
            }
        });
    }
    
    if (returnDate) {
        returnDate.min = today;
    }
});

// Character counters
const feedbackTextarea = document.getElementById('feedbackTextarea');
if (feedbackTextarea) {
    feedbackTextarea.addEventListener('input', (e) => {
        const maxLength = 1000;
        const currentLength = e.target.value.length;
        
        if (currentLength > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
    });
}

const reportTextarea = document.getElementById('reportTextarea');
if (reportTextarea) {
    reportTextarea.addEventListener('input', (e) => {
        const maxLength = 1500;
        const currentLength = e.target.value.length;
        
        if (currentLength > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAllForms();
    }
});

// Click outside to close forms
document.addEventListener('click', (e) => {
    const formContainers = [trainingContainer, leaveContainer, feedbackContainer, reportContainer, otherFormsContainer].filter(container => container);
    
    formContainers.forEach(container => {
        if (!container.classList.contains('form-hidden')) {
            if (!container.contains(e.target) && !e.target.classList.contains('card-view-btn')) {
                if (!e.target.closest('.request-card')) {
                    hideAllForms();
                }
            }
        }
    });
});