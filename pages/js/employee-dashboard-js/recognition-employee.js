document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-employee-recognition-btn");
  const closeBtn = document.getElementById("close-employee-recognition-btn");
  const section = document.getElementById("employee-recognition-section");
  const list = document.getElementById("employee-recognition-list");

  function loadRecognitions() {
    list.innerHTML = "";
    const recognitions = JSON.parse(localStorage.getItem("recognitions")) || [];

    recognitions.slice().reverse().forEach(rec => {
      const div = document.createElement("div");
      div.className = "recognition-item";

      div.innerHTML = `
        <h3>${rec.title}</h3>
        <p><strong>${rec.employee}</strong></p>
        <p>${rec.message}</p>
        <div class="recognition-image-container">
          ${rec.image ? `<img src="${rec.image}" class="recognition-img" style="max-width: 250px; border-radius: 6px;">` : ""}
          <span class="recognition-timestamp">${rec.timestamp}</span>
        </div>
      `;

      list.appendChild(div);
    });
  }

  openBtn?.addEventListener("click", () => {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
    loadRecognitions();
  });

  closeBtn?.addEventListener("click", () => {
    section.style.display = "none";
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "recognitions") loadRecognitions();
  });

  setInterval(loadRecognitions, 5000);
});
