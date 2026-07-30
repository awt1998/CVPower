/**
 * Read a resume file to plain text, entirely in the browser. Heavy parsers are
 * dynamically imported so they're code-split and never touch the server bundle.
 */
export async function readResumeFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return readPdf(file);
  if (name.endsWith('.docx')) return readDocx(file);
  return file.text();
}

async function readDocx(file: File): Promise<string> {
  const mod = await import('mammoth');
  const mammoth = (mod as unknown as { default?: typeof mod }).default ?? mod;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function readPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  let text = '';
  for (let page = 1; page <= pdf.numPages; page++) {
    const content = await (await pdf.getPage(page)).getTextContent();
    const line = content.items
      .map((item) => (typeof (item as { str?: unknown }).str === 'string' ? (item as { str: string }).str : ''))
      .join(' ');
    text += `${line}\n`;
  }
  return text;
}
