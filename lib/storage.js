// In-memory storage for rooms and game state
// This will reset when the server restarts - fine for educational purposes

const rooms = new Map()

// Helper function to generate random PIN
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Helper function to generate UUID-like ID
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export { rooms, generatePin, generateId }
