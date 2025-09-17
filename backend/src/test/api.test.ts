import { describe, it, expect } from 'vitest'
import app from '../index'

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const req = new Request('http://localhost/')
      const res = await app.fetch(req)
      
      expect(res.status).toBe(200)
      
      const data = await res.json()
      expect(data).toEqual({ message: 'Club Social Media Manager API' })
    })
  })

  describe('POST /ai/analyze', () => {
    it('should analyze text content successfully', async () => {
      const requestBody = {
        text: 'テスト投稿です',
        image: null
      }
      
      const req = new Request('http://localhost/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const res = await app.fetch(req)
      expect(res.status).toBe(200)
      
      const data = await res.json() as any
      expect(data).toHaveProperty('textAnalysis')
      expect(data.textAnalysis).toHaveProperty('isAppropriate')
      expect(data.textAnalysis).toHaveProperty('suggestions')
      expect(data.textAnalysis).toHaveProperty('score')
      expect(typeof data.textAnalysis.isAppropriate).toBe('boolean')
      expect(Array.isArray(data.textAnalysis.suggestions)).toBe(true)
      expect(typeof data.textAnalysis.score).toBe('number')
    })

    it('should suggest improvements for long text', async () => {
      const longText = 'a'.repeat(300) // 300文字の長いテキスト
      const requestBody = {
        text: longText,
        image: null
      }
      
      const req = new Request('http://localhost/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const res = await app.fetch(req)
      expect(res.status).toBe(200)
      
      const data = await res.json() as any
      expect(data.textAnalysis.suggestions).toContain('文字数を280文字以内に収めてください')
    })

    it('should handle image analysis', async () => {
      const requestBody = {
        text: 'テスト投稿です',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
      }
      
      const req = new Request('http://localhost/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const res = await app.fetch(req)
      expect(res.status).toBe(200)
      
      const data = await res.json() as any
      expect(data).toHaveProperty('imageAnalysis')
      expect(data.imageAnalysis).toHaveProperty('isAppropriate')
      expect(data.imageAnalysis).toHaveProperty('description')
      expect(data.imageAnalysis).toHaveProperty('concerns')
    })
  })

  describe('POST /discord/preview', () => {
    it('should handle Discord preview in development mode', async () => {
      const requestBody = {
        text: 'テスト投稿です',
        imageUrl: null,
        clubId: 'test-club'
      }
      
      const req = new Request('http://localhost/discord/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      // 開発環境をシミュレート
      const env = {
        DISCORD_WEBHOOK_URL: 'your-webhook-url'
      }
      
      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)
      
      const data = await res.json() as any
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('開発モード')
    })
  })

  describe('POST /auth', () => {
    it('should authenticate valid credentials', async () => {
      const requestBody = {
        clubId: 'test-club',
        password: 'test-password'
      }
      
      const req = new Request('http://localhost/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const res = await app.fetch(req)
      expect(res.status).toBe(200)
      
      const data = await res.json()
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('message', '認証に成功しました')
    })

    it('should reject invalid credentials', async () => {
      const requestBody = {
        clubId: '',
        password: ''
      }
      
      const req = new Request('http://localhost/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const res = await app.fetch(req)
      expect(res.status).toBe(401)
      
      const data = await res.json()
      expect(data).toHaveProperty('success', false)
      expect(data).toHaveProperty('error')
    })
  })
})
