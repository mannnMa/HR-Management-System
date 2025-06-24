// ===== UNIFIED HR DATA MANAGEMENT SYSTEM =====
// This combines both the admin side and form submission side into one cohesive system

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
        // Initialize both localStorage (if available) and window storage
        Object.values(this.storageKeys).forEach(key => {
            // Try localStorage first
            try {
                if (typeof(Storage) !== "undefined" && localStorage) {
                    if (!localStorage.getItem(key)) {
                        localStorage.setItem(key, JSON.stringify([]));
                    }
                }
            } catch (e) {
                console.log('localStorage not available, using window storage');
            }
            
            // Initialize window storage as backup
            const windowKey = key.replace('hr_', '');
            if (typeof window !== "undefined") {
                if (!window[windowKey]) {
                    window[windowKey] = [];
                }
            }
        });
    }

    saveTrainingRequest(data) {
        const request = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            trainingType: data.trainingType,
            customTraining: data.customTraining || '',
            selectedTraining: data.trainingType === 'other' ? 'Other' : this.getTrainingDisplayName(data.trainingType),
            otherInformation: data.trainingType === 'other' ? data.customTraining : '',
            progress: 'not-yet',
            status: 'pending',
            dateSubmitted: new Date().toISOString()
        };

        // Save to both storage methods
        this.saveToStorage('training', request);
        
        // **IMPORTANT: Refresh admin table immediately after saving**
        setTimeout(() => {
            this.refreshAdminInterface();
        }, 100);
        
        return request;
    }

    saveLeaveRequest(data) {
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

        this.saveToStorage('leave', request);
        return request;
    }

    saveFeedback(data) {
        const submission = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            feedbackType: data.feedbackType,
            feedback: data.feedback,
            status: 'received'
        };

        this.saveToStorage('feedback', submission);
        return submission;
    }

    saveReport(data) {
        const report = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            employeeName: data.employeeName,
            department: data.department,
            reportType: data.reportType,
            reportDescription: data.reportDescription,
            status: 'submitted'
        };

        this.saveToStorage('reports', report);
        return report;
    }

    saveToStorage(type, data) {
        const key = this.storageKeys[type];
        const windowKey = key.replace('hr_', '');

        // Save to localStorage if available
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.push(data);
                localStorage.setItem(key, JSON.stringify(existing));
            }
        } catch (e) {
            console.log('localStorage save failed, using window storage');
        }

        // Always save to window storage as backup
        if (typeof window !== "undefined") {
            if (!window[windowKey]) {
                window[windowKey] = [];
            }
            window[windowKey].push(data);
        }
    }

    getTrainingRequests() {
        return this.getFromStorage('training');
    }

    getLeaveRequests() {
        return this.getFromStorage('leave');
    }

    getFeedback() {
        return this.getFromStorage('feedback');
    }

    getReports() {
        return this.getFromStorage('reports');
    }

    getFromStorage(type) {
        const key = this.storageKeys[type];
        const windowKey = key.replace('hr_', '');

        // Try localStorage first
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                const data = localStorage.getItem(key);
                if (data) {
                    return JSON.parse(data);
                }
            }
        } catch (e) {
            // Ignore and fallback to window storage
        }

        // Fallback to window storage
        if (typeof window !== "undefined" && window[windowKey]) {
            return window[windowKey];
        }
        return [];
    }

    updateTrainingProgress(id, progress) {
        const requests = this.getTrainingRequests();
        const request = requests.find(r => r.id === id);
        if (request) {
            request.progress = progress;

            // Update both storage methods
            const key = this.storageKeys.training;
            const windowKey = key.replace('hr_', '');

            try {
                if (typeof(Storage) !== "undefined" && localStorage) {
                    localStorage.setItem(key, JSON.stringify(requests));
                }
            } catch (e) {
                console.log('localStorage update failed');
            }

            if (typeof window !== "undefined") {
                window[windowKey] = requests;
            }
            return true;
        }
        return false;
    }

    getTrainingDisplayName(trainingType) {
        const trainingNames = {
            'technical-skills': 'Technical Skills Development',
            'leadership': 'Leadership Training',
            'communication': 'Communication Skills',
            'project-management': 'Project Management',
            'data-analysis': 'Data Analysis',
            'customer-service': 'Customer Service Excellence',
            'safety-training': 'Safety and Compliance',
            'digital-literacy': 'Digital Literacy',
            'team-building': 'Team Building',
            'other': 'Other'
        };
        return trainingNames[trainingType] || trainingType;
    }

    refreshAdminInterface() {
        // Refresh admin interface if functions exist
        if (typeof populateTrainingRequestsTable === 'function') {
            populateTrainingRequestsTable();
        }
        if (typeof updateTrainingStats === 'function') {
            updateTrainingStats();
        }
    }

    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            try {
                if (typeof(Storage) !== "undefined" && localStorage) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                console.log('localStorage clear failed');
            }
            
            const windowKey = key.replace('hr_', '');
            window[windowKey] = [];
        });
        this.initializeStorage();
    }

    // Additional utility methods
    deleteTrainingRequest(id) {
        const requests = this.getTrainingRequests();
        const filteredRequests = requests.filter(r => r.id !== id);

        const key = this.storageKeys.training;
        const windowKey = key.replace('hr_', '');

        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.setItem(key, JSON.stringify(filteredRequests));
            }
        } catch (e) {
            console.log('localStorage delete failed');
        }

        if (typeof window !== "undefined") {
            window[windowKey] = filteredRequests;
        }
        this.refreshAdminInterface();
        return true;
    }

    updateLeaveStatus(id, status) {
        const requests = this.getLeaveRequests();
        const request = requests.find(r => r.id === id);
        if (request) {
            request.status = status;
            
            const key = this.storageKeys.leave;
            const windowKey = key.replace('hr_', '');
            
            try {
                if (typeof(Storage) !== "undefined" && localStorage) {
                    localStorage.setItem(key, JSON.stringify(requests));
                }
            } catch (e) {
                console.log('localStorage update failed');
            }
            
            window[windowKey] = requests;
            return true;
        }
        return false;
    }

    exportData(type = 'all') {
        const data = {};
        
        if (type === 'all' || type === 'training') {
            data.training = this.getTrainingRequests();
        }
        if (type === 'all' || type === 'leave') {
            data.leave = this.getLeaveRequests();
        }
        if (type === 'all' || type === 'feedback') {
            data.feedback = this.getFeedback();
        }
        if (type === 'all' || type === 'reports') {
            data.reports = this.getReports();
        }

        return data;
    }
}

// ===== INITIALIZE DATA MANAGER =====
const hrDataManager = new HRDataManager();

// ===== ADMIN INTERFACE FUNCTIONS =====
function populateTrainingRequestsTable() {
    console.log('Populating training requests table...');
    
    // Try multiple possible selectors for the table
    const tableBody = document.querySelector('.training-requests-table tbody') || 
                     document.querySelector('#training-requests-table tbody') ||
                     document.querySelector('table.training-requests tbody') ||
                     document.querySelector('.admin-table tbody') ||
                     document.querySelector('.training-table tbody');
    
    if (!tableBody) {
        console.warn('Training requests table not found. Available tables:', 
            document.querySelectorAll('table'));
        return;
    }
    
    const trainingRequests = hrDataManager.getTrainingRequests();
    console.log('Found training requests:', trainingRequests);
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (trainingRequests.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="5" class="no-data" style="text-align: center; padding: 20px;">No training requests found</td>';
        tableBody.appendChild(noDataRow);
        return;
    }
    
    trainingRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.setAttribute('data-request-id', request.id);
        
        // Handle training type display
        let displayTraining = '';
        if (request.trainingType === 'other') {
            displayTraining = `Other: ${request.customTraining}`;
        } else {
            displayTraining = request.selectedTraining || hrDataManager.getTrainingDisplayName(request.trainingType);
        }
        
        row.innerHTML = `
            <td class="cell-name">${request.employeeName}</td>
            <td class="cell-department">${request.department}</td>
            <td class="cell-training">${displayTraining}</td>
            <td class="cell-other">${request.otherInformation || request.customTraining || '-'}</td>
            <td class="cell-progress">
                <select class="progress-dropdown" data-request-id="${request.id}">
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
    updateAllDropdownColors();
    
    console.log('Training requests table populated with', trainingRequests.length, 'requests');
}

function attachProgressDropdownListeners() {
    const dropdowns = document.querySelectorAll('.progress-dropdown');
    console.log('Attaching listeners to', dropdowns.length, 'dropdowns');
    
    dropdowns.forEach(dropdown => {
        dropdown.removeEventListener('change', handleProgressChange);
        dropdown.addEventListener('change', handleProgressChange);
        updateDropdownColor(dropdown);
    });
}

function handleProgressChange(e) {
    const requestId = parseInt(e.target.getAttribute('data-request-id'));
    const newProgress = e.target.value;
    
    console.log(`Updating request ${requestId} progress to ${newProgress}`);
    
    const success = hrDataManager.updateTrainingProgress(requestId, newProgress);
    
    if (success) {
        updateDropdownColor(e.target);
        updateTrainingStats();
        console.log(`Successfully updated request ${requestId} progress to ${newProgress}`);
    } else {
        console.error(`Failed to update request ${requestId}`);
    }
}

function updateDropdownColor(dropdown) {
    const value = dropdown.value;
    
    dropdown.classList.remove('status-not-yet', 'status-ongoing', 'status-completed');
    
    switch(value) {
        case 'not-yet':
            dropdown.classList.add('status-not-yet');
            dropdown.style.backgroundColor = '#ffeaa7';
            dropdown.style.color = '#2d3436';
            break;
        case 'ongoing':
            dropdown.classList.add('status-ongoing');
            dropdown.style.backgroundColor = '#74b9ff';
            dropdown.style.color = '#2d3436';
            break;
        case 'completed':
            dropdown.classList.add('status-completed');
            dropdown.style.backgroundColor = '#00b894';
            dropdown.style.color = '#ffffff';
            break;
    }
}

function updateAllDropdownColors() {
    const dropdowns = document.querySelectorAll('.progress-dropdown');
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
    
    console.log('Training stats:', stats);
    
    updateStatElement('training-total-count', stats.total);
    updateStatElement('training-not-yet-count', stats.notYet);
    updateStatElement('training-ongoing-count', stats.ongoing);
    updateStatElement('training-completed-count', stats.completed);
    
    return stats;
}

function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        console.log(`Updated ${elementId} to ${value}`);
    }
}

function manualRefreshAdminData() {
    console.log('Manual refresh triggered');
    populateTrainingRequestsTable();
    updateTrainingStats();
    
    const confirmMsg = document.createElement('div');
    confirmMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00b894;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    confirmMsg.textContent = 'Admin data refreshed!';
    document.body.appendChild(confirmMsg);
    
    setTimeout(() => {
        if (confirmMsg.parentNode) {
            confirmMsg.parentNode.removeChild(confirmMsg);
        }
    }, 2000);
}

// ===== FORM INTERFACE FUNCTIONS =====

// Get all necessary DOM elements
const viewButtons = document.querySelectorAll('.card-view-btn');
const trainingContainer = document.getElementById('trainingRequestContainer');
const leaveContainer = document.getElementById('leaveRequestContainer');
const feedbackContainer = document.getElementById('feedbackContainer');
const reportContainer = document.getElementById('reportContainer');

// Close button elements
const closeTrainingBtn = document.getElementById('closeTrainingFormBtn');
const closeLeaveBtn = document.getElementById('closeLeaveFormBtn');
const closeFeedbackBtn = document.getElementById('closeFeedbackFormBtn');
const closeReportBtn = document.getElementById('closeReportFormBtn');

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

// UTILITY FUNCTIONS
function hideAllForms() {
    const containers = [trainingContainer, leaveContainer, feedbackContainer, reportContainer].filter(c => c);
    containers.forEach(container => {
        container.classList.add('form-hidden');
    });
    
    const messages = [trainingSuccessMessage, leaveSuccessMessage, feedbackSuccessMessage, reportSuccessMessage].filter(m => m);
    messages.forEach(message => {
        message.style.display = 'none';
    });
}

function resetAllForms() {
    const forms = [trainingForm, leaveForm, feedbackForm, reportForm].filter(f => f);
    forms.forEach(form => {
        form.reset();
    });
    
    if (customTrainingRow) customTrainingRow.classList.add('form-hidden');
    
    selectedFiles = [];
    if (fileList) fileList.innerHTML = '';
    if (fileInput) fileInput.value = '';
}

// VIEW BUTTON EVENT LISTENERS
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

// ===== FORM SUBMISSION HANDLERS =====

// TRAINING FORM SUBMISSION - CONNECTED TO ADMIN
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
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            return;
        }
        
        if (!data.trainingType) {
            alert('Please select a training type.');
            return;
        }
        
        if (data.trainingType === 'other' && (!data.customTraining || !data.customTraining.trim())) {
            alert('Please specify the type of training you need.');
            return;
        }
        
        console.log('Submitting training request:', data);
        
        // Save using the connected data manager (this will automatically refresh admin interface)
        const savedRequest = hrDataManager.saveTrainingRequest(data);
        console.log('Training request saved and admin refreshed:', savedRequest);
        
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

// LEAVE FORM SUBMISSION
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
            attachments: selectedFiles
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            return;
        }
        
        if (!data.leaveType) {
            alert('Please select a leave type.');
            return;
        }
        
        if (!data.leaveDateStart) {
            alert('Please select your leave start date.');
            return;
        }
        
        if (!data.returnDate) {
            alert('Please select your return date.');
            return;
        }
        
        // Date validation
        const startDate = new Date(data.leaveDateStart);
        const endDate = new Date(data.returnDate);
        
        if (endDate <= startDate) {
            alert('Return date must be after the leave start date.');
            return;
        }
        
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

// FEEDBACK FORM SUBMISSION
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
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            return;
        }
        
        if (!data.feedbackType) {
            alert('Please select a feedback type.');
            return;
        }
        
        if (!data.feedback || !data.feedback.trim()) {
            alert('Please describe your feedback.');
            return;
        }
        
        if (data.feedback.trim().length < 8) {
            alert('Please provide more detailed feedback (at least 8 characters).');
            return;
        }
        
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

// REPORT FORM SUBMISSION
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(reportForm);
        const data = {
            employeeName: formData.get('employeeName'),
            department: formData.get('department'),
            reportType: formData.get('reportType'),
            reportDescription: formData.get('report') || formData.get('reportDescription')
        };
        
        // Basic validation
        if (!data.employeeName || !data.employeeName.trim()) {
            alert('Please enter your name.');
            return;
        }
        
        if (!data.department) {
            alert('Please select your department.');
            return;
        }
        
        if (!data.reportType) {
            alert('Please select a report type.');
            return;
        }
        
        if (!data.reportDescription || !data.reportDescription.trim()) {
            alert('Please describe your report.');
            return;
        }
        
        if (data.reportDescription.trim().length < 8) {
            alert('Please provide more detailed description (at least 8 characters).');
            return;
        }
        
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

// ===== FILE UPLOAD FUNCTIONALITY =====
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
    const errorDiv = document.getElementById('fileError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearFileError() {
    const errorDiv = document.getElementById('fileError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// ===== ADMIN DATA EXPORT FUNCTIONALITY =====
function exportTrainingData() {
    const data = hrDataManager.exportData('training');
    const jsonString = JSON.stringify(data.training, null, 2);
    downloadJSON(jsonString, 'training_requests.json');
}

function exportAllData() {
    const data = hrDataManager.exportData('all');
    const jsonString = JSON.stringify(data, null, 2);
    downloadJSON(jsonString, 'hr_all_data.json');
}

function downloadJSON(jsonString, filename) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== ADMIN CLEAR DATA FUNCTIONALITY =====
function clearAllHRData() {
    if (confirm('Are you sure you want to clear ALL HR data? This action cannot be undone.')) {
        if (confirm('This will permanently delete all training requests, leave requests, feedback, and reports. Continue?')) {
            hrDataManager.clearAllData();
            populateTrainingRequestsTable();
            updateTrainingStats();
            
            const confirmMsg = document.createElement('div');
            confirmMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #e17055;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;
            confirmMsg.textContent = 'All HR data cleared!';
            document.body.appendChild(confirmMsg);
            
            setTimeout(() => {
                if (confirmMsg.parentNode) {
                    confirmMsg.parentNode.removeChild(confirmMsg);
                }
            }, 3000);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('HR Data Management System initialized');
    
    // Initialize admin interface if on admin page
    if (document.querySelector('.training-requests-table') || 
        document.querySelector('#training-requests-table') ||
        document.querySelector('.admin-table')) {
        
        console.log('Admin interface detected, initializing...');
        setTimeout(() => {
            populateTrainingRequestsTable();
            updateTrainingStats();
        }, 100);
    }
    
    // Add manual refresh button functionality if it exists
    const refreshBtn = document.getElementById('refreshAdminData') || 
                      document.querySelector('.refresh-btn') ||
                      document.querySelector('[onclick="manualRefreshAdminData()"]');
    
    if (refreshBtn) {
        refreshBtn.removeAttribute('onclick');
        refreshBtn.addEventListener('click', manualRefreshAdminData);
        console.log('Manual refresh button connected');
    }
    
    // Add export button functionality
    const exportBtn = document.getElementById('exportTrainingData') ||
                     document.querySelector('.export-btn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTrainingData);
        console.log('Export button connected');
    }
    
    // Add clear data button functionality
    const clearBtn = document.getElementById('clearAllData') ||
                    document.querySelector('.clear-data-btn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllHRData);
        console.log('Clear data button connected');
    }
});

// ===== GLOBAL FUNCTIONS FOR ADMIN INTERFACE =====
// These functions are made globally available for HTML onclick handlers

window.populateTrainingRequestsTable = populateTrainingRequestsTable;
window.updateTrainingStats = updateTrainingStats;
window.manualRefreshAdminData = manualRefreshAdminData;
window.exportTrainingData = exportTrainingData;
window.exportAllData = exportAllData;
window.clearAllHRData = clearAllHRData;

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Function to search/filter training requests
function filterTrainingRequests(searchTerm) {
    const tableBody = document.querySelector('.training-requests-table tbody') || 
                     document.querySelector('#training-requests-table tbody');
    
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const name = row.querySelector('.cell-name')?.textContent.toLowerCase() || '';
        const department = row.querySelector('.cell-department')?.textContent.toLowerCase() || '';
        const training = row.querySelector('.cell-training')?.textContent.toLowerCase() || '';
        
        const isVisible = name.includes(searchTerm) || 
                         department.includes(searchTerm) || 
                         training.includes(searchTerm);
        
        row.style.display = isVisible ? '' : 'none';
    });
}

// Function to filter by progress status
function filterByProgress(progressStatus) {
    const tableBody = document.querySelector('.training-requests-table tbody') || 
                     document.querySelector('#training-requests-table tbody');
    
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (row.querySelector('.no-data')) return;
        
        const progressDropdown = row.querySelector('.progress-dropdown');
        if (!progressDropdown) return;
        
        const currentProgress = progressDropdown.value;
        const isVisible = progressStatus === 'all' || currentProgress === progressStatus;
        
        row.style.display = isVisible ? '' : 'none';
    });
}

// Add search functionality if search input exists
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchTrainingRequests') ||
                       document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTrainingRequests(e.target.value);
        });
    }
    
    const filterSelect = document.getElementById('filterByProgress') ||
                        document.querySelector('.filter-select');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterByProgress(e.target.value);
        });
    }
});

// Make filter functions globally available
window.filterTrainingRequests = filterTrainingRequests;
window.filterByProgress = filterByProgress;

// ===== DEBUG AND TESTING FUNCTIONS =====
function debugHRData() {
    console.log('=== HR DATA DEBUG ===');
    console.log('Training Requests:', hrDataManager.getTrainingRequests());
    console.log('Leave Requests:', hrDataManager.getLeaveRequests());
    console.log('Feedback:', hrDataManager.getFeedback());
    console.log('Reports:', hrDataManager.getReports());
    console.log('=== END DEBUG ===');
}

// Add some sample data for testing (only in development)
function addSampleData() {
    const sampleTraining = {
        employeeName: 'John Doe',
        department: 'IT',
        trainingType: 'technical-skills',
        customTraining: ''
    };
    
    hrDataManager.saveTrainingRequest(sampleTraining);
    
    const sampleTraining2 = {
        employeeName: 'Jane Smith',
        department: 'HR',
        trainingType: 'other',
        customTraining: 'Advanced Excel Training'
    };
    
    hrDataManager.saveTrainingRequest(sampleTraining2);
    
    console.log('Sample data added');
    manualRefreshAdminData();
}

// Make debug functions globally available for console testing
window.debugHRData = debugHRData;
window.addSampleData = addSampleData;
window.hrDataManager = hrDataManager;

console.log('HR Data Management System fully loaded and ready!'); 