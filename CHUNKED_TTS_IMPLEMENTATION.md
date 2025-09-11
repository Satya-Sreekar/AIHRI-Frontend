# Chunked TTS Implementation

## Overview

This implementation provides real-time text-to-speech generation that breaks down AI responses into smaller chunks and generates audio for each chunk as it arrives, rather than waiting for the entire response to complete.

## Key Features

### 1. **Real-time Audio Generation**
- Text is processed in chunks as it streams from the AI
- Audio is generated immediately for each complete sentence or phrase
- No waiting for the entire response to complete

### 2. **Intelligent Chunking**
- Breaks text at natural sentence endings (., !, ?, :, ;)
- Also chunks after ~50 characters if no sentence ending is found
- Ensures audio chunks are meaningful and complete

### 3. **Sequential Audio Playback**
- Audio chunks are queued and played in order
- Automatic progression from one chunk to the next
- Smooth, continuous audio experience

### 4. **Error Handling**
- Graceful handling of TTS generation failures
- Continues playback even if individual chunks fail
- Comprehensive error reporting

## Architecture

### Components

#### 1. **ChunkedTTSService** (`src/services/chatService.ts`)
- Manages the audio queue and playback
- Handles chunk generation and sequencing
- Provides callback system for status updates

#### 2. **textToSpeechChunk** (`src/services/api.ts`)
- Optimized TTS function for small text chunks
- Shorter timeout (15 seconds) for faster response
- Streamlined for quick audio generation

#### 3. **Enhanced ChatService**
- Integrates chunked TTS with text streaming
- Processes incoming text chunks in real-time
- Manages text buffering and chunking logic

#### 4. **Updated useChat Hook**
- Provides TTS control methods (stop, check status)
- Handles TTS callbacks and state management
- Enables/disables chunked TTS functionality

## Usage

### Basic Setup

```typescript
import { useChat } from '@/src/hooks/useChat'

const {
  messages,
  isGenerating,
  streamingMessage,
  sendMessage,
  stopTTS,
  isTTSPlaying,
} = useChat({
  autoInitialize: true,
  enableTTS: true, // Enable chunked TTS
})
```

### TTS Control

```typescript
// Stop TTS playback
stopTTS()

// Check if TTS is currently playing
const playing = isTTSPlaying()

// Send a message (TTS will start automatically)
await sendMessage("Hello, how are you?")
```

### Configuration

```typescript
const config = {
  enableTTS: true,
  ttsLang: 'en',
  ttsTld: 'com',
  ttsSlow: false,
}
```

## How It Works

### 1. **Text Streaming**
```
AI Response: "Hello there! How are you doing today? I hope you're having a great day."
```

### 2. **Chunking Process**
```
Chunk 1: "Hello there!" (sentence ending)
Chunk 2: "How are you doing today?" (sentence ending)  
Chunk 3: "I hope you're having a great day." (sentence ending)
```

### 3. **Audio Generation**
```
Chunk 1 → TTS API → Audio Blob → Queue
Chunk 2 → TTS API → Audio Blob → Queue
Chunk 3 → TTS API → Audio Blob → Queue
```

### 4. **Sequential Playback**
```
Audio 1 plays → Audio 2 plays → Audio 3 plays
```

## Benefits

### 1. **Reduced Latency**
- Audio starts playing much sooner
- No waiting for complete response
- Better user experience

### 2. **Natural Flow**
- Audio follows text generation naturally
- Maintains conversation rhythm
- More engaging interaction

### 3. **Resource Efficiency**
- Smaller TTS requests
- Faster processing
- Better error recovery

### 4. **User Control**
- Can stop audio at any time
- Immediate feedback
- Better interaction control

## Testing

### Test Page
Visit `/test-tts` to test the chunked TTS functionality:

1. Type a message and send it
2. Watch as text streams in real-time
3. Listen to audio as it starts playing immediately
4. Use the Stop TTS button to interrupt playback

### Expected Behavior
- Text appears character by character
- Audio starts playing after first complete sentence
- Audio continues as more text arrives
- Smooth, continuous audio experience

## Configuration Options

### Chunking Parameters
- **Sentence endings**: `.`, `!`, `?`, `:`, `;`
- **Max chunk size**: ~50 characters
- **Min chunk size**: 1 character

### TTS Parameters
- **Language**: Configurable (default: 'en')
- **Speed**: Configurable (default: normal)
- **Timeout**: 15 seconds per chunk

### Audio Playback
- **Queue management**: Automatic
- **Error handling**: Graceful degradation
- **Memory management**: Automatic cleanup

## Troubleshooting

### Common Issues

1. **Audio not playing**
   - Check browser autoplay settings
   - Verify TTS service is running
   - Check network connectivity

2. **Chunks too small/large**
   - Adjust chunking parameters in `processTextChunk()`
   - Modify sentence ending detection

3. **Audio delays**
   - Check TTS service performance
   - Verify network latency
   - Consider reducing chunk size

### Debug Information
- Console logs show chunk generation status
- TTS callback events provide detailed feedback
- Error handling provides specific error messages

## Future Enhancements

### Potential Improvements
1. **Adaptive chunking** based on response speed
2. **Voice selection** for different speakers
3. **Audio effects** and transitions
4. **Caching** for repeated phrases
5. **Background processing** for better performance

### Performance Optimizations
1. **Parallel TTS generation** for multiple chunks
2. **Audio compression** for faster streaming
3. **Predictive chunking** based on AI model behavior
4. **Memory pooling** for audio blobs
