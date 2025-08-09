/**
 * React hook for managing chat functionality with the AI interviewer
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { ChatService, ChatMessage, ChatServiceConfig, ApiError } from '@/src/services/chatService'
import { CHAT_CONFIG, API_CONFIG } from '@/src/config/api'
import type { TranscriptEntry } from '@/components/types'

export interface UseChatOptions {
  model?: string
  temperature?: number
  systemPrompt?: string
  maxTokens?: number
  autoInitialize?: boolean
}

export interface UseChatReturn {
  // Chat state
  messages: ChatMessage[]
  isLoading: boolean
  isGenerating: boolean
  error: ApiError | null
  
  // Current streaming message
  streamingMessage: string
  streamingMessageId: string | null
  
  // Actions
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  updateConfig: (config: Partial<ChatServiceConfig>) => void
  
  // Transcript integration
  transcript: TranscriptEntry[]
  updateFromTranscript: (entries: TranscriptEntry[]) => void
  
  // Service management
  initializeService: () => Promise<void>
  isServiceReady: boolean
}

const DEFAULT_CONFIG: ChatServiceConfig = {
  model: API_CONFIG.DEFAULT_MODEL,
  temperature: CHAT_CONFIG.TEMPERATURE,
  systemPrompt: CHAT_CONFIG.SYSTEM_PROMPT,
  maxTokens: CHAT_CONFIG.MAX_TOKENS,
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isServiceReady, setIsServiceReady] = useState(false)
  
  const chatServiceRef = useRef<ChatService | null>(null)
  
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
  }

  // Initialize chat service
  const initializeService = useCallback(async () => {
    if (chatServiceRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      chatServiceRef.current = new ChatService(config, {
        onMessageStart: (messageId: string) => {
          setStreamingMessageId(messageId)
          setStreamingMessage('')
          setIsGenerating(true)
        },
        onMessageChunk: (messageId: string, chunk: string, fullContent: string) => {
          if (messageId === streamingMessageId) {
            setStreamingMessage(fullContent)
          }
        },
        onMessageComplete: (message: ChatMessage) => {
          setMessages(prev => [...prev, message])
          setStreamingMessage('')
          setStreamingMessageId(null)
          setIsGenerating(false)
        },
        onError: (error: ApiError) => {
          setError(error)
          setIsGenerating(false)
          setStreamingMessage('')
          setStreamingMessageId(null)
        }
      })

      setIsServiceReady(true)
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        err instanceof Error ? err.message : 'Failed to initialize chat service'
      )
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-initialize if requested
  useEffect(() => {
    if (options.autoInitialize !== false) {
      initializeService()
    }
  }, [initializeService, options.autoInitialize])

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!chatServiceRef.current) {
      throw new Error('Chat service not initialized')
    }

    if (isGenerating) {
      throw new Error('Already generating response')
    }

    setError(null)

    try {
      // Add user message to local state immediately
      const userMessage = chatServiceRef.current.addUserMessage(content)
      setMessages(prev => [...prev, userMessage])

      // Generate AI response
      await chatServiceRef.current.generateResponse()
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        err instanceof Error ? err.message : 'Failed to send message'
      )
      setError(apiError)
    }
  }, [isGenerating])

  // Clear chat history
  const clearChat = useCallback(() => {
    if (chatServiceRef.current) {
      chatServiceRef.current.clearHistory()
    }
    setMessages([])
    setStreamingMessage('')
    setStreamingMessageId(null)
    setError(null)
  }, [])

  // Update service configuration
  const updateConfig = useCallback((newConfig: Partial<ChatServiceConfig>) => {
    if (chatServiceRef.current) {
      chatServiceRef.current.updateConfig(newConfig)
    }
  }, [])

  // Convert to transcript entries
  const transcript = messages.length > 0 || streamingMessage ? 
    [
      ...messages.map(msg => ({
        id: msg.id,
        speaker: msg.role === 'user' ? 'Candidate' : 'AI Interviewer',
        text: msg.content,
        timestamp: msg.timestamp,
        duration: msg.metadata?.duration,
      } as TranscriptEntry)),
      ...(streamingMessage && streamingMessageId ? [{
        id: streamingMessageId,
        speaker: 'AI Interviewer',
        text: streamingMessage,
        timestamp: new Date(),
      } as TranscriptEntry] : [])
    ] : []

  // Update from transcript entries
  const updateFromTranscript = useCallback((entries: TranscriptEntry[]) => {
    if (chatServiceRef.current) {
      chatServiceRef.current.fromTranscriptEntries(entries)
      setMessages(chatServiceRef.current.getConversationHistory().filter(msg => msg.role !== 'system'))
    }
  }, [])

  return {
    messages,
    isLoading,
    isGenerating,
    error,
    streamingMessage,
    streamingMessageId,
    sendMessage,
    clearChat,
    updateConfig,
    transcript,
    updateFromTranscript,
    initializeService,
    isServiceReady,
  }
}
