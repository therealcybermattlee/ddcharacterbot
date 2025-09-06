import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { analyticsService } from '../../services/analyticsService'

interface AnalyticsState {
  data: {
    totalCharacters: number
    popularRaces: Array<{ race: string; count: number }>
    popularClasses: Array<{ class: string; count: number }>
    levelDistribution: Array<{ level: number; count: number }>
    alignmentDistribution: Array<{ alignment: string; count: number }>
  } | null
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async () => {
    return await analyticsService.getAnalytics()
  }
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch analytics'
      })
  },
})

export const { clearError } = analyticsSlice.actions
export default analyticsSlice.reducer