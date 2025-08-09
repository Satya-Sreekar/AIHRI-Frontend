#!/usr/bin/env python3
"""
Test CORS functionality for TTS endpoint
"""
import requests
import json

def test_cors_preflight():
    """Test CORS preflight request"""
    print("Testing CORS preflight...")
    
    try:
        # Test OPTIONS request (CORS preflight)
        response = requests.options('http://localhost:8000/api/tts/', 
            headers={
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
            timeout=10
        )
        
        print(f"OPTIONS Status: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
        
        if response.status_code in [200, 204]:
            print("✓ CORS preflight working!")
        else:
            print("✗ CORS preflight failed")
            
    except Exception as e:
        print(f"✗ CORS preflight error: {e}")

def test_cors_actual_request():
    """Test actual TTS request with CORS headers"""
    print("\nTesting actual TTS request...")
    
    try:
        response = requests.post('http://localhost:8000/api/tts/', 
            json={
                'text': 'Hello CORS test',
                'lang': 'en',
                'tld': 'com',
                'slow': False
            },
            headers={
                'Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            },
            timeout=30
        )
        
        print(f"POST Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Content-Length: {len(response.content)}")
        
        print("CORS Headers in Response:")
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
        
        if response.status_code == 200 and len(response.content) > 0:
            print("✓ TTS request with CORS working!")
            with open('cors_test_audio.mp3', 'wb') as f:
                f.write(response.content)
            print("✓ Audio saved to cors_test_audio.mp3")
        else:
            print(f"✗ TTS request failed: {response.text}")
            
    except Exception as e:
        print(f"✗ TTS request error: {e}")

if __name__ == "__main__":
    test_cors_preflight()
    test_cors_actual_request()
