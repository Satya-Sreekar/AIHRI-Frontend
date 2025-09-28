"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { healthCheck, getModels, generateText } from "@/src/services/api"
import { API_CONFIG } from "@/src/config/api"

export default function TestAPIConnection() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testHealthCheck = async () => {
    setIsLoading(true)
    addResult("Testing health check...")
    
    try {
      const isHealthy = await healthCheck()
      addResult(`Health check: ${isHealthy ? 'SUCCESS' : 'FAILED'}`)
    } catch (error) {
      addResult(`Health check ERROR: ${error}`)
    }
    
    setIsLoading(false)
  }

  const testGetModels = async () => {
    setIsLoading(true)
    addResult("Testing get models...")
    
    try {
      const models = await getModels()
      addResult(`Get models SUCCESS: Found ${models.length} models`)
      models.forEach(model => {
        addResult(`  - ${model.name} (${(model.size / 1024 / 1024).toFixed(1)}MB)`)
      })
    } catch (error) {
      addResult(`Get models ERROR: ${error}`)
    }
    
    setIsLoading(false)
  }

  const testGenerateText = async () => {
    setIsLoading(true)
    addResult("Testing text generation...")
    
    try {
      const response = await generateText({
        model: 'llama3:8b',
        prompt: "Hello, this is a test message. Please respond with a brief greeting.",
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 50
        }
      })
      
      if (response) {
        addResult(`Text generation SUCCESS: "${response.response}"`)
      } else {
        addResult("Text generation FAILED: No response received")
      }
    } catch (error) {
      addResult(`Text generation ERROR: ${error}`)
    }
    
    setIsLoading(false)
  }

  const testAll = async () => {
    setResults([])
    addResult(`Testing API connection to: ${API_CONFIG.BASE_URL}`)
    addResult(`Default model: ${API_CONFIG.DEFAULT_MODEL}`)
    
    await testHealthCheck()
    await testGetModels()
    await testGenerateText()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAll} disabled={isLoading}>
              Test All
            </Button>
            <Button onClick={testHealthCheck} disabled={isLoading} variant="outline">
              Health Check
            </Button>
            <Button onClick={testGetModels} disabled={isLoading} variant="outline">
              Get Models
            </Button>
            <Button onClick={testGenerateText} disabled={isLoading} variant="outline">
              Generate Text
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-sm">
              {results.length === 0 ? "Click 'Test All' to start testing..." : results.join('\n')}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
