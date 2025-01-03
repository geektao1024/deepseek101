'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  UserCog,      // Admin 按钮图标
  Users,        // Client 按钮图标
  LogIn,        // 登录按钮图标
  X,           // 取消按钮图标
  Key,         // 密码输入框图标
  AlertCircle,  // 错误提示图标
  Search
} from 'lucide-react'
import { SearchDialog } from '@/components/SearchDialog'

export function Navigation({ articles }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const [showSearchDialog, setShowSearchDialog] = useState(false)

  // 检查当前是否在管理界面
  const isAdminPage = pathname.startsWith('/admin')

  // 检查具体的管理页面路径
  const isAdminDashboard = pathname === '/admin'
  const isArticlesManagement = pathname.startsWith('/admin/articles')
  const isImagesManagement = pathname.startsWith('/admin/images')

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
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* 左侧 Logo 和导航链接区域 */}
        <div className="flex gap-6 md:gap-10">
          {/* Logo 部分 */}
          {isAdminPage ? (
            <Link 
              href="/admin" 
              className={cn(
                "flex items-center space-x-2 transition-colors",
                isAdminDashboard ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
              )}
            >
              <img 
                src="/favicon-16x16.png"
                alt="LemoBook Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="hidden md:inline">Admin Dashboard</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/favicon-16x16.png"
                alt="LemoBook Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="hidden md:inline font-bold">LemoBook</span>
            </Link>
          )}

          {/* 导航链接 - 在移动端和桌面端都显示 */}
          <nav className="flex gap-4 md:gap-6 overflow-x-auto">
            {isAdminPage ? (
              <>
                <Link 
                  href="/admin/articles" 
                  className={cn(
                    "flex items-center transition-colors whitespace-nowrap",
                    isArticlesManagement ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Manage Articles
                </Link>
                <Link 
                  href="/admin/images" 
                  className={cn(
                    "flex items-center transition-colors whitespace-nowrap",
                    isImagesManagement ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Manage Images
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/" 
                  className={cn(
                    "flex items-center transition-colors whitespace-nowrap",
                    pathname === "/" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Home
                </Link>
                <Link 
                  href="/resources" 
                  className={cn(
                    "flex items-center transition-colors whitespace-nowrap",
                    pathname === "/resources" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Resources
                </Link>
                <Link 
                  href="/posts" 
                  className={cn(
                    "flex items-center transition-colors whitespace-nowrap",
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
        <div className="ml-auto flex items-center gap-2">
          {/* 搜索按钮 - 在非管理页面显示 */}
          {!isAdminPage && (
            <button
              onClick={() => setShowSearchDialog(true)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title=""
            >
              <Search className="h-4 w-4" />
            </button>
          )}
          
          {/* Admin/Client 按钮 - 在移动端隐藏 */}
          {isAdminPage ? (
            <Button 
              onClick={handleBackToClient} 
              variant="outline"
              className="hidden md:flex"
              icon={<Users className="h-4 w-4" />}
            >
              {/* Client */}
            </Button>
          ) : (
            <Button 
              onClick={() => setShowLoginDialog(true)} 
              variant="outline"
              className="hidden md:flex"
              icon={<UserCog className="h-4 w-4" />}
            >
              {/* Admin */}
            </Button>
          )}
        </div>
      </div>

      {/* 登录对话框 - 修改遮罩层和对话框的样式 */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          {/* 点击遮罩层关闭对话框 */}
          <div 
            className="absolute inset-0" 
            onClick={() => {
              setShowLoginDialog(false)
              setError('')
              setPassword('')
            }}
          />
          {/* 对话框内容 */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">  {/* 添加 relative 确保内容在遮罩层之上 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Enter Admin Password
              </h2>
              <button 
                onClick={() => {
                  setShowLoginDialog(false)
                  setError('')
                  setPassword('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 pl-8 border rounded"
                  autoFocus
                />
                <Key className="h-4 w-4 text-gray-400 absolute left-2 top-3" />
              </div>
              {error && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowLoginDialog(false)
                    setError('')
                    setPassword('')
                  }}
                  icon={<X className="h-4 w-4" />}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSearchDialog && (
        <SearchDialog
          articles={articles}
          onClose={() => setShowSearchDialog(false)}
        />
      )}
    </div>
  )
}
