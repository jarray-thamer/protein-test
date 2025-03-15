"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createClient,
  getClientById,
  updateClient,
} from "@/helpers/clients/communication";
import { useEffect } from "react";

// Note: You'll need to implement updateClient in "@/helpers/clients/communication"
// Example: export const updateClient = async (id, values) => { ... }

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone1: z.string(),
  phone2: z.string().optional(),
  ville: z.string().min(1, "Ville is required"),
  address: z.string().min(1, "Address is required"),
});

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone1: "",
      phone2: "",
      ville: "",
      address: "",
    },
  });

  // Fetch client data when editing
  useEffect(() => {
    if (isEdit) {
      const fetchClient = async () => {
        try {
          const client = await getClientById(id);

          if (client) {
            // Populate form with fetched data
            form.reset(client);
          } else {
            toast.error("Client not found");
          }
        } catch (error) {
          toast.error("Failed to fetch client data");
        }
      };
      fetchClient();
    }
  }, [id, form, navigate]);

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        // Replace with actual updateClient function once implemented
        await updateClient(id, values);
        toast.success("Client updated successfully");
      } else {
        await createClient(values);
        toast.success("Client created successfully");
      }
      navigate("/clients");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">
              {isEdit ? "Edit Client" : "New Client"}
            </h1>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/clients")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Update Client" : "Create Client"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom et Prenom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone1 Field */}
            <FormField
              control={form.control}
              name="phone1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone2 Field */}
            <FormField
              control={form.control}
              name="phone2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ville Field */}
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tunis" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Rue,44" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ClientForm;
