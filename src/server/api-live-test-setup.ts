import { randomUUID } from 'node:crypto';
import { pool } from './db';
import { initializeLearnerMastery } from './learnerState';

async function main() {
  const userId = randomUUID();
  const learnerId = randomUUID();

  try {
    await pool.query(
      `
      INSERT INTO users (id, email, status)
      VALUES ($1, $2, 'active')
      `,
      [userId, `api-live-test-${userId}@example.local`]
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
        'API Live Test Learner',
        6.5,
        'not_assessed',
        false,
        30,
        20,
        true
      ]
    );

    await initializeLearnerMastery(learnerId);

    console.log(`TEST_LEARNER_ID=${learnerId}`);
  } catch (error) {
    console.error('[API LIVE TEST SETUP] Failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
