import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PrixProvider } from "./contexts/PrixContext";
import { DateProvider } from "./contexts/DateContext";
import { OffresServicesProvider } from "./contexts/OffresServicesContext"; // Import du provider OffresServices
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PrixProvider>
      {" "}
      {/* Provider pour les prix */}
      <DateProvider>
        {" "}
        {/* Provider pour la date */}
        <OffresServicesProvider>
          {" "}
          {/* Provider pour les offres et services */}
          <App />
        </OffresServicesProvider>
      </DateProvider>
    </PrixProvider>
  </React.StrictMode>
);

reportWebVitals();
