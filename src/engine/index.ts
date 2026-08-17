import { MasteryModel } from './mastery/masteryModel';
import { ErrorMemory } from './errors/errorMemory';
import { PrioritizationEngine } from './recommendation/prioritizationEngine';
import { RetestVerificationEngine } from './verification/retestVerification';
import { eventBus } from './events/eventBus';

export const LearningEngine = {
  mastery: MasteryModel,
  errors: ErrorMemory,
  recommendation: PrioritizationEngine,
  verification: RetestVerificationEngine,
  events: eventBus
};

export {
  MasteryModel,
  ErrorMemory,
  PrioritizationEngine,
  RetestVerificationEngine,
  eventBus
};
