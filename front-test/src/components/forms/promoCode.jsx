import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
import { CalendarIcon, CheckIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Calendar } from "../ui/calendar";
import { formatDateDays } from "@/lib/formattedData";
import { cn } from "@/lib/utils";
import {
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
} from "@/helpers/promoCode/communicator";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  code: z.string().min(1, { message: "Code is required!" }),
  discount: z
    .string()
    .min(1, { message: "Discount is required!" })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Discount must be a valid number",
    })
    .refine((val) => parseFloat(val) >= 1, {
      message: "Discount must be at least 1%",
    })
    .refine((val) => parseFloat(val) <= 100, {
      message: "Discount cannot exceed 100%",
    }),
  startDate: z.any(),
  endDate: z.any(),
  status: z.boolean(),
});

const PromoCodeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: false,
    },
  });
  const isLoading = form.formState.isSubmitting;
  useEffect(() => {
    if (id) {
      const fetchPromoCode = async () => {
        try {
          const promoCodeData = await getPromoCodeById(id);
          const discountPercentage = (promoCodeData?.data?.discount || 0) * 100;
          form.reset({
            code: promoCodeData?.data?.code || "",
            discount: discountPercentage.toString(),
            startDate: promoCodeData?.data?.startDate || "",
            endDate: promoCodeData?.data?.endDate || "",
            status: promoCodeData?.data?.status || false,
          });
        } catch (error) {
          console.error(error);
          toast.error("Failed to get promo code");
        }
      };
      fetchPromoCode();
    }
  }, [id, form.reset]);

  // Handle Form Submit
  const onSubmit = async (values) => {
    try {
      console.log("values", values);

      const discountDecimal = parseFloat(values.discount) / 100;
      const data = {
        ...values,
        discount: discountDecimal,
        startDate: values?.startDate?.toISOString(), // Ensure dates are properly formatted
        endDate: values?.endDate?.toISOString(),
      };

      if (id) {
        await updatePromoCode(id, data);
        toast.success("PromoCode created successfully");
      } else {
        await createPromoCode(data);
        toast.success("PromoCode created successfully");
      }
      navigate("/inventory/promo-codes");
    } catch (error) {
      toast.error("Failed to save PromoCode");
      console.error("Submission error:", error);
    }
  };

  const handleDiscountChange = (e, onChange) => {
    let value = e.target.value;

    // Only allow numbers and decimal point
    value = value.replace(/[^\d.]/g, "");

    // Handle decimal places
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1]?.length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }

    onChange(value);

    // Trigger validation
    form.trigger("discount");
  };
  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center">
            <div className="flex items-center mb-4 space-x-2 md:mb-8 md:space-x-4">
              <Icon
                icon="mdi:storefront"
                width="24"
                height="24"
                className="text-primary"
              />
              <h4 className="text-sm font-medium truncate md:text-lg">
                {id ? "Update PromoCode" : "Add New PromoCode"}
              </h4>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                size="xl"
                className="flex items-center px-6 py-3 ml-auto rounded-full w-fit "
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {id ? "Update PromoCode" : "Add PromoCode"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-4 mt-4">
            {/* Left section */}
            <div className="flex flex-col w-full space-y-4 md:w-1/2">
              {/* General Information */}
              <div className="flex flex-col w-full p-6 space-y-4 bg-muted/45 rounded-xl">
                <h3 className="text-lg font-medium text-primary">
                  General Information
                </h3>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="cursor-pointer">Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="e.g F9K23"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <label className="cursor-pointer" htmlFor="discount">
                          Discount
                        </label>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="discount"
                            disabled={isLoading}
                            placeholder="e.g 10"
                            onChange={(e) =>
                              handleDiscountChange(e, field.onChange)
                            }
                            className="pr-8"
                            {...field}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                      {field.value &&
                        !form.formState.errors.discount &&
                        parseFloat(field.value) > 0 && (
                          <p>Discount will be applied as {field.value}% off</p>
                        )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="cursor-pointer">
                        Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDateDays(field.value)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="cursor-pointer">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDateDays(field.value)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues("startDate");
                              return date < (startDate || new Date());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

export default PromoCodeForm;
