import { EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleDeleteManyProducts } from "@/functions/products";
import { Link } from "react-router-dom";

export function DataTableRowActionsProduct({ row, refresh }) {
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
        <Link to={`edit/${row.original._id}`} state={{ product: row.original }}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            handleDeleteManyProducts([row], refresh);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
