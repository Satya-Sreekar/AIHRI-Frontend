"use client"

import { useCamera } from "@/src/hooks/useCamera"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Video, VideoOff, Mic, MicOff, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestCamera() {
  const {
    availableCameras,
    selectedCamera,
    isLoadingCamera,
    cameraError,
    videoRef,
    isVideoOn,
    isAudioOn,
    handleCameraChange,
    toggleVideo,
    toggleAudio,
    retryCamera,
    detectCameras
  } = useCamera()

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Camera Test & Debug</h1>
        <p className="text-gray-300">Test your camera functionality and troubleshoot issues</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Display */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Video Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative border border-slate-600">
              {isLoadingCamera ? (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <Camera className="h-8 w-8 mr-2 animate-spin mx-auto mb-2" />
                    <p>Loading camera...</p>
                  </div>
                </div>
              ) : cameraError ? (
                <div className="flex items-center justify-center h-full text-red-400">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mr-2 mx-auto mb-2" />
                    <p className="font-semibold mb-2">Camera Error</p>
                    <p className="text-sm text-red-300 mb-4">{cameraError}</p>
                    <Button
                      onClick={retryCamera}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Camera
                    </Button>
                  </div>
                </div>
              ) : isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <VideoOff className="h-8 w-8 mr-2 mx-auto mb-2" />
                    <p>Camera Off</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls and Debug Info */}
        <div className="space-y-6">
          {/* Camera Selection */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Camera Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Camera</label>
                <Select value={selectedCamera} onValueChange={handleCameraChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {availableCameras.map((camera) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId} className="text-white hover:bg-slate-700">
                        {camera.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Control Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={toggleVideo}
                  variant={isVideoOn ? "default" : "destructive"}
                  size="sm"
                  className="flex-1"
                >
                  {isVideoOn ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                  {isVideoOn ? 'Turn Off' : 'Turn On'}
                </Button>
                <Button
                  onClick={toggleAudio}
                  variant={isAudioOn ? "default" : "destructive"}
                  size="sm"
                  className="flex-1"
                >
                  {isAudioOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                  {isAudioOn ? 'Mute' : 'Unmute'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug Information */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Available cameras:</span>
                  <span className="text-white font-mono">{availableCameras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Selected camera:</span>
                  <span className="text-white font-mono">{selectedCamera ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Video status:</span>
                  <span className={`font-mono ${isVideoOn ? 'text-green-400' : 'text-red-400'}`}>
                    {isVideoOn ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Audio status:</span>
                  <span className={`font-mono ${isAudioOn ? 'text-green-400' : 'text-red-400'}`}>
                    {isAudioOn ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Loading:</span>
                  <span className={`font-mono ${isLoadingCamera ? 'text-yellow-400' : 'text-green-400'}`}>
                    {isLoadingCamera ? 'Yes' : 'No'}
                  </span>
                </div>
                {cameraError && (
                  <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded">
                    <div className="flex justify-between">
                      <span className="text-red-300">Error:</span>
                      <span className="text-red-200 text-xs">{cameraError}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">1.</span>
                  <span>Check browser permissions for camera access</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">2.</span>
                  <span>Ensure no other applications are using the camera</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">3.</span>
                  <span>Try refreshing the page and allowing permissions again</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">4.</span>
                  <span>Check if your camera is properly connected and working</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">5.</span>
                  <span>Try using a different browser if issues persist</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 