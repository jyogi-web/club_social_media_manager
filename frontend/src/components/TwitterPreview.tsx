import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface TwitterPreviewProps {
  text: string
  imageUrl?: string | null
  userName?: string
  userHandle?: string
  avatarUrl?: string
}

export default function TwitterPreview({
  text,
  imageUrl,
  userName = "クラブ公式アカウント",
  userHandle = "@club_official",
  avatarUrl = "/hisho_usako.png"
}: TwitterPreviewProps) {

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
    <Card className="max-w-xl mx-auto p-4 bg-white border border-border/40 rounded-xl shadow-sm">
      {/* Tweet Header */}
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {userName}
            </h3>
            <span className="text-muted-foreground text-sm">
              {userHandle}
            </span>
            <span className="text-muted-foreground text-sm">
              · {getCurrentTime()}
            </span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Tweet Content */}
      <div className="mb-3">
        {text && (
          <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-3">
            {text}
          </div>
        )}

        {imageUrl && (
          <div className="rounded-xl overflow-hidden border border-border/40">
            <img
              src={imageUrl}
              alt="投稿画像"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Tweet Metadata */}
      <div className="text-muted-foreground text-sm mb-4 pb-4 border-b border-border/40">
        {getCurrentDate()} · クラブ管理システム
      </div>

      {/* Tweet Stats */}
      <div className="flex space-x-6 mb-4 pb-4 border-b border-border/40">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm text-foreground">12</span>
          <span className="text-muted-foreground text-sm">リツイート</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm text-foreground">28</span>
          <span className="text-muted-foreground text-sm">いいね</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm text-foreground">3</span>
          <span className="text-muted-foreground text-sm">ブックマーク</span>
        </div>
      </div>

      {/* Tweet Actions */}
      <div className="flex justify-around max-w-md">
        <button className={cn(
          "flex items-center justify-center p-2 rounded-full transition-colors",
          "text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
        )}>
          <MessageCircle size={18} />
        </button>
        <button className={cn(
          "flex items-center justify-center p-2 rounded-full transition-colors",
          "text-muted-foreground hover:text-green-500 hover:bg-green-50"
        )}>
          <Repeat2 size={18} />
        </button>
        <button className={cn(
          "flex items-center justify-center p-2 rounded-full transition-colors",
          "text-muted-foreground hover:text-red-500 hover:bg-red-50"
        )}>
          <Heart size={18} />
        </button>
        <button className={cn(
          "flex items-center justify-center p-2 rounded-full transition-colors",
          "text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
        )}>
          <Share size={18} />
        </button>
      </div>
    </Card>
  )
}