import { ButtonHTMLAttributes, ReactNode } from "react";
// ButtonHTMLAttributes 继承原生属性 包含了 onClick, type, className 等所有标准属性
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // 限制样式
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    loading?: boolean
    // 显式声明 children
    children: ReactNode
}

export const Button = ({
    // 默认值
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    children,
    className = '',
    // 教学点 2: 剩余参数 (Rest Props)
    // 把所有没解构出来的属性（比如 onClick, id, type）都收集到 props 对象里
    ...props
}: ButtonProps) => {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
    }

    const sizeClasses = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    }

    return (
        <button
            // 动态类名拼接
            // 基础类 'btn' + 变体类 + 尺寸类 + 外部传入的 className
            className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            // 当 loading 为 true 时，按钮也应该处于 disabled 状态
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {children}
        </button>
    )
}