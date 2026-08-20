import { pool } from './db';

async function main() {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, current_user AS user, version() AS version'
    );

    console.log(result.rows[0]);
  } catch (error) {
    console.error('[DB TEST] Connection failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();