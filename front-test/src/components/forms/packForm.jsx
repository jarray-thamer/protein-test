import {
  createPack,
  getPackById,
  updatePack,
} from "@/helpers/packs/communicator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { CheckIcon, ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import QuillToolbar, { formats, modules } from "../quill/quillToolbar";
import ReactQuill from "react-quill";
import { MultiSelectDropdown } from "../multipleSelectInput";

import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import ProductVariants from "../pack/productVariants";
import { toast } from "sonner";

import { ImagesUpload } from "./imagesUpload";
import { MainImageUpload } from "./imageUpload";
import { Switch } from "../ui/switch";
import { packOptions } from "../dataTables/packs/options";
import { getAdvancedData } from "@/helpers/settings/general";

const formSchema = z.object({
  designation: z.string().min(1, { message: "Designation is required" }),
  smallDescription: z
    .string()
    .max(360, { message: "maximum size is 360 character." }),
  description: z.string().optional(),
  question: z.string().optional(),
  price: z.number().min(1, { message: "Price must be greater" }),
  oldPrice: z
    .number()
    .min(0, { message: "Old price must be 0 or greater" })
    .optional(),
  status: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  mainImage: z.any().default([]),
  images: z.array(z.any()).default([]),
  products: z.array(z.string()),
});

const PackForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedImg, setSelectedImg] = useState("");
  const [productsVariants, setProductsVariants] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

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
      question: "",
      price: 0,
      oldPrice: 0,
      status: false,
      features: [],
      mainImage: null,
      images: [],
      products: [],
    },
  });
  const isLoading = form.formState.isSubmitting;
  // Load pack data for editing
  useEffect(() => {
    if (id) {
      const fetchPack = async () => {
        try {
          const packData = await getPackById(id);

          form.reset({
            designation: packData.data?.designation,
            smallDescription: packData.data?.smallDescription || "",
            description: packData.data?.description || "",
            question: packData.data?.question || "",
            price: packData.data?.price || 0,
            oldPrice: packData.data?.oldPrice || 0,
            status: packData.data?.status || false,
            features: packData.data.features || [],
            mainImage: packData.data.mainImage,
            images: packData.data.images || [],
            products: packData.data.products._id || [],
          });
          setProductsVariants(packData.data?.products);
          setSelectedImg({ url: packData?.data.mainImage?.url });
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch pack");
        }
      };
      fetchPack();
    }
  }, [id, form.reset]);

  // Handle Form submission
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "mainImage" || key === "images") return;
      });
      formData.append("designation", values?.designation);
      formData.append("smallDescription", values?.smallDescription);
      formData.append("description", values?.description);
      formData.append("question", values?.question);
      formData.append("price", values?.price);
      formData.append("oldPrice", values?.oldPrice);
      formData.append("status", values?.status);

      formData.append("products", JSON.stringify(values.products));
      formData.append("features", JSON.stringify(values.features));

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
        await updatePack(id, formData);
        toast.success("Pack updated successfully");
      } else {
        await createPack(formData);
        toast.success("Pack created successfully");
      }
      navigate("/inventory/packs");
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Submission error:", error);
    }
  };
  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full mb-4 space-x-2 md:mb-8 md:space-x-4">
              <Icon
                icon="mdi:storefront"
                width="24"
                height="24"
                className="text-primary"
              />
              <h4 className="text-sm font-medium truncate md:text-lg">
                {id ? "Update Pack" : "Add New Pack"}
              </h4>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                size="xl"
                className="flex items-center px-6 py-3 ml-auto rounded-full w-fit "
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {id ? "Update Pack" : "Add Pack"}
              </Button>
            </div>
          </div>
          {/*  */}
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
                          placeholder="e.g Starter Pack"
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            options={packOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <ProductVariants
                  variants={productsVariants}
                  setVariants={setProductsVariants}
                  setValue={form.setValue}
                />
              </div>
              {/* Category and Pricing */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">Pricing</h3>
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
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PackForm;
