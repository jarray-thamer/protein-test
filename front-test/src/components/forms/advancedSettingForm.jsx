import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { updateAdvancedSettings } from "@/helpers/settings/general";
import { CheckIcon, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  matricule: z.string().min(2, "Matricule must be at least 2 characters"),
  rib: z.string().min(5, "RIB must be at least 5 characters"),
  registerDeCommerce: z.string().min(2, "Commercial register is required"),
  livraison: z.coerce.number().min(0, "Cannot be negative"),
  timber: z.coerce.number().min(0, "Cannot be negative"),
  tva: z.coerce
    .number()
    .min(0, "TVA cannot be negative")
    .max(1, "TVA cannot exceed 100%")
    .default(0),
});

const fieldLabels = {
  matricule: "Company ID",
  rib: "Bank Account (RIB)",
  registerDeCommerce: "Commercial Register",
  livraison: "Delivery Cost",
  timber: "Timber Cost",
};

export const AdvancedSettingForm = ({ advancedData }) => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricule: "",
      rib: "",
      registerDeCommerce: "",
      livraison: 0,
      timber: 0,
      tva: 0,
    },
  });

  useEffect(() => {
    if (advancedData) {
      form.reset({
        matricule: advancedData.matricule ?? "",
        rib: advancedData.rib ?? "",
        registerDeCommerce: advancedData.registerDeCommerce ?? "",
        livraison: advancedData.livraison ?? 0,
        timber: advancedData.timber ?? 0,
        tva: advancedData.tva ?? 0,
      });
    }
  }, [advancedData, form]);

  const isLoading = form.formState.isSubmitting;

  const handleTvaChange = (e, onChange) => {
    const rawValue = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/(\.\d{0,2}).*$/, "$1");

    if (rawValue === "") {
      onChange(0);
      return;
    }

    const numericValue = parseFloat(rawValue);
    onChange(numericValue / 100);
    form.trigger("tva");
  };

  const onSubmit = async (values) => {
    try {
      await updateAdvancedSettings(values);
      toast.success("Advanced settings updated successfully");
    } catch (error) {
      toast.error("Failed to update advanced settings");
      console.error("Update error:", error);
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
                Advanced Settings
              </h4>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 ml-auto rounded-full w-fit"
              aria-label="Save settings"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Confirm"}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex flex-col w-full space-y-4">
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                {["matricule", "rib", "registerDeCommerce"].map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel className="cursor-pointer">
                          {fieldLabels[fieldProps.name] || fieldProps.name}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            id={fieldProps.name}
                            disabled={isLoading}
                            placeholder={`Enter ${
                              fieldLabels[fieldProps.name] || fieldProps.name
                            }...`}
                            aria-describedby={`${fieldProps.name}-help`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                {["livraison", "timber"].map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel className="cursor-pointer">
                          {fieldLabels[fieldProps.name] || fieldProps.name}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...fieldProps}
                              id={fieldProps.name}
                              type="number"
                              step="0.01"
                              disabled={isLoading}
                              placeholder={`Enter ${
                                fieldLabels[fieldProps.name] || fieldProps.name
                              }...`}
                              aria-describedby={`${fieldProps.name}-help`}
                              className="pr-8"
                              value={fieldProps.value ?? ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="tva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="tva" className="cursor-pointer">
                        VAT Rate
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="tva"
                            value={field.value * 100 || ""}
                            disabled={isLoading}
                            placeholder="e.g. 19"
                            onChange={(e) => handleTvaChange(e, field.onChange)}
                            className="pr-8"
                            aria-describedby="tva-help"
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value > 0 && !form.formState.errors.tva && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          VAT will be applied as{" "}
                          {(field.value * 100).toFixed(2)}%
                        </p>
                      )}
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
