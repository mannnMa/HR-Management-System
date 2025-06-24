// Elements for announcement functionality
const closeAnnouncementBtn = document.getElementById("close-announcement-btn");
const openAnnouncementBtn = document.getElementById("open-announcement-button");
const announcementContainer = document.getElementById("announcement-container");
const announcementForm = document.getElementById('announcement-form');
const titleInput = document.getElementById('announcement-title');
const messageInput = document.getElementById('announcement-message');
const announcementList = document.getElementById('announcement-list');
const imageInput = document.getElementById('announcement-file');

imageInput.addEventListener("change", () => {
  const fileNameDisplay = document.getElementById("file-name-display");
  const files = imageInput.files;
  fileNameDisplay.textContent = files.length > 0
    ? Array.from(files).map(f => f.name).join(", ")
    : "No file chosen";
});

// Announcement functionality

// Show announcement container on page load
document.addEventListener("DOMContentLoaded", () => {
  const announcements = getAnnouncements();
  let updated = false;

  const patched = announcements.map(a => {
    if (!a.id) {
      updated = true;
      return { ...a, id: Date.now() + Math.floor(Math.random() * 10000) };
    }
    return a;
  });

  if (updated) {
    localStorage.setItem("announcements", JSON.stringify(patched));
  }

  announcementContainer.style.display = localStorage.getItem("isAnnouncementOpen") === "true" ? "block" : "none";
  loadAnnouncements();
});


// Get announcements from localStorage
function getAnnouncements() {
  return JSON.parse(localStorage.getItem('announcements')) || [];
}

// Load and display all announcements
function loadAnnouncements() {
  const announcements = getAnnouncements();
  announcements.forEach(displayAnnouncement);
}

// Handle form submission with image upload
announcementForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();
  const files = Array.from(imageInput.files); // Get all selected images
  const timestamp = new Date().toLocaleString();

  if (title && message) {
    const images = [];

    if (files.length > 0) {
      let loaded = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          images.push(reader.result);
          loaded++;

          if (loaded === files.length) {
            const newAnnouncement = {
              id: Date.now(),
              title,
              message,
              images,
              timestamp
            };
            saveAndDisplayAnnouncement(newAnnouncement);
            announcementForm.reset();
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const newAnnouncement = {
        id: Date.now(),
        title,
        message,
        images: [],
        timestamp
      };
      saveAndDisplayAnnouncement(newAnnouncement);
      announcementForm.reset();
    }
  }
});

// Save announcement and display it
function saveAndDisplayAnnouncement(announcement) {
  const announcements = getAnnouncements();
  announcements.push(announcement);
  localStorage.setItem('announcements', JSON.stringify(announcements));
  displayAnnouncement(announcement);
}

// Display single announcement
function displayAnnouncement({ id, title, message, images, timestamp }) {
  const container = document.createElement('div');
  container.className = 'announcement-item';

  let imageHTML = '';
  if (images && images.length > 0) {
    imageHTML = `
      <div class="announcement-images">
        ${images.map(img => `
          <img src="${img}" alt="Announcement Image" class="announcement-img">
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    ${imageHTML}
    <h3>${title}</h3>
    <p>${message}</p>
    <small class="announcement-timestamp">Posted on: ${timestamp}</small>
    <button class="delete-btn" onclick="deleteAnnouncement(${id})">×</button>
  `;
  
  announcementList.prepend(container);
}

// Delete announcement
function deleteAnnouncement(id) {
  let announcements = getAnnouncements();
  announcements = announcements.filter(a => a.id !== id);
  localStorage.setItem('announcements', JSON.stringify(announcements));
  announcementList.innerHTML = '';
  loadAnnouncements();
}

// Hide container on "Close"
closeAnnouncementBtn.addEventListener("click", () => {
  announcementContainer.style.display = "none";
  localStorage.setItem("isAnnouncementOpen", "false");
});

// Show container on "View"
openAnnouncementBtn.addEventListener("click", () => {
  // Show the container
  announcementContainer.style.display = "block";
  localStorage.setItem("isAnnouncementOpen", "true");
  // Scroll smoothly to the container
  announcementContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});