// File system storage adapter (for local development)
import fs from 'fs/promises'
import path from 'path'
import { StorageAdapter } from './adapter'

export class FileSystemAdapter implements StorageAdapter {
  private dataDir: string

  constructor(dataDir: string) {
    this.dataDir = dataDir
  }

  async ensureDir(): Promise<void> {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
    }
  }

  private getFilePath(key: string): string {
    return path.join(this.dataDir, key)
  }

  async read(key: string): Promise<string | null> {
    try {
      await this.ensureDir()
      const filePath = this.getFilePath(key)
      const content = await fs.readFile(filePath, 'utf-8')
      return content
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }

  async write(key: string, data: string): Promise<void> {
    await this.ensureDir()
    const filePath = this.getFilePath(key)
    await fs.writeFile(filePath, data, 'utf-8')
  }

  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key)
      await fs.unlink(filePath)
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key)
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }
}

