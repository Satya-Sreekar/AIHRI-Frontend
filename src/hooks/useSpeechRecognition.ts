"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void
  onFinalResult?: (transcript: string) => void
  onError?: (error: string) => void
  onStart?: () => void
  onStop?: () => void
  autoSendDelay?: number // milliseconds to wait before auto-sending
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const {
    onResult,
    onFinalResult,
    onError,
    onStart,
    onStop,
    autoSendDelay = 3000, // 3 seconds default
    continuous = true,
    interimResults = true,
    lang = 'en-US'
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<any>(null)
  const autoSendTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const finalTranscriptRef = useRef('')

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = interimResults
      recognitionRef.current.lang = lang
    }
  }, [continuous, interimResults, lang])

  // Setup recognition event handlers
  useEffect(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    const handleStart = () => {
      setIsListening(true)
      setError(null)
      finalTranscriptRef.current = ''
      onStart?.()
    }

    const handleResult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = finalTranscriptRef.current

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      finalTranscriptRef.current = finalTranscript
      const fullTranscript = finalTranscript + interimTranscript
      
      setTranscript(fullTranscript)
      onResult?.(fullTranscript)

      // Clear existing auto-send timeout
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current)
      }

      // Set new auto-send timeout for final results
      if (finalTranscript && autoSendDelay > 0) {
        autoSendTimeoutRef.current = setTimeout(() => {
          if (finalTranscript.trim()) {
            onFinalResult?.(finalTranscript.trim())
            setTranscript('')
            finalTranscriptRef.current = ''
          }
        }, autoSendDelay)
      }
    }

    const handleEnd = () => {
      setIsListening(false)
      onStop?.()
      
      // Clear auto-send timeout
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current)
        autoSendTimeoutRef.current = null
      }
    }

    const handleError = (event: any) => {
      setIsListening(false)
      let errorMessage = 'Speech recognition error'
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected'
          break
        case 'audio-capture':
          errorMessage = 'Audio capture failed'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied'
          break
        case 'network':
          errorMessage = 'Network error'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed'
          break
        case 'bad-grammar':
          errorMessage = 'Bad grammar'
          break
        case 'language-not-supported':
          errorMessage = 'Language not supported'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }
      
      setError(errorMessage)
      onError?.(errorMessage)
    }

    recognition.addEventListener('start', handleStart)
    recognition.addEventListener('result', handleResult)
    recognition.addEventListener('end', handleEnd)
    recognition.addEventListener('error', handleError)

    return () => {
      recognition.removeEventListener('start', handleStart)
      recognition.removeEventListener('result', handleResult)
      recognition.removeEventListener('end', handleEnd)
      recognition.removeEventListener('error', handleError)
    }
  }, [onResult, onFinalResult, onError, onStart, onStop, autoSendDelay])

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported')
      return
    }

    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('Failed to start speech recognition')
      onError?.('Failed to start speech recognition')
    }
  }, [isSupported, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    finalTranscriptRef.current = ''
    if (autoSendTimeoutRef.current) {
      clearTimeout(autoSendTimeoutRef.current)
      autoSendTimeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current)
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  }
}
