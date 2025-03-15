import { Outlet } from "react-router-dom";
import React from "react";
import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { Toaster } from "sonner";

export const DashboardLayout = () => {
  const defaultOpen = Cookies.get("sidebar:state") === "true";

  return (
    <div className="flex w-full min-h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div className="w-full">
          <Header />
          <Outlet />
          <Toaster richColors />
        </div>
      </SidebarProvider>
    </div>
  );
};
