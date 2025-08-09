"use client"

import { useState, useEffect, useCallback } from "react"
import { loadSession, saveSession, clearSession } from "@/src/utils/session"
import type { User, UserRole } from "@/components/types"

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionUser = loadSession()
    if (sessionUser) {
      setUser(sessionUser)
    }
    setLoading(false)
  }, [])

  const login = useCallback((email: string, role: UserRole) => {
    const newUser: User = { id: "1", email, name: email.split("@")[0], role }
    setUser(newUser)
    saveSession(newUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  return { user, login, logout, loading }
}
