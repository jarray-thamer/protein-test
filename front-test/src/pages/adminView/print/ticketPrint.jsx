import FacturePDF from "@/components/template/facture";
import { TicketPDF } from "@/components/template/ticket";
import { Button } from "@/components/ui/button";
import { getAdvancedData, getGeneralData } from "@/helpers/settings/general";
import { getVenteById } from "@/helpers/vente/communicator";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const TicketPrint = () => {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getVenteById(id);
        const advancedData = await getAdvancedData();
        const generalData = await getGeneralData();

        // Combine enterprise data
        const enterpriseInfo = {
          general: { ...generalData },
          advanced: { ...advancedData },
        };

        setEntreprise(enterpriseInfo);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="p-4 mx-auto max-w-screen-2xl">
      <Button
        onClick={() => reactToPrintFn()}
        className="mb-4"
        disabled={loading}
      >
        Imprimer le Ticket
      </Button>

      {/* For debugging purposes */}
      <div className="mb-4">
        {loading ? (
          "Chargement des données..."
        ) : !data || !entreprise ? (
          <p className="text-destructive">Données non disponibles</p>
        ) : (
          <p className="text-green-500">Données chargées avec succès</p>
        )}
      </div>

      <div
        ref={contentRef}
        style={{
          width: "8cm",
          background: "white",
          // Display block ensures the element is visible
          display: "block",
        }}
      >
        {loading ? (
          <div style={{ padding: "20px" }}>Chargement...</div>
        ) : (
          <TicketPDF data={data} entreprise={entreprise} />
        )}
      </div>
    </div>
  );
};

export default TicketPrint;
