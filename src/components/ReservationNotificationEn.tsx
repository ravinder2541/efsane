import { useEffect, useState } from 'react'
import { CheckCircle, X, Mail, Clock } from 'lucide-react'

interface NotificationProps {
  show: boolean
  onClose: () => void
  type: 'success' | 'error'
  title: string
  message: string
  emailSentText: string
  responseTimeText: string
  understoodText: string
  tryAgainText?: string
  duration?: number
}

export default function ReservationNotificationEn({ 
  show, 
  onClose, 
  type, 
  title, 
  message,
  emailSentText,
  responseTimeText,
  understoodText,
  tryAgainText,
  duration = 5000 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsLeaving(false)
      
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  if (!show && !isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-50 transition-opacity duration-300 ${
          isLeaving ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Notification */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isLeaving 
            ? 'opacity-0 scale-95 translate-y-2' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md mx-4 overflow-hidden">
          {/* Success Header */}
          {type === 'success' && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
              </div>
            </div>
          )}
          
          {/* Error Header */}
          {type === 'error' && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-full p-2">
                  <X className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
            
            {type === 'success' && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{emailSentText}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{responseTimeText}</span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                type === 'success'
                  ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              {type === 'error' && tryAgainText ? tryAgainText : understoodText}
            </button>
          </div>

          {/* Close X Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  )
}