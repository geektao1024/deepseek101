import './globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'

// 配置 Inter 字体
// subsets 指定只加载拉丁字符集,优化加载性能
const inter = Inter({ subsets: ['latin'] })

// 配置全局默认元数据
// 用于SEO优化,当页面未指定特定元数据时使用这些默认值
export const metadata: Metadata = {
  title: {
    default: 'LemoBook', // 默认标题
    template: '%s | LemoBook' // 标题模板,用于子页面标题
  },
  description: 'Open source dynamic website without database, built with Next.js and GitHub API',
}

// 定义根布局组件的属性接口
interface RootLayoutProps {
  children: React.ReactNode
}

// 根布局组件
// 为所有页面提供统一的布局结构
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Layout 组件包装所有页面内容,提供统一的页面结构 */}
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}