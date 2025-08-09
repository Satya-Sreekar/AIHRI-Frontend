/**
 * Chat Service for handling interview conversations with AI
 */

import { generateText, getModels, GenerateRequest, GenerateResponse, ApiError } from './api'
import { CHAT_CONFIG, API_CONFIG } from '@/src/config/api'
import type { TranscriptEntry } from '@/components/types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    duration?: number
    tokens?: number
  }
}

export interface ChatServiceConfig {
  model: string
  temperature?: number
  systemPrompt?: string
  maxTokens?: number
}

export interface ChatServiceCallbacks {
  onMessageStart?: (messageId: string) => void
  onMessageChunk?: (messageId: string, chunk: string, fullContent: string) => void
  onMessageComplete?: (message: ChatMessage) => void
  onError?: (error: ApiError) => void
}

export class ChatService {
  private config: ChatServiceConfig
  private callbacks: ChatServiceCallbacks
  private conversationHistory: ChatMessage[] = []
  private currentMessageId: string | null = null
  private isGenerating: boolean = false

  constructor(config: ChatServiceConfig, callbacks: ChatServiceCallbacks = {}) {
    this.config = {
      temperature: CHAT_CONFIG.TEMPERATURE,
      systemPrompt: CHAT_CONFIG.SYSTEM_PROMPT,
      maxTokens: CHAT_CONFIG.MAX_TOKENS,
      ...config,
    }
    this.callbacks = callbacks
  }

  /**
   * Update the service configuration
   */
  updateConfig(config: Partial<ChatServiceConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get the current conversation history
   */
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * Add a system message to the conversation
   */
  addSystemMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      role: 'system',
      content,
      timestamp: new Date(),
    }
    this.conversationHistory.push(message)
    return message
  }

  /**
   * Add a user message to the conversation
   */
  addUserMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    this.conversationHistory.push(message)
    return message
  }

  /**
   * Generate AI response to the conversation
   */
  async generateResponse(): Promise<ChatMessage | null> {
    if (this.isGenerating) {
      throw new Error('Response generation already in progress')
    }

    this.isGenerating = true
    this.currentMessageId = this.generateMessageId()

    try {
      this.callbacks.onMessageStart?.(this.currentMessageId)

      const prompt = this.buildPrompt()
      let fullContent = ''

      const request: GenerateRequest = {
        model: this.config.model,
        prompt,
        stream: true,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      }

      const startTime = Date.now()

      const finalResponse = await generateText(request, (chunk: GenerateResponse) => {
        if (chunk.response && this.currentMessageId) {
          fullContent += chunk.response
          this.callbacks.onMessageChunk?.(this.currentMessageId, chunk.response, fullContent)
        }
      })

      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)

      if (finalResponse && this.currentMessageId) {
        const message: ChatMessage = {
          id: this.currentMessageId,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date(),
          metadata: {
            model: finalResponse.model,
            duration,
            tokens: this.estimateTokens(fullContent),
          },
        }

        this.conversationHistory.push(message)
        this.callbacks.onMessageComplete?.(message)
        return message
      }

      return null
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        undefined,
        error
      )
      this.callbacks.onError?.(apiError)
      throw apiError
    } finally {
      this.isGenerating = false
      this.currentMessageId = null
    }
  }

  /**
   * Send a message and get a response
   */
  async sendMessage(content: string): Promise<ChatMessage | null> {
    this.addUserMessage(content)
    return await this.generateResponse()
  }

  /**
   * Check if the service is currently generating a response
   */
  isCurrentlyGenerating(): boolean {
    return this.isGenerating
  }

  /**
   * Clear the conversation history
   */
  clearHistory() {
    this.conversationHistory = []
  }

  /**
   * Get available models
   */
  static async getAvailableModels() {
    return await getModels()
  }

  /**
   * Convert conversation to transcript entries
   */
  toTranscriptEntries(): TranscriptEntry[] {
    return this.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        id: msg.id,
        speaker: msg.role === 'user' ? 'Candidate' : 'AI Interviewer',
        text: msg.content,
        timestamp: msg.timestamp,
        duration: msg.metadata?.duration,
      }))
  }

  /**
   * Import transcript entries into conversation history
   */
  fromTranscriptEntries(entries: TranscriptEntry[]) {
    this.conversationHistory = [
      {
        id: 'system',
        role: 'system',
        content: this.config.systemPrompt || '',
        timestamp: new Date(),
      },
      ...entries.map(entry => ({
        id: entry.id,
        role: (entry.speaker === 'Candidate' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: entry.text,
        timestamp: entry.timestamp,
        metadata: entry.duration ? { duration: entry.duration } : undefined,
      }))
    ]
  }

  /**
   * Build the prompt for the AI model
   */
  private buildPrompt(): string {
    const systemMessage = this.config.systemPrompt || ''
    const messages = this.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => {
        const role = msg.role === 'user' ? 'Candidate' : 'Interviewer'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')

    return `${systemMessage}\n\nConversation so far:\n${messages}\n\nInterviewer:`
  }

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Estimate token count for a string (rough approximation)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4) // Rough estimation: 1 token ≈ 4 characters
  }
}
