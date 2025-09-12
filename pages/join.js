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
      // Let's make an HTTP request to /api/rooms/by-pin/ and give the pin number
      const roomResponse = await fetch(`/api/rooms/by-pin/${pin}`)
      if (!roomResponse.ok) {
        throw new Error("Invalid PIN")
      }
      
      // *Destructure* the `roomId` field from response
      // the response is a javascript object which looks like this:
      // { roomId: room.id }
      const { roomId } = await roomResponse.json()

      // Then join the room
      const joinResponse = await fetch(`/api/rooms/${roomId}/players`, {
        // What should the HTTP request method be? We want the server to write our name in its database
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!joinResponse.ok) {
        throw new Error("Failed to join game")
      }

      // Destructure the `playerId` and `playerToken` from the response, which is an object
      const {playerId,playerToken} = await joinResponse.json()

      // Store player token in localStorage
      localStorage.setItem("playerToken", playerToken)
      localStorage.setItem("playerId", playerId)
      localStorage.setItem("roomId", roomId)

      // Redirect to game by changing the page the user is on
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
          {/* Which function should we call to join the game once the form has been submitted? */}
          <form onSubmit={joinGame} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                // What function do we call to set the name of the player?
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
                // What function do we call to set the pin of the player?
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={5}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                            {/* How do we make this button *disabled* if the `loading` state is true? */}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disable={loading}>
              {/* If `loading` is true, then show the text "Joining ...", if it's false, then show the text "Join Game" */}
              {/* HINT: Use the ternary operator!   __ ? __  : __  */}
              {loading ? "Joining" : "Join Game"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
