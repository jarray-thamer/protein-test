import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { DatePickerWithRange } from "../ui/date-range-picker";
import axios from "axios";
import { formatDate } from "@/lib/formattedData";

export default function RevenueDashboard() {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [revenueData, setRevenueData] = useState([]);
  const [yearComparison, setYearComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [categoryData, setCategoryData] = useState([]);

  // Add to useEffect
  const fetchCategoryPerformance = async () => {
    try {
      const response = await axios.get(
        `/admin/analytics/category-performance?startDate=${dateRange.from}&endDate=${dateRange.to}`
      );

      const result = response.data;
      setCategoryData(result.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const [promoData, setPromoData] = useState([]);

  // Add to useEffect
  const fetchPromoCodeStats = async () => {
    try {
      const response = await axios.get(
        `/admin/analytics/promo-code-performance?startDate=${dateRange.from}&endDate=${dateRange.to}`
      );
      console.log(response.data);

      const result = response.data;
      setPromoData(result.data);
    } catch (error) {
      console.error("Error fetching promo data:", error);
    }
  };

  // Update useEffect
  useEffect(() => {
    fetchRevenueData();
    fetchYearComparison();
    fetchCategoryPerformance();
    fetchPromoCodeStats();
  }, [timeFrame, dateRange]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with your actual API endpoint
      const response = await axios.get(
        `/admin/analytics/revenue?timeFrame=${timeFrame}&startDate=${dateRange.from}&endDate=${dateRange.to}`
      );

      const result = response.data;
      setRevenueData(result.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchYearComparison = async () => {
    try {
      // Mock API call - replace with your actual API endpoint
      const response = await axios.get(
        "/admin/analytics/revenue/year-comparison"
      );
      const result = response.data;
      setYearComparison(result.data);
    } catch (error) {
      console.error("Error fetching year comparison data:", error);
    }
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total revenue from current data
  const calculateTotalRevenue = () => {
    return revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  };

  // Calculate total orders from current data
  const calculateTotalOrders = () => {
    return revenueData.reduce((sum, item) => sum + item.orderCount, 0);
  };

  // Calculate average order value
  const calculateAverageOrderValue = () => {
    const totalOrders = calculateTotalOrders();
    return totalOrders > 0 ? calculateTotalRevenue() / totalOrders : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Revenue Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange
            className="w-80"
            selected={dateRange}
            onSelect={setDateRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculateTotalRevenue())}
            </div>
            {yearComparison && (
              <p className="flex items-center pt-1 text-xs text-muted-foreground">
                {yearComparison.yearOverYearGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                )}
                <span
                  className={
                    yearComparison.yearOverYearGrowth >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(yearComparison.yearOverYearGrowth).toFixed(1)}%
                </span>
                <span className="ml-1">from last year</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateTotalOrders().toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculateAverageOrderValue())}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="line" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} revenue
                for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toLocaleString()} TND`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString()} TND`,
                        "Revenue",
                      ]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      name="Revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} revenue
                breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toLocaleString()} TND`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString()} TND`,
                        "Revenue",
                      ]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="totalRevenue" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Category  */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis
                  dataKey="categoryName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `${value.toLocaleString()} TND`}
                />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} TND`}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar
                  dataKey="totalRevenue"
                  name="Revenue"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryData.map((category) => (
              <div key={category.categoryId} className="p-4 border rounded-lg">
                <h3 className="font-medium">{category.categoryName}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Revenue: {formatCurrency(category.totalRevenue)}</p>
                  <p>Units Sold: {category.totalSold.toLocaleString()}</p>
                  <p>Orders: {category.totalOrders.toLocaleString()}</p>
                  <p>
                    Avg. Order: {formatCurrency(category.averageOrderValue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* PromoCode */}
      <Card>
        <CardHeader>
          <CardTitle>Promo Code Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promoData}>
                <XAxis
                  dataKey="code"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "totalDiscount" || name === "totalRevenue") {
                      return formatCurrency(value);
                    }
                    return value;
                  }}
                />
                <Bar
                  dataKey="totalUses"
                  name="Total Uses"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="totalDiscount"
                  name="Total Discount"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promoData.map((promo) => (
              <div key={promo.promoCodeId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{promo.code}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(promo.discountValue)} discount
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p>Uses: {promo.totalUses}</p>
                  <p>Total Discount: {formatCurrency(promo.totalDiscount)}</p>
                  <p>Generated Revenue: {formatCurrency(promo.totalRevenue)}</p>
                  <p>
                    Avg. Discount/Use: {formatCurrency(promo.avgDiscountPerUse)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    First used: {formatDate(promo.firstUsed)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last used: {formatDate(promo.lastUsed)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
