# Speech Recognition Feature

## Overview
The HR Interview Dashboard now includes advanced speech-to-text functionality using the Webkit Speech Recognition API. This feature allows users to speak naturally during interviews and automatically converts speech to text with auto-send functionality.

## Features

### ✅ Speech-to-Text Conversion
- Real-time speech recognition using Webkit Speech Recognition API
- Live transcript display as you speak
- Support for multiple languages (default: English US)
- High accuracy with interim and final results

### ✅ Auto-Send Functionality
- Automatically sends messages after 3 seconds of silence
- Configurable delay (default: 3000ms)
- Prevents accidental sends with minimum content validation

### ✅ Visual Feedback
- Animated microphone button with pulsing indicator
- Real-time listening status in input fields
- Error messages for speech recognition issues
- Visual indicators for active listening state

### ✅ Cross-Platform Support
- Desktop sidebar integration
- Mobile transcript support
- Controls bar integration
- Responsive design across all screen sizes

## How to Use

### Starting Speech Recognition
1. **Desktop**: Click the microphone button in the controls bar or sidebar
2. **Mobile**: Tap the microphone button in the mobile transcript area
3. **Visual Feedback**: The button will pulse and show a red indicator when listening

### During Speech Recognition
- **Live Transcript**: Your speech appears in real-time in the input field
- **Interim Results**: See partial results as you speak
- **Final Results**: Complete sentences are processed after pauses
- **Auto-Send**: Messages are automatically sent after 3 seconds of silence

### Stopping Speech Recognition
- Click/tap the microphone button again to stop
- The system will automatically stop if no speech is detected
- Manual send button is disabled during active listening

## Technical Details

### Browser Support
- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Safari**: Limited support (may require HTTPS)
- **Firefox**: Limited support (may require HTTPS)

### API Configuration
```typescript
const speechRecognition = useSpeechRecognition({
  autoSendDelay: 3000,    // 3 seconds
  continuous: true,        // Continuous listening
  interimResults: true,    // Show partial results
  lang: 'en-US'           // Language setting
})
```

### Error Handling
The system handles various speech recognition errors:
- **No Speech**: When no audio is detected
- **Audio Capture**: Microphone access issues
- **Permission Denied**: Browser permission problems
- **Network Issues**: Connection problems
- **Language Support**: Unsupported language errors

## User Experience

### Visual Indicators
- **Listening State**: Pulsing microphone button with red indicator
- **Input Field**: Cyan border and background when active
- **Placeholder Text**: Changes to "Listening..." during recognition
- **Error Messages**: Red text with warning icon for issues

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual indicators for all states
- **Error Feedback**: Clear error messages for all failure modes

## Troubleshooting

### Common Issues

#### "Speech recognition not supported"
**Solution**: Use a supported browser (Chrome recommended)

#### "Microphone access denied"
**Solution**: 
1. Check browser permissions
2. Allow microphone access when prompted
3. Refresh the page and try again

#### "No speech detected"
**Solution**:
1. Check microphone connection
2. Ensure microphone is not muted
3. Speak clearly and at normal volume
4. Check for background noise

#### "Auto-send not working"
**Solution**:
1. Ensure you pause speaking for 3 seconds
2. Check that the transcript contains text
3. Verify the send button is not manually disabled

### Browser-Specific Settings

#### Chrome
1. Go to `chrome://settings/content/microphone`
2. Ensure the site is not blocked
3. Clear site data if needed

#### Firefox
1. Go to `about:preferences#privacy`
2. Check microphone permissions
3. Allow microphone access

#### Safari
1. Go to Safari > Preferences > Websites > Microphone
2. Ensure microphone access is allowed
3. Requires HTTPS for speech recognition

## Configuration Options

### Customizing Auto-Send Delay
```typescript
const speechRecognition = useSpeechRecognition({
  autoSendDelay: 5000, // 5 seconds instead of 3
})
```

### Language Settings
```typescript
const speechRecognition = useSpeechRecognition({
  lang: 'es-ES', // Spanish
})
```

### Continuous vs Single Recognition
```typescript
const speechRecognition = useSpeechRecognition({
  continuous: false, // Stop after first result
})
```

## Best Practices

### For Users
- Speak clearly and at normal volume
- Pause between sentences for better accuracy
- Use a quiet environment when possible
- Allow microphone permissions when prompted

### For Developers
- Always check for browser support before enabling
- Provide clear error messages for unsupported browsers
- Handle permission errors gracefully
- Test across different browsers and devices

## Future Enhancements

### Planned Features
- **Voice Commands**: Custom voice commands for navigation
- **Language Detection**: Automatic language detection
- **Accent Support**: Better support for different accents
- **Offline Mode**: Local speech recognition when possible
- **Voice Profiles**: Personalized recognition for better accuracy

### Integration Opportunities
- **AI Response Timing**: Sync with AI response generation
- **Interview Flow**: Voice-controlled interview progression
- **Accessibility**: Enhanced accessibility features
- **Analytics**: Speech pattern analysis for interview insights
