import { rooms } from "../../../../lib/storage"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { roomId } = req.query
  const { adminToken } = req.body

  try {
    const room = await rooms.get(roomId)
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    if (room.adminToken !== adminToken) {
      return res.status(401).json({ error: "Invalid admin token" })
    }

    if (room.phase !== "question") {
      return res.status(400).json({ error: "Not in question phase" })
    }

    // Move to reveal phase
    room.phase = "reveal"
    
    // Force save the room since we modified its properties
    await rooms.set(roomId, room)

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error revealing answers:", error)
    res.status(500).json({ error: "Failed to reveal answers" })
  }
}
