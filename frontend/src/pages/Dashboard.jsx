import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  Globe,
  Settings,
  ArrowLeft
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [language, setLanguage] = useState("en");
  const [festivalMode, setFestivalMode] = useState(false);

  const statsData = [
    {
      title: "Today's Orders",
      titleHindi: "आज के ऑर्डर",
      value: "₹24,500",
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Pending Complaints",
      titleHindi: "लंबित शिकायतें",
      value: "3",
      change: "-25%",
      trend: "down",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Low Stock Items",
      titleHindi: "कम स्टॉक आइटम",
      value: "7",
      change: "+2",
      trend: "up",
      icon: Package,
      color: "text-red-600"
    },
    {
      title: "Customer Satisfaction",
      titleHindi: "ग्राहक संतुष्टि",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const lowStockItems = [
    { name: "iPhone 15 Pro", nameHindi: "आईफोन 15 प्रो", stock: 2, minStock: 5, demand: "High" },
    { name: "Samsung Galaxy S24", nameHindi: "सैमसंग गैलेक्सी S24", stock: 1, minStock: 3, demand: "Medium" },
    { name: "OnePlus 12", nameHindi: "वनप्लस 12", stock: 0, minStock: 2, demand: "High" },
    { name: "AirPods Pro", nameHindi: "एयरपॉड्स प्रो", stock: 3, minStock: 8, demand: "Very High" }
  ];

  const agentActivity = [
    {
      agent: "Customer Service",
      agentHindi: "ग्राहक सेवा",
      avatar: "👩‍💼",
      status: "Online",
      chats: 12,
      resolved: 8,
      rating: 4.9
    },
    {
      agent: "Inventory Manager",
      agentHindi: "स्टॉक मैनेजर",
      avatar: "📦",
      status: "Online",
      chats: 6,
      resolved: 6,
      rating: 4.8
    },
    {
      agent: "Business Coordinator",
      agentHindi: "व्यापार समन्वयक",
      avatar: "📊",
      status: "Online",
      chats: 4,
      resolved: 3,
      rating: 4.7
    }
  ];

  const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 2000, orders: 12 },
    { name: 'Thu', sales: 2780, orders: 16 },
    { name: 'Fri', sales: 1890, orders: 11 },
    { name: 'Sat', sales: 2390, orders: 14 },
    { name: 'Sun', sales: 3490, orders: 20 }
  ];

  const festivalData = [
    { festival: 'Diwali', demand: 95, preparation: 'Required' },
    { festival: 'Dussehra', demand: 70, preparation: 'In Progress' },
    { festival: 'Navratri', demand: 85, preparation: 'Ready' },
    { festival: 'Karva Chauth', demand: 60, preparation: 'Planned' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? "व्यापार डैशबोर्ड" : "Business Dashboard"}
              </h1>
              <p className="text-gray-600">
                {language === "hi" 
                  ? "आपके व्यापार की वास्तविक समय की जानकारी" 
                  : "Real-time insights for your business"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={festivalMode ? "default" : "outline"}
              onClick={() => setFestivalMode(!festivalMode)}
              className="bg-gradient-to-r from-orange-500 to-green-600 text-white"
            >
              {language === "hi" ? "🎉 त्योहार मोड" : "🎉 Festival Mode"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === "hi" ? "English" : "हिंदी"}
            </Button>
            <Button variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Festival Mode Banner */}
        {festivalMode && (
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-green-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎊</span>
                <span>
                  {language === "hi" ? "त्योहार सीज़न मोड सक्रिय" : "Festival Season Mode Active"}
                </span>
              </CardTitle>
              <CardDescription>
                {language === "hi" 
                  ? "उच्च मांग अवधि के लिए विशेष निगरानी और सुझाव"
                  : "Special monitoring and recommendations for high-demand periods"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {festivalData.map((item, index) => (
                  <div key={index} className="text-center">
                    <p className="font-semibold">{item.festival}</p>
                    <Progress value={item.demand} className="mt-2" />
                    <p className="text-sm text-gray-600 mt-1">{item.demand}% demand</p>
                    <Badge variant="outline" className="mt-1">
                      {item.preparation}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "hi" ? stat.titleHindi : stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">
                    {language === "hi" ? "पिछले सप्ताह से" : "from last week"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "hi" ? "साप्ताहिक बिक्री" : "Weekly Sales"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sales" className="w-full">
                  <TabsList>
                    <TabsTrigger value="sales">
                      {language === "hi" ? "बिक्री" : "Sales"}
                    </TabsTrigger>
                    <TabsTrigger value="orders">
                      {language === "hi" ? "ऑर्डर" : "Orders"}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="sales">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="orders">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>
                    {language === "hi" ? "एजेंट गतिविधि" : "Agent Activity"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentActivity.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{agent.avatar}</div>
                        <div>
                          <p className="font-semibold">
                            {language === "hi" ? agent.agentHindi : agent.agent}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {agent.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {agent.chats} {language === "hi" ? "चैट्स" : "chats"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {agent.resolved}/{agent.chats}
                        </p>
                        <p className="text-sm text-gray-600">
                          ⭐ {agent.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>
                    {language === "hi" ? "कम स्टॉक अलर्ट" : "Low Stock Alerts"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">
                          {language === "hi" ? item.nameHindi : item.name}
                        </h4>
                        <Badge 
                          variant={item.stock === 0 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {item.stock === 0 ? "Out of Stock" : `${item.stock} left`}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {language === "hi" ? "न्यूनतम स्टॉक" : "Min Stock"}: {item.minStock}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {language === "hi" ? "मांग" : "Demand"}: {item.demand}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          {language === "hi" ? "ऑर्डर करें" : "Reorder"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "hi" ? "त्वरित कार्य" : "Quick Actions"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {language === "hi" ? "मांग पूर्वानुमान" : "Demand Forecast"}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  {language === "hi" ? "त्योहार तैयारी" : "Festival Preparation"}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  {language === "hi" ? "ग्राहक रिपोर्ट" : "Customer Report"}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {language === "hi" ? "फीडबैक विश्लेषण" : "Feedback Analysis"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
