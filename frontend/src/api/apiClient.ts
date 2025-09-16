// フロントエンドとバックエンドの接続設定
const BASE_URL = import.meta.env.PROD
  ? 'https://club-social-media-manager-backend.jyogi.workers.dev'
  : '/api'

interface AuthResponse {
  success: boolean
  error?: string
}

interface AIAnalysisResponse {
  textAnalysis?: {
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

interface ReviewRequest {
  text: string
  imageUrl: string | null
  aiAnalysis: AIAnalysisResponse
}

class APIClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async authenticate(clubId: string, password: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth', {
      method: 'POST',
      body: JSON.stringify({ clubId, password })
    })
  }

  async analyzeContent(text: string, image: File | null): Promise<AIAnalysisResponse> {
    const formData = new FormData()
    formData.append('text', text)
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async requestReview(clubId: string, reviewData: ReviewRequest): Promise<void> {
    return this.makeRequest<void>('/discord/review', {
      method: 'POST',
      body: JSON.stringify({ clubId, ...reviewData })
    })
  }
}

export const apiClient = new APIClient()