import json
import requests
from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from .serializers import OllamaRequestSerializer, OllamaResponseSerializer


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