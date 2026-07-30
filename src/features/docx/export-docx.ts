import {
  formatDateRange,
  formatResumeDate,
  formatLocation,
  joinParts,
} from '@/features/templates/template-utils';
import type { Resume } from '@/features/resume/types';

export interface DocxOptions {
  locale: string;
  rtl: boolean;
  presentLabel: string;
  sectionTitles: Record<string, string>;
}

/**
 * Build an editable .docx from a resume. The `docx` library is dynamically
 * imported so it stays out of the main bundle and never runs on the server.
 */
export async function resumeToBlob(resume: Resume, options: DocxOptions): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');
  const { locale, rtl, presentLabel, sectionTitles } = options;
  const { basics, sections, meta } = resume;
  const hidden = new Set(meta.hiddenSections ?? []);
  const show = (id: string) => !hidden.has(id);

  const bodyAlign = rtl ? AlignmentType.RIGHT : AlignmentType.LEFT;
  const headerAlign =
    (meta.headerAlign ?? 'center') === 'center' ? AlignmentType.CENTER : bodyAlign;

  const children: InstanceType<typeof Paragraph>[] = [];

  const heading = (text: string) =>
    new Paragraph({
      spacing: { before: 220, after: 80 },
      alignment: bodyAlign,
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20 })],
    });
  const text = (value: string, opts: { bold?: boolean; italics?: boolean; size?: number } = {}) =>
    new Paragraph({ alignment: bodyAlign, children: [new TextRun({ text: value, ...opts })] });
  const bullet = (value: string) =>
    new Paragraph({ text: value, bullet: { level: 0 }, alignment: bodyAlign });

  // Header
  children.push(
    new Paragraph({
      alignment: headerAlign,
      children: [new TextRun({ text: basics.fullName || ' ', bold: true, size: 36 })],
    }),
  );
  if (basics.headline) {
    children.push(new Paragraph({ alignment: headerAlign, children: [new TextRun({ text: basics.headline, size: 22, color: '555555' })] }));
  }
  const contact = joinParts([
    basics.email,
    basics.phone,
    formatLocation(basics.location),
    basics.website,
    ...basics.links.map((l) => l.label || l.url),
  ]);
  if (contact) {
    children.push(new Paragraph({ alignment: headerAlign, children: [new TextRun({ text: contact, size: 18, color: '666666' })] }));
  }

  if (show('summary') && basics.summary?.trim()) {
    children.push(heading(sectionTitles.summary ?? 'Summary'), text(basics.summary.trim()));
  }

  if (show('experience') && sections.experience.length > 0) {
    children.push(heading(sectionTitles.experience ?? 'Experience'));
    for (const e of sections.experience) {
      const range = formatDateRange(e.startDate, e.endDate, e.current, locale, presentLabel);
      children.push(text(joinParts([e.role || e.company, range], '  —  '), { bold: true }));
      const sub = joinParts([e.role ? e.company : undefined, e.location]);
      if (sub) children.push(text(sub, { italics: true, size: 20 }));
      if (e.summary?.trim()) children.push(text(e.summary.trim()));
      for (const h of e.highlights.filter((x) => x.trim())) children.push(bullet(h));
    }
  }

  if (show('education') && sections.education.length > 0) {
    children.push(heading(sectionTitles.education ?? 'Education'));
    for (const ed of sections.education) {
      const range = formatDateRange(ed.startDate, ed.endDate, ed.current, locale, presentLabel);
      children.push(text(joinParts([ed.degree || ed.institution, range], '  —  '), { bold: true }));
      const sub = joinParts([ed.degree ? ed.institution : undefined, ed.field, ed.location, ed.grade]);
      if (sub) children.push(text(sub, { italics: true, size: 20 }));
      for (const h of ed.highlights.filter((x) => x.trim())) children.push(bullet(h));
    }
  }

  if (show('skills') && sections.skills.length > 0) {
    children.push(heading(sectionTitles.skills ?? 'Skills'));
    for (const g of sections.skills) {
      children.push(text(joinParts([g.category ? `${g.category}:` : undefined, g.items.join(', ')], ' ')));
    }
  }

  if (show('projects') && sections.projects.length > 0) {
    children.push(heading(sectionTitles.projects ?? 'Projects'));
    for (const p of sections.projects) {
      children.push(text(p.name, { bold: true }));
      if (p.description?.trim()) children.push(text(p.description.trim()));
      for (const h of p.highlights.filter((x) => x.trim())) children.push(bullet(h));
    }
  }

  if (show('certifications') && sections.certifications.length > 0) {
    children.push(heading(sectionTitles.certifications ?? 'Certifications'));
    for (const c of sections.certifications) {
      children.push(text(joinParts([c.name, c.issuer, formatResumeDate(c.date, locale)])));
    }
  }

  if (show('languages') && sections.languages.length > 0) {
    children.push(heading(sectionTitles.languages ?? 'Languages'));
    children.push(text(sections.languages.map((l) => l.name).join(', ')));
  }

  if (show('references') && sections.references.length > 0) {
    children.push(heading(sectionTitles.references ?? 'References'));
    for (const r of sections.references) {
      children.push(text(joinParts([r.name, r.title, r.company]), { bold: true }));
      const c = joinParts([r.email, r.phone]);
      if (c) children.push(text(c, { size: 20 }));
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBlob(doc);
}

/** Build and download the resume as a .docx file. */
export async function downloadResumeDocx(resume: Resume, options: DocxOptions): Promise<void> {
  const blob = await resumeToBlob(resume, options);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${(resume.meta.title || 'resume').replace(/[^\w-]+/g, '_')}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
