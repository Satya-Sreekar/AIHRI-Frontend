import json
import requests
from django.conf import settings
from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from .serializers import OllamaRequestSerializer, OllamaResponseSerializer, TTSRequestSerializer


@extend_schema(
    tags=['Ollama'],
    summary='Generate text with Ollama model',
    description='Send a prompt to an Ollama model and get a streaming response',
    request=OllamaRequestSerializer,
    responses={
        200: OllamaResponseSerializer,
        400: None,
        500: None,
    },
    examples=[
        OpenApiExample(
            'Basic Request',
            value={
                'model': 'llama3.2:latest',
                'prompt': 'What is the capital of France?',
                'stream': True,
                'options': {'temperature': 0.7}
            },
            request_only=True,
        ),
        OpenApiExample(
            'Response',
            value={
                'model': 'llama3.2:latest',
                'created_at': '2024-01-01T00:00:00Z',
                'response': 'The capital of France is Paris.',
                'done': True,
                'total_duration': 1000000,
                'load_duration': 500000,
                'prompt_eval_duration': 200000,
                'eval_duration': 300000
            },
            response_only=True,
        ),
    ],
)
@api_view(['POST'])
@parser_classes([JSONParser])
def generate_text(request):
    """
    Generate text using an Ollama model with streaming support.
    
    This endpoint sends a request to the Ollama API and streams the response back
    to the client. The response is streamed as Server-Sent Events (SSE) format.
    """
    serializer = OllamaRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    data = serializer.validated_data
    ollama_url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    
    # Prepare the request payload for Ollama
    ollama_payload = {
        'model': data['model'],
        'prompt': data['prompt'],
        'stream': data.get('stream', True),
    }
    
    if 'options' in data:
        ollama_payload['options'] = data['options']
    
    try:
        # Make streaming request to Ollama
        response = requests.post(
            ollama_url,
            json=ollama_payload,
            stream=True,
            headers={'Content-Type': 'application/json'},
            timeout=300  # 5 minutes timeout
        )
        
        if response.status_code != 200:
            return Response(
                {'error': f'Ollama API error: {response.status_code}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        def generate_stream():
            """Generator function to stream the response"""
            for line in response.iter_lines():
                if line:
                    try:
                        # Parse the JSON response from Ollama
                        json_data = json.loads(line.decode('utf-8'))
                        
                        # Convert to SSE format
                        sse_data = f"data: {json.dumps(json_data)}\n\n"
                        yield sse_data.encode('utf-8')
                        
                        # If this is the final response, break
                        if json_data.get('done', False):
                            break
                            
                    except json.JSONDecodeError:
                        continue
                    except Exception as e:
                        error_data = f"data: {json.dumps({'error': str(e)})}\n\n"
                        yield error_data.encode('utf-8')
                        break
        
        # Return streaming response
        return StreamingHttpResponse(
            generate_stream(),
            content_type='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to connect to Ollama: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'Unexpected error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=['Ollama'],
    summary='List available models',
    description='Get a list of available Ollama models',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'models': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'modified_at': {'type': 'string'},
                            'size': {'type': 'integer'},
                        }
                    }
                }
            }
        },
        500: None,
    },
)
@api_view(['GET'])
def list_models(request):
    """
    Get a list of available Ollama models.
    """
    ollama_url = f"{settings.OLLAMA_BASE_URL}/api/tags"
    
    try:
        response = requests.get(ollama_url, timeout=30)
        
        if response.status_code == 200:
            return Response(response.json())
        else:
            return Response(
                {'error': f'Ollama API error: {response.status_code}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to connect to Ollama: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'Unexpected error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 


@csrf_exempt
def text_to_speech(request):
    """
    Convert text to speech using gTTS (Google Text-to-Speech) with streaming support.
    
    This endpoint converts text to speech using Google's TTS service and streams 
    the audio response back to the client.
    """
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        return response
    
    # Handle GET request for testing
    if request.method == 'GET':
        # Default test parameters for GET request
        data = {
            'text': request.GET.get('text', 'Hello, this is a test of the text to speech system.'),
            'lang': request.GET.get('lang', 'en'),
            'tld': request.GET.get('tld', 'com'),
            'slow': request.GET.get('slow', 'false').lower() == 'true'
        }
    else:
        # Handle POST request with JSON data
        try:
            import json
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                return JsonResponse(
                    {'error': 'Content-Type must be application/json'},
                    status=400
                )
            
            # Validate required fields
            required_fields = ['text', 'lang', 'tld', 'slow']
            for field in required_fields:
                if field not in data:
                    return JsonResponse(
                        {'error': f'Missing required field: {field}'},
                        status=400
                    )
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON data'},
                status=400
            )
    
    # Import gTTS here to avoid import errors if not installed
    try:
        from gtts import gTTS
        import io
        import tempfile
        import os
    except ImportError:
        return JsonResponse(
            {'error': 'gTTS library not installed. Please install with: pip install gtts'},
            status=500
        )
    
    try:
        # Validate text input
        text = data['text'].strip()
        if not text:
            return JsonResponse(
                {'error': 'Text cannot be empty'},
                status=400
            )
        
        # Create gTTS object
        tts = gTTS(
            text=text,
            lang=data['lang'],
            tld=data['tld'],
            slow=data['slow']
        )
        
        # Use BytesIO to avoid file system issues
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Get the audio data
        audio_data = audio_buffer.getvalue()
        audio_buffer.close()
        
        if not audio_data:
            return JsonResponse(
                {'error': 'Failed to generate audio data'},
                status=500
            )
        
        # Stream the audio response
        def generate_audio_stream():
            """Generator function to stream the audio response"""
            try:
                # Stream the audio data in chunks
                chunk_size = 8192
                for i in range(0, len(audio_data), chunk_size):
                    chunk = audio_data[i:i + chunk_size]
                    if chunk:
                        yield chunk
            except Exception as e:
                print(f"TTS streaming error: {e}")
        
        # Return streaming response
        streaming_response = StreamingHttpResponse(
            generate_audio_stream(),
            content_type='audio/mpeg',
            headers={
                'Cache-Control': 'no-cache',
                'Content-Disposition': 'inline; filename="speech.mp3"',
                'Content-Length': str(len(audio_data)),
                'Accept-Ranges': 'bytes',
            }
        )
        
        return streaming_response
        
    except Exception as e:
        return JsonResponse(
            {'error': f'gTTS error: {str(e)}'},
            status=500
        )


@extend_schema(
    tags=['TTS'],
    summary='Test TTS functionality',
    description='Simple test endpoint to verify gTTS is working',
)
@api_view(['GET'])
def test_tts(request):
    """
    Test endpoint to verify gTTS functionality
    """
    try:
        from gtts import gTTS
        import io
        
        # Test with simple text
        test_text = "Hello, this is a test of the text to speech system."
        
        tts = gTTS(text=test_text, lang='en', tld='com', slow=False)
        
        # Use BytesIO to generate audio
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        audio_data = audio_buffer.getvalue()
        audio_buffer.close()
        
        return Response({
            'status': 'success',
            'message': 'gTTS is working correctly',
            'audio_size': len(audio_data),
            'test_text': test_text
        })
        
    except ImportError:
        return Response(
            {'error': 'gTTS library not installed'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'gTTS test failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )