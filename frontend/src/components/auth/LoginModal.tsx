import React, { useState } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  description?: string
}

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Save Your Character",
  description = "Create an account or log in to save your character"
}: LoginModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'player' as 'player' | 'dm'
  })

  const { login, register, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    let success = false
    if (isLoginMode) {
      success = await login(formData.email, formData.password)
    } else {
      success = await register(formData.email, formData.username, formData.password, formData.role)
    }

    if (success) {
      onSuccess()
      onClose()
      setFormData({ email: '', username: '', password: '', role: 'player' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    clearError()
    setFormData({ email: '', username: '', password: '', role: 'player' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Username Field (Register only) */}
            {!isLoginMode && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
                minLength={8}
              />
              {!isLoginMode && (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p>Password must contain:</p>
                  <ul className="ml-4 list-disc">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Role Field (Register only) */}
            {!isLoginMode && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="player">Player</option>
                  <option value="dm">Dungeon Master</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLoginMode ? 'Logging in...' : 'Creating account...'}
                </div>
              ) : (
                isLoginMode ? 'Log In' : 'Create Account'
              )}
            </Button>

            {/* Mode Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
              >
                {isLoginMode
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"
                }
              </button>
            </div>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}