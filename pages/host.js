"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import PinBadge from "../components/PinBadge"
import PlayerList from "../components/PlayerList"
import HostControls from "../components/HostControls"
import DebugPanel from "../components/DebugPanel"
import { useGamePolling } from "../hooks/useGamePolling"

export default function Host() {
  const [room, setRoom] = useState(null)
  const [createError, setCreateError] = useState(null)
  const [creating, setCreating] = useState(false)

  // Use the polling hook for game state management
  const { gameState, loading, error, connected, refreshState } = useGamePolling(
    room?.roomId,
    room?.adminToken,
    "adminToken",
  )

  const createRoom = async () => {
    setCreating(true)
    setCreateError(null)

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create room")
      }

      const data = await response.json()
      setRoom(data)

      // Store room info in localStorage for recovery
      localStorage.setItem("hostRoom", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to create room:", error)
      setCreateError(error.message)
    } finally {
      setCreating(false)
    }
  }

  // Try to recover room from localStorage on mount
  useEffect(() => {
    const savedRoom = localStorage.getItem("hostRoom")
    if (savedRoom) {
      try {
        const roomData = JSON.parse(savedRoom)
        // Validate the room data
        if (roomData.roomId && roomData.adminToken && roomData.pin) {
          setRoom(roomData)
        } else {
          localStorage.removeItem("hostRoom")
        }
      } catch (error) {
        console.error("Failed to parse saved room:", error)
        localStorage.removeItem("hostRoom")
      }
    }
  }, [])

  const clearRoom = () => {
    setRoom(null)
    localStorage.removeItem("hostRoom")
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">Host a Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm">{createError}</div>
              </div>
            )}
            <Button onClick={createRoom} className="w-full bg-green-600 hover:bg-green-700" disabled={creating}>
              {creating ? "Creating Room..." : "Create Room"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Host Dashboard</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <PinBadge pin={room.pin} />
            <Badge variant={connected ? "default" : "destructive"} className="text-sm">
              {connected ? "Connected" : error ? "Connection Error" : "Connecting..."}
            </Badge>
          </div>
          {process.env.NODE_ENV === "development" && (
            <Button onClick={clearRoom} variant="outline" size="sm" className="mt-2 bg-transparent">
              Clear Room (Dev)
            </Button>
          )}
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-red-800 text-sm">{error}</div>
                <Button
                  onClick={refreshState}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <PlayerList players={gameState?.players || []} />
          <HostControls room={room} gameState={gameState} onStateChange={refreshState} loading={loading} />
        </div>
      </div>

      <DebugPanel gameState={gameState} room={room} />
    </div>
  )
}
