import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CivicAuthProvider } from "@civic/auth/react";

const CLIENT_ID = import.meta.env.VITE_CIVIC_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* enableWalletLogin lets users connect their wallet after signing in */}
    <CivicAuthProvider
      clientId={CLIENT_ID}
      enableWalletLogin={true}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CivicAuthProvider>
  </StrictMode>
);

