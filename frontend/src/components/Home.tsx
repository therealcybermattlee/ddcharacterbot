import { Link } from 'react-router-dom'
import { PlusIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Fantasy Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dnd-700 via-dnd-600 to-magic-700 px-6 py-20 sm:px-12 sm:py-32 shadow-2xl mb-16">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        {/* Floating Sparkles */}
        <div className="absolute top-10 right-10 text-amber-300 opacity-60 animate-pulse">
          <SparklesIcon className="h-8 w-8" />
        </div>
        <div className="absolute bottom-20 left-20 text-amber-200 opacity-40 animate-pulse delay-75">
          <SparklesIcon className="h-6 w-6" />
        </div>
        <div className="absolute top-1/3 left-1/4 text-purple-300 opacity-50 animate-pulse delay-150">
          <SparklesIcon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="relative text-center">
          <h1 className="font-dnd text-5xl font-bold tracking-tight text-white sm:text-7xl drop-shadow-2xl">
            D&D Character Manager
          </h1>
          <p className="mt-6 text-xl leading-8 text-amber-100 max-w-3xl mx-auto font-medium">
            Forge legendary heroes, chronicle epic adventures, and unlock the secrets of your characters with powerful insights and analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/characters/new"
              className="rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-dnd-700 shadow-xl hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
              Begin Your Quest
            </Link>
            <Link
              to="/characters"
              className="rounded-lg bg-dnd-800/50 backdrop-blur-sm px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-dnd-800/70 border border-white/20 transition-all duration-200 hover:scale-105"
            >
              View Party
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <Link
          to="/characters"
          className="group relative rounded-2xl border-2 border-magic-200 bg-gradient-to-br from-white via-magic-50/30 to-purple-50/30 px-8 py-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-magic-400 overflow-hidden"
        >
          {/* Card Accent Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-magic-400/0 via-magic-400/5 to-magic-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <span className="rounded-xl inline-flex p-4 bg-gradient-to-br from-magic-100 to-magic-200 group-hover:from-magic-200 group-hover:to-magic-300 shadow-md transition-all duration-300">
              <UserGroupIcon className="h-8 w-8 text-magic-700" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8 relative">
            <h3 className="text-2xl font-dnd font-semibold text-gray-900">
              View Characters
            </h3>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Browse and manage your existing D&D characters
            </p>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-magic-100 opacity-20 rounded-bl-full"></div>
        </Link>

        <Link
          to="/characters/new"
          className="group relative rounded-2xl border-2 border-dnd-200 bg-gradient-to-br from-white via-dnd-50/30 to-amber-50/30 px-8 py-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-dnd-400 overflow-hidden"
        >
          {/* Card Accent Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-dnd-400/0 via-dnd-400/5 to-dnd-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <span className="rounded-xl inline-flex p-4 bg-gradient-to-br from-dnd-100 to-dnd-200 group-hover:from-dnd-200 group-hover:to-dnd-300 shadow-md transition-all duration-300">
              <PlusIcon className="h-8 w-8 text-dnd-700" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8 relative">
            <h3 className="text-2xl font-dnd font-semibold text-gray-900">
              Create Character
            </h3>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Build a new D&D character from scratch
            </p>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-dnd-100 opacity-20 rounded-bl-full"></div>
        </Link>

        <Link
          to="/analytics"
          className="group relative rounded-2xl border-2 border-spell-200 bg-gradient-to-br from-white via-spell-50/30 to-blue-50/30 px-8 py-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-spell-400 overflow-hidden"
        >
          {/* Card Accent Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-spell-400/0 via-spell-400/5 to-spell-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <span className="rounded-xl inline-flex p-4 bg-gradient-to-br from-spell-100 to-spell-200 group-hover:from-spell-200 group-hover:to-spell-300 shadow-md transition-all duration-300">
              <ChartBarIcon className="h-8 w-8 text-spell-700" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8 relative">
            <h3 className="text-2xl font-dnd font-semibold text-gray-900">
              Analytics
            </h3>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              View insights and trends about your characters
            </p>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-spell-100 opacity-20 rounded-bl-full"></div>
        </Link>
      </div>
    </div>
  )
}