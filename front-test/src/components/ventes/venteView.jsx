"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/button"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardIcon,
  ClockIcon,
  CreditCardIcon,
  EditIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  PrinterIcon,
  RefreshCwIcon,
  ShoppingBagIcon,
  Trash2Icon,
  TruckIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react"
import { Separator } from "../ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { formatDate } from "@/lib/formattedData"
import { getVenteById } from "@/helpers/vente/communicator"
import { formatCurrency } from "@/lib/formattedCurrency"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getAdvancedData } from "@/helpers/settings/general"
import { handleDeleteManyVentes } from "@/functions/vente"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const FormSchema = z.object({
  note: z.string(),
})

const VenteView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vente, setVente] = useState({})
  const [advancedData, setAdvancedData] = useState({})
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [venteRes, advancedRes] = await Promise.all([getVenteById(id), getAdvancedData()])

        setVente(venteRes.data)
        setAdvancedData(advancedRes)
        form.reset({ note: venteRes.data.note || "" })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load sale details")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: "",
    },
  })

  function onSubmit(data) {
    console.log(data)
    setOpen(false)
  }

  async function handleDeleteVente() {
    try {
      await handleDeleteManyVentes([id])
      navigate("/vente")
    } catch (error) {
      console.error("Error deleting vente:", error)
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    const statusLower = status.toLowerCase()
    let icon = null
    let className = ""

    switch (statusLower) {
      case "pending":
        icon = <ClockIcon className="w-3 h-3 mr-1" />
        className = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        break
      case "paid":
        icon = <CheckCircleIcon className="w-3 h-3 mr-1" />
        className = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        break
      case "cancelled":
        icon = <XCircleIcon className="w-3 h-3 mr-1" />
        className = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        break
      case "processing":
        icon = <RefreshCwIcon className="w-3 h-3 mr-1" />
        className = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        break
      case "delivered":
        icon = <TruckIcon className="w-3 h-3 mr-1" />
        className = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
        break
      default:
        icon = <AlertCircleIcon className="w-3 h-3 mr-1" />
        className = "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }

    return (
      <Badge className={cn("flex items-center gap-1 px-3 py-1", className)}>
        {icon}
        <span className="capitalize">{status}</span>
      </Badge>
    )
  }

  // Get client initials for avatar
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading sale details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 p-6">
        <XCircleIcon className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2">Error Loading Sale</h3>
        <p className="text-muted-foreground text-center">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/vente")}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Sales
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 mx-auto md:p-6 max-w-screen-2xl">
      {/* Header with breadcrumb and actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/vente")} className="h-8 gap-1">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Sales</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <Icon icon="mdi:storefront" width="20" height="20" className="text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Sale Details</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <PrinterIcon className="w-4 h-4" />
                <span>Print</span>
                <ChevronDownIcon className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/vente/print/bdc/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Bon de Commande
                </DropdownMenuItem>
              </Link>
              <Link to={`/vente/print/ticket/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Ticket
                </DropdownMenuItem>
              </Link>
              <Link to={`/vente/print/facture/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Facture
                </DropdownMenuItem>
              </Link>
              <Link to={`/vente/print/bdl/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Bon de Livraison
                </DropdownMenuItem>
              </Link>
              <Link to={`/vente/print/devis/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Devis
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/vente/edit/${id}`)}
          >
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Button>

          <Button variant="destructive" size="sm" className="h-9 gap-1" onClick={handleDeleteVente}>
            <Trash2Icon className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Sale header with reference, status and total */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">Sale Information</CardTitle>
              </div>
              {getStatusBadge(vente.status)}
            </div>
            <CardDescription className="text-sm mt-1">Reference: {vente.reference}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Sale #{vente.reference}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Created: {formatDate(vente.createdAt)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Updated: {formatDate(vente.updatedAt || vente.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(vente.netAPayer || 0)}</div>
                {vente.modePayment && (
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <CreditCardIcon className="w-3 h-3" />
                    <span>{vente.modePayment}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Client</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(vente.client?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{vente.client?.name || "Unnamed Client"}</h3>
                <div className="flex flex-col gap-1 mt-2 text-sm">
                  {vente.client?.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-primary">{vente.client.email}</span>
                    </div>
                  )}
                  {vente.client?.phone1 && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{vente.client.phone1}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(vente.client?.address || vente.client?.ville) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div>{vente.client.address}</div>
                    <div>{vente.client.ville}</div>
                  </div>
                </div>
              </div>
            )}
            {(vente.client?.clientNote ) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-2">
                <ClipboardIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <div>
                    <div>{vente.client.clientNote}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/clients/${vente.client?._id}`)}
            >
              View Client Profile
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="notes">Notes & Activity</TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Purchased Items</CardTitle>
                </div>
                {vente.items?.length > 0 && <Badge variant="outline">{vente.items.length} Items</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/75 text-sm">
                      <th className="px-4 py-3 font-medium text-left">Product</th>
                      <th className="px-4 py-3 font-medium text-left">Price HT</th>
                      <th className="px-4 py-3 font-medium text-center">QTY</th>
                      <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                      <th className="px-4 py-3 font-medium text-right">Total TTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vente?.items?.map((item, index) => (
                      <tr key={index} className={cn("border-b", index % 2 !== 0 ? "bg-muted/30" : "")}>
                        <td className="px-4 py-3 text-left">
                          <div className="flex flex-col">
                            <span className="font-medium">{item?.designation || ""}</span>
                            {item.variant && (
                              <span className="text-xs text-muted-foreground">Variant: {item.variant}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="font-mono">
                            {item.quantity}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.price + item.price * 0.19)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency((item.price + item.price * 0.19) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-3">
                  <h3 className="font-medium">Order Summary</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(vente.totalTTC || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(vente.livraison || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Timber</span>
                      <span>{formatCurrency(advancedData.timber || 0)}</span>
                    </div>

                    {(vente.discount) && (
                      <>
                        {vente.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Discount 
                            </span>
                            <span className="text-red-600">-{vente.discount}</span>
                          </div>
                        )}
                        {vente.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Promo Code {vente.promoCode && `(${vente.promoCode.code })`}
                            </span>
                            <span className="text-red-600">-{vente.promoCode.discount * 100}%</span>
                          </div>
                        )}
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg">{formatCurrency(vente.netAPayer || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClipboardIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Sale Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Sale ID</p>
                    <p className="text-sm font-mono">{vente._id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Reference</p>
                    <p>{vente.reference}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p>{getStatusBadge(vente.status)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <p>{vente.modePayment || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                    <p>{formatDate(vente.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Updated Date</p>
                    <p>{formatDate(vente.updatedAt || vente.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Client Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="capitalize">{vente.client?.name || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-primary">{vente.client?.email || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone 1</p>
                    <p>{vente.client?.phone1 || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone 2</p>
                    <p>{vente.client?.phone2 || "Not specified"}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p>{vente.client?.address || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p>{vente.client?.ville || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {vente.livreur && Object.values(vente.livreur).some((val) => val) && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Delivery Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Delivery Person</p>
                    <p>{vente.livreur?.name || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                    <p>{vente.livreur?.cin || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Vehicle Number</p>
                    <p>{vente.livreur?.carNumber || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notes & Activity Tab */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardIcon className="w-5 h-5 text-primary" />
                    <CardTitle>Notes</CardTitle>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <PlusIcon className="w-4 h-4 mr-1" />
                        {vente?.note ? "Edit Note" : "Add Note"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{vente?.note ? "Edit Note" : "Add Note"}</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    value={field.value}
                                    placeholder="Write your note here about this sale..."
                                    className="resize-none min-h-[120px]"
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
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {vente.note ? (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="whitespace-pre-wrap">{vente.note}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ClipboardIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No notes have been added to this sale</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Activity Log</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <MailIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-sm font-medium">
                        Sale was sent to <span className="text-primary">{vente?.client?.email}</span>
                      </h6>
                      <p className="text-xs text-muted-foreground">23 JAN, 2025, 10:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-sm font-medium">Sale was created</h6>
                      <p className="text-xs text-muted-foreground">{formatDate(vente.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer actions */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t">
        <Button variant="ghost" onClick={() => navigate("/vente")} className="gap-1">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Sales</span>
        </Button>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() => window.open(`/vente/print/facture/${id}`, "_blank")}
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Invoice</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open invoice in new window</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            className="gap-1 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => navigate(`/vente/edit/${id}`)}
          >
            <EditIcon className="w-4 h-4" />
            <span>Edit Sale</span>
          </Button>

          <Button variant="destructive" className="gap-1" onClick={handleDeleteVente}>
            <Trash2Icon className="w-4 h-4" />
            <span>Delete Sale</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VenteView

