import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { sendMessage as sendMessageToApi } from "../utils/agentApi";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    try {
      // Format chat history for API
      const chatHistory = messages
        .map((msg, idx, arr) => {
          if (idx % 2 === 0 && arr[idx + 1]) {
            return {
              human: msg.text,
              ai: arr[idx + 1].text,
            };
          }
          return null;
        })
        .filter(Boolean);

      // Send message with chat history
      const data = await sendMessageToApi(userMessage, chatHistory);

      // Add agent response to chat
      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: "agent" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your request.",
          sender: "agent",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8 p-4">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.error
                    ? "bg-red-100 text-red-900"
                    : "bg-gray-100"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
