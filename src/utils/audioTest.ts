/**
 * Audio testing utilities for diagnosing audio issues
 */

import { textToSpeech, healthCheck, ApiError } from '@/src/services/api'

export interface AudioTestResult {
  success: boolean
  message: string
  details?: any
  error?: string
}

export interface AudioSystemStatus {
  browserSupport: AudioTestResult
  apiHealth: AudioTestResult
  ttsGeneration: AudioTestResult
  audioPlayback: AudioTestResult
  overall: AudioTestResult
}

/**
 * Test browser audio support
 */
export function testBrowserAudioSupport(): AudioTestResult {
  try {
    // Test if Audio API is supported
    if (typeof Audio === 'undefined') {
      return {
        success: false,
        message: 'Audio API not supported',
        error: 'Audio constructor not available'
      }
    }

    // Test if we can create an audio element
    const audio = new Audio()
    if (!audio) {
      return {
        success: false,
        message: 'Failed to create audio element',
        error: 'Audio constructor returned null'
      }
    }

    // Test basic audio properties
    if (typeof audio.play !== 'function') {
      return {
        success: false,
        message: 'Audio play method not available',
        error: 'audio.play is not a function'
      }
    }

    if (typeof audio.pause !== 'function') {
      return {
        success: false,
        message: 'Audio pause method not available',
        error: 'audio.pause is not a function'
      }
    }

    return {
      success: true,
      message: 'Browser audio support is working',
      details: {
        canCreateAudio: true,
        hasPlayMethod: true,
        hasPauseMethod: true
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Browser audio test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test API health
 */
export async function testAPIHealth(): Promise<AudioTestResult> {
  try {
    const isHealthy = await healthCheck()
    
    if (isHealthy) {
      return {
        success: true,
        message: 'API health check passed',
        details: { status: 'healthy' }
      }
    } else {
      return {
        success: false,
        message: 'API health check failed',
        error: 'Backend API is not responding'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'API health check error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test TTS generation
 */
export async function testTTSGeneration(): Promise<AudioTestResult> {
  try {
    const testText = 'Hello, this is a test of the text to speech system.'
    
    const startTime = Date.now()
    const audioBlob = await textToSpeech({
      text: testText,
      lang: 'en',
      tld: 'com',
      slow: false
    })
    const endTime = Date.now()
    
    if (!audioBlob || audioBlob.size === 0) {
      return {
        success: false,
        message: 'TTS generation returned empty audio',
        error: 'Generated blob is empty or null'
      }
    }
    
    return {
      success: true,
      message: 'TTS generation working',
      details: {
        blobSize: audioBlob.size,
        duration: endTime - startTime,
        contentType: audioBlob.type
      }
    }
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError(
      error instanceof Error ? error.message : 'TTS generation failed'
    )
    
    return {
      success: false,
      message: 'TTS generation failed',
      error: apiError.message,
      details: {
        status: apiError.status,
        isRetryable: apiError.isRetryable
      }
    }
  }
}

/**
 * Test audio playback
 */
export async function testAudioPlayback(): Promise<AudioTestResult> {
  try {
    // First generate some test audio
    const audioBlob = await textToSpeech({
      text: 'Test audio playback.',
      lang: 'en',
      tld: 'com',
      slow: false
    })
    
    if (!audioBlob || audioBlob.size === 0) {
      return {
        success: false,
        message: 'Cannot test playback with empty audio',
        error: 'No audio blob to test'
      }
    }
    
    // Create audio element and test playback
    const audio = new Audio(URL.createObjectURL(audioBlob))
    
    return new Promise<AudioTestResult>((resolve) => {
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(audio.src)
        resolve({
          success: false,
          message: 'Audio playback test timeout',
          error: 'Audio failed to load within 10 seconds'
        })
      }, 10000)
      
      audio.addEventListener('canplay', () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(audio.src)
        resolve({
          success: true,
          message: 'Audio playback test passed',
          details: {
            canLoad: true,
            duration: audio.duration,
            readyState: audio.readyState
          }
        })
      }, { once: true })
      
      audio.addEventListener('error', (event) => {
        clearTimeout(timeout)
        URL.revokeObjectURL(audio.src)
        resolve({
          success: false,
          message: 'Audio playback test failed',
          error: 'Audio element error event fired'
        })
      }, { once: true })
    })
  } catch (error) {
    return {
      success: false,
      message: 'Audio playback test error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Run comprehensive audio system test
 */
export async function runAudioSystemTest(): Promise<AudioSystemStatus> {
  console.log('Starting comprehensive audio system test...')
  
  const results: AudioSystemStatus = {
    browserSupport: testBrowserAudioSupport(),
    apiHealth: await testAPIHealth(),
    ttsGeneration: await testTTSGeneration(),
    audioPlayback: await testAudioPlayback(),
    overall: { success: false, message: 'Test incomplete' }
  }
  
  // Determine overall status
  const allTestsPassed = Object.values(results).every(result => 
    result.success
  )
  
  results.overall = {
    success: allTestsPassed,
    message: allTestsPassed 
      ? 'All audio system tests passed' 
      : 'Some audio system tests failed',
    details: {
      passedTests: Object.values(results).filter(r => r.success).length,
      totalTests: Object.keys(results).length - 1 // Exclude overall
    }
  }
  
  // Log results
  console.log('Audio system test results:', results)
  
  return results
}

/**
 * Quick audio health check
 */
export async function quickAudioHealthCheck(): Promise<boolean> {
  try {
    const browserSupport = testBrowserAudioSupport()
    if (!browserSupport.success) {
      console.error('Browser audio support failed:', browserSupport.error)
      return false
    }
    
    const apiHealth = await testAPIHealth()
    if (!apiHealth.success) {
      console.error('API health check failed:', apiHealth.error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Quick audio health check failed:', error)
    return false
  }
}

/**
 * Get audio system diagnostics
 */
export function getAudioDiagnostics(): Record<string, any> {
  return {
    userAgent: navigator.userAgent,
    audioSupport: {
      audioConstructor: typeof Audio !== 'undefined',
      audioContext: typeof AudioContext !== 'undefined',
      webkitAudioContext: typeof (window as any).webkitAudioContext !== 'undefined',
      mediaDevices: typeof navigator.mediaDevices !== 'undefined',
      getUserMedia: typeof navigator.mediaDevices?.getUserMedia === 'function'
    },
    browser: {
      isChrome: /Chrome/.test(navigator.userAgent),
      isFirefox: /Firefox/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      isEdge: /Edg/.test(navigator.userAgent)
    },
    timestamp: new Date().toISOString()
  }
}
