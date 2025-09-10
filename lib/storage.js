// Simple file-based storage for rooms to survive hot reloads in development
import fs from 'fs'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), '.next', 'rooms.json')

// Ensure .next directory exists
const ensureStorageDir = () => {
  const dir = path.dirname(STORAGE_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Load rooms from file
const loadRooms = () => {
  try {
    ensureStorageDir()
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8')
      const roomsData = JSON.parse(data)
      return new Map(Object.entries(roomsData))
    }
  } catch (error) {
    console.warn('Failed to load rooms from storage:', error.message)
  }
  return new Map()
}

// Save rooms to file
const saveRooms = (rooms) => {
  try {
    ensureStorageDir()
    const roomsData = Object.fromEntries(rooms)
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(roomsData, null, 2))
  } catch (error) {
    console.warn('Failed to save rooms to storage:', error.message)
  }
}

// Create a proxy around Map to auto-save on changes
const createPersistentMap = () => {
  const rooms = loadRooms()
  
  return new Proxy(rooms, {
    get(target, prop) {
      if (prop === 'set') {
        return function(key, value) {
          const result = target.set(key, value)
          saveRooms(target)
          return result
        }
      }
      if (prop === 'delete') {
        return function(key) {
          const result = target.delete(key)
          saveRooms(target)
          return result
        }
      }
      if (prop === 'clear') {
        return function() {
          const result = target.clear()
          saveRooms(target)
          return result
        }
      }
      // For all other properties, bind the method to the target if it's a function
      const value = target[prop]
      if (typeof value === 'function') {
        return value.bind(target)
      }
      return value
    }
  })
}

const rooms = createPersistentMap()

// Helper function to generate random PIN
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Helper function to generate UUID-like ID
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export { rooms, generatePin, generateId }
