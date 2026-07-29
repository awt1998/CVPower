import { normalizeText, containsTerm } from '@/lib/text';

/**
 * Curated skills taxonomy — the single most important asset for match quality.
 * It is data, not logic: extend it via PR. Each entry has a display `canonical`,
 * a `category`, and `aliases` (all matched case-insensitively, word-boundary aware).
 */
export type SkillCategory =
  | 'language'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'tool'
  | 'concept'
  | 'soft';

export interface SkillEntry {
  canonical: string;
  category: SkillCategory;
  aliases: string[];
}

export const SKILLS: SkillEntry[] = [
  // Languages
  { canonical: 'JavaScript', category: 'language', aliases: ['javascript', 'js'] },
  { canonical: 'TypeScript', category: 'language', aliases: ['typescript', 'ts'] },
  { canonical: 'Python', category: 'language', aliases: ['python'] },
  { canonical: 'Java', category: 'language', aliases: ['java'] },
  { canonical: 'C#', category: 'language', aliases: ['c#', 'csharp', 'c sharp'] },
  { canonical: 'C++', category: 'language', aliases: ['c++', 'cpp'] },
  { canonical: 'Go', category: 'language', aliases: ['golang', 'go lang'] },
  { canonical: 'Rust', category: 'language', aliases: ['rust'] },
  { canonical: 'PHP', category: 'language', aliases: ['php'] },
  { canonical: 'Ruby', category: 'language', aliases: ['ruby'] },
  { canonical: 'Swift', category: 'language', aliases: ['swift'] },
  { canonical: 'Kotlin', category: 'language', aliases: ['kotlin'] },
  { canonical: 'SQL', category: 'language', aliases: ['sql'] },
  { canonical: 'HTML', category: 'language', aliases: ['html', 'html5'] },
  { canonical: 'CSS', category: 'language', aliases: ['css', 'css3'] },
  { canonical: 'Bash', category: 'language', aliases: ['bash', 'shell scripting'] },

  // Frameworks / libraries
  { canonical: 'React', category: 'framework', aliases: ['react', 'react.js', 'reactjs'] },
  { canonical: 'Next.js', category: 'framework', aliases: ['next.js', 'nextjs', 'next js'] },
  { canonical: 'Vue', category: 'framework', aliases: ['vue', 'vue.js', 'vuejs'] },
  { canonical: 'Angular', category: 'framework', aliases: ['angular', 'angularjs'] },
  { canonical: 'Svelte', category: 'framework', aliases: ['svelte', 'sveltekit'] },
  { canonical: 'Node.js', category: 'framework', aliases: ['node.js', 'nodejs', 'node js', 'node'] },
  { canonical: 'Express', category: 'framework', aliases: ['express', 'express.js'] },
  { canonical: 'Django', category: 'framework', aliases: ['django'] },
  { canonical: 'Flask', category: 'framework', aliases: ['flask'] },
  { canonical: 'Spring', category: 'framework', aliases: ['spring', 'spring boot'] },
  { canonical: '.NET', category: 'framework', aliases: ['.net', 'dotnet', 'asp.net'] },
  { canonical: 'React Native', category: 'framework', aliases: ['react native'] },
  { canonical: 'Flutter', category: 'framework', aliases: ['flutter'] },
  { canonical: 'Tailwind CSS', category: 'framework', aliases: ['tailwind', 'tailwind css'] },
  { canonical: 'Redux', category: 'framework', aliases: ['redux'] },
  { canonical: 'GraphQL', category: 'framework', aliases: ['graphql'] },

  // Databases
  { canonical: 'PostgreSQL', category: 'database', aliases: ['postgresql', 'postgres'] },
  { canonical: 'MySQL', category: 'database', aliases: ['mysql'] },
  { canonical: 'MongoDB', category: 'database', aliases: ['mongodb', 'mongo'] },
  { canonical: 'Redis', category: 'database', aliases: ['redis'] },
  { canonical: 'SQLite', category: 'database', aliases: ['sqlite'] },
  { canonical: 'Elasticsearch', category: 'database', aliases: ['elasticsearch', 'elastic search'] },
  { canonical: 'DynamoDB', category: 'database', aliases: ['dynamodb'] },

  // Cloud / DevOps
  { canonical: 'AWS', category: 'cloud', aliases: ['aws', 'amazon web services'] },
  { canonical: 'Azure', category: 'cloud', aliases: ['azure', 'microsoft azure'] },
  { canonical: 'Google Cloud', category: 'cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { canonical: 'Docker', category: 'cloud', aliases: ['docker'] },
  { canonical: 'Kubernetes', category: 'cloud', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'Terraform', category: 'cloud', aliases: ['terraform'] },
  { canonical: 'CI/CD', category: 'cloud', aliases: ['ci/cd', 'ci cd', 'continuous integration', 'continuous delivery'] },
  { canonical: 'Linux', category: 'cloud', aliases: ['linux', 'unix'] },
  { canonical: 'Serverless', category: 'cloud', aliases: ['serverless', 'lambda'] },

  // Tools
  { canonical: 'Git', category: 'tool', aliases: ['git', 'github', 'gitlab'] },
  { canonical: 'Jira', category: 'tool', aliases: ['jira'] },
  { canonical: 'Figma', category: 'tool', aliases: ['figma'] },
  { canonical: 'Jest', category: 'tool', aliases: ['jest'] },
  { canonical: 'Playwright', category: 'tool', aliases: ['playwright'] },
  { canonical: 'Cypress', category: 'tool', aliases: ['cypress'] },
  { canonical: 'Webpack', category: 'tool', aliases: ['webpack'] },
  { canonical: 'Excel', category: 'tool', aliases: ['excel', 'microsoft excel'] },
  { canonical: 'Tableau', category: 'tool', aliases: ['tableau'] },
  { canonical: 'Power BI', category: 'tool', aliases: ['power bi', 'powerbi'] },

  // Concepts / methods
  { canonical: 'REST APIs', category: 'concept', aliases: ['rest', 'rest api', 'rest apis', 'restful'] },
  { canonical: 'Microservices', category: 'concept', aliases: ['microservices', 'microservice'] },
  { canonical: 'Agile', category: 'concept', aliases: ['agile', 'scrum', 'kanban'] },
  { canonical: 'Testing', category: 'concept', aliases: ['unit testing', 'testing', 'tdd', 'test driven'] },
  { canonical: 'Machine Learning', category: 'concept', aliases: ['machine learning', 'ml', 'deep learning'] },
  { canonical: 'Data Analysis', category: 'concept', aliases: ['data analysis', 'data analytics'] },
  { canonical: 'CI', category: 'concept', aliases: ['continuous integration'] },
  { canonical: 'Accessibility', category: 'concept', aliases: ['accessibility', 'a11y', 'wcag'] },
  { canonical: 'SEO', category: 'concept', aliases: ['seo', 'search engine optimization'] },
  { canonical: 'UI/UX', category: 'concept', aliases: ['ui/ux', 'ux', 'user experience', 'ui design'] },
  { canonical: 'Project Management', category: 'concept', aliases: ['project management', 'project manager'] },

  // Soft skills
  { canonical: 'Communication', category: 'soft', aliases: ['communication', 'communicate'] },
  { canonical: 'Leadership', category: 'soft', aliases: ['leadership', 'lead', 'leading'] },
  { canonical: 'Collaboration', category: 'soft', aliases: ['collaboration', 'collaborate', 'teamwork', 'cross-functional'] },
  { canonical: 'Problem Solving', category: 'soft', aliases: ['problem solving', 'problem-solving'] },
  { canonical: 'Mentoring', category: 'soft', aliases: ['mentoring', 'mentorship', 'coaching'] },
  { canonical: 'Attention to Detail', category: 'soft', aliases: ['attention to detail', 'detail-oriented'] },
];

/** canonical (lowercased) -> entry */
export const CANONICAL_TO_ENTRY = new Map<string, SkillEntry>(
  SKILLS.map((entry) => [entry.canonical.toLowerCase(), entry]),
);

/** every alias/canonical term (normalized) paired with its entry, longest first */
const TERM_ENTRIES: { term: string; entry: SkillEntry }[] = SKILLS.flatMap((entry) =>
  [entry.canonical, ...entry.aliases].map((term) => ({ term: normalizeText(term), entry })),
).sort((a, b) => b.term.length - a.term.length);

export interface DetectedSkill {
  canonical: string;
  category: SkillCategory;
}

/**
 * Detect the distinct skills present in a block of text. Word-boundary aware so
 * "java" does not match "javascript". Returns each canonical skill at most once.
 */
export function extractSkills(text: string): DetectedSkill[] {
  const haystack = normalizeText(text);
  const found = new Map<string, DetectedSkill>();
  for (const { term, entry } of TERM_ENTRIES) {
    const key = entry.canonical.toLowerCase();
    if (found.has(key)) continue;
    if (containsTerm(haystack, term)) {
      found.set(key, { canonical: entry.canonical, category: entry.category });
    }
  }
  return [...found.values()];
}

/** Resolve a single term to its canonical skill, if recognized. */
export function resolveSkill(term: string): DetectedSkill | null {
  const normalized = normalizeText(term);
  for (const { term: t, entry } of TERM_ENTRIES) {
    if (t === normalized) return { canonical: entry.canonical, category: entry.category };
  }
  return null;
}
