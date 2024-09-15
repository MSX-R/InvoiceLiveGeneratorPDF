import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PrixProvider } from './contexts/PrixContext'; // Import du Provider
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PrixProvider> {/* Entourer le composant App */}
      <App />
    </PrixProvider>
  </React.StrictMode>
);

reportWebVitals();
