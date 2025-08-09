"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TranscriptEntry } from "@/components/types"
import { useCamera } from "@/src/hooks/useCamera"
import { useCoding } from "./interview/hooks/useCoding"
import { useChat } from "@/src/hooks/useChat"
import TopBar from "./interview/TopBar"
import RightSidebar from "./interview/RightSidebar"
import ControlsBar from "./interview/ControlsBar"
import VideoGrid from "./interview/VideoGrid"
import CodeEditorModal from "./interview/CodeEditorModal"
import MobileTranscript from "./interview/MobileTranscript"

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  Clock,
  MessageSquare,
  Brain,
  PhoneOff,
  Settings,
  Share,
  Code,
  Terminal,
  FileCode,
  X,
  Activity,
  Camera,
  ChevronDown,
} from "lucide-react"

interface CandidateVideoInterviewProps {
  onLogout: () => void
}

export function CandidateVideoInterview({ onLogout }: CandidateVideoInterviewProps) {
  const [showTranscript, setShowTranscript] = useState(true)
  const [currentInput, setCurrentInput] = useState("")
  const desktopScrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  // Direct scroll container reference

  // Use hooks
  const {
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
  } = useCamera()

  const {
    showCodeEditor,
    currentProblem,
    code,
    setCode,
    language,
    setLanguage,
    testResults,
    handleStartCoding,
    handleRunCode,
    handleSubmitCode,
    handleCloseEditor,
  } = useCoding()

  // Initialize chat service
  const {
    transcript,
    isGenerating,
    error: chatError,
    streamingMessage,
    sendMessage,
    isServiceReady,
    ttsAudioMap,
    currentPlayingId,
    isTTSGenerating,
    ttsError,
    playTTS,
  } = useChat({
    model: 'llama3.2:latest',
    temperature: 0.7,
    autoInitialize: true,
  })

  // Use dynamic transcript from chat service
  const displayTranscript = transcript

  // Auto-scroll to bottom of sidebar container when transcript updates
  useEffect(() => {
    const container = desktopScrollRef.current || mobileScrollRef.current
    if (!container) return

    // Only scroll if the content is taller than the container (scrollable)
    const shouldScroll = container.scrollHeight > container.clientHeight
    if (shouldScroll) {
      // Jump instantly to avoid page shift side-effects
      container.scrollTop = container.scrollHeight - container.clientHeight
    }
  }, [displayTranscript, streamingMessage])

  // Handle sending messages through chat service
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || currentInput.trim()
    if (!messageToSend) return

    try {
      await sendMessage(messageToSend)
      if (!message) {
        setCurrentInput("")
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header - Fixed at top */}
      <TopBar onLogout={onLogout} />

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 flex w-full relative z-10 min-h-0">
        {/* Main Video Area - Takes most space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Grid */}
          <VideoGrid
            isLoadingCamera={isLoadingCamera}
            cameraError={cameraError}
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            videoRef={videoRef}
            retryCamera={retryCamera}
          />

          {/* Live Captions - Fixed height */}
          <div className="hidden">
            <div className="bg-slate-800/40 backdrop-blur-xl text-white p-4 rounded-xl border border-slate-600/30 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-1.5 bg-cyan-500/20 rounded animate-pulse-glow">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-cyan-300">Live Captions</span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div className="relative">
                <p className="text-sm leading-relaxed text-gray-200 min-h-[2rem]">
                  {transcript.length > 0 && transcript[transcript.length - 1].text}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Mobile Transcript */}
          <MobileTranscript
            transcript={displayTranscript}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            handleSendMessage={() => handleSendMessage()}
            scrollRef={mobileScrollRef}
          />

          {/* Controls - Fixed at bottom */}
          <ControlsBar
            isAudioOn={isAudioOn}
            isVideoOn={isVideoOn}
            toggleAudio={toggleAudio}
            toggleVideo={toggleVideo}
            handleStartCoding={handleStartCoding}
            cameraError={cameraError}
            retryCamera={retryCamera}
            availableCameras={availableCameras}
            selectedCamera={selectedCamera}
            handleCameraChange={handleCameraChange}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            handleSendMessage={() => handleSendMessage()}
            onLogout={onLogout}
          />

          {/* Text Input - Fixed at bottom */}
          <div className="hidden">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your response or use voice..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:bg-slate-700/70 focus:border-cyan-500/50 h-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <Button 
                onClick={() => handleSendMessage()} 
                size="lg"
                className="control-button primary h-10"
                style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}
                disabled={!currentInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {currentInput.trim() && (
              <div className="mt-2 text-xs text-gray-400 flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                Press Enter to send
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Fixed width */}
        <RightSidebar 
          transcript={displayTranscript} 
          containerRef={desktopScrollRef}
          onSendMessage={handleSendMessage}
          onPlayTTS={playTTS}
          isGenerating={isGenerating}
          error={chatError?.message || ttsError?.message || null}
          streamingMessage={streamingMessage}
          disabled={!isServiceReady}
          enableTTS={true}
          ttsAudioMap={ttsAudioMap}
          currentPlayingId={currentPlayingId}
        />
      </div>

      <CodeEditorModal
        visible={showCodeEditor}
        currentProblem={currentProblem}
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        testResults={testResults}
        handleRunCode={handleRunCode}
        handleSubmitCode={handleSubmitCode}
        onClose={handleCloseEditor}
      />
    </div>
  )
} 