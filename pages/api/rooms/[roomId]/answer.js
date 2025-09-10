import { rooms } from "../../../../lib/storage"

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { roomId } = req.query
  const { playerToken, qIndex, choice } = req.body

  try {
    const room = rooms.get(roomId)
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    // Find player
    const player = room.players.find((p) => p.token === playerToken)
    if (!player) {
      return res.status(401).json({ error: "Invalid player token" })
    }

    // Validate game state
    if (room.phase !== "question") {
      return res.status(400).json({ error: "Not accepting answers right now" })
    }

    if (qIndex !== room.currentIndex) {
      return res.status(400).json({ error: "Invalid question index" })
    }

    // Check if already answered
    if (player.answered[qIndex] !== undefined) {
      return res.status(400).json({ error: "Already answered this question" })
    }

    // Validate choice
    if (choice < 0 || choice > 3) {
      return res.status(400).json({ error: "Invalid choice" })
    }

    // Record answer
    player.answered[qIndex] = choice

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error submitting answer:", error)
    res.status(500).json({ error: "Failed to submit answer" })
  }
}
