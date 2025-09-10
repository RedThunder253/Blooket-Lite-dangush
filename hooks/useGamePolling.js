"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useGamePolling(roomId, token, tokenType = "playerToken") {
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)

  const intervalRef = useRef(null)
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const fetchGameState = useCallback(async () => {
    if (!roomId || !token) return

    try {
      const queryParam = tokenType === "adminToken" ? `adminToken=${token}` : `playerToken=${token}`
      const response = await fetch(`/api/rooms/${roomId}/state?${queryParam}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Game not found")
        } else if (response.status === 401) {
          throw new Error("Invalid token")
        } else {
          throw new Error("Failed to fetch game state")
        }
      }

      const state = await response.json()
      setGameState(state)
      setError(null)
      setConnected(true)
      setLoading(false)
      retryCountRef.current = 0
    } catch (err) {
      console.error("Failed to fetch game state:", err)
      setError(err.message)
      setConnected(false)

      // Exponential backoff for retries
      retryCountRef.current++
      if (retryCountRef.current >= maxRetries) {
        setLoading(false)
        return
      }
    }
  }, [roomId, token, tokenType])

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial fetch
    fetchGameState()

    // Set up polling interval with exponential backoff on errors
    const getPollingInterval = () => {
      if (retryCountRef.current === 0) return 2000 // Normal polling: 2 seconds
      return Math.min(2000 * Math.pow(2, retryCountRef.current), 10000) // Max 10 seconds
    }

    const poll = () => {
      fetchGameState()
      intervalRef.current = setTimeout(poll, getPollingInterval())
    }

    intervalRef.current = setTimeout(poll, 2000)
  }, [fetchGameState])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const refreshState = useCallback(() => {
    fetchGameState()
  }, [fetchGameState])

  useEffect(() => {
    if (roomId && token) {
      startPolling()
    }

    return () => {
      stopPolling()
    }
  }, [roomId, token, startPolling, stopPolling])

  // Handle page visibility changes to pause/resume polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else if (roomId && token) {
        startPolling()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [roomId, token, startPolling, stopPolling])

  return {
    gameState,
    loading,
    error,
    connected,
    refreshState,
    startPolling,
    stopPolling,
  }
}
