// Storage factory - creates the appropriate adapter based on environment
import { StorageAdapter } from './adapter'
import { FileSystemAdapter } from './fileSystemAdapter'
import path from 'path'

// Determine which storage adapter to use
export function createStorageAdapter(): StorageAdapter {
  // Use Vercel KV if:
  // 1. Running on Vercel (VERCEL env var is set)
  // 2. KV connection string is configured (KV_URL, REDIS_URL, or KV_REST_API_URL)
  const useKV = process.env.VERCEL && (
    process.env.KV_URL || 
    process.env.REDIS_URL ||
    process.env.KV_REST_API_URL ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_REST_API_URL ||
    process.env.REDIS_REST_API_TOKEN
  )

  if (useKV) {
    try {
      // Dynamically import KV adapter only when needed (to avoid errors in local dev)
      const { KVAdapter } = require('./kvAdapter')
      console.log('Using Vercel KV for persistent JSON storage')
      const adapter = new KVAdapter('financial-tracker:')
      // Test the adapter by checking if it can read (will fail gracefully if KV not configured)
      return adapter
    } catch (error: any) {
      console.error('Failed to initialize KV adapter, falling back to file system:', error.message)
      // Fall back to file system if KV fails
    }
  }

  // Otherwise use file system (local development)
  const dataDir = process.env.VERCEL 
    ? path.join('/tmp', 'financial-tracker-data')
    : path.join(process.cwd(), process.env.DATA_DIR || 'data')
  
  console.log(`Using file system for JSON storage: ${dataDir}`)
  return new FileSystemAdapter(dataDir)
}

// Export singleton instance
export const storageAdapter = createStorageAdapter()

