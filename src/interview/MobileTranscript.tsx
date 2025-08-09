"use client"

import React, { RefObject, Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send } from "lucide-react"
import type { TranscriptEntry } from "@/components/types"

interface MobileTranscriptProps {
  transcript: TranscriptEntry[]
  currentInput: string
  setCurrentInput: Dispatch<SetStateAction<string>>
  handleSendMessage: () => void
  scrollRef: RefObject<HTMLDivElement | null>
}

export default function MobileTranscript({
  transcript,
  currentInput,
  setCurrentInput,
  handleSendMessage,
  scrollRef,
}: MobileTranscriptProps) {
  return (
    <div className="lg:hidden bg-slate-800/20 backdrop-blur-xl border-t border-slate-600/20 p-4 flex-shrink-0">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm text-white flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-cyan-400" />
            Live Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={scrollRef}
            className="h-32 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
          >
            <div className="space-y-2 p-1">
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
          </div>
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
              style={{ width: "auto", height: "auto", minWidth: "auto", minHeight: "auto" }}
              disabled={!currentInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
