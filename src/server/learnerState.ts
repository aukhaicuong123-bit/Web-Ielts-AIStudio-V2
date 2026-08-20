import { pool } from './db';

export async function initializeLearnerMastery(
  learnerId: string
): Promise<void> {
  await pool.query(
    `
    INSERT INTO mastery_states (
      id,
      learner_id,
      subskill_id,
      mastery,
      confidence,
      evidence_count,
      baseline,
      trend
    )
    SELECT
      gen_random_uuid(),
      $1,
      ss.id,
      0.50,
      'insufficient_data',
      0,
      0.50,
      'new'
    FROM subskills ss
    ON CONFLICT (learner_id, subskill_id) DO NOTHING
    `,
    [learnerId]
  );
}