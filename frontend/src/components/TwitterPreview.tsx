import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from "lucide-react"
import { forwardRef } from "react"

interface TwitterPreviewProps {
  text: string
  imageUrl?: string | null
  userName?: string
  userHandle?: string
  avatarUrl?: string
}

export default forwardRef<HTMLDivElement, TwitterPreviewProps>(function TwitterPreview({
  text,
  imageUrl,
  userName = "クラブ公式アカウント",
  userHandle = "@club_official",
  avatarUrl = "/hisho_usako.png"
}, ref) {

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card 
      ref={ref} 
      data-screenshot-target="true"
      className="max-w-xl mx-auto p-4 bg-white border border-gray-300 rounded-xl shadow-sm"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        color: '#000000'
      }}
    >
      {/* Tweet Header */}
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm truncate" style={{ color: '#0f172a' }}>
              {userName}
            </h3>
            <span className="text-sm" style={{ color: '#64748b' }}>
              {userHandle}
            </span>
            <span className="text-sm" style={{ color: '#64748b' }}>
              · {getCurrentTime()}
            </span>
          </div>
        </div>
        <button className="p-1 rounded-full transition-colors" style={{ color: '#64748b' }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Tweet Content */}
      <div className="mb-3">
        {text && (
          <div className="text-sm leading-relaxed whitespace-pre-wrap mb-3" style={{ color: '#0f172a' }}>
            {text}
          </div>
        )}

        {imageUrl && (
          <div className="rounded-xl overflow-hidden border max-w-xs mx-auto" style={{ borderColor: '#d1d5db' }}>
            <img
              src={imageUrl}
              alt="投稿画像"
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Tweet Metadata */}
      <div className="text-sm mb-4 pb-4 border-b" style={{ color: '#64748b', borderBottomColor: '#d1d5db' }}>
        {getCurrentDate()} · クラブ管理システム
      </div>

      {/* Tweet Stats */}
      <div className="flex space-x-6 mb-4 pb-4 border-b" style={{ borderBottomColor: '#d1d5db' }}>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>12</span>
          <span className="text-sm" style={{ color: '#64748b' }}>リツイート</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>28</span>
          <span className="text-sm" style={{ color: '#64748b' }}>いいね</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>3</span>
          <span className="text-sm" style={{ color: '#64748b' }}>ブックマーク</span>
        </div>
      </div>

      {/* Tweet Actions */}
      <div className="flex justify-around max-w-md">
        <button className="flex items-center justify-center p-2 rounded-full transition-colors" style={{ color: '#64748b' }}>
          <MessageCircle size={18} />
        </button>
        <button className="flex items-center justify-center p-2 rounded-full transition-colors" style={{ color: '#64748b' }}>
          <Repeat2 size={18} />
        </button>
        <button className="flex items-center justify-center p-2 rounded-full transition-colors" style={{ color: '#64748b' }}>
          <Heart size={18} />
        </button>
        <button className="flex items-center justify-center p-2 rounded-full transition-colors" style={{ color: '#64748b' }}>
          <Share size={18} />
        </button>
      </div>
    </Card>
  )
})