// Elements
const policyForm = document.getElementById('policy-form');
const policyList = document.getElementById('policy-list');
const policyTitle = document.getElementById('policy-title');
const policyDesc = document.getElementById('policy-description');
const policyFile = document.getElementById('policy-file');
const openPolicyBtn = document.getElementById("open-policy-button");
const policyContainer = document.getElementById('policy-container');
const closePolicyBtn = document.getElementById('close-policy-btn');
const fileInput = document.getElementById("policy-file");
const fileNameDisplay = document.getElementById("policy-file-name-display");

fileInput.addEventListener("change", () => {
  const names = Array.from(fileInput.files).map(f => f.name);
  fileNameDisplay.textContent = names.length ? names.join(", ") : "No file chosen";
});

// Show/Hide Container
openPolicyBtn.addEventListener("click", () => {
  policyContainer.style.display = "block";
  localStorage.setItem("isPolicyOpen", "true");
  policyContainer.scrollIntoView({ behavior: "smooth" });
});

closePolicyBtn.addEventListener("click", () => {
  policyContainer.style.display = "none";
  localStorage.setItem("isPolicyOpen", "false");
});

// Load on page
document.addEventListener("DOMContentLoaded", () => {
  const isPolicyOpen = localStorage.getItem("isPolicyOpen");
  policyContainer.style.display = isPolicyOpen === "true" ? "block" : "none";
  loadPolicies();
});

// Get from storage
function getPolicies() {
  const data = localStorage.getItem('policies');
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

// Load and display
function loadPolicies() {
  policyList.innerHTML = '';
  const policies = getPolicies();
  policies.forEach(displayPolicy);
}

// Save new
function saveAndDisplayPolicy(policy) {
  const policies = getPolicies();
  policies.push(policy);
  localStorage.setItem('policies', JSON.stringify(policies));
  displayPolicy(policy);
  notifyStorageChange(); // Sync other tabs
}

// Form submit
policyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = policyTitle.value.trim();
  const description = policyDesc.value.trim();
  const files = Array.from(policyFile.files);
  const timestamp = new Date().toLocaleString();

  if (title && description && files.length > 0) {
    const fileResults = [];
    let loaded = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        fileResults.push({
          fileName: file.name,
          fileData: reader.result
        });
        loaded++;
        if (loaded === files.length) {
          const newPolicy = { id: Date.now(), title, description, timestamp, files: fileResults };
          saveAndDisplayPolicy(newPolicy);
          policyForm.reset();
          fileNameDisplay.textContent = "No file chosen";
        }
      };
      reader.readAsDataURL(file);
    });
  }
});

// Display single item
function displayPolicy({ id, title, description, timestamp, files }) {
  const container = document.createElement('div');
  container.className = 'policy-item';

  const fileLinks = files.map(f => `
    <li><a href="${f.fileData}" download="${f.fileName}" class="download-btn">${f.fileName}</a></li>
  `).join('');

  container.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <small class="announcement-timestamp">Uploaded on: ${timestamp}</small>
    <ul class="policy-files">${fileLinks}</ul>
    <button class="delete-btn" data-id="${id}">&times;</button>
  `;

  container.querySelector(".delete-btn").addEventListener("click", () => deletePolicy(id));
  policyList.prepend(container);
}

// Delete
function deletePolicy(id) {
  let policies = getPolicies();
  policies = policies.filter(p => p.id !== id);
  localStorage.setItem('policies', JSON.stringify(policies));
  loadPolicies();
  notifyStorageChange(); // Update others
}

// Show filename
fileInput.addEventListener("change", () => {
  const names = Array.from(fileInput.files).map(f => f.name);
  fileNameDisplay.textContent = names.length ? names.join(", ") : "No file chosen";
});

// Sync helper
function notifyStorageChange() {
  window.dispatchEvent(new StorageEvent("storage", { key: "policies" }));
}
