
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar, Download, RefreshCw } from "lucide-react";

const BusinessCoordinator = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const businessMetrics = [
    { title: "Revenue", titleHindi: "आय", value: "₹4,85,250", change: "+12.5%", trend: "up" },
    { title: "Orders", titleHindi: "आदेश", value: "1,847", change: "+8.2%", trend: "up" },
    { title: "Customers", titleHindi: "ग्राहक", value: "892", change: "+15.7%", trend: "up" },
    { title: "Avg Order", titleHindi: "औसत आदेश", value: "₹2,630", change: "-2.1%", trend: "down" }
  ];

  const insights = [
    {
      title: "Festival Season Opportunity",
      titleHindi: "त्योहारी सीज़न का अवसर",
      description: "Diwali is approaching. Consider stocking up on electronics and gift items.",
      descriptionHindi: "दिवाली आ रही है। इलेक्ट्रॉनिक्स और उपहार की वस्तुओं का स्टॉक बढ़ाने पर विचार करें।",
      priority: "high",
      action: "Stock Up"
    },
    {
      title: "Customer Retention",
      titleHindi: "ग्राहक बनाए रखना",
      description: "15 customers haven't visited in 30+ days. Consider sending them special offers.",
      descriptionHindi: "15 ग्राहक 30+ दिनों से नहीं आए हैं। उन्हें विशेष ऑफर भेजने पर विचार करें।",
      priority: "medium",
      action: "Send Offers"
    },
    {
      title: "Peak Hours Analysis",
      titleHindi: "व्यस्त समय का विश्लेषण",
      description: "Most sales happen between 2-5 PM. Consider staff scheduling optimization.",
      descriptionHindi: "सबसे ज्यादा बिक्री दोपहर 2-5 बजे होती है। स्टाफ शेड्यूलिंग को अनुकूलित करने पर विचार करें।",
      priority: "low",
      action: "Optimize"
    }
  ];

  const salesData = [
    { period: "Week 1", sales: 85000, orders: 120 },
    { period: "Week 2", sales: 92000, orders: 135 },
    { period: "Week 3", sales: 78000, orders: 110 },
    { period: "Week 4", sales: 105000, orders: 148 }
  ];

  const customerSegments = [
    { segment: "Regular Customers", segmentHindi: "नियमित ग्राहक", count: 456, percentage: "51%" },
    { segment: "New Customers", segmentHindi: "नए ग्राहक", count: 234, percentage: "26%" },
    { segment: "VIP Customers", segmentHindi: "वीआईपी ग्राहक", count: 89, percentage: "10%" },
    { segment: "Inactive", segmentHindi: "निष्क्रिय", count: 113, percentage: "13%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="text-2xl">🧠</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Business Coordinator</h1>
                <p className="text-sm text-gray-500">व्यापार समन्वयक</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              🟢 Analyzing | विश्लेषण कर रहा है
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Business Analytics | व्यापारिक विश्लेषण
          </h2>
          <div className="flex space-x-2">
            {[
              { id: "day", label: "Today", labelHindi: "आज" },
              { id: "week", label: "This Week", labelHindi: "इस सप्ताह" },
              { id: "month", label: "This Month", labelHindi: "इस महीने" }
            ].map((period) => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period.id)}
                className={selectedPeriod === period.id ? "bg-blue-500 hover:bg-blue-600" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
              >
                {period.label}
                <br />
                <span className="text-xs">{period.labelHindi}</span>
              </Button>
            ))}
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessMetrics.map((metric, index) => (
            <Card key={index} className="border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <CardTitle className="text-xs text-gray-500">{metric.titleHindi}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className={`text-xs flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>AI Business Insights</span>
              </CardTitle>
              <CardDescription>स्मार्ट व्यापारिक सुझाव</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">{insight.titleHindi}</p>
                      <p className="text-sm text-gray-700 mb-1">{insight.description}</p>
                      <p className="text-xs text-gray-600">{insight.descriptionHindi}</p>
                    </div>
                    <Badge className={
                      insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }>
                      {insight.priority}
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Customer Segments</span>
              </CardTitle>
              <CardDescription>ग्राहक विभाजन</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{segment.segment}</p>
                    <p className="text-xs text-gray-600">{segment.segmentHindi}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{segment.count}</p>
                    <p className="text-xs text-gray-500">{segment.percentage}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Sales Trend | बिक्री प्रवृत्ति</span>
              </div>
              <Button variant="outline" size="sm" className="border-blue-200">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {salesData.map((data, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{data.period}</h4>
                  <p className="text-xl font-bold text-blue-600">₹{data.sales.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{data.orders} orders</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCoordinator;
