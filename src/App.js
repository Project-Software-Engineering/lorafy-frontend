import React from 'react';
import { ColorModeContext, useTheme } from './themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';
import PageWrapper from './pages/PageWrapper';
import { BASE_API_URL } from './constants';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
        loader: async ({ request }) => {
          return fetch(`${BASE_API_URL}/end-device`, {
            signal: request.signal,
          });
        },
      },
      {
        path: 'sensors',
        element: <SensorsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 900, // 15 minutes
      staleTime: 900, // 15 minutes
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

function App() {
  const [theme, colorMode] = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <main className="content">
              <RouterProvider router={router} />
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
