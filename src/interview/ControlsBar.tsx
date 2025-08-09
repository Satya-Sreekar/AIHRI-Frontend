"use client"

import React, { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Code,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  Send,
  Settings,
  Share,
  ChevronDown,
  PhoneOff,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ControlsBarProps {
  isAudioOn: boolean
  isVideoOn: boolean
  toggleAudio: () => void
  toggleVideo: () => void
  handleStartCoding: () => void
  cameraError: string | null
  retryCamera: () => void
  availableCameras: { deviceId: string; label: string; groupId: string }[]
  selectedCamera: string
  handleCameraChange: (value: string) => void
  currentInput: string
  setCurrentInput: Dispatch<SetStateAction<string>>
  handleSendMessage: () => void
  onLogout: () => void
}

export default function ControlsBar({
  isAudioOn,
  isVideoOn,
  toggleAudio,
  toggleVideo,
  handleStartCoding,
  cameraError,
  retryCamera,
  availableCameras,
  selectedCamera,
  handleCameraChange,
  currentInput,
  setCurrentInput,
  handleSendMessage,
  onLogout,
}: ControlsBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 backdrop-blur-md border-t border-gray-600 py-4 shadow-xl">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 flex items-center px-6">
        {/* Spacer to align controls center accounting for right chatbox */}
        <div className="w-80 hidden lg:block" />

        {/* Centered control buttons */}
        <div className="flex-1 flex items-center justify-center space-x-4">
          <Button size="lg" onClick={toggleAudio} className={`control-button ${isAudioOn ? "success" : "danger"}`}>
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button size="lg" onClick={toggleVideo} className={`control-button ${isVideoOn ? "success" : "danger"}`}>
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          {/* Retry camera button (visible on error) */}
          {cameraError && (
            <Button size="lg" onClick={retryCamera} className="control-button primary" title="Retry Camera">
              <Camera className="h-5 w-5" />
            </Button>
          )}

          {/* Camera selection dropdown (when multiple cameras) */}
          {availableCameras.length > 1 && (
            <div className="relative">
              <Select value={selectedCamera} onValueChange={handleCameraChange}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600/50 text-white">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span className="truncate">
                      {availableCameras.find((cam) => cam.deviceId === selectedCamera)?.label || "Select Camera"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {availableCameras.map((camera) => (
                    <SelectItem key={camera.deviceId} value={camera.deviceId} className="text-white hover:bg-slate-700">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>{camera.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button size="lg" className="control-button secondary hover:animate-float" onClick={handleStartCoding}>
            <Code className="h-5 w-5" />
          </Button>
          <Button size="lg" className="control-button secondary">
            <Settings className="h-5 w-5" />
          </Button>
          <Button size="lg" className="control-button secondary">
            <Share className="h-5 w-5" />
          </Button>
          <Button size="lg" onClick={onLogout} className="control-button danger">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        {/* Right side chat input */}
        <div className="w-64 hidden lg:flex">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Type a message..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:bg-slate-700/70 focus:border-cyan-500/50 h-10"
            />
            <Button
              onClick={handleSendMessage}
              size="lg"
              className="control-button primary h-10"
              style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}
              disabled={!currentInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
