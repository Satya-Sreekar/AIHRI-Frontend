"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Trophy,
  LayoutDashboard,
  Upload,
  Plus,
  X,
  Eye,
  LogOut,
  Brain,
  BarChart3,
  Users,
  Activity,
  PanelLeft,
  Camera,
} from "lucide-react"
import type { User, CurrentPage } from "@/components/types"

interface HRDashboardProps {
  user: User | null
  onLogout: () => void
  onNavigate: (page: CurrentPage) => void
}

export function HRDashboard({ user, onLogout, onNavigate }: HRDashboardProps) {
  const [formData, setFormData] = useState({
    roleTitle: "",
    responsibilities: "",
    keySkills: [] as string[],
    projectDetails: "",
    techStack: "",
    candidateFile: null as File | null,
  })
  const [skillInput, setSkillInput] = useState("")

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const recentBatches = [
    {
      id: "1",
      role: "Backend Developer",
      createdOn: "2025-01-25",
      candidates: 12,
      status: "Active" as const,
    },
    {
      id: "2",
      role: "Full Stack Engineer",
      createdOn: "2025-01-24",
      candidates: 8,
      status: "Completed" as const,
    },
    {
      id: "3",
      role: "Data Engineer",
      createdOn: "2025-01-23",
      candidates: 15,
      status: "Active" as const,
    },
  ]

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.keySkills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keySkills: [...prev.keySkills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      keySkills: prev.keySkills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Interview batch launched successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "badge-elegant success"
      case "Completed":
        return "badge-elegant info"
      default:
        return "badge-elegant warning"
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
              <button
                onClick={() => onNavigate("dashboard")}
                className={navButtonClasses(true)}
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
                className={navButtonClasses(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Top Picks</span>
              </button>
              <button
                onClick={() => onNavigate("test-camera")}
                className={navButtonClasses(false)}
              >
                <Camera className="h-4 w-4" />
                <span>Test Camera</span>
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
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="h-7 w-7 rounded-md hover:bg-gray-100 flex items-center justify-center"
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="button-elegant outline"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Create New Interview Batch */}
            <div className="lg:col-span-2">
              <Card className="card-hover">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    Create New Interview Batch
                  </CardTitle>
                  <CardDescription className="text-gray-600">Set up a new AI-powered interview batch</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="roleTitle" className="text-sm font-medium text-gray-700">
                        Role Title
                      </Label>
                      <Input
                        id="roleTitle"
                        placeholder="e.g., Backend Developer"
                        value={formData.roleTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, roleTitle: e.target.value }))}
                        className="input-elegant mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="responsibilities" className="text-sm font-medium text-gray-700">
                        Responsibilities
                      </Label>
                      <Textarea
                        id="responsibilities"
                        placeholder="Describe key responsibilities..."
                        rows={3}
                        value={formData.responsibilities}
                        onChange={(e) => setFormData((prev) => ({ ...prev, responsibilities: e.target.value }))}
                        className="input-elegant mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Key Skills</Label>
                      <div className="flex space-x-3 mt-2 mb-3">
                        <Input
                          placeholder="e.g., Python, Django, SQL"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                          className="input-elegant flex-1"
                        />
                        <Button type="button" onClick={handleAddSkill} variant="outline" className="button-elegant secondary">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.keySkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="badge-elegant info flex items-center gap-2">
                            {skill}
                            <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => handleRemoveSkill(skill)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectDetails" className="text-sm font-medium text-gray-700">
                        Project Details
                      </Label>
                      <Textarea
                        id="projectDetails"
                        placeholder="Describe the project context..."
                        rows={2}
                        value={formData.projectDetails}
                        onChange={(e) => setFormData((prev) => ({ ...prev, projectDetails: e.target.value }))}
                        className="input-elegant mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="techStack" className="text-sm font-medium text-gray-700">
                        Tech Stack
                      </Label>
                      <Input
                        id="techStack"
                        placeholder="e.g., Python, Django, PostgreSQL, AWS"
                        value={formData.techStack}
                        onChange={(e) => setFormData((prev) => ({ ...prev, techStack: e.target.value }))}
                        className="input-elegant mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Candidate List (CSV or Excel)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mt-2 hover:border-blue-400 transition-colors duration-200">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-3">Upload candidate list</p>
                        <Button type="button" variant="outline" size="sm" className="button-elegant outline">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="button-elegant primary w-full h-12 text-lg font-semibold">
                      Launch AI Interviews
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div>
              <Card className="card-hover">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="stats-card">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Batches</p>
                        <p className="text-2xl font-bold text-green-600">2</p>
                      </div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                        <p className="text-2xl font-bold text-blue-600">35</p>
                      </div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Interviews Done</p>
                        <p className="text-2xl font-bold text-purple-600">8</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Batches */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Recent Batches
              </CardTitle>
              <CardDescription>Monitor your interview batches</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-gray-700">Role</TableHead>
                    <TableHead className="font-medium text-gray-700">Created On</TableHead>
                    <TableHead className="font-medium text-gray-700">Candidates</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBatches.map((batch) => (
                    <TableRow key={batch.id} className="table-row-hover">
                      <TableCell className="font-medium">{batch.role}</TableCell>
                      <TableCell>{new Date(batch.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell>{batch.candidates}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("report")}
                          className="button-elegant outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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
