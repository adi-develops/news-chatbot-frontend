import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./LoadingSpinner";
import { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onRetry: (messageId: string) => void;
  scrollToBottom: () => void;
}

/**
 * Main chat window component displaying messages and handling scroll behavior
 */
export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isTyping,
  messagesEndRef,
  onRetry,
  scrollToBottom,
}) => {
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, scrollToBottom]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {/* Empty state */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start a conversation
          </h3>
          <p className="text-gray-500 max-w-sm">
            Ask me anything about the news or topics you've ingested. I'm here
            to help!
          </p>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onRetry={onRetry} />
        ))}
      </AnimatePresence>

      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start"
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};
