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
  status: 'verified_progress' | 'partial_progress' | 'needs_practice';
  scoreBefore: number;
  scoreAfter: number;
  isVerified: boolean;
  summary: string;
  timestamp: string;
}

export class AIService {
      private static async fetchWithRetry(
    input: RequestInfo | URL,
    init?: RequestInit,
    maxAttempts = 3
  ): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(input, init);

        if (response.ok) {
          return response;
        }

        let errorBody = '';

        try {
          errorBody = await response.clone().text();
        } catch {
          // Ignore body parsing failure.
        }

        const isQuotaExhausted =
          response.status === 429 &&
          /quota exceeded|GenerateRequestsPerDay|free.?tier|RESOURCE_EXHAUSTED/i.test(
            errorBody
          );

        const retryableStatuses = [500, 502, 503, 504];

        const shouldRetry =
          retryableStatuses.includes(response.status) ||
          (response.status === 429 && !isQuotaExhausted);

        if (!shouldRetry || attempt === maxAttempts - 1) {
          return response;
        }

        const delayMs = 600 * Math.pow(2, attempt);

        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts - 1) {
          throw error;
        }

        const delayMs = 600 * Math.pow(2, attempt);

        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('AI request failed after retries');
  }
  static async analyzeWriting(data: { 
    essayText: string; 
    prompt: string; 
    taskType: string; 
    topic: string 
  }): Promise<WritingAnalysisResponse> {
    const res = await this.fetchWithRetry('/api/analyze-writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
  const err = await res.json().catch(() => ({ error: 'Request failed' }));

  const errorMessage =
    typeof err.error === 'string'
      ? err.error
      : err.error?.message || '';

  if (
    res.status === 429 &&
    /quota exceeded|GenerateRequestsPerDay|free.?tier|RESOURCE_EXHAUSTED/i.test(
      errorMessage
    )
  ) {
    throw new Error(
      'AI đang hết hạn mức miễn phí cho mô hình hiện tại. Bài viết của bạn vẫn được lưu; hãy thử lại sau khi hạn mức được cấp lại.'
    );
  }

  if ([502, 503, 504].includes(res.status)) {
    throw new Error(
      'Dịch vụ AI đang quá tải tạm thời. Bài viết của bạn vẫn được lưu; hãy thử phân tích lại sau.'
    );
  }

  throw new Error(
    errorMessage || 'Lỗi khi chấm bài viết'
  );
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
    const res = await this.fetchWithRetry('/api/analyze-image-essay', {
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
    const res = await this.fetchWithRetry('/api/evaluate-step-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));

      const errorMessage =
        typeof err.error === 'string'
          ? err.error
          : err.error?.message || '';

      if ([502, 503, 504].includes(res.status)) {
        throw new Error("Dịch vụ AI đang quá tải tạm thời. Câu trả lời của bạn vẫn được giữ lại; hãy thử thẩm định lại sau.");
      }

      if (
        res.status === 429 &&
        /quota exhausted|quota exceeded|GenerateRequestsPerDay|free.?tier|RESOURCE_EXHAUSTED/i.test(
          errorMessage
        )
      ) {
        throw new Error("AI đã hết hạn mức miễn phí cho phiên này. Bài làm của bạn vẫn được giữ lại; hãy thử lại sau khi quota được cấp lại.");
      }

      throw new Error(
        errorMessage || 'AI evaluation failed. Please try again.'
      );
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
    const res = await this.fetchWithRetry('/api/verify-retest', {
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
