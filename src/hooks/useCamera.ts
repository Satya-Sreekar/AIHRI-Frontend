import { useState, useRef, useCallback, useEffect } from 'react'

interface CameraDevice {
  deviceId: string
  label: string
  groupId: string
}

interface UseCameraReturn {
  availableCameras: CameraDevice[]
  selectedCamera: string
  isLoadingCamera: boolean
  cameraError: string
  videoRef: React.RefObject<HTMLVideoElement>
  streamRef: React.MutableRefObject<MediaStream | null>
  isVideoOn: boolean
  isAudioOn: boolean
  detectCameras: () => Promise<void>
  startVideoStream: () => Promise<void>
  stopVideoStream: () => void
  handleCameraChange: (deviceId: string) => void
  toggleVideo: () => void
  toggleAudio: () => void
  retryCamera: () => Promise<void>
}

export function useCamera(): UseCameraReturn {
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string>("")
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isMountedRef = useRef(true)

  // Check if browser supports getUserMedia
  const checkBrowserSupport = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported in this browser')
    }
  }, [])

  // Detect available cameras
  const detectCameras = useCallback(async () => {
    try {
      checkBrowserSupport()
      
      console.log('Detecting cameras...')
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('All devices:', devices)
      
      const cameras = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
          groupId: device.groupId
        }))
      
      console.log('Available cameras:', cameras)
      setAvailableCameras(cameras)
      
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId)
        console.log('Selected first camera:', cameras[0].deviceId)
      }
    } catch (error) {
      console.error('Error detecting cameras:', error)
      setCameraError(`Failed to detect cameras: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [selectedCamera, checkBrowserSupport])

  // Start video stream
  const startVideoStream = useCallback(async () => {
    if (!selectedCamera) {
      console.log('No camera selected, skipping stream start')
      return
    }
    
    setIsLoadingCamera(true)
    setCameraError("")
    
    try {
      checkBrowserSupport()
      
      console.log('Starting video stream with camera:', selectedCamera)
      
      // Stop existing stream
      if (streamRef.current) {
        console.log('Stopping existing stream')
        streamRef.current.getTracks().forEach(track => {
          track.stop()
          console.log('Stopped track:', track.kind)
        })
        streamRef.current = null
      }

      // Request permissions first
      console.log('Requesting camera permissions...')
      const initialStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      
      // Stop the initial stream
      initialStream.getTracks().forEach(track => track.stop())
      
      // Start new stream with selected camera
      console.log('Starting stream with specific camera')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        },
        audio: isAudioOn
      })

      console.log('Stream obtained successfully:', stream.getTracks().map(t => t.kind))
      streamRef.current = stream
      
      // Check if component is still mounted and video ref exists
      if (!isMountedRef.current) {
        console.log('Component unmounted, stopping stream')
        stream.getTracks().forEach(track => track.stop())
        return
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Add error handling for play() promise
        try {
          await videoRef.current.play()
          console.log('Video element started playing')
        } catch (playError) {
          console.warn('Video play failed:', playError)
          // Don't throw error for play failures as they're often expected
          // when video element is removed from DOM
        }
      } else {
        console.warn('Video ref is null')
      }
    } catch (error) {
      console.error('Error starting video stream:', error)
      
      let errorMessage = 'Failed to start camera'
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please check your camera connection.'
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application. Please close other apps using the camera.'
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not support the requested settings. Trying with default settings...'
          // Try again with default settings
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined },
              audio: isAudioOn
            })
            streamRef.current = stream
            if (videoRef.current && isMountedRef.current) {
              videoRef.current.srcObject = stream
              try {
                await videoRef.current.play()
              } catch (playError) {
                console.warn('Video play failed on retry:', playError)
              }
            }
            return // Success with default settings
          } catch (retryError) {
            console.error('Retry with default settings failed:', retryError)
            errorMessage = 'Camera failed to start even with default settings.'
          }
        } else {
          errorMessage = `Camera error: ${error.message}`
        }
      }
      
      setCameraError(errorMessage)
    } finally {
      if (isMountedRef.current) {
        setIsLoadingCamera(false)
      }
    }
  }, [selectedCamera, isAudioOn, checkBrowserSupport])

  // Retry camera function
  const retryCamera = useCallback(async () => {
    console.log('Retrying camera...')
    setCameraError("")
    await detectCameras()
    if (selectedCamera) {
      await startVideoStream()
    }
  }, [detectCameras, selectedCamera, startVideoStream])

  // Stop video stream
  const stopVideoStream = useCallback(() => {
    console.log('Stopping video stream')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('Stopped track:', track.kind)
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Handle camera selection change
  const handleCameraChange = useCallback((deviceId: string) => {
    console.log('Changing camera to:', deviceId)
    setSelectedCamera(deviceId)
    if (isVideoOn) {
      startVideoStream()
    }
  }, [isVideoOn, startVideoStream])

  // Toggle video
  const toggleVideo = useCallback(() => {
    setIsVideoOn(prev => {
      if (!prev) {
        // Turn video on
        console.log('Turning video on')
        startVideoStream()
      } else {
        // Turn video off
        console.log('Turning video off')
        stopVideoStream()
      }
      return !prev
    })
  }, [startVideoStream, stopVideoStream])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioOn(prev => !prev)
  }, [])

  // Initialize camera detection and stream
  useEffect(() => {
    console.log('Initializing camera hook')
    isMountedRef.current = true
    detectCameras()
    
    // Listen for device changes
    const handleDeviceChange = () => {
      console.log('Device change detected')
      if (isMountedRef.current) {
        detectCameras()
      }
    }
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
    
    return () => {
      console.log('Cleaning up camera hook')
      isMountedRef.current = false
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
      stopVideoStream()
    }
  }, [detectCameras, stopVideoStream])

  // Start video stream when component mounts or when video is turned on
  useEffect(() => {
    if (isVideoOn && selectedCamera && isMountedRef.current) {
      console.log('Auto-starting video stream')
      startVideoStream()
    }
  }, [isVideoOn, selectedCamera, startVideoStream])

  // Handle audio toggle
  useEffect(() => {
    if (streamRef.current && isMountedRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isAudioOn
        console.log('Audio track enabled:', isAudioOn)
      })
    }
  }, [isAudioOn])

  return {
    availableCameras,
    selectedCamera,
    isLoadingCamera,
    cameraError,
    videoRef,
    streamRef,
    isVideoOn,
    isAudioOn,
    detectCameras,
    startVideoStream,
    stopVideoStream,
    handleCameraChange,
    toggleVideo,
    toggleAudio,
    retryCamera
  }
} 