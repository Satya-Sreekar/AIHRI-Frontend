"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Brain, Sparkles, AlertCircle } from "lucide-react"
import type { UserRole } from "@/components/types"

interface LoginPageProps {
  onLogin: (email: string, role: UserRole) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate all fields are filled
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }
    
    if (!password.trim()) {
      setError("Please enter your password")
      return
    }
    
    if (!role) {
      setError("Please select your role")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // For demo purposes, accept any password
    // In a real app, you would validate against actual credentials
    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the login function
      onLogin(email, role)
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail)
    setPassword("password")
    setRole(demoRole)
    setError("")
  }

  const handleRoleChange = (value: string) => {
    const selectedRole = value as UserRole
    setRole(selectedRole)
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">AI Interview Portal</h1>
          <p className="text-gray-600 text-lg">Revolutionizing tech interviews with AI</p>
        </div>

        {/* Login Card */}
        <Card className="glass-effect elegant-shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  required
                  className="input-elegant h-12"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError("")
                  }}
                  required
                  className="input-elegant h-12"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">Login as</Label>
                <Select value={role || ""} onValueChange={handleRoleChange} disabled={isSubmitting}>
                  <SelectTrigger className="input-elegant h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Login as HR
                      </div>
                    </SelectItem>
                    <SelectItem value="Candidate">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Login as Candidate
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="button-elegant primary w-full h-12 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8 p-6 glass-effect rounded-2xl border border-white/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="font-medium text-gray-700">Demo Credentials</p>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">HR:</span>
                <span>hr@company.com / password</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDemoLogin("hr@company.com", "HR")}
                disabled={isSubmitting}
                className="text-xs"
              >
                Try HR
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Candidate:</span>
                <span>candidate@email.com / password</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDemoLogin("candidate@email.com", "Candidate")}
                disabled={isSubmitting}
                className="text-xs"
              >
                Try Candidate
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">AI-Powered Interviews</p>
              <p className="text-sm text-gray-600">Intelligent assessment and evaluation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Multi-Role Support</p>
              <p className="text-sm text-gray-600">HR and candidate interfaces</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 