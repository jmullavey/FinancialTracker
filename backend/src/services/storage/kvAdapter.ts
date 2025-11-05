// Vercel KV storage adapter (for production on Vercel)
import { StorageAdapter } from './adapter'

// Lazy load @vercel/kv to avoid errors in local development
let kv: any = null
function getKV() {
  if (!kv) {
    try {
      kv = require('@vercel/kv').kv
    } catch (error) {
      throw new Error('Vercel KV is not available. Make sure @vercel/kv is installed and KV environment variables are set.')
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

