// Vercel KV storage for rooms (works in both dev and production)
import { kv } from '@vercel/kv'

// KV storage wrapper that mimics our current Map API
const rooms = {
  async get(roomId) {
    try {
      return await kv.get(`room:${roomId}`)
    } catch (error) {
      console.warn('Failed to get room from KV:', error.message)
      return null
    }
  },
  
  async set(roomId, room) {
    try {
      await kv.set(`room:${roomId}`, room)
    } catch (error) {
      console.warn('Failed to save room to KV:', error.message)
    }
    return this // for chaining
  },
  
  async delete(roomId) {
    try {
      return await kv.del(`room:${roomId}`)
    } catch (error) {
      console.warn('Failed to delete room from KV:', error.message)
      return false
    }
  },
  
  async values() {
    try {
      const keys = await kv.keys('room:*')
      if (keys.length === 0) return []
      const rooms = await kv.mget(...keys)
      return rooms.filter(Boolean)
    } catch (error) {
      console.warn('Failed to get all rooms from KV:', error.message)
      return []
    }
  }
}

// Helper function to generate random PIN
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Helper function to generate UUID-like ID
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export { rooms, generatePin, generateId }
