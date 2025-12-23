import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import { Toaster } from 'sonner';
import { toasterConfig } from './toast.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
const queryClient = new QueryClient();
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {' '}
      <Toaster {...toasterConfig} />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
