import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  console.error("Missing VITE_GOOGLE_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");
// Using "gemini-2.5-flash" as requested.
// If this model is not available, fallback to "gemini-1.5-flash" or "gemini-pro".
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateQuestions = async (topic: string, retryCount = 0): Promise<Question[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please restart the server to load the .env file.");
  }
  
  const MAX_RETRIES = 3;
  console.log(`Generating questions for topic: ${topic} (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

  const prompt = `
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
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log("Raw AI response:", text);

    // Find JSON array in the response
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
    } else {
      throw new Error("No JSON array found in response");
    }
    
    const questions: Question[] = JSON.parse(text);
    
    // Basic validation
    if (!Array.isArray(questions) || questions.length === 0) {
       throw new Error("Parsed JSON is not a valid array of questions");
    }

    return questions;
  } catch (error) {
    console.error(`Error generating questions (Attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log("Retrying...");
      return generateQuestions(topic, retryCount + 1);
    }
    
    throw new Error("Failed to generate valid questions after multiple attempts. Please try again.");
  }
};

export const generateFeedback = async (score: number, total: number, topic: string): Promise<string> => {
  console.log(`Generating feedback for score ${score}/${total} on ${topic}`);

  const prompt = `
    The user scored ${score} out of ${total} on a quiz about "${topic}".
    Generate a short, encouraging, and personalized feedback message (max 2 sentences).
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating feedback:", error);
    return `Great job on the ${topic} quiz! You scored ${score}/${total}.`;
  }
};
