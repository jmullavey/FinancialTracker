// Vercel KV storage adapter (for production on Vercel)
import { StorageAdapter } from './adapter'

// Lazy load @vercel/kv to avoid errors in local development
let kv: any = null
function getKV() {
  if (!kv) {
    try {
      // Try to use @vercel/kv - it requires KV_REST_API_URL and KV_REST_API_TOKEN
      // If REDIS_URL is set instead, we'll need to handle it differently
      const kvModule = require('@vercel/kv')
      
      // Check if we have the required REST API variables
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        kv = kvModule.kv
      } else if (process.env.REDIS_REST_API_URL && process.env.REDIS_REST_API_TOKEN) {
        // Try with REDIS prefix
        kv = kvModule.kv
      } else if (process.env.REDIS_URL) {
        // REDIS_URL is set but not REST API vars - @vercel/kv won't work
        // We need to use a Redis client directly or get the REST API vars
        throw new Error('REDIS_URL is set but KV_REST_API_URL and KV_REST_API_TOKEN are required. Please reconnect the KV store in Vercel dashboard.')
      } else {
        throw new Error('KV environment variables are not set')
      }
    } catch (error: any) {
      throw new Error(`Vercel KV is not available: ${error.message}`)
    }
  }
  return kv
}

export class KVAdapter implements StorageAdapter {
  private prefix: string

  constructor(prefix: string = 'financial-tracker:') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  async read(key: string): Promise<string | null> {
    try {
      const kvInstance = getKV()
      const value = await kvInstance.get(this.getKey(key)) as string | null
      return value || null
    } catch (error) {
      console.error(`KV read error for key ${key}:`, error)
      throw error
    }
  }

  async write(key: string, data: string): Promise<void> {
    try {
      const kvInstance = getKV()
      await kvInstance.set(this.getKey(key), data)
    } catch (error) {
      console.error(`KV write error for key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const kvInstance = getKV()
      await kvInstance.del(this.getKey(key))
    } catch (error) {
      console.error(`KV delete error for key ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const kvInstance = getKV()
      const value = await kvInstance.get(this.getKey(key))
      return value !== null
    } catch {
      return false
    }
  }
}

