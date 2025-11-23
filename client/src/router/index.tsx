import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Home } from '@/pages/Home'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children:[
            {
                index: true, // 默认子路由 (即访问 / 时)
                element: <Home />,
            },
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
]);