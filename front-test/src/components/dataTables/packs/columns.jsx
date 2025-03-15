import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../shared/columnHeader";
import { Badge } from "@/components/ui/badge";
import { featureOptions } from "../products/options";
import { DataTableRowActionsPack } from "./rowActions";

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
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize truncate">
        {row.getValue("designation")}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "mainImage.url",
    accessorFn: (row) => row.mainImage?.url || "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Main Image" />
    ),
    cell: ({ row }) => (
      <img
        className="w-[64px] h-[64px] rounded-md object-cover"
        src={row.getValue("mainImage.url")}
        alt={row.getValue("mainImage.url")}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "features",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Afficher en" />
    ),
    cell: ({ row }) => {
      const features = row.getValue("features") || [];
      const labels = features.map(
        (value) => featureOptions.find((f) => f.value === value)?.label || value
      );

      return (
        <div className="flex gap-1 w-[150px] flex-wrap">
          {labels.map((label, i) => (
            <Badge key={i} variant="secondary" className="capitalize">
              {label}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const features = row.getValue(id);
      return value.some((filterValue) => features.includes(filterValue));
    },
    enableColumnFilter: true,
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
            Public
          </div>
        ) : (
          <div className="px-4 py-1 text-red-600 bg-red-500 border border-red-500 rounded-md bg-opacity-20 w-fit h-fit">
            Private
          </div>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price");
      const formattedPrice = new Intl.NumberFormat("fr-TN", {
        style: "currency",
        currency: "TND",
      }).format(price);

      return <div>{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "oldPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Old Price" />
    ),
    cell: ({ row }) => {
      const oldPrice = row.getValue("oldPrice");
      if (!oldPrice) {
        return <span style={{ color: "#a0a0a0" }}></span>; // Placeholder for missing value
      }

      const formattedOldPrice = new Intl.NumberFormat("fr-TN", {
        style: "currency",
        currency: "TND",
      }).format(oldPrice);

      return (
        <div style={{ textDecoration: "line-through", color: "#a0a0a0" }}>
          {formattedOldPrice}
        </div>
      );
    },
  },
  {
    id: "PackActions",
    cell: ({ row }) => <DataTableRowActionsPack row={row} refresh={refresh} />,
  },
];
