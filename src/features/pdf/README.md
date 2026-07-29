# feature: pdf

PDF export via the browser's native print pipeline (`window.print()` + the
`@media print` rules in `globals.css`). This produces **real, selectable text**
(ATS-safe, not an image), correct fonts, and RTL support, with zero extra
dependencies — the user picks "Save as PDF" in the print dialog.

- `print.ts` — `printResume(title?)`: sets the document title (default file name)
  and opens the print dialog. The print stylesheet hides all app chrome so only
  the resume sheet is printed.

See [../../../docs/pdf-export.md](../../../docs/pdf-export.md).
