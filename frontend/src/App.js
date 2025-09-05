
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupList from './pages/GroupList';
import GroupDetails from './pages/GroupDetails';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Settlements from './pages/Settlements';
import Profile from './pages/Profile';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, useTheme, useMediaQuery, Divider, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
  { label: 'Groups', icon: <GroupsIcon />, view: 'groups' },
  { label: 'Expenses', icon: <ReceiptLongIcon />, view: 'expenses' },
  { label: 'Settlements', icon: <AccountBalanceWalletIcon />, view: 'settlements' },
  { label: 'Profile', icon: <PersonIcon />, view: 'profile' },
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tab, setTab] = useState('login');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Show login/register tabs if not logged in
  if (!token) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8',
      }}>
        <Box sx={{ maxWidth: 400, width: '100%', p: 4 }}>
          <Typography variant="h4" align="center" fontWeight={700} mb={4} color="primary.main">SplitSmart</Typography>
          <Box sx={{ display: 'flex', mb: 3, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <Button fullWidth variant={tab === 'login' ? 'contained' : 'outlined'} onClick={() => setTab('login')} sx={{ cursor: 'pointer' }}>Login</Button>
            <Button fullWidth variant={tab === 'register' ? 'contained' : 'outlined'} onClick={() => setTab('register')} sx={{ cursor: 'pointer' }}>Register</Button>
          </Box>
          <Box sx={{ bgcolor: '#fafbfc', borderRadius: 2, p: 3, boxShadow: 1 }}>
            {tab === 'login' ? (
              <Login onLogin={(t) => { localStorage.setItem('token', t); setToken(t); }} onSwitch={() => setTab('register')} />
            ) : (
              <Register onSwitch={() => setTab('login')} />
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Drawer content
  const drawer = (
    <Box sx={{ width: drawerWidth, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>S</Avatar>
        <Typography variant="h6" fontWeight={700} color="primary.main">SplitSmart</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            selected={view === item.view}
            onClick={() => { setView(item.view); setDrawerOpen(false); }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon sx={{ color: view === item.view ? 'primary.main' : 'inherit', cursor: 'pointer' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ cursor: 'pointer' }} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => { localStorage.removeItem('token'); setToken(null); }} sx={{ cursor: 'pointer' }}>
          <ListItemIcon sx={{ cursor: 'pointer' }}><LogoutIcon color="error" /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} sx={{ cursor: 'pointer' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>SplitSmart</Typography>
          </Toolbar>
        </AppBar>
      )}
      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 0,
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: { md: '0 32px 32px 0' },
            minHeight: '100vh',
          },
          display: { xs: 'block', md: 'block' },
        }}
      >
        {drawer}
      </Drawer>
      {/* Main content */}
      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, mt: isMobile ? 7 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ width: '100%', maxWidth: 1100, minHeight: 500 }}>
          {view === 'dashboard' && <Dashboard token={token} />}
          {view === 'groups' && <GroupList token={token} onOpen={(g) => { setSelectedGroup(g); setView('group'); }} />}
          {view === 'group' && <GroupDetails token={token} group={selectedGroup} onBack={() => setView('groups')} />}
          {view === 'expenses' && <Expenses token={token} />}
          {view === 'settlements' && <Settlements token={token} />}
          {view === 'profile' && <Profile token={token} />}
        </Box>
      </Box>
    </Box>
  );
}
