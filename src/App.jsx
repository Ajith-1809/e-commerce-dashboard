import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { theme } from './theme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Login from './components/Login';
import { useAuth } from './AuthContext';

const drawerWidth = 260;

function AppContent() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(() => {
    return localStorage.getItem('currentView') || 'Dashboard';
  });

  React.useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, height: '100%', overflow: 'auto', bgcolor: 'transparent' }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        <Container maxWidth={currentView === 'Dashboard' ? false : 'xl'} sx={{ mt: 2, mb: 4 }}>
          {currentView === 'Dashboard' && <Dashboard />}
          {currentView === 'Products' && <Products />}
          {currentView === 'Customers' && <Customers />}
          {currentView === 'Orders' && <Orders />}
          {currentView === 'Analytics' && <Analytics />}
          {currentView === 'Reports' && <Reports />}
          {currentView === 'Settings' && <Settings />}
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
