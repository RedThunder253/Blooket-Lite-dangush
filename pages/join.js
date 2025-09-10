"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"

export default function Join() {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const joinGame = async (e) => {
    e.preventDefault()
    if (!name.trim() || !pin.trim()) {
      setError("Please enter both name and PIN")
      return
    }

    setLoading(true)
    setError("")

    try {
      // First, find the room by PIN
      const roomResponse = await fetch(`/api/rooms/by-pin/${pin}`)
      if (!roomResponse.ok) {
        throw new Error("Invalid PIN")
      }
      const { roomId } = await roomResponse.json()

      // Then join the room
      const joinResponse = await fetch(`/api/rooms/${roomId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!joinResponse.ok) {
        throw new Error("Failed to join game")
      }

      const { playerId, playerToken } = await joinResponse.json()

      // Store player token in localStorage
      localStorage.setItem("playerToken", playerToken)
      localStorage.setItem("playerId", playerId)
      localStorage.setItem("roomId", roomId)

      // Redirect to game
      router.push(`/play/${roomId}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-600">Join a Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={joinGame} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="pin">Game PIN</Label>
              <Input
                id="pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={5}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? "Joining..." : "Join Game"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
