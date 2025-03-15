import { formatDate } from "@/lib/formattedData";
import React from "react";

export const TicketPDF = ({ data, entreprise }) => {
  return (
    <div
      className="w-full border"
      style={{ maxWidth: "8cm", margin: "0 auto" }}
    >
      <div className="flex flex-col items-center w-full p-4 pt-10 bg-white ">
        {/* Logo */}
        <img src={entreprise?.general?.logo?.url || "/logo.webp"} width={180} />
        {/* Entreprise details */}
        <div className="flex flex-col mt-4 text-center">
          <h3 className="text-xl font-semibold underline uppercase decoration-[#FF4000] ">
            Bienvenue chez SOBITAS
          </h3>
          <p className="mt-1 text-sm text-primary">
            Adresse: {entreprise?.general?.contact?.address}
          </p>
          <p className="text-sm text-primary">
            Tel: {entreprise?.general?.contact?.phone} /{" "}
            {entreprise?.general?.contact?.fax}
          </p>
        </div>
        <div className="w-[90%] border-t-[0.5px]  border-black border-dashed mt-8 mb-6 " />
        <p>{formatDate(data?.createdAt)}</p>
        <h6 className="mt-1 text-lg font-semibold">
          Ticket: {data?.reference}
        </h6>
        {/* table */}
        <table className="w-full mt-6">
          <thead>
            <tr className="border-b-[0.5px] text-base  border-black border-dashed">
              <th className="py-2 text-left">Designation</th>
              <th className="text-center">Qte</th>
              <th className="text-center">Totale</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((item, index) => (
              <tr
                key={index}
                className="text-sm border-b-[0.5px]  border-black border-dashed"
              >
                <td className="py-2 text-left">{item?.designation}</td>
                <td className="text-center">{item?.quantity}</td>
                <td className="text-center">
                  {(item?.price * item?.quantity).toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Conclusion  */}
        <div className="flex justify-between w-full mt-8 text-base">
          <p>Total HT</p>
          <p>{data?.totalHT.toFixed(3)}</p>
        </div>
        <div className="flex justify-between w-full mt-0.5 text-base">
          <p>Remise</p>
          <p>{data?.discount.toFixed(3)}</p>
        </div>
        <div className="flex justify-between w-full mt-0.5 text-base">
          <p className="font-semibold ">Totale</p>
          <p className="">{(data?.netAPayer - data?.livraison).toFixed(3)}</p>
        </div>
        {/* footer */}
        <p className="mt-10 mb-3 font-semibold underline decoration-[#FF4000]">
          SOBITAS vous remercie de votre visite
        </p>
        <div className="w-full border-t-[0.5px]  border-black border-dashed  mb-6 " />
        <p className="text-center">
          Notre Site web <br />
          <span className="text-lg font-medium underline underline-offset-2">
            www.protein.tn
          </span>
        </p>
      </div>
    </div>
  );
};
