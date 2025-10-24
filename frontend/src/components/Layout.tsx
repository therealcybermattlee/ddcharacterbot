import { Outlet, Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ChartBarIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from './auth/LoginModal'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Characters', href: '/characters', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Layout() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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

            {/* Auth Section */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserCircleIcon className="h-5 w-5 text-magic-600" />
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-dnd-700 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-dnd-600 to-magic-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-dnd-700 hover:to-magic-700 transition-all duration-200"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Log In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // Optional: Add success notification
        }}
        title="Welcome Back, Adventurer"
        description="Log in to access your characters and continue your journey"
      />
    </div>
  )
}