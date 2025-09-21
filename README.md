# News RAG Chatbot Frontend

A modern React-based frontend application for a RAG (Retrieval-Augmented Generation) powered news chatbot. This application provides an intuitive chat interface that allows users to interact with an AI assistant that can answer questions based on ingested news data.

## 🚀 Features

### Core Functionality

- **Welcome Screen**: Clean landing page with "Start Chat" button that initiates a new session
- **Chat Interface**: Real-time conversation UI with user and bot message bubbles
- **Session Management**: Persistent session handling with localStorage
- **Data Ingestion**: Collapsible panel for ingesting news articles via query keywords
- **History Management**: Delete chat history functionality
- **Responsive Design**: Mobile-friendly interface that works across all devices

### User Experience

- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Loading States**: Visual feedback during API calls and data processing
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **Real-time Updates**: Streaming responses and live status indicators

## 🛠 Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router 7.9.1
- **Styling**: Tailwind CSS 3.4.1
- **HTTP Client**: Axios 1.12.2
- **Animations**: Framer Motion 12.23.16
- **Icons**: Lucide React 0.344.0
- **Build Tool**: Vite 5.4.2
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ChatApp.tsx      # Main app with routing
│   ├── ChatInterface.tsx # Chat page layout
│   ├── ChatWindow.tsx   # Message display area
│   ├── ChatInput.tsx    # Message input component
│   ├── MessageBubble.tsx # Individual message component
│   ├── WelcomeScreen.tsx # Landing page
│   ├── IngestPanel.tsx  # Data ingestion component
│   ├── Header.tsx       # App header
│   └── LoadingSpinner.tsx # Loading indicator
├── hooks/               # Custom React hooks
│   ├── useChat.ts       # Chat state management
│   └── useApi.ts        # API call utilities
├── types/               # TypeScript definitions
│   └── index.ts         # Interface definitions
├── utils/               # Utility functions
│   └── api.ts           # Axios configuration
├── App.tsx              # Root component
└── main.tsx             # Application entry point
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd news-chatbot-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_REACT_APP_API_BASE_URL=https://your-backend-api-url.com/
   ```

4. **Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## 🔧 API Integration

The frontend communicates with the backend through the following endpoints:

### Session Management

- `POST /session` - Create a new chat session
- `DELETE /chat/:sessionId` - Delete chat history

### Chat Operations

- `POST /chat` - Send user query and receive bot response
- `POST /ingest` - Ingest news articles using query keywords

### Configuration

The API base URL is configured in `src/utils/api.ts` and can be set via environment variables:

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🎯 Usage Flow

1. **Start Session**: User clicks "Start Chat" on the welcome screen
2. **Session Creation**: Frontend calls `/session` endpoint to get a sessionId
3. **Chat Interface**: User can now send messages and receive AI responses
4. **Data Ingestion**: Users can expand the ingestion panel to add news articles
5. **History Management**: Users can clear chat history using the delete button

### Example User Journey

```
Welcome Screen → Start Chat → Chat Interface
     ↓              ↓              ↓
Session Created → Send Message → AI Response
     ↓              ↓              ↓
Persist Session → Ingest Data → Clear History
```

## 🚀 Deployment

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard:
   - `VITE_REACT_APP_API_BASE_URL`: Your backend API URL

### Vercel Deployment

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables:
   - `VITE_REACT_APP_API_BASE_URL`: Your backend API URL

### Environment Variables

Make sure to configure the following environment variable in your deployment platform:

- `VITE_REACT_APP_API_BASE_URL`: The base URL of your backend API

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Blue primary theme with gray accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Responsive**: Mobile-first design with breakpoints

### Animations

- **Page Transitions**: Smooth fade-in effects on page load
- **Button Interactions**: Hover and tap animations
- **Loading States**: Spinner animations and skeleton screens
- **Panel Animations**: Smooth expand/collapse for ingestion panel

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG compliant color combinations

## 🔮 Future Improvements

### Enhanced Features

- **Message Streaming**: Real-time streaming of AI responses
- **Authentication**: User login and session management
- **Dark Mode**: Theme switching capability
- **Message Search**: Search through chat history
- **Export Chat**: Download conversation history

Built with ❤️ using React, TypeScript, and modern web technologies.
