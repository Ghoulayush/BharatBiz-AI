import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const BusinessCoordinator = () => {
  const [user, setUser] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    lowStockItems: [],
    recentActivity: [],
    topProducts: [],
    todaysSales: "₹0",
  });
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Firestore data listener
  useEffect(() => {
    if (!user) {
      setInventoryData({
        lowStockItems: [],
        recentActivity: [],
        topProducts: [],
        todaysSales: "₹0",
      });
      setLoading(false);
      return;
    }
    setLoading(true);

    const docRef = doc(db, "inventories", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      docSnap => {
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
        setLoading(false);
      },
      err => {
        console.error("Error fetching inventory data:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, refreshToggle]);

  // Extract sales activities
  const salesActivities = useMemo(() => {
    return inventoryData.recentActivity.filter(act => act.type === "sale");
  }, [inventoryData.recentActivity]);

  // Total Revenue
  const totalRevenue = useMemo(() => {
    return salesActivities.reduce((sum, act) => {
      if (act.amount) {
        const amt = Number(act.amount.replace(/[₹,]/g, ""));
        if (!isNaN(amt)) return sum + amt;
      }
      return sum;
    }, 0);
  }, [salesActivities]);

  // Total Orders
  const totalOrders = salesActivities.length;

  // Estimated Customers: unique items sold (approximation)
  const estimatedCustomers = useMemo(() => {
    const uniqueItems = new Set();
    salesActivities.forEach(act => uniqueItems.add(act.item));
    return uniqueItems.size || 0;
  }, [salesActivities]);

  // Average Order
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate profit/loss
  // Logic:
  // For each sale: Profit = sale amount - (minSellingPrice * quantity sold)
  // We estimate quantity sold by parsing quantity string in recentActivity (e.g. "-3")
  // We find minSellingPrice from lowStockItems or topProducts by product name.

  const totalProfitLoss = useMemo(() => {
    // Create lookup map for minSellingPrice by item name from lowStockItems and topProducts
    const priceMap = {};

    inventoryData.lowStockItems.forEach(item => {
      if (item.name && item.minSellingPrice) {
        priceMap[item.name] = item.minSellingPrice;
      }
    });

    // Optional: if minSellingPrice is missing in lowStockItems (e.g. sold out), try topProducts (no minSellingPrice there usually)
    // Here we skip for topProducts as they may not have minSellingPrice.

    let profitSum = 0;

    salesActivities.forEach(act => {
      const qtyStr = act.quantity; // e.g. "-3"
      if (!qtyStr || !act.amount) return;

      const qty = Number(qtyStr.replace(/[^0-9.-]+/g, ""));
      if (isNaN(qty)) return;

      // qty here is negative, make positive units sold
      const unitsSold = Math.abs(qty);

      const saleAmount = Number(act.amount.replace(/[₹,]/g, ""));
      if (isNaN(saleAmount)) return;

      const minPrice = priceMap[act.item];
      if (!minPrice) {
        // No cost price data, skip profit calc for this item
        return;
      }

      const costValue = minPrice * unitsSold;
      const profit = saleAmount - costValue;

      profitSum += profit;
    });

    return profitSum;
  }, [salesActivities, inventoryData.lowStockItems]);

  const businessMetrics = [
    {
      title: "Total Revenue",
      titleHindi: "कुल आय",
      value: `₹${totalRevenue.toLocaleString()}`,
      trend: totalRevenue >= 0 ? "up" : "down",
      change: null,
    },
    {
      title: "Total Orders",
      titleHindi: "कुल आदेश",
      value: totalOrders.toLocaleString(),
      trend: totalOrders >= 0 ? "up" : "down",
      change: null,
    },
    {
      title: "Estimated Customers",
      titleHindi: "अनुमानित ग्राहक",
      value: estimatedCustomers.toLocaleString(),
      trend: estimatedCustomers >= 0 ? "up" : "down",
      change: null,
    },
    {
      title: "Average Order Value",
      titleHindi: "औसत आदेश मूल्य",
      value: `₹${avgOrder.toFixed(2)}`,
      trend: avgOrder >= 0 ? "up" : "down",
      change: null,
    },
    {
      title: "Total Profit/Loss",
      titleHindi: "कुल लाभ/हानि",
      value: `₹${totalProfitLoss.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      trend: totalProfitLoss >= 0 ? "up" : "down",
      change: null,
    },
  ];

  // Export & Refresh handlers (stubs)
  const handleExport = () => {
    alert("Export functionality not implemented.");
  };

  const handleRefresh = () => {
    setRefreshToggle((v) => !v);
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading business data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="text-2xl">🧠</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Business Coordinator
                </h1>
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
        <div className="flex space-x-2 mb-8">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {businessMetrics.map((metric, i) => (
            <Card key={i} className="border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <CardTitle className="text-xs text-gray-500">
                  {metric.titleHindi}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div
                  className={`text-xs flex items-center ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      metric.trend === "down" ? "rotate-180" : ""
                    }`}
                  />
                  {metric.change || ""}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCoordinator;
