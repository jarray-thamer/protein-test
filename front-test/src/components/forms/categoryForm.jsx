import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "@/helpers/categories/communicator";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import z from "zod";
import { Input } from "../ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const categoryFormSchema = z.object({
  designation: z
    .string()
    .min(1, { message: "Designation is required" })
    .max(100, { message: "Designation must be less than 100 characters" }),
  image: z
    .any()
    .refine(
      (file) => file === undefined || file instanceof File,
      "Image must be a file"
    )
    .refine(
      (file) => file === undefined || file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB`
    )
    .refine(
      (file) => file === undefined || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

export const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      designation: "",
      image: undefined,
    },
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const categoryData = await getCategoryById(id);

          form.setValue("designation", categoryData.data.designation);
          if (categoryData.data.image && categoryData.data.image.url) {
            setPreview(categoryData.data.image.url);
          }
        } catch (error) {
          toast.error("Failed to fetch category data");
          console.error(error);
        }
      };
      fetchCategory();
    }
  }, [id, form]);

  React.useEffect(() => {
    // Cleanup preview URL when component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("designation", values.designation.trim());
      if (values.image) {
        formData.append("image", values.image);
      }

      if (id) {
        await updateCategory(id, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully!");
      }

      setPreview(null);
      form.reset();
      navigate("/categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit category");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Button variant="ghost" size="icon" className="mb-4">
        <Link to="/categories">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="sr-only">go back</span>
        </Link>
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            name="designation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter category designation"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="image"
            control={form.control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => handleImageChange(e, onChange)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-fit"
                      {...field}
                    />
                    {preview && (
                      <div className="relative w-40 h-40 overflow-hidden border rounded-md">
                        <img
                          src={preview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Accepted formats: JPG, PNG, WEBP. Max size: 5MB
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {id ? "Updating..." : "Creating..."}
              </>
            ) : id ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
