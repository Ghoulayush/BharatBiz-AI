import { useState, useRef, useEffect } from "react";
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

// Firebase imports
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path accordingly

export default function Chat({ embedded = false }) {
  const [selectedAgent, setSelectedAgent] = useState("customer-service");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [uid, setUid] = useState(null);
  const messagesEndRef = useRef(null);

  const auth = getAuth();

  // Available AI agents
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

  // Get current user UID on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        setChatMessages([]);  // Clear chat if no user
      }
    });
    return unsubscribe;
  }, [auth]);

  // Load chat messages from Firestore for this user
  useEffect(() => {
    if (!uid) return;

    const loadChatMessages = async () => {
      try {
        const chatDocRef = doc(db, "chats", uid);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {
          const data = chatDocSnap.data();
          setChatMessages(data.messages || []);
        } else {
          setChatMessages([]);
        }
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    };

    loadChatMessages();
  }, [uid]);

  // Scroll to bottom whenever chatMessages or typing state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Save updated chat messages array in Firestore
  const saveChatMessages = async (messages) => {
    if (!uid) return;
    try {
      const chatDocRef = doc(db, "chats", uid);
      await setDoc(chatDocRef, { messages }, { merge: true });
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  };

  const getAgentInfo = (agentId) => agents.find(agent => agent.id === agentId);

  // Simple canned reply simulation for AI (replace or expand as needed)
  const getSimulatedAgentReply = (userMessage) => {
    if (selectedAgent === "customer-service") {
      return language === "hi"
        ? "यह ग्राहक सेवा के लिए एक उदाहरण प्रतिक्रिया है।"
        : "This is a sample reply from Customer Service.";
    }
    if (selectedAgent === "inventory") {
      return language === "hi"
        ? "यह स्टॉक मैनेजर के लिए एक उदाहरण प्रतिक्रिया है।"
        : "This is a sample reply from Inventory Manager.";
    }
    if (selectedAgent === "business") {
      return language === "hi"
        ? "यह व्यवसाय समन्वयक के लिए एक उदाहरण प्रतिक्रिया है।"
        : "This is a sample reply from Business Coordinator.";
    }
    return language === "hi" ? "यह आपकी मदद के लिए एक उत्तर है।" : "This is a reply to assist you.";
  };

  // Handle sending message and storing everything in Firestore directly
  const handleSendMessage = async () => {
    if (message.trim() && uid) {
      // User message
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "user",
        text: message,
        textEng: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agent: null
      };

      // Update messages state & clear input
      const updatedMessages = [...chatMessages, newMsg];
      setChatMessages(updatedMessages);
      setMessage("");
      setIsTyping(true);

      try {
        // Save user message immediately
        await saveChatMessages(updatedMessages);

        // Simulate agent reply with delay (1 second)
        const replyText = getSimulatedAgentReply(message);

        const reply = {
          id: updatedMessages.length + 1,
          sender: "agent",
          text: replyText,
          textEng: replyText,  // since it's already bilingual
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          agent: selectedAgent
        };

        const updatedWithReply = [...updatedMessages, reply];

        setTimeout(async () => {
          setChatMessages(updatedWithReply);
          await saveChatMessages(updatedWithReply);
          setIsTyping(false);
        }, 1000);
      } catch (err) {
        console.error("Error saving messages:", err);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className={`min-h-screen flex ${embedded ? "" : "bg-gray-50"}`}>
      {/* Sidebar */}
      {!embedded && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">BharatBiz AI Chat</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
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
                    selectedAgent === agent.id ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm">{language === "hi" ? agent.nameHindi : agent.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {agent.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          embedded ? "border border-gray-200 rounded-lg shadow-lg bg-white max-w-2xl mx-auto my-8" : ""
        }`}
      >
        <div className={`bg-white border-b border-gray-200 p-4 ${embedded ? "rounded-t-lg" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!embedded && (
                <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              )}
              <Avatar>
                <AvatarFallback>{getAgentInfo(selectedAgent)?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{language === "hi" ? getAgentInfo(selectedAgent)?.nameHindi : getAgentInfo(selectedAgent)?.name}</h3>
                <p className="text-sm text-gray-500">{getAgentInfo(selectedAgent)?.status === "online" ? "Online" : "Offline"}</p>
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
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                  {msg.sender === "agent" && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">{language === "hi" ? getAgentInfo(msg.agent)?.nameHindi : getAgentInfo(msg.agent)?.name}</span>
                      <Badge className={`${getAgentInfo(msg.agent)?.color} text-white text-xs`}>AI Agent</Badge>
                    </div>
                  )}
                  <div className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-orange-500 text-white" : "bg-white border border-gray-200"}`}>
                    <p className="text-sm">{language === "hi" ? msg.text : msg.textEng}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-orange-100" : "text-gray-500"}`}>{msg.time}</p>
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                    <span className="text-sm text-gray-500">{language === "hi" ? "एजेंट टाइप कर रहा है..." : "Agent is typing..."}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className={`bg-white border-t border-gray-200 p-4 ${embedded ? "rounded-b-lg" : ""}`}>
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === "hi" ? "मैसेज लिखें..." : "Type a message..."}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="bg-orange-500 hover:bg-orange-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{language === "hi" ? "Enter दबाएं या Send बटन क्लिक करें" : "Press Enter or click Send button"}</span>
            <span>{language === "hi" ? "भाषा: हिंदी" : "Language: English"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
