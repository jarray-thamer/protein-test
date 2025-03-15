import { columns } from "@/components/dataTables/products/columns";
import { DataTableToolbar } from "@/components/dataTables/products/toolbar";
import { DataTable } from "@/components/dataTables/shared/dataTable";
import { getAllProductsNormal } from "@/helpers/products/communicator";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTableRowActionsProduct } from "@/components/dataTables/products/rowActions";

export const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProductsNormal();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex-col flex-1 w-full h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          This is the list of the products available in the store.
        </p>
      </div>
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        actionComponents={DataTableRowActionsProduct}
        actionColumnId={"ProductActions"}
        refresh={fetchProducts}
        dataTableToolbar={(table) => (
          <DataTableToolbar table={table} refresh={fetchProducts} />
        )}
      />
    </div>
  );
};
