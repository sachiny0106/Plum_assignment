import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const API_KEY = process.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  console.error("Error: VITE_GOOGLE_API_KEY is not set in .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Just to get the client
    // Actually the SDK doesn't have a direct listModels on the client instance in some versions, 
    // but usually it's on the GoogleGenerativeAI instance or we just try a model.
    // Wait, the SDK usually doesn't expose listModels directly in the browser-like client.
    // But let's try to just run a simple generation with 'gemini-pro' to see if it works.
    
    console.log("Trying gemini-pro...");
    const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await modelPro.generateContent("Hello");
    console.log("gemini-pro worked:", result.response.text());
  } catch (e) {
    console.log("gemini-pro failed:", e.message);
  }

  try {
    console.log("Trying gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash worked:", result.response.text());
  } catch (e) {
    console.log("gemini-1.5-flash failed:", e.message);
  }

  try {
    console.log("Trying gemini-1.5-flash-001...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash-001 worked:", result.response.text());
  } catch (e) {
    console.log("gemini-1.5-flash-001 failed:", e.message);
  }
}

listModels();
