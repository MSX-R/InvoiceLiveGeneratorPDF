import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PrixProvider } from "./contexts/PrixContext";
import { DateProvider } from "./contexts/DateContext";
import { OffresServicesProvider } from "./contexts/OffresServicesContext";
import { ClientsProvider } from "./contexts/ClientsContext"; // Import du ClientProvider
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PrixProvider>
      <DateProvider>
        <OffresServicesProvider>
          <ClientsProvider>
            {" "}
            {/* Provider pour la liste des clients */}
            <App />
          </ClientsProvider>
        </OffresServicesProvider>
      </DateProvider>
    </PrixProvider>
  </React.StrictMode>
);

reportWebVitals();
