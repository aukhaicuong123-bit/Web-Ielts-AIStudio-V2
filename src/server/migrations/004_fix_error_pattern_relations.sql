ALTER TABLE error_patterns
  DROP CONSTRAINT IF EXISTS error_patterns_subskill_id_fkey;

ALTER TABLE error_patterns
  DROP COLUMN IF EXISTS subskill_id;

CREATE TABLE IF NOT EXISTS error_pattern_subskills (
  error_pattern_id UUID NOT NULL REFERENCES error_patterns(id) ON DELETE CASCADE,
  subskill_id UUID NOT NULL REFERENCES subskills(id) ON DELETE CASCADE,
  PRIMARY KEY (error_pattern_id, subskill_id)
);

CREATE INDEX IF NOT EXISTS idx_error_pattern_subskills_subskill
  ON error_pattern_subskills(subskill_id);