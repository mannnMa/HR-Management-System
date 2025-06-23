// Elements for policy functionality
const policyForm = document.getElementById('policy-form');
const policyList = document.getElementById('policy-list');
const policyTitle = document.getElementById('policy-title');
const policyDesc = document.getElementById('policy-description');
const policyFile = document.getElementById('policy-file');
const openPolicyBtn = document.getElementById("open-policy-button");
const policyContainer = document.getElementById('policy-container');
const closePolicyBtn = document.getElementById('close-policy-btn');
const fileInput = document.getElementById("policy-file");
const fileNameDisplay = document.getElementById("file-name-display");

// Show policy container
openPolicyBtn.addEventListener("click", () => {
  policyContainer.style.display = "block";
  localStorage.setItem("isPolicyOpen", "true");
  policyContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Close policy container
closePolicyBtn.addEventListener("click", () => {
  policyContainer.style.display = "none";
  localStorage.setItem("isPolicyOpen", "false");
});

// Load policies on page load
document.addEventListener("DOMContentLoaded", () => {
  const isPolicyOpen = localStorage.getItem("isPolicyOpen");
  policyContainer.style.display = isPolicyOpen === "true" ? "block" : "none";
  
  loadPolicies();
});

// Get saved policies
function getPolicies() {
  return JSON.parse(localStorage.getItem('policies')) || [];
}

// Load and display saved policies
function loadPolicies() {
  const policies = getPolicies();
  policies.forEach(displayPolicy);
}

// Handle policy form submission
policyForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = policyTitle.value.trim();
  const description = policyDesc.value.trim();
  const files = Array.from(policyFile.files);
  const timestamp = new Date().toLocaleString();

  if (title && description && files.length > 0) {
    const fileReaders = [];
    const fileResults = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = () => {
        fileResults.push({
          fileName: file.name,
          fileData: reader.result
        });

        // When all files are read, save
        if (fileResults.length === files.length) {
          const newPolicy = {
            id: Date.now(),
            title,
            description,
            timestamp,
            files: fileResults
          };
          saveAndDisplayPolicy(newPolicy);
          policyForm.reset();
          fileNameDisplay.textContent = "No file chosen";
        }
      };

      reader.readAsDataURL(file);
    });
  }
});


// Save and display policy
function saveAndDisplayPolicy(policy) {
  const policies = getPolicies();
  policies.push(policy);
  localStorage.setItem('policies', JSON.stringify(policies));
  displayPolicy(policy);
}

// Render policy item
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
    <button class="delete-btn" onclick="deletePolicy(${id})">&times;</button>
  `;

  policyList.prepend(container);
}

// Delete a policy
function deletePolicy(id) {
  let policies = getPolicies();
  policies = policies.filter(p => p.id !== id);
  localStorage.setItem('policies', JSON.stringify(policies));
  policyList.innerHTML = '';
  loadPolicies();
}

// Update file name display when a file is selected
fileInput.addEventListener("change", () => {
  const names = Array.from(fileInput.files).map(f => f.name);
  fileNameDisplay.textContent = names.length > 0 ? names.join(", ") : "No file chosen";
});

