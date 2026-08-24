import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GlobalLoadingOverlay } from './components/ui';
import { AuthProvider } from './context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalLoadingOverlay />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
