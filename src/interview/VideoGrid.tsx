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
}

export default function VideoGrid({
  isLoadingCamera,
  cameraError,
  isVideoOn,
  isAudioOn,
  videoRef,
  retryCamera,
}: VideoGridProps) {
  return (
    <div className="flex-1 p-4 flex items-center justify-center min-h-0">
      <div className="w-full h-full max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Interviewer Video */}
        <div className="video-container group relative aspect-video max-h-full">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-500/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 to-cyan-600/15" />
            <div className="absolute inset-0 bg-black/5" />
            <div className="text-center text-white relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-10 w-10" />
              </div>
              <p className="text-lg font-semibold mb-2">AI Interviewer</p>
              <p className="text-sm opacity-90 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                Speaking...
              </p>
            </div>
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-white/20">
              AI Interviewer
            </div>
            <div className="absolute bottom-3 right-3 flex space-x-1">
              <div className="control-button success" style={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
                <Mic className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Video */}
        <div className="video-container group relative aspect-video max-h-full">
          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-500/30 shadow-2xl">
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
              </>
            )}
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-white/20">
            You
          </div>
          <div className="absolute bottom-3 right-3 flex space-x-1">
            <div className={`control-button ${isAudioOn ? "success" : "danger"}`} style={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
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
