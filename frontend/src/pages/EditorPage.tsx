import { useState } from 'react'
import { apiClient } from '../api/apiClient'
import TwitterPreview from '../components/TwitterPreview'
import TiptapEditor from '../components/TiptapEditor'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Sparkles, Send, RotateCcw, CheckCircle, AlertCircle, Twitter } from "lucide-react"

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

export default function EditorPage() {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [message, setMessage] = useState('')


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null)
      setImagePreview(null)
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim() && !image) {
      setMessage('テキストまたは画像を入力してください')
      return
    }

    setIsAnalyzing(true)
    setMessage('')

    try {
      const result = await apiClient.analyzeContent(text, image)
      setAnalysis(result)
      setMessage('分析が完了しました')
    } catch (error) {
      setMessage('分析に失敗しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmitForReview = async () => {
    if (!analysis) {
      setMessage('まず分析を実行してください')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      await apiClient.requestReview('default-club', {
        text,
        imageUrl: imagePreview,
        aiAnalysis: analysis
      })
      setMessage('レビューリクエストを送信しました')
    } catch (error) {
      setMessage('レビューリクエストの送信に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostToTwitter = async () => {
    if (!text.trim()) {
      setMessage('投稿テキストを入力してください')
      return
    }

    setIsPosting(true)
    setMessage('')

    try {
      // Twitter Web Intent URLを生成
      const encodedText = encodeURIComponent(text)
      let twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`

      if (imagePreview) {
        // 画像がある場合はユーザーに手動での画像追加を促すメッセージを追加
        const textWithImageNote = `${text}\n\n[画像を手動で添付してください]`
        const encodedTextWithNote = encodeURIComponent(textWithImageNote)
        twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTextWithNote}`
      }

      // 新しいタブでTwitterを開く
      window.open(twitterUrl, '_blank')
      setMessage('Twitterの投稿画面を開きました')
    } catch (error) {
      setMessage('Twitter投稿画面の表示に失敗しました')
    } finally {
      setIsPosting(false)
    }
  }

  const clearForm = () => {
    setText('')
    setImage(null)
    setImagePreview(null)
    setAnalysis(null)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">投稿エディター</h1>
        <p className="text-lg text-gray-600">SNS投稿の事前審査システム</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                投稿作成
              </CardTitle>
              <CardDescription>
                テキストと画像を入力して投稿を作成してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="text">投稿テキスト</Label>
                <TiptapEditor
                  content={text}
                  onChange={setText}
                  placeholder="投稿したいテキストを入力してください..."
                  maxBytes={280}
                />
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <Label htmlFor="image">画像（オプション）</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      クリックして画像をアップロード
                    </p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="プレビュー"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      AI分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI分析実行
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearForm}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  クリア
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>投稿プレビュー</CardTitle>
              <CardDescription>
                実際の投稿がどのように表示されるかを確認できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TwitterPreview
                text={text}
                imageUrl={imagePreview}
              />

              {/* Twitter投稿ボタン */}
              {text.trim() && (
                <div className="pt-4 border-t border-border/40">
                  <Button
                    onClick={handlePostToTwitter}
                    disabled={isPosting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    {isPosting ? (
                      <>
                        <Twitter className="h-4 w-4 mr-2 animate-pulse" />
                        Twitter画面を開いています...
                      </>
                    ) : (
                      <>
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitterに投稿
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                AI分析結果
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.textAnalysis && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    テキスト分析
                    <Badge variant={analysis.textAnalysis.isAppropriate ? "default" : "destructive"}>
                      {analysis.textAnalysis.isAppropriate ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          適切
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          要注意
                        </>
                      )}
                    </Badge>
                  </h3>
                  <div className="mb-3">
                    <span className="font-medium">スコア: </span>
                    <span className="text-lg font-bold text-purple-600">
                      {analysis.textAnalysis.score}/10
                    </span>
                  </div>
                  {analysis.textAnalysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">改善提案:</h4>
                      <ul className="space-y-1">
                        {analysis.textAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-purple-200">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {analysis.imageAnalysis && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    画像分析
                    <Badge variant={analysis.imageAnalysis.isAppropriate ? "default" : "destructive"}>
                      {analysis.imageAnalysis.isAppropriate ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          適切
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          要注意
                        </>
                      )}
                    </Badge>
                  </h3>
                  <div className="mb-3 p-3 bg-white rounded border-l-4 border-purple-400">
                    <span className="font-medium">説明: </span>
                    {analysis.imageAnalysis.description}
                  </div>
                  {analysis.imageAnalysis.concerns.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">懸念事項:</h4>
                      <ul className="space-y-1">
                        {analysis.imageAnalysis.concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-red-700 pl-4 border-l-2 border-red-200">
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleSubmitForReview}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
                variant="default"
              >
                {isSubmitting ? (
                  <>
                    <Send className="h-4 w-4 mr-2 animate-pulse" />
                    レビュー送信中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    人間レビューを依頼
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Message */}
        {message && (
          <Card className={`shadow-lg ${message.includes('失敗') || message.includes('エラー')
            ? 'border-red-200 bg-red-50'
            : 'border-green-200 bg-green-50'}`}>
            <CardContent className="pt-6">
              <div className={`flex items-center gap-2 font-medium ${
                message.includes('失敗') || message.includes('エラー')
                  ? 'text-red-700'
                  : 'text-green-700'
              }`}>
                {message.includes('失敗') || message.includes('エラー') ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                {message}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}