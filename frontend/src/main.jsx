import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from './context/UserContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <QueryClientProvider client={queryClient}>
  <Toaster position="top-right" />
  <App />
</QueryClientProvider>
        </LoadingProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
