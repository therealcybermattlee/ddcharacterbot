-- BigQuery Data Warehouse Setup for D&D Character Manager Analytics
-- This script creates the complete BigQuery schema for advanced analytics,
-- ML models, and data science workflows

-- ========================================
-- 1. CREATE DATASET AND BASE TABLES
-- ========================================

-- Create the main analytics dataset
CREATE SCHEMA IF NOT EXISTS `your-project.dnd_analytics`
OPTIONS(
  description="D&D Character Manager Analytics Data Warehouse - Production",
  location="US",
  labels=[("environment", "production"), ("application", "dnd-character-manager")]
);

-- Characters fact table with all features for ML
CREATE OR REPLACE TABLE `your-project.dnd_analytics.characters` (
  character_id STRING NOT NULL,
  user_id STRING NOT NULL,
  campaign_id STRING,
  character_name STRING NOT NULL,
  race STRING NOT NULL,
  character_class STRING NOT NULL,
  background STRING,
  alignment STRING,
  current_level INT64 NOT NULL,
  experience_points INT64 DEFAULT 0,
  
  -- Raw ability scores
  strength INT64 DEFAULT 10,
  dexterity INT64 DEFAULT 10,
  constitution INT64 DEFAULT 10,
  intelligence INT64 DEFAULT 10,
  wisdom INT64 DEFAULT 10,
  charisma INT64 DEFAULT 10,
  
  -- Combat statistics
  armor_class INT64 DEFAULT 10,
  hit_points_max INT64 DEFAULT 8,
  hit_points_current INT64 DEFAULT 8,
  initiative_modifier INT64 DEFAULT 0,
  proficiency_bonus INT64 DEFAULT 2,
  
  -- Derived features for ML
  ability_total INT64 GENERATED ALWAYS AS (strength + dexterity + constitution + intelligence + wisdom + charisma),
  physical_total INT64 GENERATED ALWAYS AS (strength + dexterity + constitution),
  mental_total INT64 GENERATED ALWAYS AS (intelligence + wisdom + charisma),
  survivability_score FLOAT64 GENERATED ALWAYS AS (armor_class * 0.4 + hit_points_max * 0.3 + constitution * 0.3),
  
  -- Normalized scores for ML (Z-score normalization)
  strength_norm FLOAT64 GENERATED ALWAYS AS ((strength - 13.0) / 3.0),
  dexterity_norm FLOAT64 GENERATED ALWAYS AS ((dexterity - 13.0) / 3.0),
  constitution_norm FLOAT64 GENERATED ALWAYS AS ((constitution - 13.0) / 3.0),
  intelligence_norm FLOAT64 GENERATED ALWAYS AS ((intelligence - 13.0) / 3.0),
  wisdom_norm FLOAT64 GENERATED ALWAYS AS ((wisdom - 13.0) / 3.0),
  charisma_norm FLOAT64 GENERATED ALWAYS AS ((charisma - 13.0) / 3.0),
  
  -- Binary features for ML
  is_high_level BOOL GENERATED ALWAYS AS (current_level >= 10),
  is_optimized_build BOOL GENERATED ALWAYS AS (survivability_score >= 50),
  is_balanced_stats BOOL GENERATED ALWAYS AS (ABS(physical_total - mental_total) <= 6),
  
  -- Temporal features
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  character_age_days FLOAT64 GENERATED ALWAYS AS (TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), created_at, DAY)),
  days_since_update FLOAT64 GENERATED ALWAYS AS (TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), updated_at, DAY)),
  
  -- Data quality
  _synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  _source STRING DEFAULT 'sqlite_sync'
)
PARTITION BY DATE(created_at)
CLUSTER BY character_class, race, current_level
OPTIONS(
  description="Character features optimized for analytics and ML",
  labels=[("table_type", "fact"), ("ml_ready", "true")]
);

-- Campaigns dimension table
CREATE OR REPLACE TABLE `your-project.dnd_analytics.campaigns` (
  campaign_id STRING NOT NULL,
  campaign_name STRING NOT NULL,
  dm_user_id STRING NOT NULL,
  is_public BOOL DEFAULT FALSE,
  max_players INT64,
  status STRING DEFAULT 'active',
  
  -- Derived metrics
  player_count INT64,
  session_count INT64,
  total_hours_played FLOAT64,
  avg_player_level FLOAT64,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  _source STRING DEFAULT 'sqlite_sync'
)
CLUSTER BY dm_user_id, status
OPTIONS(
  description="Campaign dimension table with aggregated metrics"
);

-- Session events for behavioral analysis
CREATE OR REPLACE TABLE `your-project.dnd_analytics.session_events` (
  session_id STRING NOT NULL,
  campaign_id STRING NOT NULL,
  character_id STRING,
  user_id STRING NOT NULL,
  session_number INT64 NOT NULL,
  session_date DATE NOT NULL,
  session_datetime TIMESTAMP NOT NULL,
  duration_minutes INT64,
  experience_awarded INT64 DEFAULT 0,
  
  -- Character progression tracking
  level_before INT64,
  level_after INT64,
  experience_before INT64,
  experience_after INT64,
  hp_before INT64,
  hp_after INT64,
  
  -- Derived metrics
  xp_gained INT64 GENERATED ALWAYS AS (experience_after - experience_before),
  levels_gained INT64 GENERATED ALWAYS AS (level_after - level_before),
  hp_changed INT64 GENERATED ALWAYS AS (hp_after - hp_before),
  
  -- Temporal features for ML
  day_of_week INT64 GENERATED ALWAYS AS (EXTRACT(DAYOFWEEK FROM session_date)),
  hour_of_day INT64 GENERATED ALWAYS AS (EXTRACT(HOUR FROM session_datetime)),
  is_weekend BOOL GENERATED ALWAYS AS (EXTRACT(DAYOFWEEK FROM session_date) IN (1, 7)),
  session_length_category STRING GENERATED ALWAYS AS (
    CASE 
      WHEN duration_minutes < 120 THEN 'short'
      WHEN duration_minutes < 240 THEN 'medium'
      ELSE 'long'
    END
  ),
  
  -- Binary indicators for ML
  is_long_session BOOL GENERATED ALWAYS AS (duration_minutes >= 240),
  is_high_xp_session BOOL GENERATED ALWAYS AS (experience_awarded >= 500),
  is_level_up_session BOOL GENERATED ALWAYS AS (level_after > level_before),
  is_character_death BOOL GENERATED ALWAYS AS (hp_after = 0 AND hp_before > 0),
  
  _synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  _source STRING DEFAULT 'sqlite_sync'
)
PARTITION BY session_date
CLUSTER BY campaign_id, character_id, user_id
OPTIONS(
  description="Session events with behavioral indicators for player analytics"
);

-- User engagement events for behavioral modeling
CREATE OR REPLACE TABLE `your-project.dnd_analytics.user_events` (
  event_id STRING NOT NULL,
  user_id STRING NOT NULL,
  event_type STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  campaign_id STRING,
  character_id STRING,
  session_id STRING,
  
  -- Event metadata (flexible JSON)
  event_data JSON,
  
  -- Derived temporal features
  event_date DATE GENERATED ALWAYS AS (DATE(event_timestamp)),
  event_hour INT64 GENERATED ALWAYS AS (EXTRACT(HOUR FROM event_timestamp)),
  event_day_of_week INT64 GENERATED ALWAYS AS (EXTRACT(DAYOFWEEK FROM event_timestamp)),
  
  _synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  _source STRING DEFAULT 'sqlite_sync'
)
PARTITION BY event_date
CLUSTER BY user_id, event_type
OPTIONS(
  description="User behavior events for engagement and churn analysis"
);

-- Equipment usage tracking
CREATE OR REPLACE TABLE `your-project.dnd_analytics.equipment_usage` (
  usage_id STRING NOT NULL,
  character_id STRING NOT NULL,
  equipment_id STRING NOT NULL,
  equipment_name STRING NOT NULL,
  equipment_type STRING NOT NULL,
  rarity STRING DEFAULT 'common',
  is_equipped BOOL DEFAULT FALSE,
  is_attuned BOOL DEFAULT FALSE,
  quantity INT64 DEFAULT 1,
  
  equipped_at TIMESTAMP,
  unequipped_at TIMESTAMP,
  usage_duration_hours FLOAT64 GENERATED ALWAYS AS (
    CASE 
      WHEN equipped_at IS NOT NULL AND unequipped_at IS NOT NULL 
      THEN TIMESTAMP_DIFF(unequipped_at, equipped_at, HOUR)
      WHEN equipped_at IS NOT NULL AND unequipped_at IS NULL 
      THEN TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), equipped_at, HOUR)
      ELSE NULL
    END
  ),
  
  _synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  _source STRING DEFAULT 'sqlite_sync'
)
CLUSTER BY character_id, equipment_type, rarity
OPTIONS(
  description="Equipment usage patterns for optimization recommendations"
);

-- ========================================
-- 2. ANALYTICS VIEWS AND AGGREGATIONS
-- ========================================

-- Daily active users with engagement metrics
CREATE OR REPLACE VIEW `your-project.dnd_analytics.daily_active_users` AS
SELECT
  event_date,
  COUNT(DISTINCT user_id) as daily_active_users,
  COUNT(*) as total_events,
  COUNT(DISTINCT event_type) as event_types,
  COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN user_id END) as players_in_session,
  COUNT(DISTINCT campaign_id) as active_campaigns,
  
  -- Engagement depth metrics
  AVG(events_per_user) as avg_events_per_user,
  PERCENTILE_CONT(events_per_user, 0.5) OVER() as median_events_per_user,
  
FROM (
  SELECT 
    event_date,
    user_id,
    event_type,
    campaign_id,
    COUNT(*) as events_per_user
  FROM `your-project.dnd_analytics.user_events`
  GROUP BY event_date, user_id, event_type, campaign_id
)
GROUP BY event_date
ORDER BY event_date DESC;

-- Character build effectiveness analysis
CREATE OR REPLACE VIEW `your-project.dnd_analytics.build_effectiveness` AS
WITH build_stats AS (
  SELECT
    race,
    character_class,
    background,
    current_level,
    COUNT(*) as build_count,
    AVG(survivability_score) as avg_survivability,
    AVG(ability_total) as avg_ability_total,
    AVG(character_age_days) as avg_age_days,
    STDDEV(survivability_score) as survivability_std,
    
    -- Performance percentiles
    PERCENTILE_CONT(survivability_score, 0.25) OVER(PARTITION BY current_level) as survivability_p25,
    PERCENTILE_CONT(survivability_score, 0.75) OVER(PARTITION BY current_level) as survivability_p75,
    PERCENTILE_CONT(ability_total, 0.75) OVER(PARTITION BY current_level) as ability_total_p75,
    
  FROM `your-project.dnd_analytics.characters`
  WHERE current_level >= 1
  GROUP BY race, character_class, background, current_level
  HAVING COUNT(*) >= 3
)
SELECT 
  *,
  -- Effectiveness scores
  CASE 
    WHEN avg_survivability >= survivability_p75 THEN 'high'
    WHEN avg_survivability >= survivability_p25 THEN 'medium'
    ELSE 'low'
  END as survivability_tier,
  
  -- Build optimization score (0-100)
  ROUND(
    (avg_survivability / 100.0) * 40 +
    (avg_ability_total / 90.0) * 30 + 
    (build_count / 20.0) * 20 +
    (CASE WHEN avg_age_days <= 30 THEN 10 ELSE 0 END), 1
  ) as optimization_score,
  
  -- Popularity vs Performance
  CASE
    WHEN build_count >= 20 AND avg_survivability >= survivability_p75 THEN 'meta'
    WHEN build_count >= 10 THEN 'popular'
    WHEN avg_survivability >= survivability_p75 THEN 'sleeper'
    ELSE 'niche'
  END as build_archetype

FROM build_stats
ORDER BY optimization_score DESC, build_count DESC;

-- Player behavior segments
CREATE OR REPLACE VIEW `your-project.dnd_analytics.player_segments` AS
WITH player_metrics AS (
  SELECT 
    c.user_id,
    COUNT(DISTINCT c.character_id) as total_characters,
    COUNT(DISTINCT c.campaign_id) as campaigns_joined,
    AVG(c.current_level) as avg_character_level,
    MAX(c.current_level) as max_character_level,
    SUM(c.experience_points) as total_experience,
    
    -- Session activity
    COUNT(DISTINCT se.session_id) as total_sessions,
    SUM(se.duration_minutes) / 60.0 as total_hours_played,
    AVG(se.duration_minutes) as avg_session_duration,
    COUNT(DISTINCT se.session_date) as active_days,
    
    -- Recent activity (30 days)
    COUNT(DISTINCT CASE WHEN se.session_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) 
                        THEN se.session_id END) as sessions_30d,
    COUNT(DISTINCT CASE WHEN se.session_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) 
                        THEN se.session_id END) as sessions_7d,
    
    -- Engagement indicators
    COUNT(DISTINCT CASE WHEN se.is_level_up_session THEN se.session_id END) as level_up_sessions,
    AVG(CASE WHEN se.is_high_xp_session THEN 1 ELSE 0 END) as high_xp_session_rate,
    
    -- Character diversity
    COUNT(DISTINCT c.race) as races_played,
    COUNT(DISTINCT c.character_class) as classes_played,
    
    -- Temporal patterns
    MAX(se.session_date) as last_session_date,
    DATE_DIFF(CURRENT_DATE(), MAX(se.session_date), DAY) as days_since_last_session,
    
  FROM `your-project.dnd_analytics.characters` c
  LEFT JOIN `your-project.dnd_analytics.session_events` se 
    ON c.character_id = se.character_id
  GROUP BY c.user_id
)
SELECT 
  user_id,
  total_characters,
  campaigns_joined,
  avg_character_level,
  max_character_level,
  total_sessions,
  total_hours_played,
  sessions_30d,
  sessions_7d,
  days_since_last_session,
  
  -- Engagement score (0-100)
  ROUND(
    LEAST(100, GREATEST(0,
      -- Recency (30 points)
      CASE 
        WHEN days_since_last_session <= 7 THEN 30
        WHEN days_since_last_session <= 14 THEN 20
        WHEN days_since_last_session <= 30 THEN 10
        ELSE 0 
      END +
      -- Activity level (30 points)
      LEAST(30, sessions_30d * 5) +
      -- Character investment (25 points)
      LEAST(25, avg_character_level * 2.5) +
      -- Diversity bonus (15 points)
      LEAST(15, (races_played + classes_played) * 1.5)
    )), 1
  ) as engagement_score,
  
  -- Player segment classification
  CASE 
    WHEN days_since_last_session > 90 THEN 'churned'
    WHEN days_since_last_session > 30 THEN 'at_risk'
    WHEN sessions_30d = 0 THEN 'inactive'
    WHEN sessions_30d >= 8 AND total_hours_played >= 20 THEN 'super_engaged'
    WHEN sessions_30d >= 4 THEN 'highly_engaged'
    WHEN sessions_30d >= 2 THEN 'moderately_engaged'
    WHEN sessions_30d >= 1 THEN 'lightly_engaged'
    ELSE 'new_user'
  END as player_segment,
  
  -- Churn risk score (0-100)
  ROUND(
    LEAST(100, GREATEST(0,
      (days_since_last_session * 1.5) +
      CASE WHEN sessions_30d = 0 THEN 40 ELSE 0 END +
      CASE WHEN total_characters = 0 THEN 30 ELSE 0 END +
      CASE WHEN campaigns_joined = 0 THEN 20 ELSE 0 END +
      CASE WHEN total_hours_played < 5 THEN 15 ELSE 0 END
    )), 1
  ) as churn_risk_score

FROM player_metrics;

-- ========================================
-- 3. MACHINE LEARNING MODELS
-- ========================================

-- Character build optimization model
CREATE OR REPLACE MODEL `your-project.dnd_analytics.build_optimizer_v1`
OPTIONS(
  model_type='boosted_tree_regressor',
  input_label_cols=['survivability_score'],
  max_iterations=100,
  learn_rate=0.1,
  subsample=0.8
) AS
SELECT
  race,
  character_class,
  background,
  current_level,
  strength_norm,
  dexterity_norm,
  constitution_norm,
  intelligence_norm,
  wisdom_norm,
  charisma_norm,
  survivability_score
FROM `your-project.dnd_analytics.characters`
WHERE 
  current_level >= 3 
  AND survivability_score IS NOT NULL
  AND character_age_days >= 7; -- Ensure characters have been played

-- Player churn prediction model
CREATE OR REPLACE MODEL `your-project.dnd_analytics.churn_predictor_v1`
OPTIONS(
  model_type='logistic_reg',
  input_label_cols=['is_churned'],
  l1_reg=0.01,
  l2_reg=0.01
) AS
SELECT
  total_characters,
  campaigns_joined,
  avg_character_level,
  total_sessions,
  total_hours_played,
  sessions_30d,
  sessions_7d,
  days_since_last_session,
  engagement_score,
  races_played,
  classes_played,
  
  -- Target variable
  CASE WHEN player_segment = 'churned' THEN 1 ELSE 0 END as is_churned
  
FROM `your-project.dnd_analytics.player_segments`
WHERE player_segment NOT IN ('new_user'); -- Exclude users without enough history

-- Session success prediction (high XP/level up)
CREATE OR REPLACE MODEL `your-project.dnd_analytics.session_success_predictor`
OPTIONS(
  model_type='logistic_reg',
  input_label_cols=['is_successful_session']
) AS
SELECT
  duration_minutes,
  session_number,
  day_of_week,
  hour_of_day,
  is_weekend,
  level_before,
  
  -- Target: successful session (high XP or level up)
  CASE WHEN is_high_xp_session OR is_level_up_session THEN 1 ELSE 0 END as is_successful_session
  
FROM `your-project.dnd_analytics.session_events`
WHERE 
  duration_minutes IS NOT NULL 
  AND level_before IS NOT NULL;

-- ========================================
-- 4. ADVANCED ANALYTICS FUNCTIONS
-- ========================================

-- Character build recommendation function
CREATE OR REPLACE TABLE FUNCTION `your-project.dnd_analytics.recommend_builds`(
  user_input STRING, -- JSON with user preferences
  top_k INT64 DEFAULT 5
)
AS (
  WITH user_prefs AS (
    SELECT 
      JSON_VALUE(user_input, '$.preferred_role') as preferred_role,
      JSON_VALUE(user_input, '$.experience_level') as experience_level,
      CAST(JSON_VALUE(user_input, '$.target_level') AS INT64) as target_level
  ),
  scored_builds AS (
    SELECT 
      be.*,
      -- Recommendation scoring algorithm
      CASE up.preferred_role
        WHEN 'tank' THEN be.avg_survivability * 0.8 + (be.avg_ability_total / 90.0) * 0.2
        WHEN 'dps' THEN (be.avg_ability_total / 90.0) * 0.7 + be.avg_survivability * 0.3
        WHEN 'support' THEN (be.avg_ability_total / 90.0) * 0.6 + be.avg_survivability * 0.4
        ELSE be.optimization_score
      END as role_score,
      
      -- Popularity modifier
      CASE 
        WHEN be.build_count >= 20 THEN 1.1
        WHEN be.build_count >= 10 THEN 1.05
        ELSE 1.0
      END as popularity_modifier
      
    FROM `your-project.dnd_analytics.build_effectiveness` be
    CROSS JOIN user_prefs up
    WHERE be.current_level = COALESCE(up.target_level, 5)
  )
  SELECT 
    race,
    character_class,
    background,
    current_level,
    optimization_score,
    role_score * popularity_modifier as final_score,
    build_count,
    avg_survivability,
    build_archetype
  FROM scored_builds
  ORDER BY final_score DESC
  LIMIT top_k
);

-- Player retention cohort analysis
CREATE OR REPLACE TABLE FUNCTION `your-project.dnd_analytics.cohort_retention_analysis`(
  cohort_period STRING DEFAULT 'month' -- 'week' or 'month'
)
AS (
  WITH user_cohorts AS (
    SELECT 
      user_id,
      DATE_TRUNC(DATE(MIN(event_timestamp)), 
        CASE cohort_period WHEN 'week' THEN WEEK ELSE MONTH END) as cohort_period_start,
      MIN(event_timestamp) as first_activity
    FROM `your-project.dnd_analytics.user_events`
    GROUP BY user_id
  ),
  cohort_activity AS (
    SELECT 
      uc.cohort_period_start,
      uc.user_id,
      DATE_TRUNC(DATE(ue.event_timestamp), 
        CASE cohort_period WHEN 'week' THEN WEEK ELSE MONTH END) as activity_period,
      CASE cohort_period 
        WHEN 'week' THEN DATE_DIFF(DATE_TRUNC(DATE(ue.event_timestamp), WEEK), uc.cohort_period_start, WEEK)
        ELSE DATE_DIFF(DATE_TRUNC(DATE(ue.event_timestamp), MONTH), uc.cohort_period_start, MONTH)
      END as period_number
    FROM user_cohorts uc
    JOIN `your-project.dnd_analytics.user_events` ue ON uc.user_id = ue.user_id
  )
  SELECT 
    cohort_period_start,
    COUNT(DISTINCT CASE WHEN period_number = 0 THEN user_id END) as cohort_size,
    COUNT(DISTINCT CASE WHEN period_number = 1 THEN user_id END) as period_1,
    COUNT(DISTINCT CASE WHEN period_number = 2 THEN user_id END) as period_2,
    COUNT(DISTINCT CASE WHEN period_number = 3 THEN user_id END) as period_3,
    COUNT(DISTINCT CASE WHEN period_number = 6 THEN user_id END) as period_6,
    COUNT(DISTINCT CASE WHEN period_number = 12 THEN user_id END) as period_12,
    
    -- Retention rates
    SAFE_DIVIDE(
      COUNT(DISTINCT CASE WHEN period_number = 1 THEN user_id END),
      COUNT(DISTINCT CASE WHEN period_number = 0 THEN user_id END)
    ) as retention_period_1,
    
    SAFE_DIVIDE(
      COUNT(DISTINCT CASE WHEN period_number = 3 THEN user_id END),
      COUNT(DISTINCT CASE WHEN period_number = 0 THEN user_id END)
    ) as retention_period_3,
    
    SAFE_DIVIDE(
      COUNT(DISTINCT CASE WHEN period_number = 6 THEN user_id END),
      COUNT(DISTINCT CASE WHEN period_number = 0 THEN user_id END)
    ) as retention_period_6
    
  FROM cohort_activity
  GROUP BY cohort_period_start
  HAVING cohort_size >= 10
  ORDER BY cohort_period_start DESC
);

-- ========================================
-- 5. SCHEDULED DATA PIPELINE QUERIES
-- ========================================

-- Daily aggregations for dashboards (run daily)
CREATE OR REPLACE TABLE `your-project.dnd_analytics.daily_kpis` AS
SELECT 
  CURRENT_DATE() as report_date,
  
  -- User metrics
  (SELECT COUNT(*) FROM `your-project.dnd_analytics.characters`) as total_characters,
  (SELECT COUNT(DISTINCT user_id) FROM `your-project.dnd_analytics.characters`) as total_players,
  (SELECT COUNT(*) FROM `your-project.dnd_analytics.campaigns`) as total_campaigns,
  
  -- Activity metrics (last 24 hours)
  (SELECT COUNT(DISTINCT user_id) 
   FROM `your-project.dnd_analytics.user_events` 
   WHERE event_date = CURRENT_DATE() - 1) as dau_yesterday,
   
  (SELECT COUNT(DISTINCT user_id) 
   FROM `your-project.dnd_analytics.user_events` 
   WHERE event_date >= CURRENT_DATE() - 7) as wau,
   
  (SELECT COUNT(DISTINCT user_id) 
   FROM `your-project.dnd_analytics.user_events` 
   WHERE event_date >= CURRENT_DATE() - 30) as mau,
   
  -- Engagement metrics
  (SELECT AVG(engagement_score) 
   FROM `your-project.dnd_analytics.player_segments`) as avg_engagement_score,
   
  (SELECT COUNT(*) 
   FROM `your-project.dnd_analytics.player_segments` 
   WHERE player_segment = 'at_risk') as at_risk_players,
   
  -- Session metrics
  (SELECT COUNT(*) 
   FROM `your-project.dnd_analytics.session_events` 
   WHERE session_date >= CURRENT_DATE() - 7) as sessions_7d,
   
  (SELECT AVG(duration_minutes) 
   FROM `your-project.dnd_analytics.session_events` 
   WHERE session_date >= CURRENT_DATE() - 7) as avg_session_duration_7d,
   
  -- Character creation trends
  (SELECT COUNT(*) 
   FROM `your-project.dnd_analytics.characters` 
   WHERE DATE(created_at) >= CURRENT_DATE() - 7) as new_characters_7d,
   
  -- Popular builds
  (SELECT ARRAY_AGG(STRUCT(character_class, race, build_count) ORDER BY build_count DESC LIMIT 5)
   FROM `your-project.dnd_analytics.build_effectiveness` 
   WHERE current_level >= 3) as top_builds;

-- Index creation for performance
CREATE INDEX idx_characters_user_level ON `your-project.dnd_analytics.characters`(user_id, current_level);
CREATE INDEX idx_session_events_user_date ON `your-project.dnd_analytics.session_events`(user_id, session_date DESC);
CREATE INDEX idx_user_events_user_type_date ON `your-project.dnd_analytics.user_events`(user_id, event_type, event_date DESC);