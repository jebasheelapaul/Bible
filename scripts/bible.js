let booksMeta = [];
let currentBook = "Genesis";
let currentChapter = 1;

// Load books metadata
fetch("data/books.json")
  .then(res => res.json())
  .then(data => {
    booksMeta = data;
    renderBibleMenu(data);
    const urlParams = new URLSearchParams(window.location.search);
    currentBook = urlParams.get('book') || "Genesis";
    currentChapter = parseInt(urlParams.get('chapter')) || 1;
    loadChapter(currentBook, currentChapter);
  })
  .catch(err => console.error("Error loading books.json", err));

function renderBibleMenu(books) {
  const oldList = document.getElementById("oldTestamentList");
  const newList = document.getElementById("newTestamentList");
  oldList.innerHTML = "";
  newList.innerHTML = "";

  books.forEach(book => {
    const li = document.createElement("li");
    li.textContent = book.tamil;
    li.onclick = () => showChapterSelection(book);
    (book.section === "Old" ? oldList : newList).appendChild(li);
  });
}

function showChapterSelection(book) {
  currentBook = book.english;
  const chapterList = document.getElementById("chapterList");
  const bookTitle = document.getElementById("selectedBookTitle");
  chapterList.innerHTML = "";
  bookTitle.textContent = book.tamil;

  document.getElementById("bookSelection").style.display = "none";
  document.getElementById("chapterSelection").style.display = "block";

  for (let i = 1; i <= book.chapters; i++) {
    const li = document.createElement("li");
    li.textContent = i;
    li.onclick = () => {
      currentChapter = i;
      loadChapter(currentBook, currentChapter);
      closeDrawer();
      document.getElementById("bookSelection").style.display = "block";
      document.getElementById("chapterSelection").style.display = "none";
    };
    chapterList.appendChild(li);
  }
}

document.getElementById("backToBooks").onclick = () => {
  document.getElementById("chapterSelection").style.display = "none";
  document.getElementById("bookSelection").style.display = "block";
};

function loadChapter(bookName, chapterNum) {
  const bookInfo = booksMeta.find(b => b.english === bookName);
  if (!bookInfo) {
    alert("Invalid book selected.");
    return;
  }

  if (chapterNum > bookInfo.chapters) {
    chapterNum = 1;
  }

  currentBook = bookName;
  currentChapter = chapterNum;

  showLoader();

  fetch(`data/${bookName}.json`)
    .then(res => res.json())
    .then(json => {
      const chapter = json.chapters.find(c => c.chapter === String(chapterNum));
      if (!chapter) {
        alert("Chapter not found.");
        return;
      }
      renderChapter(`${bookInfo.tamil} ${chapterNum}`, chapter.verses);
    })
    .finally(hideLoader);
}




function renderChapter(title, verses) {
  document.getElementById("chapterTitle").textContent = title;
  const container = document.getElementById("versesContainer");
  container.innerHTML = "";

  verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "verse-text";
    div.innerHTML = `<span class="verse-text-content">${v.verse}. ${v.text}</span>`;
    div.addEventListener("click", () => openVerseModal(v.verse, v.text));
    container.appendChild(div);
  });
}

function openVerseModal(verseNum, verseText) {
  const chapterRef = document.getElementById("chapterTitle").textContent;
  const fullText = `${verseText} - ${chapterRef}: ${verseNum}`;
  document.getElementById("modalVerseText").textContent = fullText;
  document.getElementById("verseModal").classList.remove("hidden");

  const copyBtn = document.getElementById("modalCopyBtn");
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy";
        document.getElementById("verseModal").classList.add("hidden");
      }, 1200);
    });
  };
}

document.getElementById("verseModal").addEventListener("click", (e) => {
  if (e.target.id === "verseModal") {
    document.getElementById("verseModal").classList.add("hidden");
  }
});




document.getElementById("prevChapter").onclick = () => {
  if (currentChapter > 1) {
    currentChapter--;
    loadChapter(currentBook, currentChapter);
  } else {
    alert("இது முதல் அதிகாரம்.");
  }
};

document.getElementById("nextChapter").onclick = () => {
  const bookInfo = booksMeta.find(b => b.english === currentBook);
  if (currentChapter < bookInfo.chapters) {
    currentChapter++;
    loadChapter(currentBook, currentChapter);
  } else {
    alert("இது கடைசி அதிகாரம்.");
  }
};

let currentFontSize = 20;
function changeFontSize(change) {
  currentFontSize += change;
  if (currentFontSize < 14) currentFontSize = 14;
  if (currentFontSize > 36) currentFontSize = 36;

  document.querySelectorAll(".verse-text").forEach(el => {
    el.style.fontSize = `${currentFontSize}px`;
  });
}

const bibleDrawer = document.getElementById("bibleDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerCloseBtn = document.getElementById("drawerClose");
const bibleMenuBtn = document.getElementById("bibleMenuBtn");

bibleMenuBtn.onclick = () => {
  bibleDrawer.classList.remove("hidden");
  drawerOverlay.classList.add("visible");
};

function closeDrawer() {
  bibleDrawer.classList.add("hidden");
  drawerOverlay.classList.remove("visible");
}

drawerOverlay.onclick = closeDrawer;
drawerCloseBtn.onclick = closeDrawer;

document.getElementById("homeBtn").onclick = () => {
  window.location.href = "index.html";
};

function showLoader() {
  document.getElementById("loader").style.display = "block";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}




document.getElementById("chapterTitle").onclick = () => {
  const book = booksMeta.find(b => b.english === currentBook);
  if (book) {
    showChapterSelection(book);
    bibleDrawer.classList.remove("hidden");
    drawerOverlay.classList.add("visible");
  }
};







function toggleExpand(listId, headerEl) {
  const list = document.getElementById(listId);
  const arrow = headerEl.querySelector(".arrow-icon");
  const isExpanded = headerEl.getAttribute("data-expanded") === "true";

  if (isExpanded) {
    list.style.display = "none";
    arrow.textContent = "▸";
    headerEl.setAttribute("data-expanded", "false");
  } else {
    list.style.display = "block";
    arrow.textContent = "▾";
    headerEl.setAttribute("data-expanded", "true");
  }
}

// Expand Old Testament by default
document.getElementById("oldTestamentList").style.display = "block";
const oldHeader = document.querySelector('h3.expand-toggle[onclick*="oldTestamentList"]');
oldHeader.querySelector(".arrow-icon").textContent = "▾";
oldHeader.setAttribute("data-expanded", "true");


// Collapse New Testament by default
const newHeader = document.querySelector('h3.expand-toggle[onclick*="newTestamentList"]');
newHeader.querySelector(".arrow-icon").textContent = "▸";
newHeader.setAttribute("data-expanded", "false");
document.getElementById("newTestamentList").style.display = "none";


