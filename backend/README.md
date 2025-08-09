# Django Ollama API

A Django REST API with Swagger/OpenAPI documentation that integrates with Ollama for text generation with streaming support.

## Features

- **Django REST Framework** with comprehensive API endpoints
- **Swagger/OpenAPI Documentation** with interactive UI
- **Streaming Responses** from Ollama models
- **CORS Support** for cross-origin requests
- **Environment Configuration** with dotenv support

## Prerequisites

- Python 3.8+
- Ollama installed and running locally (default: http://localhost:11434)

## Installation

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a .env file (optional):**
   ```bash
   # .env
   OLLAMA_BASE_URL=http://localhost:11434
   ```

## Running the Application

1. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```

2. **Access the API:**
   - API Base URL: http://localhost:8000/api/
   - Swagger Documentation: http://localhost:8000/api/docs/
   - ReDoc Documentation: http://localhost:8000/api/redoc/

## API Endpoints

### 1. Generate Text
**POST** `/api/generate/`

Send a prompt to an Ollama model and receive a streaming response.

**Request Body:**
```json
{
    "model": "llama3.2:latest",
    "prompt": "What is the capital of France?",
    "stream": true,
    "options": {
        "temperature": 0.7,
        "top_p": 0.9
    }
}
```

**Response:** Server-Sent Events (SSE) stream with JSON chunks

### 2. List Models
**GET** `/api/models/`

Get a list of available Ollama models.

**Response:**
```json
{
    "models": [
        {
            "name": "llama2",
            "modified_at": "2024-01-01T00:00:00Z",
            "size": 1234567890
        }
    ]
}
```

## Testing the API

### Using Swagger UI

1. Open http://localhost:8000/api/docs/
2. Click on the "Generate Text" endpoint
3. Click "Try it out"
4. Enter your request parameters
5. Click "Execute"

### Using curl

```bash
# Generate text with streaming
curl -X POST "http://localhost:8000/api/generate/" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:latest",
    "prompt": "What is the capital of France?",
    "stream": true
  }'

# List available models
curl -X GET "http://localhost:8000/api/models/"
```

### Using JavaScript (Frontend)

```javascript
// Generate text with streaming
const response = await fetch('http://localhost:8000/api/generate/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'llama3.2:latest',
        prompt: 'What is the capital of France?',
        stream: true
    })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            console.log(data.response);
            
            if (data.done) break;
        }
    }
}
```

## Configuration

### Environment Variables

- `OLLAMA_BASE_URL`: The base URL of your Ollama instance (default: http://localhost:11434)

### Django Settings

The application is configured with:
- CORS enabled for all origins (development only)
- Swagger/OpenAPI documentation
- Streaming response support
- SQLite database (can be changed to PostgreSQL/MySQL for production)

## Production Deployment

For production deployment, consider:

1. **Change the secret key** in `settings.py`
2. **Set DEBUG = False**
3. **Configure proper CORS settings**
4. **Use a production database** (PostgreSQL/MySQL)
5. **Set up proper static file serving**
6. **Use a production WSGI server** (Gunicorn/uWSGI)
7. **Set up reverse proxy** (Nginx)

## Troubleshooting

### Common Issues

1. **Ollama not running:**
   - Make sure Ollama is installed and running
   - Check if it's accessible at http://localhost:11434

2. **CORS errors:**
   - The API is configured to allow all origins in development
   - For production, configure specific origins in settings

3. **Streaming not working:**
   - Ensure the client supports Server-Sent Events
   - Check that the `stream` parameter is set to `true`

4. **Model not found:**
   - Use the `/api/models/` endpoint to see available models
   - Pull the model using `ollama pull <model_name>`

## License

This project is open source and available under the MIT License. 