import { randomUUID } from 'node:crypto';
import { pool } from './db';
import { initializeLearnerMastery } from './learnerState';
import { getLearnerState } from './learnerStateService';

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
      [userId, `state-test-${userId}@example.local`]
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
        'State Read Test Learner',
        6.5,
        'not_assessed',
        false,
        20,
        20,
        false
      ]
    );

    await initializeLearnerMastery(learnerId);

    const state = await getLearnerState(learnerId);

    console.log('[LEARNER STATE READ TEST] Success');
    console.log({
      profileFound: Boolean(state?.profile),
      masteryRows: state?.mastery.length ?? 0,
      activeErrors: state?.activeErrors.length ?? 0,
    });

    await pool.query('ROLLBACK');
    console.log('[LEARNER STATE READ TEST] Transaction rolled back; no test data persisted');
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => undefined);
    console.error('[LEARNER STATE READ TEST] Failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();