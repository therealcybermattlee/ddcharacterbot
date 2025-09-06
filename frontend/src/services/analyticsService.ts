import { api } from './api'

export interface AnalyticsData {
  totalCharacters: number
  popularRaces: Array<{ race: string; count: number }>
  popularClasses: Array<{ class: string; count: number }>
  levelDistribution: Array<{ level: number; count: number }>
  alignmentDistribution: Array<{ alignment: string; count: number }>
}

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await api.get('/analytics')
    return response.data
  },
}