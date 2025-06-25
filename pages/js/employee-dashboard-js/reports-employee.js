document.addEventListener('DOMContentLoaded', function () {
    const reportsViewButton = document.querySelector('.grid-item-report .view-nav');
    const reportsContainer = document.querySelector('.reports-container');
    const closeReportsBtn = document.querySelector('.close-reports-btn');
    const closeSectionBtn = document.querySelector('.close-section-btn');
    const approveButtons = document.querySelectorAll('.approve-btn');
    const declineButtons = document.querySelectorAll('.decline-btn');
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

    function hideReportsContainer() {
        if (reportsContainer && reportsContainer.style.display !== 'none') {
            reportsContainer.style.display = 'none';
            hideDetailView();
        }
    }

    function showReportsContainer() {
        if (reportsContainer) {
            reportsContainer.style.display = 'block';
            setTimeout(() => {
                reportsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }

    function hideDetailView() {
        if (detailViewContainer) {
            detailViewContainer.style.opacity = '0';
            detailViewContainer.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                detailViewContainer.style.display = 'none';
            }, 300);
        }
    }

    function showDetailView(content) {
        if (detailViewContainer) {
            detailViewContainer.innerHTML = content;
            detailViewContainer.style.display = 'block';
            setTimeout(() => {
                detailViewContainer.style.opacity = '1';
                detailViewContainer.style.transform = 'translateY(0)';
                detailViewContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 10);
        }
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
                        <div class="detail-item"><span class="detail-label">Date Submitted:</span><span class="detail-value">${rowData.date}</span></div>
                    </div>
                </section>

                ${rowData.type.toLowerCase().includes('leave') ? `
                    <section class="detail-section">
                        <h4>Leave Request Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item"><span class="detail-label">Leave Type:</span><span class="detail-value">${rowData.leaveType}</span></div>
                            <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">${rowData.startDate}</span></div>
                            <div class="detail-item"><span class="detail-label">End Date:</span><span class="detail-value">${rowData.endDate}</span></div>
                            <div class="detail-item"><span class="detail-label">Duration:</span><span class="detail-value">${rowData.duration}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Reason:</span><span class="detail-value">${rowData.reason}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Attached Files:</span><span class="detail-value">${rowData.attachedFiles}</span></div>
                        </div>
                    </section>
                    <div class="detail-actions">
                        <button class="action-btn approve-btn" data-employee="${rowData.name}">Approve</button>
                        <button class="action-btn decline-btn" data-employee="${rowData.name}">Decline</button>
                    </div>
                ` : `
                    <section class="detail-section">
                        <h4>Report Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item"><span class="detail-label">Report Type:</span><span class="detail-value">${rowData.type}</span></div>
                            <div class="detail-item"><span class="detail-label">Status:</span><span class="detail-value">${rowData.status}</span></div>
                            <div class="detail-item full-width"><span class="detail-label">Description:</span><span class="detail-value">${rowData.description}</span></div>
                        </div>
                    </section>
                `}
            </div>
        </div>`;
    }

    function updateButtonState(button, state) {
        button.classList.remove('btn-approved', 'btn-declined', 'btn-pending');
        if (state === 'approved') {
            button.classList.add('btn-approved');
            button.textContent = 'Approved';
            button.disabled = true;
        } else if (state === 'declined') {
            button.classList.add('btn-declined');
            button.textContent = 'Declined';
            button.disabled = true;
        } else {
            button.classList.add('btn-pending');
        }
    }

    if (reportsViewButton) {
        reportsViewButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (reportsContainer && reportsContainer.style.display !== 'block') {
                showReportsContainer();
            }
        });
    }

    if (closeReportsBtn) {
        closeReportsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hideReportsContainer();
        });
    }

    if (closeSectionBtn) {
        closeSectionBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const leaveFormSection = document.querySelector('.leave-form-section');
            if (leaveFormSection) leaveFormSection.style.display = 'none';
        });
    }

    

    function attachViewButtonListeners() {
        const currentViewButtons = document.querySelectorAll('.reports-table .view-btn');
        currentViewButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        document.querySelectorAll('.reports-table .view-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const row = this.closest('.table-row');
                const rowData = {
                    name: row.querySelector('.cell-name')?.textContent || 'Unknown',
                    department: row.querySelector('.cell-department')?.textContent || 'Unknown',
                    type: row.querySelector('.cell-type')?.textContent || 'Unknown',
                    date: row.dataset.date || new Date().toLocaleDateString(),
                    leaveType: row.dataset.leaveType,
                    startDate: row.dataset.startDate,
                    endDate: row.dataset.endDate,
                    duration: row.dataset.duration,
                    reason: row.dataset.reason,
                    attachedFiles: row.dataset.attachedFiles,
                    status: row.dataset.status,
                    description: row.dataset.description,
                };
                const detailContent = createDetailedReportView(rowData);
                showDetailView(detailContent);
                attachDetailViewListeners();
            });
        });
    }

    function attachDetailViewListeners() {
        detailViewContainer.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', function () {
                if (confirm(`Approve for ${this.dataset.employee}?`)) {
                    updateButtonState(this, 'approved');
                    this.disabled = true;
                    const other = detailViewContainer.querySelector('.decline-btn');
                    if (other) other.disabled = true;
                    const row = document.querySelector(`.reports-table .table-row[data-name="${this.dataset.employee}"]`);
                    if (row) row.remove();
                    hideDetailView();
                    showNotification('Request approved!', 'success');
                }
            });
        });
        detailViewContainer.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', function () {
                if (confirm(`Decline for ${this.dataset.employee}?`)) {
                    updateButtonState(this, 'declined');
                    this.disabled = true;
                    const other = detailViewContainer.querySelector('.approve-btn');
                    if (other) other.disabled = true;
                    const row = document.querySelector(`.reports-table .table-row[data-name="${this.dataset.employee}"]`);
                    if (row) row.remove();
                    hideDetailView();
                    showNotification('Request declined.', 'warning');
                }
            });
        });
    }

    approveButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('.form-container');
            const name = row.querySelector('.form-value').textContent;
            if (confirm(`Approve leave for ${name}?`)) {
                updateButtonState(this, 'approved');
                const declineBtn = row.querySelector('.decline-btn');
                if (declineBtn) declineBtn.disabled = true;
                showNotification('Leave approved!', 'success');
            }
        });
    });

    declineButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('.form-container');
            const name = row.querySelector('.form-value').textContent;
            if (confirm(`Decline leave for ${name}?`)) {
                updateButtonState(this, 'declined');
                const approveBtn = row.querySelector('.approve-btn');
                if (approveBtn) approveBtn.disabled = true;
                showNotification('Leave declined.', 'warning');
            }
        });
    });

    window.hideDetailView = hideDetailView;
    window.attachViewButtonListeners = attachViewButtonListeners;

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideReportsContainer();
            hideDetailView();
        }
    });

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 12px 20px; border-radius: 5px; color: white;
            font-family: "Inter", sans-serif; font-weight: 500;
            z-index: 1000; transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        if (type === 'success') notification.style.backgroundColor = '#4CAF50';
        if (type === 'warning') notification.style.backgroundColor = '#f44336';
        if (type === 'info') notification.style.backgroundColor = '#007bff';
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    attachViewButtonListeners();
});
