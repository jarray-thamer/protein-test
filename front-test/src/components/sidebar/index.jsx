import { SIDEBAR_ITEMS } from "@/constants/sidebarItems";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { NavMain } from "./navMain";
import { Link } from "react-router-dom";

export const AppSidebar = ({ ...props }) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          className="text-2xl font-bold tracking-wide cursor-pointer select-none"
          to="/dashboard"
        >
          SOBITAS
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_ITEMS.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        Hello {SIDEBAR_ITEMS.user.name}
      </SidebarFooter>
    </Sidebar>
  );
};
