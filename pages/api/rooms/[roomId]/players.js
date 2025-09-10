import { rooms, generateId } from "../../../../lib/storage"

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { roomId } = req.query
  const { name } = req.body

  try {
    const room = rooms.get(roomId)
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" })
    }

    const playerId = generateId()
    const playerToken = generateId()

    const player = {
      id: playerId,
      name: name.trim(),
      score: 0,
      answered: {},
      token: playerToken,
    }

    room.players.push(player)
    
    // Force save the room since we modified its properties
    rooms.set(roomId, room)

    res.status(201).json({
      playerId,
      playerToken,
    })
  } catch (error) {
    console.error("Error adding player:", error)
    res.status(500).json({ error: "Failed to join room" })
  }
}
