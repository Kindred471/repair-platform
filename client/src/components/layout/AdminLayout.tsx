import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { setNavigateToLogin } from '@/utils/api'
import { 
  FaHome, 
  FaListAlt, 
  FaStar, 
  FaUser, 
  FaMoon, 
  FaSun,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa'

interface MenuItem {
  label: string
  path: string
  icon: React.ReactNode
}

export const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // 初始化暗色模式
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setDarkMode(isDark)
    updateTheme(isDark)
  }, [])

  // 设置导航函数，供 api.ts 使用
  useEffect(() => {
    setNavigateToLogin(() => {
      navigate('/login', { replace: true })
    })
  }, [navigate])

  // 更新主题
  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  // 切换暗色模式
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    updateTheme(newDarkMode)
  }

  // 登出处理
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // 管理员菜单项
  const adminMenuItems: MenuItem[] = [
    { label: '仪表盘', path: '/admin/dashboard', icon: <FaHome /> },
    { label: '所有工单', path: '/admin/orders', icon: <FaListAlt /> },
    { label: '本周关注', path: '/admin/weekly-focus', icon: <FaStar /> },
  ]

  // 获取当前路径对应的面包屑
  const getBreadcrumbs = () => {
    const pathMap: Record<string, string> = {
      '/admin/dashboard': '仪表盘',
      '/admin/orders': '所有工单',
      '/admin/weekly-focus': '本周关注',
    }
    return pathMap[location.pathname] || '首页'
  }

  // 检查当前路径是否激活
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* 顶部导航栏 */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          {/* 移动端菜单按钮 */}
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {/* Logo */}
          <Link to="/admin/dashboard" className="btn btn-ghost text-xl normal-case">
            <span className="text-primary font-bold">小区维修平台</span>
            <span className="badge badge-primary badge-sm ml-2">管理端</span>
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          {/* 面包屑导航 */}
          <div className="hidden md:flex items-center text-sm breadcrumbs">
            <ul>
              <li><Link to="/admin/dashboard">管理端</Link></li>
              <li className="text-base-content/70">{getBreadcrumbs()}</li>
            </ul>
          </div>

          {/* 用户信息 */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost gap-2"
            >
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold">{user?.username}</span>
                <span className="text-xs text-base-content/60">管理员</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300"
            >
              <li>
                <button className="gap-2">
                  <FaUser />
                  个人设置
                </button>
              </li>
              <li>
                <button onClick={toggleDarkMode} className="gap-2">
                  {darkMode ? <FaSun /> : <FaMoon />}
                  {darkMode ? '浅色模式' : '暗色模式'}
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error gap-2">
                  <FaSignOutAlt />
                  退出登录
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={`fixed lg:fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* 侧边栏头部 */}
            <div className="p-4 border-b border-base-300 flex-shrink-0">
              <h2 className="text-lg font-bold text-primary">管理菜单</h2>
            </div>

            {/* 菜单列表 - 可滚动区域 */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="menu menu-vertical gap-2">
                {adminMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-content'
                          : 'hover:bg-base-200'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 侧边栏底部 - 固定在底部 */}
            <div className="p-4 border-t border-base-300 space-y-3 flex-shrink-0">
              {/* 主题切换按钮 */}
              <button
                onClick={toggleDarkMode}
                className="btn btn-ghost btn-block justify-start gap-2"
                title={darkMode ? '切换到浅色模式' : '切换到暗色模式'}
              >
                {darkMode ? <FaMoon /> : <FaSun />}
                <span>{darkMode ? '暗色模式' : '浅色模式'}</span>
              </button>
              
              <div className="text-xs text-base-content/60">
                <p>版本 v1.0.0</p>
                <p>© 2025 LUOHAO</p>
              </div>
            </div>
          </div>
        </aside>

        {/* 遮罩层（移动端） */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 主内容区 - 添加左边距避免被侧边栏遮挡 */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

