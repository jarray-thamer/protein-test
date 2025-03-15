import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CheckIcon, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateGeneralData } from "@/helpers/settings/general";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  logo: z.any().optional(),
  contact: z.object({
    phone: z.string().optional().default(""),
    fax: z.string().optional().default(""),
    email: z.string().email().optional().default(""),
    address: z.string().optional().default(""),
  }),
  social: z.object({
    facebookUrl: z.string().optional().default(""),
    twitterUrl: z.string().optional().default(""),
    linkedinUrl: z.string().optional().default(""),
    instagramUrl: z.string().optional().default(""),
    youtubeUrl: z.string().optional().default(""),
    pinterestUrl: z.string().optional().default(""),
    whatsAppUrl: z.string().optional().default(""),
  }),
  playStoreUrl: z.string().optional().default(""),
  appStoreUrl: z.string().optional().default(""),
});

const GeneralSettingForm = ({ generalData }) => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: generalData?.logo,
      contact: {
        phone: generalData?.contact?.phone || "",
        fax: generalData?.contact?.fax || "",
        email: generalData?.contact?.email || "",
        address: generalData?.contact?.address || "",
      },
      social: {
        facebookUrl: generalData?.social?.facebookUrl || "",
        twitterUrl: generalData?.social?.twitterUrl || "",
        linkedinUrl: generalData?.social?.linkedinUrl || "",
        instagramUrl: generalData?.social?.instagramUrl || "",
        youtubeUrl: generalData?.social?.youtubeUrl || "",
        pinterestUrl: generalData?.social?.pinterestUrl || "",
        whatsAppUrl: generalData?.social?.whatsAppUrl || "",
      },
      playStoreUrl: generalData?.playStoreUrl || "",
      appStoreUrl: generalData?.appStoreUrl || "",
      appGalleryUrl: generalData?.appGalleryUrl || "",
    },
  });

  // Initialize preview from generalData
  useEffect(() => {
    if (generalData?.logo?.url) {
      setPreview(generalData.logo.url);
    }
  }, [generalData]);

  const isLoading = form.formState.isSubmitting;

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Handle file if it exists
      if (values.logo instanceof File) {
        formData.append("logo", values.logo);
      }

      // Handle contact information
      Object.entries(values.contact).forEach(([key, value]) => {
        if (value) {
          formData.append(`contact[${key}]`, value);
        }
      });

      // Handle social media URLs
      Object.entries(values.social).forEach(([key, value]) => {
        if (value) {
          formData.append(`social[${key}]`, value);
        }
      });

      // Handle store URLs
      if (values.playStoreUrl) {
        formData.append("playStoreUrl", values.playStoreUrl);
      }
      if (values.appStoreUrl) {
        formData.append("appStoreUrl", values.appStoreUrl);
      }
      if (values.appGalleryUrl) {
        formData.append("appGalleryUrl", values.appGalleryUrl);
      }

      // Make API call
      await updateGeneralData(formData);
      toast.success("Updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full mb-4 space-x-2 md:mb-8 md:space-x-4">
              <SettingsIcon className="w-6 h-6" />
              <h4 className="text-sm font-medium truncate md:text-lg">
                General Settings
              </h4>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 ml-auto rounded-full w-fit"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Confirm"}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex flex-col w-full space-y-4 ">
              {/* General Section */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">General</h3>
                <FormField
                  name="logo"
                  control={form.control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
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
                            <div className="relative h-40 overflow-hidden border rounded-md w-fit">
                              <img
                                src={preview}
                                alt="Preview"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Section */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">Contact</h3>
                {["phone", "fax", "email", "address"].map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={`contact.${field}`}
                    render={({ field: { value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="capitalize cursor-pointer">
                          {field}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={value || ""}
                            disabled={isLoading}
                            placeholder={`Enter your ${field}...`}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Social Section */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">Social</h3>
                {Object.keys(formSchema.shape.social.shape).map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={`social.${field}`}
                    render={({ field: { value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="capitalize cursor-pointer">
                          {field.replace("Url", "")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={value || ""}
                            disabled={isLoading}
                            placeholder={`Enter your ${field.replace(
                              "Url",
                              ""
                            )} URL...`}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">
                  Mobile Application Url
                </h3>
                {["playStoreUrl", "appStoreUrl", "appGalleryUrl"].map(
                  (field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={`${field}`}
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="capitalize cursor-pointer">
                            {field}
                          </FormLabel>
                          <FormControl>
                            <Input
                              value={value || ""}
                              disabled={isLoading}
                              placeholder={`Enter your ${field}...`}
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GeneralSettingForm;
