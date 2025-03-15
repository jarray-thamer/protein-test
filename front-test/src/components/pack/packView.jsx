"use client";

import { deleteManyPacks, getPackById } from "@/helpers/packs/communicator";
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
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
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

export const PackView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState({});
  const [selectedImg, setSelectedImg] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchPack(id) {
        setIsLoading(true);
        try {
          const res = await getPackById(id);
          setPack(res.data);
          setSelectedImg(res.data.mainImage);
        } catch (error) {
          console.error("Error fetching pack:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchPack(id);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteManyPacks([id]);
      navigate("/inventory/packs");
    } catch (error) {
      console.error("Error deleting pack:", error);
    }
  };

  const formattedPrice = formatCurrency(pack.price || 0);
  const formattedOldPrice = formatCurrency(pack.oldPrice || 0);
  const formattedPriceTTC = formatCurrency((pack.price || 0) * 1.19);

  // Calculate discount percentage if oldPrice exists
  const discountPercentage = pack.oldPrice
    ? Math.round(((pack.oldPrice - pack.price) / pack.oldPrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 rounded-full border-t-primary animate-spin"></div>
          <p className="text-muted-foreground">Loading pack details...</p>
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
            onClick={() => navigate("/inventory/packs")}
            className="h-8 gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Packs</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <Icon
              icon="mdi:package-variant"
              width="20"
              height="20"
              className="mr-2 text-primary"
            />
            <span className="text-sm text-muted-foreground">Pack Details</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-9 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/inventory/packs/edit/${id}`)}
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

      {/* Pack header with title, status and price */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">Pack Information</CardTitle>
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-xs font-medium",
                  pack.status
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {pack.status ? (
                  <CheckCircle2Icon className="w-3 h-3 mr-1" />
                ) : (
                  <XCircleIcon className="w-3 h-3 mr-1" />
                )}
                {pack.status ? "Public" : "Private"}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-sm">
              ID: {pack._id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight">
              {pack.designation}
            </h1>
            {pack.smallDescription && (
              <p className="mb-4 text-sm text-muted-foreground">
                {pack.smallDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formattedPrice}
                </span>
                {pack.oldPrice > 0 && (
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
                    pack.inStock
                      ? "text-green-600 border-green-200 dark:border-green-800"
                      : "text-red-600 border-red-200 dark:border-red-800"
                  )}
                >
                  {pack.inStock ? (
                    <CheckCircle2Icon className="w-3 h-3" />
                  ) : (
                    <CircleSlashIcon className="w-3 h-3" />
                  )}
                  {pack.inStock ? "In Stock" : "Out of Stock"}
                </Badge>

                {pack.slug && (
                  <Badge variant="secondary" className="text-xs">
                    {pack.slug}
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
              <CardTitle className="text-xl">Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pack.features?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pack.features.map((feature, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No features specified for this pack
                </p>
              )}

              {pack.rate && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Rating
                  </h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(pack.rate)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {pack.rate}/5
                    </span>
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
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Pack Details</CardTitle>
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
                  {pack.oldPrice > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Old Price
                      </p>
                      <p className="line-through">{formattedOldPrice}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <p
                      className={
                        pack.status ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pack.status ? "Public" : "Private"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Stock
                    </p>
                    <p
                      className={
                        pack.inStock ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pack.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Slug
                    </p>
                    <p className="text-xs">{pack.slug}</p>
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
                    <p>{formatDate(pack.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p>{formatDate(pack.updatedAt)}</p>
                  </div>
                  {pack.venteflashDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Flash Sale Date
                      </p>
                      <p>{formatDate(pack.venteflashDate)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {pack.description && (
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
                  dangerouslySetInnerHTML={{ __html: pack.description }}
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
                  <CardTitle>Pack Images</CardTitle>
                </div>
                <Badge variant="outline">
                  {(pack.images?.length || 0) + 1} Images
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
                        alt={pack.designation || "Pack image"}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Full Size</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <Edit3Icon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Images</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Thumbnails grid */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">All Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Main image thumbnail */}
                    {pack?.mainImage?.url && (
                      <div
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden cursor-pointer group border",
                          selectedImg.url === pack.mainImage.url &&
                            "ring-2 ring-primary ring-offset-2"
                        )}
                        onClick={() => setSelectedImg(pack.mainImage)}
                      >
                        <img
                          src={pack.mainImage.url || "/placeholder.svg"}
                          alt="Main pack image"
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                        {selectedImg.url === pack.mainImage.url && (
                          <div className="absolute inset-0 bg-primary/10" />
                        )}
                        <Badge className="absolute text-xs top-1 left-1 bg-primary/80">
                          Main
                        </Badge>
                      </div>
                    )}

                    {/* Other image thumbnails */}
                    {pack.images?.map((img, idx) => (
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
                          alt={`Pack image ${idx + 1}`}
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

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="w-5 h-5 text-primary" />
                <CardTitle>Products in Pack</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {pack.products?.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pack.products.map((productId, idx) => (
                      <Card key={idx} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <PackageIcon className="w-4 h-4 text-primary" />
                            <span className="truncate">Product ID</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs truncate text-muted-foreground">
                              {productId}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() =>
                                navigate(`/inventory/products/${productId}`)
                              }
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCartIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    No products in this pack
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Customer Reviews</CardTitle>
                </div>
                {pack.reviews?.length > 0 && (
                  <Badge variant="outline">{pack.reviews.length} Reviews</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pack.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {pack.reviews.map((review, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            {review.userName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {review.userName || "Anonymous User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <StarIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No reviews yet</p>
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
          onClick={() => navigate("/inventory/packs")}
          className="gap-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Packs</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/inventory/packs/edit/${id}`)}
          >
            <Edit3Icon className="w-4 h-4" />
            <span>Edit Pack</span>
          </Button>
          <Button
            variant="destructive"
            className="gap-1"
            onClick={handleDelete}
          >
            <Trash2Icon className="w-4 h-4" />
            <span>Delete Pack</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackView;
