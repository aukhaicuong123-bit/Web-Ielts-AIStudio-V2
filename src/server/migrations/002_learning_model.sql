CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subskills (
  id UUID PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subskills_skill_id
  ON subskills(skill_id);

CREATE TABLE IF NOT EXISTS error_patterns (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  subskill_id UUID NOT NULL REFERENCES subskills(id) ON DELETE RESTRICT,
  severity TEXT NOT NULL,
  description TEXT,
  target_weakness TEXT,
  weight NUMERIC(6,3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_patterns_subskill_id
  ON error_patterns(subskill_id);

CREATE TABLE IF NOT EXISTS mastery_states (
  id UUID PRIMARY KEY,
  learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  subskill_id UUID NOT NULL REFERENCES subskills(id) ON DELETE CASCADE,
  mastery NUMERIC(5,4) NOT NULL,
  confidence TEXT NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  baseline NUMERIC(5,4),
  trend TEXT,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_assessed_at TIMESTAMPTZ,
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(learner_id, subskill_id)
);

CREATE INDEX IF NOT EXISTS idx_mastery_states_learner_id
  ON mastery_states(learner_id);

CREATE INDEX IF NOT EXISTS idx_mastery_states_subskill_id
  ON mastery_states(subskill_id);

CREATE TABLE IF NOT EXISTS learner_error_states (
  id UUID PRIMARY KEY,
  learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  error_pattern_id UUID NOT NULL REFERENCES error_patterns(id) ON DELETE CASCADE,
  frequency INTEGER NOT NULL DEFAULT 0,
  first_detected_at TIMESTAMPTZ,
  last_detected_at TIMESTAMPTZ,
  trend TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  intervention_count INTEGER NOT NULL DEFAULT 0,
  last_intervention_id UUID,
  sample_evidence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(learner_id, error_pattern_id)
);

CREATE INDEX IF NOT EXISTS idx_learner_error_states_learner_resolved
  ON learner_error_states(learner_id, resolved);

CREATE INDEX IF NOT EXISTS idx_learner_error_states_learner_trend
  ON learner_error_states(learner_id, trend);