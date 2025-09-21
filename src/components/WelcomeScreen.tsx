import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  MessageSquare,
  Zap,
  Shield,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useChat } from "../hooks/useChat";

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createSession, isSessionLoading, sessionError, session } = useChat();

  useEffect(() => {
    const checkSession = async () => {
      if (session.sessionId) {
        navigate("/chat", { replace: false });
      }
    };
    checkSession();
  }, [session.sessionId]);

  const handleStartChat = async () => {
    try {
      await createSession();
      navigate("/chat");
    } catch (error) {
      // Error is handled by the hook and displayed below
      console.error("Failed to start chat:", error);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 p-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          {/* App icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>

          {/* Title and description */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            News RAG Chatbot
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your intelligent news companion. Ask questions, get insights, and
            explore topics with our AI-powered assistant that learns from your
            content.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Instant Responses
              </h3>
              <p className="text-sm text-gray-600">
                Get immediate answers to your questions with intelligent,
                context-aware responses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Content Learning
              </h3>
              <p className="text-sm text-gray-600">
                Enter your own query string to fetch news articles from the{" "}
                <a
                  href="https://newsapi.org/"
                  className="underline text-blue-500"
                >
                  News API
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Session Based Conversation
              </h3>
              <p className="text-sm text-gray-600">
                Your conversations and data are processed securely with privacy
                as a priority.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Error display */}
        {sessionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-red-800">
                Failed to start chat session
              </p>
              <p className="text-sm text-red-600">{sessionError.message}</p>
              <p className="text-sm text-red-600 mt-1">
                Please check your connection and try again.
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartChat}
            disabled={isSessionLoading}
            className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${
              isSessionLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg"
            }`}
            aria-label={
              isSessionLoading
                ? "Starting chat session"
                : "Start new chat session"
            }
          >
            {isSessionLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Starting Chat...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-6 h-6" />
                <span>Start Chat</span>
              </>
            )}
          </motion.button>

          {/* Helper text */}
          <p className="mt-3 text-sm text-gray-500">
            Click to create a new chat session and begin your conversation
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-5 pt-5 border-t border-gray-200"
        >
          <p className="text-sm text-gray-400">
            Built with React, TypeScript, and modern web technologies
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
