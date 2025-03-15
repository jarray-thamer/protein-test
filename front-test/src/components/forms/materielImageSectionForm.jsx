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
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import z from "zod";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteMaterielImageSection,
  getMaterielImageSection,
  updateMaterielImageSection,
} from "@/helpers/settings/general";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const materielImageSectionSchema = z.object({
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

export const MaterielImageSectionForm = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);

  const form = useForm({
    resolver: zodResolver(materielImageSectionSchema),
    defaultValues: {
      image: undefined,
    },
  });

  // Fetch current materiel image if exists
  useEffect(() => {
    const fetchMaterielImage = async () => {
      try {
        const response = await getMaterielImageSection();

        if (response.data && response.data.url) {
          setPreview(response.data.url);
          setHasExistingImage(true);
        }
      } catch (error) {
        toast.error("Failed to fetch materiel image data");
        console.error(error);
      }
    };

    fetchMaterielImage();
  }, []);

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
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
      if (preview && !preview.startsWith("http")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      if (!preview.startsWith("http")) {
        setPreview(null);
      }
      onChange(null);
    }
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      if (values.image) {
        formData.append("image", values.image);
      }

      await updateMaterielImageSection(formData);
      toast.success("Materiel image updated successfully!");

      setPreview(null);
      form.reset();
      navigate("/"); // Adjust this path as needed
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update materiel image"
      );
      console.error(error);
    }
  };

  const handleDeleteImage = async () => {
    if (!hasExistingImage) return;

    try {
      await deleteMaterielImageSection();
      setPreview(null);
      setHasExistingImage(false);
      toast.success("Materiel image deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete materiel image"
      );
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Button variant="ghost" size="icon" className="mb-4">
        <Link to="/information">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="sr-only">go back</span>
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Materiel Image Section</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="image"
            control={form.control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Materiel Section Image</FormLabel>
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
                      <div className="relative w-full h-64 max-w-lg overflow-hidden border rounded-md">
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

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {hasExistingImage ? "Updating..." : "Uploading..."}
                </>
              ) : hasExistingImage ? (
                "Update Image"
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
