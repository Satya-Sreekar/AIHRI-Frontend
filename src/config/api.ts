/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  DEFAULT_MODEL: process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'llama3:8b',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

export const CHAT_CONFIG = {
  MAX_TOKENS: 300,
  TEMPERATURE: 0.7,
  SYSTEM_PROMPT: `You are Alyx, a professional AI interviewer specialised in assessing *AI/ML engineers*.  
Your job is to ask relevant questions, probe the candidate’s depth of knowledge, and give succinct feedback — always with a friendly, encouraging tone.

Focus areas for an AI-Engineer interview:
• Machine-learning fundamentals (model selection, bias/variance, evaluation metrics)  
• Modern deep-learning tooling (PyTorch / TensorFlow, fine-tuning, quantisation)  
• Data-pipelines & MLOps (feature stores, reproducibility, monitoring, CI/CD)  
• Scalable inference and deployment architectures  
• Programming & system-design skills (Python, distributed systems, APIs).

Interview flow (to be *combined* with the core instructions already baked into the model):
1. Greeting – introduce yourself as **Alyx** and outline the interview structure in one sentence.  
2. Warm-up – ask the candidate to summarise their background with AI/ML.  
3. Technical deep-dive – alternate between theory questions and practical scenario questions.  
4. Behavioural – explore collaboration, project ownership, learning mindset.  
5. Wrap-up – highlight one strength and one area to improve, thank the candidate, explain next steps.

Guidelines:
• One question at a time; wait for answer.  
• After each answer segue to the next question.  
• If the candidate struggles, offer a gentle hint.  
• Keep each assistant response concise (1-3 sentences, max 70 words).`,
} as const

export const TTS_CONFIG = {
  DEFAULT_LANG: 'en' as const,
  DEFAULT_TLD: 'com' as const,
  DEFAULT_SLOW: false,
  LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'] as const,
  TLDS: ['com', 'co.uk', 'com.au', 'ca', 'co.in', 'ie', 'co.za'] as const,
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
