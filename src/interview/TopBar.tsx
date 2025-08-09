"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Brain, PhoneOff } from "lucide-react"

interface TopBarProps {
  onLogout: () => void
}

export default function TopBar({ onLogout }: TopBarProps) {
  return (
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
  )
}
