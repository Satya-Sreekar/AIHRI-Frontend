export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export type UserRole = "HR" | "Candidate" | null

export type CurrentPage = "login" | "dashboard" | "interview" | "interview-batches" | "reports" | "top-picks" | "report" | "test-camera"

export interface InterviewBatch {
  id: string
  role: string
  createdOn: string
  candidatesUploaded: number
  status: "Active" | "Completed" | "Draft"
  completedInterviews: number
  averageScore: number
  topCandidates: number
  department: string
  priority: "High" | "Medium" | "Low"
}

export interface TranscriptEntry {
  id: string
  speaker: "AI Interviewer" | "Candidate"
  text: string
  timestamp: Date
  duration?: number
}

export interface Skill {
  name: string
  status: "completed" | "in-progress" | "pending"
}

export interface CodingProblem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  starterCode: {
    python: string
    javascript: string
    java: string
  }
}

export interface TestResult {
  id: string
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  executionTime: number
}

export interface Analytics {
  totalBatches: number
  activeBatches: number
  completedBatches: number
  totalCandidates: number
  interviewsCompleted: number
  averageScore: number
  topPerformers: number
  rejectionRate: number
}

export interface DepartmentStat {
  department: string
  batches: number
  candidates: number
  avgScore: number
  color: string
} 