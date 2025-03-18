import React from "react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../darkModeToggle";
import Cookies from "js-cookie";
import { useAuth } from "@/context/authContext";

export const Header = () => {
  const { logout } = useAuth();
  const token = Cookies.get("admin-auth-token");

  return (
    <div className="sticky top-0 z-50 flex justify-between flex-1 w-full p-2 border-b bg-sidebar border-muted">
      <SidebarTrigger />
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button onClick={() => logout(token)}>Logout</Button>
      </div>
    </div>
  );
};
