"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodingProblem, TestResult } from "@/components/types"
import {
  Code,
  X,
  Terminal,
  FileCode,
  Activity,
  Send,
} from "lucide-react"

interface CodeEditorModalProps {
  visible: boolean
  currentProblem: CodingProblem | null
  language: string
  setLanguage: (lang: string) => void
  code: string
  setCode: (code: string) => void
  testResults: TestResult[]
  handleRunCode: () => void
  handleSubmitCode: () => void
  onClose: () => void
}

export default function CodeEditorModal({
  visible,
  currentProblem,
  language,
  setLanguage,
  code,
  setCode,
  testResults,
  handleRunCode,
  handleSubmitCode,
  onClose,
}: CodeEditorModalProps) {
  if (!visible || !currentProblem) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentProblem.title}</h2>
              <Badge
                className={
                  currentProblem.difficulty === "Easy"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : currentProblem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {currentProblem.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onClose} className="control-button danger" style={{ width: "auto", height: "auto", minWidth: "auto", minHeight: "auto" }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Problem Description */}
          <div className="w-1/2 border-r border-gray-200">
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                    <FileCode className="h-4 w-4 mr-2 text-blue-600" />
                    Problem Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{currentProblem.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                    <Terminal className="h-4 w-4 mr-2 text-green-600" />
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {currentProblem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-sm space-y-2">
                          <div className="flex items-center">
                            <span className="text-blue-600 font-semibold mr-2">Input:</span>
                            <span className="text-gray-800">{example.input}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-600 font-semibold mr-2">Output:</span>
                            <span className="text-gray-800">{example.output}</span>
                          </div>
                          {example.explanation && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <span className="text-purple-600 font-semibold mr-2">Explanation:</span>
                              <span className="text-gray-600">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-orange-600" />
                    Constraints
                  </h3>
                  <ul className="list-disc list-inside space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                    {currentProblem.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 p-6">
              <div className="h-full border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-800 text-white p-3 text-sm font-mono flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-4 w-4" />
                    <span>
                      solution.{language === "python" ? "py" : language === "javascript" ? "js" : "java"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none bg-gray-900 text-gray-100"
                  style={{ minHeight: 300 }}
                  placeholder="Write your code here..."
                />
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="border-t border-gray-200 p-6 max-h-48 overflow-y-auto bg-gray-50">
                <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                  <Terminal className="h-4 w-4 mr-2 text-green-600" />
                  Test Results
                </h4>
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border text-sm ${
                        result.passed
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-medium flex items-center ${
                            result.passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.passed ? "✅ Passed" : "❌ Failed"}
                        </span>
                        <span className="text-gray-500 text-xs">{result.executionTime}ms</span>
                      </div>
                      <div className="font-mono text-xs space-y-1">
                        <div className="flex">
                          <span className="text-blue-600 w-16">Input:</span>
                          <span className="text-gray-700">{result.input}</span>
                        </div>
                        <div className="flex">
                          <span className="text-green-600 w-16">Expected:</span>
                          <span className="text-gray-700">{result.expectedOutput}</span>
                        </div>
                        <div className="flex">
                          <span className="text-purple-600 w-16">Got:</span>
                          <span className="text-gray-700">{result.actualOutput}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex space-x-3">
              <Button
                variant="outline"
                onClick={handleRunCode}
                className="control-button secondary flex-1"
                style={{ width: "auto", height: "auto", minWidth: "auto", minHeight: "auto" }}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button
                onClick={handleSubmitCode}
                className="control-button primary flex-1"
                style={{ width: "auto", height: "auto", minWidth: "auto", minHeight: "auto" }}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
