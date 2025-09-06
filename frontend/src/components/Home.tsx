import { Link } from 'react-router-dom'
import { PlusIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Welcome to D&D Character Manager
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Create, manage, and track your D&D characters with advanced analytics and insights.
      </p>
      
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link
          to="/characters"
          className="group relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-indigo-50 group-hover:bg-indigo-100">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              View Characters
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Browse and manage your existing D&D characters
            </p>
          </div>
        </Link>

        <Link
          to="/characters/new"
          className="group relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-50 group-hover:bg-green-100">
              <PlusIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              Create Character
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Build a new D&D character from scratch
            </p>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="group relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-purple-50 group-hover:bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              Analytics
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              View insights and trends about your characters
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}