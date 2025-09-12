"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import QuestionView from "../../components/QuestionView"
import RevealView from "../../components/RevealView"
import Scoreboard from "../../components/Scoreboard"
import DebugPanel from "../../components/DebugPanel"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useGamePolling } from "../../hooks/useGamePolling"

export default function Play() {
  const router = useRouter()
  const { roomId } = router.query
  const [playerToken, setPlayerToken] = useState(null)

  // Get player token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("playerToken")
    const storedRoomId = localStorage.getItem("roomId")

    if (!token) {
      router.push("/join")
      return
    }

    // Validate that we're in the right room
    if (storedRoomId && storedRoomId !== roomId) {
      localStorage.removeItem("playerToken")
      localStorage.removeItem("playerId")
      localStorage.removeItem("roomId")
      router.push("/join")
      return
    }

    setPlayerToken(token)
  }, [router, roomId])

  // Use the polling hook for game state management
  const { gameState, loading, error, connected, refreshState } = useGamePolling(roomId, playerToken, "playerToken")

  // Handle token errors by redirecting to join
  useEffect(() => {
    if (error === "Invalid token") {
      localStorage.removeItem("playerToken")
      localStorage.removeItem("playerId")
      localStorage.removeItem("roomId")
      router.push("/join")
    }
  }, [error, router])

  if (loading && !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">Loading...</div>
          <div className="text-gray-600">Connecting to game...</div>
        </div>
      </div>
    )
  }

  if (error && error !== "Invalid token") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">
              {error === "Game not found" ? "Game Not Found" : "Connection Error"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              {error === "Game not found"
                ? "This game may have ended or the PIN is invalid."
                : "Unable to connect to the game. Please check your connection."}
            </p>
            <div className="space-y-2">
              <Button onClick={refreshState} className="w-full bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
              <Button onClick={() => router.push("/join")} variant="outline" className="w-full">
                Join Another Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Waiting for game data...</div>
        </div>
      </div>
    )
  }

  const renderGamePhase = () => {
    switch (gameState.phase) {
      case "lobby":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Waiting for Host</h2>
              <p className="text-gray-600 mb-6">The game will start soon...</p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Players in game: {gameState.players?.length || 0}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.players?.slice(0, 8).map((player, index) => (
                    <div key={player.id} className="bg-white px-3 py-1 rounded-full text-sm text-blue-700">
                      {player.name}
                    </div>
                  ))}
                  {gameState.players?.length > 8 && (
                    <div className="bg-white px-3 py-1 rounded-full text-sm text-blue-700">
                      +{gameState.players.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "question":
        return (
          <QuestionView
            question={gameState.question}
            roomId={roomId}
            playerToken={playerToken}
            hasAnswered={gameState.you?.answeredChoice !== undefined}
            currentIndex={gameState.currentIndex}
            onAnswerSubmitted={refreshState}
          />
        )

      case "reveal":
        return (
          <RevealView
            question={gameState.question}
            correctIndex={gameState.correctIndex}
            yourChoice={gameState.you?.answeredChoice}
            tallies={gameState.tallies}
          />
        )

      case "end":
        // If we are at the end of the game, show the Scoreboard component
        return <scoreboard scoreboard={gameState.scoreboard} />

      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="text-red-600">Unknown game phase: {gameState.phase}</div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Connection Status */}
        <div className="flex justify-center mb-4">
          <Badge variant={connected ? "default" : "destructive"} className="text-sm">
            {connected ? "Connected" : "Reconnecting..."}
          </Badge>
        </div>

        {renderGamePhase()}
      </div>

      <DebugPanel gameState={gameState} playerToken={playerToken} />
    </div>
  )
}
