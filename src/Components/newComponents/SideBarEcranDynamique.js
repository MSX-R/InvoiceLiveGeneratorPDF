import React from "react";
import CardDataStats from "../../Components/newComponents/CardDataStats";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import Header from "../Header";
import DropdownUser from "./DropdownUser";

// NOTE  : SUR CETTE PAGE SERONT AFICHER TOUS LES ECRANS DYNAMIQUES liés à la selection sur sidebar
const user = {
  userName: "Romain MARSALEIX",
  userRole: "Admin du site",
  userPicture: require("../../assets/coach.jpg"), // chemin vers votre image
};

// LEVELUP+ LEVELDOWN- attention et level same =

function SideBarEcranDynamique() {
  return (
    <div className="flex flex-col w-full">
      {/* HEADER2 A CREER */}
      <div name="HEADER 2" className="flex justify-between p-4 border-b border-gray-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div></div>
        <DropdownUser user={user} />
        {/* INTEGRER ICI */}
      </div>

      {/* PAGE DYNAMIQUE LIE AU SIDE BAR MENU*/}
      <div className="flex  flex-col p-8 space-y-8 ">
        <p className="text-3xl">Clients</p>
        <div className="flex gap-8 flex-wrap ">
          <CardDataStats title={"RDV Bilan effectués"} total={47} precedent={40} rate={47 - 40} icon={<FaUser />} levelUp Percentage={false} />
          <CardDataStats title={"Clients convertis"} total={9} precedent={8} rate={9 - 8} icon={<FaUserPlus />} levelUp Percentage={false} />
        </div>{" "}
        <p className="text-3xl">Ventes</p>
        <div className="flex gap-8 flex-wrap ">
          <CardDataStats title={"Séance Unique"} total={25} precedent={20} rate={25 - 20} icon={<MdEvent />} levelUp Percentage={false} />
          <CardDataStats title={"Pack de séances"} total={5} precedent={4} rate={5 - 4} icon={<GiArchiveRegister />} levelUp Percentage={false} />
          <CardDataStats title={"Contrat 12 WEEKS"} total={3} precedent={0} rate={3 - 0} icon={<RiFilePaper2Line />} levelUp Percentage={false} />
          <CardDataStats title={"Programme"} total={6} precedent={6} rate={6 - 6} icon={<RiFilePaper2Line />} Percentage={false} />
        </div>{" "}
      </div>
    </div>
  );
}

export default SideBarEcranDynamique;
