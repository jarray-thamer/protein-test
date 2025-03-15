import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import QuillToolbar, { formats, modules } from "../quill/quillToolbar";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { MultiSelectDropdown } from "../multipleSelectInput";
import { useState } from "react";
import VariantInput from "../product/variant";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAllCategories } from "@/helpers/categories/communicator";
import { featureOptions } from "../dataTables/products/options";
import { CheckIcon, ImageIcon } from "lucide-react";
import { MainImageUpload } from "./imageUpload";
import { Switch } from "../ui/switch";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/helpers/products/communicator";
import { useParams, useNavigate } from "react-router-dom";
import { ImagesUpload } from "./imagesUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getSubCategoriesByCategory } from "@/helpers/subcategories/communicator";
import { getAdvancedData } from "@/helpers/settings/general";

const formSchema = z.object({
  designation: z.string().min(1, { message: "Designation is required" }),
  smallDescription: z
    .string()
    .max(1000, { message: "maximum size is 1000 character." }),
  description: z.string().optional(),
  question: z.string().optional(),
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
  oldPrice: z
    .number()
    .min(0, { message: "Old price must be 0 or greater" })
    .optional(),
  inStock: z.boolean().default(false),
  status: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  categoryId: z.string(),
  variant: z
    .array(
      z.object({
        title: z.string(),
        inStock: z.boolean().default(false),
      })
    )
    .default([]),
  nutritionalValues: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
  subCategoryIds: z.array(z.string()).default([]),
  mainImage: z.any().default([]),
  images: z.array(z.any()).default([]),
  brand: z.string().optional(),
  venteflashDate: z.any(),
});

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [nutritionalValues, setNutritionalValues] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [settings, setSettings] = useState();
  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getAdvancedData();
      setSettings(res);
    };

    fetchSettings();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designation: "",
      smallDescription: "",
      description: "",
      price: 0,
      oldPrice: 0,
      inStock: false,
      question: "",
      status: false,
      features: [],
      categoryId: "",
      variant: [],
      subCategoryIds: [],
      mainImage: null,
      nutritionalValues: [],
      images: [],
      brand: "",
      venteflashDate: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);

  // Load product data for editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoadingCategories(true);
        try {
          const categoriesRes = await getAllCategories();
          setCategories(categoriesRes.data);
          const productData = await getProductById(id);

          // Fetch subcategories for the selected category
          if (productData.data.category?._id) {
            const subCatRes = await getSubCategoriesByCategory(
              productData.data.category._id
            );
            setSubCategories(subCatRes.data);
          }

          form.reset({
            designation: productData.data?.designation,
            smallDescription: productData.data?.smallDescription || "",
            description: productData.data?.description || "",
            price: productData.data?.price || 0,
            oldPrice: productData.data?.oldPrice || 0,
            brand: productData.data?.brand || "",
            question: productData.data?.question || "",
            inStock: productData.data.inStock,
            status: productData.data.status,
            features: productData.data.features || [],
            variant: productData.data.variant || [],
            nutritionalValues: productData.data.nutritionalValues || [],
            mainImage: productData.data.mainImage,
            images: productData.data.images || [],
            venteflashDate: productData.data.venteflashDate || "",
            categoryId: productData.data.category?._id || "",
            subCategoryIds:
              productData.data.subCategory?.map(
                (subCategoryId) => subCategoryId._id
              ) || [],
          });

          setVariants(productData.data.variant || []);
          setNutritionalValues(productData.data.nutritionalValues || []);
          setSelectedImg({ url: productData?.data.mainImage?.url });
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch product");
        } finally {
          setIsLoadingCategories(false);
        }
      };
      fetchProduct();
    }
  }, [id, form.reset]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle category changes
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === "categoryId" && value.categoryId) {
        // Add check for value.categoryId
        try {
          const subCatRes = await getSubCategoriesByCategory(value.categoryId);
          setSubCategories(subCatRes.data);
          // Only reset subCategoryIds if this is a new selection, not initial load

          form.setValue("subCategoryIds", []);
        } catch (error) {
          toast.error("Failed to load subcategories");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, id]);

  // Handle form submission

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "mainImage" || key === "images") return; // Handle files separately
      });
      // Stringify arrays before appending to FormData
      formData.append("features", JSON.stringify(values.features)); // Ensure this is an array
      formData.append("subCategoryIds", JSON.stringify(values.subCategoryIds)); // Ensure this is an array
      formData.append("variant", JSON.stringify(values.variant)); // Ensure this is an array of objects
      formData.append("venteflashDate", values?.venteflashDate || ""); // Ensure this is an array of objects
      // For nutritional values
      formData.append(
        "nutritionalValues",
        JSON.stringify(values.nutritionalValues)
      );
      formData.append("categoryId", values?.categoryId);
      // Append other fields
      formData.append("designation", values.designation);
      formData.append("smallDescription", values?.smallDescription);
      formData.append("question", values?.question);
      formData.append("description", values?.description);
      formData.append("price", values?.price);
      formData.append("oldPrice", values?.oldPrice);
      formData.append("inStock", values?.inStock);
      formData.append("status", values?.status);
      formData.append("brand", values?.brand);
      // Append main image
      if (values.mainImage instanceof File) {
        formData.append("mainImage", values.mainImage);
      }

      // Append additional images
      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      }

      // Append deleted images for updates
      if (id && deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }
      if (id) {
        await updateProduct(id, formData); // Update API call
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData); // Create API call
        toast.success("Product created successfully");
      }

      navigate("/inventory/products");
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Submission error:", error);
    }
  };
  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full mb-4 space-x-2 md:mb-8 md:space-x-4">
              <Icon
                icon="mdi:storefront"
                width="24"
                height="24"
                className="text-primary"
              />
              <h4 className="text-sm font-medium truncate md:text-lg">
                {id ? "Update Product" : "Add New Product"}
              </h4>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                size="xl"
                className="flex items-center px-6 py-3 ml-auto rounded-full w-fit "
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {id ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col w-full gap-4 mt-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left section */}
            <div className="flex flex-col w-full space-y-4">
              {/* General Information */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">
                  General Information
                </h3>
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="e.g Prostar 100% WHEY PROTEIN – 2.4KG"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smallDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Small Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell a little bit about the product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <>
                          <QuillToolbar toolbarId={"t2"} />
                          <ReactQuill
                            theme="snow"
                            value={form.getValues("description") || ""}
                            modules={modules("t2")}
                            formats={formats}
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <>
                          <QuillToolbar toolbarId={"t1"} />
                          <ReactQuill
                            theme="snow"
                            value={form.getValues("question") || ""}
                            modules={modules("t1")}
                            formats={formats}
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Afficher en</FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            selected={field.value}
                            onChange={(values) => field.onChange(values)}
                            placeholder="Afficher en"
                            options={featureOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            disabled={isLoading}
                            placeholder="e.g. Impact"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="venteflashDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venteflash Countdown Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <VariantInput
                  variants={variants}
                  setVariants={setVariants}
                  setValue={form.setValue}
                />
              </div>

              {/* Category and Pricing */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">
                  Category and Pricing
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            type="number"
                            min={0}
                            step="any"
                            placeholder="e.g. 249.99"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-base">
                          {field.value
                            ? `Le prix sera de ${(
                                parseFloat(field.value) *
                                (1 + (settings?.tva || 0))
                              ).toFixed(3)} TND après la TVA.`
                            : ""}
                        </FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="oldPrice"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Old Price</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            type="number"
                            min={0}
                            step="any"
                            placeholder="e.g. 259.99"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingCategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category">
                                {
                                  categories.find((c) => c._id === field.value)
                                    ?.designation
                                }
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.designation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subCategoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SubCategories</FormLabel>
                        <FormControl>
                          {form.getValues("categoryId") && (
                            <MultiSelectDropdown
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select SubCategories"
                              options={subCategories?.map((sc) => ({
                                value: sc._id,
                                label: sc.designation,
                              }))}
                              isLoading={isLoadingSubCategories}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <VariantInput
                  variants={nutritionalValues}
                  setVariants={setNutritionalValues}
                  setValue={form.setValue}
                  type="nutritionalValues"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex flex-col w-full space-y-4 md:w-2/5">
              {/* Upload Images */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">
                  Upload Images
                </h3>
                {/* Image preview */}
                <div className="relative w-full overflow-hidden aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900">
                  {selectedImg ? (
                    <img
                      src={selectedImg.url}
                      className="absolute inset-0 object-contain w-full h-full transition-transform duration-300 transform hover:scale-105"
                      alt="Product preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                {/* Main image upload */}
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem
                      onClick={() => {
                        setSelectedImg({
                          url:
                            field?.value?.url ||
                            URL.createObjectURL(field.value),
                        });
                      }}
                    >
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        <MainImageUpload
                          value={field.value}
                          disabled={isLoading}
                          onChange={(file) => field.onChange(file)}
                          onRemove={(url) => {
                            if (url === selectedImg) setSelectedImg("");
                            setDeletedImages((prev) => [...prev, url]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gallery images upload */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem onClick={() => {}}>
                      <FormLabel>Gallery Images</FormLabel>
                      <FormControl>
                        <ImagesUpload
                          setSelectedImg={setSelectedImg}
                          value={field.value}
                          disabled={isLoading}
                          onChange={(files) => field.onChange(files)}
                          onRemove={(url) => {
                            setDeletedImages((prev) => [...prev, url]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Public</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>In Stock</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
