CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  auth_provider TEXT,
  auth_provider_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS learner_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,

  target_band NUMERIC(3,1) NOT NULL,
  current_level_type TEXT NOT NULL,

  previous_official_score NUMERIC(3,1),

  exam_date DATE,
  has_booked_exam BOOLEAN NOT NULL DEFAULT FALSE,

  daily_available_minutes INTEGER NOT NULL,
  preferred_session_minutes INTEGER NOT NULL,

  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learner_profiles_user_id
  ON learner_profiles(user_id);