import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './App.tsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

const helmetContext = {};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — most data (countries, rates) changes slowly
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
      <RouterProvider router={router} />
    </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
