"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "@/helpers/clients/communication";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  EditIcon,
  HeartIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { formatDate } from "@/lib/formattedData";
import { cn } from "@/lib/utils";

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await getClientById(id);
        setClient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 rounded-full border-t-primary animate-spin"></div>
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-6 h-96">
        <XCircleIcon className="w-12 h-12 mb-4 text-destructive" />
        <h3 className="mb-2 text-xl font-medium">Error Loading Client</h3>
        <p className="text-center text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-6 h-96">
        <UserIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
        <h3 className="mb-2 text-xl font-medium">Client Not Found</h3>
        <p className="text-center text-muted-foreground">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    );
  }

  // Get client initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col p-4 mx-auto md:p-6 max-w-screen-2xl">
      {/* Header with breadcrumb and actions */}
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/clients")}
            className="h-8 gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Clients</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-primary" />
            <span className="text-sm text-muted-foreground">
              Client Details
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-9 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/clients/edit/${id}`)}
          >
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      {/* Client profile header */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border">
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {client.name || "Unnamed Client"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "px-3 py-1 text-xs font-medium",
                      client.isGuest
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {client.isGuest ? (
                      <>
                        <UserIcon className="w-3 h-3 mr-1" />
                        Guest Account
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Registered Account
                      </>
                    )}
                  </Badge>
                  {client.subscriber && (
                    <Badge className="border-none bg-primary/10 text-primary">
                      <MailIcon className="w-3 h-3 mr-1" />
                      Newsletter Subscriber
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1 text-sm">
                  Client ID: {client._id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{client.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{client.phone1 || "No primary phone provided"}</span>
                  </div>
                  {client.phone2 && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{client.phone2}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        Secondary
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Address Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <div>{client.address || "No address provided"}</div>
                      <div>{client.ville || "No city provided"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardListIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Activity Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <div className="flex flex-col items-center">
                    <ShoppingBagIcon className="w-5 h-5 mb-2 text-primary" />
                    <span className="text-2xl font-bold">
                      {client.ordersId?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Orders
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <div className="flex flex-col items-center">
                    <ShoppingCartIcon className="w-5 h-5 mb-2 text-primary" />
                    <span className="text-2xl font-bold">
                      {client.cart?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Cart Items
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <div className="flex flex-col items-center">
                    <HeartIcon className="w-5 h-5 mb-2 text-primary" />
                    <span className="text-2xl font-bold">
                      {client.wishlist?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Wishlist Items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <CalendarIcon className="inline w-4 h-4 mr-1" />
              Joined: {formatDate(client.createdAt)}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="cart">Cart</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Order History</CardTitle>
                </div>
                {client.ordersId?.length > 0 && (
                  <Badge variant="outline">
                    {client.ordersId.length} Orders
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {client.ordersId?.length > 0 ? (
                <div className="space-y-4">
                  {client.ordersId.map((order, index) => (
                    <Card key={order._id || index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <PackageIcon className="w-4 h-4 text-primary" />
                            <span>Order #{index + 1}</span>
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => navigate(`/orders/${order._id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-sm text-muted-foreground">
                          Order ID: {order._id}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <PackageIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    No orders found for this client
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Shopping Cart</CardTitle>
                </div>
                {client.cart?.length > 0 && (
                  <Badge variant="outline">{client.cart.length} Items</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {client.cart?.length > 0 ? (
                <div className="space-y-4">
                  {client.cart.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {item.productId?.designation || "Product"}
                          </CardTitle>
                          <Badge variant="outline">Qty: {item.quantity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Product ID: {item.productId?._id || item.productId}
                          </div>
                          {item.gout && (
                            <div className="flex items-center">
                              <Badge variant="secondary" className="text-xs">
                                Flavor: {item.gout}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/inventory/products/${
                                  item.productId?._id || item.productId
                                }`
                              )
                            }
                          >
                            View Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCartIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Cart is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Wishlist</CardTitle>
                </div>
                {client.wishlist?.length > 0 && (
                  <Badge variant="outline">
                    {client.wishlist.length} Items
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {client.wishlist?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {client.wishlist.map((productId, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-muted/30">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <HeartIcon className="w-4 h-4 text-primary" />
                          <span className="truncate">
                            Wishlist Item #{index + 1}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs truncate text-muted-foreground">
                            {productId?._id || productId}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              navigate(
                                `/inventory/products/${
                                  productId?._id || productId
                                }`
                              )
                            }
                          >
                            View Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <HeartIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Wishlist is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-4 mt-8 border-t">
        <Button
          variant="ghost"
          onClick={() => navigate("/clients")}
          className="gap-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Clients</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/clients/edit/${id}`)}
          >
            <EditIcon className="w-4 h-4" />
            <span>Edit Client</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
