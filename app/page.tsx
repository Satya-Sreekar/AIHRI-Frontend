"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/src/login"
import { HRDashboard } from "@/components/hr-dashboard"
import { ReportsPage } from "@/src/reports"
import { CandidateVideoInterview } from "@/src/interview"
import { InterviewBatches } from "@/components/interview-batches"
import { TopPicks } from "@/components/top-picks"
import { InterviewReport } from "@/components/interview-report"
import { TestCamera } from "@/src/test-camera"
import type { UserRole, CurrentPage } from "@/components/types"
import { useSession } from "@/src/hooks/useSession"

export default function AIInterviewPlatform() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("login")
  const { user, login, logout, loading } = useSession()
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  // Sync current page when session is restored
  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentPage(user.role === "HR" ? "dashboard" : "interview")
      } else {
        setCurrentPage("login")
      }
    }
  }, [loading, user])

  const handleLogin = (email: string, role: UserRole) => {
    login(email, role)
    if (role === "HR") {
      setCurrentPage("dashboard")
    } else {
      setCurrentPage("interview")
    }
  }

  const handleLogout = () => {
    logout()
    setCurrentPage("login")
    setSelectedCandidate(null)
  }

  const navigateTo = (page: CurrentPage, candidateId?: string) => {
    setCurrentPage(page)
    if (candidateId) {
      setSelectedCandidate(candidateId)
    }
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  if (user?.role === "Candidate") {
    return <CandidateVideoInterview onLogout={handleLogout} />
  }

  // HR Pages
  switch (currentPage) {
    case "dashboard":
      return <HRDashboard user={user} onLogout={handleLogout} onNavigate={navigateTo} />
    case "interview-batches":
      return <InterviewBatches onNavigate={navigateTo} onLogout={handleLogout} />
    case "reports":
      return <ReportsPage onNavigate={navigateTo} onLogout={handleLogout} />
    case "top-picks":
      return <TopPicks onNavigate={navigateTo} onLogout={handleLogout} />
    case "report":
      return <InterviewReport candidateId={selectedCandidate} onNavigate={navigateTo} onLogout={handleLogout} />
    case "test-camera":
      return <TestCamera />
    default:
      return <HRDashboard user={user} onLogout={handleLogout} onNavigate={navigateTo} />
  }
}
