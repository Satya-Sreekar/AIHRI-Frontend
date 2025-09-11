'use client'

import React, { useState } from 'react'
import { useTTS } from './hooks/useTTS'
import { 
  runAudioSystemTest, 
  quickAudioHealthCheck, 
  getAudioDiagnostics,
  type AudioSystemStatus 
} from './utils/audioTest'
import { textToSpeech, textToSpeechChunk } from './services/api'

export default function TestAudioRobustness() {
  const [testResults, setTestResults] = useState<AudioSystemStatus | null>(null)
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [diagnostics, setDiagnostics] = useState<Record<string, any> | null>(null)
  const [manualTestText, setManualTestText] = useState('Hello, this is a manual test of the audio system.')
  const [manualTestResult, setManualTestResult] = useState<string>('')
  const [isManualTesting, setIsManualTesting] = useState(false)

  const {
    isGenerating,
    isPlaying,
    error: ttsError,
    progress,
    speak,
    pause,
    resume,
    stop,
    audioRef
  } = useTTS({
    autoPlay: false,
    retryOnError: true,
    maxRetries: 3
  })

  // Run initial diagnostics
  React.useEffect(() => {
    setDiagnostics(getAudioDiagnostics())
  }, [])

  const runFullTest = async () => {
    setIsRunningTest(true)
    setTestResults(null)
    
    try {
      const results = await runAudioSystemTest()
      setTestResults(results)
    } catch (error) {
      console.error('Test failed:', error)
      setTestResults({
        browserSupport: { success: false, message: 'Test failed', error: 'Unknown error' },
        apiHealth: { success: false, message: 'Test failed', error: 'Unknown error' },
        ttsGeneration: { success: false, message: 'Test failed', error: 'Unknown error' },
        audioPlayback: { success: false, message: 'Test failed', error: 'Unknown error' },
        overall: { success: false, message: 'Test failed', error: 'Unknown error' }
      })
    } finally {
      setIsRunningTest(false)
    }
  }

  const runQuickTest = async () => {
    setIsRunningTest(true)
    
    try {
      const isHealthy = await quickAudioHealthCheck()
      setTestResults({
        browserSupport: { success: isHealthy, message: isHealthy ? 'Quick test passed' : 'Quick test failed' },
        apiHealth: { success: isHealthy, message: isHealthy ? 'Quick test passed' : 'Quick test failed' },
        ttsGeneration: { success: false, message: 'Not tested in quick mode' },
        audioPlayback: { success: false, message: 'Not tested in quick mode' },
        overall: { success: isHealthy, message: isHealthy ? 'Quick test passed' : 'Quick test failed' }
      })
    } catch (error) {
      console.error('Quick test failed:', error)
    } finally {
      setIsRunningTest(false)
    }
  }

  const runManualTest = async () => {
    setIsManualTesting(true)
    setManualTestResult('')
    
    try {
      setManualTestResult('Generating TTS...')
      const startTime = Date.now()
      
      const audioBlob = await textToSpeech({
        text: manualTestText,
        lang: 'en',
        tld: 'com',
        slow: false
      })
      
      const endTime = Date.now()
      
      if (audioBlob && audioBlob.size > 0) {
        setManualTestResult(`✅ TTS generated successfully! Size: ${audioBlob.size} bytes, Time: ${endTime - startTime}ms`)
        
        // Test playback
        const audio = new Audio(URL.createObjectURL(audioBlob))
        audio.play().then(() => {
          setManualTestResult(prev => prev + ' ✅ Audio playback started')
        }).catch((error) => {
          setManualTestResult(prev => prev + ` ❌ Audio playback failed: ${error.message}`)
        })
      } else {
        setManualTestResult('❌ TTS generation failed: Empty blob returned')
      }
    } catch (error) {
      setManualTestResult(`❌ Manual test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsManualTesting(false)
    }
  }

  const testChunkedTTS = async () => {
    setIsManualTesting(true)
    setManualTestResult('')
    
    try {
      setManualTestResult('Testing chunked TTS...')
      
      const chunks = [
        'This is the first chunk.',
        'This is the second chunk.',
        'This is the third chunk.'
      ]
      
      const results = await Promise.allSettled(
        chunks.map((chunk, index) => 
          textToSpeechChunk(chunk, {
            lang: 'en',
            tld: 'com',
            slow: false
          })
        )
      )
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      setManualTestResult(`Chunked TTS test: ${successful} successful, ${failed} failed`)
      
      if (failed > 0) {
        const errors = results
          .map((r, i) => r.status === 'rejected' ? `Chunk ${i + 1}: ${r.reason}` : null)
          .filter(Boolean)
        setManualTestResult(prev => prev + `\nErrors: ${errors.join(', ')}`)
      }
    } catch (error) {
      setManualTestResult(`❌ Chunked TTS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsManualTesting(false)
    }
  }

  const renderTestResult = (result: any) => {
    if (!result) return null
    
    return (
      <div className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="font-semibold flex items-center">
          {result.success ? '✅' : '❌'} {result.message}
        </div>
        {result.error && (
          <div className="text-sm text-red-600 mt-1">
            Error: {result.error}
          </div>
        )}
        {result.details && (
          <div className="text-sm text-gray-600 mt-1">
            <pre className="text-xs">{JSON.stringify(result.details, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audio System Robustness Test</h1>
      
      {/* Test Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runFullTest}
            disabled={isRunningTest}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isRunningTest ? 'Running Full Test...' : 'Run Full System Test'}
          </button>
          
          <button
            onClick={runQuickTest}
            disabled={isRunningTest}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isRunningTest ? 'Running Quick Test...' : 'Run Quick Test'}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderTestResult(testResults.browserSupport)}
            {renderTestResult(testResults.apiHealth)}
            {renderTestResult(testResults.ttsGeneration)}
            {renderTestResult(testResults.audioPlayback)}
          </div>
          
          <div className="mt-4">
            {renderTestResult(testResults.overall)}
          </div>
        </div>
      )}

      {/* Manual Testing */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manual Testing</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Text:</label>
            <textarea
              value={manualTestText}
              onChange={(e) => setManualTestText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={runManualTest}
              disabled={isManualTesting}
              className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
            >
              {isManualTesting ? 'Testing...' : 'Test TTS Generation'}
            </button>
            
            <button
              onClick={testChunkedTTS}
              disabled={isManualTesting}
              className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
            >
              {isManualTesting ? 'Testing...' : 'Test Chunked TTS'}
            </button>
          </div>
          
          {manualTestResult && (
            <div className="p-3 bg-gray-100 rounded">
              <pre className="text-sm whitespace-pre-wrap">{manualTestResult}</pre>
            </div>
          )}
        </div>
      </div>

      {/* TTS Hook Testing */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">TTS Hook Testing</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => speak(manualTestText)}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Test TTS Hook'}
            </button>
            
            <button
              onClick={pause}
              disabled={!isPlaying}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            >
              Pause
            </button>
            
            <button
              onClick={resume}
              disabled={isPlaying}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Resume
            </button>
            
            <button
              onClick={stop}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Stop
            </button>
          </div>
          
          <div className="space-y-2">
            <div>Status: {isGenerating ? 'Generating' : isPlaying ? 'Playing' : 'Idle'}</div>
            {progress > 0 && <div>Progress: {progress.toFixed(1)}%</div>}
            {ttsError && (
              <div className="text-red-600">
                Error: {ttsError.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      {diagnostics && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Diagnostics</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(diagnostics, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Hidden audio element for TTS hook */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}
