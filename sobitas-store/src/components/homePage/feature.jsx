import {
  HandCoinsIcon,
  HeadsetIcon,
  HeartHandshakeIcon,
  TruckIcon,
} from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";

const Feature = () => {
  return (
    <div className="flex flex-col flex-wrap justify-around px-4 mx-auto cursor-default gap-y-6 md:flex-row max-w-screen-2xl">
      <Separator className="my-4" />
      <FeatureCard
        title="LIVRASION rapide"
        description="Expédition en 48h chrono !"
        icon={<TruckIcon className="w-8 h-8 my-auto text-black3" />}
      />
      <FeatureCard
        title="COD Service"
        description="Service de paiement à la livraison disponible !"
        icon={<HandCoinsIcon className="w-8 h-8 my-auto text-black3" />}
      />
      <FeatureCard
        title="produits Certifiés"
        description="Certifié par le minstére de santé"
        icon={<HeartHandshakeIcon className="w-8 h-8 my-auto text-black3" />}
      />
      <FeatureCard
        title="Nous sommes ici pour vous aider !"
        description="73 200 169 - 27 612 500"
        icon={<HeadsetIcon className="w-8 h-8 my-auto text-black3" />}
      />
      <Separator className="my-4" />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex transition-all duration-300 ease-out gap-x-3 hover:scale-110">
      {icon}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold capitalize text-black3">
          {title.toLowerCase()}
        </h3>
        <p className="font-light text-[#777777]">{description}</p>
      </div>
    </div>
  );
};

export default Feature;
