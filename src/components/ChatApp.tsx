import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { WelcomeScreen } from "./WelcomeScreen";
import { ChatInterface } from "./ChatInterface";

/**
 * Main application component with routing
 */
export const ChatApp: React.FC = () => {
  return (
    <Router>
      <div className="font-sans antialiased">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};
