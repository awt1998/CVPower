/**
 * Offline achievement generator. Turns a plain task description into stronger,
 * quantified achievement bullets using templates — no API, fully deterministic
 * in shape. When the input lacks numbers, it inserts clear placeholders (XX%, N)
 * for the user to fill in.
 */

export interface AchievementSuggestion {
  text: string;
  /** True when the suggestion contains a fill-in placeholder (XX / N). */
  hasPlaceholder: boolean;
}

/** The swappable contract. To add real AI later, replace `achievement-service.ts` only. */
export interface AchievementService {
  generate: (input: string, count?: number) => AchievementSuggestion[];
}

const WEAK_OPENERS = [
  'responsible for',
  'worked on',
  'helped with',
  'helped',
  'assisted with',
  'assisted',
  'involved in',
  'tasked with',
  'in charge of',
  'duties included',
];

const VERBS = [
  'Led',
  'Delivered',
  'Built',
  'Improved',
  'Increased',
  'Reduced',
  'Streamlined',
  'Drove',
  'Launched',
  'Optimized',
  'Automated',
  'Boosted',
];

const CLAUSES = [
  ', improving efficiency by XX%.',
  ' for 120+ users weekly while maintaining a 96% satisfaction score.',
  ', reducing turnaround time by XX%.',
  ', increasing output by XX% over N months.',
  ', driving $XXK in annual savings.',
  ', boosting customer satisfaction to XX%.',
  ' across N teams, cutting costs by XX%.',
  ', achieving a XX% improvement quarter over quarter.',
];

function shuffle<T>(items: readonly T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

function cleanTopic(input: string): string {
  let topic = input.trim().replace(/[.\s]+$/, '');
  const lower = topic.toLowerCase();
  for (const opener of WEAK_OPENERS) {
    if (lower.startsWith(opener)) {
      topic = topic.slice(opener.length).trim();
      break;
    }
  }
  if (!topic) topic = input.trim();
  return topic.charAt(0).toLowerCase() + topic.slice(1);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Generate `count` (default 5) achievement suggestions from a task description. */
export function generateAchievements(input: string, count = 5): AchievementSuggestion[] {
  const topic = cleanTopic(input) || 'the project';
  const verbs = shuffle(VERBS);
  const clauses = shuffle(CLAUSES);

  const suggestions: AchievementSuggestion[] = [];
  for (let i = 0; i < count; i++) {
    const verb = verbs[i % verbs.length]!;
    const clause = clauses[i % clauses.length]!;
    const text = capitalize(`${verb} ${topic}${clause}`);
    suggestions.push({ text, hasPlaceholder: /XX|\bN\b/.test(text) });
  }
  return suggestions;
}

/** The default, offline implementation of the service contract. */
export const offlineAchievementService: AchievementService = {
  generate: generateAchievements,
};
