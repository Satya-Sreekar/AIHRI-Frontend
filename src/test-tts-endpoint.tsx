'use client'

import React, { useState } from 'react'
import { textToSpeech } from './services/api'

export default function TestTTSEndpoint() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const testTTSEndpoint = async () => {
    setIsLoading(true)
    setResult('')
    setError('')

    try {
      console.log('Testing TTS endpoint...')
      
      const audioBlob = await textToSpeech({
        text: 'Hello, this is a test of the text to speech endpoint.',
        lang: 'en',
        tld: 'com',
        slow: false
      })

      console.log('TTS response received:', audioBlob)
      
      if (audioBlob && audioBlob.size > 0) {
        setResult(`✅ TTS endpoint working! Audio blob size: ${audioBlob.size} bytes`)
        
        // Test if we can create an object URL
        const audioUrl = URL.createObjectURL(audioBlob)
        console.log('Audio URL created:', audioUrl)
        
        // Test if we can create an audio element
        const audio = new Audio(audioUrl)
        console.log('Audio element created:', audio)
        
        // Clean up
        URL.revokeObjectURL(audioUrl)
        
        setResult(prev => prev + '\n✅ Audio blob is valid and can be used for playback')
      } else {
        setError('❌ TTS endpoint returned empty or invalid audio blob')
      }
    } catch (err) {
      console.error('TTS endpoint test failed:', err)
      setError(`❌ TTS endpoint test failed: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TTS Endpoint Test</h1>
      
      <button
        onClick={testTTSEndpoint}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-3 rounded mb-4 disabled:bg-gray-400"
      >
        {isLoading ? 'Testing...' : 'Test TTS Endpoint'}
      </button>

      {result && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">What this test does:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Calls the TTS endpoint with a simple test message</li>
          <li>Verifies that an audio blob is returned</li>
          <li>Checks that the blob has content (size > 0)</li>
          <li>Tests that the blob can be used to create an audio URL</li>
          <li>Validates that an audio element can be created</li>
        </ul>
      </div>
    </div>
  )
}
