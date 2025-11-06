// Vercel KV storage adapter (for production on Vercel)
import { StorageAdapter } from './adapter'

// Lazy load Redis client to avoid errors in local development
let kv: any = null
function getKV() {
  if (!kv) {
    try {
      // First try @vercel/kv with REST API (preferred for Vercel KV)
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const kvModule = require('@vercel/kv')
        kv = kvModule.kv
        return kv
      }
      
      // If we have a direct Redis URL (KV_REDIS_URL or REDIS_URL), use redis package
      const redisUrl = process.env.KV_REDIS_URL || process.env.REDIS_URL
      if (redisUrl) {
        const redis = require('redis')
        const client = redis.createClient({ url: redisUrl })
        // Connect the client (redis v4+ requires explicit connection)
        // Don't await here - connection will be established on first operation
        client.connect().catch((err: any) => {
          console.error('Redis connection error:', err)
        })
        // Ensure client is ready before returning
        kv = client
        return kv
      }
      
      // Try @vercel/kv with default env vars
      try {
        const kvModule = require('@vercel/kv')
        kv = kvModule.kv
        return kv
      } catch {
        throw new Error('No KV environment variables found. Need either KV_REST_API_URL/KV_REST_API_TOKEN or KV_REDIS_URL/REDIS_URL')
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
      const fullKey = this.getKey(key)
      
      // Handle both @vercel/kv and redis package APIs
      if (typeof kvInstance.get === 'function') {
        const value = await kvInstance.get(fullKey)
        return typeof value === 'string' ? value : value ? JSON.stringify(value) : null
      } else {
        // redis package
        const value = await kvInstance.get(fullKey)
        return value || null
      }
    } catch (error) {
      console.error(`KV read error for key ${key}:`, error)
      throw error
    }
  }

  async write(key: string, data: string): Promise<void> {
    try {
      const kvInstance = getKV()
      const fullKey = this.getKey(key)
      
      // Handle both @vercel/kv and redis package APIs
      if (typeof kvInstance.set === 'function') {
        await kvInstance.set(fullKey, data)
      } else {
        // redis package
        await kvInstance.set(fullKey, data)
      }
    } catch (error) {
      console.error(`KV write error for key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const kvInstance = getKV()
      const fullKey = this.getKey(key)
      
      // Handle both @vercel/kv and redis package APIs
      if (typeof kvInstance.del === 'function') {
        await kvInstance.del(fullKey)
      } else {
        // redis package uses del or delete
        await (kvInstance.del || kvInstance.delete)(fullKey)
      }
    } catch (error) {
      console.error(`KV delete error for key ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const kvInstance = getKV()
      const fullKey = this.getKey(key)
      
      // Handle both @vercel/kv and redis package APIs
      if (typeof kvInstance.exists === 'function') {
        const result = await kvInstance.exists(fullKey)
        return result === 1 || result === true
      } else {
        // redis package
        const value = await kvInstance.get(fullKey)
        return value !== null
      }
    } catch {
      return false
    }
  }
}

