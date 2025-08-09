import type { User } from "@/components/types"

const USER_SESSION_KEY = "user_session"
const SESSION_TIMESTAMP_KEY = "session_timestamp"
const SESSION_DURATION = 2 * 60 * 60 * 1000 // 2 hours

export function saveSession(user: User): void {
  try {
    const sessionData = {
      user,
      timestamp: Date.now(),
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData))
  } catch (error) {
    console.error("Failed to save session to localStorage", error)
  }
}

export function loadSession(): User | null {
  try {
    const sessionData = localStorage.getItem(USER_SESSION_KEY)
    if (!sessionData) return null

    const { user, timestamp } = JSON.parse(sessionData)
    const now = Date.now()

    if (now - timestamp > SESSION_DURATION) {
      clearSession()
      return null
    }

    return user
  } catch (error) {
    console.error("Failed to load session from localStorage", error)
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(USER_SESSION_KEY)
  } catch (error) {
    console.error("Failed to clear session from localStorage", error)
  }
}
