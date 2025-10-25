-- Transaction Support Tables
-- Migration 015: Add supporting tables for transaction utilities
-- - Idempotency cache for preventing duplicate operations
-- - Distributed locks for concurrency control
-- - Audit log for tracking changes
-- - Version columns for optimistic locking

-- Idempotency Cache
-- Stores operation results to prevent duplicate execution
CREATE TABLE IF NOT EXISTS idempotency_cache (
    key TEXT PRIMARY KEY,
    result TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_idempotency_cache_expires_at
    ON idempotency_cache(expires_at);

-- Distributed Locks
-- Prevents concurrent modifications to critical resources
CREATE TABLE IF NOT EXISTS distributed_locks (
    key TEXT PRIMARY KEY,
    lock_id TEXT NOT NULL,
    acquired_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_distributed_locks_expires_at
    ON distributed_locks(expires_at);

-- Audit Log
-- Tracks all database modifications for compliance and debugging
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'SELECT'
    table_name TEXT NOT NULL,
    record_id TEXT,
    user_id TEXT,
    changes TEXT, -- JSON of what changed
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation_type ON audit_log(operation_type);

-- Add version columns to existing tables for optimistic locking
-- Characters
ALTER TABLE characters ADD COLUMN version INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_characters_version ON characters(version);

-- Users (if not exists - handle gracefully)
-- Note: ALTER TABLE will fail if column exists, migrations should handle this
-- For now, we'll document this as optional enhancement

-- Campaigns (0001 schema)
-- ALTER TABLE campaigns ADD COLUMN version INTEGER DEFAULT 0;
-- CREATE INDEX IF NOT EXISTS idx_campaigns_version ON campaigns(version);

-- Campaign Members
-- ALTER TABLE campaign_members ADD COLUMN version INTEGER DEFAULT 0;

-- Character Equipment
-- ALTER TABLE character_equipment ADD COLUMN version INTEGER DEFAULT 0;

-- Notes:
-- 1. Version columns enable optimistic locking pattern
-- 2. Each UPDATE should increment version and check old version
-- 3. Idempotency cache prevents duplicate API calls
-- 4. Distributed locks prevent race conditions
-- 5. Audit log provides compliance trail

-- Cleanup job for expired records (should be run periodically)
-- DELETE FROM idempotency_cache WHERE expires_at < datetime('now');
-- DELETE FROM distributed_locks WHERE expires_at < datetime('now');
