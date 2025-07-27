import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust this import path as necessary

const InventoryManager = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    lowStockItems: [],
    recentActivity: [],
    topProducts: [],
  });
  const [newStock, setNewStock] = useState({
    name: "",
    stock: "",
    minStock: "",
    category: "",
  });
  const [showAddStockForm, setShowAddStockForm] = useState(false);

  // Auth listener to get logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Fetch inventory data from Firestore for the logged-in user
  useEffect(() => {
    const fetchInventoryData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "inventories", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInventoryData({
            lowStockItems: data.lowStockItems || [],
            recentActivity: data.recentActivity || [],
            topProducts: data.topProducts || [],
          });
        } else {
          // Document does not exist; initialize to empty arrays
          setInventoryData({
            lowStockItems: [],
            recentActivity: [],
            topProducts: [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
      }
      setLoading(false);
    };

    fetchInventoryData();
  }, [user]);

  // Update Firestore and state when inventory changes
  const updateInventoryData = async (newData) => {
    if (!user) return;
    try {
      const docRef = doc(db, "inventories", user.uid);
      await setDoc(docRef, newData, { merge: true });
      setInventoryData(newData);
    } catch (error) {
      console.error("Failed to update inventory data:", error);
      alert("Failed to update inventory. Please try again.");
    }
  };

  // Handler for Add Stock form submission
  const handleAddStock = async (e) => {
    e.preventDefault();
    if (
      !newStock.name.trim() ||
      !newStock.stock ||
      !newStock.minStock ||
      !newStock.category.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Prepare new stock item object
    const stockItem = {
      name: newStock.name.trim(),
      stock: Number(newStock.stock),
      minStock: Number(newStock.minStock),
      category: newStock.category.trim(),
      lastUpdated: "Just now",
    };

    // Add new stock item to lowStockItems array
    const updatedLowStockItems = [...inventoryData.lowStockItems, stockItem];

    // Append recentActivity entry
    const newActivity = {
      action: "Stock Added",
      item: stockItem.name,
      quantity: `+${stockItem.stock}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "add",
    };
    const updatedRecentActivity = [
      newActivity,
      ...inventoryData.recentActivity,
    ];

    // Optionally, update topProducts as needed; left unchanged here
    const newInventoryData = {
      ...inventoryData,
      lowStockItems: updatedLowStockItems,
      recentActivity: updatedRecentActivity,
      // topProducts: inventoryData.topProducts,
    };

    await updateInventoryData(newInventoryData);

    // Reset form and hide it
    setNewStock({ name: "", stock: "", minStock: "", category: "" });
    setShowAddStockForm(false);
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading inventory data...
      </div>
    );
  }

  const { lowStockItems, recentActivity, topProducts } = inventoryData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="text-2xl">📦</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Inventory Manager
                </h1>
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
            {
              id: "products",
              label: "Top Products",
              labelHindi: "मुख्य उत्पाद",
            },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "outline"}
              onClick={() => setSelectedTab(tab.id)}
              className={
                selectedTab === tab.id
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "border-orange-200 text-orange-700 hover:bg-orange-50"
              }
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
            {/* Total Products */}
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Products
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">
                  कुल उत्पाद
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {topProducts && topProducts.length > 0
                    ? topProducts.reduce(
                        (acc, prod) => acc + (prod.sold || 0),
                        0
                      )
                    : 0}
                </div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.5% from last month{" "}
                  {/* You can customize this dynamically if you have data */}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Items */}
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">
                  कम स्टॉक
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {lowStockItems ? lowStockItems.length : 0}
                </div>
                <div className="text-xs text-red-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Needs attention
                </div>
              </CardContent>
            </Card>

            {/* Today's Sales */}
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Today's Sales
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">
                  आज की बिक्री
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {/* Replace 0 with your dynamic sales value or keep a placeholder */}
                  {inventoryData.todaysSales ?? "₹0"}
                </div>
                <div className="text-xs text-green-600">
                  {/* Replace or remove */}
                  +8.2% from yesterday
                </div>
              </CardContent>
            </Card>

            {/* Pending Orders */}
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Orders
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">
                  लंबित आदेश
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {inventoryData.pendingOrders ?? 0}
                </div>
                <div className="text-xs text-gray-600">To be fulfilled</div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Low stock alerts and form */}
        {selectedTab === "low-stock" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alerts | कम स्टॉक अलर्ट
              </h2>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setShowAddStockForm(!showAddStockForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddStockForm ? "Cancel" : "Add Stock"}
              </Button>
            </div>

            {showAddStockForm && (
              <form
                onSubmit={handleAddStock}
                className="mb-6 space-y-4 p-4 border rounded bg-white shadow-sm"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newStock.name}
                    onChange={(e) =>
                      setNewStock({ ...newStock, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={newStock.stock}
                    onChange={(e) =>
                      setNewStock({ ...newStock, stock: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="minStock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Stock
                  </label>
                  <input
                    id="minStock"
                    type="number"
                    min="0"
                    value={newStock.minStock}
                    onChange={(e) =>
                      setNewStock({ ...newStock, minStock: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={newStock.category}
                    onChange={(e) =>
                      setNewStock({ ...newStock, category: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Add Stock Item
                </Button>
              </form>
            )}

            {/* Existing Low Stock Items */}
            <div className="grid gap-4">
              {lowStockItems.map((item, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {item.lastUpdated}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
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
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.type === "add"
                              ? "bg-green-500"
                              : activity.type === "sale"
                              ? "bg-blue-500"
                              : activity.type === "alert"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.item}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            activity.quantity.includes("+")
                              ? "text-green-600"
                              : activity.quantity.includes("-")
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
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
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
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
