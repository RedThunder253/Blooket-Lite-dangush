export function validateRoomData(room) {
  if (!room || typeof room !== "object") return false
  return !!(room.roomId && room.adminToken && room.pin)
}

export function validateGameState(gameState) {
  if (!gameState || typeof gameState !== "object") return false

  const validPhases = ["lobby", "question", "reveal", "end"]
  if (!validPhases.includes(gameState.phase)) return false

  if (typeof gameState.currentIndex !== "number" || gameState.currentIndex < 0) return false

  if (!Array.isArray(gameState.players)) return false

  return true
}

export function validatePlayerToken(token) {
  return typeof token === "string" && token.length > 0
}

export function validatePin(pin) {
  return typeof pin === "string" && /^\d{4,5}$/.test(pin)
}

export function validatePlayerName(name) {
  return typeof name === "string" && name.trim().length > 0 && name.trim().length <= 20
}
