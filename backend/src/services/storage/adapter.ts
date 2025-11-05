// Storage adapter interface - allows switching between file system and Vercel KV
export interface StorageAdapter {
  read(key: string): Promise<string | null>
  write(key: string, data: string): Promise<void>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

