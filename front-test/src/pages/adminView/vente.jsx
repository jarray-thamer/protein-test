import { columns } from "@/components/dataTables/vente/columns";
import { DataTableToolbar } from "@/components/dataTables/vente/toolbar";
import { DataTable } from "@/components/dataTables/shared/dataTable";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTableRowActionsVente } from "@/components/dataTables/vente/rowActions";
import { getVentes } from "@/helpers/vente/communicator";

const Vente = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [vente, setVente] = useState([]);

  const fetchVentes = useCallback(async () => {
    try {
      const response = await getVentes();
      setVente(response?.data);
    } catch (error) {
      console.error("Error fetching Ventes:", error);
      toast.error("Failed to fetch Ventes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentes();
  }, [fetchVentes]);

  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          This is the list of the Ventes available in the store.
        </p>
      </div>
      <DataTable
        data={vente}
        columns={columns}
        isLoading={isLoading}
        actionComponents={DataTableRowActionsVente}
        refresh={fetchVentes}
        actionColumnId={"VenteActions"}
        dataTableToolbar={(table) => (
          <DataTableToolbar table={table} refresh={fetchVentes} />
        )}
      />
    </div>
  );
};

export default Vente;
