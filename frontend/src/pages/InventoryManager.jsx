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
import { db } from "../firebase"; // Adjust import path if necessary

const InventoryManager = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    lowStockItems: [],
    recentActivity: [],
    topProducts: [],
    todaysSales: "₹0",
  });
  // Added minSellingPrice for new stock
  const [newStock, setNewStock] = useState({
    name: "",
    stock: "",
    minStock: "",
    category: "",
    minSellingPrice: "",
  });
  const [showAddStockForm, setShowAddStockForm] = useState(false);

  // States related to selling form
  const [sellingItemIndex, setSellingItemIndex] = useState(null);
  const [soldQuantity, setSoldQuantity] = useState("");
  const [soldAmount, setSoldAmount] = useState("");

  // Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Fetch inventory data
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
            todaysSales: data.todaysSales || "₹0",
          });
        } else {
          setInventoryData({
            lowStockItems: [],
            recentActivity: [],
            topProducts: [],
            todaysSales: "₹0",
          });
        }
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
      }
      setLoading(false);
    };

    fetchInventoryData();
  }, [user]);

  // Update Firestore and state
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

  // Add Stock Handler
  const handleAddStock = async (e) => {
    e.preventDefault();

    if (
      !newStock.name.trim() ||
      !newStock.stock ||
      !newStock.minStock ||
      !newStock.category.trim() ||
      !newStock.minSellingPrice
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (Number(newStock.minSellingPrice) <= 0) {
      alert("Minimum Selling Price must be greater than 0.");
      return;
    }

    // Prepare new stock item with minSellingPrice included
    const stockItem = {
      name: newStock.name.trim(),
      stock: Number(newStock.stock),
      minStock: Number(newStock.minStock),
      category: newStock.category.trim(),
      minSellingPrice: Number(newStock.minSellingPrice),
      lastUpdated: "Just now",
    };

    const updatedLowStockItems = [...inventoryData.lowStockItems, stockItem];

    // Activity log entry with amount info (minSellingPrice * quantity added)
    const addedAmount = stockItem.minSellingPrice * stockItem.stock;

    const newActivity = {
      action: "Stock Added",
      item: stockItem.name,
      quantity: `+${stockItem.stock}`,
      amount: `₹${addedAmount.toLocaleString()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "add",
    };

    const updatedRecentActivity = [newActivity, ...inventoryData.recentActivity];

    const newInventoryData = {
      ...inventoryData,
      lowStockItems: updatedLowStockItems,
      recentActivity: updatedRecentActivity,
    };

    await updateInventoryData(newInventoryData);

    // Reset form and hide it
    setNewStock({ name: "", stock: "", minStock: "", category: "", minSellingPrice: "" });
    setShowAddStockForm(false);
  };

  // Remove item handler (no amount since it's just removed)
  const handleRemoveItem = async (index) => {
    const updatedLowStockItems = [...inventoryData.lowStockItems];
    const removedItem = updatedLowStockItems.splice(index, 1)[0];

    const removeActivity = {
      action: "Removed",
      item: removedItem.name,
      quantity: `0`,
      amount: "-",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "remove",
    };

    const updatedRecentActivity = [removeActivity, ...inventoryData.recentActivity];

    await updateInventoryData({
      ...inventoryData,
      lowStockItems: updatedLowStockItems,
      recentActivity: updatedRecentActivity,
    });
  };

  // Confirm Sale Handler - with qty and amount input
  const handleConfirmSale = async (index) => {
    const item = inventoryData.lowStockItems[index];
    const qty = Number(soldQuantity);
    const amount = Number(soldAmount);

    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity sold.");
      return;
    }
    if (qty > item.stock) {
      alert("Sold quantity cannot exceed current stock.");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Please enter a valid sale amount.");
      return;
    }

    // Update low stock items array:
    let updatedLowStockItems = [...inventoryData.lowStockItems];
    if (qty === item.stock) {
      // Sold entire stock, remove item
      updatedLowStockItems.splice(index, 1);
    } else {
      // Reduce stock and update lastUpdated
      updatedLowStockItems[index] = {
        ...item,
        stock: item.stock - qty,
        lastUpdated: "Just now",
      };
    }

    // Update topProducts
    let updatedTopProducts = [...(inventoryData.topProducts || [])];
    const existingProductIdx = updatedTopProducts.findIndex((p) => p.name === item.name);

    if (existingProductIdx >= 0) {
      const oldRevenueStr = updatedTopProducts[existingProductIdx].revenue || "₹0";
      const oldRevenueNum = Number(oldRevenueStr.replace(/[^\d]/g, "")) || 0;

      updatedTopProducts[existingProductIdx] = {
        ...updatedTopProducts[existingProductIdx],
        sold: (updatedTopProducts[existingProductIdx].sold || 0) + qty,
        revenue: `₹${(oldRevenueNum + amount).toLocaleString()}`,
        trend: "▲",
      };
    } else {
      updatedTopProducts.push({
        name: item.name,
        sold: qty,
        revenue: `₹${amount.toLocaleString()}`,
        trend: "▲",
      });
    }

    // Update today's sales by adding the sale amount
    const prevSalesStr = inventoryData.todaysSales || "₹0";
    const prevSalesAmount = Number(prevSalesStr.replace(/[^\d]/g, "")) || 0;
    const newTodaysSales = prevSalesAmount + amount;
    const newTodaysSalesStr = `₹${newTodaysSales.toLocaleString()}`;

    // Activity log with quantity and amount
    const soldActivity = {
      action: "Sold",
      item: item.name,
      quantity: `-${qty}`,
      amount: `₹${amount.toLocaleString()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "sale",
    };

    const updatedRecentActivity = [soldActivity, ...inventoryData.recentActivity];

    // Update all in Firestore & state
    await updateInventoryData({
      ...inventoryData,
      lowStockItems: updatedLowStockItems,
      recentActivity: updatedRecentActivity,
      topProducts: updatedTopProducts,
      todaysSales: newTodaysSalesStr,
    });

    // Reset form states
    setSellingItemIndex(null);
    setSoldQuantity("");
    setSoldAmount("");
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">Loading inventory data...</div>
    );
  }

  const { lowStockItems, recentActivity, topProducts, todaysSales } = inventoryData;

  const sortedTopProducts = [...(topProducts || [])].sort(
    (a, b) => (b.sold || 0) - (a.sold || 0)
  );

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
                <h1 className="text-xl font-bold text-gray-900">Inventory Manager</h1>
                <p className="text-sm text-gray-500">इन्वेंटरी प्रबंधक</p>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-700">🟢 Online | ऑनलाइन</Badge>
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
            { id: "products", label: "Top Products", labelHindi: "मुख्य उत्पाद" },
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
                <CardTitle className="text-xs text-gray-500">कुल उत्पाद</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {topProducts && topProducts.length > 0
                    ? topProducts.reduce((acc, prod) => acc + (prod.sold || 0), 0)
                    : 0}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Items */}
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">कम स्टॉक</CardTitle>
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
                <CardTitle className="text-xs text-gray-500">आज की बिक्री</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {todaysSales ?? "₹0"}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Low Stock Tab */}
        {selectedTab === "low-stock" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alerts | कम स्टॉक अलर्ट
              </h2>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setShowAddStockForm(!showAddStockForm);
                  setSellingItemIndex(null); // close selling form if open
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddStockForm ? "Cancel" : "Add Stock"}
              </Button>
            </div>

            {/* Add Stock Form with Min Selling Price */}
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
                <div>
                  <label
                    htmlFor="minSellingPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Selling Price (₹)
                  </label>
                  <input
                    id="minSellingPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newStock.minSellingPrice}
                    onChange={(e) =>
                      setNewStock({ ...newStock, minSellingPrice: e.target.value })
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

            {/* Low Stock Items List */}
            <div className="grid gap-4">
              {lowStockItems.map((item, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="destructive">Current: {item.stock}</Badge>
                          <span className="text-sm text-gray-600">
                            Min Required: {item.minStock}
                          </span>
                          <span className="text-sm text-gray-600">
                            Min Sell Price: ₹{item.minSellingPrice?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200"
                          title="Mark as Sold"
                          onClick={() => {
                            setSellingItemIndex(sellingItemIndex === index ? null : index);
                            setSoldQuantity("");
                            setSoldAmount("");
                            setShowAddStockForm(false); // close add stock form if open
                          }}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          title="Remove"
                          onClick={() => handleRemoveItem(index)}
                        >
                          X
                        </Button>
                      </div>
                    </div>

                    {/* Sell Form */}
                    {sellingItemIndex === index && (
                      <form
                        className="mt-2 p-4 bg-white border rounded shadow-sm space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleConfirmSale(index);
                        }}
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity Sold
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={soldQuantity}
                            onChange={(e) => setSoldQuantity(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Sale Amount (₹)
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={soldAmount}
                            onChange={(e) => setSoldAmount(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            required
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm Sale
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSellingItemIndex(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}

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
                              : activity.type === "remove"
                              ? "bg-gray-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-0.5">
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
                        {/* Show amount if available */}
                        <p className="text-xs text-gray-500">
                          {activity.amount ? `Amount: ${activity.amount}` : null}
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
              {sortedTopProducts.map((product, index) => (
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
                      <Badge className="bg-green-100 text-green-700">{product.trend}</Badge>
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
