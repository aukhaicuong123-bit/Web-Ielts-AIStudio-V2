export type IELTSBand = number; // e.g. 4.5 - 9.0

export type SkillType = 'reading' | 'writing' | 'cross_skill';

export type SubskillId = 
  | 'reading_paraphrase'
  | 'reading_cause_effect'
  | 'reading_detail_inference'
  | 'reading_summary_completion'
  | 'writing_task_response'
  | 'writing_coherence_cohesion'
  | 'writing_lexical_resource'
  | 'writing_complex_grammar'
  | 'cross_paraphrase_transfer'
  | 'cross_argument_logic';

export interface SubskillInfo {
  id: SubskillId;
  name: string;
  skill: SkillType;
  description: string;
  targetWeakness: string;
  weight?: number; // Impact weight on overall performance (1-10)
}

export type ErrorSeverity = 'low' | 'medium' | 'high';
export type ErrorTrend = 'improving' | 'persistent' | 'worsening' | 'new';

export interface ErrorPattern {
  id: string;
  code: string;
  category: 'Task Response' | 'Coherence & Cohesion' | 'Lexical Resource' | 'Grammatical Range & Accuracy' | 'Reading Comprehension';
  name: string;
  subskill: SubskillId;
  severity: ErrorSeverity;
  frequency: number;
  firstDetected: string;
  lastDetected: string;
  trend: ErrorTrend;
  resolved: boolean;
  interventionCount: number;
  lastInterventionId?: string;
  sampleEvidence?: string;
}

// Backward compatibility alias for ErrorTag
export type ErrorTag = {
  id: string;
  code: string;
  category: 'Task Response' | 'Coherence & Cohesion' | 'Lexical Resource' | 'Grammatical Range & Accuracy' | 'Reading Comprehension';
  name: string;
  subskill: SubskillId;
  severity: ErrorSeverity;
  count: number;
  lastEncountered: string;
};

export interface EvidenceFeedbackItem {
  problem: string;
  evidence: string;
  why: string;
  action: string;
  suggestedCorrection?: string;
  errorTagId?: string;
  targetSubskill: SubskillId;
  severity?: ErrorSeverity;
  category?: string;
  transferPrompt?: string;
  verificationNote?: string;
}

export interface RubricScores {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overallBand: number;
}

export interface SubskillMasteryRecord {
  subskillId: SubskillId;
  mastery: number; // 0.0 to 1.0 (or 0 to 100 for display)
  confidence: 'insufficient_data' | 'low' | 'medium' | 'high';
  evidenceCount: number;
  lastUpdated: string;
  baseline: number;
}

export interface ReadingDistractorInfo {
  optionText: string;
  errorTagCode: string;
  errorTagName: string;
  distractorReason: string;
}

export interface ReadingQuestion {
  id: string;
  questionNumber: number;
  type: 'paraphrase_match' | 'cause_effect' | 'tfng' | 'summary_completion' | 'inference';
  subskill: SubskillId;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  evidenceQuote: string;
  distractorDetails?: Record<string, ReadingDistractorInfo>;
}

export interface ReadingPassage {
  id: string;
  title: string;
  topic: 'Technology & AI' | 'Education' | 'Environment' | 'Work & Society';
  level: 'Band 5.0-6.0' | 'Band 6.0-7.0' | 'Band 7.0+';
  content: string;
  targetWeakness: string;
  questions: ReadingQuestion[];
}

export interface WritingPrompt {
  id: string;
  taskType: 'Task 1' | 'Task 2';
  topic: 'Technology & AI' | 'Education' | 'Environment' | 'Work & Society';
  prompt: string;
  chartDescription?: string;
  minWords: number;
  suggestedDurationMinutes: number;
  keySubskills: SubskillId[];
  targetLevel?: string;
  difficulty?: 'Standard' | 'Challenging' | 'Advanced';
}

export type PathwayStepType = 
  | 'recognition' 
  | 'transformation' 
  | 'transfer' 
  | 'retest'
  | 'reading_drill'
  | 'vocab_transform'
  | 'writing_application';

export interface TransferFeedback {
  whatYouDidWell: string;
  whatNeedsCorrection: string;
  evidence: string;
  betterVersion: string;
  principle: string;
  scorePercent: number;
  isCorrectOrHighQuality: boolean;
  feedback?: string;
}

export interface PathwayStep {
  stepNumber: number;
  title: string;
  type: PathwayStepType;
  objective?: string;
  instruction: string;
  targetWeaknessFocus?: string;
  content: any;
  successCriteria?: string;
  transferRequirement?: string;
  retestDefinition?: any;
}

export interface MicroPathway {
  id: string;
  title: string;
  targetWeakness?: string;
  objective?: string;
  triggerCondition: string;
  triggerSubskill: SubskillId;
  targetSubskill?: SubskillId;
  thresholdScore: number;
  description: string;
  durationMinutes: number;
  estimatedMinutes?: number;
  currentEvidenceContext?: string;
  steps: PathwayStep[];
}

export interface ReTestResult {
  id: string;
  pathwayId: string;
  subskill: SubskillId;
  errorPatternName?: string;
  timestamp: string;
  scoreBefore: number;
  scoreAfter: number;
  errorsDetectedBefore: string[];
  errorsDetectedAfter: string[];
  status: 'verified_progress' | 'partial_progress' | 'needs_practice';
  evidenceSummary: string;
  improvementDelta: number;
  evidenceCount?: {
    priorAttempts: number;
    interventions: number;
    retests: number;
  };
  whatHappened?: string;
  whatChanged?: string;
  whatNextActionId?: string;
}

export interface RecommendationFactor {
  factor: string;
  detail: string;
  weight: number;
}

export interface NextBestAction {
  id: string;
  type: 'intervention' | 'diagnostic' | 'practice_reading' | 'practice_writing' | 'retest';
  title: string;
  targetSubskill: SubskillId;
  targetSubskillName: string;
  targetPathwayId?: string;
  estimatedMinutes: number;
  priorityScore: number; // 0 to 100
  urgency: 'high' | 'medium' | 'standard';
  reasons: string[]; // Explicit explanation points
  evidenceContext?: string;
  expectedOutcome: string;
}

export type AssessmentStatus = 'not_assessed' | 'diagnostic_completed' | 'ongoing_evidence';
export type CurrentLevelType = 'official_score' | 'estimated_score' | 'not_assessed';

export interface LearnerProfile {
  id: string;
  name: string;
  targetBand: number; // 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0
  currentLevelType: CurrentLevelType;
  previousOfficialScore?: number; // Score supplied by the learner (optional)
  aiEvidenceEstimate?: number; // System-generated estimate based on observed evidence
  assessmentStatus: AssessmentStatus;
  examDate?: string; // e.g. "2026-11-20" or undefined
  hasBookedExam: boolean;
  dailyAvailableMinutes: number; // 15 | 20 | 30 | 45 | 60
  preferredSessionMinutes: number; // 15 | 20 | 30
  onboardingCompleted: boolean;
  isDemoProfile?: boolean;

  // Evidence & Learning Progress
  currentEstimatedBand: number; // Compatibility field (synced with aiEvidenceEstimate || previousOfficialScore || 5.5)
  hasCompletedDiagnostic: boolean;
  dailyGoalMinutes: number; // Synced with dailyAvailableMinutes
  minutesStudiedToday: number;
  streakDays: number;
  subskillMastery: Record<SubskillId, number>; // 0 to 100 representation
  baselineMastery: Record<SubskillId, number>;
  masteryRecords?: Record<SubskillId, SubskillMasteryRecord>;
  activeErrors: ErrorTag[];
  errorPatterns?: ErrorPattern[];
  reTestHistory: ReTestResult[];
  completedSessions: number;
  recentActivity: {
    id: string;
    type: string;
    title: string;
    timestamp: string;
    scoreChange?: string;
  }[];
  zeroClimber?: ZeroClimberProgress;
}

export type ZeroClimberStartingLevel =
  | 'zero_foundation'     // Band < 4.0 (Máº¥t gá»‘c / ChÆ°a cÃ³ ná»n táº£ng)
  | 'elementary_3_4'      // Band 4.0 - 4.5 (Ná»n táº£ng sÆ¡ cáº¥p)
  | 'intermediate_5_6'    // Band 5.0 - 6.0 (Trung cáº¥p)
  | 'advanced_6_5_plus';  // Band 6.5+ (NÃ¢ng cao)

export type ZeroClimberTargetBand = 5.0 | 5.5 | 6.0 | 6.5 | 7.0 | 7.5 | 8.0 | 8.5 | 9.0;

export type ZeroClimberDailyMinutes = 10 | 15 | 20 | 30 | 45 | 60;

export type ZeroClimberCampId = 
  | 'camp_base'    // Basecamp: Ná»n táº£ng cá»‘t lÃµi
  | 'camp_1'       // Camp 1: Äá»‹nh vá»‹ & Paraphrase
  | 'camp_2'       // Camp 2: Máº¡ch láº¡c & NhÃ¢n quáº£
  | 'camp_3'       // Camp 3: Ngá»¯ phÃ¡p phá»©c há»£p & Ranh giá»›i cÃ¢u
  | 'summit';      // Summit: Kiá»ƒm chá»©ng pháº£n xáº¡ phÃ²ng thi

export interface ZeroClimberLesson {
  id: string;
  campId: ZeroClimberCampId | string;
  lessonNumber: number;
  title: string;
  focusSubskill: SubskillId;
  targetWeakness: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
  pathwayId?: string;
}

export interface ZeroClimberCamp {
  id: ZeroClimberCampId | string;
  name: string;
  order: number;
  targetBandRange: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  lessons?: ZeroClimberLesson[];
}

export interface DailyClimbRecord {
  id: string;
  date: string; // YYYY-MM-DD
  minutesCompleted: number;
  lessonId?: string;
  pathwayId?: string;
  isClimbGoalMet: boolean;
  timestamp: string;
  subskillPracticed?: SubskillId;
}

export interface ZeroClimberProgress {
  startingLevel: ZeroClimberStartingLevel;
  targetBand: number;
  dailyMinutes: ZeroClimberDailyMinutes;
  currentCampId: ZeroClimberCampId | string;
  currentLessonId?: string;
  currentLessonIndex: number;
  totalClimbsCompleted: number;
  dailyClimbs: DailyClimbRecord[];
  isDailyClimbCompletedToday: boolean;
  lastClimbDate?: string;
  unlockedCampIds: string[];
  completedLessonIds: string[];
  climbStreakDays: number;
}




