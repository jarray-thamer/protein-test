import { columns } from "@/components/dataTables/promoCode/column";
import { DataTableRowActionsPromoCode } from "@/components/dataTables/promoCode/rowAction";
import { DataTableToolbar } from "@/components/dataTables/promoCode/toolbar";
import { DataTable } from "@/components/dataTables/shared/dataTable";
import { getAllPromoCode } from "@/helpers/promoCode/communicator";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const PromoCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState([]);

  const fetchPromoCode = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllPromoCode();

      setPromoCodes(response);
    } catch (error) {
      console.error("Error fetching packs:", error);
      toast.error("Failed to fetch packs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCode();
  }, [fetchPromoCode]);
  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          This is the list of the PromoCode available in the store
        </p>
      </div>
      <DataTable
        data={promoCodes}
        columns={columns}
        isLoading={isLoading}
        refresh={fetchPromoCode}
        actionComponents={DataTableRowActionsPromoCode}
        actionColumnId={"PromoCodeActions"}
        dataTableToolbar={(table) => (
          <DataTableToolbar table={table} refresh={fetchPromoCode} />
        )}
      />
    </div>
  );
};
