import { rooms } from "../../../../lib/storage"

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { roomId } = req.query
  const { adminToken } = req.body

  try {
    const room = rooms.get(roomId)
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    if (room.adminToken !== adminToken) {
      return res.status(401).json({ error: "Invalid admin token" })
    }

    if (room.phase !== "reveal") {
      return res.status(400).json({ error: "Not in reveal phase" })
    }

    // Award points for correct answers
    const currentQuestion = room.questions[room.currentIndex]
    if (currentQuestion) {
      room.players.forEach((player) => {
        const playerChoice = player.answered[room.currentIndex]
        if (playerChoice === currentQuestion.correctIndex) {
          player.score += 1000 // Award 1000 points for correct answer
        }
      })
    }

    // Check if this was the last question
    if (room.currentIndex >= room.questions.length - 1) {
      room.phase = "end"
    } else {
      room.currentIndex++
      room.phase = "question"
    }
    
    // Force save the room since we modified its properties
    rooms.set(roomId, room)

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error moving to next question:", error)
    res.status(500).json({ error: "Failed to move to next question" })
  }
}
