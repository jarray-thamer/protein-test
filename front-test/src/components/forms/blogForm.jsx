import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2, TrashIcon } from "lucide-react";
import z from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import QuillToolbar, { formats, modules } from "../quill/quillToolbar";
import "react-quill/dist/quill.snow.css";
import {
  getBlogById,
  createBlog,
  updateBlog,
} from "@/helpers/blog/communicator";

// Define the form schema using Zod
const blogFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  cover: z.any().optional(), // File input for cover image
  status: z.boolean().default(true),
  inLandingPage: z.boolean().default(false),
});

export const BlogForm = () => {
  const { id } = useParams(); // Get blog ID from URL for editing
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      cover: undefined,
      status: true,
      inLandingPage: false,
    },
  });

  // State for cover image preview and removal
  const [preview, setPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blog data if editing (ID is present)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchBlog = async () => {
        try {
          const blogData = await getBlogById(id);
          form.setValue("title", blogData.data.title);
          form.setValue("content", blogData.data.content);
          form.setValue("status", blogData.data.status);
          form.setValue("inLandingPage", blogData.data.inLandingPage);
          if (blogData.data.cover && blogData.data.cover.url) {
            setPreview(blogData.data.cover.url);
          }
        } catch (error) {
          toast.error("Failed to fetch blog data");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, form]);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && !id) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, id]);

  // Handle cover image selection and preview
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      form.setValue("cover", file);
      setRemoveCover(false);
    }
  };

  // Handle cover image removal
  const handleRemoveCover = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    form.setValue("cover", undefined);
    setRemoveCover(true);
  };

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("status", values.status);
      formData.append("inLandingPage", values.inLandingPage);

      // Append cover file if a new one is selected
      if (values.cover instanceof File) {
        formData.append("cover", values.cover);
      }
      // Indicate cover removal if applicable
      if (removeCover) {
        formData.append("removeCover", "true");
      }

      if (id) {
        await updateBlog(id, formData);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully!");
      }

      navigate("/blogs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit blog");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Back button */}
      <Button variant="ghost" size="icon" className="mb-4">
        <Link to="/blogs">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="sr-only">Go back</span>
        </Link>
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter blog title"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Cover Image */}
          <FormField
            name="cover"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-start space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      disabled={isLoading}
                    />
                    {preview && (
                      <div className="relative w-40 h-40">
                        <img
                          src={preview}
                          alt="Cover preview"
                          className="object-cover w-full h-full rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={handleRemoveCover}
                          disabled={isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content (Quill Editor) */}
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <>
                    <QuillToolbar toolbarId="t1" />
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      modules={modules("t1")}
                      formats={formats}
                      readOnly={isLoading}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Published</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* In Landing Page */}
          <FormField
            name="inLandingPage"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Afficher en Landing Page</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {id ? "Updating..." : "Creating..."}
              </>
            ) : id ? (
              "Update Blog"
            ) : (
              "Create Blog"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
