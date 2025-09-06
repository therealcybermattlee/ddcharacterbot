import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../stores/store'
import { fetchAnalytics } from '../../features/analytics/analyticsSlice'

export default function AnalyticsDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.analytics)

  useEffect(() => {
    dispatch(fetchAnalytics())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data available</h3>
        <p className="mt-1 text-sm text-gray-500">Create some characters to see analytics.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Character Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Insights about your D&D characters and popular trends.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Characters</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.totalCharacters}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {data.popularRaces.length > 0 && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Most Popular Race</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.popularRaces[0].race}
                    <span className="text-sm text-gray-500 ml-2">
                      ({data.popularRaces[0].count})
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}

        {data.popularClasses.length > 0 && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Most Popular Class</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.popularClasses[0].class}
                    <span className="text-sm text-gray-500 ml-2">
                      ({data.popularClasses[0].count})
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}

        {data.levelDistribution.length > 0 && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Level</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(
                      data.levelDistribution.reduce((sum, item) => sum + item.level * item.count, 0) /
                      data.levelDistribution.reduce((sum, item) => sum + item.count, 0)
                    ).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {data.popularRaces.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Popular Races</h3>
            <div className="space-y-3">
              {data.popularRaces.slice(0, 5).map((race) => (
                <div key={race.race} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{race.race}</span>
                  <span className="text-sm text-gray-500">{race.count} characters</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.popularClasses.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Popular Classes</h3>
            <div className="space-y-3">
              {data.popularClasses.slice(0, 5).map((charClass) => (
                <div key={charClass.class} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{charClass.class}</span>
                  <span className="text-sm text-gray-500">{charClass.count} characters</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.alignmentDistribution.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Alignment Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.alignmentDistribution.map((alignment) => (
              <div key={alignment.alignment} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{alignment.count}</div>
                <div className="text-sm text-gray-500">{alignment.alignment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}