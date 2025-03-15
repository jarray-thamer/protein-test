import { XIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featureOptions, inStock, publicOptions } from "./options";
import { DataTableFacetedFilter } from "../shared/facetedFilter";
import { DataTableViewOptions } from "../shared/viewOptions";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/helpers/categories/communicator";
import { handleDeleteManyProducts } from "@/functions/products";

export function DataTableToolbar({ table, refresh }) {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const isFiltered = table.getState().columnFilters.length > 0;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        // Transform categories to match the expected format
        const transformedCategories = response.data.map((category) => ({
          label: category.designation, // Optional: for display
          value: category.designation, // Using designation as the value
        }));
        setCategoryOptions(transformedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
            options={featureOptions}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            title="Status"
            column={table.getColumn("status")}
            options={publicOptions}
          />
        )}
        {table.getColumn("category.designation") && (
          <DataTableFacetedFilter
            title="Category"
            column={table.getColumn("category.designation")}
            options={categoryOptions}
          />
        )}
        {table.getColumn("inStock") && (
          <DataTableFacetedFilter
            title="Stock"
            column={table.getColumn("inStock")}
            options={inStock}
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
              handleDeleteManyProducts(
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
          <Link to="new">Ajouter Produit</Link>
        </Button>
      </div>
    </div>
  );
}
