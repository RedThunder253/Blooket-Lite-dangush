import { rooms } from "../../../../lib/storage"

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { roomId } = req.query
  const { playerToken, adminToken } = req.query

  try {
    const room = rooms.get(roomId)
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    // Find player if playerToken provided
    let player = null
    if (playerToken) {
      player = room.players.find((p) => p.token === playerToken)
      if (!player) {
        return res.status(401).json({ error: "Invalid player token" })
      }
    }

    // Verify admin token if provided
    if (adminToken && adminToken !== room.adminToken) {
      return res.status(401).json({ error: "Invalid admin token" })
    }

    // Build response based on current phase
    const response = {
      phase: room.phase,
      currentIndex: room.currentIndex,
      players: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score })),
      totalQuestions: room.questions.length,
    }

    // Add phase-specific data
    if (room.phase === "question" || room.phase === "reveal") {
      const currentQuestion = room.questions[room.currentIndex]
      if (currentQuestion) {
        response.question = {
          text: currentQuestion.text,
          options: currentQuestion.options,
        }

        if (player) {
          response.you = {
            answeredChoice: player.answered[room.currentIndex],
          }
        }

        // Add reveal data if in reveal phase
        if (room.phase === "reveal") {
          response.correctIndex = currentQuestion.correctIndex

          // Calculate tallies
          const tallies = [0, 0, 0, 0]
          room.players.forEach((p) => {
            const choice = p.answered[room.currentIndex]
            if (choice !== undefined && choice >= 0 && choice <= 3) {
              tallies[choice]++
            }
          })
          response.tallies = tallies

          if (adminToken) {
            const totalAnswered = tallies.reduce((sum, count) => sum + count, 0)
            const correctAnswers = tallies[currentQuestion.correctIndex]
            response.stats = {
              totalAnswered,
              correctAnswers,
              accuracy: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0,
            }
          }
        }
      }
    }

    if (room.phase === "end") {
      // Sort players by score for final scoreboard
      response.scoreboard = room.players
        .map((p) => ({ name: p.name, score: p.score }))
        .sort((a, b) => b.score - a.score)
    }

    if (adminToken) {
      response.roomInfo = {
        pin: room.pin,
        createdAt: room.createdAt,
        playerCount: room.players.length,
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error getting room state:", error)
    res.status(500).json({ error: "Failed to get room state" })
  }
}
