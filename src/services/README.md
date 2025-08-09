# Chat Service Integration with TTS

This directory contains the chat service implementation for connecting the AI interviewer with the backend API, including Text-to-Speech functionality using gTTS.

## Overview

The chat service provides real-time AI-powered interview conversations with streaming support, error handling, retry logic, and integrated text-to-speech using Google's gTTS service.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Chat Service  │    │   Backend API   │
│   (React)       │────│   (TypeScript)  │────│   (Django)      │
│                 │    │                 │    │                 │
│ • RightSidebar  │    │ • ChatService   │    │ • Ollama API    │
│ • useChat Hook  │    │ • API Client    │    │ • gTTS Service  │
│ • useTTS Hook   │    │ • TTS Client    │    │ • Streaming     │
│ • Interview     │    │ • Error Handler │    │ • Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Files

### Core Services
- `api.ts` - Low-level API client with retry logic, error handling, and TTS support
- `chatService.ts` - High-level chat service for conversation management with TTS integration

### React Integration
- `../hooks/useChat.ts` - React hook for chat functionality
- `../hooks/useTTS.ts` - React hook for text-to-speech functionality
- `../config/api.ts` - Configuration and constants

## Features

### ✅ Streaming Responses
- Real-time AI responses using Server-Sent Events (SSE)
- Live typing indicators with cursor animation
- Progressive message building

### ✅ Error Handling
- Comprehensive error classification
- Automatic retry with exponential backoff
- User-friendly error messages
- Network timeout handling

### ✅ Chat Management
- Conversation history tracking
- Message state management
- Transcript integration
- System prompt configuration

### ✅ Text-to-Speech (gTTS)
- Streaming audio generation using Google TTS
- Multiple language support (English, Spanish, French, German, etc.)
- Configurable speech speed and regional accents
- Audio playback controls with play/pause functionality
- Automatic TTS for AI responses (configurable)

### ✅ UI Integration
- Interactive chat interface in RightSidebar
- Audio playback controls for each AI message
- TTS toggle button in sidebar header
- Loading states and disabled states
- Error alerts and notifications
- Mobile-responsive design

## Usage

### Basic Setup

```typescript
import { useChat } from '@/src/hooks/useChat'

function InterviewComponent() {
  const {
    transcript,
    isGenerating,
    error,
    streamingMessage,
    sendMessage,
    isServiceReady,
  } = useChat({
    model: 'llama3.2:latest',
    temperature: 0.7,
    enableTTS: true,
    ttsLang: 'en',
    autoInitialize: true,
  })

  const {
    speak,
    isPlaying,
    audioRef,
  } = useTTS({
    lang: 'en',
    autoPlay: false,
  })

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)
  }

  const handlePlayTTS = async (messageId: string, text: string) => {
    await speak(text)
  }

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }} />
      <RightSidebar
        transcript={transcript}
        onSendMessage={handleSendMessage}
        onPlayTTS={handlePlayTTS}
        isGenerating={isGenerating}
        error={error?.message}
        streamingMessage={streamingMessage}
        disabled={!isServiceReady}
        enableTTS={true}
      />
    </>
  )
}
```

### Configuration

Environment variables (add to `.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_MODEL=llama3.2:latest
```

Backend dependencies (already added to `requirements.txt`):

```bash
# Install in your backend virtual environment
pip install gtts==2.5.1
```

## Backend Requirements

The chat service expects the following backend endpoints:

### POST `/api/generate/`
Generate AI responses with streaming support.

**Request:**
```json
{
  "model": "llama3.2:latest",
  "prompt": "Interview question prompt",
  "stream": true,
  "options": {
    "temperature": 0.7,
    "num_predict": 300
  }
}
```

**Response (Streaming):**
```
data: {"model": "llama3.2:latest", "response": "Hello! ", "done": false}
data: {"model": "llama3.2:latest", "response": "I'm your AI interviewer.", "done": false}
data: {"model": "llama3.2:latest", "response": "", "done": true, "total_duration": 1000000}
```

### GET `/api/models/`
List available AI models.

**Response:**
```json
{
  "models": [
    {
      "name": "llama3.2:latest",
      "modified_at": "2024-01-01T00:00:00Z",
      "size": 1000000
    }
  ]
}
```

### POST `/api/tts/`
Convert text to speech using gTTS.

**Request:**
```json
{
  "text": "Hello, this is a test of the text to speech system.",
  "lang": "en",
  "tld": "com",
  "slow": false
}
```

**Response:**
Streaming MP3 audio data with `Content-Type: audio/mpeg`

**Supported Languages:**
- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi

**Supported TLDs (Regional Accents):**
- `com` - Global (default)
- `co.uk` - British English
- `com.au` - Australian English
- `ca` - Canadian English
- `co.in` - Indian English

## Error Handling

The service provides robust error handling for common scenarios:

- **Network errors**: Automatic retry with exponential backoff
- **API errors**: Specific error messages based on HTTP status codes
- **Timeout errors**: Configurable request timeouts
- **Rate limiting**: Graceful handling of rate limit responses
- **Model unavailable**: Clear messaging when models are not available

## Development

### Testing the Integration

1. Start the backend API server:
```bash
cd backend
python manage.py runserver
```

2. Ensure Ollama is running:
```bash
ollama serve
```

3. Pull a model (if not already available):
```bash
ollama pull llama3.2:latest
```

4. Start the frontend development server:
```bash
npm run dev
```

5. Navigate to the interview page and test the chat functionality

### Debugging

Enable debug logging by adding console.log statements in:
- `api.ts` - API request/response debugging
- `chatService.ts` - Conversation flow debugging
- `useChat.ts` - React state debugging

## Future Enhancements

- [ ] Message persistence to local storage
- [ ] Conversation export functionality
- [ ] Model switching during conversation
- [ ] Voice-to-text integration
- [ ] Message reaction/feedback system
- [ ] Conversation analytics and insights
