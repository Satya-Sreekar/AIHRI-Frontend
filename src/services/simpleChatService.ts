/*
 * SimpleChatService – a lightweight alternative to the original ChatService.
 * --------------------------------------------------------------
 *  • No streaming / chunk logic – only one generate request per message.
 *  • Optional TTS: one POST to /tts/ after the full text is received.
 *  • Minimal callbacks so you can still hook into the lifecycle.
 *  • Under 200 lines – easy to reason about & maintain.
 */

import {
  generateText,
  textToSpeech,
  ApiError,
  GenerateRequest,
  GenerateResponse,
} from './api'
import { CHAT_CONFIG, TTS_CONFIG } from '@/src/config/api'

/* -------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------*/
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface SimpleChatServiceConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  enableTTS?: boolean
  ttsLang?: string
  ttsTld?: string
  ttsSlow?: boolean
}

export interface SimpleChatServiceCallbacks {
  onMessageStart?: (messageId: string) => void
  onMessageChunk?: (messageId: string, chunk: string, fullContent: string) => void // ignored (no streaming)
  onMessageComplete?: (message: ChatMessage) => void
  onTTSStart?: (messageId: string) => void
  onTTSComplete?: (messageId: string, audioBlob: Blob) => void
  onError?: (error: ApiError) => void
}

/* -------------------------------------------------------------------------
 * Helper
 * -------------------------------------------------------------------------*/
const uuid = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

/* -------------------------------------------------------------------------
 * Service Implementation
 * -------------------------------------------------------------------------*/
export class SimpleChatService {
  private readonly config: Required<SimpleChatServiceConfig>
  private readonly callbacks: SimpleChatServiceCallbacks
  private conversation: ChatMessage[] = []

  constructor(
    cfg: SimpleChatServiceConfig = {},
    callbacks: SimpleChatServiceCallbacks = {}
  ) {
    // Merge config with sensible defaults
    this.config = {
      model: cfg.model || CHAT_CONFIG.DEFAULT_MODEL,
      temperature: cfg.temperature ?? CHAT_CONFIG.TEMPERATURE,
      maxTokens: cfg.maxTokens ?? CHAT_CONFIG.MAX_TOKENS,
      systemPrompt: cfg.systemPrompt ?? CHAT_CONFIG.SYSTEM_PROMPT,
      enableTTS: cfg.enableTTS ?? true,
      ttsLang: cfg.ttsLang ?? TTS_CONFIG.DEFAULT_LANG,
      ttsTld: cfg.ttsTld ?? TTS_CONFIG.DEFAULT_TLD,
      ttsSlow: cfg.ttsSlow ?? TTS_CONFIG.DEFAULT_SLOW,
    }

    this.callbacks = callbacks
  }

  /**
   * Add a system message to the conversation history
   */
  addSystemMessage(content: string): ChatMessage {
    const msg: ChatMessage = {
      id: uuid(),
      role: 'system',
      content,
      timestamp: new Date(),
    }
    this.conversation.push(msg)
    return msg
  }

  /**
   * Add a user message without triggering AI response
   */
  addUserMessage(content: string): ChatMessage {
    const msg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    this.conversation.push(msg)
    return msg
  }

  /**
   * Generate an AI response based on current conversation history.
   * Uses the last N messages as prompt.
   */
  async generateResponse(): Promise<ChatMessage | null> {
    const lastUserMsg = this.conversation.filter(m => m.role === 'user').pop()
    const prompt = lastUserMsg ? lastUserMsg.content : 'Please greet the candidate.'
    return this.sendMessage(prompt)
  }

  /**
   * @deprecated – maintained for compatibility
   */
  getConversation(): ChatMessage[] {
    return [...this.conversation]
  }

  /* ---------------------------------------------------------------------
   * Public API
   * -------------------------------------------------------------------*/
  async sendMessage(userText: string): Promise<ChatMessage> {
    const messageId = uuid()

    const userMsg: ChatMessage = {
      id: messageId + '_user',
      role: 'user',
      content: userText,
      timestamp: new Date(),
    }
    this.conversation.push(userMsg)

    try {
      this.callbacks.onMessageStart?.(messageId)

      // 1) Ask the model for a full response (no streaming)
      const generateReq: GenerateRequest = {
        model: this.config.model,
        prompt: userText,
        stream: false,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      }

      const res: GenerateResponse = await generateText(generateReq)
      const aiContent = res.response.trim()

      const aiMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      }

      this.conversation.push(aiMessage) // Add AI message to history
      this.callbacks.onMessageComplete?.(aiMessage)

      // 2) Optional TTS – single clip for the whole response
      if (this.config.enableTTS && aiContent) {
        try {
          this.callbacks.onTTSStart?.(messageId)
          const audioBlob = await textToSpeech({
            text: aiContent,
            lang: this.config.ttsLang,
            tld: this.config.ttsTld,
            slow: this.config.ttsSlow,
          })

          // Auto-play the audio (must respect user-interaction policies)
          this.playAudio(audioBlob)
          this.callbacks.onTTSComplete?.(messageId, audioBlob)
        } catch (ttsErr) {
          console.error('SimpleChatService: TTS failed', ttsErr)
          // TTS failure should not reject the whole flow
        }
      }

      return aiMessage
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err))
      this.callbacks.onError?.(apiErr)
      throw apiErr
    }
  }

  /* ---------------------------------------------------------------------
   * Helpers
   * -------------------------------------------------------------------*/
  private playAudio(blob: Blob) {
    if (!blob || blob.size === 0) return
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    // Fire & forget; browsers may block autoplay – rely on user gesture outside
    audio.play().catch((e) => console.warn('SimpleChatService: audio.play() failed', e))
    // Cleanup when finished
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(url)
    })
  }
}
