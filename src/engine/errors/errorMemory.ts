import { ErrorPattern, ErrorSeverity, ErrorTag, SubskillId } from '../../types';

export class ErrorMemory {
  /**
   * Converts legacy ErrorTag array to full ErrorPattern objects
   */
  static normalizeErrorPatterns(
    tags: ErrorTag[] = [],
    existingPatterns: ErrorPattern[] = []
  ): ErrorPattern[] {
    const patternMap = new Map<string, ErrorPattern>();

    existingPatterns.forEach((p) => patternMap.set(p.subskill, p));

    tags.forEach((tag) => {
      const existing = patternMap.get(tag.subskill);
      if (existing) {
        existing.frequency = Math.max(existing.frequency, tag.count);
        existing.lastDetected = tag.lastEncountered;
        existing.severity = tag.severity;
      } else {
        patternMap.set(tag.subskill, {
          id: tag.id || `err_${Date.now()}_${tag.subskill}`,
          code: tag.code || `ERR_${tag.subskill.toUpperCase()}`,
          category: tag.category,
          name: tag.name,
          subskill: tag.subskill,
          severity: tag.severity,
          frequency: tag.count || 1,
          firstDetected: tag.lastEncountered || 'Gần đây',
          lastDetected: tag.lastEncountered || 'Hôm nay',
          trend: 'persistent',
          resolved: false,
          interventionCount: 0
        });
      }
    });

    return Array.from(patternMap.values());
  }

  /**
   * Records an error occurrence and updates trend
   */
  static recordErrorOccurrence(
    patterns: ErrorPattern[],
    subskill: SubskillId,
    errorName: string,
    category: ErrorPattern['category'],
    severity: ErrorSeverity = 'medium',
    evidence?: string
  ): ErrorPattern[] {
    const copy = [...patterns];
    const index = copy.findIndex((p) => p.subskill === subskill && !p.resolved);

    if (index >= 0) {
      const current = copy[index];
      copy[index] = {
        ...current,
        frequency: current.frequency + 1,
        lastDetected: 'Vừa xong',
        trend: current.frequency >= 3 ? 'worsening' : 'persistent',
        sampleEvidence: evidence || current.sampleEvidence
      };
    } else {
      copy.push({
        id: `err_${Date.now()}_${subskill}`,
        code: `ERR_${subskill.toUpperCase()}`,
        category,
        name: errorName,
        subskill,
        severity,
        frequency: 1,
        firstDetected: 'Hôm nay',
        lastDetected: 'Vừa xong',
        trend: 'new',
        resolved: false,
        interventionCount: 0,
        sampleEvidence: evidence
      });
    }

    return copy;
  }

  /**
   * Marks errors related to a subskill as resolved after verified retest
   */
  static markAsResolved(patterns: ErrorPattern[], subskill: SubskillId): ErrorPattern[] {
    return patterns.map((p) => {
      if (p.subskill === subskill) {
        return {
          ...p,
          resolved: true,
          trend: 'improving',
          interventionCount: p.interventionCount + 1
        };
      }
      return p;
    });
  }
}
