# feature: templates

Resume templates. Every template renders through one shared, ATS-safe,
single-column document (`resume-document.tsx`); a template is just a `TemplateTheme`
(typography + accent) in `registry.ts`. This guarantees the output stays
machine-parseable — only presentation changes.

- `resume-document.tsx` — the shared renderer (fixed dark-on-white, RTL-aware).
- `registry.ts` — `TEMPLATE_THEMES`, `getTemplateTheme`, `DEFAULT_TEMPLATE_ID`.
- `template-utils.ts` — date/location formatting helpers.
- `components/` — `ResumePreview` (renders the sheet) and `TemplatePicker`.

Current templates: **classic** and **modern**. See [../../../docs/pdf-export.md](../../../docs/pdf-export.md).
