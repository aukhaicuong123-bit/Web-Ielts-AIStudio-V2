import { randomUUID } from 'node:crypto';
import { pool } from './db';

async function main() {
  const userId = randomUUID();
  const profileId = randomUUID();

  try {
    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO users (
        id,
        email,
        auth_provider,
        status
      )
      VALUES ($1, $2, $3, $4)`,
      [userId, `test-${userId}@example.local`, 'local-test', 'active']
    );

    await pool.query(
      `INSERT INTO learner_profiles (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        profileId,
        userId,
        'Database Test Learner',
        6.5,
        'not_assessed',
        false,
        20,
        20,
        false
      ]
    );

    const result = await pool.query(
      `SELECT
        u.id AS user_id,
        u.email,
        lp.id AS learner_profile_id,
        lp.name,
        lp.target_band,
        lp.preferred_session_minutes
      FROM users u
      JOIN learner_profiles lp
        ON lp.user_id = u.id
      WHERE u.id = $1`,
      [userId]
    );

    console.log('[DB CRUD TEST] Insert + select succeeded');
    console.log(result.rows[0]);

    await pool.query('ROLLBACK');
    console.log('[DB CRUD TEST] Transaction rolled back; no test data persisted');
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => undefined);
    console.error('[DB CRUD TEST] Failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();