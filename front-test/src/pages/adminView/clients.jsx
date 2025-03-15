import { columns } from "@/components/dataTables/clients/column";
import { DataTableRowActionsClient } from "@/components/dataTables/clients/rowAction";
import { DataTableToolbar } from "@/components/dataTables/clients/toolbar";
import { DataTable } from "@/components/dataTables/shared/dataTable";
import { getAllClients } from "@/helpers/clients/communication";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const Clients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllClients();

      setClients(response?.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          This is the list of the Clients available in the store
        </p>
      </div>
      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        actionComponents={DataTableRowActionsClient}
        refresh={fetchClients}
        actionColumnId={"ClientAction"}
        dataTableToolbar={(table) => (
          <DataTableToolbar table={table} refresh={fetchClients} />
        )}
      />
    </div>
  );
};

export default Clients;
