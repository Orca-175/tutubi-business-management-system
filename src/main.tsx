/* eslint-disable perfectionist/sort-objects */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.scss';
import './styles/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AdminLogin } from './admin-routes/authentication/AdminLogin';
import { AdminRequired } from './admin-routes/authentication/AdminRequired';
import { AdminHome } from './admin-routes/home/Home';
import { Inventory } from './admin-routes/inventory/Inventory';
import { AdminLayout } from './admin-routes/layout/AdminLayout';
import { Ledger } from './admin-routes/ledger/Ledger';
import { Home } from './client-routes/home/Home';
import { AuthProvider } from './components/AuthProvider';

  const router = createBrowserRouter([
    {
    Component: AuthProvider,
    children: [
      {
        // Admin routes
        Component: AdminRequired,
        children: [
          {
            Component: AdminLayout,
            children: [
              {
                path: '/admin',
                Component: AdminHome,
              },
              {
                path: '/admin/inventory',
                Component: Inventory,
              },
              {
                path: '/admin/ledger',
                Component: Ledger,
              },
            ],
          },
        ],
      },
    ],
  },

  // Client routes
  {
    path: '/',
    Component: Home,
  },

  // Auth routes
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
