"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Mail, Calendar, CheckCircle, LogOut } from "lucide-react"
import type { CurrentPage } from "@/src/types"

interface InterviewReportProps {
  candidateId: string | null
  onNavigate: (page: CurrentPage) => void
  onLogout: () => void
}

export function InterviewReport({ candidateId, onNavigate, onLogout }: InterviewReportProps) {
  const candidate = {
    name: "Jane Doe",
    email: "jane.doe@email.com",
    role: "Backend Developer",
    interviewDate: "July 25, 2025",
    avatar: "/placeholder.svg?height=80&width=80&text=JD",
  }

  const skillScores = [
    { skill: "Python", score: 9, confidence: "High", comment: "Great problem-solving with algorithms" },
    { skill: "Django", score: 7.5, confidence: "Medium", comment: "Missed serializers detail" },
    { skill: "CI/CD", score: 6, confidence: "Medium", comment: "Basic understanding" },
    { skill: "SQL", score: 8, confidence: "High", comment: "Clear on joins and indexing" },
  ]

  const softSkills = [
    { name: "Communication", score: 8 },
    { name: "Problem-solving", score: 9 },
    { name: "Technical Clarity", score: 7 },
  ]

  const overallScore = skillScores.reduce((acc, skill) => acc + skill.score, 0) / skillScores.length

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => onNavigate("dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Interview Report – {candidate.name}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Candidate Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <img
                src={candidate.avatar || "/placeholder.svg"}
                alt={candidate.name}
                className="w-20 h-20 rounded-full bg-gray-200"
              />
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{candidate.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{candidate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role Applied</p>
                  <p className="font-semibold">{candidate.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Interview Date</p>
                  <p className="font-semibold">{candidate.interviewDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Skill-wise Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Score (/10)</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillScores.map((skill, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{skill.skill}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{skill.score}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${(skill.score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConfidenceColor(skill.confidence)}>{skill.confidence}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{skill.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Soft Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Soft Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {softSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm font-semibold">{skill.score}/10</span>
                  </div>
                  <Progress value={skill.score * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📊
                </div>
                <p className="text-gray-600">Radar Chart Visualization</p>
                <p className="text-sm text-gray-500">Skills performance overview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Verdict */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-700">✅ Strong Fit</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Average Score: {overallScore.toFixed(1)}/10</div>
                <p className="text-gray-700">
                  Jane demonstrates strong technical skills with excellent Python knowledge and good SQL understanding.
                  While there's room for improvement in Django serializers and CI/CD practices, her problem-solving
                  approach and communication skills make her a strong candidate for the backend developer role.
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Offer
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Final Round
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
