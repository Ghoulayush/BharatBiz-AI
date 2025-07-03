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
  Search,
  Settings,
  Menu,
  Globe,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Chat({ token }) {
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const customers = [
    {
      id: 1,
      name: "राम कुमार",
      nameEng: "Ram Kumar",
      lastMessage: "मुझे नए मोबाइल की जानकारी चाहिए",
      lastMessageEng: "I need information about new mobiles",
      time: "2 min",
      unread: 3,
      status: "online"
    },
    {
      id: 2,
      name: "प्रिया शर्मा",
      nameEng: "Priya Sharma",
      lastMessage: "Order status क्या है?",
      lastMessageEng: "What's the order status?",
      time: "5 min",
      unread: 1,
      status: "offline"
    },
    {
      id: 3,
      name: "अमित पटेल",
      nameEng: "Amit Patel",
      lastMessage: "Refund process के बारे में बताएं",
      lastMessageEng: "Tell me about refund process",
      time: "10 min",
      unread: 0,
      status: "online"
    }
  ];

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

  const initialMessages = [
    {
      id: 1,
      sender: "customer",
      text: "नमस्ते! मुझे iPhone 15 की कीमत जानना है",
      textEng: "Hello! I want to know the price of iPhone 15",
      time: "10:30 AM",
      agent: null
    },
    {
      id: 2,
      sender: "agent",
      text: "नमस्ते राम जी! iPhone 15 की कीमत ₹79,900 है। क्या आपको और कोई जानकारी चाहिए?",
      textEng: "Hello Ram ji! iPhone 15 price is ₹79,900. Do you need any other information?",
      time: "10:31 AM",
      agent: "customer-service"
    },
    {
      id: 3,
      sender: "customer",
      text: "क्या यह stock में है?",
      textEng: "Is this in stock?",
      time: "10:32 AM",
      agent: null
    },
    {
      id: 4,
      sender: "agent",
      text: "जी हाँ, हमारे पास iPhone 15 सभी रंगों में उपलब्ध है। आप कौन सा रंग पसंद करेंगे?",
      textEng: "Yes, we have iPhone 15 available in all colors. Which color would you prefer?",
      time: "10:33 AM",
      agent: "inventory"
    }
  ];

  const [chatMessages, setChatMessages] = useState(initialMessages);

  const messagesEndRef = useRef(null);

  const getAgentInfo = (agentId) => {
    return agents.find(agent => agent.id === agentId);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "customer",
        text: message,
        textEng: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: null
      };
      setChatMessages([...chatMessages, newMsg]);
      setMessage("");
      setIsTyping(true);

      try {
        await axios.post("http://localhost:8000/chat", null, {
          params: { message },
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Failed to send:", err);
      }

      setTimeout(() => {
        setIsTyping(false);
        // Remove this block if your backend replies back instead.
        const botReply = {
          id: chatMessages.length + 2,
          sender: "agent",
          text: "यह आपके संदेश के लिए एक ऑटो-उत्तर है।",
          textEng: "This is an auto-reply to your message.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: "customer-service"
        };
        setChatMessages(prev => [...prev, botReply]);
      }, 2000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const filteredCustomers = customers.filter(customer => {
    const name = language === "hi" ? customer.name : customer.nameEng;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              BharatBiz Chat
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            {language === "hi" ? "एजेंट स्थिति" : "Agent Status"}
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center space-x-3">
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

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCustomers.map((customer, index) => (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(index)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCustomer === index
                    ? 'bg-orange-50 border-l-4 border-orange-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {language === "hi" ? customer.name : customer.nameEng}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${customer.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-xs text-gray-500">
                          {customer.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{customer.time}</p>
                    {customer.unread > 0 && (
                      <Badge className="bg-orange-500 text-white text-xs mt-1">
                        {customer.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {language === "hi" ? customer.lastMessage : customer.lastMessageEng}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <Avatar>
                <AvatarFallback>
                  {customers[selectedCustomer]?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {language === "hi"
                    ? customers[selectedCustomer]?.name
                    : customers[selectedCustomer]?.nameEng}
                </h3>
                <p className="text-sm text-gray-500">
                  {customers[selectedCustomer]?.status === 'online' ? 'Online' : 'Last seen 2 hours ago'}
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
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'customer' ? 'order-2' : 'order-1'}`}>
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
                      msg.sender === 'customer'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">
                      {language === "hi" ? msg.text : msg.textEng}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'customer' ? 'text-orange-100' : 'text-gray-500'
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

        <div className="bg-white border-t border-gray-200 p-4">
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
// This code defines a chat interface for BharatBiz AI, allowing users to interact with customers and AI agents.