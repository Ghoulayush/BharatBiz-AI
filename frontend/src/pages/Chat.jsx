import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Phone,
  Globe,
  Settings,
  Menu,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Chat({ token, embedded = false }) {
  const [selectedAgent, setSelectedAgent] = useState("customer-service");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);

  const agents = [
    {
      id: "customer-service",
      name: "Customer Service",
      nameHindi: "ग्राहक सेवा",
      avatar: "👩‍💼",
      color: "bg-green-500",
      status: "online"
    },
    {
      id: "inventory",
      name: "Inventory Manager",
      nameHindi: "स्टॉक मैनेजर",
      avatar: "📦",
      color: "bg-orange-500",
      status: "online"
    },
    {
      id: "business",
      name: "Business Coordinator",
      nameHindi: "व्यापार समन्वयक",
      avatar: "📊",
      color: "bg-blue-500",
      status: "online"
    }
  ];

  const [chatMessages, setChatMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const getAgentInfo = (agentId) => {
    return agents.find(agent => agent.id === agentId);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "user",
        text: message,
        textEng: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: null
      };
      setChatMessages([...chatMessages, newMsg]);
      setMessage("");
      setIsTyping(true);

      try {
        const response = await axios.post("http://localhost:8000/chat", null, {
          params: { message, agent: selectedAgent },
          headers: { Authorization: `Bearer ${token}` },
        });

        const reply = {
          id: chatMessages.length + 2,
          sender: "agent",
          text: response.data.reply_hi || "यह आपके संदेश के लिए एक उत्तर है।",
          textEng: response.data.reply_en || "This is a reply to your message.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: selectedAgent
        };

        setTimeout(() => {
          setChatMessages(prev => [...prev, reply]);
          setIsTyping(false);
        }, 1000);

      } catch (err) {
        console.error("Failed to send:", err);
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  return (
    <div className={`min-h-screen flex ${embedded ? '' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      {!embedded && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                BharatBiz AI Chat
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              {language === "hi" ? "उपलब्ध एजेंट्स" : "Available Agents"}
            </h3>
            <div className="space-y-2">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                    selectedAgent === agent.id
                      ? 'bg-orange-50 border-l-4 border-orange-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">
                    {language === "hi" ? agent.nameHindi : agent.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {agent.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${embedded ? 'border border-gray-200 rounded-lg shadow-lg bg-white max-w-2xl mx-auto my-8' : ''}`}>
        <div className={`bg-white border-b border-gray-200 p-4 ${embedded ? 'rounded-t-lg' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!embedded && (
                <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              )}
              <Avatar>
                <AvatarFallback>
                  {getAgentInfo(selectedAgent)?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {language === "hi"
                    ? getAgentInfo(selectedAgent)?.nameHindi
                    : getAgentInfo(selectedAgent)?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {getAgentInfo(selectedAgent)?.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {embedded && (
            <div className="text-right mt-2">
              <Link to="/chat" className="text-sm text-orange-600 hover:underline">
                Open Full Chat
              </Link>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.sender === 'agent' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        {language === "hi"
                          ? getAgentInfo(msg.agent)?.nameHindi
                          : getAgentInfo(msg.agent)?.name}
                      </span>
                      <Badge className={`${getAgentInfo(msg.agent)?.color} text-white text-xs`}>
                        AI Agent
                      </Badge>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">
                      {language === "hi" ? msg.text : msg.textEng}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {language === "hi" ? "एजेंट टाइप कर रहा है..." : "Agent is typing..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className={`bg-white border-t border-gray-200 p-4 ${embedded ? 'rounded-b-lg' : ''}`}>
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === "hi" ? "मैसेज लिखें..." : "Type a message..."}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>
              {language === "hi"
                ? "Enter दबाएं या Send बटन क्लिक करें"
                : "Press Enter or click Send button"}
            </span>
            <span>
              {language === "hi" ? "भाषा: हिंदी" : "Language: English"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
