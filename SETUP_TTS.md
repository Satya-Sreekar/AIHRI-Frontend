# TTS Setup Guide

This guide explains how to set up the Text-to-Speech functionality using gTTS (Google Text-to-Speech).

## 🎯 Overview

The TTS implementation uses gTTS, which is free and doesn't require API keys. It provides:
- Multiple language support
- Regional accent variations
- Streaming audio delivery
- Integration with the chat service

## 📋 Prerequisites

1. **Python Backend**: Django REST Framework
2. **Node.js Frontend**: Next.js/React
3. **Internet Connection**: Required for gTTS to work

## 🚀 Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install gtts==2.5.1
# or if using the requirements file:
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
# Backend Configuration
OLLAMA_BASE_URL=http://localhost:11434
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=True

# Note: No API keys needed for gTTS!
```

### 3. Run Migrations and Start Server

```bash
python manage.py migrate
python manage.py runserver
```

### 4. Test TTS Endpoint

```bash
curl -X POST http://localhost:8000/api/tts/ \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the text to speech system.",
    "lang": "en",
    "tld": "com",
    "slow": false
  }' \
  --output test_speech.mp3
```

## 🎨 Frontend Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_MODEL=llama3.2:latest
```

### 2. Install Dependencies

```bash
npm install
# Dependencies are already configured in package.json
```

### 3. Start Development Server

```bash
npm run dev
```

## 🎵 TTS Features

### Language Support

The system supports multiple languages:

| Language | Code | Example |
|----------|------|---------|
| English | `en` | "Hello, how are you?" |
| Spanish | `es` | "Hola, ¿cómo estás?" |
| French | `fr` | "Bonjour, comment allez-vous?" |
| German | `de` | "Hallo, wie geht es dir?" |
| Italian | `it` | "Ciao, come stai?" |
| Portuguese | `pt` | "Olá, como você está?" |
| Russian | `ru` | "Привет, как дела?" |
| Japanese | `ja` | "こんにちは、元気ですか？" |
| Korean | `ko` | "안녕하세요, 어떻게 지내세요?" |
| Chinese | `zh` | "你好，你好吗？" |
| Arabic | `ar` | "مرحبا، كيف حالك؟" |
| Hindi | `hi` | "नमस्ते, आप कैसे हैं?" |

### Regional Accents (TLD)

Configure regional variations:

| Region | TLD | Description |
|--------|-----|-------------|
| Global | `com` | Standard accent |
| British | `co.uk` | British English |
| Australian | `com.au` | Australian English |
| Canadian | `ca` | Canadian English |
| Indian | `co.in` | Indian English |

### Configuration Options

```typescript
// Chat service with TTS
const chat = useChat({
  enableTTS: true,
  ttsLang: 'en',
  ttsTld: 'com',
  ttsSlow: false,
})

// Standalone TTS
const tts = useTTS({
  lang: 'en',
  tld: 'com',
  slow: false,
  autoPlay: false,
})
```

## 🎮 Usage Examples

### Basic TTS

```typescript
import { useTTS } from '@/src/hooks/useTTS'

function MyComponent() {
  const { speak, isGenerating, isPlaying } = useTTS()

  const handleSpeak = () => {
    speak("Hello, this is a test message!")
  }

  return (
    <button onClick={handleSpeak} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : isPlaying ? 'Playing...' : 'Speak'}
    </button>
  )
}
```

### Chat with Auto-TTS

```typescript
import { useChat } from '@/src/hooks/useChat'

function ChatComponent() {
  const chat = useChat({
    enableTTS: true, // Auto-generate speech for AI responses
    ttsLang: 'en',
  })

  return (
    <RightSidebar
      {...chat}
      enableTTS={true}
      onTTSToggle={(enabled) => {
        chat.updateConfig({ enableTTS: enabled })
      }}
    />
  )
}
```

## 🔧 Troubleshooting

### Common Issues

1. **No audio output**
   - Check browser audio permissions
   - Ensure audio is not muted
   - Try different browsers

2. **TTS generation fails**
   - Check internet connection
   - Verify backend server is running
   - Check Django logs for errors

3. **Slow TTS generation**
   - gTTS requires internet connection
   - Large texts take longer to process
   - Consider breaking long texts into chunks

### Debug Mode

Enable debug logging:

```typescript
// In your component
useEffect(() => {
  console.log('TTS Debug:', {
    isGenerating,
    isPlaying,
    error,
    progress,
  })
}, [isGenerating, isPlaying, error, progress])
```

## 📊 Performance Tips

1. **Chunk Large Texts**: Break long messages into smaller parts
2. **Cache Audio**: Consider caching frequently used phrases
3. **Preload Common Responses**: Generate TTS for common interview questions
4. **Error Handling**: Always provide fallbacks for TTS failures

## 🌍 Production Considerations

1. **Rate Limiting**: gTTS may have rate limits in production
2. **Caching**: Consider implementing server-side audio caching
3. **CDN**: Serve generated audio files from a CDN
4. **Monitoring**: Monitor TTS generation success rates
5. **Fallbacks**: Always provide text fallbacks when audio fails

## 🎉 Next Steps

1. Test the TTS functionality in your interview flow
2. Customize voices and languages based on your user base
3. Implement audio caching for better performance
4. Add voice selection UI for users
5. Consider adding speech-to-text for complete audio interaction

The TTS system is now fully integrated and ready to enhance your AI interview experience!
