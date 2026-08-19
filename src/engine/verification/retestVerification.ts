import { ReTestResult, SubskillId, LearnerProfile } from '../../types';
import { SUBSKILLS_DICTIONARY } from '../../data/mockContent';
import { MasteryModel } from '../mastery/masteryModel';
import { ErrorMemory } from '../errors/errorMemory';
import { ErrorRepository } from '../errors/errorRepository';
export interface RetestEvaluationInput {
  pathwayId: string;
  subskill: SubskillId;
  scoreBefore: number;
  answers: any[];
  expectedAnswers: any[];
  priorAttemptsCount?: number;
  errorPatternName?: string;
  /** The baseline currently available to the live pathway is a mastery estimate. */
  baselineType?: 'mastery_estimate' | 'matched_assessment';
}

export class RetestVerificationEngine {
  /**
   * Evaluates a Re-Test submission against single source of truth criteria
   */
  static evaluateRetest(input: RetestEvaluationInput): ReTestResult {
    const total = Math.max(1, input.expectedAnswers.length);
    const hasCompleteAnswers =
      input.expectedAnswers.length > 0 &&
      input.answers.length === input.expectedAnswers.length &&
      input.answers.every((answer) => answer !== undefined && answer !== null);
    let correctCount = 0;

    for (let i = 0; i < total; i++) {
      if (input.answers[i] !== undefined && input.answers[i] === input.expectedAnswers[i]) {
        correctCount++;
      }
    }

    const scoreAfter = hasCompleteAnswers
      ? Math.round((correctCount / total) * 100)
      : 0;
    const delta = scoreAfter - input.scoreBefore;
    const baselineType = input.baselineType || 'mastery_estimate';
    const verificationEligible =
      (baselineType === 'matched_assessment' && total >= 5) ||
      (baselineType === 'mastery_estimate' &&
        total === 2 &&
        hasCompleteAnswers &&
        scoreAfter === 100 &&
        delta >= 20);
    const subskillInfo = SUBSKILLS_DICTIONARY[input.subskill];
    const subskillName = subskillInfo?.name || input.subskill;
    const weaknessName = input.errorPatternName || subskillInfo?.targetWeakness || 'Điểm nghẽn học thuật';

    let status: 'verified_progress' | 'partial_progress' | 'needs_practice' = 'needs_practice';
    let evidenceSummary = '';
    let whatHappened = '';
    let whatChanged = '';

    if (
      verificationEligible &&
      (scoreAfter >= 75 || (delta >= 20 && scoreAfter >= 60))
    ) {
      status = 'verified_progress';
      evidenceSummary = `Đã kiểm chứng tiến bộ thành công! Độ chuẩn xác ${subskillName} tăng từ ${input.scoreBefore}% lên ${scoreAfter}% (+${Math.max(0, delta)}%). Dấu hiệu sai lầm trước đây đã được triệt tiêu qua bài kiểm tra đối chứng.`;
      whatHappened = `Độ chuẩn xác ${subskillName} của bạn đã tăng từ ${input.scoreBefore}% lên ${scoreAfter}% (+${Math.max(0, delta)}%).`;
      whatChanged = `Can thiệp đã triệt tiêu thành công điểm nghẽn "${weaknessName}". Dữ liệu đối chứng Re-test xác nhận phản xạ học thuật đã được hình thành.`;
    } else if (hasCompleteAnswers && scoreAfter >= 50) {
      status = 'partial_progress';
      evidenceSummary = `Tiến bộ bước đầu: Điểm đạt ${scoreAfter}% (tăng +${Math.max(0, delta)}% so với trước can thiệp). Cần thêm 1 chu kỳ củng cố ngắn để chuyển hóa hoàn toàn thành kỹ năng bền vững.`;
      whatHappened = `Điểm Re-test đạt ${scoreAfter}%, ghi nhận mức tăng +${Math.max(0, delta)}% so với trước can thiệp (${input.scoreBefore}%).`;
      whatChanged = `Bạn đã nắm được phương pháp nhận diện cốt lõi nhưng tốc độ xử lý hoặc độ bao quát các trường hợp ngoại lệ vẫn cần thêm bài tập củng cố.`;
    } else {
      status = 'needs_practice';
      evidenceSummary = hasCompleteAnswers
        ? `Điểm Re-test đạt ${scoreAfter}%. Chưa đạt ngưỡng triệt tiêu điểm nghẽn. Hệ thống sẽ tiếp tục ưu tiên bài tập bổ trợ cho kỹ năng này trong lộ trình tiếp theo.`
        : 'Bài Re-test chưa đầy đủ nên chưa thể xác nhận tiến bộ. Hệ thống sẽ giữ nguyên điểm nghẽn và ưu tiên luyện tập bổ trợ.';
      whatHappened = hasCompleteAnswers
        ? `Điểm Re-test đạt ${scoreAfter}%, chưa ghi nhận sự tăng trưởng rõ rệt so với mức trước can thiệp (${input.scoreBefore}%).`
        : 'Bài Re-test chưa được hoàn thành đầy đủ nên chưa thể đánh giá tiến bộ.';
      whatChanged = `Điểm nghẽn "${weaknessName}" vẫn còn tồn tại trong bài làm mới. Bạn cần xem lại nguyên tắc chuyển giao và thử nghiệm với bài tập mẫu có mức độ phân hóa khác.`;
    }

    const priorAttempts = input.priorAttemptsCount || 3;

    return {
      id: `retest_${Date.now()}`,
      pathwayId: input.pathwayId,
      subskill: input.subskill,
      errorPatternName: input.errorPatternName,
      timestamp: new Date().toLocaleDateString('vi-VN'),
      scoreBefore: input.scoreBefore,
      scoreAfter,
      errorsDetectedBefore: [weaknessName],
      errorsDetectedAfter: status === 'verified_progress' ? [] : [`Cần củng cố thêm ${weaknessName}`],
      status,
      evidenceSummary,
      improvementDelta: Math.max(0, delta),
      evidenceCount: {
        priorAttempts,
        interventions: 1,
        retests: 1
      },
      whatHappened,
      whatChanged
    };
  }

  /**
   * Applies verified retest results to learner profile
   */
  static applyVerificationToProfile(
    profile: LearnerProfile,
    retestResult: ReTestResult
  ): LearnerProfile {
    // 1. Update Subskill Mastery
    const updatedSubskillMastery = { ...profile.subskillMastery };
    const currentScore = updatedSubskillMastery[retestResult.subskill] || 50;
    
    // Bayesian-weighted update
    let newScore = currentScore;
    if (retestResult.status === 'verified_progress') {
      newScore = Math.max(currentScore, Math.round(currentScore * 0.35 + retestResult.scoreAfter * 0.65));
    } else if (retestResult.status === 'partial_progress') {
      newScore = Math.round(currentScore * 0.65 + retestResult.scoreAfter * 0.35);
    } else {
      newScore = Math.round(currentScore * 0.85 + retestResult.scoreAfter * 0.15);
    }

    updatedSubskillMastery[retestResult.subskill] = Math.min(100, Math.max(0, newScore));
const subskillName = 
SUBSKILLS_DICTIONARY[retestResult.subskill]?.name ||
 retestResult.subskill;
    // 2. Update Active Errors
let updatedActiveErrors = [...profile.activeErrors];

if (retestResult.status === 'verified_progress') {
  updatedActiveErrors = ErrorRepository.resolveSubskill(
    updatedActiveErrors,
    retestResult.subskill
  );
} else if (retestResult.status === 'partial_progress') {
  updatedActiveErrors = ErrorRepository.reduceSubskillOccurrences(
    updatedActiveErrors,
    retestResult.subskill,
    1,
    `Đã kiểm chứng Re-test: ${subskillName}`
  );
}


    // 3. Update Error Memory if patterns exist
    let updatedErrorPatterns = profile.errorPatterns ? [...profile.errorPatterns] : [];
    if (retestResult.status === 'verified_progress') {
      updatedErrorPatterns = ErrorMemory.markAsResolved(
  updatedErrorPatterns,
  retestResult.subskill,
  retestResult.errorPatternName
);
    } else if (retestResult.status === 'partial_progress') {
      updatedErrorPatterns = updatedErrorPatterns.map((p) => {
        if (p.subskill === retestResult.subskill) {
          return {
            ...p,
            trend: 'improving' as const,
            interventionCount: p.interventionCount + 1
          };
        }
        return p;
      });
    }

    // 4. Update Re-Test History
    const updatedReTestHistory = [retestResult, ...profile.reTestHistory];

    // 5. Add to Recent Activity
    const updatedActivity = [
      {
        id: `act_${Date.now()}`,
        type: 'retest',
        title: `Đã kiểm chứng Re-test: ${subskillName}`,
        timestamp: 'Vừa xong',
        scoreChange: `${retestResult.status === 'verified_progress' ? '✅' : '⚡'} ${retestResult.scoreAfter}% (${retestResult.improvementDelta >= 0 ? '+' : ''}${retestResult.improvementDelta}%)`
      },
      ...profile.recentActivity
    ];

    // 6. Recalculate estimated band
    const estimatedBand = MasteryModel.computeEstimatedBand(updatedSubskillMastery);

    return {
      ...profile,
      subskillMastery: updatedSubskillMastery,
      currentEstimatedBand: estimatedBand,
      activeErrors: updatedActiveErrors,
      errorPatterns: updatedErrorPatterns.length > 0 ? updatedErrorPatterns : profile.errorPatterns,
      reTestHistory: updatedReTestHistory,
      recentActivity: updatedActivity,
    };
  }
}
