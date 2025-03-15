import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  ChevronDownIcon,
  EditIcon,
  MailIcon,
  PlusIcon,
  PrinterIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDate } from "@/lib/formattedData";
import { deleteVente, getVenteById } from "@/helpers/vente/communicator";
import { formatCurrency } from "@/lib/formattedCurrency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAdvancedData } from "@/helpers/settings/general";
import { handleDeleteManyVentes } from "@/functions/vente";

const FormSchema = z.object({
  note: z.string(),
});

const VenteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vente, setVente] = useState({});
  const [advancedData, setAdvancedData] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchVente(id) {
      const res = await getVenteById(id);
      setVente(res.data);
      form.reset({ note: res.data.note || "" });
    }
    async function fetchAdvancedData() {
      const res = await getAdvancedData();

      setAdvancedData(res);
    }
    if (id) fetchVente(id);
    fetchAdvancedData();
  }, [id]);

  const formattedTotal = new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
  }).format(vente.netAPayer || 0);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-500";
      case "paid":
        return "text-green-600 bg-green-100 border-green-500";
      case "cancelled":
        return "text-red-600 bg-red-100 border-red-500";
      case "processing":
        return "text-blue-600 bg-blue-100 border-blue-500";
      case "delivered":
        return "text-emerald-600 bg-emerald-100 border-emerald-500";
      default:
        return "text-gray-600 bg-gray-100 border-gray-500";
    }
  };

  const detailsVente = [
    { label: "Vente ID", value: vente._id },
    { label: "vente reference", value: vente.reference },
    { label: "Start Date", value: formatDate(vente.createdAt) },
    {
      label: "Updated Date",
      value: formatDate(vente?.updatedAt || vente?.createdAt),
    },
  ];

  const detailsClient = [
    {
      label: "Email",
      value: vente.client?.email,
      className: "text-blue-500",
    },
    { label: "Name", value: vente.client?.name, className: "capitalize" },
    { label: "Phone1", value: vente.client?.phone1 },
    { label: "Phone2", value: vente.client?.phone2 },
    { label: "Ville", value: vente.client?.ville },
    { label: "Address", value: vente.client?.address },
  ];

  async function handleDeleteVente() {
    console.log("delete");

    await handleDeleteManyVentes([id]);
    navigate("/vente");
  }

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: "", // Pre-fill if editing
    },
  });

  function onSubmit(data) {
    console.log(data);
    setOpen(false);
  }

  return (
    <div className="flex flex-col p-4 mx-auto md:p-8 max-w-screen-2xl">
      <div className="flex items-center mb-4 space-x-2 md:mb-8 md:space-x-4">
        <Icon
          icon="mdi:storefront"
          width="24"
          height="24"
          className="text-primary"
        />
        <h4 className="text-sm truncate md:text-base">
          Vente Details -{" "}
          <span className="font-medium">{vente?.reference || ""}</span>
        </h4>
      </div>

      <div className="flex flex-col mb-6 space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <h3 className="text-2xl font-semibold tracking-wider capitalize md:text-4xl text-primary">
          Vente-{vente.reference || ""}
        </h3>
        <h6 className="text-lg md:text-xl">
          for <span className="ml-0.5 font-medium">{formattedTotal || ""}</span>
        </h6>
        <div
          className={cn(
            "px-4 capitalize md:px-12 py-1 rounded-lg text-zinc-800 text-sm md:text-base font-medium w-fit",
            getStatusStyles(vente.status)
          )}
        >
          {vente.status}
        </div>
      </div>

      <div className="flex items-center justify-start px-1 py-2 space-x-2 rounded-xl h-fit bg-muted/60">
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} variant="ghost">
              <PlusIcon className="w-4 h-4 mr-0.5" />
              <span>{vente?.note ? "Edit Note" : "Add Note"}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {vente?.note ? "Edit Note" : "Add Note"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 "
              >
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          value={field.value}
                          placeholder="Write your note here about this vente..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="px-3">
                    Save note
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog> */}
        {/* <Separator orientation="vertical" className="w-[0.4px] h-7" />
        <Link to={`/vente/edit/${id}`}>
          <Button variant="ghost">
            <EditIcon className="w-4 h-4 mr-0.5" />
            <span>Edit vente</span>
          </Button>
        </Link> */}
        {/* <Separator orientation="vertical" className="w-[0.4px] h-7" />
        <Button variant="ghost">
          <SendIcon className="w-4 h-4 mr-0.5" />
          <span>Send vente</span>
        </Button> */}
        {/* <Separator orientation="vertical" className="w-[0.4px] h-7" /> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost">
              <PrinterIcon className="w-4 h-4 mr-0.5" />
              <span>Print</span>
              <ChevronDownIcon className="h-5 w-5 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to={`/vente/print/bdc/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Bon de Commande
              </DropdownMenuItem>
            </Link>
            <Link to={`/vente/print/ticket/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Ticket
              </DropdownMenuItem>
            </Link>
            <Link to={`/vente/print/facture/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Facture
              </DropdownMenuItem>
            </Link>
            <Link to={`/vente/print/bdl/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Bon de Livraison
              </DropdownMenuItem>
            </Link>
            <Link to={`/vente/print/devis/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Devis
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="w-[0.4px] h-7" />

        <Button onClick={handleDeleteVente} variant="ghost">
          <Trash2Icon className="w-4 h-4 mr-0.5" />
          <span>Delete</span>
        </Button>
      </div>

      <div className="w-full mt-6">
        <h4 className="text-2xl font-medium">Summary</h4>
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full mt-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col w-full mb-8 space-y-4 lg:mb-0">
              <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-4 justify-items-start">
                {detailsVente.map((item, index) => (
                  <React.Fragment key={index}>
                    <h6 className="text-sm font-medium md:text-base whitespace-nowrap text-muted-foreground">
                      {item.label}
                    </h6>
                    <div
                      className={cn(
                        "text-sm md:text-base capitalize",
                        item.className
                      )}
                    >
                      {item.value || ""}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full mt-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col w-full mb-8 space-y-4 lg:mb-0">
              <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-4 justify-items-start">
                {detailsClient.map((item, index) => (
                  <React.Fragment key={index}>
                    <h6 className="text-sm font-medium md:text-base whitespace-nowrap text-muted-foreground">
                      {item.label}
                    </h6>
                    <div
                      className={cn("text-sm md:text-base ", item.className)}
                    >
                      {item.value || ""}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mt-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col w-full mb-8 space-y-4 lg:mb-0">
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-4 justify-items-start">
              <h6 className="text-sm font-medium md:text-base whitespace-nowrap text-muted-foreground">
                Note
              </h6>
              <div className={cn("text-sm md:text-base ")}>
                {vente.note || ""}
              </div>
            </div>
          </div>
        </div>
        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="bg-muted/75">
              <th className="px-4 py-2 font-normal text-left">Product</th>
              <th className="px-4 py-2 font-normal text-left">Price HT</th>
              <th className="px-4 py-2 font-normal text-left">QTY</th>
              <th className="px-4 py-2 font-normal text-right">Unit Price</th>
              <th className="px-4 py-2 font-normal text-right">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {vente?.items?.map((item, index) => (
              <tr
                key={item.designation}
                className={cn("border-b", index % 2 !== 0 ? "bg-muted/30" : "")}
              >
                <td className="px-4 py-2 text-left truncate">
                  {item?.designation || ""}
                </td>
                <td className="px-4 py-2 text-left">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(item.price + item.price * 0.19)}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(
                    (item.price + item.price * 0.19) * item.quantity
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-muted-foreground">
              <td colSpan={4} className="px-4 py-2 text-right">
                Livraison
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(vente.livraison)}
              </td>
            </tr>
            <tr className="font-medium text-muted-foreground">
              <td colSpan={4} className="px-4 py-2 text-right">
                Timber
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(advancedData.timber)}
              </td>
            </tr>
            <tr className="font-medium">
              <td colSpan={4} className="px-4 py-2 text-right">
                Total TTC
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(vente.totalTTC)}
              </td>
            </tr>
            <tr className="font-medium text-muted-foreground">
              <td colSpan={4} className="px-4 py-2 text-right">
                Discount
              </td>

              <td className="px-4 py-2 text-right">
                {vente.productsDiscount
                  ? formatCurrency(vente.productsDiscount)
                  : "-"}
              </td>
            </tr>
            <tr className="font-medium text-muted-foreground">
              <td colSpan={4} className="px-4 py-2 text-right">
                Promo Code{" "}
                {vente.promoCode && `${vente.promoCode.discount * 100}%`}
              </td>

              <td className="px-4 py-2 text-right">
                {vente.discount ? formatCurrency(vente.discount) : "-"}
              </td>
            </tr>

            <tr className="font-medium">
              <td colSpan={4} className="px-4 py-2 text-right">
                Net A Payee
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(vente.netAPayer)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Separator className="mt-6" />
      <div className="mt-4">
        <div className="">
          <h5 className="mb-4 text-xl font-medium">Log Activity</h5>
          <div className="flex items-center justify-between w-fit">
            <div className="p-1 mr-6 rounded-full bg-green-300/80 w-fit">
              <MailIcon
                className="text-slate-700/80"
                size={24}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h6 className="text-sm font-medium">
                vente was sent to{" "}
                <span className="text-blue-500">{vente?.client?.email}</span>
              </h6>
              <p className="text-sm text-muted-foreground">
                23 JAN, 2025, 10:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenteView;
