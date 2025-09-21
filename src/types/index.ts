/**
 * TypeScript interfaces for the chatbot application
 */

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatSession {
  sessionId: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface SessionResponse {
  sessionId: string;
}

export interface QueryRequest {
  sessionId: string;
  query: string;
}

export interface QueryResponse {
  response: string;
}

export interface IngestRequest {
  text: string;
}

export interface IngestResponse {
  success: boolean;
  message?: string;
}

export interface ApiHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}