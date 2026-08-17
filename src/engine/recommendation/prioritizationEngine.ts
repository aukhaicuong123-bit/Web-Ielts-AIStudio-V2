import { 
  LearnerProfile, 
  NextBestAction, 
  SubskillId, 
  MicroPathway 
} from '../../types';
import { SUBSKILLS_DICTIONARY } from '../../data/mockContent';
import { CROSS_SKILL_PATHWAYS } from '../../data/pathways';

export interface PrioritizationOptions {
  availableMinutes?: number;
  preferredSkill?: 'reading' | 'writing' | 'cross_skill' | 'all';
}

export class PrioritizationEngine {
  /**
   * Deterministic & Explainable Next-Best-Action Decision Heuristic
   */
  static getNextBestAction(
    profile: LearnerProfile,
    options: PrioritizationOptions = {}
  ): NextBestAction {
    const availableMinutes = options.availableMinutes || profile.preferredSessionMinutes || profile.dailyAvailableMinutes || 20;

    // Check if diagnostic has not been completed or assessmentStatus is unassessed
    const isUnassessed = (!profile.hasCompletedDiagnostic && (!profile.recentActivity || profile.recentActivity.length === 0)) || profile.assessmentStatus === 'not_assessed';
    
    if (isUnassessed) {
      return {
        id: 'action_diagnostic',
        type: 'diagnostic',
        title: 'Khảo sát chẩn đoán định vị điểm nghẽn ban đầu',
        targetSubskill: 'reading_paraphrase',
        targetSubskillName: 'Tổng thể Reading & Writing',
        estimatedMinutes: 10,
        priorityScore: 99,
        urgency: 'high',
        reasons: [
          'Chưa có dữ liệu kiểm chứng ban đầu (Baseline Evidence)',
          'Khảo sát 10 phút để định lượng chính xác điểm nghẽn có tỷ lệ mất điểm cao nhất',
          'Tự động xây dựng lộ trình can thiệp cá nhân hóa sau khi hoàn thành'
        ],
        expectedOutcome: 'Khởi tạo hồ sơ năng lực và phát hiện 2 điểm nghẽn cần can thiệp đầu tiên.'
      };
    }

    // Target threshold scales with learner target band (e.g. Band 7.5 -> 75%, Band 6.5 -> 65%)
    const targetMasteryThreshold = Math.min(90, Math.max(50, Math.round((profile.targetBand / 9.0) * 100)));

    // Exam urgency calculation
    let examDaysRemaining: number | null = null;
    let isUrgentExam = false;
    if (profile.hasBookedExam && profile.examDate) {
      try {
        const examTime = new Date(profile.examDate).getTime();
        const nowTime = new Date().getTime();
        const diffDays = Math.ceil((examTime - nowTime) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          examDaysRemaining = diffDays;
          if (diffDays <= 45) {
            isUrgentExam = true;
          }
        }
      } catch (e) {
        console.warn('Invalid exam date parsing', e);
      }
    }

    // 1. Calculate Priority Scores for each subskill
    const subskillCandidates = Object.entries(profile.subskillMastery) as [SubskillId, number][];

    const scoredCandidates = subskillCandidates.map(([subskillId, mastery]) => {
      const info = SUBSKILLS_DICTIONARY[subskillId] || {
        name: subskillId,
        targetWeakness: 'Điểm nghẽn học thuật',
        skill: 'reading' as const
      };

      // Factor 1: Mastery Deficit relative to Target Band (0 to 40 pts)
      const masteryDeficitScore = Math.max(0, (targetMasteryThreshold - mastery) * 0.5);

      // Factor 2: Recurring Error Count (0 to 30 pts)
      const matchedError = profile.activeErrors.find((e) => e.subskill === subskillId);
      const errorCount = matchedError ? matchedError.count : 0;
      const errorSeverity = matchedError?.severity === 'high' ? 1.5 : matchedError?.severity === 'medium' ? 1.2 : 1.0;
      const errorScore = Math.min(30, errorCount * 10 * errorSeverity);

      // Factor 3: Subskill High-Impact Weight (0 to 15 pts)
      const isHighImpact = ['reading_paraphrase', 'writing_coherence_cohesion', 'writing_complex_grammar'].includes(subskillId);
      const impactScore = isHighImpact ? 15 : 8;

      // Factor 4: Unresolved Re-test History (0 to 15 pts)
      const previousRetest = profile.reTestHistory.find((r) => r.subskill === subskillId);
      const needsRetestScore = previousRetest && previousRetest.status === 'needs_practice' ? 15 : 0;

      // Factor 5: Exam Urgency bonus (0 to 10 pts)
      const examBonus = isUrgentExam ? 10 : 0;

      const totalScore = Math.round(masteryDeficitScore + errorScore + impactScore + needsRetestScore + examBonus);

      return {
        subskillId,
        info,
        mastery,
        errorCount,
        matchedError,
        isHighImpact,
        previousRetest,
        totalScore
      };
    });

    // Sort by highest priority score
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);
    const topCandidate = scoredCandidates[0] || {
      subskillId: 'reading_paraphrase' as SubskillId,
      info: SUBSKILLS_DICTIONARY['reading_paraphrase'],
      mastery: 50,
      errorCount: 2,
      matchedError: undefined,
      isHighImpact: true,
      previousRetest: undefined,
      totalScore: 75
    };

    // 2. Match to corresponding Micro-Pathway
    let matchedPathway: MicroPathway = CROSS_SKILL_PATHWAYS[0];
    if (topCandidate.subskillId.includes('cause_effect') || topCandidate.subskillId.includes('coherence') || topCandidate.subskillId.includes('argument')) {
      matchedPathway = CROSS_SKILL_PATHWAYS[1] || CROSS_SKILL_PATHWAYS[0];
    } else if (topCandidate.subskillId.includes('grammar') || topCandidate.subskillId.includes('complex')) {
      matchedPathway = CROSS_SKILL_PATHWAYS[2] || CROSS_SKILL_PATHWAYS[0];
    }

    // 3. Build Explainability Reasoning Bullets
    const reasons: string[] = [];

    if (topCandidate.errorCount > 0) {
      reasons.push(`Phát hiện lặp lại (${topCandidate.errorCount} lần gần đây) trong các bài thực hành`);
    }
    if (topCandidate.isHighImpact) {
      reasons.push('Kỹ năng nền tảng có tác động chéo lớn nhất đến cả Reading và Writing');
    }
    if (topCandidate.mastery < targetMasteryThreshold) {
      reasons.push(`Độ thuần thục hiện tại (${topCandidate.mastery}%) dưới ngưỡng an toàn Band ${profile.targetBand.toFixed(1)} (yêu cầu ${targetMasteryThreshold}%)`);
    }
    reasons.push(`Thời lượng can thiệp (${matchedPathway.durationMinutes} phút) được điều chỉnh theo cài đặt ${availableMinutes} phút của bạn`);

    if (topCandidate.previousRetest && topCandidate.previousRetest.status === 'needs_practice') {
      reasons.push('Biên bản Re-test gần nhất cho thấy cần thêm 1 vòng luyện tập để củng cố phản xạ');
    }
    if (examDaysRemaining !== null && examDaysRemaining <= 45) {
      reasons.push(`Kỳ thi dự kiến trong ${examDaysRemaining} ngày tới — Ưu tiên can thiệp dứt điểm các lỗi mất điểm nghiêm trọng`);
    }

    return {
      id: `action_${matchedPathway.id}`,
      type: 'intervention',
      title: matchedPathway.title,
      targetSubskill: topCandidate.subskillId,
      targetSubskillName: topCandidate.info?.name || topCandidate.subskillId,
      targetPathwayId: matchedPathway.id,
      estimatedMinutes: Math.min(availableMinutes, matchedPathway.durationMinutes),
      priorityScore: Math.min(100, topCandidate.totalScore),
      urgency: topCandidate.totalScore >= 70 || isUrgentExam ? 'high' : 'medium',
      reasons,
      evidenceContext: topCandidate.matchedError?.name || topCandidate.info?.targetWeakness,
      expectedOutcome: `Tăng từ +15% đến +25% độ chính xác cho ${topCandidate.info?.name || 'kỹ năng'} và xác minh ngay qua Re-test đối chứng.`
    };
  }
}
