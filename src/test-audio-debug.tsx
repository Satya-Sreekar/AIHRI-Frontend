'use client'

import React, { useState, useRef } from 'react'
import { SimpleChatService as ChatService } from './services/simpleChatService'
import { textToSpeech } from './services/api'

export default function TestAudioDebug() {
  const [testText, setTestText] = useState('Hello, this is a test of the text to speech system.')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const chatServiceRef = useRef<ChatService | null>(null)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDirectTTS = async () => {
    setIsGenerating(true)
    setError(null)
    addLog('Starting direct TTS test...')

    try {
      const audioBlob = await textToSpeech({
        text: testText,
        lang: 'en',
        tld: 'com',
        slow: false
      })

      addLog(`TTS generated successfully! Size: ${audioBlob.size} bytes`)

      if (audioRef.current) {
        const audioUrl = URL.createObjectURL(audioBlob)
        audioRef.current.src = audioUrl
        
        audioRef.current.addEventListener('canplay', () => {
          addLog('Audio is ready to play')
        }, { once: true })

        audioRef.current.addEventListener('play', () => {
          setIsPlaying(true)
          addLog('Audio started playing')
        }, { once: true })

        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false)
          addLog('Audio finished playing')
          URL.revokeObjectURL(audioUrl)
        }, { once: true })

        audioRef.current.addEventListener('error', (e) => {
          setIsPlaying(false)
          addLog(`Audio error: ${e}`)
          URL.revokeObjectURL(audioUrl)
        }, { once: true })

        try {
          await audioRef.current.play()
          addLog('Audio play() called successfully')
        } catch (playError) {
          addLog(`Audio play() failed: ${playError}`)
          setError(`Play failed: ${playError}`)
        }
      }
    } catch (error) {
      addLog(`TTS generation failed: ${error}`)
      setError(`Generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const testChatServiceTTS = async () => {
    if (!chatServiceRef.current) {
      addLog('Creating new ChatService instance...')
      chatServiceRef.current = new ChatService({
        model: 'alyx:latest',
        enableTTS: true,
        ttsLang: 'en',
        ttsTld: 'com',
        ttsSlow: false
      }, {
        onMessageStart: (messageId) => {
          addLog(`ChatService: Message generation started: ${messageId}`)
        },
        onMessageComplete: (message) => {
          addLog(`ChatService: Message completed: "${message.content}"`)
        },
        onTTSStart: (messageId) => {
          addLog(`ChatService TTS started: ${messageId}`)
        },
        onTTSComplete: (messageId, blob) => {
          addLog(`ChatService TTS completed for ${messageId}, size: ${blob.size} bytes`)
        },
        onError: (error) => {
          addLog(`ChatService error: ${error.message}`)
        }
      })
      addLog('ChatService instance created with TTS enabled')
    }

    addLog('Testing ChatService TTS...')
    addLog(`Sending message: "${testText}"`)
    try {
      const response = await chatServiceRef.current.sendMessage(testText)
      addLog(`ChatService message sent successfully. Response: "${response?.content}"`)
    } catch (error) {
      addLog(`ChatService error: ${error}`)
      setError(`ChatService failed: ${error}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      addLog('Audio stopped manually')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audio Debug Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Text:</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={testDirectTTS}
              disabled={isGenerating}
              className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : 'Test Direct TTS'}
            </button>

            <button
              onClick={testChatServiceTTS}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Test ChatService TTS
            </button>

            <button
              onClick={stopAudio}
              disabled={!isPlaying}
              className="w-full bg-red-500 text-white p-2 rounded disabled:bg-gray-400"
            >
              Stop Audio
            </button>

                         <button
               onClick={clearLogs}
               className="w-full bg-gray-500 text-white p-2 rounded"
             >
               Clear Logs
             </button>

          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          <audio ref={audioRef} controls className="w-full" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Debug Logs:</h3>
          <div className="bg-gray-100 p-3 rounded h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Run a test to see debug information.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
