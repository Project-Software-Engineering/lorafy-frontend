import React from 'react';
import { ColorModeContext, useTheme } from './themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';
import PageWrapper from './pages/PageWrapper';
import { BASE_API_URL } from './constants';

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
    ],
  },
]);

function App() {
  const [theme, colorMode] = useTheme();

  return (
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
  );
}

export default App;
