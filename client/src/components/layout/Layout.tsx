import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setNavigateToLogin } from '@/utils/api'

/**
 * 通用布局组件
 * 用于登录、注册等公开页面
 */
export const Layout = () => {
  const navigate = useNavigate()

  // 设置导航函数，供 api.ts 使用
  useEffect(() => {
    setNavigateToLogin(() => {
      navigate('/login', { replace: true })
    })
  }, [navigate])

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl normal-case">
            <span className="text-primary font-bold">小区维修平台</span>
          </Link>
        </div>
        <div className="flex-none">
          <Link to="/login" className="btn btn-primary btn-sm text-white">
            登录
          </Link>
        </div>
      </header>
      
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