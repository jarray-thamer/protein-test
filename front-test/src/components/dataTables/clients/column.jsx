import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../shared/columnHeader";
import { DataTableRowActionsClient } from "./rowAction";
import { formatDate } from "@/lib/formattedData";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "phones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Numbers" />
    ),
    accessorFn: (row) => `${row.phone1 || ""} ${row.phone2 || ""}`,
    cell: ({ row }) => {
      const phone1 = row.original.phone1;
      const phone2 = row.original.phone2;

      if (phone1 && !phone2) {
        return <div className="text-sm">{phone1}</div>;
      }

      return (
        <div className="space-y-1">
          <div className="text-sm">
            {phone1 && (
              <>
                <span className="font-medium">phone1: </span>
                {phone1}
              </>
            )}
          </div>
          {phone2 && (
            <div className="text-sm">
              <span className="font-medium">phone2: </span>
              {phone2}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return (rowA.original.phone1 || "").localeCompare(
        rowB.original.phone1 || ""
      );
    },
    filterFn: (row, id, filterValue) => {
      const searchTerm = filterValue.toLowerCase();
      const phone1 = (row.original.phone1 || "").toLowerCase();
      const phone2 = (row.original.phone2 || "").toLowerCase();

      return phone1.includes(searchTerm) || phone2.includes(searchTerm);
    },
  },

  {
    accessorKey: "ville",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ville" />
    ),
    cell: ({ row }) => <div>{row.original.ville}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "isGuest",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => <div>{row.original.isGuest ? "Guest" : "Account"}</div>,
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "subscriber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Subscribe" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.subscriber ? (
          <p className="text-green-500">Oui</p>
        ) : (
          <p className="text-red-500">Non</p>
        )}
      </div>
    ),
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    id: "ClientAction",
    cell: ({ row }) => (
      <DataTableRowActionsClient row={row} refresh={refresh} />
    ),
  },
];
