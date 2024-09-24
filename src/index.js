import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PrixProvider } from "./contexts/PrixContext"; // Import du Provider pour les prix
import { DateProvider } from "./contexts/DateContext"; // Import du Provider pour la date
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
        <App />
      </DateProvider>
    </PrixProvider>
  </React.StrictMode>
);

reportWebVitals();
