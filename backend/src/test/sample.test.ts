import { describe, it, expect, vi, beforeEach } from 'vitest'

// サンプル関数をテストするための例
function add(a: number, b: number): number {
  return a + b
}

function multiply(a: number, b: number): number {
  return a * b
}

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })

  it('should multiply two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6)
    expect(multiply(-1, 1)).toBe(-1)
    expect(multiply(0, 5)).toBe(0)
  })
})

describe('Mock example', () => {
  let mockFn: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFn = vi.fn()
  })

  it('should work with mocks', () => {
    mockFn.mockReturnValue('mocked value')
    
    const result = mockFn()
    
    expect(result).toBe('mocked value')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})

describe('Environment variables', () => {
  it('should have access to environment variables', () => {
    // setup.tsでモックした環境変数にアクセス
    expect(process.env.DISCORD_WEBHOOK_URL).toBeDefined()
    expect(process.env.GEMINI_API_KEY).toBeDefined()
  })
})
