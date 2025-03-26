"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Heart,
  MessageSquare,
  Edit,
  Truck,
  XCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    ville: "",
    address: "",
  });
  const [clientData, setClientData] = useState({
    orders: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState({
    profile: true,
    updateProfile: false,
  });

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await axiosInstance.get(
        `/clients/get/by-id/${user._id}`
      );

      if (response.data) {
        // Set profile data
        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone1: response.data.phone1 || "",
          phone2: response.data.phone2 || "",
          ville: response.data.ville || "",
          address: response.data.address || "",
        });

        // Set client data with populated relationships
        setClientData({
          orders: response.data.ordersId || [],
        });
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast({
        title: "Error",
        description:
          "Failed to load your profile data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, updateProfile: true }));
      await axiosInstance.put(`/clients/update/${user._id}`, profileData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
      // Refresh client data
      fetchClientData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-800 bg-yellow-100 border-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="text-blue-800 bg-blue-100 border-blue-300"
          >
            <Package className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="text-green-800 bg-green-100 border-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Paid
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="text-purple-800 bg-purple-100 border-purple-300"
          >
            <Truck className="w-3 h-3 mr-1" /> Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="text-red-800 bg-red-100 border-red-300"
          >
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-10 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Profile Summary Card */}
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${
                      profileData.name || "User"
                    }&background=random`}
                  />
                  <AvatarFallback>
                    {profileData.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                  <CardDescription>{profileData.email}</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
                  <ShoppingCart className="w-8 h-8 mb-2 text-blue-500" />
                  <span className="text-xl font-bold">
                    {clientData.orders.length}
                  </span>
                  <span className="text-sm text-gray-500">Orders</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <div className="md:col-span-4">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    <CardDescription>
                      Manage your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={profileData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="phone1"
                              className="text-sm font-medium"
                            >
                              Primary Phone
                            </label>
                            <Input
                              id="phone1"
                              name="phone1"
                              value={profileData.phone1}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="phone2"
                              className="text-sm font-medium"
                            >
                              Secondary Phone
                            </label>
                            <Input
                              id="phone2"
                              name="phone2"
                              value={profileData.phone2}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="ville"
                              className="text-sm font-medium"
                            >
                              City
                            </label>
                            <Input
                              id="ville"
                              name="ville"
                              value={profileData.ville}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label
                              htmlFor="address"
                              className="text-sm font-medium"
                            >
                              Address
                            </label>
                            <Textarea
                              id="address"
                              name="address"
                              value={profileData.address}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={loading.updateProfile}
                          >
                            {loading.updateProfile
                              ? "Saving..."
                              : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Name
                          </h3>
                          <p className="mt-1">
                            {profileData.name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Email
                          </h3>
                          <p className="mt-1">
                            {profileData.email || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Primary Phone
                          </h3>
                          <p className="mt-1">
                            {profileData.phone1 || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Secondary Phone
                          </h3>
                          <p className="mt-1">
                            {profileData.phone2 || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            City
                          </h3>
                          <p className="mt-1">
                            {profileData.ville || "Not provided"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">
                            Address
                          </h3>
                          <p className="mt-1">
                            {profileData.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track all your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {clientData.orders.length > 0 ? (
                      <div className="space-y-4">
                        {clientData.orders.map((order) => (
                          <Card key={order._id} className="overflow-hidden">
                            <CardHeader className="p-4 bg-gray-50">
                              <div className="flex flex-wrap items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    Order #{order.reference}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-md">
                                        <Package className="w-6 h-6 text-gray-400" />
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          {item.designation}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {item.quantity} x
                                          {item.price?.toFixed(2) || "0.00"} TND
                                          {item.variant && ` - ${item.variant}`}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="font-medium">
                                      {(
                                        (item.quantity || 0) * (item.price || 0)
                                      ).toFixed(2)}{" "}
                                      TND
                                    </p>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-sm italic text-gray-500">
                                    + {order.items.length - 2} more items
                                  </p>
                                )}
                                <Separator />
                                <div className="flex justify-between font-medium">
                                  <p>Total</p>
                                  <p>
                                    {order.netAPayer?.toFixed(2) || "0.00"} TND
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <ShoppingCart className="w-12 h-12 mb-2 text-gray-300" />
                        <h3 className="text-lg font-medium">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          When you place an order, it will appear here
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => router.push("/products")}
                        >
                          Browse Products
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
