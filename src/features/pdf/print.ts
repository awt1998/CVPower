/**
 * PDF export via the browser's native print pipeline. This yields real,
 * selectable text (ATS-safe — not a rasterized image), correct fonts, and RTL
 * support, with zero extra dependencies. The print stylesheet (globals.css)
 * hides all app chrome so only the resume sheet is printed; the user chooses
 * "Save as PDF" in the print dialog.
 */
export function printResume(documentTitle?: string): void {
  if (typeof window === 'undefined') return;

  const previousTitle = document.title;
  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener('afterprint', restore);
  };

  // The dialog uses document.title as the default file name.
  if (documentTitle && documentTitle.trim()) {
    document.title = documentTitle.trim();
  }
  window.addEventListener('afterprint', restore);
  window.print();
}
