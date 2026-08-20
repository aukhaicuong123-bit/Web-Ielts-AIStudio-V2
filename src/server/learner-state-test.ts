import { randomUUID } from 'node:crypto';
import { pool } from './db';
import { initializeLearnerMastery } from './learnerState';

async function main() {
  const userId = randomUUID();
  const learnerId = randomUUID();

  try {
    await pool.query('BEGIN');

    await pool.query(
      `
      INSERT INTO users (id, email, status)
      VALUES ($1, $2, 'active')
      `,
      [userId, `mastery-test-${userId}@example.local`]
    );

    await pool.query(
      `
      INSERT INTO learner_profiles (
        id,
        user_id,
        name,
        target_band,
        current_level_type,
        has_booked_exam,
        daily_available_minutes,
        preferred_session_minutes,
        onboarding_completed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        learnerId,
        userId,
        'Mastery Test Learner',
        6.5,
        'not_assessed',
        false,
        20,
        20,
        false
      ]
    );

    await initializeLearnerMastery(learnerId);

    const result = await pool.query(
      `
      SELECT
        ss.code AS subskill,
        ms.mastery,
        ms.confidence,
        ms.evidence_count,
        ms.baseline,
        ms.trend
      FROM mastery_states ms
      JOIN subskills ss
        ON ss.id = ms.subskill_id
      WHERE ms.learner_id = $1
      ORDER BY ss.code
      `,
      [learnerId]
    );

    console.log('[LEARNER STATE TEST] Mastery initialization succeeded');
    console.log(`Rows: ${result.rows.length}`);
    console.table(result.rows);

    await pool.query('ROLLBACK');
    console.log('[LEARNER STATE TEST] Transaction rolled back; no test data persisted');
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => undefined);
    console.error('[LEARNER STATE TEST] Failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();