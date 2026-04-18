const API_URL = "http://localhost:8001/api/v1/chat";

/**
 * ChatService provides methods to interact with the backend chat API.
 */
class ChatService {
    /**
     * Sends a message to the AI backend.
     * @param {string} message - User input message.
     * @param {Array} history - Previous conversation history.
     */
    async sendMessage(message, history = []) {
        try {
            const response = await fetch(`${API_URL}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, history }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get response from AI");
            }

            const data = await response.json();
            return data.data.message;
        } catch (error) {
            console.error("ChatService Error:", error);
            throw error;
        }
    }
}

export default new ChatService();
