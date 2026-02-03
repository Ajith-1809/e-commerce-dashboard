import * as React from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../AuthContext';

export default function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth, currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Orders', icon: <ShoppingCartIcon /> },
    { text: 'Products', icon: <BarChartIcon /> }, // existing logic used BarChart for Products? Let's keep it or swap if better. 
    { text: 'Customers', icon: <PeopleIcon /> },
    { text: 'Analytics', icon: <BarChartIcon /> },
    { text: 'Reports', icon: <AssessmentIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', color: 'white', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          <span style={{ color: '#ea580c' }}>SHOP</span>KART
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => setCurrentView(item.text)}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor: currentView === item.text ? alpha('#ea580c', 0.8) : 'transparent',
              '&:hover': { bgcolor: currentView === item.text ? '#c2410c' : 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 3, bgcolor: 'rgba(2, 6, 23, 0.5)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ background: 'linear-gradient(to right, #fb923c, #e11d48)', fontWeight: 'bold' }}>{user?.username?.charAt(0).toUpperCase() || 'A'}</Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white' }}>{user?.username || 'Admin User'}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>Admin</Typography>
            </Box>
          </Box>
          <ListItemButton onClick={logout} sx={{ borderRadius: '50%', minWidth: 0, p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <LogoutIcon sx={{ color: '#94a3b8' }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
        {drawerContent}
      </Drawer>
    </Box>
  );
}