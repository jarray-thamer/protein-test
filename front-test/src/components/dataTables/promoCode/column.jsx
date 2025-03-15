import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../shared/columnHeader";
import { DataTableRowActionsPromoCode } from "./rowAction";
import { formatDate, formatDateDays } from "@/lib/formattedData";

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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-sm text-gray-600 truncate">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize truncate">
        {row.getValue("code")}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount (%)" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]  text-sm text-gray-600 truncate">
        {row.getValue("discount") * 100}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="ml-4">
        {row.getValue("status") === true ? (
          <div className="px-4 py-1 text-green-600 bg-green-300 border border-green-500 rounded-md bg-opacity-20 text-primary w-fit h-fit">
            Active
          </div>
        ) : (
          <div className="px-4 py-1 text-red-600 bg-red-500 border border-red-500 rounded-md bg-opacity-20 w-fit h-fit">
            Not Active
          </div>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-sm text-gray-600 truncate">
        {formatDateDays(row.getValue("startDate"))}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-sm text-gray-600 truncate">
        {formatDateDays(row.getValue("endDate"))}
      </div>
    ),
  },
  {
    id: "PromoCodeActions",
    cell: ({ row }) => (
      <DataTableRowActionsPromoCode row={row} refresh={refresh} />
    ),
  },
];
