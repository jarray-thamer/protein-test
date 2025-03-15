import { EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "react-router-dom";
import { handleDeleteManyPacks } from "@/functions/packs";

export function DataTableRowActionsPack({ row, refresh }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 data-[state=open]:bg-muted"
        >
          <EllipsisIcon className="w-4 h-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160ox]">
        <Link to={`${row.original._id}`}>
          <DropdownMenuItem>View</DropdownMenuItem>
        </Link>
        <Link to={`edit/${row.original._id}`} state={{ pack: row.original }}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            handleDeleteManyPacks([row], refresh);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
