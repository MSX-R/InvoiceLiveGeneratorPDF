import React, { useState, useEffect } from "react";
import CardDataStats from "../../Components/newComponents/CardDataStats";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import DropdownUser from "./DropdownUser";

// NOTE  : SUR CETTE PAGE SERONT AFICHER TOUS LES ECRANS DYNAMIQUES liés à la selection sur sidebar
const user = {
  userName: "Romain MARSALEIX",
  userRole: "Admin du site",
  userPicture: require("../../assets/coach.jpg"), // chemin vers votre image
};

// LEVELUP+ LEVELDOWN- attention et level same =

function SideBarEcranDynamique() {
  // État pour stocker la date et l'heure
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Met à jour l'heure chaque seconde
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  // Formatage de la date et de l'heure
  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "numeric", day: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col w-full gap-28">
      {/* HEADER2 A CREER */}
      <div name="HEADER 2" className="flex justify-between p-4 border-b border-gray-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col justify-end">
          {/* Affichage de la date et de l'heure */}
          <p className="text-md font-semibold">{`${formatDate(currentDateTime)}  -  ${formatTime(currentDateTime)}`}</p>
          {/* Indication du fuseau horaire */}
          <p className="text-xs text-gray-500">Heure de Paris</p>
        </div>

        <DropdownUser user={user} />
      </div>
      {/* Fin du header
       */}

      {/* PAGE DYNAMIQUE LIE AU SIDE BAR MENU*/}
      <div className="flex flex-col p-8 gap-8 ">
        <p className="text-4xl font-bold">Clients</p>
        <div className="flex gap-8 flex-wrap ">
          <CardDataStats title={"RDV Bilan effectués"} total={47} precedent={40} rate={47 - 40} icon={<FaUser />} levelUp Percentage={false} />
          <CardDataStats title={"Clients convertis"} total={9} precedent={8} rate={9 - 8} icon={<FaUserPlus />} levelUp Percentage={false} />
        </div>
        <p className="text-4xl font-bold">Ventes</p>
        <div className="flex gap-8 flex-wrap ">
          <CardDataStats title={"Séance Unique"} total={25} precedent={20} rate={25 - 20} icon={<MdEvent />} levelUp Percentage={false} />
          <CardDataStats title={"Pack de séances"} total={5} precedent={4} rate={5 - 4} icon={<GiArchiveRegister />} levelUp Percentage={false} />
          <CardDataStats title={"Contrat 12 WEEKS"} total={3} precedent={0} rate={3 - 0} icon={<RiFilePaper2Line />} levelUp Percentage={false} />
          <CardDataStats title={"Programme"} total={6} precedent={6} rate={6 - 6} icon={<RiFilePaper2Line />} Percentage={false} />
        </div>
      </div>
    </div>
  );
}

export default SideBarEcranDynamique;
