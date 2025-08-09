/**
 * API Service for communicating with the backend
 */

import { API_CONFIG, ERROR_MESSAGES } from '@/src/config/api'

const API_BASE_URL = API_CONFIG.BASE_URL

export interface GenerateRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    repeat_penalty?: number
    seed?: number
    num_predict?: number
  }
}

export interface GenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_duration?: number
  eval_duration?: number
}

export interface Model {
  name: string
  modified_at: string
  size: number
}

export interface ModelsResponse {
  models: Model[]
}

export interface TTSRequest {
  text: string
  lang?: string
  tld?: string
  slow?: boolean
}

export interface TTSOptions {
  onProgress?: (loaded: number, total: number) => void
  onComplete?: (audioBlob: Blob) => void
  onError?: (error: ApiError) => void
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any,
    public isRetryable: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static fromResponse(status: number, message: string): ApiError {
    const isRetryable = status >= 500 || status === 429 || status === 408

    let userMessage: string
    switch (status) {
      case 400:
        userMessage = ERROR_MESSAGES.INVALID_RESPONSE
        break
      case 401:
        userMessage = ERROR_MESSAGES.AUTHENTICATION_ERROR
        break
      case 404:
        userMessage = ERROR_MESSAGES.MODEL_NOT_AVAILABLE
        break
      case 429:
        userMessage = ERROR_MESSAGES.RATE_LIMIT_ERROR
        break
      case 500:
      case 502:
      case 503:
      case 504:
        userMessage = ERROR_MESSAGES.API_UNAVAILABLE
        break
      default:
        userMessage = ERROR_MESSAGES.UNKNOWN_ERROR
    }

    return new ApiError(userMessage, status, message, isRetryable)
  }

  static fromNetworkError(error: Error): ApiError {
    return new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error, true)
  }
}

/**
 * Retry utility function
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS,
  delay: number = API_CONFIG.RETRY_DELAY
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      if (error instanceof ApiError && !error.isRetryable) {
        throw error
      }

      if (attempt === maxAttempts) {
        break
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}

/**
 * Generate text using the Ollama API with streaming support
 */
export async function generateText(
  request: GenerateRequest,
  onChunk?: (chunk: GenerateResponse) => void
): Promise<GenerateResponse | null> {
  return withRetry(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw ApiError.fromResponse(response.status, errorText)
      }

    if (request.stream !== false) {
      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new ApiError('Failed to get response reader')
      }

      const decoder = new TextDecoder()
      let finalResponse: GenerateResponse | null = null

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.slice(6))
                
                if (jsonData.error) {
                  throw new ApiError(jsonData.error)
                }

                const responseChunk = jsonData as GenerateResponse
                
                if (onChunk) {
                  onChunk(responseChunk)
                }

                if (responseChunk.done) {
                  finalResponse = responseChunk
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line, parseError)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

        return finalResponse
      } else {
        // Handle non-streaming response
        const data = await response.json()
        return data as GenerateResponse
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 408, 'Request timeout', true)
      }
      
      throw ApiError.fromNetworkError(error as Error)
    }
  })
}

/**
 * Get list of available models
 */
export async function getModels(): Promise<Model[]> {
  return withRetry(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}/models/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw ApiError.fromResponse(response.status, errorText)
      }

      const data = await response.json() as ModelsResponse
      return data.models
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 408, 'Request timeout', true)
      }
      
      throw ApiError.fromNetworkError(error as Error)
    }
  })
}

/**
 * Health check for the API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout for health check

    const response = await fetch(`${API_BASE_URL}/models/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Convert text to speech using the TTS API with streaming support
 */
export async function textToSpeech(
  request: TTSRequest,
  options: TTSOptions = {}
): Promise<Blob> {
  return withRetry(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const ttsRequest = {
        text: request.text,
        lang: request.lang || 'en',
        tld: request.tld || 'com',
        slow: request.slow || false,
      }

      const response = await fetch(`${API_BASE_URL}/tts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, audio/*',
        },
        body: JSON.stringify(ttsRequest),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw ApiError.fromResponse(response.status, errorText)
      }

      // Get content length for progress tracking
      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      const reader = response.body?.getReader()
      if (!reader) {
        throw new ApiError('Failed to get response reader')
      }

      // Collect audio chunks
      const chunks: Uint8Array[] = []
      let loaded = 0

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          chunks.push(value)
          loaded += value.length

          if (options.onProgress && total > 0) {
            options.onProgress(loaded, total)
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Combine chunks into a single blob
      const audioBlob = new Blob(chunks, { 
        type: response.headers.get('content-type') || 'audio/mpeg' 
      })

      if (options.onComplete) {
        options.onComplete(audioBlob)
      }

      return audioBlob

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        if (options.onError) {
          options.onError(error)
        }
        throw error
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError = new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 408, 'Request timeout', true)
        if (options.onError) {
          options.onError(timeoutError)
        }
        throw timeoutError
      }
      
      const networkError = ApiError.fromNetworkError(error as Error)
      if (options.onError) {
        options.onError(networkError)
      }
      throw networkError
    }
  })
}

/**
 * Create an audio URL from text for immediate playback
 */
export async function createAudioUrl(
  text: string,
  lang: string = 'en',
  options: TTSOptions = {}
): Promise<string> {
  const audioBlob = await textToSpeech({ text, lang }, options)
  return URL.createObjectURL(audioBlob)
}
