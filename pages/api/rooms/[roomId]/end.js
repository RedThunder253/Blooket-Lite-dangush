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

    // End the game
    room.phase = "end"

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error ending game:", error)
    res.status(500).json({ error: "Failed to end game" })
  }
}
