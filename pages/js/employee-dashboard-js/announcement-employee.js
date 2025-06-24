document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("employee-announcement-list");
  const container = document.getElementById("employee-announcement-section");
  const openBtn = document.getElementById("open-employee-announcement-btn");
  const closeBtn = document.getElementById("close-employee-announcement-btn");

  function getAnnouncements() {
    return JSON.parse(localStorage.getItem("announcements")) || [];
  }

  function renderAnnouncements() {
    list.innerHTML = "";
    getAnnouncements().slice().reverse().forEach(({ title, message, images, timestamp }) => {
      const div = document.createElement("div");
      div.className = "announcement-item";

      const imageHTML = (images && images.length > 0)
        ? `<div class="announcement-images">
            ${images.map(img => `<img src="${img}" class="announcement-img" alt="Announcement Image">`).join("")}
          </div>`
        : "";

      div.innerHTML = `
        ${imageHTML}
        <h3>${title}</h3>
        <p>${message}</p>
        <small class="announcement-timestamp">Posted on: ${timestamp}</small>
      `;

      list.appendChild(div);
    });
  }

  openBtn?.addEventListener("click", () => {
    container.style.display = "block";
    container.scrollIntoView({ behavior: "smooth", block: "start" });
    renderAnnouncements();
  });

  closeBtn?.addEventListener("click", () => {
    container.style.display = "none";
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "announcements") renderAnnouncements();
  });

  setInterval(renderAnnouncements, 5000);
});
