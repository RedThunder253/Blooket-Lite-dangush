import { rooms } from "../../../../lib/storage"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { pin } = req.query

  try {
    // Find room by PIN
    const allRooms = await rooms.values()
    const room = allRooms.find((r) => r.pin === pin)

    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    res.status(200).json({ roomId: room.id })
  } catch (error) {
    console.error("Error finding room by PIN:", error)
    res.status(500).json({ error: "Failed to find room" })
  }
}
