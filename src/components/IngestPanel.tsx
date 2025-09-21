import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { api, handleApiCall } from "../utils/api";
import { useApiCall } from "../hooks/useApi";
import { IngestResponse } from "../types";

/**
 * Collapsible data ingestion panel component
 */
export const IngestPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { loading, error, execute } = useApiCall();

  // Handle text ingestion
  const handleIngest = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    try {
      await execute(() =>
        handleApiCall<IngestResponse>(() =>
          api.post("/ingest", { query: trimmedText })
        )
      );

      setSuccessMessage("News articles ingested successfully!");
      setText("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to ingest text:", err);
    }
  };

  const canIngest = text.trim().length > 0 && !loading;
  const characterCount = text.length;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="border-b bg-gray-50">
      {/* Panel header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
        aria-expanded={isExpanded}
        aria-controls="ingest-panel-content"
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Data Ingestion</span>
          <span className="text-sm text-gray-500">
            Add context for better responses
          </span>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Panel content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="ingest-panel-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Status messages */}
              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-800">
                      {successMessage}
                    </span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Failed to ingest text
                      </p>
                      <p className="text-sm text-red-600">{error.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text input area */}
              <div className="space-y-2">
                <label
                  htmlFor="ingest-text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Text to ingest
                </label>
                <textarea
                  id="ingest-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter query keywords you want the chatbot to learn from using the News API"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                  maxLength={10000}
                />

                {/* Text statistics */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{wordCount} words</span>
                  <span>{characterCount}/10,000 characters</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  💡 Tip: Add relevant query keywords
                </div>

                <motion.button
                  whileHover={canIngest ? { scale: 1.02 } : {}}
                  whileTap={canIngest ? { scale: 0.98 } : {}}
                  onClick={handleIngest}
                  disabled={!canIngest}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 ${
                    canIngest
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{loading ? "Ingesting..." : "Ingest Data"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
