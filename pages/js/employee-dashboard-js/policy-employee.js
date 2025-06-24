document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-employee-policy-btn");
  const closeBtn = document.getElementById("close-employee-policy-btn");
  const section = document.getElementById("employee-policy-section");
  const list = document.getElementById("employee-policy-list");

  function getPolicies() {
    const raw = localStorage.getItem("policies");
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }

  function renderPolicies() {
    list.innerHTML = "";
    const policies = getPolicies();

    policies.slice().reverse().forEach(({ title, description, timestamp, files }) => {
      const div = document.createElement("div");
      div.className = "policy-item";

      const fileLinks = files.map(f => `
        <li><a href="${f.fileData}" download="${f.fileName}" class="download-link">${f.fileName}</a></li>
      `).join('');

      div.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <small class="announcement-timestamp">Uploaded on: ${timestamp}</small>
        <ul class="policy-files">${fileLinks}</ul>
      `;

      list.appendChild(div);
    });
  }

  openBtn.addEventListener("click", () => {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
    renderPolicies();
  });

  closeBtn.addEventListener("click", () => {
    section.style.display = "none";
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "policies") {
      renderPolicies();
    }
  });

  setInterval(renderPolicies, 5000);
});
