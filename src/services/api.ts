export * from './ai/aiService';
export * from './profile/profileService';

import { AIService } from './ai/aiService';
import { ProfileService, INITIAL_LEARNER_PROFILE } from './profile/profileService';

export const apiService = AIService;
export const profileStorage = ProfileService;
export const initialProfile = INITIAL_LEARNER_PROFILE;
