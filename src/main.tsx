import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AdminHome } from './admin-routes/home/Home';
import { Home } from './client-routes/home/Home';

const router = createBrowserRouter([
  // Admin routes
  {
    Component: AdminHome,
    path: '/admin',
  },

  // Client routes
  {
    Component: Home,
    path: '/',
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
