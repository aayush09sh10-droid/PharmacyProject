import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * GeminiService handles all interactions with the Google Gemini API.
 * It encapsulates the management of Generative models and system prompts.
 */
class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not defined in environment variables.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey || "");
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
                You are PharmaCare AI, a senior pharmacy assistant and medical consultant. 
                Your goal is to provide accurate, helpful, and empathetic information about medications, health queries, and wellness.

                Guidelines:
                1. Always maintain a professional yet approachable tone.
                2. If asked about medication usage, provide general information based on standard pharmaceutical knowledge but include a disclaimer that the user should consult their physician or a licensed pharmacist before starting any treatment.
                3. Do not prescribe specific dosages for serious conditions.
                4. Help users understand side effects, drug interactions, and general health tips.
                5. If appropriate, suggest finding nearby pharmacies for specific needs.
                6. Keep responses concise and well-structured using Markdown.
            `,
        });
    }

    /**
     * Generates a response based on the message and history.
     * @param {string} prompt - The user's input message.
     * @param {Array} history - Previous message history for context.
     * @returns {Promise<string>} - The generated response text.
     */
    async generateResponse(prompt, history = []) {
        try {
            const chat = this.model.startChat({
                history: history.map(msg => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }],
                })),
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to generate response from AI service.");
        }
    }
}

export default new GeminiService();
