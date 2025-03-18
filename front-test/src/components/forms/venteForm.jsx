import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { CheckIcon, PlusCircle, UserPlus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAllProductsNormal } from "@/helpers/products/communicator";
import { getAllPacks } from "@/helpers/packs/communicator";
import { getAllClients } from "@/helpers/clients/communication";
import {
  createVente,
  getVenteById,
  updateVente,
} from "@/helpers/vente/communicator";

// Form schema remains unchanged
const formSchema = z.object({
  createdAt: z.coerce.date(),
  reference: z.string().optional(),
  clientId: z.string().optional(),
  client: z.object({
    name: z.string().min(1, "Name is required"),
    phone1: z.string().min(1, "Phone is required"),
    phone2: z.string().optional(),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Address is required"),
    ville: z.string().min(1, "Ville is required"),
    clientNote: z.string().optional(),
  }),
  livreur: z.object({
    name: z.string(),
    cin: z.string(),
    carNumber: z.string(),
  }),
  isNewClient: z.boolean().default(false),
  items: z
    .array(
      z.object({
        type: z.enum(["Product", "Pack"]),
        itemId: z.string().min(1, "Item is required"),
        quantity: z.number().min(1, "Minimum 1"),
        price: z.number().min(0),
        oldPrice: z.number().optional(),
        designation: z.string().min(1, "Designation is required"),
      })
    )
    .min(1, "At least one item required"),
  additionalCharges: z.number().min(0),
  additionalDiscount: z.number().min(0),
  livraison: z.number().min(0),
  modePayment: z.enum(["CASH", "CREDIT_CARD", "BANK_TRANSFER"]),
  promoCode: z
    .object({
      code: z.string().optional(),
      value: z.number().optional(),
    })
    .optional(),
  status: z.enum(["pending", "processing", "delivered", "paid", "cancelled"]),
  note: z.string().optional(),
});

const VenteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdAt: new Date().toISOString().split("T")[0], // Today's date in 'YYYY-MM-DD'
      reference: "",
      clientId: "",
      isNewClient: false,
      client: {
        name: "",
        phone1: "",
        phone2: "",
        email: "",
        address: "",
        ville: "",
        clientNote: "",
      },
      livreur: {
        name: "",
        cin: "",
        carNumber: "",
      },
      items: [
        {
          type: "Product",
          itemId: "",
          quantity: 1,
          price: 0,
        },
      ],
      additionalCharges: 0,
      additionalDiscount: 0,
      livraison: 0,
      modePayment: "CASH",
      status: "pending",
      note: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch products, packs, and clients
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingItems(true);
      try {
        const [productsRes, packsRes, clientsRes] = await Promise.all([
          getAllProductsNormal(),
          getAllPacks(),
          getAllClients(),
        ]);
        setProducts(productsRes.data);
        setPacks(packsRes);
        setClients(clientsRes.data);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoadingItems(false);
      }
    };
    fetchData();
  }, []);

  // Fetch vente data for editing
  useEffect(() => {
    if (id) {
      const fetchVente = async () => {
        try {
          const venteData = await getVenteById(id);
          if (!venteData.data) {
            throw new Error("Vente not found");
          }
          const vente = venteData.data;
          form.reset({
            createdAt: vente.createdAt
              ? new Date(vente.createdAt).toISOString().split("T")[0]
              : "",
            reference: vente.reference || "",
            clientId: vente.client.id || "",
            isNewClient: !vente.client.id,
            client: {
              name: vente.client.name || "",
              phone1: vente.client.phone1 || "",
              phone2: vente.client.phone2 || "",
              email: vente.client.email || "",
              address: vente.client.address || "",
              ville: vente.client.ville || "",
              clientNote: vente.client.clientNote || "",
            },
            livreur: {
              name: vente.livreur.name || "",
              cin: vente.livreur.cin || "",
              carNumber: vente.livreur.carNumber || "",
            },
            items: vente.items.map((item) => ({
              type: item.type,
              itemId: item?.itemId?._id || "",
              quantity: item.quantity,
              price: item.price,
              oldPrice: item.oldPrice || 0,
              designation: item.designation,
            })),
            additionalCharges: vente.additionalCharges || 0,
            additionalDiscount: vente.discount || 0,
            livraison: vente.livraison || 0,
            modePayment: vente.modePayment || "CASH",
            status: vente.status || "pending",
            note: vente.note || "",
          });
        } catch (error) {
          toast.error("Failed to load vente data");
        }
      };
      fetchVente();
    }
  }, [id, form]);

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find((c) => c._id === clientId);
    if (selectedClient) {
      form.setValue("clientId", clientId);
      form.setValue("client", {
        name: selectedClient.name,
        phone1: selectedClient.phone1,
        phone2: selectedClient.phone2 || "",
        email: selectedClient.email,
        address: selectedClient.address,
        ville: selectedClient.ville,
        clientNote: "",
      });
    }
  };

  const handleItemChange = (value, index) => {
    const itemType = form.watch(`items.${index}.type`);
    let selectedItem;

    if (itemType === "Product") {
      selectedItem = products.find((product) => product._id === value);
    } else {
      selectedItem = packs.find((pack) => pack._id === value);
    }

    if (selectedItem) {
      form.setValue(`items.${index}.itemId`, value);
      form.setValue(`items.${index}.price`, selectedItem.price);
      form.setValue(`items.${index}.designation`, selectedItem.designation);
      if (selectedItem.oldPrice) {
        form.setValue(`items.${index}.oldPrice`, selectedItem.oldPrice);
      }
    }
  };

  const onSubmit = async (values) => {
    console.log(values);

    try {
      if (id) {
        await updateVente(id, values);
        toast.success("Vente updated successfully");
      } else {
        await createVente(values);
        toast.success("Vente created successfully");
      }
      navigate("/vente");
    } catch (error) {
      toast.error("Failed to save Vente");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full mb-4 space-x-2 md:mb-8 md:space-x-4">
              <h4 className="text-sm font-medium truncate md:text-lg">
                {id ? "Update Vente" : "Create New Vente"}
              </h4>
            </div>
            <Button type="submit" className="ml-auto">
              <CheckIcon className="w-4 h-4 mr-2" />
              {id ? "Update Vente" : "Create Vente"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Client Information */}
            <div className="p-6 space-y-4 bg-muted/45 rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-primary">
                  Client Information
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    form.setValue("isNewClient", !form.watch("isNewClient"))
                  }
                >
                  {form.watch("isNewClient") ? (
                    <UserPlus className="w-4 h-4 mr-2" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-2" />
                  )}
                  {form.watch("isNewClient") ? "Select Existing" : "New Client"}
                </Button>
              </div>

              {!form.watch("isNewClient") ? (
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Client</FormLabel>
                      <Select
                        onValueChange={(value) => handleClientSelect(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                              {client.name} - {client.phone1} - {client.ville}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : null}

              {(form.watch("isNewClient") || form.watch("clientId")) &&
                Object.entries(form.getValues().client).map(([key]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`client.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </FormLabel>
                        <FormControl>
                          {key === "clientNote" ? (
                            <Textarea {...field} />
                          ) : (
                            <Input
                              {...field}
                              disabled={!form.watch("isNewClient")}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              <div className="mt-6">
                <h4 className="mb-3 font-medium text-md">Livreur Details</h4>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="livreur.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom et prénom</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Livreur name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="livreur.cin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIN</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Identity number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="livreur.carNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>numéro d'immatriculation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Registration number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Vente Details */}
            <div className="p-6 space-y-4 bg-muted/45 rounded-xl">
              <h3 className="text-lg font-medium text-primary">
                Vente Details
              </h3>
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created At</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.type`}
                          render={({ field: typeField }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                value={typeField.value}
                                onValueChange={(value) => {
                                  typeField.onChange(value);
                                  form.setValue(`items.${index}.itemId`, "");
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Product">
                                    Product
                                  </SelectItem>
                                  <SelectItem value="Pack">Pack</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.itemId`}
                          render={({ field: itemField }) => (
                            <FormItem>
                              <FormLabel>Item</FormLabel>
                              <Select
                                value={itemField.value}
                                onValueChange={(value) =>
                                  handleItemChange(value, index)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                                <SelectContent>
                                  {form.watch(`items.${index}.type`) ===
                                  "Product"
                                    ? products.map((product) => (
                                        <SelectItem
                                          key={product._id}
                                          value={product._id}
                                        >
                                          {product.designation}
                                        </SelectItem>
                                      ))
                                    : packs.map((pack) => (
                                        <SelectItem
                                          key={pack._id}
                                          value={pack._id}
                                        >
                                          {pack.designation}
                                        </SelectItem>
                                      ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="mb-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Item
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    append({
                      type: "Product",
                      itemId: "",
                      quantity: 1,
                      price: 0,
                    })
                  }
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="modePayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CREDIT_CARD">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="BANK_TRANSFER">
                            Bank Transfer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["additionalCharges", "additionalDiscount", "livraison"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fieldName
                              .split(/(?=[A-Z])/)
                              .join(" ")
                              .charAt(0)
                              .toUpperCase() +
                              fieldName
                                .split(/(?=[A-Z])/)
                                .join(" ")
                                .slice(1)}
                          </FormLabel>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
              <FormField
                control={form.control}
                name={`note`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VenteForm;
