import { LearnerProfile, SubskillId, AssessmentStatus, CurrentLevelType } from '../../types';

const PROFILE_KEY = 'ai_ielts_learner_profile_v2';
const LEGACY_PROFILE_KEY = 'ai_ielts_learner_profile_v1';

const NEUTRAL_SUBSKILL_MASTERY: Record<SubskillId, number> = {
  reading_paraphrase: 50,
  reading_cause_effect: 50,
  reading_detail_inference: 50,
  reading_summary_completion: 50,
  writing_task_response: 50,
  writing_coherence_cohesion: 50,
  writing_lexical_resource: 50,
  writing_complex_grammar: 50,
  cross_paraphrase_transfer: 50,
  cross_argument_logic: 50
};

export const DEMO_LEARNER_PROFILE: LearnerProfile = {
  id: 'learner_demo',
  name: 'Học viên Demo',
  targetBand: 6.5,
  currentLevelType: 'estimated_score',
  previousOfficialScore: 5.5,
  aiEvidenceEstimate: 5.5,
  assessmentStatus: 'diagnostic_completed',
  hasBookedExam: false,
  examDate: undefined,
  dailyAvailableMinutes: 20,
  preferredSessionMinutes: 20,
  onboardingCompleted: true,
  isDemoProfile: true,

  // Evidence & metrics
  currentEstimatedBand: 5.5,
  hasCompletedDiagnostic: true,
  dailyGoalMinutes: 20,
  minutesStudiedToday: 15,
  streakDays: 4,
  subskillMastery: {
    reading_paraphrase: 52,
    reading_cause_effect: 48,
    reading_detail_inference: 65,
    reading_summary_completion: 58,
    writing_task_response: 60,
    writing_coherence_cohesion: 50,
    writing_lexical_resource: 54,
    writing_complex_grammar: 46,
    cross_paraphrase_transfer: 45,
    cross_argument_logic: 50
  },
  baselineMastery: {
    reading_paraphrase: 52,
    reading_cause_effect: 48,
    reading_detail_inference: 65,
    reading_summary_completion: 58,
    writing_task_response: 60,
    writing_coherence_cohesion: 50,
    writing_lexical_resource: 54,
    writing_complex_grammar: 46,
    cross_paraphrase_transfer: 45,
    cross_argument_logic: 50
  },
  activeErrors: [
    {
      id: 'err_1',
      code: 'ERR_PARAPHRASE_DISTORTION',
      category: 'Reading Comprehension',
      name: 'Bẫy paraphrase bóp méo nghĩa gốc (Distortion Trap)',
      subskill: 'reading_paraphrase',
      severity: 'high',
      count: 3,
      lastEncountered: 'Hôm nay lúc 09:30'
    },
    {
      id: 'err_2',
      code: 'ERR_UNSUBSTANTIATED_LEAP',
      category: 'Coherence & Cohesion',
      name: 'Luận điểm nhảy cóc thiếu cơ chế giải thích (Logical Gap)',
      subskill: 'writing_coherence_cohesion',
      severity: 'high',
      count: 2,
      lastEncountered: 'Hôm qua'
    },
    {
      id: 'err_3',
      code: 'ERR_COMMA_SPLICE',
      category: 'Grammatical Range & Accuracy',
      name: 'Lỗi ghép câu độc lập bằng dấu phẩy (Comma Splice)',
      subskill: 'writing_complex_grammar',
      severity: 'medium',
      count: 2,
      lastEncountered: '2 ngày trước'
    }
  ],
  reTestHistory: [
    {
      id: 'retest_sample_1',
      pathwayId: 'pathway_paraphrase',
      subskill: 'reading_paraphrase',
      timestamp: '16/08/2026',
      scoreBefore: 45,
      scoreAfter: 85,
      errorsDetectedBefore: ['Bẫy paraphrase bóp méo nghĩa gốc'],
      errorsDetectedAfter: [],
      status: 'verified_progress',
      evidenceSummary: 'Tăng 40% độ chính xác paraphrase sau khi hoàn thành Micro-Pathway 1. Triệt tiêu hoàn toàn bẫy phóng đại từ vựng.',
      improvementDelta: 40
    }
  ],
  completedSessions: 8,
  recentActivity: [
    {
      id: 'act_1',
      type: 'retest',
      title: 'Đã hoàn thành Re-Test Paraphrasing Precision',
      timestamp: '16/08/2026',
      scoreChange: '+40% Mastery'
    },
    {
      id: 'act_2',
      type: 'reading',
      title: 'Bài đọc: The Algorithmic Shift in Higher Education',
      timestamp: '15/08/2026',
      scoreChange: 'Đã phát hiện 2 lỗi suy luận'
    }
  ]
};

export const INITIAL_LEARNER_PROFILE = DEMO_LEARNER_PROFILE;

export function createUnassessedProfile(overrides: Partial<LearnerProfile> = {}): LearnerProfile {
  return {
    id: `learner_${Date.now()}`,
    name: 'Học viên',
    targetBand: 6.5,
    currentLevelType: 'not_assessed',
    previousOfficialScore: undefined,
    aiEvidenceEstimate: undefined,
    assessmentStatus: 'not_assessed',
    hasBookedExam: false,
    examDate: undefined,
    dailyAvailableMinutes: 20,
    preferredSessionMinutes: 20,
    onboardingCompleted: false,
    isDemoProfile: false,

    currentEstimatedBand: 0,
    hasCompletedDiagnostic: false,
    dailyGoalMinutes: 20,
    minutesStudiedToday: 0,
    streakDays: 1,
    subskillMastery: { ...NEUTRAL_SUBSKILL_MASTERY },
    baselineMastery: { ...NEUTRAL_SUBSKILL_MASTERY },
    activeErrors: [],
    reTestHistory: [],
    completedSessions: 0,
    recentActivity: [],
    ...overrides
  };
}

export class ProfileService {
  static getProfile(): LearnerProfile {
    try {
      const storedV2 = localStorage.getItem(PROFILE_KEY);
      if (storedV2) {
        const parsed = JSON.parse(storedV2);
        // Ensure all required fields exist and normalize types
        const normalized: LearnerProfile = {
          ...createUnassessedProfile(),
          ...parsed,
          targetBand: Number(parsed.targetBand) || 6.5,
          dailyAvailableMinutes: Number(parsed.dailyAvailableMinutes) || Number(parsed.dailyGoalMinutes) || 20,
          preferredSessionMinutes: Number(parsed.preferredSessionMinutes) || 20,
          dailyGoalMinutes: Number(parsed.dailyAvailableMinutes) || Number(parsed.dailyGoalMinutes) || 20,
          currentLevelType: parsed.currentLevelType || (parsed.previousOfficialScore ? 'official_score' : parsed.hasCompletedDiagnostic ? 'estimated_score' : 'not_assessed'),
          assessmentStatus: parsed.assessmentStatus || (parsed.hasCompletedDiagnostic ? 'diagnostic_completed' : 'not_assessed'),
          currentEstimatedBand:
            parsed.currentEstimatedBand ??
            parsed.aiEvidenceEstimate ??
            parsed.previousOfficialScore ??
            (parsed.hasCompletedDiagnostic ? 5.5 : 0),
          onboardingCompleted: parsed.onboardingCompleted !== undefined ? parsed.onboardingCompleted : true
        };
        return normalized;
      }

      const legacyStored = localStorage.getItem(LEGACY_PROFILE_KEY);
      if (legacyStored) {
        const parsed = JSON.parse(legacyStored);
        const migrated: LearnerProfile = {
          ...DEMO_LEARNER_PROFILE,
          ...parsed,
          hasCompletedDiagnostic: true,
          onboardingCompleted: true
        };
        this.saveProfile(migrated);
        return migrated;
      }
    } catch (e) {
      console.warn('Could not read profile from localStorage:', e);
    }
    return createUnassessedProfile();
  }

  static saveProfile(profile: LearnerProfile): void {
    try {
      const payload: LearnerProfile = {
        ...profile,
        targetBand: Number(profile.targetBand),
        dailyGoalMinutes: Number(profile.dailyAvailableMinutes || profile.dailyGoalMinutes || 20),
        dailyAvailableMinutes: Number(profile.dailyAvailableMinutes || 20),
        preferredSessionMinutes: Number(profile.preferredSessionMinutes || 20),
        currentEstimatedBand:
          profile.currentEstimatedBand ??
          profile.aiEvidenceEstimate ??
          profile.previousOfficialScore ??
          (profile.hasCompletedDiagnostic ? 5.5 : 0)
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save profile to localStorage:', e);
    }
  }

  /**
   * RESET LEARNING EVIDENCE:
   * Clears:
   *  - diagnostic evidence & completion state
   *  - subskill mastery (resets to neutral 50)
   *  - error memory & active errors
   *  - retest history
   *  - recent activity & sessions
   * KEEPS:
   *  - target band
   *  - current level type & previous official score
   *  - exam date & booking status
   *  - daily study time & preferred session duration
   *  - candidate name
   *  - onboardingCompleted = true
   */
  static resetLearningEvidence(currentProfile: LearnerProfile): LearnerProfile {
    try {
      // Clear saved pathway drafts
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pathway_session_') || key.startsWith('diag_'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Could not clear pathway sessions', e);
    }

    const resetProfile: LearnerProfile = {
      ...currentProfile,
      id: currentProfile.id || `learner_${Date.now()}`,
      isDemoProfile: false,
      onboardingCompleted: true,
      
      // Kept user preferences
      name: currentProfile.name || 'Học viên',
      targetBand: Number(currentProfile.targetBand) || 6.5,
      currentLevelType: currentProfile.currentLevelType || 'not_assessed',
      previousOfficialScore: currentProfile.previousOfficialScore,
      hasBookedExam: currentProfile.hasBookedExam || false,
      examDate: currentProfile.examDate,
      dailyAvailableMinutes: Number(currentProfile.dailyAvailableMinutes) || 20,
      preferredSessionMinutes: Number(currentProfile.preferredSessionMinutes) || 20,
      dailyGoalMinutes: Number(currentProfile.dailyAvailableMinutes) || 20,

      // Cleared learning evidence
      aiEvidenceEstimate: undefined,
      assessmentStatus: 'not_assessed',
      hasCompletedDiagnostic: false,
      currentEstimatedBand: currentProfile.previousOfficialScore || 0,
      minutesStudiedToday: 0,
      streakDays: 1,
      subskillMastery: { ...NEUTRAL_SUBSKILL_MASTERY },
      baselineMastery: { ...NEUTRAL_SUBSKILL_MASTERY },
      activeErrors: [],
      errorPatterns: [],
      reTestHistory: [],
      completedSessions: 0,
      recentActivity: []
    };

    this.saveProfile(resetProfile);
    return resetProfile;
  }

  /**
   * START AS NEW LEARNER:
   * Clears all learner-specific data and returns to Onboarding
   */
  static startAsNewLearner(): LearnerProfile {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(LEGACY_PROFILE_KEY);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pathway_session_') || key.startsWith('diag_') || key.startsWith('ai_ielts_'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Could not clear storage for new learner', e);
    }

    const fresh = createUnassessedProfile({ onboardingCompleted: false, isDemoProfile: false });
    this.saveProfile(fresh);
    return fresh;
  }

  /**
   * Legacy reset helper
   */
  static resetProfile(): LearnerProfile {
    return this.startAsNewLearner();
  }
}
