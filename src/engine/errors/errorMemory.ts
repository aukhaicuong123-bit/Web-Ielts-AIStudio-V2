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

  const getPatternKey = (
    code: string,
    subskill: SubskillId
  ): string => `${subskill}::${code}`;

  existingPatterns.forEach((pattern) => {
    const key = getPatternKey(pattern.code, pattern.subskill);
    patternMap.set(key, { ...pattern });
  });

  tags.forEach((tag) => {
    const code =
      tag.code || `ERR_${tag.subskill.toUpperCase()}`;

    const key = getPatternKey(code, tag.subskill);
    const occurrenceCount = Math.max(1, tag.count || 1);
    const existing = patternMap.get(key);

    if (existing) {
      patternMap.set(key, {
        ...existing,
        frequency: existing.frequency + occurrenceCount,
        lastDetected:
          tag.lastEncountered || existing.lastDetected,
        severity: tag.severity,
        resolved: false,
        trend: 'persistent'
      });
    } else {
      patternMap.set(key, {
        id:
          tag.id ||
          `err_${Date.now()}_${tag.subskill}_${code}`,
        code,
        category: tag.category,
        name: tag.name,
        subskill: tag.subskill,
        severity: tag.severity || 'medium',
        frequency: occurrenceCount,
        firstDetected:
          tag.lastEncountered || 'Gần đây',
        lastDetected:
          tag.lastEncountered || 'Hôm nay',
        trend: 'new',
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
  evidence?: string,
  errorCode?: string
): ErrorPattern[] {
  const copy = [...patterns];

  const code =
    errorCode || `ERR_${subskill.toUpperCase()}`;

  const index = copy.findIndex(
    (p) =>
      p.subskill === subskill &&
      p.code === code &&
      !p.resolved
  );

  if (index >= 0) {
    const current = copy[index];
    const nextFrequency = current.frequency + 1;

    copy[index] = {
      ...current,
      frequency: nextFrequency,
      lastDetected: 'Vừa xong',
      severity,
      trend:
        nextFrequency >= 3
          ? 'worsening'
          : 'persistent',
      sampleEvidence:
        evidence || current.sampleEvidence
    };
  } else {
    copy.push({
      id: `err_${Date.now()}_${subskill}_${code}`,
      code,
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
  static markAsResolved(
  patterns: ErrorPattern[],
  subskill: SubskillId,
  errorPatternName?: string
): ErrorPattern[] {
  return patterns.map((pattern) => {
    const matchesSubskill = pattern.subskill === subskill;

    if (!matchesSubskill) {
      return pattern;
    }

    const matchesPattern =
      !errorPatternName ||
      pattern.name === errorPatternName ||
      pattern.code === errorPatternName;

    if (!matchesPattern) {
      return pattern;
    }

        return {
      ...pattern,
      resolved: true,
      trend: 'improving',
      interventionCount: pattern.interventionCount + 1
    };
  });
  }
}