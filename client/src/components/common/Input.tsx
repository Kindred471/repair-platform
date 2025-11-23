import { InputHTMLAttributes, forwardRef } from "react"
//继承原生 Input 属性
// InputHTMLAttributes 继承原生属性 包含了 onChange, type, className 等所有标准属性
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string // 表单标签文本
    error?: string // 错误提示信息
    containerClassName?: string // 最外层容器的样式（可选）
}

//  forwardRef 的泛型语法
// forwardRef<Ref类型, Props类型>(组件函数)
// - Ref类型: HTMLInputElement (我们转发的是 input 元素)
// - Props类型: InputProps (我们自定义的属性)
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, className = '', containerClassName = '', ...props },
        ref
    ) => {
        return (
            // 组合使用 DaisyUI 的 form-control 布局
            <div className={`form-control w-full ${containerClassName}`}>
                {label && (
                    <label className="label">
                        <span className="label-text">{label}</span>
                    </label>
                )}
                <input
                    ref={ref} // 关键：绑定 ref
                    // 组合样式：基础 input 样式 + 边框样式 + 错误状态 + 外部传入样式
                    className={`input input-bordered w-full ${
                        error ? 'input-error' : ''
                    } ${className}`}
                    {...props}
                />

                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'