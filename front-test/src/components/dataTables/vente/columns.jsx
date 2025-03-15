import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../shared/columnHeader";

import { formatDate } from "@/lib/formattedData";
import { DataTableRowActionsVente } from "./rowActions";

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
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => <div>{row.getValue("reference")}</div>,
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "client.name",
    accessorFn: (row) => row.client?.name || "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("client.name")}</div>
    ),
  },
  {
    id: "phones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Numbers" />
    ),
    accessorFn: (row) =>
      `${row.client.phone1 || ""} ${row.client.phone2 || ""}`,
    cell: ({ row }) => {
      const phone1 = row.original.client.phone1;
      const phone2 = row.original.client.phone2;

      if (phone1 && !phone2) {
        return <div className="text-sm">{phone1}</div>;
      }

      return (
        <div className="space-y-1">
          <div className="text-sm">
            {phone1 && (
              <>
                <span className="font-medium">Primary: </span>
                {phone1}
              </>
            )}
          </div>
          {phone2 && (
            <div className="text-sm">
              <span className="font-medium">Secondary: </span>
              {phone2}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return (rowA.original.client.phone1 || "").localeCompare(
        rowB.original.client.phone1 || ""
      );
    },
    filterFn: (row, id, filterValue) => {
      const searchTerm = filterValue.toLowerCase();
      const phone1 = (row.original.client.phone1 || "").toLowerCase();
      const phone2 = (row.original.client.phone2 || "").toLowerCase();

      return phone1.includes(searchTerm) || phone2.includes(searchTerm);
    },
  },
  {
    accessorKey: "netAPayer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net A Payer" />
    ),
    cell: ({ row }) => {
      const netAPayer = row.getValue("netAPayer");
      const formattedNetAPayer = new Intl.NumberFormat("fr-TN", {
        style: "currency",
        currency: "TND",
      }).format(netAPayer);

      return <div>{formattedNetAPayer}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
          case "pending":
            return "text-yellow-600 bg-yellow-100 border-yellow-500";
          case "paid":
            return "text-green-600 bg-green-100 border-green-500";
          case "cancelled":
            return "text-red-600 bg-red-100 border-red-500";
          case "processing":
            return "text-blue-600 bg-blue-100 border-blue-500";
          case "delivered":
            return "text-emerald-600 bg-emerald-100 border-emerald-500";
          default:
            return "text-gray-600 bg-gray-100 border-gray-500";
        }
      };
      return (
        <div className="ml-4">
          <div
            className={`px-4 py-1 border rounded-md bg-opacity-20 w-fit h-fit capitalize ${getStatusStyles(
              row.getValue("status")
            )}`}
          >
            {row.getValue("status")}
          </div>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    id: "VenteActions",
    cell: ({ row }) => <DataTableRowActionsVente row={row} refresh={refresh} />,
  },
];
