"use client"

import React, { RefObject, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Send, Loader2, AlertTriangle, Bot, User } from "lucide-react"
import type { TranscriptEntry } from "@/components/types"

interface RightSidebarProps {
  transcript: TranscriptEntry[]
  containerRef: RefObject<HTMLDivElement | null>
  onSendMessage?: (message: string) => Promise<void>
  isGenerating?: boolean
  error?: string | null
  streamingMessage?: string
  disabled?: boolean
}

export default function RightSidebar({ 
  transcript, 
  containerRef, 
  onSendMessage,
  isGenerating = false,
  error = null,
  streamingMessage = '',
  disabled = false
}: RightSidebarProps) {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!inputValue.trim() || !onSendMessage || isSending || isGenerating) return

    setIsSending(true)
    try {
      await onSendMessage(inputValue.trim())
      setInputValue('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <div className="interview-sidebar w-80 flex flex-col hidden lg:flex flex-shrink-0 h-full">
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <Card className="flex-1 flex flex-col border-0 shadow-none bg-transparent min-h-0">
          <CardHeader className="p-0 pb-4 flex-shrink-0">
            <CardTitle className="text-sm text-white flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-cyan-400" />
              Live Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Chat Messages */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 min-h-0"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b',
                paddingBottom: '7vh',
              }}
            >
              <div className="space-y-3 p-1">
                {transcript.map((entry) => (
                  <div
                    key={entry.id}
                    className={`space-y-2 backdrop-blur-sm rounded-lg p-3 border transition-all duration-200 ${
                      entry.speaker === 'Candidate'
                        ? 'bg-blue-700/20 border-blue-600/30 hover:bg-blue-700/30 ml-4'
                        : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {entry.speaker === 'Candidate' ? (
                          <User className="h-3 w-3 text-blue-400" />
                        ) : (
                          <Bot className="h-3 w-3 text-cyan-400" />
                        )}
                        <span className={`text-xs font-medium ${
                          entry.speaker === 'Candidate' ? 'text-blue-300' : 'text-cyan-300'
                        }`}>
                          {entry.speaker}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{entry.text}</p>
                    {entry.duration && (
                      <span className="text-xs text-gray-500">Duration: {entry.duration}s</span>
                    )}
                  </div>
                ))}

                {/* Streaming Message */}
                {streamingMessage && (
                  <div className="space-y-2 bg-slate-700/30 backdrop-blur-sm rounded-lg p-3 border border-slate-600/30 mr-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-3 w-3 text-cyan-400" />
                        <span className="text-xs font-medium text-cyan-300">AI Interviewer</span>
                        <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300">
                          Typing...
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {streamingMessage}
                      <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input */}
            {onSendMessage && (
              <div className="flex-shrink-0 pt-4 border-t border-slate-600/30">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={disabled ? "Chat disabled" : "Type your response..."}
                    disabled={disabled || isSending || isGenerating}
                    className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:bg-slate-700/70 focus:border-cyan-500/50 text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || disabled || isSending || isGenerating}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500"
                  >
                    {isSending || isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                  <span>Press Enter to send</span>
                  {isGenerating && (
                    <span className="flex items-center space-x-1 text-cyan-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>AI is responding...</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
