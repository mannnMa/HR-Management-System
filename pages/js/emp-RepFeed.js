// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all form containers
    const trainingFormContainer = document.getElementById('trainingRequestContainer');
    const otherFormsContainer = document.getElementById('otherFormsContainer');
    const trainingForm = document.getElementById('trainingRequestForm');
    const trainingSuccessMessage = document.getElementById('trainingSuccessMessage');
    
    // Get form elements
    const trainingTypeSelect = document.getElementById('trainingTypeSelect');
    const customTrainingRow = document.getElementById('customTrainingRow');
    const customTrainingInput = document.getElementById('customTrainingInput');
    
    // Get close buttons
    const closeTrainingFormBtn = document.getElementById('closeTrainingFormBtn');
    const closeOtherFormsBtn = document.getElementById('closeOtherFormsBtn');
    
    // Get other form elements
    const otherFormsTitle = document.getElementById('otherFormsTitle');
    
    // Form handling functionality
    document.querySelectorAll('.card-view-btn').forEach(viewButton => {
        viewButton.addEventListener('click', () => {
            const formType = viewButton.getAttribute('data-form-type');
            
            // Hide all forms first
            hideAllForms();
            
            if (formType === 'training') {
                // Show training form
                showTrainingForm();
            } else {
                // Show placeholder for other forms
                showOtherForm(formType);
            }
        });
    });

    // Function to hide all forms
    function hideAllForms() {
        trainingFormContainer.classList.add('form-hidden');
        otherFormsContainer.classList.add('form-hidden');
    }

    // Function to show training form
    function showTrainingForm() {
        trainingFormContainer.classList.remove('form-hidden');
        trainingFormContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to show other forms
    function showOtherForm(formType) {
        let formTitle = '';
        switch(formType) {
            case 'leave':
                formTitle = 'Sick & Vacation Leave Form';
                break;
            case 'feedback':
                formTitle = 'Feedback Form';
                break;
            case 'report':
                formTitle = 'Report Form';
                break;
            default:
                formTitle = 'Form';
        }
        
        otherFormsTitle.textContent = formTitle;
        otherFormsContainer.classList.remove('form-hidden');
        otherFormsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Close form button handlers
    closeTrainingFormBtn.addEventListener('click', () => {
        hideTrainingForm();
    });

    closeOtherFormsBtn.addEventListener('click', () => {
        hideOtherForms();
    });

    // Function to hide training form
    function hideTrainingForm() {
        trainingFormContainer.classList.add('form-hidden');
        resetTrainingForm();
    }

    // Function to hide other forms
    function hideOtherForms() {
        otherFormsContainer.classList.add('form-hidden');
    }

    // Function to reset training form
    function resetTrainingForm() {
        trainingForm.reset();
        customTrainingRow.classList.add('form-hidden');
        trainingSuccessMessage.style.display = 'none';
        customTrainingInput.removeAttribute('required');
    }

    // Show/Hide custom training input based on selection
    trainingTypeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customTrainingRow.classList.remove('form-hidden');
            customTrainingInput.focus();
            customTrainingInput.setAttribute('required', 'required');
        } else {
            customTrainingRow.classList.add('form-hidden');
            customTrainingInput.value = '';
            customTrainingInput.removeAttribute('required');
        }
    });

    // Form submission handler
    trainingForm.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        
        // Get form data
        const formData = new FormData(submitEvent.target);
        const submissionData = Object.fromEntries(formData.entries());
        
        // Simple validation - check if main fields are filled
        if (!submissionData.employeeName || !submissionData.department || !submissionData.trainingType) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Additional validation for "Other" option
        if (submissionData.trainingType === 'other' && !submissionData.customTraining) {
            alert('Please specify the type of training you need');
            return;
        }
        
        // Simulate form submission
        console.log('Training Request Submitted:', submissionData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form after a delay
        setTimeout(() => {
            hideTrainingForm();
        }, 3000);
    });

    // Function to show success message
    function showSuccessMessage() {
        trainingSuccessMessage.style.display = 'block';
    }

    // Auto-hide success message on form changes
    trainingForm.addEventListener('input', () => {
        trainingSuccessMessage.style.display = 'none';
    });

});