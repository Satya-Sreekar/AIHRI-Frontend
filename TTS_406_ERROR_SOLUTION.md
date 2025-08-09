# TTS 406 Error Solution Documentation

## Issue Summary
**Date**: August 9, 2025  
**Error**: HTTP 406 "Not Acceptable" on TTS endpoint  
**Impact**: Automatic Text-to-Speech functionality failing in AI interview system

## Problem Description

### Error Details
- **HTTP Status**: 406 Not Acceptable
- **Error Message**: "Could not satisfy the request Accept header"
- **Endpoint**: `POST /api/tts/`
- **Request Headers**: `Accept: audio/mpeg, audio/*`
- **Expected Response**: Audio stream (MP3 format)

### Symptoms
1. Frontend TTS requests failing with 406 error
2. Django logs showing: `"POST /api/tts/ HTTP/1.1" 406 57`
3. Frontend unable to generate automatic audio for AI responses

## Root Cause Analysis

### Technical Cause
The issue was caused by **Django REST Framework's content negotiation system** conflicting with direct audio streaming:

1. **DRF Decorators**: The TTS endpoint used `@api_view` and `@parser_classes` decorators
2. **Content Negotiation**: DRF expects to serialize all responses through its serialization system
3. **StreamingHttpResponse**: Our endpoint returned raw audio as `StreamingHttpResponse`
4. **Accept Header Conflict**: DRF couldn't satisfy `Accept: audio/mpeg` because it was trying to serialize the response as JSON

### Code Location
**File**: `backend/api/views.py`  
**Function**: `text_to_speech(request)`

## Solution Implementation

### Before (Problematic Code)
```python
@extend_schema(...)
@api_view(['GET', 'POST', 'OPTIONS'])
@parser_classes([JSONParser])
def text_to_speech(request):
    # ... TTS logic ...
    return StreamingHttpResponse(generate_audio_stream(), content_type='audio/mpeg')
```

### After (Fixed Code)
```python
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse

@csrf_exempt
def text_to_speech(request):
    """Convert text to speech using gTTS with streaming support"""
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        return response
    
    # Handle POST with manual JSON parsing
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            return JsonResponse({'error': 'Content-Type must be application/json'}, status=400)
        
        # Manual validation instead of DRF serializer
        required_fields = ['text', 'lang', 'tld', 'slow']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
                
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
    # ... TTS generation logic (unchanged) ...
    
    # Return StreamingHttpResponse directly (no DRF serialization)
    return StreamingHttpResponse(generate_audio_stream(), content_type='audio/mpeg')
```

### Key Changes Made

1. **Removed DRF Decorators**:
   - `@api_view(['GET', 'POST', 'OPTIONS'])`
   - `@parser_classes([JSONParser])`
   - `@extend_schema(...)`

2. **Added Django Decorators**:
   - `@csrf_exempt` for cross-origin requests

3. **Updated Imports**:
   ```python
   from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
   from django.views.decorators.csrf import csrf_exempt
   ```

4. **Manual Request Handling**:
   - Manual JSON parsing instead of DRF serializers
   - Manual field validation
   - Direct error responses using `JsonResponse`

5. **Enhanced CORS Headers**:
   - Added `Accept` to allowed headers
   - Explicit CORS preflight handling

## Testing and Verification

### Test Command
```python
import requests

r = requests.post('http://localhost:8000/api/tts/', 
                 json={'text': 'Hello test', 'lang': 'en', 'tld': 'com', 'slow': False}, 
                 headers={'Accept': 'audio/mpeg'})
print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('Content-Type')}")
print(f"Content length: {len(r.content)}")
```

### Results
- **Before Fix**: `Status: 406` - "Could not satisfy the request Accept header"
- **After Fix**: `Status: 200`, `Content-Type: audio/mpeg`, `Content length: 9,984 bytes`

## Frontend Impact

### Automatic TTS Features Now Working
1. ✅ AI messages automatically trigger TTS generation
2. ✅ Audio streaming with progress indicators
3. ✅ Auto-play functionality for latest AI responses
4. ✅ Manual replay controls for all AI messages
5. ✅ Visual status indicators (generating, ready, playing)

### UI Status Indicators
- **Yellow Download Icon**: Audio being generated
- **Green Play Button**: Audio ready to play
- **Cyan Pause Button**: Audio currently playing

## Lessons Learned

### When to Avoid DRF
**Don't use Django REST Framework decorators when**:
1. Returning non-JSON responses (binary data, files, streams)
2. Need direct control over HTTP response headers
3. Implementing custom streaming responses
4. Content negotiation conflicts with response type

### Alternative Approaches
1. **Plain Django Views**: For binary/streaming responses
2. **Custom DRF Renderers**: If you must stay within DRF
3. **Separate Endpoints**: JSON API + separate file/stream endpoints

## Prevention Strategy

### Code Review Checklist
- [ ] Does endpoint return non-JSON data?
- [ ] Are custom headers required?
- [ ] Is streaming response needed?
- [ ] Will DRF content negotiation conflict?

### Architectural Guidelines
1. **Use DRF for**: Standard JSON APIs
2. **Use plain Django for**: File uploads/downloads, streaming, binary data
3. **Document exceptions**: When mixing DRF and plain Django views

## Related Files Modified
- `backend/api/views.py` - TTS endpoint fix
- `src/hooks/useChat.ts` - Frontend TTS integration
- `src/interview/RightSidebar.tsx` - TTS UI indicators
- `src/services/api.ts` - TTS request handling

## Environment Details
- **Django Version**: Latest
- **Django REST Framework**: Latest  
- **gTTS Version**: 2.5.1
- **Frontend**: React/TypeScript with Next.js
- **Audio Format**: MP3 (audio/mpeg)

---

**Resolution Status**: ✅ **RESOLVED**  
**System Status**: Automatic TTS functionality fully operational  
**Date Resolved**: August 9, 2025
