export interface PathwaySessionDraft {
  pathwayId: string;
  sessionMinutes?: number;
  currentStepIdx: number;
  step1SelectedIdx: number | null;
  step2Input: string;
  step2Evaluation: unknown;
  step3Input: string;
  step3Evaluation: unknown;
  retestAnswers: Record<number, number>;
  retestResult: unknown;
  completionRecordedAt?: string;
  updatedAt: string;
}

/**
 * Resolves the immutable duration snapshot for a pathway draft.
 * New drafts use the persisted value; legacy drafts fall back to the
 * learner's current preference and are upgraded when saved again.
 */
export function resolveSessionDuration(
  persistedSessionMinutes: unknown,
  profilePreferredSessionMinutes: number | undefined,
  fallbackMinutes = 20
): number {
  const persisted = Number(persistedSessionMinutes);
  if (Number.isFinite(persisted) && persisted > 0) {
    return persisted;
  }

  const preferred = Number(profilePreferredSessionMinutes);
  if (Number.isFinite(preferred) && preferred > 0) {
    return preferred;
  }

  return fallbackMinutes;
}
