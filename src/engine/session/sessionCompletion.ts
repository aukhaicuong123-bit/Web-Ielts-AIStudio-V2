import { LearnerProfile } from '../../types';

export interface SessionCompletionResult {
  profile: LearnerProfile;
  recorded: boolean;
}

/**
 * Applies the single learner-level mutation for a completed intervention.
 * The caller persists the returned completion marker with the session draft.
 */
export function applySessionCompletionOnce(
  profile: LearnerProfile,
  sessionMinutes: number,
  completionRecordedAt?: string
): SessionCompletionResult {
  if (completionRecordedAt) {
    return { profile, recorded: false };
  }

  const minutes = Number(sessionMinutes);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error('A completed session must have a positive duration.');
  }

  const roundedMinutes = Math.round(minutes);
  return {
    recorded: true,
    profile: {
      ...profile,
      minutesStudiedToday: profile.minutesStudiedToday + roundedMinutes,
      completedSessions: profile.completedSessions + 1,
      recentActivity: [
        {
          id: `act_session_${Date.now()}`,
          type: 'intervention',
          title: `Hoàn thành phiên can thiệp ${roundedMinutes} phút`,
          timestamp: 'Vừa xong',
          scoreChange: `+${roundedMinutes} phút`
        },
        ...profile.recentActivity
      ]
    }
  };
}
