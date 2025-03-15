import React from "react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../darkModeToggle";
import { logoutUser } from "@/helpers/auth/communicator";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 flex justify-between flex-1 w-full p-2 border-b bg-sidebar border-muted">
      <SidebarTrigger />
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button onClick={logoutUser}>Logout</Button>
      </div>
    </div>
  );
};
