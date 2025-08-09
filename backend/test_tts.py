#!/usr/bin/env python3
"""
Test script for TTS functionality
"""
import requests
import json
import time

def test_tts():
    """Test the TTS endpoint"""
    print("Testing TTS endpoint...")
    
    try:
        response = requests.post('http://localhost:8000/api/tts/', 
            json={
                'text': 'Hello, this is a test',
                'lang': 'en',
                'tld': 'com',
                'slow': False
            },
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Content length: {len(response.content)}")
        
        if response.status_code == 200:
            print("✓ TTS endpoint working correctly!")
            if len(response.content) > 0:
                with open('test_audio.mp3', 'wb') as f:
                    f.write(response.content)
                print("✓ Audio saved to test_audio.mp3")
                print(f"✓ Audio data preview: {response.content[:50].hex()}")
            else:
                print("✗ Audio content is empty!")
        else:
            print(f"✗ Error response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django server is running.")
        print("Run: python manage.py runserver")
    except Exception as e:
        print(f"✗ Error: {e}")

def test_tts_simple():
    """Test TTS generation directly"""
    print("\nTesting gTTS directly...")
    
    try:
        from gtts import gTTS
        import io
        
        tts = gTTS(text='Hello world test', lang='en', tld='com', slow=False)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)
        data = buffer.getvalue()
        buffer.close()
        
        print(f"✓ Direct gTTS test successful: {len(data)} bytes")
        
        with open('direct_test.mp3', 'wb') as f:
            f.write(data)
        print("✓ Direct test audio saved to direct_test.mp3")
        
    except Exception as e:
        print(f"✗ Direct gTTS error: {e}")

if __name__ == "__main__":
    test_tts_simple()
    test_tts()
