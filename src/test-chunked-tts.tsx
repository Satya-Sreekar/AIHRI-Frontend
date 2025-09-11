'use client'

import React, { useState } from 'react'
import { useChat } from './hooks/useChat'

export default function TestChunkedTTS() {
  const [inputText, setInputText] = useState('')
  const {
    messages,
    isGenerating,
    streamingMessage,
    sendMessage,
    stopTTS,
    isTTSPlaying,
    clearChat,
    initializeService,
    isServiceReady,
  } = useChat({
    autoInitialize: true,
    enableTTS: true,
  })

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    await sendMessage(inputText)
    setInputText('')
  }

  const handleStopTTS = () => {
    stopTTS()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chunked TTS Test</h1>
      
      <div className="mb-4">
        <button
          onClick={initializeService}
          disabled={isServiceReady}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50"
        >
          {isServiceReady ? 'Service Ready' : 'Initialize Service'}
        </button>
        
        <button
          onClick={clearChat}
          className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
        >
          Clear Chat
        </button>
        
        <button
          onClick={handleStopTTS}
          disabled={!isTTSPlaying()}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop TTS
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isServiceReady || isGenerating}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isServiceReady || isGenerating || !inputText.trim()}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Send Message'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Conversation:</h2>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded ${
              message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-100 mr-8'
            }`}
          >
            <div className="font-semibold">
              {message.role === 'user' ? 'You' : 'AI Interviewer'}
            </div>
            <div className="mt-1">{message.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {streamingMessage && (
          <div className="p-3 rounded bg-green-100 mr-8">
            <div className="font-semibold">AI Interviewer (Streaming)</div>
            <div className="mt-1">{streamingMessage}</div>
            <div className="text-xs text-gray-500 mt-1">
              Streaming... {isTTSPlaying() && '(TTS Playing)'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Type a message and press Enter or click Send</li>
          <li>• Watch as the AI response streams in real-time</li>
          <li>• Audio should start playing as soon as complete sentences are generated</li>
          <li>• Use the Stop TTS button to interrupt audio playback</li>
          <li>• The system breaks text into chunks at sentence endings or after ~50 characters</li>
        </ul>
      </div>
    </div>
  )
}
