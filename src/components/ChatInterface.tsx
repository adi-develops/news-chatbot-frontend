import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Header } from "./Header";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";
import { IngestPanel } from "./IngestPanel";
import { LoadingSpinner } from "./LoadingSpinner";
import { useChat } from "../hooks/useChat";
import { AlertCircle } from "lucide-react";

/**
 * Main chat interface component combining all chat functionality
 */
export const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useChat();

  // Ensure we have a session or redirect to welcome
  useEffect(() => {
    const initializeSession = async () => {
      if (!session.sessionId && !isSessionLoading) {
        const storedSessionId = localStorage.getItem("chatbot_session_id");
        if (!storedSessionId) {
          navigate("/", { replace: true });
          return;
        }
      }
    };
    initializeSession();
  }, [session.sessionId, isSessionLoading, navigate, createSession]);

  // Show loading while initializing session
  if (isSessionLoading || (!session.sessionId && !sessionError)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing chat session...</p>
        </motion.div>
      </div>
    );
  }

  // Show error if session creation failed
  if (sessionError && !session.sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 mb-6">
              Failed to connect to the chat service. Please check your
              connection and try again.
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createSession()}
                disabled={isSessionLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isSessionLoading ? "Retrying..." : "Retry Connection"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Welcome
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <Header
        onDeleteHistory={deleteHistory}
        isDeleteLoading={isDeleteLoading}
        deleteError={deleteError?.message || null}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full shadow-lg bg-white">
        {/* Data ingestion panel */}
        <IngestPanel />

        {/* Chat messages */}
        <ChatWindow
          messages={session.messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          onRetry={retryMessage}
          scrollToBottom={scrollToBottom}
        />

        {/* Message input */}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={!session.sessionId || isMessageLoading}
          error={messageError?.message || null}
        />
      </div>
    </motion.div>
  );
};
