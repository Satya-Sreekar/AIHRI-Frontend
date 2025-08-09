"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { 
  FileText, 
  Trophy, 
  LayoutDashboard, 
  LogOut, 
  Brain, 
  Search, 
  Filter, 
  Eye, 
  Users, 
  Calendar,
  PanelLeft,
  Star,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import type { CurrentPage } from "@/components/types"

interface TopPicksProps {
  onNavigate: (page: CurrentPage, candidateId?: string) => void
  onLogout: () => void
}

interface TopCandidate {
  id: string
  name: string
  role: string
  avgScore: number
  verdict: "Strong Fit" | "Consider" | "Reject"
  avatar: string
  skills: string[]
  interviewDate: string
  department: string
  experience: string
  location: string
  status: "Available" | "Contacted" | "Interviewed" | "Offered"
}

export function TopPicks({ onNavigate, onLogout }: TopPicksProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navButtonClasses = (active: boolean) =>
    `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-gray-100"
    }`
  const [searchTerm, setSearchTerm] = useState("")
  const [verdictFilter, setVerdictFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const topCandidates: TopCandidate[] = [
    {
      id: "jane-doe",
      name: "Jane Doe",
      role: "Backend Developer",
      avgScore: 8.2,
      verdict: "Strong Fit",
      avatar: "/placeholder.svg?height=60&width=60&text=JD",
      skills: ["Python", "Django", "SQL"],
      interviewDate: "July 25, 2025",
      department: "Engineering",
      experience: "3 years",
      location: "San Francisco, CA",
      status: "Available",
    },
    {
      id: "ravi-kumar",
      name: "Ravi Kumar",
      role: "Full Stack Developer",
      avgScore: 7.8,
      verdict: "Consider",
      avatar: "/placeholder.svg?height=60&width=60&text=RK",
      skills: ["React", "Node.js", "MongoDB"],
      interviewDate: "July 24, 2025",
      department: "Engineering",
      experience: "4 years",
      location: "New York, NY",
      status: "Contacted",
    },
    {
      id: "aisha-r",
      name: "Aisha Rahman",
      role: "Data Engineer",
      avgScore: 8.7,
      verdict: "Strong Fit",
      avatar: "/placeholder.svg?height=60&width=60&text=AR",
      skills: ["Python", "Spark", "AWS"],
      interviewDate: "July 23, 2025",
      department: "Data Science",
      experience: "5 years",
      location: "Seattle, WA",
      status: "Interviewed",
    },
    {
      id: "mike-chen",
      name: "Mike Chen",
      role: "Frontend Developer",
      avgScore: 7.5,
      verdict: "Consider",
      avatar: "/placeholder.svg?height=60&width=60&text=MC",
      skills: ["React", "TypeScript", "CSS"],
      interviewDate: "July 22, 2025",
      department: "Engineering",
      experience: "2 years",
      location: "Austin, TX",
      status: "Available",
    },
    {
      id: "sarah-wilson",
      name: "Sarah Wilson",
      role: "DevOps Engineer",
      avgScore: 8.9,
      verdict: "Strong Fit",
      avatar: "/placeholder.svg?height=60&width=60&text=SW",
      skills: ["Docker", "Kubernetes", "AWS"],
      interviewDate: "July 21, 2025",
      department: "Engineering",
      experience: "6 years",
      location: "Boston, MA",
      status: "Offered",
    },
    {
      id: "alex-johnson",
      name: "Alex Johnson",
      role: "Backend Developer",
      avgScore: 6.8,
      verdict: "Reject",
      avatar: "/placeholder.svg?height=60&width=60&text=AJ",
      skills: ["Java", "Spring", "MySQL"],
      interviewDate: "July 20, 2025",
      department: "Engineering",
      experience: "1 year",
      location: "Chicago, IL",
      status: "Available",
    },
  ]

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Strong Fit":
        return "badge-elegant success"
      case "Consider":
        return "badge-elegant warning"
      case "Reject":
        return "badge-elegant danger"
      default:
        return "badge-elegant warning"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-600"
      case "Contacted":
        return "text-blue-600"
      case "Interviewed":
        return "text-purple-600"
      case "Offered":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600"
    if (score >= 7.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Strong Fit":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Consider":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Reject":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const filteredCandidates = topCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesVerdict = verdictFilter === "all" || candidate.verdict === verdictFilter
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesVerdict && matchesStatus
  })

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
            <button
              onClick={() => onNavigate("dashboard")}
              className={navButtonClasses(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate("interview-batches")}
              className={navButtonClasses(false)}
            >
              <FileText className="h-4 w-4" />
              <span>Interview Batches</span>
            </button>
            <button
              onClick={() => onNavigate("reports")}
              className={navButtonClasses(false)}
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => onNavigate("top-picks")}
              className={navButtonClasses(true)}
            >
              <Trophy className="h-4 w-4" />
              <span>Top Picks</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navbar */}
        <header className="glass-effect border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen((prev) => !prev)} className="h-7 w-7 rounded-md hover:bg-gray-100 flex items-center justify-center">
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Top Picks</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onLogout} className="button-elegant outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Top Candidates</h2>
              <p className="text-gray-600">Review and manage your top performing candidates</p>
            </div>
            <div className="flex space-x-2">
              <Button className="button-elegant outline">
                <Mail className="h-4 w-4 mr-2" />
                Bulk Email
              </Button>
              <Button className="button-elegant primary">
                <Star className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by verdict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verdicts</SelectItem>
                      <SelectItem value="Strong Fit">Strong Fit</SelectItem>
                      <SelectItem value="Consider">Consider</SelectItem>
                      <SelectItem value="Reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Interviewed">Interviewed</SelectItem>
                      <SelectItem value="Offered">Offered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full bg-gray-200"
                      />
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription>{candidate.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getVerdictIcon(candidate.verdict)}
                      <Badge className={getVerdictColor(candidate.verdict)}>
                        {candidate.verdict}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className={`font-bold text-lg ${getScoreColor(candidate.avgScore)}`}>
                      {candidate.avgScore}/10
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department</span>
                      <span className="font-medium">{candidate.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{candidate.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{candidate.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      onClick={() => onNavigate("report", candidate.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                    <Button>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No candidates found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
} 