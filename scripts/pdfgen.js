

document.getElementById("downloadPdfBtn").onclick = () => {
  document.getElementById("downloadConfirm").classList.remove("hidden");
};

document.getElementById("confirmDownloadBtn").onclick = () => {
  document.getElementById("downloadConfirm").classList.add("hidden");
  generatePDF(booksMeta, currentBook, currentChapter, splitTamilText);
};

document.getElementById("cancelDownloadBtn").onclick = () => {
  document.getElementById("downloadConfirm").classList.add("hidden");
};




function generatePDF(booksMeta, currentBook, currentChapter, splitTamilText) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // ✅ Use font already loaded from Bamini.js
    doc.setFont("NotoSerifTamil");
    doc.setFontSize(16);

    const bookInfo = booksMeta.find(b => b.english === currentBook);
    if (!bookInfo) {
      alert("Error: Book information not found.");
      return;
    }

    const title = `${bookInfo.tamil} ${currentChapter}`;
    const verses = document.querySelectorAll("#versesContainer .verse-text");

    let y = 20;
    const margin = 10;
    const pageHeight = 297;
    const maxY = pageHeight - 20;
    const lineHeight = 10;
    const maxWidth = 190;

    doc.text(title, margin, y, { maxWidth });
    y += lineHeight * 1.5;

    doc.setFontSize(12);

    verses.forEach((verseEl) => {
      const text = verseEl.textContent.trim();
      const lines = splitTamilText(text, 60);

      if (y + lines.length * lineHeight > maxY) {
        doc.addPage();
        y = margin;
      }

      lines.forEach(line => {
        doc.text(line, margin, y, { maxWidth });
        y += lineHeight;
      });

      y += lineHeight * 0.5;
    });

    const safeTitle = `${bookInfo.tamil}_${currentChapter}`.replace(/[^\p{L}\p{N}]/gu, "_");
    doc.save(`${safeTitle}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF.");
  }
}
