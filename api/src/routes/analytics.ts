/**
 * D&D Character Manager Analytics API Routes
 * Provides comprehensive analytics endpoints for character optimization,
 * campaign insights, player engagement, and predictive modeling
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

// Types and validation schemas
const QueryParamsSchema = z.object({
  timeframe: z.enum(['7d', '30d', '90d', 'all']).optional().default('30d'),
  campaign_id: z.string().optional(),
  user_id: z.string().optional(),
  class: z.string().optional(),
  race: z.string().optional(),
  level_min: z.string().transform(Number).optional(),
  level_max: z.string().transform(Number).optional(),
  limit: z.string().optional().default('100').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
});

const BuildRecommendationSchema = z.object({
  user_id: z.string(),
  preferred_role: z.enum(['tank', 'dps', 'support', 'utility']).optional(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  exclude_played: z.boolean().optional().default(true),
});

type Env = {
  DB: D1Database;
  ANALYTICS_DB?: D1Database; // Optional separate analytics database
};

const analytics = new Hono<{ Bindings: Env }>();

// ========================================
// CHARACTER BUILD ANALYTICS
// ========================================

// Get character build performance analysis
analytics.get('/builds/performance', 
  zValidator('query', QueryParamsSchema),
  async (c) => {
    const { timeframe, class: className, race, level_min, level_max, limit, offset } = c.req.valid('query');
    
    let timeFilter = '';
    if (timeframe !== 'all') {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      timeFilter = `AND c.created_at >= DATE('now', '-${days} days')`;
    }

    const classFilter = className ? `AND c.character_class = ?` : '';
    const raceFilter = race ? `AND c.race = ?` : '';
    const levelFilter = level_min || level_max ? 
      `AND c.level BETWEEN ${level_min || 1} AND ${level_max || 20}` : '';

    const query = `
      SELECT * FROM v_character_build_analysis 
      WHERE 1=1 ${timeFilter} ${classFilter} ${raceFilter} ${levelFilter}
      ORDER BY survivability_score DESC, build_count DESC
      LIMIT ? OFFSET ?
    `;

    const params = [className, race].filter(Boolean).concat([String(limit), String(offset)]);

    try {
      const result = await c.env.DB.prepare(query).bind(...params).all();
      return c.json({
        success: true,
        data: result.results,
        meta: {
          count: result.results?.length || 0,
          limit,
          offset,
          timeframe
        }
      });
    } catch (error) {
      console.error('Build performance query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get optimal ability score recommendations
analytics.get('/builds/optimal-stats/:class/:level',
  async (c) => {
    const className = c.req.param('class');
    const level = parseInt(c.req.param('level'));

    const query = `
      SELECT * FROM v_optimal_ability_scores 
      WHERE character_class = ? AND level = ?
    `;

    try {
      const result = await c.env.DB.prepare(query).bind(className, level).first();
      
      if (!result) {
        return c.json({ 
          success: false, 
          error: 'No data available for this class/level combination' 
        }, 404);
      }

      return c.json({
        success: true,
        data: result,
        recommendations: {
          primary_stats: {
            [className.toLowerCase().includes('fighter') || className.toLowerCase().includes('barbarian') ? 'strength' : 
             className.toLowerCase().includes('rogue') || className.toLowerCase().includes('ranger') ? 'dexterity' :
             className.toLowerCase().includes('wizard') ? 'intelligence' :
             className.toLowerCase().includes('cleric') || className.toLowerCase().includes('druid') ? 'wisdom' :
             className.toLowerCase().includes('bard') || className.toLowerCase().includes('sorcerer') || className.toLowerCase().includes('warlock') ? 'charisma' : 'strength']: 'primary'
          }
        }
      });
    } catch (error) {
      console.error('Optimal stats query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get build recommendations for a user
analytics.post('/builds/recommendations',
  zValidator('json', BuildRecommendationSchema),
  async (c) => {
    const { user_id, preferred_role, experience_level, exclude_played } = c.req.valid('json');

    const query = `
      SELECT * FROM v_build_recommendations 
      WHERE user_id = ?
      ORDER BY recommendation_score DESC
      LIMIT 10
    `;

    try {
      const result = await c.env.DB.prepare(query).bind(user_id).all();
      
      return c.json({
        success: true,
        data: result.results,
        preferences: {
          preferred_role,
          experience_level,
          exclude_played
        }
      });
    } catch (error) {
      console.error('Build recommendations query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// CAMPAIGN HEALTH ANALYTICS
// ========================================

// Get campaign health metrics
analytics.get('/campaigns/health',
  zValidator('query', QueryParamsSchema),
  async (c) => {
    const { campaign_id, limit, offset } = c.req.valid('query');
    
    const campaignFilter = campaign_id ? 'WHERE campaign_id = ?' : '';
    const query = `
      SELECT * FROM v_campaign_health_metrics 
      ${campaignFilter}
      ORDER BY health_score DESC
      LIMIT ? OFFSET ?
    `;

    const params = campaign_id ? [campaign_id, limit, offset] : [limit, offset];

    try {
      const result = await c.env.DB.prepare(query).bind(...params).all();
      
      // Add health recommendations
      const enrichedResults = result.results?.map((campaign: any) => ({
        ...campaign,
        recommendations: generateCampaignRecommendations(campaign)
      }));

      return c.json({
        success: true,
        data: enrichedResults,
        meta: {
          count: enrichedResults?.length || 0,
          limit,
          offset
        }
      });
    } catch (error) {
      console.error('Campaign health query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get DM performance analytics
analytics.get('/campaigns/dm-performance/:dm_id',
  async (c) => {
    const dmId = c.req.param('dm_id');
    
    const query = `
      SELECT * FROM v_dm_performance_analytics 
      WHERE dm_id = ?
    `;

    try {
      const result = await c.env.DB.prepare(query).bind(dmId).first();
      
      if (!result) {
        return c.json({ 
          success: false, 
          error: 'DM not found or no performance data available' 
        }, 404);
      }

      return c.json({
        success: true,
        data: result,
        insights: generateDMInsights(result)
      });
    } catch (error) {
      console.error('DM performance query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// PLAYER ENGAGEMENT ANALYTICS
// ========================================

// Get player engagement metrics
analytics.get('/players/engagement',
  zValidator('query', QueryParamsSchema),
  async (c) => {
    const { user_id, limit, offset } = c.req.valid('query');
    
    const userFilter = user_id ? 'WHERE user_id = ?' : '';
    const query = `
      SELECT * FROM v_player_engagement_metrics 
      ${userFilter}
      ORDER BY engagement_score DESC
      LIMIT ? OFFSET ?
    `;

    const params = user_id ? [user_id, limit, offset] : [limit, offset];

    try {
      const result = await c.env.DB.prepare(query).bind(...params).all();
      
      return c.json({
        success: true,
        data: result.results,
        segments: {
          super_active: result.results?.filter((p: any) => p.player_segment === 'Super Active').length || 0,
          active: result.results?.filter((p: any) => p.player_segment === 'Active').length || 0,
          at_risk: result.results?.filter((p: any) => p.player_segment === 'At Risk').length || 0,
          churned: result.results?.filter((p: any) => p.player_segment === 'Churned').length || 0,
        }
      });
    } catch (error) {
      console.error('Player engagement query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get retention cohort analysis
analytics.get('/players/retention-cohorts',
  async (c) => {
    const query = `
      SELECT * FROM v_player_retention_cohorts 
      ORDER BY cohort_month DESC
      LIMIT 12
    `;

    try {
      const result = await c.env.DB.prepare(query).all();
      
      return c.json({
        success: true,
        data: result.results,
        insights: {
          avg_1_month_retention: calculateAverageRetention(result.results, 'retention_month_1'),
          avg_3_month_retention: calculateAverageRetention(result.results, 'retention_month_3'),
          avg_6_month_retention: calculateAverageRetention(result.results, 'retention_month_6'),
        }
      });
    } catch (error) {
      console.error('Retention cohorts query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// GAME BALANCE ANALYTICS
// ========================================

// Get class balance analysis
analytics.get('/balance/classes',
  zValidator('query', QueryParamsSchema),
  async (c) => {
    const { level_min, level_max } = c.req.valid('query');
    
    const levelFilter = level_min || level_max ? 
      `WHERE level BETWEEN ${level_min || 1} AND ${level_max || 20}` : '';
    
    const query = `
      SELECT * FROM v_class_balance_analysis 
      ${levelFilter}
      ORDER BY level, combat_rank
    `;

    try {
      const result = await c.env.DB.prepare(query).all();
      
      return c.json({
        success: true,
        data: result.results,
        summary: {
          total_classes: new Set(result.results?.map((r: any) => r.character_class)).size,
          balanced_classes: result.results?.filter((r: any) => r.balance_assessment === 'Well Balanced').length || 0,
          imbalanced_classes: result.results?.filter((r: any) => r.balance_assessment.includes('Imbalance')).length || 0,
        }
      });
    } catch (error) {
      console.error('Class balance query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get race-class synergy analysis
analytics.get('/balance/race-class-synergy',
  async (c) => {
    const query = `
      SELECT * FROM v_race_class_synergy 
      ORDER BY synergy_index DESC
      LIMIT 50
    `;

    try {
      const result = await c.env.DB.prepare(query).all();
      
      return c.json({
        success: true,
        data: result.results,
        insights: {
          high_synergy_combos: result.results?.filter((s: any) => s.synergy_rating === 'High Synergy').length || 0,
          poor_synergy_combos: result.results?.filter((s: any) => s.synergy_rating.includes('Poor')).length || 0,
        }
      });
    } catch (error) {
      console.error('Race-class synergy query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// DASHBOARD & KPI ENDPOINTS
// ========================================

// Get application KPIs
analytics.get('/kpis/overview',
  async (c) => {
    const query = `
      SELECT * FROM v_application_kpis 
      ORDER BY 
        CASE period 
          WHEN 'Last 7 Days' THEN 1
          WHEN 'Last 30 Days' THEN 2  
          WHEN 'Last 90 Days' THEN 3
        END
    `;

    try {
      const result = await c.env.DB.prepare(query).all();
      
      return c.json({
        success: true,
        data: result.results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('KPIs query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get dashboard data for DM interface
analytics.get('/dashboard/dm/:dm_id',
  async (c) => {
    const dmId = c.req.param('dm_id');
    
    try {
      // Execute multiple queries in parallel
      const [campaignOverview, playerMetrics, sessionActivity, characterDistribution] = await Promise.all([
        c.env.DB.prepare(`
          SELECT * FROM v_dashboard_campaign_overview 
          WHERE EXISTS (SELECT 1 FROM campaigns WHERE dm_user_id = ?)
        `).bind(dmId).first(),
        
        c.env.DB.prepare(`
          SELECT * FROM v_player_engagement_metrics 
          WHERE user_id IN (
            SELECT DISTINCT cm.user_id FROM campaign_members cm 
            JOIN campaigns c ON cm.campaign_id = c.id 
            WHERE c.dm_user_id = ?
          )
          ORDER BY engagement_score DESC
          LIMIT 10
        `).bind(dmId).all(),
        
        c.env.DB.prepare(`
          SELECT * FROM v_dashboard_activity_timeline 
          ORDER BY date DESC 
          LIMIT 30
        `).all(),
        
        c.env.DB.prepare(`
          SELECT * FROM v_dashboard_character_distribution
        `).all()
      ]);

      return c.json({
        success: true,
        data: {
          overview: campaignOverview,
          players: playerMetrics.results,
          activity: sessionActivity.results,
          character_distribution: characterDistribution.results
        },
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('DM dashboard query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// PREDICTIVE ANALYTICS
// ========================================

// Get character progression predictions
analytics.get('/predictions/character-progression/:character_id',
  async (c) => {
    const characterId = c.req.param('character_id');
    
    const query = `
      SELECT * FROM v_ml_character_progression_features 
      WHERE character_id = ?
    `;

    try {
      const result = await c.env.DB.prepare(query).bind(characterId).first();
      
      if (!result) {
        return c.json({ 
          success: false, 
          error: 'Character not found or insufficient progression data' 
        }, 404);
      }

      // Simple progression prediction based on historical data
      const prediction = generateProgressionPrediction(result);

      return c.json({
        success: true,
        data: result,
        predictions: prediction
      });
    } catch (error) {
      console.error('Character progression query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// Get player churn risk assessment
analytics.get('/predictions/churn-risk',
  zValidator('query', QueryParamsSchema),
  async (c) => {
    const { limit, offset } = c.req.valid('query');
    
    const query = `
      SELECT * FROM v_ml_churn_prediction_features 
      ORDER BY retention_risk_score DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const result = await c.env.DB.prepare(query).bind(limit, offset).all();
      
      const enrichedResults = result.results?.map((player: any) => ({
        ...player,
        risk_level: categorizeChurnRisk(player.retention_risk_score),
        recommendations: generateRetentionRecommendations(player)
      }));

      return c.json({
        success: true,
        data: enrichedResults,
        summary: {
          high_risk: enrichedResults?.filter((p: any) => p.risk_level === 'High').length || 0,
          medium_risk: enrichedResults?.filter((p: any) => p.risk_level === 'Medium').length || 0,
          low_risk: enrichedResults?.filter((p: any) => p.risk_level === 'Low').length || 0,
        }
      });
    } catch (error) {
      console.error('Churn risk query error:', error);
      return c.json({ success: false, error: 'Database query failed' }, 500);
    }
  }
);

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateCampaignRecommendations(campaign: any) {
  const recommendations = [];
  
  if (campaign.health_score < 50) {
    recommendations.push({
      type: 'urgent',
      message: 'Campaign health is critical. Consider reaching out to players.',
      action: 'schedule_session'
    });
  }
  
  if (campaign.days_since_last_session > 14) {
    recommendations.push({
      type: 'warning',
      message: 'Long gap since last session. Plan next session soon.',
      action: 'schedule_reminder'
    });
  }
  
  if (campaign.active_players < 3) {
    recommendations.push({
      type: 'info',
      message: 'Consider recruiting more players for better group dynamics.',
      action: 'recruit_players'
    });
  }
  
  return recommendations;
}

function generateDMInsights(dmData: any) {
  const insights = [];
  
  if (dmData.experience_level === 'Veteran') {
    insights.push('You\'re an experienced DM! Consider mentoring newer DMs.');
  }
  
  if (dmData.avg_session_duration > 240) {
    insights.push('Your sessions are longer than average. Great for immersion!');
  }
  
  if (dmData.avg_campaign_health > 75) {
    insights.push('Your campaigns are very healthy. Players are engaged!');
  }
  
  return insights;
}

function calculateAverageRetention(cohorts: any[], field: string) {
  if (!cohorts || cohorts.length === 0) return 0;
  const validCohorts = cohorts.filter(c => c[field] != null);
  return validCohorts.reduce((sum, c) => sum + c[field], 0) / validCohorts.length;
}

function generateProgressionPrediction(character: any) {
  const progressionRate = character.progression_velocity || 0.5;
  const currentLevel = character.current_level;
  
  const predictions = {
    next_level_days: progressionRate > 0 ? Math.round(30 / progressionRate) : null,
    level_20_days: progressionRate > 0 ? Math.round((20 - currentLevel) * 30 / progressionRate) : null,
    confidence: character.progression_events > 5 ? 'high' : character.progression_events > 2 ? 'medium' : 'low'
  };
  
  return predictions;
}

function categorizeChurnRisk(riskScore: number) {
  if (riskScore >= 70) return 'High';
  if (riskScore >= 40) return 'Medium';
  return 'Low';
}

function generateRetentionRecommendations(player: any) {
  const recommendations = [];
  
  if (player.days_since_last_session > 14) {
    recommendations.push('Reach out with personalized session invite');
  }
  
  if (player.sessions_30d === 0) {
    recommendations.push('Offer flexible scheduling options');
  }
  
  if (player.total_characters < 2) {
    recommendations.push('Encourage character creation in different campaigns');
  }
  
  return recommendations;
}

export default analytics;