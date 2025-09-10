"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function TestPage() {
  const [testResults, setTestResults] = useState([])
  const [testing, setTesting] = useState(false)

  const runTest = async (testName, testFn) => {
    try {
      await testFn()
      setTestResults((prev) => [...prev, { name: testName, status: "pass", error: null }])
    } catch (error) {
      setTestResults((prev) => [...prev, { name: testName, status: "fail", error: error.message }])
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setTestResults([])

    // Test 1: Create Room
    await runTest("Create Room", async () => {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Failed to create room")
      const data = await response.json()
      if (!data.roomId || !data.pin || !data.adminToken) {
        throw new Error("Invalid room data returned")
      }
      window.testRoom = data
    })

    // Test 2: Find Room by PIN
    if (window.testRoom) {
      await runTest("Find Room by PIN", async () => {
        const response = await fetch(`/api/rooms/by-pin/${window.testRoom.pin}`)
        if (!response.ok) throw new Error("Failed to find room")
        const data = await response.json()
        if (data.roomId !== window.testRoom.roomId) {
          throw new Error("Room ID mismatch")
        }
      })

      // Test 3: Add Player
      await runTest("Add Player", async () => {
        const response = await fetch(`/api/rooms/${window.testRoom.roomId}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test Player" }),
        })
        if (!response.ok) throw new Error("Failed to add player")
        const data = await response.json()
        if (!data.playerId || !data.playerToken) {
          throw new Error("Invalid player data returned")
        }
        window.testPlayer = data
      })

      // Test 4: Get Game State
      await runTest("Get Game State", async () => {
        const response = await fetch(
          `/api/rooms/${window.testRoom.roomId}/state?adminToken=${window.testRoom.adminToken}`,
        )
        if (!response.ok) throw new Error("Failed to get game state")
        const data = await response.json()
        if (data.phase !== "lobby") {
          throw new Error("Expected lobby phase")
        }
        if (!Array.isArray(data.players) || data.players.length !== 1) {
          throw new Error("Expected 1 player in lobby")
        }
      })

      // Test 5: Start Game
      await runTest("Start Game", async () => {
        const response = await fetch(`/api/rooms/${window.testRoom.roomId}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminToken: window.testRoom.adminToken }),
        })
        if (!response.ok) throw new Error("Failed to start game")
      })

      // Test 6: Submit Answer
      if (window.testPlayer) {
        await runTest("Submit Answer", async () => {
          const response = await fetch(`/api/rooms/${window.testRoom.roomId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerToken: window.testPlayer.playerToken,
              qIndex: 0,
              choice: 0,
            }),
          })
          if (!response.ok) throw new Error("Failed to submit answer")
        })
      }
    }

    setTesting(false)
  }

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">Test page is only available in development mode.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Test Suite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runAllTests} disabled={testing} className="w-full">
              {testing ? "Running Tests..." : "Run All Tests"}
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{result.name}</span>
                    <Badge variant={result.status === "pass" ? "default" : "destructive"}>{result.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
