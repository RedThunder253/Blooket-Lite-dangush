"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export default function DebugPanel({ gameState, room, playerToken }) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="sm" className="mb-2 bg-white shadow-lg">
        Debug {isOpen ? "▼" : "▲"}
      </Button>

      {isOpen && (
        <Card className="w-80 max-h-96 overflow-y-auto shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {room && (
              <div>
                <Badge variant="outline" className="text-xs">
                  Room
                </Badge>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                  <div>ID: {room.roomId}</div>
                  <div>PIN: {room.pin}</div>
                  <div>Admin: {room.adminToken?.slice(0, 8)}...</div>
                </div>
              </div>
            )}

            {playerToken && (
              <div>
                <Badge variant="outline" className="text-xs">
                  Player
                </Badge>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">Token: {playerToken.slice(0, 8)}...</div>
              </div>
            )}

            {gameState && (
              <div>
                <Badge variant="outline" className="text-xs">
                  Game State
                </Badge>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                  <div>Phase: {gameState.phase}</div>
                  <div>
                    Question: {gameState.currentIndex + 1}/{gameState.totalQuestions || 4}
                  </div>
                  <div>Players: {gameState.players?.length || 0}</div>
                  {gameState.you && <div>Answered: {gameState.you.answeredChoice !== undefined ? "Yes" : "No"}</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
