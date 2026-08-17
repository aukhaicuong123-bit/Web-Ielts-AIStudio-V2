import { SubskillId, SubskillMasteryRecord, LearnerProfile } from '../../types';

export class MasteryModel {
  /**
   * Calculates confidence level based on number of observed data points
   */
  static getConfidenceLevel(evidenceCount: number): 'insufficient_data' | 'low' | 'medium' | 'high' {
    if (evidenceCount <= 0) return 'insufficient_data';
    if (evidenceCount < 3) return 'low';
    if (evidenceCount < 7) return 'medium';
    return 'high';
  }

  /**
   * Formats mastery as an evidence-calibrated percentage (0-100)
   */
  static formatMastery(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Updates a single subskill mastery given an outcome from an exercise or assessment
   */
  static computeUpdatedMastery(
    currentScore: number,
    observedPerformance: number, // 0 to 100
    weight: number = 0.3
  ): number {
    // Exponential moving average update
    const updated = currentScore * (1 - weight) + observedPerformance * weight;
    return this.formatMastery(updated);
  }

  /**
   * Estimates an evidence-calibrated IELTS band from multi-subskill mastery.
   * Note: This is an AI/Evidence estimate, NOT an official test result.
   */
  static computeEstimatedBand(subskillMastery: Record<SubskillId, number>): number {
    const scores = Object.values(subskillMastery) as number[];
    if (scores.length === 0) return 5.0;

    const averageMastery = scores.reduce((sum, val) => sum + val, 0) / scores.length;
    // Calibrate 0-100% mastery to 4.0 - 8.5 range
    const estimated = 4.0 + (averageMastery / 100) * 4.5;
    // Round to nearest 0.5 step
    return Math.round(estimated * 2) / 2;
  }
}
