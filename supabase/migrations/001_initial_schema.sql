-- Parallax Planning Poker - Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Boards (rooms)
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(9) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_by_device VARCHAR(36) NOT NULL,
  facilitator_token_hash VARCHAR(255) NOT NULL,
  deck_type VARCHAR(30) NOT NULL DEFAULT 'fibonacci',
  custom_deck JSONB DEFAULT NULL,
  current_issue_id UUID DEFAULT NULL,
  voting_state VARCHAR(20) NOT NULL DEFAULT 'idle',
  settings JSONB NOT NULL DEFAULT '{
    "timerEnabled": false,
    "timerDuration": 120,
    "allowSpectatorMode": true
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Participants
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  device_id VARCHAR(36) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'voter',
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(board_id, device_id)
);

-- Issues (stories to estimate)
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT DEFAULT NULL,
  jira_key VARCHAR(50) DEFAULT NULL,
  jira_url VARCHAR(500) DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  final_estimate VARCHAR(20) DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  value VARCHAR(20) NOT NULL,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(issue_id, participant_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_boards_code ON boards(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_boards_device ON boards(created_by_device) WHERE deleted_at IS NULL;
CREATE INDEX idx_boards_expires ON boards(expires_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_participants_board ON participants(board_id);
CREATE INDEX idx_participants_device ON participants(device_id);
CREATE INDEX idx_issues_board ON issues(board_id);
CREATE INDEX idx_issues_sort ON issues(board_id, sort_order);
CREATE INDEX idx_votes_issue ON votes(issue_id);
CREATE INDEX idx_votes_board ON votes(board_id);

-- ============================================
-- FOREIGN KEY: boards.current_issue_id -> issues.id
-- ============================================

ALTER TABLE boards ADD CONSTRAINT fk_boards_current_issue
  FOREIGN KEY (current_issue_id) REFERENCES issues(id) ON DELETE SET NULL;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- REPLICA IDENTITY (required for Postgres Changes filters on non-PK columns)
-- ============================================

ALTER TABLE participants REPLICA IDENTITY FULL;
ALTER TABLE issues REPLICA IDENTITY FULL;

-- ============================================
-- REALTIME PUBLICATION (votes excluded to prevent vote value leaks)
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE boards;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE issues;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Anon can read non-deleted boards (needed for Realtime subscriptions)
CREATE POLICY "anon_read_boards" ON boards
  FOR SELECT TO anon
  USING (deleted_at IS NULL);

-- Anon can read all participants
CREATE POLICY "anon_read_participants" ON participants
  FOR SELECT TO anon
  USING (true);

-- Anon can read all issues
CREATE POLICY "anon_read_issues" ON issues
  FOR SELECT TO anon
  USING (true);

-- Vote hiding: anon can only read votes when board voting_state is 'revealed'
CREATE POLICY "anon_read_votes" ON votes
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = votes.board_id
      AND boards.voting_state = 'revealed'
    )
  );

-- No INSERT/UPDATE/DELETE policies for anon
-- All writes go through server API routes using service_role key (bypasses RLS)
