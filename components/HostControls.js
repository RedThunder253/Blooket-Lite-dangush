"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

export default function HostControls({ room, gameState, onStateChange }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeRequest = async (endpoint, body = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/rooms/${room.roomId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, adminToken: room.adminToken }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Request failed")
      }

      // Trigger a state refresh
      setTimeout(() => {
        fetchGameState()
      }, 500)
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/rooms/${room.roomId}/state?adminToken=${room.adminToken}`)
      if (!response.ok) {
        throw new Error("Failed to fetch game state")
      }
      const state = await response.json()
      onStateChange(state)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch game state:", error)
      setError("Failed to update game state")
    }
  }

  const startGame = () => makeRequest("start")
  const revealAnswers = () => makeRequest("reveal")
  const nextQuestion = () => makeRequest("next")
  const endGame = () => makeRequest("end")

  if (!gameState) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading game state...</div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = gameState.question
  const progress =
    gameState.phase === "end"
      ? 100
      : ((gameState.currentIndex + (gameState.phase === "reveal" ? 1 : 0)) / (gameState.totalQuestions || 4)) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Game Controls</span>
          <Badge
            variant={gameState.phase === "lobby" ? "secondary" : gameState.phase === "end" ? "destructive" : "default"}
            className="capitalize"
          >
            {gameState.phase}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>
              Question {gameState.currentIndex + 1} of {gameState.totalQuestions || 4}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Question Display */}
        {currentQuestion && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">Current Question:</div>
            <div className="text-blue-900">{currentQuestion.text}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    gameState.phase === "reveal" && gameState.correctIndex === index
                      ? "bg-green-200 text-green-800 font-bold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}: {option}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Tallies (during reveal) */}
        {gameState.phase === "reveal" && gameState.tallies && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-3">Answer Results:</div>
            {gameState.stats && (
              <div className="mb-3 p-2 bg-white rounded text-sm">
                <div className="flex justify-between">
                  <span>
                    Answered: {gameState.stats.totalAnswered}/{gameState.players.length}
                  </span>
                  <span>Accuracy: {gameState.stats.accuracy}%</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {gameState.tallies.map((count, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">
                    {String.fromCharCode(65 + index)}: {currentQuestion.options[index]}
                  </span>
                  <Badge
                    variant={gameState.correctIndex === index ? "default" : "secondary"}
                    className={gameState.correctIndex === index ? "bg-green-600" : ""}
                  >
                    {count} votes
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-2">
          {gameState.phase === "lobby" && (
            <Button
              onClick={startGame}
              disabled={loading || gameState.players.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Starting..." : "Start Game"}
            </Button>
          )}

          {gameState.phase === "question" && (
            <Button onClick={revealAnswers} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Revealing..." : "Reveal Answers"}
            </Button>
          )}

          {gameState.phase === "reveal" && (
            <div className="space-y-2">
              <Button onClick={nextQuestion} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading
                  ? "Loading..."
                  : gameState.currentIndex >= (gameState.totalQuestions || 4) - 1
                    ? "Finish Game"
                    : "Next Question"}
              </Button>
              <Button
                onClick={endGame}
                disabled={loading}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                End Game Early
              </Button>
            </div>
          )}

          {gameState.phase === "end" && (
            <div className="text-center py-4">
              <div className="text-lg font-bold text-green-600 mb-2">Game Complete!</div>
              <div className="text-sm text-gray-600">Final scores are displayed below</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
