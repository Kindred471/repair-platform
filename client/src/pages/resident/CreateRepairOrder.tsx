import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRepairOrder } from '@/services/residentService'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { getFriendlyErrorMessage } from '@/utils/errorMessages'

export const CreateRepairOrder = () => {
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!title.trim() || !address.trim() || !description.trim()) {
      setError('请完整填写所有必填字段')
      return
    }

    setIsLoading(true)
    try {
      await createRepairOrder({ title, address, description })
      setSuccess('报修提交成功！即将返回列表...')
      setTimeout(() => {
        navigate('/resident/orders')
      }, 1500)
    } catch (err) {
      setError(getFriendlyErrorMessage(err, '报修提交失败，请重试'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
          提交新报修
        </h1>
        <p className="text-base-content/60 mt-2">请详细描述您遇到的问题，以便我们更好地派单处理</p>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{success}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="问题摘要"
              placeholder="例如：客厅空调漏水、门锁损坏 (不超过50字)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={50}
            />

            <Input 
              label="发生地址"
              placeholder="例如：南区3栋5单元602"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">详细描述 <span className="text-error">*</span></span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-32 text-base shadow-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                placeholder="请尽可能详细描述发生的状况、时间以及任何补充信息..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* 当需要图片上传时，可以取消此区域的注释并接入服务 */}
            {/* <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">上传图片 (选填)</span>
              </label>
              <input type="file" className="file-input file-input-bordered w-full" />
              <label className="label">
                <span className="label-text-alt text-base-content/50">支持 JPG, PNG 格式，建议不超过 5MB</span>
              </label>
            </div> */}

            <div className="card-actions justify-end mt-8">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isLoading}>
                取消
              </Button>
              <Button type="submit" variant="primary" loading={isLoading}>
                发送报修
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
