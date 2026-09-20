// src/services/messageService.ts
import { apiClient, ApiError } from '@/lib/apiClient'

export type MessageRole = 'admin' | 'teacher' | 'student' | 'parent'
export type MessageFolder = 'inbox' | 'sent' | 'archive'

export interface MessageAttachment {
  name: string
  size: string
  url: string
}

export interface MessageItem {
  id: string
  threadId: string
  /** 'me' for the current user, otherwise the other participant's user id */
  senderId: string
  body: string
  createdAt: string
  attachment?: MessageAttachment
}

export interface MessageThread {
  id: string
  /** Display name of the other participant, or the recipient for sent items */
  counterpartyName: string
  counterpartyRole: MessageRole
  counterpartyAvatarUrl?: string
  subject: string
  preview: string
  lastMessageAt: string
  unread: boolean
  starred: boolean
  hasAttachment: boolean
  folder: MessageFolder
}

export interface ThreadDetail {
  thread: MessageThread
  messages: MessageItem[]
}

export interface SendMessagePayload {
  body: string
  attachment?: MessageAttachment
}

export interface CreateThreadPayload {
  recipientId: string
  subject: string
  body: string
}

const STUB_MESSAGE =
  'The messaging module is not yet implemented on the backend. Messages will start persisting once the Message and MessageThread models land.'

function isStubError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 501 || err.status === 404)
}

export const messageService = {
  /** Reads return [] if the endpoint isn't there yet. */
  listThreads: async (folder?: MessageFolder): Promise<MessageThread[]> => {
    try {
      const qs = folder ? `?folder=${encodeURIComponent(folder)}` : ''
      const data = await apiClient.get<MessageThread[]>(`/messages${qs}`)
      return Array.isArray(data) ? data : []
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  getThread: async (id: string): Promise<ThreadDetail | null> => {
    try {
      return await apiClient.get<ThreadDetail>(`/messages/${id}`)
    } catch (err) {
      if (isStubError(err)) return null
      throw err
    }
  },

  /** Writes throw a friendly message if the endpoint is a stub. */
  createThread: async (payload: CreateThreadPayload): Promise<MessageThread> => {
    try {
      return await apiClient.post<MessageThread>('/messages', payload)
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  sendMessage: async (
    threadId: string,
    payload: SendMessagePayload
  ): Promise<MessageItem> => {
    try {
      return await apiClient.post<MessageItem>(
        `/messages/${threadId}/reply`,
        payload
      )
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  setRead: async (threadId: string, read: boolean): Promise<void> => {
    try {
      await apiClient.patch<void>(`/messages/${threadId}`, { read })
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  setStarred: async (threadId: string, starred: boolean): Promise<void> => {
    try {
      await apiClient.patch<void>(`/messages/${threadId}`, { starred })
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  deleteThread: async (threadId: string): Promise<void> => {
    try {
      await apiClient.delete<void>(`/messages/${threadId}`)
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  stubMessage: STUB_MESSAGE,
}