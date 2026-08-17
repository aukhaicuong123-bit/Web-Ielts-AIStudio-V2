import { SubskillId, ReTestResult, ErrorPattern } from './learning';

export type LearningEventType =
  | 'diagnostic_started'
  | 'diagnostic_completed'
  | 'question_attempted'
  | 'question_answered'
  | 'error_detected'
  | 'lesson_started'
  | 'lesson_completed'
  | 'intervention_started'
  | 'intervention_completed'
  | 'step_evaluated'
  | 'transfer_completed'
  | 'retest_started'
  | 'retest_completed'
  | 'mastery_updated'
  | 'recommendation_generated';

export interface BaseLearningEvent {
  id: string;
  type: LearningEventType;
  timestamp: string;
  learnerId: string;
  payload: Record<string, any>;
}

export interface ErrorDetectedEvent extends BaseLearningEvent {
  type: 'error_detected';
  payload: {
    subskillId: SubskillId;
    errorName: string;
    errorCode: string;
    evidenceQuote?: string;
    sourceType: 'reading' | 'writing' | 'diagnostic' | 'retest';
  };
}

export interface RetestCompletedEvent extends BaseLearningEvent {
  type: 'retest_completed';
  payload: {
    pathwayId: string;
    subskillId: SubskillId;
    result: ReTestResult;
  };
}

export interface MasteryUpdatedEvent extends BaseLearningEvent {
  type: 'mastery_updated';
  payload: {
    subskillId: SubskillId;
    previousScore: number;
    newScore: number;
    delta: number;
    source: string;
  };
}

export type LearningEvent = 
  | BaseLearningEvent 
  | ErrorDetectedEvent 
  | RetestCompletedEvent 
  | MasteryUpdatedEvent;
