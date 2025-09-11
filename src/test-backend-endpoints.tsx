'use client'

import React, { useState } from 'react'
import { textToSpeech, generateText, getModels, healthCheck } from './services/api'

export default function TestBackendEndpoints() {
  const [results, setResults] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testAllEndpoints = async () => {
    setIsTesting(true)
    setResults([])

    try {
      // Test 1: Health Check
      addResult('Testing health check endpoint...')
      try {
        const health = await healthCheck()
        addResult(`✅ Health check passed: ${JSON.stringify(health)}`)
      } catch (error) {
        addResult(`❌ Health check failed: ${error}`)
      }

      // Test 2: Get Models
      addResult('Testing models endpoint...')
      try {
        const models = await getModels()
        addResult(`✅ Models endpoint working: ${models.length} models available`)
      } catch (error) {
        addResult(`❌ Models endpoint failed: ${error}`)
      }

      // Test 3: TTS Endpoint
      addResult('Testing TTS endpoint...')
      try {
        const audioBlob = await textToSpeech({
          text: 'Test TTS endpoint',
          lang: 'en',
          tld: 'com',
          slow: false
        })
        addResult(`✅ TTS endpoint working: ${audioBlob.size} bytes generated`)
      } catch (error) {
        addResult(`❌ TTS endpoint failed: ${error}`)
      }

      // Test 4: Generate Text Endpoint
      addResult('Testing generate text endpoint...')
      try {
        const response = await generateText({
          model: 'alyx:latest',
          prompt: 'Say hello in one sentence.',
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 50
          }
        })
        addResult(`✅ Generate text endpoint working: "${response?.response || 'No response'}"`)
      } catch (error) {
        addResult(`❌ Generate text endpoint failed: ${error}`)
      }

    } catch (error) {
      addResult(`❌ Overall test failed: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend Endpoints Test</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testAllEndpoints}
            disabled={isTesting}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {isTesting ? 'Testing...' : 'Test All Endpoints'}
          </button>

          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No test results yet. Click "Test All Endpoints" to start.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
