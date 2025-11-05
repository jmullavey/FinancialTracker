// Storage factory - creates the appropriate adapter based on environment
import { StorageAdapter } from './adapter'
import { FileSystemAdapter } from './fileSystemAdapter'
import { KVAdapter } from './kvAdapter'
import path from 'path'

// Determine which storage adapter to use
export function createStorageAdapter(): StorageAdapter {
  // Use Vercel KV if:
  // 1. Running on Vercel (VERCEL env var is set)
  // 2. KV connection string is configured (KV_URL or KV_REST_API_URL)
  const useKV = process.env.VERCEL && (
    process.env.KV_URL || 
    process.env.KV_REST_API_URL ||
    process.env.KV_REST_API_TOKEN
  )

  if (useKV) {
    console.log('Using Vercel KV for persistent JSON storage')
    return new KVAdapter('financial-tracker:')
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

