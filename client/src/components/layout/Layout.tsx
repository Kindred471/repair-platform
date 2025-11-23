import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext' // 引入 useAuth

export const Layout = () => {
  const { user, logout } = useAuth() // 获取当前用户和登出方法
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl normal-case">
            小区维修平台
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2">
            {user ? (
              // 如果已登录，显示用户名和登出按钮
              <>
                <div className="flex px-4">
                  欢迎, <span className="font-bold text-primary">{user.username}</span>
                  <span className="badge badge-sm ml-2">
                    {user.role === 'Admin' ? '管理员' : '业主'}
                  </span>
                </div>
                <li>
                  <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                    登出
                  </button>
                </li>
              </>
            ) : (
              // 如果未登录，显示登录链接
              <li><Link to="/login" className="btn btn-primary btn-sm text-white">登录</Link></li>
            )}
          </ul>
        </div>
      </header>
      
      {/* ... main 和 footer 部分保持不变 ... */}
      <main className="flex-1 container mx-auto p-4">
          <Outlet />
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <aside>
              <p>Copyright © 2025 - All right reserved by LUOHAO</p>
          </aside>
      </footer>
    </div>
  )
}