import { EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "react-router-dom";
import { handleDeleteManyVentes, updateStatus } from "@/functions/vente";

export function DataTableRowActionsVente({ row, refresh }) {
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Edit status</DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() =>
                  updateStatus(row.original._id, "pending", refresh)
                }
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  updateStatus(row.original._id, "processing", refresh)
                }
              >
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStatus(row.original._id, "paid", refresh)}
              >
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  updateStatus(row.original._id, "delivered", refresh)
                }
              >
                Delivered
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  updateStatus(row.original._id, "cancelled", refresh)
                }
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <Link to={`${row.original._id}`}>
          <DropdownMenuItem>View</DropdownMenuItem>
        </Link>
        <Link to={`edit/${row.original._id}`} state={{ BDC: row.original }}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            handleDeleteManyVentes([row], refresh);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
