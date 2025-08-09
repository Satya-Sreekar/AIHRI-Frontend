"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Plus,
    PanelLeft,
    ArrowLeft
} from "lucide-react"
import type { CurrentPage, InterviewBatch } from "@/components/types"

interface InterviewBatchesProps {
  onNavigate: (page: CurrentPage, candidateId?: string) => void
  onLogout: () => void
}

export function InterviewBatches({ onNavigate, onLogout }: InterviewBatchesProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navButtonClasses = (active: boolean) =>
    `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-gray-100"
    }`
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const batches: InterviewBatch[] = [
    {
      id: "1",
      role: "Senior Frontend Developer",
      createdOn: "2024-01-15",
      candidatesUploaded: 12,
      status: "Active",
      completedInterviews: 8,
      averageScore: 7.8,
      topCandidates: 3,
      department: "Engineering",
      priority: "High",
    },
    {
      id: "2",
      role: "Full Stack Engineer",
      createdOn: "2024-01-14",
      candidatesUploaded: 8,
      status: "Completed",
      completedInterviews: 8,
      averageScore: 8.2,
      topCandidates: 2,
      department: "Engineering",
      priority: "Medium",
    },
    {
      id: "3",
      role: "DevOps Engineer",
      createdOn: "2024-01-13",
      candidatesUploaded: 15,
      status: "Active",
      completedInterviews: 10,
      averageScore: 7.5,
      topCandidates: 4,
      department: "Engineering",
      priority: "High",
    },
    {
      id: "4",
      role: "Backend Developer",
      createdOn: "2024-01-12",
      candidatesUploaded: 6,
      status: "Draft",
      completedInterviews: 0,
      averageScore: 0,
      topCandidates: 0,
      department: "Engineering",
      priority: "Low",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "badge-elegant success"
      case "Completed":
        return "badge-elegant info"
      case "Draft":
        return "badge-elegant warning"
      default:
        return "badge-elegant warning"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    return matchesSearch && matchesStatus
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
              className={navButtonClasses(true)}
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
              className={navButtonClasses(false)}
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
              <h1 className="text-xl font-semibold text-gray-800">Interview Batches</h1>
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
              <h2 className="text-2xl font-bold text-gray-800">Interview Batches</h2>
              <p className="text-gray-600">Manage and monitor your interview batches</p>
            </div>
            <Button onClick={() => onNavigate("dashboard")} className="button-elegant primary">
              <Plus className="h-4 w-4 mr-2" />
              Create New Batch
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search batches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batches Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Interview Batches</CardTitle>
              <CardDescription>
                {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.role}</TableCell>
                      <TableCell>{batch.department}</TableCell>
                      <TableCell>{new Date(batch.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{batch.candidatesUploaded}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{batch.completedInterviews}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{batch.averageScore.toFixed(1)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getPriorityColor(batch.priority)}`}>
                          {batch.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                                                      <Button onClick={() => onNavigate("report", batch.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                                                      <Button>
                            <Users className="h-4 w-4 mr-1" />
                            Candidates
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
} 