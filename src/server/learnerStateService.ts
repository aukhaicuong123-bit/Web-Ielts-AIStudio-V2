import { pool } from './db';

export async function getLearnerState(learnerId: string) {
  const client = await pool.connect();

  try {
    const profileResult = await client.query(
      `
      SELECT
        id,
        user_id,
        name,
        target_band,
        current_level_type,
        previous_official_score,
        exam_date,
        has_booked_exam,
        daily_available_minutes,
        preferred_session_minutes,
        onboarding_completed,
        created_at,
        updated_at
      FROM learner_profiles
      WHERE id = $1
      `,
      [learnerId]
    );

    if (profileResult.rowCount === 0) {
      return null;
    }

    const masteryResult = await client.query(
      `
      SELECT
        ss.code AS subskill,
        ms.mastery,
        ms.confidence,
        ms.evidence_count,
        ms.baseline,
        ms.trend,
        ms.last_updated_at,
        ms.last_assessed_at,
        ms.last_practiced_at
      FROM mastery_states ms
      JOIN subskills ss
        ON ss.id = ms.subskill_id
      WHERE ms.learner_id = $1
      ORDER BY ss.code
      `,
      [learnerId]
    );

    const errorResult = await client.query(
      `
      SELECT
        ep.code AS error_code,
        ep.name AS error_name,
        les.frequency,
        les.trend,
        les.resolved,
        les.intervention_count,
        les.last_detected_at,
        les.sample_evidence
      FROM learner_error_states les
      JOIN error_patterns ep
        ON ep.id = les.error_pattern_id
      WHERE les.learner_id = $1
        AND les.resolved = FALSE
      ORDER BY les.frequency DESC, ep.code
      `,
      [learnerId]
    );

    return {
      profile: profileResult.rows[0],
      mastery: masteryResult.rows,
      activeErrors: errorResult.rows,
    };
  } finally {
    client.release();
  }
}