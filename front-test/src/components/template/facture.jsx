import { formatCurrency } from "@/lib/formattedCurrency";
import { formatDate } from "@/lib/formattedData";
import React from "react";
import writtenNumber from "written-number";

const FacturePDF = ({ data, entreprise }) => {
  writtenNumber.defaults.lang = "fr";
  return (
    <div
      className="w-full border"
      style={{ maxWidth: "210mm", margin: "0 auto" }}
    >
      <div>
        <div className="flex flex-col p-6 bg-white rounded-xl ">
          <div className="flex justify-between">
            <div>
              <img
                src={entreprise?.general?.logo?.url || "/logo.webp"}
                width={180}
              />
            </div>

            <div className="text-end">
              <h2 className="text-3xl font-semibold text-gray-800 underline decoration-[#FF4000]">
                Facture{" "}
              </h2>
              <span className="block mt-1 text-gray-500 ">
                {data?.reference}
              </span>

              <address className="mt-4 not-italic text-gray-800 ">
                {entreprise?.general?.contact.address}
                <br />
                {entreprise?.advanced?.matricule}
                <br />
                {entreprise?.advanced?.registerDeCommerce}
                <br />
                {entreprise?.general?.contact.email}
                <br />
              </address>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3 mt-8 ">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 capitalize ">
                Information du Client:
              </h3>
              <h3 className="text-base text-gray-800 ">{data?.client?.name}</h3>
              <h3 className="text-base text-gray-500 ">
                {data?.client?.phone1}{" "}
                {data?.client?.phone2 && "- " + data?.client?.phone2}
              </h3>
              <address className="not-italic text-gray-500 ">
                {data?.client?.ville}
                <br />
                {data?.client?.address}
                <br />
              </address>
            </div>

            <div className="space-y-2 sm:text-end">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 ">
                <dl className="">
                  <dt className="col-span-3 font-semibold text-gray-800 ">
                    Date du Facture:
                  </dt>
                  <dd className="col-span-2 text-gray-500 ">
                    {formatDate(data?.createdAt)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border border-gray-300">
                    Produit
                  </th>
                  <th className="w-20 p-2 text-center border border-gray-300">
                    Quantité
                  </th>
                  <th className="w-32 p-2 text-right border border-gray-300">
                    P.U.HT
                  </th>
                  <th className="w-32 p-2 text-right border border-gray-300">
                    Tva
                  </th>
                  <th className="w-32 p-2 text-right border border-gray-300">
                    Totale HT
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 border border-gray-300">
                      {item.designation}
                    </td>
                    <td className="p-2 text-center border border-gray-300">
                      {item.quantity}
                    </td>
                    <td className="p-2 text-right border border-gray-300">
                      {item.price.toFixed(3)} DT
                    </td>
                    <td className="p-2 text-right border border-gray-300">
                      {entreprise?.advanced?.tva * 100} %
                    </td>
                    <td className="p-2 text-right border border-gray-300">
                      {(item.price * item.quantity).toFixed(3)} DT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex mt-8 sm:justify-end">
            <div className="w-full max-w-2xl space-y-2 sm:text-end">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
                {[
                  { label: "Total HT:", value: data?.totalHT.toFixed(3) },
                  { label: "TVA:", value: data?.tva.toFixed(3) },
                  { label: "Remise:", value: data?.discount.toFixed(3) },
                  {
                    label: "Livraison:",
                    value:
                      data.livraison.toFixed(3) ||
                      entreprise?.advanced.livraison.toFixed(3) ||
                      0,
                  },
                  {
                    label: "Timbre:",
                    value: entreprise?.advanced.timber.toFixed(3),
                  },
                  { label: "Totale TTC:", value: data?.netAPayer.toFixed(3) },
                ].map((item, index) => (
                  <dl key={index} className="grid sm:grid-cols-5 gap-x-12">
                    <dt className="col-span-4 font-semibold text-gray-800 ">
                      {item.label}
                    </dt>
                    <dd className="col-span-1 text-gray-500 ">
                      {formatCurrency(item.value)}
                    </dd>
                  </dl>
                ))}
              </div>
            </div>
          </div>
          <h3 className="mt-12">
            <span className="font-semibold">
              {" "}
              Arréte la présente bond de commande a la somme de:
            </span>{" "}
            {writtenNumber(data?.netAPayer)}
          </h3>
          <div className="mt-3 ">
            <h4 className="text-lg font-semibold text-gray-800 ">Merci!</h4>
            <p className="text-gray-500 underline decoration-[#FF4000]">
              Si vous avez des questions concernant cette facture, veuillez
              utiliser les coordonnées suivantes :
            </p>
            <div className="mt-2">
              <p className="block text-sm font-medium text-gray-800 ">
                {entreprise?.general?.contact.phone}
              </p>
              <p className="block text-sm font-medium text-gray-800 ">
                {entreprise?.general?.contact.fax}
              </p>
              <p className="block text-sm font-medium text-gray-800 ">
                www.protein.tn
              </p>
              <p className="block text-sm font-medium text-gray-800 ">
                Bank UIB RIB : {entreprise?.advanced?.rib}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500 ">
            © {new Date().getFullYear()} Sobitas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacturePDF;
