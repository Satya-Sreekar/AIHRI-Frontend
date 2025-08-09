# Chat Service Integration

This directory contains the chat service implementation for connecting the AI interviewer with the backend API.

## Overview

The chat service provides real-time AI-powered interview conversations with streaming support, error handling, and retry logic.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Chat Service  │    │   Backend API   │
│   (React)       │────│   (TypeScript)  │────│   (Django)      │
│                 │    │                 │    │                 │
│ • RightSidebar  │    │ • ChatService   │    │ • Ollama API    │
│ • useChat Hook  │    │ • API Client    │    │ • Streaming     │
│ • Interview     │    │ • Error Handler │    │ • Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Files

### Core Services
- `api.ts` - Low-level API client with retry logic and error handling
- `chatService.ts` - High-level chat service for conversation management

### React Integration
- `../hooks/useChat.ts` - React hook for chat functionality
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

### ✅ UI Integration
- Interactive chat interface in RightSidebar
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
    autoInitialize: true,
  })

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)
  }

  return (
    <RightSidebar
      transcript={transcript}
      onSendMessage={handleSendMessage}
      isGenerating={isGenerating}
      error={error?.message}
      streamingMessage={streamingMessage}
      disabled={!isServiceReady}
    />
  )
}
```

### Configuration

Environment variables (add to `.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_MODEL=llama3.2:latest
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
