import { RubricScores, ErrorTag, EvidenceFeedbackItem, ReTestResult, SubskillId } from '../../types';

export interface WritingAnalysisResponse {
  overallBand: number;
  rubricScores: RubricScores;
  bandSummary: string;
  errorTags: ErrorTag[];
  evidenceFeedback: EvidenceFeedbackItem[];
  recommendedMicroPathwayId: string;
  recommendedInterventionReason: string;
}

export interface ImageAnalysisResponse extends WritingAnalysisResponse {
  transcribedText: string;
  wordCount: number;
}

export interface StepEvaluationResponse {
  isCorrectOrHighQuality: boolean;
  scorePercent: number;
  feedback: string;
  strengths?: string;
  weaknessOrFix?: string;
  whatYouDidWell?: string;
  whatNeedsCorrection?: string;
  evidence?: string;
  betterVersion?: string;
  principle?: string;
  band8ModelVersion: string;
}

export interface ReTestVerificationResponse {
  status: 'verified_progress' | 'needs_practice';
  scoreBefore: number;
  scoreAfter: number;
  isVerified: boolean;
  summary: string;
  timestamp: string;
}

export class AIService {
  static async analyzeWriting(data: { 
    essayText: string; 
    prompt: string; 
    taskType: string; 
    topic: string 
  }): Promise<WritingAnalysisResponse> {
    const res = await fetch('/api/analyze-writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Lỗi khi chấm bài viết');
    }

    const json = await res.json();
    // Validate shape
    if (!json || typeof json.overallBand !== 'number') {
      throw new Error('Định dạng phản hồi chấm bài không hợp lệ');
    }
    return json;
  }

  static async analyzeImageEssay(data: { 
    imageBase64: string; 
    mimeType: string; 
    prompt: string; 
    taskType: string 
  }): Promise<ImageAnalysisResponse> {
    const res = await fetch('/api/analyze-image-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Lỗi khi nhận diện và phân tích ảnh bài viết');
    }

    const json = await res.json();
    if (!json || typeof json.overallBand !== 'number') {
      throw new Error('Định dạng phản hồi OCR & chấm bài không hợp lệ');
    }
    return json;
  }

  static async evaluateStepSubmission(data: { 
    stepType: string; 
    promptInstruction: string; 
    userSubmission: string; 
    originalSentence?: string 
  }): Promise<StepEvaluationResponse> {
    const res = await fetch('/api/evaluate-step-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Lỗi khi chấm bài tập can thiệp');
    }

    const json = await res.json();
    return json;
  }

  static async verifyReTest(data: { 
    pathwayId: string; 
    subskill: string; 
    scoreBefore: number; 
    answers: any[]; 
    expectedAnswers: any[] 
  }): Promise<ReTestVerificationResponse> {
    const res = await fetch('/api/verify-retest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Lỗi khi kiểm chứng re-test');
    }

    const json = await res.json();
    return json;
  }
}
