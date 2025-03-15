import { XIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "../shared/facetedFilter";
import { DataTableViewOptions } from "../shared/viewOptions";
import { Link } from "react-router-dom";
import { publicOptions } from "../products/options";
import { handleDeleteManyPacks } from "@/functions/packs";
import { packOptions } from "./options";

export function DataTableToolbar({ table, refresh }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-wrap items-center flex-1 gap-2">
        <Input
          placeholder="Filter designation..."
          value={table.getColumn("designation")?.getFilterValue() ?? ""}
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            table.getColumn("designation")?.setFilterValue(event.target.value);
          }}
        />
        {table.getColumn("features") && (
          <DataTableFacetedFilter
            title="Afficher en"
            column={table.getColumn("features")}
            options={packOptions}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            title="Status"
            column={table.getColumn("status")}
            options={publicOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button
            onClick={() => {
              handleDeleteManyPacks(
                table.getFilteredSelectedRowModel().rows,
                refresh
              );
            }}
            variant="outline"
            size="sm"
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
        <Button size="sm">
          <Link to="new">Ajouter Pack</Link>
        </Button>
      </div>
    </div>
  );
}
