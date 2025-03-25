"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function DesktopCategoryMenu({ categories = [], className }) {
  const router = useRouter();

  return (
    <NavigationMenu className={cn("hidden lg:flex", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="uppercase">
            Boutique
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((category) => (
                <li key={category._id} className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href={
                        category.slug
                          ? `/products/${category.slug}`
                          : `/products?category=${category._id}`
                      }
                      className="flex flex-col justify-end w-full h-full p-4 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    >
                      <div className="mt-4 mb-2 text-sm font-medium uppercase">
                        {category.designation}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.subCategories.length} subcategories
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/products?promo=true" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + " uppercase"}
            >
              Promotion
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/#nos-marques" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + " uppercase"}
            >
              Marques
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/packs" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + " uppercase"}
            >
              Packs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact-us" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + " uppercase"}
            >
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
