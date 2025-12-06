# AI-Powered Knowledge Quiz 🧠

A dynamic, AI-driven quiz application that generates questions on any topic you choose. Built with React, TypeScript, and Google's Gemini AI.

## 🎥 Demo

[**Live Demo**](https://plum-assignment-brown.vercel.app/)

## 🚀 Features

*   **Dynamic Topic Selection**: Enter any topic (e.g., "Quantum Physics", "History of Rome", "JavaScript") and get a custom quiz instantly.
*   **AI-Generated Content**: Questions, options, and explanations are generated in real-time using Google Gemini 2.5 Flash.
*   **Personalized Feedback**: Receive AI-generated feedback based on your score at the end of the quiz.
*   **Dark/Light Mode**: Fully responsive UI with theme switching support.
*   **Robust Error Handling**: Includes retry logic for AI requests and graceful error states.

## 🛠️ Tech Stack & Architecture

*   **Frontend**: React (Vite), TypeScript
*   **Styling**: CSS Modules / Standard CSS, Lucide React (Icons)
*   **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
*   **State Management**:
    *   `useState`: Used for local component state and the main `QuizState` (managing the quiz flow: topic selection -> loading -> active -> completed).
    *   `Context API`: Used for `ThemeContext` to manage global dark/light mode preferences.

### Architecture Overview

The app follows a clean, component-based architecture:

*   **`App.tsx`**: The main controller. It manages the high-level state machine of the quiz (Topic Selection -> Loading -> Quiz -> Results).
*   **`services/aiService.ts`**: Encapsulates all interactions with the Google Gemini API. It handles prompt engineering, JSON parsing, and retry logic.
*   **`components/`**: Reusable UI components (`QuizDisplay`, `TopicSelection`, `Feedback`, etc.) that receive data via props.

## 🤖 AI Prompts & Refinements

To ensure reliable JSON output from the LLM, we used specific prompt engineering techniques.

### 1. Question Generation Prompt
**Goal**: Get a strict JSON array of 5 questions.

**Prompt:**
```text
Generate 5 multiple-choice questions about "${topic}".
Return ONLY the raw JSON response (no markdown formatting) in the following format:
[
  {
    "id": "unique_id",
    "text": "Question text",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctOptionId": "id_of_correct_option",
    "explanation": "Brief explanation of why the correct answer is right"
  }
]
```

**Refinements Made:**
*   **"Return ONLY the raw JSON"**: Added to prevent the model from adding conversational filler like "Here are your questions:".
*   **JSON Structure Definition**: Explicitly provided the schema to ensure the frontend can parse it without errors.
*   **Parsing Logic**: Added a fallback in `aiService.ts` to extract JSON from markdown code blocks (e.g., \`\`\`json ... \`\`\`) if the model includes them.

### 2. Feedback Generation Prompt
**Goal**: Get a short, encouraging message based on the score.

**Prompt:**
```text
The user scored ${score} out of ${total} on a quiz about "${topic}".
Generate a short, encouraging, and personalized feedback message (max 2 sentences).
```

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Plum_assignment
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GOOGLE_API_KEY=your_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📸 Screenshots

### Topic Selection
*(Add screenshot of the home screen)*

### Quiz Interface
*(Add screenshot of a question being asked)*

### Results & Feedback
*(Add screenshot of the results screen)*

## ⚠️ Known Issues & Improvements

*   **AI Hallucinations**: Occasionally, the AI might generate a question with ambiguous options.
*   **Rate Limiting**: The free tier of Gemini API has rate limits. We implemented retry logic, but heavy usage might still hit limits.
*   **Improvement**: Add a "Review Answers" mode to see exactly which questions were wrong.
*   **Improvement**: Add a timer for each question to increase difficulty.

## 📝 License

MIT
