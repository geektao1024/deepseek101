// components/Footer.js
import Link from 'next/link';

// Footer 组件: 网站的页脚部分
// 包含三个主要区块:关于信息、快速链接和社交连接
// 采用响应式布局,在移动端为单列,桌面端为三列
export function Footer() {
  return (
    // 页脚容器,使用浅灰色背景和上边框
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* 内容容器,限制最大宽度并添加内边距 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 三列网格布局容器 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 关于信息区块 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-base text-gray-500">
              LemoBook is an open-source dynamic website solution without a traditional database, built with Next.js and powered by GitHub.
            </p>
          </div>
          
          {/* 快速链接区块 - 使用 Next.js Link 组件实现内部导航 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-base text-gray-500 hover:text-gray-900">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-base text-gray-500 hover:text-gray-900">
                  Articles
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 社交连接区块 - 使用外部链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://lemobook.vercel.app/" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  LemoBook
                </a>
              </li>
              <li>
                <a href="https://blog.csdn.net/qq_36631379" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  CSDN
                </a>
              </li>
              <li>
                <a href="https://okjk.co/7obtxk" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  即刻
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 版权信息区块 */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} LemoBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}