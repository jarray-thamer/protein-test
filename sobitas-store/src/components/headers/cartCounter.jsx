"use client";
import Link from "next/link";
import { ShoppingCartIcon, XIcon } from "lucide-react";
import FlyoutLink from "@/components/shared/flyoutLink";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import useStoreCart from "@/store/cart";
import { formatCurrency } from "@/lib/formattedPrice";
import useInformationStore from "@/store/information";

const CartCounter = () => {
  const { cart } = useStoreCart();
  return (
    <FlyoutLink FlyoutContent={cartCounterContent}>
      <Link href="/cart" className="flex items-center justify-center">
        <ShoppingCartIcon
          className="mr-[.3rem] ml-2 lg:ml-[1.8rem]"
          strokeWidth={1.8}
          size={24}
        />
        {cart && (
          <span className="bg-primary flex items-center justify-center rounded-[50%] min-w-5 h-5 font-normal text-[10px] text-white">
            {cart.length}
          </span>
        )}
      </Link>
    </FlyoutLink>
  );
};

const cartCounterContent = () => {
  const { cart, removeFromCart } = useStoreCart();
  const { information } = useInformationStore();

  // Calculate total price
  const totalPrice = cart.reduce((sum, product) => {
    return (
      sum +
      (product.price + product.price * information?.advanced?.tva) *
        product.quantity
    );
  }, 0);

  return (
    <div className="flex flex-col w-full h-full">
      {/*cart product list*/}
      <div className="p-6">
        {cart.map((product, index) => {
          return (
            <div key={index} className="my-1">
              <div className="flex text-[13px] gap-2">
                <div className="flex flex-col w-full text-wrap">
                  <h6 className="text-[#666666] hover:text-primary cursor-pointer">
                    {product.designation}
                  </h6>
                  <p className="text-[#999999]  my-2">
                    {product.quantity}x{" "}
                    {formatCurrency(product.price + product.price * 0.19)}
                  </p>
                </div>
                <div className="flex items-center justify-end w-full">
                  <Image
                    src={product.mainImage.url}
                    alt={"productImage"}
                    width={60}
                    height={60}
                  />
                  <XIcon
                    strokeWidth={1.8}
                    size={16}
                    color="#999999"
                    className="ml-2 cursor-pointer"
                    onClick={() => removeFromCart(product.slug)}
                  />
                </div>
              </div>
              <Separator />
            </div>
          );
        })}

        {/* 🔥 Dynamic Total Price */}
        <div className="text-[#666666] py-4 font-medium text-sm uppercase flex justify-between items-center">
          <h4>TOTAL</h4>
          <h4>{formatCurrency(totalPrice)}</h4>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="bg-primary text-white py-[7.5px] px-4 text-[13px] hover:text-white hover:bg-[#6666FF] transition-all duration-300 ease-in-out"
          >
            View Cart
          </Link>
          <Link
            href="/cart"
            className="border border-primary text-primary py-[7.5px] px-4 text-[13px] hover:text-white hover:bg-primary transition-all duration-300 ease-in-out"
          >
            Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartCounter;
