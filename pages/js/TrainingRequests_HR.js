// ===== STORAGE MANAGEMENT =====
class HRDataManager {
    constructor() {
        this.storageKeys = {
            training: 'hr_training_requests',
            leave: 'hr_leave_requests',
            feedback: 'hr_feedback_submissions',
            reports: 'hr_reports_submissions'
        };
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize empty arrays if they don't exist
        Object.values(this.storageKeys).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }

    saveTrainingRequest(data) {
        const requests = this.getTrainingRequests();
        const request = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            trainingType: data.trainingType,
            customTraining: data.customTraining || '',
            progress: 'not-yet',
            status: 'pending'
        };
        requests.push(request);
        localStorage.setItem(this.storageKeys.training, JSON.stringify(requests));
        return request;
    }

    saveLeaveRequest(data) {
        const requests = this.getLeaveRequests();
        const request = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            leaveType: data.leaveType,
            startDate: data.leaveDateStart,
            returnDate: data.returnDate,
            reason: data.reason || '',
            status: 'pending',
            attachments: data.attachments || []
        };
        requests.push(request);
        localStorage.setItem(this.storageKeys.leave, JSON.stringify(requests));
        return request;
    }

    saveFeedback(data) {
        const feedback = this.getFeedback();
        const submission = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            feedbackType: data.feedbackType,
            feedback: data.feedback,
            status: 'received'
        };
        feedback.push(submission);
        localStorage.setItem(this.storageKeys.feedback, JSON.stringify(feedback));
        return submission;
    }

    saveReport(data) {
        const reports = this.getReports();
        const report = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            reportType: data.reportType,
            reportDescription: data.reportDescription,
            status: 'submitted'
        };
        reports.push(report);
        localStorage.setItem(this.storageKeys.reports, JSON.stringify(reports));
        return report;
    }

    getTrainingRequests() {
        return JSON.parse(localStorage.getItem(this.storageKeys.training)) || [];
    }

    getLeaveRequests() {
        return JSON.parse(localStorage.getItem(this.storageKeys.leave)) || [];
    }

    getFeedback() {
        return JSON.parse(localStorage.getItem(this.storageKeys.feedback)) || [];
    }

    getReports() {
        return JSON.parse(localStorage.getItem(this.storageKeys.reports)) || [];
    }

    updateTrainingProgress(id, progress) {
        const requests = this.getTrainingRequests();
        const request = requests.find(r => r.id === id);
        if (request) {
            request.progress = progress;
            localStorage.setItem(this.storageKeys.training, JSON.stringify(requests));
            return true;
        }
        return false;
    }

    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
    }
}

// Initialize data manager
const hrDataManager = new HRDataManager();

// ===== FORM SUBMISSION HANDLERS (Updated to use localStorage) =====

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
if (viewButtons.length > 0) {
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
}

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

// UPDATED FORM SUBMISSIONS WITH LOCALSTORAGE

// Training form submission
if (trainingForm) {
    trainingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(trainingForm);
        const data = {
            employeeName: formData.get('employeeName'),
            department: formData.get('department'),
            trainingType: formData.get('trainingType'),
            customTraining: formData.get('customTraining')
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('employeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('departmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!data.trainingType) {
            alert('Please select a training type.');
            if (trainingTypeSelect) trainingTypeSelect.focus();
            return;
        }
        
        if (data.trainingType === 'other' && (!data.customTraining || !data.customTraining.trim())) {
            alert('Please specify the type of training you need.');
            const customInput = document.getElementById('customTrainingInput');
            if (customInput) customInput.focus();
            return;
        }
        
        // Save to localStorage
        const savedRequest = hrDataManager.saveTrainingRequest(data);
        console.log('Training request saved:', savedRequest);
        
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
        const data = {
            employeeName: formData.get('employeeName'),
            department: formData.get('department'),
            leaveType: formData.get('leaveType'),
            leaveDateStart: formData.get('leaveDateStart'),
            returnDate: formData.get('returnDate'),
            reason: formData.get('reason'),
            attachments: selectedFiles.map(file => file.name)
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('leaveEmployeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('leaveDepartmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!data.leaveType) {
            alert('Please select a leave type.');
            const typeSelect = document.getElementById('leaveTypeSelect');
            if (typeSelect) typeSelect.focus();
            return;
        }
        
        if (!data.leaveDateStart) {
            alert('Please select your leave start date.');
            const startInput = document.getElementById('leaveDateStart');
            if (startInput) startInput.focus();
            return;
        }
        
        if (!data.returnDate) {
            alert('Please select your return date.');
            const returnInput = document.getElementById('returnDate');
            if (returnInput) returnInput.focus();
            return;
        }
        
        // Date validation
        const startDate = new Date(data.leaveDateStart);
        const endDate = new Date(data.returnDate);
        
        if (endDate <= startDate) {
            alert('Return date must be after the leave start date.');
            const returnInput = document.getElementById('returnDate');
            if (returnInput) returnInput.focus();
            return;
        }
        
        // Save to localStorage
        const savedRequest = hrDataManager.saveLeaveRequest(data);
        console.log('Leave request saved:', savedRequest);
        
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

// Feedback form submission
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const data = {
            employeeName: formData.get('employeeName'),
            department: formData.get('department'),
            feedbackType: formData.get('feedbackType'),
            feedback: formData.get('feedback')
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            const nameInput = document.getElementById('feedbackEmployeeNameInput');
            if (nameInput) nameInput.focus();
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            const deptSelect = document.getElementById('feedbackDepartmentSelect');
            if (deptSelect) deptSelect.focus();
            return;
        }
        
        if (!data.feedbackType) {
            alert('Please select a feedback type.');
            const typeSelect = document.getElementById('feedbackTypeSelect');
            if (typeSelect) typeSelect.focus();
            return;
        }
        
        if (!data.feedback || !data.feedback.trim()) {
            alert('Please describe your feedback.');
            const textarea = document.getElementById('feedbackTextarea');
            if (textarea) textarea.focus();
            return;
        }
        
        if (data.feedback.trim().length < 8) {
            alert('Please provide more detailed feedback (at least 8 characters).');
            const textarea = document.getElementById('feedbackTextarea');
            if (textarea) textarea.focus();
            return;
        }
        
        // Save to localStorage
        const savedFeedback = hrDataManager.saveFeedback(data);
        console.log('Feedback saved:', savedFeedback);
        
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

// Report form submission
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(reportForm);
        const data = {
            employeeName: formData.get('employeeName') || formData.get('employee_name') || formData.get('name'),
            department: formData.get('department') || formData.get('dept'),
            reportType: formData.get('reportType') || formData.get('report_type') || formData.get('type'),
            reportDescription: formData.get('report') || formData.get('reportDescription') || formData.get('report_description') || formData.get('description')
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            const employeeNameInput = document.getElementById('reportEmployeeNameInput') || document.querySelector('input[name="employeeName"]');
            if (employeeNameInput) employeeNameInput.focus();
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            const departmentSelect = document.getElementById('reportDepartmentSelect') || document.querySelector('select[name="department"]');
            if (departmentSelect) departmentSelect.focus();
            return;
        }
        
        if (!data.reportType) {
            alert('Please select a report type.');
            const reportTypeSelect = document.getElementById('reportTypeSelect') || document.querySelector('select[name="reportType"]');
            if (reportTypeSelect) reportTypeSelect.focus();
            return;
        }
        
        if (!data.reportDescription || !data.reportDescription.trim()) {
            alert('Please describe your report.');
            const reportDescriptionTextarea = document.getElementById('reportTextarea') || document.querySelector('textarea[name="report"]');
            if (reportDescriptionTextarea) reportDescriptionTextarea.focus();
            return;
        }
        
        if (data.reportDescription.trim().length < 8) {
            alert('Please provide more detailed description (at least 8 characters).');
            const reportDescriptionTextarea = document.getElementById('reportTextarea') || document.querySelector('textarea[name="report"]');
            if (reportDescriptionTextarea) reportDescriptionTextarea.focus();
            return;
        }
        
        // Save to localStorage
        const savedReport = hrDataManager.saveReport(data);
        console.log('Report saved:', savedReport);
        
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
}

// ===== HR ADMIN INTERFACE FUNCTIONS =====

// Function to populate HR admin table with training requests
function populateTrainingRequestsTable() {
    const tableBody = document.querySelector('.training-requests-table tbody');
    if (!tableBody) return;
    
    const trainingRequests = hrDataManager.getTrainingRequests();
    
    // Clear existing rows except sample data (you might want to clear all)
    tableBody.innerHTML = '';
    
    trainingRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.setAttribute('data-request-id', request.id);
        
        const displayTraining = request.trainingType === 'other' ? 
            `Other: ${request.customTraining}` : 
            request.trainingType.charAt(0).toUpperCase() + request.trainingType.slice(1);
        
        row.innerHTML = `
            <td class="cell-name">${request.employeeName}</td>
            <td class="cell-department">${request.department}</td>
            <td class="cell-training">${displayTraining}</td>
            <td class="cell-other">${request.customTraining || ''}</td>
            <td class="cell-progress">
                <select class="progress-dropdown" data-current="${request.progress}" data-request-id="${request.id}">
                    <option value="not-yet" ${request.progress === 'not-yet' ? 'selected' : ''}>Not yet</option>
                    <option value="ongoing" ${request.progress === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                    <option value="completed" ${request.progress === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to progress dropdowns
    attachProgressDropdownListeners();
    // Apply colors to all dropdowns
    updateAllDropdownColors();
}

// Function to attach event listeners to progress dropdowns
function attachProgressDropdownListeners() {
    const dropdowns = document.querySelectorAll('.progress-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (e) => {
            const requestId = parseInt(e.target.getAttribute('data-request-id'));
            const newProgress = e.target.value;
            
            // Update in localStorage
            hrDataManager.updateTrainingProgress(requestId, newProgress);
            
            // Update dropdown color
            updateDropdownColor(e.target);
            
            console.log(`Updated request ${requestId} progress to ${newProgress}`);
        });
        
        // Set initial color
        updateDropdownColor(dropdown);
    });
}

// Function to update individual dropdown color
function updateDropdownColor(dropdown) {
    const value = dropdown.value;
    
    // Remove existing color classes
    dropdown.classList.remove('status-not-yet', 'status-ongoing', 'status-completed');
    
    // Add appropriate color class
    switch(value) {
        case 'not-yet':
            dropdown.classList.add('status-not-yet');
            break;
        case 'ongoing':
            dropdown.classList.add('status-ongoing');
            break;
        case 'completed':
            dropdown.classList.add('status-completed');
            break;
    }
}

// Function to update all dropdown colors
function updateAllDropdownColors() {
    const dropdowns = document.querySelectorAll('.progress-dropdown');
    dropdowns.forEach(dropdown => {
        updateDropdownColor(dropdown);
    });
}

// Function to create additional admin pages (you can extend this)
function createLeaveRequestsPage() {
    // This would create a similar table for leave requests
    // Implementation depends on your HTML structure
}

function createFeedbackPage() {
    // This would create a page for viewing feedback
    // Implementation depends on your HTML structure
}

function createReportsPage() {
    // This would create a page for viewing reports
    // Implementation depends on your HTML structure
}

// File upload functionality (same as before)
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
    
    // Initialize HR admin table if on admin page
    if (document.querySelector('.training-requests-table')) {
        populateTrainingRequestsTable();
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

// ===== UTILITY FUNCTIONS FOR ADMIN =====

// Function to refresh admin data
function refreshAdminData() {
    if (document.querySelector('.training-requests-table')) {
        populateTrainingRequestsTable();
    }
}

// Function to clear all data (for testing)
function clearAllHRData() {
    if (confirm('Are you sure you want to clear all HR data? This action cannot be undone.')) {
        hrDataManager.clearAllData();
        refreshAdminData();
        alert('All HR data has been cleared.');
    }
}

// Function to export data as JSON (for backup)
function exportHRData() {
    const allData = {
        training: hrDataManager.getTrainingRequests(),
        leave: hrDataManager.getLeaveRequests(),
        feedback: hrDataManager.getFeedback(),
        reports: hrDataManager.getReports(),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hr_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Make functions globally available for console access
window.hrDataManager = hrDataManager;
window.refreshAdminData = refreshAdminData;
window.clearAllHRData = clearAllHR
// Continue from the previous code...

Data = clearAllHRData;
window.exportHRData = exportHRData;

// ===== TRAINING REQUESTS ADMIN (CURRENT PAGE) =====
// This is for the training requests table on the same page as the forms

function populateTrainingRequestsTable() {
    const tableBody = document.querySelector('.training-requests-table tbody');
    if (!tableBody) return;
    
    const trainingRequests = hrDataManager.getTrainingRequests();
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (trainingRequests.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="5" class="no-data">No training requests found</td>';
        tableBody.appendChild(noDataRow);
        return;
    }
    
    trainingRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.setAttribute('data-request-id', request.id);
        
        const displayTraining = request.trainingType === 'other' ? 
            `Other: ${request.customTraining}` : 
            request.trainingType.charAt(0).toUpperCase() + request.trainingType.slice(1);
        
        // Format timestamp
        const submittedDate = new Date(request.timestamp).toLocaleDateString();
        const submittedTime = new Date(request.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        row.innerHTML = `
            <td class="cell-name">${request.employeeName}</td>
            <td class="cell-department">${request.department}</td>
            <td class="cell-training">${displayTraining}</td>
            <td class="cell-submitted">${submittedDate}<br><small>${submittedTime}</small></td>
            <td class="cell-progress">
                <select class="progress-dropdown" data-current="${request.progress}" data-request-id="${request.id}">
                    <option value="not-yet" ${request.progress === 'not-yet' ? 'selected' : ''}>Not Yet</option>
                    <option value="ongoing" ${request.progress === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                    <option value="completed" ${request.progress === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to progress dropdowns
    attachProgressDropdownListeners();
    // Apply colors to all dropdowns
    updateAllDropdownColors();
}

function attachProgressDropdownListeners() {
    const dropdowns = document.querySelectorAll('.training-requests-table .progress-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (e) => {
            const requestId = parseInt(e.target.getAttribute('data-request-id'));
            const newProgress = e.target.value;
            
            // Update in localStorage
            hrDataManager.updateTrainingProgress(requestId, newProgress);
            
            // Update dropdown color
            updateDropdownColor(e.target);
            
            // Update stats if dashboard exists
            updateTrainingStats();
            
            console.log(`Updated training request ${requestId} progress to ${newProgress}`);
        });
        
        // Set initial color
        updateDropdownColor(dropdown);
    });
}

function updateDropdownColor(dropdown) {
    const value = dropdown.value;
    
    // Remove existing color classes
    dropdown.classList.remove('status-not-yet', 'status-ongoing', 'status-completed');
    
    // Add appropriate color class
    switch(value) {
        case 'not-yet':
            dropdown.classList.add('status-not-yet');
            break;
        case 'ongoing':
            dropdown.classList.add('status-ongoing');
            break;
        case 'completed':
            dropdown.classList.add('status-completed');
            break;
    }
}

function updateAllDropdownColors() {
    const dropdowns = document.querySelectorAll('.training-requests-table .progress-dropdown');
    dropdowns.forEach(dropdown => {
        updateDropdownColor(dropdown);
    });
}

function updateTrainingStats() {
    const trainingRequests = hrDataManager.getTrainingRequests();
    
    const stats = {
        total: trainingRequests.length,
        notYet: trainingRequests.filter(r => r.progress === 'not-yet').length,
        ongoing: trainingRequests.filter(r => r.progress === 'ongoing').length,
        completed: trainingRequests.filter(r => r.progress === 'completed').length
    };
    
    // Update stat elements if they exist
    updateStatElement('training-total-count', stats.total);
    updateStatElement('training-not-yet-count', stats.notYet);
    updateStatElement('training-ongoing-count', stats.ongoing);
    updateStatElement('training-completed-count', stats.completed);
    
    return stats;
}

// ===== SEPARATE ADMIN PAGE FUNCTIONS =====
// These functions are for separate admin pages (leave, feedback, reports)

// LEAVE REQUESTS ADMIN PAGE FUNCTIONS
function initializeLeaveRequestsAdminPage() {
    // This function should be called on the leave requests admin page
    populateLeaveRequestsTable();
    addLeaveSearchFunctionality();
}

function populateLeaveRequestsTable() {
    const tableBody = document.querySelector('.leave-requests-admin-table tbody');
    if (!tableBody) return; // This table only exists on the leave admin page
    
    const leaveRequests = hrDataManager.getLeaveRequests();
    tableBody.innerHTML = '';
    
    if (leaveRequests.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="8" class="no-data">No leave requests found</td>';
        tableBody.appendChild(noDataRow);
        return;
    }
    
    leaveRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.setAttribute('data-request-id', request.id);
        
        // Format dates
        const startDate = new Date(request.startDate).toLocaleDateString();
        const returnDate = new Date(request.returnDate).toLocaleDateString();
        const submittedDate = new Date(request.timestamp).toLocaleDateString();
        
        // Calculate duration
        const start = new Date(request.startDate);
        const end = new Date(request.returnDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        row.innerHTML = `
            <td class="cell-name">${request.employeeName}</td>
            <td class="cell-department">${request.department}</td>
            <td class="cell-leave-type">${request.leaveType}</td>
            <td class="cell-start-date">${startDate}</td>
            <td class="cell-return-date">${returnDate}</td>
            <td class="cell-duration">${diffDays} day(s)</td>
            <td class="cell-submitted">${submittedDate}</td>
            <td class="cell-status">
                <select class="leave-status-dropdown" data-request-id="${request.id}">
                    <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="approved" ${request.status === 'approved' ? 'selected' : ''}>Approved</option>
                    <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    attachLeaveStatusListeners();
}

function attachLeaveStatusListeners() {
    const dropdowns = document.querySelectorAll('.leave-status-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (e) => {
            const requestId = parseInt(e.target.getAttribute('data-request-id'));
            const newStatus = e.target.value;
            
            updateLeaveRequestStatus(requestId, newStatus);
            updateLeaveStatusDropdownColor(e.target);
        });
        
        updateLeaveStatusDropdownColor(dropdown);
    });
}

function updateLeaveRequestStatus(id, status) {
    const requests = hrDataManager.getLeaveRequests();
    const request = requests.find(r => r.id === id);
    if (request) {
        request.status = status;
        localStorage.setItem(hrDataManager.storageKeys.leave, JSON.stringify(requests));
        return true;
    }
    return false;
}

function updateLeaveStatusDropdownColor(dropdown) {
    const value = dropdown.value;
    dropdown.classList.remove('status-pending', 'status-approved', 'status-rejected');
    
    switch(value) {
        case 'pending':
            dropdown.classList.add('status-pending');
            break;
        case 'approved':
            dropdown.classList.add('status-approved');
            break;
        case 'rejected':
            dropdown.classList.add('status-rejected');
            break;
    }
}

// FEEDBACK ADMIN PAGE FUNCTIONS
function initializeFeedbackAdminPage() {
    populateFeedbackAdminTable();
    addFeedbackSearchFunctionality();
}

function populateFeedbackAdminTable() {
    const tableBody = document.querySelector('.feedback-admin-table tbody');
    if (!tableBody) return;
    
    const feedbackList = hrDataManager.getFeedback();
    tableBody.innerHTML = '';
    
    if (feedbackList.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="6" class="no-data">No feedback submissions found</td>';
        tableBody.appendChild(noDataRow);
        return;
    }
    
    feedbackList.forEach(feedback => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        const submittedDate = new Date(feedback.timestamp).toLocaleDateString();
        const truncatedFeedback = feedback.feedback.length > 80 ? 
            feedback.feedback.substring(0, 80) + '...' : 
            feedback.feedback;
        
        row.innerHTML = `
            <td class="cell-name">${feedback.employeeName}</td>
            <td class="cell-department">${feedback.department}</td>
            <td class="cell-type">${feedback.feedbackType}</td>
            <td class="cell-feedback" title="${feedback.feedback}">${truncatedFeedback}</td>
            <td class="cell-submitted">${submittedDate}</td>
            <td class="cell-actions">
                <button class="view-btn" onclick="viewFullFeedback(${feedback.id})">View Full</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// REPORTS ADMIN PAGE FUNCTIONS
function initializeReportsAdminPage() {
    populateReportsAdminTable();
    addReportsSearchFunctionality();
}

function populateReportsAdminTable() {
    const tableBody = document.querySelector('.reports-admin-table tbody');
    if (!tableBody) return;
    
    const reportsList = hrDataManager.getReports();
    tableBody.innerHTML = '';
    
    if (reportsList.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="7" class="no-data">No reports found</td>';
        tableBody.appendChild(noDataRow);
        return;
    }
    
    reportsList.forEach(report => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        const submittedDate = new Date(report.timestamp).toLocaleDateString();
        const truncatedDescription = report.reportDescription.length > 80 ? 
            report.reportDescription.substring(0, 80) + '...' : 
            report.reportDescription;
        
        row.innerHTML = `
            <td class="cell-name">${report.employeeName}</td>
            <td class="cell-department">${report.department}</td>
            <td class="cell-type">${report.reportType}</td>
            <td class="cell-description" title="${report.reportDescription}">${truncatedDescription}</td>
            <td class="cell-submitted">${submittedDate}</td>
            <td class="cell-status">
                <select class="report-status-dropdown" data-report-id="${report.id}">
                    <option value="submitted" ${report.status === 'submitted' ? 'selected' : ''}>Submitted</option>
                    <option value="investigating" ${report.status === 'investigating' ? 'selected' : ''}>Investigating</option>
                    <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                </select>
            </td>
            <td class="cell-actions">
                <button class="view-btn" onclick="viewFullReport(${report.id})">View Full</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    attachReportStatusListeners();
}

function attachReportStatusListeners() {
    const dropdowns = document.querySelectorAll('.report-status-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (e) => {
            const reportId = parseInt(e.target.getAttribute('data-report-id'));
            const newStatus = e.target.value;
            
            updateReportStatus(reportId, newStatus);
            updateReportStatusDropdownColor(e.target);
        });
        
        updateReportStatusDropdownColor(dropdown);
    });
}

function updateReportStatus(id, status) {
    const reports = hrDataManager.getReports();
    const report = reports.find(r => r.id === id);
    if (report) {
        report.status = status;
        localStorage.setItem(hrDataManager.storageKeys.reports, JSON.stringify(reports));
        return true;
    }
    return false;
}

function updateReportStatusDropdownColor(dropdown) {
    const value = dropdown.value;
    dropdown.classList.remove('status-submitted', 'status-investigating', 'status-resolved');
    
    switch(value) {
        case 'submitted':
            dropdown.classList.add('status-submitted');
            break;
        case 'investigating':
            dropdown.classList.add('status-investigating');
            break;
        case 'resolved':
            dropdown.classList.add('status-resolved');
            break;
    }
}

// ===== MODAL FUNCTIONS =====
function viewFullFeedback(feedbackId) {
    const feedbackList = hrDataManager.getFeedback();
    const feedback = feedbackList.find(f => f.id === feedbackId);
    
    if (feedback) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeFeedbackModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Feedback Details</h3>
                    <button class="modal-close" onclick="closeFeedbackModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Employee:</strong> ${feedback.employeeName}</p>
                    <p><strong>Department:</strong> ${feedback.department}</p>
                    <p><strong>Type:</strong> ${feedback.feedbackType}</p>
                    <p><strong>Submitted:</strong> ${new Date(feedback.timestamp).toLocaleString()}</p>
                    <div class="feedback-content">
                        <strong>Feedback:</strong>
                        <div class="content-text">${feedback.feedback}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

function closeFeedbackModal() {
    const modal = document.querySelector('.feedback-modal');
    if (modal) {
        modal.remove();
    }
}

function viewFullReport(reportId) {
    const reportsList = hrDataManager.getReports();
    const report = reportsList.find(r => r.id === reportId);
    
    if (report) {
        const modal = document.createElement('div');
        modal.className = 'report-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeReportModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Report Details</h3>
                    <button class="modal-close" onclick="closeReportModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Employee:</strong> ${report.employeeName}</p>
                    <p><strong>Department:</strong> ${report.department}</p>
                    <p><strong>Type:</strong> ${report.reportType}</p>
                    <p><strong>Submitted:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${report.status}</p>
                    <div class="report-content">
                        <strong>Description:</strong>
                        <div class="content-text">${report.reportDescription}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

function closeReportModal() {
    const modal = document.querySelector('.report-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== SEARCH FUNCTIONALITY =====
function addTrainingSearchFunctionality() {
    const searchInput = document.querySelector('.training-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTrainingTable(e.target.value);
        });
    }
}

function filterTrainingTable(searchTerm) {
    const rows = document.querySelectorAll('.training-requests-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function addLeaveSearchFunctionality() {
    const searchInput = document.querySelector('.leave-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterLeaveTable(e.target.value);
        });
    }
}

function filterLeaveTable(searchTerm) {
    const rows = document.querySelectorAll('.leave-requests-admin-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function addFeedbackSearchFunctionality() {
    const searchInput = document.querySelector('.feedback-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterFeedbackTable(e.target.value);
        });
    }
}

function filterFeedbackTable(searchTerm) {
    const rows = document.querySelectorAll('.feedback-admin-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function addReportsSearchFunctionality() {
    const searchInput = document.querySelector('.reports-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterReportsTable(e.target.value);
        });
    }
}

function filterReportsTable(searchTerm) {
    const rows = document.querySelectorAll('.reports-admin-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// ===== UTILITY FUNCTIONS =====
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function refreshCurrentPageData() {
    // Only refresh data for the current page
    if (document.querySelector('.training-requests-table')) {
        populateTrainingRequestsTable();
        updateTrainingStats();
    }
    if (document.querySelector('.leave-requests-admin-table')) {
        populateLeaveRequestsTable();
    }
    if (document.querySelector('.feedback-admin-table')) {
        populateFeedbackAdminTable();
    }
    if (document.querySelector('.reports-admin-table')) {
        populateReportsAdminTable();
    }
}

// ===== ENHANCED DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    // Date constraints
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
    
    // Initialize current page
    refreshCurrentPageData();
    addTrainingSearchFunctionality();
    
    // Initialize specific admin pages based on what exists
    if (document.querySelector('.leave-requests-admin-table')) {
        initializeLeaveRequestsAdminPage();
    }
    if (document.querySelector('.feedback-admin-table')) {
        initializeFeedbackAdminPage();
    }
    if (document.querySelector('.reports-admin-table')) {
        initializeReportsAdminPage();
    }
});

// ===== GLOBAL EXPORTS =====
window.hrDataManager = hrDataManager;
window.refreshCurrentPageData = refreshCurrentPageData;
window.clearAllHRData = clearAllHRData;
window.exportHRData = exportHRData;
window.updateTrainingStats = updateTrainingStats;
window.viewFullFeedback = viewFullFeedback;
window.closeFeedbackModal = closeFeedbackModal;
window.viewFullReport = viewFullReport;
window.closeReportModal = closeReportModal;
window.initializeLeaveRequestsAdminPage = initializeLeaveRequestsAdminPage;
window.initializeFeedbackAdminPage = initializeFeedbackAdminPage;
window.initializeReportsAdminPage = initializeReportsAdminPage;


// ===== SHARED STORAGE MANAGEMENT =====
// (Include the same HRDataManager class here if not loaded separately)
// ===== TRAINING REQUESTS MANAGEMENT =====
function refreshTrainingRequestsDisplay() {
    populateTrainingRequestsTable();
    updateTrainingStats();
}

function populateTrainingRequestsTable() {
    const tableBody = document.querySelector('.training-requests-table tbody');
    if (!tableBody) return;

    const requests = hrDataManager.getTrainingRequests();
    tableBody.innerHTML = '';

    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.employeeName}</td>
            <td>${request.department}</td>
            <td>${request.trainingType === 'other' ? 'Other: ' + request.customTraining : request.trainingType}</td>
            <td>
                <select class="progress-dropdown" data-request-id="${request.id}">
                    <option value="not-yet">Not Yet</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);
    });

    attachProgressDropdownListeners();
}

function attachProgressDropdownListeners() {
    document.querySelectorAll('.progress-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const requestId = this.dataset.requestId;
            hrDataManager.updateTrainingProgress(parseInt(requestId), this.value);
            updateTrainingStats();
        });
    });
}

function updateTrainingStats() {
    const requests = hrDataManager.getTrainingRequests();
    document.getElementById('training-total-count').textContent = requests.length;
    // ... update other stats
}

// ===== LEAVE REQUESTS MANAGEMENT =====
// ... (similar structure for leave requests)

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.training-requests-table')) {
        refreshTrainingRequestsDisplay();
    }
    // ... initialize other sections
});