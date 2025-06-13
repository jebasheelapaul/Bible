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
