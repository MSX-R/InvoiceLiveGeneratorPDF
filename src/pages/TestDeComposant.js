
import Sidebar from "../Components/newComponents/SideBar";
import SideBarEcranDynamique from "../Components/newComponents/SideBarEcranDynamique";
// Dans TestDeComposant.js
const TestDeComposant = () => {
  return (
    <div className="flex justify-start w-full">
      <Sidebar />
      <SideBarEcranDynamique />
    </div>
  );
};

export default TestDeComposant;
