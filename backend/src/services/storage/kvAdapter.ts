// Vercel KV storage adapter (for production on Vercel)
import { kv } from '@vercel/kv'
import { StorageAdapter } from './adapter'

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
      const value = await kv.get<string>(this.getKey(key))
      return value || null
    } catch (error) {
      console.error(`KV read error for key ${key}:`, error)
      throw error
    }
  }

  async write(key: string, data: string): Promise<void> {
    try {
      await kv.set(this.getKey(key), data)
    } catch (error) {
      console.error(`KV write error for key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await kv.del(this.getKey(key))
    } catch (error) {
      console.error(`KV delete error for key ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const value = await kv.get(this.getKey(key))
      return value !== null
    } catch {
      return false
    }
  }
}

