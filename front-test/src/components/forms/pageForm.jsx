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
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import z from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import QuillToolbar, { formats, modules } from "../quill/quillToolbar";
import "react-quill/dist/quill.snow.css";
import {
  getPageById,
  createPage,
  updatePage,
} from "@/helpers/page/communicator";

// Define the form schema using Zod
const pageFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  status: z.boolean().default(true),
});

export const PageForm = () => {
  const { id } = useParams(); // Get page ID from URL for editing
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: true,
    },
  });

  // Fetch page data if editing (ID is present)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchPage = async () => {
        try {
          const pageData = await getPageById(id);
          form.setValue("title", pageData.data.title);
          form.setValue("content", pageData.data.content);
          form.setValue("status", pageData.data.status);
        } catch (error) {
          toast.error("Failed to fetch page data");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPage();
    }
  }, [id, form]);

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const pageData = {
        title: values.title,
        content: values.content,
        status: values.status,
      };

      if (id) {
        await updatePage(id, pageData);
        toast.success("Page updated successfully!");
      } else {
        await createPage(pageData);
        toast.success("Page created successfully!");
      }

      navigate("/pages");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit page");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Back button */}
      <Button variant="ghost" size="icon" className="mb-4">
        <Link to="/pages">
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
                    placeholder="Enter page title"
                    disabled={isLoading}
                    {...field}
                  />
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

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {id ? "Updating..." : "Creating..."}
              </>
            ) : id ? (
              "Update Page"
            ) : (
              "Create Page"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
