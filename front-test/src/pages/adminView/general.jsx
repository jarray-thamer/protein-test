import GeneralSettingForm from "@/components/forms/generalSettingForm";
import { getGeneralData } from "@/helpers/settings/general";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const General = () => {
  const [generalData, setGeneralData] = useState();

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const res = await getGeneralData();

        setGeneralData(res);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch general data");
      }
    };
    fetchGeneralData();
  }, []);
  return (
    <div>{generalData && <GeneralSettingForm generalData={generalData} />}</div>
  );
};

export default General;
