"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  LogOut,
  Download,
  BarChart3,
  TrendingUp,
  Trophy,
  Users,
  Activity,
  PieChart,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  PanelLeft,
  Brain,
} from "lucide-react"
import type { CurrentPage, Analytics, DepartmentStat } from "@/components/types"

interface ReportsPageProps {
  onNavigate: (page: CurrentPage) => void
  onLogout: () => void
}

export function ReportsPage({ onNavigate, onLogout }: ReportsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const analytics: Analytics = {
    totalBatches: 12,
    activeBatches: 4,
    completedBatches: 7,
    totalCandidates: 156,
    interviewsCompleted: 89,
    averageScore: 7.6,
    topPerformers: 23,
    rejectionRate: 42,
  }

  const departmentStats: DepartmentStat[] = [
    { department: "Engineering", batches: 6, candidates: 78, avgScore: 7.8, color: "bg-blue-500" },
    { department: "Product", batches: 2, candidates: 25, avgScore: 8.1, color: "bg-green-500" },
    { department: "Design", batches: 2, candidates: 28, avgScore: 7.4, color: "bg-purple-500" },
    { department: "Data", batches: 2, candidates: 25, avgScore: 8.3, color: "bg-orange-500" },
  ]

  const monthlyData = [
    { month: "Jan", interviews: 45, candidates: 67, avgScore: 7.2 },
    { month: "Feb", interviews: 38, candidates: 52, avgScore: 7.8 },
    { month: "Mar", interviews: 42, candidates: 59, avgScore: 7.5 },
    { month: "Apr", interviews: 35, candidates: 48, avgScore: 8.1 },
    { month: "May", interviews: 51, candidates: 71, avgScore: 7.9 },
    { month: "Jun", interviews: 48, candidates: 63, avgScore: 8.0 },
  ]

  const recentActivity = [
    { id: 1, action: "New batch created", details: "Senior Frontend Developer - 25 candidates", time: "2 hours ago", type: "create" },
    { id: 2, action: "Interview completed", details: "Jane Doe - Backend Developer", time: "4 hours ago", type: "interview" },
    { id: 3, action: "Batch completed", details: "Data Scientist - 18 candidates", time: "1 day ago", type: "complete" },
    { id: 4, action: "High scorer identified", details: "Alex Chen - DevOps Engineer (9.2/10)", time: "1 day ago", type: "score" },
    { id: 5, action: "Interview started", details: "Sarah Wilson - UX Designer", time: "2 days ago", type: "interview" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <BarChart3 className="h-4 w-4 text-blue-600" />
      case "interview":
        return <Users className="h-4 w-4 text-green-600" />
      case "complete":
        return <Trophy className="h-4 w-4 text-purple-600" />
      case "score":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const navButtonClasses = (active: boolean) =>
    `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-gray-100"
    }`

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-gray-800">AI Interview Portal</span>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-2">
              <button onClick={() => onNavigate("dashboard")} className={navButtonClasses(false)}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button onClick={() => onNavigate("interview-batches")} className={navButtonClasses(false)}>
                <FileText className="h-4 w-4" />
                <span>Interview Batches</span>
              </button>
              <button onClick={() => onNavigate("reports")} className={navButtonClasses(true)}>
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </button>
              <button onClick={() => onNavigate("top-picks")} className={navButtonClasses(false)}>
                <Trophy className="h-4 w-4" />
                <span>Top Picks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="glass-effect border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="h-7 w-7 rounded-md hover:bg-gray-100 flex items-center justify-center"
            >
              <PanelLeft className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </button>
            <h1 className="text-xl font-semibold">Analytics & Reports</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="button-elegant outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.interviewsCompleted}</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}/10</p>
                    <p className="text-xs text-green-600">+0.3 from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Performers</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.topPerformers}</p>
                    <p className="text-xs text-green-600">+5 from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{100 - analytics.rejectionRate}%</p>
                    <p className="text-xs text-green-600">+8% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* rest of original content remains unchanged ... */}
        </div>
      </div>
    </div>
  )
}
