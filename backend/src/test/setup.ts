// Vitest global setup for backend tests
import { vi, afterEach, beforeAll } from 'vitest'

// Mock environment variables
beforeAll(() => {
  process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test'
  process.env.GEMINI_API_KEY = 'test-api-key'
})

// Global test setup
global.fetch = vi.fn()

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})
