import { Outlet, Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Characters', href: '/characters', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-magic-50/10 to-dnd-50/10">
      <nav className="bg-gradient-to-r from-white via-white to-magic-50/30 shadow-lg border-b-2 border-magic-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-dnd font-bold text-transparent bg-clip-text bg-gradient-to-r from-dnd-700 to-magic-700">
                  D&D Character Manager
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'border-dnd-600 text-dnd-700 font-semibold'
                          : 'border-transparent text-gray-600 hover:border-magic-300 hover:text-magic-700'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}