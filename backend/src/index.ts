import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://club-social-media-manager.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Discord Webhook URLの型定義
interface Env {
  DISCORD_WEBHOOK_URL?: string
  GEMINI_API_KEY?: string
}

// AI分析用のインターface
interface AIAnalysisRequest {
  text: string
  image?: string // base64またはURL
}

interface AIAnalysisResponse {
  textAnalysis: {
    isAppropriate: boolean
    suggestions: string[]
    score: number
  }
  imageAnalysis?: {
    isAppropriate: boolean
    description: string
    concerns: string[]
  }
}

// Discord プレビュー送信用のinterface
interface DiscordPreviewRequest {
  text: string
  imageUrl?: string
  clubId: string
}

// ホームエンドポイント
app.get('/', (c) => {
  return c.json({ message: 'Club Social Media Manager API' })
})

// AI分析エンドポイント
app.post('/ai/analyze', async (c) => {
  try {
    const { text, image }: AIAnalysisRequest = await c.req.json()

    // 簡単なテキスト分析（実際のAI APIを使用する場合はここを置き換え）
    const textAnalysis = {
      isAppropriate: !text.toLowerCase().includes('不適切') && text.length <= 280,
      suggestions: text.length > 280 ? ['文字数を280文字以内に収めてください'] : [],
      score: Math.min(10, Math.max(1, 10 - Math.floor(text.length / 28)))
    }

    let imageAnalysis = undefined
    if (image) {
      imageAnalysis = {
        isAppropriate: true,
        description: '画像が含まれています',
        concerns: []
      }
    }

    const response: AIAnalysisResponse = {
      textAnalysis,
      imageAnalysis
    }

    return c.json(response)
  } catch (error) {
    return c.json({ error: 'AI分析に失敗しました' }, 500)
  }
})

// Discord プレビュー送信エンドポイント
app.post('/discord/preview', async (c) => {
  try {
    const { text, imageUrl, clubId }: DiscordPreviewRequest = await c.req.json()
    const env = c.env as Env

    // 開発環境では実際のDiscord APIを呼ばずにモックレスポンスを返す
    const isDevelopment = !env.DISCORD_WEBHOOK_URL || env.DISCORD_WEBHOOK_URL.includes('your-webhook-url')

    if (isDevelopment) {
      console.log('Development mode: returning mock Discord response')
      console.log('Preview data:', { hasImage: !!imageUrl, clubId })
      return c.json({
        success: true,
        message: 'Discordにプレビューを送信しました（開発モード）'
      })
    }

    let response: Response

    // スクリーンショット画像が送信された場合
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      // base64データを抽出
      const [header, base64Data] = imageUrl.split(',')
      const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png'
      const extension = mimeType.split('/')[1] || 'png'

      // base64をblobに変換
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // FormDataで画像ファイルとして送信
      const formData = new FormData()
      const imageFile = new File([bytes], `twitter_preview.${extension}`, { type: mimeType })
      formData.append('files[0]', imageFile)

      const payloadJson = {
        content: '新しい投稿のプレビューです 🐦'
      }
      formData.append('payload_json', JSON.stringify(payloadJson))

      response = await fetch(env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        body: formData
      })
    } else {
      // テキストのみの場合（従来通り）
      const embed = {
        title: '📝 投稿プレビュー',
        description: text.length > 2048 ? text.substring(0, 2045) + '...' : text,
        color: 0x1DA1F2, // Twitterブルー
        timestamp: new Date().toISOString(),
        footer: {
          text: 'クラブソーシャルメディア管理システム'
        }
      }

      // 画像URLがある場合はembedに追加
      if (imageUrl) {
        (embed as any).image = { url: imageUrl }
      }

      const discordPayload = {
        content: '新しい投稿のプレビューです：',
        embeds: [embed]
      }

      response = await fetch(env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord API error:', response.status, errorText)
      throw new Error(`Discord API error: ${response.status}`)
    }

    return c.json({
      success: true,
      message: 'Discordにプレビューを送信しました'
    })

  } catch (error) {
    console.error('Discord送信エラー:', error)
    return c.json({ error: 'Discord送信に失敗しました' }, 500)
  }
})

// 認証エンドポイント（簡単な実装）
app.post('/auth', async (c) => {
  try {
    const { clubId, password } = await c.req.json()

    // 簡単な認証（実際のアプリではより安全な実装が必要）
    if (clubId && password) {
      return c.json({
        success: true,
        message: '認証に成功しました'
      })
    }

    return c.json({
      success: false,
      error: 'クラブIDまたはパスワードが正しくありません'
    }, 401)
  } catch (error) {
    return c.json({ error: '認証に失敗しました' }, 500)
  }
})

export default app
