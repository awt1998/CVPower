/** Public API of the job-matching feature. */
export * from './types';
export * from './taxonomy';
export { extractResumeText, buildResumeIndex } from './resume-index';
export { analyzeJob } from './job-analysis';
export { matchRequirements } from './match';
