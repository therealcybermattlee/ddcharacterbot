-- D&D Character Manager Analytics Models
-- Comprehensive analytics queries for character optimization, campaign insights, 
-- player engagement, and predictive modeling

-- ========================================
-- 1. CHARACTER BUILD ANALYTICS & OPTIMIZATION
-- ========================================

-- Character Build Performance Analysis
CREATE VIEW IF NOT EXISTS v_character_build_analysis AS
SELECT 
    c.race,
    c.character_class,
    c.background,
    c.level,
    c.alignment,
    
    -- Ability Score Analysis
    ROUND(AVG(c.strength), 2) as avg_strength,
    ROUND(AVG(c.dexterity), 2) as avg_dexterity,
    ROUND(AVG(c.constitution), 2) as avg_constitution,
    ROUND(AVG(c.intelligence), 2) as avg_intelligence,
    ROUND(AVG(c.wisdom), 2) as avg_wisdom,
    ROUND(AVG(c.charisma), 2) as avg_charisma,
    
    -- Combat Effectiveness Metrics
    ROUND(AVG(c.armor_class), 2) as avg_ac,
    ROUND(AVG(c.hit_points_max), 2) as avg_hp,
    ROUND(AVG(c.initiative_modifier), 2) as avg_initiative,
    
    -- Build Popularity & Success Metrics
    COUNT(*) as build_count,
    COUNT(DISTINCT c.user_id) as unique_players,
    ROUND(AVG(c.experience_points), 2) as avg_experience,
    
    -- Survivability Score (composite metric)
    ROUND(AVG(c.armor_class * 0.4 + c.hit_points_max * 0.3 + c.constitution * 0.3), 2) as survivability_score,
    
    -- Versatility Score (based on ability spread)
    ROUND(AVG(
        ABS(c.strength - 13) + 
        ABS(c.dexterity - 13) + 
        ABS(c.constitution - 13) + 
        ABS(c.intelligence - 13) + 
        ABS(c.wisdom - 13) + 
        ABS(c.charisma - 13)
    ) * -1 + 100, 2) as versatility_score
    
FROM characters c
WHERE c.level > 0
GROUP BY c.race, c.character_class, c.background, c.level, c.alignment
HAVING COUNT(*) >= 3; -- Only include builds with sufficient sample size

-- Optimal Ability Score Distribution by Class
CREATE VIEW IF NOT EXISTS v_optimal_ability_scores AS
WITH class_stats AS (
    SELECT 
        character_class,
        level,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY strength) as top_25_strength,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dexterity) as top_25_dexterity,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY constitution) as top_25_constitution,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY intelligence) as top_25_intelligence,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY wisdom) as top_25_wisdom,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY charisma) as top_25_charisma,
        COUNT(*) as sample_size
    FROM characters
    WHERE level > 0
    GROUP BY character_class, level
)
SELECT 
    character_class,
    level,
    ROUND(top_25_strength, 0) as recommended_strength,
    ROUND(top_25_dexterity, 0) as recommended_dexterity,
    ROUND(top_25_constitution, 0) as recommended_constitution,
    ROUND(top_25_intelligence, 0) as recommended_intelligence,
    ROUND(top_25_wisdom, 0) as recommended_wisdom,
    ROUND(top_25_charisma, 0) as recommended_charisma,
    sample_size
FROM class_stats
WHERE sample_size >= 10;

-- Equipment Optimization by Character Build
CREATE VIEW IF NOT EXISTS v_equipment_optimization AS
WITH equipped_items AS (
    SELECT 
        c.race,
        c.character_class,
        c.level,
        e.name as equipment_name,
        e.type as equipment_type,
        e.rarity,
        COUNT(*) as usage_count,
        COUNT(DISTINCT c.id) as unique_characters,
        ROUND(AVG(c.armor_class), 2) as avg_ac_with_item,
        ROUND(AVG(c.hit_points_max), 2) as avg_hp_with_item
    FROM characters c
    JOIN character_equipment ce ON c.id = ce.character_id
    JOIN equipment e ON ce.equipment_id = e.id
    WHERE ce.is_equipped = TRUE
    GROUP BY c.race, c.character_class, c.level, e.name, e.type, e.rarity
),
class_baselines AS (
    SELECT 
        race,
        character_class,
        level,
        ROUND(AVG(armor_class), 2) as baseline_ac,
        ROUND(AVG(hit_points_max), 2) as baseline_hp,
        COUNT(*) as total_characters
    FROM characters
    GROUP BY race, character_class, level
)
SELECT 
    ei.race,
    ei.character_class,
    ei.level,
    ei.equipment_name,
    ei.equipment_type,
    ei.rarity,
    ei.usage_count,
    ei.unique_characters,
    ROUND((ei.unique_characters * 100.0 / cb.total_characters), 2) as adoption_rate_percent,
    ei.avg_ac_with_item,
    ei.avg_hp_with_item,
    ROUND((ei.avg_ac_with_item - cb.baseline_ac), 2) as ac_improvement,
    ROUND((ei.avg_hp_with_item - cb.baseline_hp), 2) as hp_improvement,
    -- Equipment Effectiveness Score
    ROUND(
        (ei.avg_ac_with_item - cb.baseline_ac) * 0.6 + 
        (ei.avg_hp_with_item - cb.baseline_hp) * 0.4, 2
    ) as effectiveness_score
FROM equipped_items ei
JOIN class_baselines cb ON ei.race = cb.race 
    AND ei.character_class = cb.character_class 
    AND ei.level = cb.level
WHERE ei.usage_count >= 3
ORDER BY ei.character_class, ei.level, effectiveness_score DESC;

-- ========================================
-- 2. CAMPAIGN HEALTH METRICS & DM INSIGHTS
-- ========================================

-- Campaign Health Dashboard
CREATE VIEW IF NOT EXISTS v_campaign_health_metrics AS
WITH campaign_stats AS (
    SELECT 
        c.id as campaign_id,
        c.name as campaign_name,
        c.dm_user_id,
        u.username as dm_name,
        
        -- Basic Campaign Info
        DATE(c.created_at) as campaign_start_date,
        julianday('now') - julianday(c.created_at) as campaign_age_days,
        
        -- Player & Character Metrics
        COUNT(DISTINCT cm.user_id) as active_players,
        COUNT(DISTINCT ch.id) as total_characters,
        ROUND(AVG(ch.level), 2) as avg_character_level,
        MAX(ch.level) as max_character_level,
        MIN(ch.level) as min_character_level,
        
        -- Session Metrics
        COUNT(DISTINCT cs.id) as total_sessions,
        ROUND(AVG(cs.duration_minutes), 0) as avg_session_duration,
        ROUND(SUM(cs.duration_minutes) / 60.0, 1) as total_campaign_hours,
        ROUND(AVG(cs.experience_awarded), 0) as avg_xp_per_session,
        
        -- Engagement Metrics
        MAX(DATE(cs.date)) as last_session_date,
        julianday('now') - julianday(MAX(cs.date)) as days_since_last_session,
        
        -- Character Diversity
        COUNT(DISTINCT ch.race) as race_diversity,
        COUNT(DISTINCT ch.character_class) as class_diversity,
        COUNT(DISTINCT ch.background) as background_diversity
        
    FROM campaigns c
    LEFT JOIN users u ON c.dm_user_id = u.id
    LEFT JOIN campaign_members cm ON c.id = cm.campaign_id
    LEFT JOIN characters ch ON c.id = ch.campaign_id
    LEFT JOIN campaign_sessions cs ON c.id = cs.campaign_id
    GROUP BY c.id, c.name, c.dm_user_id, u.username, c.created_at
),
session_frequency AS (
    SELECT 
        campaign_id,
        COUNT(*) as session_count,
        ROUND(
            COUNT(*) * 7.0 / NULLIF(julianday(MAX(date)) - julianday(MIN(date)), 0), 
            2
        ) as sessions_per_week
    FROM campaign_sessions
    GROUP BY campaign_id
    HAVING COUNT(*) > 1
)
SELECT 
    cs.*,
    COALESCE(sf.sessions_per_week, 0) as sessions_per_week,
    
    -- Health Score Calculation (0-100)
    ROUND(
        LEAST(100, GREATEST(0,
            (CASE WHEN cs.days_since_last_session <= 14 THEN 25 ELSE GREATEST(0, 25 - cs.days_since_last_session) END) + -- Recency (25 points)
            (LEAST(25, cs.active_players * 6.25)) + -- Player count (25 points, max at 4 players)
            (LEAST(25, COALESCE(sf.sessions_per_week, 0) * 12.5)) + -- Session frequency (25 points, max at 2/week)
            (LEAST(25, cs.total_sessions * 2.5)) -- Session count (25 points, max at 10 sessions)
        )), 2
    ) as health_score,
    
    -- Campaign Status
    CASE 
        WHEN cs.days_since_last_session > 60 THEN 'Inactive'
        WHEN cs.days_since_last_session > 30 THEN 'Declining'
        WHEN cs.days_since_last_session > 14 THEN 'At Risk'
        ELSE 'Active'
    END as campaign_status,
    
    -- DM Workload Score
    ROUND(
        cs.active_players * 2 + 
        cs.total_characters * 1.5 + 
        cs.total_sessions * 0.5, 2
    ) as dm_workload_score

FROM campaign_stats cs
LEFT JOIN session_frequency sf ON cs.campaign_id = sf.campaign_id;

-- DM Performance Analytics
CREATE VIEW IF NOT EXISTS v_dm_performance_analytics AS
WITH dm_stats AS (
    SELECT 
        u.id as dm_id,
        u.username as dm_name,
        COUNT(DISTINCT c.id) as campaigns_managed,
        COUNT(DISTINCT cm.user_id) as total_players_managed,
        COUNT(DISTINCT cs.id) as total_sessions_run,
        ROUND(AVG(cs.duration_minutes), 0) as avg_session_duration,
        ROUND(SUM(cs.duration_minutes) / 60.0, 1) as total_dm_hours,
        ROUND(AVG(cs.experience_awarded), 0) as avg_xp_awarded,
        
        -- Player Retention Rate
        COUNT(DISTINCT CASE WHEN cs.date >= DATE('now', '-30 days') THEN cm.user_id END) as active_players_30d,
        
        -- Campaign Health
        ROUND(AVG(
            CASE WHEN julianday('now') - julianday(MAX(cs.date)) <= 14 THEN 100
                 WHEN julianday('now') - julianday(MAX(cs.date)) <= 30 THEN 75
                 WHEN julianday('now') - julianday(MAX(cs.date)) <= 60 THEN 50
                 ELSE 25 END
        ), 2) as avg_campaign_health
        
    FROM users u
    JOIN campaigns c ON u.id = c.dm_user_id
    LEFT JOIN campaign_members cm ON c.id = cm.campaign_id
    LEFT JOIN campaign_sessions cs ON c.id = cs.campaign_id
    GROUP BY u.id, u.username
)
SELECT 
    *,
    -- DM Experience Level
    CASE 
        WHEN total_sessions_run >= 50 THEN 'Veteran'
        WHEN total_sessions_run >= 20 THEN 'Experienced'
        WHEN total_sessions_run >= 10 THEN 'Intermediate'
        WHEN total_sessions_run >= 5 THEN 'Novice'
        ELSE 'Beginner'
    END as experience_level,
    
    -- DM Efficiency Score
    ROUND(
        (total_sessions_run * 0.3) + 
        (avg_session_duration / 180.0 * 20) + -- Normalize around 3 hours
        (avg_xp_awarded / 500.0 * 20) + -- Normalize around 500 XP
        (avg_campaign_health * 0.3), 2
    ) as efficiency_score
    
FROM dm_stats;

-- ========================================
-- 3. PLAYER ENGAGEMENT & RETENTION ANALYTICS
-- ========================================

-- Player Engagement Metrics
CREATE VIEW IF NOT EXISTS v_player_engagement_metrics AS
WITH player_activity AS (
    SELECT 
        u.id as user_id,
        u.username,
        u.created_at as registration_date,
        julianday('now') - julianday(u.created_at) as days_since_registration,
        
        -- Character Activity
        COUNT(DISTINCT c.id) as total_characters,
        COUNT(DISTINCT c.campaign_id) as campaigns_joined,
        ROUND(AVG(c.level), 2) as avg_character_level,
        MAX(c.level) as max_character_level,
        
        -- Session Participation
        COUNT(DISTINCT cs.id) as sessions_attended,
        ROUND(AVG(cs.duration_minutes), 0) as avg_session_duration,
        ROUND(SUM(cs.duration_minutes) / 60.0, 1) as total_play_hours,
        
        -- Recent Activity
        COUNT(DISTINCT CASE WHEN cs.date >= DATE('now', '-7 days') THEN cs.id END) as sessions_7d,
        COUNT(DISTINCT CASE WHEN cs.date >= DATE('now', '-30 days') THEN cs.id END) as sessions_30d,
        MAX(DATE(cs.date)) as last_session_date,
        julianday('now') - julianday(MAX(cs.date)) as days_since_last_session,
        
        -- Character Diversity
        COUNT(DISTINCT c.race) as races_played,
        COUNT(DISTINCT c.character_class) as classes_played,
        COUNT(DISTINCT c.background) as backgrounds_played
        
    FROM users u
    LEFT JOIN characters c ON u.id = c.user_id
    LEFT JOIN campaign_sessions cs ON c.campaign_id = cs.campaign_id
    LEFT JOIN session_character_snapshots scs ON cs.id = scs.session_id AND c.id = scs.character_id
    WHERE u.role = 'player'
    GROUP BY u.id, u.username, u.created_at
),
usage_analytics_summary AS (
    SELECT 
        user_id,
        COUNT(*) as total_events,
        COUNT(DISTINCT event_type) as event_type_diversity,
        MAX(timestamp) as last_activity_timestamp,
        COUNT(CASE WHEN timestamp >= DATETIME('now', '-7 days') THEN 1 END) as events_7d,
        COUNT(CASE WHEN timestamp >= DATETIME('now', '-30 days') THEN 1 END) as events_30d
    FROM usage_analytics
    GROUP BY user_id
)
SELECT 
    pa.*,
    COALESCE(uas.total_events, 0) as total_activity_events,
    COALESCE(uas.event_type_diversity, 0) as activity_diversity,
    COALESCE(uas.events_7d, 0) as activity_events_7d,
    COALESCE(uas.events_30d, 0) as activity_events_30d,
    
    -- Engagement Score (0-100)
    ROUND(
        LEAST(100, GREATEST(0,
            -- Recency (30 points)
            (CASE WHEN pa.days_since_last_session <= 7 THEN 30
                  WHEN pa.days_since_last_session <= 14 THEN 20
                  WHEN pa.days_since_last_session <= 30 THEN 10
                  ELSE 0 END) +
            -- Activity Level (30 points)
            (LEAST(30, pa.sessions_30d * 5)) +
            -- Character Investment (25 points)
            (LEAST(25, pa.avg_character_level * 2.5)) +
            -- Diversity (15 points)
            (LEAST(15, (pa.races_played + pa.classes_played) * 1.5))
        )), 2
    ) as engagement_score,
    
    -- Player Segment
    CASE 
        WHEN pa.days_since_last_session > 90 THEN 'Churned'
        WHEN pa.days_since_last_session > 30 THEN 'At Risk'
        WHEN pa.sessions_30d >= 8 THEN 'Super Active'
        WHEN pa.sessions_30d >= 4 THEN 'Active'
        WHEN pa.sessions_30d >= 2 THEN 'Regular'
        WHEN pa.sessions_30d >= 1 THEN 'Casual'
        ELSE 'Inactive'
    END as player_segment,
    
    -- Retention Risk Score (0-100, higher = more risk)
    ROUND(
        LEAST(100, GREATEST(0,
            (pa.days_since_last_session * 2) +
            (CASE WHEN pa.sessions_30d = 0 THEN 40 ELSE 0 END) +
            (CASE WHEN pa.total_characters = 0 THEN 30 ELSE 0 END) +
            (CASE WHEN pa.campaigns_joined = 0 THEN 20 ELSE 0 END)
        )), 2
    ) as retention_risk_score

FROM player_activity pa
LEFT JOIN usage_analytics_summary uas ON pa.user_id = uas.user_id;

-- Player Retention Cohort Analysis
CREATE VIEW IF NOT EXISTS v_player_retention_cohorts AS
WITH registration_cohorts AS (
    SELECT 
        DATE(created_at, 'start of month') as cohort_month,
        id as user_id,
        created_at as registration_date
    FROM users 
    WHERE role = 'player'
),
activity_periods AS (
    SELECT 
        user_id,
        DATE(timestamp, 'start of month') as activity_month
    FROM usage_analytics
    WHERE user_id IS NOT NULL
    GROUP BY user_id, DATE(timestamp, 'start of month')
),
cohort_data AS (
    SELECT 
        rc.cohort_month,
        rc.user_id,
        ap.activity_month,
        CAST((julianday(ap.activity_month) - julianday(rc.cohort_month)) / 30.44 AS INTEGER) as months_since_registration
    FROM registration_cohorts rc
    LEFT JOIN activity_periods ap ON rc.user_id = ap.user_id
)
SELECT 
    cohort_month,
    COUNT(DISTINCT user_id) as cohort_size,
    COUNT(DISTINCT CASE WHEN months_since_registration = 0 THEN user_id END) as month_0,
    COUNT(DISTINCT CASE WHEN months_since_registration = 1 THEN user_id END) as month_1,
    COUNT(DISTINCT CASE WHEN months_since_registration = 2 THEN user_id END) as month_2,
    COUNT(DISTINCT CASE WHEN months_since_registration = 3 THEN user_id END) as month_3,
    COUNT(DISTINCT CASE WHEN months_since_registration = 6 THEN user_id END) as month_6,
    COUNT(DISTINCT CASE WHEN months_since_registration = 12 THEN user_id END) as month_12,
    
    -- Retention Rates
    ROUND(COUNT(DISTINCT CASE WHEN months_since_registration = 1 THEN user_id END) * 100.0 / 
          NULLIF(COUNT(DISTINCT user_id), 0), 2) as retention_month_1,
    ROUND(COUNT(DISTINCT CASE WHEN months_since_registration = 3 THEN user_id END) * 100.0 / 
          NULLIF(COUNT(DISTINCT user_id), 0), 2) as retention_month_3,
    ROUND(COUNT(DISTINCT CASE WHEN months_since_registration = 6 THEN user_id END) * 100.0 / 
          NULLIF(COUNT(DISTINCT user_id), 0), 2) as retention_month_6

FROM cohort_data
GROUP BY cohort_month
HAVING COUNT(DISTINCT user_id) >= 5
ORDER BY cohort_month;

-- ========================================
-- 4. STATISTICAL MODELS FOR D&D GAME BALANCE
-- ========================================

-- Class Balance Analysis
CREATE VIEW IF NOT EXISTS v_class_balance_analysis AS
WITH class_performance AS (
    SELECT 
        c.character_class,
        c.level,
        COUNT(*) as sample_size,
        
        -- Combat Stats
        ROUND(AVG(c.armor_class), 2) as avg_ac,
        ROUND(AVG(c.hit_points_max), 2) as avg_hp,
        ROUND(AVG(c.initiative_modifier), 2) as avg_initiative,
        
        -- Ability Scores
        ROUND(AVG(c.strength), 2) as avg_str,
        ROUND(AVG(c.dexterity), 2) as avg_dex,
        ROUND(AVG(c.constitution), 2) as avg_con,
        ROUND(AVG(c.intelligence), 2) as avg_int,
        ROUND(AVG(c.wisdom), 2) as avg_wis,
        ROUND(AVG(c.charisma), 2) as avg_cha,
        
        -- Experience & Progression
        ROUND(AVG(c.experience_points), 0) as avg_xp,
        COUNT(DISTINCT c.user_id) as unique_players,
        
        -- Session Data
        ROUND(AVG(cs.duration_minutes), 0) as avg_session_duration,
        COUNT(DISTINCT cs.id) as total_sessions
        
    FROM characters c
    LEFT JOIN campaign_sessions cs ON c.campaign_id = cs.campaign_id
    LEFT JOIN session_character_snapshots scs ON cs.id = scs.session_id AND c.id = scs.character_id
    GROUP BY c.character_class, c.level
    HAVING COUNT(*) >= 5
),
class_rankings AS (
    SELECT 
        *,
        -- Combat Effectiveness Ranking
        RANK() OVER (PARTITION BY level ORDER BY (avg_ac * 0.4 + avg_hp * 0.4 + avg_initiative * 0.2) DESC) as combat_rank,
        
        -- Popularity Ranking
        RANK() OVER (PARTITION BY level ORDER BY sample_size DESC) as popularity_rank,
        
        -- Balance Score (lower variance = better balanced)
        ROUND(
            ABS(avg_ac - (SELECT AVG(avg_ac) FROM class_performance cp2 WHERE cp2.level = class_performance.level)) +
            ABS(avg_hp - (SELECT AVG(avg_hp) FROM class_performance cp2 WHERE cp2.level = class_performance.level)) +
            ABS(avg_initiative - (SELECT AVG(avg_initiative) FROM class_performance cp2 WHERE cp2.level = class_performance.level)),
            2
        ) as balance_deviation
    FROM class_performance
)
SELECT 
    *,
    CASE 
        WHEN balance_deviation <= 5 THEN 'Well Balanced'
        WHEN balance_deviation <= 10 THEN 'Minor Imbalance'
        WHEN balance_deviation <= 15 THEN 'Moderate Imbalance'
        ELSE 'Significant Imbalance'
    END as balance_assessment,
    
    -- Power Level Assessment
    CASE 
        WHEN combat_rank <= 3 THEN 'High Power'
        WHEN combat_rank <= 6 THEN 'Medium Power'
        ELSE 'Low Power'
    END as power_level
    
FROM class_rankings
ORDER BY level, combat_rank;

-- Race-Class Synergy Analysis
CREATE VIEW IF NOT EXISTS v_race_class_synergy AS
WITH synergy_data AS (
    SELECT 
        c.race,
        c.character_class,
        COUNT(*) as combination_count,
        COUNT(DISTINCT c.user_id) as unique_players,
        ROUND(AVG(c.level), 2) as avg_level,
        
        -- Performance Metrics
        ROUND(AVG(c.armor_class + c.hit_points_max + c.initiative_modifier), 2) as combat_score,
        ROUND(AVG(c.strength + c.dexterity + c.constitution + c.intelligence + c.wisdom + c.charisma), 2) as total_stats,
        
        -- Progression Speed
        ROUND(AVG(c.experience_points / NULLIF(c.level, 0)), 0) as xp_efficiency
        
    FROM characters c
    GROUP BY c.race, c.character_class
    HAVING COUNT(*) >= 3
),
expected_values AS (
    SELECT 
        race,
        character_class,
        combination_count,
        
        -- Calculate expected frequency based on individual popularity
        (
            (SELECT SUM(combination_count) FROM synergy_data sd2 WHERE sd2.race = synergy_data.race) *
            (SELECT SUM(combination_count) FROM synergy_data sd2 WHERE sd2.character_class = synergy_data.character_class)
        ) / (SELECT SUM(combination_count) FROM synergy_data) as expected_count
        
    FROM synergy_data
)
SELECT 
    sd.race,
    sd.character_class,
    sd.combination_count,
    sd.unique_players,
    sd.avg_level,
    sd.combat_score,
    sd.total_stats,
    sd.xp_efficiency,
    
    ROUND(ev.expected_count, 1) as expected_count,
    ROUND((sd.combination_count - ev.expected_count) / ev.expected_count * 100, 2) as synergy_index,
    
    CASE 
        WHEN (sd.combination_count - ev.expected_count) / ev.expected_count > 0.5 THEN 'High Synergy'
        WHEN (sd.combination_count - ev.expected_count) / ev.expected_count > 0.2 THEN 'Good Synergy'
        WHEN (sd.combination_count - ev.expected_count) / ev.expected_count > -0.2 THEN 'Neutral'
        WHEN (sd.combination_count - ev.expected_count) / ev.expected_count > -0.5 THEN 'Poor Synergy'
        ELSE 'Very Poor Synergy'
    END as synergy_rating

FROM synergy_data sd
JOIN expected_values ev ON sd.race = ev.race AND sd.character_class = ev.character_class
ORDER BY synergy_index DESC;

-- ========================================
-- 5. RECOMMENDATION ENGINES
-- ========================================

-- Character Build Recommendations
CREATE VIEW IF NOT EXISTS v_build_recommendations AS
WITH user_preferences AS (
    SELECT 
        c.user_id,
        
        -- Class Preferences
        GROUP_CONCAT(DISTINCT c.character_class) as played_classes,
        COUNT(DISTINCT c.character_class) as class_variety,
        
        -- Race Preferences  
        GROUP_CONCAT(DISTINCT c.race) as played_races,
        COUNT(DISTINCT c.race) as race_variety,
        
        -- Combat Style Analysis
        ROUND(AVG(c.armor_class), 0) as preferred_ac,
        ROUND(AVG(c.hit_points_max), 0) as preferred_hp,
        
        -- Ability Score Preferences
        CASE 
            WHEN AVG(c.strength) >= AVG(c.dexterity) AND AVG(c.strength) >= AVG(c.constitution) THEN 'STR'
            WHEN AVG(c.dexterity) >= AVG(c.constitution) THEN 'DEX'
            ELSE 'CON'
        END as physical_preference,
        
        CASE 
            WHEN AVG(c.intelligence) >= AVG(c.wisdom) AND AVG(c.intelligence) >= AVG(c.charisma) THEN 'INT'
            WHEN AVG(c.wisdom) >= AVG(c.charisma) THEN 'WIS'
            ELSE 'CHA'
        END as mental_preference,
        
        ROUND(AVG(c.level), 1) as avg_level_played
        
    FROM characters c
    GROUP BY c.user_id
    HAVING COUNT(*) >= 2
),
build_performance AS (
    SELECT 
        race,
        character_class,
        background,
        COUNT(*) as popularity,
        ROUND(AVG(level), 2) as avg_level,
        ROUND(AVG(experience_points), 0) as avg_xp,
        ROUND(AVG(armor_class + hit_points_max * 0.5), 2) as survivability,
        COUNT(DISTINCT user_id) as unique_players
    FROM characters
    GROUP BY race, character_class, background
    HAVING COUNT(*) >= 5
)
SELECT 
    up.user_id,
    bp.race,
    bp.character_class,
    bp.background,
    bp.popularity,
    bp.survivability,
    
    -- Recommendation Score
    ROUND(
        -- Novelty bonus (haven't played this combo)
        (CASE WHEN bp.race NOT IN (
            SELECT value FROM json_each('[' || '"' || REPLACE(up.played_races, ',', '","') || '"' || ']')
        ) THEN 20 ELSE 0 END) +
        
        (CASE WHEN bp.character_class NOT IN (
            SELECT value FROM json_each('[' || '"' || REPLACE(up.played_classes, ',', '","') || '"' || ']')
        ) THEN 20 ELSE 0 END) +
        
        -- Performance bonus
        (bp.survivability / 50.0 * 30) +
        
        -- Popularity bonus
        (LOG(bp.popularity) * 10) +
        
        -- Level progression bonus
        (bp.avg_level * 5), 2
    ) as recommendation_score,
    
    CASE 
        WHEN bp.race NOT IN (
            SELECT value FROM json_each('[' || '"' || REPLACE(up.played_races, ',', '","') || '"' || ']')
        ) AND bp.character_class NOT IN (
            SELECT value FROM json_each('[' || '"' || REPLACE(up.played_classes, ',', '","') || '"' || ']')
        ) THEN 'New Experience'
        
        WHEN bp.survivability > 60 THEN 'High Performance'
        WHEN bp.popularity > 20 THEN 'Popular Choice'
        ELSE 'Solid Option'
    END as recommendation_reason

FROM user_preferences up
CROSS JOIN build_performance bp
WHERE NOT (bp.race IN (
    SELECT value FROM json_each('[' || '"' || REPLACE(up.played_races, ',', '","') || '"' || ']')
) AND bp.character_class IN (
    SELECT value FROM json_each('[' || '"' || REPLACE(up.played_classes, ',', '","') || '"' || ']')
))
ORDER BY up.user_id, recommendation_score DESC;

-- Equipment Recommendations by Character Level and Class
CREATE VIEW IF NOT EXISTS v_equipment_recommendations AS
WITH character_equipment_usage AS (
    SELECT 
        c.character_class,
        c.level,
        e.id as equipment_id,
        e.name as equipment_name,
        e.type,
        e.rarity,
        COUNT(*) as usage_count,
        COUNT(DISTINCT c.id) as unique_characters,
        ROUND(AVG(c.armor_class), 2) as avg_ac_with_item,
        ROUND(AVG(c.hit_points_max), 2) as avg_hp_with_item
    FROM characters c
    JOIN character_equipment ce ON c.id = ce.character_id AND ce.is_equipped = TRUE
    JOIN equipment e ON ce.equipment_id = e.id
    GROUP BY c.character_class, c.level, e.id, e.name, e.type, e.rarity
    HAVING COUNT(*) >= 3
),
class_level_totals AS (
    SELECT 
        character_class,
        level,
        COUNT(DISTINCT id) as total_characters
    FROM characters
    GROUP BY character_class, level
    HAVING COUNT(DISTINCT id) >= 10
)
SELECT 
    ceu.character_class,
    ceu.level,
    ceu.equipment_name,
    ceu.type,
    ceu.rarity,
    ceu.usage_count,
    ceu.unique_characters,
    clt.total_characters,
    ROUND((ceu.unique_characters * 100.0 / clt.total_characters), 2) as adoption_rate,
    ceu.avg_ac_with_item,
    ceu.avg_hp_with_item,
    
    -- Recommendation Score
    ROUND(
        (ceu.unique_characters * 100.0 / clt.total_characters) * 0.4 + -- Popularity weight
        (ceu.avg_ac_with_item + ceu.avg_hp_with_item * 0.5) * 0.4 + -- Performance weight
        (CASE ceu.rarity 
            WHEN 'common' THEN 20
            WHEN 'uncommon' THEN 15  
            WHEN 'rare' THEN 10
            WHEN 'very rare' THEN 5
            WHEN 'legendary' THEN 2
            ELSE 10 END) * 0.2, 2 -- Accessibility weight
    ) as recommendation_score

FROM character_equipment_usage ceu
JOIN class_level_totals clt ON ceu.character_class = clt.character_class AND ceu.level = clt.level
WHERE ceu.adoption_rate >= 10 -- Only recommend items used by at least 10% of characters
ORDER BY ceu.character_class, ceu.level, recommendation_score DESC;

-- ========================================
-- 6. BIGQUERY COMPATIBLE ANALYTICS VIEWS  
-- ========================================

-- BigQuery Export Schema for Advanced Analytics
-- (These would be used to export data to BigQuery for ML/AI analysis)

CREATE VIEW IF NOT EXISTS v_bigquery_character_features AS
SELECT 
    c.id as character_id,
    c.user_id,
    c.campaign_id,
    c.name,
    c.race,
    c.character_class,
    c.background,
    c.alignment,
    c.level,
    c.experience_points,
    
    -- Ability Scores (normalized)
    ROUND((c.strength - 10.5) / 4.5, 3) as strength_normalized,
    ROUND((c.dexterity - 10.5) / 4.5, 3) as dexterity_normalized,
    ROUND((c.constitution - 10.5) / 4.5, 3) as constitution_normalized,
    ROUND((c.intelligence - 10.5) / 4.5, 3) as intelligence_normalized,
    ROUND((c.wisdom - 10.5) / 4.5, 3) as wisdom_normalized,
    ROUND((c.charisma - 10.5) / 4.5, 3) as charisma_normalized,
    
    -- Combat Stats (normalized)
    ROUND((c.armor_class - 12) / 6.0, 3) as ac_normalized,
    ROUND((c.hit_points_max - 15) / 25.0, 3) as hp_normalized,
    ROUND(c.initiative_modifier / 5.0, 3) as initiative_normalized,
    
    -- Derived Features
    c.strength + c.dexterity + c.constitution as physical_total,
    c.intelligence + c.wisdom + c.charisma as mental_total,
    
    -- Binary Features
    CASE WHEN c.strength >= 15 THEN 1 ELSE 0 END as high_strength,
    CASE WHEN c.dexterity >= 15 THEN 1 ELSE 0 END as high_dexterity,
    CASE WHEN c.constitution >= 15 THEN 1 ELSE 0 END as high_constitution,
    CASE WHEN c.intelligence >= 15 THEN 1 ELSE 0 END as high_intelligence,
    CASE WHEN c.wisdom >= 15 THEN 1 ELSE 0 END as high_wisdom,
    CASE WHEN c.charisma >= 15 THEN 1 ELSE 0 END as high_charisma,
    
    -- Timestamps
    c.created_at,
    c.updated_at,
    julianday('now') - julianday(c.created_at) as character_age_days

FROM characters c
WHERE c.level > 0;

CREATE VIEW IF NOT EXISTS v_bigquery_session_events AS 
SELECT 
    cs.id as session_id,
    cs.campaign_id,
    c.id as character_id,
    c.user_id,
    cs.session_number,
    cs.date as session_date,
    cs.duration_minutes,
    cs.experience_awarded,
    
    -- Character state before/after
    scs.experience_before,
    scs.experience_after,
    scs.level_before,
    scs.level_after,
    
    -- Derived metrics
    scs.experience_after - scs.experience_before as xp_gained,
    scs.level_after - scs.level_before as levels_gained,
    
    -- Session context
    EXTRACT(dow FROM cs.date) as day_of_week, -- 0=Sunday, 6=Saturday
    EXTRACT(hour FROM cs.date) as hour_of_day,
    
    -- Performance indicators
    CASE WHEN cs.duration_minutes >= 240 THEN 1 ELSE 0 END as long_session,
    CASE WHEN cs.experience_awarded >= 500 THEN 1 ELSE 0 END as high_xp_session,
    CASE WHEN scs.level_after > scs.level_before THEN 1 ELSE 0 END as level_up_session

FROM campaign_sessions cs
JOIN session_character_snapshots scs ON cs.id = scs.session_id
JOIN characters c ON scs.character_id = c.id;

-- ========================================
-- 7. DATA VISUALIZATION QUERY TEMPLATES
-- ========================================

-- Dashboard Queries for DM Interface

-- Campaign Overview Widget
CREATE VIEW IF NOT EXISTS v_dashboard_campaign_overview AS
SELECT 
    COUNT(DISTINCT c.id) as total_campaigns,
    COUNT(DISTINCT CASE WHEN julianday('now') - julianday(MAX(cs.date)) <= 14 THEN c.id END) as active_campaigns,
    COUNT(DISTINCT cm.user_id) as total_players,
    COUNT(DISTINCT ch.id) as total_characters,
    ROUND(AVG(ch.level), 1) as avg_character_level,
    COUNT(DISTINCT cs.id) as total_sessions,
    ROUND(SUM(cs.duration_minutes) / 60.0, 0) as total_hours_played

FROM campaigns c
LEFT JOIN campaign_members cm ON c.id = cm.campaign_id
LEFT JOIN characters ch ON c.id = ch.campaign_id  
LEFT JOIN campaign_sessions cs ON c.id = cs.campaign_id;

-- Character Distribution for Charts
CREATE VIEW IF NOT EXISTS v_dashboard_character_distribution AS
SELECT 
    'race' as dimension,
    race as category,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters), 2) as percentage
FROM characters
GROUP BY race

UNION ALL

SELECT 
    'class' as dimension,
    character_class as category,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters), 2) as percentage
FROM characters  
GROUP BY character_class

UNION ALL

SELECT 
    'level' as dimension,
    CASE 
        WHEN level <= 5 THEN 'Levels 1-5'
        WHEN level <= 10 THEN 'Levels 6-10'
        WHEN level <= 15 THEN 'Levels 11-15'
        ELSE 'Levels 16-20'
    END as category,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters), 2) as percentage
FROM characters
GROUP BY 
    CASE 
        WHEN level <= 5 THEN 'Levels 1-5'
        WHEN level <= 10 THEN 'Levels 6-10'
        WHEN level <= 15 THEN 'Levels 11-15'
        ELSE 'Levels 16-20'
    END;

-- Activity Timeline for Line Charts
CREATE VIEW IF NOT EXISTS v_dashboard_activity_timeline AS
WITH daily_activity AS (
    SELECT 
        DATE(timestamp) as activity_date,
        COUNT(*) as event_count,
        COUNT(DISTINCT user_id) as active_users
    FROM usage_analytics
    WHERE timestamp >= DATE('now', '-30 days')
    GROUP BY DATE(timestamp)
),
session_activity AS (
    SELECT 
        DATE(date) as session_date,
        COUNT(*) as session_count,
        SUM(duration_minutes) as total_minutes,
        COUNT(DISTINCT campaign_id) as active_campaigns
    FROM campaign_sessions  
    WHERE date >= DATE('now', '-30 days')
    GROUP BY DATE(date)
)
SELECT 
    COALESCE(da.activity_date, sa.session_date) as date,
    COALESCE(da.event_count, 0) as events,
    COALESCE(da.active_users, 0) as active_users,
    COALESCE(sa.session_count, 0) as sessions,
    COALESCE(sa.total_minutes, 0) as session_minutes,
    COALESCE(sa.active_campaigns, 0) as active_campaigns
FROM daily_activity da
FULL OUTER JOIN session_activity sa ON da.activity_date = sa.session_date
ORDER BY date;

-- ========================================
-- 8. PREDICTIVE MODELS & MACHINE LEARNING FEATURES
-- ========================================

-- Character Progression Prediction Features
CREATE VIEW IF NOT EXISTS v_ml_character_progression_features AS
WITH character_history AS (
    SELECT 
        cp.character_id,
        COUNT(*) as progression_events,
        MAX(cp.level) as current_level,
        MIN(cp.level) as starting_level,
        MAX(cp.level) - MIN(cp.level) as levels_gained,
        AVG(JSON_EXTRACT(cp.changes, '$.experience_points')) as avg_xp_per_event,
        julianday(MAX(cp.timestamp)) - julianday(MIN(cp.timestamp)) as progression_days,
        
        -- Calculate progression velocity
        CASE WHEN julianday(MAX(cp.timestamp)) - julianday(MIN(cp.timestamp)) > 0 
             THEN (MAX(cp.level) - MIN(cp.level)) / 
                  (julianday(MAX(cp.timestamp)) - julianday(MIN(cp.timestamp))) * 30
             ELSE 0 END as levels_per_month
             
    FROM character_progression cp
    GROUP BY cp.character_id
    HAVING COUNT(*) >= 3
)
SELECT 
    c.id as character_id,
    c.user_id,
    c.level as current_level,
    c.experience_points,
    c.race,
    c.character_class,
    
    -- Character stats as features
    c.strength, c.dexterity, c.constitution,
    c.intelligence, c.wisdom, c.charisma,
    c.armor_class, c.hit_points_max,
    
    -- Historical progression features
    COALESCE(ch.progression_events, 0) as progression_events,
    COALESCE(ch.starting_level, c.level) as starting_level,
    COALESCE(ch.levels_gained, 0) as total_levels_gained,
    COALESCE(ch.avg_xp_per_event, 0) as avg_xp_per_event,
    COALESCE(ch.progression_days, 0) as progression_days,
    COALESCE(ch.levels_per_month, 0) as progression_velocity,
    
    -- Campaign context features
    (SELECT COUNT(*) FROM campaign_members WHERE campaign_id = c.campaign_id) as party_size,
    (SELECT COUNT(*) FROM campaign_sessions WHERE campaign_id = c.campaign_id) as campaign_sessions,
    (SELECT AVG(duration_minutes) FROM campaign_sessions WHERE campaign_id = c.campaign_id) as avg_session_duration,
    
    -- Player behavior features  
    (SELECT COUNT(*) FROM characters WHERE user_id = c.user_id) as player_total_characters,
    (SELECT AVG(level) FROM characters WHERE user_id = c.user_id AND id != c.id) as player_avg_other_level,
    
    -- Target variable (next level prediction)
    CASE WHEN c.level < 20 THEN c.level + 1 ELSE 20 END as target_next_level,
    
    -- Character age and activity
    julianday('now') - julianday(c.created_at) as character_age_days,
    julianday('now') - julianday(c.updated_at) as days_since_update

FROM characters c
LEFT JOIN character_history ch ON c.id = ch.character_id
WHERE c.level > 0 AND c.level < 20;

-- Player Churn Prediction Features
CREATE VIEW IF NOT EXISTS v_ml_churn_prediction_features AS
WITH player_activity AS (
    SELECT 
        u.id as user_id,
        COUNT(DISTINCT c.id) as total_characters,
        COUNT(DISTINCT c.campaign_id) as campaigns_joined,
        AVG(c.level) as avg_character_level,
        MAX(c.level) as max_character_level,
        
        -- Session activity
        COUNT(DISTINCT cs.id) as total_sessions,
        AVG(cs.duration_minutes) as avg_session_duration,
        SUM(cs.duration_minutes) as total_play_minutes,
        
        -- Recent activity (last 30 days)
        COUNT(DISTINCT CASE WHEN cs.date >= DATE('now', '-30 days') THEN cs.id END) as sessions_30d,
        COUNT(DISTINCT CASE WHEN cs.date >= DATE('now', '-7 days') THEN cs.id END) as sessions_7d,
        
        -- Usage patterns
        COUNT(DISTINCT DATE(ua.timestamp)) as active_days,
        COUNT(DISTINCT ua.event_type) as event_type_diversity,
        COUNT(ua.id) as total_events,
        
        -- Temporal features
        julianday('now') - julianday(u.created_at) as account_age_days,
        julianday('now') - julianday(MAX(ua.timestamp)) as days_since_last_activity,
        julianday('now') - julianday(MAX(cs.date)) as days_since_last_session,
        
        -- Engagement consistency  
        COUNT(DISTINCT strftime('%Y-%m', ua.timestamp)) as active_months,
        COUNT(DISTINCT strftime('%Y-%W', ua.timestamp)) as active_weeks
        
    FROM users u
    LEFT JOIN characters c ON u.id = c.user_id
    LEFT JOIN campaign_sessions cs ON c.campaign_id = cs.campaign_id
    LEFT JOIN usage_analytics ua ON u.id = ua.user_id
    WHERE u.role = 'player'
    GROUP BY u.id
)
SELECT 
    user_id,
    total_characters,
    campaigns_joined,
    avg_character_level,
    max_character_level,
    total_sessions,
    avg_session_duration,
    total_play_minutes,
    sessions_30d,
    sessions_7d,
    active_days,
    event_type_diversity,
    total_events,
    account_age_days,
    days_since_last_activity,
    days_since_last_session,
    active_months,
    active_weeks,
    
    -- Derived features
    CASE WHEN account_age_days > 0 THEN total_sessions / (account_age_days / 30.0) ELSE 0 END as sessions_per_month,
    CASE WHEN account_age_days > 0 THEN total_events / (account_age_days / 7.0) ELSE 0 END as events_per_week,
    CASE WHEN active_days > 0 THEN total_sessions / active_days ELSE 0 END as sessions_per_active_day,
    CASE WHEN total_sessions > 0 THEN total_characters / total_sessions ELSE 0 END as characters_per_session,
    
    -- Target variable (churn definition: inactive for 30+ days)
    CASE WHEN days_since_last_activity >= 30 THEN 1 ELSE 0 END as is_churned,
    CASE WHEN days_since_last_activity >= 14 THEN 1 ELSE 0 END as at_risk

FROM player_activity;

-- ========================================
-- 9. A/B TESTING FRAMEWORK  
-- ========================================

-- A/B Test Configuration Table
CREATE TABLE IF NOT EXISTS ab_tests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    hypothesis TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    success_metric TEXT NOT NULL, -- 'retention', 'engagement', 'progression', etc.
    variants TEXT NOT NULL, -- JSON: [{"name": "control", "weight": 50}, {"name": "variant_a", "weight": 50}]
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- A/B Test Assignments
CREATE TABLE IF NOT EXISTS ab_test_assignments (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(test_id, user_id)
);

-- A/B Test Results Analysis
CREATE VIEW IF NOT EXISTS v_ab_test_results AS
WITH test_metrics AS (
    SELECT 
        ata.test_id,
        abt.name as test_name,
        ata.variant_name,
        COUNT(DISTINCT ata.user_id) as users_in_variant,
        
        -- Engagement metrics
        COUNT(DISTINCT ua.user_id) as active_users,
        AVG(CASE WHEN ua.user_id IS NOT NULL THEN 1 ELSE 0 END) as engagement_rate,
        
        -- Character creation metrics
        COUNT(DISTINCT c.id) as characters_created,
        AVG(c.level) as avg_character_level,
        
        -- Session metrics
        COUNT(DISTINCT cs.id) as total_sessions,
        AVG(cs.duration_minutes) as avg_session_duration,
        
        -- Retention metrics (7-day, 30-day)
        COUNT(DISTINCT CASE WHEN ua.timestamp >= DATE(ata.assigned_at, '+7 days') THEN ua.user_id END) as retained_7d,
        COUNT(DISTINCT CASE WHEN ua.timestamp >= DATE(ata.assigned_at, '+30 days') THEN ua.user_id END) as retained_30d
        
    FROM ab_test_assignments ata
    JOIN ab_tests abt ON ata.test_id = abt.id
    LEFT JOIN usage_analytics ua ON ata.user_id = ua.user_id 
        AND ua.timestamp >= ata.assigned_at
        AND ua.timestamp <= COALESCE(abt.end_date, DATETIME('now'))
    LEFT JOIN characters c ON ata.user_id = c.user_id
        AND c.created_at >= ata.assigned_at
        AND c.created_at <= COALESCE(abt.end_date, DATETIME('now'))
    LEFT JOIN campaign_sessions cs ON c.campaign_id = cs.campaign_id
        AND cs.date >= ata.assigned_at
        AND cs.date <= COALESCE(abt.end_date, DATETIME('now'))
    
    GROUP BY ata.test_id, abt.name, ata.variant_name
)
SELECT 
    test_id,
    test_name,
    variant_name,
    users_in_variant,
    active_users,
    ROUND(engagement_rate * 100, 2) as engagement_rate_pct,
    characters_created,
    ROUND(characters_created * 1.0 / users_in_variant, 2) as characters_per_user,
    ROUND(avg_character_level, 2) as avg_character_level,
    total_sessions,
    ROUND(total_sessions * 1.0 / users_in_variant, 2) as sessions_per_user,
    ROUND(avg_session_duration, 0) as avg_session_duration,
    retained_7d,
    ROUND(retained_7d * 100.0 / users_in_variant, 2) as retention_7d_pct,
    retained_30d,
    ROUND(retained_30d * 100.0 / users_in_variant, 2) as retention_30d_pct

FROM test_metrics
ORDER BY test_id, variant_name;

-- Statistical significance testing for A/B tests
CREATE VIEW IF NOT EXISTS v_ab_test_significance AS
WITH variant_pairs AS (
    SELECT DISTINCT 
        t1.test_id,
        t1.test_name,
        t1.variant_name as variant_a,
        t2.variant_name as variant_b,
        t1.engagement_rate_pct as rate_a,
        t2.engagement_rate_pct as rate_b,
        t1.users_in_variant as n_a,
        t2.users_in_variant as n_b
    FROM v_ab_test_results t1
    JOIN v_ab_test_results t2 ON t1.test_id = t2.test_id 
        AND t1.variant_name < t2.variant_name -- Avoid duplicate comparisons
)
SELECT 
    test_id,
    test_name,
    variant_a,
    variant_b,
    rate_a,
    rate_b,
    ROUND(rate_b - rate_a, 2) as lift_pct_points,
    ROUND((rate_b - rate_a) / rate_a * 100, 2) as relative_lift_pct,
    n_a,
    n_b,
    
    -- Simple statistical significance approximation
    -- (Proper chi-square test would be implemented in application layer)
    CASE 
        WHEN ABS(rate_b - rate_a) >= 5 AND n_a >= 100 AND n_b >= 100 THEN 'Likely Significant'
        WHEN ABS(rate_b - rate_a) >= 2 AND n_a >= 500 AND n_b >= 500 THEN 'Possibly Significant' 
        ELSE 'Not Significant'
    END as significance_assessment

FROM variant_pairs
ORDER BY test_id, ABS(rate_b - rate_a) DESC;

-- ========================================
-- 10. PERFORMANCE METRICS & KPIs
-- ========================================

-- Application Performance KPIs
CREATE VIEW IF NOT EXISTS v_application_kpis AS
WITH time_periods AS (
    SELECT 
        'Last 7 Days' as period,
        DATE('now', '-7 days') as start_date,
        DATE('now') as end_date
    UNION ALL
    SELECT 
        'Last 30 Days' as period,
        DATE('now', '-30 days') as start_date,
        DATE('now') as end_date
    UNION ALL
    SELECT 
        'Last 90 Days' as period, 
        DATE('now', '-90 days') as start_date,
        DATE('now') as end_date
),
period_metrics AS (
    SELECT 
        tp.period,
        
        -- User metrics
        COUNT(DISTINCT CASE WHEN u.created_at >= tp.start_date THEN u.id END) as new_users,
        COUNT(DISTINCT CASE WHEN ua.timestamp >= tp.start_date THEN ua.user_id END) as active_users,
        
        -- Character metrics
        COUNT(DISTINCT CASE WHEN c.created_at >= tp.start_date THEN c.id END) as characters_created,
        ROUND(AVG(CASE WHEN c.created_at >= tp.start_date THEN c.level END), 2) as avg_new_char_level,
        
        -- Campaign metrics
        COUNT(DISTINCT CASE WHEN cam.created_at >= tp.start_date THEN cam.id END) as campaigns_created,
        COUNT(DISTINCT CASE WHEN cs.date >= tp.start_date THEN cs.campaign_id END) as active_campaigns,
        
        -- Session metrics
        COUNT(DISTINCT CASE WHEN cs.date >= tp.start_date THEN cs.id END) as sessions_run,
        ROUND(AVG(CASE WHEN cs.date >= tp.start_date THEN cs.duration_minutes END), 0) as avg_session_duration,
        ROUND(SUM(CASE WHEN cs.date >= tp.start_date THEN cs.duration_minutes ELSE 0 END) / 60.0, 1) as total_hours_played,
        
        -- Engagement metrics
        COUNT(CASE WHEN ua.timestamp >= tp.start_date THEN ua.id END) as total_events,
        COUNT(DISTINCT CASE WHEN ua.timestamp >= tp.start_date THEN ua.event_type END) as unique_event_types
        
    FROM time_periods tp
    CROSS JOIN users u
    LEFT JOIN usage_analytics ua ON u.id = ua.user_id
    LEFT JOIN characters c ON u.id = c.user_id
    LEFT JOIN campaigns cam ON u.id = cam.dm_user_id
    LEFT JOIN campaign_sessions cs ON cam.id = cs.campaign_id
    GROUP BY tp.period, tp.start_date, tp.end_date
)
SELECT 
    period,
    new_users,
    active_users,
    ROUND(active_users * 100.0 / NULLIF((SELECT COUNT(*) FROM users WHERE role = 'player'), 0), 2) as user_activation_rate,
    
    characters_created,
    ROUND(characters_created * 1.0 / NULLIF(active_users, 0), 2) as characters_per_active_user,
    avg_new_char_level,
    
    campaigns_created,
    active_campaigns,
    
    sessions_run,
    ROUND(sessions_run * 1.0 / NULLIF(active_campaigns, 0), 2) as sessions_per_campaign,
    avg_session_duration,
    total_hours_played,
    
    total_events,
    ROUND(total_events * 1.0 / NULLIF(active_users, 0), 2) as events_per_active_user,
    unique_event_types

FROM period_metrics
ORDER BY 
    CASE period 
        WHEN 'Last 7 Days' THEN 1
        WHEN 'Last 30 Days' THEN 2  
        WHEN 'Last 90 Days' THEN 3
    END;

-- Content Performance Analysis
CREATE VIEW IF NOT EXISTS v_content_performance AS
SELECT 
    'Races' as content_type,
    race as content_name,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    ROUND(AVG(level), 2) as avg_level,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters), 2) as usage_percentage
FROM characters
GROUP BY race

UNION ALL

SELECT 
    'Classes' as content_type,
    character_class as content_name,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    ROUND(AVG(level), 2) as avg_level,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters), 2) as usage_percentage
FROM characters
GROUP BY character_class

UNION ALL

SELECT 
    'Backgrounds' as content_type,
    background as content_name,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    ROUND(AVG(level), 2) as avg_level,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM characters WHERE background IS NOT NULL), 2) as usage_percentage
FROM characters
WHERE background IS NOT NULL
GROUP BY background

ORDER BY content_type, usage_count DESC;

-- System Health Metrics
CREATE VIEW IF NOT EXISTS v_system_health_metrics AS
SELECT 
    -- Database size metrics
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM characters) as total_characters,
    (SELECT COUNT(*) FROM campaigns) as total_campaigns,
    (SELECT COUNT(*) FROM campaign_sessions) as total_sessions,
    (SELECT COUNT(*) FROM usage_analytics) as total_analytics_events,
    
    -- Data quality metrics
    ROUND((SELECT COUNT(*) FROM characters WHERE level > 0) * 100.0 / 
          (SELECT COUNT(*) FROM characters), 2) as valid_character_percentage,
    
    ROUND((SELECT COUNT(*) FROM campaigns WHERE dm_user_id IN (SELECT id FROM users)) * 100.0 / 
          (SELECT COUNT(*) FROM campaigns), 2) as valid_campaign_percentage,
    
    -- Activity health
    (SELECT COUNT(DISTINCT user_id) FROM usage_analytics 
     WHERE timestamp >= DATE('now', '-7 days')) as active_users_7d,
     
    (SELECT COUNT(DISTINCT campaign_id) FROM campaign_sessions 
     WHERE date >= DATE('now', '-7 days')) as active_campaigns_7d,
     
    -- Growth metrics
    ROUND((SELECT COUNT(*) FROM users WHERE created_at >= DATE('now', '-30 days')) * 100.0 / 
          NULLIF((SELECT COUNT(*) FROM users WHERE created_at >= DATE('now', '-60 days') 
                 AND created_at < DATE('now', '-30 days')), 0), 2) as user_growth_rate_30d,
          
    -- Average response time simulation (would be real metrics in production)
    ROUND(RANDOM() % 100 + 50, 2) as avg_response_time_ms,
    ROUND(99.5 + (RANDOM() % 50) / 100.0, 2) as uptime_percentage;