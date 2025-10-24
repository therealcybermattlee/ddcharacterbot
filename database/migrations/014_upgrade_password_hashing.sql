-- Migration: Upgrade password hashing from SHA-256 to scrypt
-- This migration adds a column to track which hashing algorithm was used
-- so we can support both old and new passwords during transition

-- Add algorithm column to track password hash type
ALTER TABLE users ADD COLUMN password_algorithm TEXT NOT NULL DEFAULT 'sha256';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_password_algorithm ON users(password_algorithm);

-- Note: Existing password_hash values will remain SHA-256
-- New registrations and password changes will use scrypt
-- Users will be automatically migrated to scrypt on their next successful login
