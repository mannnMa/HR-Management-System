// Training Request Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get elements - Updated to match your CSS classes
    const trainingViewButton = document.querySelector('.grid-item-training .view-nav');
    const trainingContainer = document.querySelector('.training-requests-container');
    const closeTrainingBtn = document.getElementById('close-training-btn');
    const progressDropdowns = document.querySelectorAll('.progress-dropdown');
    
    // Get all other view-nav buttons (other cards)
    const allViewButtons = document.querySelectorAll('.view-nav');
    const otherViewButtons = Array.from(allViewButtons).filter(btn => btn !== trainingViewButton);
    
    // Function to hide training container instantly (no animation)
    function hideTrainingContainer() {
        if (trainingContainer && trainingContainer.classList.contains('show')) {
            trainingContainer.classList.remove('show');
            trainingContainer.style.display = 'none';
        }
    }
    
    // Function to show training container with animation
    function showTrainingContainer() {
        if (trainingContainer) {
            trainingContainer.style.display = 'block';
            setTimeout(() => {
                trainingContainer.classList.add('show');
            }, 10);
            
            // Smooth scroll to show the expanded section
            setTimeout(() => {
                trainingContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    }
    
    // Function to update progress colors
    function updateProgressColor(dropdown) {
        const selectedValue = dropdown.value.toLowerCase();
        
        // Remove existing color classes
        dropdown.classList.remove('progress-done', 'progress-ongoing', 'progress-not-yet');
        
        // Add appropriate color class based on selection
        switch(selectedValue) {
            case 'completed':
            case 'done':
                dropdown.classList.add('progress-done');
                break;
            case 'ongoing':
                dropdown.classList.add('progress-ongoing');
                break;
            case 'not yet':
            case 'pending':
                dropdown.classList.add('progress-not-yet');
                break;
            default:
                dropdown.classList.add('progress-not-yet'); // Default to red
        }
    }
    
    // Initialize progress colors on page load
    progressDropdowns.forEach(dropdown => {
        updateProgressColor(dropdown);
    });
    
    // Open training section when clicking the training view button
    if (trainingViewButton) {
        trainingViewButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default action
            
            if (trainingContainer) {
                // Toggle visibility with slide down effect
                if (trainingContainer.classList.contains('show')) {
                    hideTrainingContainer();
                } else {
                    showTrainingContainer();
                }
            }
        });
    }
    
    // Close training section when clicking close button
    if (closeTrainingBtn) {
        closeTrainingBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event bubbling
            hideTrainingContainer();
        });
    }
    
    // Hide training section when clicking other view-nav buttons (other cards)
    otherViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            hideTrainingContainer();
        });
    });
    
    
    
    // Handle progress dropdown changes
    progressDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const selectedValue = this.value;
            this.setAttribute('data-current', selectedValue);
            
            // Update the color based on selection
            updateProgressColor(this);
            
            // Optional: Add a visual feedback or save the change
            console.log(`Progress updated to: ${selectedValue}`);
            
            // You can add an API call here to save the progress to your backend
            // Example: saveProgressToServer(employeeId, selectedValue);
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideTrainingContainer();
        }
    });
});

// Optional: Function to save progress to server
function saveProgressToServer(employeeId, progress) {

}