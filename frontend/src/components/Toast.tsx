import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300) // アニメーション時間
  }, [onClose])

  useEffect(() => {
    // マウント時にアニメーション開始
    setIsVisible(true)

    // 指定時間後に自動で閉じる
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4',
        'transition-all duration-300 ease-in-out',
        isLeaving
          ? 'translate-y-[-100px] opacity-0'
          : 'translate-y-0 opacity-100'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg border shadow-lg',
          getStyles()
        )}
      >
        {getIcon()}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}