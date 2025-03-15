import {
  BookImageIcon,
  BookTextIcon,
  LayersIcon,
  MailsIcon,
  Package2Icon,
  Settings2,
  ShoppingBagIcon,
  UsersRoundIcon,
} from "lucide-react";

export const SIDEBAR_ITEMS = {
  user: {
    name: "walid",
    email: "walid1sobitas@gmail.com",
    avatar: "/logo.png",
  },
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Package2Icon,
      isActive: true,
      items: [
        {
          title: "Packs",
          url: "/inventory/packs",
        },
        {
          title: "Products",
          url: "/inventory/products",
        },
        {
          title: "Promo Codes",
          url: "/inventory/promo-codes",
        },
      ],
    },
    {
      title: "Ventes",
      url: "/vente",
      icon: ShoppingBagIcon,
    },
    {
      title: "clients",
      url: "/clients",
      icon: UsersRoundIcon,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: LayersIcon,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookTextIcon,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MailsIcon,
    },
    {
      title: "Website Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Advanced",
          url: "/settings/advanced",
        },
      ],
    },
    {
      title: "Media Settings",
      url: "/media",
      icon: BookImageIcon,
      items: [
        {
          title: "Slides",
          url: "/media-settings/slides",
        },
        {
          title: "Material",
          url: "/media-settings/materiel-image",
        },
        {
          title: "Marque",
          url: "/media-settings/marque",
        },
      ],
    },
  ],
};
