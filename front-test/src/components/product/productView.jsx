"use client";

import {
  deleteManyProducts,
  getProductById,
} from "@/helpers/products/communicator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Badge } from "../ui/badge";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleSlashIcon,
  Edit3Icon,
  EyeIcon,
  ImageIcon,
  InfoIcon,
  PackageIcon,
  TagIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { formatDate } from "@/lib/formattedData";
import { formatCurrency } from "@/lib/formattedCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedImg, setSelectedImg] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchProduct(id) {
        setIsLoading(true);
        try {
          const res = await getProductById(id);
          setProduct(res.data);
          setSelectedImg(res.data.mainImage);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProduct(id);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteManyProducts([id]);
      navigate("/inventory/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formattedPrice = formatCurrency(product.price || 0);
  const formattedOldPrice = formatCurrency(product.oldPrice || 0);
  const formattedPriceTTC = formatCurrency((product.price || 0) * 1.19);

  // Calculate discount percentage if oldPrice exists
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 rounded-full border-t-primary animate-spin"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 mx-auto md:p-6 max-w-screen-2xl">
      {/* Header with breadcrumb and actions */}
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/inventory/products")}
            className="h-8 gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Products</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <Icon
              icon="mdi:storefront"
              width="20"
              height="20"
              className="mr-2 text-primary"
            />
            <span className="text-sm text-muted-foreground">
              Product Details
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-9 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/inventory/products/edit/${id}`)}
          >
            <Edit3Icon className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1 h-9"
            onClick={handleDelete}
          >
            <Trash2Icon className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Product header with title, status and price */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">Product Information</CardTitle>
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-xs font-medium",
                  product.status
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {product.status ? (
                  <CheckCircle2Icon className="w-3 h-3 mr-1" />
                ) : (
                  <XCircleIcon className="w-3 h-3 mr-1" />
                )}
                {product.status ? "Public" : "Private"}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-sm">
              ID: {product._id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight">
              {product.designation}
            </h1>
            {product.smallDescription && (
              <p className="mb-4 text-sm text-muted-foreground">
                {product.smallDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formattedPrice}
                </span>
                {product.oldPrice > 0 && (
                  <span className="text-sm line-through text-muted-foreground">
                    {formattedOldPrice}
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <Badge
                  variant="secondary"
                  className="border-none bg-primary/10 text-primary"
                >
                  {discountPercentage}% OFF
                </Badge>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1",
                    product.inStock
                      ? "text-green-600 border-green-200 dark:border-green-800"
                      : "text-red-600 border-red-200 dark:border-red-800"
                  )}
                >
                  {product.inStock ? (
                    <CheckCircle2Icon className="w-3 h-3" />
                  ) : (
                    <CircleSlashIcon className="w-3 h-3" />
                  )}
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>

                {product.brand && (
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.category && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Main Category
                  </h3>
                  <Badge className="border-none bg-primary/10 text-primary hover:bg-primary/20">
                    {product.category.designation}
                  </Badge>
                </div>
              )}

              {product.subCategory?.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Sub Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.subCategory.map((subCategory, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {subCategory.designation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.features?.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Displayed En
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="nutrition">Features</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Product Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Price (HT)
                    </p>
                    <p>{formattedPrice}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Price (TTC)
                    </p>
                    <p>{formattedPriceTTC}</p>
                  </div>
                  {product.oldPrice > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Old Price
                      </p>
                      <p className="line-through">{formattedOldPrice}</p>
                    </div>
                  )}
                  {product.bestSellerSection && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Best Seller
                      </p>
                      <p>Yes</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <p
                      className={
                        product.status ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.status ? "Public" : "Private"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Stock
                    </p>
                    <p
                      className={
                        product.inStock ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Dates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Created At
                    </p>
                    <p>{formatDate(product.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p>{formatDate(product.updatedAt)}</p>
                  </div>
                  {product.venteflashDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Flash Sale Date
                      </p>
                      <p>{formatDate(product.venteflashDate)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {product.description && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose-sm prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Product Images</CardTitle>
                </div>
                <Badge variant="outline">
                  {(product.images?.length || 0) + 1} Images
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Main image display */}
                <div className="flex flex-col space-y-4">
                  <div className="relative w-full overflow-hidden border aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900">
                    {selectedImg?.url ? (
                      <img
                        src={selectedImg.url || "/placeholder.svg"}
                        className="absolute inset-0 object-contain w-full h-full transition-transform duration-300 transform hover:scale-105"
                        alt={product.designation || "Product image"}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails grid */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">All Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Main image thumbnail */}
                    {product?.mainImage?.url && (
                      <div
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden cursor-pointer group border",
                          selectedImg.url === product.mainImage.url &&
                            "ring-2 ring-primary ring-offset-2"
                        )}
                        onClick={() => setSelectedImg(product.mainImage)}
                      >
                        <img
                          src={product.mainImage.url || "/placeholder.svg"}
                          alt="Main product image"
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                        {selectedImg.url === product.mainImage.url && (
                          <div className="absolute inset-0 bg-primary/10" />
                        )}
                        <Badge className="absolute text-xs top-1 left-1 bg-primary/80">
                          Main
                        </Badge>
                      </div>
                    )}

                    {/* Other image thumbnails */}
                    {product.images?.map((img, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden cursor-pointer group border",
                          selectedImg.url === img.url &&
                            "ring-2 ring-primary ring-offset-2"
                        )}
                        onClick={() => setSelectedImg(img)}
                      >
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Product image ${idx + 1}`}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                        {selectedImg.url === img.url && (
                          <div className="absolute inset-0 bg-primary/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-primary" />
                <CardTitle>Product Variants</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {product.variant?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {product.variant.map((variant, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          {variant.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <Badge
                          className={cn(
                            "mt-2",
                            variant.inStock
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {variant.inStock ? (
                            <CheckCircle2Icon className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircleIcon className="w-3 h-3 mr-1" />
                          )}
                          {variant.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <TagIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    No variants available for this product
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:nutrition"
                  width="20"
                  height="20"
                  className="text-primary"
                />
                <CardTitle>Features Values</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {product.nutritionalValues?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {product.nutritionalValues.map((nutritionalValue, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          {nutritionalValue.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-lg font-medium">
                          {nutritionalValue.value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon
                    icon="mdi:nutrition"
                    width="48"
                    height="48"
                    className="mb-4 text-muted-foreground/30"
                  />
                  <p className="text-muted-foreground">
                    No Features values available for this product
                  </p>
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
          onClick={() => navigate("/inventory/products")}
          className="gap-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Products</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/inventory/products/edit/${id}`)}
          >
            <Edit3Icon className="w-4 h-4" />
            <span>Edit Product</span>
          </Button>
          <Button
            variant="destructive"
            className="gap-1"
            onClick={handleDelete}
          >
            <Trash2Icon className="w-4 h-4" />
            <span>Delete Product</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
