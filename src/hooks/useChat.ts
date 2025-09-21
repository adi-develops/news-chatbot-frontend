import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, ChatSession, SessionResponse, QueryResponse } from '../types';
import { api, handleApiCall } from '../utils/api';
import { useApiCall } from './useApi';

/**
 * Custom hook for managing chat state and API interactions
 */
export function useChat() {
  const [session, setSession] = useState<ChatSession>({
    sessionId: '',
    messages: [],
    isLoading: false,
    error: null,
  });

  const [isTyping, setIsTyping] = useState(false);
  const sessionApi = useApiCall();
  const queryApi = useApiCall();
  const deleteApi = useApiCall();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session and fetch history from backend on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatbot_session_id');
    if (storedSessionId) {
      (async () => {
        try {
          // Fetch history from backend
          const response = await api.get(`/history/${storedSessionId}`);
          const history = response.data?.history || [];
          // Map backend roles to local Message type
            const messages = history
            .filter((msg: any) => msg.role !== 'system')
            .map((msg: any, idx: number) => ({
              id: (msg.timestamp || Date.now() + idx).toString(),
              content: msg.content,
              sender: msg.role === 'user' ? 'user' : 'bot',
              timestamp: new Date(msg.timestamp),
              status: 'sent',
            }));
          setSession(prev => ({
            ...prev,
            sessionId: storedSessionId,
            messages,
          }));
        } catch (error) {
          setSession(prev => ({ ...prev, error: error instanceof Error ? error.message : String(error) }));
        }
      })();
    }
  }, []);

  // No longer persisting messages to localStorage
  const persistMessages = () => {};

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Create new chat session
  const createSession = useCallback(async (): Promise<string> => {
    try {
      const result = await sessionApi.execute(() =>
        handleApiCall<SessionResponse>(() => api.post('/session'))
      );

      const sessionId = result.sessionId;
      localStorage.setItem('chatbot_session_id', sessionId);
      
      setSession(prev => ({
        ...prev,
        sessionId,
        messages: [],
        error: null,
      }));

      return sessionId;
    } catch (error) {
      setSession(prev => ({ ...prev, error: error instanceof Error ? error.message : String(error) }));
      throw error;
    }
  }, [sessionApi]);

  // Send message and get bot response
  const sendMessage = useCallback(async (query: string): Promise<void> => {
    if (!query.trim() || !session.sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: query.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    // Add user message immediately
    setSession(prev => {
      const newMessages = [...prev.messages, userMessage];
      return { ...prev, messages: newMessages, error: null };
    });

    setIsTyping(true);

    try {
      const result = await queryApi.execute(() =>
        handleApiCall<QueryResponse>(() =>
          api.post('/chat', { sessionId: session.sessionId, query: query.trim() })
        )
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent',
      };

      setSession(prev => {
        const newMessages = [...prev.messages, botMessage];
        return { ...prev, messages: newMessages };
      });

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'error',
      };

      setSession(prev => {
        const newMessages = [...prev.messages, errorMessage];
        return { ...prev, messages: newMessages, error: error instanceof Error ? error.message : String(error) };
      });
    } finally {
      setIsTyping(false);
    }
  }, [session.sessionId, queryApi, persistMessages]);

  // Delete chat history
  const deleteHistory = useCallback(async (): Promise<void> => {
    if (!session.sessionId) return;

    try {
      await deleteApi.execute(() =>
        handleApiCall<void>(() => api.delete(`/history/${session.sessionId}`))
      );

      // Clear local storage and state
      localStorage.removeItem('chatbot_session_id');
      setSession(prev => ({
        ...prev,
        sessionId: '',
        messages: [],
        error: null,
      }));

    } catch (error) {
      setSession(prev => ({ ...prev, error: error instanceof Error ? error.message : String(error) }));
      throw error;
    }
  }, [session.sessionId, deleteApi]);

  // Retry failed message
  const retryMessage = useCallback(async (messageId: string): Promise<void> => {
    const message = session.messages.find(msg => msg.id === messageId);
    if (!message || message.sender !== 'user') return;

    await sendMessage(message.content);
  }, [session.messages, sendMessage]);

  // Get loading states
  const isSessionLoading = sessionApi.loading;
  const isMessageLoading = queryApi.loading;
  const isDeleteLoading = deleteApi.loading;

  // Get errors
  const sessionError = sessionApi.error;
  const messageError = queryApi.error;
  const deleteError = deleteApi.error;

  return {
    session,
    isTyping,
    isSessionLoading,
    isMessageLoading,
    isDeleteLoading,
    sessionError,
    messageError,
    deleteError,
    messagesEndRef,
    createSession,
    sendMessage,
    deleteHistory,
    retryMessage,
    scrollToBottom,
  };
}