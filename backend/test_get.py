#!/usr/bin/env python3
"""
Test GET request to TTS endpoint
"""
import requests

def test_get_tts():
    """Test GET request to TTS endpoint"""
    print("Testing GET request to TTS endpoint...")
    
    try:
        # Test GET request
        response = requests.get(
            'http://localhost:8000/api/tts/?text=Hello%20GET%20test&lang=en', 
            timeout=30
        )
        
        print(f"GET Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Content-Length: {len(response.content)}")
        
        if response.status_code == 200:
            print("✓ GET request working!")
            if len(response.content) > 0:
                with open('get_test.mp3', 'wb') as f:
                    f.write(response.content)
                print("✓ GET audio saved to get_test.mp3")
            else:
                print("✗ Empty audio content")
        else:
            print(f"✗ GET Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django server is running.")
    except Exception as e:
        print(f"✗ GET Error: {e}")

if __name__ == "__main__":
    test_get_tts()
