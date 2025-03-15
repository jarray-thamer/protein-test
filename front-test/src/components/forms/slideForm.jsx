"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  X,
  GripVertical,
  ImageIcon,
  Trash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageUploadSchema = z.object({
  images: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required.")
    .refine((files) => {
      if (files?.length > 0) {
        return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
      }
      return true;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      if (files?.length > 0) {
        return Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      }
      return true;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

// Sortable Slide Item Component
function SortableSlideItem({ slide }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: slide.img_id,
    });

  const [isDeleting, setIsDeleting] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        setIsDeleting(true);
        await axios.delete(
          `/admin/settings/homepage/delete/slides/${slide.img_id
            .split("/")
            .pop()}`
        );
        toast.success("Slide deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting slide:", error);
        toast.error("Failed to delete slide");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-2 mb-2 bg-white border rounded-md group hover:border-primary"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="relative flex-shrink-0 w-24 h-16 overflow-hidden rounded-md bg-muted">
        <img
          src={slide.url}
          alt="Slide"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-grow text-sm truncate text-muted-foreground">
        {slide.img_id.split("/").pop()}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 text-destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

export default function SlidesManagement() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Define form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      images: undefined,
    },
  });

  // Load existing slides on component mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          "/admin/settings/homepage/get/all/slides"
        );
        setSlides(response.data.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
        toast.error("Failed to load slides");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      form.setValue("images", files);

      // Generate previews
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setFilePreview(newPreviews);
    }
  };

  // Handle file upload submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        "/admin/settings/homepage/upload/slides",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSlides(response.data.data);
      setFilePreview([]);
      form.reset();
      toast.success("Slides uploaded successfully");
    } catch (error) {
      console.error("Error uploading slides:", error);
      toast.error("Failed to upload slides");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag end (reordering slides)
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find indices
      const oldIndex = slides.findIndex((slide) => slide.img_id === active.id);
      const newIndex = slides.findIndex((slide) => slide.img_id === over.id);

      // Reorder array
      const newSlides = [...slides];
      const [movedItem] = newSlides.splice(oldIndex, 1);
      newSlides.splice(newIndex, 0, movedItem);

      // Update state
      setSlides(newSlides);

      // Save new order to API
      try {
        await axios.put("/admin/settings/homepage/slides/order", {
          slides: newSlides,
        });
        toast.success("Slide order updated");
      } catch (error) {
        console.error("Error updating slide order:", error);
        toast.error("Failed to update slide order");

        // Restore original order on error
        setSlides(slides);
      }
    }
  };

  // Remove preview item
  const removePreviewItem = (index) => {
    const newFilePreview = [...filePreview];
    newFilePreview.splice(index, 1);
    setFilePreview(newFilePreview);

    // Update the form's file list
    if (form.getValues("images")?.length) {
      const dataTransfer = new DataTransfer();
      const files = form.getValues("images");

      Array.from(files).forEach((file, i) => {
        if (i !== index) {
          dataTransfer.items.add(file);
        }
      });

      form.setValue("images", dataTransfer.files, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Slides</CardTitle>
          <CardDescription>Add new slides to the slideshow.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Slide Images</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <div
                          className="flex flex-col items-center justify-center p-6 transition-colors border-2 border-dashed rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50"
                          onClick={() =>
                            document.getElementById("slides-input").click()
                          }
                        >
                          <Input
                            id="slides-input"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            {...rest}
                          />
                          <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              JPG, PNG, WEBP up to 5MB
                            </p>
                          </div>
                        </div>

                        {/* File Preview */}
                        {filePreview.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 md:grid-cols-4">
                            {filePreview.map((file, index) => (
                              <div
                                key={index}
                                className="relative group aspect-[16/9] border rounded-md overflow-hidden bg-muted"
                              >
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="object-cover w-full h-full"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute w-6 h-6 opacity-0 top-1 right-1 group-hover:opacity-100"
                                  onClick={() => removePreviewItem(index)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      You can upload multiple images at once.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || filePreview.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Slides"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Slides</CardTitle>
          <CardDescription>
            Drag to reorder slides or delete unwanted ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : slides.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-md bg-muted/30">
              <ImageIcon className="w-12 h-12 mb-3 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                No slides available. Upload your first slide above.
              </p>
            </div>
          ) : (
            <div className="p-4 border rounded-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={slides.map((slide) => slide.img_id)}
                  strategy={verticalListSortingStrategy}
                >
                  {slides.map((slide) => (
                    <SortableSlideItem key={slide.img_id} slide={slide} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {slides.length} {slides.length === 1 ? "slide" : "slides"} in total
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
