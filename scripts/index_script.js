function showTab(tabName) {
  // Deactivate all tabs and containers
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.books-container').forEach(section => section.classList.remove('active'));

  // Activate selected
  const selectedTab = tabName === 'oldTestamentList' ? 0 : 1;
  document.querySelectorAll('.tab')[selectedTab].classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

function loadBooks() {
  fetch('./data/books.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(books => {
      const oldBooks = books.filter(book => book.section === "Old");
      const newBooks = books.filter(book => book.section === "New");

      populateBooks('oldTestamentList', oldBooks);
      populateBooks('newTestamentList', newBooks);
    })
    .catch(err => {
      console.error("Failed to load books.json:", err);
      document.getElementById('oldTestamentList').textContent = 'Error loading Old Testament.';
      document.getElementById('newTestamentList').textContent = 'Error loading New Testament.';
    });
}

function populateBooks(sectionId, books) {
  const container = document.getElementById(sectionId);
  container.innerHTML = '';

  if (!books || books.length === 0) {
    container.textContent = 'No books found.';
    return;
  }

  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book';
    div.textContent = book.tamil;
    div.title = book.tamil;
    div.onclick = () => {
      openChapterModal(book);
    };
    container.appendChild(div);
  });
}

function openChapterModal(book) {
  const modal = document.getElementById('chapterModal');
  const chapterList = document.getElementById('chapterList');
  const title = document.getElementById('modalTitle');

  title.textContent = `${book.tamil}`;
  chapterList.innerHTML = '';

  for (let i = 1; i <= book.chapters; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.onclick = () => {
      const url = `reader.html?book=${encodeURIComponent(book.english)}&chapter=${i}`;
      window.location.href = url;
    };
    chapterList.appendChild(btn);
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('chapterModal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', loadBooks);







// Expand Book List
document.addEventListener('DOMContentLoaded', () => {
  const expandBtn = document.getElementById('expandBtn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      document.getElementById('newTestamentList').classList.add('active');
      expandBtn.style.display = 'none';
    });
  }

  loadWallpapers();
});

// Switch language tabs
function switchGallery(lang) {
  document.querySelectorAll('#wallpaper-section .tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.wallpaper-scroll-container').forEach(c => c.classList.add('hidden'));

  if (lang === 'tamil') {
    document.querySelectorAll('#wallpaper-section .tab')[0].classList.add('active');
    document.getElementById('tamil-wallpapers').classList.remove('hidden');
  } else {
    document.querySelectorAll('#wallpaper-section .tab')[1].classList.add('active');
    document.getElementById('english-wallpapers').classList.remove('hidden');
  }
}

// Load wallpapers
function loadWallpapers() {
  const tamil = document.getElementById('tamil-wallpapers');
  const english = document.getElementById('english-wallpapers');

  for (let i = 1; i <= 10; i++) {
    const imgTa = document.createElement('img');
    imgTa.src = `./wallpapers/tamil/verse${i}.png`;
    imgTa.alt = `Tamil Verse ${i}`;
    imgTa.onclick = () => openImageModal(imgTa.src);  // <-- Added
    tamil.appendChild(imgTa);

    const imgEn = document.createElement('img');
    imgEn.src = `./wallpapers/english/verse${i}.png`;
    imgEn.alt = `English Verse ${i}`;
    imgEn.onclick = () => openImageModal(imgEn.src);  // <-- Added
    english.appendChild(imgEn);
  }
}


// Lightbox/modal
function openImageModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const downloadBtn = document.getElementById('downloadBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const instagramBtn = document.getElementById('instagramBtn');

  modalImage.src = imageSrc;
  downloadBtn.href = imageSrc;

  // Encode for social sharing
  const shareUrl = encodeURIComponent(window.location.href);
  const imageToShare = encodeURIComponent(imageSrc);

  whatsappBtn.href = `https://wa.me/?text=${imageToShare}`;
  facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${imageToShare}`;
  instagramBtn.href = `https://www.instagram.com/?url=${imageToShare}`;

  modal.classList.remove('hidden');
}

function closeImageModal() {
  document.getElementById('imageModal').classList.add('hidden');
}


let currentGallery = 'tamil';
let currentIndex = 0;

function openImageModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const downloadBtn = document.getElementById('downloadBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const instagramBtn = document.getElementById('instagramBtn');

  modal.classList.remove('hidden');
  modalImage.src = imageSrc;
  downloadBtn.href = imageSrc;

  const encoded = encodeURIComponent(imageSrc);
  whatsappBtn.href = `https://wa.me/?text=${encoded}`;
  facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  instagramBtn.href = `https://www.instagram.com/?url=${encoded}`;

  // set current index
  const galleryList = document.querySelectorAll(`#${currentGallery}-wallpapers img`);
  galleryList.forEach((img, idx) => {
    if (img.src === imageSrc) currentIndex = idx;
  });
}

function showNextImage() {
  const galleryList = document.querySelectorAll(`#${currentGallery}-wallpapers img`);
  if (currentIndex < galleryList.length - 1) {
    currentIndex++;
    openImageModal(galleryList[currentIndex].src);
  }
}

function showPrevImage() {
  const galleryList = document.querySelectorAll(`#${currentGallery}-wallpapers img`);
  if (currentIndex > 0) {
    currentIndex--;
    openImageModal(galleryList[currentIndex].src);
  }
}

// Attach button listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextImageBtn').addEventListener('click', showNextImage);
  document.getElementById('prevImageBtn').addEventListener('click', showPrevImage);
});


document.addEventListener('keydown', function (e) {
  const modal = document.getElementById('imageModal');
  if (!modal.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'Escape') closeImageModal();
  }
});

