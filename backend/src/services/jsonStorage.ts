import { v4 as uuidv4 } from 'uuid'
import { storageAdapter } from './storage'

// Generic JSON file manager - works with both file system and Vercel KV
class JsonFileManager<T extends { id: string }> {
  private filename: string
  private data: T[] = []
  private initialized = false

  constructor(filename: string) {
    this.filename = filename
  }

  private async init() {
    if (this.initialized) return
    
    try {
      const fileContent = await storageAdapter.read(this.filename)
      if (fileContent) {
        this.data = JSON.parse(fileContent)
      } else {
        // File doesn't exist, start with empty array
        this.data = []
        await this.save()
      }
    } catch (error: any) {
      // If parse error, start fresh
      if (error.message?.includes('JSON') || error.message?.includes('parse')) {
        console.warn(`Invalid JSON in ${this.filename}, starting fresh:`, error.message)
        this.data = []
        await this.save()
      } else {
        throw error
      }
    }
    
    this.initialized = true
  }

  private async save() {
    try {
      const jsonData = JSON.stringify(this.data, null, 2)
      await storageAdapter.write(this.filename, jsonData)
    } catch (error: any) {
      console.error(`Failed to save ${this.filename}:`, error)
      throw new Error(`Failed to save data: ${error.message}`)
    }
  }

  async findAll(): Promise<T[]> {
    await this.init()
    return [...this.data]
  }

  async findById(id: string): Promise<T | null> {
    await this.init()
    return this.data.find(item => item.id === id) || null
  }

  async findBy(field: keyof T, value: any): Promise<T[]> {
    await this.init()
    return this.data.filter(item => item[field] === value)
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    await this.init()
    const newItem = { ...item, id: uuidv4() } as T
    this.data.push(newItem)
    await this.save()
    return newItem
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    await this.init()
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) return null

    this.data[index] = { ...this.data[index], ...updates }
    await this.save()
    return this.data[index]
  }

  async delete(id: string): Promise<boolean> {
    await this.init()
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) return false

    this.data.splice(index, 1)
    await this.save()
    return true
  }

  async count(): Promise<number> {
    await this.init()
    return this.data.length
  }
}

// Data models
export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationTokenExpires?: string
  failedLoginAttempts?: number
  accountLockedUntil?: string
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  userId: string
  name: string
  type: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  color?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId?: string
  amount: number
  description: string
  merchant?: string
  date: string
  type: 'income' | 'expense' | 'transfer'
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Upload {
  id: string
  userId: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  s3Key: string
  status: 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface ParseJob {
  id: string
  uploadId: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalTransactions: number
  parsedTransactions: number
  errorMessage?: string
  previewData?: any
  allTransactions?: any[]
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  userId: string
  title: string
  description?: string
  amount?: number
  dueDate: string
  isRecurring: boolean
  recurringFrequency?: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

// Create file managers
export const users = new JsonFileManager<User>('users.json')
export const accounts = new JsonFileManager<Account>('accounts.json')
export const categories = new JsonFileManager<Category>('categories.json')
export const transactions = new JsonFileManager<Transaction>('transactions.json')
export const uploads = new JsonFileManager<Upload>('uploads.json')
export const parseJobs = new JsonFileManager<ParseJob>('parseJobs.json')
export const reminders = new JsonFileManager<Reminder>('reminders.json')

// Helper function to get current timestamp
export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}
