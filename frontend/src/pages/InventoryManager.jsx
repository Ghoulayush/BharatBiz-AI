
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, AlertTriangle, TrendingUp, Calendar, Plus, Eye, Edit } from "lucide-react";

const InventoryManager = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const lowStockItems = [
    { name: "Samsung Galaxy A14", stock: 2, minStock: 10, category: "Smartphones", lastUpdated: "2 hours ago" },
    { name: "iPhone Charger", stock: 5, minStock: 15, category: "Accessories", lastUpdated: "1 hour ago" },
    { name: "Wireless Earbuds", stock: 1, minStock: 8, category: "Audio", lastUpdated: "30 mins ago" },
    { name: "Phone Cases", stock: 3, minStock: 20, category: "Accessories", lastUpdated: "45 mins ago" }
  ];

  const recentActivity = [
    { action: "Stock Added", item: "iPhone 14", quantity: "+25", time: "10:30 AM", type: "add" },
    { action: "Sale Recorded", item: "Samsung A54", quantity: "-2", time: "10:15 AM", type: "sale" },
    { action: "Stock Alert", item: "Chargers", quantity: "Low", time: "9:45 AM", type: "alert" },
    { action: "Inventory Check", item: "All Items", quantity: "Complete", time: "9:00 AM", type: "check" }
  ];

  const topProducts = [
    { name: "iPhone 14", sold: 45, revenue: "₹4,50,000", trend: "+12%" },
    { name: "Samsung Galaxy A54", sold: 32, revenue: "₹2,88,000", trend: "+8%" },
    { name: "OnePlus Nord", sold: 28, revenue: "₹2,24,000", trend: "+15%" },
    { name: "Xiaomi Redmi Note", sold: 25, revenue: "₹1,87,500", trend: "+5%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="text-2xl">📦</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Inventory Manager</h1>
                <p className="text-sm text-gray-500">इन्वेंटरी प्रबंधक</p>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-700">
              🟢 Online | ऑनलाइन
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", labelHindi: "अवलोकन" },
            { id: "low-stock", label: "Low Stock", labelHindi: "कम स्टॉक" },
            { id: "activity", label: "Activity", labelHindi: "गतिविधि" },
            { id: "products", label: "Top Products", labelHindi: "मुख्य उत्पाद" }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "outline"}
              onClick={() => setSelectedTab(tab.id)}
              className={selectedTab === tab.id ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200 text-orange-700 hover:bg-orange-50"}
            >
              {tab.label}
              <br />
              <span className="text-xs">{tab.labelHindi}</span>
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                <CardTitle className="text-xs text-gray-500">कुल उत्पाद</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
                <CardTitle className="text-xs text-gray-500">कम स्टॉक</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">24</div>
                <div className="text-xs text-red-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Needs attention
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
                <CardTitle className="text-xs text-gray-500">आज की बिक्री</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₹1,25,450</div>
                <div className="text-xs text-green-600">+8.2% from yesterday</div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                <CardTitle className="text-xs text-gray-500">लंबित आदेश</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">18</div>
                <div className="text-xs text-gray-600">To be fulfilled</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Low Stock Tab */}
        {selectedTab === "low-stock" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alerts | कम स्टॉक अलर्ट
              </h2>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
            <div className="grid gap-4">
              {lowStockItems.map((item, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="destructive">
                            Current: {item.stock}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Min Required: {item.minStock}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-orange-200">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last updated: {item.lastUpdated}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {selectedTab === "activity" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity | हाल की गतिविधि
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="border-orange-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'add' ? 'bg-green-500' :
                          activity.type === 'sale' ? 'bg-blue-500' :
                          activity.type === 'alert' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          activity.quantity.includes('+') ? 'text-green-600' :
                          activity.quantity.includes('-') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {activity.quantity}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top Products Tab */}
        {selectedTab === "products" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Selling Products | सबसे ज्यादा बिकने वाले उत्पाद
            </h2>
            <div className="grid gap-4">
              {topProducts.map((product, index) => (
                <Card key={index} className="border-orange-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Sold: {product.sold} units
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {product.revenue}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {product.trend}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
