import { AdvancedSettingForm } from "@/components/forms/advancedSettingForm";
import { getAdvancedData } from "@/helpers/settings/general";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Advanced = () => {
  const [advancedData, setAdvancedData] = useState();

  useEffect(() => {
    const fetchAdvancedData = async () => {
      try {
        const res = await getAdvancedData();

        setAdvancedData(res);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch general data");
      }
    };
    fetchAdvancedData();
  }, []);
  return (
    <div>
      {advancedData && <AdvancedSettingForm advancedData={advancedData} />}
    </div>
  );
};

export default Advanced;
