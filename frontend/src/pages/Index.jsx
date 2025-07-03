import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, X, MessageCircle, Package, BarChart3, Users, Star, Phone, Mail, MapPin } from "lucide-react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const agents = [
    {
      name: "Customer Service Agent",
      nameHindi: "ग्राहक सेवा एजेंट",
      icon: "👩‍💼",
      color: "bg-green-100 text-green-700",
      description: "24/7 customer support in Hindi & English",
      link: "/chat"
    },
    {
      name: "Inventory Manager",
      nameHindi: "इन्वेंटरी मैनेजर",
      icon: "🧑‍💻",
      color: "bg-orange-100 text-orange-700",
      description: "Smart stock management & alerts",
      link: "/inventory-manager"
    },
    {
      name: "Business Coordinator", 
      nameHindi: "व्यापार समन्वयक",
      icon: "🧠",
      color: "bg-blue-100 text-blue-700",
      description: "Analytics & business insights",
      link: "/business-coordinator"
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Smart Customer Service",
      titleHindi: "स्मार्ट ग्राहक सेवा",
      description: "AI-powered chat support in Hindi and English to handle customer queries 24/7"
    },
    {
      icon: Package,
      title: "Inventory Management",
      titleHindi: "इन्वेंटरी प्रबंधन",
      description: "Track stock levels, get low inventory alerts, and predict demand during festivals"
    },
    {
      icon: BarChart3,
      title: "Business Insights",
      titleHindi: "व्यापारिक अंतर्दृष्टि",
      description: "Real-time analytics and reports to help grow your business"
    }
  ];

  const testimonials = [
    {
      name: "राम कुमार",
      nameEng: "Ram Kumar",
      business: "Electronics Shop, Dell",
      quote: "BharatBiz ने मेरी दुकान को डिजिटल बनाया! अब मैं आसानी से अपने customers से बात कर सकता हूं।",
      quoteEng: "BharatBiz made my shop digital! Now I can easily talk to my customers.",
      rating: 5
    },
    {
      name: "प्रिया शर्मा", 
      nameEng: "Priya Sharma",
      business: "Saree Store, Mumbai",
      quote: "Festival season में inventory manage करना बहुत आसान हो गया है।",
      quoteEng: "Managing inventory during festival season has become very easy.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                B
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                BharatBiz AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
              <Link to="/chat" className="text-gray-700 hover:text-orange-600 transition-colors">Chat Demo</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 transition-colors">Dashboard</Link>
              <Link to="/inventory-manager" className="text-gray-700 hover:text-orange-600 transition-colors">Inventory</Link>
              <Link to="/business-coordinator" className="text-gray-700 hover:text-orange-600 transition-colors">Analytics</Link>
              <Link to="/login" className="text-gray-700 hover:text-orange-600 transition-colors">Login</Link>
              <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                Try Free | मुफ्त आज़माएं
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
                <Link to="/chat" className="text-gray-700 hover:text-orange-600 transition-colors">Chat Demo</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 transition-colors">Dashboard</Link>
                <Link to="/inventory-manager" className="text-gray-700 hover:text-orange-600 transition-colors">Inventory Manager</Link>
                <Link to="/business-coordinator" className="text-gray-700 hover:text-orange-600 transition-colors">Business Coordinator</Link>
                <Link to="/login" className="text-gray-700 hover:text-orange-600 transition-colors">Login</Link>
                <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 w-full">
                  Try Free | मुफ्त आज़माएं
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 mb-4">
              🇮🇳 Made for Indian Businesses | भारतीय व्यापार के लिए
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering Small Indian Businesses
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                with Smart AI Assistants
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              छोटे भारतीय व्यापारियों के लिए AI-powered platform जो customer service, inventory management, और business insights को आसान बनाता है।
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              An AI-powered platform that helps small Indian businesses manage customer service, inventory, and gain valuable business insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chat">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-lg px-8 py-3">
                  Try BharatBiz Assistant Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50 text-lg px-8 py-3">
                  View Dashboard Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Your AI Business Team | अपनी AI टीम से मिलें
            </h2>
            <p className="text-xl text-gray-600">
              Three specialized agents working 24/7 for your business success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <Link key={index} to={agent.link} className="block">
                <Card className="hover:shadow-lg transition-all duration-300 border-orange-100 cursor-pointer transform hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{agent.icon}</div>
                    <CardTitle className="text-xl">
                      {agent.name}
                      <br />
                      <span className="text-lg text-gray-600 font-normal">{agent.nameHindi}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${agent.color} mb-4 w-full justify-center`}>
                      Always Online | हमेशा उपलब्ध
                    </Badge>
                    <p className="text-gray-600 text-center">{agent.description}</p>
                    <div className="mt-4 text-center">
                      <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                        Access Now | अभी एक्सेस करें
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Business Solution | संपूर्ण व्यापारिक समाधान
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to run your business efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-orange-100">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-orange-600 mb-4" />
                  <CardTitle className="text-xl">
                    {feature.title}
                    <br />
                    <span className="text-lg text-gray-600 font-normal">{feature.titleHindi}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say | हमारे उपयोगकर्ता क्या कहते हैं
            </h2>
            <p className="text-xl text-gray-600">Real feedback from Indian business owners</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-orange-100">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">
                    {testimonial.name} ({testimonial.nameEng})
                  </CardTitle>
                  <CardDescription>{testimonial.business}</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 mb-2">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-500 italic">"{testimonial.quoteEng}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
            <br />
            अपने व्यापार को बदलने के लिए तैयार हैं?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Indian businesses already using BharatBiz AI Assistant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial | मुफ्त ट्रायल शुरू करें
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-3">
              Schedule Demo | डेमो बुक करें
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                  B
                </div>
                <span className="text-xl font-bold">BharatBiz AI Assistant</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering small Indian businesses with intelligent AI solutions for customer service, inventory management, and business growth.
              </p>
              <p className="text-gray-400">
                छोटे भारतीय व्यापारियों को AI की शक्ति से सशक्त बनाना।
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/chat" className="hover:text-white transition-colors">Chat Demo</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/inventory-manager" className="hover:text-white transition-colors">Inventory Manager</Link></li>
                <li><Link to="/business-coordinator" className="hover:text-white transition-colors">Business Coordinator</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact | संपर्क</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@bharatbiz.ai</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BharatBiz AI Assistant. Made with ❤️ for Indian Businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
