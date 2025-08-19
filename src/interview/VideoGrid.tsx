"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Camera, Brain } from "lucide-react"

interface VideoGridProps {
  isLoadingCamera: boolean
  cameraError: string | null
  isVideoOn: boolean
  isAudioOn: boolean
  videoRef: React.RefObject<HTMLVideoElement>
  retryCamera: () => void
  isAIActive?: boolean
  isAISpeaking?: boolean
  isSpeechRecognitionActive?: boolean
}

export default function VideoGrid({
  isLoadingCamera,
  cameraError,
  isVideoOn,
  isAudioOn,
  videoRef,
  retryCamera,
  isAIActive = false,
  isAISpeaking = false,
  isSpeechRecognitionActive = false,
}: VideoGridProps) {
  return (
    <div className="flex-1 p-4 flex items-center justify-center min-h-0">
      <div className="w-full h-full max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Interviewer Video */}
        <div className={`video-container group relative aspect-video max-h-full transition-all duration-300 ${
          isAIActive || isAISpeaking ? 'ai-video-active' : ''
        }`}>
          <div className={`w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
            isAIActive || isAISpeaking 
              ? 'border-4 border-cyan-400 shadow-cyan-400/50 shadow-2xl' 
              : 'border border-slate-500/30'
          }`}>
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${
              isAIActive || isAISpeaking 
                ? 'from-cyan-600/25 to-blue-600/25' 
                : 'from-blue-600/15 to-cyan-600/15'
            }`} />
            <div className="absolute inset-0 bg-black/5" />
            {/* Animated speaking ring */}
            {(isAIActive || isAISpeaking) && (
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-pulse-glow-intense opacity-60" />
            )}
            <div className="text-center text-white relative z-10">
              <div className={`w-20 h-20 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 border shadow-lg transition-all duration-300 ${
                isAIActive || isAISpeaking 
                  ? 'from-cyan-400 to-blue-500 border-cyan-300/70 scale-110 shadow-cyan-400/50' 
                  : 'from-blue-500 to-cyan-500 border-blue-400/50 group-hover:scale-110'
              }`}>
                <Brain className={`h-10 w-10 transition-all duration-300 ${
                  isAIActive || isAISpeaking ? 'text-white animate-pulse' : ''
                }`} />
              </div>
              <p className="text-lg font-semibold mb-2">AI Interviewer</p>
              <p className="text-sm opacity-90 flex items-center justify-center">
                {isAIActive || isAISpeaking ? (
                  <>
                    <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-ping" />
                    <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-ping animation-delay-200" />
                    <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-ping animation-delay-400" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    Online
                  </>
                )}
              </p>
            </div>
            <div className={`absolute top-3 left-3 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border transition-all duration-300 ${
              isAIActive || isAISpeaking 
                ? 'bg-cyan-600/80 border-cyan-400/50 shadow-lg shadow-cyan-400/30' 
                : 'bg-black/60 border-white/20'
            }`}>
              <div className="flex items-center space-x-1">
                <span>AI Interviewer</span>
                {(isAIActive || isAISpeaking) && (
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-200" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex space-x-1">
              <div className={`control-button ${isAudioOn ? "primary" : "danger"}`} style={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
                {isAudioOn ? <Mic className="h-3 w-3 text-white" /> : <MicOff className="h-3 w-3 text-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Video */}
        <div className="video-container group relative aspect-video max-h-full">
          <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
            isSpeechRecognitionActive 
              ? 'from-blue-600 to-indigo-700 border-4 border-cyan-400 shadow-cyan-400/50 shadow-2xl' 
              : 'from-slate-600 to-slate-700 border border-slate-500/30'
          }`}>
            {/* Speech recognition active indicator */}
            {isSpeechRecognitionActive && (
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-pulse-glow-intense opacity-60" />
            )}
            {isLoadingCamera ? (
              <div className="text-center text-white relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-400/50 shadow-lg animate-pulse">
                  <Camera className="h-10 w-10" />
                </div>
                <p className="text-lg font-semibold mb-2">Loading Camera...</p>
                <p className="text-sm opacity-90">Please wait</p>
              </div>
            ) : cameraError ? (
              <div className="text-center text-white relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/50 shadow-lg">
                  <VideoOff className="h-10 w-10" />
                </div>
                <p className="text-lg font-semibold mb-2">Camera Error</p>
                <p className="text-sm opacity-90 text-red-300 mb-4">{cameraError}</p>
                <Button onClick={retryCamera} className="control-button primary" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Retry Camera
                </Button>
              </div>
            ) : !isVideoOn ? (
              <div className="text-center text-gray-300">
                <VideoOff className="h-12 w-12 mx-auto mb-3 opacity-60" />
                <p className="text-sm font-medium">Camera Off</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => console.warn("Video error:", e)}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 pointer-events-none" />
                {/* Speech recognition overlay */}
                {isSpeechRecognitionActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 pointer-events-none" />
                )}
              </>
            )}
          </div>
          <div className={`absolute bottom-3 left-3 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border transition-all duration-300 ${
            isSpeechRecognitionActive 
              ? 'bg-cyan-600/80 border-cyan-400/50 shadow-lg shadow-cyan-400/30' 
              : 'bg-black/60 border-white/20'
          }`}>
            <div className="flex items-center space-x-1">
              <span>You</span>
              {isSpeechRecognitionActive && (
                <div className="flex space-x-0.5">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-200" />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-400" />
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-3 right-3 flex space-x-1">
            <div className={`control-button ${isAudioOn ? "primary" : "danger"}`} style={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
              {isAudioOn ? <Mic className="h-3 w-3 text-white" /> : <MicOff className="h-3 w-3 text-white" />}
            </div>
            <div className={`control-button ${isVideoOn ? "success" : "danger"}`} style={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
              {isVideoOn ? <Video className="h-3 w-3 text-white" /> : <VideoOff className="h-3 w-3 text-white" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
