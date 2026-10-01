-- Create error_logs table for error tracking
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_id TEXT UNIQUE NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_stack TEXT,
  user_id UUID,
  user_email TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  url TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create activity_logs table for user activity tracking
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  resource_name TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create session_logs table to track user sessions
CREATE TABLE IF NOT EXISTS session_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  login_timestamp TIMESTAMP DEFAULT NOW(),
  logout_timestamp TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  session_duration_seconds INT,
  last_activity_timestamp TIMESTAMP,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for error_logs (only admins can view)
CREATE POLICY "Admins can view all errors"
  ON error_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'bahadirefesaricicek11@gmail.com'
    )
  );

CREATE POLICY "Errors are inserted by system"
  ON error_logs FOR INSERT
  WITH CHECK (TRUE);

-- RLS Policies for activity_logs (users can view their own, admins can view all)
CREATE POLICY "Users can view their own activities"
  ON activity_logs FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'bahadirefesaricicek11@gmail.com'
    )
  );

CREATE POLICY "System can insert activities"
  ON activity_logs FOR INSERT
  WITH CHECK (TRUE);

-- RLS Policies for session_logs (users can view their own, admins can view all)
CREATE POLICY "Users can view their own sessions"
  ON session_logs FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'bahadirefesaricicek11@gmail.com'
    )
  );

CREATE POLICY "System can insert sessions"
  ON session_logs FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "System can update sessions"
  ON session_logs FOR UPDATE
  USING (TRUE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS error_logs_timestamp_idx ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS error_logs_user_id_idx ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS error_logs_resolved_idx ON error_logs(resolved, timestamp DESC);

CREATE INDEX IF NOT EXISTS activity_logs_timestamp_idx ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_resource_idx ON activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON activity_logs(action);

CREATE INDEX IF NOT EXISTS session_logs_timestamp_idx ON session_logs(login_timestamp DESC);
CREATE INDEX IF NOT EXISTS session_logs_user_id_idx ON session_logs(user_id);
CREATE INDEX IF NOT EXISTS session_logs_status_idx ON session_logs(status);
