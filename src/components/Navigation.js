'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  // 检查当前是否在管理界面
  const isAdminPage = pathname.startsWith('/admin')

  // 检查具体的管理页面路径
  const isAdminDashboard = pathname === '/admin'
  const isArticlesManagement = pathname.startsWith('/admin/articles')

  // 处理密码提交
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setShowLoginDialog(false)
        setPassword('')
        router.push('/admin')
      } else {
        setError('Invalid password')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    }
  }

  // 处理回到客户端界面
  const handleBackToClient = () => {
    router.push('/')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          {/* 根据当前页面显示不同的主标题/链接 */}
          {isAdminPage ? (
            <Link 
              href="/admin" 
              className={cn(
                "flex items-center space-x-2 transition-colors",
                isAdminDashboard ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
              )}
            >
              <span>Admin Dashboard</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">GitBase</span>
            </Link>
          )}

          {/* 导航链接 */}
          <nav className="flex gap-6">
            {isAdminPage ? (
              <Link 
                href="/admin/articles" 
                className={cn(
                  "flex items-center transition-colors",
                  isArticlesManagement ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                )}
              >
                Manage Articles
              </Link>
            ) : (
              <>
                <Link 
                  href="/" 
                  className={cn(
                    "flex items-center transition-colors",
                    pathname === "/" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Home
                </Link>
                <Link 
                  href="/resources" 
                  className={cn(
                    "flex items-center transition-colors",
                    pathname === "/resources" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Resources
                </Link>
                <Link 
                  href="/posts" 
                  className={cn(
                    "flex items-center transition-colors",
                    pathname === "/posts" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Articles
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* 右侧按钮区域 */}
        <div className="ml-auto">
          {isAdminPage ? (
            <Button onClick={handleBackToClient} variant="outline">
              Client
            </Button>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)} variant="outline">
              Admin
            </Button>
          )}
        </div>
      </div>

      {/* 登录对话框 */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Admin Password</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 border rounded"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowLoginDialog(false)
                    setError('')
                    setPassword('')
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}