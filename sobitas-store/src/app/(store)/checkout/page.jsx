"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ShieldIcon,
  AlertCircleIcon,
  InfoIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCartStore from "@/store/cart";
import useInformationStore from "@/store/information";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    initializeCart,
    getCartTotal,
    getItemCount,
    getCartTotalWithTVA,
    clearCart,
  } = useCartStore();

  const { information } = useInformationStore();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    city: "",
    address: "",
    postalCode: "",
    note: "",
    promoCode: "",
  });

  // Additional state for checkout
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Initialize cart from localStorage and fetch information on component mount
  useEffect(() => {
    initializeCart();

    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [initializeCart, cart.length, router]);

  // Get TVA rate with fallback to 0 if not available
  const tvaRate = information?.advanced?.tva || 0.19; // Default TVA rate in Tunisia is 19%

  // Shipping cost based on delivery method
  const shippingCosts = {
    standard: information?.advanced?.livraison || 7,
    pickup: 0,
  };

  // Calculate order totals
  const cartSubtotal = getCartTotal();
  const cartTotalWithTVA = getCartTotalWithTVA(tvaRate);

  // Check if eligible for free shipping (300 TND or more)
  const isEligibleForFreeShipping = cartTotalWithTVA >= 300;

  // Calculate shipping cost (free if order is 300 TND or more)
  const shippingCost = isEligibleForFreeShipping
    ? 0
    : shippingCosts[deliveryMethod];

  const tvaTotalAmount = cartTotalWithTVA - cartSubtotal;
  const orderTotal = cartTotalWithTVA + shippingCost - promoDiscount;
  const itemCount = getItemCount();
  // Format price to display with 3 decimal places (Tunisian currency format)
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0,000";
    }
    return Number(price).toFixed(3).replace(".", ",");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Apply promo code
  const handleApplyPromoCode = () => {
    // This is a simple example - in a real app, you'd verify the code with the backend
    if (formData.promoCode === "PROMO10") {
      setPromoDiscount(cartTotalWithTVA * 0.1); // 10% discount
      setPromoCodeApplied(true);
    } else if (formData.promoCode === "BIENVENUE") {
      setPromoDiscount(cartTotalWithTVA * 0.05); // 5% discount
      setPromoCodeApplied(true);
    } else {
      setPromoDiscount(0);
      setPromoCodeApplied(false);
      alert("Code promo invalide");
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Le nom est requis";
    if (!formData.email.trim()) errors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Format d'email invalide";
    if (!formData.phone1.trim())
      errors.phone1 = "Le numéro de téléphone est requis";
    if (!formData.city.trim()) errors.city = "La ville est requise";
    if (!formData.address.trim()) errors.address = "L'adresse est requise";
    if (!agreeToTerms)
      errors.terms = "Vous devez accepter les conditions générales";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentMethodMap = {
        cashOnDelivery: "CASH",
        bankTransfer: "BANK_TRANSFER",
        eddahabia: "EDDAHABIA",
        d17: "D17",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vente/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              type: "Product",
              itemId: item._id, // Ensure cart items have _id from your product data
              designation: item.designation,
              quantity: item.quantity,
              price: item.price,
              oldPrice: item.oldPrice || null,
              variant: item.selectedVariant?.title || "",
            })),
            client: {
              name: formData.name,
              email: formData.email,
              phone1: formData.phone1,
              phone2: formData.phone2,
              address: formData.address,
              ville: formData.city,
              clientNote: formData.note,
            },
            isNewClient: true,
            promoCode: formData.promoCode,
            livraison: shippingCost,
            modePayment: paymentMethodMap[paymentMethod],
            note: formData.note,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      setOrderNumber(data.reference); // Use backend-generated reference
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(
        "Une erreur s'est produite lors de la soumission de votre commande. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order confirmation component
  const OrderConfirmation = () => (
    <div className="p-8 text-center bg-white rounded-lg shadow-sm">
      <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h2 className="mb-2 text-2xl font-bold">Merci pour votre commande!</h2>
      <p className="mb-4 text-gray-600">
        Votre commande #{orderNumber} a été placée avec succès.
      </p>
      <p className="mb-6 text-gray-600">
        Vous recevrez bientôt un email de confirmation avec les détails de votre
        commande.
      </p>
      <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <h3 className="mb-2 font-medium">Détails de livraison</h3>
        <p className="text-sm text-gray-600">
          {deliveryMethod === "standard"
            ? "Livraison standard (3-5 jours ouvrables)"
            : "Retrait en magasin (disponible le lendemain)"}
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
          Retour à l'accueil
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/produits")}
          className="w-full sm:w-auto"
        >
          Continuer vos achats
        </Button>
      </div>
    </div>
  );

  // If order is placed, show confirmation
  if (orderPlaced) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <OrderConfirmation />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold">
        <CreditCardIcon className="text-primary" />
        Finaliser la commande
      </h1>
      {/* Free shipping notification banner when over 300 TND */}
      {isEligibleForFreeShipping ? (
        <div className="flex items-center p-3 mb-6 text-sm text-green-800 rounded-lg bg-green-50">
          <TagIcon className="flex-shrink-0 w-5 h-5 mr-2" />
          <span>
            <strong>Livraison gratuite !</strong> Votre commande est éligible à
            la livraison gratuite.
          </span>
        </div>
      ) : (
        <div className="flex items-center p-3 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50">
          <InfoIcon className="flex-shrink-0 w-5 h-5 mr-2" />
          <span>
            Les commandes de 300 TND ou plus bénéficient de la livraison
            gratuite. Il vous manque {formatPrice(300 - cartTotalWithTVA)} TND
            pour en profiter.
          </span>
        </div>
      )}

      <div className="flex items-center p-3 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50">
        <InfoIcon className="flex-shrink-0 w-5 h-5 mr-2" />
        <span>
          Complétez les informations ci-dessous pour finaliser votre achat.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Customer Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Informations client</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="flex justify-between">
                    <span>Nom complet *</span>
                    {formErrors.name && (
                      <span className="text-sm text-red-500">
                        {formErrors.name}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Entrez votre nom complet"
                    className={formErrors.name ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex justify-between">
                    <span>Adresse email *</span>
                    {formErrors.email && (
                      <span className="text-sm text-red-500">
                        {formErrors.email}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Entrez votre adresse email"
                    className={formErrors.email ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone1" className="flex justify-between">
                    <span>Numéro de téléphone *</span>
                    {formErrors.phone1 && (
                      <span className="text-sm text-red-500">
                        {formErrors.phone1}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="phone1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    placeholder="Entrez votre numéro de téléphone"
                    className={formErrors.phone1 ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone2">
                    Téléphone alternatif (Optionnel)
                  </Label>
                  <Input
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    placeholder="Entrez un numéro de téléphone alternatif"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-medium">
                Informations de livraison
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city" className="flex justify-between">
                    <span>Ville *</span>
                    {formErrors.city && (
                      <span className="text-sm text-red-500">
                        {formErrors.city}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Entrez votre ville"
                    className={formErrors.city ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="flex justify-between">
                    <span>Adresse *</span>
                    {formErrors.address && (
                      <span className="text-sm text-red-500">
                        {formErrors.address}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Entrez votre adresse complète"
                    className={formErrors.address ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Entrez votre code postal"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="note">Notes de commande (Optionnel)</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Instructions spéciales pour la livraison ou la commande"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <h3 className="mb-2 font-medium">Méthode de livraison</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      deliveryMethod === "standard"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setDeliveryMethod("standard")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TruckIcon size={16} />
                      <span className="font-medium">Livraison standard</span>
                    </div>
                    <p className="text-sm text-gray-500">3-5 jours ouvrables</p>
                    <p className="mt-2 text-sm font-medium">
                      {formatPrice(shippingCosts.standard)} TND
                    </p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      deliveryMethod === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setDeliveryMethod("pickup")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCartIcon size={16} />
                      <span className="font-medium">Retrait en magasin</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Disponible le lendemain
                    </p>
                    <p className="mt-2 text-sm font-medium">Gratuit</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Méthode de paiement</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cashOnDelivery"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cashOnDelivery")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon size={16} />
                    <span className="font-medium">Paiement à la livraison</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Payez en espèces lors de la réception
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "bankTransfer"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("bankTransfer")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon size={16} />
                    <span className="font-medium">Virement bancaire</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Les détails seront envoyés par email
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "eddahabia"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("eddahabia")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon size={16} />
                    <span className="font-medium">Carte E-Dinar</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Paiement sécurisé en ligne
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "d17"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("d17")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon size={16} />
                    <span className="font-medium">D17</span>
                  </div>
                  <p className="text-sm text-gray-500">Paiement mobile</p>
                </div>
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Code promo</h2>
              <div className="flex gap-2">
                <Input
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="Entrez un code promo"
                  disabled={promoCodeApplied}
                />
                <Button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={promoCodeApplied || !formData.promoCode}
                  variant={promoCodeApplied ? "outline" : "default"}
                  className={
                    promoCodeApplied ? "border-green-500 text-green-500" : ""
                  }
                >
                  {promoCodeApplied ? "Appliqué" : "Appliquer"}
                </Button>
              </div>
              {promoCodeApplied && (
                <p className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TagIcon size={14} />
                  {formData.promoCode === "PROMO10" ? "10%" : "5%"} de remise
                  appliquée avec succès !
                </p>
              )}
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={setAgreeToTerms}
                  className={formErrors.terms ? "border-red-500" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      formErrors.terms ? "text-red-500" : ""
                    }`}
                  >
                    J'accepte les conditions générales de vente et la politique
                    de confidentialité
                  </Label>
                  {formErrors.terms && (
                    <p className="text-sm text-red-500">{formErrors.terms}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/cart")}
                className="flex items-center gap-1 border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeftIcon size={16} />
                Retour au panier
              </Button>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Passer la commande"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white rounded-lg shadow-sm top-8">
            <h2 className="mb-4 text-lg font-medium">
              Récapitulatif de la commande
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Articles ({itemCount})</span>
                <span className="font-medium">
                  {formatPrice(cartSubtotal)} TND
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>TVA ({(tvaRate * 100).toFixed(1)}%)</span>
                <span className="font-medium">
                  {formatPrice(tvaTotalAmount)} TND
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span className="font-medium">
                  {deliveryMethod === "pickup"
                    ? "Gratuit"
                    : `${formatPrice(shippingCost)} TND`}
                </span>
              </div>

              {promoCodeApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Remise</span>
                  <span className="font-medium">
                    -{formatPrice(promoDiscount)} TND
                  </span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(orderTotal)} TND
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Articles commandés</h3>
              <div className="overflow-y-auto max-h-64">
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <li
                      key={item.slug}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded">
                        <Image
                          src={item.mainImage?.url || "/api/placeholder/64/64"}
                          alt={item.designation}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.designation}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-xs text-gray-500">
                            {item.selectedVariant.title}
                          </p>
                        )}
                        <div className="flex justify-between mt-1 text-sm">
                          <span>
                            {item.quantity} ×{" "}
                            {formatPrice(item.price * (1 + tvaRate))} TND
                          </span>
                          <span className="font-medium">
                            {formatPrice(
                              item.price * item.quantity * (1 + tvaRate)
                            )}{" "}
                            TND
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 mt-6 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldIcon size={16} />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TruckIcon size={16} />
                <span>Livraison dans toute la Tunisie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCardIcon size={16} />
                <span>Plusieurs méthodes de paiement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
