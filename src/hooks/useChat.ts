/**
 * React hook for managing chat functionality with the AI interviewer
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { ChatService, ChatMessage, ChatServiceConfig } from '@/src/services/chatService'
import { CHAT_CONFIG, API_CONFIG } from '@/src/config/api'
import { textToSpeech, ApiError } from '@/src/services/api'
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
  
  // TTS state
  ttsAudioMap: Map<string, Blob>
  currentPlayingId: string | null
  isTTSGenerating: boolean
  ttsError: ApiError | null
  
  // Actions
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  updateConfig: (config: Partial<ChatServiceConfig>) => void
  playTTS: (messageId: string, text: string) => Promise<void>
  
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
  
  // TTS state
  const [ttsAudioMap, setTTSAudioMap] = useState<Map<string, Blob>>(new Map())
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [isTTSGenerating, setIsTTSGenerating] = useState(false)
  const [ttsError, setTTSError] = useState<ApiError | null>(null)
  
  const chatServiceRef = useRef<ChatService | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
  }

  // Initialize chat service
  const initializeService = useCallback(async () => {
    if (chatServiceRef.current) return

    console.log('Initializing chat service with config:', config)
    setIsLoading(true)
    setError(null)

    try {
      chatServiceRef.current = new ChatService(config, {
        onMessageStart: (messageId: string) => {
          console.log('Message generation started:', messageId)
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
          console.log('Message generation completed:', message.id, message.content.substring(0, 50) + '...')
          setMessages(prev => [...prev, message])
          setStreamingMessage('')
          setStreamingMessageId(null)
          setIsGenerating(false)
          
          // Automatically generate TTS for AI messages
          if (message.role === 'assistant' && message.content.trim()) {
            generateTTSForMessage(message.id, message.content)
          }
        },
        onError: (error: ApiError) => {
          console.error('Chat service error:', error)
          setError(error)
          setIsGenerating(false)
          setStreamingMessage('')
          setStreamingMessageId(null)
        }
      })

      console.log('Chat service initialized successfully')
      setIsServiceReady(true)
    } catch (err) {
      console.error('Failed to initialize chat service:', err)
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

  // Send initial greeting when service becomes ready
  useEffect(() => {
    if (isServiceReady && chatServiceRef.current && messages.length === 0) {
      const initializeGreeting = async () => {
        try {
          console.log('Initializing greeting message...')
          
          // Add system message that user has joined
          const systemMessage = chatServiceRef.current!.addSystemMessage("Candidate has joined the interview session")
          
          // Add to messages state 
          setMessages(prev => [...prev, systemMessage])
          
          console.log('System message added, generating AI response...')
          
          // Generate AI greeting response immediately
          await chatServiceRef.current!.generateResponse()
          
          console.log('AI greeting response generated successfully')
        } catch (error) {
          console.error('Failed to initialize greeting:', error)
          // Set error state so user can see what went wrong
          const apiError = error instanceof ApiError ? error : new ApiError(
            error instanceof Error ? error.message : 'Failed to initialize greeting'
          )
          setError(apiError)
        }
      }
      
      initializeGreeting()
    }
  }, [isServiceReady, messages.length])

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener('ended', () => {
        setCurrentPlayingId(null)
      })
      audioRef.current.addEventListener('error', () => {
        setTTSError(new ApiError('Audio playback failed'))
        setCurrentPlayingId(null)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Generate TTS for a message
  const generateTTSForMessage = useCallback(async (messageId: string, text: string) => {
    if (ttsAudioMap.has(messageId)) return // Already generated

    setIsTTSGenerating(true)
    setTTSError(null)

    try {
      const audioBlob = await textToSpeech({
        text,
        lang: 'en',
        tld: 'com',
        slow: false
      })

      setTTSAudioMap(prev => {
        const newMap = new Map(prev)
        newMap.set(messageId, audioBlob)
        return newMap
      })

      // Auto-play if this is the latest message
      if (currentPlayingId === null) {
        playTTSBlob(messageId, audioBlob)
      }

    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : 'TTS generation failed'
      )
      setTTSError(apiError)
    } finally {
      setIsTTSGenerating(false)
    }
  }, [ttsAudioMap, currentPlayingId])

  // Play TTS audio from blob
  const playTTSBlob = useCallback((messageId: string, blob: Blob) => {
    if (!audioRef.current) return

    // Stop current audio if playing
    if (currentPlayingId) {
      audioRef.current.pause()
    }

    const audioUrl = URL.createObjectURL(blob)
    audioRef.current.src = audioUrl
    setCurrentPlayingId(messageId)

    audioRef.current.play().catch(error => {
      console.warn('Auto-play failed:', error)
      setCurrentPlayingId(null)
      URL.revokeObjectURL(audioUrl)
    })

    // Clean up URL when audio ends
    audioRef.current.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl)
    }, { once: true })
  }, [currentPlayingId])

  // Manual TTS playback
  const playTTS = useCallback(async (messageId: string, text: string) => {
    let audioBlob = ttsAudioMap.get(messageId)

    if (!audioBlob) {
      // Generate TTS if not already generated
      await generateTTSForMessage(messageId, text)
      audioBlob = ttsAudioMap.get(messageId)
    }

    if (audioBlob) {
      playTTSBlob(messageId, audioBlob)
    }
  }, [ttsAudioMap, generateTTSForMessage, playTTSBlob])

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!chatServiceRef.current) {
      throw new Error('Chat service not initialized')
    }

    if (isGenerating) {
      console.warn('Already generating response, ignoring duplicate send request')
      return // Return early instead of throwing error
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
        speaker: msg.role === 'user' ? 'Candidate' : 
                msg.role === 'system' ? 'System' : 'AI Interviewer',
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
    ttsAudioMap,
    currentPlayingId,
    isTTSGenerating,
    ttsError,
    sendMessage,
    clearChat,
    updateConfig,
    playTTS,
    transcript,
    updateFromTranscript,
    initializeService,
    isServiceReady,
  }
}
