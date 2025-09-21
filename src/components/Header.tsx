import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, AlertCircle } from "lucide-react";

interface HeaderProps {
  onDeleteHistory: () => Promise<void>;
  isDeleteLoading: boolean;
  deleteError: string | null;
}

/**
 * Chat interface header with title and delete history functionality
 */
export const Header: React.FC<HeaderProps> = ({
  onDeleteHistory,
  isDeleteLoading,
  deleteError,
}) => {
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all chat history? This action cannot be undone."
      )
    ) {
      try {
        await onDeleteHistory();
      } catch (error) {
        // Error is handled by parent component
        console.error("Failed to delete history:", error);
      }
    }
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 py-4">
      <div className="flex items-center justify-between">
        {/* App title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">News Chatbot</h1>
            <p className="text-sm text-gray-600">AI-powered news assistant</p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Delete error display */}
          {deleteError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{deleteError}</span>
            </motion.div>
          )}

          {/* Delete history button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={isDeleteLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              isDeleteLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            title="Delete chat history"
            aria-label="Delete chat history"
          >
            {isDeleteLoading ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isDeleteLoading ? "Deleting..." : "Delete Chat"}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
