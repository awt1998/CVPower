import { offlineAchievementService, type AchievementService } from './achievement';

/**
 * The active achievement service. This is the SINGLE file to replace to plug in a
 * future AI provider (local WASM model or, if ever enabled, an external API):
 * export a different implementation of `AchievementService` here and nothing else
 * in the app changes.
 */
export const achievementService: AchievementService = offlineAchievementService;
