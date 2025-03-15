import { columns } from "@/components/dataTables/packs/columns";
import { DataTableToolbar } from "@/components/dataTables/packs/toolbar";
import { DataTableRowActionsPack } from "@/components/dataTables/packs/rowActions";
import { DataTable } from "@/components/dataTables/shared/dataTable";
import { getAllPacks } from "@/helpers/packs/communicator";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const Packs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [packs, setPacks] = useState([]);

  const fetchPacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllPacks();

      setPacks(response);
    } catch (error) {
      console.error("Error fetching packs:", error);
      toast.error("Failed to fetch packs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);
  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          This is the list of the packs available in the store
        </p>
      </div>
      <DataTable
        data={packs}
        columns={columns}
        isLoading={isLoading}
        refresh={fetchPacks}
        actionComponents={DataTableRowActionsPack}
        actionColumnId={"PackActions"}
        dataTableToolbar={(table) => (
          <DataTableToolbar table={table} refresh={fetchPacks} />
        )}
      />
    </div>
  );
};
