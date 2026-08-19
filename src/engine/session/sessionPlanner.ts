import { PathwayStep } from '../../types';

export interface SessionPlan {
  sessionMinutes: number;
  stepIndexes: number[];
  includesRetest: boolean;
  mode: 'quick' | 'standard' | 'deep';
}

export function buildSessionPlan(
  steps: PathwayStep[],
  sessionMinutes: number
): SessionPlan {
  const safeMinutes = Math.max(1, sessionMinutes);

  if (safeMinutes <= 15) {
    const stepIndexes = steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => step.type !== 'retest')
      .map(({ index }) => index);

    return {
      sessionMinutes: safeMinutes,
      stepIndexes,
      includesRetest: false,
      mode: 'quick',
    };
  }

  if (safeMinutes <= 25) {
    return {
      sessionMinutes: safeMinutes,
      stepIndexes: steps.map((_, index) => index),
      includesRetest: steps.some((step) => step.type === 'retest'),
      mode: 'standard',
    };
  }

  return {
    sessionMinutes: safeMinutes,
    stepIndexes: steps.map((_, index) => index),
    includesRetest: steps.some((step) => step.type === 'retest'),
    mode: 'deep',
  };
}
