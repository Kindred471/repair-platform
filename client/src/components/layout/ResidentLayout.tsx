import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { setNavigateToLogin } from '@/utils/api'
import { FaHome, FaPlus, FaList, FaUser, FaSignOutAlt } from 'react-icons/fa'

export const ResidentLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // 设置导航函数，供 api.ts 使用
  useEffect(() => {
    setNavigateToLogin(() => {
      navigate('/login', { replace: true })
    })
  }, [navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // 业主菜单项
  const residentMenuItems = [
    { label: '我的工单', path: '/resident/orders', icon: <FaList /> },
    { label: '提交报修', path: '/resident/create', icon: <FaPlus /> },
  ]

  return (
    <div className="min-h-screen bg-base-200">
      {/* 顶部导航栏 */}
      <div className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          <Link to="/resident/orders" className="btn btn-ghost text-xl normal-case">
            <span className="text-primary font-bold">小区维修平台</span>
            <span className="badge badge-secondary badge-sm ml-2">业主端</span>
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          {/* 导航菜单 */}
          <ul className="menu menu-horizontal gap-1">
            {residentMenuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="gap-2">
                  <span>{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* 用户信息 */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost gap-2"
            >
              <div className="avatar placeholder">
                <div className="bg-secondary text-secondary-content rounded-full w-8">
                  <span className="text-xs">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              </div>
              <span className="hidden md:inline">{user?.username}</span>
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
                <button onClick={handleLogout} className="text-error gap-2">
                  <FaSignOutAlt />
                  退出登录
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="container mx-auto p-4 lg:p-6">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
        <aside>
          <p>Copyright © 2025 - All right reserved by LUOHAO</p>
        </aside>
      </footer>
    </div>
  )
}

