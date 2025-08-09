#!/usr/bin/env python3
"""
Test script for the Django Ollama API
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_list_models():
    """Test the list models endpoint"""
    print("Testing list models endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/models/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data.get('models', []))} models")
            for model in data.get('models', []):
                print(f"  - {model.get('name', 'Unknown')}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API. Make sure the server is running.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_generate_text():
    """Test the generate text endpoint with streaming"""
    print("\nTesting generate text endpoint...")
    try:
        payload = {
            "model": "llama3.2:latest",
            "prompt": "What is the capital of France? Answer in one sentence.",
            "stream": True,
            "options": {
                "temperature": 0.7
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/generate/",
            json=payload,
            stream=True,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Success! Streaming response:")
            full_response = ""
            
            for line in response.iter_lines():
                if line:
                    try:
                        # Parse SSE format
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data: '):
                            data = json.loads(line_str[6:])
                            
                            if 'response' in data:
                                print(data['response'], end='', flush=True)
                                full_response += data['response']
                            
                            if data.get('done', False):
                                print("\n✅ Stream completed!")
                                break
                                
                    except json.JSONDecodeError:
                        continue
                    except Exception as e:
                        print(f"\n❌ Error parsing response: {str(e)}")
                        break
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API. Make sure the server is running.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_swagger_docs():
    """Test if Swagger documentation is accessible"""
    print("\nTesting Swagger documentation...")
    try:
        response = requests.get("http://localhost:8000/api/docs/")
        if response.status_code == 200:
            print("✅ Swagger documentation is accessible at http://localhost:8000/api/docs/")
        else:
            print(f"❌ Error: {response.status_code} - Swagger docs not accessible")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to Swagger docs. Make sure the server is running.")

if __name__ == "__main__":
    print("🧪 Testing Django Ollama API")
    print("=" * 40)
    
    test_list_models()
    test_generate_text()
    test_swagger_docs()
    
    print("\n" + "=" * 40)
    print("🎉 Test completed!")
    print("\nTo access the API documentation, visit:")
    print("  - Swagger UI: http://localhost:8000/api/docs/")
    print("  - ReDoc: http://localhost:8000/api/redoc/") 