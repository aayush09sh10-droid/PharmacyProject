import geminiService from "../services/gemini.service.js";

/**
 * ChatController manages the chatbot endpoints.
 */
class ChatController {
    /**
     * Handles POST /api/v1/chat/message
     * Sends user message to Gemini and returns the AI response.
     */
    async sendMessage(req, res) {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }

        try {
            const aiResponse = await geminiService.generateResponse(message, history || []);
            
            return res.status(200).json({
                success: true,
                data: {
                    message: aiResponse,
                },
            });
        } catch (error) {
            console.error("ChatController Error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to process chat message.",
            });
        }
    }
}

export default new ChatController();
