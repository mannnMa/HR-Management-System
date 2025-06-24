// Reports and Others Section JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Get elements - Updated selectors
    const reportsViewButton = document.querySelector('.grid-item-report .view-nav');
    const reportsContainer = document.querySelector('.reports-container');
    const closeReportsBtn = document.querySelector('.close-reports-btn');
    const closeSectionBtn = document.querySelector('.close-section-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const approveButtons = document.querySelectorAll('.approve-btn');
    const declineButtons = document.querySelectorAll('.decline-btn');

    // Create detailed view container if it doesn't exist
    let detailViewContainer = document.querySelector('.detail-view-container');
    if (!detailViewContainer && reportsContainer) {
        detailViewContainer = document.createElement('div');
        detailViewContainer.className = 'detail-view-container';
        detailViewContainer.style.cssText = `
            display: none;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            padding: 25px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        reportsContainer.appendChild(detailViewContainer);
    }

    // Get all other view-nav buttons (other cards)
    const allViewButtons = document.querySelectorAll('.view-nav');
    const otherViewButtons = Array.from(allViewButtons).filter(btn => btn !== reportsViewButton);

    // Function to hide reports container instantly (no animation)
    function hideReportsContainer() {
        if (reportsContainer && reportsContainer.style.display !== 'none') {
            reportsContainer.style.display = 'none';
            hideDetailView();
        }
    }

    // Function to show reports container
    function showReportsContainer() {
        if (reportsContainer) {
            reportsContainer.style.display = 'block';

            // Smooth scroll to show the expanded section
            setTimeout(() => {
                reportsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }

    // Function to hide detail view
    function hideDetailView() {
        if (detailViewContainer) {
            detailViewContainer.style.opacity = '0';
            detailViewContainer.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                detailViewContainer.style.display = 'none';
            }, 300);
        }
    }

    // Function to show detail view with content
    function showDetailView(content) {
        if (detailViewContainer) {
            detailViewContainer.innerHTML = content;
            detailViewContainer.style.display = 'block';
            setTimeout(() => {
                detailViewContainer.style.opacity = '1';
                detailViewContainer.style.transform = 'translateY(0)';
                // Scroll to detail view
                detailViewContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 10);
        }
    }

    // Function to hide other sections
    function hideOtherSections() {
        const otherSections = [
            '.announcement-container',
            '.policy-container',
            '.evaluation-container',
            '.training-requests-container',
            '.recognition-container'
        ];

        otherSections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.display = 'none';
            }
        });
    }

    function createDetailedReportView(rowData) {
        return `
        <div class="detailed-report-view">
            <div class="detail-header">
                <h3 class="detail-title">Details</h3>
                <button class="detail-close-btn" onclick="hideDetailView()" aria-label="Close">✕</button>
            </div>
            <div class="detail-content">
                <section class="detail-section">
                    <h4>Employee Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><span class="detail-label">Name:</span><span class="detail-value">${rowData.name}</span></div>
                        <div class="detail-item"><span class="detail-label">Department:</span><span class="detail-value">${rowData.department}</span></div>
                        <div class="detail-item"><span class="detail-label">Request Type:</span><span class="detail-value">${rowData.type}</span></div>
                        <div class="detail-item"><span class="detail-label">Date Submitted:</span><span class="detail-value">${rowData.date || new Date().toLocaleDateString()}</span></div>
                    </div>
                </section>

                ${rowData.type.toLowerCase().includes('leave') ? `
                    <section class="detail-section">
                        <h4>Leave Request Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item"><span class="detail-label">Leave Type:</span><span class="detail-value">${rowData.leaveType || 'Sick Leave'}</span></div>
                            <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">${rowData.startDate || '6/24/2024'}</span></div>
                            <div class="detail-item"><span class="detail-label">End Date:</span><span class="detail-value">${rowData.endDate || '6/26/2024'}</span></div>
                            <div class="detail-item"><span class="detail-label">Duration:</span><span class="detail-value">${rowData.duration || '3 days'}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Reason:</span><span class="detail-value">${rowData.reason || 'Medical leave for recovery.'}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Attached Files:</span><span class="detail-value">${rowData.attachedFiles || 'Medical.pdf'}</span></div>
                        </div>
                    </section>
                    ` : rowData.type.toLowerCase().includes('feedback') ? `
                    <section class="detail-section">
                        <h4>Feedback Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item"><span class="detail-label">Feedback Type:</span><span class="detail-value">${rowData.feedbackType || 'General Feedback'}</span></div>
                            <div class="detail-item"><span class="detail-label">Priority:</span><span class="detail-value">${rowData.priority || 'Medium'}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Feedback Content:</span><span class="detail-value">${rowData.feedbackContent || 'Suggestions for improving workplace efficiency and team collaboration.'}</span></div>
                        </div>
                    </section>
                    ` : `
                    <section class="detail-section">
                        <h4>Report Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item"><span class="detail-label">Report Type:</span><span class="detail-value">${rowData.type}</span></div>
                            <div class="detail-item"><span class="detail-label">Status:</span><span class="detail-value">${rowData.status || 'Pending Review'}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Description:</span><span class="detail-value">${rowData.description || 'Monthly performance and project status report.'}</span></div>
                        </div>
                    </section>
                    `
            }

               ${rowData.type.toLowerCase().includes('leave') ? `
                    <div class="detail-actions">
                        <button class="action-btn approve-btn" data-employee="${rowData.name}">Approve</button>
                        <button class="action-btn decline-btn" data-employee="${rowData.name}">Decline</button>
                    </div>
                ` : ''
                }

            </div>
        </div>
    `;
    }

    // Function to update button states
    function updateButtonState(button, state) {
        // Remove existing state classes
        button.classList.remove('btn-approved', 'btn-declined', 'btn-pending');

        // Add appropriate state class
        switch (state) {
            case 'approved':
                button.classList.add('btn-approved');
                button.textContent = 'Approved';
                button.disabled = true;
                break;
            case 'declined':
                button.classList.add('btn-declined');
                button.textContent = 'Declined';
                button.disabled = true;
                break;
            default:
                button.classList.add('btn-pending');
        }
    }

    // Open reports section when clicking the reports view button
    if (reportsViewButton) {
        reportsViewButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Hide other sections first
            hideOtherSections();

            if (reportsContainer) {
                // Toggle visibility
                if (reportsContainer.style.display === 'block') {
                    hideReportsContainer();
                } else {
                    showReportsContainer();
                }
            }
        });
    }

    // Close reports section when clicking close button
    if (closeReportsBtn) {
        closeReportsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hideReportsContainer();
        });
    }

    // Close leave form section when clicking close section button
    if (closeSectionBtn) {
        closeSectionBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const leaveFormSection = document.querySelector('.leave-form-section');
            if (leaveFormSection) {
                leaveFormSection.style.display = 'none';
            }
        });
    }

    // Hide reports section when clicking other view-nav buttons (other cards)
    otherViewButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            hideReportsContainer();
        });
    });

    // Handle view button clicks in reports table
    function attachViewButtonListeners() {
        const currentViewButtons = document.querySelectorAll('.reports-table .view-btn');

        currentViewButtons.forEach(button => {
            // Remove existing listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
        });

        // Re-select buttons after cloning
        const refreshedViewButtons = document.querySelectorAll('.reports-table .view-btn');

        refreshedViewButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const row = this.closest('.table-row');

                // Extract data from the row
                const rowData = {
                    name: row.querySelector('.cell-name')?.textContent || 'Unknown',
                    department: row.querySelector('.cell-department')?.textContent || 'Unknown',
                    type: row.querySelector('.cell-type')?.textContent || 'Unknown',
                    date: row.dataset.date || new Date().toLocaleDateString(),
                    // Add specific data based on type
                    leaveType: row.dataset.leaveType || 'Sick Leave',
                    startDate: row.dataset.startDate || '6/24/2024',
                    endDate: row.dataset.endDate || '6/26/2024',
                    duration: row.dataset.duration || '3 days',
                    reason: row.dataset.reason || 'Medical leave for recovery.',
                    attachedFiles: row.dataset.attachedFiles || 'Medical.pdf',
                    status: row.dataset.status || 'Pending Review',
                    description: row.dataset.description || 'Standard request',
                    feedbackType: row.dataset.feedbackType || 'General Feedback',
                    feedbackContent: row.dataset.feedbackContent || 'Suggestions for improving workplace efficiency.',
                    priority: row.dataset.priority || 'Medium'
                };

                console.log(`Viewing ${rowData.type} for ${rowData.name}`);

                // Create and show detailed view
                const detailContent = createDetailedReportView(rowData);
                showDetailView(detailContent);

                // Re-attach event listeners to the new buttons in detail view
                attachDetailViewListeners();
            });
        });
    }

    // Function to attach event listeners to detail view buttons
    function attachDetailViewListeners() {
        const detailApproveButtons = detailViewContainer.querySelectorAll('.approve-btn');
        const detailDeclineButtons = detailViewContainer.querySelectorAll('.decline-btn');

        detailApproveButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const employeeName = this.dataset.employee;

                if (confirm(`Are you sure you want to approve the request for ${employeeName}?`)) {
                    updateButtonState(this, 'approved');

                    const declineBtn = detailViewContainer.querySelector('.decline-btn');
                    if (declineBtn) {
                        declineBtn.disabled = true;
                        declineBtn.classList.add('btn-disabled');
                    }

                    // Remove row from table
                    const row = document.querySelector(`.reports-table .table-row[data-name="${employeeName}"]`);
                    if (row) row.remove();

                    hideDetailView();
                    showNotification('Request approved successfully!', 'success');
                }
            });
        });

        detailDeclineButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const employeeName = this.dataset.employee;

                if (confirm(`Are you sure you want to decline the request for ${employeeName}?`)) {
                    updateButtonState(this, 'declined');

                    const approveBtn = detailViewContainer.querySelector('.approve-btn');
                    if (approveBtn) {
                        approveBtn.disabled = true;
                        approveBtn.classList.add('btn-disabled');
                    }

                    // Remove row from table
                    const row = document.querySelector(`.reports-table .table-row[data-name="${employeeName}"]`);
                    if (row) row.remove();

                    hideDetailView();
                    showNotification('Request declined.', 'warning');
                }
            });
        });
    }


    // Handle approve button clicks (original form)
    approveButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const row = this.closest('.form-container');
            const employeeName = row.querySelector('.form-value').textContent;

            // Confirm approval
            if (confirm(`Are you sure you want to approve the leave request for ${employeeName}?`)) {
                updateButtonState(this, 'approved');

                // Disable decline button
                const declineBtn = row.querySelector('.decline-btn');
                if (declineBtn) {
                    declineBtn.disabled = true;
                    declineBtn.classList.add('btn-disabled');
                }

                console.log(`Leave request approved for ${employeeName}`);
                showNotification('Leave request approved successfully!', 'success');
            }
        });
    });

    // Handle decline button clicks (original form)
    declineButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const row = this.closest('.form-container');
            const employeeName = row.querySelector('.form-value').textContent;

            // Confirm decline
            if (confirm(`Are you sure you want to decline the leave request for ${employeeName}?`)) {
                updateButtonState(this, 'declined');

                // Disable approve button
                const approveBtn = row.querySelector('.approve-btn');
                if (approveBtn) {
                    approveBtn.disabled = true;
                    approveBtn.classList.add('btn-disabled');
                }

                console.log(`Leave request declined for ${employeeName}`);
                showNotification('Leave request declined.', 'warning');
            }
        });
    });

    // Make functions globally accessible
    window.hideDetailView = hideDetailView;
    window.attachViewButtonListeners = attachViewButtonListeners;

    // Initial attachment of view button listeners
    attachViewButtonListeners();

    // Close with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideReportsContainer();
            hideDetailView();
        }
    });

    // Function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-family: "Inter", sans-serif;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#007bff';
        }

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});

// Optional: Function to save approval/decline to server
function saveApprovalToServer(employeeName, status) {
    // Example API call
    /*
    fetch('/api/leave-requests/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employee: employeeName,
            status: status,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
}