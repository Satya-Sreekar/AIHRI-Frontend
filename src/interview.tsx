"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import type { TranscriptEntry, CodingProblem, TestResult } from "@/components/types"
import { useCamera } from "@/src/hooks/useCamera"

interface CandidateVideoInterviewProps {
  onLogout: () => void
}

export function CandidateVideoInterview({ onLogout }: CandidateVideoInterviewProps) {
  const [showTranscript, setShowTranscript] = useState(true)
  const [currentInput, setCurrentInput] = useState("")

  // Use the camera hook
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

  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<CodingProblem | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [testResults, setTestResults] = useState<TestResult[]>([])



  const [codingProblems] = useState<CodingProblem[]>([
    {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
      starterCode: {
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        javascript: `function twoSum(nums, target) {
    // Your code here
}`,
        java: `public int[] twoSum(int[] nums, target) {
    // Your code here
    return new int[0];
}`,
      },
    },
  ])

  const handleStartCoding = () => {
    setCurrentProblem(codingProblems[0])
    const starterCode = codingProblems[0].starterCode
    const code = starterCode[language as "python" | "javascript" | "java"]
    setCode(code)
    setShowCodeEditor(true)
  }

  const handleRunCode = () => {
    // Simulate code execution
    const mockResults: TestResult[] = [
      {
        id: "1",
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        actualOutput: "[0,1]",
        passed: true,
        executionTime: 12,
      },
      {
        id: "2",
        input: "[3,2,4], 6",
        expectedOutput: "[1,2]",
        actualOutput: "[1,2]",
        passed: true,
        executionTime: 8,
      },
    ]
    setTestResults(mockResults)
  }

  const handleSubmitCode = () => {
    alert("Code submitted successfully!")
    setShowCodeEditor(false)
  }

  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    {
      id: "1",
      speaker: "AI Interviewer",
      text: "Hello! I'm your AI interviewer. Let's start with your experience with Django REST Framework. Can you tell me about a project where you used it?",
      timestamp: new Date(Date.now() - 300000),
      duration: 8,
    },
    {
      id: "2",
      speaker: "Candidate",
      text: "I've built APIs using DRF for 2 years. In my last project, I created a comprehensive e-commerce API with user authentication, product management, and order processing.",
      timestamp: new Date(Date.now() - 240000),
      duration: 12,
    },
    {
      id: "3",
      speaker: "AI Interviewer",
      text: "That's great! How would you handle authentication and authorization in a DRF application? What are the different methods you've used?",
      timestamp: new Date(Date.now() - 180000),
      duration: 7,
    },
  ])



  const handleSendMessage = () => {
    if (currentInput.trim()) {
      const newEntry: TranscriptEntry = {
        id: Date.now().toString(),
        speaker: "Candidate",
        text: currentInput,
        timestamp: new Date(),
        duration: Math.floor(currentInput.length / 10) + 2,
      }
      setTranscript((prev) => [...prev, newEntry])
      setCurrentInput("")

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: TranscriptEntry = {
          id: (Date.now() + 1).toString(),
          speaker: "AI Interviewer",
          text: "Excellent answer! Let's move on to CI/CD practices. Can you walk me through how you would set up a deployment pipeline for a Django application?",
          timestamp: new Date(),
          duration: 9,
        }
        setTranscript((prev) => [...prev, aiResponse])
      }, 2000)
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
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  AI Interview - Backend Developer
                </span>
                <div className="text-xs text-gray-300">Session in progress</div>
              </div>
            </div>
            <Badge className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm">
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-white font-mono text-sm">45:23</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="control-button danger"
              style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto', padding: '0.5rem 1rem' }}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 flex w-full relative z-10 min-h-0">
        {/* Main Video Area - Takes most space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Grid - Takes most of the space with proper aspect ratio */}
          <div className="flex-1 p-4 flex items-center justify-center min-h-0">
            <div className="w-full h-full max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI Interviewer Video */}
              <div className="video-container group relative aspect-video max-h-full">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-500/30 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 to-cyan-600/15"></div>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="text-center text-white relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-10 w-10" />
                    </div>
                    <p className="text-lg font-semibold mb-2">AI Interviewer</p>
                    <p className="text-sm opacity-90 flex items-center justify-center">
                      <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                      Speaking...
                    </p>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-white/20">
                    AI Interviewer
                  </div>
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    <div className="control-button success" style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}>
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
                      <Button
                        onClick={retryCamera}
                        className="control-button primary"
                        size="sm"
                      >
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
                        onError={(e) => console.warn('Video error:', e)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 pointer-events-none"></div>
                    </>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-white/20">
                  You
                </div>
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  <div className={`control-button ${isAudioOn ? "success" : "danger"}`} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}>
                    {isAudioOn ? <Mic className="h-3 w-3 text-white" /> : <MicOff className="h-3 w-3 text-white" />}
                  </div>
                  <div className={`control-button ${isVideoOn ? "success" : "danger"}`} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}>
                    {isVideoOn ? <Video className="h-3 w-3 text-white" /> : <VideoOff className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          {/* Mobile Transcript Panel - Fixed height */}
          <div className="lg:hidden bg-slate-800/20 backdrop-blur-xl border-t border-slate-600/20 p-4 flex-shrink-0">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm text-white flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-cyan-400" />
                  Live Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {transcript.slice(-3).map((entry) => (
                      <div key={entry.id} className="space-y-1 bg-slate-700/30 backdrop-blur-sm rounded p-2 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-300">{entry.speaker}</span>
                          <span className="text-xs text-gray-400">{entry.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-gray-200">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-3 px-0">
                <div className="flex w-full space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:bg-slate-700/70 focus:border-cyan-500/50 h-9"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="lg"
                    className="control-button primary h-9"
                    style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}
                    disabled={!currentInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Controls - Fixed at bottom */}
          <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 backdrop-blur-md border-t border-gray-600 flex items-center justify-center space-x-6 py-4 shadow-xl">
            {/* Background bar for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <Button
                size="lg"
                onClick={toggleAudio}
                className={`control-button ${isAudioOn ? "success" : "danger"}`}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                size="lg"
                onClick={toggleVideo}
                className={`control-button ${isVideoOn ? "success" : "danger"}`}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              {/* Retry Camera Button - Show when there's an error */}
              {cameraError && (
                <Button
                  size="lg"
                  onClick={retryCamera}
                  className="control-button primary"
                  title="Retry Camera"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              )}
              
              {/* Camera Selection Dropdown */}
              {availableCameras.length > 1 && (
                <div className="relative">
                  <Select value={selectedCamera} onValueChange={handleCameraChange}>
                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600/50 text-white">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span className="truncate">
                          {availableCameras.find(cam => cam.deviceId === selectedCamera)?.label || 'Select Camera'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {availableCameras.map((camera) => (
                        <SelectItem 
                          key={camera.deviceId} 
                          value={camera.deviceId}
                          className="text-white hover:bg-slate-700"
                        >
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
              
              <Button
                size="lg"
                className="control-button secondary hover:animate-float"
                onClick={handleStartCoding}
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button size="lg" className="control-button secondary">
                <Settings className="h-5 w-5" />
              </Button>
              <Button size="lg" className="control-button secondary">
                <Share className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                onClick={onLogout}
                className="control-button danger"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
                onClick={handleSendMessage} 
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
        <div className="interview-sidebar w-80 flex flex-col hidden lg:flex flex-shrink-0">
          <div className="flex-1 p-4">
            <Card className="h-full border-0 shadow-none bg-transparent">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-sm text-white flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-cyan-400" />
                  Live Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="space-y-3">
                    {transcript.map((entry) => (
                      <div key={entry.id} className="space-y-2 bg-slate-700/30 backdrop-blur-sm rounded-lg p-3 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-300">{entry.speaker}</span>
                          <span className="text-xs text-gray-400">{entry.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed">{entry.text}</p>
                        {entry.duration && <span className="text-xs text-gray-500">Duration: {entry.duration}s</span>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-3 px-0">
                <div className="flex w-full space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:bg-slate-700/70 focus:border-cyan-500/50 h-9"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="lg"
                    className="control-button primary h-9"
                    style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}
                    disabled={!currentInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Code Editor Modal */}
      {showCodeEditor && currentProblem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl border border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentProblem.title}</h2>
                  <Badge
                    className={
                      currentProblem.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : currentProblem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {currentProblem.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowCodeEditor(false)} className="control-button danger" style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Problem Description */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-6 h-full overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                        <FileCode className="h-4 w-4 mr-2 text-blue-600" />
                        Problem Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{currentProblem.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                        <Terminal className="h-4 w-4 mr-2 text-green-600" />
                        Examples
                      </h3>
                      <div className="space-y-4">
                        {currentProblem.examples.map((example, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-mono text-sm space-y-2">
                              <div className="flex items-center">
                                <span className="text-blue-600 font-semibold mr-2">Input:</span>
                                <span className="text-gray-800">{example.input}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-green-600 font-semibold mr-2">Output:</span>
                                <span className="text-gray-800">{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <span className="text-purple-600 font-semibold mr-2">Explanation:</span>
                                  <span className="text-gray-600">{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-orange-600" />
                        Constraints
                      </h3>
                      <ul className="list-disc list-inside space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                        {currentProblem.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="w-1/2 flex flex-col">
                <div className="flex-1 p-6">
                  <div className="h-full border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gray-800 text-white p-3 text-sm font-mono flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileCode className="h-4 w-4" />
                        <span>solution.{language === "python" ? "py" : language === "javascript" ? "js" : "java"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none bg-gray-900 text-gray-100"
                      style={{ minHeight: "300px" }}
                      placeholder="Write your code here..."
                    />
                  </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="border-t border-gray-200 p-6 max-h-48 overflow-y-auto bg-gray-50">
                    <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                      <Terminal className="h-4 w-4 mr-2 text-green-600" />
                      Test Results
                    </h4>
                    <div className="space-y-3">
                      {testResults.map((result) => (
                        <div
                          key={result.id}
                          className={`p-3 rounded-lg border text-sm ${
                            result.passed 
                              ? "bg-green-50 border-green-200 text-green-800" 
                              : "bg-red-50 border-red-200 text-red-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium flex items-center ${
                              result.passed ? "text-green-700" : "text-red-700"
                            }`}>
                              {result.passed ? "✅ Passed" : "❌ Failed"}
                            </span>
                            <span className="text-gray-500 text-xs">{result.executionTime}ms</span>
                          </div>
                          <div className="font-mono text-xs space-y-1">
                            <div className="flex">
                              <span className="text-blue-600 w-16">Input:</span>
                              <span className="text-gray-700">{result.input}</span>
                            </div>
                            <div className="flex">
                              <span className="text-green-600 w-16">Expected:</span>
                              <span className="text-gray-700">{result.expectedOutput}</span>
                            </div>
                            <div className="flex">
                              <span className="text-purple-600 w-16">Got:</span>
                              <span className="text-gray-700">{result.actualOutput}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex space-x-3">
                  <Button variant="outline" onClick={handleRunCode} className="control-button secondary flex-1" style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}>
                    <Terminal className="h-4 w-4 mr-2" />
                    Run Code
                  </Button>
                  <Button onClick={handleSubmitCode} className="control-button primary flex-1" style={{ width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto' }}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Solution
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 