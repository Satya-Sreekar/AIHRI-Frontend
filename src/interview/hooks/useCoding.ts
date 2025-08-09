import { useState } from "react"
import type { CodingProblem, TestResult } from "@/components/types"
import { codingProblems } from "../data/codingProblems"

export function useCoding() {
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<CodingProblem | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [testResults, setTestResults] = useState<TestResult[]>([])

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

  const handleCloseEditor = () => {
    setShowCodeEditor(false)
  }

  return {
    showCodeEditor,
    currentProblem,
    code,
    setCode,
    language,
    setLanguage,
    testResults,
    handleStartCoding,
    handleRunCode,
    handleSubmitCode,
    handleCloseEditor,
  }
}
