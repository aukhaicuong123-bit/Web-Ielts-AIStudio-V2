import { ErrorSeverity, ErrorTag, SubskillId } from '../../types';

export interface IncomingError {
  id?: string;
  code?: string;
  category: ErrorTag['category'];
  name: string;
  subskill: SubskillId;
  severity?: ErrorSeverity;
  count?: number;
  lastEncountered?: string;
}

const SEVERITY_RANK: Record<ErrorSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function mergeSeverity(
  current: ErrorSeverity,
  incoming: ErrorSeverity
): ErrorSeverity {
  return SEVERITY_RANK[incoming] > SEVERITY_RANK[current]
    ? incoming
    : current;
}

function createErrorId(prefix: string, subskill: string): string {
  return `${prefix}_${Date.now()}_${subskill}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export class ErrorRepository {
  /**
   * One canonical matching rule for an error:
   * error code + subskill.
   *
   * This prevents different errors inside the same subskill
   * from being incorrectly merged together.
   */
  static sameError(
    a: Pick<ErrorTag, 'code' | 'subskill'>,
    b: Pick<IncomingError, 'code' | 'subskill'>
  ): boolean {
    return a.code === b.code && a.subskill === b.subskill;
  }

  /**
   * Add one observed occurrence of an error.
   * Keeps the legacy ErrorTag shape so the existing UI remains compatible.
   */
  static recordOccurrence(
    errors: ErrorTag[],
    incoming: IncomingError,
    occurrenceCount = 1,
    sourceLabel = 'Vừa xong'
  ): ErrorTag[] {
    const increment = Math.max(1, Math.round(occurrenceCount));
    const code = incoming.code || `ERR_${incoming.subskill.toUpperCase()}`;
    const severity = incoming.severity || 'medium';
    const lastEncountered =
      incoming.lastEncountered || sourceLabel;

    const next = [...errors];

    const index = next.findIndex((error) =>
      this.sameError(error, {
        code,
        subskill: incoming.subskill,
      })
    );

    if (index >= 0) {
      const existing = next[index];

      next[index] = {
        ...existing,
        name: incoming.name || existing.name,
        category: incoming.category || existing.category,
        severity: mergeSeverity(existing.severity, severity),
        count: existing.count + increment,
        lastEncountered,
      };

      return next;
    }

    next.push({
      id:
        incoming.id ||
        createErrorId('err', incoming.subskill),
      code,
      category: incoming.category,
      name: incoming.name,
      subskill: incoming.subskill,
      severity,
      count: increment,
      lastEncountered,
    });

    return next;
  }

  /**
   * Merge a batch of AI-detected errors.
   *
   * Important:
   * The AI-provided `count` is treated as evidence from the current
   * submission, rather than being discarded and always replaced by +1.
   */
  static mergeDetectedErrors(
    errors: ErrorTag[],
    detectedErrors: IncomingError[],
    sourceLabel = 'Vừa xong'
  ): ErrorTag[] {
    let result = [...errors];

    for (const error of detectedErrors) {
      result = this.recordOccurrence(
        result,
        error,
        error.count || 1,
        error.lastEncountered || sourceLabel
      );
    }

    return result;
  }

  /**
   * Remove a specific error.
   */
  static removeError(
    errors: ErrorTag[],
    code: string,
    subskill: SubskillId
  ): ErrorTag[] {
    return errors.filter(
      (error) =>
        !(error.code === code && error.subskill === subskill)
    );
  }

  /**
   * Resolve every active error for a subskill.
   *
   * Kept for compatibility with the current Retest implementation.
   * Later we will migrate resolution to ErrorPattern.
   */
  static resolveSubskill(
    errors: ErrorTag[],
    subskill: SubskillId
  ): ErrorTag[] {
    return errors.filter((error) => error.subskill !== subskill);
  }

  static getBySubskill(
    errors: ErrorTag[],
    subskill: SubskillId
  ): ErrorTag[] {
    return errors.filter((error) => error.subskill === subskill);
  }

  static getHighestSeverity(
    errors: ErrorTag[],
    subskill: SubskillId
  ): ErrorSeverity | undefined {
    const matching = this.getBySubskill(errors, subskill);

    if (matching.length === 0) {
      return undefined;
    }

    return matching.reduce<ErrorSeverity>(
      (highest, current) =>
        SEVERITY_RANK[current.severity] >
        SEVERITY_RANK[highest]
          ? current.severity
          : highest,
      'low'
    );
  }
}