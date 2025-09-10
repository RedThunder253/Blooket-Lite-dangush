import { rooms, generatePin, generateId } from "../../../lib/storage"
import { DEFAULT_QUESTIONS } from "../../../lib/questions"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { questions = DEFAULT_QUESTIONS } = req.body

    // Generate unique PIN (retry if collision)
    let pin
    let attempts = 0
    let existingRooms
    do {
      pin = generatePin()
      attempts++
      existingRooms = await rooms.values()
    } while (existingRooms.some((room) => room.pin === pin) && attempts < 10)

    if (attempts >= 10) {
      return res.status(500).json({ error: "Failed to generate unique PIN" })
    }

    const roomId = generateId()
    const adminToken = generateId()

    const room = {
      id: roomId,
      pin,
      adminToken,
      phase: "lobby",
      currentIndex: 0,
      players: [],
      questions: questions.map((q, index) => ({ ...q, id: index + 1 })),
      createdAt: Date.now(),
    }

    await rooms.set(roomId, room)

    res.status(201).json({
      roomId,
      pin,
      adminToken,
    })
  } catch (error) {
    console.error("Error creating room:", error)
    res.status(500).json({ error: "Failed to create room" })
  }
}
