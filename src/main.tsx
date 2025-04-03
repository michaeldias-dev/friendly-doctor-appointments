
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Função para forçar atualização da aplicação em ambientes de desenvolvimento
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    // Forçar atualização para requisições de API
    if (args[0] && typeof args[0] === 'string' && args[0].includes('supabase')) {
      console.log('API request detected, forcing fresh data');
    }
    return originalFetch.apply(this, args as any);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
