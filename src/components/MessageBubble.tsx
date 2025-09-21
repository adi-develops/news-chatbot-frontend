import { motion } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRetry,
}) => {
  const isUser = message.sender === "user";
  const isError = message.status === "error";

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg shadow-sm ${
          isUser
            ? "bg-blue-500 text-white ml-12"
            : isError
            ? "bg-red-100 text-red-800 border border-red-200 mr-12"
            : "bg-gray-100 text-gray-800 mr-12"
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Timestamp and status */}
        <div
          className={`flex items-center justify-between mt-2 text-xs ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span>{formatTimestamp(message.timestamp)}</span>

          <div className="flex items-center space-x-1">
            {/* Error indicator and retry button */}
            {isError && onRetry && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRetry(message.id)}
                className="p-1 hover:bg-red-200 rounded-full transition-colors"
                title="Retry message"
                aria-label="Retry message"
              >
                <RefreshCw className="w-3 h-3" />
              </motion.button>
            )}

            {/* Status indicator */}
            {message.status === "sending" && (
              <div className="w-2 h-2 bg-current opacity-50 rounded-full animate-pulse" />
            )}
            {message.status === "error" && (
              <AlertCircle className="w-3 h-3 text-red-500" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
