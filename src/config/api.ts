/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  DEFAULT_MODEL: process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'llama3.2:latest',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

export const CHAT_CONFIG = {
  MAX_TOKENS: 300,
  TEMPERATURE: 0.7,
  SYSTEM_PROMPT: `You are an experienced technical interviewer conducting a video interview. 
Your role is to:
- Ask relevant technical questions based on the candidate's responses
- Provide constructive feedback
- Guide the conversation naturally
- Be professional but friendly
- Focus on practical experience and problem-solving skills
- Ask follow-up questions to dive deeper into topics
- Occasionally present coding challenges or scenario-based questions

Keep your responses conversational and engaging. Each response should be 1-3 sentences typically.`,
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  API_UNAVAILABLE: 'Backend API is currently unavailable. Please try again later.',
  INVALID_RESPONSE: 'Received invalid response from server.',
  CHAT_SERVICE_ERROR: 'Chat service error occurred.',
  MODEL_NOT_AVAILABLE: 'The selected AI model is not available.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment before trying again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const
