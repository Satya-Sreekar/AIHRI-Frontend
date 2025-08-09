/**
 * React hook for managing Text-to-Speech functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { textToSpeech, createAudioUrl, TTSRequest, ApiError } from '@/src/services/api'
import { TTS_CONFIG } from '@/src/config/api'

export interface UseTTSOptions {
  lang?: string
  tld?: string
  slow?: boolean
  autoPlay?: boolean
}

export interface UseTTSReturn {
  // State
  isGenerating: boolean
  isPlaying: boolean
  error: ApiError | null
  progress: number
  duration: number
  currentTime: number
  
  // Audio controls
  speak: (text: string) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  
  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>
  
  // Settings
  lang: string
  setLang: (lang: string) => void
  slow: boolean
  setSlow: (slow: boolean) => void
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  const [lang, setLang] = useState(options.lang || TTS_CONFIG.DEFAULT_LANG)
  const [slow, setSlow] = useState(options.slow || TTS_CONFIG.DEFAULT_SLOW)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentUrlRef = useRef<string | null>(null)

  // Setup audio element event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setError(new ApiError('Audio playback error'))
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current)
      }
    }
  }, [])

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      // Clean up previous audio URL
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current)
        currentUrlRef.current = null
      }

      const audioUrl = await createAudioUrl(text, lang, {
        onProgress: (loaded, total) => {
          if (total > 0) {
            setProgress((loaded / total) * 100)
          }
        },
        onError: (error) => {
          setError(error)
        }
      })

      currentUrlRef.current = audioUrl

      if (audioRef.current) {
        audioRef.current.src = audioUrl

        if (options.autoPlay !== false) {
          try {
            await audioRef.current.play()
          } catch (playError) {
            console.warn('Auto-play failed:', playError)
            // Auto-play might be blocked by browser policy
          }
        }
      }

      setProgress(100)
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        err instanceof Error ? err.message : 'TTS generation failed'
      )
      setError(apiError)
    } finally {
      setIsGenerating(false)
    }
  }, [lang, slow, options.autoPlay])

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.warn('Resume failed:', err)
        setError(new ApiError('Failed to resume audio playback'))
      })
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Math.max(0.25, Math.min(4, rate))
    }
  }, [])

  return {
    isGenerating,
    isPlaying,
    error,
    progress,
    duration,
    currentTime,
    speak,
    pause,
    resume,
    stop,
    setVolume,
    setPlaybackRate,
    audioRef,
    lang,
    setLang,
    slow,
    setSlow,
  }
}
