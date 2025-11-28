import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

let systemPrompt = "";
try {
  const promptPath = path.join(process.cwd(), "../Open Source prompts/Gemini CLI/google-gemini-cli-system-prompt.txt");
  systemPrompt = fs.readFileSync(promptPath, "utf-8");
} catch (error) {
  console.error("Error loading system prompt, using default");
  systemPrompt = "You are a helpful AI assistant specializing in software engineering tasks.";
}

export async function generateResponse(messages: Message[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("Error generating response:", error);
    throw new Error(error.message || "Failed to generate response");
  }
}
